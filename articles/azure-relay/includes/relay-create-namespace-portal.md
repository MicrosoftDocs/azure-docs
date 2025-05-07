---
author: spelluru
ms.service: azure-relay
ms.topic: include
ms.date: 12/04/2024
ms.author: spelluru
---
1. Sign in to the [Azure portal].
1. Select **All services** on the left menu. Select **Integration**, search for **Relays**, move the mouse over **Relays**, and then select **Create**. 

    :::image type="content" source="./media/relay-create-namespace-portal/select-relay-create.png" alt-text="Screenshot showing the selection of Relays -> Create button.":::
1. On the **Create namespace** page, follow these steps: 
    1. Choose an Azure subscription in which to create the namespace.
    1. For [Resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md), choose an existing resource group in which to place the namespace, or create a new one.  
    1. Enter a name for the Relay namespace. 
    1. Select the region in which your namespace should be hosted.
    1. Select **Review + create** at the bottom of the page.

        :::image type="content" source="./media/relay-create-namespace-portal/create-namespace-page.png" alt-text="Screenshot showing the Create namespace page.":::
    1. On the **Review + create** page, select **Create**. 
    1. After a few minutes, you see the **Relay** page for the namespace. 

        :::image type="content" source="./media/relay-create-namespace-portal/home-page.png" alt-text="Screenshot showing the home page for Relay namespace.":::

### Get management credentials

1. On the **Relay** page, select **Shared access policies** on the left menu.
1. On the **Shared access policies** page, select **RootManageSharedAccessKey**.
1. Under **SAS Policy: RootManageSharedAccessKey**, select the **Copy** button next to **Primary Connection String**. This action copies the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
1. Repeat the preceding step to copy and paste the value of **Primary key** to a temporary location for later use.  

    :::image type="content" source="./media/relay-create-namespace-portal/connection-info.png" alt-text="Screenshot showing the connection info for Relay namespace.":::

<!--Image references-->

[connection-info]: ./media/relay-create-namespace-portal/connection-info.png
[Azure portal]: https://portal.azure.com
