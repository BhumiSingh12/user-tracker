import { useEffect, useRef, useState } from "react";

function App() {
  const [userId, setUserId] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [browser, setBrowser] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState("");
  const [liveData, setLiveData] = useState({});

  const startTime = useRef(new Date());
  const scrollPos = useRef(0);

  // -------- COOKIE FUNCTIONS --------
  const setCookie = (name, value, days) => {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
  };

  const getCookie = (name) => {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.indexOf(name + "=") === 0) {
        return c.substring(name.length + 1);
      }
    }
    return null;
  };

  // -------- GET DEVICE --------
  const getDeviceType = () => {
    let width = window.innerWidth;
    if (width < 600) return "📱 Mobile";
    else if (width < 900) return "📱 Tablet";
    else return "🖥️ Desktop";
  };

  // -------- GET BROWSER --------
  const getBrowser = () => {
    let ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Unknown";
  };

  // -------- INITIALIZE USER --------
  useEffect(() => {
    let id = getCookie("userId");
    if (!id) {
      id = Math.floor(Math.random() * 1000000).toString();
      setCookie("userId", id, 7);
    }
    setUserId(id);
    setDeviceType(getDeviceType());
    setBrowser(getBrowser());
  }, []);

  // -------- TRACK SCROLL --------
  useEffect(() => {
    const handleScroll = () => {
      scrollPos.current = window.scrollY;
      updateLiveData();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -------- UPDATE LIVE DATA --------
  const updateLiveData = () => {
    setLiveData({
      scroll: scrollPos.current,
      timeSpent: Math.floor((new Date() - startTime.current) / 1000),
      screenSize: window.innerWidth + "x" + window.innerHeight,
    });
  };

  // -------- SEND DATA --------
  const sendData = () => {
    let endTime = new Date();
    let timeSpent = Math.floor((endTime - startTime.current) / 1000);

    const userData = {
      userId: userId,
      timestamp: new Date().toLocaleString(),
      device: deviceType.split(" ")[1],
      screenSize: window.innerWidth + "x" + window.innerHeight,
      browser: browser,
      url: window.location.href,
      scroll: scrollPos.current,
      timeSpent: timeSpent
    };

    console.log("Sending Data:", userData);
    setLoading(true);

    fetch("https://69e7b39068208c1debe9431c.mockapi.io/api/bhumi/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(data => {
        console.log("✓ Data sent successfully!", data);
        setDataStatus("✓ Data sent successfully!");
        setLoading(false);
        setTimeout(() => setDataStatus(""), 3000);
      })
      .catch(err => {
        console.error("✗ Error:", err);
        setDataStatus("✗ Error sending data");
        setLoading(false);
      });
  };

  // -------- TRACK ON PAGE LEAVE --------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendData();
      }
    };

    const handleBeforeUnload = () => {
      sendData();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, deviceType, browser]);

  // Update live data every second
  useEffect(() => {
    const interval = setInterval(updateLiveData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 User Analytics Tracker</h1>
        <p style={styles.subtitle}>Real-time user data collection & insights</p>
      </div>

      <div style={styles.content}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>User ID</div>
            <div style={styles.statValue}>{userId}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Device Type</div>
            <div style={styles.statValue}>{deviceType}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Browser</div>
            <div style={styles.statValue}>{browser}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Screen Size</div>
            <div style={styles.statValue}>{liveData.screenSize || "Loading..."}</div>
          </div>
        </div>

        <div style={styles.detailedSection}>
          <h2 style={styles.sectionTitle}>📈 Live Session Details</h2>
          
          <div style={styles.detailsCard}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>🌐 URL:</span>
              <span style={styles.detailValue}>{window.location.href}</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>📍 Scroll:</span>
              <span style={styles.detailValue}>{liveData.scroll || 0}px</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>⏱️ Time Spent:</span>
              <span style={styles.detailValue}>{liveData.timeSpent || 0}s</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>🕐 Timestamp:</span>
              <span style={styles.detailValue}>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button 
            onClick={sendData}
            style={styles.sendButton}
            disabled={loading}
          >
            {loading ? "Sending..." : "📤 Send Data Now"}
          </button>
        </div>

        {dataStatus && (
          <div style={{
            ...styles.statusMessage,
            backgroundColor: dataStatus.includes("✓") ? "#d4edda" : "#f8d7da",
            color: dataStatus.includes("✓") ? "#155724" : "#721c24",
          }}>
            {dataStatus}
          </div>
        )}

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>ℹ️ How it works</h3>
          <ul style={styles.infoList}>
            <li>✓ Unique User ID (7-day cookie)</li>
            <li>✓ Auto-sends on tab close/leave</li>
            <li>✓ Tracks all session data</li>
            <li>✓ Open F12 to see console logs</li>
          </ul>
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <p>Sending data...</p>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p>📊 Analytics Collector v2.0</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  header: { textAlign: "center", color: "white", marginBottom: "40px", marginTop: "20px" },
  title: { fontSize: "2.5rem", fontWeight: "700", margin: "0 0 10px 0" },
  subtitle: { fontSize: "1.1rem", opacity: 0.95, margin: 0 },
  content: { maxWidth: "1000px", margin: "0 auto" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" },
  statLabel: { fontSize: "0.9rem", color: "#666", fontWeight: "600", marginBottom: "10px" },
  statValue: { fontSize: "1.5rem", fontWeight: "700", color: "#667eea" },
  detailedSection: { marginBottom: "30px" },
  sectionTitle: { color: "white", fontSize: "1.5rem", marginBottom: "15px", fontWeight: "600" },
  detailsCard: { background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  detailRow: { display: "flex", justifyContent: "space-between", paddingBottom: "15px", borderBottom: "1px solid #eee", marginBottom: "15px" },
  detailLabel: { fontWeight: "600", color: "#333" },
  detailValue: { color: "#666" },
  buttonContainer: { textAlign: "center", marginBottom: "20px" },
  sendButton: { background: "white", color: "#667eea", border: "none", padding: "12px 30px", fontSize: "1rem", fontWeight: "600", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  statusMessage: { padding: "15px 20px", borderRadius: "8px", marginBottom: "20px", fontWeight: "600", textAlign: "center" },
  infoBox: { background: "rgba(255,255,255,0.95)", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  infoTitle: { color: "#333", marginTop: 0, marginBottom: "15px", fontSize: "1.2rem", fontWeight: "600" },
  infoList: { margin: 0, paddingLeft: "20px", color: "#555", lineHeight: "1.8" },
  loadingBox: { textAlign: "center", padding: "30px", background: "white", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  spinner: { border: "4px solid #f3f3f3", borderTop: "4px solid #667eea", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 15px" },
  footer: { textAlign: "center", color: "rgba(255,255,255,0.8)", marginTop: "40px" },
};

export default App;
