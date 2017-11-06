---
title: 'Connect to Azure Database for MySQL from Python | Microsoft Docs'
description: This quickstart provides several Python code samples you can use to connect and query data from Azure Database for MySQL.
services: mysql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql
ms.custom: mvc
ms.devlang: python
ms.topic: quickstart
ms.date: 07/12/2017
---
# Azure Database for MySQL: Use Python to connect and query data
This quickstart demonstrates how to use [Python](https://python.org) to connect to an Azure Database for MySQL. It uses SQL statements to query, insert, update, and delete data in the database from Mac OS, Ubuntu Linux, and Windows platforms. The steps in this article assume that you are familiar with developing using Python and are new to working with Azure Database for MySQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create an Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
- [Create an Azure Database for MySQL server using Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)

## Install Python and the MySQL connector
Install [Python](https://www.python.org/downloads/) and the [MySQL connector for Python](https://dev.mysql.com/downloads/connector/python/) on your own machine. Depending on your platform, follow the steps:

### Windows
1. Download and Install Python 2.7 from [python.org](https://www.python.org/downloads/windows/). 
2. Check the Python installation by launching the command prompt. Run the command `C:\python27\python.exe -V` using the uppercase V switch to see the version number.
3. Install the Python connector for MySQL from [mysql.com](https://dev.mysql.com/downloads/connector/python/) corresponding to your version of Python.

### Linux (Ubuntu)
1. In Linux (Ubuntu), Python is typically installed as part of the default installation.
2. Check the Python installation by launching the bash shell. Run the command `python -V` using the uppercase V switch to see the version number.
3. Check the PIP installation by running the `pip show pip -V` command to see the version number. 
4. PIP may be included in some versions of Python. If PIP is not installed, you may install the [PIP] (https://pip.pypa.io/en/stable/installing/) package, by running command `sudo apt-get install python-pip`.
5. Update PIP to the latest version, by running the `pip install -U pip` command.
6. Install the MySQL connector for Python, and its dependencies by using the PIP command:

   ```bash
   sudo pip install mysql-connector-python-rf
   ```
 
### MacOS
1. In Mac OS, Python is typically installed as part of the default OS installation.
2. Check the Python installation by launching the bash shell. Run the command `python -V` using the uppercase V switch to see the version number.
3. Check the PIP installation by running the `pip show pip -V` command to see the version number.
4. PIP may be included in some versions of Python. If PIP is not installed, you may install the [PIP](https://pip.pypa.io/en/stable/installing/) package.
5. Update PIP to the latest version, by running the `pip install -U pip` command.
6. Install the MySQL connector for Python, and its dependencies by using the PIP command:

   ```bash
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
   

## Run Python Code
- Paste the code into a text file, and save the file into a project folder with file extension .py, such as C:\pythonmysql\createtable.py or /home/username/pythonmysql/createtable.py
- To run the code, launch the command prompt or bash shell. Change directory into your project folder `cd pythonmysql`. Then type the python command followed by the file name `python createtable.py` to run the application. On the Windows OS, if python.exe is not found, you may provide the full path to the executable, or add the Python path into the path environment variable. `C:\python27\python.exe createtable.py`

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
  'database':'quickstartdb'
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
  print("Finished dropping table (if existed).")

  # Create table
  cursor.execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);")
  print("Finished creating table.")

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
  print("Done.")
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
  'database':'quickstartdb'
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
  print("Done.")
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
  'database':'quickstartdb'
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
  print("Done.")
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
  'database':'quickstartdb'
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
  print("Done.")
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./concepts-migrate-import-export.md)
