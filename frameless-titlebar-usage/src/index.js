import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { changePalette } from "./react/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";

import "./index.css";
import App from "./react/App";

const Root = () => {
  const [paletteType, setPaletteType] = useState("dark");
  const [theme, setTheme] = useState(changePalette(paletteType));

  useEffect(() => {
    setTheme(changePalette(paletteType)); // on mount
  }, [paletteType]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <App setPalette={setPaletteType} />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
