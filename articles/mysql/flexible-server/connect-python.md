---
title: 'Quickstart: Connect using Python - Azure Database for MySQL - Flexible Server'
description: This quickstart provides several Python code samples you can use to connect and query data from Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal 
ms.author: shaithal 
ms.devlang: python
ms.custom: mvc, mode-api, devx-track-python
ms.date: 9/21/2020
---

# Quickstart: Use Python to connect and query data in Azure Database for MySQL - Flexible Server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

In this quickstart, you connect to an Azure Database for MySQL - Flexible Server by using Python. You then use SQL statements to query, insert, update, and delete data in the database from Mac, Ubuntu Linux, and Windows platforms. 

This article assumes that you're familiar with developing using Python, but you're new to working with Azure Database for MySQL - Flexible Server.

## Prerequisites

* An Azure account with an active subscription. 

    [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]
* An Azure Database for MySQL - Flexible Server. To create flexible server, refer to [Create an Azure Database for MySQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md) or [Create an Azure Database for MySQL - Flexible Server using Azure CLI](./quickstart-create-server-cli.md).

## Preparing your client workstation
- If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server. Refer to [Create and manage Azure Database for MySQL - Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server. Refer to [Create and manage Azure Database for MySQL - Flexible Server firewall rules using the Azure CLI](./how-to-manage-firewall-cli.md).

## Install Python and the MySQL connector

Install Python and the MySQL connector for Python on your computer by using the following steps: 

> [!NOTE]
> This quickstart uses a raw SQL query approach to connect to MySQL. If you're using a web framework, use the recommended connector for the framework, for example, [mysqlclient](https://pypi.org/project/mysqlclient/) for Django.

1. Download and install [Python 3.7 or above](https://www.python.org/downloads/) for your OS. Make sure to add Python to your `PATH`, because the MySQL connector requires that.
   
2. Open a command prompt or `bash` shell, and check your Python version by running `python -V` with the uppercase V switch.
   
3. The `pip` package installer is included in the latest versions of Python. Update `pip` to the latest version by running `pip install -U pip`. 
   
   If `pip` isn't installed, you can download and install it with `get-pip.py`. For more information, see [Installation](https://pip.pypa.io/en/stable/installing/). 
   
4. Use `pip` to install the MySQL connector for Python and its dependencies:
   
   ```bash
   pip install mysql-connector-python
   ```
   
   You can also install the Python connector for MySQL from [mysql.com](https://dev.mysql.com/downloads/connector/python/). For more information about the MySQL Connector for Python, see the [MySQL Connector/Python Developer Guide](https://dev.mysql.com/doc/connector-python/en/). 

## Get connection information

Get the connection information you need to connect to Azure Database for MySQL - Flexible Server from the Azure portal. You need the server name, database name, and sign in credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
   
2. In the portal search bar, search for and select the Azure Database for MySQL - Flexible Server you created, such as **mydemoserver**.
   
   <!---:::image type="content" source="./media/connect-python/1_server-overview-name-login.png" alt-text="Azure Database for MySQL - Flexible Server name":::-->
   
3. From the server's **Overview** page, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this page.
   
   <!---:::image type="content" source="./media/connect-python/azure-database-for-mysql-server-overview-name-login.png" alt-text="Azure Database for MySQL - Flexible Server name":::-->

## Code samples

### Run below mentioned Python code samples

For each code example in this article:

1. Create a new file in a text editor.
2. Add the code example to the file. In the code, replace the `<mydemoserver>`, `<myadmin>`, `<mypassword>`, and `<mydatabase>` placeholders with the values for your MySQL server and database.
3. Save the file in a project folder with a *.py* extension, such as *C:\pythonmysql\createtable.py* or */home/username/pythonmysql/createtable.py*.
4. To run the code, open a command prompt or `bash` shell and change directory into your project folder, for example `cd pythonmysql`. Type the `python` command followed by the file name, for example `python createtable.py`, and press Enter. 
   
   > [!NOTE]
   > On Windows, if *python.exe* is not found, you may need to add the Python path into your PATH environment variable, or provide the full path to *python.exe*, for example `C:\python27\python.exe createtable.py`.

### Create a table and insert data

Use the following code to connect to the server and database, create a table, and load data by using an **INSERT** SQL statement. 

The code imports the mysql.connector library, and uses the [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function to connect to flexible server using the [arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and the [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL query against the MySQL database.

```python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal

config = {
  'host':'<mydemoserver>.mysql.database.azure.com',
  'user':'<myadmin>',
  'password':'<mypassword>',
  'database':'<mydatabase>'
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

### Read data

Use the following code to connect and read the data by using a **SELECT** SQL statement. 

The code imports the mysql.connector library, and uses the [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function to connect to flexible server using the [arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and the [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL query against the MySQL database. 

The code reads the data rows using the [fetchall()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-fetchall.html) method, keeps the result set in a collection row, and uses a `for` iterator to loop over the rows.

```python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal

config = {
  'host':'<mydemoserver>.mysql.database.azure.com',
  'user':'<myadmin>',
  'password':'<mypassword>',
  'database':'<mydatabase>'
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

### Update data

Use the following code to connect and update the data by using an **UPDATE** SQL statement. 

The code imports the mysql.connector library, and uses the [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function to connect to flexible server using the [arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and the [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL query against the MySQL database. 

```python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal

config = {
  'host':'<mydemoserver>.mysql.database.azure.com',
  'user':'<myadmin>',
  'password':'<mypassword>',
  'database':'<mydatabase>'
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

### Delete data

Use the following code to connect and remove data by using a **DELETE** SQL statement. 

The code imports the mysql.connector library, and uses the [connect()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysql-connector-connect.html) function to connect to flexible server using the [arguments](https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html) in the config collection. The code uses a cursor on the connection, and the [cursor.execute()](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-execute.html) method executes the SQL query against the MySQL database. 

```python
import mysql.connector
from mysql.connector import errorcode

# Obtain connection string information from the portal

config = {
  'host':'<mydemoserver>.mysql.database.azure.com',
  'user':'<myadmin>',
  'password':'<mypassword>',
  'database':'<mydatabase>'
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
- [Encrypted connectivity using Transport Layer Security (TLS 1.2) in Azure Database for MySQL - Flexible Server](./how-to-connect-tls-ssl.md).
- Learn more about [Networking in Azure Database for MySQL - Flexible Server](./concepts-networking.md).
- [Create and manage Azure Database for MySQL - Flexible Server firewall rules using the Azure portal](./how-to-manage-firewall-portal.md).
- [Create and manage Azure Database for MySQL - Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).
