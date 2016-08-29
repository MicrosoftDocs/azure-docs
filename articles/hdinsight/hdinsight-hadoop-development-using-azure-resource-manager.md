<properties
	pageTitle="Migrate to Azure Resource Manager development tools for HDInsight clusters | Microsoft Azure"
	description="How to migrate to Azure Resource Manager development tools for HDInsight clusters"
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	authors="nitinme"
	documentationCenter=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/04/2016"
	ms.author="nitinme"/>

# Migrating to Azure Resource Manager-based development tools for HDInsight clusters

HDInsight is deprecating Azure Service Manager (ASM)-based tools for HDInsight. If you have been using Azure PowerShell, Azure CLI, or the HDInsight .NET SDK to work with HDInsight clusters, you are encouraged to use the Azure Resource Manager (ARM)-based versions of PowerShell, CLI, and .NET SDK going forward. This article provides pointers on how to migrate to the new ARM-based approach. Wherever applicable, this article also points out the differences between the ASM and ARM approaches for HDInsight.

>[AZURE.IMPORTANT] The support for ASM based PowerShell, CLI, and .NET SDK will discontinue on **January 1, 2017**.

##Migrating Azure CLI to Azure Resource Manager

The Azure CLI now defaults to Azure Resource Manager (ARM) mode, unless you are upgrading from a previous installation; in this case, you may need to use the `azure config mode arm` command to switch to ARM mode.

The basic commands that the Azure CLI provided to work with HDInsight using Azure Service Management (ASM) are the same when using ARM; however some parameters and switches may have new names, and there are many new parameters available when using ARM. For example, you can now use `azure hdinsight cluster create` to specify the Azure Virtual Network that a cluster should be created in, or Hive and Oozie metastore information.

Basic commands for working with HDInsight through Azure Resource Manager are:

* `azure hdinsight cluster create` - creates a new HDInsight cluster
* `azure hdinsight cluster delete` - deletes an existing HDInsight cluster
* `azure hdinsight cluster show` - display information about an existing cluster
* `azure hdinsight cluster list` - lists HDInsight clusters for your Azure subscription

Use the `-h` switch to inspect the parameters and switches available for each command.

###New commands

New commands available with Azure Resource Manager are:

* `azure hdinsight cluster resize` - dynamically changes the number of worker nodes in the cluster
* `azure hdinsight cluster enable-http-access` - enables HTTPs access to the cluster (on by default)
* `azure hdinsight cluster disable-http-access` - disables HTTPs access to the cluster
* `azure hdinsight-enable-rdp-access` - enables Remote Desktop Protocol on a Windows-based HDInsight cluster
* `azure hdinsight-disable-rdp-access` - disables Remote Desktop Protocol on a Windows-based HDInsight cluster
* `azure hdinsight script-action` - provides commands for creating/managing Script Actions on a cluster
* `azure hdinsight config` - provides commands for creating a configuration file that can be used with the `hdinsight cluster create` command to provide configuration information.

###Deprecated commands

If you use the `azure hdinsight job` commands to submit jobs to your HDInsight cluster, these are not available through the ARM commands. If you need to programmatically submit jobs to HDInsight from scripts, you should instead use the REST APIs provided by HDInsight. For more information on submitting jobs using REST APIs, see the following documents.

* [Run MapReduce jobs with Hadoop on HDInsight using cURL](hdinsight-hadoop-use-mapreduce-curl.md)
* [Run Hive queries with Hadoop on HDInsight using cURL](hdinsight-hadoop-use-hive-curl.md)
* [Run Pig jobs with Hadoop on HDInsight using cURL](hdinsight-hadoop-use-pig-curl.md)

For information on other ways to run MapReduce, Hive, and Pig interactively, see [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md), [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md), and [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md).

###Examples

__Creating a cluster__

* Old command (ASM) - `azure hdinsight cluster create myhdicluster --location northeurope --osType linux --storageAccountName mystorage --storageAccountKey <storagekey> --storageContainer mycontainer --userName admin --password mypassword --sshUserName sshuser --sshPassword mypassword`
* New command (ARM) - `azure hdinsight cluster create myhdicluster -g myresourcegroup --location northeurope --osType linux --clusterType hadoop --defaultStorageAccountName mystorage --defaultStorageAccountKey <storagekey> --defaultStorageContainer mycontainer --userName admin -password mypassword --sshUserName sshuser --sshPassword mypassword`

