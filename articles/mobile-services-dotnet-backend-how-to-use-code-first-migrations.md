<properties pageTitle="How to use Code First Migrations .NET backend (Mobile Services)" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Considerations for supporting multiple clients from a single mobile service" authors="glenga" solutions="" writer="glenga" manager="dwrede" editor="" />

# How to use Code First Migrations with Mobile Services .NET backend

In a .NET backend project, the default Entity Framework database initializer derives from the [DropCreateDatabaseIfModelChanges] class. Because of this, Entity Framework drops and recreates the database whenever it detects a data model change in the Code First model definition. The .NET backend tutorials continue to use this initializer because you don't need to maintain the TodoItem data you generate during the tutorials. However, for situations where you want to make data model changes and maintain existing data in the database, you must use Code First Migrations.

>[WACOM.NOTE]When developing and testing your mobile service project against live Azure services, you should always use a mobile service instance that is dedicated for testing. You should never develop or test against a mobile service that is currently in production or being used by client apps.

This topic shows how to use Code First Migrations to make data model changes without losing existing data. This procedure assumes that you have already published your mobile service project to Azure, that there is existing data in your database, and that the remote and local data models are still in sync.

1. In Visual Studio in the Solution Explorer, expand the App_Start folder, open the WebApiConfig.cs project, and comment-out the call to the **Database.SetInitializer** method, which looks like this:

		Database.SetInitializer(new todolistInitializer());

	This disables the default Code First database initializer that drops and recreates the database. At this point, any data model changes will result in an InvalidOperationException when the data is accessed. Going forward, your service must use Code First Migrations to migrate data model changes to the database.

2. Right-click the mobile service project and click **Set as startup project**.
 
3. From the **Tools** menu, expand **NuGet Package Manager**, then click **Package Manager Console**.

	This displays the Package Manager Console, which you will use to manage your Code First Migrations.

4. In the Package Manager Console, run the following command:

		PM> Enable-Migrations

	This turns on Code First Migrations for your project and generates a migration for the existing database.

5. In the console, run the following command:

		Add-Migration -Name MySchemaChange -IgnoreChanges

	This creates a new migration, with the specified name. If you have have already made a pending data model change, use the -IgnoreChanges parameter. 

6. In the console, run the following command:

		Update-Database

	This generates the code for a migration that will make the data model change in your database. 

9.       Rerun the app locally, and verify that the we can still read data without getting the “out of sync” errors.
10.   Now make a model change, like adding a “Foot” property.
11.   Rebuild.
12.   IN the PM console:
a.       Add-Migration Foot
                                                               i.      Note: if you look at the code generated for the “Foot” migration, you’ll see that it has the correct schema (when using the latest bits):
AddColumn("jcooketestNet031301.TodoItems", "Foot", c => c.String());
b.      Update-Database
13.   Rerun app locally, and verify that the new property is returned when querying the table.


<!-- URLs -->

[DropCreateDatabaseIfModelChanges]: http://msdn.microsoft.com/query/dev12.query?appId=Dev12IDEF1&l=EN-US&k=k("System.Data.Entity.DropCreateDatabaseIfModelChanges`1");k(TargetFrameworkMoniker-.NETFramework,Version%3Dv4.5);k(DevLang-csharp)&rd=true