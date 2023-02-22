---
ms.service: api-management
ms.topic: include
author: dlepow
ms.author: danlep
ms.date: 05/10/2022
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

## Test a subscription
If your GraphQL schema includes a subscription, you can test it in the test console

1. Ensure that your API allows a WebSocket URL scheme (**WS** or **WSS**) that's appropriate for your API. You can enable this setting on the **Settings** tab.
1. Set up a subscription query in the query editor, and then select **Connect** to establish a WebSocket connection to the backend service. 

    :::image type="content" source="media/api-management-graphql-test/test-graphql-subscription.png" alt-text="Screenshot of a subscription query in the query editor.":::
1. Review connection details in the **Subscription** pane. 

    :::image type="content" source="media/api-management-graphql-test/graphql-websocket-connection.png" alt-text="Screenshot of Websocket connection in the portal.":::
    
1. Subscribed events appear in the **Subscription** pane. The WebSocket connection is maintained until you disconnect it or you connect to a new WebSocket subscription.  

    :::image type="content" source="media/api-management-graphql-test/graphql-subscription-event.png" alt-text="Screenshot of GraphQL subscription events in the portal.":::
