---
title: 'Quickstart: Execute Apache Hive queries in Azure HDInsight - Apache Zeppelin'
description: In this quickstart, you learn how to use Apache Zeppelin to run Apache Hive queries.
keywords: hdinsight,hadoop,hive,interactive query,LLAP 
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: quickstart
ms.date: 05/06/2019
ms.author: hrasheed
#Customer intent: As a Hive user, I want learn Zeppelin so that I can run queries.
---

# Quickstart: Execute Apache Hive queries in Azure HDInsight with Apache Zeppelin

In this quickstart, you learn how to use Apache Zeppelin to run [Apache Hive](https://hive.apache.org/) queries in Azure HDInsight. HDInsight Interactive Query clusters include [Apache Zeppelin](https://zeppelin.apache.org/) notebooks that you can use to run interactive Hive queries.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

An HDInsight Interactive Query cluster. See [Create cluster](../hadoop/apache-hadoop-linux-tutorial-get-started.md#create-cluster) to create an HDInsight cluster.  Make sure to choose the **Interactive Query** cluster type.

## Create an Apache Zeppelin Note

1. Replace `CLUSTERNAME` with the name of your cluster in the following URL `https://CLUSTERNAME.azurehdinsight.net/zeppelin`. Then enter the URL in a web browser.

2. Enter your cluster login username and password. From the Zeppelin page, you can either create a new note or open existing notes. **HiveSample** contains some sample Hive queries.  

    ![HDInsight Interactive Query zeppelin](./media/hdinsight-connect-hive-zeppelin/hdinsight-hive-zeppelin.png)

3. Select **Create new note**.

4. From the **Create new note** dialog, type or select the following values:

    - Note Name: Enter a name for the note.
    - Default interpreter: Select **jdbc** from the drop-down list.

5. Select **Create Note**.

6. Enter the following Hive query in the code section, and then press **Shift + Enter**:

    ```hive
    %jdbc(hive)
    show tables
    ```

    ![HDInsight Interactive Query zeppelin runs query](./media/hdinsight-connect-hive-zeppelin/hdinsight-hive-zeppelin-query.png)

    The **%jdbc(hive)** statement in the first line tells the notebook to use the Hive JDBC interpreter.

    The query shall return one Hive table called **hivesampletable**.

    The following are two additional Hive queries that you can run against **hivesampletable**:

    ```hive
    %jdbc(hive)
    select * from hivesampletable limit 10

    %jdbc(hive)
    select ${group_name}, count(*) as total_count
    from hivesampletable
    group by ${group_name=market,market|deviceplatform|devicemake}
    limit ${total_count=10}
    ```

    Comparing to the traditional Hive, the query results come back must faster.

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

To delete a cluster, see [Delete an HDInsight cluster using your browser, PowerShell, or the Azure CLI](../hdinsight-delete-cluster.md).

## Next steps

In this quickstart, you learned how to use Apache Zeppelin to run Apache Hive queries in Azure HDInsight. To learn more about Hive queries, the next article will show you how to execute queries with Visual Studio.

> [!div class="nextstepaction"]
> [Connect to Azure HDInsight and run Apache Hive queries using Data Lake Tools for Visual Studio](../hadoop/apache-hadoop-visual-studio-tools-get-started.md)
