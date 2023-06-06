---
title: Use #C to connect and run SQL commands on Azure Cosmos DB for PostgreSQL
description: See how to use C# to connect and run SQL statements on Azure Cosmos DB for PostgreSQL.
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: quickstart
recommendations: false
ms.date: 06/05/2023
---

# Use C# to connect and run SQL commands on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[!INCLUDE [App stack selector](includes/quickstart-selector.md)]

This quickstart shows you how to use C# code to connect to a cluster, and use SQL statements to create a table. You'll then insert, query, update, and delete data in the database. The steps in this article assume that you're familiar with C# development, and are new to working with Azure Cosmos DB for PostgreSQL.

## Install PostgreSQL library

The code examples in this article require the [Npgsql](https://www.nuget.org/packages/Npgsql) library.  You'll need to install Npgsql with your language package manager (such as NuGet in [Visual Studio](https://www.visualstudio.com/downloads).)

## Connect, create a table, and insert data

We'll connect to a cluster and load data using CREATE TABLE and INSERT INTO SQL statements. The code uses these `NpgsqlCommand` class methods:

* [Open()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_Open) to establish a connection to Azure Cosmos DB for PostgreSQL
* [CreateCommand()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_CreateCommand) to set the CommandText property
* [ExecuteNonQuery()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlCommand.html#Npgsql_NpgsqlCommand_ExecuteNonQuery) to run database commands

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

In the following code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresCreate
    {
       
        static void Main(string[] args)
        {
            // Replace <cluster> with your cluster name and <password> with your password:
            var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = <password>; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50 ");

            connStr.TrustServerCertificate = true;

            using (var conn = new NpgsqlConnection(connStr.ToString()))
            {
                Console.Out.WriteLine("Opening connection");
                conn.Open();
                using (var command = new NpgsqlCommand("DROP TABLE IF EXISTS pharmacy;", conn))
                {
                    command.ExecuteNonQuery();
                    Console.Out.WriteLine("Finished dropping table (if existed)");
                }
                using (var command = new NpgsqlCommand("CREATE TABLE pharmacy (pharmacy_id integer ,pharmacy_name text,city text,state text,zip_code integer);", conn))
                {
                    command.ExecuteNonQuery();
                    Console.Out.WriteLine("Finished creating table");
                }
                using (var command = new NpgsqlCommand("CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);", conn))
                {
                    command.ExecuteNonQuery();
                    Console.Out.WriteLine("Finished creating index");
                }
                using (var command = new NpgsqlCommand("INSERT INTO  pharmacy  (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (@n1, @q1, @a, @b, @c)", conn))
                {
                    command.Parameters.AddWithValue("n1", 0);
                    command.Parameters.AddWithValue("q1", "Target");
                    command.Parameters.AddWithValue("a", "Sunnyvale");
                    command.Parameters.AddWithValue("b", "California");
                    command.Parameters.AddWithValue("c", 94001);
                    int nRows = command.ExecuteNonQuery();
                    Console.Out.WriteLine(String.Format("Number of rows inserted={0}", nRows));
                }

            }
            Console.WriteLine("Press RETURN to exit");
            Console.ReadLine();
        }
    }
}
```

## Distribute tables

Azure Cosmos DB for PostgreSQL gives you [the super power of distributing tables](introduction.md) across multiple nodes for scalability. Use the following code to distribute a table. You can learn more about `create_distributed_table` and the distribution column at [Distribution column (also known as shard key)](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!NOTE]
> Distributing tables lets them grow across any worker nodes added to the cluster.

In the following code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresCreate
    {
      
        static void Main(string[] args)
        {
            // Replace <cluster> with your cluster name and <password> with your password:
            var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = {your password}; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50");

            connStr.TrustServerCertificate = true;

            using (var conn = new NpgsqlConnection(connStr.ToString()))
            {
                Console.Out.WriteLine("Opening connection");
                conn.Open();
                using (var command = new NpgsqlCommand("select create_distributed_table('pharmacy','pharmacy_id');", conn))
                {
                    command.ExecuteNonQuery();
                    Console.Out.WriteLine("Finished distributing the table");
                }

            }
            Console.WriteLine("Press RETURN to exit");
            Console.ReadLine();
        }
    }
}
```

## Read data

Use the following code to connect and read the data by using a SELECT SQL statement. The code uses these `NpgsqlCommand` class methods:

* [Open()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_Open) to establish a connection to Azure Cosmos DB for PostgreSQL.
* [CreateCommand()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_CreateCommand) and [ExecuteReader()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlCommand.html#Npgsql_NpgsqlCommand_ExecuteReader) to run the database commands.
* [Read()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlDataReader.html#Npgsql_NpgsqlDataReader_Read) to advance to the record in the results.
* [GetInt32()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlDataReader.html#Npgsql_NpgsqlDataReader_GetInt32_System_Int32_) and [GetString()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlDataReader.html#Npgsql_NpgsqlDataReader_GetString_System_Int32_) to parse the values in the record.

In the following code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class read
    {

        static void Main(string[] args)
        {
            // Replace <cluster> with your cluster name and <password> with your password:
            var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = <password>; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50 ");

            connStr.TrustServerCertificate = true;

            using (var conn = new NpgsqlConnection(connStr.ToString()))
            {
                Console.Out.WriteLine("Opening connection");
                conn.Open();
                using (var command = new NpgsqlCommand("SELECT * FROM pharmacy", conn))
                {
                    var reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        Console.WriteLine(
                            string.Format(
                                "Reading from table=({0}, {1}, {2}, {3}, {4})",
                                reader.GetInt32(0).ToString(),
                                reader.GetString(1),
                                 reader.GetString(2),
                                 reader.GetString(3),
                                reader.GetInt32(4).ToString()
                                )
                            );
                    }
                    reader.Close();
                }
            }
            Console.WriteLine("Press RETURN to exit");
            Console.ReadLine();
        }
    }
}
```

## Update data

Use the following code to connect and update data by using an UPDATE SQL statement. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresUpdate
    {
        static void Main(string[] args)
        {
            // Replace <cluster> with your cluster name and <password> with your password:
            var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = <password>; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50 ");

            connStr.TrustServerCertificate = true;

            using (var conn = new NpgsqlConnection(connStr.ToString()))
            {
                Console.Out.WriteLine("Opening connection");
                conn.Open();
                using (var command = new NpgsqlCommand("UPDATE pharmacy SET city = @q WHERE pharmacy_id = @n", conn))
                {
                    command.Parameters.AddWithValue("n", 0);
                    command.Parameters.AddWithValue("q", "guntur");
                    int nRows = command.ExecuteNonQuery();
                    Console.Out.WriteLine(String.Format("Number of rows updated={0}", nRows));
                }
            }
            Console.WriteLine("Press RETURN to exit");
            Console.ReadLine();
        }
    }
}
```

## Delete data

Use the following code to connect and delete data by using a DELETE SQL statement. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.


```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresDelete
    {
       
        static void Main(string[] args)
        {
            // Replace <cluster> with your cluster name and <password> with your password:
            var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = {your password}; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50 ");

            connStr.TrustServerCertificate = true;

            using (var conn = new NpgsqlConnection(connStr.ToString()))
            {

                Console.Out.WriteLine("Opening connection");
                conn.Open();
                using (var command = new NpgsqlCommand("DELETE FROM pharmacy WHERE pharmacy_id = @n", conn))
                {
                    command.Parameters.AddWithValue("n", 0);
                    int nRows = command.ExecuteNonQuery();
                    Console.Out.WriteLine(String.Format("Number of rows deleted={0}", nRows));
                }
            }
            Console.WriteLine("Press RETURN to exit");
            Console.ReadLine();
        }
    }
}
```

## COPY command for fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Azure Cosmos DB for PostgreSQL. The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following example code copies data from a CSV file to a database table.

The code sample requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv) to be in your *Documents* folder. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.


```csharp
using Npgsql;
public class csvtotable
{

    static void Main(string[] args)
    {
        String sDestinationSchemaAndTableName = "pharmacy";
        String sFromFilePath = "C:\\Users\\Documents\\pharmacies.csv";
       
        // Replace <cluster> with your cluster name and <password> with your password:
        var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = <password>; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50 ");
            
        connStr.TrustServerCertificate = true;

        NpgsqlConnection conn = new NpgsqlConnection(connStr.ToString());
        NpgsqlCommand cmd = new NpgsqlCommand();

        conn.Open();

        if (File.Exists(sFromFilePath))
        {
            using (var writer = conn.BeginTextImport("COPY " + sDestinationSchemaAndTableName + " FROM STDIN WITH(FORMAT CSV, HEADER true,NULL ''); "))
            {
                foreach (String sLine in File.ReadAllLines(sFromFilePath))
                {
                    writer.WriteLine(sLine);
                }
            }
            Console.WriteLine("csv file data copied sucessfully");
        }
    }
}
```

### COPY command to load in-memory data

The following example code copies in-memory data to a table. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```csharp
using Npgsql;
using NpgsqlTypes;
namespace Driver
{
    public class InMemory
    {

        static async Task Main(string[] args)
        {
         
             // Replace <cluster> with your cluster name and <password> with your password:
            var connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = <password>; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50 ");

            connStr.TrustServerCertificate = true;

            using (var conn = new NpgsqlConnection(connStr.ToString()))
            {
                conn.Open();
                var text = new dynamic[] { 0, "Target", "Sunnyvale", "California", 94001 };
                using (var writer = conn.BeginBinaryImport("COPY pharmacy  FROM STDIN (FORMAT BINARY)"))
                {
                    writer.StartRow();
                    foreach (var item in text)
                    {
                        writer.Write(item);
                    }
                    writer.Complete();
                }
                Console.WriteLine("in-memory data copied sucessfully");
            }
        }
    }
}
```
## App retry for database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

In this code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```csharp
using System;
using System.Data;
using System.Runtime.InteropServices;
using System.Text;
using Npgsql;

namespace Driver
{
    public class Reconnect
    {
        
        // Replace <cluster> with your cluster name and <password> with your password:
        static string connStr = new NpgsqlConnectionStringBuilder("Server = c-<cluster>.<uniqueID>.postgres.cosmos.azure.com; Database = citus; Port = 5432; User Id = citus; Password = <password>; Ssl Mode = Require; Pooling = true; Minimum Pool Size=0; Maximum Pool Size =50;TrustServerCertificate = true").ToString();
        static string executeRetry(string sql, int retryCount)
        {
            for (int i = 0; i < retryCount; i++)
            {
                try
                {
                    using (var conn = new NpgsqlConnection(connStr))
                    {
                        conn.Open();
                        DataTable dt = new DataTable();
                        using (var _cmd = new NpgsqlCommand(sql, conn))
                        {
                            NpgsqlDataAdapter _dap = new NpgsqlDataAdapter(_cmd);
                            _dap.Fill(dt);
                            conn.Close();
                            if (dt != null)
                            {
                                if (dt.Rows.Count > 0)
                                {
                                    int J = dt.Rows.Count;
                                    StringBuilder sb = new StringBuilder();

                                    for (int k = 0; k < dt.Rows.Count; k++)
                                    {
                                        for (int j = 0; j < dt.Columns.Count; j++)
                                        {
                                            sb.Append(dt.Rows[k][j] + ",");
                                        }
                                        sb.Remove(sb.Length - 1, 1);
                                        sb.Append("\n");
                                    }
                                    return sb.ToString();
                                }
                            }
                        }
                    }
                    return null;
                }
                catch (Exception e)
                {
                    Thread.Sleep(60000);
                    Console.WriteLine(e.Message);
                }
            }
            return null;
        }
        static void Main(string[] args)
        {
            string result = executeRetry("select 1",5);
            Console.WriteLine(result);
        }
    }
}
```

## Next steps

[!INCLUDE[app-stack-next-steps](includes/app-stack-next-steps.md)]
