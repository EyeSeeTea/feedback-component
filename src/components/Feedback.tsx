import React, { useState } from "react";
import { Button, createTheme, ThemeProvider, styled, ButtonProps } from "@material-ui/core";
import { Feedback as FeedbackIcon } from "@material-ui/icons";
import { indigo500 } from "material-ui/styles/colors";
import { FeedbackDialog } from "./FeedbackDialog";
import { useBooleanState } from "../hooks/useBoolean";
import { ButtonPosition, FeedbackOptions } from "../domain/entities/Feedback";
import { SubmitDialog } from "./SubmitDialog";
import i18n from "../locales";
import { getCompositionRoot } from "../CompositionRoot";
import { AppContext } from "../contexts/AppContext";

interface FeedbackProps {
    options: FeedbackOptions;
    username?: string;
}

export const Feedback: React.FC<FeedbackProps> = React.memo(({ options, username }) => {
    const [showDialog, { close: closeDialog, open: openDialog }] = useBooleanState(false);
    const [contentSubmitDialog, setContentSubmitDialog] = useState("");
    const [showSubmitDialog, { close: closeSubmitDialog, open: openSubmitDialog }] =
        useBooleanState(false);
    const appContext = { compositionRoot: getCompositionRoot(options, username) };

    const onSend = React.useCallback(
        content => {
            openSubmitDialog();
            setContentSubmitDialog(content);
        },
        [openSubmitDialog]
    );

    return (
        <AppContext.Provider value={appContext}>
            <ThemeProvider theme={theme}>
                <Container buttonPosition={options?.layoutOptions?.buttonPosition ?? "bottom-end"}>
                    <StyledButton
                        buttonPosition={options?.layoutOptions?.buttonPosition ?? "bottom-end"}
                        variant="contained"
                        color="primary"
                        endIcon={<FeedbackIcon />}
                        onClick={openDialog}
                        disableElevation
                    >
                        {i18n.t("Send feedback")}
                    </StyledButton>
                    <FeedbackDialog
                        open={showDialog}
                        onClose={closeDialog}
                        onSend={onSend}
                        options={options?.layoutOptions}
                        clickUp={options?.repositories.clickUp}
                    />
                    <SubmitDialog
                        open={showSubmitDialog}
                        onClose={closeSubmitDialog}
                        content={contentSubmitDialog}
                    />
                </Container>
            </ThemeProvider>
        </AppContext.Provider>
    );
});

interface ContainerProps {
    buttonPosition: ButtonPosition;
}

const Container = styled(({ buttonPosition: _buttonPosition, ...other }: ContainerProps) => (
    <div {...other}></div>
))({
    position: "fixed",
    zIndex: 1299,
    top: ({ buttonPosition: btnPos }: ContainerProps) =>
        (btnPos.includes("left") || btnPos.includes("right")) && !btnPos.includes("end")
            ? btnPos.includes("start")
                ? 200
                : "50vh"
            : undefined,
    bottom: ({ buttonPosition: btnPos }: ContainerProps) => (btnPos.includes("bottom") ? 0 : 125),
    left: ({ buttonPosition: btnPos }: ContainerProps) =>
        btnPos.includes("left")
            ? -67
            : btnPos.includes("bottom") && btnPos.includes("start")
            ? 100
            : undefined,
    right: ({ buttonPosition: btnPos }: ContainerProps) =>
        btnPos.includes("right")
            ? -67
            : btnPos.includes("bottom") && btnPos.includes("end")
            ? 100
            : undefined,
});

const StyledButton = styled(
    ({ buttonPosition: _buttonPosition, ...other }: ContainerProps & ButtonProps) => (
        <Button {...other}></Button>
    )
)({
    transform: ({ buttonPosition: btnPos }: ContainerProps) =>
        btnPos.includes("left")
            ? "rotate(90deg)"
            : btnPos.includes("right")
            ? "rotate(-90deg)"
            : undefined,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
});

const theme = createTheme({
    palette: {
        primary: {
            main: indigo500,
        },
    },
});
