---
title: Use Data Lake Store with Hadoop in Azure HDInsight
description: Learn how to query data from Azure Data Lake Store and to store results of your analysis.
services: hdinsight,storage
author: jasonwhowell
ms.author: jasonh
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 07/23/2018
---
# Use Data Lake Store with Azure HDInsight clusters

To analyze data in HDInsight cluster, you can store the data either in [Azure Storage](../storage/common/storage-introduction.md), [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md), or both. Both storage options enable you to safely delete HDInsight clusters that are used for computation without losing user data.

In this article, you learn how Data Lake Store works with HDInsight clusters. To learn how Azure Storage works with HDInsight clusters, see [Use Azure Storage with Azure HDInsight clusters](hdinsight-hadoop-use-blob-storage.md). For more information about creating an HDInsight cluster, see [Create Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

> [!NOTE]
> Data Lake Store is always accessed through a secure channel, so there is no `adls` filesystem scheme name. You always use `adl`.
> 


## Availability for HDInsight clusters

Hadoop supports a notion of the default file system. The default file system implies a default scheme and authority. It can also be used to resolve relative paths. During the HDInsight cluster creation process, you can specify a blob container in Azure Storage as the default file system, or with HDInsight 3.5 and newer versions, you can select either Azure Storage or Azure Data Lake Store as the default files system with a few exceptions. 

HDInsight clusters can use Data Lake Store in two ways:

* As the default storage
* As additional storage, with Azure Storage Blob as default storage.

As of now, only some of the HDInsight cluster types/versions support using Data Lake Store as default storage and additional storage accounts:

| HDInsight cluster type | Data Lake Store as default storage | Data Lake Store as additional storage| Notes |
|------------------------|------------------------------------|---------------------------------------|------|
| HDInsight version 3.6 | Yes | Yes | |
| HDInsight version 3.5 | Yes | Yes | With the exception of HBase|
| HDInsight version 3.4 | No | Yes | |
| HDInsight version 3.3 | No | No | |
| HDInsight version 3.2 | No | Yes | |
| Storm | | |You can use Data Lake Store to write data from a Storm topology. You can also use Data Lake Store for reference data that can then be read by a Storm topology.|

Using Data Lake Store as an additional storage account does not affect performance or the ability to read or write to Azure storage from the cluster.


## Use Data Lake Store as default storage

When HDInsight is deployed with Data Lake Store as default storage, the cluster-related files are stored in Data Lake Store in the following location:

	adl://mydatalakestore/<cluster_root_path>/

where `<cluster_root_path>` is the name of a folder you create in Data Lake Store. By specifying a root path for each cluster, you can use the same Data Lake Store account for more than one cluster. So, you can have a setup where:

* Cluster1 can use the path `adl://mydatalakestore/cluster1storage`
* Cluster2 can use the path `adl://mydatalakestore/cluster2storage`

Notice that both the clusters use the same Data Lake Store account **mydatalakestore**. Each cluster has access to its own root filesystem in Data Lake Store. The Azure portal deployment experience in particular prompts you to use a folder name such as **/clusters/\<clustername>** for the root path.

To be able to use a Data Lake Store as default storage, you must grant the service principal access to the following paths:

- The Data Lake Store account root.  For example: adl://mydatalakestore/.
- The folder for all cluster folders.  For example: adl://mydatalakestore/clusters.
- The folder for the cluster.  For example: adl://mydatalakestore/clusters/cluster1storage.

For more information for creating service principal and grant access, see [Configure Data Lake store access](#configure-data-lake-store-access).


## Use Data Lake Store as additional storage

You can use Data Lake Store as additional storage for the cluster as well. In such cases, the cluster default storage can either be an Azure Storage Blob or a Data Lake Store account. If you are running HDInsight jobs against the data stored in Data Lake Store as additional storage, you must use the fully-qualified path to the files. For example:

	adl://mydatalakestore.azuredatalakestore.net/<file_path>

Note that there's no **cluster_root_path** in the URL now. That's because Data Lake Store is not a default storage in this case so all you need to do is provide the path to the files.

To be able to use a Data Lake Store as additional storage, you only need to grant the service principal access to the paths where your files are stored.  For example:

    adl://mydatalakestore.azuredatalakestore.net/<file_path>

For more information for creating service principal and grant access, see [Configure Data Lake store access](#configure-data-lake-store-access).


## Use more than one Data Lake Store accounts

Adding a Data Lake Store account as additional and adding more than one Data Lake Store accounts are accomplished by giving the HDInsight cluster permission on data in one ore more Data Lake Store accounts. See [Configure Data Lake Store access](#configure-data-lake-store-access).

## Configure Data Lake store access

To configure Data Lake store access from your HDInsight cluster, you must have an Azure Active directory (Azure AD) service principal. Only an Azure AD administrator can create a service principal. The service principal must be created with a certificate. For more information, see [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md), and [Create service principal with self-signed-certificate](../azure-resource-manager/resource-group-authenticate-service-principal.md#create-service-principal-with-self-signed-certificate).

> [!NOTE]
> If you are going to use Azure Data Lake Store as additional storage for HDInsight cluster, we strongly recommend that you do this while you create the cluster as described in this article. Adding Azure Data Lake Store as additional storage to an existing HDInsight cluster is not a supported scenario.
>

## Access files from the cluster

There are several ways you can access the files in Data Lake Store from an HDInsight cluster.

* **Using the fully qualified name**. With this approach, you provide the full path to the file that you want to access.

		adl://mydatalakestore.azuredatalakestore.net/<cluster_root_path>/<file_path>

* **Using the shortened path format**. With this approach, you replace the path up to the cluster root with adl:///. So, in the example above, you can replace `adl://mydatalakestore.azuredatalakestore.net/<cluster_root_path>/` with `adl:///`.

		adl:///<file path>

* **Using the relative path**. With this approach, you only provide the relative path to the file that you want to access. For example, if the complete path to the file is:

		adl://mydatalakestore.azuredatalakestore.net/<cluster_root_path>/example/data/sample.log

	You can access the same sample.log file by using this relative path instead.

		/example/data/sample.log

## Create HDInsight clusters with access to Data Lake Store

Use the following links for detailed instructions on how to create HDInsight clusters with access to Data Lake Store.

* [Using Portal](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md)
* [Using PowerShell (with Data Lake Store as default storage)](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
* [Using PowerShell (with Data Lake Store as additional storage)](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md)
* [Using Azure templates](../data-lake-store/data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)

## Refresh the HDInsight certificate for Data Lake Store access

The following example PowerShell code reads a local certificate file, and updates your HDInsight cluster with the new certificate to access Azure Data Lake Store. Provide your own HDInsight cluster name, resource group name, subscription ID, app ID, local path to the certificate. Type in the password when prompted.

```powershell-interactive
$clusterName = '<clustername>'
$resourceGroupName = '<resourcegroupname>'
$subscriptionId = '01234567-8a6c-43bc-83d3-6b318c6c7305'
$appId = '01234567-e100-4118-8ba6-c25834f4e938'
$generateSelfSignedCert = $false
$addNewCertKeyCredential = $true
$certFilePath = 'C:\localfolder\adls.pfx'
$certPassword = Read-Host "Enter Certificate Password"

if($generateSelfSignedCert)
{
    Write-Host "Generating new SelfSigned certificate"
    
    $cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=hdinsightAdlsCert" -KeySpec KeyExchange
    $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, $certPassword);
    $certString = [System.Convert]::ToBase64String($certBytes)
}
else
{

    Write-Host "Reading the cert file from path $certFilePath"

    $cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($certFilePath, $certPassword)
    $certString = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($certFilePath))
}

Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionId $subscriptionId

if($addNewCertKeyCredential)
{
    Write-Host "Creating new KeyCredential for the app"
    $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())
    New-AzureRmADAppCredential -ApplicationId $appId -CertValue $keyValue -EndDate $cert.NotAfter -StartDate $cert.NotBefore
    Write-Host "Waiting for 30 seconds for the permissions to get propagated"
    Start-Sleep -s 30
}

Write-Host "Updating the certificate on HDInsight cluster..."

Invoke-AzureRmResourceAction `
    -ResourceGroupName $resourceGroupName `
    -ResourceType 'Microsoft.HDInsight/clusters' `
    -ResourceName $clusterName `
    -ApiVersion '2015-03-01-preview' `
    -Action 'updateclusteridentitycertificate' `
    -Parameters @{ ApplicationId = $appId; Certificate = $certString; CertificatePassword = $certPassword.ToString() } `
    -Force
```

## Next steps
In this article, you learned how to use HDFS-compatible Azure Data Lake Store with HDInsight. This allows you to build scalable, long-term, archiving data acquisition solutions and use HDInsight to unlock the information inside the stored structured and unstructured data.

For more information, see:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md)
* [Create an HDInsight cluster to use Data Lake Store using the Azure PowerShell](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md)
* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Use Azure Storage Shared Access Signatures to restrict access to data with HDInsight][hdinsight-use-sas]

[hdinsight-use-sas]: hdinsight-storage-sharedaccesssignature-permissions.md
[powershell-install]: /powershell/azureps-cmdlets-docs
[hdinsight-creation]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-get-started]:hadoop/apache-hadoop-linux-tutorial-get-started.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-use-pig]:hadoop/hdinsight-use-pig.md

[blob-storage-restAPI]: http://msdn.microsoft.com/library/windowsazure/dd135733.aspx
[azure-storage-create]:../storage/common/storage-create-storage-account.md

[img-hdi-powershell-blobcommands]: ./media/hdinsight-hadoop-use-blob-storage/HDI.PowerShell.BlobCommands.png
[img-hdi-quick-create]: ./media/hdinsight-hadoop-use-blob-storage/HDI.QuickCreateCluster.png
[img-hdi-custom-create-storage-account]: ./media/hdinsight-hadoop-use-blob-storage/HDI.CustomCreateStorageAccount.png  
