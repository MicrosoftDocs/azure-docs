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

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other"  
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`  
::: zone-end  
::: zone pivot="programming-language-csharp"  
# [In-process](#tab/in-process) 
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`
# [Isolated process](#tab/isolated-process)
`https://<APP_NAME>.azurewebsites.net/api/HttpExample`

---
:::zone-end  

Replace `<APP_NAME>` with the name of your function app. When you navigate to this URL, the browser must display similar output as when you ran the function locally.