__Deleting a cluster__

* Old command (ASM) - `azure hdinsight cluster delete myhdicluster`
* New command (ARM) - `azure hdinsight cluster delete mycluster -g myresourcegroup`

__List clusters__

* Old command (ASM) - `azure hdinsight cluster list`
* New command (ARM) - `azure hdinsight cluster list`

> [AZURE.NOTE] For the list command, specifying the resource group using `-g` will return only the clusters in the specified resource group.

__Show cluster information__

* Old command (ASM) - `azure hdinsight cluster show myhdicluster`
* New command (ARM) - `azure hdinsight cluster show myhdicluster -g myresourcegroup`


##Migrating Azure PowerShell to Azure Resource Manager

The general information about Azure PowerShell in the Azure Resource Manager (ARM) mode can be found at [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).

The Azure PowerShell ARM cmdlets can be installed side-by-side with the ASM cmdlets. The cmdlets from the two modes can be distinguished by their names.  The ARM mode has *AzureRmHDInsight* in the cmdlet names comparing to *AzureHDInsight* in the ASM mode.  For example, *New-AzureRmHDInsightCluster* vs. *New-AzureHDInsightCluster*. Parameters and switches may have news names, and there are many new parameters available when using ARM.  For example, several cmdlets require a new switch called *-ResourceGroupName*. 

Before you can use the HDInsight cmdlets, you must connect to your Azure account, and create a new resource group:

