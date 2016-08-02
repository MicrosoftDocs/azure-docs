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
 ms.date="06/03/2016"
 ms.author="larryfr"/>

#Connect to Hive on Azure HDInsight using the Hive JDBC driver

[AZURE.INCLUDE [ODBC-JDBC-selector](../../includes/hdinsight-selector-odbc-jdbc.md)]

In this document, you will learn how to use JDBC from a Java application to remotely submit Hive queries to an HDInsight cluster. You will learn how to connect from the SQuirreL SQL client, and how to connect programmatically from Java.

For more information on the Hive JDBC Interface, see [HiveJDBCInterface](https://cwiki.apache.org/confluence/display/Hive/HiveJDBCInterface).

##Prerequisites

To complete the steps in this article, you will need the following:

* A Hadoop on HDInsight cluster. Either Linux-based or Windows-based clusters will work.

* [SQuirreL SQL](http://squirrel-sql.sourceforge.net/). SQuirreL is a JDBC client application.

To build and run the example Java application linked from this article, you will need the following.

* The [Java Developer Kit (JDK) version 7](https://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) or higher.

* [Apache Maven](https://maven.apache.org). Maven is a project build system for Java projects that is used by the project associated with this article.

##Connection string

JDBC connections to an HDInsight cluster on Azure are made over 443, and the traffic is secured using SSL. The public gateway that the clusters sit behind redirects the traffic to the port that HiveServer2 is actually listening on. So a typical connection string would like the following:

    jdbc:hive2://CLUSTERNAME.azurehdinsight.net:443/default;ssl=true?hive.server2.transport.mode=http;hive.server2.thrift.http.path=/hive2

Replace __CLUSTERNAME__ with the name of your HDInsight cluster.

##Authentication

When establishing the connection, you must use the HDInsight cluster admin name and password to authenticate to the cluster gateway. When connecting from JDBC clients such as SQuirreL SQL, you must enter the admin name and password in client settings.

From a Java application, you must use the name and password when establishing a connection. For example, the following Java code opens a new connection using the connection string, admin name, and password:

    DriverManager.getConnection(connectionString,clusterAdmin,clusterPassword);

##Connect with SQuirreL SQL client

SQuirreL SQL is a JDBC client that can be used to remotely run Hive queries with your HDInsight cluster. The following steps assume that you have already installed SQuirreL SQL, and will walk you through downloading and configuring the drivers for Hive.

1. Copy the Hive JDBC drivers from your HDInsight cluster.

    * For __Linux-based HDInsight__, use the following steps to download the required jar files.

        1. Create a new directory that will contain the files. For example, `mkdir hivedriver`.

        2. From a command prompt, Bash, PowerShell or other command-line prompt, change directories to the new directory and use the following commands to copy the files from the HDInsight cluster.

                scp USERNAME@CLUSTERNAME:/usr/hdp/current/hive-client/lib/hive-jdbc*standalone.jar .
                scp USERNAME@CLUSTERNAME:/usr/hdp/current/hadoop-client/hadoop-common.jar .
                scp USERNAME@CLUSTERNAME:/usr/hdp/current/hadoop-client/hadoop-auth.jar .

            Replace __USERNAME__ with the SSH user account name for the cluster. Replace __CLUSTERNAME__ with the HDInsight cluster name.

            > [AZURE.NOTE] On Windows environments, you will need to use the PSCP utility instead of scp. You can download it from [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

    * For __Windows-based HDInsight__, use the following steps to download the jar files.

        1. From the Azure portal, select your HDInsight cluster, and then select the __Remote Desktop__ icon.

            ![Remote Desktop icon](./media/hdinsight-connect-hive-jdbc-driver/remotedesktopicon.png)

        2. On the Remote Desktop blade, use the __Connect__ button to connect to the cluster. If the Remote Desktop is not enabled, use the form to provide a user name and password, then select __Enable__ to enable Remote Desktop for the cluster.

            ![Remote desktop blade](./media/hdinsight-connect-hive-jdbc-driver/remotedesktopblade.png)

            After selecting __Connect__, a .rdp file will be downloaded. Use this file to launch the Remote Desktop client. When prompted, use the user name and password you entered for Remote Desktop access.

        3. Once connected, copy the following files from the Remote Desktop session to your local machine. Put them in a local directory named `hivedriver`.

            * C:\apps\dist\hive-0.14.0.2.2.9.1-7\lib\hive-jdbc-0.14.0.2.2.9.1-7-standalone.jar
            * C:\apps\dist\hadoop-2.6.0.2.2.9.1-7\share\hadoop\common\hadoop-common-2.6.0.2.2.9.1-7.jar
            * C:\apps\dist\hadoop-2.6.0.2.2.9.1-7\share\hadoop\common\lib\hadoop-auth-2.6.0.2.2.9.1-7.jar

            > [AZURE.NOTE] The version numbers included in the paths and file names may be different for your cluster.

        4. Disconnect the Remote Desktop session once you have finished copying the files.

3. Start the SQuirreL SQL application. From the left of the window, select __Drivers__.

    ![Drivers tab on the left of the window](./media/hdinsight-connect-hive-jdbc-driver/squirreldrivers.png)

4. From the icons at the top of the __Drivers__ dialog, select the __+__ icon to create a new driver.

    ![Drivers icons](./media/hdinsight-connect-hive-jdbc-driver/driversicons.png)

5. In the Add Driver dialog, add the following information.

    * __Name__: Hive
    * __Example URL__: jdbc:hive2://localhost:443/default;ssl=true?hive.server2.transport.mode=http;hive.server2.thrift.http.path=/hive2
    * __Extra Class Path__: Use the Add button to add the jar files downloaded earlier
    * __Class Name__: org.apache.hive.jdbc.HiveDriver

    ![add driver dialog](./media/hdinsight-connect-hive-jdbc-driver/adddriver.png)

    Click __OK__ to save these settings.

6. On the left of the SQuirreL SQL window, select __Aliases__. Then click the __+__ icon to create a new connection alias.

    ![add new alias](./media/hdinsight-connect-hive-jdbc-driver/aliases.png)

7. Use the following values for the __Add Alias__ dialog.

    * __Name__: Hive on HDInsight
    * __Driver__: Use the dropdown to select the __Hive__ driver
    * __URL__: jdbc:hive2://CLUSTERNAME.azurehdinsight.net:443/default;ssl=true?hive.server2.transport.mode=http;hive.server2.thrift.http.path=/hive2

        Replace __CLUSTERNAME__ with the name of your HDInsight cluster.

    * __User Name__: The cluster login account name for your HDInsight cluster. The default is `admin`.
    * __Password__: The password for the cluster login account. This is a password you provided when creating the HDInsight cluster.

    ![add alias dialog](./media/hdinsight-connect-hive-jdbc-driver/addalias.png)

    Use the __Test__ button to verify that the connection works. When __Connect to: Hive on HDInsight__ dialog appears, select __Connect__ to perform the test. If the test succeeds, you will see a __Connection successful__ dialog.

    Use the __Ok__ button at the bottom of the __Add Alias__ dialog to save the connection alias.

8. From the __Connect to__ dropdown at the top of SQuirreL SQL, select __Hive on HDInsight__. When prompted, select __Connect__.

    ![connection dialog](./media/hdinsight-connect-hive-jdbc-driver/connect.png)

9. Once connected, enter the following query into the SQL query dialog, and then select the __Run__ icon. The results area should show the results of the query.

        select * from hivesampletable limit 10;

    ![sql query dialog, including results](./media/hdinsight-connect-hive-jdbc-driver/sqlquery.png)

##Connect from an example Java application

An example of using a Java client to query Hive on HDInsight is available at [https://github.com/Azure-Samples/hdinsight-java-hive-jdbc](https://github.com/Azure-Samples/hdinsight-java-hive-jdbc). Follow the instructions in the repository to build and run the sample.

##Troubleshooting

### Unexpected Error occurred attempting to open an SQL connection.

__Symptoms__: When connecting to an HDInsight cluster that is version 3.3 or 3.4, you may receive an error that an unexpected error occurred. The stack trace for this error will begin with the following lines:

    java.util.concurrent.ExecutionException: java.lang.RuntimeException: java.lang.NoSuchMethodError: org.apache.commons.codec.binary.Base64.<init>(I)V
    at java.util.concurrent.FutureTas...(FutureTask.java:122)
    at java.util.concurrent.FutureTask.get(FutureTask.java:206)

__Cause__: This error is caused by a mismatch in the version of the commons-codec.jar file used by SQuirreL and the one required by the Hive JDBC components downloaded from the HDInsight cluster.

__Resolution__: To fix this error, use the following steps.

1. Download the commons-codec jar file from your HDInsight cluster.

        scp USERNAME@CLUSTERNAME:/usr/hdp/current/hive-client/lib/commons-codec*.jar ./commons-codec.jar

2. Exit SQuirreL, and then go to the directory where SQuirreL is installed on your system. In the SquirreL directory, under the `lib` directory, replace the existing commons-codec.jar with the one downloaded from the HDInsight cluster.

3. Restart SQuirreL. The error should no longer occur when connecting to Hive on HDInsight.

##Next steps

Now that you have learned how to use JDBC to work with Hive, use the following links to explore other ways to work with Azure HDInsight.

* [Upload data to HDInsight](hdinsight-upload-data.md)
* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce jobs with HDInsight](hdinsight-use-mapreduce.md)
