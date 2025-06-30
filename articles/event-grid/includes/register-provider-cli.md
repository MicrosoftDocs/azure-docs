---
 title: include file
 description: include file
 author: spelluru
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 06/23/2025
 ms.author: spelluru
 ms.custom: include file
---

## Enable the Event Grid resource provider

1. If this is the first time you're using Event Grid in your Azure subscription, you might need to register the Event Grid resource provider. Run the following command to register the provider:

    ```azurecli-interactive
    az provider register --namespace Microsoft.EventGrid
    ```
    
1. It might take a moment for the registration to finish. To check the status, run the following command:

    ```azurecli-interactive
    az provider show --namespace Microsoft.EventGrid --query "registrationState"
    ```
    
    When `registrationState` is `Registered`, you're ready to continue.
