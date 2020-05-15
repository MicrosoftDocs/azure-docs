---
title: Restrict access using Shared Access Signatures - Azure HDInsight
description: Learn how to use Shared Access Signatures to restrict HDInsight access to data stored in Azure storage blobs.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,seoapr2020
ms.date: 04/28/2020
---

# Use Azure Storage Shared Access Signatures to restrict access to data in HDInsight

HDInsight has full access to data in the Azure Storage accounts associated with the cluster. You can use Shared Access Signatures on the blob container to restrict access to the data. Shared Access Signatures (SAS) are a feature of Azure storage accounts that allows you to limit access to data. For example, providing read-only access to data.

> [!IMPORTANT]  
> For a solution using Apache Ranger, consider using domain-joined HDInsight. For more information, see the [Configure domain-joined HDInsight](./domain-joined/apache-domain-joined-configure.md) document.

> [!WARNING]  
> HDInsight must have full access to the default storage for the cluster.

## Prerequisites

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](./hdinsight-hadoop-linux-use-ssh-unix.md).

* An existing [storage container](../storage/blobs/storage-quickstart-blobs-portal.md).  

* If using PowerShell, you'll need the [Az Module](https://docs.microsoft.com/powershell/azure/overview).

* If wanting to use Azure CLI and you haven't yet installed it, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

