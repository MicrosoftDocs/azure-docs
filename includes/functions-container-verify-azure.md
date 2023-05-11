---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/05/2023
ms.author: glenga
---

## Verify your functions on Azure

With the image deployed to your function app in Azure, you can now invoke the function as before through HTTP requests.
In your browser, navigate to the following URL:

<!---add back programming-language-other-->
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`  
::: zone-end  
::: zone pivot="programming-language-csharp"  
`https://<APP_NAME>.azurewebsites.net/api/HttpExample`
:::zone-end  

Replace `<APP_NAME>` with the name of your function app. When you navigate to this URL, the browser must display similar output as when you ran the function locally.