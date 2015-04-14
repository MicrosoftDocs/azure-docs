<properties 
	pageTitle="Connect and Use SQL Database from C# and .NET" 
	description="Give a code sample you can use to connect to Azure SQL Database."
	services="sql-database" 
	documentationCenter="" 
	authors="tobiast" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="tobiast"/>


# Connect and Use SQL Database from .NET using C# 


## Requirements

System.Data.SqlClient
TODO: You might already have some of the following required installations. ??


- [Python 2.7.6](https://www.python.org/download/releases/2.7.6/).


## TODO Install the required modules
Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install **FreeTDS** and **pymssql**.

	sudo apt-get --assume-yes update  
	sudo apt-get --assume-yes install freetds-dev freetds-bin
	sudo apt-get --assume-yes install python-dev python-pip
	sudo pip install pymssql


## Create a database and retrieve your connection string

See the getting started page to learn how to create a sample database and retrieve your connection string.  

## Connect to your SQL Database

The the System.Data.SqlClient.SqlConnection class is used to connect to SQL Database.  

```
using System.Data.SqlClient;

class Sample
{
  static void Main()
  {
	  using(var conn = new SqlConnection("Server=tcp:yourserver.database.windows.net,1433;Database=yourdatabase;User ID=yourlogin@yourserver;Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"))
	  {
		  conn.Open();	
	  }
  }
}	
```


## Create your first table on the cloud


	cursor = conn.cursor()
	cursor.execute("""
	IF OBJECT_ID('test', 'U') IS NOT NULL
	    DROP TABLE test
	CREATE TABLE test (
	    name VARCHAR(100),
	    value INT NOT NULL,
	    PRIMARY KEY(name)
	)
	""")


## Insert values in your table


	cursor.executemany(
		"INSERT INTO test VALUES (%s, %d)",
    	[('NodeJS', '2'),
     	('Python', '10'),
     	('C#', '20')])
	# you must call commit() to persist your data if you don't set autocommit to True
	conn.commit()



## Delete values in your table


	cursor.execute("DELETE FROM test WHERE value = 2;")
	conn.commit()


## Select values from your table


	cursor.execute('SELECT * FROM test')
    result = ""
    row = cursor.fetchone()
    while row:
        result += str(row[0]) + str(" : ") + str(row[1]) + str(" votes")
        result += str("\n")
        row = cursor.fetchone()
    print result



## Transactions


	cursor.execute("BEGIN TRANSACTION")
	cursor.execute("DELETE FROM test WHERE value = 10;")
	cnxn.rollback()

## Stored procedures


	with pymssql.connect("yourserver", "yourusername", "yourpassword", "yourdatabase") as conn:
    with conn.cursor(as_dict=True) as cursor:
        cursor.execute("""
        CREATE PROCEDURE FindName
            @name VARCHAR(100)
        AS BEGIN
            SELECT * FROM test WHERE name = @name
        END
        """)
        cursor.callproc('FindPerson', ('NodeJS',))
        for row in cursor:
            print("Name=%s, Votes=%d" % (row['name'], row['value']))

