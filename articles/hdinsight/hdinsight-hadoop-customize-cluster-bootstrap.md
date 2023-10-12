---
title: Customize Azure HDInsight cluster configurations using bootstrap
description: Learn how to customize HDInsight cluster configuration programmatically using .NET, PowerShell, and Resource Manager templates.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, devx-track-azurepowershell, devx-track-dotnet
ms.date: 11/17/2022
---

# Customize HDInsight clusters using Bootstrap

Bootstrap scripts allow you to install and configure components in Azure HDInsight programmatically.

There are three approaches to set configuration file settings as your HDInsight cluster is created:

* Use Azure PowerShell
* Use .NET SDK
* Use Azure Resource Manager template

For example, using these programmatic methods, you can configure options in these files:

* clusterIdentity.xml
* core-site.xml
* gateway.xml
* hbase-env.xml
* hbase-site.xml
* hdfs-site.xml
* hive-env.xml
* hive-site.xml
* mapred-site
* oozie-site.xml
* oozie-env.xml
* tez-site.xml
* webhcat-site.xml
* yarn-site.xml
* server.properties (kafka-broker configuration)

For information on installing additional components on HDInsight cluster during the creation time, see [Customize HDInsight clusters using Script Action (Linux)](hdinsight-hadoop-customize-cluster-linux.md).

## Prerequisites

* If using PowerShell, you'll need the [Az Module](/powershell/azure/).

## Use Azure PowerShell

The following PowerShell code customizes an [Apache Hive](https://hive.apache.org/) configuration:

> [!IMPORTANT]  
> The parameter `Spark2Defaults` may need to be used with [Add-AzHDInsightConfigValue](/powershell/module/az.hdinsight/add-azhdinsightconfigvalue). You can pass empty values to the parameter as shown in the code example below.

```powershell
# hive-site.xml configuration
$hiveConfigValues = @{ "hive.metastore.client.socket.timeout"="90s" }

$config = New-AzHDInsightClusterConfig `
         -ClusterType "Spark"  `
    | Set-AzHDInsightDefaultStorage `
        -StorageAccountResourceId "$storageAccountResourceId" `
        -StorageAccountKey $defaultStorageAccountKey `
    | Add-AzHDInsightConfigValue `
        -HiveSite $hiveConfigValues `
        -Spark2Defaults @{}

New-AzHDInsightCluster `
    -ResourceGroupName $resourceGroupName `
    -ClusterName $hdinsightClusterName `
    -Location $location `
    -ClusterSizeInNodes 2 `
    -Version "4.0" `
    -HttpCredential $httpCredential `
    -SshCredential $sshCredential `
    -Config $config
```

A complete working PowerShell script can be found in [Appendix](#appendix-powershell-sample).

**To verify the change:**

1. Navigate to `https://CLUSTERNAME.azurehdinsight.net/` where `CLUSTERNAME` is the name of your cluster.
1. From the left menu,  navigate to **Hive** > **Configs** > **Advanced**.
1. Expand **Advanced hive-site**.
1. Locate **hive.metastore.client.socket.timeout** and confirm the value is **90s**.

Some more samples on customizing other configuration files:

```xml
# hdfs-site.xml configuration
$HdfsConfigValues = @{ "dfs.blocksize"="64m" } #default is 128MB in HDI 3.0 and 256MB in HDI 2.1

# core-site.xml configuration
$CoreConfigValues = @{ "ipc.client.connect.max.retries"="60" } #default 50

# mapred-site.xml configuration
$MapRedConfigValues = @{ "mapreduce.task.timeout"="1200000" } #default 600000

# oozie-site.xml configuration
$OozieConfigValues = @{ "oozie.service.coord.normal.default.timeout"="150" }  # default 120
```

## Use .NET SDK

See [Azure HDInsight SDK for .NET](/dotnet/api/overview/azure/hdinsight).

## Use Resource Manager template

You can use bootstrap in Resource Manager template:

```json
"configurations": {
    "hive-site": {
        "hive.metastore.client.connect.retry.delay": "5",
        "hive.execution.engine": "mr",
        "hive.security.authorization.manager": "org.apache.hadoop.hive.ql.security.authorization.DefaultHiveAuthorizationProvider"
    }
}
```

:::image type="content" source="./media/hdinsight-hadoop-customize-cluster-bootstrap/hdinsight-customize-cluster-bootstrap-arm.png" alt-text="Hadoop customizes cluster bootstrap Azure Resource Manager template":::

Sample Resource Manager template snippet to switch configuration in spark2-defaults to periodically clean up event logs from storage.  

```json
"configurations": {
    "spark2-defaults": {
        "spark.history.fs.cleaner.enabled": "true",
        "spark.history.fs.cleaner.interval": "7d",
        "spark.history.fs.cleaner.maxAge": "90d"
    }
}
```

## See also

* [Create Apache Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md) provides instructions on how to create an HDInsight cluster by using other custom options.
* [Develop Script Action scripts for HDInsight](hdinsight-hadoop-script-actions-linux.md)
* [Install and use Apache Spark on HDInsight clusters](spark/apache-spark-jupyter-spark-sql-use-portal.md)
* [Install and use Apache Giraph on HDInsight clusters](./hdinsight-hadoop-hue-linux.md).

## Appendix: PowerShell sample

This PowerShell script creates an HDInsight cluster and customizes a Hive setting. Be sure to enter values for `$nameToken`, `$httpPassword`, and `$sshPassword`.

```powershell
####################################
# Service names and variables
####################################

$nameToken = "<ENTER AN ALIAS>"
$namePrefix = $nameToken.ToLower() + (Get-Date -Format "MMdd")
$resourceGroupName = $namePrefix + "rg"
$hdinsightClusterName = $namePrefix + "hdi"
$defaultStorageAccountName = $namePrefix + "store"
$defaultBlobContainerName = $hdinsightClusterName
$location = "East US"

####################################
# Connect to Azure
####################################

Write-Host "Connecting to your Azure subscription ..." -ForegroundColor Green
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
#$context = Get-AzSubscription -SubscriptionId "<subscriptionID>"
#Set-AzContext $context

####################################
# Create a resource group
####################################

Write-Host "Creating a resource group ..." -ForegroundColor Green
New-AzResourceGroup `
    -Name  $resourceGroupName `
    -Location $location

####################################
# Create a storage account and container
####################################
	
Write-Host "Creating the default storage account and default blob container ..."  -ForegroundColor Green
New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $defaultStorageAccountName `
    -Location $location `
    -SkuName Standard_LRS `
    -Kind StorageV2 `
    -EnableHttpsTrafficOnly 1
	
$defaultStorageAccountKey = (Get-AzStorageAccountKey `
                                -ResourceGroupName $resourceGroupName `
                                -Name $defaultStorageAccountName)[0].Value

$defaultStorageContext = New-AzStorageContext `
                                -StorageAccountName $defaultStorageAccountName `
                                -StorageAccountKey $defaultStorageAccountKey
								
New-AzStorageContainer `
    -Name $defaultBlobContainerName `
    -Context $defaultStorageContext #use the cluster name as the container name

####################################
# Create a configuration object
####################################

$hiveConfigValues = @{"hive.metastore.client.socket.timeout"="90s"}
$storageAccountResourceId = (Get-AzStorageAccount -ResourceGroupName $resourceGroupName ` -Name $defaultStorageAccountName).Id

