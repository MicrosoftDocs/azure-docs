---
title: "Quickstart: Connect using Azure CLI"
description: This quickstart provides several ways to connect with Azure CLI with Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/10/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: quickstart
ms.custom:
  - mvc
  - mode-api
  - devx-track-azurecli
---

# Quickstart: Connect and query with Azure CLI  with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This quickstart demonstrates how to connect to an Azure Database for PostgreSQL flexible server instance using Azure CLI with `az postgres flexible-server connect` and execute single query or sql file with `az postgres flexible-server execute` command. This command allows you test connectivity to your database server and run queries. You can also run multiple queries using the interactive mode. 


## Prerequisites
- An Azure account with an active subscription. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- Install [Azure CLI](/cli/azure/install-azure-cli) latest version.
- Sign in using Azure CLI with `az login` command.
- (optional) Turn on an experimental parameter persistence with `az config param-persist on`. Parameter persistence helps you use local context without having to repeat numerous arguments like resource group or location.

## Create Azure Database for PostgreSQL flexible server instance

The first thing to create is a managed Azure Database for PostgreSQL flexible server instance. In [Azure Cloud Shell](https://shell.azure.com/), run the following script and make a note of the **server name**, **username, and  **password** generated from this command.

```azurecli-interactive
az postgres flexible-server create --public-access <your-ip-address>
```
You can provide more arguments for this command to customize it. See all arguments for [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create).

## View all the arguments
You can view all the arguments for this command with `--help` argument. 

```azurecli-interactive
az postgres flexible-server connect --help
```

## Test database server connection
You can test and validate the connection to the database from your development environment using the [az postgres flexible-server connect](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-connect) command.

```azurecli-interactive
az postgres flexible-server connect \
    -n <servername> -u <username> -p "<password>" -d <databasename>
```
**Example:** 
```azurecli-interactive
az postgres flexible-server connect \
    -n server372060240 -u starchylapwing9 -p "dbpassword" -d postgres
```
You see similar output if the connection was successful.

```output
Successfully connected to server372060240.
```

If the connection failed, check the following points:
- if your server administrator user name and password are correct
- if you configured firewall rule for your client machine
- if your server is configured with private access with virtual networking, make sure your client machine is in the same virtual network.

## Run multiple queries using interactive mode
You can run multiple queries using the **interactive** mode. To enable interactive mode, run the following command.

```azurecli-interactive
az postgres flexible-server connect \
    -n <servername> -u <username> -p "<password>" -d <databasename> \
    --interactive
```

**Example:**

```azurecli-interactive
az postgres flexible-server connect \
    -n server372060240 -u starchylapwing9 -p "dbpassword" -d postgres --interactive
```

You see the **psql** shell experience as shown here:

```output
Password for starchylapwing9:
Server: PostgreSQL 13.14
Version: 4.0.1
Home: http://pgcli.com
postgres> SELECT 1;
+----------+
| ?column? |
|----------|
| 1        |
+----------+
SELECT 1
Time: 0.167s
postgres>
```

## Execute single queries
You can run single queries against Postgres database using [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute).

```azurecli-interactive
az postgres flexible-server execute \
    -n <servername> -u <username> -p "<password>" -d <databasename> \
    -q <querytext> --output table
```

**Example:** 
```azurecli-interactive
az postgres flexible-server execute \
    -n server372060240 -u starchylapwing9 -p "dbpassword" -d postgres \
    -q "SELECT 1" --output table
```

You see an output as shown here:

```output
Successfully connected to server372060240.
Ran Database Query: 'SELECT 1'
Retrieving first 30 rows of query output, if applicable.
Closed the connection to server372060240
?column?
----------
1
```

## Run SQL File
You can execute a sql file with the [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute) command using `--file-path` argument, `-f`.

```azurecli-interactive
az postgres flexible-server execute \
    -n <server-name> -u <username> -p "<password>" -d <database-name> \
    --file-path "<file-path>"
```

**Example:** 
Prepare a `test.sql` file. You can use the following test script with simple `SELECT` queries:

```sql
SELECT 1;
SELECT 2;
SELECT 3;
```

Save the content to the `test.sql` file in the current directory and execute using following command.


```azurecli-interactive
az postgres flexible-server execute \
    -n server372060240 -u starchylapwing9 -p "dbpassword" -d postgres \
    -f "test.sql"
```

You see an output as shown here:

```output
Running sql file 'test.sql'...
Successfully executed the file.
Closed the connection to server372060240
```

## Next Steps

> [!div class="nextstepaction"]
> [Manage the server](./how-to-manage-server-cli.md)
