---
title: Migrate to Azure Resource Manager tools for HDInsight 
description: How to migrate to Azure Resource Manager development tools for HDInsight clusters
ms.reviewer: jasonh
author: hrasheed-msft

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/21/2018
ms.author: hrasheed

---
# Migrating to Azure Resource Manager-based development tools for HDInsight clusters

HDInsight is deprecating Azure Service Manager (ASM)-based tools for HDInsight. If you have been using Azure PowerShell, Azure Classic CLI, or the HDInsight .NET SDK to work with HDInsight clusters, you are encouraged to use the Azure Resource Manager versions of PowerShell, CLI, and .NET SDK going forward. This article provides pointers on how to migrate to the new Resource Manager-based approach. Wherever applicable, this document highlights the differences between the ASM and Resource Manager approaches for HDInsight.

> [!IMPORTANT]  
> The support for ASM based PowerShell, CLI, and .NET SDK will discontinue on **January 1, 2017**.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

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
* [Run Apache Hive queries with Apache Hadoop on HDInsight using cURL](hadoop/apache-hadoop-use-hive-curl.md)


For information on other ways to run Apache Hadoop MapReduce, Apache Hive, and Apache Pig interactively, see [Use MapReduce with Hadoop on HDInsight](hadoop/hdinsight-use-mapreduce.md), [Use Apache Hive with Apache Hadoop on HDInsight](hadoop/hdinsight-use-hive.md), and [Use Apache Pig with Apache Hadoop on HDInsight](hadoop/hdinsight-use-pig.md).

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

**Show cluster information**

* Old command (ASM) - `azure hdinsight cluster show myhdicluster`
* New command - `azure hdinsight cluster show myhdicluster -g myresourcegroup`

## Migrating Azure PowerShell to Azure Resource Manager
The general information about Azure PowerShell in the Azure Resource Manager mode can be found at [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).

The Azure PowerShell Resource Manager cmdlets can be installed side by side with the ASM cmdlets. The cmdlets from the two modes can be distinguished by their names.  The Resource Manager mode has *AzHDInsight* in the cmdlet names comparing to *AzureHDInsight* in the ASM mode.  For example, *New-AzHDInsightCluster* vs. *New-AzureHDInsightCluster*. Parameters and switches may have news names, and there are many new parameters available when using Resource Manager.  For example, several cmdlets require a new switch called *-ResourceGroupName*. 

Before you can use the HDInsight cmdlets, you must connect to your Azure account, and create a new resource group:

