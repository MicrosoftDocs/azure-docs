---
title: Add a synthetic GraphQL API to Azure API Management | Microsoft Docs
titleSuffix: 
description: Add a synthetic GraphQL API by importing a GraphQL schema to API Management and configuring field resolvers that use HTTP-based data sources.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/31/2023
ms.custom: event-tier1-build-2022
---

# Add a synthetic GraphQL API and set up field resolvers
 

[!INCLUDE [api-management-graphql-intro.md](../../includes/api-management-graphql-intro.md)]

In this article, you'll:
> [!div class="checklist"]
> * Import a GraphQL schema to your API Management instance
> * Set up a resolver for a GraphQL query using an existing HTTP endpoint
> * Test your GraphQL API

If you want to expose an existing GraphQL endpoint as an API, see [Import a GraphQL API](graphql-api.md).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A valid GraphQL schema file with the `.graphql` extension. 
- A backend GraphQL endpoint is optional for this scenario.


[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add a GraphQL schema

1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Define a new API**, select the **GraphQL** icon.

    :::image type="content" source="media/graphql-api/import-graphql-api.png" alt-text="Screenshot of selecting GraphQL icon from list of APIs.":::

1. In the dialog box, select **Full** and complete the required form fields.

    :::image type="content" source="media/graphql-schema-resolve-api/create-from-graphql-schema.png" alt-text="Screenshot of fields for creating a GraphQL API.":::

     | Field | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | Raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **GraphQL type** | Select **Synthetic GraphQL** to import from a GraphQL schema file.  |
    | **Fallback GraphQL endpoint** | Optionally enter a URL with a GraphQL API endpoint name. API Management passes GraphQL queries to this endpoint when a custom resolver isn't set for a field.  |
    | **Description** | Add a description of your API. |
    | **URL scheme** |  Make a selection based on your GraphQL endpoint. Select one of the options that includes a WebSocket scheme (**WS** or **WSS**) if your GraphQL API includes the subscription type. Default selection: *HTTP(S)*. |
    | **API URL suffix**| Add a URL suffix to identify this specific API in this API Management instance. It has to be unique in this API Management instance. |
    | **Base URL** | Uneditable field displaying your API base URL |
    | **Tags** | Associate your GraphQL API with new or existing tags. |
    | **Products** | Associate your GraphQL API with a product to publish it. |
    | **Version this API?** | Select to apply a versioning scheme to your GraphQL API. |

 
1. Select **Create**.

1. After the API is created, browse or modify the schema on the **Design** tab.

## Configure resolver

Configure a resolver to map a field in the schema to an existing HTTP endpoint. High level steps are provided here. For details, see [Configure a GraphQL resolver](configure-graphql-resolver.md).

Suppose you imported the following basic GraphQL schema and wanted to set up a resolver for the *users* query.

```
type Query {
    users: [User]
}

type User {
    id: String!
    name: String!
}
```

1. From the side navigation menu, under the **APIs** section, select **APIs** > your GraphQL API.
1. On the **Schema** tab, review the schema for a field in an object type where you want to configure a resolver. 
    1. Select a field, and then in the left margin, hover the pointer. 
    1. Select **+ Add Resolver**

        :::image type="content" source="media/graphql-schema-resolve-api/add-resolver.png" alt-text="Screenshot of adding a GraphQL resolver in the portal.":::

1. On the **Create Resolver** page:

    1. Update the **Name** property if you want to, optionally enter a **Description**, and confirm or update the **Type** and **Field** selections.
    1. In **Data source**, select **HTTP API**. 

1. In the **Resolver policy** editor, update the `<http-data-source>` element with child elements for your scenario. For example, the following resolver retrieves the *users* field by making a `GET` call to an existing HTTP data source.

    
    ```xml
        <http-data-source>
            <http-request>
                <set-method>GET</set-method>
                <set-url>https://myapi.contoso.com/users</set-url>
            </http-request>
        </http-data-source>
    ```

    :::image type="content" source="media/graphql-schema-resolve-api/configure-resolver-policy.png" alt-text="Screenshot of configuring resolver policy in the portal.":::
1. Select **Create**. 
1. To resolve data for another field in the schema, repeat the preceding steps to create a resolver. 

> [!TIP]
> As you edit a resolver policy, select **Run Test** to check the output from the data source, which you can validate against the schema. If errors occur, the response includes troubleshooting information. 

[!INCLUDE [api-management-graphql-test.md](../../includes/api-management-graphql-test.md)]

## Secure your GraphQL API

Secure your GraphQL API by applying both existing [access control policies](api-management-policies.md#access-restriction-policies) and a [GraphQL validation policy](validate-graphql-request-policy.md) to protect against GraphQL-specific attacks.


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
