---
title: 'Tutorial: Create a write-behind cache use Azure Cache for Redis and Azure Functions'
description: Learn how to use Using Azure Functions and Azure Cache for Redis to create a write-behind cache.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 04/20/2023

---

# Using Azure Functions and Azure Cache for Redis to create a write-behind cache

The objective of this tutorial is to use an Azure Cache for Redis instance as a [write-behind cache](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-caching/#types-of-caching). The _write-behind_ pattern in this tutorial shows how writes to the cache trigger corresponding writes to an Azure SQL database.

We use the [Redis trigger for Azure Functions](cache-how-to-functions.md) to implement this functionality. In this scenario, you see how to use Azure Cache for Redis to store inventory and pricing information, while backing up that information in an Azure SQL Database.

Every new item or new price written to the cache is then reflected in a SQL table in the database.

## Requirements

- Azure account
- Completion of the previous tutorial, [Get started with Azure Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md) with the following resources provisioned:
  - Azure Cache for Redis instance
  - Azure Function instance
  - VS Code environment set up with NuGet packages installed

## Instructions

### Create and configure a new Azure SQL Database instance

The SQL database is the backing database for this example. You can create an Azure SQL database instance through the Azure portal or through your preferred method of automation.

This example uses the portal.

First, enter a database name and select **Create new** to create a new SQL server to hold the database.

Select **Use SQL authentication** and enter an admin sign in and password. Make sure to remember these or write them down. When deploying a SQL server in production, use Azure Active Directory (Azure AD) authentication instead.

Go to the **Networking** tab, and choose **Public endpoint** as a connection method. Select **Yes** for both firewall rules that appear. This endpoint allows access from your Azure Functions app.

Select **Review + create** and then **Create** after validation finishes. The SQL database starts to deploy.

Once deployment completes, go to the resource in the Azure portal, and select the **Query editor** tab. Create a new table called “inventory” that holds the data you'll be writing to it. Use the following SQL command to make a new table with two fields:

- `ItemName`, lists the name of each item
- `Price`, stores the price of the item

```sql
CREATE TABLE inventory (
    ItemName varchar(255),
    Price decimal(18,2)
    );
```

Once that command has completed, expand the **Tables** folder and verify that the new table was created.

### Configure the Redis trigger

First, make a copy of the same VS Code project used in the previous tutorial. Copy the folder from the previous tutorial under a new name, such as “RedisWriteBehindTrigger” and open it up in VS Code.

In this example, we’re going to use the [pub/sub trigger](cache-how-to-functions.md#redispubsubtrigger) to trigger on `keyevent` notifications. The following list shows our goals:

1. Trigger every time a SET event occurs. A SET event happens when either new keys are being written to the cache instance or the value of a key is being changed.
1. Once a SET event is triggered, access the cache instance to find the value of the new key.
1. Determine if the key already exists in the “inventory” table in the Azure SQL database.
    1. If so, update the value of that key.
    1. If not, write a new row with the key and its value.

First, import the `System.Data.SqlClient` NuGet package to enable communication with the SQL Database instance. Go to the VS Code terminal and use the following command:

```dos
dotnet add package System.Data.SqlClient
```

Next, copy and paste the following code in redisfunction.cs, replacing the existing code.

```csharp
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System;
using System.Data.SqlClient;

namespace Microsoft.Azure.WebJobs.Extensions.Redis
{
    public static class WriteBehind
    {
        public const string connectionString = "redisConnectionString";
        public const string SQLAddress = "SQLConnectionString";

        [FunctionName("KeyeventTrigger")]
        public static void KeyeventTrigger(
            [RedisPubSubTrigger(connectionString, "__keyevent@0__:set")] string message,
            ILogger logger)
        {
            // retrive redis connection string from environmental variables
            var redisConnectionString = System.Environment.GetEnvironmentVariable(connectionString);
            
            // connect to a Redis cache instance
            var redisConnection = ConnectionMultiplexer.Connect(redisConnectionString);
            var cache = redisConnection.GetDatabase();
            
            // get the key that was set and its value
            var key = message;
            var value = (double)cache.StringGet(key);
            logger.LogInformation($"Key {key} was set to {value}");

            // retrive SQL connection string from environmental variables
            String SQLConnectionString = System.Environment.GetEnvironmentVariable(SQLAddress);
            
            // Define the name of the table you created and the column names
            String tableName = "dbo.inventory";
            String column1Value = "ItemName";
            String column2Value = "Price";
           
           // Connect to the database. Check if the key exists in the database, if it does, update the value, if it doesn't, add it to the database
            using (SqlConnection connection = new SqlConnection(SQLConnectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;

                    //Form the SQL query to update the database. In practice, you would want to use a parameterized query to prevent SQL injection attacks.
                    //An example query would be something like "UPDATE dbo.inventory SET Price = 1.75 WHERE ItemName = 'Apple'"
                    command.CommandText = "UPDATE " + tableName + " SET " + column2Value + " = " + value + " WHERE " + column1Value + " = '" + key + "'";
                    int rowsAffected = command.ExecuteNonQuery(); //The query execution returns the number of rows affected by the query. If the key doesn't exist, it will return 0.

                    if (rowsAffected == 0) //If key doesn't exist, add it to the database
                    {
                         //Form the SQL query to update the database. In practice, you would want to use a parameterized query to prevent SQL injection attacks.
                         //An example query would be something like "INSERT INTO dbo.inventory (ItemName, Price) VALUES ('Bread', '2.55')"
                        command.CommandText = "INSERT INTO " + tableName + " (" + column1Value + ", " + column2Value + ") VALUES ('" + key + "', '" + value + "')";
                        command.ExecuteNonQuery();
                        
                        logger.LogInformation($"Item " + key + " has been added to the database with price " + value + "");
                    }
                    
                    else {
                        logger.LogInformation($"Item " + key + " has been updated to price " + value + "");
                    }
                }
                connection.Close();
            }
            
            //Log the time the function was executed
            logger.LogInformation($"C# Redis trigger function executed at: {DateTime.Now}");
        }
    }
}
```

> [!IMPORTANT]
> This example is simplified for the tutorial. For production use, we recommend that you use parameterized SQL queries to prevent SQL injection attacks.
>

### Configure connection strings
You need to update the 'local.settings.json' file to include the connection string for your SQL Database instance. Add an entry in the `Values` section for `SQLConnectionString`. Your file should look like this:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "redisConnectionString": "<redis-connection-string>",
    "SQLConnectionString": "<sql-connection-string>"
  }
}
```
You need to manually enter the password for your SQL database connection string, because the password isn't pasted automatically. You can find the Redis connection string in the **Access Keys** of the Resource menu of the Azure Cache for Redis resource. You can find the SQL database connection string under the **ADO.NET** tab in **Connection strings**  on the Resource menu in the SQL database resource.

> [!IMPORTANT]
> This example is simplified for the tutorial. For production use, we recommend that you use [Azure Key Vault](../service-connector/tutorial-portal-key-vault.md) to store connection string information.
>

### Build and run the project

Go to the **Run and debug tab** in VS Code and run the project. Navigate back to your Azure Cache for Redis instance in the Azure portal and select the **Console** button to enter the Redis Console. Try using some set commands:

- SET apple 5.25
- SET bread 2.25
- SET apple 4.50

Back in VS Code, you should see the triggers being registered:

To validate that the triggers are working, go to the SQL database instance in the Azure portal. Then, select **Query editor** from the Resource menu. Create a **New Query** with the following SQL to view the top 100 items in the inventory table:

```sql
SELECT TOP (100) * FROM [dbo].[inventory]
```

You should see the items written to your Azure Cache for Redis instance show up here!

### Deploy to your Azure Functions App

The only thing left is to deploy the code to the actual Azure Function app. As before, go to the Azure tab in VS Code, find your subscription, expand it, find the Function App section, and expand that. Select and hold (or right-click) your Azure Function app. Then, select **Deploy to Function App…**

### Add connection string information

Navigate to your Function App in the Azure portal and select the **Configuration** blade from the Resource menu. Select **New application setting** and enter `SQLConnectionString` as the Name, with your connection string as the Value. Set Type to _Custom_, and select **Ok** to close the menu and then **Save** on the Configuration page to confirm. The functions app will restart with the new connection string information. 

## Verify deployment
Once the deployment has finished, go back to your Azure Cache for Redis instance and use SET commands to write more values. You should see these show up in your Azure SQL database as well.

If you’d like to confirm that your Azure Function app is working properly, go to the app in the portal and select the **Log stream** from the Resource menu. You should see the triggers executing there, and the corresponding updates being made to your SQL database.

If you ever would like to clear the SQL database table without deleting it, you can use the following SQL query:

```sql
TRUNCATE TABLE [dbo].[inventory]
```

## Summary

This tutorial and [Get started with Azure Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md) show how to use Azure Cache for Redis to trigger Azure Function apps, and how to use that functionality to use Azure Cache for Redis as a write-behind cache with Azure SQL Database. Using Azure Cache for Redis with Azure Functions is a powerful combination that can solve many integration and performance problems.

## Next steps

- [Serverless event-based architectures with Azure Cache for Redis and Azure Functions (preview)](cache-how-to-functions.md)
- [Get started with Azure Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md)