* [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount)
* [New-AzResourceGroup](https://msdn.microsoft.com/library/mt603739.aspx)

### Renamed cmdlets
To list the HDInsight ASM cmdlets in Windows PowerShell console:

    help *azurehdinsight*

The following table lists the ASM cmdlets and their names in Resource Manager mode:

| ASM cmdlets | Resource Manager cmdlets |
| --- | --- |
| Add-AzureHDInsightConfigValue |[Add-AzHDInsightConfigValue](https://docs.microsoft.com/powershell/module/az.hdinsight/add-azhdinsightconfigvalue) |
| Add-AzureHDInsightMetastore |[Add-AzHDInsightMetastore](https://docs.microsoft.com/powershell/module/az.hdinsight/add-azhdinsightmetastore) |
| Add-AzureHDInsightScriptAction |[Add-AzHDInsightScriptAction](https://docs.microsoft.com/powershell/module/az.hdinsight/add-azhdinsightscriptaction) |
| Add-AzureHDInsightStorage |[Add-AzHDInsightStorage](https://docs.microsoft.com/powershell/module/az.hdinsight/add-azhdinsightstorage) |
| Get-AzureHDInsightCluster |[Get-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/get-azhdinsightcluster) |
| Get-AzureHDInsightJob |[Get-AzHDInsightJob](https://docs.microsoft.com/powershell/module/az.hdinsight/get-azhdinsightjob) |
| Get-AzureHDInsightJobOutput |[Get-AzHDInsightJobOutput](https://docs.microsoft.com/powershell/module/az.hdinsight/get-azhdinsightjoboutput) |
| Get-AzureHDInsightProperty |[Get-AzHDInsightProperty](https://docs.microsoft.com/powershell/module/az.hdinsight/get-azhdinsightproperty) |
| Grant-AzureHDInsightHttpServicesAccess |[Grant-AzureRmHDInsightHttpServicesAccess](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/grant-azurermhdinsighthttpservicesaccess) |
| Grant-AzureHdinsightRdpAccess |[Grant-AzHDInsightRdpServicesAccess](https://docs.microsoft.com/powershell/module/az.hdinsight/grant-azhdinsightrdpservicesaccess) |
| Invoke-AzureHDInsightHiveJob |[Invoke-AzHDInsightHiveJob](https://docs.microsoft.com/powershell/module/az.hdinsight/invoke-azhdinsighthivejob) |
| New-AzureHDInsightCluster |[New-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightcluster) |
| New-AzureHDInsightClusterConfig |[New-AzHDInsightClusterConfig](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightclusterconfig) |
| New-AzureHDInsightHiveJobDefinition |[New-AzHDInsightHiveJobDefinition](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsighthivejobdefinition) |
| New-AzureHDInsightMapReduceJobDefinition |[New-AzHDInsightMapReduceJobDefinition](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightmapreducejobdefinition) |
| New-AzureHDInsightPigJobDefinition |[New-AzHDInsightPigJobDefinition](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightpigjobdefinition) |
| New-AzureHDInsightSqoopJobDefinition |[New-AzHDInsightSqoopJobDefinition](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightsqoopjobdefinition) |
| New-AzureHDInsightStreamingMapReduceJobDefinition |[New-AzHDInsightStreamingMapReduceJobDefinition](https://docs.microsoft.com/powershell/module/az.hdinsight/new-azhdinsightstreamingmapreducejobdefinition) |
| Remove-AzureHDInsightCluster |[Remove-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/remove-azhdinsightcluster) |
| Revoke-AzureHDInsightHttpServicesAccess |[Revoke-AzHDInsightHttpServicesAccess](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/revoke-azurermhdinsighthttpservicesaccess) |
| Revoke-AzureHdinsightRdpAccess |[Revoke-AzHDInsightRdpServicesAccess](https://docs.microsoft.com/powershell/module/az.hdinsight/revoke-azhdinsightrdpservicesaccess) |
| Set-AzureHDInsightClusterSize |[Set-AzHDInsightClusterSize](https://docs.microsoft.com/powershell/module/az.hdinsight/set-azhdinsightclustersize) |
| Set-AzureHDInsightDefaultStorage |[Set-AzHDInsightDefaultStorage](https://docs.microsoft.com/powershell/module/az.hdinsight/set-azhdinsightdefaultstorage) |
| Start-AzureHDInsightJob |[Start-AzHDInsightJob](https://docs.microsoft.com/powershell/module/az.hdinsight/start-azhdinsightjob) |
| Stop-AzureHDInsightJob |[Stop-AzHDInsightJob](https://docs.microsoft.com/powershell/module/az.hdinsight/stop-azhdinsightjob) |
| Use-AzureHDInsightCluster |[Use-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/use-azhdinsightcluster) |
| Wait-AzureHDInsightJob |[Wait-AzHDInsightJob](https://docs.microsoft.com/powershell/module/az.hdinsight/wait-azhdinsightjob) |

### New cmdlets
The following are the new cmdlets that are only available in Resource Manager mode. 

**Script action-related cmdlets:**

* **Get-AzHDInsightPersistedScriptAction**: Gets the persisted script actions for a cluster and lists them in chronological order, or gets details for a specified persisted script action. 
* **Get-AzHDInsightScriptActionHistory**: Gets the script action history for a cluster and lists it in reverse chronological order, or gets details of a previously executed script action. 
* **Remove-AzHDInsightPersistedScriptAction**: Removes a persisted script action from an HDInsight cluster.
* **Set-AzHDInsightPersistedScriptAction**: Sets a previously executed script action to be a persisted script action.
* **Submit-AzHDInsightScriptAction**: Submits a new script action to an Azure HDInsight cluster. 

For additional usage information, see [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md).

**Cluster identity-related cmdlets:**

* **Add-AzHDInsightClusterIdentity**: Adds a cluster identity to a cluster configuration object so that the HDInsight cluster can access Azure Data Lake Storage. See [Create an HDInsight cluster with Data Lake Storage using Azure PowerShell](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md).

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

    New-AzHDInsightCluster `
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

    Remove-AzHDInsightCluster -ResourceGroupName $resourceGroupName -ClusterName $clusterName 

**List cluster**

Old command (ASM):

    Get-AzureHDInsightCluster

New command:

    Get-AzHDInsightCluster 

**Show cluster**

Old command (ASM):

    Get-AzureHDInsightCluster -Name $clusterName

New command:

    Get-AzHDInsightCluster -ResourceGroupName $resourceGroupName -clusterName $clusterName


#### Other samples
* [Create HDInsight clusters](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
* [Submit Apache Hive jobs](hadoop/apache-hadoop-use-hive-powershell.md)
* [Submit Apache Sqoop jobs](hadoop/apache-hadoop-use-sqoop-powershell.md)

## Migrating to the new HDInsight .NET SDK
The Azure Service Management-based [(ASM) HDInsight .NET SDK](https://msdn.microsoft.com/library/azure/mt416619.aspx) is now deprecated. You are encouraged to use the Azure Resource Management-based [Resource Manager-based HDInsight .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight). The following ASM-based HDInsight packages are being deprecated.

* `Microsoft.WindowsAzure.Management.HDInsight`
* `Microsoft.Hadoop.Client`

This section provides pointers to more information on how to perform certain tasks using the Resource Manager-based SDK.

| How to... using the Resource Manager-based HDInsight SDK | Links |
| --- | --- |
| Azure HDInsight SDK for .NET|See [Azure HDInsight SDK for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight?view=azure-dotnet) |
| Authenticate applications interactively using Azure Active Directory with .NET SDK |See [Run Apache Hive queries using .NET SDK](hadoop/apache-hadoop-use-hive-dotnet-sdk.md). The code snippet in this article uses the interactive authentication approach. |
| Authenticate applications non-interactively using Azure Active Directory with .NET SDK |See [Create non-interactive applications for HDInsight](hdinsight-create-non-interactive-authentication-dotnet-applications.md) |
| Submit an Apache Hive job using .NET SDK |See [Submit Apache Hive jobs](hadoop/apache-hadoop-use-hive-dotnet-sdk.md) |
| Submit an Apache Sqoop job using .NET SDK |See [Submit Apache Sqoop jobs](hadoop/apache-hadoop-use-sqoop-dotnet-sdk.md) |
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

