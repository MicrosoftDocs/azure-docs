---
author: pgrandhi
ms.service: azure-communication-services
ms.custom:
ms.topic: include
ms.date: 01/27/2024
ms.author: pgrandhi
---

## Register the Event Grid resource provider

This article describes how to register the Event Grid resource provider. If you used Event Grid before in the same subscription, skip to the next section.

1. Run the following command to register the provider:

    ```azurecli-interactive
    az provider register --namespace Microsoft.EventGrid
    ```
    
2. It might take a moment for the registration to finish. To check the status, run the following command:

    ```azurecli-interactive
    az provider show --namespace Microsoft.EventGrid --query "registrationState"
    ```
    
    When `registrationState` is `Registered`, you're ready to continue.
