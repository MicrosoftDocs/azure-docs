---
title: Import APIs from Azure API Management - Azure API Center
description: Add APIs to your Azure API center inventory from your API Management instance.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/25/2024
ms.author: danlep 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to add APIs that are managed in my Azure API Management instance to my API center.
---

# Import APIs to your API center from Azure API Management

This article shows how to import (add) APIs from an Azure API Management instance to your [API center](overview.md) using the Azure CLI. Adding APIs from API Management to your API inventory helps make them discoverable and accessible to developers, API program managers, and other stakeholders in your organization.

When you add an API from an API Management instance to your API center:

* The API's [versions](key-concepts.md#api-version), [definitions](key-concepts.md#api-definition), and [deployment](key-concepts.md#deployment) information are copied to your API center.
* The API receives a system-generated API name in your API center. It retains its display name (title) from API Management.
* The **Lifecycle stage** of the API is set to *Design*.
* Azure API Management is added as an [environment](key-concepts.md#environment).

After adding an API from API Management, you can add metadata and documentation in your API center to help stakeholders discover, understand, and consume the API.

> [!VIDEO https://www.youtube.com/embed/SuGkhuBUV5k]

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more instances of Azure API Management, in the same or a different subscription in your directory. If you haven't created one, see [Create an Azure API Management instance](../api-management/get-started-create-service-instance.md).

* One or more APIs managed in your API Management instance that you want to add to your API center. 

* For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.


## Add a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access APIs in your API Management instance. You can use either a system-assigned or user-assigned managed identity. If you haven't added a managed identity in your API center, you can add it in the Azure portal or by using the Azure CLI. 

### Add a system-assigned identity

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

#### [Azure CLI](#tab/cli)

Set the system-assigned identity in your API center using the following [az apic service update](/cli/azure/apic/service#az-apic-service-update) command. Substitute the names of your API center and resource group:

```azurecli 
az apic service update --name <api-center-name> --resource-group <resource-group-name> --identity '{"type": "SystemAssigned"}'
```
---

### Add a user-assigned identity

To add a user-assigned identity, you need to create a user-assigned identity resource, and then add it to your API center.

#### [Portal](#tab/portal)

1. Create a user-assigned identity according to [these instructions](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).
1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, select **Managed identities**.
1. Select **User assigned** > **+ Add**.
1. Search for the identity you created earlier, select it, and select **Add**.

#### [Azure CLI](#tab/cli)

1. Create a user-assigned identity.

    ```azurecli
    az identity create --resource-group <resource-group-name> --name <identity-name> 
    ```

    In the command output, note the value of the identity's `id` property. The `id` property should look something like this:

    ```json
    {
    [...]
        "id": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"
    [...]
    }
    ```

1. Create a JSON file with the following content, substituting the value of the `id` property from the previous step.

    ```json
    {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "<identity-id>": {}
        }
    }
    ```

1. Add the user-assigned identity to your API center using the following [az apic service update](/cli/azure/apic/service#az-apic-service-update) command. Substitute the names of your API center and resource group, and pass the JSON file as the value of the `--identity` parameter. Here, the JSON file is named `identity.json`.

    ```azurecli 
    az apic service update --name <api-center-name> --resource-group <resource-group-name> --identity "@identity.json"
    ```
---

## Assign the managed identity the API Management Service Reader role

To allow import of APIs, assign your API center's managed identity the **API Management Service Reader** role in your API Management instance. You can use the [portal](../role-based-access-control/role-assignments-portal-managed-identity.md) or the Azure CLI.

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API Management instance.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab - Select **API Management Service Reader**.
    1. On the **Members** tab, in **Assign access to** - Select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page - Select the system-assigned or user-assigned managed identity of your API center that you added in the previous section. Click **Select**.
    1. Select **Review + assign**.

#### [Azure CLI](#tab/cli)

1. Get the principal ID of the identity. If you're configuring a system-assigned identity, use the [az apic service show](/cli/azure/apic/service#az-apic-service-show) command. For a user-assigned identity, use [az identity show](/cli/azure/identity#az-identity-show).

    **System-assigned identity**
    ```azurecli
    #! /bin/bash
    apicObjID=$(az apic service show --name <api-center-name> \
        --resource-group <resource-group-name> \
        --query "identity.principalId" --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $apicObjID=$(az apic service show --name <api-center-name> `
        --resource-group <resource-group-name> `
        --query "identity.principalId" --output tsv)
    ```

    **User-assigned identity**
    ```azurecli
    #! /bin/bash   
    apicObjID=$(az identity show --name <identity-name> --resource-group <resource-group-name> --query "principalId" --output tsv)
    ```
    
    ```azurecli
    # PowerShell syntax   
    $apicObjID=$(az identity show --name <identity-name> --resource-group <resource-group-name> --query "principalId" --output tsv)
    ```
1. Get the resource ID of your API Management instance using the [az apim show](/cli/azure/apim#az-apim-show) command.
 
    ```azurecli
    #! /bin/bash
    apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query "id" --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
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
    #! PowerShell syntax
    $scope=$apimID.substring(1)

    az role assignment create `
        --role "API Management Service Reader Role" `
        --assignee-object-id $apicObjID `
        --assignee-principal-type ServicePrincipal `
        --scope $scope 
---

## Import APIs from your API Management instance

Use the [az apic service import-from-apim](/cli/azure/apic/service#az-apic-service-import-from-apim) command to import one or more APIs from your API Management instance to your API center. 

> [!NOTE]
> * This command depends on a managed identity configured in your API center that has read permissions to the API Management instance. If you haven't added or configured a managed identity, see [Add a managed identity in your API center](#add-a-managed-identity-in-your-api-center) earlier in this article.
>
> * If your API center has multiple managed identities, the command searches first for a system-assigned identity. If none is found, it picks the first user-assigned identity in the list. 

### Import all APIs from an API Management instance

Use a wildcard (`*`) to specify all APIs from the API Management instance. 

1. Get the resource ID of your API Management instance using the [az apim show](/cli/azure/apim#az-apim-show) command.

    ```azurecli
    #! /bin/bash
    apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query id --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query id --output tsv)
    ```
    
1. Use the `az apic service import-from-apim` command to import the APIs. Substitute the names of your API center and resource group, and use `*` to specify all APIs from the API Management instance.

    ```azurecli
    #! /bin/bash
    apiIDs="$apimID/apis/*"

    az apic service import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> --source-resource-ids $apiIDs    
    ```
    
    ```azurecli 
    # PowerShell syntax
    $apiIDs=$apimID + "/apis/*"

    az apic service import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> --source-resource-ids $apiIDs    
    ```

    > [!NOTE]
    > If your API Management instance has a large number of APIs, import to your API center might take some time.
    
### Import a specific API from an API Management instance

Specify an API to import using its name from the API Management instance. 

1. Get the resource ID of your API Management instance using the [az apim show](/cli/azure/apim#az-apim-show) command.

    ```azurecli
    #! /bin/bash
    apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query id --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $apimID=$(az apim show --name <apim-name> --resource-group <resource-group-name> --query id --output tsv)
    ```
    
1. Use the `az apic service import-from-apim` command to import the API. Substitute the names of your API center and resource group, and specify an API name from the API Management instance.

    ```azurecli
    #! /bin/bash
    apiIDs="$apimID/apis/<api-name>"

    az apic service import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> --source-resource-ids $apiIDs    
    ```
    
    ```azurecli 
    # PowerShell syntax
    $apiIDs=$apimID + "/apis/<api-name>"

    az apic service import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> --source-resource-ids $apiIDs    
    ```

    > [!NOTE]
    > Specify `<api-name>` using the API resource name in the API Management instance, not the display name. Example: `petstore-api` instead of `Petstore API`.
    
After importing APIs from API Management, you can view and manage the imported APIs in your API center.

## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Assign Azure roles to a managed identity](../role-based-access-control/role-assignments-portal-managed-identity.md)
* [Azure API Management documentation](../api-management/index.yml)
