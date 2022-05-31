---
title: C# app to connect and query Hyperscale (Citus)
description: Learn building a simple app on Hyperscale (Citus) using C#
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/19/2022
---

# C# app to connect and query Hyperscale (Citus)

## Overview

In this document, you connect to a Hyperscale (Citus) database using a C# application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you're familiar with developing using Node.js, and are new to working with Hyperscale (Citus).

> [!TIP]
>
> Below experience to create a C# app with Hyperscale (Citus) is same as working with PostgreSQL.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
* Install the [.NET SDK](https://dotnet.microsoft.com/download) for your platform (Windows, Ubuntu Linux, or macOS) for your platform.
* Install [Visual Studio](https://www.visualstudio.com/downloads/) to build your project.
* Install [Npgsql](https://www.nuget.org/packages/Npgsql/) NuGet package in Visual Studio.

## Get Database Connection Information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See below screenshot.

![Diagram showing C# connection string](../media/howto-app-stacks/01-python-connection-string.png)


## Step 1: Connect, create table, insert data

Use the following code to connect and load the data using CREATE TABLE and INSERT INTO SQL statements. The code uses NpgsqlCommand class with method:
* [Open()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_Open) to establish a connection to the PostgreSQL database.
* [CreateCommand()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_CreateCommand) sets the CommandText property.
* [ExecuteNonQuery()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlCommand.html#Npgsql_NpgsqlCommand_ExecuteNonQuery) method to run the database commands.

Replace the following values:

* \<host> with the value you copied from previous section
* \<password> with your server password.
* Default admin user is *citus*
* Default database is *citus*

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresCreate
    {
        // Obtain connection string information from the portal
        //
        private static string Host = "<host>";
        private static string User = "citus";
        private static string DBname = "citus";
        private static string Password = "<password>";
        private static string Port = "5432";
        static void Main(string[] args)
        {
            // Build connection string using parameters from portal
            //
            string connString =
                String.Format(
                    "Server={0};Username={1};Database={2};Port={3};Password={4};SSLMode=Require",
                    Host,
                    User,
                    DBname,
                    Port,
                    Password);
            using (var conn = new NpgsqlConnection(connString))
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
                using (var command = new NpgsqlCommand( "CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);", conn))
                {
                    command.ExecuteNonQuery();
                    Console.Out.WriteLine("Finished creating index");
                }
                using (var command = new NpgsqlCommand("INSERT INTO  pharmacy  (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (@n1, @q1, @a, @b, @c)", conn))
                {
                    command.Parameters.AddWithValue("n1",0);
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

## Step 2: Super power of Distributed Tables

Citus gives you [the super power of distributing your table](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. Below command enables you to distribute a table. More on create_distributed_table and distribution column [here](howto-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using single node citus (basic tier).

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresCreate
    {
        // Obtain connection string information from the portal
        //
        private static string Host = "<host>";
        private static string User = "citus";
        private static string DBname = "citus";
        private static string Password = "<password>";
        private static string Port = "5432";
        static void Main(string[] args)
        {
            // Build connection string using parameters from portal
            //
            string connString =
                String.Format(
                    "Server={0};Username={1};Database={2};Port={3};Password={4};SSLMode=Require",
                    Host,
                    User,
                    DBname,
                    Port,
                    Password);
            using (var conn = new NpgsqlConnection(connString))
            {
                Console.Out.WriteLine("Opening connection");
                conn.Open();
                using (var command = new NpgsqlCommand( "select create_distributed_table('pharmacy','pharmacy_id');", conn))
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

## Step 3: Read data

Use the following code to connect and read the data using a SELECT SQL statement. The code uses NpgsqlCommand class with method:
* [Open()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_Open) to establish a connection to PostgreSQL.
* [CreateCommand()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlConnection.html#Npgsql_NpgsqlConnection_CreateCommand) and ExecuteReader()(https://www.npgsql.org/doc/api/Npgsql.NpgsqlCommand.html#Npgsql_NpgsqlCommand_ExecuteReader) to run the database commands.
* [Read()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlDataReader.html#Npgsql_NpgsqlDataReader_Read) to advance to the record in the results.
* [GetInt32()](https://www.npgsql.org/doc/api/Npgsql.NpgsqlDataReader.html#Npgsql_NpgsqlDataReader_GetInt32_System_Int32_) and [GetString()]
(https://www.npgsql.org/doc/api/Npgsql.NpgsqlDataReader.html#Npgsql_NpgsqlDataReader_GetString_System_Int32_) to parse the values in the record.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class read
    {
        // Obtain connection string information from the portal
        //
        private static string Host = "<host>";
        private static string User = "citus";
        private static string DBname = "citus";
        private static string Password = "<password>";
        private static string Port = "5432";
        static void Main(string[] args)
        {
            // Build connection string using parameters from portal
            //
            string connString =
                String.Format(
                    "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4};SSLMode=Require",
                    Host,
                    User,
                    DBname,
                    Port,
                    Password);
            using (var conn = new NpgsqlConnection(connString))
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

## Step 4: Update data

Use the following code to connect and update the data using an UPDATE SQL statement.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresUpdate
    {
        // Obtain connection string information from the portal
        //
        private static string Host = "<your-db-server-name>";
        private static string User = "citus";
        private static string DBname = "citus";
        private static string Password = "<your-password>";
        private static string Port = "5432";
        static void Main(string[] args)
        {
            // Build connection string using parameters from portal
            //
            string connString =
                String.Format(
                    "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4};SSLMode=Require",
                    Host,
                    User,
                    DBname,
                    Port,
                    Password);
            using (var conn = new NpgsqlConnection(connString))
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

## Step 5: Delete data

Use the following code to connect and delete data using a DELETE SQL statement.

```csharp
using System;
using Npgsql;
namespace Driver
{
    public class AzurePostgresDelete
    {
        // Obtain connection string information from the portal
        //
        private static string Host = "<your-db-server-name>";
        private static string User = "citus";
        private static string DBname = "citus";
        private static string Password = "<your-password>";
        private static string Port = "5432";
        static void Main(string[] args)
        {
            // Build connection string using parameters from portal
            //
            string connString =
                String.Format(
                    "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4};SSLMode=Require",
                    Host,
                    User,
                    DBname,
                    Port,
                    Password);
            using (var conn = new NpgsqlConnection(connString))
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

## COPY command for super fast ingestion

COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). COPY command can ingest data in files. You can also micro-batch data in memory and use COPY for real-time ingestion.

### COPY command to load data from a file
The following code is an example for copying data from csv file to table.

```csharp
using Npgsql;
public class csvtotable
{
    private static string Host = "<your-db-server-name>";
    private static string User = "citus";
    private static string DBname = "citus";
    private static string Password = "<your-password>";
    private static string Port = "5432";

    static void Main(string[] args)
    {
        String sDestinationSchemaAndTableName = "pharmacy";
        String sFromFilePath = "C:\\Users\\johndoe\\Documents\\citus\\pharmacies.csv";
        // Build connection string using parameters from portal

        string connString =
            String.Format(
                "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4};SSLMode=Require",
                Host,
                User,
                DBname,
                Port,
                Password);

        NpgsqlConnection conn = new NpgsqlConnection(connString);
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
            Console.WriteLine("completed");
        }
    }
}
```

### COPY command to load data in-memory

The following code is an example for copying in-memory data to a table.

```csharp
using Npgsql;
using NpgsqlTypes;
namespace Driver
{
    public class InMemory
    {
        private static string Host = "<host>";
        private static string User = "citus";
        private static string DBname = "citus";
        private static string Password = "<password>";
        private static string Port = "5432";

        static async Task Main(string[] args)
        {
            string connString =
                String.Format(
                    "Server={0}; User Id={1}; Database={2}; Port={3}; Password={4};SSLMode=Require",
                    Host,
                    User,
                    DBname,
                    Port,
                    Password);
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var text = new dynamic[] {0, "Target","Sunnyvale", "California",94001};
                using (var writer = conn.BeginBinaryImport("COPY pharmacy  FROM STDIN (FORMAT BINARY)"))
                {
                    writer.StartRow();
                    foreach (var item in text)
                    {
                        writer.Write(item);
                    }
                    writer.Complete();
                }
            }
        }
    }
}
```
