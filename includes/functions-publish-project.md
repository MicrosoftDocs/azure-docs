---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/24/2019
ms.author: glenga
ms.custom: include file
---

## Deploy the function app project to Azure

After the function app is created in Azure, you can use the [`func azure functionapp publish`](../articles/azure-functions/functions-run-local.md#project-file-deployment) Core Tools command to deploy your project code to Azure. In the following command, replace `<APP_NAME>` with the name of your app from the previous step.

```bash
func azure functionapp publish <APP_NAME>
```

You will see output similar to the following, which has been truncated for readability.

```output
Getting site publishing info...
...

Preparing archive...
Uploading content...
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
Functions in myfunctionapp:
    HttpTrigger - [httpTrigger]
        Invoke url: https://myfunctionapp.azurewebsites.net/api/httptrigger?code=cCr8sAxfBiow548FBDLS1....
```

Copy the Invoke URL value for your HttpTrigger, which you can now use to test your function in Azure. The URL contains a `code` query string value that is your function key. This key makes it difficult for others to call your HTTP trigger endpoint in Azure.