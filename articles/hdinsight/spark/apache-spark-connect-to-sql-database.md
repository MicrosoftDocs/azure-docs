---
title: Use Apache Spark to read and write data to Azure SQL Database 
description: Learn how to set up a connection between HDInsight Spark cluster and an Azure SQL Database. To read data, write data, and stream data into a SQL database
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,seoapr2020
ms.date: 04/20/2020
---

# Use HDInsight Spark cluster to read and write data to Azure SQL Database

Learn how to connect an Apache Spark cluster in Azure HDInsight with an Azure SQL Database. Then read, write, and stream data into the SQL database. The instructions in this article use a Jupyter Notebook to run the Scala code snippets. However, you can create a standalone application in Scala or Python and do the same tasks.

## Prerequisites

* Azure HDInsight Spark cluster.  Follow the instructions at [Create an Apache Spark cluster in HDInsight](apache-spark-jupyter-spark-sql.md).

* Azure SQL Database. Follow the instructions at [Create an Azure SQL Database](../../azure-sql/database/single-database-create-quickstart.md). Make sure you create a database with the sample **AdventureWorksLT** schema and data. Also, make sure you create a server-level firewall rule to allow your client's IP address to access the SQL database on the server. The instructions to add the firewall rule is available in the same article. Once you've created your Azure SQL Database, make sure you keep the following values handy. You need them to connect to the database from a Spark cluster.

    * Server name hosting the Azure SQL Database.
    * Azure SQL Database name.
    * Azure SQL Database admin user name / password.

* SQL Server Management Studio (SSMS). Follow the instructions at [Use SSMS to connect and query data](../../azure-sql/database/connect-query-ssms.md).

## Create a Jupyter Notebook

Start by creating a Jupyter Notebook associated with the Spark cluster. You use this notebook to run the code snippets used in this article.

