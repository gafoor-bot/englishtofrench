import React, { Component } from "react";
import axios from "axios";

class TranslationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      translatedText: "",
      loading: false,
      error: null,
    };
  }

  query = (data) => {
    const API_URL = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-fr";
    const API_KEY = "Bearer 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"; // Replace with your actual API key

    this.setState({ loading: true, error: null });

    return axios
      .post(API_URL, data, {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.setState({ loading: false });
        return response.data;
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.response?.data?.error || "An error occurred",
        });
        return null;
      });
  };

  handleTranslate = () => {
    const { inputText } = this.state;
    const data = { inputs: inputText };
    this.query(data).then((response) => {
      if (response) {
        this.setState({ translatedText: response[0]?.translation_text || "No translation available" });
      }
    });
  };

  handleInputChange = (event) => {
    this.setState({ inputText: event.target.value });
  };

  render() {
    const { inputText, translatedText, loading, error } = this.state;

    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>English to French Translator</h1>
        <textarea
          placeholder="Enter text to translate..."
          value={inputText}
          onChange={this.handleInputChange}
          rows="4"
          cols="50"
          style={{ width: "100%", padding: "10px" }}
        />
        <button
          onClick={this.handleTranslate}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Translating..." : "Translate"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {translatedText && (
          <div style={{ marginTop: "20px" }}>
            <h3>Translated Text:</h3>
            <p>{translatedText}</p>
          </div>
        )}
      </div>
    );
  }
}

export default TranslationComponent;
