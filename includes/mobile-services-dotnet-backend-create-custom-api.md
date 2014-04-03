

1. In Visual Studio Solution Explorer, right-click the Controllers folder for the mobile service project, expand **Add**, then click **New Scaffolded Item**.

	This displays the Add Scaffold dialog.

2. Expand **Azure Mobile Services** and click **Azure Mobile Services Custom Controller**, then click **Add**, supply a **Controller name** of `CompleteAllController`, then click **Add** again.

	![](./media/mobile-services-dotnet-backend-create-custom-api/add-custom-api-controller.png)

	This creates a new empty controller class named **CompleteAllController**.

>[WACOM.NOTE]If your dialog doesn't have Mobile Services-specific scaffolds, instead create a new **Web API Controller - Empty**. In this new controller class, add a public **Services** property, which returns the **ApiServices** type. This property is used to access server-specific settings from inside your controller.

3. In the new CompleteAllController.cs project file, add the following **using** statements:

		using System.Threading.Tasks;
		using todolistService.Models;

	In the above code, replace `todolistService` with the namespace of your mobile service project, which should be the mobile service name appended with `Service`. 

4. Add the following code to the new controller:

	    // POST api/completeall        
        public Task<int> Post()
        {
            using (todolistContext context = new todolistContext())
            {
                // Get the database from the context.
                var database = context.Database;

                // Create a SQL statement that sets all uncompleted items
                // to complete and execute the statement asynchronously.
                var sql = @"UPDATE TodoItems SET Complete = 1 " +
                            @"WHERE Complete = 0; SELECT @@ROWCOUNT as count";
                var result = database.ExecuteSqlCommandAsync(sql);

                // Log the result.
                Services.Log.Info(string.Format("{0} items set to 'complete'.", 
                    result.ToString()));
                
                return result;
            }
        }

	In the above code, replace `todolistContext` with the name of the DbContext for your data model, which should be the mobile service name appended with `Context`. This code uses the [Database Class](http://msdn.microsoft.com/en-us/library/system.data.entity.database(v=vs.113).aspx) to access the **TodoItems** table directly to set the completed flag on all items. This method supports a POST request, and the number of changed rows is returned to the client as an integer value.

	> [WACOM.NOTE] Default permissions are set, which means that any user of the app can call the custom API. However, the application key is not distributed or stored securely and cannot be considered a secure credential. Because of this, you should consider restricting access to only authenticated users on operations that modify data or affect the mobile service. 

Next, you will modify the quickstart app to add a new button and code that asynchronously calls the new custom API.

