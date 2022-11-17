---
title: Configure Storage Provider - MSSQL
description: Configure a Durable Functions app to use MSSQL
author: davidmrdavid
ms.topic: quickstart
ms.date: 11/14/2022
ms.reviewer: azfuncdf
---

# Switch to the MSSQL Backend

Durable Functions offers several [storage providers](durable-functions-storage-providers.md), also called "backends" for short, each with their own [design characteristics](durable-functions-storage-providers.md#comparing-storage-providers). By default, new projects are configured to use the [Azure Storage provider](durable-functions-storage-providers.md#azure-storage). In this article, we walk through how to configure an existing Durable Functions app to utilize the [MSSQL storage provider](durable-functions-storage-providers.md#mssql).

The MSSQL backend was designed to maximize application portability, and control over your data. It uses [MSSQL Server](https://www.microsoft.com/sql-server/) to persist all Task Hub state so it reaps the benefits of MSSQL DBMS infrastructure towards scalability, security, compatibility with vendors, etc.  To learn more about when the MSSQL backend may be good choice, please review our documentation on [storage providers](durable-functions-storage-providers.md).

## Note on data migration

We do not currently support the migration of [Task Hub data](durable-functions-task-hubs.md) across storage providers. This means that your application will need to start with a fresh, empty Task Hub after switching to the MSSQL backend. Similarly, the Task Hub contents created with MSSQL cannot be preserved when switching to a different *backend*.

> [!NOTE]
> Changing your storage provider is a kind of breaking change as pre-existing data will not be transferred over. You can review the Durable Functions [versioning docs](durable-functions-versioning.md) for guidance on how to make these changes.

While data migration *across storage providers* is not supported, the MSSQL storage provider does allow for data transfer between MSSQL-compatible providers. This means that there's no need to worry about your Task Hub data being locked to a particular vendor.

## Prerequisites

We assume that you are starting with an existing Durable Functions app, and are familiar with how to operate it. 

In particular, we expect that you have already:
1. Created a Functions project on your local machine.
1. Added Durable Functions to your project.
1. Configured the project for local debugging.
1. Deployed the local project to a Function app that runs in the cloud.

If this is not the case, we suggest you start with one of the following articles, which provides detailed instructions on how to achieve all the requirements above:

- [Create your first durable function - C#](durable-functions-create-first-csharp.md)
- [Create your first durable function - JavaScript](quickstart-js-vscode.md)
- [Create your first durable function - Python](quickstart-python-vscode.md)
- [Create your first durable function - PowerShell](quickstart-powershell-vscode.md)
- [Create your first durable function - Java](quickstart-java.md)

## Ensure the Extension is installed

> [!NOTE]
> If your app uses [Extension Bundles](/articles/azure/azure-functions/functions-bindings-register#extension-bundles), you should ignore this section as Extension Bundles removes the need for manual Extension management.
You will need to install the latest version of the `Microsoft.DurableTask.SqlServer.AzureFunctions` [Extension on Nuget](https://www.nuget.org/packages/Microsoft.DurableTask.SqlServer.AzureFunctions) on your app. This usually means including a reference to it in your `.csproj` file and building the project.

There are many ways to achieve this, especially for C# users who may leverage [Visual Studio package management tools](/articles/nuget/consume-packages/install-use-packages-visual-studio), the [Nuget package manager](../functions-develop-vs-code.md?tabs=csharp#install-binding-extensions) or even the [dotnet CLI](../functions-develop-vs-code.md?tabs=csharp#install-binding-extensions).

However, all languages should be able to utilize the [Azure Functions Core Tools CLI](../functions-run-local.md?tabs=v4,windows,csharp,portal,bash#install-the-azure-functions-core-tools) to do this. With it, you may install the MSSQL backend using the following command:

```cmd
func extensions install --package Microsoft.Azure.DurableTask.SqlServer.AzureFunctions --version <latestVersionOnNuget>
```

For more information on installing Azure Functions Extensions via the Core Tools CLI, please see [this guide](../functions-run-local.md?tabs=v4,windows,csharp,portal,bash#install-extensions).

## Set up your Database

> [!NOTE]
> If you already have an MSSQL-compatible database, you may skip this section *and* it's sub-section on setting up a Docker-based local DB.

As the MSSQL backend is designed for portability, you have several options to set up your backing database. You may decide to set up an on-premise DBMS, or a cloud-provided instance such as the [Azure SQL DB](https://learn.microsoft.com/azure/azure-sql/database/sql-database-paas-overview?view=azuresql), [Microsoft SQL Server on AWS](https://aws.amazon.com/sql/?blog-posts-content-windows.sort-by=item.additionalFields.createdDate&blog-posts-content-windows.sort-order=desc), [Google Cloud's Cloud SQL](https://cloud.google.com/sql/), etc. 

You also have options to support local development, even offline: could set up an [MS SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads) instance on your local machine, or host your own SQL server from within an MSSQL Docker container. For ease of setup, we will focus on the latter.

### Set up your Docker-based local DBMS

You will need a [Docker](https://www.docker.com/products/docker-desktop/) installation on your local machine. Below are PowerShell commands that you can use to set up a local DB on Docker. Note that you can install PowerShell on both [Linux](https://learn.microsoft.com/powershell/scripting/install/installing-powershell-on-linux) and [macOS](https://learn.microsoft.com/powershell/scripting/install/installing-powershell-on-macos).

```powershell
# primary parameters
$pw        = "yourStrong(!)Password"
$edition   = "Developer"
$port      = 1433
$tag       = "2019-latest"
$dbname    = "DurableDB"
$collation = "Latin1_General_100_BIN2_UTF8"

# pull the image from the Microsoft container registry
docker pull mcr.microsoft.com/mssql/server:$tag

# run the image, providing some basic setup parameters
docker run --name mssql-server -e 'ACCEPT_EULA=Y' -e "SA_PASSWORD=$pw" -e "MSSQL_PID=$edition" -p ${port}:1433 -d mcr.microsoft.com/mssql/server:$tag

# wait a few seconds for the container to start...

# create the database with strict binary collation
docker exec -d mssql-server /opt/mssql-tools/bin/sqlcmd -S . -U sa -P "$pw" -Q "CREATE DATABASE [$dbname] COLLATE $collation"
```

After running these commands, you should have a local SQL Server running on Docker and listening on port `1443`. If port `1443` were to conflict with another service, you can re-run these commands after changing the variable `$port` to a different value.

> [!NOTE]
> To stop and delete a running container, you may use `docker stop <containerName>` and `docker rm <containerName>` respectively. You may use these commands to re-create your container, and to stop if after you're done with this quickstart. For more assistance, try `docker --help`.

For validation's sake, you may query your new SQL DB through `docker exec -it mssql-server /opt/mssql-tools/bin/sqlcmd -S . -U sa -P "$pw"  -Q "<your SQL query>"`. For example, to ensure the `DurableDB` database exists, you may execute `docker exec -it mssql-server /opt/mssql-tools/bin/sqlcmd -S . -U sa -P "$pw"  -Q "SELECT name FROM sys.databases"`, which should output something like the following

```bash
name

--------------------------------------------------------------
master

tempdb

model

msdb

DurableDB


(5 rows affected)
```

In this instance, you're looking for a result named `DurableDB`, which we can see as the last item above.

## Add your DB connection string to local.settings.json

The MSSQL backend needs a connection string to your database. How to obtain a connection string largely depends on your specific MSSQL Server provider. Please review the documentation of your specific provider for information on how to obtain a connection string.

Generally, a minimal connection string looks as follows:

```
"Server=<server hosting your SQL DB>;Database=<DB name>;User Id=<DB login username>;Password=<DB login password>;"
```

Depending on your setup, your DB's connection string may have more properties those shown above. However, these suffice for the Docker-based local DB that we instantiated in the previous section. For example, if you used our commands above without changing any parameters, your connection string should be:

```
Server=localhost,1433;Database=DurableDB;User Id=sa;Password=yourStrong(!)Password;
```

After obtaining your connection string, add it to `local.settings.json` so it can be used during local development. We'll assign it to the variable `SQLDB_Connection`, as shown below:

```json
// ...
"SQLDB_Connection": "Server=<server hosting your SQL DB>;Database=<DB name>; ...", // use your own connection string
}
```

### Update host.json

Edit the storage provider section of the `host.json` file so it sets the `type` to `mssql`. We'll also specify the connection string variable name, `SQLDB_Connection`, under `connectionStringName`. We'll set `createDatabaseIfNotExists` to `true`; this setting creates a database named `DurableDB` if one does not already exists, with coallition `Latin1_General_100_BIN2_UTF8`.

```json
{
  ...
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "mssql",
        "connectionStringName": "SQLDB_Connection",
        "createDatabaseIfNotExists": true, 
        }
    }
  }
}    
```

The snippet above is a *minimal* configuration. Later, you may want to consider [additonal parameters](https://microsoft.github.io/durabletask-mssql/#/quickstart?id=hostjson-configuration).

### Test locally

Your app is now ready for local development: You can start the Function app to test it. One way to do this is to run `func host start` on your applications' root and executing a simple orchestrator Function.

While the MSSQL backend is running, it will write to its backing DB. You can test this is working as expected using your SQL query interface. For example, in our docker-based local SQL server, you may view the state of 5 of your orchestrator instanceIDs through the following command:

```bash
docker exec -it mssql-server /opt/mssql-tools/bin/sqlcmd -S . -U sa -P "$pw"  -Q "SELECT TOP 5 InstanceID, RuntimeStatus, CreatedTime, CompletedTime FROM DurableDB.dt.Instances"
```

After a single orchestrator run, that query should return something like this:

```
InstanceID                           RuntimeStatus        CreatedTime                   CompletedTime
------------------------------------ -------------------- ----------------------------- ----------------------------
9fe1ea9d109341ff923621c0e58f215c     Completed            2022-11-16 21:42:39.1787277   2022-11-16 21:42:42.3993899
```


## Configure the app in Azure

Assuming that you already have target app in Azure for deployment, we'll need to create a setting for it containing your connection string.

To do this through the Azure portal, first go to your Function App view. Then go under "Configuration", select "New application setting", and there you can assign "SQLDB_Connection" to map to a publicly accessible connection string. Below are some guiding images.

> [!NOTE]
> Your Azure app won't be able to deploy to the Docker-based local image we created. You will need a publicly accessible SQL Server instance, and its corresponding connection string, instead. As mentioned above, there are many providers offering such services. If you want an Azure-provided solution, see the section below on instantiating an Azure SQL database.

### (optional) Creating an Azure SQL database

If you don't have a publicly accessible SQL Server already, you can create one on Azure. If you already have one, irrespective of provider, you can skip this section.

You can follow [these](https://learn.microsoft.com/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal&view=azuresql) instructions to create an Azure SQL database on the portal. When configuring these database, make sure to set the *Database collation* (under _Additional settings_) to `Latin1_General_100_BIN2_UTF8`.

> [!NOTE]
> Microsoft offers a [12-month free Azure subscription account]((https://azure.microsoft.com/free/) if you’re exploring Azure for the first time.

You may obtain your Azure SQL database's connection string by navigating to the database's blade in the Azure portal. Then, under Settings, select "Connection strings" and obtain the "ADO.NET" connection string. Make sure to provided your password in the template provided.

## Deploy and enjoy

You can now deploy your code to the cloud, and then run your tests or workload on it. To validate the MSSQL backend is correctly configured, you can query your database for Task Hub data.

For instance, if you were using an Azure SQL database, you could review the information about your orchestration instanceIDs by going to your SQL database's blade, going to Query Editor, authenticating, and then running the following query:

```sql
SELECT TOP 5 InstanceID, RuntimeStatus, CreatedTime, CompletedTime FROM dt.Instances
```

After running a simple orchestrator, you should see at least one result, as shown below:

![Azure SQL Query editor results for the SQL query provided.](./media/quickstart-mssql/mssql-azure-db-check.png)

And that's it for this walkthrough!

For more information about the the MSSQL architecture, configuration, and workload behavior, we recommend you take a look at the [MSSQL storage provider documentation](https://microsoft.github.io/durabletask-mssql/#/).
