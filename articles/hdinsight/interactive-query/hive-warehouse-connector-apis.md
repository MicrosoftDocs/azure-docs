---
title: Hive Warehouse Connector APIs in Azure HDInsight
description: Learn about the different APIs of Hive Warehouse Connector.
author: reachnijel
ms.author: nijelsf
ms.service: hdinsight
ms.topic: how-to
ms.date: 09/19/2023
---

# Hive Warehouse Connector APIs in Azure HDInsight

This article lists all the APIs supported by Hive warehouse connector. All the examples shown below are run using spark-shell and hive warehouse connector session.

How to create Hive warehouse connector session:

```scala
import com.hortonworks.hwc.HiveWarehouseSession
val hive = HiveWarehouseSession.session(spark).build()
```

## Prerequisite

Complete the [Hive Warehouse Connector setup](./apache-hive-warehouse-connector.md#hive-warehouse-connector-setup) steps.


## Supported APIs

- Set the database:
    ```scala
    hive.setDatabase("<database-name>")
    ```

- List all databases:
    ```scala
    hive.showDatabases()
    ```

- List all tables in the current database
    ```scala
    hive.showTables()
    ```

- Describe a table
    
    ```scala
   // Describes the table <table-name> in the current database
    hive.describeTable("<table-name>")
    ```
    
    ```scala
   // Describes the table <table-name> in <database-name>
    hive.describeTable("<database-name>.<table-name>")
    ```

- Drop a database
    
    ```scala
   // ifExists and cascade are boolean variables
    hive.dropDatabase("<database-name>", ifExists, cascade)
    ```

- Drop a table in the current database
    
    ```scala
    // ifExists and purge are boolean variables
    hive.dropTable("<table-name>", ifExists, purge)
    ```

- Create a database
    ```scala
   // ifNotExists is boolean variable
    hive.createDatabase("<database-name>", ifNotExists)
    ```

- Create a table in current database
    ```scala
   // Returns a builder to create table
    val createTableBuilder = hive.createTable("<table-name>")
    ```
    
    Builder for create-table supports only the below operations: 
    
    ```scala
   // Create only if table does not exists already
    createTableBuilder = createTableBuilder.ifNotExists()
    ```
    
    ```scala
   // Add columns
    createTableBuilder = createTableBuilder.column("<column-name>", "<datatype>")
    ```
    
    ```scala
    // Add partition column
    createTableBuilder = createTableBuilder.partition("<partition-column-name>", "<datatype>")
    ```
    ```scala
   // Add table properties
    createTableBuilder = createTableBuilder.prop("<key>", "<value>")
    ```
    ```scala
    // Creates a bucketed table,
    // Parameters are numOfBuckets (integer) followed by column names for bucketing
    createTableBuilder = createTableBuilder.clusterBy(numOfBuckets, "<column1>", .... , "<columnN>")
    ```
    
    ```scala
    // Creates the table
    createTableBuilder.create()
    ```

    > [!NOTE]
    > This API creates an ORC formatted table at default location. For other features/options or to create table using hive queries, use `executeUpdate` API.


- Read a table

    ```scala
   // Returns a Dataset<Row> that contains data of <table-name> in the current database
    hive.table("<table-name>")
    ```

- Execute DDL commands on HiveServer2 

    ```scala
    // Executes the <hive-query> against HiveServer2
    // Returns true or false if the query succeeded or failed respectively
    hive.executeUpdate("<hive-query>")
    ```
    
    ```scala
    // Executes the <hive-query> against HiveServer2
    // Throws exception, if propagateException is true and query threw excpetion in HiveServer2
    // Returns true or false if the query succeeded or failed respectively
    hive.executeUpdate("<hive-query>", propagateException) // propagate exception is boolean value
    ```

- Execute Hive query and load result in Dataset
    
  - Executing query via LLAP daemons. **[Recommended]**
    ```scala
    // <hive-query> should be a hive query 
    hive.executeQuery("<hive-query>")
    ```
  - Executing query through HiveServer2 via JDBC.

    Set `spark.datasource.hive.warehouse.smartExecution` to `false` in spark configs before starting spark session to use this API
    ```scala
    hive.execute("<hive-query>")
    ```

- Close Hive warehouse connector session
    ```scala
    // Closes all the open connections and
    // release resources/locks from HiveServer2
    hive.close()
    ```

- Execute Hive Merge query
    
    This API creates a Hive merge query of below format
    
    ```
    MERGE INTO <current-db>.<target-table> AS <targetAlias> USING <source expression/table> AS <sourceAlias>
    ON <onExpr>
    WHEN MATCHED [AND <updateExpr>] THEN UPDATE SET <nameValuePair1> ... <nameValuePairN>
    WHEN MATCHED [AND <deleteExpr>] THEN DELETE
    WHEN NOT MATCHED [AND <insertExpr>] THEN INSERT VALUES <value1> ... <valueN>
    ```

    ```scala
    val mergeBuilder = hive.mergeBuilder() // Returns a builder for merge query
    ```
    Builder supports the following operations:
    
    ```scala
    mergeBuilder.mergeInto("<taget-table>", "<targetAlias>")
    ```
    
    ```scala
    mergeBuilder.using("<source-expression/table>", "<sourceAlias>")
    ```
    
    ```scala
    mergeBuilder.on("<onExpr>")
    ```
    
    ```scala
    mergeBuilder.whenMatchedThenUpdate("<updateExpr>", "<nameValuePair1>", ... , "<nameValuePairN>")
    ```
    
    ```scala
    mergeBuilder.whenMatchedThenDelete("<deleteExpr>")
    ```
    
    ```scala
    mergeBuilder.whenNotMatchedInsert("<insertExpr>", "<value1>", ... , "<valueN>");
    ```

    ```scala
    // Executes the merge query
    mergeBuilder.merge()
    ```

- Write a Dataset to Hive Table in batch
    ```scala
    df.write.format("com.hortonworks.spark.sql.hive.llap.HiveWarehouseConnector")
       .option("table", tableName)
       .mode(SaveMode.Type)
       .save()
    ```
   - TableName should be of form `<db>.<table>` or `<table>`. If no database name is provided, the table will searched/created in the current database
    
   - SaveMode types are:
    
     - Append: Appends the dataset to the given table
    
     - Overwrite: Overwrites the data in the given table with dataset
    
     - Ignore: Skips write if table already exists, no error thrown
    
     - ErrorIfExists: Throws error if table already exists


- Write a Dataset to Hive Table using HiveStreaming
    ```scala
    df.write.format("com.hortonworks.spark.sql.hive.llap.HiveStreamingDataSource")
       .option("database", databaseName)
       .option("table", tableName)
       .option("metastoreUri", "<HMS_URI>")
    // .option("metastoreKrbPrincipal", principal), add if executing in ESP cluster
       .save()
    
     // To write to static partition
     df.write.format("com.hortonworks.spark.sql.hive.llap.HiveStreamingDataSource")
       .option("database", databaseName)
       .option("table", tableName)
       .option("partition", partition)
       .option("metastoreUri", "<HMS URI>")
    // .option("metastoreKrbPrincipal", principal), add if executing in ESP cluster
       .save()
    ```
    > [!NOTE]
    > Stream writes always append data.


- Writing a spark stream to a Hive Table
    ```scala
    stream.writeStream
        .format("com.hortonworks.spark.sql.hive.llap.streaming.HiveStreamingDataSource")
        .option("metastoreUri", "<HMS_URI>")
        .option("database", databaseName)
        .option("table", tableName)
      //.option("partition", partition) , add if inserting data in partition
      //.option("metastoreKrbPrincipal", principal), add if executing in ESP cluster
        .start()
    ```
