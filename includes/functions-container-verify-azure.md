---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/05/2023
ms.author: glenga
---

## Verify your functions on Azure

With the image deployed to your function app in Azure, you can now invoke the function through HTTP requests.

1. Run the following [`az functionapp function show`](/cli/azure/functionapp/function#az-functionapp-function-show) command to get the URL of your new function:

    ```azurecli
    az functionapp function show --resource-group AzureFunctionsContainers-rg --name <APP_NAME> --function-name HttpExample --query invokeUrlTemplate 
    ```
    
    Replace `<APP_NAME>` with the name of your function app. 
<!---add back programming-language-other-->
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
2. Use the URL you just obtained to call the `HttpExample` function endpoint, appending the query string `?name=Functions`.  
::: zone-end  
::: zone pivot="programming-language-csharp"  
2. Use the URL you just obtained to call the `HttpExample` function endpoint.
:::zone-end  

When you navigate to this URL, the browser must display similar output as when you ran the function locally.