<properties
pageTitle="Restrict HDInsight access to data using Shared Access Signatures"
description="Learn how to use Shared Access Signatures to restrict HDInsight access to data stored in Azure storage blobs."
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="07/05/2016"
ms.author="larryfr"/>

#Use Azure Storage Shared Access Signatures to restrict access to data with HDInsight

HDInsight uses Azure storage Blobs for data storage. While HDInsight must have full access to the blob used as default storage for the cluster, you can restrict permissions to data stored in other blobs used by the cluster. For example, you may want to make some data read-only. You can do this using Shared Access Signatures.

Shared Access Signatures (SAS) are a feature of Azure storage accounts that allows you to limit access to data. For example, providing read-only access to data. In this document, you will learn how to use SAS to enable read and list-only access to a blob container from HDInsight.

##Requirements

* An Azure subscription

* C# or Python. C# example code is provided as a Visual Studio solution.

    * Visual Studio must be version 2013 or 2015
    
    * Python must be version 2.7 or higher

* A Linux-based HDInsight cluster OR [Azure PowerShell][powershell] - If you have an existing Linux-based cluster, you can use Ambari to add a Shared Access Signature to the cluster. If not, you can use Azure PowerShell to create a new cluster and add a Shared Access Signature during cluster creation.

* The example files from [https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature](https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature). This repository has the following:

    * A Visual Studio project that can create a storage container, stored policy, and SAS for use with HDInsight
    
    * A Python script that can create a storage container, stored policy, and SAS for use with HDInsight
    
    * A PowerShell script that can create a new HDInsight cluster and configure it to use the SAS.

##Shared Access Signatures

There are two forms of Shared Access Signatures:

* Ad hoc: The start time, expiry time, and permissions for the SAS are all specified on the SAS URI (or implied, in the case where start time is omitted).

* Stored access policy: A stored access policy is defined on a resource container - a blob container, table, queue, or file share - and can be used to manage constraints for one or more shared access signatures. When you associate a SAS with a stored access policy, the SAS inherits the constraints - the start time, expiry time, and permissions - defined for the stored access policy.

The difference between the two forms is important for one key scenario: revocation. A SAS is a URL, so anyone who obtains the SAS can use it, regardless of who requested it to begin with. If a SAS is published publicly, it can be used by anyone in the world. A SAS that is distributed is valid until one of four things happens:

1. The expiry time specified on the SAS is reached.

2. The expiry time specified on the stored access policy referenced by the SAS is reached (if a stored access policy is referenced, and if it specifies an expiry time). This can either occur because the interval elapses, or because you have modified the stored access policy to have an expiry time in the past, which is one way to revoke the SAS.

3. The stored access policy referenced by the SAS is deleted, which is another way to revoke the SAS. Note that if you recreate the stored access policy with exactly the same name, all existing SAS tokens will again be valid according to the permissions associated with that stored access policy (assuming that the expiry time on the SAS has not passed). If you are intending to revoke the SAS, be sure to use a different name if you recreate the access policy with an expiry time in the future.

4. The account key that was used to create the SAS is regenerated. Note that doing this will cause all application components using that account key to fail to authenticate until they are updated to use either the other valid account key or the newly regenerated account key.

> [AZURE.IMPORTANT] A shared access signature URI is associated with the account key used to create the signature, and the associated stored access policy (if any). If no stored access policy is specified, the only way to revoke a shared access signature is to change the account key. 

It is recommended that you always use stored access policies, so that you can either revoke signatures or extend the expiry date as needed. The steps in this document use stored access policies to generate SAS.

For more information on Shared Access Signatures, see [Understanding the SAS model](../storage/storage-dotnet-shared-access-signature-part-1.md).

##Create a stored policy and generate a SAS

Currently you must create a stored policy programmatically. You can find both the C# and Python example of creating a stored policy and SAS at [https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature](https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature).

###Create a stored policy and SAS using C\#

1. Open the solution in Visual Studio.

2. In Solution Explorer, right-click on the __SASToken__ project and select __Properties__.

3. Select __Settings__ and add values for the following entries:

    * StorageConnectionString: The connection string for the storage account that you want to create a stored policy and SAS for. The format should be `DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey` where `myaccount` is the name of your storage account and `mykey` is the key for the storage account.
    
    * ContainerName: The container in the storage account that you want to restrict access to.
    
    * SASPolicyName: The name to use for the stored policy that will be created.
    
    * FileToUpload: The path to a file that will be uploaded to the container.
    
