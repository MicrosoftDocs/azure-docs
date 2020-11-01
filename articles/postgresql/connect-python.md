---
title: 'Quickstart: Connect with Python - Azure Database for PostgreSQL - Single Server'
description: This quickstart provides Python code samples that you can use to connect and query data from Azure Database for PostgreSQL - Single Server.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.custom: mvc, devcenter, devx-track-python
ms.devlang: python
ms.topic: quickstart
ms.date: 10/28/2020
---

# Quickstart: Use Python to connect and query data in Azure Database for PostgreSQL - Single Server

In this quickstart, you will learn how to connect to the database on Azure Database for PostgreSQL Single Server and run SQL statements to query using Python on macOS, Ubuntu Linux, or Windows.

> [!TIP]
> If you are looking to build a Django Application with PostgreSQL then checkout the tutorial, [Deploy a Django web app with PostgreSQL](../app-service/tutorial-python-postgresql-app.md) tutorial.


## Prerequisites
For this quickstart you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Create an Azure Database for PostgreSQL single server using [Azure portal](./quickstart-create-server-database-portal.md) <br/> or [Azure CLI](./quickstart-create-server-database-azure-cli.md) if you do not have one.
- Based on whether you are using public or private access, complete **ONE** of the actions below to enable connectivity.

  |Action| Connectivity method|How-to guide|
  |:--------- |:--------- |:--------- |
  | **Configure firewall rules** | Public | [Portal](./howto-manage-firewall-using-portal.md) <br/> [CLI](./howto-manage-firewall-using-cli.md)|
  | **Configure Service Endpoint** | Public | [Portal](./howto-manage-vnet-using-portal.md) <br/> [CLI](./howto-manage-vnet-using-cli.md)|
  | **Configure private link** | Private | [Portal](./howto-configure-privatelink-portal.md) <br/> [CLI](./howto-configure-privatelink-cli.md) |

- [Python](https://www.python.org/downloads/) 2.7.9+ or 3.4+.

- Latest [pip](https://pip.pypa.io/en/stable/installing/) package installer.
- Install [psycopg2](https://pypi.python.org/pypi/psycopg2/) using `pip install psycopg2` in a terminal or command prompt window. For more information, see [how to install `psycopg2`](http://initd.org/psycopg/docs/install.html).

## Get database connection information
Connecting to an Azure Database for PostgreSQL database requires the fully qualified server name and login credentials. You can get this information from the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), search for and select your Azure Database for PostgreSQL server name.
1. On the server's **Overview** page, copy the fully qualified **Server name** and the **Admin username**. The fully qualified **Server name** is always of the form *\<my-server-name>.postgres.database.azure.com*, and the **Admin username** is always of the form *\<my-admin-username>@\<my-server-name>*.

   You also need your admin password. If you forget it, you can reset it from this page.

   :::image type="content" source="./media/connect-python/1-connection-string.png" alt-text="Azure Database for PostgreSQL server name":::

> [!IMPORTANT]
>  Replace the following values:
>   - `<server-name>` and `<admin-username>` with the values you copied from the Azure portal.
>   - `<admin-password>` with your server password.
>   - `<database-name>` a default database named *postgres* was automatically created when you created your server. You can rename that database or [create a new database](https://www.postgresql.org/docs/9.0/sql-createdatabase.html) by using SQL commands.

## Step 1: Connect and insert data
The following code example connects to your Azure Database for PostgreSQL database using
-  [psycopg2.connect](http://initd.org/psycopg/docs/connection.html) function, and loads data with a SQL **INSERT** statement.
- [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) function executes the SQL query against the database.

```Python
import psycopg2

# Update connection string information
host = "<server-name>"
dbname = "<database-name>"
user = "<admin-username>"
password = "<admin-password>"
sslmode = "require"

# Construct connection string
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string)
print("Connection established")

cursor = conn.cursor()

# Drop previous table of same name if one exists
cursor.execute("DROP TABLE IF EXISTS inventory;")
print("Finished dropping table (if existed)")

# Create a table
cursor.execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);")
print("Finished creating table")

# Insert some data into the table
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("banana", 150))
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("orange", 154))
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("apple", 100))
print("Inserted 3 rows of data")

# Clean up
conn.commit()
cursor.close()
conn.close()
```

When the code runs successfully, it produces the following output:

:::image type="content" source="media/connect-python/2-example-python-output.png" alt-text="Command-line output":::


[Having issues? Let us know](https://aka.ms/postgres-doc-feedback)

## Step 2: Read data
The following code example connects to your Azure Database for PostgreSQL database and uses
- [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) with the SQL **SELECT** statement to read data.
- [cursor.fetchall()](http://initd.org/psycopg/docs/cursor.html#cursor.fetchall) accepts a query and returns a result set to iterate over by using

```Python

# Fetch all rows from table
cursor.execute("SELECT * FROM inventory;")
rows = cursor.fetchall()

# Print all rows
for row in rows:
    print("Data row = (%s, %s, %s)" %(str(row[0]), str(row[1]), str(row[2])))


```
[Having issues? Let us know](https://aka.ms/postgres-doc-feedback)

## Step 3: Update data
The following code example uses [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) with the SQL **UPDATE** statement to update data.

```Python

# Update a data row in the table
cursor.execute("UPDATE inventory SET quantity = %s WHERE name = %s;", (200, "banana"))
print("Updated 1 row of data")

```
[Having issues? Let us know](https://aka.ms/postgres-doc-feedback)

## Step 5: Delete data
The following code example runs [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) with the SQL **DELETE** statement to delete an inventory item that you previously inserted.

```Python

# Delete data row from table
cursor.execute("DELETE FROM inventory WHERE name = %s;", ("orange",))
print("Deleted 1 row of data")

```

[Having issues? Let us know](https://aka.ms/postgres-doc-feedback)

## Next steps
> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server using Portal](./howto-create-manage-server-portal.md)<br/>

> [!div class="nextstepaction"]
> [Manage Azure Database for MySQL server using CLI](./how-to-manage-server-cli.md)<br/>

[Cannot find what you are looking for? Let us know.](https://aka.ms/postgres-doc-feedback)
