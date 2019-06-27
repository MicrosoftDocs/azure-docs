---
title: Use Data Lake Storage Gen1 with Hadoop in Azure HDInsight
description: Learn how to query data from Azure Data Lake Storage Gen1 and to store results of your analysis.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 05/10/2019
---
# Use Data Lake Storage Gen1 with Azure HDInsight clusters

> [!Note] 
> Deploy new HDInsight clusters using [Azure Data Lake Storage Gen2](hdinsight-hadoop-use-data-lake-storage-gen2.md) for improved performance and new features.

To analyze data in HDInsight cluster, you can store the data either in [Azure Storage](../storage/common/storage-introduction.md), [Azure Data Lake Storage Gen 1](../data-lake-store/data-lake-store-overview.md) or [Azure Data Lake Storage Gen 2](../storage/blobs/data-lake-storage-introduction.md). All storage options enable you to safely delete HDInsight clusters that are used for computation without losing user data.

In this article, you learn how Data Lake Storage Gen1 works with HDInsight clusters. To learn how Azure Storage works with HDInsight clusters, see [Use Azure Storage with Azure HDInsight clusters](hdinsight-hadoop-use-blob-storage.md). For more information about creating an HDInsight cluster, see [Create Apache Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

> [!NOTE]  
> Data Lake Storage Gen1 is always accessed through a secure channel, so there is no `adls` filesystem scheme name. You always use `adl`.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Availability for HDInsight clusters

Apache Hadoop supports a notion of the default file system. The default file system implies a default scheme and authority. It can also be used to resolve relative paths. During the HDInsight cluster creation process, you can specify a blob container in Azure Storage as the default file system, or with HDInsight 3.5 and newer versions, you can select either Azure Storage or Azure Data Lake Storage Gen1 as the default files system with a few exceptions. 

HDInsight clusters can use Data Lake Storage Gen1 in two ways:

* As the default storage
* As additional storage, with Azure Storage Blob as default storage.

As of now, only some of the HDInsight cluster types/versions support using Data Lake Storage Gen1 as default storage and additional storage accounts:

| HDInsight cluster type | Data Lake Storage Gen1 as default storage | Data Lake Storage Gen1 as additional storage| Notes |
|------------------------|------------------------------------|---------------------------------------|------|
| HDInsight version 4.0 | No | No |ADLS Gen1 is not supported with HDInsight 4.0 |
| HDInsight version 3.6 | Yes | Yes | With the exception of HBase|
| HDInsight version 3.5 | Yes | Yes | With the exception of HBase|
| HDInsight version 3.4 | No | Yes | |
| HDInsight version 3.3 | No | No | |
| HDInsight version 3.2 | No | Yes | |
| Storm | | |You can use Data Lake Storage Gen1 to write data from a Storm topology. You can also use Data Lake Storage for reference data that can then be read by a Storm topology.|

> [!WARNING]  
> HDInsight HBase is not supported with Azure Data Lake Storage Gen1

Using Data Lake Storage Gen1 as an additional storage account does not affect performance or the ability to read or write to Azure storage from the cluster.

## Use Data Lake Storage Gen1 as default storage

When HDInsight is deployed with Data Lake Storage Gen1 as default storage, the cluster-related files are stored in `adl://mydatalakestore/<cluster_root_path>/`, where `<cluster_root_path>` is the name of a folder you create in Data Lake Storage. By specifying a root path for each cluster, you can use the same Data Lake Storage account for more than one cluster. So, you can have a setup where:

* Cluster1 can use the path `adl://mydatalakestore/cluster1storage`
* Cluster2 can use the path `adl://mydatalakestore/cluster2storage`

Notice that both the clusters use the same Data Lake Storage Gen1 account **mydatalakestore**. Each cluster has access to its own root filesystem in Data Lake Storage. The Azure portal deployment experience in particular prompts you to use a folder name such as **/clusters/\<clustername>** for the root path.

To be able to use Data Lake Storage Gen1 as default storage, you must grant the service principal access to the following paths:

- The Data Lake Storage Gen1 account root.  For example: adl://mydatalakestore/.
- The folder for all cluster folders.  For example: adl://mydatalakestore/clusters.
- The folder for the cluster.  For example: adl://mydatalakestore/clusters/cluster1storage.

For more information for creating service principal and grant access, see Configure Data Lake Storage access.

### Extracting a certificate from Azure Keyvault for use in cluster creation

If you want to setup Azure Data Lake Storage Gen1 as your default storage for a new cluster and the certificate for your service principal is stored in Azure Key Vault, there are a few additional steps required to convert the certificate to the correct format. The following code snippets show how to perform the conversion.

First, download the certificate from Key Vault and extract the `SecretValueText`.

```powershell
$certPassword = Read-Host "Enter Certificate Password"
$cert = (Get-AzureKeyVaultSecret -VaultName 'MY-KEY-VAULT' -Name 'MY-SECRET-NAME')
$certValue = [System.Convert]::FromBase64String($cert.SecretValueText)
```

Next, convert the `SecretValueText` to a certificate.

```powershell
$certObject = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList $certValue,$null,"Exportable, PersistKeySet"
$certBytes = $certObject.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, $certPassword.SecretValueText);
$identityCertificate = [System.Convert]::ToBase64String($certBytes)
```

Then you can use the `$identityCertificate` to deploy a new cluster as in the following snippet:

```powershell
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $pathToArmTemplate `
    -identityCertificate $identityCertificate `
    -identityCertificatePassword $certPassword.SecretValueText `
    -clusterName  $clusterName `
    -clusterLoginPassword $SSHpassword `
    -sshPassword $SSHpassword `
    -servicePrincipalApplicationId $application.ApplicationId
```

## Use Data Lake Storage Gen1 as additional storage

You can use Data Lake Storage Gen1 as additional storage for the cluster as well. In such cases, the cluster default storage can either be an Azure Storage Blob or a Data Lake Storage account. If you are running HDInsight jobs against the data stored in Data Lake Storage as additional storage, you must use the fully-qualified path to the files. For example:

	adl://mydatalakestore.azuredatalakestore.net/<file_path>

Note that there's no **cluster_root_path** in the URL now. That's because Data Lake Storage is not a default storage in this case so all you need to do is provide the path to the files.

To be able to use a Data Lake Storage Gen1 as additional storage, you only need to grant the service principal access to the paths where your files are stored.  For example:

    adl://mydatalakestore.azuredatalakestore.net/<file_path>

For more information for creating service principal and grant access, see Configure Data Lake Storage access.


## Use more than one Data Lake Storage accounts

Adding a Data Lake Storage account as additional and adding more than one Data Lake Storage accounts are accomplished by giving the HDInsight cluster permission on data in one ore more Data Lake Storage accounts. See Configure Data Lake Storage access.

## Configure Data Lake Storage access

To configure Data Lake Storage access from your HDInsight cluster, you must have an Azure Active directory (Azure AD) service principal. Only an Azure AD administrator can create a service principal. The service principal must be created with a certificate. For more information, see [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md), and [Create service principal with self-signed-certificate](../active-directory/develop/howto-authenticate-service-principal-powershell.md#create-service-principal-with-self-signed-certificate).

> [!NOTE]  
> If you are going to use Azure Data Lake Storage Gen1 as additional storage for HDInsight cluster, we strongly recommend that you do this while you create the cluster as described in this article. Adding Azure Data Lake Storage Gen1 as additional storage to an existing HDInsight cluster is not a supported scenario.
>

## Access files from the cluster

There are several ways you can access the files in Data Lake Storage from an HDInsight cluster.

* **Using the fully qualified name**. With this approach, you provide the full path to the file that you want to access.

		adl://mydatalakestore.azuredatalakestore.net/<cluster_root_path>/<file_path>

* **Using the shortened path format**. With this approach, you replace the path up to the cluster root with adl:///. So, in the example above, you can replace `adl://mydatalakestore.azuredatalakestore.net/<cluster_root_path>/` with `adl:///`.

		adl:///<file path>

* **Using the relative path**. With this approach, you only provide the relative path to the file that you want to access. For example, if the complete path to the file is:

		adl://mydatalakestore.azuredatalakestore.net/<cluster_root_path>/example/data/sample.log

	You can access the same sample.log file by using this relative path instead.

		/example/data/sample.log

## Create HDInsight clusters with access to Data Lake Storage Gen1

Use the following links for detailed instructions on how to create HDInsight clusters with access to Data Lake Storage Gen1.

* [Using Portal](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md)
* [Using PowerShell (with Data Lake Storage Gen1 as default storage)](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
* [Using PowerShell (with Data Lake Storage Gen1 as additional storage)](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md)
* [Using Azure templates](../data-lake-store/data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)

## Refresh the HDInsight certificate for Data Lake Storage Gen1 access

The following example PowerShell code reads a certificate from a local file or Azure Key Vault, and updates your HDInsight cluster with the new certificate to access Azure Data Lake Storage Gen1. Provide your own HDInsight cluster name, resource group name, subscription ID, app ID, local path to the certificate. Type in the password when prompted.

```powershell-interactive
$clusterName = '<clustername>'
$resourceGroupName = '<resourcegroupname>'
$subscriptionId = '01234567-8a6c-43bc-83d3-6b318c6c7305'
$appId = '01234567-e100-4118-8ba6-c25834f4e938'
$addNewCertKeyCredential = $true
$certFilePath = 'C:\localfolder\adls.pfx'
$KeyVaultName = "my-key-vault-name"
$KeyVaultSecretName = "my-key-vault-secret-name"
$certPassword = Read-Host "Enter Certificate Password"
# certSource
# 0 - create self signed cert
# 1 - read cert from file path
# 2 - read cert from key vault
$certSource = 0

Login-AzAccount
Select-AzSubscription -SubscriptionId $subscriptionId

if($certSource -eq 0)
{
    Write-Host "Generating new SelfSigned certificate"

    $cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=hdinsightAdlsCert" -KeySpec KeyExchange
    $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, $certPassword);
    $certString = [System.Convert]::ToBase64String($certBytes)
}
elseif($certSource -eq 1)
{

    Write-Host "Reading the cert file from path $certFilePath"

    $cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2($certFilePath, $certPassword)
    $certString = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($certFilePath))
}
elseif($certSource -eq 2)
{

    Write-Host "Reading the cert file from Azure Key Vault $KeyVaultName"

    $cert = (Get-AzureKeyVaultSecret -VaultName $KeyVaultName -Name $KeyVaultSecretName)
    $certValue = [System.Convert]::FromBase64String($cert.SecretValueText)
    $certObject = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList $certValue, $null,"Exportable, PersistKeySet"

    $certBytes = $certObject.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, $certPassword.SecretValueText);

    $certString =[System.Convert]::ToBase64String($certBytes)
}

if($addNewCertKeyCredential)
{
    Write-Host "Creating new KeyCredential for the app"
    $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())
    New-AzADAppCredential -ApplicationId $appId -CertValue $keyValue -EndDate $cert.NotAfter -StartDate $cert.NotBefore
    Write-Host "Waiting for 7 minutes for the permissions to get propagated"
    Start-Sleep -s 420 #7 minutes
}

Write-Host "Updating the certificate on HDInsight cluster..."

Invoke-AzResourceAction `
    -ResourceGroupName $resourceGroupName `
    -ResourceType 'Microsoft.HDInsight/clusters' `
    -ResourceName $clusterName `
    -ApiVersion '2015-03-01-preview' `
    -Action 'updateclusteridentitycertificate' `
    -Parameters @{ ApplicationId = $appId; Certificate = $certString; CertificatePassword = $certPassword.ToString() } `
    -Force
```

## Next steps
In this article, you learned how to use HDFS-compatible Azure Data Lake Storage Gen1 with HDInsight. This allows you to build scalable, long-term, archiving data acquisition solutions and use HDInsight to unlock the information inside the stored structured and unstructured data.

For more information, see:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md)
* [Create an HDInsight cluster to use Data Lake Storage Gen1 using the Azure PowerShell](../data-lake-store/data-lake-store-hdinsight-hadoop-use-powershell.md)
* [Upload data to HDInsight][hdinsight-upload-data]
* [Use Apache Hive with HDInsight][hdinsight-use-hive]
* [Use Apache Pig with HDInsight][hdinsight-use-pig]
* [Use Azure Storage Shared Access Signatures to restrict access to data with HDInsight][hdinsight-use-sas]

[hdinsight-use-sas]: hdinsight-storage-sharedaccesssignature-permissions.md
[powershell-install]: /powershell/azureps-cmdlets-docs
[hdinsight-creation]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-get-started]:hadoop/apache-hadoop-linux-tutorial-get-started.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-use-pig]:hadoop/hdinsight-use-pig.md

[blob-storage-restAPI]: https://msdn.microsoft.com/library/windowsazure/dd135733.aspx
[azure-storage-create]:../storage/common/storage-create-storage-account.md

[img-hdi-powershell-blobcommands]: ./media/hdinsight-hadoop-use-blob-storage/HDI.PowerShell.BlobCommands.png
[img-hdi-quick-create]: ./media/hdinsight-hadoop-use-blob-storage/HDI.QuickCreateCluster.png
[img-hdi-custom-create-storage-account]: ./media/hdinsight-hadoop-use-blob-storage/HDI.CustomCreateStorageAccount.png  
