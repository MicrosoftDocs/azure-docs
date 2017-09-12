---
title: Build a .NET Core and SQL Database web app in Azure Web App for Containers | Microsoft Docs 
description: Learn how to get a .NET Core app working in Azure Web App for Containers, with connection to a SQL Database.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: syntaxc4
editor: ''

ms.assetid: 0b4d7d0e-e984-49a1-a57a-3c0caa955f0e
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 08/31/2017
ms.author: cephalin
ms.custom: mvc
---
# Build a .NET Core and SQL Database web app in Azure Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a .NET Core web app and connect it to a SQL Database. When you're done, you'll have a .NET Core MVC app running in Web App for Containers. 

![app running in Web App for Containers](./media/tutorial-dotnetcore-sqldb-app/azure-app-in-browser.png)

What you learn how to:

> [!div class="checklist"]
> * Create a SQL Database in Azure
> * Connect a .NET Core app to SQL Database
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

## Prerequisites

To complete this tutorial:

1. [Install Git](https://git-scm.com/)
1. [Install .NET Core SDK 1.1.2](https://github.com/dotnet/core/blob/master/release-notes/download-archives/1.1.2-download.md)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create local .NET Core app

In this step, you set up the local .NET Core project.

### Clone the sample application

In the terminal window, `cd` to a working directory.  

Run the following commands to clone the sample repository and change to its root.

```bash
git clone https://github.com/azure-samples/dotnetcore-sqldb-tutorial
cd dotnetcore-sqldb-tutorial
```

The sample project contains a basic CRUD (create-read-update-delete) app using [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/).

### Run the application

Run the following commands to install the required packages, run database migrations, and start the application.

```bash
dotnet restore
dotnet ef database update
dotnet run
```

Navigate to http://localhost:5000 in a browser. Select the **Create New** link and create a couple _to-do_ items.

![connects successfully to SQL Database](./media/tutorial-dotnetcore-sqldb-app/local-app-in-browser.png)

To stop .NET Core at any time, press `Ctrl+C` in the terminal. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create production SQL Database

In this step, you create a SQL Database in Azure. When your app is deployed to Azure, it uses this cloud database.

For SQL Database, this tutorial uses [Azure SQL Database](/azure/sql-database/). 

### Create a resource group

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-no-h.md)] 

### Create a SQL Database logical server

In the Cloud Shell, create a SQL Database logical server with the [az sql server create](/cli/azure/sql/server#create) command.

Replace the *\<server_name>* placeholder with a unique SQL Database name. This name is used as the part of the SQL Database endpoint, `<server_name>.database.windows.net`, so the name needs to be unique across all logical servers in Azure. The name must contain only lowercase letters, numbers, and the hyphen (-) character, and must be between 3 and 50 characters long. Also, replace *\<db_username>* and *\<db_password>* with a username and password of your choice. 


```azurecli-interactive
az sql server create --name <server_name> --resource-group myResourceGroup --location "West Europe" --admin-user <db_username> --admin-password <db_password>
```

When the SQL Database logical server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "sqladmin",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "<server_name>.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Sql/servers/<server_name>",
  "identity": null,
  "kind": "v12.0",
  "location": "westeurope",
  "name": "<server_name>",
  "resourceGroup": "myResourceGroup",
  "state": "Ready",
  "tags": null,
  "type": "Microsoft.Sql/servers",
  "version": "12.0"
}
```

### Configure a server firewall rule

Create an [Azure SQL Database server-level firewall rule](../../sql-database/sql-database-firewall-configure.md) using the [az sql server firewall create](/cli/azure/sql/server#create) command. When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources. 

```azurecli-interactive
az sql server firewall-rule create --resource-group myResourceGroup --server <server_name> --name AllowYourIp --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

### Create a database

