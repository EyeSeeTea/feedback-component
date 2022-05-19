import React, { useState, useCallback, useMemo } from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Link,
    TextField,
    styled,
    Box,
    Tooltip,
    Divider,
} from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import { useBooleanState } from "../hooks/useBoolean";
import { LayoutOptions } from "../domain/entities/Feedback";
import { checkIfBrowserSupported } from "../data/repositories/ScreenshotDefaultRepository";
import { useAppContext } from "../contexts/AppContext";
import theme from "./utils/fakeTheme";
import i18n from "../locales";
import {
    initialUserFeedback,
    initialValidation,
    isValid,
    toUserFeedback,
    UserFeedbackViewModel,
    validate,
    Validation,
} from "./FeedbackViewModel";

interface FeedbackDialogProps {
    open: boolean;
    options?: LayoutOptions;
    repositories: Repositories;
    onClose: () => void;
    onSend: (content: string) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = React.memo(
    ({ open, options, onClose, onSend, repositories }) => {
        const AgreementLabel: React.ReactNode = useMemo(getAgreementLabel, []);
        const { compositionRoot } = useAppContext();
        const { dhis2: _dhis2, clickUp, github: _github } = repositories;
        const [includeScreenshot, { toggle: toggleScreenshot }] = useBooleanState(false);
        const [includeContact, { toggle: toggleContact }] = useBooleanState(false);
        const [acceptAgreement, { toggle: toggleAgreement }] = useBooleanState(false);
        const [validation, setValidation] = useState<Validation>(initialValidation);
        const [userFeedback, setUserFeedback] = useState<UserFeedbackViewModel>(
            initialUserFeedback(options?.descriptionTemplate)
        );

        const onInputChange = React.useCallback(
            (key: keyof UserFeedbackViewModel, value: string) => {
                setUserFeedback(userFeedback => ({
                    ...userFeedback,
                    [key]: value,
                }));
                setValidation(validation => ({ ...validation, [key]: true }));
            },
            []
        );

        const inputsSetters: InputsSetters = React.useMemo(
            () => ({
                title: event => onInputChange("title", event.target.value),
                description: event => onInputChange("description", event.target.value),
                name: event => onInputChange("name", event.target.value),
                email: event => onInputChange("email", event.target.value),
            }),
            [onInputChange]
        );

        const values = React.useMemo(
            () => toUserFeedback(userFeedback, { includeContact }),
            [userFeedback, includeContact]
        );
        const valid = React.useMemo(
            () => isValid(validation, { includeContact }),
            [includeContact, validation]
        );

        const submit = useCallback(() => {
            setValidation(validate(userFeedback, { includeContact }));
            if (valid) {
                const clickup =
                    clickUp &&
                    (checkIfBrowserSupported() && includeScreenshot
                        ? compositionRoot.screenshot
                              .execute({ onCaptureStart: onClose })
                              .flatMap(screenshot =>
                                  compositionRoot.sendToClickUp.execute(values, screenshot).bimap(
                                      reqResult => reqResult,
                                      reqError => reqError.message
                                  )
                              )
                              .bimap(
                                  reqResult => reqResult,
                                  reqError => ({
                                      message: reqError,
                                  })
                              )
                        : compositionRoot.sendToClickUp.execute(values));
                clickup?.run(
                    () => {
                        onClose();
                        onSend(i18n.t("Thank you for your feedback."));
                    },
                    () => {
                        onClose();
                        onSend(
                            i18n.t(
                                "Sadly an error occured while sending your feedback. Please try again."
                            )
                        );
                    }
                );
            }
        }, [
            includeContact,
            userFeedback,
            includeScreenshot,
            compositionRoot.screenshot,
            compositionRoot.sendToClickUp,
            clickUp,
            onClose,
            onSend,
            valid,
            values,
        ]);

        return (
            <ThemedDialog
                open={open}
                onClose={onClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">{i18n.t("Send feedback")}</DialogTitle>
                <DialogContent>
                    <form noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            type="text"
                            label={i18n.t("Title")}
                            value={userFeedback.title}
                            onChange={inputsSetters.title}
                            error={!validation.title}
                            fullWidth
                            required
                        />
                        <TextField
                            margin="normal"
                            name="description"
                            type="text"
                            label={i18n.t("Description")}
                            value={userFeedback.description}
                            onChange={inputsSetters.description}
                            error={!validation.description}
                            minRows={3}
                            fullWidth
                            required
                            multiline
                        />
                        <Wrapper>
                            <Box display="flex" flexDirection="column">
                                <FitControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={includeScreenshot}
                                            onChange={toggleScreenshot}
                                        />
                                    }
                                    label={
                                        options?.screenshotLabel ? (
                                            <ScreenshotLabel text={options?.screenshotLabel} />
                                        ) : (
                                            i18n.t("Include screenshot")
                                        )
                                    }
                                />
                                {options?.showContact && (
                                    <FitControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={includeContact}
                                                onChange={toggleContact}
                                            />
                                        }
                                        label={i18n.t("I would like to be contacted")}
                                    />
                                )}
                            </Box>
                            {options?.showContact && includeContact && (
                                <Box display="flex">
                                    <GrownTextField
                                        margin="dense"
                                        name="name"
                                        type="text"
                                        label={i18n.t("Name")}
                                        value={userFeedback.name}
                                        onChange={inputsSetters.name}
                                        error={!validation.name}
                                        required
                                    />
                                    <GrownTextField
                                        margin="dense"
                                        name="email"
                                        type="text"
                                        label={i18n.t("Email")}
                                        value={userFeedback.email}
                                        onChange={inputsSetters.email}
                                        error={!validation.email}
                                        required
                                    />
                                </Box>
                            )}
                        </Wrapper>
                        <StyledDivider />
                        <Wrapper>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={acceptAgreement}
                                        onChange={toggleAgreement}
                                        required
                                    />
                                }
                                label={AgreementLabel}
                            />
                        </Wrapper>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button
                        type="submit"
                        onClick={submit}
                        color="primary"
                        disabled={!acceptAgreement}
                    >
                        {i18n.t("Send")}
                    </Button>
                </DialogActions>
            </ThemedDialog>
        );
    }
);

