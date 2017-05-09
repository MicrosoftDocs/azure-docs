---
title: Create an ASP.NET app in Azure with SQL Database | Microsoft Docs 
description: Learn how to get a ASP.NET app working in Azure, with connection to a SQL Database.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: erikre
editor: ''

ms.assetid: 03c584f1-a93c-4e3d-ac1b-c82b50c75d3e
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 04/07/2017
ms.author: cephalin

---
# Create an ASP.NET app in Azure with SQL Database

This tutorial shows you how to develop a data-driven ASP.NET web app in Azure, connect it to Azure SQL Database, and enable your data-driven functionality. When you're finished, you'll have a ASP.NET application running in [Azure App Service](../app-service/app-service-value-prop-what-is.md) and connected to SQL Database.

![Published ASP.NET application in Azure web app](./media/app-service-web-tutorial-dotnet-sqldatabase/azure-app-in-browser.png)

## Before you begin

Before running this sample, [download and install the free Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample
In this step, you download a sample ASP.NET application.

### Get the sample project

Download the samples project by clicking [here](https://github.com/Azure-Samples/dotnet-sqldb-tutorial/archive/master.zip).

Extract the downloaded `dotnet-sqldb-tutorial-master.zip` into a working directory.

> [!TIP]
> You can get the same sample project by cloning the GitHub repository:
>
> ```bash
> git clone https://github.com/Azure-Samples/dotnet-sqldb-tutorial.git
> ```
>
>

This sample project contains a simple [ASP.NET MVC](https://www.asp.net/mvc) CRUD (create-read-update-delete) application built on [Entity Framework Code First](/aspnet/mvc/overview/getting-started/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application).

### Run the application

From the extracted directory, launch `dotnet-sqldb-tutorial-master\DotNetAppSqlDb.sln` in Visual Studio 2017.

Once the sample solution is opened, type `F5` to run it in the browser.

You should see a simple to-do list in the homepage. Try to add a few to-dos to the empty list.

![New ASP.NET Project dialog box](./media/app-service-web-tutorial-dotnet-sqldatabase/local-app-in-browser.png)

Your database context uses a connection string called `MyDbConnection`. This connection string is defined in `Web.config` and referenced in `Models\MyDatabaseContext.cs`. The connection string name is all you will need later when connecting your Azure web app to Azure SQL Database. 

## Publish to Azure with SQL Database

In the **Solution Explorer**, right-click your **DotNetAppSqlDb** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-tutorial-dotnet-sqldatabase/solution-explorer-publish.png)

Make sure that **Microsoft Azure App Service** is selected and click **Publish**.

![Publish from project overview page](./media/app-service-web-tutorial-dotnet-sqldatabase/publish-to-app-service.png)

This opens the **Create App Service** dialog, which helps you create all the Azure resources you need to run your ASP.NET web app in Azure.

### Sign in to Azure

In the **Create App Service** dialog, click **Add an account**, and then sign in to your Azure subscription. If you're already signed into a Microsoft account, make sure that account holds your Azure subscription. If the signed-in Microsoft account doesn't have your Azure subscription, click it to add the correct account.
   
![Sign in to Azure](./media/app-service-web-tutorial-dotnet-sqldatabase/sign-in-azure.png)

Once signed in, you're ready to create all the resources you need for your Azure web app in this dialog.

### Create a resource group

First, you need a _resource group_. 

> [!NOTE] 
> A resource group is a logical container into which Azure resources like web apps, databases, and storage accounts are deployed and managed.
>
>

Next to **Resource Group**, click **New**.

Name your resource group **myResourceGroup** and click **OK**.

### Create an App Service plan

Your Azure web app also needs an _App Service plan_. 

> [!NOTE]
> An App Service plan represents the collection of physical resources used to host your apps. All apps assigned to an App Service plan share the resources defined by it, which enables you to save cost when hosting multiple apps. 
>
> App Service plans define:
>
> - Region (North Europe, East US, Southeast Asia)
> - Instance Size (Small, Medium, Large)
> - Scale Count (one, two, or three instances, etc.) 
> - SKU (Free, Shared, Basic, Standard, Premium)
>
>

Next to **App Service Plan**, click **New**. 

In the **Configure App Service Plan** dialog, configure the new App Service plan with the following settings:

- **App Service Plan**: Type **myAppServicePlan**. 
- **Location**: Choose **West Europe**, or any other region you like.
- **Size**: Choose **Free**, or any other [pricing tier](https://azure.microsoft.com/pricing/details/app-service/) you like.

Click **OK**.

![Create App Service plan](./media/app-service-web-tutorial-dotnet-sqldatabase/configure-app-service-plan.png)

### Configure the web app name

In **Web App Name**, type a unique app name. This name will be used as part of the default DNS name for your app (`<app_name>.azurewebsites.net`), so it needs to be unique across all apps in Azure. You can later map a custom domain name to your app before you expose it to your users.

You can also accept the automatically generated name, which is already unique.

To prepare for the next step, click **Explore additional Azure services**.

![Configure web app name](./media/app-service-web-tutorial-dotnet-sqldatabase/web-app-name.png)

### Create a SQL Server instance

In the **Services** tab, click the **+** icon next to **SQL Database**. 

In the **Configure SQL Database** dialog, click **New** next to **SQL Server**. 

In **Server Name**, type a unique name. This name will be used as part of the default DNS name for your database server (`<server_name>.database.windows.net`), so it needs to be unique across all SQL Server instances in Azure. 

Configure the rest of the fields as you like and click **OK**.

![Create SQL Server instance](./media/app-service-web-tutorial-dotnet-sqldatabase/configure-sql-database-server.png)

### Configure the SQL Database

In **Database Name**, type `myToDoAppDb`, or any name you like.

In **Connection String Name**, type `MyDbConnection`. This name must match the connection string that is referenced in `Models\MyDatabaseContext.cs`.

![Configure SQL Database](./media/app-service-web-tutorial-dotnet-sqldatabase/configure-sql-database.png)

### Create and publish the web app

Click **Create**. 

Once the wizard finishes creating the Azure resources, it automatically publishes your ASP.NET application to Azure for the first time, and then launches the published Azure web app in your default browser.

Try to add a few to-do items to the empty list.

![Published ASP.NET application in Azure web app](./media/app-service-web-tutorial-dotnet-sqldatabase/azure-app-in-browser.png)

Congratulations! Your data-driven ASP.NET application is running live in Azure App Service.

## Access the SQL Database locally

Visual Studio lets you explorer and manage your new SQL Database easily in the **SQL Server Object Explorer**.

### Create a database connection

Open **SQL Server Object Explorer** by typing `Ctrl`+`` ` ``, `Ctrl`+`S`.

At the top of **SQL Server Object Explorer**, click the **Add SQL Server** button.

### Configure the database connection

In the **Connect** dialog, expand the **Azure** node. All your SQL Databases in Azure are listed here.

Select the SQL Database that you created earlier. The connection you used earlier are automatically filled at the bottom.

Type the database administrator password you used earlier and click **Connect**.

![Configure database connection from Visual Studio](./media/app-service-web-tutorial-dotnet-sqldatabase/connect-to-sql-database.png)

### Allow client connection from your computer

The **Create a new firewall rule** dialog is opened. By default, your SQL Server instance only allows connections from Azure services, such as your Azure web app. To connect to your database directly from Visual Studio, you need to create a firewall rule in the SQL Server instance to allow the public IP address of your local computer.

This is easy in Visual Studio. The dialog is already filled with your computer's public IP address.

Make sure that **Add my client IP** is selected and click **OK**. 

![Set firewall for SQL Server instance](./media/app-service-web-tutorial-dotnet-sqldatabase/sql-set-firewall.png)

Once Visual Studio finishes creating the firewall setting for your SQL Server instance, your connection shows up in **SQL Server Object Explorer**.

Here, you can perform the most common database operations, such as run queries, create views and stored procedures, and more. The following example shows you how to view database data. 

![Explore SQL Database objects](./media/app-service-web-tutorial-dotnet-sqldatabase/explore-sql-database.png)

## Update app with Code First Migrations

In this step, you'll use Code First Migrations in Entity Framework to make a change to your database schema and publish it to Azure.

### Update your data model

Open `Models\Todo.cs` in the code editor. Add the following property to the `ToDo` class:

```csharp
public bool Done { get; set; }
```

### Run Code First Migrations locally

Next, run a few commands to make updates to your localdb database. 

From the **Tools** menu, click **NuGet Package Manager** > **Package Manager Console**. The console is usually opened in the bottom window.

Enable Code First Migrations like this:

```PowerShell
Enable-Migrations
```

Add a migration like this:

```PowerShell
Add-Migration AddProperty
```

Update the localdb database like this:

```PowerShell
Update-Database
```

Test your changes by running the application with `F5`.

If the application loads without errors, then Code First Migrations has succeeded. However, your page still looks the same because your application logic is not using this new property yet. 

### Use the new property

Lets make some changes in your code to use the `Done` property. For simplicity in this tutorial, you're only going to change the `Index` and `Create` views to see the property in action.

Open `Controllers\TodosController.cs`.

Find the `Create()` method and add `Done` to the list of properties in the `Bind` attribute. When you're done, your `Create()` method signature should look like this:

```csharp
public ActionResult Create([Bind(Include = "id,Description,CreatedDate,Done")] Todo todo)
```

Open `Views\Todos\Create.cshtml`.

In the Razor code, you should see a `<div class="form-group">` tag that uses `model.Description`, and then another `<div class="form-group">` tag that uses `model.CreatedDate`. Immediately following these two tags, add another `<div class="form-group">` tag that uses `model.Done`, like this:

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

Open `Views\Todos\Index.cshtml`.

Search for the empty `<th></th>` tag. Just above this tag, add the following Razor code:

```csharp
<th>
    @Html.DisplayNameFor(model => model.Done)
</th>
```

Find the `<td>` tag that contains the `Html.ActionLink()` helper methods. Just above this tag, add the following Razor code:

```csharp
<td>
    @Html.DisplayFor(modelItem => item.Done)
</td>
```

That's all you need to see the changes in the `Index` and `Create` views. 

Type `F5` again to run the application.

You should be able now to add a to-do item and check **Done**. Then it should show up in your homepage as a completed item. Remember that this is all you can do for now because you didn't change the `Edit` view.

### Enable Code First Migrations in Azure

Now that your code change works, including database migration, you publish it to your Azure web app and update your SQL Database with Code First Migrations too.

Just like before, right-click your project and select **Publish**.

Click **Settings** to open the publish wizard.

![Open publish settings](./media/app-service-web-tutorial-dotnet-sqldatabase/publish-settings.png)

In the wizard, click **Next**.

Make sure that the connection string for your SQL Database is populated in **MyDatabaseContext (MyDbConnection)**. You may need to select the **myToDoAppDb** database from the dropdown. 

Select **Execute Code First Migrations (runs on application start)**, then click **Save**.

![Enable Code First Migrations in Azure web app](./media/app-service-web-tutorial-dotnet-sqldatabase/enable-migrations.png)

### Publish your changes

Now that you enabled Code First Migrations in your Azure web app, just publish your code changes.

In the publish page, click **Publish**.

Try creating new to-do items again and select **Done**, and they should show up in your homepage as a completed item.

![Azure web app after Code First Migration](./media/app-service-web-tutorial-dotnet-sqldatabase/this-one-is-done.png)

> [!NOTE]
> Note that all your existing to-do items are still displayed. When you republish your ASP.NET application, existing data in your SQL Database is not lost. Also, Code First Migrations only changes the data schema and leaves your existing data intact.
>
>

## Stream application logs

You can stream tracing messages directly from your Azure web app to Visual Studio.

Open `Controllers\TodosController.cs`.

Note that each action starts with a `Trace.WriteLine()` method. This code is added to show you how easy it is to add trace messages to your Azure web app.

### Open Server Explorer

You can configure logging for your Azure web app in **Server Explorer**. 

To open it, type `Ctrl`+`Alt`+`S`.

### Enable log streaming

In **Server Explorer**, expand **Azure** > **App Service**.

Expand the **myResourceGroup** resource group, you created when you first created the Azure web app.

Right-click your Azure web app and select **View Streaming Longs**.

![Enable log streaming](./media/app-service-web-tutorial-dotnet-sqldatabase/stream-logs.png)

The logs are now streamed into the **Output** window. 

![Log streaming in Output window](./media/app-service-web-tutorial-dotnet-sqldatabase/log-streaming-pane.png)

However, you won't see any of the trace messages yet. That's because when you first select **View Streaming Logs**, your Azure web app sets the trace level to `Error`, which only logs error events (with the `Trace.TraceError()` method).

### Change trace levels

To change the trace levels to output other trace messages, go back to **Server Explorer**.

Right-click your Azure web app again and select **Settings**.

In the **Application Logging (File System)** dropdown, select **Verbose**. Click **Save**.

![Change trace level to Verbose](./media/app-service-web-tutorial-dotnet-sqldatabase/trace-level-verbose.png)

> [!TIP]
> You can experiment with different trace levels to see what types of messages is displayed for each level. For example, the **Information** level includes all logs created by `Trace.TraceInformation()`, `Trace.TraceWarning()`, and `Trace.TraceError()`, but not logs created by `Trace.WriteLine()`.
>
>

In your browser, try clicking around the to-do list application in Azure. The trace messages are now streamed to the **Output** window in Visual Studio.

```
Application: 2017-04-06T23:30:41  PID[8132] Verbose     GET /Todos/Index
Application: 2017-04-06T23:30:43  PID[8132] Verbose     GET /Todos/Create
Application: 2017-04-06T23:30:53  PID[8132] Verbose     POST /Todos/Create
Application: 2017-04-06T23:30:54  PID[8132] Verbose     GET /Todos/Index
```

### Stop log streaming

To stop the log-streaming service, click the **Stop monitoring** button in the **Output** window.

![Stop log streaming](./media/app-service-web-tutorial-dotnet-sqldatabase/stop-streaming.png)

## Manage your Azure web app

Go to the Azure portal to see the web app you created. 

To do this, sign in to [https://portal.azure.com](https://portal.azure.com).

From the left menu, click **App Service**, then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-tutorial-dotnet-sqldatabase/access-portal.png)

You have landed in your web app's _blade_ (a portal page that opens horizontally). 

By default, your web app's blade shows the **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the blade show the different configuration pages you can open. 

![App Service blade in Azure portal](./media/app-service-web-tutorial-dotnet-sqldatabase/web-app-blade.png)

These tabs in the blade show the many great features you can add to your web app. The following list gives you just a few of the possibilities:

- Map a custom DNS name
- Bind a custom SSL certificate
- Configure continuous deployment
- Scale up and out
- Add user authentication

## Next steps

Explore pre-created [Web apps PowerShell scripts](app-service-powershell-samples.md).
