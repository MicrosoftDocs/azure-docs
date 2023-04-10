# Using Azure Functions and Azure Cache for Redis to Create a Write-Behind Cache

The objective of this tutorial is to use an Azure Cache for Redis instance as a [write-behind cache](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-caching/#types-of-caching), where writes to the cache trigger corresponding writes to an Azure SQL database.
We'll use the [Redis trigger for Azure Functions](cache-how-to-functions.md) to implement this functionality. In this scenario, we are using Redis to store inventory and pricing information, while backing that information up in an Azure SQL Database. 
Every new item or new price written to the cache will be reflected in a SQL table in the database. 

## Requirements
- Azure account
- Completion of the previous tutorial, [Get started with Azure Functions triggers in Azure Cache for Redis](cache-tutorial-functions-getting-started.md) with the following resources provisioned:
    - Azure Cache for Redis instance
    - Azure Function instance
    - VS code environment set up with NuGet packages installed

## Instructions

### 1. Create and configure a new Azure SQL Database instance

This will be the backing database for our example. You can create an Azure SQL DB instance through the Azure portal or through your preferred method of automation.
This example will use the portal. 

First, enter a database name and select **Create new** to create a new SQL server to hold the database. 

Select **Use SQL authentication** and enter an admin login and password. Make sure to remember these or write them down. When deploying in production, using Azure Active Directory (AAD) authentication is recommended instead.

Go to the **Networking** tab and choose **Public endpoint** as a connection method. Select **Yes** for both firewall rules that appear. This will allow access from your Azure Functions app.

Select **Review + create** and then **Create** after validation finishes. You should see the SQL DB start to deploy.

Once deployment completes, go to the resource in the Azure portal, and select the **Query editor** tab. We’re going to create a new table called “inventory” that will hold the data we’ll be writing to it. Use the following SQL command to make a new table with two fields:
- `ItemName`, which will list the name of each item
- `Price`, which stores the price of the item

```sql
CREATE TABLE inventory (
    ItemName varchar(255),
    Price decimal(18,2)
    );
```
Once that command has completed, expand the **Tables** folder and verify that the new table was created.

### 2. Configure the Redis trigger

First, we’ll make a copy of the same VS Code project we used in the previous tutorial. Simply copy the folder from the previous tutorial under a new name, such as “RedisWriteBehindTrigger” and open it up in VS Code.

In this example, we’re going to use the [pub/sub trigger](cache-how-to-functions.md#redispubsubtrigger) to trigger on keyevent notifications. Our goal is the following:

1.	Trigger every time a SET event occurs. This means that either new keys are being written to the cache instance or the value of a key is being changed.
1.	Once a SET event is triggered, access the cache instance to find the value of the new key.
1.	Determine if the key already exists in the “inventory” table in the Azure SQL DB.
    1. If so, update the value of that key.
    1. If not, write a new row with the key and its value.

To do this, copy and paste the following code in redisfunction.cs, replacing the existing code. 

```c#
using System.Text.Json;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System;
using System.Data.SqlClient;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples
{
    public static class RedisSamples
    {
        public const string cacheAddress = "<YourRedisConnectionString>";
        public const string SQLAddress = "<YourSQLConnectionString>;

        [FunctionName("KeyeventTrigger")]
        public static void KeyeventTrigger(
            [RedisPubSubTrigger(ConnectionString = cacheAddress, Channel = "__keyevent@0__:set")] RedisMessageModel model,
            ILogger logger)
        {
                        // connect to a Redis cache instance
            var redisConnection = ConnectionMultiplexer.Connect(cacheAddress);
            var cache = redisConnection.GetDatabase();
            
            // get the key that was set and its value
            var key = model.Message;
            var value = (double)cache.StringGet(key);
            logger.LogInformation($"Key {key} was set to {value}");

            // connect to a SQL database
            String SQLConnectionString = SQLAddress;
            
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

                    //Form the SQL query to update the database. In pratice, you would want to use a parameterized query to prevent SQL injection attacks.
                    //An example query would be something like "UPDATE dbo.inventory SET Price = 1.75 WHERE ItemName = 'Apple'"
                    command.CommandText = "UPDATE " + tableName + " SET " + column2Value + " = " + value + " WHERE " + column1Value + " = '" + key + "'";
                    int rowsAffected = command.ExecuteNonQuery(); //The query execution returns the number of rows affected by the query. If the key doesn't exist, it will return 0.

                    if (rowsAffected == 0) //If key doesn't exist, add it to the database
                    {
                         //Form the SQL query to update the database. In pratice, you would want to use a parameterized query to prevent SQL injection attacks.
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
> This example is simplified for the tutorial. For production use, you should use parameterized SQL queries to prevent SQL injection attacks.
>

You'll need to update the `cacheAddress` and `SQLAddress` variables with the connection strings for your Redis cache instance and your SQL database. You'll need to manually enter the password for your SQL DB connection string, as the password is not pasted automatically. You can find the Redis connection string in the **Access Keys** blade in the Azure Cache for Redis portal. You can find the SQL DB connection string under the **ADO.NET** tab in the **Connection strings** blade in the SQL DB portal. 

You’ll see errors in some of the SQL classes. We’ll need to import the System.Data.SqlClient NuGet package to resolve these. Do that by going to the VS Code terminal and using the following command:

```dos
dotnet add package System.Data.SqlClient
```

### 3. Build and run the project



