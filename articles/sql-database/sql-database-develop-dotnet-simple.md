<properties 
	pageTitle="Use SQL Database from .NET (C#)" 
	description="Use the sample code in this quick start to build a modern application with C# and backed by a powerful relational database in the cloud with Azure SQL Database."
	services="sql-database" 
	documentationCenter="" 
	authors="tobbox" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="07/16/2015" 
	ms.author="tobiast"/>


# Using SQL Database from .NET (C#) 


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


## Requirements

### .NET Framework

.NET Framework is pre-installed with Windows. For Linux and Mac OS X you can download .NET Framework from the [Mono Project](http://www.mono-project.com/).

### A SQL Database

See the [getting started page](sql-database-get-started.md) to learn how to create a sample database and get your connection string.  

## Connect to your SQL Database

The [System.Data.SqlClient.SqlConnection class](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection.aspx) is used to connect to SQL Database.  
	
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

The [System.Data.SqlClient.SqlCommand](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.aspx) and [SqlDataReader](https://msdn.microsoft.com/library/system.data.sqlclient.sqldatareader.aspx) classes can be used to retrieve a result set from a query against SQL Database. Note that System.Data.SqlClient also supports retrieving data into an offline [System.Data.DataSet](https://msdn.microsoft.com/library/system.data.dataset.aspx).   
	
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

In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENECE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. In this example you will see how to execute an [insert-statement](https://msdn.microsoft.com/library/ms174335.aspx), safely pass parameters which protects from [SQL injection](https://msdn.microsoft.com/magazine/cc163917.aspx), and retrieve the auto-generated primary key value.  

The [ExecuteScalar](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.executescalar.aspx) method in the [System.Data.SqlClient.SqlCommand](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.aspx) class can be used to execute a statement and retrieve the first column and row returned by this statement. The [OUTPUT](https://msdn.microsoft.com/library/ms177564.aspx) clause of the INSERT statement can be used to return the inserted values as a result set to the calling application. Note that OUTPUT is also supported by the [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx), [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) and [MERGE](https://msdn.microsoft.com/library/bb510625.aspx) statements. If more than one row is inserted you should use the [ExecuteReader](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.executereader.aspx) method to retrieve the inserted values for all rows.
	
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

 
