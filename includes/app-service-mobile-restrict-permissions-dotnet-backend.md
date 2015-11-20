
By default, APIs in a Mobile App backend can be invoked anonymously. Next, you need to restrict access to only authenticated clients.  

+ **.NET backend (C#)**:  

	In the server project, navigate to **Controllers** > **TodoItemController.cs**. Add the `[Authorize]` attribute to the **TodoItemController** class, as follows. This requires that all operations against the TodoItem table be made by an authenticated user. To restrict access only to specific methods, you can also apply this attribute just to those methods instead of the class. Republish the server project.


        [Authorize]
        public class TodoItemController : TableController<TodoItem>


+ **Node.js backend (code)** :  
	
	Add the following line to the Node.js server script to require authentication for table access:


        table.access = 'authenticated';

	For more details, refer to [Require Authentication for access to tables](../articles/app-service-mobile-node-backend-how-to-use-server-sdk.md#howto-tables-auth).

+ **Node.js backend (portal)** :  
	
	In your Mobile App's **Settings**, click **Easy Tables** and select your table. Click **Change permissions** to bring up the permissions dialog for the table. Select **Authenticated access only** for Insert, Update, Delete, Read, and Undelete permissions, and click **Save**. 
