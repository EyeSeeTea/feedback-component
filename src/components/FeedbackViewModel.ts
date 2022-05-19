import { UserFeedback } from "../domain/entities/Feedback";

export interface UserFeedbackViewModel {
    title: string;
    description: string;
    name: string;
    email: string;
}

export type Validation = Record<keyof UserFeedbackViewModel, boolean>;

export function initialUserFeedback(description?: string): UserFeedbackViewModel {
    return {
        title: "",
        description: description ?? "",
        name: "",
        email: "",
    };
}

export const initialValidation: Validation = {
    title: true,
    description: true,
    name: true,
    email: true,
};

export function toUserFeedback(
    userFeedback: UserFeedbackViewModel,
    options: { includeContact: boolean }
): UserFeedback {
    return {
        title: userFeedback.title.trim(),
        description: userFeedback.description.trim(),
        contact: options.includeContact
            ? { name: userFeedback.name.trim(), email: userFeedback.email.trim() }
            : undefined,
    };
}

export function validate(
    userFeedback: UserFeedbackViewModel,
    options: { includeContact: boolean }
): Validation {
    const { includeContact } = options;
    const { title, description, name, email } = userFeedback;
    return {
        title: title.trim().length > 0,
        description: description.trim().length > 0,
        name: includeContact && name.trim().length > 0,
        email:
            includeContact &&
            /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.trim()) &&
            email.trim().length > 0,
    };
}

export function isValid(validation: Validation, options: { includeContact: boolean }) {
    const { includeContact } = options;
    const { title, description, name, email } = validation;
    return (
        (!includeContact && title && description) ||
        (includeContact && title && description && name && email)
    );
}
