---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/25/2020
ms.author: glenga
---
### Retrieve the Azure Storage connection string

Earlier, you created an Azure Storage account for use by the function app. The connection string for this account is stored securely in app settings in Azure. By downloading the setting into the *local.settings.json* file, you can use that connection write to a Storage queue in the same account when running the function locally. 

1. From the root of the project, run the following command, replacing `<app_name>` with the name of your function app from the previous quickstart. This command will overwrite any existing values in the file.

    ```
    func azure functionapp fetch-app-settings <app_name>
    ```
    
1. Open *local.settings.json* and locate the value named `AzureWebJobsStorage`, which is the Storage account connection string. You use the name `AzureWebJobsStorage` and the connection string in other sections of this article.

> [!IMPORTANT]
> Because *local.settings.json* contains secrets downloaded from Azure, always exclude this file from source control. The *.gitignore* file created with a local functions project excludes the file by default.