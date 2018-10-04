---
title: Restrict access using Shared Access Signatures - Azure HDInsight 
description: Learn how to use Shared Access Signatures to restrict HDInsight access to data stored in Azure storage blobs.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jasonh

---
# Use Azure Storage Shared Access Signatures to restrict access to data in HDInsight

HDInsight has full access to data in the Azure Storage accounts associated with the cluster. You can use Shared Access Signatures on the blob container to restrict access to the data. Shared Access Signatures (SAS) are a feature of Azure storage accounts that allows you to limit access to data. For example, providing read-only access to data.

> [!IMPORTANT]
> For a solution using Apache Ranger, consider using domain-joined HDInsight. For more information, see the [Configure domain-joined HDInsight](./domain-joined/apache-domain-joined-configure.md) document.

> [!WARNING]
> HDInsight must have full access to the default storage for the cluster.

## Requirements

* An Azure subscription
* C# or Python. C# example code is provided as a Visual Studio solution.

  * Visual Studio must be version 2013, 2015, or 2017
  * Python must be version 2.7 or higher

* A Linux-based HDInsight cluster OR [Azure PowerShell][powershell] - If you have an existing Linux-based cluster, you can use Ambari to add a Shared Access Signature to the cluster. If not, you can use Azure PowerShell to create a cluster and add a Shared Access Signature during cluster creation.

    > [!IMPORTANT]
    > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

* The example files from [https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature](https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature). This repository contains the following items:

  * A Visual Studio project that can create a storage container, stored policy, and SAS for use with HDInsight
  * A Python script that can create a storage container, stored policy, and SAS for use with HDInsight
  * A PowerShell script that can create a HDInsight cluster and configure it to use the SAS.

## Shared Access Signatures

There are two forms of Shared Access Signatures:

* Ad hoc: The start time, expiry time, and permissions for the SAS are all specified on the SAS URI.

* Stored access policy: A stored access policy is defined on a resource container, such as a blob container. A policy can be used to manage constraints for one or more shared access signatures. When you associate a SAS with a stored access policy, the SAS inherits the constraints - the start time, expiry time, and permissions - defined for the stored access policy.

The difference between the two forms is important for one key scenario: revocation. A SAS is a URL, so anyone who obtains the SAS can use it, regardless of who requested it to begin with. If a SAS is published publicly, it can be used by anyone in the world. A SAS that is distributed is valid until one of four things happens:

1. The expiry time specified on the SAS is reached.

2. The expiry time specified on the stored access policy referenced by the SAS is reached. The following scenarios cause the expiry time to be reached:

    * The time interval has elapsed.
    * The stored access policy is modified to have an expiry time in the past. Changing the expiry time is one way to revoke the SAS.

3. The stored access policy referenced by the SAS is deleted, which is another way to revoke the SAS. If you recreate the stored access policy with the same name, all  SAS tokens for the previous policy are valid (if the expiry time on the SAS has not passed). If you intend to revoke the SAS, be sure to use a different name if you recreate the access policy with an expiry time in the future.

4. The account key that was used to create the SAS is regenerated. Regenerating the key causes all applications that use the previous key to fail authentication. Update all components to the new key.

> [!IMPORTANT]
> A shared access signature URI is associated with the account key used to create the signature, and the associated stored access policy (if any). If no stored access policy is specified, the only way to revoke a shared access signature is to change the account key.

We recommend that you always use stored access policies. When using stored policies, you can either revoke signatures or extend the expiry date as needed. The steps in this document use stored access policies to generate SAS.

