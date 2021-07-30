---
title: Hive Warehouse Connector APIs in Azure HDInsight
description: Learn about the different APIs of Hive Warehouse Connector.
author: adeshr
ms.author: adrao
ms.service: hdinsight
ms.topic: how-to
ms.date: 07/29/2021
---

# Hive Warehouse Connector APIs in Azure HDInsight

This articles lists all the APIs supported by Hive warehouse connector. All the examples shown below are run using spark-shell and hive warehouse connector session.

How to create Hive warehouse connector session:

```scala
import com.hortonworks.hwc.HiveWarehouseSession
val hive = HiveWarehouseSession.session(spark).build()
```

## Prerequisite

Complete the [Hive Warehouse Connector setup](./apache-hive-warehouse-connector.md#hive-warehouse-connector-setup) steps.


## Supported APIs

1. Set the database:
    ```scala
    hive.setDatabase("<database-name>")
    ```

2. List all databases:
    ```scala
    hive.showDatabases()
    ```

3. List all tables in the current database
    ```scala
    hive.showTables()
    ```

4. Describe a table
    
    ```scala
    hive.describeTable("<table-name>") // Describes the table <table-name> in the current database
    ```
    
    ```scala
    hive.describeTable("<database-name>.<table-name>") // Describes the table <table-name> in <database-name>
    ```

5. Drop a database
    
    ```scala
    hive.dropDatabase("<database-name>", ifExists, cascade) // ifExists and cascade are boolean variables
    ```

6.  Drop a table in the current database
    
    ```scala
    hive.dropTable("<table-name>", ifExists, purge) // ifExists and purge are boolean variables
    ```

7. Create a database
    ```scala
    hive.createDatabase("<database-name>", ifNotExists) // ifNotExists is boolean variable
    ```

8. Create a table in current database
    ```scala
    val createTableBuilder = hive.createTable("<table-name>") // Returns a builder to create table
    ```
    
    Builder for create-table supports only the below operations: 
    
    ```scala
    createTableBuilder = createTableBuilder.ifNotExists() // Create only if table does not exists already
    ```
    
    ```scala
    createTableBuilder = createTableBuilder.column("<column-name>", "<datatype>") // Add columns
    ```
    
    ```scala
    // Add partition column
    createTableBuilder = createTableBuilder.partition("<partition-column-name>", "<datatype>")
    ```
    ```scala
    createTableBuilder = createTableBuilder.prop("<key>", "<value>") // add table properties
    ```
    ```scala
    // Creates a bucketed table, parameters are numOfBuckets (integer) followed by column names for bucketing
    createTableBuilder = createTableBuilder.clusterBy(numOfBuckets, "<column1>", .... , "<columnN>")
    ```
    
    ```scala
    // Creates the table
    createTableBuilder.create()
    ```

    **Note**: This API creates an ORC formatted table at default location. To create other type of tables, please use `executeUpdate` API.


9. Read a table

    ```scala
    hive.table("<table-name>") // Returns a Dataset<Row> that contains data of <table-name> in the current database
    ```

10. Execute DDL commands on HiveServer2 

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

11. Execute Hive query and load result in Dataset
    
    a. Executing query via LLAP daemons. **[Recommended]**
    ```scala
    // <hive-query> should be a hive query 
    hive.executeQuery("<hive-query>")
    ```
    b. Executing query through HiveServer2 via JDBC.
    ```scala
    // Set `spark.datasource.hive.warehouse.smartExecution` to `false` in spark configs before starting spark session
    hive.execute("<hive-query>")
    ```

12. Close Hive warehouse connector session
    ```scala
    // Closes all the open connections and release resources/locks from HiveServer2
    hive.close()
    ```

13. Execute Hive Merge query
    
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

14. Write a Dataset to Hive Table in batch
    ```scala
    df.write.format("com.hortonworks.spark.sql.hive.llap.HiveWarehouseConnector")
       .option("table", tableName) // tableName should be of form <table> (table should exist in current db) or <db>.<table>
       .mode(SaveMode.Type)
       .save()
    ```
    * TableName should be of form `<db>.<table>` or `<table>`. If no database name is provided, the table will searched/created in current database
    
    * SaveMode types are:
    
        a. Append: Appends the dataset to the given table
    
        b. Overwrite: Overwrites the data in the given table with dataset
    
        c. Ignore: Skips write if table already exists, no error thrown
    
        d. ErrorIfExists: Throws error if table already exists


15. Write a Dataset to Hive Table using HiveStreaming
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
    SaveMode type is not applicable using this method as it always appends the data.


16. Writing a spark stream to a Hive Table
    ```scala
    stream.writeStream
        .format("com.hortonworks.spark.sql.hive.llap.streaming.HiveStreamingDataSource")
        .option("metastoreUri", "<HMS_URI>")
        .option("database", databaseName)
        .option("table", tableName)
      //.option("partition", partition) , add if inserting data in partition
      // .option("metastoreKrbPrincipal", principal), add if executing in ESP cluster
        .start()
    ```