$config = New-AzHDInsightClusterConfig `
          -ClusterType "Spark"  `
    | Set-AzHDInsightDefaultStorage `
        -StorageAccountResourceId "$storageAccountResourceId" `
        -StorageAccountKey $defaultStorageAccountKey `
    | Add-AzHDInsightConfigValue `
        -HiveSite $hiveConfigValues `
		-Spark2Defaults @{}
		
####################################
# Set Ambari admin username/password
####################################

$httpUserName = "admin"  #HDInsight cluster username
$httpPassword = '<ENTER A PASSWORD>'

$httpPW = ConvertTo-SecureString -String $httpPassword -AsPlainText -Force
$httpCredential = New-Object System.Management.Automation.PSCredential($httpUserName,$httpPW)

####################################
# Set ssh username/password
####################################

$sshUserName = "sshuser" #HDInsight ssh user name
$sshPassword = '<ENTER A PASSWORD>'

$sshPW = ConvertTo-SecureString -String $sshPassword -AsPlainText -Force
$sshCredential = New-Object System.Management.Automation.PSCredential($sshUserName,$sshPW)

####################################
# Create an HDInsight cluster
####################################

New-AzHDInsightCluster `
    -ResourceGroupName $resourceGroupName `
    -ClusterName $hdinsightClusterName `
    -Location $location `
    -ClusterSizeInNodes 2 `
    -Version "4.0" `
    -HttpCredential $httpCredential `
    -SshCredential $sshCredential `
    -Config $config
	
####################################
# Verify the cluster
####################################

Get-AzHDInsightCluster `
    -ClusterName $hdinsightClusterName
    
```
