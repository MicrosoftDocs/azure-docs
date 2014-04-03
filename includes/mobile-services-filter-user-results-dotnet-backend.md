

Now that authentication is required to access data in the TodoItem table, you can use the userID value assigned by Mobile Services to filter returned data.

>[WACOM.NOTE]The methods below should have the **RequiresAuthorizationAttribute** applied at the **User** **Authorizationlevel**. This restricts table access to only authenticated users.

1. In Visual Studio 2013, open your mobile service project, expand the DataObjects folder, then open the TodoItem.cs project file.

	The TodoItem class defines the data object, and you need to add a UserId property to use for filtering.

2. Add the following new UserId property to the **TodoItem** class:

		public string UserId { get; set; }

	>[WACOM.NOTE] When using the default database initializer, Entity Framework will drop and recreate the database whenever it detects a data model change in the Code First model definition. To make this data model change and maintain existing data in the database, you must use Code First Migrations. The default initializer cannot be used against a SQL Database in Azure. For more information, see [How to Use Code First Migrations to Update the Data Model](/en-us/documentation/articles/mobile-services-dotnet-backend-use-code-first-migrations).

3. In Solution Explorer, expand the Controllers folder, open the TodoItemController.cs project file, and add the following **using** statement:

		using Microsoft.WindowsAzure.Mobile.Service.Security;

	The **TodoItemController** class implements data access for the TodoItem table. 
 
4. Locate the **PostTodoItem** method and add the following code at the end right before the **return** statement:

		// Get the logged-in user.
	    var currentUser = User as ServiceUser;
	
	    // Set the user ID on the item.
	    item.UserId = currentUser.Id;

    This code adds a UserId value to the item, which is the user ID of the authenticated user, before it is inserted into the TodoItem table. 
	

5. Locate the **GetAllTodoItems** method and replace the existing **return** statement with the following line of code:

        // Get the logged-in user.
        var currentUser = User as ServiceUser;

        return Query().Where(todo => todo.UserId == currentUser.Id);

   	This query filters the returned TodoItem objects so that each user only receives the items that they inserted. You can optionally 

6. Republish the mobile service project to Azure.
