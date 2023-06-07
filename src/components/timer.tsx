import { useState, useEffect } from "react"
import "./timer.css"

// recibe como parametro un booleano

const Timer = ({ solveSelected, generateSelected}: { solveSelected: boolean, generateSelected:boolean },) => {
    const [time, setTime] = useState(0);


   // Cambia el estado de time cada segundo hasta que solveSelected sea false, 
   // cuando generateSelected sea true, se reinicia el tiempo
    useEffect(() => {
        if (solveSelected) {
            const idInterval = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
            return () => clearInterval(idInterval);
        } else if (generateSelected) {
            setTime(0);
        }
    }, [solveSelected, generateSelected]);
    

    // Formatea el tiempo en minutos y segundos
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    return (
        <div id="timer">
            <p>{formatTime(time)}</p>
            <p id="texto">Tiempo transcurrido</p>
        </div>
    )


}

export default Timer