---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---
### Retrieve the Azure Storage connection string

Earlier, you created an Azure Storage account for function app's use. The connection string for this account is stored securely in app settings in Azure. By downloading the setting into the *local.settings.json* file, you can use the connection to write to a Storage queue in the same account when running the function locally.

1. From the root of the project, run the following command, replace `<APP_NAME>` with the name of your function app from the previous step. This command overwrites any existing values in the file.

    ```
    func azure functionapp fetch-app-settings <APP_NAME>
    ```

1. Open *local.settings.json* file and locate the value named `AzureWebJobsStorage`, which is the Storage account connection string. You use the name `AzureWebJobsStorage` and the connection string in other sections of this article.

> [!IMPORTANT]
> Because the *local.settings.json* file contains secrets downloaded from Azure, always exclude this file from source control. The *.gitignore* file created with a local functions project excludes the file by default.
