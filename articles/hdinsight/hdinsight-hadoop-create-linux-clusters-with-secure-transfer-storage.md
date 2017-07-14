---
title: Create Hadoop cluster with secure transfer storage accounts in Azure HDInsight | Microsoft Docs
description: Learn how to create HDInsight clusters with secure transfer enabled Azure storage accounts.
keywords: hadoop getting started,hadoop linux,hadoop quickstart,secure transfer,azure storage account
services: hdinsight
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/13/2017
ms.author: jgao

---
# Create Hadoop cluster with secure transfer storage accounts in Azure HDInsight

The [Secure transfer required](../storage/storage-require-secure-transfer.md) feature enhances the security of your Azure Storage account by enforcing all requests to your account through a secure connection. This feature and the wasbs scheme are only supported by HDInsight cluster version 3.6 or newer. Currently, you cannot directly create a HDInsight cluster with secure transfer enabled Azure storage accounts. You can only enable the secure transfer feature after a cluster is created. If you enabled the feature for the default storage account, you must also use the Ambari UI to configure HDFS>Configs>Advanced>Advance core-site>fs.defaultFS by replacing wasb://container@sname.blob.core.windows.net to wasbs://container@sname.blob.core.windows.net. 

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Prerequisites
Before you begin this tutorial, you must have:

