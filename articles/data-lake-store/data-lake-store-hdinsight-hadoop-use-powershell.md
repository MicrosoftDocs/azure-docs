<properties 
   pageTitle="Configure HDInsight clusters with Azure Data Lake using PowerShell | Azure" 
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
   ms.date="10/27/2015"
   ms.author="nitinme"/>

# Provision an HDInsight cluster with Data Lake Store using Azure PowerShell

> [AZURE.SELECTOR]
- [Portal](data-lake-store-hdinsight-hadoop-use-portal.md)
- [PowerShell](data-lake-store-hdinsight-hadoop-use-powershell.md)


Learn how to use Azure PowerShell to configure an HDInsight cluster (Hadoop, HBase, or Storm) to work with an Azure Data Lake Store. Some important considerations for this release:
* For Hadoop and Storm clusters, the Data Lake Store can only be used as an additional storage account. The default storage account for the such clusters will still be Azure Storage Blobs (WASB).
* For HBase clusters, the Data Lake Store can be used as a default storage or additional storage. 

Configuring HDInsight to work with Azure Data Lake using PowerShell involves the following steps:

* Create an Azure Data Lake Store
* Set up authentication for role-based access to Data Lake Store
* Create HDInsight cluster with authentication to Data Lake Store
* Run a test job on the cluster

## Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Azure PowerShell**. See [Install and configure Azure PowerShell](../install-configure-powershell.md) for instructions.
- **Windows SDK**. You can install it from [here](https://dev.windows.com/en-us/downloads). You use this to create a security certificate. 


## Create an Azure Data Lake Store

Follow these steps to create a Data Lake Store.

1. From your desktop, open a new Azure PowerShell window, and enter the following snippet. When prompted to log in, make sure you log in as one of the subscription admininistrators/owner:

        # Log in to your Azure account
		Login-AzureRmAccount
        
		# List all the subscriptions associated to your account
		Get-AzureRmSubscription
		
		# Select a subscription 
		Set-AzureRMContext -SubscriptionName <subscription name>

		# Register for Data Lake Store
		Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.DataLake"

3. An Azure Data Lake account is associated with an Azure Resource Group. Start by creating an Azure Resource Group.

		$resourceGroupName = "<your new resource group name>"
    	New-AzureRmResourceGroup -Name $resourceGroupName -Location "East US 2"

	![Create an Azure Resource Group](./media/data-lake-store-hdinsight-hadoop-use-powershell/ADL.PS.CreateResourceGroup.png "Create an Azure Resource Group")

2. Create an Azure Data Lake account. The account name you specify must only contain lowercase letters and numbers.

		$dataLakeStoreName = "<your new Data Lake Store name>"
    	New-AzureRmDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStoreName -Location "East US 2"

	![Create an Azure Data Lake account](./media/data-lake-store-hdinsight-hadoop-use-powershell/ADL.PS.CreateADLAcc.png "Create an Azure Data Lake account")

3. Verify that the account is successfully created.

		Test-AzureRmDataLakeStoreAccount -Name $dataLakeStoreName

	The output for this should be **True**.

4. Upload some sample data to Azure Data Lake. We'll use this data later in this article to verify that the data is accessible from an HDInsight cluster. You can download a sample data file (OlympicAthletes.tsv) from [AzureDataLake Git Repository](https://github.com/MicrosoftBigData/AzureDataLake/raw/master/Samples/SampleData/OlympicAthletes.tsv).

		
		$myrootdir = "/"
		Import-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path "C:\<path to data>\OlympicAthletes.tsv" -Destination $myrootdir\OlympicAthletes.tsv


## Set up authentication for role-based access to ADL

Every Azure subscription is associated with an Azure Active Directory. Users and services that access resources of the subscription using the Azure portal or Azure Resource Manager API must first authenticate with that Azure Active Directory. Access is granted to Azure subscriptions and services by assigning them the appropriate role on an Azure resource.  For services, a service principal identifies the service in the Azure Active Directory (AAD). This section illustrates how to grant an application service, like HDInsgiht, access to an Azure resource (the Azure Data Lake account you created earlier) by creating a service principal for the application and assigning roles to that via Azure PowerShell.

To set up Active Directory authentication for Azure Data Lake, you must perform the following tasks.

* Create a self-signed certificate
* Create an application in Azure Active Directory and a Service Principal

### Create a self-signed certificate

Make sure you [Windows SDK](https://dev.windows.com/en-us/downloads) installed before proceeding with the steps in this section. You must have also created a directory, such as **C:\mycertdir**, where the certificate will be created. 

1. Make sure Windows SDK is added to the PATH variable. Look for the following in the PATH variable definition. [ TBD: Link to adding to PATH ]

		C:\Program Files (x86)\Windows Kits\10\bin\x86

2. Use the [MakeCert][makecert] utility to create a self-signed certificate and a private key. Use the following commands.

		$certificateFileDir = "<my certificate directory>"
		cd $certificateFileDir
		$startDate = (Get-Date).ToString('MM/dd/yyyy')
		$endDate = (Get-Date).AddDays(365).ToString('MM/dd/yyyy')

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

		$application = New-AzureRmADApplication `
					-DisplayName "HDIADL" ` 
					-HomePage "https://contoso.com" `
					-IdentifierUris "https://mycontoso.com" `
					-KeyValue $credential  `
					-KeyType "AsymmetricX509Cert"  `
					-KeyUsage "Verify"  `
					-StartDate $startDate  `
					-EndDate $endDate

		$applicationId = $application.ApplicationId

2. Create a service principal using the application ID.

		$servicePrincipal = New-AzureRmADServicePrincipal -ApplicationId $applicationId
		
		$objectId = $servicePrincipal.Id

3. Grant the service principal access to the Data Lake Store you created earlier.
		
		Set-AzureRmDataLakeStoreItemAclEntry -AccountName $dataLakeStoreName -Path / -AceType User -Id $objectId -Permissions All

	At the prompt, enter **Y** to confirm.

## Create an HDInsight cluster with authentication to Data Lake Store

In this section, we create an HDInsight Hadoop cluster. For this release, the HDInsight cluster and the Data Lake Store must be in the same location (East US 2).

1. Start with retrieving the subscription tenant ID. You will need that later.

		$tenantID = (Get-AzureSubscription -Current).TenantId

2. For this release, for a Hadoop cluster, Data Lake Store can only be used as an additional storage for the cluster. The default storage will still be the Azure storage blobs (WASB). So, we'll first create the storage account and storage containers required for the cluster.

		# Create an Azure storage account
		$location = "East US 2"
		$storageAccountName = "<StorageAcccountName>"   # Provide a Storage account name
		
		New-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -StorageAccountName $storageAccountName -Location $location -Type Standard_GRS
 
		# Create an Azure Blob Storage container
		$containerName = "<ContainerName>"              # Provide a container name
		$storageAccountKey = Get-AzureRmStorageAccountKey -Name $storageAccountName -ResourceGroupName $resourceGroupName | %{ $_.Key1 }
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		New-AzureStorageContainer -Name $containerName -Context $destContext

3. Create the HDInsight cluster. Use the following cmdlets.

		# Set these variables
		$clusterName = $containerName                   # As a best practice, have the same name for the cluster and container
		$clusterNodes = <ClusterSizeInNodes>            # The number of nodes in the HDInsight cluster
		$httpcredentials = Get-Credential
		$rdpCredentials = Get-Credential
		
		New-AzureRmHDInsightCluster -ClusterName $clusterName -ResourceGroupName $resourceGroupName -HttpCredential $httpCredentials -Location $location -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainer $containerName  -ClusterSizeInNodes $clusterNodes -ClusterType Hadoop -Version "3.2" -RdpCredential $rdpCredentials -RdpAccessExpiry (Get-Date).AddDays(14) -ObjectID $objectId -AadTenantId $tenantID -CertificateFilePath $certificateFilePath -CertificatePassword $password

	After the cmdlet successfully completes, you should see an output like this:

		Name                : hdiadlcluster
		Id                  : /subscriptions/<subscription ID>/resourceGroups/hdiadlresgroup/providers/Microsoft.HDInsight/clusters/hdiadlcluster
		Location            : East US 2
		ClusterVersion      : 3.2.6.681
		OperatingSystemType : Windows
		ClusterState        : Running
		ClusterType         : Hadoop
		CoresUsed           : 16
		HttpEndpoint        : hdiadlcluster.azurehdinsight.net 

## Run test jobs on the HDInsight cluster to use the Azure Data Lake account

After you have configured an HDInsight cluster, you can run test jobs on the cluster to test that the HDInsight cluster can access and store data in Azure Data Lake. To do so, we will use example jar applications available by default on an HDInsight cluster.

Note that, in this release, the default storage for the cluster is still an Azure Storage Blob (WASB). So, the sample jar file, hadoop-mapreduce-examples.jar, is available under the storage container at /example/jars. We also have some sample data at example/data/gutenberg. In this job, we use the jar file to run a wordcount on sample data files, and store the output to Azure Data Lake account. Use the following cmdlet:

	New-AzureHDInsightMapReduceJobDefinition `
    -JarFile "wasb:///example/jars/hadoop-mapreduce-examples.jar" -ClassName "wordcount" `
    -Arguments "wasb:///example/data/gutenberg/davinci.txt", "swebhdfs://$dataLakeAccountName.azuredatalake.net:443/wordcountoutput.txt" `
	| Start-AzureHDInsightJob -ResourceGroupName $resourceGroupName -ClusterName $clusterName -ClusterCredential $httpCredentials `
	| Wait-AzureHDInsightJob -ResourceGroupName $resourceGroupName -ClusterName $clusterName -ClusterCredential $httpCredentials

Run the following PowerShell cmdlet to list the files in the Azure Data Lake account. You should see a wordcountoutput.txt there.

	Get-AzureDataLakeChildItem -AccountName $dataLakeAccountName -Path $myrootdir

## Access Data Lake storage using HDFS commands

Once you have configured the HDInsight cluster to use Data Lake storage, you can use the HDFS shell commands to access the Data Lake storage.

1. Sign on to the new [Azure preview portal](https://portal.azure.com).

2. Click **Browse**, click **HDInsight clusters**, and then click the HDInsight cluster that you created.

3. In the cluster blade, click **Remote Desktop**, and then in the **Remote Desktop** blade, click **Connect**.

	![Remote into HDI cluster](./media/azure-data-lake-hdinsight-hadoop-use-powershell/ADL.HDI.PS.Remote.Desktop.png "Create an Azure Resource Group")

	When prompted, enter the credentials you provided for the remote desktop user. 

4. In the remote session, start Windows PowerShell, and use the HDFS filesystem commands to list the files in the Azure Data Lake.

	 	hdfs dfs -ls swebhdfs://<Data Lake account name>.azuredatalake.net:443/

	This should list the file that you uploaded earlier to the Azure Data Lake account.

		15/09/17 21:41:15 INFO web.CaboWebHdfsFileSystem: Replacing original urlConnectionFactory with org.apache.hadoop.hdfs.web.URLConnectionFactory@21a728d6
		Found 1 items
		-rwxrwxrwx   0 NotSupportYet NotSupportYet     671388 2015-09-16 22:16 swebhdfs://hdiadlaccount.azuredatalake.net:443/tweets.txt

	You can also use the `hdfs dfs -put` command to upload some files to the Azure Data Lake, and then use `hdfs dfs -ls` to verify whether the files were successfully uploaded.

## See Also

[ TBD: Add links ]

[makecert]: https://msdn.microsoft.com/en-us/library/windows/desktop/ff548309(v=vs.85).aspx
[pvk2pfx]: https://msdn.microsoft.com/en-us/library/windows/desktop/ff550672(v=vs.85).aspx