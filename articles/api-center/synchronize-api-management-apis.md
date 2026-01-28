---
title: Synchronize APIs from Azure API Management instance
description: Integrate an API Management instance to Azure API Center for automatic synchronization of APIs to the inventory.

ms.service: azure-api-center
ms.topic: how-to
ms.date: 01/20/2026
 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to integrate my Azure API Management instance with my API center and synchronize API Management APIs to my inventory.
---

# Synchronize APIs from an API Management instance

This article shows how to integrate an API Management instance so that the instance's APIs are continuously kept up to date in your [API center](overview.md) inventory. 

> [!TIP]
> This article explains how to integrate an API Management instance from your API center. Alternatively, quickly set up integration directly from an API Management instance. In the left menu of your instance, under **APIs**, select **API Center**, and select a target API center in your subscription to synchronize APIs to.

## About integrating an API Management instance

Although you can use the Azure CLI to [import](import-api-management-apis.md) APIs on demand from Azure API Management to Azure API Center, integrating (linking) an API Management instance enables continuous synchronization so that the API inventory stays up to date. Azure API Center can also synchronize APIs from sources including [Amazon API Gateway](synchronize-aws-gateway-apis.md). 

When you integrate an API Management instance as an API source, the following happens:

1. All APIs, and optionally API definitions (specs), from the API Management instance are added to the API center inventory. MCP servers in API Management are included in the APIs added to the inventory.
1. You configure an [environment](key-concepts.md#environment) of type *Azure API Management* in the API center. 
1. An associated [deployment](key-concepts.md#deployment) is created for each synchronized API definition from API Management. 

API Management APIs automatically synchronize to the API center whenever existing APIs' settings change (for example, new versions are added), new APIs are created, or APIs are deleted. This synchronization is one-way from API Management to your Azure API center, meaning API updates in the API center aren't synchronized back to the API Management instance.

> [!NOTE]
> * There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#azure-api-center-limits) for the number of integrated API Management instances (API sources).
> * You can configure an integrated API Management instance in a virtual network.
> * API updates in API Management typically synchronize to your API center within minutes, but synchronization can take up to 24 hours.
> * API definitions also synchronize to the API center if you select the option to include them during integration.

### Entities synchronized from API Management

[!INCLUDE [synchronized-properties-api-source](includes/synchronized-properties-api-source.md)]

## Prerequisites

* An API center in your Azure subscription. If you didn't create an API center, see [Quickstart: Create your API center](set-up-api-center.md).

* An Azure API Management instance, in the same or a different subscription. The instance must be in the same directory. 

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > You can run Azure CLI command examples in this article in PowerShell or a bash shell. Where different variable syntax is required, the article provides separate command examples for the two shells.

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Assign the managed identity the API Management Service Reader role

[!INCLUDE [configure-managed-identity-apim-reader](includes/configure-managed-identity-apim-reader.md)]

## Integrate an API Management instance 

You can integrate an API Management instance by using the portal or the Azure CLI.

#### [Portal](#tab/portal)

1. In the [portal](https://portal.azure.com), go to your API center.
1. Under **Platforms**, select **Integrations**.
1. Select **+ New integration** > **From Azure API Management**.
1. In **Integrate your Azure API Management Service**:
    1. Select whether to synchronize all APIs from the API Management instance or only APIs that are in an API Management [workspace](../api-management/workspaces-overview.md). 
    1. Select the **Subscription**, **Resource group**, and **Azure API Management service** that you want to integrate. If you want to synchronize only APIs from a workspace, make a selection in **Choose a workspace**.
    1. In **Integration details**, enter an identifier.
        If you haven't already configured a managed identity with access to the API Management instance, enable **Automatically configure managed identity and assign permissions**. This selection automatically assigns the API center's system-assigned managed identity the necessary permissions to synchronize APIs from the API Management instance.
    1. In **Environment details**, enter an **Environment title** (name), **Environment type**, and optional **Description**.
    1. In **API Details**:
        1. Select a **Lifecycle** for the synchronized APIs. (You can update this value for the APIs after they're added to your API center.)
        1. Optionally, select whether to include API definitions with the synchronized APIs.
1. Select **Create**.

:::image type="content" source="media/synchronize-api-management-apis/link-api-management-service.png" alt-text="Screenshot of integrating an Azure API Management service in the portal.":::

#### [Azure CLI](#tab/cli)

Run the [az apic integration create apim](/cli/azure/apic/integration/create#az-apic-integration-create-apim) command to integrate an API Management instance to your API center. 

> [!NOTE]
>
> * This command is only available in the preview version of the APIC extension.
> * Install the new preview version before using this command.

* Provide the names of the resource group, API center, and integration.  

* If the API Management instance and the API center are in the same resource group, you can provide the API Management instance name as the value of `azure-apim`. Otherwise, provide the Azure resource ID. 

```azurecli
az apic integration create apim \
    --resource-group <resource-group-name> \
    --service-name <api-center-name> \
    --integration-name <apim-integration-name> \
    --azure-apim <apim-instance-name>
``` 
---

The API Management instance is integrated as an environment in your API center. The API Management APIs are synchronized to the API center inventory.

[!INCLUDE [delete-api-integration](includes/delete-api-integration.md)]

## Related content
 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Import APIs from API Management to your Azure API center](import-api-management-apis.md)
* [Register and discover MCP servers in your API center](register-discover-mcp-server.md)
* [Azure API Management documentation](../api-management/index.yml)