type SetInputValue = (event: React.ChangeEvent<HTMLInputElement>) => void;

interface InputsSetters {
    title: SetInputValue;
    description: SetInputValue;
    name: SetInputValue;
    email: SetInputValue;
}

interface ScreenshotLabelProps {
    text: string;
}

interface Repositories {
    dhis2?: object;
    github?: object;
    clickUp?: object;
}

const ppUrls = {
    privacyPolicy: "https://eyeseetea.com/privacy-policy/",
    applicationFeedback: "https://eyeseetea.com/privacy-policy/#Feedback",
};

const ppTexts = {
    beginning: i18n.t("I have read and accept the "),
    privacyPolicy: i18n.t("EyeSeeTea S.L. Privacy Policy"),
    middle: i18n.t(", paying special attention to the "),
    aplicationFeedback: i18n.t("Application Feedback"),
    end: i18n.t(" section."),
};

const ScreenshotLabel: React.FC<ScreenshotLabelProps> = React.memo(({ text }) => (
    <Box display="flex" alignItems="center">
        {i18n.t("Include screenshot")}
        <Tooltip title={text}>
            <HelpOutlineIcon color="primary" />
        </Tooltip>
    </Box>
));

const getAgreementLabel = () => (
    <>
        {ppTexts.beginning}
        <Link href={ppUrls.privacyPolicy} target="_blank">
            {ppTexts.privacyPolicy}
        </Link>
        {ppTexts.middle}
        <Link href={ppUrls.applicationFeedback} target="_blank">
            {ppTexts.aplicationFeedback}
        </Link>
        {ppTexts.end}
    </>
);

const Wrapper = styled("div")({
    marginTop: 16,
    marginBottom: 16,
});

export const ThemedDialog = styled(Dialog)({ ...theme.presentation });

const HelpOutlineIcon = styled(HelpOutline)({
    marginLeft: 4,
    width: "0.875em",
    height: "0.875em",
});

const GrownTextField = styled(TextField)({
    flexGrow: 1,
    "&:not(:last-child)": {
        marginRight: 32,
    },
});

const FitControlLabel = styled(FormControlLabel)({
    width: "fit-content",
});

const StyledDivider = styled(Divider)({
    marginBottom: 20,
});
