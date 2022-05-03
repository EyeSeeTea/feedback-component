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
import { white, indigo500 } from "material-ui/styles/colors";
import { useBooleanState } from "../hooks/useBoolean";
import i18n from "../locales";
import { HelpOutline } from "@material-ui/icons";
import { Fields, LayoutOptions } from "../domain/entities/Feedback";
import { screenshot, checkIfBrowserSupported } from "../data/screenshot";
import { ClickUp } from "../data/clickup";
import { ClickUpOptions } from "../domain/entities/ClickUp";

interface FeedbackDialogProps {
    open: boolean;
    options?: LayoutOptions;
    clickUp?: ClickUpOptions;
    username?: string;
    onClose: () => void;
    onSend: (content: string) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = React.memo(
    ({ open, options, clickUp, onClose, onSend, username }) => {
        const AgreementLabel: React.ReactNode = useMemo(getAgreementLabel, []);
        const [includeScreenshot, { toggle: toggleScreenshot }] = useBooleanState(false);
        const [includeContact, { toggle: toggleContact }] = useBooleanState(false);
        const [acceptAgreement, { toggle: toggleAgreement }] = useBooleanState(false);
        const [inputs, setInputs] = useState<Inputs>({
            title: { value: "", isValid: true },
            description: {
                value: options?.descriptionTemplate ?? "",
                isValid: true,
            },
            name: { value: "", isValid: true },
            email: { value: "", isValid: true },
        });

        const values: Fields = React.useMemo(
            () => ({
                title: inputs.title.value,
                description: inputs.description.value,
                contact: includeContact
                    ? { name: inputs.name.value, email: inputs.email.value }
                    : undefined,
            }),
            [inputs, includeContact]
        );

        const validate = React.useCallback(() => {
            setInputs(inputs => ({
                ...inputs,
                title: { ...inputs.title, isValid: inputs.title.value.length > 0 },
                description: {
                    ...inputs.description,
                    isValid: inputs.description.value.length > 0,
                },
                ...(includeContact && {
                    name: { ...inputs.name, isValid: inputs.name.value.length > 0 },
                    email: {
                        ...inputs.email,
                        isValid:
                            /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
                                inputs.email.value
                            ) && inputs.email.value.length > 0,
                    },
                }),
            }));
        }, [includeContact]);

        const valid = React.useMemo(
            () =>
                !!(
                    (!includeContact && inputs.title.isValid && inputs.description.isValid) ||
                    (includeContact &&
                        inputs.title.isValid &&
                        inputs.description.isValid &&
                        inputs.name.isValid &&
                        inputs.email.isValid)
                ),
            [
                inputs.title.isValid,
                inputs.description.isValid,
                inputs.name.isValid,
                inputs.email.isValid,
                includeContact,
            ]
        );

        const inputsSetters: InputsSetters = React.useMemo(
            () => ({
                title: event =>
                    setInputs(inputs => ({
                        ...inputs,
                        title: { value: event.target.value.trim(), isValid: true },
                    })),
                description: event =>
                    setInputs(inputs => ({
                        ...inputs,
                        description: { value: event.target.value.trim(), isValid: true },
                    })),
                name: event =>
                    setInputs(inputs => ({
                        ...inputs,
                        name: { value: event.target.value.trim(), isValid: true },
                    })),
                email: event =>
                    setInputs(inputs => ({
                        ...inputs,
                        email: { value: event.target.value.trim(), isValid: true },
                    })),
            }),
            []
        );

        const submit = useCallback(() => {
            validate();
            if (valid) {
                const clickup =
                    clickUp &&
                    (checkIfBrowserSupported() && includeScreenshot
                        ? screenshot({ onCaptureStart: onClose })
                              .flatMap(screenshot =>
                                  ClickUp(values, clickUp, {
                                      username: username,
                                      encodedImg: screenshot,
                                  }).bimap(
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
                        : ClickUp(values, clickUp, {
                              username: username,
                          }));
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
        }, [includeScreenshot, clickUp, onClose, username, validate, valid, values, onSend]);

        return (
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth>
                <StyledDialogTitle id="form-dialog-title">
                    {i18n.t("Send feedback")}
                </StyledDialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="title"
                        type="text"
                        label={i18n.t("Title")}
                        value={inputs.title.value}
                        onChange={inputsSetters.title}
                        error={!inputs.title.isValid}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="normal"
                        name="description"
                        type="text"
                        label={i18n.t("Description")}
                        value={inputs.description.value}
                        onChange={inputsSetters.description}
                        error={!inputs.description.isValid}
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
                                    value={inputs.name.value}
                                    onChange={inputsSetters.name}
                                    error={!inputs.name.isValid}
                                    required
                                />
                                <GrownTextField
                                    margin="dense"
                                    name="email"
                                    type="text"
                                    label={i18n.t("Email")}
                                    value={inputs.email.value}
                                    onChange={inputsSetters.email}
                                    error={!inputs.email.isValid}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button onClick={submit} color="primary" disabled={!acceptAgreement}>
                        {i18n.t("Send")}
                    </Button>
                </DialogActions>
            </Dialog>
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

interface Inputs {
    title: {
        value: string;
        isValid?: boolean;
    };
    description: {
        value: string;
        isValid?: boolean;
    };
    name: {
        value: string;
        isValid?: boolean;
    };
    email: {
        value: string;
        isValid?: boolean;
    };
}

interface ScreenshotLabelProps {
    text: string;
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
            <HelpOutlineIcon />
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

export const StyledDialogTitle = styled(DialogTitle)({
    background: indigo500,
    color: white,
});

const Wrapper = styled("div")({
    marginTop: 16,
    marginBottom: 16,
});

const HelpOutlineIcon = styled(HelpOutline)({
    marginLeft: 4,
    fill: indigo500,
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