4. Run the project. A console window will appear, and information similar to the following will be displayed once the SAS has been generated:

        Container SAS token using stored access policy: sr=c&si=policyname&sig=dOAi8CXuz5Fm15EjRUu5dHlOzYNtcK3Afp1xqxniEps%3D&sv=2014-02-14
        
    Save the SAS policy token, as you will need this when associating the storage account with your HDInsight cluster. You will also need the storage account name, and the container name.
    
###Create a stored policy and SAS using Python

1. Open the SASToken.py file and change the following values:

    * policy\_name: The name to use for the stored policy that will be created.
    
    * storage\_account\_name: The name of your storage account.
    
    * storage\_account\_key: The key for the storage account.
    
    * storage\_container\_name: The container in the storage account that you want to restrict access to.
    
    * example\_file\_path: The path to a file that will be uploaded to the container

2. Run the script. It will display the SAS token similar to the following when the script completes:

        sr=c&si=policyname&sig=dOAi8CXuz5Fm15EjRUu5dHlOzYNtcK3Afp1xqxniEps%3D&sv=2014-02-14
    
    Save the SAS policy token, as you will need this when associating the storage account with your HDInsight cluster. You will also need the storage account name, and the container name.
    
##Use the SAS with HDInsight

When creating an HDInsight cluster, you must specify a primary storage account and you can optionally specify additional storage accounts. Both of these methods of adding storage require full access to the storage accounts and containers that are used.

In order to use a Shared Access Signature to limit access to a container, you must add a custom entry to the __core-site__ configuration for the cluster.

* For __Windows-based__ or __Linux-based__ HDInsight clusters, you can do this during cluster creation using PowerShell.

* For __Linux-based__ HDInsight clusters, you change the configuration after cluster creation using Ambari.

###Create a new cluster that uses the SAS

An example of creating an HDInsight cluster that uses the SAS is included in the `CreateCluster` directory of the repository. To use it, use the following steps:

1. Open the `CreateCluster\HDInsightSAS.ps1` file in a text editor and modify the following values at the beginning of the document.

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
        $clusterSizeInNodes = 2
        
    For example, change `'mycluster'` to the name of the cluster you want to create. The SAS values should match the values from the previous steps when creating a storage account and SAS token.
    
    Once you have changed the values, save the file.

1. Open a new Azure PowerShell prompt. If you are unfamiliar with Azure PowerShell, or have not installed it, see [Install and configure Azure PowerShell][powershell].

2. From the prompt, use the following to authenticate to your Azure subscription:

        Login-AzureRmAccount
    
    When prompted, login with the account for your Azure subscription.
    
    If your login is associated with multiple Azure subscriptions, you may need to use `Select-AzureRmSubscription` to select the subscription you wish to use.

2. From the prompt, change directories to the `CreateCluster` directory that contains the HDInsightSAS.ps1 file. Then use the following to run the script
        
        .\HDInsightSAS.ps1
    
    As the script runs, it will log output to the PowerShell prompt as it creates the resource group and storage accounts. It will then prompt you to enter the HTTP user for the HDInsight cluster. This is the user account used to secure HTTP/s access to the cluster.
    
    If you are creating a Linux-based cluster, you will also be prompted for an SSH user account name and password. This is used to remotely login to the cluster.
    
    > [AZURE.IMPORTANT] When prompted for the HTTP/s or SSH user name and password, you must provide a password that meets the following criteria:
    >
    > - Must be at least 10 characters in length
    > - Must contain at least one digit
    > - Must contain at least one non-alphanumeric character
    > - Must contain at least one upper or lower case letter


It will take a while for this script to complete, usually around 15 minutes. When the script completes without any errors, the cluster has been created.

###Update an existing cluster to use the SAS

If you have an existing Linux-based cluster, you can add the SAS to the __core-site__ configuration by using the following steps:

1. Open the Ambari web UI for your cluster. The address for this page is https://YOURCLUSTERNAME.azurehdinsight.net. When prompted, authenticate to the cluster using the admin name (admin,) and password you used when creating the cluster.

2. From the left side of the Ambari web UI, select __HDFS__ and then select the __Configs__ tab in the middle of the page.

3. Select the __Advanced__ tab, and then scroll until you find the __Custom core-site__ section.