For more information on Shared Access Signatures, see [Understanding the SAS model](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

### Create a stored policy and SAS using C\#

1. Open the solution in Visual Studio.

2. In Solution Explorer, right-click on the **SASToken** project and select **Properties**.

3. Select **Settings** and add values for the following entries:

   * StorageConnectionString: The connection string for the storage account that you want to create a stored policy and SAS for. The format should be `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey` where `myaccount` is the name of your storage account and `mykey` is the key for the storage account.

   * ContainerName: The container in the storage account that you want to restrict access to.

   * SASPolicyName: The name to use for the stored policy to create.

   * FileToUpload: The path to a file that is uploaded to the container.

4. Run the project. Information similar to the following text is displayed once the SAS has been generated:

        Container SAS token using stored access policy: sr=c&si=policyname&sig=dOAi8CXuz5Fm15EjRUu5dHlOzYNtcK3Afp1xqxniEps%3D&sv=2014-02-14

    Save the SAS policy token, storage account name, and container name. These values are used when associating the storage account with your HDInsight cluster.

### Create a stored policy and SAS using Python

1. Open the SASToken.py file and change the following values:

   * policy\_name: The name to use for the stored policy to create.

   * storage\_account\_name: The name of your storage account.

   * storage\_account\_key: The key for the storage account.

   * storage\_container\_name: The container in the storage account that you want to restrict access to.

   * example\_file\_path: The path to a file that is uploaded to the container.

2. Run the script. It displays the SAS token similar to the following text when the script completes:

        sr=c&si=policyname&sig=dOAi8CXuz5Fm15EjRUu5dHlOzYNtcK3Afp1xqxniEps%3D&sv=2014-02-14

    Save the SAS policy token, storage account name, and container name. These values are used when associating the storage account with your HDInsight cluster.

## Use the SAS with HDInsight

When creating an HDInsight cluster, you must specify a primary storage account and you can optionally specify additional storage accounts. Both of these methods of adding storage require full access to the storage accounts and containers that are used.

To use a Shared Access Signature to limit access to a container, add a custom entry to the **core-site** configuration for the cluster.

* For **Windows-based** or **Linux-based** HDInsight clusters, you can add the entry during cluster creation using PowerShell.
* For **Linux-based** HDInsight clusters, change the configuration after cluster creation using Ambari.

### Create a cluster that uses the SAS

An example of creating an HDInsight cluster that uses the SAS is included in the `CreateCluster` directory of the repository. To use it, use the following steps:

1. Open the `CreateCluster\HDInsightSAS.ps1` file in a text editor and modify the following values at the beginning of the document.

    ```powershell
    # Replace 'mycluster' with the name of the cluster to be created
    $clusterName = 'mycluster'
    # Valid values are 'Linux' and 'Windows'
    $osType = 'Linux'
    # Replace 'myresourcegroup' with the name of the group to be created
    $resourceGroupName = 'myresourcegroup'
    # Replace with the Azure data center you want to the cluster to live in
    $location = 'North Europe'
    # Replace with the name of the default storage account to be created
    $defaultStorageAccountName = 'mystorageaccount'
    # Replace with the name of the SAS container created earlier
    $SASContainerName = 'sascontainer'
    # Replace with the name of the SAS storage account created earlier
    $SASStorageAccountName = 'sasaccount'
    # Replace with the SAS token generated earlier
    $SASToken = 'sastoken'
    # Set the number of worker nodes in the cluster
    $clusterSizeInNodes = 3
    ```

    For example, change `'mycluster'` to the name of the cluster you want to create. The SAS values should match the values from the previous steps when creating a storage account and SAS token.

    Once you have changed the values, save the file.

2. Open a new Azure PowerShell prompt. If you are unfamiliar with Azure PowerShell, or have not installed it, see [Install and configure Azure PowerShell][powershell].

1. From the prompt, use the following command to authenticate to your Azure subscription:

    ```powershell
    Connect-AzureRmAccount
    ```

    When prompted, log in with the account for your Azure subscription.

    If your account is associated with multiple Azure subscriptions, you may need to use `Select-AzureRmSubscription` to select the subscription you wish to use.

4. From the prompt, change directories to the `CreateCluster` directory that contains the HDInsightSAS.ps1 file. Then use the following command to run the script

    ```powershell
    .\HDInsightSAS.ps1
    ```

    As the script runs, it logs output to the PowerShell prompt as it creates the resource group and storage accounts. You are prompted to enter the HTTP user for the HDInsight cluster. This account is used to secure HTTP/s access to the cluster.

    If you are creating a Linux-based cluster, you are prompted for an SSH user account name and password. This account is used to remotely log in to the cluster.

   > [!IMPORTANT]
   > When prompted for the HTTP/s or SSH user name and password, you must provide a password that meets the following criteria:
   >
   > * Must be at least 10 characters in length
   > * Must contain at least one digit
   > * Must contain at least one non-alphanumeric character
   > * Must contain at least one upper or lower case letter

It takes a while for this script to complete, usually around 15 minutes. When the script completes without any errors, the cluster has been created.

### Use the SAS with an existing cluster

If you have an existing Linux-based cluster, you can add the SAS to the **core-site** configuration by using the following steps:

1. Open the Ambari web UI for your cluster. The address for this page is https://YOURCLUSTERNAME.azurehdinsight.net. When prompted, authenticate to the cluster using the admin name (admin) and password you used when creating the cluster.

2. From the left side of the Ambari web UI, select **HDFS** and then select the **Configs** tab in the middle of the page.

3. Select the **Advanced** tab, and then scroll until you find the **Custom core-site** section.

4. Expand the **Custom core-site** section, then scroll to the end and select the **Add property...** link. Use the following values for the **Key** and **Value** fields:

   * **Key**: fs.azure.sas.CONTAINERNAME.STORAGEACCOUNTNAME.blob.core.windows.net
   * **Value**: The SAS returned by the C# or Python application you ran previously

     Replace **CONTAINERNAME** with the container name you used with the C# or SAS application. Replace **STORAGEACCOUNTNAME** with the storage account name you used.

5. Click the **Add** button to save this key and value, then click the **Save** button to save the configuration changes. When prompted, add a description of the change ("adding SAS storage access" for example) and then click **Save**.

    Click **OK** when the changes have been completed.

   > [!IMPORTANT]
   > You must restart several services before the change takes effect.

6. In the Ambari web UI, select **HDFS** from the list on the left, and then select **Restart All Affected** from the **Service Actions** drop down list on the right. When prompted, select __Confirm Restart All__.

    Repeat this process for MapReduce2 and YARN.

7. Once the services have restarted, select each one and disable maintenance mode from the **Service Actions** drop down.

## Test restricted access

To verify that you have restricted access, use the following methods:

* For **Windows-based** HDInsight clusters, use Remote Desktop to connect to the cluster. For more information, see [Connect to HDInsight using RDP](hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp).

    Once connected, use the **Hadoop Command-Line** icon on the desktop to open a command prompt.

* For **Linux-based** HDInsight clusters, use SSH to connect to the cluster. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

Once connected to the cluster, use the following steps to verify that you can only read and list items on the SAS storage account:

1. To list the contents of the container, use the following command from the prompt: 

    ```bash
    hdfs dfs -ls wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/
    ```

    Replace **SASCONTAINER** with the name of the container created for the SAS storage account. Replace **SASACCOUNTNAME** with the name of the storage account used for the SAS.

    The list includes the file uploaded when the container and SAS were created.

2. Use the following command to verify that you can read the contents of the file. Replace the **SASCONTAINER** and **SASACCOUNTNAME** as in the previous step. Replace **FILENAME** with the name of the file displayed in the previous command:

    ```bash
    hdfs dfs -text wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/FILENAME
    ```

    This command lists the contents of the file.

3. Use the following command to download the file to the local file system:

    ```bash
    hdfs dfs -get wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/FILENAME testfile.txt
    ```

    This command downloads the file to a local file named **testfile.txt**.

4. Use the following command to upload the local file to a new file named **testupload.txt** on the SAS storage:

    ```bash
    hdfs dfs -put testfile.txt wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/testupload.txt
    ```

    You receive a message similar to the following text:

        put: java.io.IOException

    This error occurs because the storage location is read+list only. Use the following command to put the data on the default storage for the cluster, which is writable:

    ```bash
    hdfs dfs -put testfile.txt wasb:///testupload.txt
    ```

    This time, the operation should complete successfully.

## Troubleshooting

### A task was canceled

**Symptoms**: When creating a cluster using the PowerShell script, you may receive the following error message:

    New-AzureRmHDInsightCluster : A task was canceled.
    At C:\Users\larryfr\Documents\GitHub\hdinsight-azure-storage-sas\CreateCluster\HDInsightSAS.ps1:62 char:5
    +     New-AzureRmHDInsightCluster `
    +     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : NotSpecified: (:) [New-AzureRmHDInsightCluster], CloudException
        + FullyQualifiedErrorId : Hyak.Common.CloudException,Microsoft.Azure.Commands.HDInsight.NewAzureHDInsightClusterCommand

**Cause**: This error can occur if you use a password for the admin/HTTP user for the cluster, or (for Linux-based clusters) the SSH user.

**Resolution**: Use a password that meets the following criteria:

* Must be at least 10 characters in length
* Must contain at least one digit
* Must contain at least one non-alphanumeric character
* Must contain at least one upper or lower case letter

## Next steps

Now that you have learned how to add limited-access storage to your HDInsight cluster, learn other ways to work with data on your cluster:

* [Use Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Use Pig with HDInsight](hadoop/hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hadoop/hdinsight-use-mapreduce.md)

[powershell]: /powershell/azureps-cmdlets-docs
