<properties 
   pageTitle="Configure HDInsight Hadoop clusters with Azure Data Lake using PowerShell | Azure" 
   description="Use Azure PowerShell to configure and use HDInsight Hadoop clusters with Azure Data Lake" 
   services="data-lake" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="nitinme"/>

# Configure an HDInsight Hadoop cluster with Azure Data Lake using Azure PowerShell

> [AZURE.SELECTOR]
- [Portal](azure-data-lake-hdinsight-hadoop-use-portal.md)
- [PowerShell](azure-data-lake-hdinsight-hadoop-use-powershell.md)


Learn how to use Azure PowerShell to configure an HDInsight Hadoop cluster to work with an Azure Data Lake account. In this release, the Azure Data Lake account can only be used as an additional storage account. The default storage account for the cluster will still be Azure Storage Blobs (WASB). 

Configuring HDInsight to work with Azure Data Lake using PowerShell involves the following steps:

* Install Azure PowerShell
* Create an Azure Data Lake account
* Set up authentication for role-based access to Azure Data Lake
* Create HDInsight cluster with authentication to Azure Data Lake
* Run a test job on the cluster

## Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Windows SDK**. You can install it from [here](https://dev.windows.com/en-us/downloads). You use this to create a security certificate. 


## Install Azure PowerShell

