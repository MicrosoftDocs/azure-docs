---
title: Synchronize APIs from Azure API Management instance
description: Integrate an API Management instance to Azure API Center for automatic synchronization of APIs from API Management to the inventory.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/22/2024
ms.author: danlep 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to integrate my Azure API Management instance to my API center and synchronize API Management APIs to my inventory.
---

# Integrate an API Management instance to synchronize APIs to your API center

This article shows how to create an integration (preview) to an API Management instance so that the instances's APIs are synchronized in your [API center](overview.md).

APIs in an integrated API Management instance are continuously kept up to date in your API center inventory. This synchronization makes all of the API Management APIs available to stakeholders to be discovered, reused, and governed like your other APIs.

## About integrating an API Management instance

Although you can use the Azure CLI to [import](import-api-management-apis.md) APIs on demand from Azure API Management to Azure API Center, integrating an API Management instance enables continuous synchronization so that the API inventory stays up to date.

When you integrate an API Management instance, the following happens:

* All APIs, and optionally API definitions, from the API Management instance are added to the API center inventory.
* You configure an [environment](key-concepts.md#environment) of type *Azure API Management* in the API center. An associated [deployment](key-concepts.md#deployment) is created for each synchronized API definition from API Management. 

API Management APIs automatically synchronize to the API center whenever existing APIs' settings change, new versions are added, new APIs are created, or APIs are deleted. This synchronization is one-way from API Management to your Azure API center, meaning API updates in the API center aren't synchronized back to the API Management instance.

> [!NOTE]
> * API updates in API Management can take a few minutes to synchronize to your API center.
> * There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#api-center-limits) for the number of integrate API Management instances.


### Entities synchronized from API Management

You can add or update API metadata and documentation in your API center to help stakeholders discover, understand, and consume the synchronized APIs. Learn more about Azure API Center's [built-in and custom metadata properties](add-metadata-properties.md).

Certain properties of synchronized APIs and other entities are configured automatically in the API center and are read-only, as shown in the following table:

| Entity       | Read-only properties in API center                     |
|--------------|--------------------------------------------------------|
| API          | • title<br/>• description<br/>• kind                   |
| API version  | • title                                                |
| Environment  | • server.type
| Deployment   | • server.runtimeUri<br/>• environmentId<br/>• definitionId |

For property details, see the [API Center REST API reference](/rest/api/apicenter).


## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* An Azure API Management instance, in the same or a different subscription. The instance must be in the same directory. 

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]
Select
    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.


## Add a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Assign the managed identity the API Management Service Reader role

[!INCLUDE [configure-managed-identity-apim-reader](includes/configure-managed-identity-apim-reader.md)]

## Integrate an API Management instance 

You can create an integration to an API Management instance using the portal.

#### [Portal](#tab/portal)

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments**.
1. Select **Integrations (preview)** > **+ New integration**.
1. In the **Integrate your Azure API Management Service** page:
    1. Select the **Subscription**, **Resource group**, and **Azure API Management service** that you want to integrate.
    1. In **Integration details**, enter an identifier.
    1. In **Environment details**, enter an **Environment title** (name), **Environment type**, and optional **Environment description**.
    1. In **API details**, select a **Lifecycle stage** for the synchronized APIs. (You can update this value for your APIs after they're added to your API center.) Also, select whether to synchronize API definitions.
1. Select **Create**.

:::image type="content" source="media/synchronize-api-management-apis/link-api-management-service.png" alt-text="Screenshot of integrated an Azure API Management Service in the portal.":::

The environment is added in your API center. The API Management APIs are imported to the API center inventory.

:::image type="content" source="media/synchronize-api-management-apis/environment-link-list.png" alt-text="Screenshot of environment list in the portal.":::
---

## Delete an integration

While an API Management instance is integrated, you can't delete synchronized APIs from your API center. If you need to, you can delete the integration. When you delete an integration:

* All the synchronized API Management APIs in your API center inventory are deleted
* The environment and deployments associated with the API Management instance are deleted

To delete an API Management integration:

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments** > **Integrations (preview)**.
1. Select the integration, and then select **Delete** (trash can icon). 

## Related content
 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Import APIs from API Management to your Azure API center](import-api-management-apis.md)
* [Azure API Management documentation](../api-management/index.yml)
