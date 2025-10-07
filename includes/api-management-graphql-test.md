---
ms.service: azure-api-management
ms.topic: include
author: dlepow
ms.author: danlep
ms.date: 10/07/2025
---

## Test your GraphQL API

1. Go to your API Management instance.
1. In the left pane, in the **APIs** section, select **APIs**.
1. Under **All APIs**, select your GraphQL API.
1. Select the **Test** tab to access the test console. 
1. Under **Headers**:
    1. Select the header from the **Name** menu.
    1. Enter the value in the **Value** box.
    1. Add more headers by selecting **Add header**.
    1. Delete headers by using the recycle bin button.
1. If you've added a product to your GraphQL API, add a product scope under **Apply product scope**.
1. In **Query editor**, do one of the following:
    1. Select at least one field or subfield from the list in the menu to the left of the editor. The fields and subfields you select appear in the query editor.
    1. Start typing in the query editor to compose a query.
    
        :::image type="content" source="media/api-management-graphql-test/test-graphql-query.png" alt-text="Screenshot of the query editor." lightbox="media/api-management-graphql-test/test-graphql-query.png":::

1. Under **Query variables**, add variables to reuse the same query or mutation and pass different values.
1. Select **Send**.
1. View the **Response**.

    :::image type="content" source="media/api-management-graphql-test/graphql-query-response.png" alt-text="Screenshot of the test query response.":::

1. Repeat the preceding steps to test different payloads.
1. When you're done testing, exit the test console.