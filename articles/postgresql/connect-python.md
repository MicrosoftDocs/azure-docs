---
title: Use Python to connect to Azure Database for PostgreSQL - Single Server
description: This quickstart provides Python code samples that you can use to connect and query data from Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.custom: mvc, devcenter
ms.devlang: python
ms.topic: quickstart
ms.date: 11/07/2019
---

# Use Python to connect and query data in Azure Database for PostgreSQL - Single Server
This quickstart demonstrates how to use [Python](https://python.org) with an Azure Database for PostgreSQL. The quickstart shows how to connect to the database and use SQL statements to query, insert, update, and delete data from macOS, Ubuntu Linux, and Windows platforms. The steps in this article assume that you're familiar with Python, but new to working with Azure Database for PostgreSQL.

## Prerequisites
- An Azure Database for PostgresQL - Single Server, created by using the [Azure portal](quickstart-create-server-database-portal.md) or [Azure CLI](quickstart-create-server-database-azure-cli.md). 
- [Python](https://www.python.org/downloads/) with [pip](https://pip.pypa.io/en/stable/installing/) package installer installed. The `pip` package installer is automatically installed with Python 2.7.9 or above, or Python 3.4 or above.

## Install the Python libraries for PostgreSQL
Install the [psycopg2](https://pypi.python.org/pypi/psycopg2/) package, which lets you connect to and query the database. The `psycopg2` package is available as a [wheel](https://pythonwheels.com/) package for Linux, macOS, or Windows. [Install](http://initd.org/psycopg/docs/install.html) the binary version of the module, including all the dependencies.

To use `pip` to install `psycopp2`:

1. Launch a command-line interface, such as Bash shell for Linux, Terminal for macOS, or Windows Command Prompt.
1. Make sure you're using the current version of `pip` by running a command like `pip install -U pip`.
3. Run `pip install psycopg2` to install the `psycopg2` package.

## Get connection information
You need the fully-qualified server name, database name, and login credentials to connect to your Azure Database for PostgreSQL database. A default database named *postgres* is automatically created when you create the Azure Database for PostgreSQL server. You can rename the database or create a new database by using SQL commands. 

To get the rest of the connection information:

1. In the [Azure portal](https://portal.azure.com/), search for and select your Azure Database for PostgreSQL server name. 
1. On the server's **Overview** page, copy the **Server name** and **Admin username**. The fully-qualified server name is always of the form *\<your server name>.postgres.database.azure.com*, and the admin username is always of the form *\<your username>@\<your server name>*. 
   
   You also need your admin password. If you forgot it, you can reset it from this page. 
   
 ![Azure Database for PostgreSQL server name](./media/connect-python/1-connection-string.png)

## Create a table and insert data
The following code example connects to your Azure Database for PostgreSQL database using the [psycopg2.connect](http://initd.org/psycopg/docs/connection.html) function, and loads data with a SQL **INSERT** statement. The [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) function executes the SQL query against the database. 

To use the example, create a new file in a text editor. Add the code example to the file, replacing `<server name>`, `<database name>`, `<admin username>`, and `<admin password>` with the values for your server and database. Save the file in your project folder with a *.py* extension. In Windows, make sure to select UTF-8 encoding when you save the file. 

To run the file, in your command-line interface, type `python` followed by the filename, such as `python postgres-insert.py`.

```Python
import psycopg2

# Update connection string information 
host = "<server name>"
dbname = "<database name>"
user = "<admin username>"
password = "<admin password>"
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

When the code runs successfully, the output appears as follows:

![Command-line output](media/connect-python/2-example-python-output.png)

## Read data
The following code example connects to your Azure Database for PostgreSQL database and uses [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) with the SQL **SELECT** statement to read data. This function accepts a query and returns a result set to iterate over by using [cursor.fetchall()](http://initd.org/psycopg/docs/cursor.html#cursor.fetchall). 

To use the example, create a new file in a text editor. Add the code example to the file, replacing `<server name>`, `<database name>`, `<admin username>`, and `<admin password>` with the values for your server and database. Save the file in your project folder with a *.py* extension. In Windows, make sure to select UTF-8 encoding when you save the file. 

To run the file, in your command-line interface, type `python` followed by the filename, such as `python postgres-read.py`.

```Python
import psycopg2

# Update connection string information
host = "<server name>"
dbname = "<database name>"
user = "<admin username>"
password = "<admin password>"
sslmode = "require"

# Construct connection string
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")

cursor = conn.cursor()

# Fetch all rows from table
cursor.execute("SELECT * FROM inventory;")
rows = cursor.fetchall()

# Print all rows
for row in rows:
    print("Data row = (%s, %s, %s)" %(str(row[0]), str(row[1]), str(row[2])))

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Update data
The following code example connects to your Azure Database for PostgreSQL database and uses [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) with the SQL **UPDATE** statement to update data. 

To use the example, create a new file in a text editor. Add the code example to the file, replacing `<server name>`, `<database name>`, `<admin username>`, and `<admin password>` with the values for your server and database. Save the file in your project folder with a *.py* extension. In Windows, make sure to select UTF-8 encoding when you save the file. 

To run the file, in your command-line interface, type `python` followed by the filename, such as `python postgres-update.py`.

```Python
import psycopg2

# Update connection string information
host = "<server name>"
dbname = "<database name>"
user = "<admin username>"
password = "<admin password>"
sslmode = "require"

# Construct connection string
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")

cursor = conn.cursor()

# Update a data row in the table
cursor.execute("UPDATE inventory SET quantity = %s WHERE name = %s;", (200, "banana"))
print("Updated 1 row of data")

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Delete data
The following code example connects to your Azure Database for PostgreSQL database and uses [cursor.execute](http://initd.org/psycopg/docs/cursor.html#execute) with the SQL **DELETE** statement to delete an inventory item that you previously inserted. 

To use the example, create a new file in a text editor. Add the code example to the file, replacing `<server name>`, `<database name>`, `<admin username>`, and `<admin password>` with the values for your server and database. Save the file in your project folder with a *.py* extension. In Windows, make sure to select UTF-8 encoding when you save the file. 

To run the file, in your command-line interface, type `python` followed by the filename, such as `python postgres-delete.py`.

```Python
import psycopg2

# Update connection string information
host = "<server name>"
dbname = "<database name>"
user = "<admin username>"
password = "<admin password>"
sslmode = "require"

# Construct connection string
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string) 
print("Connection established")

cursor = conn.cursor()

# Delete data row from table
cursor.execute("DELETE FROM inventory WHERE name = %s;", ("orange",))
print("Deleted 1 row of data")

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
