import { useSearchParams } from 'react-router-dom';

export const getSearchParams = () => {
    const [searchParams] = useSearchParams();

    // Convert URLSearchParams to a plain object
    const paramsObject = Object.fromEntries(searchParams.entries());

    return paramsObject;
};