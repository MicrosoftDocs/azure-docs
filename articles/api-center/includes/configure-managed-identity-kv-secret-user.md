---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 12/20/2024
ms.author: danlep
ms.custom: Include file
---

To allow import of APIs, assign your API center's managed identity the **Key Vault Secrets User** role in your Azure key vault. You can use the [portal](../../role-based-access-control/role-assignments-portal-managed-identity.yml) or the Azure CLI.

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your key vault.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab, select **Key Vault Secrets User**.
    1. On the **Members** tab, in **Assign access to** - Select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page, select the system-assigned managed identity of your API center that you added in the previous section. Click **Select**.
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

1. Get the resource ID of your key vault using the [az keyvault show](/cli/azure/keyvault#az-keyvault-show) command.
 
    ```azurecli
    #! /bin/bash
    kvID=$(az keyvault show --name <kv-name> --resource-group <resource-group-name> --query "id" --output tsv)
    ```

    ```azurecli
    # Formatted for PowerShell
    $kvID=$(az keyvault show --name <kv-name> --resource-group <resource-group-name> --query "id" --output tsv)
    ```

1. Assign the managed identity the **Key Vault Secrets User** role in your key vault the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

    ```azurecli
    #! /bin/bash
    scope="${kvID:1}"

    az role assignment create \
        --role "Key Vault Secrets User" \
        --assignee-object-id $apicObjID \
        --assignee-principal-type ServicePrincipal \
        --scope $scope 
    ```
    
    ```azurecli
    # Formatted for PowerShell
    $scope=$apimID.substring(1)

    az role assignment create `
        --role "Key Vault Secrets User" `
        --assignee-object-id $apicObjID `
        --assignee-principal-type ServicePrincipal `
        --scope $scope 
---
