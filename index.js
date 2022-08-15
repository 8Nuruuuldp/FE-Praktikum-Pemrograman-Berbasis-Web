const { createApp, ref, onMounted} =  Vue;

const app = createApp ({
    setup () {

        const url = "http://localhost:8888/snack";


        const snack = ref ({
            id: null,
            name: "",
            company: "",
            year: "",
            list: [],
            errorMessage: "",
            isError: false,
            isUpdate: false,
            
        });

        const getSnack = async () => {
            try {
                snack.value.isUpdate = false;
                const resSnack = await axios.get(url);
                if (resSnack.data.length === 0)
                    throw new Error("Snack not found");
                snack.value.list = resSnack.data;
            } catch (err) {
                snack.value.isError = true;
                snack.value.errorMessage = err.message;
                snack.value.isUpdate = false;
            }
        };

        const getSnackById = async (id) => {
            try {
                const resSnack = await axios.get(url + `/${id}`);
                if (resSnack.data.length === 0)
                    throw new Error ("Snack not found");
                snack.value.isUpdate = true;
                snack.value.id = id;
                snack.value.name = resSnack.data.name;
                snack.value.company = resSnack.data.company;
                snack.value.year = resSnack.data.year;
                return resSnack.data;
            } catch (err) {
                snack.value.name = "";
                snack.value.company = "";
                snack.value.year = "";
                snack.value.isUpdate = false;
                snack.value.isError = true;
                snack.value.errorMessage = err.message;
            }
        };

        const deleteSnack = async (id) => {
            try {
                snack.value.isUpdate = false;
                const resSnack = await axios.delete(url + "/delete", {
                    data: {
                        id,
                    },
                });
                if (resSnack.data.length === 0)
                    throw new Error("Snack not Found");
                snack.value.list = resSnack.data;
                await getSnack();
                return resSnack.data;
            } catch (err) {
                snack.value.isError = true;
                snack.value.errorMessage = err.message;
            }
        };

        const submitSnack = async () => {
            try {
                snack.value.isUpdate = false;
                const post = await axios.post(url + "/create", {
                    name: snack.value.name,
                    company: snack.value.company,
                    year: snack.value.year,
                });
                snack.value.isError = false;
                snack.value.name = "";
                snack.value.company = "";
                snack.value.year = "";
                snack.value.isUpdate = false;
                if (!post) throw new Error ("Failed Add");
                await getSnack();
            } catch (err) {
                snack.value.isError = true;
                snack.value.errorMessage = err.message;
            }
        };

        const updateSnack = async () => {
            try {
                snack.value.isUpdate = true;
                const put = await axios.put(url + "/update", {
                    id: snack.value.id,
                    name: snack.value.name,
                    company: snack.value.company,
                    year: snack.value.year,
                });
                snack.value.isError = false;
                snack.value.name = "";
                snack.value.company = "";
                snack.value.year = "";
                snack.value.isUpdate = false;
                snack.value.isError = true;
                if (!put) throw new Error ("Failed");
                await getSnack();
            } catch (err) {
                snack.value.isUpdate = false;
                snack.value.isError = true;
                snack.value.errorMessage = err.message;
            }
        };

        onMounted (async () => {
            await getSnack();
        });

        return {
            snack,
            getSnackById,
            submitSnack,
            updateSnack,
            deleteSnack,
        };
    },
});

app.mount("#app");