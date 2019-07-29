---
title: ASP.NET Core with SQL Database on Linux - Azure App Service | Microsoft Docs 
description: Learn how to get an ASP.NET Core app working in Azure App Service on Linux, with connection to a SQL Database.
services: app-service\web
documentationcenter: dotnet
author: cephalin
manager: jeconnoc
editor: ''

ms.assetid: 0b4d7d0e-e984-49a1-a57a-3c0caa955f0e
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 03/27/2019
ms.author: cephalin
ms.custom: mvc
ms.custom: seodec18
---
# Build an ASP.NET Core and SQL Database app in Azure App Service on Linux

> [!NOTE]
> This article deploys an app to App Service on Linux. To deploy to App Service on _Windows_, see [Build a .NET Core and SQL Database app in Azure App Service](../app-service-web-tutorial-dotnetcore-sqldb.md).
>

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a .NET Core app and connect it to a SQL Database. When you're done, you'll have a .NET Core MVC app running in App Service on Linux.

![app running in App Service on Linux](./media/tutorial-dotnetcore-sqldb-app/azure-app-in-browser.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a SQL Database in Azure
> * Connect a .NET Core app to SQL Database
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial:

* [Install Git](https://git-scm.com/)
* [Install .NET Core](https://www.microsoft.com/net/core/)

## Create local .NET Core app

In this step, you set up the local .NET Core project.

### Clone the sample application

In the terminal window, `cd` to a working directory.

Run the following commands to clone the sample repository and change to its root.

```bash
git clone https://github.com/azure-samples/dotnetcore-sqldb-tutorial
cd dotnetcore-sqldb-tutorial
```

The sample project contains a basic CRUD (create-read-update-delete) app using [Entity Framework Core](https://docs.microsoft.com/ef/core/).

### Run the application

Run the following commands to install the required packages, run database migrations, and start the application.

```bash
dotnet restore
dotnet ef database update
dotnet run
```

Navigate to `http://localhost:5000` in a browser. Select the **Create New** link and create a couple _to-do_ items.

![connects successfully to SQL Database](./media/tutorial-dotnetcore-sqldb-app/local-app-in-browser.png)

To stop .NET Core at any time, press `Ctrl+C` in the terminal.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create production SQL Database

In this step, you create a SQL Database in Azure. When your app is deployed to Azure, it uses this cloud database.

For SQL Database, this tutorial uses [Azure SQL Database](/azure/sql-database/).

### Create a resource group

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux-no-h.md)]

### Create a SQL Database logical server

In the Cloud Shell, create a SQL Database logical server with the [`az sql server create`](/cli/azure/sql/server?view=azure-cli-latest#az-sql-server-create) command.

Replace the *\<server-name>* placeholder with a unique SQL Database name. This name is used as the part of the SQL Database endpoint, `<server-name>.database.windows.net`, so the name needs to be unique across all logical servers in Azure. The name must contain only lowercase letters, numbers, and the hyphen (-) character, and must be between 3 and 50 characters long. Also, replace *\<db-username>* and *\<db-password>* with a username and password of your choice. 


```azurecli-interactive
az sql server create --name <server-name> --resource-group myResourceGroup --location "West Europe" --admin-user <db-username> --admin-password <db-password>
```

When the SQL Database logical server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "sqladmin",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "<server-name>.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Sql/servers/<server-name>",
  "identity": null,
  "kind": "v12.0",
  "location": "westeurope",
  "name": "<server-name>",
  "resourceGroup": "myResourceGroup",
  "state": "Ready",
  "tags": null,
  "type": "Microsoft.Sql/servers",
  "version": "12.0"
}
```

### Configure a server firewall rule

Create an [Azure SQL Database server-level firewall rule](../../sql-database/sql-database-firewall-configure.md) using the [`az sql server firewall create`](/cli/azure/sql/server/firewall-rule?view=azure-cli-latest#az-sql-server-firewall-rule-create) command. When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources. 

```azurecli-interactive
az sql server firewall-rule create --resource-group myResourceGroup --server <server-name> --name AllowYourIp --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

### Create a database

Create a database with an [S0 performance level](../../sql-database/sql-database-service-tiers-dtu.md) in the server using the [`az sql db create`](/cli/azure/sql/db?view=azure-cli-latest#az-sql-db-create) command.

```azurecli-interactive
az sql db create --resource-group myResourceGroup --server <server-name> --name coreDB --service-objective S0
```

### Create connection string

Replace the following string with the *\<server-name>*, *\<db-username>*, and *\<db-password>* you used earlier.

```
Server=tcp:<server-name>.database.windows.net,1433;Database=coreDB;User ID=<db-username>;Password=<db-password>;Encrypt=true;Connection Timeout=30;
```

This is the connection string for your .NET Core app. Copy it for use later.

## Deploy app to Azure

In this step, you deploy your SQL Database-connected .NET Core application to App Service on Linux.

### Configure local git deployment

[!INCLUDE [Configure a deployment user](../../../includes/configure-deployment-user-no-h.md)]

### Create an App Service plan

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]

### Create a web app

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-dotnetcore-linux-no-h.md)] 

