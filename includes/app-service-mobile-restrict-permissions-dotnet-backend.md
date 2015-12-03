
By default, APIs in a Mobile App backend can be invoked anonymously. Next, you need to restrict access to only authenticated clients.  

+ **Node.js backend (via portal)** :  
	
	In your Mobile App's **Settings**, click **Easy Tables** and select your table. Click **Change permissions**, select **Authenticated access only** for all permissions, and **Save**. 

+ **.NET backend (C#)**:  

	In the server project, navigate to **Controllers** > **TodoItemController.cs**. Add the `[Authorize]` attribute to the **TodoItemController** class, as follows. To restrict access only to specific methods, you can also apply this attribute just to those methods instead of the class. Republish the server project.


        [Authorize]
        public class TodoItemController : TableController<TodoItem>

+ **Node.js backend (via Node.js code)** :  
	
	To require authentication for table access, add the following line to the Node.js server script:


        table.access = 'authenticated';

	For more details, refer to [Require authentication for access to tables](../articles/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#howto-tables-auth) in [How to use the Azure Mobile Apps Node.js SDK](../articles/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md).