4. Expand the __Custom core-site__ section, then scroll to the end and select the __Add property...__ link. Use the following values for the __Key__ and __Value__ fields:

    * __Key__: fs.azure.sas.CONTAINERNAME.STORAGEACCOUNTNAME.blob.core.windows.net
    
    * __Value__: The SAS returned by the C# or Python application you ran previously
    
    Replace __CONTAINERNAME__ with the container name you used with the C# or SAS application. Replace __STORAGEACCOUNTNAME__ with the storage account name you used.

5. Click the __Add__ button to save this key and value, then click the __Save__ button to save the configuration changes. When prompted, add a description of the change ("adding SAS storage access" for example,) and then click __Save__.

    Click __OK__ when the changes have been completed.

    > [AZURE.IMPORTANT] This saves the configuration changes, but you must restart several services before the change takes effect.

6. In the Ambari web UI, select __HDFS__ from the list on the left, and then select __Restart All__ from the __Service Actions__ drop down list on the right. When prompted, select __Turn on maintenance mode__ and then select __Conform Restart All".

    Repeat this process for the MapReduce2 and YARN entries from the list on the left of the page.

7. Once these have restarted, select each one and disable maintenance mode from the __Service Actions__ drop down.

##Test restricted access

To verify that you have restricted access, use the following methods:

* For __Windows-based__ HDInsight clusters, use Remote Desktop to connect to the cluster. See [Connecto to HDInsight using RDP](hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp) for more information.

    Once connected, use the __Hadoop Command Line__ icon on the desktop to open a command prompt.

* For __Linux-based__ HDInsight clusters, use SSH to connect to the cluster. See one of the following for information on using SSH with Linux-based clusters:

    * [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X, and Unix](hdinsight-hadoop-linux-use-ssh-unix.md)
    * [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
    
Once connected to the cluster, use the following steps to verify that you can only read and list items on the SAS storage account:

1. From the prompt, type the following. Replace __SASCONTAINER__ with the name of the container created for the SAS storage account. Replace __SASACCOUNTNAME__ with the name of the storage account used for the SAS:

        hdfs dfs -ls wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/
    
    This will list the contents of the container, which should include the file that was uploaded when the container and SAS was created.
    
2. Use the following to verify that you can read the contents of the file. Replace the __SASCONTAINER__ and __SASACCOUNTNAME__ as in the previous step. Replace __FILENAME__ with the name of the file displayed in the previous command:

        hdfs dfs -text wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/FILENAME
        
    This will list the contents of the file.
    
3. Use the following to download the file to the local file system:

        hdfs dfs -get wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/FILENAME testfile.txt
    
    This will download the file to a local file named __testfile.txt__.

4. Use the following to upload the local file to a new file named __testupload.txt__ on the SAS storage:

        hdfs dfs -put testfile.txt wasb://SASCONTAINER@SASACCOUNTNAME.blob.core.windows.net/testupload.txt
    
    You will receive a message similar to the following:
    
        put: java.io.IOException
        
    This error occurs because the storage location is read+list only. Use the following to put the data on the default storage for the cluster, which is writable:
    
        hdfs dfs -put testfile.txt wasb:///testupload.txt
        
    This time, the operation should complete successfully.
    
##Troubleshooting

###A task was canceled

__Symptoms__: When creating a cluster using the PowerShell script, you may receive the following error message:

    New-AzureRmHDInsightCluster : A task was canceled.
    At C:\Users\larryfr\Documents\GitHub\hdinsight-azure-storage-sas\CreateCluster\HDInsightSAS.ps1:62 char:5
    +     New-AzureRmHDInsightCluster `
    +     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : NotSpecified: (:) [New-AzureRmHDInsightCluster], CloudException
        + FullyQualifiedErrorId : Hyak.Common.CloudException,Microsoft.Azure.Commands.HDInsight.NewAzureHDInsightClusterCommand

__Cause__: This error can occur if you use a password for the admin/HTTP user for the cluster, or (for Linux-based clusters,) the SSH user.

__Resolution__: Use a password that meets the following criteria:

- Must be at least 10 characters in length
- Must contain at least one digit
- Must contain at least one non-alphanumeric character
- Must contain at least one upper or lower case letter

##Next steps

Now that you have learned how to add limited-access storage to your HDInsight cluster, learn other ways to work with data on your cluster:

* [Use Hive with HDInsight](hdinsight-use-hive.md)

* [Use Pig with HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

[powershell]: ../powershell-install-configure.md