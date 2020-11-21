import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
    const errorMap: Record<string, string> = {};
    errors.forEach(({field, message}) => {
        errorMap[field] = message
    })

    return errorMap
}

//transform the error array coming from the graphql
//to an error object that can be accessed by formik