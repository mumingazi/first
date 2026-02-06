"use client";

import { useEffect, useState } from "react";

interface User {
  picture: {
    large: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  location: {
    country: string;
    city: string;
  };
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("https://randomuser.me/api/", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("API çalışmadı");

      const data = await res.json();
      setUser(data.results[0]);
    } catch (e) {
      setError((e as Error).message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h1>Rastgele İnsan Üretici 🧑‍💻</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {user ? (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 16,
          }}
        >
          <img
            src={user.picture.large}
            alt="user"
            style={{ borderRadius: "50%", marginBottom: 12 }}
          />
          <h2>
            {user.name.first} {user.name.last}
          </h2>
          <p>{user.email}</p>
          <p>
            {user.location.country} / {user.location.city}
          </p>
        </div>
      ) : (
        !loading && <p>Kullanıcı bekleniyor…</p>
      )}

      <button
        onClick={loadUser}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid #ddd",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Yükleniyor..." : "Yeni İnsan Getir"}
      </button>

      <p style={{ marginTop: 12, fontSize: 13, opacity: 0.7 }}></p>
    </div>
  );
}