1. Download the [Azure PowerShell module for Data Lake](https://github.com/MicrosoftBigData/AzureDataLake/releases).

2. Extract **Azure_PowerShell.msi** from the .zip and double-click to install.

3. From your desktop, open a new Azure PowerShell window, and enter the following snippet. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

        # Log in to your Azure account
		Add-AzureAccount
        
		# List all the subscriptions associated to your account
		Get-AzureSubscription
		
		# Select a subscription 
		$subscriptionName = "<subscription name>"
		Select-AzureSubscription -SubscriptionName <subscription name>
        
		# Switch to Azure Resource Manager mode and register for Data Lake
		Switch-AzureMode AzureResourceManager
        Register-AzureProvider -ProviderNamespace "Microsoft.DataLake" 

	

## Create an Azure Data Lake account

Follow these steps to create an Azure Data Lake account.

1. An Azure Data Lake account is associated with an Azure Resource Group. Start by creating an Azure Resource Group.

		$resourceGroupName = "<your new resource group name>"
    	New-AzureResourceGroup -Name $resourceGroupName -Location "East US 2"

	![Create an Azure Resource Group](./media/azure-data-lake-hdinsight-hadoop-use-powershell/ADL.PS.CreateResourceGroup.png "Create an Azure Resource Group")

2. Create an Azure Data Lake account. The account name you specify must only contain lowercase letters and numbers.

		$dataLakeAccountName = "<your new Data Lake account name>"
    	New-AzureDataLakeAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAccountName -Location "East US 2"

	![Create an Azure Data Lake account](./media/azure-data-lake-hdinsight-hadoop-use-powershell/ADL.PS.CreateADLAcc.png "Create an Azure Data Lake account")

3. Verify that the account is successfully created.

		Test-AzureDataLakeAccount -Name $dataLakeAccountName

	The output for this should be **True**.


## Set up authentication for role-based access to ADL

Every Azure subscription is associated with an Azure Active Directory. Users and services that access resources of the subscription using the Azure portal or Azure Resource Manager API must first authenticate with that Azure Active Directory. Access is granted to Azure subscriptions and services by assigning them the appropriate role on an Azure resource.  For services, a service principal identifies the service in the Azure Active Directory (AAD). This section illustrates how to grant an application service, like HDInsgiht, access to an Azure resource (the Azure Data Lake account you created earlier) by creating a service principal for the application and assigning roles to that via Azure PowerShell.

To set up Active Directory authentication for Azure Data Lake, you must perform the following tasks.

* Create a self-signed certificate
* Create an application in Azure Active Directory and a Service Principal
* 

### Create a self-signed certificate

Make sure you [Windows SDK](https://dev.windows.com/en-us/downloads) installed before proceeding with the steps in this section. You must have also created a directory, such as **C:\mycertdir**, where the certificate will be created. 

1. Make sure Windows SDK is added to the PATH variable. Look for the following in the PATH variable definition.

		C:\Program Files (x86)\Windows Kits\10\bin\x86

2. Use the [MakeCert][makecert] utility to create a self-signed certificate and a private key. Use the following commands.

		$certificateFileDir = "<my certificate directory>"
		cd $certificateFileDir
		$startDate = (Get-Date).ToString('MM-dd-yyyy')
		$endDate = (Get-Date).AddDays(365).ToString('MM-dd-yyyy')

		makecert -sv mykey.pvk -n "cn=HDI-ADL-SP" CertFile.cer -b $startDate -e $endDate -r -len 2048

	You will be prompted to enter the private key password. After the command successfully executes, you should see a **CertFile.cer** and **mykey.pvk** in the certificate directory you specified.

4. Use the [Pvk2Pfx][pvk2pfx] utility to convert the .pvk and .cer files that MakeCert created to a .pfx file. Run the following command.

		pvk2pfx -pvk mykey.pvk -spc CertFile.cer -pfx CertFile.pfx -po myPassword

	When prompted enter the private key password you specified earlier. The value you specify for the **-po** parameter is the password that is associated with the .pfx file. After the command successfully completes, you should also see a CertFile.pfx in the certificate directory you specified.

###  Create an Azure Active Directory and a service principal

In this section, you perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing a certificate. Run the following commands to create an application in Azure Active Directory. 

1. Paste the following cmdlets in the PowerShell console window. Make sure the value you specify for the **-DisplayName** property is unique. Also, the values for **-HomePage** and **-IdentiferUris** are placeholder values and are not verified. 

		$certificateFilePath = "$certificateFileDir\CertFile.pfx"
		
		$password = Read-Host –Prompt "Enter the password" –AsSecureString  # This is the password you specified for the .pfx file (e.g. "myPassword")
		
		$certificatePFX = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certificateFilePath, $password)
		
		$rawCertificateData = $certificatePFX.GetRawCertData()
		
		$credential = [System.Convert]::ToBase64String($rawCertificateData)

		$application = New-AzureADApplication `
					-DisplayName "HDIADL2" ` 
					-HomePage "https://myadapp.azurehdi.net" `
					-IdentifierUris "https://myadapp.azurehdi.net" `
					-KeyValue $credential  `
					-KeyType "AsymmetricX509Cert"  `
					-KeyUsage "Verify"  `
					-StartDate $startDate  `
					-EndDate $endDate

		$applicationId = $application.ApplicationId

2. Create a service principal using the application ID.

		$servicePrincipal = New-AzureADServicePrincipal -ApplicationId $applicationId
		
		$objectId = $servicePrincipal.Id

3. You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope. Enable the service principal to access a resource, which in this example is Azure Data Lake account.

		New-AzureRoleAssignment ` 
 		-RoleDefinitionName Contributor ` 
 		-ObjectId $objectId ` 
		-ResourceGroupName $resourceGroupName ` 
		-ResourceType "Microsoft.DataLake/dataLakeAccounts" ` 
		-ResourceName $dataLakeAccountName

	Once the cmdlet successfully executes, you should see an output like this:

		ServicePrincipalName : https://hdidl.azurehdiadl.net
		RoleAssignmentId     : /subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/nitinresgrp/providers/Microso
		                       ft.DataLake/dataLakeAccounts/nitinhdiadlacc/providers/Microsoft.Authorization/roleAssignments/0e
		                       22ad99-14bb-4afb-9c33-13502779e037
		DisplayName          : HDIDL
		RoleDefinitionName   : Contributor
		Actions              : {*}
		NotActions           : {Microsoft.Authorization/*/Write, Microsoft.Authorization/*/Delete}
		Scope                : /subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/nitinresgrp/providers/Microso
		                       ft.DataLake/dataLakeAccounts/nitinhdiadlacc
		ObjectId             : 86e8fcbf-47f2-42ae-9d44-af7adbc856ee

4. Set access control on the Azure Data Lake account.
		
		Set-AzureDataLakeItemAclEntry -AccountName $dataLakeAccountName -Path / -AceType User -Id $objectId -Permissions All

	At the prompt, enter **Y** to confirm.

## Create an HDInsight cluster with authentication to Azure Data Lake account

In this section, we create an HDInsight cluster. For this release, the HDInsight cluster and the Azure Data Lake account must be in the same location (East US 2).

1. To create an HDInsight cluster that has access to the Azure Data Lake account, you need to associate it with the service principal. For that, we need the service principal tenant ID. So, let's first get that.

		$tenantID = (Get-AzureSubscription -Current).TenantId

2. For this release, Azure Data Lake account can only be used as an additional storage for the cluster. The default storage will still be the Azure storage blobs (WASB). So, we'll first create the storage account and storage containers required for the cluster.

		# Create an Azure storage account
		$location = "East US 2"
		$storageAccountName = "<StorageAcccountName>"   # Provide a Storage account name
		New-AzureStorageAccount -ResourceGroupName $resourceGroupName -StorageAccountName $storageAccountName -Location $location -Type Standard_GRS
 
		# Create an Azure Blob Storage container
		$containerName = "<ContainerName>"              # Provide a container name
		$storageAccountKey = Get-AzureStorageAccountKey -Name $storageAccountName -ResourceGroupName $resourceGroupName | %{ $_.Key1 }
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		New-AzureStorageContainer -Name $containerName -Context $destContext

3. Create the HDInsight cluster. Use the following cmdlets.

		# Set these variables
		$clusterName = $containerName                   # As a best practice, have the same name for the cluster and container
		$clusterNodes = <ClusterSizeInNodes>            # The number of nodes in the HDInsight cluster
		$httpcredentials = Get-Credential
		$rdpCredentials = Get-Credential
		
		New-AzureHDInsightCluster -ClusterName $clusterName -ResourceGroupName $resourceGroupName -HttpCredential $httpCredentials -Location $location -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainer $containerName  -ClusterSizeInNodes $clusterNodes -ClusterType Hadoop -Version "3.2" -RdpCredential $rdpCredentials -RdpAccessExpiry (Get-Date).AddDays(14) -ObjectID $objectId -AadTenantId $tenantID -CertificateFilePath $certificateFilePath -CertificatePassword $password

	After the cmdlet successfully completes, you should see an output like this:

		Name                : hdiadlcluster
		Id                  : /subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/myresourcegroup/providers/Microsoft.HDInsight/clusters/hdiadlcluster
		Location            : East US 2
		ClusterVersion      : 3.2.6.681
		OperatingSystemType : Windows
		ClusterState        : Running
		ClusterType         : Hadoop
		CoresUsed           : 16
		HttpEndpoint        : hdiadlcluster.azurehdinsight.net 

## Run test jobs on the HDInsight cluster to use the Azure Data Lake account



## See Also

[ TBD: Add links ]

[makecert]: https://msdn.microsoft.com/en-us/library/windows/desktop/ff548309(v=vs.85).aspx
[pvk2pfx]: https://msdn.microsoft.com/en-us/library/windows/desktop/ff550672(v=vs.85).aspx