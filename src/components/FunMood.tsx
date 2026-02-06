"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Todo = {
  id: number;
  text: string; // assumes column name is `text`
};

export default function FunMood() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("todo")
          .select("id, text")
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }

        setTodos(data ?? []);
      } catch (err) {
        const e = err as Error;
        setError(e.message ?? "Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    void fetchTodos();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Todo List</h1>

      {loading && (
        <p className="text-center text-sm text-muted-foreground">Loading…</p>
      )}
      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-sm text-muted-foreground text-center">
              No todos found.
            </li>
          ) : (
            todos.map((todo) => (
              <div key={todo.id}>
                <li
                  key={todo.id}
                  className="rounded-md border px-3 py-2 text-sm bg-card"
                >
                  ► {todo.text}
                </li>
              </div>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
