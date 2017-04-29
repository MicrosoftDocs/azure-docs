---
title: Customize Hadoop clusters for the Team Data Science Process | Microsoft Docs
description: Popular Python modules made available in custom Azure HDInsight Hadoop clusters.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: 0c115dca-2565-4e7a-9536-6002af5c786a
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/24/2017
ms.author: hangzh;bradsev

---
# Customize Azure HDInsight Hadoop clusters for the Team Data Science Process
This article describes how to customize an HDInsight Hadoop cluster by installing 64-bit Anaconda (Python 2.7) on each node when the cluster is provisioned as an HDInsight service. It also shows how to access the headnode to submit custom jobs to the cluster. This customization makes many popular Python modules, that are included in Anaconda, conveniently available for use in user defined functions (UDFs) that are designed to process Hive records in the cluster. For instructions on the procedures used in this scenario, see [How to submit Hive queries](machine-learning-data-science-move-hive-tables.md#submit).

The following menu links to topics that describe how to set up the various data science environments used by the [Team Data Science Process (TDSP)](data-science-process-overview.md).

[!INCLUDE [data-science-environment-setup](../../includes/cap-setup-environments.md)]

## <a name="customize"></a>Customize Azure HDInsight Hadoop Cluster
To create a customized HDInsight Hadoop cluster, start by logging on to [**Azure classic portal**](https://manage.windowsazure.com/), click **New** at the left bottom corner, and then select DATA SERVICES -> HDINSIGHT -> **CUSTOM CREATE** to bring up the **Cluster Details** window. 

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img1.png)

Input the name of the cluster to be created on configuration page 1, and accept default values for the other fields. Click the arrow to go to the next configuration page. 

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img1.png)

On configuration page 2, input the number of **DATA NODES**, select the **REGION/VIRTUAL NETWORK**, and select the sizes of the **HEAD NODE** and the **DATA NODE**. Click the arrow to go to the next configuration page.

> [!NOTE]
> The **REGION/VIRTUAL NETWORK** has to be the same as the region of the storage account that is going to be used for the HDInsight Hadoop cluster. Otherwise, in the fourth configuration page, the storage account will not appear on the dropdown list of **ACCOUNT NAME**.
> 
> 

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img3.png)

On configuration page 3, provide a user name and password for the HDInsight Hadoop cluster. **Do not** select the *Enter the Hive/Oozie Metastore*. Then, click the arrow to go to the next configuration page. 

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img4.png)

On configuration page 4, specify the storage account name, the default container of the HDInsight Hadoop cluster. If you select *Create default container* in the **DEFAULT CONTAINER** dropdown list, a container with the same name as the cluster will be created. Click the arrow to go to the last configuration page.

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img5.png)

On the final **Script Actions** configuration page, click **add script action** button, and fill the text fields with the following values.

* **NAME** - any string as the name of this script action
* **NODE TYPE** - select **All nodes**
* **SCRIPT URI** - *http://getgoing.blob.core.windows.net/publicscripts/Azure_HDI_Setup_Windows.ps1* 
  * *publicscripts* is a public container in the storage account 
  * *getgoing* we use to share PowerShell script files to facilitate users' work in Azure
* **PARAMETERS** - (leave blank)

Finally, click the check mark to start the creation of the customized HDInsight Hadoop cluster. 

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/script-actions.png)

## <a name="headnode"></a> Access the Head Node of Hadoop Cluster
You must enable remote access to the Hadoop cluster in Azure before you can access the head node of the Hadoop cluster through RDP. 

1. Log in to the [**Azure classic portal**](https://manage.windowsazure.com/), select **HDInsight** on the left, select your Hadoop cluster from the list of clusters, click the **CONFIGURATION** tab, and then click the **ENABLE REMOTE** icon at the bottom of the page.
   
    ![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/enable-remote-access-1.png)
2. In the **Configure Remote Desktop** window, enter the USER NAME and PASSWORD fields, and select the expiration date for remote access. Then click the check mark to enable the remote access to the head node of the Hadoop cluster.
   
    ![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/enable-remote-access-2.png)

> [!NOTE]
> The user name and password for the remote access are not the user name and password that you use when you created the Hadoop cluster. This is a separate set of credentials. Also, the expiration date of the remote access has to be within 7 days from the current date.
> 
> 

After remote access is enabled, click **CONNECT** at the bottom of the page to remote into the head node. You log on to the head node of the Hadoop cluster by entering the credentials for the remote access user that you specified earlier.

![Create workspace](./media/machine-learning-data-science-customize-hadoop-cluster/enable-remote-access-3.png)

The next steps in the advanced analytics process are mapped in the [Team Data Science Process (TDSP)](https://azure.microsoft.com/documentation/learning-paths/cortana-analytics-process/) and may include steps that move data into HDInsight, then process and sample it there in preparation for learning from the data with Azure Machine Learning.

See [How to submit Hive queries](machine-learning-data-science-move-hive-tables.md#submit) for instructions on how to access the Python modules that are included in Anaconda from the head node of the cluster in user-defined functions (UDFs) that are used to process Hive records stored in the cluster.

