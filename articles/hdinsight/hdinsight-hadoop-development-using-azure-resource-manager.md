---
title: Migrate to Azure Resource Manager tools for HDInsight 
description: How to migrate to Azure Resource Manager development tools for HDInsight clusters
services: hdinsight
ms.reviewer: jasonh
author: jasonwhowell

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/21/2018
ms.author: jasonh

---
# Migrating to Azure Resource Manager-based development tools for HDInsight clusters

HDInsight is deprecating Azure Service Manager (ASM)-based tools for HDInsight. If you have been using Azure PowerShell, Azure Classic CLI, or the HDInsight .NET SDK to work with HDInsight clusters, you are encouraged to use the Azure Resource Manager versions of PowerShell, CLI, and .NET SDK going forward. This article provides pointers on how to migrate to the new Resource Manager-based approach. Wherever applicable, this document highlights the differences between the ASM and Resource Manager approaches for HDInsight.

> [!IMPORTANT]
> The support for ASM based PowerShell, CLI, and .NET SDK will discontinue on **January 1, 2017**.
> 
> 

## Migrating Azure Classic CLI to Azure Resource Manager

> [!IMPORTANT]
> Azure CLI does not provide support for working with HDInsight clusters. You can still use Azure Classic CLI with HDInsight, however Azure Classic CLI is deprecated.

The following are the basic commands for working with HDInsight through Azure CLassic CLI:

* `azure hdinsight cluster create` - creates a new HDInsight cluster
* `azure hdinsight cluster delete` - deletes an existing HDInsight cluster
* `azure hdinsight cluster show` - display information about an existing cluster
* `azure hdinsight cluster list` - lists HDInsight clusters for your Azure subscription

Use the `-h` switch to inspect the parameters and switches available for each command.

### New commands
New commands available with Azure Resource Manager are:

* `azure hdinsight cluster resize` - dynamically changes the number of worker nodes in the cluster
* `azure hdinsight cluster enable-http-access` - enables HTTPs access to the cluster (on by default)
* `azure hdinsight cluster disable-http-access` - disables HTTPs access to the cluster
* `azure hdinsight script-action` - provides commands for creating/managing Script Actions on a cluster
* `azure hdinsight config` - provides commands for creating a configuration file that can be used with the `hdinsight cluster create` command to provide configuration information.

### Deprecated commands
If you use the `azure hdinsight job` commands to submit jobs to your HDInsight cluster, these commands are not available through the Resource Manager commands. If you need to programmatically submit jobs to HDInsight from scripts, you should instead use the REST APIs provided by HDInsight. For more information on submitting jobs using REST APIs, see the following documents.

* [Run MapReduce jobs with Hadoop on HDInsight using cURL](hadoop/apache-hadoop-use-mapreduce-curl.md)
* [Run Hive queries with Hadoop on HDInsight using cURL](hadoop/apache-hadoop-use-hive-curl.md)
* [Run Pig jobs with Hadoop on HDInsight using cURL](hadoop/apache-hadoop-use-pig-curl.md)

For information on other ways to run MapReduce, Hive, and Pig interactively, see [Use MapReduce with Hadoop on HDInsight](hadoop/hdinsight-use-mapreduce.md), [Use Hive with Hadoop on HDInsight](hadoop/hdinsight-use-hive.md), and [Use Pig with Hadoop on HDInsight](hadoop/hdinsight-use-pig.md).

### Examples
**Creating a cluster**

* Old command (ASM) - `azure hdinsight cluster create myhdicluster --location northeurope --osType linux --storageAccountName mystorage --storageAccountKey <storagekey> --storageContainer mycontainer --userName admin --password mypassword --sshUserName sshuser --sshPassword mypassword`
* New command - `azure hdinsight cluster create myhdicluster -g myresourcegroup --location northeurope --osType linux --clusterType hadoop --defaultStorageAccountName mystorage --defaultStorageAccountKey <storagekey> --defaultStorageContainer mycontainer --userName admin -password mypassword --sshUserName sshuser --sshPassword mypassword`

**Deleting a cluster**

* Old command (ASM) - `azure hdinsight cluster delete myhdicluster`
* New command - `azure hdinsight cluster delete mycluster -g myresourcegroup`

**List clusters**

