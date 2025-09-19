import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Alert,
  LinearProgress,
  Button,
  CircularProgress,
} from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

const HERO_BG =
  "https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function App() {
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#6a11cb" },
      secondary: { main: "#2575fc" },
      background: {
        default: darkMode ? "#0d0d0d" : "#fafafa",
        paper: darkMode ? "#181818" : "#fff",
      },
    },
    typography: { fontFamily: "Inter, sans-serif" },
  });

  const analyzeNews = async () => {
    if (!news.trim() && !title.trim()) {
      setResult({ error: "Please enter news text or title to analyze." });
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      console.log("Sending request:", { text: news, title });
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: news, title }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ isFake: data.isFake, confidence: data.confidence });
      } else {
        setResult({ error: data.error || `Server Error (${response.status})` });
      }
    } catch (error) {
      setResult({ error: "Unable to connect to the backend. Check Flask server & API_URL." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* HEADER */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #116ecbff, #57fc25ff)",
          boxShadow: "0px 2px 12px rgba(0,0,0,0.25)",
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Fake News Detector
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((d) => !d)}
                color="default"
              />
            }
            label={darkMode ? <DarkMode /> : <LightMode />}
          />
        </Toolbar>
      </AppBar>

      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <Box sx={{ zIndex: 2, maxWidth: "650px", px: 2 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, mb: 2, textShadow: "2px 2px 10px rgba(0,0,0,0.7)" }}
          >
            Fake News Detector
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, mb: 3, color: "rgba(255,255,255,0.85)" }}>
            Stop misinformation 🚫 — Verify news instantly with AI-powered detection.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(90deg, #116ecbff, #57fc25ff)",
              borderRadius: "50px",
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              "&:hover": { transform: "scale(1.05)" },
              transition: "0.3s",
            }}
            onClick={() =>
              document.getElementById("input-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Analyze News
          </Button>
        </Box>
      </Box>

      {/* MAIN SECTION */}
      <Box sx={{ position: "relative", backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center", "&::before": { content: '""', position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(10px)", zIndex: 0 } }}>
        <Container sx={{ position: "relative", zIndex: 1, py: 6 }}>
          {/* INPUT SECTION */}
          <Box id="input-section">
            <Card elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              {result?.error && <Alert severity="warning" sx={{ mb: 2 }}>{result.error}</Alert>}

              <TextField label="News Title (Optional)" placeholder="Enter news title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2, background: "rgba(255,255,255,0.8)", borderRadius: 1 }} />

              <TextField label="Paste news text here..." placeholder="Enter news content to check" multiline minRows={4} fullWidth value={news} onChange={(e) => setNews(e.target.value)} sx={{ mb: 2, background: "rgba(255,255,255,0.8)", borderRadius: 1 }} />

              {/* ANALYZE BUTTON */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={analyzeNews}
                disabled={loading || (!news.trim() && !title.trim())}
                sx={{ background: "linear-gradient(90deg, #116ecbff, #57fc25ff)", fontWeight: 600, borderRadius: 3, "&:hover": { transform: "scale(1.02)" }, transition: "0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze"}
              </Button>

              {loading && <LinearProgress sx={{ mt: 2 }} />}
            </Card>
          </Box>

          {/* RESULT */}
          {result && !result.error && (
            <Card sx={{ mt: 4, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", color: "#000" }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700}>{result.isFake ? "Fake News ❌" : "Real News ✅"}</Typography>
                <Alert severity={result.isFake ? "error" : "success"} sx={{ mt: 2, bgcolor: "transparent", fontWeight: 600 }}>
                  Confidence: <strong>{result.confidence}%</strong>
                </Alert>
                <LinearProgress variant="determinate" value={result.confidence} sx={{ height: 10, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.3)", "& .MuiLinearProgress-bar": { borderRadius: 8 }, mt: 2 }} />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setResult(null)}>Clear Result</Button>
              </CardActions>
            </Card>
          )}
        </Container>
      </Box>

      {/* FOOTER */}
      <Box component="footer" sx={{ py: 4, background: "linear-gradient(90deg, #116ecbff, #57fc25ff)", textAlign: "center", color: "#120e0eff", fontWeight: 500, boxShadow: "0px -2px 10px rgba(0,0,0,0.2)" }}>
        © {new Date().getFullYear()} Fake News Detector. All rights reserved.
      </Box>
    </ThemeProvider>
  );
}

export default App;
