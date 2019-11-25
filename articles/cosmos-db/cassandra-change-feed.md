---
title: Change Feed in Azure Cosmos DB’s API for Cassandra
description: Learn how to use change feed in Azure Cosmos DB’s API for Cassandra to get the changes made to your data.
author: thvankra
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: conceptual
ms.date: 11/25/2019
ms.author: thvankra
---

# Change Feed in Azure Cosmos DB’s API for Cassandra

[Change feed](change-feed.md) support in Azure Cosmos DB’s API for Cassandra is made available through query predicates you can specify in the Cassandra Query Language (CQL). By querying the Change Feed API using these predicates, your applications can get the changes made to a table, or to a single row within a table using the primary key (partition key). You can then take further actions based on the results. Changes to the rows in the table are captured in the order of their modification time and the sort order is guaranteed per partition key.

The following example shows how to get a change feed on all the rows in a Cassandra API Keyspace table using .NET. This is based on the [Cassandra QuickStart](create-cassandra-dotnet) sample (you can replace the main method in that sample with the following code). This code uses COSMOS_CHANGEFEED_START_TIME() directly within the CQL query to denote that we want to query items in the change feed from a specified start time (in this case current datetime). Each iteration uses a continuation token, which is returned as part of the PagingState, and stored in the pageState variable after each query iteration. We can see a continuous stream of new changes to the user table in the uprofile Keyspace. We will see changes to rows that are inserted, updated, or replaced. Watching for delete operations using change streams is currently not supported.

```C#
public static void Main(string[] args)
{
    Program p = new Program();
    p.ChangeFeedPull();
}
public void ChangeFeedPull()
{
   // Connect to cassandra cluster  (Cassandra API on Azure Cosmos DB supports only TLSv1.2)
    var options = new Cassandra.SSLOptions(SslProtocols.Tls12, true, ValidateServerCertificate);
    options.SetHostNameResolver((ipAddress) => CassandraContactPoint);
    Cluster cluster = Cluster.Builder().WithCredentials(UserName, Password).WithPort(CassandraPort).AddContactPoint(CassandraContactPoint).WithSSL(options).Build();
    session = cluster.Connect();
    session = cluster.Connect("uprofile");
    IMapper mapper = new Mapper(session);

    Console.WriteLine("pulling from change feed: ");

    //set initial start time for pulling the change feed
    DateTime timeBegin = DateTime.UtcNow;

    //initialise variable to store the continuation token
    byte[] pageState = null;
    while (true)
    {
        try
        {
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
            Thread.Sleep(300);

        }
        catch (Exception e)
        {
           Console.WriteLine("Exception " + e);
        }
   }
}
```

In order to get the changes to single row (by primary key), you can add the primary key in the query. Here, we are tracking the row where user_id = 1

```C#
    IStatement changeFeedQueryStatement = new SimpleStatement(
    $"SELECT * FROM uprofile.user where user_id = 1 AND COSMOS_CHANGEFEED_START_TIME() = '{timeBegin.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture)}'");

```

## Current limitations

The following limitations are applicable when using change feed with Cassandra API:

* Parallelizing operations across partition key ranges is not yet supported
* The `insert`, `update`, and `replace` operations types are currently supported. Delete operation or other events are not yet supported.


## Error handling

The following error codes and messages are supported when using change change feed in Cassandra API:

* **HTTP error code 429** - When the change feed is throttled, it returns an empty page.

## Next steps

* [Manage Azure Cosmos DB Cassandra API resources using Azure Resource Manager templates](manage-cassandra-with-resource-manager.md)