* Old command (ASM) - `azure hdinsight cluster list`
* New command - `azure hdinsight cluster list`

> [!NOTE]
> For the list command, specifying the resource group using `-g` will return only the clusters in the specified resource group.
> 
> 

**Show cluster information**

* Old command (ASM) - `azure hdinsight cluster show myhdicluster`
* New command - `azure hdinsight cluster show myhdicluster -g myresourcegroup`

## Migrating Azure PowerShell to Azure Resource Manager
The general information about Azure PowerShell in the Azure Resource Manager mode can be found at [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).

The Azure PowerShell Resource Manager cmdlets can be installed side by side with the ASM cmdlets. The cmdlets from the two modes can be distinguished by their names.  The Resource Manager mode has *AzureRmHDInsight* in the cmdlet names comparing to *AzureHDInsight* in the ASM mode.  For example, *New-AzureRmHDInsightCluster* vs. *New-AzureHDInsightCluster*. Parameters and switches may have news names, and there are many new parameters available when using Resource Manager.  For example, several cmdlets require a new switch called *-ResourceGroupName*. 

Before you can use the HDInsight cmdlets, you must connect to your Azure account, and create a new resource group:

* Connect-AzureRmAccount or [Select-AzureRmProfile](https://docs.microsoft.com/powershell/module/servicemanagement/azurerm.profile/select-azurermprofile?view=azuresmps-4.0.0). See [Authenticating a service principal with Azure Resource Manager](../azure-resource-manager/resource-group-authenticate-service-principal.md)
* [New-AzureRmResourceGroup](https://msdn.microsoft.com/library/mt603739.aspx)

### Renamed cmdlets
To list the HDInsight ASM cmdlets in Windows PowerShell console:

    help *azurermhdinsight*

The following table lists the ASM cmdlets and their names in Resource Manager mode:

| ASM cmdlets | Resource Manager cmdlets |
| --- | --- |
| Add-AzureHDInsightConfigValues |[Add-AzureRmHDInsightConfigValues](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/add-azurermhdinsightconfigvalues?view=azurermps-6.6.0) |
| Add-AzureHDInsightMetastore |[Add-AzureRmHDInsightMetastore](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/add-azurermhdinsightmetastore?view=azurermps-6.6.0) |
| Add-AzureHDInsightScriptAction |[Add-AzureRmHDInsightScriptAction](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/add-azurermhdinsightscriptaction?view=azurermps-6.6.0) |
| Add-AzureHDInsightStorage |[Add-AzureRmHDInsightStorage](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/add-azurermhdinsightstorage?view=azurermps-6.6.0) |
| Get-AzureHDInsightCluster |[Get-AzureRmHDInsightCluster](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/get-azurermhdinsightcluster?view=azurermps-6.6.0) |
| Get-AzureHDInsightJob |[Get-AzureRmHDInsightJob](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/get-azurermhdinsightjob?view=azurermps-6.6.0) |
| Get-AzureHDInsightJobOutput |[Get-AzureRmHDInsightJobOutput](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/get-azurermhdinsightjoboutput?view=azurermps-6.6.0) |
| Get-AzureHDInsightProperties |[Get-AzureRmHDInsightProperties](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/get-azurermhdinsightproperties?view=azurermps-6.6.0) |
| Grant-AzureHDInsightHttpServicesAccess |[Grant-AzureRmHDInsightHttpServicesAccess](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/grant-azurermhdinsighthttpservicesaccess?view=azurermps-6.6.0) |
| Grant-AzureHdinsightRdpAccess |[Grant-AzureRmHDInsightRdpServicesAccess](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/grant-azurermhdinsightrdpservicesaccess?view=azurermps-6.6.0) |
| Invoke-AzureHDInsightHiveJob |[Invoke-AzureRmHDInsightHiveJob](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/invoke-azurermhdinsighthivejob?view=azurermps-6.6.0) |
| New-AzureHDInsightCluster |[New-AzureRmHDInsightCluster](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsightcluster) |
| New-AzureHDInsightClusterConfig |[New-AzureRmHDInsightClusterConfig](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsightclusterconfig?view=azurermps-6.6.0) |
| New-AzureHDInsightHiveJobDefinition |[New-AzureRmHDInsightHiveJobDefinition](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsighthivejobdefinition?view=azurermps-6.6.0) |
| New-AzureHDInsightMapReduceJobDefinition |[New-AzureRmHDInsightMapReduceJobDefinition](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsightmapreducejobdefinition?view=azurermps-6.6.0) |
| New-AzureHDInsightPigJobDefinition |[New-AzureRmHDInsightPigJobDefinition](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsightpigjobdefinition?view=azurermps-6.6.0) |
| New-AzureHDInsightSqoopJobDefinition |[New-AzureRmHDInsightSqoopJobDefinition](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsightsqoopjobdefinition?view=azurermps-6.6.0) |
| New-AzureHDInsightStreamingMapReduceJobDefinition |[New-AzureRmHDInsightStreamingMapReduceJobDefinition](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/new-azurermhdinsightstreamingmapreducejobdefinition?view=azurermps-6.6.0) |
| Remove-AzureHDInsightCluster |[Remove-AzureRmHDInsightCluster](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/remove-azurermhdinsightcluster?view=azurermps-6.6.0) |
| Revoke-AzureHDInsightHttpServicesAccess |[Revoke-AzureRmHDInsightHttpServicesAccess](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/revoke-azurermhdinsighthttpservicesaccess?view=azurermps-6.6.0) |
| Revoke-AzureHdinsightRdpAccess |[Revoke-AzureRmHDInsightRdpServicesAccess](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/revoke-azurermhdinsightrdpservicesaccess?view=azurermps-6.6.0) |
| Set-AzureHDInsightClusterSize |[Set-AzureRmHDInsightClusterSize](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/set-azurermhdinsightclustersize?view=azurermps-6.6.0) |
| Set-AzureHDInsightDefaultStorage |[Set-AzureRmHDInsightDefaultStorage](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/set-azurermhdinsightdefaultstorage?view=azurermps-6.6.0) |
| Start-AzureHDInsightJob |[Start-AzureRmHDInsightJob](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/start-azurermhdinsightjob?view=azurermps-6.6.0) |
| Stop-AzureHDInsightJob |[Stop-AzureRmHDInsightJob](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/stop-azurermhdinsightjob?view=azurermps-6.6.0) |
| Use-AzureHDInsightCluster |[Use-AzureRmHDInsightCluster](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/use-azurermhdinsightcluster?view=azurermps-6.6.0) |
| Wait-AzureHDInsightJob |[Wait-AzureRmHDInsightJob](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/wait-azurermhdinsightjob?view=azurermps-6.6.0) |

### New cmdlets
The following are the new cmdlets that are only available in Resource Manager mode. 

**Script action-related cmdlets:**

* **Get-AzureRmHDInsightPersistedScriptAction**: Gets the persisted script actions for a cluster and lists them in chronological order, or gets details for a specified persisted script action. 
* **Get-AzureRmHDInsightScriptActionHistory**: Gets the script action history for a cluster and lists it in reverse chronological order, or gets details of a previously executed script action. 
* **Remove-AzureRmHDInsightPersistedScriptAction**: Removes a persisted script action from an HDInsight cluster.
* **Set-AzureRmHDInsightPersistedScriptAction**: Sets a previously executed script action to be a persisted script action.
* **Submit-AzureRmHDInsightScriptAction**: Submits a new script action to an Azure HDInsight cluster. 

For additional usage information, see [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

**Cluster identity-related cmdlets:**

* **Add-AzureRmHDInsightClusterIdentity**: Adds a cluster identity to a cluster configuration object so that the HDInsight cluster can access Azure Data Lake Stores. See [Create an HDInsight cluster with Data Lake Store using Azure PowerShell](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md).

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

New command:

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

New command:

    Remove-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -ClusterName $clusterName 

**List cluster**

Old command (ASM):

    Get-AzureHDInsightCluster

New command:

    Get-AzureRmHDInsightCluster 

**Show cluster**

Old command (ASM):

    Get-AzureHDInsightCluster -Name $clusterName

New command:

    Get-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -clusterName $clusterName


#### Other samples
* [Create HDInsight clusters](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
* [Submit Hive jobs](hadoop/apache-hadoop-use-hive-powershell.md)
* [Submit Pig jobs](hadoop/apache-hadoop-use-pig-powershell.md)
* [Submit Sqoop jobs](hadoop/apache-hadoop-use-sqoop-powershell.md)

## Migrating to the new HDInsight .NET SDK
The Azure Service Management-based [(ASM) HDInsight .NET SDK](https://msdn.microsoft.com/library/azure/mt416619.aspx) is now deprecated. You are encouraged to use the Azure Resource Management-based [Resource Manager-based HDInsight .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight). The following ASM-based HDInsight packages are being deprecated.

* `Microsoft.WindowsAzure.Management.HDInsight`
* `Microsoft.Hadoop.Client`

This section provides pointers to more information on how to perform certain tasks using the Resource Manager-based SDK.

| How to... using the Resource Manager-based HDInsight SDK | Links |
| --- | --- |
| Create HDInsight clusters using .NET SDK |See [Create HDInsight clusters using .NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md) |
| Customize a cluster using Script Action with .NET SDK |See [Customize HDInsight Linux clusters using Script Action](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md#use-script-action) |
| Authenticate applications interactively using Azure Active Directory with .NET SDK |See [Run Hive queries using .NET SDK](hadoop/apache-hadoop-use-hive-dotnet-sdk.md). The code snippet in this article uses the interactive authentication approach. |
| Authenticate applications non-interactively using Azure Active Directory with .NET SDK |See [Create non-interactive applications for HDInsight](hdinsight-create-non-interactive-authentication-dotnet-applications.md) |
| Submit a Hive job using .NET SDK |See [Submit Hive jobs](hadoop/apache-hadoop-use-hive-dotnet-sdk.md) |
| Submit a Pig job using .NET SDK |See [Submit Pig jobs](hadoop/apache-hadoop-use-pig-dotnet-sdk.md) |
| Submit a Sqoop job using .NET SDK |See [Submit Sqoop jobs](hadoop/apache-hadoop-use-sqoop-dotnet-sdk.md) |
| List HDInsight clusters using .NET SDK |See [List HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#list-clusters) |
| Scale HDInsight clusters using .NET SDK |See [Scale HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#scale-clusters) |
| Grant/revoke access to HDInsight clusters using .NET SDK |See [Grant/revoke access to HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#grantrevoke-access) |
| Update HTTP user credentials for HDInsight clusters using .NET SDK |See [Update HTTP user credentials for HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#update-http-user-credentials) |
| Find the default storage account for HDInsight clusters using .NET SDK |See [Find the default storage account for HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#find-the-default-storage-account) |
| Delete HDInsight clusters using .NET SDK |See [Delete HDInsight clusters](hdinsight-administer-use-dotnet-sdk.md#delete-clusters) |

### Examples
Following are some examples on how an operation is performed using the ASM-based SDK and the equivalent code snippet for the Resource Manager-based SDK.

**Creating a cluster CRUD client**

* Old command (ASM)
  
        //Certificate auth
        //This logs the application in using a subscription administration certificate, which is not offered in Azure Resource Manager
  
        const string subid = "454467d4-60ca-4dfd-a556-216eeeeeeee1";
        var cred = new HDInsightCertificateCredential(new Guid(subid), new X509Certificate2(@"path\to\certificate.cer"));
        var client = HDInsightClient.Connect(cred);
* New command (Service principal authorization)
  
        //Service principal auth
        //This will log the application in as itself, rather than on behalf of a specific user.
        //For details, including how to set up the application, see:
        //   https://azure.microsoft.com/documentation/articles/hdinsight-create-non-interactive-authentication-dotnet-applications/
  
        var authFactory = new AuthenticationFactory();
  
        var account = new AzureAccount { Type = AzureAccount.AccountType.ServicePrincipal, Id = clientId };
  
        var env = AzureEnvironment.PublicEnvironments[EnvironmentName.AzureCloud];
  
        var accessToken = authFactory.Authenticate(account, env, tenantId, secretKey, ShowDialog.Never).AccessToken;
  
        var creds = new TokenCloudCredentials(subId.ToString(), accessToken);
  
        _hdiManagementClient = new HDInsightManagementClient(creds);
* New command (User authorization)
  
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
* New command
  
        var clusterCreateParameters = new ClusterCreateParameters
            {
                Location = "West US",
                ClusterType = "Hadoop",
                Version = "3.1",
                OSType = OSType.Linux,
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
* New command
  
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
* New command
  
        client.Clusters.Delete(resourceGroup, dnsname);