* If using [Python](https://www.python.org/downloads/), version 2.7 or higher.

* If using C#, Visual Studio must be version 2013 or higher.

* The URI scheme for your storage account. This scheme would be `wasb://` for Azure Storage, `abfs://` for Azure Data Lake Storage Gen2 or `adl://` for Azure Data Lake Storage Gen1. If secure transfer is enabled for Azure Storage, the URI would be `wasbs://`.

* An existing HDInsight cluster to add a Shared Access Signature to. If not, you can use Azure PowerShell to create a cluster and add a Shared Access Signature during cluster creation.

* The example files from [https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature](https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature). This repository contains the following items:

  * A Visual Studio project that can create a storage container, stored policy, and SAS for use with HDInsight
  * A Python script that can create a storage container, stored policy, and SAS for use with HDInsight
  * A PowerShell script that can create a HDInsight cluster and configure it to use the SAS. An updated version is used further below.
  * A sample file: `hdinsight-dotnet-python-azure-storage-shared-access-signature-master\sampledata\sample.log`

## Shared Access Signatures

There are two forms of Shared Access Signatures:

* `Ad hoc`: The start time, expiry time, and permissions for the SAS are all specified on the SAS URI.

* `Stored access policy`: A stored access policy is defined on a resource container, such as a blob container. A policy can be used to manage constraints for one or more shared access signatures. When you associate a SAS with a stored access policy, the SAS inherits the constraints - the start time, expiry time, and permissions - defined for the stored access policy.

The difference between the two forms is important for one key scenario: revocation. A SAS is a URL, so anyone who obtains the SAS can use it. It doesn't matter who requested it to begin with. If a SAS is published publicly, it can be used by anyone in the world. A SAS that is distributed is valid until one of four things happens:

1. The expiry time specified on the SAS is reached.

2. The expiry time specified on the stored access policy referenced by the SAS is reached. The following scenarios cause the expiry time to be reached:

    * The time interval has elapsed.
    * The stored access policy is modified to have an expiry time in the past. Changing the expiry time is one way to revoke the SAS.

3. The stored access policy referenced by the SAS is deleted, which is another way to revoke the SAS. If you recreate the stored access policy with the same name, all  SAS tokens for the previous policy are valid (if the expiry time on the SAS hasn't passed). If you intend to revoke the SAS, be sure to use a different name if you recreate the access policy with an expiry time in the future.

4. The account key that was used to create the SAS is regenerated. Regenerating the key causes all applications that use the previous key to fail authentication. Update all components to the new key.

> [!IMPORTANT]  
> A shared access signature URI is associated with the account key used to create the signature, and the associated stored access policy (if any). If no stored access policy is specified, the only way to revoke a shared access signature is to change the account key.

We recommend that you always use stored access policies. When using stored policies, you can either revoke signatures or extend the expiry date as needed. The steps in this document use stored access policies to generate SAS.

For more information on Shared Access Signatures, see [Understanding the SAS model](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

## Create a stored policy and SAS

Save the SAS token that is produced at the end of each method. The token will look similar to the following output:

```output
?sv=2018-03-28&sr=c&si=myPolicyPS&sig=NAxefF%2BrR2ubjZtyUtuAvLQgt%2FJIN5aHJMj6OsDwyy4%3D
```

### Using PowerShell

Replace `RESOURCEGROUP`, `STORAGEACCOUNT`, and `STORAGECONTAINER` with the appropriate values for your existing storage container. Change directory to `hdinsight-dotnet-python-azure-storage-shared-access-signature-master` or revise the `-File` parameter to contain the absolute path for `Set-AzStorageblobcontent`. Enter the following PowerShell command:

```powershell
$resourceGroupName = "RESOURCEGROUP"
$storageAccountName = "STORAGEACCOUNT"
$containerName = "STORAGECONTAINER"
$policy = "myPolicyPS"

# Login to your Azure subscription
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"

# Get the access key for the Azure Storage account
$storageAccountKey = (Get-AzStorageAccountKey `
                                -ResourceGroupName $resourceGroupName `
                                -Name $storageAccountName)[0].Value

# Create an Azure Storage context
$storageContext = New-AzStorageContext `
                                -StorageAccountName $storageAccountName `
                                -StorageAccountKey $storageAccountKey

# Create a stored access policy for the Azure storage container
New-AzStorageContainerStoredAccessPolicy `
   -Container $containerName `
   -Policy $policy `
   -Permission "rl" `
   -ExpiryTime "12/31/2025 08:00:00" `
   -Context $storageContext

# Get the stored access policy or policies for the Azure storage container
Get-AzStorageContainerStoredAccessPolicy `
    -Container $containerName `
    -Context $storageContext

# Generates an SAS token for the Azure storage container
New-AzStorageContainerSASToken `
    -Name $containerName `
    -Policy $policy `
    -Context $storageContext

<# Removes a stored access policy from the Azure storage container
Remove-AzStorageContainerStoredAccessPolicy `
    -Container $containerName `
    -Policy $policy `
    -Context $storageContext
#>

# upload a file for a later example
Set-AzStorageblobcontent `
    -File "./sampledata/sample.log" `
    -Container $containerName `
    -Blob "samplePS.log" `
    -Context $storageContext
```

### Using Azure CLI

The use of variables in this section is based on a Windows environment. Slight variations will be needed for bash or other environments.

1. Replace `STORAGEACCOUNT`, and `STORAGECONTAINER` with the appropriate values for your existing storage container.

    ```azurecli
    # set variables
    set AZURE_STORAGE_ACCOUNT=STORAGEACCOUNT
    set AZURE_STORAGE_CONTAINER=STORAGECONTAINER

    #Login
    az login

    # If you have multiple subscriptions, set the one to use
    # az account set --subscription SUBSCRIPTION

    # Retrieve the primary key for the storage account
    az storage account keys list --account-name %AZURE_STORAGE_ACCOUNT% --query "[0].{PrimaryKey:value}" --output table
    ```

2. Set the retrieved primary key to a variable for later use. Replace `PRIMARYKEY` with the retrieved value in the prior step, and then enter the command below:

    ```console
    #set variable for primary key
    set AZURE_STORAGE_KEY=PRIMARYKEY
    ```

3. Change directory to `hdinsight-dotnet-python-azure-storage-shared-access-signature-master` or revise the `--file` parameter to contain the absolute path for `az storage blob upload`. Execute the remaining commands:

    ```azurecli
    # Create stored access policy on the containing object
    az storage container policy create --container-name %AZURE_STORAGE_CONTAINER% --name myPolicyCLI --account-key %AZURE_STORAGE_KEY% --account-name %AZURE_STORAGE_ACCOUNT% --expiry 2025-12-31 --permissions rl

    # List stored access policies on a containing object
    az storage container policy list --container-name %AZURE_STORAGE_CONTAINER% --account-key %AZURE_STORAGE_KEY% --account-name %AZURE_STORAGE_ACCOUNT%

    # Generate a shared access signature for the container
    az storage container generate-sas --name myPolicyCLI --account-key %AZURE_STORAGE_KEY% --account-name %AZURE_STORAGE_ACCOUNT%

    # Reversal
    # az storage container policy delete --container-name %AZURE_STORAGE_CONTAINER% --name myPolicyCLI --account-key %AZURE_STORAGE_KEY% --account-name %AZURE_STORAGE_ACCOUNT%

    # upload a file for a later example
    az storage blob upload --container-name %AZURE_STORAGE_CONTAINER% --account-key %AZURE_STORAGE_KEY% --account-name %AZURE_STORAGE_ACCOUNT% --name sampleCLI.log --file "./sampledata/sample.log"
    ```

### Using Python

Open the `SASToken.py` file and replace `storage_account_name`, `storage_account_key`, and `storage_container_name` with the appropriate values for your existing storage container, and then run the script.

You may need to execute `pip install --upgrade azure-storage` if you receive the error message `ImportError: No module named azure.storage`.

### Using C\#

1. Open the solution in Visual Studio.

2. In Solution Explorer, right-click on the **SASExample** project and select **Properties**.

3. Select **Settings** and add values for the following entries:

    |Item |Description |
    |---|---|
    |StorageConnectionString|The connection string for the storage account that you want to create a stored policy and SAS for. The format should be `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey` where `myaccount` is the name of your storage account and `mykey` is the key for the storage account.|
    |ContainerName|The container in the storage account that you want to restrict access to.|
    |SASPolicyName|The name to use for the stored policy to create.|
    |FileToUpload|The path to a file that is uploaded to the container.|

4. Run the project. Save the SAS policy token, storage account name, and container name. These values are used when associating the storage account with your HDInsight cluster.

## Use the SAS with HDInsight

When creating an HDInsight cluster, you must specify a primary storage account. You can also specify additional storage accounts. Both of these methods of adding storage require full access to the storage accounts and containers that are used.

Use a Shared Access Signature to limit container access. Add a custom entry to the **core-site** configuration for the cluster. You can add the entry during cluster creation using PowerShell or after cluster creation using Ambari.

### Create a cluster that uses the SAS

Replace `CLUSTERNAME`, `RESOURCEGROUP`, `DEFAULTSTORAGEACCOUNT`, `STORAGECONTAINER`, `STORAGEACCOUNT`, and `TOKEN` with the appropriate values. Enter the PowerShell commands:

```powershell
$clusterName = 'CLUSTERNAME'
$resourceGroupName = 'RESOURCEGROUP'

# Replace with the Azure data center you want to the cluster to live in
$location = 'eastus'

# Replace with the name of the default storage account TO BE CREATED
$defaultStorageAccountName = 'DEFAULTSTORAGEACCOUNT'

# Replace with the name of the SAS container CREATED EARLIER
$SASContainerName = 'STORAGECONTAINER'

# Replace with the name of the SAS storage account CREATED EARLIER
$SASStorageAccountName = 'STORAGEACCOUNT'

# Replace with the SAS token generated earlier
$SASToken = 'TOKEN'

# Default cluster size (# of worker nodes), version, and type
$clusterSizeInNodes = "4"
$clusterVersion = "3.6"
$clusterType = "Hadoop"

# Login to your Azure subscription
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"

# Create an Azure Storage account and container
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

# Create a blob container. This holds the default data store for the cluster.
New-AzStorageContainer `
    -Name $clusterName `
    -Context $defaultStorageContext

# Cluster login is used to secure HTTPS services hosted on the cluster
$httpCredential = Get-Credential `
    -Message "Enter Cluster login credentials" `
    -UserName "admin"

# SSH user is used to remotely connect to the cluster using SSH clients
$sshCredential = Get-Credential `
    -Message "Enter SSH user credentials" `
    -UserName "sshuser"

# Create the configuration for the cluster
$config = New-AzHDInsightClusterConfig

$config = $config | Add-AzHDInsightConfigValue `
    -Spark2Defaults @{} `
    -Core @{"fs.azure.sas.$SASContainerName.$SASStorageAccountName.blob.core.windows.net"=$SASToken}

# Create the HDInsight cluster
New-AzHDInsightCluster `
    -Config $config `
    -ResourceGroupName $resourceGroupName `
    -ClusterName $clusterName `
    -Location $location `
    -ClusterSizeInNodes $clusterSizeInNodes `
    -ClusterType $clusterType `
    -OSType Linux `
    -Version $clusterVersion `
    -HttpCredential $httpCredential `
    -SshCredential $sshCredential `
    -DefaultStorageAccountName "$defaultStorageAccountName.blob.core.windows.net" `
    -DefaultStorageAccountKey $defaultStorageAccountKey `
    -DefaultStorageContainer $clusterName

<# REVERSAL
Remove-AzHDInsightCluster `
    -ResourceGroupName $resourceGroupName `
    -ClusterName $clusterName

Remove-AzStorageContainer `
    -Name $clusterName `
    -Context $defaultStorageContext

Remove-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $defaultStorageAccountName

Remove-AzResourceGroup `
    -Name $resourceGroupName
#>
```

> [!IMPORTANT]  
> When prompted for the HTTP/s or SSH user name and password, you must provide a password that meets the following criteria:
>
> * Must be at least 10 characters in length.
> * Must contain at least one digit.
> * Must contain at least one non-alphanumeric character.
> * Must contain at least one upper or lower case letter.

It takes a while for this script to complete, usually around 15 minutes. When the script completes without any errors, the cluster has been created.

### Use the SAS with an existing cluster

If you have an existing cluster, you can add the SAS to the **core-site** configuration by using the following steps:

1. Open the Ambari web UI for your cluster. The address for this page is `https://YOURCLUSTERNAME.azurehdinsight.net`. When prompted, authenticate to the cluster using the admin name (admin) and password you used when creating the cluster.

1. Navigate to **HDFS** > **Configs** > **Advanced** > **Custom core-site**.

1. Expand the **Custom core-site** section, scroll to the end and, then select **Add property...**. Use the following values for **Key** and **Value**:

    * **Key**: `fs.azure.sas.CONTAINERNAME.STORAGEACCOUNTNAME.blob.core.windows.net`
    * **Value**: The SAS returned by one of the methods earlier executed.

    Replace `CONTAINERNAME` with the container name you used with the C# or SAS application. Replace `STORAGEACCOUNTNAME` with the storage account name you used.

    Select **Add** to save this key and value

1. Select the **Save** button to save the configuration changes. When prompted, add a description of the change ("adding SAS storage access" for example) and then select **Save**.

    Select **OK** when the changes have been completed.

   > [!IMPORTANT]  
   > You must restart several services before the change takes effect.

1. A **Restart** drop-down list will appear. Select **Restart All Affected** from the drop-down list and then __Confirm Restart All__.

    Repeat this process for **MapReduce2** and **YARN**.

1. Once the services have restarted, select each one and disable maintenance mode from the **Service Actions** drop down.

## Test restricted access

Use the following steps to verify that you can only read and list items on the SAS storage account.

1. Connect to the cluster. Replace `CLUSTERNAME` with the name of your cluster and enter the following command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

2. To list the contents of the container, use the following command from the prompt:

    ```bash
    hdfs dfs -ls wasbs://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/
    ```

    Replace `SASCONTAINER` with the name of the container created for the SAS storage account. Replace `SASACCOUNTNAME` with the name of the storage account used for the SAS.

    The list includes the file uploaded when the container and SAS were created.

3. Use the following command to verify that you can read the contents of the file. Replace the `SASCONTAINER` and `SASACCOUNTNAME` as in the previous step. Replace `sample.log` with the name of the file displayed in the previous command:

    ```bash
    hdfs dfs -text wasbs://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/sample.log
    ```

    This command lists the contents of the file.

4. Use the following command to download the file to the local file system:

    ```bash
    hdfs dfs -get wasbs://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/sample.log testfile.txt
    ```

    This command downloads the file to a local file named **testfile.txt**.

5. Use the following command to upload the local file to a new file named **testupload.txt** on the SAS storage:

    ```bash
    hdfs dfs -put testfile.txt wasbs://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/testupload.txt
    ```

    You receive a message similar to the following text:

        put: java.io.IOException

    This error occurs because the storage location is read+list only. Use the following command to put the data on the default storage for the cluster, which is writable:

    ```bash
    hdfs dfs -put testfile.txt wasbs:///testupload.txt
    ```

    This time, the operation should complete successfully.

## Next steps

Now that you've learned how to add limited-access storage to your HDInsight cluster, learn other ways to work with data on your cluster:

* [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
* [Authorize users for Apache Ambari Views](hdinsight-authorize-users-to-ambari.md)
