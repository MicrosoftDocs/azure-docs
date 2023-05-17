---
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 11/09/2022
ms.author: cshoe
---
1. Change into the *src* folder of the cloned repository.

    ```bash
    cd my-container-app
    cd src
    ```

1. Create Azure resources and deploy a container app with the [`az containerapp up` command](../articles/container-apps/containerapp-up.md).

    ```azurecli
    az containerapp up \
      --name my-container-app \
      --source . \
      --ingress external 
    ```

1. In the command output, note the name of the Azure Container Registry.

1. Get the full resource ID of the container registry.

    ```azurecli
    az acr show --name <ACR_NAME> --query id --output tsv
    ```

    Replace `<ACR_NAME>` with the name of your registry.

1. Enable managed identity for the container app.

    ```azurecli
    az containerapp identity assign \
      --name my-container-app \
      --resource-group my-container-app-rg \
      --system-assigned \
      --output tsv
    ```

    Note the principal ID of the managed identity in the command output.

1. Assign the `AcrPull` role for the Azure Container Registry to the container app's managed identity.

    ```azurecli
    az role assignment create \
      --assignee <MANAGED_IDENTITY_PRINCIPAL_ID> \
      --role AcrPull \
      --scope <ACR_RESOURCE_ID>
    ```

    Replace `<MANAGED_IDENTITY_PRINCIPAL_ID>` with the principal ID of the managed identity and `<ACR_RESOURCE_ID>` with the resource ID of the Azure Container Registry.

1. Configure the container app to use the managed identity to pull images from the Azure Container Registry.

    ```azurecli
    az containerapp registry set \
      --name my-container-app \
      --resource-group my-container-app-rg \
      --server <ACR_NAME>.azurecr.io \
      --identity system
    ```

    Replace `<ACR_NAME>` with the name of your Azure Container Registry.
