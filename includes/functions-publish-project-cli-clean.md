---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 11/24/2025
ms.author: glenga
---
1. In your root project folder, run this [`func azure functionapp publish`](../articles/azure-functions/functions-core-tools-reference.md#func-azure-functionapp-publish) command:

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

1. In your local terminal or command prompt, run this command to get the URL endpoint value, including the access key:

    ```
    func azure functionapp list-functions <APP_NAME> --show-keys
    ```
    
    In this example, again replace `<APP_NAME>` with the name of your app.

1. Copy the returned endpoint URL and key, which you use to invoke the function endpoint. 