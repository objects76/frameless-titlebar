import React, { useState, useEffect } from "react";
import { withTheme } from "@material-ui/core/styles";
import TitleBar from "frameless-titlebar";
import { useSnackbar } from "notistack";
import icon from "./icons/vscode-256.png";
import Notification from "./components/notification";
import { useMenu } from "./menu";

let elecWindow = null;
if (require("is-electron")()) {
  if (!window.remote) {
    console.assert("remote is nil");
  } else {
    elecWindow = window.remote.getCurrentWindow();
    console.log("mainwindow=", elecWindow);
  }
}

const App = ({ theme, setPalette }) => {
  const [state, setState] = useState({
    platform: "win32",
    menuStyle: "default",
    align: "center",
    subLabels: true,
    showIcon: true,
    showTitle: true,
    showCustom: true,
    maximized: false,
  });

  const currentTheme = {
    menu: {
      palette: theme.palette.type,
      style: state.menuStyle,
      header: {
        show: state.subLabels,
      },
      list: {
        background: theme.palette.background.default,
      },
      item: {
        active: {
          background: theme.palette.secondary.light,
        },
      },
    },
    bar: {
      palette: "dark",
      background: theme.palette.primary.dark,
      borderBottom: "",
      icon: {
        width: 18,
        height: 18,
      },
      button: {
        active: {
          color: theme.palette.type === "dark" ? "#fff" : "#000",
          background: theme.palette.background.default,
        },
      },
      title: {
        align: state.align,
      },
    },
  };

  const togglePalette = () => {
    setPalette(theme.palette.type === "dark" ? "light" : "dark");
  };

  // temp-code: restore feature will be fixed on frameless-titlebar v2.2.
  useEffect(() => {
    if (!elecWindow) return;
    const maximize = () => setState({ maximized: true });
    const unmaximize = () => setState({ maximized: false });
    elecWindow.on("maximize", maximize);
    elecWindow.on("unmaximize", unmaximize);

    return () => {
      elecWindow.removeListener("maximize", maximize);
      elecWindow.removeListener("unmaximize", unmaximize);
    };
  });

  const { enqueueSnackbar } = useSnackbar();
  const defaultMenu = useMenu(enqueueSnackbar);

  return (
    <div
      className="Container"
      style={{ background: theme.palette.background.default }}
    >
      <TitleBar
        iconSrc={icon} // app icon
        elecWindow={elecWindow} // electron window instance
        platform={process.platform} // win32, darwin, linux
        menu={defaultMenu}
        theme={{ ...currentTheme }}
        title="frameless app"
        // onClose={() => elecWindow.close()}
        onClose={() => enqueueSnackbar("close clicked", { variant: "error" })}
        onMinimize={() => elecWindow.minimize()}
        //onMaximize={() => elecWindow.maximize()}
        onMaximize={() => {
          if (!elecWindow) {
            document.body.requestFullscreen();
            return;
          }
          state.maximized ? elecWindow.unmaximize() : elecWindow.maximize();
        }}
        // when the titlebar is double clicked
        onDoubleClick={() => elecWindow.maximize()}
      >
        {
          <Notification
            onNotificationClick={(idx) =>
              enqueueSnackbar(`Notification Item ${idx} Clicked!`, {
                variant: "info",
              })
            }
          />
        }
      </TitleBar>
    </div>
  );
};

export default withTheme(App);
