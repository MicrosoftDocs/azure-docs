---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/26/2019
ms.author: glenga
---

You've already created a function app in Azure, along with the required Storage account. The connection string for this account is stored securely in app settings in Azure. In this article, you write messages to a Storage queue in the same account. To connect to your Storage account when running the function locally, you must download app settings to the local.settings.json file. 

From the root of the project, run the following Azure Functions Core Tools command to download settings to local.settings.json, replacing `<APP_NAME>` with the name of your function app from the previous article:

```bash
func azure functionapp fetch-app-settings <APP_NAME>
```

You might need to sign in to your Azure account.

> [!IMPORTANT]  
> This command overwrites any existing settings with values from your function app in Azure.  
>
> Because it contains secrets, the local.settings.json file never gets published, and it should be excluded from source control.  
> 

You need the value `AzureWebJobsStorage`, which is the Storage account connection string. You use this connection to verify that the output binding works as expected.
