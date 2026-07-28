---
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 11/09/2022
author: v1212
ms.author: wujia
---
1. Switch to the *src* folder of the cloned repository:

    ```bash
    cd my-container-app
    cd src
    ```

1. Create Azure resources and deploy a container app by using the [`az containerapp up` command](../articles/container-apps/containerapp-up.md):

    ```azurecli
    az containerapp up \
      --name my-container-app \
      --source . \
      --ingress external 
    ```

    > [!TIP]
    > If the build fails with a Debian repository error, make sure you're using the latest Azure CLI version and containerapp extension by running `az extension add --name containerapp --upgrade`. Alternatively, add a Dockerfile to your project for more control over the build.

1. In the command output, note the name of the Azure container registry.

1. Get the full resource ID of the container registry:

    ```azurecli
    az acr show --name <ACR_NAME> --query id --output tsv
    ```

    Replace `<ACR_NAME>` with the name of your registry.

1. Enable managed identity for the container app:

    ```azurecli
    az containerapp identity assign \
      --name my-container-app \
      --resource-group my-container-app-rg \
      --system-assigned
    ```

    Note the principal ID of the managed identity in the command output.

1. Assign the `AcrPull` role for the Container Registry to the container app's managed identity:

    ```azurecli
    az role assignment create \
      --assignee <MANAGED_IDENTITY_PRINCIPAL_ID> \
      --role AcrPull \
      --scope <ACR_RESOURCE_ID>
    ```

    Replace `<MANAGED_IDENTITY_PRINCIPAL_ID>` with the principal ID of the managed identity and `<ACR_RESOURCE_ID>` with the resource ID of the Container Registry.

1. Configure the container app to use the managed identity to pull images from the container registry:

    ```azurecli
    az containerapp registry set \
      --name my-container-app \
      --resource-group my-container-app-rg \
      --server <ACR_NAME>.azurecr.io \
      --identity system
    ```

    Replace `<ACR_NAME>` with the name of your Azure container registry.
