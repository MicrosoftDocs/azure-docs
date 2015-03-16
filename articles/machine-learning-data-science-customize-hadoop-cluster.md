<properties title="Customize Azure HDInsight Hadoop Clusters for Data Science" pageTitle="Customize Azure HDInsight Hadoop Clusters for Data Science | Azure" description="Customize Azure HDInsight Hadoop Clusters for Data Science" metaKeywords="" services="data-science-process" solutions="" documentationCenter="" authors="hangzh-msft" manager="jacob.spoelstra" editor="" videoId="" scriptId="" />

<tags ms.service="data-science-process" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/09/2015" ms.author="hangzh-msft" />

# Customize Azure HDInsight Hadoop Clusters for Data Science

In this document, we describe how to customize HDInsight Hadoop clusters such that 64-bit Anaconda (Python 2.7) is installed on all nodes when the HDInsight Hadoop cluster is provisioned. Since Anaconda includes most of the popularly used Python modules, when users develop Python user defined functions (UDFs) to process Hive records, in most of the cases they can directly import all needed Python modules in their UDFs. 

We also describe after the Hadoop cluster is provisioned, how to access the head node of the cluster remotely, and how to submit Hive queries in the Hadoop Command Line in the head node.


- [Customize Azure HDInsight Hadoop Cluster](#customize)
- [Access the Head Node of Hadoop Cluster](#remoteaccess)
- [Run Hive Queries in Head Node of Hadoop Cluster](#hivequery)
- [Output Hive Query Results to Files](#output)

## <a name="customize"></a>Customize Azure HDInsight Hadoop Cluster

To create a customized HDInsight Hadoop cluster, users need to log on to [**Management Portal of Azure**](https://manage.windowsazure.com/), click **New** at the left bottom corner, and then select DATA SERVICES >> HDINSIGHT >> **CUSTOM CREATE**. 

![Create workspace][1]

Then, a window will be popped up for users to configure the cluster. Users need to input the name of the cluster to be created, and accept default values of other fields. Click on the arrow to go to the next configuration page. 

![Create workspace][2]

Users are then asked to input the number of **DATA NODES**, select the **REGION/VIRTUAL NETWORK**, and select the sizes of the **HEAD NODE** and the **DATA NODE**. Click the arrow to go to the next configuration page.

>[AZURE.NOTE] The **REGION/VIRTUAL NETWORK** has to be the same as the region of the storage account that is going to be used for the HDInsight Hadoop cluster. Otherwise, in configuration page 4, the storage account that the users want to use will not appear on the drop down list of **ACCOUNT NAME**.

![Create workspace][3]

On this configuration page, users need to input the user name and password for the HDInsight Hadoop cluster. **Do not** select the _Enter the Hive/Oozie Metastore_. Then, click the arrow to go to the next configuration page. 

![Create workspace][4]

Then, users need to specify the storage account name, the default container of the HDInsight Hadoop cluster. If users select _Create default container_ in the **DEFAULT CONTAINER** drop down list, a container with the same name as the cluster will be created. Click the arrow to go to the last configuration page.

![Create workspace][5]

On the _Script Actions_ configuration page, click **add script action** button, and fill the text fields like the following figure. In field _NODE TYPE_, select **All nodes**. The **NAME** field can be any string as the name of this script action. In **SCRIPT URI**, fill in `http://getgoing.blob.core.windows.net/publicscripts/Azure_HDI_Setup_Windows.ps1`. `publicscripts` is a public container in storage account `getgoing` we use to share PowerShell script files to facilitate users work in Azure. Leave field _PARAMETERS_ blank. Finally, click on the check mark, customized HDInsight Hadoop cluster creation process will start. 

![Create workspace][6]

## <a name="headnode"></a> Access the Head Node of Hadoop Cluster

Users have to first enable remote access to the Hadoop cluster. Then, users can access the head node of the Hadoop cluster through RDP. 

1. Log in to the management portal of Azure, select HDInsight, your Hadoop cluster, click CONFIGURATION, and then click "ENABLE REMOTE" at the bottom.
	
	![Create workspace][7]

2. In the "Configure Remote Desktop" window, input "USER NAME" and "PASSWORD", and select the expiration date of the remote access. Then click the check mark to complete the steps of enabling the remote access to the head node of the Hadoop cluster.
	>[AZURE.NOTE] 
	>
	>1. In this window, you are asked to input the user name and password for the remote access. They here are not the user name and password you use when you create the Hadoop cluster. 
	>
	>2. The expiration date of the remote access has to be within 7 days from the current date.

	![Create workspace][8]

3. After the remote access is enabled, click the "CONNECT" at the bottom of the page, you will be able to log in to the head node of the Hadoop cluster after you enter the credentials of the remote access user that you just create.

	 ![Create workspace][9]

[1]: ./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img1.png
[2]: ./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img2.png
[3]: ./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img3.png
[4]: ./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img4.png
[5]: ./media/machine-learning-data-science-customize-hadoop-cluster/customize-cluster-img5.png
[6]: ./media/machine-learning-data-science-customize-hadoop-cluster/script-actions.png
[7]: ./media/machine-learning-data-science-customize-hadoop-cluster/enable-remote-access-1.png
[8]: ./media/machine-learning-data-science-customize-hadoop-cluster/enable-remote-access-2.png
[9]: ./media/machine-learning-data-science-customize-hadoop-cluster/enable-remote-access-3.png

