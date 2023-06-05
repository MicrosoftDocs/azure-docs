---
ms.service: api-management
ms.topic: include
author: dlepow
ms.author: danlep
ms.date: 02/24/2023
ms.custom: 
---

## Test your GraphQL API

1. Navigate to your API Management instance.
1. From the side navigation menu, under the **APIs** section, select **APIs**.
1. Under **All APIs**, select your GraphQL API.
1. Select the **Test** tab to access the test console. 
1. Under **Headers**:
    1. Select the header from the **Name** drop-down menu.
    1. Enter the value to the **Value** field.
    1. Add more headers by selecting **+ Add header**.
    1. Delete headers using the **trashcan icon**.
1. If you've added a product to your GraphQL API, apply product scope under **Apply product scope**.
1. Under **Query editor**, either:
    1. Select at least one field or subfield from the list in the side menu. The fields and subfields you select appear in the query editor.
    1. Start typing in the query editor to compose a query.
    
        :::image type="content" source="media/api-management-graphql-test/test-graphql-query.png" alt-text="Screenshot of adding fields to the query editor.":::

1. Under **Query variables**, add variables to reuse the same query or mutation and pass different values.
1. Select **Send**.
1. View the **Response**.

    :::image type="content" source="media/api-management-graphql-test/graphql-query-response.png" alt-text="Screenshot of viewing the test query response.":::

1. Repeat preceding steps to test different payloads.
1. When testing is complete, exit test console.