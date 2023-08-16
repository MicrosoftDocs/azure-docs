---
title: Quickstart - Search Azure Managed Instance for Apache Cassandra using Stratio's Cassandra Lucene Index.
description: This quickstart shows how to search Azure Managed Instance for Apache Cassandra cluster using Stratio's Cassandra Lucene Index.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: quickstart
ms.date: 04/17/2023
---
# Quickstart: Search Azure Managed Instance for Apache Cassandra using Lucene Index (Preview)

Cassandra Lucene Index, derived from Stratio Cassandra, is a plugin for Apache Cassandra that extends its index functionality to provide full text search capabilities and free multivariable, geospatial and bitemporal search. It is achieved through an Apache Lucene based implementation of Cassandra secondary indexes, where each node of the cluster indexes its own data. This quickstart demonstrates how to search Azure Managed Instance for Apache Cassandra using Lucene Index.

> [!IMPORTANT]
> Lucene Index is in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!WARNING]
> A limitation with the Lucene index plugin is that cross partition searches cannot be executed solely in the index - Cassandra needs to send the query to each node. This can lead to issues with performance (memory and CPU load) for cross partition searches that may affect steady state workloads. 
>
> Where search requirements are significant, we recommend deploying a dedicated secondary data center to be used only for searches, with a minimal number of nodes, each having a high number of cores (minimum 16). The keyspaces in your primary (operational) data center should then be configured to replicate data to your secondary (search) data center. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Deploy an Azure Managed Instance for Apache Cassandra cluster. You can do this via the [portal](create-cluster-portal.md) - Lucene indexes will be enabled by default when clusters are deployed from the portal. If you want to add Lucene indexes to an existing cluster, click `Update` in the portal overview blade, select `Cassandra Lucene Index`, and click update to deploy. 

   :::image type="content" source="./media/search-lucene-index/update-cluster.png" alt-text="Screenshot of Update Cassandra Cluster Properties." lightbox="./media/search-lucene-index/update-cluster.png" border="true":::

- Connect to your cluster from [CQLSH](create-cluster-portal.md#connecting-from-cqlsh).

## Create data with Lucene Index

1. In your `CQLSH` command window, create a keyspace and table as below:
    
    ```SQL
       CREATE KEYSPACE demo
       WITH REPLICATION = {'class': 'NetworkTopologyStrategy', 'datacenter-1': 3};
       USE demo;
       CREATE TABLE tweets (
          id INT PRIMARY KEY,
          user TEXT,
          body TEXT,
          time TIMESTAMP,
          latitude FLOAT,
          longitude FLOAT
       );
    ```

1. Now create a custom secondary index on the table using Lucene Index:

    ```SQL
       CREATE CUSTOM INDEX tweets_index ON tweets ()
       USING 'com.stratio.cassandra.lucene.Index'
       WITH OPTIONS = {
          'refresh_seconds': '1',
          'schema': '{
             fields: {
                id: {type: "integer"},
                user: {type: "string"},
                body: {type: "text", analyzer: "english"},
                time: {type: "date", pattern: "yyyy/MM/dd"},
                place: {type: "geo_point", latitude: "latitude", longitude: "longitude"}
             }
          }'
       };
    ```

1. Insert the following sample tweets:

    ```SQL
        INSERT INTO tweets (id,user,body,time,latitude,longitude) VALUES (1,'theo','Make money fast, 5 easy tips', '2023-04-01T11:21:59.001+0000', 0.0, 0.0);
        INSERT INTO tweets (id,user,body,time,latitude,longitude) VALUES (2,'theo','Click my link, like my stuff!', '2023-04-01T11:21:59.001+0000', 0.0, 0.0);
        INSERT INTO tweets (id,user,body,time,latitude,longitude) VALUES (3,'quetzal','Click my link, like my stuff!', '2023-04-02T11:21:59.001+0000', 0.0, 0.0);
        INSERT INTO tweets (id,user,body,time,latitude,longitude) VALUES (4,'quetzal','Click my link, like my stuff!', '2023-04-01T11:21:59.001+0000', 40.3930, -3.7328);
        INSERT INTO tweets (id,user,body,time,latitude,longitude) VALUES (5,'quetzal','Click my link, like my stuff!', '2023-04-01T11:21:59.001+0000', 40.3930, -3.7329);
    ```

## Control read consistency

1. The index you created earlier will index all the columns in the table with the specified types, and the read index used for searching will be refreshed once per second. Alternatively, you can explicitly refresh all the index shards with an empty search with consistency ALL:

    ```SQL
        CONSISTENCY ALL
        SELECT * FROM tweets WHERE expr(tweets_index, '{refresh:true}');
        CONSISTENCY QUORUM
    ```

1. Now, you can search for tweets within a certain date range:

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{filter: {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"}}');
    ```

1. This search can also be performed by forcing an explicit refresh of the involved index shards:

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{
           filter: {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"},
           refresh: true
        }') limit 100;
    ```

## Search data

1. To search the top 100 more relevant tweets where body field contains the phrase “Click my link” within a particular date range:

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{
           filter: {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"},
           query: {type: "phrase", field: "body", value: "Click my link", slop: 1}
        }') LIMIT 100;
    ```

1. To refine the search to get only the tweets written by users whose names start with "q":

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{
           filter: [
              {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"},
              {type: "prefix", field: "user", value: "q"}
           ],
           query: {type: "phrase", field: "body", value: "Click my link", slop: 1}
        }') LIMIT 100;
    ```

1. To get the 100 more recent filtered results you can use the sort option:

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{
           filter: [
              {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"},
              {type: "prefix", field: "user", value: "q"}
           ],
           query: {type: "phrase", field: "body", value: "Click my link", slop: 1},
           sort: {field: "time", reverse: true}
        }') limit 100;
    ```

1. The previous search can be restricted to tweets created close to a geographical position:

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{
           filter: [
              {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"},
              {type: "prefix", field: "user", value: "q"},
              {type: "geo_distance", field: "place", latitude: 40.3930, longitude: -3.7328, max_distance: "1km"}
           ],
           query: {type: "phrase", field: "body", value: "Click my link", slop: 1},
           sort: {field: "time", reverse: true}
        }') limit 100;
    ```

1. It is also possible to sort the results by distance to a geographical position:

    ```SQL
        SELECT * FROM tweets WHERE expr(tweets_index, '{
           filter: [
              {type: "range", field: "time", lower: "2023/03/01", upper: "2023/05/01"},
              {type: "prefix", field: "user", value: "q"},
              {type: "geo_distance", field: "place", latitude: 40.3930, longitude: -3.7328, max_distance: "1km"}
           ],
           query: {type: "phrase", field: "body", value: "Click my link", slop: 1},
           sort: [
              {field: "time", reverse: true},
              {field: "place", type: "geo_distance", latitude: 40.3930, longitude: -3.7328}
           ]
        }') limit 100;
    ```


## Next steps

In this quickstart, you learned how to search an Azure Managed Instance for Apache Cassandra cluster using Lucene Search. You can now start working with the cluster:

> [!div class="nextstepaction"]
> [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
