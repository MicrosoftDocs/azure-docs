---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
ms.author: crdun
---

By default, APIs in a Mobile Apps back end can be invoked anonymously. Next, you need to restrict access to only authenticated clients.  

* **Node.js back end (via the Azure portal)** :  

    In your Mobile Apps settings, click **Easy Tables** and select your table. Click **Change permissions**, select **Authenticated access only** for all permissions, and then click **Save**.
* **.NET back end (C#)**:  

    In the server project, navigate to **Controllers** > **TodoItemController.cs**. Add the `[Authorize]` attribute to the **TodoItemController** class, as follows. To restrict access only to specific methods, you can also apply this attribute just to those methods instead of the class. Republish the server project.

        [Authorize]
        public class TodoItemController : TableController<TodoItem>

* **Node.js backend (via Node.js code)** :  

    To require authentication for table access, add the following line to the Node.js server script:

        table.access = 'authenticated';

    For more details, see [How to: Require authentication for access to tables](../articles/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#howto-tables-auth). To learn how to download the quickstart code project from your site, see [How to: Download the Node.js backend quickstart code project using Git](../articles/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#download-quickstart).
