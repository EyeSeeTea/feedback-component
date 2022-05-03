import { Dialog, DialogContent, DialogContentText, styled } from "@material-ui/core";
import React from "react";
import i18n from "../locales";
import { StyledDialogTitle } from "./FeedbackDialog";

interface SubmitDialogProps {
    open: boolean;
    content: string;
    onClose: () => void;
}

export const SubmitDialog: React.FC<SubmitDialogProps> = React.memo(
    ({ open, onClose, content }) => (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <StyledDialogTitle id="form-dialog-title">{i18n.t("Send feedback")}</StyledDialogTitle>
            <StyledDialogContent>
                <DialogContentText>{content}</DialogContentText>
            </StyledDialogContent>
        </Dialog>
    )
);

const StyledDialogContent = styled(DialogContent)({
    padding: "1.625rem 2rem 1rem",
});