1. From the [Azure portal](https://portal.azure.com/), open your cluster.
1. Select **Jupyter notebook** underneath **Cluster dashboards** on the right side.  If you don't see **Cluster dashboards**, select **Overview** from the left menu. If prompted, enter the admin credentials for the cluster.

    ![Jupyter notebook on Apache Spark](./media/apache-spark-connect-to-sql-database/hdinsight-spark-cluster-dashboard-jupyter-notebook.png "Jupyter notebook on Spark")

   > [!NOTE]  
   > You can also access the Jupyter notebook on Spark cluster by opening the following URL in your browser. Replace **CLUSTERNAME** with the name of your cluster:
   >
   > `https://CLUSTERNAME.azurehdinsight.net/jupyter`

1. In the Jupyter notebook, from the top-right corner, click **New**, and then click **Spark** to create a Scala notebook. Jupyter notebooks on HDInsight Spark cluster also provide the **PySpark** kernel for Python2 applications, and the **PySpark3** kernel for Python3 applications. For this article, we create a Scala notebook.

    ![Kernels for Jupyter notebook on Spark](./media/apache-spark-connect-to-sql-database/kernel-jupyter-notebook-on-spark.png "Kernels for Jupyter notebook on Spark")

    For more information about the kernels, see [Use Jupyter notebook kernels with Apache Spark clusters in HDInsight](apache-spark-jupyter-notebook-kernels.md).

   > [!NOTE]  
   > In this article, we use a Spark (Scala) kernel because streaming data from Spark into SQL database is only supported in Scala and Java currently. Even though reading from and writing into SQL can be done using Python, for consistency in this article, we use Scala for all three operations.

1. A new notebook opens with a default name, **Untitled**. Click the notebook name and enter a name of your choice.

    ![Provide a name for the notebook](./media/apache-spark-connect-to-sql-database/hdinsight-spark-jupyter-notebook-name.png "Provide a name for the notebook")

You can now start creating your application.

## Read data from Azure SQL Database

In this section, you read data from a table (for example, **SalesLT.Address**) that exists in the AdventureWorks database.

1. In a new Jupyter notebook, in a code cell, paste the following snippet and replace the placeholder values with the values for your Azure SQL Database.

    ```scala
    // Declare the values for your Azure SQL database

    val jdbcUsername = "<SQL DB ADMIN USER>"
    val jdbcPassword = "<SQL DB ADMIN PWD>"
    val jdbcHostname = "<SQL SERVER NAME HOSTING SDL DB>" //typically, this is in the form or servername.database.windows.net
    val jdbcPort = 1433
    val jdbcDatabase ="<AZURE SQL DB NAME>"
    ```

    Press **SHIFT + ENTER** to run the code cell.  

1. Use the snippet below to build a JDBC URL that you can pass to the Spark dataframe APIs. The code creates a `Properties` object to hold the parameters. Paste the snippet in a code cell and press **SHIFT + ENTER** to run.

    ```scala
    import java.util.Properties

    val jdbc_url = s"jdbc:sqlserver://${jdbcHostname}:${jdbcPort};database=${jdbcDatabase};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=60;"
    val connectionProperties = new Properties()
    connectionProperties.put("user", s"${jdbcUsername}")
    connectionProperties.put("password", s"${jdbcPassword}")
    ```

1. Use the snippet below to create a dataframe with the data from a table in your Azure SQL Database. In this snippet, we use a `SalesLT.Address` table that is available as part of the **AdventureWorksLT** database. Paste the snippet in a code cell and press **SHIFT + ENTER** to run.

    ```scala
    val sqlTableDF = spark.read.jdbc(jdbc_url, "SalesLT.Address", connectionProperties)
    ```

1. You can now do operations on the dataframe, such as getting the data schema:

    ```scala
    sqlTableDF.printSchema
    ```

    You see an output similar to the following image:

    ![schema output](./media/apache-spark-connect-to-sql-database/read-from-sql-schema-output.png "schema output")

1. You can also do operations like, retrieve the top 10 rows.

    ```scala
    sqlTableDF.show(10)
    ```

1. Or, retrieve specific columns from the dataset.

    ```scala
    sqlTableDF.select("AddressLine1", "City").show(10)
    ```

## Write data into Azure SQL Database

In this section, we use a sample CSV file available on the cluster to create a table in Azure SQL Database and populate it with data. The sample CSV file (**HVAC.csv**) is available on all HDInsight clusters at `HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv`.

1. In a new Jupyter notebook, in a code cell, paste the following snippet and replace the placeholder values with the values for your Azure SQL Database.

    ```scala
    // Declare the values for your Azure SQL database

    val jdbcUsername = "<SQL DB ADMIN USER>"
    val jdbcPassword = "<SQL DB ADMIN PWD>"
    val jdbcHostname = "<SQL SERVER NAME HOSTING SDL DB>" //typically, this is in the form or servername.database.windows.net
    val jdbcPort = 1433
    val jdbcDatabase ="<AZURE SQL DB NAME>"
    ```

    Press **SHIFT + ENTER** to run the code cell.  

1. The following snippet builds a JDBC URL that you can pass to the Spark dataframe APIs. The code creates a `Properties` object to hold the parameters. Paste the snippet in a code cell and press **SHIFT + ENTER** to run.

    ```scala
    import java.util.Properties

    val jdbc_url = s"jdbc:sqlserver://${jdbcHostname}:${jdbcPort};database=${jdbcDatabase};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=60;"
    val connectionProperties = new Properties()
    connectionProperties.put("user", s"${jdbcUsername}")
    connectionProperties.put("password", s"${jdbcPassword}")
    ```

1. Use the following snippet to extract the schema of the data in HVAC.csv and use the schema to load the data from the CSV in a dataframe, `readDf`. Paste the snippet in a code cell and press **SHIFT + ENTER** to run.

    ```scala
    val userSchema = spark.read.option("header", "true").csv("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv").schema
    val readDf = spark.read.format("csv").schema(userSchema).load("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")
    ```

1. Use the `readDf` dataframe to create a temporary table, `temphvactable`. Then use the temporary table to create a hive table, `hvactable_hive`.

    ```scala
    readDf.createOrReplaceTempView("temphvactable")
    spark.sql("create table hvactable_hive as select * from temphvactable")
    ```

1. Finally, use the hive table to create a table in Azure SQL Database. The following snippet creates `hvactable` in Azure SQL Database.

    ```scala
    spark.table("hvactable_hive").write.jdbc(jdbc_url, "hvactable", connectionProperties)
    ```

1. Connect to the Azure SQL Database using SSMS and verify that you see a `dbo.hvactable` there.

    a. Start SSMS and connect to the Azure SQL Database by providing connection details as shown in the screenshot below.

    ![Connect to SQL database using SSMS1](./media/apache-spark-connect-to-sql-database/connect-to-sql-db-ssms.png "Connect to SQL database using SSMS1")

    b. From **Object Explorer**, expand the Azure SQL Database and the Table node to see the **dbo.hvactable** created.

    ![Connect to SQL database using SSMS2](./media/apache-spark-connect-to-sql-database/connect-to-sql-db-ssms-locate-table.png "Connect to SQL database using SSMS2")

1. Run a query in SSMS to see the columns in the table.

    ```sql
    SELECT * from hvactable
    ```

## Stream data into Azure SQL Database

In this section, we stream data into the `hvactable` that you already created in Azure SQL Database in the previous section.

1. As a first step, make sure there are no records in the `hvactable`. Using SSMS, run the following query on the table.

    ```sql
    TRUNCATE TABLE [dbo].[hvactable]
    ```

1. Create a new Jupyter notebook on the HDInsight Spark cluster. In a code cell, paste the following snippet and then press **SHIFT + ENTER**:

    ```scala
    import org.apache.spark.sql._
    import org.apache.spark.sql.types._
    import org.apache.spark.sql.functions._
    import org.apache.spark.sql.streaming._
    import java.sql.{Connection,DriverManager,ResultSet}
    ```

1. We stream data from the **HVAC.csv** into the `hvactable`. HVAC.csv file is available on the cluster at `/HdiSamples/HdiSamples/SensorSampleData/HVAC/`. In the following snippet, we first get the schema of the data to be streamed. Then, we create a streaming dataframe using that schema. Paste the snippet in a code cell and press **SHIFT + ENTER** to run.

    ```scala
    val userSchema = spark.read.option("header", "true").csv("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv").schema
    val readStreamDf = spark.readStream.schema(userSchema).csv("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/") 
    readStreamDf.printSchema
    ```

1. The output shows the schema of **HVAC.csv**. The `hvactable` has the same schema as well. The output lists the columns in the table.

    ![`hdinsight Apache Spark schema table`](./media/apache-spark-connect-to-sql-database/hdinsight-schema-table.png "Schema of table")

1. Finally, use the following snippet to read data from the HVAC.csv and stream it into the `hvactable` in Azure SQL Database. Paste the snippet in a code cell, replace the placeholder values with the values for your Azure SQL Database, and then press **SHIFT + ENTER** to run.

    ```scala
    val WriteToSQLQuery  = readStreamDf.writeStream.foreach(new ForeachWriter[Row] {
        var connection:java.sql.Connection = _
        var statement:java.sql.Statement = _

        val jdbcUsername = "<SQL DB ADMIN USER>"
        val jdbcPassword = "<SQL DB ADMIN PWD>"
        val jdbcHostname = "<SQL SERVER NAME HOSTING SDL DB>" //typically, this is in the form or servername.database.windows.net
        val jdbcPort = 1433
        val jdbcDatabase ="<AZURE SQL DB NAME>"
        val driver = "com.microsoft.sqlserver.jdbc.SQLServerDriver"
        val jdbc_url = s"jdbc:sqlserver://${jdbcHostname}:${jdbcPort};database=${jdbcDatabase};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"

        def open(partitionId: Long, version: Long):Boolean = {
        Class.forName(driver)
        connection = DriverManager.getConnection(jdbc_url, jdbcUsername, jdbcPassword)
        statement = connection.createStatement
        true
        }

        def process(value: Row): Unit = {
        val Date  = value(0)
        val Time = value(1)
        val TargetTemp = value(2)
        val ActualTemp = value(3)
        val System = value(4)
        val SystemAge = value(5)
        val BuildingID = value(6)  

        val valueStr = "'" + Date + "'," + "'" + Time + "'," + "'" + TargetTemp + "'," + "'" + ActualTemp + "'," + "'" + System + "'," + "'" + SystemAge + "'," + "'" + BuildingID + "'"
        statement.execute("INSERT INTO " + "dbo.hvactable" + " VALUES (" + valueStr + ")")
        }

        def close(errorOrNull: Throwable): Unit = {
        connection.close
        }
        })

    var streamingQuery = WriteToSQLQuery.start()
    ```

1. Verify that the data is being streamed into the `hvactable` by running the following query in SQL Server Management Studio (SSMS). Every time you run the query, it shows the number of rows in the table increasing.

    ```sql
    SELECT COUNT(*) FROM hvactable
    ```

## Next steps

* [Use HDInsight Spark cluster to analyze data in Data Lake Storage](apache-spark-use-with-data-lake-store.md)
* [Load data and run queries on an Apache Spark cluster in Azure HDInsight](apache-spark-load-data-run-query.md)
* [Use Apache Spark Structured Streaming with Apache Kafka on HDInsight](../hdinsight-apache-kafka-spark-structured-streaming.md)
