"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Todo = {
  id: number;
  text: string;
};

export default function FunMood() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // FETCH
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todo")
      .select("id, text")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setTodos(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ADD
  const addTodo = async () => {
    if (!text.trim()) return;

    const { error } = await supabase.from("todo").insert({ text });

    if (error) {
      setError(error.message);
    } else {
      setText("");
      showToast("Added successfully ✅");
      fetchTodos();
    }
  };

  // DELETE
  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todo").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      showToast("Deleted successfully 🗑️");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-center">Todo List</h1>

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
        />
        <button
          onClick={addTodo}
          className="px-3 py-2 text-sm rounded-md bg-black text-white"
        >
          Add
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
                  className="text-red-500 text-xs"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