* **Azure subscription**: To create a free one-month trial account, browse to [azure.microsoft.com/free](https://azure.microsoft.com/free).

## Create cluster

In this section, you create a Hadoop cluster in HDInsight using an [Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md). Only HDInsight cluster version 3.6 or newer supports the secure transfer enabled storage accounts. Resource Manager template experience is not required for following this tutorial. For other cluster creation methods and understanding the properties used in this tutorial, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

The Resource Manager template used in this tutorial is located in [GitHub](https://azure.microsoft.com/resources/templates/101-hdinsight-linux-ssh-password/). 

1. Click the following image to sign in to Azure and open the Resource Manager template in the Azure portal. 
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-hdinsight-linux-ssh-password%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-hadoop-linux-tutorial-get-started/deploy-to-azure.png" alt="Deploy to Azure"></a>
2. Enter or select the following values:
   
    ![HDInsight Linux get started Resource Manager template on portal](./media/hdinsight-hadoop-linux-tutorial-get-started/hdinsight-linux-get-started-arm-template-on-portal.png "Deploy Hadoop cluster in HDInsigut using the Azure portal and a resource group manager template").
   
    * **Subscription**: Select your Azure subscription.
    * **Resource group**: Create a resource group or select an existing resource group.  A resource group is a container of Azure components.  In this case, the resource group contains the HDInsight cluster and the dependent Azure Storage account. 
    * **Location**: Select an Azure location where you want to create your cluster.  Choose a location closer to you for better performance. 
    * **Cluster Type**: Select **hadoop** for this tutorial.
    * **Cluster Name**: Enter a name for the Hadoop cluster.
    * **Cluster login name and password**: The default login name is **admin**.
    * **SSH username and password**: The default username is **sshuser**.  You can rename it. 
     
    Some properties have been hardcoded in the template.  You can configure these values from the template.

    * **Location**: The location of the cluster and the dependent storage account share the same location as the resource group.
    * **Cluster version**: 3.6
    * **OS Type**: Linux
    * **Number of worker nodes**: 2

     Each cluster has an Azure Storage account dependency. It is referred as the default storage account. HDInsight cluster and its default storage account must be co-located in the same Azure region. Deleting clusters does not delete the storage account. 
     
     For more explanation of these properties, see [Create Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

3. Select **I agree to the terms and conditions stated above** and **Pin to dashboard**, and then click **Purchase**. You shall see a new tile titled **Deploying Template deployment** on the portal dashboard. It takes about around 20 minutes to create a cluster. Once the cluster is created, the caption of the tile is changed to the resource group name you specified. And the portal automatically opens the resource group in a new blade. You can see both the cluster and the default storage listed.
   
    ![HDInsight Linux get started resource group](./media/hdinsight-hadoop-linux-tutorial-get-started/hdinsight-linux-get-started-resource-group.png "Azure HDInsight cluster resource group").

4. Click the cluster name to open the cluster in a new blade.

   ![HDInsight Linux get started cluster settings](./media/hdinsight-hadoop-linux-tutorial-get-started/hdinsight-linux-get-started-cluster-settings.png "HDInsight cluster properties")

## Enable secure transfer for the storage accounts

Currently, you can enable secure transfer for the storage accounts only after the HDInsight cluster has been created.  For the instructions for enabling secure transfer, see [Require secure transfer for an existing storage account](../storage/storage-rquire-secure-transfer.md).


## Configure the defaultFS setting

This step is required only if you use a secure transfer enabled storage account as the default storage account.

**To configure the defaultFS setting**

1. Sign in to the Ambari Web UI.  See [Connectivity](./hdinsight-hadoop-manage-ambari.md#connectivity).
2. From the left menu, click **HDFS**.
3. Click the **Configs** tab.
4. Click the **Advanced** tab.
5. Expand the **Advanced core-site** section.
6. Update **fs.defaultFS** to use **wasbs://** instead of **wasb://**.
7. Click **Save**.
8. Add a note, and then click **Save**.
9. Click **OK**.
10. Click **Proceed Anyway**.
11. Click **OK**.
12. Click **Restart**, and then click **Restart All Affected**.
13. Click **Confirm Restart All**.
14. Click **OK** to close the dialog.


## Add additional storage accounts

You can use script action to add additional secure transfer enabled storage accounts to a HDInsight cluster.  For more information, see [Add additional storage accounts to HDInsight](hdinsight-hadoop-add-storage.md).


## Next steps
In this tutorial, you have learned how to create a HDInsight cluster, and enable secure transfer to the storage accounts.

To learn more about analyzing data with HDInsight, see the following articles:

* To learn more about using Hive with HDInsight, including how to perform Hive queries from Visual Studio, see [Use Hive with HDInsight][hdinsight-use-hive].
* To learn about Pig, a language used to transform data, see [Use Pig with HDInsight][hdinsight-use-pig].
* To learn about MapReduce, a way to write programs that process data on Hadoop, see [Use MapReduce with HDInsight][hdinsight-use-mapreduce].
* To learn about using the HDInsight Tools for Visual Studio to analyze data on HDInsight, see [Get started using Visual Studio Hadoop tools for HDInsight](hdinsight-hadoop-visual-studio-tools-get-started.md).

If you're ready to start working with your own data and need to know more about how HDInsight stores data or how to get data into HDInsight, see the following articles:

* For information on how HDInsight uses Azure Storage, see [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md).
* For information on how to upload data to HDInsight, see [Upload data to HDInsight][hdinsight-upload-data].

If you'd like to learn more about creating or managing an HDInsight cluster, see the following articles:

* To learn about managing your Linux-based HDInsight cluster, see [Manage HDInsight clusters using Ambari](hdinsight-hadoop-manage-ambari.md).
* To learn more about the options you can select when creating an HDInsight cluster, see [Creating HDInsight on Linux using custom options](hdinsight-hadoop-provision-linux-clusters.md).
* If you are familiar with Linux, and Hadoop, but want to know specifics about Hadoop on the HDInsight, see [Working with HDInsight on Linux](hdinsight-hadoop-linux-information.md). This article provides information such as:
  
  * URLs for services hosted on the cluster, such as Ambari and WebHCat
  * The location of Hadoop files and examples on the local file system
  * The use of Azure Storage (WASB) instead of HDFS as the default data store

[1]: ../HDInsight/hdinsight-hadoop-visual-studio-tools-get-started.md

[hdinsight-provision]: hdinsight-provision-linux-clusters.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md


