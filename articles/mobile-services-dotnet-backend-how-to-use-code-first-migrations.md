<properties pageTitle="How to use Code First Migrations .NET backend (Mobile Services)" metaKeywords="" description="" metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Considerations for supporting multiple clients from a single mobile service" authors="glenga" solutions="mobile" writer="glenga" manager="dwrede" editor="" />

# How to make data model changes to a .NET backend mobile service

In a .NET backend mobile service project, the default Entity Framework Code First database initializer drops and then recreate tables in the database whenever it detects a data model change exposed by your [DbContext]. Note that only tables that belong to the mobile services' schema are dropped, and all test data in the tables is lost. You should continue to use this initializer during local development of your mobile service project, and the .NET backend tutorials assume that you are using this initializer. However, for situations where you want to make data model changes and maintain existing data in the database, you must use Code First Migrations. 

This topic shows how to use Code First Migrations to make data model changes to an existing Azure SQL Database to avoid losing existing data. This procedure assumes that you have already published your mobile service project to Azure, that there is existing data in your database, and that the remote and local data models are still in sync.

>[WACOM.NOTE]When developing and testing your mobile service project against live Azure services, you should always use a mobile service instance that is dedicated for testing. You should never develop or test against a mobile service that is currently in production or being used by client apps. 

## <a name="migrations"></a>Enable Code First Migrations

Code First Migrations uses a snapshot method to generate code that, when executed, makes schema changes to the database. With Migrations, you can make incremental changes to your data model and maintain existing data in the database. 

>[WACOM.NOTE]If you have already published your .NET backend mobile service project to Azure, and your SQL Database table schema does not match the current data model of your project, you must drop the tables or otherwise manually get them in sync before you try to publish using Code First Migrations.

The following steps turn on Migrations and apply data model changes in the project, the local database, and in Azure. 

1. In Visual Studio in the Solution Explorer, right-click the mobile service project and click **Set as startup project**.
 
2. From the **Tools** menu, expand **NuGet Package Manager**, then click **Package Manager Console**.

	This displays the Package Manager Console, which you will use to manage your Code First Migrations.

3. In the Package Manager Console, run the following command:

		PM> Enable-Migrations

	This turns on Code First Migrations for your project.

4. In the console, run the following command:

		PM> Add-Migration Initial

	This creates a new migration named *Initial*. Migration code is stored in the Migrations project folder.

5. Expand the App_Start folder, open the WebApiConfig.cs project file and add the following **using** statements:

		using System.Data.Entity.Migrations;
		using todolistService.Migrations;

	In the above code, you must replace the _todolistService_ string with the namespace of your project, which for the downloaded quickstart project is <em>mobile&#95;service&#95;name</em>Service.  
 
6. In this same code file, comment-out the call to the **Database.SetInitializer** method and add the following code after it:

        var migrator = new DbMigrator(new Configuration());
        migrator.Update();

	This disables the default Code First database initializer that drops and recreates the database and replaces it with an explicit request to apply the latest migration. At this point, any data model changes will result in an InvalidOperationException when the data is accessed, unless a migration has been created for it. Going forward, your service must use Code First Migrations to migrate data model changes to the database.

7.  Press F5 to start the mobile service project on the local computer.
 
	At this point, the database is in sync with the data model. If you provided seed data, you can verify it by clicking **Try it out**, **GET tables/todoitem**, then **Try this out** and **Send**. For more information, see [Seeding data in migrations].

8.   Now make a change to your data model, such as adding a new UserId property to the TodoItem type, rebuild the project, and then in the Package Manager, run the following command:

		PM> Add-Migration NewUserId
                                                               
	This creates a new migration named *NewUserId*. A new code file, which implements this change, is added in the Migrations folder  

9.  Press F5 again to restart the mobile service project on the local computer.

	The migration is applied to the database and the database is again in sync with the data model. If you provided seed data, you can verify it by clicking **Try it out**, **GET tables/todoitem**, then **Try this out** and **Send**. For more information, see [Seeding data in migrations].

10. Republish the mobile service to Azure, then run the client app to access the data and verify that data loads and no error occur. 

13. (Optional) In the [Azure Management Portal], select your mobile service, click the **Configure** tab, and click the **SQL Database** link. 

	![][0]

	This navigates to the SQL Database page for your mobile service's database.

14. (Optional) Click **Manage**, log in to your SQL Database server, then click **Design** and verify that the schema changes have been made in Azure. 

    ![][1] 


##<a name="seeding"></a>Seeding data in migrations

You can have Migrations add seed data to the database when a migration is executed. The **Configuration** class has a **Seed** method that you can override to insert or update data. The Configuration.cs code file is added to the Migrations folder when Migrations are enabled. These examples show how to override the [Seed] method to seed data to the **TodoItems** table. The [Seed] method is called after migrating to the latest version. 

###Seed a new table

The following code seeds the **TodoItems** table with new rows of data:

        List<TodoItem> todoItems = new List<TodoItem>
        {
            new TodoItem { Id = "1", Text = "First item", Complete = false },
            new TodoItem { Id = "2", Text = "Second item", Complete = false },
        };

        foreach (TodoItem todoItem in todoItems)
        {
            context.Set<TodoItem>().Add(todoItem);
        }
        base.Seed(context);

###Seed a new column in a table

The following code seeds just the UserId column:
 		    
        context.TodoItems.AddOrUpdate(
            t => t.UserId,
                new TodoItem { UserId = 1 },
                new TodoItem { UserId = 1 },
                new TodoItem { UserId = 2 }
            );
        base.Seed(context);

This code calls the [AddOrUpdate] helper extension method to add seed data to the new UserId column. By using [AddOrUpdate], duplicate rows are not created.

<!-- Anchors -->
[Migrations]: #migrations
[Seeding data in migrations]: #seeding

<!-- Images -->
[0]: ./media/mobile-services-dotnet-backend-how-to-use-code-first-migrations/navagate-to-sql-database.png
[1]: ./media/mobile-services-dotnet-backend-how-to-use-code-first-migrations/manage-sql-database.png
[2]: ./media/mobile-services-dotnet-backend-how-to-use-code-first-migrations/sql-database-drop-tables.png

<!-- URLs -->
[DropCreateDatabaseIfModelChanges]: http://msdn.microsoft.com/en-us/library/gg679604(v=vs.113).aspx
[Seed]: http://msdn.microsoft.com/en-us/library/hh829453(v=vs.113).aspx
[Azure Management Portal]: https://manage.windowsazure.com/
[DbContext]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.113).aspx
[AddOrUpdate]: http://msdn.microsoft.com/en-us/library/system.data.entity.migrations.idbsetextensions.addorupdate(v=vs.103).aspx