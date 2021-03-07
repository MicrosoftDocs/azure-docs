---
title: 'Quickstart: Connect using Azure CLI - Azure Database for PostgreSQL - Flexible Server'
description: This quickstart provides several ways to connect with Azure CLI with Azure Database for PostgreSQL - Flexible Server.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.custom: mvc
ms.topic: quickstart
ms.date: 03/06/2021
---

# Quickstart: Connect and query with Azure CLI  with Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is currently in public preview.

This quickstart demonstrates how to connect to an Azure Database for PostgreSQL Flexible Server using Azure CLI with ```az postgres flexible-server connect``` command. This command allows you test connectivity to your database server as well as run queries directly against your server.  You can also use run the command in an interactive mode for running multiple queries.

## Prerequisites
- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- Install [Azure CLI](/cli/azure/install-azure-cli) latest version (2.20.0 or above)
- Login using Azure CLI with ```az login``` command 
- Turn on parameter persistence with ```az config param-persist on```. Parameter persistence will help you use local context without having to repeat a lot of arguments like resource group or location etc.

## Create an PostgreSQL Flexible Server

The first thing we'll create is a managed PostgreSQL server. In [Azure Cloud Shell](https://shell.azure.com/), run the following script and make a note of the **server name**, **username** and  **password** generated from this command.

```azurecli
az postgres flexible-server create --public-access <your-ip-address>
```
You can provide additional arguments for this command to customize it. See all arguments for [az postgres flexible-server create](/cli/azure/postgres/flexible-server?view=azure-cli-latest#az_postgres_flexible_server_create).

## Test database server connection
Run the following script to test and validate the connection to the server from your development environment.

```azurecli
az postgres flexible-server connect -n server -u username -p password
```
Here is an example 
```azurecli
az postgres flexible-server connect -n postgresdemoserver -u dbuser -p "dbpassword" -d postgres
```
You will see the output if the connection was successful.
```output
Command group 'postgres flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Successfully connected to postgresdemoserver.
Local context is turned on. Its information is saved in working directory C:\mydir. You can run `az local-context off` to turn it off.
Your preference of  are now saved to local context. To learn more, type in `az local-context --help`
```

If the connection failed, please check:
- Check if port 5432 is open on your client machine.
- if your server administrator user name and password are correct
- if you have configured firewall rule for your client machine
- if you have configured your server with private access in virtual networking, make sure your client machine is in the same virtual network.

## Run Single Query
Run the following command to execute a single query using ```--query-text``` argument, ```-q```.

```azurecli
az postgres flexible-server connect -n <server-name> -u <username> -p <password> -d <database-name> -c 'SELECT id , name FROM table1;'
```

Here is an example for running a SELECT command 
```azurecli
az postgresql flexible-server connect -n postgresdemoserver -u dbuser -p "dbpassword" -d flexibleserverdb -q "select * from table1;" --output table
```
You will see an output as shown below:
```output
Command group 'postgres flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Successfully connected to postgresdemoserver.
Ran Database Query: 'select * from table1;'
Retrieving first 30 rows of query output.
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

## Run multiple queries using interactive mode
You can run multiple queries using the **interactive** mode . To enable interactive mode, run the following command

```azurecli
az postgres flexible-server connect -n <server-name> -u <username> -p <password> --interactive
```

Here is an example
```azurecli
az postgresql flexible-server connect -n postgresdemoserver -u dbuser -p "dbpassword" -d flexibleserverdb --interactive
```

You will see the **MySQL** shell experience as shown below:
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

## Next Steps
[Manage the server](./how-to-manage-server-cli.md)