### Configure an environment variable

To set connection strings for your Azure app, use the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell. In the following command, replace *\<app-name>*, as well as the *\<connection-string>* parameter with the connection string you created earlier.

```azurecli-interactive
az webapp config connection-string set --resource-group myResourceGroup --name <app name> --settings MyDbConnection='<connection-string>' --connection-string-type SQLServer
```

Next, set `ASPNETCORE_ENVIRONMENT` app setting to _Production_. This setting lets you know whether you are running in Azure, because you use SQLite for your local development environment and SQL Database for your Azure environment.

The following example configures a `ASPNETCORE_ENVIRONMENT` app setting in your Azure app. Replace the *\<app-name>* placeholder.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings ASPNETCORE_ENVIRONMENT="Production"
```

### Connect to SQL Database in production

In your local repository, open Startup.cs and find the following code:

```csharp
services.AddDbContext<MyDatabaseContext>(options =>
        options.UseSqlite("Data Source=localdatabase.db"));
```

Replace it with the following code, which uses the environment variables that you configured earlier.

```csharp
// Use SQL Database if in Azure, otherwise, use SQLite
if(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
    services.AddDbContext<MyDatabaseContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("MyDbConnection")));
else
    services.AddDbContext<MyDatabaseContext>(options =>
            options.UseSqlite("Data Source=MvcMovie.db"));

// Automatically perform database migration
services.BuildServiceProvider().GetService<MyDatabaseContext>().Database.Migrate();
```

If this code detects that it is running in production (which indicates the Azure environment), then it uses the connection string you configured to connect to the SQL Database. For information on how app settings are accessed in App Service, see [Access environment variables](configure-language-dotnetcore.md#access-environment-variables).

The `Database.Migrate()` call helps you when it is run in Azure, because it automatically creates the databases that your .NET Core app needs, based on its migration configuration.

Save your changes, then commit it into your Git repository.

```bash
git add .
git commit -m "connect to SQLDB in Azure"
```

### Push to Azure from Git

[!INCLUDE [app-service-plan-no-h](../../../includes/app-service-web-git-push-to-azure-no-h.md)]

```bash
Counting objects: 98, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (92/92), done.
Writing objects: 100% (98/98), 524.98 KiB | 5.58 MiB/s, done.
Total 98 (delta 8), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: .
remote: Updating submodules.
remote: Preparing deployment for commit id '0c497633b8'.
remote: Generating deployment script.
remote: Project file path: ./DotNetCoreSqlDb.csproj
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling ASP.NET Core Web Application deployment.
remote: .
remote: .
remote: .
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
remote: App container will begin restart within 10 seconds.
To https://<app-name>.scm.azurewebsites.net/<app-name>.git
 * [new branch]      master -> master
