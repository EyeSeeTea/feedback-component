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

function primaryStyles(colorOptions: SimplePaletteColorOptions) {
    return {
        backgroundColor: colorOptions.main,
        color: colorOptions.contrastText,
    };
}

function svgIconStyles(colorOptions: SimplePaletteColorOptions): CSSProperties {
    return {
        fill: colorOptions.main,
    };
}

function onParent(key: string, ...parent: string[]) {
    return parent.join(" ") + " " + key;
}

export function createFakeTheme(theme: ThemeOptions): { root?: CSSRule; presentation?: CSSRule } {
    const { palette } = theme;
    if (!(palette?.primary && isSimplePaletteColorOptions(palette.primary))) return {};
    const primary: CSSProperties = primaryStyles(palette.primary);
    const root: CSSRule = {
        ".MuiButton-containedPrimary": primary,
    };
    const presentation: CSSRule = {
        ".MuiDialogTitle-root": primary,
        ".MuiSvgIcon-colorPrimary": svgIconStyles(palette.primary),
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
