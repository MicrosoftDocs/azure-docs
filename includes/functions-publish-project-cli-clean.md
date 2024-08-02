---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/01/2024
ms.author: glenga
---
In your root project folder, run this [`func azure functionapp publish`](../articles/azure-functions/functions-core-tools-reference.md#func-azure-functionapp-publish) command:

```console
func azure functionapp publish <APP_NAME>
```
In this example, replace `<APP_NAME>` with the name of your app. A successful deployment shows results similar to the following output (truncated for simplicity):

<pre>
...

Getting site publishing info...
Creating archive for current directory...
Performing remote build for functions project.

...

Deployment successful.
Remote build succeeded!
Syncing triggers...
Functions in msdocs-azurefunctions-qs:
    HttpExample - [httpTrigger]
        Invoke url: https://msdocs-azurefunctions-qs.azurewebsites.net/api/httpexample
</pre>
