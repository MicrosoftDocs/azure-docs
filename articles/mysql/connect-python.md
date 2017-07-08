---
title: 'Connect to Azure Database for MySQL from Python | Microsoft Docs'
description: This quickstart provides several Python code samples you can use to connect and query data from Azure Database for MySQL.
services: mysql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.custom: mvc
ms.devlang: python
ms.topic: hero-article
ms.date: 07/10/2017
---
# Azure Database for MySQL: Use Python to connect and query data
This quickstart demonstrates how to use [Python](https://python.org) to connect to an Azure Database for MySQL. It uses SQL statements to query, insert, update, and delete data in the database from Mac OS, Ubuntu Linux, and Windows platforms. The steps in this article assume that you are familiar with developing using Python and are new to working with Azure Database for MySQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create an Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
- [Create an Azure Database for MySQL server using Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)

You also need:
- [python](https://www.python.org/downloads/) installed
- [pip](https://pip.pypa.io/en/stable/installing/) package installed (pip is already installed if you're using Python 2 >=2.7.9 or Python 3 >=3.4 binaries downloaded from [python.org](https://python.org), but you need to upgrade pip.)  In Ubuntu, install pip by running command `sudo apt-get install python-pip` as needed.

## Install the Python connection libraries for MySQL
Install the [mysql-connector](https://dev.mysql.com/doc/connector-python/en/connector-python-installation.html) package, which enabled you to connect and query the database. The mysql-connector is [available on PyPI](https://pypi.python.org/pypi/psycopg2/) in the form of [wheel](http://pythonwheels.com/) packages for the most common platforms (Linux, OSX, Windows), so you may use pip install to get the binary version of the module including all the dependencies:

- On Windows, use an elevated command prompt (run as administrator) when you run the pip install command to avoid access denied errors.
- Use an up-to-date version of pip. If necessary, upgrade it using `pip install -U pip` command.

```cmd
pip install mysql-connector-python-rf
```
 
## Get connection information
Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you have creased, such as **myserver4demo**.
3. Click the server name **myserver4demo**.
4. Select the server's **Properties** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for MySQL - Server Admin Login](./media/connect-python/1_server-properties-name-login.png)
5. If you forget your server login information, navigate to the **Overview** page to view the Server admin login name and, if necessary, reset the password.
   
## Connect, create table, and insert data
Use the following code to connect to the server, create a table, and load the data using an **INSERT** SQL statement. 

In the code, the mysql.connector library is imported. The [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function is used to connect to Azure Database for MySQL using the [connection arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL query against MySQL database. 

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```Python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal
config = {
  'host':'myserver4demo.mysql.database.azure.com',
  'user':'myadmin@myserver4demo',
  'password':'yourpassword',
  'database':'yourdb'
}

# Construct connection string
try:
   conn = mysql.connector.connect(**config)
   print("Connection established")
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with the user name or password")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist")
  else:
    print(err)
else:
  cursor = conn.cursor()

# Drop previous table of same name if one exists
cursor.execute("DROP TABLE IF EXISTS inventory;")
print("Finished dropping table (if existed)")

# Create table
cursor.execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);")
print("Finished creating table")

# Insert some data into table
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("banana", 150))
print("Inserted",cursor.rowcount,"row(s) of data.")
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("orange", 154))
print("Inserted",cursor.rowcount,"row(s) of data.")
cursor.execute("INSERT INTO inventory (name, quantity) VALUES (%s, %s);", ("apple", 100))
print("Inserted",cursor.rowcount,"row(s) of data.")

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Read data
Use the following code to connect and read the data using a **SELECT** SQL statement. 

In the code, the mysql.connector library is imported. The [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function is used to connect to Azure Database for MySQL using the [connection arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL statement against MySQL database. The data rows are read using the [fetchall()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-fetchall.html) method. The result set is kept in a collection row and a for iterator is used to loop over the rows.

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```Python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal
config = {
  'host':'myserver4demo.mysql.database.azure.com',
  'user':'myadmin@myserver4demo',
  'password':'yourpassword',
  'database':'yourdb'
}

# Construct connection string
try:
   conn = mysql.connector.connect(**config)
   print("Connection established")
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with the user name or password")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist")
  else:
    print(err)
else:
  cursor = conn.cursor()

# Read data
cursor.execute("SELECT * FROM inventory;")
rows = cursor.fetchall()
print("Read",cursor.rowcount,"row(s) of data.")

# Print all rows
for row in rows:
	print("Data row = (%s, %s, %s)" %(str(row[0]), str(row[1]), str(row[2])))

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Update data
Use the following code to connect and update the data using a **UPDATE** SQL statement. 

In the code, the mysql.connector library is imported.  The [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function is used to connect to Azure Database for MySQL using the [connection arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL statement against MySQL database. 

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```Python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal
config = {
  'host':'myserver4demo.mysql.database.azure.com',
  'user':'myadmin@myserver4demo',
  'password':'yourpassword',
  'database':'yourdb'
}

# Construct connection string
try:
   conn = mysql.connector.connect(**config)
   print("Connection established")
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with the user name or password")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist")
  else:
    print(err)
else:
  cursor = conn.cursor()

# Update a data row in the table
cursor.execute("UPDATE inventory SET quantity = %s WHERE name = %s;", (200, "banana"))
print("Updated",cursor.rowcount,"row(s) of data.")

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Delete data
Use the following code to connect and remove data using a **DELETE** SQL statement. 

In the code, the mysql.connector library is imported.  The [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function is used to connect to Azure Database for MySQL using the [connection arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL query against MySQL database. 

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```Python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal
config = {
  'host':'myserver4demo.mysql.database.azure.com',
  'user':'myadmin@myserver4demo',
  'password':'yourpassword',
  'database':'yourdb'
}

# Construct connection string
try:
   conn = mysql.connector.connect(**config)
   print("Connection established.")
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with the user name or password.")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist.")
  else:
    print(err)
else:
  cursor = conn.cursor()

# Delete a data row in the table
cursor.execute("DELETE FROM inventory WHERE name=%(param1)s;", {'param1':"orange"})
print("Deleted",cursor.rowcount,"row(s) of data.")

# Cleanup
conn.commit()
cursor.close()
conn.close()
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
