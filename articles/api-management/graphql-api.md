---
title: Import a GraphQL API to Azure API Management using the portal | Microsoft Docs
titleSuffix: 
description: Learn how to add an existing GraphQL service as an API in Azure API Management. Manage the API and enable queries to pass through to the GraphQL endpoint.
ms.service: api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 05/17/2022
---

# Import a GraphQL API

[!INCLUDE [api-management-graphql-intro.md](../../includes/api-management-graphql-intro.md)]

In this article, you'll:
> [!div class="checklist"]
> * Learn more about the benefits of using GraphQL APIs.
> * Add a GraphQL API to your API Management instance.
> * Test your GraphQL API.
> * Learn the limitations of your GraphQL API in API Management.

If you want to import a GraphQL schema and set up field resolvers using REST or SOAP API endpoints, see [Import a GraphQL schema and set up field resolvers](graphql-schema-resolve-api.md).

## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- A GraphQL API. 

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Add a GraphQL API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **Define a new API**, select the **GraphQL** icon.

    :::image type="content" source="media/graphql-api/import-graphql-api.png" alt-text="Selecting GraphQL icon from list of APIs":::

1. In the dialog box, select **Full** and complete the required form fields.

    :::image type="content" source="media/graphql-api/create-from-graphql-schema.png" alt-text="Demonstrate fields for creating GraphQL":::

    | Field | Description |
    |----------------|-------|
    | **Display name** | The name by which your GraphQL API will be displayed. |
    | **Name** | Raw name of the GraphQL API. Automatically populates as you type the display name. |
    | **GraphQL API endpoint** | The base URL with your GraphQL API endpoint name. <br /> For example: *`https://example.com/your-GraphQL-name`*. You can also use the common ["Star Wars" GraphQL endpoint](https://swapi-graphql.netlify.app/.netlify/functions/index) as a demo. |
    | **Upload schema** | Optionally select to browse and upload your schema file to replace the schema retrieved from the GraphQL endpoint (if available).  |
    | **Description** | Add a description of your API. |
    | **URL scheme** | Select **HTTP**, **HTTPS**, or **Both**. Default selection: *Both*. |
    | **API URL suffix**| Add a URL suffix to identify this specific API in this API Management instance. It has to be unique in this API Management instance. |
    | **Base URL** | Uneditable field displaying your API base URL |
    | **Tags** | Associate your GraphQL API with new or existing tags. |
    | **Products** | Associate your GraphQL API with a product to publish it. |
    | **Gateways** | Associate your GraphQL API with existing gateways. Default gateway selection: *Managed*. |
    | **Version this API?** | Select to apply a versioning scheme to your GraphQL API. |

1. Select **Create**.
1. After the API is created, browse the schema on the **Design** tab, in the **Frontend** section.
       :::image type="content" source="media/graphql-api/explore-schema.png" alt-text="Explore the GraphQL schema in the portal":::

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

* Only GraphQL pass through is supported. 
* A single GraphQL API in API Management corresponds to only a single GraphQL backend endpoint.

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps
> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
