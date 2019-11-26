---
title: Change Feed in Azure Cosmos DB’s API for Cassandra
description: Learn how to use change feed in Azure Cosmos DB’s API for Cassandra to get the changes made to your data.
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: conceptual
ms.date: 11/25/2019
ms.author: thvankra
---

# Change Feed in Azure Cosmos DB’s API for Cassandra

[Change feed](change-feed.md) support in Azure Cosmos DB’s API for Cassandra is made available through query predicates you can specify in the Cassandra Query Language (CQL). By querying the Change Feed API using these predicates, your applications can get the changes made to a table, or to a single row within a table using the primary key (partition key). You can then take further actions based on the results. Changes to the rows in the table are captured in the order of their modification time and the sort order is guaranteed per partition key.

The following example shows how to get a change feed on all the rows in a Cassandra API Keyspace table using .NET. This is based on the [Cassandra QuickStart](create-cassandra-dotnet.md) sample. You can replace Program.cs in that sample with the following code, and insert data using a separate program, or directly in Azure portal, to see it being picked up from the change feed query. The predicate COSMOS_CHANGEFEED_START_TIME() is used directly within the CQL query to denote that we want to query items in the change feed from a specified start time (in this case current datetime). In each iteration, the query resumes at the last point changes were read, using paging state. We can see a continuous stream of new changes to the user table in the uprofile Keyspace. We will see changes to rows that are inserted, or updated. Watching for delete operations using change feed in Cassandra API is currently not supported.

```C#
    using System;
    using Cassandra;
    using Cassandra.Mapping;
    using System.Net.Security;
    using System.Security.Authentication;
    using System.Security.Cryptography.X509Certificates;
    using System.Collections.Generic;
    using System.Linq;
    using System.Globalization;
    using System.Threading;
    using System.Dynamic;

    namespace CassandraChangeFeedSample
    {
        public class Program
        {
            // Cassandra Cluster Configs      
            private const string UserName = "UserName";
            private const string Password = "Password";
            private const string CassandraContactPoint = "CassandraContactPoint";  // DnsName  
            private static int CassandraPort = 10350;
            private static ISession session;

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
                Setup(); //drop and create keyspace and table
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
                        else
                        {
                            Console.WriteLine("zero documents read");
                        }
                        Thread.Sleep(300);

                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Exception " + e);
                    }
                }
            }

            public static bool ValidateServerCertificate(
                object sender,
                X509Certificate certificate,
                X509Chain chain,
                SslPolicyErrors sslPolicyErrors)
            {
                if (sslPolicyErrors == SslPolicyErrors.None)
                    return true;

                Console.WriteLine("Certificate error: {0}", sslPolicyErrors);
                // Do not allow this client to communicate with unauthenticated servers.
                return false;
            }

            public void Setup()
            {
                //Creating KeySpace and table
                session.Execute("DROP KEYSPACE IF EXISTS uprofile");
                session.Execute("CREATE KEYSPACE uprofile WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };");
                Console.WriteLine(String.Format("created keyspace uprofile"));
                session.Execute("CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text)");
                Console.WriteLine(String.Format("created table user"));
                //sleep to ensure Keyspace and table written before querying starts
                Thread.Sleep(2000);
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
* Inserts and updates are currently supported. Delete operation or other events are not yet supported.


## Error handling

The following error codes and messages are supported when using change change feed in Cassandra API:

* **HTTP error code 429** - When the change feed is throttled, it returns an empty page.

## Next steps

* [Manage Azure Cosmos DB Cassandra API resources using Azure Resource Manager templates](manage-cassandra-with-resource-manager.md)