import { Box } from '@chakra-ui/react'
import React from 'react'


interface WrapperProps {
    variant?: 'small' | 'regular' // ? to make it optional
}

//this is to wrap all of our component children
const Wrapper: React.FC<WrapperProps> = ({ children, variant='regular' }) => {
    return (
        <Box 
            mt={8} 
            mx="auto" 
            maxW={variant === 'regular' ? "800px" : "400px"} 
            w="100%"
        >
            {children}
        </Box>
    )
}

export default Wrapper

//mt => margin-left
//mx => margin-xaxis
//maxW => max-width
//w => width