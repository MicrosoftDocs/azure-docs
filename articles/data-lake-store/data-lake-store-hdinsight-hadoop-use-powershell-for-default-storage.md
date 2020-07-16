---
title: PowerShell - HDInsight cluster with Data Lake Storage Gen1 - Azure
description: Use Azure PowerShell to create and use Azure HDInsight clusters with Azure Data Lake Storage Gen1.

author: twooley
ms.service: data-lake-store
ms.topic: how-to
ms.date: 05/29/2018
ms.author: twooley

---
# Create HDInsight clusters with Azure Data Lake Storage Gen1 as default storage by using PowerShell

> [!div class="op_single_selector"]
> * [Use the Azure portal](data-lake-store-hdinsight-hadoop-use-portal.md)
> * [Use PowerShell (for default storage)](data-lake-store-hdinsight-hadoop-use-powershell-for-default-storage.md)
> * [Use PowerShell (for additional storage)](data-lake-store-hdinsight-hadoop-use-powershell.md)
> * [Use Resource Manager](data-lake-store-hdinsight-hadoop-use-resource-manager-template.md)

Learn how to use Azure PowerShell to configure Azure HDInsight clusters with Azure Data Lake Storage Gen1, as default storage. For instructions on creating an HDInsight cluster with Data Lake Storage Gen1 as additional storage, see [Create an HDInsight cluster with Data Lake Storage Gen1 as additional storage](data-lake-store-hdinsight-hadoop-use-powershell.md).

Here are some important considerations for using HDInsight with Data Lake Storage Gen1:

* The option to create HDInsight clusters with access to Data Lake Storage Gen1 as default storage is available for HDInsight version 3.5 and 3.6.

* The option to create HDInsight clusters with access to Data Lake Storage Gen1 as default storage is *not available* for HDInsight Premium clusters.

To configure HDInsight to work with Data Lake Storage Gen1 by using PowerShell, follow the instructions in the next five sections.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Before you begin this tutorial, make sure that you meet the following requirements:

