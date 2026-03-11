import { useNavigate } from 'react-router-dom';

// Function to update multiple search params at once
export const useUpdateSearchParams = () => {
    const navigate = useNavigate();
    const updateSearchParams = (paramsObject: any) => {
        const searchParams = new URLSearchParams(location.search);

        // Update or delete each parameter based on the provided object
        Object.entries(paramsObject).forEach(([key, value]) => {
            if (value) {
                searchParams.set(key, value.toString());
            } else {
                searchParams.delete(key);
            }
        });

        // Navigate with the updated search params
        navigate(
            {
                pathname: location.pathname,
                search: searchParams.toString(),
            },
            { replace: true },
        );
    };

    return updateSearchParams;
};