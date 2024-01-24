---
title: Import APIs from Azure API Management - Azure API Center
description: Add APIs to your Azure API center inventory from your API Management instance.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/24/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to add APIs that are managed in my Azure API Management instance to my API center.
---

# Import APIs from Azure API Management to your API center

This article shows how to import (add) APIs from an Azure API Management instance to your [API center](overview.md) using the Azure CLI. Quickly add APIs managed in API Management to your API inventory so they're discoverable and accessible to developers, API program managers, and other stakeholders in your organization.

When you add an API from an API Management instance to your API center, it's registered as follows:

* The API's [versions](key-concepts.md#api-version), [definitions](key-concepts.md#api-definition), and [deployment](key-concepts.md#deployment) information are copied to your API center.
* The API receives a system-generated API name in your API center. It retains its display name (title) from API Management.
* Azure API Management is added as an [environment](key-concepts.md#environment) in your API center.

After adding an API from API Management, you can add metadata and documentation in your API center to help stakeholders discover, understand, and consume the API.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more instances of Azure API Management, in the same or a different subscription in your directory. If you haven't created one, see [Create an Azure API Management instance](../api-management/get-started-create-service-instance.md).

* One or more APIs managed in your API Management instance that you want to add to your API center. 

* For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!TIP]
    > Azure CLI command examples in this article are formatted for the bash shell. If you're using PowerShell or another shell environment, you might need to adjust line breaks and variable names for your environment.


## Enable managed identity in your API center

If you haven't already enable a system-assigned managed identity in your API center, you can enable it in the Azure portal or by using the Azure CLI. Your API center uses the managed identity to access resources in your API Management instance.


#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

#### [Azure CLI](#tab/cli)

Substitute your API center name and resource group name in the following [az apic service update](/cli/azure/apic/service#az-apic-service-update) command:

```azurecli 
az apic service update --name <api-center-name> \
    --resource-group <resource-group-name> \
    --identity '{"type": "SystemAssigned"}'
```

---

## Assign the managed identity the API Management Service Reader role

Assign your API center's managed identity the `API Management Service Reader` role in your API Management instance. You can use the [portal](../role-based-access-control/role-assignments-portal-managed-identity.md) or the Azure CLI.

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API Management instance.
1. In the left menu, select **Access control (IAM)**.
1. **Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    * On the **Role** tab - Select **API Management Service Reader**.
    * On the **Members** tab, in **Assign access to** - Select **Managed identity** > **+ Select members**.
    * On the **Select managed identities** page, select the system-assigned managed identity of your API center that you enabled in the previous section. Click **Select**.
    * Select **Review + assign**.

#### [Azure CLI](#tab/cli)

Run the following commands to assign the managed identity the **API Management Service Reader** role in your API Management instance.

* Use [az apic service show](/cli/azure/apic/service#az-apic-service-show) to get the object ID of the managed identity in your API center.
* Use [az apim show](/cli/azure/apim#az-apim-show) to get the resource ID of your API Management instance. 
* Use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the managed identity the **API Management Service Reader** role in your API Management instance.

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
---

## Import APIs from your API Management instance

Use the [az apic service import-from-apim](/cli/azure/apic/service#az-apic-service-import-from-apim) command to import one or more APIs from your API Management instance to your API center. 

> [!NOTE]
> Currently, this command only supports using a system-assigned managed identity to access the API Management instance. 

<!-- When user-assigned identity/ies supported, 
import command will pick system-assigned identity first, then user-assigned and will pick first in list -->

### Import all APIs from an API Management instance

Use a wildcard (`*`) to specify all APIs from the API Management instance. Substitute the names of your API center and resource group in the following command:

```azurecli
# $apimID is the full Azure resource ID of the API Management instance
az apic service import-from-apim --service-name <api-center-name> \
    --resource-group <resource-group-name> \
    --source-resource-ids $apimID/apis/*    
```

> [!NOTE]
> If your API Management instance has a large number of APIs, import to your API center might take some time.

### Import a specific API from an API Management instance

Specify an API to import using its name from the API Management instance. Substitute the names of your API center, resource group, and API in the following command:


```azurecli
# $apimID is the full Azure resource ID of the API Management instance
az apic service import-from-apim --service-name <api-center-name> \
    --resource-group <resource-group-name> \
    --source-resource-ids $apimID/apis/<api-name>
```

> [!NOTE]
> Specify `<api-name>`according to the API resource name in the API Management instance, not the display name. Example: `petstore-api` instead of `Petstore API`.

After running the command, you can view the imported APIs in the following locations:

* Your API center in the Azure portal
* By using the [az apic api list](/cli/azure/apic/api#az-apic-api-list) command
* Your API Center portal, if you enabled it

## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [Assign Azure roles to a managed identity](../role-based-access-control/role-assignments-portal-managed-identity.md)
* [Azure API Management documentation](../api-management/index.yml)