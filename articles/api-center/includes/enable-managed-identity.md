---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 10/18/2024
ms.author: danlep
ms.custom: Include file
---

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access APIs in your API Management instance. Depending on your needs, configure either a system-assigned or one or more user-assigned managed identities. 

The following examples show how to configure a system-assigned managed identity by using the Azure portal or the Azure CLI. At a high level, configuration steps are similar for a user-assigned managed identity. 

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Security**, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

#### [Azure CLI](#tab/cli)

Set the system-assigned identity in your API center using the following [az apic update](/cli/azure/apic#az-apic-update) command. Substitute the names of your API center and resource group:

```azurecli 
az apic update --name <api-center-name> --resource-group <resource-group-name> --identity '{"type": "SystemAssigned"}'
```
---

### Assign the managed identity the API Management Service Reader role

To allow import of APIs, assign your API center's managed identity the **API Management Service Reader** role in your API Management instance. You can use the [portal](../role-based-access-control/role-assignments-portal-managed-identity.yml) or the Azure CLI.

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API Management instance.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab - Select **API Management Service Reader**.
    1. On the **Members** tab, in **Assign access to** - Select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page - Select the system-assigned managed identity of your API center that you added in the previous section. Click **Select**.
    1. Select **Review + assign**.

#### [Azure CLI](#tab/cli)

1. Get the principal ID of the identity. For a system-assigned identity, use the [az apic show](/cli/azure/apic#az-apic-show) command. 

    ```azurecli
    #! /bin/bash
    apicObjID=$(az apic show --name <api-center-name> \
        --resource-group <resource-group-name> \
        --query "identity.principalId" --output tsv)
    ```

    ```azurecli
    # Formatted for PowerShell
    $apicObjID=$(az apic show --name <api-center-name> `
        --resource-group <resource-group-name> `
        --query "identity.principalId" --output tsv)
    ```

1. Get the resource ID of your API Management instance using the [az apim show](/cli/azure/apim#az-apim-show) command.
 
    ```azurecli
    #! /bin/bash
    apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query "id" --output tsv)
    ```

    ```azurecli
    # Formatted for PowerShell
    $apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query "id" --output tsv)
    ```

1. Assign the managed identity the **API Management Service Reader** role in your API Management instance using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

    ```azurecli
    #! /bin/bash
    scope="${apimID:1}"

    az role assignment create \
        --role "API Management Service Reader Role" \
        --assignee-object-id $apicObjID \
        --assignee-principal-type ServicePrincipal \
        --scope $scope 
    ```
    
    ```azurecli
    # Formatted for PowerShell
    $scope=$apimID.substring(1)

    az role assignment create `
        --role "API Management Service Reader Role" `
        --assignee-object-id $apicObjID `
        --assignee-principal-type ServicePrincipal `
        --scope $scope 
---