* **An Azure subscription**: Go to [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Azure PowerShell 1.0 or greater**: See [How to install and configure PowerShell](/powershell/azure/overview).
* **Windows Software Development Kit (SDK)**: To install Windows SDK, go to [Downloads and tools for Windows 10](https://dev.windows.com/downloads). The SDK is used to create a security certificate.
* **Azure Active Directory service principal**: This tutorial describes how to create a service principal in Azure Active Directory (Azure AD). However, to create a service principal, you must be an Azure AD administrator. If you are an administrator, you can skip this prerequisite and proceed with the tutorial.

	>[!NOTE]
	>You can create a service principal only if you are an Azure AD administrator. Your Azure AD administrator must create a service principal before you can create an HDInsight cluster with Data Lake Storage Gen1. The service principal must be created with a certificate, as described in [Create a service principal with certificate](../active-directory/develop/howto-authenticate-service-principal-powershell.md#create-service-principal-with-certificate-from-certificate-authority).
	>

## Create a Data Lake Storage Gen1 account

To create a Data Lake Storage Gen1 account, do the following:

1. From your desktop, open a PowerShell window, and then enter the snippets below. When you are prompted to sign in, sign in as one of the subscription administrators or owners. 

        # Sign in to your Azure account
        Connect-AzAccount

        # List all the subscriptions associated to your account
        Get-AzSubscription

        # Select a subscription
        Set-AzContext -SubscriptionId <subscription ID>

        # Register for Data Lake Storage Gen1
        Register-AzResourceProvider -ProviderNamespace "Microsoft.DataLakeStore"

	> [!NOTE]
	> If you register the Data Lake Storage Gen1 resource provider and receive an error similar to `Register-AzResourceProvider : InvalidResourceNamespace: The resource namespace 'Microsoft.DataLakeStore' is invalid`, your subscription might not be whitelisted for Data Lake Storage Gen1. To enable your Azure subscription for Data Lake Storage Gen1, follow the instructions in [Get started with Azure Data Lake Storage Gen1 by using the Azure portal](data-lake-store-get-started-portal.md).
	>

2. A Data Lake Storage Gen1 account is associated with an Azure resource group. Start by creating a resource group.

        $resourceGroupName = "<your new resource group name>"
        New-AzResourceGroup -Name $resourceGroupName -Location "East US 2"

    You should see an output like this:

		ResourceGroupName : hdiadlgrp
		Location          : eastus2
		ProvisioningState : Succeeded
		Tags              :
		ResourceId        : /subscriptions/<subscription-id>/resourceGroups/hdiadlgrp

3. Create a Data Lake Storage Gen1 account. The account name you specify must contain only lowercase letters and numbers.

        $dataLakeStorageGen1Name = "<your new Data Lake Storage Gen1 name>"
        New-AzDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStorageGen1Name -Location "East US 2"

	You should see an output like the following:

		...
		ProvisioningState           : Succeeded
		State                       : Active
		CreationTime                : 5/5/2017 10:53:56 PM
		EncryptionState             : Enabled
		...
		LastModifiedTime            : 5/5/2017 10:53:56 PM
		Endpoint                    : hdiadlstore.azuredatalakestore.net
		DefaultGroup                :
		Id                          : /subscriptions/<subscription-id>/resourceGroups/hdiadlgrp/providers/Microsoft.DataLakeStore/accounts/hdiadlstore
		Name                        : hdiadlstore
		Type                        : Microsoft.DataLakeStore/accounts
		Location                    : East US 2
		Tags                        : {}

4. Using Data Lake Storage Gen1 as default storage requires you to specify a root path to which the cluster-specific files are copied during cluster creation. To create a root path, which is **/clusters/hdiadlcluster** in the  snippet, use the following cmdlets:

        $myrootdir = "/"
        New-AzDataLakeStoreItem -Folder -AccountName $dataLakeStorageGen1Name -Path $myrootdir/clusters/hdiadlcluster


## Set up authentication for role-based access to Data Lake Storage Gen1
Every Azure subscription is associated with an Azure AD entity. Users and services that access subscription resources by using the Azure portal or the Azure Resource Manager API must first authenticate with Azure AD. Access is granted to Azure subscriptions and services by assigning them the appropriate role on an Azure resource. For services, a service principal identifies the service in Azure AD.

This section illustrates how to grant an application service, such as HDInsight, access to an Azure resource (the Data Lake Storage Gen1 account that you created earlier). You do so by creating a service principal for the application and assigning roles to it via PowerShell.

To set up Active Directory authentication for Data Lake Storage Gen1, perform the tasks in the following two sections.

### Create a self-signed certificate
Make sure you have [Windows SDK](https://dev.windows.com/en-us/downloads) installed before proceeding with the steps in this section. You must have also created a directory, such as *C:\mycertdir*, where you create the certificate.

1. From the PowerShell window, go to the location where you installed Windows SDK (typically, *C:\Program Files (x86)\Windows Kits\10\bin\x86*) and use the [MakeCert][makecert] utility to create a self-signed certificate and a private key. Use the following commands:

        $certificateFileDir = "<my certificate directory>"
        cd $certificateFileDir

        makecert -sv mykey.pvk -n "cn=HDI-ADL-SP" CertFile.cer -r -len 2048

    You will be prompted to enter the private key password. After the command is successfully executed, you should see **CertFile.cer** and **mykey.pvk** in the certificate directory that you specified.
2. Use the [Pvk2Pfx][pvk2pfx] utility to convert the .pvk and .cer files that MakeCert created to a .pfx file. Run the following command:

        pvk2pfx -pvk mykey.pvk -spc CertFile.cer -pfx CertFile.pfx -po <password>

    When you are prompted, enter the private key password that you specified earlier. The value you specify for the **-po** parameter is the password that's associated with the .pfx file. After the command has been completed successfully, you should also see a **CertFile.pfx** in the certificate directory that you specified.

### Create an Azure AD and a service principal
In this section, you create a service principal for an Azure AD application, assign a role to the service principal, and authenticate as the service principal by providing a certificate. To create an application in Azure AD, run the following commands:

1. Paste the following cmdlets in the PowerShell console window. Make sure that the value you specify for the **-DisplayName** property is unique. The values for **-HomePage** and **-IdentiferUris** are placeholder values and are not verified.

        $certificateFilePath = "$certificateFileDir\CertFile.pfx"

        $password = Read-Host -Prompt "Enter the password" # This is the password you specified for the .pfx file

        $certificatePFX = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certificateFilePath, $password)

        $rawCertificateData = $certificatePFX.GetRawCertData()

        $credential = [System.Convert]::ToBase64String($rawCertificateData)

        $application = New-AzADApplication `
            -DisplayName "HDIADL" `
            -HomePage "https://contoso.com" `
            -IdentifierUris "https://mycontoso.com" `
            -CertValue $credential  `
            -StartDate $certificatePFX.NotBefore  `
            -EndDate $certificatePFX.NotAfter

        $applicationId = $application.ApplicationId
2. Create a service principal by using the application ID.

        $servicePrincipal = New-AzADServicePrincipal -ApplicationId $applicationId

        $objectId = $servicePrincipal.Id
3. Grant the service principal access to the Data Lake Storage Gen1 root and all the folders in the root path that you specified earlier. Use the following cmdlets:

		Set-AzDataLakeStoreItemAclEntry -AccountName $dataLakeStorageGen1Name -Path / -AceType User -Id $objectId -Permissions All
		Set-AzDataLakeStoreItemAclEntry -AccountName $dataLakeStorageGen1Name -Path /clusters -AceType User -Id $objectId -Permissions All
		Set-AzDataLakeStoreItemAclEntry -AccountName $dataLakeStorageGen1Name -Path /clusters/hdiadlcluster -AceType User -Id $objectId -Permissions All

## Create an HDInsight Linux cluster with Data Lake Storage Gen1 as the default storage

In this section, you create an HDInsight Hadoop Linux cluster with Data Lake Storage Gen1 as the default storage. For this release, the HDInsight cluster and Data Lake Storage Gen1 must be in the same location.

1. Retrieve the subscription tenant ID, and store it to use later.

        $tenantID = (Get-AzContext).Tenant.TenantId

2. Create the HDInsight cluster by using the following cmdlets:

        # Set these variables

		$location = "East US 2"
        $storageAccountName = $dataLakeStorageGen1Name   					   # Data Lake Storage Gen1 account name
		$storageRootPath = "<Storage root path you specified earlier>" # E.g. /clusters/hdiadlcluster
		$clusterName = "<unique cluster name>"
        $clusterNodes = <ClusterSizeInNodes>            # The number of nodes in the HDInsight cluster
        $httpCredentials = Get-Credential
        $sshCredentials = Get-Credential

        New-AzHDInsightCluster `
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
               -Version "3.6" `
               -SshCredential $sshCredentials `
               -AadTenantId $tenantId `
               -ObjectId $objectId `
               -CertificateFilePath $certificateFilePath `
               -CertificatePassword $password

    After the cmdlet has been successfully completed, you should see an output that lists the cluster details.

## Run test jobs on the HDInsight cluster to use Data Lake Storage Gen1
After you have configured an HDInsight cluster, you can run test jobs on it to ensure that it can access Data Lake Storage Gen1. To do so, run a sample Hive job to create a table that uses the sample data that's already available in Data Lake Storage Gen1 at *\<cluster root>/example/data/sample.log*.

In this section, you make a Secure Shell (SSH) connection into the HDInsight Linux cluster that you created, and then you run a sample Hive query.

* If you are using a Windows client to make an SSH connection into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](../hdinsight/hdinsight-hadoop-linux-use-ssh-windows.md).
* If you are using a Linux client to make an SSH connection into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Linux](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

1. After you have made the connection, start the Hive command-line interface (CLI) by using the following command:

        hive
2. Use the CLI to enter the following statements to create a new table named **vehicles** by using the sample data in Data Lake Storage Gen1:

        DROP TABLE log4jLogs;
		CREATE EXTERNAL TABLE log4jLogs (t1 string, t2 string, t3 string, t4 string, t5 string, t6 string, t7 string)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
		STORED AS TEXTFILE LOCATION 'adl:///example/data/';
		SELECT t4 AS sev, COUNT(*) AS count FROM log4jLogs WHERE t4 = '[ERROR]' AND INPUT__FILE__NAME LIKE '%.log' GROUP BY t4;

    You should see the query output on the SSH console.

	>[!NOTE]
	>The path to the sample data in the preceding CREATE TABLE command is `adl:///example/data/`, where `adl:///` is the cluster root. Following the example of the cluster root that's specified in this tutorial, the command is `adl://hdiadlstore.azuredatalakestore.net/clusters/hdiadlcluster`. You can either use the shorter alternative or provide the complete path to the cluster root.
	>

## Access Data Lake Storage Gen1 by using HDFS commands
After you have configured the HDInsight cluster to use Data Lake Storage Gen1, you can use Hadoop Distributed File System (HDFS) shell commands to access the store.

In this section, you make an SSH connection into the HDInsight Linux cluster that you created, and then you run the HDFS commands.

* If you are using a Windows client to make an SSH connection into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Windows](../hdinsight/hdinsight-hadoop-linux-use-ssh-windows.md).
* If you are using a Linux client to make an SSH connection into the cluster, see [Use SSH with Linux-based Hadoop on HDInsight from Linux](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

After you've made the connection, list the files in Data Lake Storage Gen1 by using the following HDFS file system command.

    hdfs dfs -ls adl:///

You can also use the `hdfs dfs -put` command to upload some files to Data Lake Storage Gen1, and then use `hdfs dfs -ls` to verify whether the files were successfully uploaded.

## See also
* [Use Data Lake Storage Gen1 with Azure HDInsight clusters](../hdinsight/hdinsight-hadoop-use-data-lake-store.md)
* [Azure portal: Create an HDInsight cluster to use Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md)

[makecert]: https://msdn.microsoft.com/library/windows/desktop/ff548309(v=vs.85).aspx
[pvk2pfx]: https://msdn.microsoft.com/library/windows/desktop/ff550672(v=vs.85).aspx
