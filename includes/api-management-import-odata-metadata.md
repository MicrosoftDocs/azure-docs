---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 07/21/2023
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

    The API is added to the **APIs** list. The entity sets and functions that are exposed in the OData metadata description appear on the API's **Schema** tab. 

    :::image type="content" source="media/api-management-import-odata-from-metadata/odata-schema.png" alt-text="Screenshot of schema of OData API in the portal." :::    

## Update the OData schema

You can access an editor in the portal to view your API's OData schema. If the API changes, you can also update the schema in API Management from a file or an OData service endpoint.

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, select **APIs** > your OData API.
1. On the **Schema** tab, select the edit (**\</>**) icon.
1. Review the schema. If you want to update it, select **Update from file** or **Update schema from endpoint**.

    :::image type="content" source="media/api-management-import-odata-from-metadata/odata-schema-update.png" alt-text="Screenshot of schema editor for OData API in the portal." :::    

## Secure your OData API

Secure your OData API by applying both existing [access control policies](../articles/api-management/api-management-policies.md#access-restriction-policies) and an [OData validation policy](../articles/api-management/validate-odata-request-policy.md) to protect against attacks through OData API requests.

> [!TIP]
> In the portal, configure policies for your OData API on the **API policies** tab.
