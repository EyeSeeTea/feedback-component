import React, { useState } from "react";
import {
    Button,
    styled,
    ButtonProps,
    createGenerateClassName,
    StylesProvider,
} from "@material-ui/core";
import { Feedback as FeedbackIcon } from "@material-ui/icons";
import { FeedbackDialog } from "./FeedbackDialog";
import { useBooleanState } from "../hooks/useBoolean";
import { ButtonPosition, FeedbackOptions } from "../domain/entities/Feedback";
import { SubmitDialog } from "./SubmitDialog";
import { getCompositionRoot } from "../CompositionRoot";
import { AppContext } from "../contexts/AppContext";
import theme from "./utils/fakeTheme";
import i18n from "../utils/i18n";

interface FeedbackProps {
    options: FeedbackOptions;
    username: string;
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
        <StylesProvider generateClassName={generateClassName}>
            <AppContext.Provider value={appContext}>
                <Container buttonPosition={options?.layoutOptions?.buttonPosition ?? "bottom-end"}>
                    <div style={style} onClick={openDialog}>
                        {i18n.t("Send feedback")}{" "}
                        <FeedbackIcon style={{ paddingTop: 2, marginLeft: 3 }} fontSize="small" />
                    </div>

                    {showDialog && (
                        <FeedbackDialog
                            open={true}
                            onClose={closeDialog}
                            onSend={onSend}
                            options={options?.layoutOptions}
                            repositories={{ clickUp: options?.repositories.clickUp }}
                        />
                    )}

                    <SubmitDialog
                        open={showSubmitDialog}
                        onClose={closeSubmitDialog}
                        content={contentSubmitDialog}
                    />
                </Container>
            </AppContext.Provider>
        </StylesProvider>
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
            ? 200
            : undefined,
    ...theme.root,
});

// MUI class name styles clashing, use a div for now.
const _StyledButton = styled(
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

const generateClassName = createGenerateClassName({ productionPrefix: "fc" });

const style: React.CSSProperties = {
    padding: "2px 10px 2px 10px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#FFFFFF",
    backgroundColor: "#ff9800",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
};
