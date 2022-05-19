import React from "react";
import { DialogContent, DialogContentText, DialogTitle, styled } from "@material-ui/core";
import { ThemedDialog } from "./FeedbackDialog";
import i18n from "../locales";

interface SubmitDialogProps {
    open: boolean;
    content: string;
    onClose: () => void;
}

export const SubmitDialog: React.FC<SubmitDialogProps> = React.memo(
    ({ open, onClose, content }) => (
        <ThemedDialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{i18n.t("Send feedback")}</DialogTitle>
            <StyledDialogContent>
                <DialogContentText>{content}</DialogContentText>
            </StyledDialogContent>
        </ThemedDialog>
    )
);

const StyledDialogContent = styled(DialogContent)({
    padding: "1.625rem 2rem 1rem",
});
