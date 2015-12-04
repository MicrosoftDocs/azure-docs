<properties
 pageTitle="Use JDBC to query Hive on Azure HDInsight"
 description="Learn how to use JDBC to connect to Hive on Azure HDInsight and remotely run queries on data stored in the cloud."
 services="hdinsight"
 documentationCenter=""
 authors="Blackmist"
 manager="paulettm"
 editor="cgronlun"
	tags="azure-portal"/>

<tags
 ms.service="hdinsight"
 ms.devlang="java"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="big-data"
 ms.date="09/23/2015"
 ms.author="larryfr"/>

#Connect to Hive on Azure HDInsight using the Hive JDBC driver

[AZURE.INCLUDE [ODBC-JDBC-selector](../../includes/hdinsight-selector-odbc-jdbc.md)]

In this document, you will learn how to use JDBC from a Java application to remotely submit Hive queries to an HDInsight cluster. For more information on the Hive JDBC Interface, see [HiveJDBCInterface](https://cwiki.apache.org/confluence/display/Hive/HiveJDBCInterface).

##Prerequisites

To complete the steps in this article, you will need the following:

* A Hadoop on HDInsight cluster. Either Linux-based or Windows-based clusters will work.

* The [Java Developer Kit (JDK) version 7](https://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) or higher.

* [Apache Maven](https://maven.apache.org). Maven is a project build system for Java projects that is used by the project associated with this article.

##Connection string

JDBC connections to an HDInsight cluster on Azure are made over 443, and the traffic is secured using SSL. The public gateway that the clusters sit behind redirects the traffic to the port that HiveServer2 is actually listening on. So a typical connection string would like the following:

    jdbc:hive2://CLUSTERNAME.azurehdinsight.net:443/default;ssl=true?hive.server2.transport.mode=http;hive.server2.thrift.http.path=/hive2

##Authentication

When establishing the connection, you have to specify the HDInsight cluster admin name and password. These authenticate the request to the gateway. For example, the following Java code opens a new connection using the connection string, admin name, and password:

    DriverManager.getConnection(connectionString,clusterAdmin,clusterPassword);

##Queries

Once the connection is established, you can run queries against Hive. For example, the following Java code performs a __SELECT__ from a table, limiting the results to only three rows, then displays the results:

    sql = "SELECT querytime, market, deviceplatform, devicemodel, state, country from " + tableName + " LIMIT 3";
    stmt2 = conn.createStatement();
    System.out.println("\nRetrieving inserted data:");

    res2 = stmt2.executeQuery(sql);

    while (res2.next()) {
      System.out.println( res2.getString(1) + "\t" + res2.getString(2) + "\t" + res2.getString(3) + "\t" + res2.getString(4) + "\t" + res2.getString(5) + "\t" + res2.getString(6));
    }

##Example Java project

An example of using a Java client to query Hive on HDInsight is available at [https://github.com/Blackmist/hdinsight-hive-jdbc](https://github.com/Blackmist/hdinsight-hive-jdbc). Follow the instructions in the repository to build and run the sample.

##Next steps

Now that you have learned how to use JDBC to work with Hive, use the following links to explore other ways to work with Azure HDInsight.

* [Upload data to HDInsight](hdinsight-upload-data.md)
* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
