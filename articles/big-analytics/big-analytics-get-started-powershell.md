# Get Started with Azure Kona using Azure PowerShell

Learn how to use Azure PowerShell to create Kona accounts and submit Kona jobs.  For more information about Kona, see [Kona overview]().

This tutorial uses Azure PowerShell.  See the following articles for using other tools

- [Get started with Azure Kona using the Azure portal]()
- [Get started with Azure kona and SQLIP using Visual Studio]()

Basic Kona process:

[image here] inbound data --> Kona Job processing --> outbound results

Kona pricing information: 

 ....

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).


## TOC [The TOC will be removed before the release]

- Install Azure PowerShell
- Create a Kona account
- Upload data to Azure Data Lake
- Submit Kona jobs
 


## Install Azure PowerShell 



**To install Azure Powershell with the Kona/Azure Data Lake cmdlets**  

1. Download the [Azure PowerShell module](https://github.com/MicrosoftBigData/ProjectKona/releases).
2. Extract **Azure_PowerShell.msi** from the zip file, and install it.

	>[AZURE.NOTE] Don't install Azure_SDK_KonaDataLake.zip over Azure Powershell. Some cmdlets won't work.
	  
3. From your desktop, open a new Azure PowerShell window, and run the following cmdlets. Make sure you log in as one of the subscription admininistrators/owners for the first time[jgao: why is this needed?]:
	
	    Add-AzureAccount
	    Select-AzureSubscription -SubscriptionId <Your Azure Subscription ID>
	    Register-AzureProvider -ProviderNamespace "Microsoft.Kona"
	    Register-AzureProvider -ProviderNamespace "Microsoft.DataLake"


##Create a Kona account

You must have a Kona account before you can run a Kona job. To create a Kona account, you must specify the following:

- **Azure Resource Group**: A Kona account must be created within a Azure Resource group. [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/) enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.  

	To enumerate the resource groups in your subscription:
    
    	Get-AzureResourceGroup
    
	To create a new resource group:

    	New-AzureResourceGroup `
			-Name "<Your resource group name>" `
			-Location "<Azure Data Center>" # For example, "East US 2"

- **Azure Kona account name**
- **Location**: one of the Azure data centers that supports Kona.
- **Azure Data Lake account**: An Azure Kona account uses an Azure Data Lake account for data storage.

	To create a new Data Lake account:

	    New-AzureDataLakeAccount `
	        -ResourceGroupName "<Your Azure resource group name>" `
	        -Name "<Your Azure Data Lake account name>" `
	        -Location "<Azure Data Center>"  # For example, "East US 2"

	> [AZURE.NOTE] The Azure Data Lake account name must only contain lowercase letters and numbers.


To create a new Azure Kona account
   
    New-AzureKonaAccount `
        -ResourceGroupName "<You Azure resource group name>" `
        -Name "<Your Azure Kona account name>" `
        -Location "<Azure Data Center>"  #"East US 2" `
        -DefaultDataLake "<Your Knoa account name>"

> [AZURE.NOTE] The Azure Kona account name must only contain lowercase letters and numbers.


**To create a Kona account**

1. Open PowerShell ISE from your Windows workstation.
2. Run the following script:

		$resourceGroupName = "jgaoResourceGroup1"
		$dataLakeName = "jgaodatalake1"
		$konaName = "jgaokona1"
		$location = "East US 2"
		
		Write-Host "Create a resource group ..." -ForegroundColor Green
		New-AzureResourceGroup `
		    -Name  $resourceGroupName `
		    -Location $location
		
		Write-Host "Create a data lake account ..."  -ForegroundColor Green
		New-AzureDataLakeAccount `
		    -Name $dataLakeName `
		    -Location $location `
		    -ResourceGroupName $resourceGroupName
		
		Write-Host "Create a Kona account ..."  -ForegroundColor Green
		New-AzureKonaAccount `
		    -Name $KonaName `
		    -Location $location `
		    -ResourceGroupName $resourceGroupName `
		    -DefaultDataLake $dataLakeName
		
		Write-Host "The newly created Kona account ..."  -ForegroundColor Green
		Get-AzureKonaAccount `
		    -Name $konaName  

##Upload data to Azure Data Lake

Now you have a Kona account.  You will still need some data to run a Kona job. The data file used in this tutorial is a tab separated file with the following fields:

        Athlete              string,
        Age                  string,
        Country              string,
        Year                 string,
        ClosingCeremonyDate  string,
        Sport                string,
        GoldMedals           string,
        SilverMedals         string,
        BronzeMedals         string,
        TotalMedals          string,

You can download a data file from [Github](https://github.com/MicrosoftBigData/ProjectKona/tree/master/SQLIPSamples/SampleData/OlympicAthletes.tsv) to your workstation.

**To upload the file to the Azure Data Lake account associated with the Kona account**

	Import-AzureDataLakeItem -AccountName "<Your Data Lake account>" `
                     -Path "c:\OlympicAthletes.tsv" `
                     -Destination "SampleData\OlympicAthletes.tsv"

	Get-AzureDataLakeChildItem -AccountName "<Your Data Lake account>" `
                        -path "SampleData"


For more information on uploading data to Azure Data Lake, see ....

Kona can also access Azure Blob storage.  For uploading data to Azure Blob storage, see ....

##Submit Kona jobs

**To create a Kona job script**

- Create a text file with following SQLIP script, and save the text file on your workstation:

	@athletes =
	    EXTRACT
	        Athlete              string,
	        Age                  string,
	        Country              string,
	        Year                 string,
	        ClosingCeremonyDate  string,
	        Sport                string,
	        GoldMedals           string,
	        SilverMedals         string,
	        BronzeMedals         string,
	        TotalMedals          string
	    FROM @"/SampleData/OlympicAthletes.tsv"
	    USING new DefaultTextExtractor();
	
	OUTPUT @athletes
	    TO @"/SampleData/OlympicAthletes_Copy.tsv"
	    USING new DefaultTextOutputter();

**To submit the job**

1. Open PowerShell ISE from your Windows workstation.
2. Run the following script:

		$konaName = "jgaokona"
		$konaScriptPath = "c:\tutorials\kona\copyFile.sip"
		
		Submit-AzureKonaJob -
		
		Submit-AzureKonaJob -Name "copyAthleteFile" -AccountName $konaName –ScriptPath $konaScriptPath 
		                
		Get-AzureKonaJob -AccountName $konaName

After the job is completed, you can use the following cmdlets to list the files:

		Get-AzureDataLakeChildItem -AccountName jgaodatalake `
		                            -path "SampleData"

And use the following cmdlets to download the file:

		$konaName = "jgaokona"
		$sourceFile = "mafs://accounts/$konaName/fs/SampleData/OlympicAthletes_Copy.tsv"
		$destFile = "C:\tutorials\kona\OlympicAtheletes_Copy.tsv"
		Export-AzureDataLakeItem -AccountName $konaName -Path $sourceFile -Destination $destFile


To make it more interesting, try the following SQLIP scrpit instead:



At this point, you’ve learned: 
- Upload, list, and download files in the Kona file system (Azure Data Lake)
- Submit a simple SQLIP script and verifying its status and that it ran correctly




