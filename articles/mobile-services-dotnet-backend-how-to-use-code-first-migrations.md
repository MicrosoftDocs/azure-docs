<properties 
	pageTitle="How to make data model changes to a .NET backend mobile service" 
	description="This topic describes data model initializers and how to make data model changes in a .NET backend mobile service." 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	writer="glenga" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/27/2015" 
	ms.author="glenga"/>

# How to make data model changes to a .NET backend mobile service

This topic shows how to use Entity Framework Code First Migrations to make data model changes to an existing Azure SQL Database to avoid losing existing data. This procedure assumes that you have already published your mobile service project to Azure, that there is existing data in your database, and that the remote and local data models are still in sync. This topic also describes the default Code First initializers implemented by Azure Mobile Services that are used during development. These initializers let you easily make schema changes without using Code First Migrations when it is not necessary to maintain you existing data. 

>[AZURE.NOTE]The schema name that is used to prefix your tables in the SQL Database is defined by the <strong>MS_MobileServiceName</strong> app setting in the web.config file. When you download the starter project from the portal, this value is already set to the mobile service name. When your schema name matches the mobile service, multiple mobile services can safely share the same database instance. 

## Data model initializers

Mobile Services provides supports two data model initializer base classes in a .NET backend mobile service project. These initializers  both drop and recreate tables in the database whenever the Entity Framework detects a data model change in your [DbContext]. These initializers are designed to work both when you mobile service is running on a local computer and when it is hosted in Azure. 

>[AZURE.NOTE]When you publish a .NET backend mobile service, the initializer is not run until a data access operation occurs. This means that for a newly published service, the data tables used for storage aren't created until a data access operation, such as a query, is requested by the client. 
>
>You can also execute a data access operation by using the built-in API help functionality, accessed from the **Try it out** link on the start page. For more information on using the API pages to test your mobile service, see the section Test the mobile service project locally in [Add Mobile Services to an existing app](mobile-services-dotnet-backend-windows-universal-dotnet-get-started-data.md#test-the-service-locally).  

Both initializer base classes delete from the database all tables, views, functions, and procedures in the schema used by the mobile service. 

+ **ClearDatabaseSchemaIfModelChanges** <br/> Schema objects are deleted only when Code First detects a change in the data model. The default initializer in a .NET backend project downloaded from the [Azure Management Portal] inherits from this base class.
 
+ **ClearDatabaseSchemaAlways**: <br/> Schema objects are deleted every time that the data model is accessed. Use this base class to reset the database without having to make a data model change.   	 	

In the downloaded quickstart project, the Code First initializer is defined in the WebApiConfig.cs file. Override the **Seed** method to add initial rows of data to new tables. For examples of seeding data, see [Seeding data in migrations].You can use other Code First data model initializers when running on a local computer. However, initializers that attempt to drop the database will fail in Azure because the user does not have permissions to drop the database, which is a good thing. 

You may continue to use initializers during local development of your mobile service, and the .NET backend tutorials assume that you are using initializers. However, for situations where you want to make data model changes and maintain existing data in the database, you must use Code First Migrations. 

>[AZURE.IMPORTANT]When developing and testing your mobile service project against live Azure services, you should always use a mobile service instance that is dedicated for testing. You should never develop or test against a mobile service that is currently in production or being used by client apps. 

## <a name="migrations"></a>Enable Code First Migrations

Code First Migrations uses a snapshot method to generate code that, when executed, makes schema changes to the database. With Migrations, you can make incremental changes to your data model and maintain existing data in the database. 

>[AZURE.NOTE]If you have already published your .NET backend mobile service project to Azure, and your SQL Database table schema does not match the current data model of your project, you must use an initializer, drop the tables manually, or otherwise get the schema and data model in sync before you try to publish using Code First Migrations.

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
[DropCreateDatabaseIfModelChanges]: http://msdn.microsoft.com/library/gg679604(v=vs.113).aspx
[Seed]: http://msdn.microsoft.com/library/hh829453(v=vs.113).aspx
[Azure Management Portal]: https://manage.windowsazure.com/
[DbContext]: http://msdn.microsoft.com/library/system.data.entity.dbcontext(v=vs.113).aspx
[AddOrUpdate]: http://msdn.microsoft.com/library/system.data.entity.migrations.idbsetextensions.addorupdate(v=vs.103).aspx
