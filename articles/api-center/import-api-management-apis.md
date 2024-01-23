---
title: Import APIs from Azure API Management - Azure API Center
description: Add APIs from your API Management instance to your Azure API Center inventory.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/22/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to add APIs that are managed in my Azure API Management instance to my API center.
---

# Import APIs from Azure API Management to your API center

This article shows how to import APIs from an Azure API Management instance to your API center using the Azure CLI. Quickly add APIs managed in API Management to your API center so they're discoverable and accessible to developers or other stakeholders in your organization.

When you import an API from an API Management instance to your API center:

* The API's [versions](key-concepts.md#api-version) and [definitions](key-concepts.md#api-definition) are copied to your API center
* Azure API Management is added as an [environment](key-concepts.md#environment) in your API center
* The API's [versions](key-concepts.md#api-version) [definitions](key-concepts.md#api-definition), and [deployment](key-concepts.md#deployment) information are copied to your API center

After importing APIs, you can add metadata and documentation in your API center to help stakeholders discover, understand, and consume the APIs.
[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't already created one, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more instances of Azure API Management, in the same or a different subscription in your directory. If you haven't already created one, see [Create an Azure API Management instance](../api-management/get-started-create-service-instance.md).

* One or more APIs managed in your API Management instance that you want to add to your API center. 

* For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!TIP]
    > Azure CLI command examples in this article are formatted for the bash shell. If you're using PowerShell or another shell environment, you might need to adjust the examples for your environment.


## Enable managed identity in your API center

If you haven't already enable a system-assigned managed identity in your API center, you can enable it in the Azure portal or by using the [az apic service update](/cli/azure/apic/service#az-apic-service-update). Your API center uses the managed identity to access resources in your API Management instance.

Substitute your API center name and resource group name in the following command:

```azurecli 
az apic service update --name <api-center-name> \
    --resource-group <resource-group-name> \
    --identity '{"type": "SystemAssigned"}'
```

## Assign the managed identity the API Management Service Reader role

Assign your API center's managed identity the `API Management Service Reader` role in your API Management instance. You can use the [portal](../role-based-access-control/role-assignments-portal-assign-managed-identity.md) or the following steps in the Azure CLI:

* Use the [az apic service show](/cli/azure/apic/service#az-will be used byapic-service-show) command to get the object ID of the managed identity in your API center.
* Use the [az apim show](/cli/azure/apim#az-apim-show) command to get the resource ID of your API Management instance. 
* Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign the managed identity the **API Management Service Reader** role in your API Management instance.

```azurecli
# Get the object ID of the managed identity in your API center
apicObjID=$(az apic service show --name <api-center-name> \
    --resource-group <resource-group-name> \
    --query identity.principalId --output tsv)

# Get the resource ID of your API Management instance
apimID=$(az apim show --name <apim-name> \
    --resource-group <resource-group-name> \
    --query id --output tsv)

# Assign the managed identity the API Management Service Reader role in your API Management instance
az role assignment create \
    --role "API Management Service Reader Role"\
    --assignee-object-id $apicObjID \
    --assignee-principal-type ServicePrincipal \
    --scope "${apimID:1}" 
```

## Import APIs from your API Management instance

Use the [az apic service import-from-apim](/cli/azure/apic/service#az-apic-service-import-from-apim) command to import one or more APIs from your API Management instance to your API center. 

> [!NOTE]
> Currently, this command only supports using a system-assigned managed identity to access the API Management instance. 

<!-- When user-assigned identity/ies supported, 
import command will pick system-assigned identity first, then user-assigned and pick first in list -->

### Import all APIs from an API Management instance

Use a wildcard (`*`) to specify all APIs from the API Management instance. Substitute the name of your API center and resource group in the following command:

```azurecli
# $apimID is the full Azure resource ID of the API Management instance
az apic service import-from-apim --service-name <api-center-name> \
    --resource-group <resource-group-name> \
    --source-resource-ids $apimID/apis/*    
```

> [!NOTE]
> If your API Management instance has a large number of APIs, import to your API center might take some time.

### Import a specific API from an API Management instance

Specify an API to import by name from the API Management instance. Substitute the name of your API center and resource group in the following command:


```azurecli
az apic service import-from-apim --service-name <api-center-name> \
    --resource-group <resource-group-name> \
    --source-resource-ids $apimID/apis/<api-name>
```

## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [Assign Azure roles to a managed identity](../role-based-access-control/role-assignments-portal-assign-managed-identity.md)
* [Azure API Management documentation](../api-management/index.yml)