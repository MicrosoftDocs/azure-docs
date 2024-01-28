---
author: pgrandhi
ms.service: azure-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 01/27/2024
ms.author: pgrandhi
---

## Enable the Event Grid resource provider

1. If you haven't previously used Event Grid in your Azure subscription, you might need to register the Event Grid resource provider. Run the following command to register the provider:

    ```azurecli-interactive
    az provider register --namespace Microsoft.EventGrid
    ```
    
2. It might take a moment for the registration to finish. To check the status, run the following command:

    ```azurecli-interactive
    az provider show --namespace Microsoft.EventGrid --query "registrationState"
    ```
    
    When `registrationState` is `Registered`, you're ready to continue.
