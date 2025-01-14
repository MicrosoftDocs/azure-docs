---
title: Synchronize APIs from Azure API Management instance
description: Link an API Management instance to Azure API Center for automatic synchronization of APIs to the inventory.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/30/2024
ms.author: danlep 
ms.custom: devx-track-azurecli
# Customer intent: As an API program manager, I want to integrate my Azure API Management instance with my API center and synchronize API Management APIs to my inventory.
---

# Synchronize APIs from an API Management instance

This article shows how to create a link to an API Management instance so that the instances's APIs are continuously kept up to date in your [API center](overview.md) inventory. 

## About linking an API Management instance

Although you can use the Azure CLI to [import](import-api-management-apis.md) APIs on demand from Azure API Management to Azure API Center, linking an API Management instance enables continuous synchronization so that the API inventory stays up to date.

When you link an API Management instance as an API source, the following happens:

1. All APIs, and optionally API definitions (specs), from the API Management instance are added to the API center inventory.
1. You configure an [environment](key-concepts.md#environment) of type *Azure API Management* in the API center. 
1. An associated [deployment](key-concepts.md#deployment) is created for each synchronized API definition from API Management. 

API Management APIs automatically synchronize to the API center whenever existing APIs' settings change (for example, new versions are added), new APIs are created, or APIs are deleted. This synchronization is one-way from API Management to your Azure API center, meaning API updates in the API center aren't synchronized back to the API Management instance.

> [!NOTE]
> * There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=/azure/api-center/toc.json&bc=/azure/api-center/breadcrumb/toc.json#api-center-limits) for the number of linked API Management instances (API sources).
> * API updates in API Management typically synchronize to your API center within minutes but synchronization can take up to 24 hours.

### Entities synchronized from API Management

You can add or update metadata properties and documentation in your API center to help stakeholders discover, understand, and consume the synchronized APIs. Learn more about Azure API Center's [built-in and custom metadata properties](add-metadata-properties.md).

The following table shows entity properties that can be modified in Azure API Center and properties that are determined based on their values in a linked Azure API Management instance. Also, entities' resource or system identifiers in Azure API Center are generated automatically and can't be modified.

| Entity       | Properties configurable in API Center                     | Properties determined in API Management                                           |
|--------------|-----------------------------------------|-----------------|
| API          | summary<br/>lifecycleStage<br/>termsOfService<br/>license<br/>externalDocumentation<br/>customProperties    | title<br/>description<br/>kind                   |
| API version  | lifecycleStage      | title                                                |
| Environment  | title<br/>description<br/>kind</br>server.managementPortalUri<br/>onboarding<br/>customProperties      | server.type
| Deployment   |  title<br/>description<br/>server<br/>state<br/>customProperties    |      server.runtimeUri |

For property details, see the [Azure API Center REST API reference](/rest/api/apicenter).


## Prerequisites

* An API center in your Azure subscription. If you haven't created one, see [Quickstart: Create your API center](set-up-api-center.md).

* An Azure API Management instance, in the same or a different subscription. The instance must be in the same directory. 

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.


## Add a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Assign the managed identity the API Management Service Reader role

[!INCLUDE [configure-managed-identity-apim-reader](includes/configure-managed-identity-apim-reader.md)]

## Link an API Management instance 

You can link an API Management instance using the portal.

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments**.
1. Select **Links (preview)** > **+ New link**.
1. In the **Link your Azure API Management Service** page:
    1. Select the **Subscription**, **Resource group**, and **Azure API Management service** that you want to link.
    1. In **Link details**, enter an identifier.
    1. In **Environment details**, enter an **Environment title** (name), **Environment type**, and optional **Environment description**.
    1. In **API details**, select a **Lifecycle stage** for the synchronized APIs. (You can update this value for your APIs after they're added to your API center.) Also, select whether to synchronize API definitions.
1. Select **Create**.

:::image type="content" source="media/synchronize-api-management-apis/link-api-management-service.png" alt-text="Screenshot of linking an Azure API Management Service in the portal.":::

The environment is added in your API center. The API Management APIs are imported to the API center inventory.

:::image type="content" source="media/synchronize-api-management-apis/environment-link-list.png" alt-text="Screenshot of environment list in the portal.":::


## Delete a link

While an API Management instance is linked, you can't delete synchronized APIs from your API center. If you need to, you can delete the link. When you delete a link:

* The synchronized API Management APIs in your API center inventory are deleted
* The environment and deployments associated with the API Management instance are deleted

To delete an API Management link:

1. In the [portal](https://portal.azure.com), navigate to your API center.
1. Under **Assets**, select **Environments** > **Link (preview)**.
1. Select the link, and then select **Delete** (trash can icon). 

## Related content
 
* [Manage API inventory with Azure CLI commands](manage-apis-azure-cli.md)
* [Import APIs from API Management to your Azure API center](import-api-management-apis.md)
* [Azure API Management documentation](../api-management/index.yml)