- Login-AzureRmAccount or [Select-AzureRmProfile](https://msdn.microsoft.com/library/mt619310.aspx). See [Authenticating a service principal with Azure Resource Manager](../resource-group-authenticate-service-principal.md)
- [New-AzureRmResourceGroup](https://msdn.microsoft.com/library/mt603739.aspx)

###Renamed cmdlets

To list the HDInsight ASM cmdlets in Windows PowerShell console:

    help *azurermhdinsight*

The following table lists the ASM cmdlets and their names in the ARM mode:

|ASM cmdlets|ARM cmdlets|
|------|------|
| Add-AzureHDInsightConfigValues | [Add-AzureRmHDInsightConfigValues](https://msdn.microsoft.com/library/mt603530.aspx)|
| Add-AzureHDInsightMetastore |[Add-AzureRmHDInsightMetastore](https://msdn.microsoft.com/library/mt603670.aspx)|
| Add-AzureHDInsightScriptAction |[Add-AzureRmHDInsightScriptAction](https://msdn.microsoft.com/library/mt603527.aspx)|
| Add-AzureHDInsightStorage |[Add-AzureRmHDInsightStorage](https://msdn.microsoft.com/library/mt619445.aspx)|
| Get-AzureHDInsightCluster |[Get-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619371.aspx)|
| Get-AzureHDInsightJob |[Get-AzureRmHDInsightJob](https://msdn.microsoft.com/library/mt603590.aspx)|
| Get-AzureHDInsightJobOutput |[Get-AzureRmHDInsightJobOutput](https://msdn.microsoft.com/library/mt603793.aspx)|
| Get-AzureHDInsightProperties |[Get-AzureRmHDInsightProperties](https://msdn.microsoft.com/library/mt603546.aspx) |
| Grant-AzureHDInsightHttpServicesAccess | [Grant-AzureRmHDInsightHttpServicesAccess](https://msdn.microsoft.com/library/mt619407.aspx)|
| Grant-AzureHdinsightRdpAccess |[Grant-AzureRmHDInsightRdpServicesAccess](https://msdn.microsoft.com/library/mt603717.aspx)|
| Invoke-AzureHDInsightHiveJob |[Invoke-AzureRmHDInsightHiveJob](https://msdn.microsoft.com/library/mt603593.aspx)|
| New-AzureHDInsightCluster | [New-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619331.aspx)|
| New-AzureHDInsightClusterConfig |[New-AzureRmHDInsightClusterConfig](https://msdn.microsoft.com/library/mt603700.aspx)|
| New-AzureHDInsightHiveJobDefinition |[New-AzureRmHDInsightHiveJobDefinition](https://msdn.microsoft.com/library/mt619448.aspx)|
| New-AzureHDInsightMapReduceJobDefinition |[New-AzureRmHDInsightMapReduceJobDefinition](https://msdn.microsoft.com/library/mt603626.aspx)|
| New-AzureHDInsightPigJobDefinition |[New-AzureRmHDInsightPigJobDefinition](https://msdn.microsoft.com/library/mt603671.aspx)|
| New-AzureHDInsightSqoopJobDefinition |[New-AzureRmHDInsightSqoopJobDefinition](https://msdn.microsoft.com/library/mt608551.aspx)|
| New-AzureHDInsightStreamingMapReduceJobDefinition |[New-AzureRmHDInsightStreamingMapReduceJobDefinition](https://msdn.microsoft.com/library/mt603626.aspx)|
| Remove-AzureHDInsightCluster |[Remove-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619431.aspx)|
| Revoke-AzureHDInsightHttpServicesAccess |[Revoke-AzureRmHDInsightHttpServicesAccess](https://msdn.microsoft.com/library/mt619375.aspx)|
| Revoke-AzureHdinsightRdpAccess |[Revoke-AzureRmHDInsightRdpServicesAccess](https://msdn.microsoft.com/library/mt603523.aspx)|
| Set-AzureHDInsightClusterSize |[Set-AzureRmHDInsightClusterSize](https://msdn.microsoft.com/library/mt603513.aspx)|
| Set-AzureHDInsightDefaultStorage |[Set-AzureRmHDInsightDefaultStorage](https://msdn.microsoft.com/library/mt603486.aspx)|
| Start-AzureHDInsightJob |[Start-AzureRmHDInsightJob](https://msdn.microsoft.com/library/mt603798.aspx)|
| Stop-AzureHDInsightJob |[Stop-AzureRmHDInsightJob](https://msdn.microsoft.com/library/mt619424.aspx)|
| Use-AzureHDInsightCluster |[Use-AzureRmHDInsightCluster](https://msdn.microsoft.com/library/mt619442.aspx)|
| Wait-AzureHDInsightJob |[Wait-AzureRmHDInsightJob](https://msdn.microsoft.com/library/mt603834.aspx)|

###New cmdlets
The following are the new cmdlets that are only available in the ARM mode. 

**Script action related cmdlets:**
- **Get-AzureRmHDInsightPersistedScriptAction**: Gets the persisted script actions for a cluster and lists them in chronological order, or gets details for a specified persisted script action. 
- **Get-AzureRmHDInsightScriptActionHistory**: Gets the script action history for a cluster and lists it in reverse chronological order, or gets details of a previously executed script action. 
- **Remove-AzureRmHDInsightPersistedScriptAction**: Removes a persisted script action from an HDInsight cluster.
- **Set-AzureRmHDInsightPersistedScriptAction**: Sets a previously executed script action to be a persisted script action.
- **Submit-AzureRmHDInsightScriptAction**: Submits a new script action to an Azure HDInsight cluster. 

For additional usage information, see [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

**Clsuter identity related cmdlets:**

- **Add-AzureRmHDInsightClusterIdentity**: Adds a cluster identity to a cluster configuration object so that the HDInsight cluster can access Azure Data Lake Stores. See [Create an HDInsight cluster with Data Lake Store using Azure PowerShell](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md).

### Examples

**Create cluster**

Old command (ASM): 

    New-AzureHDInsightCluster `
        -Name $clusterName `
        -Location $location `
        -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" `
        -DefaultStorageAccountKey $storageAccountKey `
        -DefaultStorageContainerName $containerName `
        -ClusterSizeInNodes 2 `
        -ClusterType Hadoop `
        -OSType Linux `
        -Version "3.2" `
        -Credential $httpCredential `
        -SshCredential $sshCredential

New command (ARM):

    New-AzureRmHDInsightCluster `
        -ClusterName $clusterName `
        -ResourceGroupName $resourceGroupName `
        -Location $location `
        -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" `
        -DefaultStorageAccountKey $storageAccountKey `
        -DefaultStorageContainer $containerName  `
        -ClusterSizeInNodes 2 `
        -ClusterType Hadoop `
        -OSType Linux `
        -Version "3.2" `
        -HttpCredential $httpcredentials `
        -SshCredential $sshCredentials

 
**Delete cluster**

Old command (ASM):

    Remove-AzureHDInsightCluster -name $clusterName 

New command (ARM):

    Remove-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -ClusterName $clusterName 
                
**List cluster**

Old command (ASM):

    Get-AzureHDInsightCluster
                
New command (ARM):

    Get-AzureRmHDInsightCluster 

**Show cluster**

Old command (ASM):

    Get-AzureHDInsightCluster -Name $clusterName
                
New command (ARM):

    Get-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -clusterName $clusterName


####Other samples

- [Create HDInsight clusters](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
- [Submit Hive jobs](hdinsight-hadoop-use-hive-powershell.md)
- [Submit Pig jobs](hdinsight-hadoop-use-pig-powershell.md)
- [Submit Sqoop jobs](hdinsight-hadoop-use-sqoop-powershell.md)



##Migrating to the ARM-based HDInsight .NET SDK

The Azure Service Management-based [(ASM) HDInsight .NET SDK](https://msdn.microsoft.com/library/azure/mt416619.aspx) is now deprecated. You are encouraged to use the Azure Resource Management-based [(ARM) HDInsight .NET SDK](https://msdn.microsoft.com/library/azure/mt271028.aspx). The following ASM-based HDInsight packages are being deprecated.

* `Microsoft.WindowsAzure.Management.HDInsight`
* `Microsoft.Hadoop.Client`
 

This section provides pointers to more information on how to perform certain tasks using the ARM-based SDK.

| How to... using the ARM-based HDInsight SDK | Links |
| ------------------- | --------------- |
| Create HDInsight clusters using .NET SDK| See [Create HDInsight clusters using .NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md)|
| Customize a cluster using Script Action with .NET SDK | See [Customize HDInsight Linux clusters using Script Action](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md#use-script-action) |
| Authenticate applications interactively using Azure Active Directory with .NET SDK| See [Run Hive queries using .NET SDK](hdinsight-hadoop-use-hive-dotnet-sdk.md). The code snippet in this article uses the interactive authentication approach.|
| Authenticate applications non-interactively using Azure Active Directory with .NET SDK | See [Create non-interactive applications for HDInsight](hdinsight-create-non-interactive-authentication-dotnet-applications.md) |
| Submit a Hive job using .NET SDK| See [Submit Hive jobs](hdinsight-hadoop-use-hive-dotnet-sdk.md) |
| Submit a Pig job using .NET SDK | See [Submit Pig jobs](hdinsight-hadoop-use-pig-dotnet-sdk.md)|
| Submit a Sqoop job using .NET SDK | See [Submit Sqoop jobs](hdinsight-hadoop-use-sqoop-dotnet-sdk.md) |
| List HDInsight clusters using .NET SDK | See [List HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#list-clusters) |
| Scale HDInsight clusters using .NET SDK | See [Scale HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#scale-clusters) |
| Grant/revoke access to HDInsight clusters using .NET SDK | See [Grant/revoke access to HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#grantrevoke-access) |
| Update HTTP user credentials for HDInsight clusters using .NET SDK | See [Update HTTP user credentials for HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#update-http-user-credentials) |
| Find the default storage account for HDInsight clusters using .NET SDK | See [Find the default storage account for HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#find-the-default-storage-account) |
| Delete HDInsight clusters using .NET SDK | See [Delete HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#delete-clusters) |

### Examples

Following are some examples on how an operation is performed using the ASM-based SDK and the equivalent code snippet for the ARM-based SDK.

**Creating a cluster CRUD client**

* Old command (ASM)

		//Certificate auth
		//This logs the application in using a subscription administration certificate, which is not offered in Azure Resource Manager (ARM)
	 
		const string subid = "454467d4-60ca-4dfd-a556-216eeeeeeee1";
		var cred = new HDInsightCertificateCredential(new Guid(subid), new X509Certificate2(@"path\to\certificate.cer"));
		var client = HDInsightClient.Connect(cred);

* New command (ARM) (Service principal authorization)

		//Service principal auth
		//This will log the application in as itself, rather than on behalf of a specific user.
		//For details, including how to set up the application, see:
		//   https://azure.microsoft.com/en-us/documentation/articles/hdinsight-create-non-interactive-authentication-dotnet-applications/
		 
		var authFactory = new AuthenticationFactory();
		 
		var account = new AzureAccount { Type = AzureAccount.AccountType.ServicePrincipal, Id = clientId };
		 
		var env = AzureEnvironment.PublicEnvironments[EnvironmentName.AzureCloud];
		 
		var accessToken = authFactory.Authenticate(account, env, tenantId, secretKey, ShowDialog.Never).AccessToken;
		 
		var creds = new TokenCloudCredentials(subId.ToString(), accessToken);
		 
		_hdiManagementClient = new HDInsightManagementClient(creds);

* New command (ARM) (User authorization)

		//User auth
		//This will log the application in on behalf of the user.
		//The end-user will see a login popup.
		 
		var authFactory = new AuthenticationFactory();
		 
		var account = new AzureAccount { Type = AzureAccount.AccountType.User, Id = username };
		 
		var env = AzureEnvironment.PublicEnvironments[EnvironmentName.AzureCloud];
		 
		var accessToken = authFactory.Authenticate(account, env, AuthenticationFactory.CommonAdTenant, password, ShowDialog.Auto).AccessToken;
		 
		var creds = new TokenCloudCredentials(subId.ToString(), accessToken);
		 
		_hdiManagementClient = new HDInsightManagementClient(creds);


**Creating a cluster**

* Old command (ASM)

		var clusterInfo = new ClusterCreateParameters
                    {
                        Name = dnsName,
                        DefaultStorageAccountKey = key,
                        DefaultStorageContainer = defaultStorageContainer,
                        DefaultStorageAccountName = storageAccountDnsName,
                        ClusterSizeInNodes = 1,
                        ClusterType = type,
                        Location = "West US",
                        UserName = "admin",
                        Password = "*******",
                        Version = version,
                        HeadNodeSize = NodeVMSize.Large,
                    };
		clusterInfo.CoreConfiguration.Add(new KeyValuePair<string, string>("config1", "value1"));
		client.CreateCluster(clusterInfo);


* New command (ARM)

		var clusterCreateParameters = new ClusterCreateParameters
            {
                Location = "West US",
                ClusterType = "Hadoop",
                Version = "3.1",
                OSType = OSType.Windows,
                DefaultStorageAccountName = "mystorage.blob.core.windows.net",
                DefaultStorageAccountKey =
                    "O9EQvp3A3AjXq/W27rst1GQfLllhp0gUeiUUn2D8zX2lU3taiXSSfqkZlcPv+nQcYUxYw==",
                UserName = "hadoopuser",
                Password = "*******",
                HeadNodeSize = "ExtraLarge",
                RdpUsername = "hdirp",
                RdpPassword = ""*******",
                RdpAccessExpiry = new DateTime(2025, 3, 1),
                ClusterSizeInNodes = 5
            };
        var coreConfigs = new Dictionary<string, string> {{"config1", "value1"}};
        clusterCreateParameters.Configurations.Add(ConfigurationKey.CoreSite, coreConfigs);


**Enabling HTTP access**

* Old command (ASM)

		client.EnableHttp(dnsName, "West US", "admin", "*******");

* New command (ARM)

		var httpParams = new HttpSettingsParameters
		{
		       HttpUserEnabled = true,
		       HttpUsername = "admin",
		       HttpPassword = "*******",
		};
		client.Clusters.ConfigureHttpSettings(resourceGroup, dnsname, httpParams);

**Deleting a cluster**

* Old command (ASM)

		client.DeleteCluster(dnsName);

* New command (ARM)

		client.Clusters.Delete(resourceGroup, dnsname);




