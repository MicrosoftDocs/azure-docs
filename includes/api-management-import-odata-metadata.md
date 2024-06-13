---
author: dlepow
ms.service: api-management
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/06/2024
ms.author: danlep
---
## Import OData metadata

1. In the left menu, select **APIs** > **+ Add API**.
1. Under **Create from definition**, select **OData**.

    :::image type="content" source="media/api-management-import-odata-from-metadata/odata-api.png" alt-text="Screenshot of creating an API from an OData description in the portal." :::
1. Enter API settings. You can update your settings later by going to the **Settings** tab of the API. 

    1. In **OData specification**, enter a URL for an OData metadata endpoint, typically the URL to the service root, appended with `/$metadata`. Alternatively, select a local OData XML file to import.

    1. Enter remaining settings to configure your API. These settings are explained in the [Import and publish your first API](../articles/api-management/import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

    The API is added to the **APIs** list. The entity sets and functions that are exposed in the OData metadata description appear on the API's **Entity sets and functions** tab. 

    :::image type="content" source="media/api-management-import-odata-from-metadata/odata-schema.png" alt-text="Screenshot of OData entity sets and functions in the portal." lightbox="media/api-management-import-odata-from-metadata/odata-schema.png" :::    

## Update the OData schema

You can access an editor in the portal to view your API's OData schema. If the API changes, you can also update the schema in API Management from a file or an OData service endpoint.

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > your OData API.
1. On the **Entity sets and functions** tab, select the context menu (**...**) next to an entity set or function, and select **Edit**.

    :::image type="content" source="media/api-management-import-odata-from-metadata/edit-schema.png" alt-text="Screenshot of context menu for an OData entity set in the portal." lightbox="media/api-management-import-odata-from-metadata/edit-schema.png":::

1. Review the schema. If you want to update it, select **Update from file** or **Update schema from endpoint**.

    :::image type="content" source="media/api-management-import-odata-from-metadata/odata-schema-update.png" alt-text="Screenshot of schema editor for OData API in the portal." lightbox="media/api-management-import-odata-from-metadata/odata-schema-update.png":::    

## Test your OData API

1. In the left menu, select **APIs** > your OData API.
1. On the **Entity sets and functions** tab, select the context menu (**...**) next to an entity set or function, and select **Test**.

    :::image type="content" source="media/api-management-import-odata-from-metadata/test-entity.png" alt-text="Screenshot of Test option on context menu for an OData entity set in the portal." lightbox="media/api-management-import-odata-from-metadata/test-entity.png":::

1. In the test console, enter template parameters, query parameters, and headers for your test, and select **Test**. [Learn more](../articles/api-management/import-api-from-oas.md#test-the-new-api-in-the-portal) about testing an API in the portal.


## Secure your OData API

Secure your OData API by applying both existing [authentication and authorization policies](../articles/api-management/api-management-policies.md#authentication-and-authorization) and an [OData validation policy](../articles/api-management/validate-odata-request-policy.md) to protect against attacks through OData API requests.

> [!TIP]
> In the portal, configure policies for your OData API on the **API policies** tab.
