---
title: Create Hadoop cluster with secure transfer storage accounts in Azure HDInsight
description: Learn how to create HDInsight clusters with secure transfer enabled Azure storage accounts.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 07/24/2018
---
# Create Apache Hadoop cluster with secure transfer storage accounts in Azure HDInsight

The [Secure transfer required](../storage/common/storage-require-secure-transfer.md) feature enhances the security of your Azure Storage account by enforcing all requests to your account through a secure connection. This feature and the wasbs scheme are only supported by HDInsight cluster version 3.6 or newer.

## Prerequisites
Before you begin this article, you must have:

* **Azure subscription**: To create a free one-month trial account, browse to [azure.microsoft.com/free](https://azure.microsoft.com/free).
* **An Azure Storage account with secure transfer enabled**. For the instructions, see [Create a storage account](../storage/common/storage-quickstart-create-account.md) and [Require secure transfer](../storage/common/storage-require-secure-transfer.md).
* **A Blob container on the storage account**.

## Create cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]


In this section, you create a Hadoop cluster in HDInsight using an [Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md). The template is located in [GitHub](https://azure.microsoft.com/resources/templates/101-hdinsight-linux-with-existing-default-storage-account/). Resource Manager template experience is not required for following this article. For other cluster creation methods and understanding the properties used in this article, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

1. Click the following image to sign in to Azure and open the Resource Manager template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-hdinsight-linux-with-existing-default-storage-account%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-hadoop-linux-tutorial-get-started/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. Follow the instructions to create the cluster with the following specifications: 

    - Specify HDInsight version 3.6. Version 3.6 or newer is required.
    - Specify a secure transfer enabled storage account.
    - Use short name for the storage account.
    - Both the storage account and the blob container must be created beforehand.

      For the instructions, see [Create cluster](hadoop/apache-hadoop-linux-tutorial-get-started.md#create-cluster).

If you use script action to provide your own configuration files, you must use wasbs in the following settings:

- fs.defaultFS (core-site)
- spark.eventLog.dir 
- spark.history.fs.logDirectory

## Add additional storage accounts

There are several options to add additional secure transfer enabled storage accounts:

- Modify the Azure Resource Manager template in the last section.
- Create a cluster using the [Azure portal](https://portal.azure.com) and specify linked storage account.
- Use script action to add additional secure transfer enabled storage accounts to an existing HDInsight cluster. For more information, see [Add additional storage accounts to HDInsight](hdinsight-hadoop-add-storage.md).

## Next steps
In this article, you have learned how to create an HDInsight cluster, and enable secure transfer to the storage accounts.

To learn more about analyzing data with HDInsight, see the following articles:

* To learn more about using [Apache Hive](https://hive.apache.org/) with HDInsight, including how to perform Hive queries from Visual Studio, see [Use Apache Hive with HDInsight][hdinsight-use-hive].
* To learn about [Apache Pig](https://pig.apache.org/), a language used to transform data, see [Use Apache Pig with HDInsight][hdinsight-use-pig].
* To learn about [Apache Hadoop MapReduce](https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html), a way to write programs that process data on Hadoop, see [Use Apache Hadoop MapReduce with HDInsight][hdinsight-use-mapreduce].
* To learn about using the HDInsight Tools for Visual Studio to analyze data on HDInsight, see [Get started using Visual Studio Apache Hadoop tools for HDInsight](hadoop/apache-hadoop-visual-studio-tools-get-started.md).

To learn more about how HDInsight stores data or how to get data into HDInsight, see the following articles:

* For information on how HDInsight uses Azure Storage, see [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md).
* For information on how to upload data to HDInsight, see [Upload data to HDInsight][hdinsight-upload-data].

To learn more about creating or managing an HDInsight cluster, see the following articles:

* To learn about managing your Linux-based HDInsight cluster, see [Manage HDInsight clusters using Apache Ambari](hdinsight-hadoop-manage-ambari.md).
* To learn more about the options you can select when creating an HDInsight cluster, see [Creating HDInsight on Linux using custom options](hdinsight-hadoop-provision-linux-clusters.md).
* If you are familiar with Linux, and Apache Hadoop, but want to know specifics about Hadoop on the HDInsight, see [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md). This article provides information such as:

  * URLs for services hosted on the cluster, such as [Apache Ambari](https://ambari.apache.org/) and [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat)
  * The location of [Apache Hadoop](https://hadoop.apache.org/) files and examples on the local file system
  * The use of Azure Storage (WASB) instead of [Apache Hadoop HDFS](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsUserGuide.html) as the default data store

[1]: ../HDInsight/hadoop/apache-hadoop-visual-studio-tools-get-started.md

[hdinsight-provision]: hdinsight-provision-linux-clusters.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]:hadoop/hdinsight-use-mapreduce.md
[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-use-pig]:hadoop/hdinsight-use-pig.md
