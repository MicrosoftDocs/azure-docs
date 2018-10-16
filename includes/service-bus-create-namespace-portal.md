---
 title: include file
 description: include file
 services: service-bus-messaging
 author: spelluru
 ms.service: service-bus-messaging
 ms.topic: include
 ms.date: 07/03/2018
 ms.author: spelluru
 ms.custom: include file
---

To begin using Service Bus messaging entities in Azure, you must first create a namespace with a name that is unique across Azure. A namespace provides a scoping container for addressing Service Bus resources within your application.

To create a namespace:

1. Sign in to the [Azure portal][Azure portal].
2. In the left navigation pane of the portal, click **+ Create a resource**, then click **Integration**, and then click **Service Bus**.
3. In the **Create namespace** dialog, enter a namespace name. The system immediately checks to see if the name is available.
4. After making sure the namespace name is available, choose the pricing tier (Basic, Standard, or Premium). If you want to use [topics and subscriptions](../articles/service-bus-messaging/service-bus-queues-topics-subscriptions.md#topics-and-subscriptions), make sure to choose either Standard or Premium. Topics/subscriptions are not supported in the Basic pricing tier.
5. In the **Subscription** field, choose an Azure subscription in which to create the namespace.
6. In the **Resource group** field, choose an existing resource group in which the namespace will live, or create a new one.      
7. In **Location**, choose the country or region in which your namespace should be hosted.
   
    ![Create namespace][create-namespace]
8. Click **Create**. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.

### Obtain the management credentials

Creating a new namespace automatically generates an initial Shared Access Signature (SAS) rule with an associated pair of primary and secondary keys that each grant full control over all aspects of the namespace. See [Service Bus authentication and authorization](../articles/service-bus-messaging/service-bus-authentication-and-authorization.md) for information about how to create further rules with more constrained rights for regular senders and receivers. To copy the initial rule, follow these steps: 

1. Click **All resources**, then click the newly created namespace name.
2. In the namespace window, click **Shared access policies**.
3. In the **Shared access policies** screen, click **RootManageSharedAccessKey**.
   
    ![connection-info][connection-info]
4. In the **Policy: RootManageSharedAccessKey** window, click the copy button next to **Primary Connection String**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    ![connection-string][connection-string]

5. Repeat the previous step, copying and pasting the value of **Primary key** to a temporary location for later use.

<!--Image references-->

[create-namespace]: ./media/service-bus-create-namespace-portal/create-namespace.png
[connection-info]: ./media/service-bus-create-namespace-portal/connection-info.png
[connection-string]: ./media/service-bus-create-namespace-portal/connection-string.png
[Azure portal]: https://portal.azure.com
