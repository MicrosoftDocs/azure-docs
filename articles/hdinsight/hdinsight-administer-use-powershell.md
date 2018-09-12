---
title: Manage Hadoop clusters in HDInsight with PowerShell - Azure 
description: Learn how to perform administrative tasks for the Hadoop clusters in HDInsight using Azure PowerShell.
services: hdinsight
ms.reviewer: jasonh
author: jasonwhowell

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/14/2018
ms.author: jasonh

---
# Manage Hadoop clusters in HDInsight by using Azure PowerShell
[!INCLUDE [selector](../../includes/hdinsight-portal-management-selector.md)]

Azure PowerShell can be used to control and automate the deployment and management of your workloads in Azure. In this article, you learn how to manage Hadoop clusters in Azure HDInsight by using Azure PowerShell. For the list of the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference](https://msdn.microsoft.com/library/azure/dn479228.aspx).

**Prerequisites**

Before you begin this article, you must have the following items:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

## Install Azure PowerShell
[!INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

If you have installed Azure PowerShell version 0.9x, you must uninstall it before installing a newer version.

To check the version of the installed PowerShell:

```powershell
Get-Module *azure*
```

To uninstall the older version, run Programs and Features in the control panel.

## Create clusters
See [Create Linux-based clusters in HDInsight using Azure PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)

## List clusters
Use the following command to list all clusters in the current subscription:

```powershell
Get-AzureRmHDInsightCluster
```

## Show cluster
Use the following command to show details of a specific cluster in the current subscription:

```powershell
Get-AzureRmHDInsightCluster -ClusterName <Cluster Name>
```

## Delete clusters
Use the following command to delete a cluster:

```powershell
Remove-AzureRmHDInsightCluster -ClusterName <Cluster Name>
```

You can also delete a cluster by removing the resource group that contains the cluster. Deleting a resource group deletes all the resources in the group including the default storage account.

```powershell
Remove-AzureRmResourceGroup -Name <Resource Group Name>
```

## Scale clusters
The cluster scaling feature allows you to change the number of worker nodes used by a cluster that is running in Azure HDInsight without having to re-create the cluster.

> [!NOTE]
> Only clusters with HDInsight version 3.1.3 or higher are supported. If you are unsure of the version of your cluster, you can check the Properties page.  See [List and show clusters](hdinsight-administer-use-portal-linux.md#list-and-show-clusters).
>
>

The impact of changing the number of data nodes for each type of cluster supported by HDInsight:

* Hadoop

    You can seamlessly increase the number of worker nodes in a Hadoop cluster that is running without impacting any pending or running jobs. New jobs can also be submitted while the operation is in progress. Failures in a scaling operation are gracefully handled so that the cluster is always left in a functional state.

    When a Hadoop cluster is scaled down by reducing the number of data nodes, some of the services in the cluster are restarted. Restarting services causes all running and pending jobs to fail at the completion of the scaling operation. You can, however, resubmit the jobs once the operation is complete.
* HBase

    You can seamlessly add or remove nodes to your HBase cluster while it is running. Regional Servers are automatically balanced within a few minutes of completing the scaling operation. However, you can also manually balance the regional servers by logging in to the headnode of cluster, and then run the following commands from a command prompt window:

    ```bash
    >pushd %HBASE_HOME%\bin
    >hbase shell
    >balancer
    ```

* Storm

    You can seamlessly add or remove data nodes to your Storm cluster while it is running. But after a successful completion of the scaling operation, you will need to rebalance the topology.

    Rebalancing can be accomplished in two ways:

  * Storm web UI
  * Command-line interface (CLI) tool

    Refer to the [Apache Storm documentation](http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html) for more details.

    The Storm web UI is available on the HDInsight cluster:

    ![HDInsight storm scale rebalance](./media/hdinsight-administer-use-management-portal/hdinsight.portal.scale.cluster.png)

    Here is an example how to use the CLI command to rebalance the Storm topology:

    ```cli
    ## Reconfigure the topology "mytopology" to use 5 worker processes,
    ## the spout "blue-spout" to use 3 executors, and
    ## the bolt "yellow-bolt" to use 10 executors
    $ storm rebalance mytopology -n 5 -e blue-spout=3 -e yellow-bolt=10
    ```

To change the Hadoop cluster size by using Azure PowerShell, run the following command from a client machine:

```powershell
Set-AzureRmHDInsightClusterSize -ClusterName <Cluster Name> -TargetInstanceCount <NewSize>
```


## Grant/revoke access
HDInsight clusters have the following HTTP web services (all of these services have RESTful endpoints):

* ODBC
* JDBC
* Ambari
* Oozie
* Templeton

By default, these services are granted for access. You can revoke/grant the access. To revoke:

```powershell
Revoke-AzureRmHDInsightHttpServicesAccess -ClusterName <Cluster Name>
```

To grant:

```powershell
$clusterName = "<HDInsight Cluster Name>"

# Credential option 1
$hadoopUserName = "admin"
$hadoopUserPassword = "<Enter the Password>"
$hadoopUserPW = ConvertTo-SecureString -String $hadoopUserPassword -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($hadoopUserName,$hadoopUserPW)

# Credential option 2
#$credential = Get-Credential -Message "Enter the HTTP username and password:" -UserName "admin"

Grant-AzureRmHDInsightHttpServicesAccess -ClusterName $clusterName -HttpCredential $credential
```

> [!NOTE]
> By granting/revoking the access, you reset the cluster user name and password.
>
>

Granting and revoking access can also be done via the portal. See [Administer HDInsight by using the Azure portal][hdinsight-admin-portal].

## Update HTTP user credentials
It is the same procedure as [Grant/revoke HTTP access](#grant/revoke-access). If the cluster has been granted the HTTP access, you must first revoke it.  And then grant the access with new HTTP user credentials.

## Find the default storage account
The following PowerShell script demonstrates how to get the default storage account name and the related information:

```powershell
#Connect-AzureRmAccount
$clusterName = "<HDInsight Cluster Name>"

$clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
$storageInfo = $clusterInfo.DefaultStorageAccount.split('.')
$defaultStoreageType = $storageInfo[1]
$defaultStorageName = $storageInfo[0]

echo "Default Storage account name: $defaultStorageName"
echo "Default Storage account type: $defaultStoreageType"

if ($defaultStoreageType -eq "blob")
{
    $defaultBlobContainerName = $cluster.DefaultStorageContainer
    $defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName)[0].Value
    $defaultStorageAccountContext = New-AzureStorageContext -StorageAccountName $defaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey

    echo "Default Blob container name: $defaultBlobContainerName"
    echo "Default Storage account key: $defaultStorageAccountKey"
}
```


## Find the resource group
In the Resource Manager mode, each HDInsight cluster belongs to an Azure resource group.  To find the resource group:

```powershell
$clusterName = "<HDInsight Cluster Name>"

$cluster = Get-AzureRmHDInsightCluster -ClusterName $clusterName
$resourceGroupName = $cluster.ResourceGroup
```


## Submit jobs
**To submit MapReduce jobs**

See [Run Hadoop MapReduce samples in Windows-based HDInsight](hdinsight-run-samples.md).

**To submit Hive jobs**

See [Run Hive queries using PowerShell](hadoop/apache-hadoop-use-hive-powershell.md).

**To submit Pig jobs**

See [Run Pig jobs using PowerShell](hadoop/apache-hadoop-use-pig-powershell.md).

**To submit Sqoop jobs**

See [Use Sqoop with HDInsight](hadoop/hdinsight-use-sqoop.md).

**To submit Oozie jobs**

See [Use Oozie with Hadoop to define and run a workflow in HDInsight](hdinsight-use-oozie.md).

## Upload data to Azure Blob storage
See [Upload data to HDInsight][hdinsight-upload-data].

## See Also
* [HDInsight cmdlet reference documentation](https://msdn.microsoft.com/library/azure/dn479228.aspx)
* [Administer HDInsight by using the Azure portal][hdinsight-admin-portal]
* [Administer HDInsight using a command-line interface][hdinsight-admin-cli]
* [Create HDInsight clusters][hdinsight-provision]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Get started with Azure HDInsight][hdinsight-get-started]

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-get-started]:hadoop/apache-hadoop-linux-tutorial-get-started.md
[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-provision-custom-options]: hdinsight-hadoop-provision-linux-clusters.md#configuration
[hdinsight-submit-jobs]:hadoop/submit-apache-hadoop-jobs-programmatically.md

[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-use-mapreduce]:hadoop/hdinsight-use-mapreduce.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-flight]: hdinsight-analyze-flight-delay-data.md

[hdinsight-powershell-reference]: https://msdn.microsoft.com/library/dn858087.aspx

[powershell-install-configure]: /powershell/azureps-cmdlets-docs

[image-hdi-ps-provision]: ./media/hdinsight-administer-use-powershell/HDI.PS.Provision.png
