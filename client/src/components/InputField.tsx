import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    name: string
}
//i want the inputField component to take anyprops that the regular input field would take
//props are all html inputfield props + our 3 defined here

const InputField: React.FC<InputFieldProps> = ({label, size, ...props}) => {
    const [field, {error}] = useField(props) //this hook gives us the value, onchange for each input
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input 
                {...field} 
                {...props}
                id={field.name} 
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}

export default InputField