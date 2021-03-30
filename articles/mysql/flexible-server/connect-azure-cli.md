---
title: 'Quickstart: Connect using Azure CLI - Azure Database for MySQL - Flexible Server'
description: This quickstart provides several ways to connect with Azure CLI with Azure Database for MySQL - Flexible Server.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 03/01/2021
---

# Quickstart: Connect and query with Azure CLI  with Azure Database for MySQL - Flexible Server

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

This quickstart demonstrates how to connect to an Azure Database for MySQL Flexible Server using Azure CLI with ```az mysql flexible-server connect``` command. This command allows you test connectivity to your database server and run queries directly against your server.  You can also use run the command in an interactive mode for running multiple queries.

## Prerequisites

- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
- Install [Azure CLI](/cli/azure/install-azure-cli) latest version (2.20.0 or above)
- Login using Azure CLI with ```az login``` command 
- Turn on parameter persistence with ```az config param-persist on```. Parameter persistence will help you use local context without having to repeat a lot of arguments like resource group or location etc.

## Create an MySQL Flexible Server

The first thing we'll create is a managed MySQL server. In [Azure Cloud Shell](https://shell.azure.com/), run the following script and make a note of the **server name**, **username** and  **password** generated from this command.

```azurecli
az mysql flexible-server create --public-access <your-ip-address>
```

You can provide additional arguments for this command to customize it. See all arguments for [az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create).

## Create a database
Run the following command to create a database, **newdatabase** if you have not already created one.

```azurecli
az mysql flexible-server db create -d newdatabase
```

## View all the arguments
You can view all the arguments for this command with ```--help``` argument. 

```azurecli
az mysql flexible-server connect --help
```

## Test database server connection
Run the following script to test and validate the connection to the database from your development environment.

```azurecli
az mysql flexible-server connect -n <servername> -u <username> -p <password> -d <databasename>
```

**Example:**
```azurecli
az mysql flexible-server connect -n mysqldemoserver1 -u dbuser -p "dbpassword" -d newdatabase
```

You should see the following output for successful connection:

```output
Command group 'mysql flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Connecting to newdatabase database.
Successfully connected to mysqldemoserver1.
```
If the connection failed, try these solutions:
- Check if port 3306 is open on your client machine.
- if your server administrator user name and password are correct
- if you have configured firewall rule for your client machine
- if you have configured your server with private access in virtual networking, make sure your client machine is in the same virtual network.

## Run Single Query
Run the following command to execute a single query using ```--querytext``` argument, ```-q```.

```azurecli
az mysql flexible-server connect -n <server-name> -u <username> -p "<password>" -d <database-name> --querytext "<query text>"
```

**Example:**
```azurecli
az mysql flexible-server connect -n mysqldemoserver1 -u dbuser -p "dbpassword" -d newdatabase -q "select * from table1;" --output table
```

You will see an output as shown below:

```output
Command group 'mysql flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Successfully connected to mysqldemoserver1.
Ran Database Query: 'select * from table1;'
Retrieving first 30 rows of query output, if applicable.
Closed the connection to mysqldemoserver1
Local context is turned on. Its information is saved in working directory C:\Users\sumuth. You can run `az local-context off` to turn it off.
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
You can run multiple queries using the **interactive** mode. To enable interactive mode, run the following command

```azurecli
az mysql flexible-server connect -n <server-name> -u <username> -p <password> --interactive
```

**Example:**
```azurecli
az mysql flexible-server connect -n mysqldemoserver1 -u dbuser -p "dbpassword" -d newdatabase --interactive
```

You will see the **MySQL** shell experience as shown below:

```bash
Command group 'mysql flexible-server' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Password:
mysql 5.7.29-log
mycli 1.22.2
Chat: https://gitter.im/dbcli/mycli
Mail: https://groups.google.com/forum/#!forum/mycli-users
Home: http://mycli.net
Thanks to the contributor - Martijn Engler
newdatabase> CREATE TABLE table1 (id int NOT NULL, val int,txt varchar(200));
Query OK, 0 rows affected
Time: 2.290s
newdatabase1> INSERT INTO table1 values (1,100,'text1');
Query OK, 1 row affected
Time: 0.199s
newdatabase1> SELECT * FROM table1;
+----+-----+-------+
| id | val | txt   |
+----+-----+-------+
| 1  | 100 | text1 |
+----+-----+-------+
1 row in set
Time: 0.149s
newdatabase>exit;
Goodbye!
Local context is turned on. Its information is saved in working directory C:\mydir. You can run `az local-context off` to turn it off.
Your preference of  are now saved to local context. To learn more, type in `az local-context --help`
```


## Next Steps

> [!div class="nextstepaction"]
> [Manage the server](./how-to-manage-server-cli.md)

