export function requiredMessage(field: string): string {
    return `[${field}] is a required field`;
}

export function stringMessage(field: string): string {
    return `[${field}] must be string`;
}

export function emptyStringMessage(field: string): string {
    return `[${field}] can't be an empty string`;
}

export function arrayMessage(field: string): string {
    return `[${field}] must be an array`;
}

export function emptyArrayMessage(field: string): string {
    return `[${field}] can't be an empty array`;
}

export function intMessage(field: string): string {
    return `[${field}] must be an integer`;
}

export function floatMessage(field: string): string {
    return `[${field}] must be float`;
}

export function dateMessage(field: string): string {
    return `[${field}] must be a date`;
}

export function notCeroMessage(field: string): string {
    return `[${field}] can't be zero`;
}