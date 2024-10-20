import { useNavigate } from 'react-router-dom';
import styles from './index.module.css'
import { useMutation } from '@tanstack/react-query'


const IDE = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch('http://localhost:9000/api/create-ide', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ data: formData.get("ide-name") })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onError: (error, variables, context) => {
            console.log(`Error`, error);
        },
        onSuccess: (data, variables, context) => {
            // Now 'data' contains the parsed JSON            
            // redirect to : https://localhost:5173/${data.url};
            if(data.subdomain) navigate(`/ide/${data.subdomain}`);
        },
    })

    const handleSubmit = (e: any) => {
        e.preventDefault()
        mutation.mutate(new FormData(e.target))
    }

    return (
        <div className={styles["container"]}>
            <div className={styles["inner-container"]}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className={styles['label']} htmlFor="">Enter Name of IDE</label>
                        <input className={styles['input']} type="text" name="ide-name" placeholder='eg: anil' />
                    </div>
                    <div className={styles['submit-btn-container']}>
                        <button className={styles['button-85']} type='submit'>Create IDE</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default IDE