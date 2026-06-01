---
title: Add a Synthetic GraphQL API to Azure API Management | Microsoft Docs
description: Add a synthetic GraphQL API by importing a GraphQL schema to API Management and configuring field resolvers that use HTTP-based data sources.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 10/08/2025
# Customer intent: As an API admin, I want to add a synthetic GraphQL API to API Management so that I can expose it as an API. 
---

# Add a synthetic GraphQL API and set up field resolvers
 
[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

[!INCLUDE [api-management-graphql-intro.md](../../includes/api-management-graphql-intro.md)]

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

In this article, you'll:
> [!div class="checklist"]
> * Import a GraphQL schema to your Azure API Management instance.
> * Set up a resolver for a GraphQL query using an existing HTTP endpoint.
> * Test your GraphQL API.

If you want to expose an existing GraphQL endpoint as an API, see [Import a GraphQL API](graphql-api.md).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A valid GraphQL schema file with the `.graphql` extension. 
- A backend GraphQL endpoint is optional for this scenario.


[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add a GraphQL schema

1. In the left pane, under **APIs**, select **APIs**.
1. Under **Define a new API**, select the **GraphQL** tile.

    :::image type="content" source="media/graphql-api/import-graphql-api.png" alt-text="Screenshot of selecting the GraphQL tile.":::

1. In the dialog box, select **Full**, and then enter values in the required fields, as described in the following table.

    :::image type="content" source="media/graphql-schema-resolve-api/create-from-graphql-schema.png" alt-text="Screenshot of the Create from GraphQL schema page." lightbox="media/graphql-schema-resolve-api/create-from-graphql-schema.png":::

     | Value | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | The raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **GraphQL type** | Select **Synthetic GraphQL** to import from a GraphQL schema file.  |
    | **Fallback GraphQL endpoint** | Optionally enter a URL with a GraphQL API endpoint name. API Management passes GraphQL queries to this endpoint when a custom resolver isn't set for a field.  |
    | **Description** | Add a description of your API. |
    | **URL scheme** | Select a scheme based on your GraphQL endpoint. Select one of the options that includes a WebSocket scheme (**WS** or **WSS**) if your GraphQL API includes the subscription type. The default selection is **HTTP(S)**. |
    | **API URL suffix**| Add a URL suffix to identify the specific API in the API Management instance. Must be unique in the API Management instance. |
    | **Base URL** | Uneditable field displaying your API base URL. |
    | **Tags** | Optionally associate your GraphQL API with new or existing tags. |
    | **Products** | Associate your GraphQL API with a product to publish it. |
    | **Version this API?** | Select the checkbox to apply a versioning scheme to your GraphQL API. |

 
1. Select **Create**.

1. After the API is created, review or modify the schema on the **Schema** tab.

## Configure a resolver

Configure a resolver to map a field in the schema to an existing HTTP endpoint. High-level steps are provided here. For details, see [Configure a GraphQL resolver](configure-graphql-resolver.md).

Suppose you imported the following basic GraphQL schema and want to set up a resolver for the `users` query.

```
type Query {
    users: [User]
}

type User {
    id: String!
    name: String!
}
```

1. In the left pane, under **APIs**, select **APIs**. 
1. Select your GraphQL API.
1. On the **Schema** tab, review the schema for a field in an object type in which you want to configure a resolver. 
    1. Select a field, and then hover the pointer in the left margin. 
    1. Select **Add resolver**.

        :::image type="content" source="media/graphql-schema-resolve-api/add-resolver.png" alt-text="Screenshot of adding a GraphQL resolver in the portal." lightbox="media/graphql-schema-resolve-api/add-resolver.png":::

1. In the **Create resolver** pane:

    1. Update the **Name** property if you want to, optionally enter a **Description**, and confirm or update the **Type** and **Field** selections.
    1. In **Data source**, select **HTTP API**. 

1. In the **Resolver policy** editor, update the `<http-data-source>` element with child elements for your scenario. For example, the following resolver retrieves the `users` field by making a `GET` call to an existing HTTP data source.

    
    ```xml
        <http-data-source>
            <http-request>
                <set-method>GET</set-method>
                <set-url>https://myapi.contoso.com/users</set-url>
            </http-request>
        </http-data-source>
    ```

    :::image type="content" source="media/graphql-schema-resolve-api/configure-resolver-policy.png" alt-text="Screenshot of configuring resolver a policy in the portal." lightbox="media/graphql-schema-resolve-api/configure-resolver-policy.png":::

1. Select **Create**. 
1. To resolve data for another field in the schema, repeat the preceding steps to create another resolver. 

> [!TIP]
> As you edit a resolver policy, select **Run Test** to check the output from the data source, which you can validate against the schema. If errors occur, the response includes troubleshooting information. 

[!INCLUDE [api-management-graphql-test.md](../../includes/api-management-graphql-test.md)]

## Secure your GraphQL API

Secure your GraphQL API by applying both existing [authentication and authorization policies](api-management-policies.md#authentication-and-authorization) and a [GraphQL validation policy](validate-graphql-request-policy.md) to protect against GraphQL-specific attacks.


[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
