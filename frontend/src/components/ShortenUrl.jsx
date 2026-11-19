import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "../App.css";

const ShortenUrl = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/shorten", { originalUrl });
      const createdShortUrl = response.data?.data?.shortUrl || "";
      setShortUrl(createdShortUrl);
      toast.success(response.data?.message || "Short URL created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Short URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy short URL");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Create Short URL</h2>

        <div>
          <label>Long URL</label>
          <input
            type="url"
            name="originalUrl"
            placeholder="Enter a long URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {shortUrl && (
          <div>
            <label>Short URL</label>
            <input type="text" value={shortUrl} readOnly />
            <button type="button" onClick={handleCopy}>
              Copy
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShortenUrl;
