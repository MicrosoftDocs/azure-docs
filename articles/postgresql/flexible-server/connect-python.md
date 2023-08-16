---
title: 'Quickstart: Connect using Python - Azure Database for PostgreSQL - Flexible Server'
description: This quickstart provides several Python code samples you can use to connect and query data from Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: quickstart
ms.author: sunila
author: sunilagarwal
ms.devlang: python
ms.custom: mvc, mode-api, devx-track-python
ms.date: 11/30/2021
---

# Quickstart: Use Python to connect and query data in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this quickstart, you connect to an Azure Database for PostgreSQL - Flexible Server by using Python. You then use SQL statements to query, insert, update, and delete data in the database from Mac, Ubuntu Linux, and Windows platforms. 

This article assumes that you're familiar with developing using Python, but you're new to working with Azure Database for PostgreSQL - Flexible Server.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* An Azure Database for PostgreSQL - Flexible Server. To create flexible server, refer to [Create an Azure Database for PostgreSQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md).
* [Python](https://www.python.org/downloads/) 2.7 or 3.6+.
* Latest [pip](https://pip.pypa.io/en/stable/installing/) package installer.

## Preparing your client workstation
- If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server. Refer to [Create and manage Azure Database for PostgreSQL - Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server. Refer to [Create and manage Azure Database for PostgreSQL - Flexible Server firewall rules using the Azure CLI](./how-to-manage-firewall-cli.md).

## Install the Python libraries for PostgreSQL
The [psycopg2](https://pypi.python.org/pypi/psycopg2/) module enables connecting to and querying a PostgreSQL database, and is available as a Linux, macOS, or Windows [wheel](https://pythonwheels.com/) package. Install the binary version of the module, including all the dependencies.

To install `psycopg2`, open a terminal or command prompt and run the command `pip install psycopg2`.

## Get database connection information
Connecting to an Azure Database for PostgreSQL - Flexible Server requires the fully qualified server name and login credentials. You can get this information from the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), search for and select your flexible server name. 
2. On the server's **Overview** page, copy the fully qualified **Server name** and the **Admin username**. The fully qualified **Server name** is always of the form *\<my-server-name>.postgres.database.azure.com*.

   You also need your admin password. If you forget it, you can reset it from overview page. 

   <!--![Azure Database for PostgreSQL server name](./media/connect-python/1-connection-string.png)-->

## How to run the Python examples

For each code example in this article:

1. Create a new file in a text editor. 

1. Add the code example to the file. In the code, replace:
   - `<server-name>` and `<admin-username>` with the values you copied from the Azure portal.
   - `<admin-password>` with your server password.
   - `<database-name>` with the name of your Azure Database for PostgreSQL - Flexible Server database. A default database named *postgres* was automatically created when you created your server. You can rename that database or create a new database by using SQL commands. 

1. Save the file in your project folder with a *.py* extension, such as *postgres-insert.py*. For Windows, make sure UTF-8 encoding is selected when you save the file. 

1. To run the file, change to your project folder in a command-line interface, and type `python` followed by the filename, for example `python postgres-insert.py`.

## Create a table and insert data
The following code example connects to your Azure Database for PostgreSQL - Flexible Server database using the psycopg2.connect function, and loads data with a SQL **INSERT** statement. The cursor.execute function executes the SQL query against the database. 

```Python
import psycopg2
# Update connection string information 

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
host = "<server-name>"
dbname = "<database-name>"
user = "<admin-username>"
password = "<admin-password>"
sslmode = "require"
# Construct connection string

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")
cursor = conn.cursor()
# Drop previous table of same name if one exists

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
cursor.execute("DROP TABLE IF EXISTS inventory;")
print("Finished dropping table (if existed)")
# Create a table

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
cursor.execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);")
print("Finished creating table")
# Insert some data into the table

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("banana", 150))
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("orange", 154))
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("apple", 100))
print("Inserted 3 rows of data")
# Clean up

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn.commit()
cursor.close()
conn.close()
```

When the code runs successfully, it produces the following output:

![Command-line output](media/connect-python/2-example-python-output.png)

## Read data
The following code example connects to your Azure Database for PostgreSQL - Flexible Server database and uses cursor.execute with the SQL **SELECT** statement to read data. This function accepts a query and returns a result set to iterate over by using cursor.fetchall()

```Python
import psycopg2
# Update connection string information

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
host = "<server-name>"
dbname = "<database-name>"
user = "<admin-username>"
password = "<admin-password>"
sslmode = "require"
# Construct connection string

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")
cursor = conn.cursor()
# Fetch all rows from table

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
cursor.execute("SELECT * FROM inventory;")
rows = cursor.fetchall()
# Print all rows

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
for row in rows:
    print("Data row = (%s, %s, %s)" %(str(row[0]), str(row[1]), str(row[2])))
# Cleanup

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn.commit()
cursor.close()
conn.close()
```

## Update data
The following code example connects to your Azure Database for PostgreSQL - Flexible Server database and uses cursor.execute with the SQL **UPDATE** statement to update data. 

```Python
import psycopg2
# Update connection string information

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
host = "<server-name>"
dbname = "<database-name>"
user = "<admin-username>"
password = "<admin-password>"
sslmode = "require"
# Construct connection string

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")
cursor = conn.cursor()
# Update a data row in the table

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
cursor.execute("UPDATE inventory SET quantity = %s WHERE name = %s;", (200, "banana"))
print("Updated 1 row of data")
# Cleanup

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn.commit()
cursor.close()
conn.close()
```

## Delete data
The following code example connects to your Azure Database for PostgreSQL - Flexible Server database and uses cursor.execute with the SQL **DELETE** statement to delete an inventory item that you previously inserted. 

```Python
import psycopg2
# Update connection string information

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
host = "<server-name>"
dbname = "<database-name>"
user = "<admin-username>"
password = "<admin-password>"
sslmode = "require"
# Construct connection string

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")
cursor = conn.cursor()
# Delete data row from table

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
cursor.execute("DELETE FROM inventory WHERE name = %s;", ("orange",))
print("Deleted 1 row of data")
# Cleanup

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]
conn.commit()
cursor.close()
conn.close()
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using dump and restore](../howto-migrate-using-dump-and-restore.md)
