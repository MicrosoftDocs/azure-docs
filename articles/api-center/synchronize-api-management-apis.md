---
title: Synchronize APIs from Azure API Management source
description: Link an API Management instance to Azure API Center for automatic synchronization of APIs from API Management to the inventory.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/22/2024
ms.author: danlep 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to link my Azure API Management instance to my API center and synchronize API Management APIs to my inventory.
---

# Link an API Management instance to synchronize APIs to your API center

This article shows how to create a link (preview) to an API Management instance so that the instances's APIs are synchronized in your [API center](overview.md).

APIs in a linked API Management instance are continuously kept up to date in your API center inventory. This makes all of the API Management APIs easily discoverable and accessible to developers, API program managers, and other stakeholders.

## About linking an API Management instance

Although you can use the Azure CLI to [import](import-api-management-apis.md) APIs on demand from Azure API Management to Azure API Center, linking an API Management instance enables continuous synchronization so that the API inventory stays up to date.

When you create a link to an API Management instance, the following happens:

* All APIs, and optionally API definitions, from the API Management instance are added to the API center inventory.
* You configure an [environment](key-concepts.md#environment) of type *Azure API Management* in the API center. An associated [deployment](key-concepts.md#deployment) is created for each synchronized API definition from API Management. 

API Management APIs automatically synchronize to the API center whenever existing APIs' settings change, new versions are added, new APIs are created, or APIs are deleted. This synchronization is one-way from API Management to your Azure API center, meaning API updates in the API center aren't synchronized back to the API Management instance.

> [!NOTE]
> * Some API updates in API Management can take a few minutes to synchronize to your API center.
> * Links to API Management instances are subject to [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#api-center-limits) on number of linked API sources and synchronization frequency.


### Entities synchronized from API Management

You can add or update API metadata and documentation in your API center to help stakeholders discover, understand, and consume the synchronized APIs. Learn more about Azure API Center's [built-in and custom metadata properties](add-metadata-properties.md).

Certain properties of synchronized APIs and other entities are configured automatically in the API center and are read-only, as shown in the following table:

| Entity       | Read-only properties in API center                     |
|--------------|--------------------------------------------------------|
| API          | • title<br/>• description<br/>• kind                   |
| API version  | • title                                                |
| API definition   | N/A                                                    |
| Deployment   | • server.runtimeUri<br/>• environmentId<br/>• definitionId |
| Environment  | • server.type

For property details, see the [API Center REST API reference](/rest/api/resource-manager/apicenter).


## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more instances of Azure API Management, in the same or a different subscription. The resources must be in the same directory. 

* One or more APIs managed in your API Management instance that you want to synchronize to your API center. 

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

## Link an API Management instance 

You can create a link to an API Management instance using the portal.

#### [Portal](#tab/portal)

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments**.
1. Select **Links (preview)** > **+ Create a link**.
1. In the **Link your Azure API Management Service** page:
    1. Select the **Subscription**, **Resource group**, and **Azure API Management service** that you want to link.
    1. In **Link details**, enter a link identifier.
    1. In **Environment details**, enter an **Environment title** (name), **Environment type**, and optional **Environment description**.
    1. In **API details**, select a **Lifecycle** stage for all the synchronized APIs. (You can change this value for some or all APIs after they're added to your API center.) Also, select whether to synchronize API definitions.
1. Select **Create**.

:::image type="content" source="media/synchronize-api-management-apis/link-api-management-service.png" alt-text="Screenshot of the Link your API Management service page.":::

A linked environment is added in your API center. The API Management APIs are imported to the API center inventory.

:::image type="content" source="media/synchronize-api-management-apis/environment-link-list.png" alt-text="Screenshot of link to API Management in the portal.":::
---

## Unlink an API Management instance

While an API Management instance is linked, you can't deleted synchronized APIs from your API center. If you need to, you can unlink an API Management instance. When you unlink an API Management instance from your API center:

* All the API Management APIs in your API center inventory are deleted
* The environment associated with the API Management instance is deleted

To unlink an API Management instance:

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments** > **Links (preview)**.
1. Select the link, and then select **Delete** (trash can icon). 

## Related content
 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Import APIs from API Management to your Azure API center](import-api-management-apis.md)
* [Azure API Management documentation](../api-management/index.yml)
