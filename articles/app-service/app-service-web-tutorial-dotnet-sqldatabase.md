---
title: 'Tutorial: ASP.NET app with Azure SQL Database' 
description: Learn how to deploy a C# ASP.NET app to Azure and to Azure SQL Database
ms.assetid: 03c584f1-a93c-4e3d-ac1b-c82b50c75d3e
ms.devlang: csharp
ms.topic: tutorial
ms.date: 06/25/2018
ms.custom: mvc, devcenter, vs-azure, seodec18
---

# Tutorial: Deploy an ASP.NET app to Azure with Azure SQL Database

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. This tutorial shows you how to deploy a data-driven ASP.NET app in App Service and connect it to [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md). When you're finished, you have an ASP.NET app running in Azure and connected to SQL Database.

![Published ASP.NET application in Azure App Service](./media/app-service-web-tutorial-dotnet-sqldatabase/azure-app-in-browser.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a database in Azure SQL Database
> * Connect an ASP.NET app to SQL Database
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream logs from Azure to your terminal
> * Manage the app in the Azure portal

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial:

Install <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> with the **ASP.NET and web development** workload.

If you've installed Visual Studio already, add the workloads in Visual Studio by clicking **Tools** > **Get Tools and Features**.

## Download the sample

* [Download the sample project](https://github.com/Azure-Samples/dotnet-sqldb-tutorial/archive/master.zip).
* Extract (unzip) the  *dotnet-sqldb-tutorial-master.zip* file.

The sample project contains a basic [ASP.NET MVC](https://www.asp.net/mvc) create-read-update-delete (CRUD) app using [Entity Framework Code First](/aspnet/mvc/overview/getting-started/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application).

### Run the app

Open the *dotnet-sqldb-tutorial-master/DotNetAppSqlDb.sln* file in Visual Studio.

Type `Ctrl+F5` to run the app without debugging. The app is displayed in your default browser. Select the **Create New** link and create a couple *to-do* items.

![New ASP.NET Project dialog box](media/app-service-web-tutorial-dotnet-sqldatabase/local-app-in-browser.png)

Test the **Edit**, **Details**, and **Delete** links.

The app uses a database context to connect with the database. In this sample, the database context uses a connection string named `MyDbConnection`. The connection string is set in the *Web.config* file and referenced in the *Models/MyDatabaseContext.cs* file. The connection string name is used later in the tutorial to connect the Azure app to an Azure SQL Database.

## Publish ASP.NET application to Azure

In the **Solution Explorer**, right-click your **DotNetAppSqlDb** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png)

Make sure that **Microsoft Azure App Service** is selected and click **Publish**.

![Publish from project overview page](./media/app-service-web-tutorial-dotnet-sqldatabase/publish-to-app-service.png)

Publishing opens the **Create App Service** dialog, which helps you create all the Azure resources you need to run your ASP.NET app in Azure.

### Sign in to Azure

In the **Create App Service** dialog, click **Add an account**, and then sign in to your Azure subscription. If you're already signed into a Microsoft account, make sure that account holds your Azure subscription. If the signed-in Microsoft account doesn't have your Azure subscription, click it to add the correct account.

> [!NOTE]
> If you're already signed in, don't select **Create** yet.

![Sign in to Azure](./media/app-service-web-tutorial-dotnet-sqldatabase/sign-in-azure.png)

### Configure the web app name

You can keep the generated web app name, or change it to another unique name (valid characters are `a-z`, `0-9`, and `-`). The web app name is used as part of the default URL for your app (`<app_name>.azurewebsites.net`, where `<app_name>` is your web app name). The web app name needs to be unique across all apps in Azure.

![Create app service dialog](media/app-service-web-tutorial-dotnet-sqldatabase/wan.png)

### Create a resource group

[!INCLUDE [resource-group](../../includes/resource-group.md)]

1. Next to **Resource Group**, click **New**.

   ![Next to Resource Group, click New.](media/app-service-web-tutorial-dotnet-sqldatabase/new_rg2.png)

2. Name the resource group **myResourceGroup**.

### Create an App Service plan

[!INCLUDE [app-service-plan](../../includes/app-service-plan.md)]

1. Next to **App Service Plan**, click **New**.

2. In the **Configure App Service Plan** dialog, configure the new App Service plan with the following settings:

   ![Create App Service plan](./media/app-service-web-tutorial-dotnet-sqldatabase/configure-app-service-plan.png)

   | Setting  | Suggested value | For more information |
   | ----------------- | ------------ | ----|
   |**App Service Plan**| myAppServicePlan | [App Service plans](../app-service/overview-hosting-plans.md) |
   |**Location**| West Europe | [Azure regions](https://azure.microsoft.com/regions/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) |
   |**Size**| Free | [Pricing tiers](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)|

### Create a server

Before creating a database, you need a [logical SQL server](../azure-sql/database/logical-servers.md). A logical SQL server is a logical construct that contains a group of databases managed as a group.

1. Click **Create a SQL Database**.

   ![Create a SQL Database](media/app-service-web-tutorial-dotnet-sqldatabase/web-app-name.png)

2. In the **Configure SQL Database** dialog, click **New** next to **SQL Server**.

   A unique server name is generated. This name is used as part of the default URL for your server, `<server_name>.database.windows.net`. It must be unique across all servers in Azure SQL. You can change the server name, but for this tutorial, keep the generated value.

3. Add an administrator username and password. For password complexity requirements, see [Password Policy](/sql/relational-databases/security/password-policy).

   Remember this username and password. You need them to manage the server later.

   > [!IMPORTANT]
   > Even though your password in the connection strings is masked (in Visual Studio and also in App Service), the fact that it's maintained somewhere adds to the attack surface of your app. App Service can use [managed service identities](overview-managed-identity.md) to eliminate this risk by removing the need to maintain secrets in your code or app configuration at all. For more information, see [Next steps](#next-steps).

   ![Create server](media/app-service-web-tutorial-dotnet-sqldatabase/configure-sql-database-server.png)

4. Click **OK**. Don't close the **Configure SQL Database** dialog yet.

### Create a database in Azure SQL Database

1. In the **Configure SQL Database** dialog:

   * Keep the default generated **Database Name**.
   * In **Connection String Name**, type *MyDbConnection*. This name must match the connection string that is referenced in *Models/MyDatabaseContext.cs*.
   * Select **OK**.

    ![Configure database](media/app-service-web-tutorial-dotnet-sqldatabase/configure-sql-database.png)

2. The **Create App Service** dialog shows the resources you've configured. Click **Create**.

   ![the resources you've created](media/app-service-web-tutorial-dotnet-sqldatabase/app_svc_plan_done.png)

Once the wizard finishes creating the Azure resources, it  publishes your ASP.NET app to Azure. Your default browser is launched with the URL to the deployed app.

Add a few to-do items.

![Published ASP.NET application in Azure app](./media/app-service-web-tutorial-dotnet-sqldatabase/azure-app-in-browser.png)

Congratulations! Your data-driven ASP.NET application is running live in Azure App Service.

## Access the database locally

Visual Studio lets you explore and manage your new database easily in the **SQL Server Object Explorer**.

### Create a database connection

From the **View** menu, select **SQL Server Object Explorer**.

At the top of **SQL Server Object Explorer**, click the **Add SQL Server** button.

### Configure the database connection

In the **Connect** dialog, expand the **Azure** node. All your SQL Database instances in Azure are listed here.

Select the database that you created earlier. The connection you created earlier is automatically filled at the bottom.

Type the database administrator password you created earlier and click **Connect**.

![Configure database connection from Visual Studio](./media/app-service-web-tutorial-dotnet-sqldatabase/connect-to-sql-database.png)

### Allow client connection from your computer

The **Create a new firewall rule** dialog is opened. By default, a server only allows connections to its databases from Azure services, such as your Azure app. To connect to your database from outside of Azure, create a firewall rule at the server level. The firewall rule allows the public IP address of your local computer.

The dialog is already filled with your computer's public IP address.

Make sure that **Add my client IP** is selected and click **OK**.

![Create firewall rule](./media/app-service-web-tutorial-dotnet-sqldatabase/sql-set-firewall.png)

Once Visual Studio finishes creating the firewall setting for your SQL Database instance, your connection shows up in **SQL Server Object Explorer**.

Here, you can perform the most common database operations, such as run queries, create views and stored procedures, and more.

Expand your connection > **Databases** > **&lt;your database>** > **Tables**. Right-click on the `Todoes` table and select **View Data**.

![Explore SQL Database objects](./media/app-service-web-tutorial-dotnet-sqldatabase/explore-sql-database.png)

## Update app with Code First Migrations

You can use the familiar tools in Visual Studio to update your database and app in Azure. In this step, you use Code First Migrations in Entity Framework to make a change to your database schema and publish it to Azure.

For more information about using Entity Framework Code First Migrations, see [Getting Started with Entity Framework 6 Code First using MVC 5](https://docs.microsoft.com/aspnet/mvc/overview/getting-started/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application).

### Update your data model

Open _Models\Todo.cs_ in the code editor. Add the following property to the `ToDo` class:

```csharp
public bool Done { get; set; }
```

### Run Code First Migrations locally

Run a few commands to make updates to your local database.

From the **Tools** menu, click **NuGet Package Manager** > **Package Manager Console**.

In the Package Manager Console window, enable Code First Migrations:

```powershell
Enable-Migrations
```

Add a migration:

```powershell
Add-Migration AddProperty
```

Update the local database:

```powershell
Update-Database
```

Type `Ctrl+F5` to run the app. Test the edit, details, and create links.

If the application loads without errors, then Code First Migrations has succeeded. However, your page still looks the same because your application logic is not using this new property yet.

### Use the new property

Make some changes in your code to use the `Done` property. For simplicity in this tutorial, you're only going to change the `Index` and `Create` views to see the property in action.

Open _Controllers\TodosController.cs_.

Find the `Create()` method on line 52 and add `Done` to the list of properties in the `Bind` attribute. When you're done, your `Create()` method signature looks like the following code:

```csharp
public ActionResult Create([Bind(Include = "Description,CreatedDate,Done")] Todo todo)
```

Open _Views\Todos\Create.cshtml_.

In the Razor code, you should see a `<div class="form-group">` element that uses `model.Description`, and then another `<div class="form-group">` element that uses `model.CreatedDate`. Immediately following these two elements, add another `<div class="form-group">` element that uses `model.Done`:

```csharp
<div class="form-group">
    @Html.LabelFor(model => model.Done, htmlAttributes: new { @class = "control-label col-md-2" })
    <div class="col-md-10">
        <div class="checkbox">
            @Html.EditorFor(model => model.Done)
            @Html.ValidationMessageFor(model => model.Done, "", new { @class = "text-danger" })
        </div>
    </div>
</div>
```

Open _Views\Todos\Index.cshtml_.

Search for the empty `<th></th>` element. Just above this element, add the following Razor code:

```csharp
<th>
    @Html.DisplayNameFor(model => model.Done)
</th>
```

Find the `<td>` element that contains the `Html.ActionLink()` helper methods. _Above_ this `<td>`, add another `<td>` element with the following Razor code:

```csharp
<td>
    @Html.DisplayFor(modelItem => item.Done)
</td>
```

That's all you need to see the changes in the `Index` and `Create` views.

Type `Ctrl+F5` to run the app.

You can now add a to-do item and check **Done**. Then it should show up in your homepage as a completed item. Remember that the `Edit` view doesn't show the `Done` field, because you didn't change the `Edit` view.

### Enable Code First Migrations in Azure

Now that your code change works, including database migration, you publish it to your Azure app and update your SQL Database with Code First Migrations too.

Just like before, right-click your project and select **Publish**.

Click **Configure** to open the publish settings.

![Open publish settings](./media/app-service-web-tutorial-dotnet-sqldatabase/publish-settings.png)

In the wizard, click **Next**.

Make sure that the connection string for your SQL Database is populated in **MyDatabaseContext (MyDbConnection)**. You may need to select the **myToDoAppDb** database from the dropdown.

Select **Execute Code First Migrations (runs on application start)**, then click **Save**.

![Enable Code First Migrations in Azure app](./media/app-service-web-tutorial-dotnet-sqldatabase/enable-migrations.png)

### Publish your changes

Now that you enabled Code First Migrations in your Azure app, publish your code changes.

In the publish page, click **Publish**.

Try adding to-do items again and select **Done**, and they should show up in your homepage as a completed item.

![Azure app after Code First Migration](./media/app-service-web-tutorial-dotnet-sqldatabase/this-one-is-done.png)

All your existing to-do items are still displayed. When you republish your ASP.NET application, existing data in your SQL Database is not lost. Also, Code First Migrations only changes the data schema and leaves your existing data intact.

## Stream application logs

You can stream tracing messages directly from your Azure app to Visual Studio.

Open _Controllers\TodosController.cs_.

Each action starts with a `Trace.WriteLine()` method. This code is added to show you how to add trace messages to your Azure app.

### Open Server Explorer

From the **View** menu, select **Server Explorer**. You can configure logging for your Azure app in **Server Explorer**.

### Enable log streaming

In **Server Explorer**, expand **Azure** > **App Service**.

Expand the **myResourceGroup** resource group, you created when you first created the Azure app.

Right-click your Azure app and select **View Streaming Logs**.

![Enable log streaming](./media/app-service-web-tutorial-dotnet-sqldatabase/stream-logs.png)

The logs are now streamed into the **Output** window.

![Log streaming in Output window](./media/app-service-web-tutorial-dotnet-sqldatabase/log-streaming-pane.png)

However, you don't see any of the trace messages yet. That's because when you first select **View Streaming Logs**, your Azure app sets the trace level to `Error`, which only logs error events (with the `Trace.TraceError()` method).

### Change trace levels

To change the trace levels to output other trace messages, go back to **Server Explorer**.

Right-click your Azure app again and select **View Settings**.

In the **Application Logging (File System)** dropdown, select **Verbose**. Click **Save**.

![Change trace level to Verbose](./media/app-service-web-tutorial-dotnet-sqldatabase/trace-level-verbose.png)

> [!TIP]
> You can experiment with different trace levels to see what types of messages are displayed for each level. For example, the **Information** level includes all logs created by `Trace.TraceInformation()`, `Trace.TraceWarning()`, and `Trace.TraceError()`, but not logs created by `Trace.WriteLine()`.

In your browser navigate to your app again at *http://&lt;your app name>.azurewebsites.net*, then try clicking around the to-do list application in Azure. The trace messages are now streamed to the **Output** window in Visual Studio.

```console
Application: 2017-04-06T23:30:41  PID[8132] Verbose     GET /Todos/Index
Application: 2017-04-06T23:30:43  PID[8132] Verbose     GET /Todos/Create
Application: 2017-04-06T23:30:53  PID[8132] Verbose     POST /Todos/Create
Application: 2017-04-06T23:30:54  PID[8132] Verbose     GET /Todos/Index
```

### Stop log streaming

To stop the log-streaming service, click the **Stop monitoring** button in the **Output** window.

![Stop log streaming](./media/app-service-web-tutorial-dotnet-sqldatabase/stop-streaming.png)

## Manage your Azure app

Go to the [Azure portal](https://portal.azure.com) to manage the web app. Search for and select **App Services**.

![Search for Azure App Services](./media/app-service-web-tutorial-dotnet-sqldatabase/azure-portal-navigate-app-services.png)

Select the name of your Azure app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-dotnet-sqldatabase/access-portal.png)

You have landed in your app's page.

By default, the portal shows the **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

![App Service page in Azure portal](./media/app-service-web-tutorial-dotnet-sqldatabase/web-app-blade.png)

[!INCLUDE [Clean up section](../../includes/clean-up-section-portal-web-app.md)]

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create a database in Azure SQL Database
> * Connect an ASP.NET app to SQL Database
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream logs from Azure to your terminal
> * Manage the app in the Azure portal

Advance to the next tutorial to learn how to easily improve the security of your connection Azure SQL Database.

> [!div class="nextstepaction"]
> [Access SQL Database securely using managed identities for Azure resources](app-service-web-tutorial-connect-msi.md)
