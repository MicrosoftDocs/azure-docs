---
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 11/09/2018
ms.author: clemensv
---
1. Sign in to the [Azure portal][Azure portal].
1. Select **Create a resource**. Then, select **Integration** > **Relay**. If you don't see **Relay** in the list, select **See All** in the top-right corner.
1. Select **Create**, and enter a namespace name in the **Name** field. Azure portal checks to see if the name is available.
1. Choose an Azure subscription in which to create the namespace.
1. For [Resource group](../articles/azure-resource-manager/management/manage-resource-groups-portal.md), choose an existing resource group in which to place the namespace, or create a new one.  
1. Select the country or region in which your namespace should be hosted.

    ![Create namespace][create-namespace]

1. Select **Create**. The Azure portal creates your namespace and enables it. After a few minutes, the system provisions resources for your account.

### Get management credentials

1. Select **All resources**, and then choose the newly created namespace name.
1. Select **Shared access policies**.  
1. Under **Shared access policies**, select **RootManageSharedAccessKey**.
1. Under **SAS Policy: RootManageSharedAccessKey**, select the **Copy** button next to **Primary Connection String**. This action copies the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
1. Repeat the preceding step to copy and paste the value of **Primary key** to a temporary location for later use.  

    ![connection-string][connection-string]

<!--Image references-->

[create-namespace]: ./media/relay-create-namespace-portal/create-namespace-vs2019.png
[connection-info]: ./media/relay-create-namespace-portal/connection-info.png
[connection-string]: ./media/relay-create-namespace-portal/connection-string-vs2019.png
[Azure portal]: https://portal.azure.com