Create a database with an [S0 performance level](../../sql-database/sql-database-service-tiers.md) in the server using the [az sql db create](/cli/azure/sql/db#create) command. 

```azurecli-interactive
az sql db create --resource-group myResourceGroup --server <server_name> --name coreDB --service-objective S0
```

### Create connection string

Replace the following string with the *\<server_name>*, *\<db_username>*, and *\<db_password>* you used earlier.

```
Server=tcp:<server_name>.database.windows.net,1433;Initial Catalog=coreDB;Persist Security Info=False;User ID=<db_username>;Password=<db_password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

This is the connection string for your .NET Core app. Copy it for use later.

## Deploy app to Azure

In this step, you deploy your SQL Database-connected .NET Core application to Web App for Containers.

### Configure local git deployment 

[!INCLUDE [Configure a deployment user](../../../includes/configure-deployment-user-no-h.md)]

### Create an App Service plan

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux-no-h.md)] 

### Create a web app

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-linux-dotnetcore-no-h.md)] 

### Configure an environment variable

To set connection strings for your Azure app, use the [az webapp config appsettings update](/cli/azure/webapp/config/appsettings#update) command in the Cloud Shell. In the following command, replace *\<app name>*, as well as the *\<connection_string>* parameter with the connection string you created earlier.

```azurecli-interactive
az webapp config connection-string set --resource-group myResourceGroup --name <app name> --settings MyDbConnection='<connection_string>' --connection-string-type SQLServer
```

Next, set `ASPNETCORE_ENVIRONMENT` app setting to _Production_. This setting lets you know whether you are running in Azure, because you use SQLLite for your local development environment and SQL Database for your Azure environment. 

The following example configures a `ASPNETCORE_ENVIRONMENT` app setting in your Azure web app. Replace the *\<app_name>* placeholder.

```azurecli-interactive
az webapp config appsettings set --name <app_name> --resource-group myResourceGroup --settings ASPNETCORE_ENVIRONMENT="Production"
```

### Connect to SQL Database in production

In your local repository, open Startup.cs and find the following code:

```csharp
services.AddDbContext<MyDatabaseContext>(options =>
        options.UseSqlite("Data Source=localdatabase.db"));
```

Replace it with the following code, which uses the environment variables that you configured earlier.

```csharp
// Use SQL Database if in Azure, otherwise, use SQLLite
if(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
    services.AddDbContext<DotNetCoreSqlDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("MyDbConnection")));
else
    services.AddDbContext<DotNetCoreSqlDbContext>(options =>
            options.UseSqlite("Data Source=MvcMovie.db"));

// Automatically perform database migration
services.BuildServiceProvider().GetService<DotNetCoreSqlDbContext>().Database.Migrate();
```

If this code detects that it is running in production (which indicates the Azure environment), then it uses the connection string you configured to connect to the SQL Database. 

The `Database.Migration()` call helps you when it is run in Azure, because it automatically creates the databases that your .NET Core app needs, based on its migration configuration. 

Save your changes.

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
To https://<app_name>.scm.azurewebsites.net/<app_name>.git
 * [new branch]      master -> master
``` 

### Browse to the Azure web app 

Browse to the deployed web app using your web browser. 

```bash 
http://<app_name>.azurewebsites.net 
``` 

Add a few to-do items.

![app running in Web App for Containers](./media/tutorial-dotnetcore-sqldb-app/azure-app-in-browser.png)

**Congratulations!** You're running a data-driven .NET Core app in Web App for Containers.

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
    @Html.DisplayFor(modelItem => item.CreatedDate)
</td>
```

That's all you need to see the changes in the `Index` and `Create` views. 

### Test your changes locally

Run the app locally.

```
dotnet run
```

In your browser, navigate to http://local:5000/. You can now add a to-do item and check **Done**. Then it should show up in your homepage as a completed item. Remember that the `Edit` view doesn't show the `Done` field, because you didn't change the `Edit` view.

### Publish changes to Azure

```bash

git commit -am "added done field"
git push azure master
```

Once the `git push` is complete, navigate to your Azure web app and try out the new functionality.

![Azure web app after Code First Migration](./media/tutorial-dotnetcore-sqldb-app/this-one-is-done.png)

All your existing to-do items are still displayed. When you republish your .NET Core app, existing data in your SQL Database is not lost. Also, Entity Framework Core Migrations only changes the data schema and leaves your existing data intact.

## Manage your Azure web app

Go to the [Azure portal](https://portal.azure.com) to see the web app you created.

From the left menu, click **App Services**, then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/tutorial-dotnetcore-sqldb-app/access-portal.png)

By default, the portal shows your web app's **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the page show the different configuration pages you can open.

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

Advance to the next tutorial to learn how to map a custom DNS name to your web app.

> [!div class="nextstepaction"] 
> [Map an existing custom DNS name to Azure Web Apps](../../app-service-web/app-service-web-tutorial-custom-domain.md)
