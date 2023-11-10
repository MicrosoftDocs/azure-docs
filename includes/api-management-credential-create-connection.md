---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 11/09/2023
ms.author: danlep
---
1. On the **Connection** tab, complete the steps for your connection:
    1. Enter a **Connection name**, then select **Save**. 
    1. Under **Step 2: Login to your connection** (for authorization code grant type), select the link to login to the credential provider. Complete steps there to authorize access, and return to API Management. 
    1. Under **Step 3: Determine who will have access to this connection (Access policy)**, select **+ Add**. Select from **Service principal**, **Users**, or **Group** to narrow the search to specific Microsoft Entra identity types.
    1. In the **Select item** window, search for an identity to add and check the selection box. Optionally search to find other identities. When your list is complete, click **Select**. 
    1. Select **Complete**.
    
        The new connection appears in the list of connections, and shows a status of **Connected**.

    :::image type="content" source="media/api-management-credential-create-connection/create-connection.png" alt-text="Screenshot of list of credential connections in the portal.":::

If you want to create another connection for the credential provider, complete the preceding steps.
