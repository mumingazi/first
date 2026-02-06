"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Todo = {
  id: number;
  text: string;
};

export default function FunMood() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<number | null>(null);
  const count = useMemo(() => todos.length, [todos]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  }, []);

  const fetchTodos = useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from("todo")
      .select("id, text")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }

    setTodos((data ?? []) as Todo[]);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      await fetchTodos();
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [fetchTodos]);

  const addTodo = useCallback(async () => {
    const value = text.trim();
    if (!value || busy) return;

    setBusy(true);
    setError(null);

    const { error } = await supabase.from("todo").insert({ text: value });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    setText("");
    showToast("Added successfully ✅");
    await fetchTodos();
    setBusy(false);
  }, [text, busy, fetchTodos, showToast]);

  const deleteTodo = useCallback(
    async (id: number) => {
      if (busy) return;

      setBusy(true);
      setError(null);

      const { error } = await supabase.from("todo").delete().eq("id", id);

      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
      showToast("Deleted successfully 🗑️");
      setBusy(false);
    },
    [busy, showToast],
  );

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-gray-200 text-black text-sm px-4 py-2 rounded-md shadow">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-center">Todo List</h1>

      <p className="text-center text-sm text-muted-foreground">
        Total todos: <span className="font-medium">{count}</span>
      </p>

      {/* ADD INPUT */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTodo();
            }
          }}
          placeholder="New todo..."
          className="flex-1 border px-3 py-2 rounded-md text-sm"
          disabled={busy}
        />
        <button
          onClick={addTodo}
          className="px-3 py-2 text-sm rounded-md bg-black text-white disabled:opacity-60"
          disabled={busy || !text.trim()}
        >
          {busy ? "..." : "Add"}
        </button>
      </div>

      {loading && <p className="text-center text-sm">Loading…</p>}
      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {/* LIST */}
      {!loading && (
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-sm text-center text-muted-foreground">
              No todos found
            </li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center border px-3 py-2 rounded-md text-sm"
              >
                <span>► {todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-white text-xs bg-red-400 px-2 py-1 rounded-full font-bold disabled:opacity-60"
                  disabled={busy}
                  aria-label={`Delete todo ${todo.id}`}
                >
                  X
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
