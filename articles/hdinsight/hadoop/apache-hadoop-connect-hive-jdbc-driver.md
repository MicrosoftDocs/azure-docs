---
title: Query Apache Hive through the JDBC driver - Azure HDInsight
description: Use the JDBC driver from a Java application to submit Apache Hive queries to Hadoop on HDInsight. Connect programmatically and from the SQuirrel SQL client.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, hdiseo17may2017, seoapr2020, devx-track-extended-java
ms.date: 01/06/2023
---

# Query Apache Hive through the JDBC driver in HDInsight

[!INCLUDE [ODBC-JDBC-selector](../includes/hdinsight-selector-odbc-jdbc.md)]

Learn how to use the JDBC driver from a Java application. To submit Apache Hive queries to Apache Hadoop in Azure HDInsight. The information in this document demonstrates how to connect programmatically, and from the SQuirreL SQL client.

For more information on the Hive JDBC Interface, see [HiveJDBCInterface](https://cwiki.apache.org/confluence/display/Hive/HiveJDBCInterface).

## Prerequisites

* An HDInsight Hadoop cluster. To create one, see [Get started with Azure HDInsight](apache-hadoop-linux-tutorial-get-started.md). Ensure that service HiveServer2 is running.
* The [Java Developer Kit (JDK) version 11](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html) or higher.
* [SQuirreL SQL](http://squirrel-sql.sourceforge.net/). SQuirreL is a JDBC client application.

## JDBC connection string

JDBC connections to an HDInsight cluster on Azure are made over port 443. The traffic is secured using TLS/SSL. The public gateway that the clusters sit behind redirects the traffic to the port that HiveServer2 is actually listening on. The following connection string shows the format to use for HDInsight:

```http
    jdbc:hive2://CLUSTERNAME.azurehdinsight.net:443/default;transportMode=http;ssl=true;httpPath=/hive2
```

Replace `CLUSTERNAME` with the name of your HDInsight cluster.

### Host name in connection string

Host name 'CLUSTERNAME.azurehdinsight.net' in the connection string is the same as your cluster URL. You can get it through Azure portal.

### Port in connection string

You can only use **port 443** to connect to the cluster from some places outside of the Azure virtual network. HDInsight is a managed service, which means all connections to the cluster are managed via a secure Gateway. You can't connect to HiveServer 2 directly on ports 10001 or 10000. These ports aren't exposed to the outside.

## Authentication

When establishing the connection, use the HDInsight cluster admin name and password to authenticate. From JDBC clients such as SQuirreL SQL, enter admin name and password in client settings.

From a Java application, you must use the name and password when establishing a connection. For example, the following Java code opens a new connection:

```java
DriverManager.getConnection(connectionString,clusterAdmin,clusterPassword);
```

## Connect with SQuirreL SQL client

SQuirreL SQL is a JDBC client that can be used to remotely run Hive queries with your HDInsight cluster. The following steps assume that you have already installed SQuirreL SQL.

1. Create a directory to contain certain files to be copied from your cluster.

2. In the following script, replace `sshuser` with the SSH user account name for the cluster.  Replace `CLUSTERNAME` with the HDInsight cluster name.  From a command line, change your work directory to the one created in the prior step, and then enter the following command to copy files from an HDInsight cluster:

    ```cmd
    scp sshuser@CLUSTERNAME-ssh.azurehdinsight.net:/usr/hdp/current/hadoop-client/{hadoop-auth.jar,hadoop-common.jar,lib/log4j-*.jar,lib/slf4j-*.jar,lib/curator-*.jar} . -> scp sshuser@CLUSTERNAME-ssh.azurehdinsight.net:/usr/hdp/current/hadoop-client/{hadoop-auth.jar,hadoop-common.jar,lib/reload4j-*.jar,lib/slf4j-*.jar,lib/curator-*.jar} .

    scp sshuser@CLUSTERNAME-ssh.azurehdinsight.net:/usr/hdp/current/hive-client/lib/{commons-codec*.jar,commons-logging-*.jar,hive-*-*.jar,httpclient-*.jar,httpcore-*.jar,libfb*.jar,libthrift-*.jar} .
    ```

3. Start the SQuirreL SQL application. From the left of the window, select **Drivers**.

    :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-squirreldrivers.png" alt-text="Drivers tab on the left of the window" border="true":::

4. From the icons at the top of the **Drivers** dialog, select the **+** icon to create a driver.

    :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-driversicons.png" alt-text="SQuirreL SQL application drivers icon" border="true":::

5. In the Add Driver dialog, add the following information:

    |Property | Value |
    |---|---|
    |Name|Hive|
    |Example URL|`jdbc:hive2://localhost:443/default;transportMode=http;ssl=true;httpPath=/hive2`|
    |Extra Class Path|Use the **Add** button to add the all of jar files downloaded earlier.|
    |Class Name|org.apache.hive.jdbc.HiveDriver|

   :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-add-driver.png" alt-text="add driver dialog with parameters" border="true":::

   Select **OK** to save these settings.

6. On the left of the SQuirreL SQL window, select **Aliases**. Then select the **+** icon to create a connection alias.

    :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-new-aliases.png" alt-text="`SQuirreL SQL add new alias dialog`" border="true":::

7. Use the following values for the **Add Alias** dialog:

    |Property |Value |
    |---|---|
    |Name|Hive on HDInsight|
    |Driver|Use the drop-down to select the **Hive** driver.|
    |URL|`jdbc:hive2://CLUSTERNAME.azurehdinsight.net:443/default;transportMode=http;ssl=true;httpPath=/hive2`. Replace **CLUSTERNAME** with the name of your HDInsight cluster.|
    |User Name|The cluster login account name for your HDInsight cluster. The default is **admin**.|
    |Password|The password for the cluster login account.|

    :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-addalias-dialog.png" alt-text="add alias dialog with parameters" border="true":::

    > [!IMPORTANT]
    > Use the **Test** button to verify that the connection works. When **Connect to: Hive on HDInsight** dialog appears, select **Connect** to perform the test. If the test succeeds, you see a **Connection successful** dialog. If an error occurs, see [Troubleshooting](#troubleshooting).

    To save the connection alias, use the **Ok** button at the bottom of the **Add Alias** dialog.

8. From the **Connect to** dropdown at the top of SQuirreL SQL, select **Hive on HDInsight**. When prompted, select **Connect**.

    :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-connect-dialog.png" alt-text="connection dialog with parameters" border="true":::

9. Once connected, enter the following query into the SQL query dialog, and then select the **Run** icon (a running person). The results area should show the results of the query.

    ```hiveql
    select * from hivesampletable limit 10;
    ```

    :::image type="content" source="./media/apache-hadoop-connect-hive-jdbc-driver/hdinsight-sqlquery-dialog.png" alt-text="sql query dialog, including results" border="true":::

## Connect from an example Java application

An example of using a Java client to query Hive on HDInsight is available at [https://github.com/Azure-Samples/hdinsight-java-hive-jdbc](https://github.com/Azure-Samples/hdinsight-java-hive-jdbc). Follow the instructions in the repository to build and run the sample.

## Troubleshooting

### Unexpected Error occurred attempting to open an SQL connection

**Symptoms**: When connecting to an HDInsight cluster that is version 3.3 or greater, you may receive an error that an unexpected error occurred. The stack trace for this error begins with the following lines:

```java
java.util.concurrent.ExecutionException: java.lang.RuntimeException: java.lang.NoSuchMethodError: org.apache.commons.codec.binary.Base64.<init>(I)V
at java.util.concurrent.FutureTas...(FutureTask.java:122)
at java.util.concurrent.FutureTask.get(FutureTask.java:206)
```

**Cause**: This error is caused by an older version commons-codec.jar file included with SQuirreL.

**Resolution**: To fix this error, use the following steps:

1. Exit SQuirreL, and then go to the directory where SQuirreL is installed on your system, perhaps `C:\Program Files\squirrel-sql-4.0.0\lib`. In the SquirreL directory, under the `lib` directory, replace the existing commons-codec.jar with the one downloaded from the HDInsight cluster.

1. Restart SQuirreL. The error should no longer occur when connecting to Hive on HDInsight.

### Connection disconnected by HDInsight

**Symptoms**: When trying to download huge amount of data (say several GBs) through JDBC/ODBC, the connection is disconnected by HDInsight unexpectedly while downloading.

**Cause**: This error is caused by the limitation on Gateway nodes. When getting data from JDBC/ODBC, all data needs to pass through the Gateway node. However, a gateway isn't designed to download a huge amount of data, so the Gateway might close the connection if it can't handle the traffic.

**Resolution**: Avoid using JDBC/ODBC driver to download huge amounts of data. Copy data directly from blob storage instead.

## Next steps

Now that you've learned how to use JDBC to work with Hive, use the following links to explore other ways to work with Azure HDInsight.

* [Visualize Apache Hive data with Microsoft Power BI in Azure HDInsight](apache-hadoop-connect-hive-power-bi.md).
* [Visualize Interactive Query Hive data with Power BI in Azure HDInsight](../interactive-query/apache-hadoop-connect-hive-power-bi-directquery.md).
* [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver](apache-hadoop-connect-excel-hive-odbc-driver.md).
* [Connect Excel to Apache Hadoop by using Power Query](apache-hadoop-connect-excel-power-query.md).
* [Use Apache Hive with HDInsight](hdinsight-use-hive.md)
* [Use Apache Pig with HDInsight](../use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
