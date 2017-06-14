---
title: "PowerShell: Azure HDInsight cluster with Data Lake Store as default storage | Microsoft Docs"
description: Use Azure PowerShell to create and use HDInsight clusters with Azure Data Lake
services: data-lake-store,hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 8917af15-8e37-46cf-87ad-4e6d5d67ecdb
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/02/2017
ms.author: nitinme

---
# Use Azure PowerShell to create an HDInsight cluster with Data Lake Store (as default storage)
> [!div class="op_single_selector"]
> * [Using Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
> * [Using PowerShell (for default storage)](data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
> * [Using PowerShell (for additional storage)](data-lake-store-hdinsight-hadoop-use-powershell.md)
> * [Using Resource Manager](data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)
>
>

Learn how to use Azure PowerShell to configure an HDInsight cluster with Azure Data Lake Store, **as default storage**. For instructions on how to create an HDInsight cluster with Azure Data Lake Store as additional storage, see [Create an HDInsight cluster with Data Lake Store as additional storage](data-lake-store-hdinsight-hadoop-use-powershell.md).

## Using Data Lake Store for HDInsight cluster storage

Here are some important considerations for using HDInsight with Data Lake Store:

* Option to create HDInsight clusters with access to Data Lake Store as default storage is available for HDInsight version 3.5.

* Option to create HDInsight clusters with access to Data Lake Store as default storage is not available for HDInsight Premium clusters.

* For HBase clusters (Windows and Linux), Data Lake Store is **not supported** as a storage option, for both default storage as well as additional storage.


Configuring HDInsight to work with Data Lake Store using PowerShell involves the following steps:

* Create an Azure Data Lake Store
* Set up authentication for role-based access to Data Lake Store
* Create HDInsight cluster with authentication to Data Lake Store
* Run a test job on the cluster

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Azure PowerShell 1.0 or greater**. See [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).
* **Windows SDK**. You can install it from [here](https://dev.windows.com/en-us/downloads). You use this to create a security certificate.
* **Azure Active Directory Service Principal**. Steps in this tutorial provide instructions on how to create a service principal in Azure AD. However, you must be an Azure AD administrator to be able to create a service principal. If you are an Azure AD administrator, you can skip this prerequisite and proceed with the tutorial.

    **If you are not an Azure AD administrator**, you will not be able to perform the steps required to create a service principal. In such a case, your Azure AD administrator must first create a service principal before you can create an HDInsight cluster with Data Lake Store. Also, the service principal must be created using a certificate, as described at [Create a service principal with certificate](../azure-resource-manager/resource-group-authenticate-service-principal.md#create-service-principal-with-certificate).

## Create an Azure Data Lake Store
Follow these steps to create a Data Lake Store.

1. From your desktop, open a new Azure PowerShell window, and enter the following snippet. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

        # Log in to your Azure account
        Login-AzureRmAccount

        # List all the subscriptions associated to your account
        Get-AzureRmSubscription

        # Select a subscription
        Set-AzureRmContext -SubscriptionId <subscription ID>

        # Register for Data Lake Store
        Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.DataLakeStore"

   > [!NOTE]
   > If you receive an error similar to `Register-AzureRmResourceProvider : InvalidResourceNamespace: The resource namespace 'Microsoft.DataLakeStore' is invalid` when registering the Data Lake Store resource provider, it is possible that your subsrcription is not whitelisted for Azure Data Lake Store. Make sure you enable your Azure subscription for Data Lake Store public preview by following these [instructions](data-lake-store-get-started-portal.md).
   >
   >
2. An Azure Data Lake Store account is associated with an Azure Resource Group. Start by creating an Azure Resource Group.

        $resourceGroupName = "<your new resource group name>"
        New-AzureRmResourceGroup -Name $resourceGroupName -Location "East US 2"

    ![Create an Azure Resource Group](./media/data-lake-store-hdinsight-hadoop-use-powershell/ADL.PS.CreateResourceGroup.png "Create an Azure Resource Group")
3. Create an Azure Data Lake Store account. The account name you specify must only contain lowercase letters and numbers.

        $dataLakeStoreName = "<your new Data Lake Store name>"
        New-AzureRmDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStoreName -Location "East US 2"

    ![Create an Azure Data Lake account](./media/data-lake-store-hdinsight-hadoop-use-powershell/ADL.PS.CreateADLAcc.png "Create an Azure Data Lake account")
4. Verify that the account is successfully created.

        Test-AzureRmDataLakeStoreAccount -Name $dataLakeStoreName

    The output for this should be **True**.

5. Using Data Lake Store as default storage requires you to specify a root path where the cluster-specific files are copied during cluster creation. Use the cmdlets below to create a root path, which in the snippet below is **/clusters/hdiadlcluster**.

        $myrootdir = "/"
        New-AzureRmDataLakeStoreItem -Folder -AccountName $dataLakeStoreName -Path $myrootdir/clusters/hdiadlcluster


## Set up authentication for role-based access to Data Lake Store
Every Azure subscription is associated with an Azure Active Directory. Users and services that access resources of the subscription using the Azure Classic Portal or Azure Resource Manager API must first authenticate with that Azure Active Directory. Access is granted to Azure subscriptions and services by assigning them the appropriate role on an Azure resource.  For services, a service principal identifies the service in the Azure Active Directory (AAD). This section illustrates how to grant an application service, like HDInsight, access to an Azure resource (the Azure Data Lake Store account you created earlier) by creating a service principal for the application and assigning roles to that via Azure PowerShell.

To set up Active Directory authentication for Azure Data Lake, you must perform the following tasks.

* Create a self-signed certificate
* Create an application in Azure Active Directory and a Service Principal

### Create a self-signed certificate
Make sure you have [Windows SDK](https://dev.windows.com/en-us/downloads) installed before proceeding with the steps in this section. You must have also created a directory, such as **C:\mycertdir**, where the certificate will be created.

1. From the PowerShell window, navigate to the location where you installed Windows SDK (typically, `C:\Program Files (x86)\Windows Kits\10\bin\x86` and use the [MakeCert][makecert] utility to create a self-signed certificate and a private key. Use the following commands.

        $certificateFileDir = "<my certificate directory>"
        cd $certificateFileDir
        
        makecert -sv mykey.pvk -n "cn=HDI-ADL-SP" CertFile.cer -r -len 2048

    You will be prompted to enter the private key password. After the command successfully executes, you should see a **CertFile.cer** and **mykey.pvk** in the certificate directory you specified.
2. Use the [Pvk2Pfx][pvk2pfx] utility to convert the .pvk and .cer files that MakeCert created to a .pfx file. Run the following command.

        pvk2pfx -pvk mykey.pvk -spc CertFile.cer -pfx CertFile.pfx -po <password>

    When prompted enter the private key password you specified earlier. The value you specify for the **-po** parameter is the password that is associated with the .pfx file. After the command successfully completes, you should also see a CertFile.pfx in the certificate directory you specified.

### Create an Azure Active Directory and a service principal
In this section, you perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing a certificate. Run the following commands to create an application in Azure Active Directory.

1. Paste the following cmdlets in the PowerShell console window. Make sure the value you specify for the **-DisplayName** property is unique. Also, the values for **-HomePage** and **-IdentiferUris** are placeholder values and are not verified.

        $certificateFilePath = "$certificateFileDir\CertFile.pfx"

        $password = Read-Host –Prompt "Enter the password" # This is the password you specified for the .pfx file

        $certificatePFX = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certificateFilePath, $password)

        $rawCertificateData = $certificatePFX.GetRawCertData()

        $credential = [System.Convert]::ToBase64String($rawCertificateData)

        $application = New-AzureRmADApplication `
            -DisplayName "HDIADL" `
            -HomePage "https://contoso.com" `
            -IdentifierUris "https://mycontoso.com" `
            -CertValue $credential  `
            -StartDate $certificatePFX.NotBefore  `
            -EndDate $certificatePFX.NotAfter

        $applicationId = $application.ApplicationId
2. Create a service principal using the application ID.

        $servicePrincipal = New-AzureRmADServicePrincipal -ApplicationId $applicationId

        $objectId = $servicePrincipal.Id
3. Grant the service principal access to the Data Lake Store root and all the folders in the root path that you specified earlier. Use the cmdlets below.

		Set-AzureRmDataLakeStoreItemAclEntry -AccountName $dataLakeStoreName -Path / -AceType User -Id $objectId -Permissions All
		Set-AzureRmDataLakeStoreItemAclEntry -AccountName $dataLakeStoreName -Path /clusters -AceType User -Id $objectId -Permissions All
		Set-AzureRmDataLakeStoreItemAclEntry -AccountName $dataLakeStoreName -Path /clusters/hdiadlcluster -AceType User -Id $objectId -Permissions All

## Create an HDInsight Linux cluster with Data Lake Store as default storage

In this section, we create an HDInsight Hadoop Linux cluster with Data Lake Store as default storage. For this release, the HDInsight cluster and the Data Lake Store must be in the same location.

1. Start with retrieving the subscription tenant ID. You will need that later.

        $tenantID = (Get-AzureRmContext).Tenant.TenantId
        
2. Create the HDInsight cluster. Use the following cmdlets.

        # Set these variables
        
		$location = "East US 2"
        $storageAccountName = $dataLakeStoreName   					   # Data Lake Store account name
		$storageRootPath = "<Storage root path you specified earlier>" # E.g. /clusters/hdiadlcluster
		$clusterName = $containerName                   # As a best practice, have the same name for the cluster and container
        $clusterNodes = <ClusterSizeInNodes>            # The number of nodes in the HDInsight cluster
        $httpCredentials = Get-Credential
        $sshCredentials = Get-Credential

        New-AzureRmHDInsightCluster `
               -ClusterType Hadoop `
               -OSType Linux `
               -ClusterSizeInNodes $clusterNodes `
               -ResourceGroupName $resourceGroupName `
               -ClusterName $clusterName `
               -HttpCredential $httpCredentials `
               -Location $location `
               -DefaultStorageAccountType AzureDataLakeStore `
               -DefaultStorageAccountName "$storageAccountName.azuredatalakestore.net" `
               -DefaultStorageRootPath $storageRootPath `
               -Version "3.5" `
               -SshCredential $sshCredentials `
               -AadTenantId $tenantId `
               -ObjectId $objectId `
               -CertificateFilePath $certificateFilePath `
               -CertificatePassword $password

    After the cmdlet successfully completes, you should see an output listing the cluster details.

        
## Run test jobs on the HDInsight cluster to use the Data Lake Store
After you have configured an HDInsight cluster, you can run test jobs on the cluster to test that the HDInsight cluster can access Data Lake Store. To do so, we will run a sample Hive job that creates a table using the sample data that is already available in the Data Lake Store at **<cluster root>/example/data/sample.log**.

In this section you will SSH into the HDInsight Linux cluster you created and run the a sample Hive query.

* If you are using a Windows client to SSH into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](../hdinsight/hdinsight-hadoop-linux-use-ssh-windows.md).
* If you are using a Linux client to SSH into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Linux](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md)

1. Once connected, start the Hive CLI by using the following command:

        hive
2. Using the CLI, enter the following statements to create a new table named **vehicles** by using the sample data in the Data Lake Store:

        DROP TABLE log4jLogs;
		CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
		STORED AS TEXTFILE LOCATION 'adl:///example/data/';
		SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log' GROUP BY t4;

    You should see the query output on the SSH console. 

	> [!NOTE]
   	> The path to the sample data in the CREATE TABLE command above is `adl:///example/data/`, where `adl:///` is the cluster root. Taking the example of the cluster root specified in this tutorial, this will be `adl://hdiadlstore.azuredatalakestore.net/clusters/hdiadlcluster`. So, you could either use the shorter alternative or provide the complete path to the cluster root. 
   	>
   	>



## Access Data Lake Store using HDFS commands
Once you have configured the HDInsight cluster to use Data Lake Store, you can use the HDFS shell commands to access the store.

In this section you will SSH into the HDInsight Linux cluster you created and run the HDFS commands. 

* If you are using a Windows client to SSH into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](../hdinsight/hdinsight-hadoop-linux-use-ssh-windows.md).
* If you are using a Linux client to SSH into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Linux](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md)

Once connected, use the following HDFS filesystem command to list the files in the Data Lake Store.

    hdfs dfs -ls adl:///

You can also use the `hdfs dfs -put` command to upload some files to the Data Lake Store, and then use `hdfs dfs -ls` to verify whether the files were successfully uploaded.

## See Also
* [Portal: Create an HDInsight cluster to use Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)

[makecert]: https://msdn.microsoft.com/library/windows/desktop/ff548309(v=vs.85).aspx
[pvk2pfx]: https://msdn.microsoft.com/library/windows/desktop/ff550672(v=vs.85).aspx
