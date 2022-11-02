import { useEffect, useRef, useState } from "react";

export default function useEffectiveState(initialState: any, effects: Function) {
    const prevRef = useRef();
    const [state, setState] = useState(initialState);

    useEffect(() => {
        effects(prevRef.current);
    }, [state, effects]);

    return [state, (newState: any) => {
        setState((prevState: any) => {
            prevRef.current = prevState;
            return newState;
        });
    }];
}