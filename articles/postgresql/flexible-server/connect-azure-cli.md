---
title: 'Quickstart: Connect using Azure CLI - Azure Database for PostgreSQL - Flexible Server'
description: This quickstart provides several ways to connect with Azure CLI with Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.custom: mvc, mode-api, devx-track-azurecli
ms.tool: azure-cli
ms.topic: quickstart
ms.date: 11/30/2021
---

# Quickstart: Connect and query with Azure CLI  with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This quickstart demonstrates how to connect to an Azure Database for PostgreSQL Flexible Server using Azure CLI with ```az postgres flexible-server connect``` and execute single query or sql file with ```az postgres flexible-server execute``` command. This command allows you test connectivity to your database server and run queries. You can also run multiple queries using the interactive mode. 


## Prerequisites
- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- Install [Azure CLI](/cli/azure/install-azure-cli) latest version (2.20.0 or above)
- Log in using Azure CLI with ```az login``` command 
- Turn on parameter persistence with ```az config param-persist on```. Parameter persistence will help you use local context without having to repeat numerous arguments like resource group or location.

## Create a PostgreSQL Flexible Server

The first thing we'll create is a managed PostgreSQL server. In [Azure Cloud Shell](https://shell.azure.com/), run the following script and make a note of the **server name**, **username** and  **password** generated from this command.

```azurecli
az postgres flexible-server create --public-access <your-ip-address>
```
You can provide more arguments for this command to customize it. See all arguments for [az postgres flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create).

## View all the arguments
You can view all the arguments for this command with ```--help``` argument. 

```azurecli
az postgres flexible-server connect --help
```

## Test database server connection
You can test and validate the connection to the database from your development environment using the command.

```azurecli
az postgres flexible-server connect -n <servername> -u <username> -p "<password>" -d <databasename>
```
**Example:** 
```azurecli
az postgres flexible-server connect -n postgresdemoserver -u dbuser -p "dbpassword" -d postgres
```
You'll see the output if the connection was successful.
```output
Command group 'postgres flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Successfully connected to postgresdemoserver.
Local context is turned on. Its information is saved in working directory C:\mydir. You can run `az local-context off` to turn it off.
Your preference of  are now saved to local context. To learn more, type in `az local-context --help`
```

If the connection failed, try these solutions:
- Check if port 5432 is open on your client machine.
- if your server administrator user name and password are correct
- if you have configured firewall rule for your client machine
- if you've configured your server with private access in virtual networking, make sure your client machine is in the same virtual network.

## Run multiple queries using interactive mode
You can run multiple queries using the **interactive** mode. To enable interactive mode, run the following command

```azurecli
az postgres flexible-server connect -n <servername> -u <username> -p "<password>" -d <databasename>
```

**Example:**

```azurecli
az postgres flexible-server connect -n postgresdemoserver -u dbuser -p "dbpassword" -d flexibleserverdb --interactive
```

You'll see the **psql** shell experience as shown below:

```bash
Command group 'postgres flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Password for earthyTurtle7:
Server: PostgreSQL 12.5
Version: 3.0.0
Chat: https://gitter.im/dbcli/pgcli
Home: http://pgcli.com
postgres> create database pollsdb;
CREATE DATABASE
Time: 0.308s
postgres> exit
Goodbye!
Local context is turned on. Its information is saved in working directory C:\sunitha. You can run `az local-context off` to turn it off.
Your preference of  are now saved to local context. To learn more, type in `az local-context --help`
```

**Example:** 
```azurecli
az postgres flexible-server execute -n postgresdemoserver -u dbuser -p "dbpassword" -d flexibleserverdb -q "select * from table1;" --output table
```

You'll see an output as shown below:

```output
Command group 'postgres flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Successfully connected to postgresdemoserver.
Ran Database Query: 'select * from table1;'
Retrieving first 30 rows of query output, if applicable.
Closed the connection postgresdemoserver.
Local context is turned on. Its information is saved in working directory C:\mydir. You can run `az local-context off` to turn it off.
Your preference of  are now saved to local context. To learn more, type in `az local-context --help`
Txt    Val
-----  -----
test   200
test   200
test   200
test   200
test   200
test   200
test   200
```

## Run SQL File
You can execute a sql file with the command using ```--file-path``` argument, ```-f```.

```azurecli
az postgres flexible-server execute -n <server-name> -u <username> -p "<password>" -d <database-name> --file-path "<file-path>"
```

**Example:** 
```azurecli
az postgres flexible-server execute -n postgresdemoserver -u dbuser -p "dbpassword" -d flexibleserverdb -f "./test.sql"
```

You'll see an output as shown below:

```output
Command group 'postgres flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Running sql file '.\test.sql'...
Successfully executed the file.
Closed the connection to postgresdemoserver.
```

## Next Steps

> [!div class="nextstepaction"]
> [Manage the server](./how-to-manage-server-cli.md)