```

### Browse to the Azure app

Browse to the deployed app using your web browser.

```bash
http://<app-name>.azurewebsites.net
```

Add a few to-do items.

![app running in App Service on Linux](./media/tutorial-dotnetcore-sqldb-app/azure-app-in-browser.png)

**Congratulations!** You're running a data-driven .NET Core app in App Service on Linux.

## Update locally and redeploy

In this step, you make a change to your database schema and publish it to Azure.

### Update your data model

Open _Models\Todo.cs_ in the code editor. Add the following property to the `ToDo` class:

```csharp
public bool Done { get; set; }
```

### Run Code First Migrations locally

Run a few commands to make updates to your local database.

```bash
dotnet ef migrations add AddProperty
```

Update the local database:

```bash
dotnet ef database update
```

### Use the new property

Make some changes in your code to use the `Done` property. For simplicity in this tutorial, you're only going to change the `Index` and `Create` views to see the property in action.

Open _Controllers\TodosController.cs_.

Find the `Create()` method and add `Done` to the list of properties in the `Bind` attribute. When you're done, your `Create()` method signature looks like the following code:

```csharp
public async Task<IActionResult> Create([Bind("ID,Description,CreatedDate,Done")] Todo todo)
```

Open _Views\Todos\Create.cshtml_.

In the Razor code, you should see a `<div class="form-group">` element for `Description`, and then another `<div class="form-group">` element for `CreatedDate`. Immediately following these two elements, add another `<div class="form-group">` element for `Done`:

```csharp
<div class="form-group">
    <label asp-for="Done" class="col-md-2 control-label"></label>
    <div class="col-md-10">
        <input asp-for="Done" class="form-control" />
        <span asp-validation-for="Done" class="text-danger"></span>
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

Find the `<td>` element that contains the `asp-action` tag helpers. Just above this element, add the following Razor code:

```csharp
<td>
    @Html.DisplayFor(modelItem => item.Done)
</td>
```

That's all you need to see the changes in the `Index` and `Create` views.

### Test your changes locally

Run the app locally.

```bash
dotnet run
```

In your browser, navigate to `http://localhost:5000/`. You can now add a to-do item and check **Done**. Then it should show up in your homepage as a completed item. Remember that the `Edit` view doesn't show the `Done` field, because you didn't change the `Edit` view.

### Publish changes to Azure

```bash
git add .
git commit -m "added done field"
git push azure master
```

Once the `git push` is complete, navigate to your Azure app and try out the new functionality.

![Azure app after Code First Migration](./media/tutorial-dotnetcore-sqldb-app/this-one-is-done.png)

All your existing to-do items are still displayed. When you republish your .NET Core app, existing data in your SQL Database is not lost. Also, Entity Framework Core Migrations only changes the data schema and leaves your existing data intact.

## Stream diagnostic logs

The sample project already follows the guidance at [ASP.NET Core Logging in Azure](https://docs.microsoft.com/aspnet/core/fundamentals/logging#azure-app-service-provider) with two configuration changes:

- Includes a reference to `Microsoft.Extensions.Logging.AzureAppServices` in *DotNetCoreSqlDb.csproj*.
- Calls `loggerFactory.AddAzureWebAppDiagnostics()` in *Startup.cs*.

> [!NOTE]
> The project's log level is set to `Information` in *appsettings.json*.
>

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

For more information on customizing the ASP.NET Core logs, see [Logging in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/logging).

## Manage your Azure app

Go to the [Azure portal](https://portal.azure.com) to see the app you created.

From the left menu, click **App Services**, then click the name of your Azure app.

![Portal navigation to Azure app](./media/tutorial-dotnetcore-sqldb-app/access-portal.png)

By default, the portal shows your app's **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

![App Service page in Azure portal](./media/tutorial-dotnetcore-sqldb-app/web-app-blade.png)

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

<a name="next"></a>
## Next steps

What you learned:

> [!div class="checklist"]
> * Create a SQL Database in Azure
> * Connect a .NET Core app to SQL Database
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream logs from Azure to your terminal
> * Manage the app in the Azure portal

Advance to the next tutorial to learn how to map a custom DNS name to your app.

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../app-service-web-tutorial-custom-domain.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Configure ASP.NET Core app](configure-language-dotnetcore.md)
