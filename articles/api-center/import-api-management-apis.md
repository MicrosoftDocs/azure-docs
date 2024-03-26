---
title: Import APIs from Azure API Management - Azure API Center
description: Add APIs to your Azure API center inventory from your API Management instance.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 03/08/2024
ms.author: danlep 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to add APIs that are managed in my Azure API Management instance to my API center.
---

# Import APIs to your API center from Azure API Management

This article shows how to import (add) APIs from an Azure API Management instance to your [API center](overview.md) using the Azure CLI. Adding APIs from API Management to your API inventory helps make them discoverable and accessible to developers, API program managers, and other stakeholders in your organization.

This article shows two options for using the Azure CLI to add APIs to your API center from API Management:

* **Option 1** - Export an API definition from an API Management instance using the [az apim api export](/cli/azure/apim/api#az-apim-api-export) command. Then, import the definition to your API center. 

    Possible ways to import an API definition exported from API Management include:
    * Run [az apic api register](/cli/azure/apic/api#az-apic-api-register) to register a new API in your API center.
    * Run [az apic api definition import-specification](/cli/azure/apic/api/definition#az-apic-api-definition-import-specification) to import the API definition to an existing API.

* **Option 2** - Import APIs directly from API Management to your API center using the [az apic service import-from-apim](/cli/azure/apic/service#az-apic-service-import-from-apim) command.
    
After importing API definitions or APIs from API Management, you can add metadata and documentation in your API center to help stakeholders discover, understand, and consume the API.

> [!VIDEO https://www.youtube.com/embed/SuGkhuBUV5k]

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more instances of Azure API Management, in the same or a different subscription. When you import APIs directly from API Management, the API Management instance and API center must be in the same directory. If you haven't created one, see [Create an Azure API Management instance](../api-management/get-started-create-service-instance.md).

* One or more APIs managed in your API Management instance that you want to add to your API center. 

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Option 1: Export an API definition from API Management and import it to your API center

First, export an API from your API Management instance to an API definition using the [az apim api export](/cli/azure/apim/api#az-apim-api-export) command. Depending on your scenario, you can export the API definition to a local file or a URL.

### Export API to a local API definition file

The following example command exports the API with identifier *my-api* in the *myAPIManagement* instance of API. The API is exported in OpenApiJson format to a local OpenAPI definition file named *specificationFile.json*. 

```azurecli
#! /bin/bash
az apim api export --api-id my-api --resource-group myResourceGroup \
    --service-name myAPIManagement --export-format OpenApiJsonFile \
    --file-path /path/to/folder
```

```azurecli
#! PowerShell syntax
az apim api export --api-id my-api --resource-group myResourceGroup `
    --service-name myAPIManagement --export-format OpenApiJsonFile `
    --file-path /path/to/folder
```
### Export API to a URL

In the following example, [az apim api export](/cli/azure/apim/api#az-apim-api-export) exports the API with identifier *my-api* in OpenApiJson format to a URL in Azure storage. The URL is available for approximately 5 minutes. Here, the value of the URL is stored in the *$link* variable.


```azurecli
#! /bin/bash
link=$(az apim api export --api-id my-api --resource-group myResourceGroup \
    --service-name myAPIManagement --export-format OpenApiJsonUrl --query properties.value.link \
    --output tsv)
```

```azurecli
# PowerShell syntax
$link=$(az apim api export --api-id my-api --resource-group myResourceGroup `
    --service-name myAPIManagement --export-format OpenApiJsonUrl --query properties.value.link `
    --output tsv)
```
### Register API in your API center from exported API definition

You can register a new API in your API center from the exported definition by using the [az apic api register](/cli/azure/apic/api#az-apic-api-register) command.

The following example registers an API in the *myAPICenter* API center from a local OpenAPI definition file named *definitionFile.json*.

```azurecli
az apic api register --resource-group myResourceGroup --service myAPICenter --api-location "/path/to/definitionFile.json
```

### Import API definition to an existing API in your API center

The following example uses the [az apic api definition import-specification](/cli/azure/apic/api/definition#az-apic-api-definition-import-specification) command to import an API definition to an existing API in the *myAPICenter* API center. Here, the API definition is imported from a URL stored in the *$link* variable.

This example assumes you have an API named *my-api* and an associated API version *v1-0-0* and definition entity *openapi* in your API center. If you don't, see [Add APIs to your API center](manage-apis-azure-cli.md#register-api-api-version-and-definition).

```azurecli
#! /bin/bash
az apic api definition import-specification \
    --resource-group myResourceGroup --service myAPICenter \
    --api-name my-api --version-name v1-0-0 \
    --definition-name openapi --format "link" --value '$link' \
    --specification '{"name":"openapi","version":"3.0.2"}'
```

```azurecli
# PowerShell syntax
az apic api definition import-specification `
    --resource-group myResourceGroup --service myAPICenter `
    --api-name my-api --version-name v1-0-0 `
    --definition-name openapi --format "link" --value '$link' `
    --specification '{"name":"openapi","version":"3.0.2"}'
```

## Option 2: Import APIs directly from your API Management instance

The following are steps to import APIs from your API Management instance to your API center using the [az apic service import-from-apim](/cli/azure/apic/service#az-apic-service-import-from-apim) command. This command is useful when you want to import multiple APIs from API Management to your API center, but you can also use it to import a single API.

When you add APIs from an API Management instance to your API center using `az apic service import-from-apim`, the following happens automatically:
    
* Each API's [versions](key-concepts.md#api-version), [definitions](key-concepts.md#api-definition), and [deployment](key-concepts.md#deployment) information are copied to your API center.
* The API receives a system-generated API name in your API center. It retains its display name (title) from API Management.
* The **Lifecycle stage** of the API is set to *Design*.
* Azure API Management is added as an [environment](key-concepts.md#environment).

### Add a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access APIs in your API Management instance. You can use either a system-assigned or user-assigned managed identity. If you haven't added a managed identity in your API center, you can add it in the Azure portal or by using the Azure CLI. 

#### Add a system-assigned identity

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

#### Add a user-assigned identity

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

### Assign the managed identity the API Management Service Reader role

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

### Import APIs directly from your API Management instance

Use the [az apic service import-from-apim](/cli/azure/apic/service#az-apic-service-import-from-apim) command to import one or more APIs from your API Management instance to your API center. 

> [!NOTE]
> * This command depends on a managed identity configured in your API center that has read permissions to the API Management instance. If you haven't added or configured a managed identity, see [Add a managed identity in your API center](#add-a-managed-identity-in-your-api-center) earlier in this article.
>
> * If your API center has multiple managed identities, the command searches first for a system-assigned identity. If none is found, it picks the first user-assigned identity in the list. 

#### Import all APIs from an API Management instance

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
    az apic service import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> --source-resource-ids $apimID/apis/*  
    ```

    > [!NOTE]
    > If your API Management instance has a large number of APIs, import to your API center might take some time.
    
#### Import a specific API from an API Management instance

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
    az apic service import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> --source-resource-ids $apimID/apis/<api-name>    
    ```
    
    > [!NOTE]
    > Specify `<api-name>` using the API resource name in the API Management instance, not the display name. Example: `petstore-api` instead of `Petstore API`.
    
After importing APIs from API Management, you can view and manage the imported APIs in your API center.

## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [Azure CLI reference for API Management](/cli/azure/apim) 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Assign Azure roles to a managed identity](../role-based-access-control/role-assignments-portal-managed-identity.md)
* [Azure API Management documentation](../api-management/index.yml)
