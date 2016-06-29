<properties 
   pageTitle="Configure HBase replication between two datacenters | Microsoft Azure" 
   description="Learn how to configure HBase replication across two data centers, and about the use cases for cluster replication." 
   services="hdinsight,virtual-network" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="06/28/2016"
   ms.author="jgao"/>

# Configure HBase geo-replication in HDInsight

> [AZURE.SELECTOR]
- [Configure VPN connectivity](../hdinsight-hbase-geo-replication-configure-VNETs.md)
- [Configure DNS](hdinsight-hbase-geo-replication-configure-DNS.md)
- [Configure HBase replication](hdinsight-hbase-geo-replication.md) 
 
Learn how to configure HBase replication across two data centers. Some use cases for cluster replication include:

- Backup and disaster recovery
- Data aggregation
- Geographic data distribution
- Online data ingestion combined with offline data analytics

Cluster replication uses a source-push methodology. An HBase cluster can be a source, a destination, or can fulfill both roles at once. Replication is asynchronous, and the goal of replication is eventual consistency. When the source receives an edit to a column family with replication enabled, that edit is propagated to all destination clusters. When data is replicated from one cluster to another, the source cluster and all clusters which have already consumed the data are tracked to prevent replication loops. For more information, 
In this tutorial, you will configure a source-destination replication.  For other cluster topologies, see [Apache HBase Reference Guide](http://hbase.apache.org/book.html#_cluster_replication).

This is the third part of the series:

- [Configure a VPN connectivity between two virtual networks][hdinsight-hbase-replication-vnet]
- [Configure DNS for the virtual networks][hdinsight-hbase-replication-dns]
- Configure HBase geo replication (this tutorial)

The following diagram illustrates the two virtual networks and the network connectivity you created in [Configure a VPN connectivity between two virtual networks][hdinsight-hbase-geo-replication-vnet] and [Configure DNS for the virtual networks][hdinsight-hbase-replication-dns]: 

![HDInsight HBase replication virtual network diagram][img-vnet-diagram]

## <a id="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- **A workstation with Azure PowerShell**.

    To execute PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See Using the Set-ExecutionPolicy cmdlet.
	
	[AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

- **Two Azure virtual network with VPN connectivity and with DNS configured**.  For instructions, see [Configure a VPN connection between two Azure virtual networks][hdinsight-hbase-replication-vnet], and [Configure DNS between two Azure virtual networks][hdinsight-hbase-replication-dns].


	Before running PowerShell scripts, make sure you are connected to your Azure subscription using the following cmdlet:

		Add-AzureAccount

	If you have multiple Azure subscriptions, use the following cmdlet to set the current subscription:

		Select-AzureSubscription <AzureSubscriptionName>



## Provision HBase clusters in HDInsight

In [Configure a VPN connection between two Azure virtual networks][hdinsight-hbase-replication-vnet], you have created a virtual network in an Europe data center, and a virtual network in a U.S. data center. The two virtual network are connected via VPN. In this session, you will provision an HBase cluster in each of the virtual networks. Later in this tutorial, you will make one of the HBase clusters to replicate the other HBase cluster.

The Azure Classic Portal doesn't support provisioning HDInsight clusters with custom configuration options. For example, set *hbase.replication* to *true*. If you set the value in the configuration file after a cluster is provisioned, you will lose the setting after the cluster is being reimaged. For more information see [Provision Hadoop clusters in HDInsight][hdinsight-provision]. One of the options to provision HDInsight cluster with custom options is using Azure PowerShell.


**To provision an HBase Cluster in Contoso-VNet-EU** 

1. From your workstation, open Windows PowerShell ISE.
2. Set the variables at the beginning of the script, and then run the script.

		# create hbase cluster with replication enabled
		
		$azureSubscriptionName = "[AzureSubscriptionName]"
		
		$hbaseClusterName = "Contoso-HBase-EU" # This is the HBase cluster name to be used.
		$hbaseClusterSize = 1   # You must provision a cluster that contains at least 3 nodes for high availability of the HBase services.
		$hadoopUserLogin = "[HadoopUserName]"
		$hadoopUserpw = "[HadoopUserPassword]"
		
		$vNetName = "Contoso-VNet-EU"  # This name must match your Europe virtual network name.
		$subNetName = 'Subnet-1' # This name must match your Europe virtual network subnet name.  The default name is "Subnet-1".
		
		$storageAccountName = 'ContosoStoreEU'  # The script will create this storage account for you.  The storage account name doesn't support hyphens. 
		$storageAccountName = $storageAccountName.ToLower() #Storage account name must be in lower case.
		$blobContainerName = $hbaseClusterName.ToLower()  #Use the cluster name as the default container name.
		
		#connect to your Azure subscription
		Add-AzureAccount 
		Select-AzureSubscription $azureSubscriptionName
		
		# Create a storage account used by the HBase cluster
		$location = Get-AzureVNetSite -VNetName $vNetName | %{$_.Location} # use the virtual network location
		New-AzureStorageAccount -StorageAccountName $storageAccountName -Location $location
		
		# Create a blob container used by the HBase cluster
		$storageAccountKey = Get-AzureStorageKey -StorageAccountName $storageAccountName | %{$_.Primary}
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		New-AzureStorageContainer -Name $blobContainerName -Context $storageContext
		
		# Create provision configuration object
		$hbaseConfigValues = new-object 'Microsoft.WindowsAzure.Management.HDInsight.Cmdlet.DataObjects.AzureHDInsightHBaseConfiguration'
		    
		$hbaseConfigValues.Configuration = @{ "hbase.replication"="true" } #this modifies the hbase-site.xml file
		
		# retrieve vnet id based on vnetname
		$vNetID = Get-AzureVNetSite -VNetName $vNetName | %{$_.id}
		
		$config = New-AzureHDInsightClusterConfig `
		                -ClusterSizeInNodes $hbaseClusterSize `
		                -ClusterType HBase `
		                -VirtualNetworkId $vNetID `
		                -SubnetName $subNetName `
		            | Set-AzureHDInsightDefaultStorage `
		                -StorageAccountName $storageAccountName `
		                -StorageAccountKey $storageAccountKey `
		                -StorageContainerName $blobContainerName `
		            | Add-AzureHDInsightConfigValues `
		                -HBase $hbaseConfigValues
		
		# provision HDInsight cluster
		$hadoopUserPassword = ConvertTo-SecureString -String $hadoopUserpw -AsPlainText -Force     
		$credential = New-Object System.Management.Automation.PSCredential($hadoopUserLogin,$hadoopUserPassword)
		
		$config | New-AzureHDInsightCluster -Name $hbaseClusterName -Location $location -Credential $credential



**To provision an HBase Cluster in Contoso-VNet-US** 

- Use the same script with the following values:

		$hbaseClusterName = "Contoso-HBase-US" # This is the HBase cluster name to be used.
		$vNetName = "Contoso-VNet-US"  # This name must match your Europe virtual network name.
		$storageAccountName = 'ContosoStoreUS'	

	Because you have already connected to your Azure account, you don't need to run the following comlets anymore:

		Add-AzureAccount 
		Select-AzureSubscription $azureSubscriptionName




## Configure DNS conditional forwarder

In [Configure DNS for the virtual networks][hdinsight-hbase-replication-dns], you have configured DNS servers for the two networks. The HBase clusters have different domain suffixes. So you need to configure additional DNS conditional forwarders.

To configure conditional forwarder, you need to know the domain suffixes of the two HBase clusters. 

**To find the domain suffixes of the two HBase clusters**

1. RDP into **Contoso-HBase-EU**.  For instructions, see [Manage Hadoop clusters in HDInsight by using the Azure Classic Portal][hdinsight-manage-portal]. It is actually headnode0 of the cluster.
2. Open a Windows PowerShell console, or a command prompt.
3. Run **ipconfig**, and write down **Connection-specific DNS suffix**.
4. Please don't close the RDP session.  You will need it later to test domain name resolution.
5. Repeat the same steps to find out the **Connection-specific DNS suffix** of **Contoso-HBase-US**.


**To configure DNS forwarders**
 
1.	RDP into **Contoso-DNS-EU**. 
2.	Click the Windows key on the lower left.
2.	Click **Administrative Tools**.
3.	Click **DNS**.
4.	In the left pane, expand **DSN**, **Contoso-DNS-EU**.
5.	Right-click **Conditional Forwarders**, and then click **New Conditional Forwarder**. 
5.	Enter the following information:
	- **DNS Domain**: enter the DNS suffix of the Contoso-HBase-US. For example: Contoso-HBase-US.f5.internal.cloudapp.net.
	- **IP addresses of the master servers**: enter 10.2.0.4, which is the Contoso-DNS-US’s IP address. Please verify the IP. Your DNS server can have a different IP address.
6.	Press **ENTER**, and then click **OK**.  Now you will be able to resolve the Contoso-DNS-US’s IP address from Contoso-DNS-EU.
7.	Repeat the steps to add a DNS conditional forwarder to the DNS service on the Contoso-DNS-US virtual machine with the following values:
	- **DNS Domain**: enter the DNS suffix of the Contoso-HBase-EU. 
	- **IP addresses of the master servers**: enter 10.2.0.4, which is the Contoso-DNS-EU’s IP address.

**To test domain name resolution**

1. Switch to the Contoso-HBase-EU RDP window.
2. Open a command prompt.
3. Run the ping command:

		ping headnode0.[DNS suffix of Contoso-HBase-US]

	The ICM protocol is turned on the worker nodes of the HBase clusters

4. Don't close the RDP session. You will still need it later in the tutorial.
5. Repeat the same steps to ping the headnode0 of the Contoso-HBase-EU from the Contoso-HBase-US.

>[AZURE.IMPORTANT] DNS must work before you can proceed to the next steps.

## Enable replication between HBase tables

Now, you can create a sample HBase table, enable replication, and then test it with some data. The sample table you will use has two column families: Personal and Office. 

In this tutorial, you will make the Europe HBase cluster as the source cluster, and the U.S. HBase cluster as the destination cluster.

Create HBase tables with the same names and column families on both the source and destination clusters, so that the destination cluster knows where to store data it will receive. For more information on using the HBase shell, see [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started].

**To create an HBase table on Contoso-HBase-EU**

1. Switch to the **Contoso-HBase-EU** RDP window.
2. From the desktop, click **Hadoop Command Line**.
2. Change the folder to the HBase home directory:

		cd %HBASE_HOME%\bin
3. Open the HBase shell:

		hbase shell
4. Create an HBase table:

		create 'Contacts', 'Personal', 'Office'
5. Don't close either the RDP session nor the Hadoop Command Line window. You will still need them later in the tutorial.
	
**To create an HBase table on Contoso-HBase-US**

- Repeat the same steps to create the same table on Contoso-HBase-US.


**To add Contoso-HBase-US as a replication peer**

1. Switch to the **Contso-HBase_EU** RDP window.
2. From the HBase shell window, add the destination cluster (Contoso-HBase-US) as a peer, for example:

		add_peer '1', 'zookeeper0.contoso-hbase-us.d4.internal.cloudapp.net,zookeeper1.contoso-hbase-us.d4.internal.cloudapp.net,zookeeper2.contoso-hbase-us.d4.internal.cloudapp.net:2181:/hbase'

	In the sample, the domain suffix is *contoso-hbase-us.d4.internal.cloudapp.net*. You need to update it to match your domain suffix of the US HBase cluster. Make sure there is no spaces between the hostnames.

**To configure each column family to be replicated on the source cluster**

1. From the HBase shell window of the **Contso-HBase-EU** RDP session,  configure each column family to be replicated:

		disable 'Contacts'
		alter 'Contacts', {NAME => 'Personal', REPLICATION_SCOPE => '1'}
		alter 'Contacts', {NAME => 'Office', REPLICATION_SCOPE => '1'}
		enable 'Contacts'

**To bulk upload data to the HBase table**

A sample data file has been uploaded to a public Azure Blob container with the following URL:

		wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt

The content of the file:

		8396	Calvin Raji	230-555-0191	5415 San Gabriel Dr.
		16600	Karen Wu	646-555-0113	9265 La Paz
		4324	Karl Xie	508-555-0163	4912 La Vuelta
		16891	Jonathan Jackson	674-555-0110	40 Ellis St.
		3273	Miguel Miller	397-555-0155	6696 Anchor Drive
		3588	Osarumwense Agbonile	592-555-0152	1873 Lion Circle
		10272	Julia Lee	870-555-0110	3148 Rose Street
		4868	Jose Hayes	599-555-0171	793 Crawford Street
		4761	Caleb Alexander	670-555-0141	4775 Kentucky Dr.
		16443	Terry Chander	998-555-0171	771 Northridge Drive

You can upload the same data file into your HBase cluster and import the data from there.

1. Switch to the **Contoso-HBase-EU** RDP window.
2. From the desktop, click **Hadoop Command Line**.
3. Change the folder to the HBase home directory:

		cd %HBASE_HOME%\bin

4. upload the data:

		hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,Personal:Name, Personal:HomePhone, Office:Address" -Dimporttsv.bulk.output=/tmpOutput Contacts wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt

		hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /tmpOutput Contacts


## Verify that data replication is taking place

You can verify that replication is taking place by scanning the tables from both clusters with the following HBase shell commands:

		Scan 'Contacts'


## Next Steps

In this tutorial, you have learned how to configure HBase replication across two datacenters. To learn more about HDInsight and HBase, see:

- [HDInsight service page](https://azure.microsoft.com/services/hdinsight/)
- [HDInsight documentation](https://azure.microsoft.com/documentation/services/hdinsight/)
- [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started]
- [HDInsight HBase overview][hdinsight-hbase-overview]
- [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]
- [Analyze real-time Twitter sentiment with HBase][hdinsight-hbase-twitter-sentiment]
- [Analyzing sensor data with Storm and HBase in HDInsight (Hadoop)][hdinsight-sensor-data]

[hdinsight-hbase-geo-replication-vnet]: hdinsight-hbase-geo-replication-configure-VNets.md
[hdinsight-hbase-geo-replication-dns]: ../hdinsight-hbase-geo-replication-configure-VNet.md


[img-vnet-diagram]: ./media/hdinsight-hbase-geo-replication/HDInsight.HBase.Replication.Network.diagram.png

[powershell-install]: powershell-install-configure.md
[hdinsight-hbase-get-started]: hdinsight-hbase-tutorial-get-started.md
[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-hbase-replication-vnet]: hdinsight-hbase-geo-replication-configure-VNets.md
[hdinsight-hbase-replication-dns]: hdinsight-hbase-geo-replication-configure-DNS.md
[hdinsight-hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md
[hdinsight-sensor-data]: hdinsight-storm-sensor-data-analysis.md
[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
