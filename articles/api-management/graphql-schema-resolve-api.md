---
title: Import GraphQL schema and set up field resolvers | Microsoft Docs
titleSuffix: 
description: Import a GraphQL schema to API Management and configure a policy to resolve a GraphQL query using an HTTP-based data source.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/17/2022
ms.custom: event-tier1-build-2022
---

# Import a GraphQL schema and set up field resolvers
 

[!INCLUDE [api-management-graphql-intro.md](../../includes/api-management-graphql-intro.md)]

[!INCLUDE [preview-callout-graphql.md](./includes/preview/preview-callout-graphql.md)]

In this article, you'll:
> [!div class="checklist"]
> * Import a GraphQL schema to your API Management instance
> * Set up a resolver for a GraphQL query using an existing HTTP endpoints
> * Test your GraphQL API

If you want to expose an existing GraphQL endpoint as an API, see [Import a GraphQL API](graphql-api.md).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A valid GraphQL schema file with the `.graphql` extension. 
- A backend GraphQL endpoint is optional for this scenario.


[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add a GraphQL schema

1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Define a new API**, select the **Synthetic GraphQL** icon.

    :::image type="content" source="media/graphql-schema-resolve-api/import-graphql-api.png" alt-text="Screenshot of selecting Synthetic GraphQL icon from list of APIs.":::

1. In the dialog box, select **Full** and complete the required form fields.

    :::image type="content" source="media/graphql-schema-resolve-api/create-from-graphql-schema.png" alt-text="Screenshot of fields for creating a GraphQL API.":::

    | Field | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | Raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **Fallback GraphQL endpoint** | For this scenario, optionally enter a URL with a GraphQL API endpoint name. API Management passes GraphQL queries to this endpoint when a custom resolver isn't set for a field.    |
    | **Upload schema file** | Select to browse and upload a valid GraphQL schema file with the `.graphql` extension. |
    | Description | Add a description of your API. |
    | URL scheme | Select **HTTP**, **HTTPS**, or **Both**. Default selection: *Both*. |
    | **API URL suffix**| Add a URL suffix to identify this specific API in this API Management instance. It has to be unique in this API Management instance. |
    | **Base URL** | Uneditable field displaying your API base URL |
    | **Tags** | Associate your GraphQL API with new or existing tags. |
    | **Products** | Associate your GraphQL API with a product to publish it. |
    | **Gateways** | Associate your GraphQL API with existing gateways. Default gateway selection: *Managed*. |
    | **Version this API?** | Select to apply a versioning scheme to your GraphQL API. |
 
1. Select **Create**.

1. After the API is created, browse the schema on the **Design** tab, in the **Frontend** section.

## Configure resolver

Configure the [set-graphql-resolver](graphql-policies.md#set-graphql-resolver) policy to map a field in the schema to an existing HTTP endpoint. 

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
1. On the **Design** tab of your GraphQL API, select **All operations**.
1. In the **Backend** processing section, select **+ Add policy**.
1. Configure the `set-graphql-resolver` policy to resolve the *users* query using an HTTP data source.

    For example, the following `set-graphql-resolver` policy retrieves the *users* field by using a `GET` call on an existing HTTP data source.

    ```xml
    <set-graphql-resolver parent-type="Query" field="users">
        <http-data-source>
            <http-request>
                <set-method>GET</set-method>
                <set-url>https://myapi.contoso.com/users</set-url>
            </http-request>
        </http-data-source>
    </set-graphql-resolver>
    ```
1. To resolve data for other fields in the schema, repeat the preceding step. 
1. Select **Save**.

[!INCLUDE [api-management-graphql-test.md](../../includes/api-management-graphql-test.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
