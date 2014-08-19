<properties linkid="manage-services-hdinsight-howto-social-data" urlDisplayName="Analyze Twitter data with HDInsight Hadoop" pageTitle="Analyze Twitter data with Hadoop in HDInsight | Azure" metaKeywords="" description="Learn how to use Hive to analyze Twitter data on Hadoop in HDInsight to find the usage frequency of a particular word." metaCanonical="" services="HDInsight" documentationCenter="" title="Analyze Twitter data with Hadoop in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

# Provision HDInsight clusters on Azure Virtual Network

Learn how to create an HDInsight cluster on Azure Virtual Network. Currently, only HBase clusters can be provisioned into Azure Virtual Networks. 

With the virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly. The benefits include:

- improve performance by not having to hop over multiple gateways and load-balancers 
- process sensitive information in a more secure manner without exposing a public endpoint


##In this article

- [Prerequisites](#prerequisites)
- [Provision HBase clusters into a virtual network](#hbaseprovision)
- [Next steps](#nextsteps)

##<a id="prerequisites"></a>Prerequisites
Before you begin this tutorial, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

- **A workstation** with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install]. To execute PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See [Run Windows PowerShell scripts][powershell-script].

	Before running PowerShell scripts, make sure you are connected to your Azure subscription using the following cmdlet:

		Add-AzureAccount

	If you have multiple Azure subscriptions, use the following cmdlet to set the current subscription:

		Select-AzureSubscription <AzureSubscriptionName>


##<a id="hbaseprovision"></a>Provision an HBase cluster into a virtual network. 

There are three procedures involved:

- create an Azure virtual network
- create an Azure storage account and a Blob storage container
- provision an HBase cluster

**To create a Virtual Network using the management portal**

1. Sign in to the [Azure Management portal][azure-portal].
2. On the bottom of the page, click **NEW**, click **NETWORK SERVICES**, click **VIRTUAL NETWORK**, and then click **QUICK CREATE**.
3. Type or select the following values:

	- **Name**: The name of your virtual network.
	- **Address space**: Choose one of the address spaces.
	- **Maximum VM count**: Choose one of the Maximum VM count.
	- **Location**: The location must be the same as the HBase cluster that you will create.
	- **DNS server**: You can select <strong>None</strong>.

4. Click **CREATE A VIRTUAL NETWORK**. The new virtual network name will appear in the list. Wait until the Status column shows **Created**.
2. In the main pane, click the virtual network you just created.
3. On the top of the page, click **DASHBOARD**.
4. Under **quick glance**, make a note of **VIRTUAL NETWORK ID** as well as the virtual network name. You will need both when provisioning HBase cluster.

HDInsight clusters use Azure Blob storage for storing data. For more information, see [Use Azure Blob storage with Hadoop in HDInsight][hdinsight-storage]. You will need a storage account and a Blob storage container. The storage account location must match the virtual network location and the cluster location.


**To create an Azure Storage account and a Blob storage container**

1. Sign in to the [Azure Management Portal][azure-portal].
2. Click **NEW** on the lower left corner, point to **DATA SERVICES**, point to **STORAGE**, and then click **QUICK CREATE**.

3. Type or select the following values:

	- **URL**: The name of the storage account
	- **LOCATION**: The location of the storage account. Make sure it matches the virtual network location. Affinity groups are not supported.
	- **REPLICATION**: For testing purpose, use **Locally Redundant** to reduce the cost.

4. Click **CREATE STORAGE ACCOUNT**.  You will see the new storage account in the storage list. 
4. Wait until the **STATUS** of the new storage account is changed to **Online**.
5. Click the new storage account from the list to select it.
6. Click **MANAGE ACCESS KEYS** from the bottom of the page.
7. Make a note of the **STORAGE ACCOUNT NAME** and the **PRIMARY ACCESS KEY** (or the **SECONDARY ACCESS KEY**.  Either of the keys works).  You will need them later in the tutorial.
3. From the top of the page, click **CONTAINER**.
4. From the bottom of the page, click **ADD**.
5. Enter the container name.  This container will be used as the default container for the HBase cluster. By default, the default container name match the cluster name. Keep the **ACCESS** field as **Private**.  
6. Click the check icon to create the container.


Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For information on configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell][powershell-install]. For more information on using PowerShell with HDInsight, see [Administer HDInsight using PowerShell][hdinsight-admin-powershell]. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].

