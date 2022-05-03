import React, { useState } from "react";
import { Button, createTheme, ThemeProvider, styled } from "@material-ui/core";
import { Feedback as FeedbackIcon } from "@material-ui/icons";
import { indigo500 } from "material-ui/styles/colors";
import { FeedbackDialog } from "./FeedbackDialog";
import { useBooleanState } from "../hooks/useBoolean";
import { ButtonPosition, FeedbackOptions } from "../domain/entities/Feedback";
import { defaultOptions } from "../domain/entities/DefaultOptions";
import i18n from "../locales";
import { SubmitDialog } from "./SubmitDialog";

interface FeedbackProps {
    options?: FeedbackOptions;
}

export const Feedback: React.FC<FeedbackProps> = React.memo(props => {
    const { options } = props;
    const config = options ?? defaultOptions;
    const [showDialog, { close: closeDialog, open: openDialog }] = useBooleanState(false);
    const [showSDialog, { close: closeSDialog, open: openSDialog }] = useBooleanState(false);
    const [contentSDialog, setContentSDialog] = useState("");

    const onSend = React.useCallback(
        content => {
            openSDialog();
            setContentSDialog(content);
        },
        [openSDialog]
    );

    const theme = createTheme({
        palette: {
            primary: {
                main: indigo500,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container buttonPosition={options?.layoutOptions?.buttonPosition ?? "bottom-start"}>
                <StyledButton
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
                    options={config.layoutOptions ?? {}}
                    clickUp={config.clickUp}
                />
                <SubmitDialog open={showSDialog} onClose={closeSDialog} content={contentSDialog} />
            </Container>
        </ThemeProvider>
    );
});

interface ContainerProps {
    buttonPosition?: ButtonPosition;
}

const Container = styled(
    ({ buttonPosition, ...other }: ContainerProps & Omit<ContainerProps, keyof ContainerProps>) => (
        <div {...other}></div>
    )
)({
    position: "fixed",
    zIndex: 1299,
    top: ({ buttonPosition }: ContainerProps) =>
        buttonPosition?.includes("left") || buttonPosition?.includes("right")
            ? buttonPosition?.includes("start")
                ? 100
                : buttonPosition?.includes("end")
                ? "calc(100vh - 100px)"
                : "calc(50vh - 100px)"
            : "unset",
    bottom: ({ buttonPosition }: ContainerProps) =>
        buttonPosition?.includes("bottom") ? 0 : "unset",
    left: ({ buttonPosition }: ContainerProps) =>
        buttonPosition?.includes("left")
            ? 0
            : buttonPosition?.includes("bottom") && buttonPosition?.includes("start")
            ? 100
            : "unset",
    right: ({ buttonPosition }: ContainerProps) =>
        buttonPosition?.includes("right")
            ? 0
            : buttonPosition?.includes("bottom") && buttonPosition?.includes("end")
            ? 100
            : "unset",
});

const StyledButton = styled(Button)({
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
});
