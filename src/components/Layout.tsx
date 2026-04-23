import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = window.location.pathname;

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Layout: Checking token on load");
    console.log("Layout: Token in localStorage:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
    if (!token) {
      console.log("Layout: No token found, redirecting to login");
      navigate("/login");
      return;
    }

    // Vérifier si le token est valide
    const validateToken = async () => {
      console.log("Layout: Validating token with /auth/me");
      try {
        const response = await authAPI.me();
        console.log("Layout: Token validation successful:", response);
      } catch (error: any) {
        console.error("Layout: Token invalide:", error);
        console.error("Layout: Token validation response:", error?.response?.status, error?.response?.data);
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate]);

  // Récupérer le rôle de l'utilisateur depuis le localStorage
  const userRole = localStorage.getItem("user_role");
  const isAdmin = userRole === "admin";

  const mainMenuItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: "fa-home" },
    { path: "/applications", label: "Applications", icon: "fa-mobile-alt" },
    { path: "/comptes", label: "Comptes", icon: "fa-user" },
    { path: "/tests", label: "Tests", icon: "fa-check-square" },
    { path: "/todos", label: "Tâches", icon: "fa-tasks" },
    { path: "/reports", label: "Rapports", icon: "fa-chart-bar" },
    ...(isAdmin
      ? [{ path: "/users", label: "Utilisateurs", icon: "fa-users" }]
      : []),
    { path: "/profile", label: "Mon Profil", icon: "fa-user-circle" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle('menu-open', !mobileMenuOpen);
  };

  const handleNavClick = (itemPath: string) => {
    navigate(itemPath);
    setMobileMenuOpen(false);
  };

  return (
    <div style={styles.container}>
      {/* Mobile Menu Toggle */}
      <button
        style={{
          ...styles.mobileMenuToggle,
          ...(mobileMenuOpen ? styles.mobileMenuHidden : {})
        }}
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}
        style={{
          ...styles.sidebar,
          ...(mobileMenuOpen ? styles.sidebarMobileOpen : {}),
        }}
      >
        <div style={styles.logo}>
          <h2>
            <i className="fas fa-shield-alt"></i> IT Access
          </h2>
          <p>Manager</p>
        </div>

        <nav style={styles.nav}>
          {mainMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              style={{
                ...styles.navItem,
                ...(currentPath === item.path ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>
                <i className={`fas ${item.icon}`}></i>
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          style={styles.mobileOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div style={styles.mainWrapper} className="main-wrapper">
       {/* Header */}
       <header 
         style={styles.header}
         onClick={() => {
           // Toggle mobile menu when clicking header on mobile
           if (window.innerWidth <= 768) {
             toggleMobileMenu();
           }
         }}
       >
         <div style={styles.headerTitle}>
           <h1>Gestion des Accès IT</h1>
         </div>
         <div style={styles.headerActions}>
           <button
             onClick={() => handleNavClick('/notifications')}
             style={styles.notifBellButton}
             title="Notifications"
           >
             <i className="fas fa-bell"></i>
           </button>
           <button
             onClick={handleLogout}
             style={styles.logoutIconButton}
             title="Se déconnecter"
           >
             <i className="fas fa-sign-out-alt"></i>
           </button>
           <span style={styles.userBadge}>
             <i
               className={`fas ${isAdmin ? "fa-user-shield" : "fa-user"}`}
             ></i>
             {isAdmin ? "Admin" : "Utilisateur"}
           </span>
         </div>
       </header>

        {/* Content */}
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "var(--bg-primary)",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "var(--bg-card)",
    borderRight: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column" as const,
    position: "fixed" as const,
    height: "100vh",
    boxShadow: "2px 0 8px var(--shadow-color)",
  },
  logo: {
    padding: "24px 20px",
    borderBottom: "1px solid var(--border-light)",
    background: "linear-gradient(135deg, var(--info-color), #5b7fd3)",
    color: "white",
  },
  logoTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },
  nav: {
    flex: 1,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left" as const,
    transition: "all 0.2s ease",
    width: "100%",
  },
  navItemActive: {
    backgroundColor: "var(--info-color)",
    color: "white",
    boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)",
  },
  navIcon: {
    fontSize: "16px",
    width: "20px",
    textAlign: "center" as const,
  },
  sidebarFooter: {
    padding: "16px",
    borderTop: "1px solid var(--border-light)",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "var(--danger-color)",
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  mainWrapper: {
    flex: 1,
    marginLeft: "260px",
    display: "flex",
    flexDirection: "column" as const,
    transition: "margin-left 0.3s ease",
  },
  header: {
    height: "70px",
    backgroundColor: "var(--bg-card)",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    boxShadow: "0 2px 8px var(--shadow-color)",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
  headerTitleText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  notifBellButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "var(--hover-bg)",
    color: "var(--text-secondary)",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  logoutIconButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "var(--danger-color)",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  userBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    backgroundColor: "var(--info-color)",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto" as const,
    backgroundColor: "var(--bg-primary)",
    minHeight: "100vh",
  },
  mobileMenuToggle: {
    display: "none",
    position: "fixed" as const,
    top: "8px",
    left: "8px",
    zIndex: 1001,
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-primary)",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 2px 8px var(--shadow-color)",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileMenuHidden: {
    opacity: 0,
    pointerEvents: "none",
  },
  mobileOverlay: {
    display: "none",
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 199,
  },
  sidebarMobileOpen: {
    transform: "translateX(0)",
  },
};

// Responsive styles via CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@media (max-width: 768px) {
  /* Reset body and html for mobile scrolling */
  html, body {
    height: auto !important;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  /* Container takes full height */
  .container {
    min-height: 100vh !important;
    height: auto !important;
  }
  
  /* Sidebar hidden by default on mobile */
  aside {
    position: fixed !important;
    left: -280px !important;
    width: 260px !important;
    height: 100vh !important;
    z-index: 1000 !important;
    transition: left 0.3s ease !important;
    top: 0;
  }
  
  /* Sidebar shown when mobile menu is open */
  aside.sidebar-mobile-open,
  aside[style*="left: 0"],
  aside.sidebar-open {
    left: 0 !important;
  }
  
  /* Make sidebar nav scrollable */
  aside nav {
    overflow-y: auto !important;
    flex: 1 !important;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Main wrapper settings for mobile */
  .main-wrapper {
    margin-left: 0 !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    min-height: calc(100vh - 60px) !important;
  }
  
  /* Header sticky on top */
       header {
         padding: 0 15px 0 60px !important;
         height: 60px !important;
         position: sticky !important;
         top: 0;
         z-index: 100;
         flex-shrink: 0;
         cursor: pointer !important;
       }
  
  header h1 {
    font-size: 14px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Show header actions on mobile */
  .headerActions {
    display: flex !important;
    gap: 8px !important;
  }
  
  /* Smaller badge on mobile */
  .userBadge {
    padding: 4px 8px !important;
    font-size: 10px !important;
  }
  
  /* Smaller buttons on mobile */
  .notifBellButton,
  .logoutIconButton {
    width: 32px !important;
    height: 32px !important;
    font-size: 14px !important;
  }
  
  /* Main content - scrollable on mobile */
  main {
    padding: 15px !important;
    flex: 1 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    min-height: calc(100vh - 60px) !important;
    height: auto !important;
  }
  
  /* Page container scrollable */
  .container > div > main,
  [class*="main"] {
    min-height: calc(100vh - 60px) !important;
  }
  
  /* Show hamburger menu button */
  button[aria-label*="menu"] {
    display: flex !important;
  }
  
  /* Mobile overlay */
  .mobile-overlay {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    z-index: 999 !important;
  }
}

/* Tablet specific fixes */
@media (min-width: 481px) and (max-width: 768px) {
  .main-wrapper {
    margin-left: 0 !important;
  }

  header h1 {
    font-size: 18px !important;
  }
}

/* Login page mobile */
@media (max-width: 480px) {
  .login-card {
    padding: 24px 16px !important;
    margin: 16px !important;
    border-radius: 12px !important;
  }
  
  .login-title {
    font-size: 24px !important;
  }
}

/* Prevent body scroll when mobile menu is open */
body.menu-open {
  overflow: hidden;
}
`;
document.head.appendChild(styleSheet);

export default Layout;
