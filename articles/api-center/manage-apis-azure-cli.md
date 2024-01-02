---
title: Manage APIs in Azure API Center - Azure CLI
description: Use the Azure CLI to create and manage APIs, API versions, and API definitions in your Azure API center.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/02/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to automate processes to register and manage APIs in my Azure API center.
---

# Use the Azure CLI to manage the API inventory

This article shows how to use [`az apic api`](/cli/azure/apic/api) commands in the Azure CLI to add and configure APIs in your [API center](overview.md). You can use commands in the Azure CLI to script operations to manage your API inventory and other aspects of your API center.  

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` extension to the Azure CLI. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

## Register API, API version, and definition

The following steps show how to create an API and associate a single API version and API definition. For background about the data model in API Center, see [Key concepts](key-concepts.md).

### 1. Create an API

Use the [az apic api create](/cli/azure/apic/api#az_apic_api_create) command to create an API in your API center. 

The following example creates an API named *Petstore API* in the *myGroup* resource group and *myAPICenter* API center. The API is a REST API.

```azurecli-interactive
az apic api create  --resource-group myGroup 
    --service myAPICenter --name petstore-api \
    --title "Petstore API" --kind "rest"
```

You can set more API properties using other command parameters. For example, set [metadata properties](key-concepts.md#metadata-properties) you've defined for APIs by passing values using the `--custom-properties` parameter:

<!-- Need to find out how metadata works and whether custom metadata covers just the custom properties or also built-in  

```azurecli-interactive
az apic api create \
    --resource-group myGroup --service myAPICenter \
    --name petstore-api --title "Petstore API" --kind "rest" \
    --custom-properties '{"lifecycleStage":"Design","apiType":"OpenAPI"}'
```
-->

> [!NOTE]
> After creating an API, you can update the API's properties by using the [az apic api update](/cli/azure/apic/api#az_apic_api_update) command.

### 2. Create an API version

Use the [az apic api version create](/cli/azure/apic/api/version#az_apic_api_version_create) command to create a version for your API. 

The following example creates an API version named *v1-0-0* for the *petstore-api* API that you created in the previous section. 

```azurecli-interactive
az apic api version create --resource-group myResourceGroup \
    --service myAPICenter --api-name petstore-api \
    --version v1-0-0 --title "v1-0-0"
```
<!-- title param is supposed to be optional but command fails without it -->

### 3. Create API definition and add specification file 

Use the [az apic api definition](/cli/azure/apic/api/definition) commands to add a definition and an accompanying specification file for an API version.

#### Create a definition

The following example uses the [az apic api definition create](/cli/azure/apic/api/definition#az_apic_api_definition_create) command to create a definition named *openapi* for the *petstore-api* API version that you created in the previous section. 

```azurecli-interactive
az apic api definition create --resource-group myResourceGroup \
    --service myAPICenter --api-name petstore-api \
    --version v1-0-0 --name "openapi" --title "OpenAPI"
```

#### Import a specification file

Import a specification file to the definition using the [az apic api definition import-specification](/cli/azure/apic/api/definition#az_apic_api_definition_import_specification) command.

The following example imports an OpenAPI specification file from a URL to the *openapi* definition that you created in the previous step. The `name` and `version` properties of the specification resource are passed as JSON. 


```azurecli-interactive
az apic api definition import-specification \
    --resource-group myResourceGroup --service myAPICenter \
    --api-name petstore-api --version-name v1-0-0 \
    --definition-name openapi --format "link" \
    --value 'https://petstore3.swagger.io/api/v3/openapi.json' \
    --specification '{"name":"openapi","version":"3.0.2"}'
```


## Register an API from a specification file - single step

You can register an API from a local specification file in a single step by using the [az apic api register](/cli/azure/apic/api#az-apic-api-register) command. With this option, a default API version and definition are created automatically for the API.

The following example registers an API in the *myAPICenter* API center from a local OpenAPI definition file named *specificationFile.json*.


```azurecli-interactive
az apic api register --resource-group myResourceGroup \
    --service myAPICenter --api-location "C:\Path\to\specificationFile.json"
```

The command sets the API properties such as name and type from values in the definition file. It creates a default API version named *1-0-0* and a default definition named according to the specification format (for example, *openapi*).

After registering an API, you can update the API's properties by using the [az apic api update](/cli/azure/apic/api#az_apic_api_update), [az apic api version update](/cli/azure/apic/api/version#az_apic_api_version_update), and [az apic api definition update](/cli/azure/apic/api/definition#az_apic_api_definition_update) commands.


## Delete API resources

Use the [az apic api delete](/cli/azure/apic/api#az_apic_api_delete) command to delete an API and all of its version and definition resources. For example:

```azurecli-interactive
az apic api delete \
    --resource-group myResoureGroup --service myAPICenter \
    --name petstore-api
```

To delete individual API versions and definitions, use [az apic api version delete](/cli/azure/apic/api/version#az-apic-api-version-delete) and [az apic api definition delete](/cli/azure/apic/api/definition#az-apic-api-definition-delete), respectively.

## Related content

* See the [Azure CLI reference for API Center](/cli/azure/apic) for a complete command list and examples.
