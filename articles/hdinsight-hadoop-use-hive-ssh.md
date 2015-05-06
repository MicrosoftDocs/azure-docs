<properties
   pageTitle="Use Hadoop Hive and SSH in HDInsight | Microsoft Azure"
   description="Learn how to use SSH to connect to a Hadoop cluster in HDInsight, and then interactively submit Hive queries by using the Hive command-line interface."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/18/2015"
   ms.author="larryfr"/>

#Use Hive with Hadoop in HDInsight with SSH

[AZURE.INCLUDE [hive-selector](../includes/hdinsight-selector-use-hive.md)]

In this article, you will learn how to use Secure Shell (SSH) to connect to a Hadoop on Azure HDInsight cluster and then interactively submit Hive queries by using the Hive command-line interface (CLI).

> [AZURE.NOTE] If you are already familiar with using Linux-based Hadoop servers, but are new to HDInsight, see <a href="../hdinsight-hadoop-linux-information/" target="_blank">What you need to know about Hadoop on Linux-based HDInsight</a>.

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following:

* A Linux-based Hadoop on HDInsight cluster.

* An SSH client. Linux, Unix, and Mac OS should come with an SSH client. Windows users must download a client, such as <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">PuTTY</a>.

##<a id="ssh"></a>Connect with SSH

Connect to the fully qualified domain name (FQDN) of your HDInsight cluster by using the SSH command. The FQDN will be the name you gave the cluster, then **.azurehdinsight.net**. For example, the following would connect to a cluster named **myhdinsight**:

	ssh admin@myhdinsight-ssh.azurehdinsight.net

**If you provided a certificate key for SSH authentication** when you created the HDInsight cluster, you may need to specify the location of the private key on your client system:

	ssh admin@myhdinsight-ssh.azurehdinsight.net -i ~/mykey.key

**If you provided a password for SSH authentication** when you created the HDInsight cluster, you will need to provide the password when prompted.

###PuTTY (Windows-based clients)

Windows does not provide a built-in SSH client. We recommend using **PuTTY**, which can be downloaded from <a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html</a>.

For more information on using PuTTY, see the **Use Putty to Connect to a Linux Machine** section of <a href="http://azure.microsoft.com/documentation/articles/virtual-machines-linux-use-ssh-key/" target="_blank">How to use SSH with Linux on Azure</a>.

> [AZURE.NOTE] If you used a certificate for SSH authentication for the HDInsight cluster, you will also need to see the **Create a PPK for Putty** section of <a href="http://azure.microsoft.com/documentation/articles/virtual-machines-linux-use-ssh-key/" target="_blank">How to use SSH with Linux on Azure</a>.

##<a id="hive"></a>Use the Hive command

2. Once connected, start the Hive CLI by using the following command:

        hive

3. Using the CLI, enter the following statements to create a new table named **log4jLogs** by using the sample data:

        DROP TABLE log4jLogs;
        CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
        ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
        STORED AS TEXTFILE LOCATION 'wasb:///example/data/';
        SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' GROUP BY t4;

    These statements perform the following actions:

    * **DROP TABLE** - Deletes the table and the data file, in case the table already exists.
    * **CREATE EXTERNAL TABLE** - Creates a new 'external' table in Hive. External tables only store the table definition in Hive. The data is left in the original location.
    * **ROW FORMAT** - Tells Hive how the data is formatted. In this case, the fields in each log are separated by a space.
    * **STORED AS TEXTFILE LOCATION** - Tells Hive where the data is stored (the example/data directory), and that it is stored as text.
    * **SELECT** - Selects a count of all rows where column **t4** contains the value **[ERROR]**. This should return a value of **3** as there are three rows that contain this value.

    > [AZURE.NOTE] External tables should be used when you expect the underlying data to be updated by an external source, such as an automated data upload process, or by another MapReduce operation, but always want Hive queries to use the latest data.
    >
    > Dropping an external table does **not** delete the data, only the table definition.

4. Use the following statements to create a new 'internal' table named **errorLogs**:

        CREATE TABLE IF NOT EXISTS errorLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string) STORED AS ORC;
        INSERT OVERWRITE TABLE errorLogs SELECT t1, t2, t3, t4, t5, t6, t7 FROM log4jLogs WHERE t4 = '[ERROR]';

    These statements perform the following actions:

    * **CREATE TABLE IF NOT EXISTS** - Creates a table, if it does not already exist. Since the **EXTERNAL** keyword is not used, this is an internal table, which is stored in the Hive data warehouse and is managed completely by Hive.
    * **STORED AS ORC** - Stores the data in Optimized Row Columnar (ORC) format. This is a highly optimized and efficient format for storing Hive data.
    * **INSERT OVERWRITE ... SELECT** - Selects rows from the **log4jLogs** table that contain **[ERROR]**, then inserts the data into the **errorLogs** table.

    To verify that only rows containing **[ERROR]** in column t4 were stored to the **errorLogs** table, use the following statement to return all the rows from **errorLogs**:

        SELECT * from errorLogs;

    Three rows of data should be returned, all containing **[ERROR]** in column t4.

    > [AZURE.NOTE] Unlike external tables, dropping an internal table will delete the underlying data as well.

##<a id="summary"></a>Summary

As you can see, the Hive command provides an easy way to interactively run Hive queries on an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information on Hive in HDInsight:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

For information on other ways you can work with Hadoop on HDInsight:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/library/dn479185.aspx

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[apache-tez]: http://tez.apache.org
[apache-hive]: http://hive.apache.org/
[apache-log4j]: http://en.wikipedia.org/wiki/Log4j
[hive-on-tez-wiki]: https://cwiki.apache.org/confluence/display/Hive/Hive+on+Tez
[import-to-excel]: http://azure.microsoft.com/documentation/articles/hdinsight-connect-excel-power-query/


[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-analyze-flight-data]: hdinsight-analyze-flight-delay-data.md

[putty]: http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html

[hdinsight-storage]: hdinsight-use-blob-storage.md

[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]: hdinsight-get-started.md

[Powershell-install-configure]: install-configure-powershell.md
[powershell-here-strings]: http://technet.microsoft.com/library/ee692792.aspx

[image-hdi-hive-powershell]: ./media/hdinsight-use-hive/HDI.HIVE.PowerShell.png
[img-hdi-hive-powershell-output]: ./media/hdinsight-use-hive/HDI.Hive.PowerShell.Output.png
[image-hdi-hive-architecture]: ./media/hdinsight-use-hive/HDI.Hive.Architecture.png
