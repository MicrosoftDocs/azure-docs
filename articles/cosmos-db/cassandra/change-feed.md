---
title: Change feed in the Azure Cosmos DB for Apache Cassandra
description: Learn how to use change feed in the Azure Cosmos DB for Apache Cassandra to get the changes made to your data.
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/25/2019
author: TheovanKraay
ms.author: thvankra
---

# Change feed in the Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

[Change feed](../change-feed.md) support in the Azure Cosmos DB for Apache Cassandra is available through the query predicates in the Cassandra Query Language (CQL). Using these predicate conditions, you can query the change feed API. Applications can get the changes made to a table using the primary key (also known as the partition key) as is required in CQL. You can then take further actions based on the results. Changes to the rows in the table are captured in the order of their modification time and the sort order per partition key.

The following example shows how to get a change feed on all the rows in a API for Cassandra Keyspace table using .NET. The predicate COSMOS_CHANGEFEED_START_TIME() is used directly within CQL to query items in the change feed from a specified start time (in this case current datetime). You can download the full sample, for C# [here](https://github.com/azure-samples/azure-cosmos-db-cassandra-change-feed) and for Java [here](https://github.com/Azure-Samples/cosmos-changefeed-cassandra-java).

In each iteration, the query resumes at the last point changes were read, using paging state. We can see a continuous stream of new changes to the table in the Keyspace. We will see changes to rows that are inserted, or updated. Watching for delete operations using change feed in API for Cassandra is currently not supported.

> [!NOTE]
> Reusing a token after dropping a collection and then recreating it with the same name results in an error.
> We advise you to set the pageState to null when creating a new collection and reusing collection name. 

# [Java](#tab/java)

```java
    Session cassandraSession = utils.getSession();

    try {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");  
        LocalDateTime now = LocalDateTime.now().minusHours(6).minusMinutes(30);  
        String query="SELECT * FROM uprofile.user where COSMOS_CHANGEFEED_START_TIME()='" 
            + dtf.format(now)+ "'";
        
        byte[] token=null; 
        System.out.println(query); 
        while(true)
        {
            SimpleStatement st=new  SimpleStatement(query);
            st.setFetchSize(100);
            if(token!=null)
                st.setPagingStateUnsafe(token);
            
            ResultSet result=cassandraSession.execute(st) ;
            token=result.getExecutionInfo().getPagingState().toBytes();
            
            for(Row row:result)
            {
                System.out.println(row.getString("user_name"));
            }
        }
    } finally {
        utils.close();
        LOGGER.info("Please delete your table after verifying the presence of the data in portal or from CQL");
    }
```

# [C#](#tab/csharp)

```C#
    //set initial start time for pulling the change feed
     DateTime timeBegin = DateTime.UtcNow;

    //initialise variable to store the continuation token
    byte[] pageState = null;
    while (true)
    {
        try
        {

            //Return the latest change for all rows in 'user' table    
            IStatement changeFeedQueryStatement = new SimpleStatement(
            $"SELECT * FROM uprofile.user where COSMOS_CHANGEFEED_START_TIME() = '{timeBegin.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture)}'");
            if (pageState != null)
            {
                changeFeedQueryStatement = changeFeedQueryStatement.SetPagingState(pageState);
            }
            Console.WriteLine("getting records from change feed at last page state....");
            RowSet rowSet = session.Execute(changeFeedQueryStatement);

            //store the continuation token here
            pageState = rowSet.PagingState;

            List<Row> rowList = rowSet.ToList();
            if (rowList.Count != 0)
            {
                for (int i = 0; i < rowList.Count; i++)
                {
                    string value = rowList[i].GetValue<string>("user_name");
                    int key = rowList[i].GetValue<int>("user_id");
                    // do something with the data - e.g. compute, forward to another event, function, etc.
                    // here, we just print the user name field
                    Console.WriteLine("user_name: " + value);
                }
            }
            else
            {
                Console.WriteLine("zero documents read");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("Exception " + e);
        }
    }

```
---

In order to get the changes to a single row by primary key, you can add the primary key in the query. The following example shows how to track changes for the row where "user_id = 1"

# [C#](#tab/csharp)

```C#
    //Return the latest change for all row in 'user' table where user_id = 1
    IStatement changeFeedQueryStatement = new SimpleStatement(
    $"SELECT * FROM uprofile.user where user_id = 1 AND COSMOS_CHANGEFEED_START_TIME() = '{timeBegin.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture)}'");

```

# [Java](#tab/java)

```java
    String query="SELECT * FROM uprofile.user where user_id=1 and COSMOS_CHANGEFEED_START_TIME()='" 
                       + dtf.format(now)+ "'";
    SimpleStatement st=new  SimpleStatement(query);
```
---
## Current limitations

The following limitations are applicable when using change feed with API for Cassandra:

* Inserts and updates are currently supported. Delete operation is not yet supported. As a workaround, you can add a soft marker on rows that are being deleted. For example, add a field in the row called "deleted" and set it to "true".
* Last update is persisted as in core API for NoSQL and intermediate updates to the entity are not available.

## Error handling

The following error codes and messages are supported when using change feed in API for Cassandra:

* **HTTP error code 429** - When the change feed is rate limited, it returns an empty page.

## Next steps

* [Manage Azure Cosmos DB for Apache Cassandra resources using Azure Resource Manager templates](templates-samples.md)

