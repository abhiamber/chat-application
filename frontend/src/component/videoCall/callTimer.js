import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const CallTime = () => {
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            setElapsedTime(elapsedSeconds);
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    return (
        <Box display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            textAlign="center">
            <Text fontSize={'20px'} fontWeight={600}
            >
                {formatTime(elapsedTime)}
            </Text>
        </Box>
    );
};

export default CallTime;