**To provision an HBase cluster using Azure PowerShell**

1. Open PowerShell ISE.
2. Copy and paste the following copy into the script pane.

		$hbaseClusterName = "<HBaseClusterName>"
		$hadoopUserName = "<HBaseClusterUsername>"
		$hadoopUserPassword = "<HBaseClusterUserPassword>"
		$location = "<HBaseClusterLocation>"  #i.e. "West US"
		$clusterSize = <HBaseClusterSize>  
		$vnetName = "<AzureVirtualNetworkName>"
		$vnetID = "<AzureVirtualNetworkID>"
		$storageAccountName = "<AzureStorageAccountName>" # Do not use the full name here
		$storageAccountKey = "<AzureStorageAccountKey>"
		$storageContainerName = "<AzureBlobStorageContainer>"
		
		$password = ConvertTo-SecureString $hadoopUserPassword -AsPlainText -Force
		$creds = New-Object System.Management.Automation.PSCredential ($hadoopUserName, $password) 
		
		New-AzureHDInsightCluster -Name $hbaseClusterName `
		                          -ClusterType HBase `
		                          -Version 3.1 `
		                          -Location $location `
		                          -ClusterSizeInNodes $clusterSize `
		                          -Credential $creds `
		                          -VirtualNetworkId $vnetID `
		                          -SubnetName $vnetName `
		                          -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" `
		                          -DefaultStorageAccountKey $storageAccountKey `
		                          -DefaultStorageContainerName $storageContainerName


3. Click **Run Script**, or press **F5**.
4. To validate the cluster, you can either check the cluster from the management portal, or run the following PowerShell cmdlet from the bottom pane:

	Get-AzureHDInsightCluster 

To test the new HBase cluster, you can use the procedures found in [Get started using HBase with Hadoop in HDInsight][hbase-get-started].

##<a id="nextsteps"></a>Next Steps

In this tutorial we have learned how to provision an HBase cluster. To learn more, see:

- [Get started with HDInsight][hdinsight-get-started]
- [Provision Hadoop clusters in HDInsight][hdinsight-provision] 
- [Get started using HBase with Hadoop in HDInsight][hbase-get-started]
- [Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]
- [Virtual Network Overview][vnet-overview].

[hbase-get-started]: ../hdinsight-hbase-get-started/
[hbase-twitter-sentiment]: ../hdinsight-hbase-twitter-sentiment/
[vnet-overview]: http://msdn.microsoft.com/library/azure/jj156007.aspx

[azure-portal]: https://manage.windowsazure.com
[azure-create-storageaccount]: ../storage-create-storage-account/ 
[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/

[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/

[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx




[twitter-streaming-api]: https://dev.twitter.com/docs/streaming-apis
[twitter-statuses-filter]: https://dev.twitter.com/docs/api/1.1/post/statuses/filter

[powershell-start]: http://technet.microsoft.com/en-us/library/hh847889.aspx
[powershell-install]: ../install-configure-powershell
[powershell-script]: http://technet.microsoft.com/en-us/library/ee176949.aspx

[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-storage-powershell]: ../hdinsight-use-blob-storage/#powershell
[hdinsight-analyze-flight-delay-data]: ../hdinsight-analyze-flight-delay-data/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-use-sqoop]: ../hdinsight-use-sqoop/
[hdinsight-power-query]: ../hdinsight-connect-excel-power-query/
[hdinsight-hive-odbc]: ../hdinsight-connect-excel-hive-ODBC-driver/

