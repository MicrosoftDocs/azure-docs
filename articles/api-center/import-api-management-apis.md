---
title: Import APIs from Azure API Management - Azure API Center
description: Add APIs to your Azure API center inventory from your API Management instance.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 06/28/2024
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

* **Option 2** - Import APIs directly from API Management to your API center using the [az apic import-from-apim](/cli/azure/apic#az-apic-import-from-apim) command.
    
After importing API definitions or APIs from API Management, you can add metadata and documentation in your API center to help stakeholders discover, understand, and consume the API.

> [!TIP]
> You can also set up automatic synchronization of APIs from API Management to your API center. For more information, see [Link an API Management instance to synchronize APIs to your API center](synchronize-api-management-apis.md).

## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more instances of Azure API Management, in the same or a different subscription. When you import APIs directly from API Management, the API Management instance and API center must be in the same directory. If you haven't created one, see [Create an Azure API Management instance](../api-management/get-started-create-service-instance.md).

* One or more APIs managed in your API Management instance that you want to add to your API center. 

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Option 1: Export an API definition from API Management and import it to your API center

First, export an API from your API Management instance to an API definition using the [az apim api export](/cli/azure/apim/api#az-apim-api-export) command. Depending on your scenario, you can export the API definition to a local file or a URL.

### Export API to a local API definition file

The following example command exports the API with identifier *my-api* in the *myAPIManagement* instance of API. The API is exported in OpenApiJson format to a local OpenAPI definition file at the path you specify. 

```azurecli
#! /bin/bash
az apim api export --api-id my-api --resource-group myResourceGroup \
    --service-name myAPIManagement --export-format OpenApiJsonFile \
    --file-path "/path/to/folder"
```

```azurecli
# Formatted for PowerShell
az apim api export --api-id my-api --resource-group myResourceGroup `
    --service-name myAPIManagement --export-format OpenApiJsonFile `
    --file-path '/path/to/folder'
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
# Formatted for PowerShell
$link=$(az apim api export --api-id my-api --resource-group myResourceGroup `
    --service-name myAPIManagement --export-format OpenApiJsonUrl --query properties.value.link `
    --output tsv)
```
### Register API in your API center from exported API definition

You can register a new API in your API center from the exported definition by using the [az apic api register](/cli/azure/apic/api#az-apic-api-register) command.

The following example registers an API in the *myAPICenter* API center from a local OpenAPI definition file named *definitionFile.json*.

```azurecli
az apic api register --resource-group myResourceGroup --service-name myAPICenter --api-location "/path/to/definitionFile.json"
```

### Import API definition to an existing API in your API center

The following example uses the [az apic api definition import-specification](/cli/azure/apic/api/definition#az-apic-api-definition-import-specification) command to import an API definition to an existing API in the *myAPICenter* API center. Here, the API definition is imported from a URL stored in the *$link* variable.

This example assumes you have an API named *my-api* and an associated API version *v1-0-0* and definition entity *openapi* in your API center. If you don't, see [Add APIs to your API center](manage-apis-azure-cli.md#register-api-api-version-and-definition).

```azurecli
#! /bin/bash
az apic api definition import-specification \
    --resource-group myResourceGroup --service-name myAPICenter \
    --api-id my-api --version-id v1-0-0 \
    --definition-id openapi --format "link" --value '$link' \
    --specification '{"name":"openapi","version":"3.0.2"}'
```

```azurecli
# Formatted for PowerShell
az apic api definition import-specification `
    --resource-group myResourceGroup --service-name myAPICenter `
    --api-id my-api --version-id v1-0-0 `
    --definition-id openapi --format "link" --value '$link' `
    --specification '{"name":"openapi","version":"3.0.2"}'
```

## Option 2: Import APIs directly from your API Management instance

The following are steps to import APIs from your API Management instance to your API center using the [az apic import-from-apim](/cli/azure/apic#az-apic-service-import-from-apim) command. This command is useful when you want to import multiple APIs from API Management to your API center, but you can also use it to import a single API.

When you add APIs from an API Management instance to your API center using `az apic import-from-apim`, the following happens automatically:
    
* Each API's [versions](key-concepts.md#api-version), [definitions](key-concepts.md#api-definition), and [deployment](key-concepts.md#deployment) information are copied to your API center.
* The API receives a system-generated API name in your API center. It retains its display name (title) from API Management.
* The **Lifecycle stage** of the API is set to *Design*.
* Azure API Management is added as an [environment](key-concepts.md#environment).

### Add a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

### Assign the managed identity the API Management Service Reader role

[!INCLUDE [configure-managed-identity-apim-reader](includes/configure-managed-identity-apim-reader.md)]

### Import APIs from API Management

Use the [az apic import-from-apim](/cli/azure/apic#az-apic-import-from-apim) command to import one or more APIs from your API Management instance to your API center. 

> [!NOTE]
> * This command depends on a managed identity configured in your API center that has read permissions to the API Management instance. If you haven't added or configured a managed identity, see [Add a managed identity in your API center](#add-a-managed-identity-in-your-api-center) earlier in this article.
>
> * If your API center has multiple managed identities, the command searches first for a system-assigned identity. If none is found, it picks the first user-assigned identity in the list. 

#### Import all APIs from an API Management instance

In the following command, substitute the names of your API center, your API center's resource group, your API Management instance, and your instance's resource group. Use `*` to specify all APIs from the API Management instance.

```azurecli
#! /bin/bash
az apic import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> \
    --apim-name <api-management-name> --apim-resource-group <api-management-resource-group-name> \
    --apim-apis '*'  
```

```azurecli
# Formatted for PowerShell
az apic import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> `
    --apim-name <api-management-name> --apim-resource-group <api-management-resource-group-name> `
    --apim-apis '*'  
```

> [!NOTE]
> If your API Management instance has a large number of APIs, import to your API center might take some time.
    
#### Import a specific API from an API Management instance

Specify an API to import using its name from the API Management instance. 

In the following command, substitute the names of your API center, your API center's resource group, your API Management instance, and your instance's resource group. Pass an API name such as `petstore-api` using the `--apim-apis` parameter. 

```azurecli
#! /bin/bash
az apic import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> \
    --apim-name <api-management-name> --apim-resource-group <api-management-resource-group-name> \
    --apim-apis 'petstore-api'        
```


```azurecli
# Formatted for PowerShell
az apic import-from-apim --service-name <api-center-name> --resource-group <resource-group-name> `
    --apim-name <api-management-name> --apim-resource-group <api-management-resource-group-name> `
    --apim-apis 'petstore-api'    
```

> [!NOTE]
> Specify an API name using the API resource name in the API Management instance, not the display name. Example: `petstore-api` instead of `Petstore API`.
    
After importing APIs from API Management, you can view and manage the imported APIs in your API center.

## Related content

* [Azure CLI reference for Azure API Center](/cli/azure/apic) 
* [Azure CLI reference for API Management](/cli/azure/apim) 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Assign Azure roles to a managed identity](../role-based-access-control/role-assignments-portal-managed-identity.yml)
* [Azure API Management documentation](../api-management/index.yml)
