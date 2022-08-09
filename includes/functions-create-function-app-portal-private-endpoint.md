[!NOTE] If your Azure Function App has [Private Endpoints](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-vnet) enabled you must add the following origins using [CORS](https://docs.microsoft.com/en-us/azure/azure-functions/security-concepts?#restrict-cors-access).

- https://functions-next.azure.com
- https://functions-staging.azure.com
- https://functions.azure.com
- https://portal.azure.com
