import React, {useEffect, useRef} from 'react';

const width = 280;
const height = 200;
const xUnit = width / (1500) 
const yUnit = height;
let lastX = 0;
let lastY = 0;

const Oscilloscope = ({updateModulationFunction, removeFunction}) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas.getContext) {

            const context = canvas.getContext('2d');
            updateModulationFunction((y, x, frequencyModulation) => {
                if (y === 0) {
                    return [y, frequencyModulation];
                }

                const canvasWorldX = (x * xUnit) % width;
                const canvasWorldY = (height * (3/5)) + (y * yUnit)
                context.fillRect(canvasWorldX, canvasWorldY , 1, 1);

                if (canvasWorldX % (width) === 0) {
                    context.clearRect(0, 0, width, height)
                }

                if (Math.abs(canvasWorldY - lastY) > 5 && canvasWorldX !== 0) {
                    context.beginPath();
                    context.moveTo(lastX, lastY);
                    context.lineTo(canvasWorldX, canvasWorldY);
                    context.stroke();
                }

                lastX = canvasWorldX;
                lastY = canvasWorldY;
            
                return [y, frequencyModulation];
            })
        }
        
        
    }, [canvasRef])
    return (
        <canvas ref={canvasRef} {...{height, width}}>

        </canvas>
    )
}

export default Oscilloscope