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

## 1. Create and configure a new Azure SQL Database instance

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

## 2. Configure the Redis trigger


