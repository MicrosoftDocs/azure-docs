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

The System.Data.SqlClient.SqlConnection class is used to connect to SQL Database.  

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

## Execute a query and retrieve the result set 

The System.Data.SqlClient.SqlCommand and SqlDataReader classes can be used to retrieve a result set from SQL Database. Note that System.Data.SqlClient also supports retrieving data into an offline System.Data.DataSet.   

```
using System;
using System.Data.SqlClient;

class Sample
{
	static void Main()
	{
	  using(var conn = new SqlConnection("Server=tcp:yourserver.database.windows.net,1433;Database=yourdatabase;User ID=yourlogin@yourserver;Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"))
		{
			var cmd = conn.CreateCommand();
			cmd.CommandText = @"
					SELECT 
						c.CustomerID
						,c.CompanyName
						,COUNT(soh.SalesOrderID) AS OrderCount
					FROM SalesLT.Customer AS c
					LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID
					GROUP BY c.CustomerID, c.CompanyName
					ORDER BY OrderCount DESC;";

			conn.Open();	
		
			using(var reader = cmd.ExecuteReader())
			{
				while(reader.Read())
				{
					Console.WriteLine("ID: {0} Name: {1} Order Count: {2}", reader.GetInt32(0), reader.GetString(1), reader.GetInt32(2));
				}
			}					
		}
	}
}

```


## Inserting a row, passing parameters, and retrieving the generated primary key value 

In SQL Database the IDENTITY property and the SEQUENECE object can be used to auto-generate primary key values. In this example you can see how to execute and insert statement, safely passing parameters in with protection from SQL injection and retrieving the auto-generated primary key value.  

The ExecuteScalar method in the System.Data.SqlClient.SqlCommand class can be used to execute a statement and retrieve the first column and row returned by this statement. The OUTPUT clause of the INSERT statement can be used to return the inserted values as a result set to the calling application. Note that OUTPUT is also supported by the UPDATE, DELETE and MERGE statements. If more than one row is inserted you should use the ExecuteReader method to retrieve the inserted values for all rows.

```
class Sample
{
    static void Main()
    {
	using(var conn = new SqlConnection("Server=tcp:yourserver.database.windows.net,1433;Database=yourdatabase;User ID=yourlogin@yourserver;Password={your_password_here};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"))
        {
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) 
                OUTPUT INSERTED.ProductID
                VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP)";

            cmd.Parameters.AddWithValue("@Name", "SQL Server Express");
            cmd.Parameters.AddWithValue("@Number", "SQLEXPRESS1");
            cmd.Parameters.AddWithValue("@Cost", 0);
            cmd.Parameters.AddWithValue("@Price", 0);

            conn.Open();

            int insertedProductId = (int)cmd.ExecuteScalar();

            Console.WriteLine("Product ID {0} inserted.", insertedProductId);
        }
    }
}
```



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

