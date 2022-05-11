---
title: Import GraphQL schema and set up custom resolvers | Microsoft Docs
titleSuffix: 
description: Import a GraphQL schema to API Management and configure a policy to resolve GraphQL queries using HTTP-based data sources.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/06/2022
ms.custom: 
---

# Import a GraphQL schema and set up custom field resolution

GraphQL is an open-source, industry-standard query language for APIs. Unlike endpoint-based (or REST-style) APIs designed around actions over resources, GraphQL APIs support a broader set of use cases and focus on data types, schemas, and queries.

API Management tackles the security, authentication, and authorization challenges that come with publishing GraphQL APIs. Using API Management to expose your GraphQL APIs, you can:
* Add a GraphQL service as APIs via Azure portal.  
* Secure GraphQL APIs by applying both existing access control policies and a [new policy](graphql-validation-policies.md) to secure and protect against GraphQL-specific attacks. 
* Explore the schema and run test queries against the GraphQL APIs in the Azure and developer portals. 

[!INCLUDE [preview-callout-graphql.md](./includes/preview/preview-callout-graphql.md)]

In this article, you'll:
> [!div class="checklist"]
> * Import a GraphQL schema to your API Management instance
> * Set up custom resolvers for GraphQL fields using existing HTTP endpoints
> * Test your GraphQL API

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A GraphQL schema. A backend GraphQL endpoint is optional for this scenario.

## Add a GraphQL schma

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Define a new API**, select the **GraphQL** icon.

    :::image type="content" source="media/graphql-schema-resolve-api/import-graphql-api.png" alt-text="Selecting GraphQL icon from list of APIs":::

1. In the dialog box, select **Full** and complete the required form fields.

    :::image type="content" source="media/graphql-schema-resolve-api/create-from-graphql-schema.png" alt-text="Demonstrate fields for creating GraphQL":::

    | Field | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | Raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **GraphQL API endpoint** | For this scenario, optionally enter a URL with a GraphQL API endpoint name. This endpoint can be used to pass through GraphQL queries when you don't configure custom resolvers for all fields.    |
    | **Upload schema file** | Select to browse and upload a valid GraphQL schema file with the `graphql` extension. |
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

## Configure resolvers

Configure the [set-graphql-resolver](graphql-policies.md#SetGraphQLResolver) policy to map a GraphQL endpoint to an existing HTTP endpoint. 

1. On the **Design** tab of your GraphQL API, select **All operations**.
1. In the **Backend** processing section, select **+ Add policy**.
1. Configure `set-graphql-resolver` to resolve the data for a field in the schema. Add an HTTP request and optionally an HTTP response with required policies. 

    For example, the following `set-graphql-resolver` policy retrieves the *users* field from an HTTP data source.

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
1. To resolve data for additional fields, repeat the preceding step. 


## Test your GraphQL API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **All APIs**, select your GraphQL API.
1. Select the **Test** tab to access the Test console. 
1. Under **Headers**:
    1. Select the header from the **Name** drop-down menu.
    1. Enter the value to the **Value** field.
    1. Add more headers by selecting **+ Add header**.
    1. Delete headers using the **trashcan icon**.
1. If you've added a product to your GraphQL API, apply product scope under **Apply product scope**.
1. Under **Query editor**, either:
    1. Select at least one field or subfield from the list in the side menu. The fields and subfields you select appear in the query editor.
    1. Start typing in the query editor to compose a query.
    
        :::image type="content" source="media/graphql-api/test-graphql-query.png" alt-text="Demonstrating adding fields to the query editor":::

1. Under **Query variables**, add variables to reuse the same query or mutation and pass different values.
1. Click **Send**.
1. View the **Response**.

    :::image type="content" source="media/graphql-api/graphql-query-response.png" alt-text="View the test query response":::

1. Repeat preceding steps to test different payloads.
1. When testing is complete, exit test console.

## Limitations

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
