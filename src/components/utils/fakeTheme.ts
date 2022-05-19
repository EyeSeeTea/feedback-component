import {
    PaletteColorOptions,
    SimplePaletteColorOptions,
} from "@material-ui/core/styles/createPalette";
import { CSSProperties } from "react";
import _ from "lodash";
import { ThemeOptions } from "@material-ui/core";
import { orange500, white } from "material-ui/styles/colors";

export interface CSSRule {
    [k: string]: CSSProperties;
}

function isSimplePaletteColorOptions(
    colorOptions: PaletteColorOptions
): colorOptions is SimplePaletteColorOptions {
    return "main" in colorOptions;
}

function createStyles(colorOptions: SimplePaletteColorOptions) {
    return {
        containedPrimary: {
            backgroundColor: colorOptions.main,
            color: colorOptions.contrastText,
        },
        borderPrimary: { borderColor: colorOptions.main },
        textPrimary: {
            color: colorOptions.main,
        },
        fillPrimary: { fill: colorOptions.main },
    };
}

function onParent(key: string, ...parent: string[]) {
    return parent.join(" ") + " " + key;
}

export function createFakeTheme(theme: ThemeOptions): { root?: CSSRule; presentation?: CSSRule } {
    const { palette } = theme;
    if (!(palette?.primary && isSimplePaletteColorOptions(palette.primary))) return {};
    const styles = createStyles(palette.primary);
    const root: CSSRule = {
        ".MuiButton-containedPrimary": styles.containedPrimary,
        ".MuiTypography-colorPrimary": styles.textPrimary,
    };
    const presentation: CSSRule = {
        ".MuiDialogTitle-root": styles.containedPrimary,
        ".MuiCheckbox-colorPrimary.Mui-checked": styles.textPrimary,
        ".MuiTypography-colorPrimary": styles.textPrimary,
        ".MuiButton-textPrimary:not(.Mui-disabled)": styles.textPrimary,
        ".MuiInput-underline:after": styles.borderPrimary,
        ".MuiSvgIcon-colorPrimary": styles.fillPrimary,
        ".MuiFormLabel-root.Mui-focused": styles.textPrimary,
    };

    return {
        root: Object.fromEntries(
            Object.entries(root).map(([key, value]) => [onParent(key, "&"), value])
        ),
        presentation: Object.fromEntries(
            Object.entries(presentation).map(([key, value]) => [
                onParent(key, '&[role="presentation"]'),
                value,
            ])
        ),
    };
}

export default createFakeTheme({
    palette: {
        primary: {
            main: orange500,
            contrastText: white,
        },
    },
});
