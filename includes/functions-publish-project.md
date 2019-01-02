---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/27/2018
ms.author: glenga
ms.custom: include file
---

## Deploy the function app project to Azure

After the function app is created in Azure, you can use the [`func azure functionapp publish`](../articles/azure-functions/functions-run-local.md#project-file-deployment) command to deploy your project code to Azure.

```bash
func azure functionapp publish <FunctionAppName>
```

You see something like the following output, which has been truncated for readability.

```output
Getting site publishing info...

...

Preparing archive...
Uploading content...
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
```

You can now test your functions in Azure.