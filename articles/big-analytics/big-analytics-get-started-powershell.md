# Get Started with Azure Big Analytics using Azure PowerShell

Learn how to use the Azure PowerShell to create a Big Analytics account, create a Big Analytics job using [U-SQL], and submit the job.  For more information about Big Analytics, see [Azure Big Analytics overview](big-analytics-overview.md).

See the following articles for using other tools:

- [Get started with Azure Big Analytics using Azure preview portal](big-analytics-get-started-portal.md)
- [Get started with Azure Big Analytics and U-SQL using Visual Studio](big-analytics-get-started-u-sql.md)

Basic Big Analytics process:

![Azure Big Analytics process flow diagram](./media/big-analytics-get-started-portal/big-analytics-process-flow-diagram.png)

An Big Analytics job reads files from the dependent Data Lake account, process the files as instructed in a U-SQL script, and save the output back to the Data Lake account.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Azure PowerShell**. The Azure PowerShell can be installed using the Microsoft Web Platform installer.  For more information, see [Install and configure Azure PowerShell](powershell-install-configure.md).

	[jgao: until the public preview, use the following procedure to install Azure PowerShell]
	
	**To install Azure Powershell with the Big Analytics/ Data Lake cmdlets**  
	
	1. Download the [Azure PowerShell module](https://github.com/MicrosoftBigData/ProjectKona/releases).
	2. Extract **Azure_PowerShell.msi** from the zip file, and install it.
	
		>[AZURE.NOTE] Don't install Azure_SDK_KonaDataLake.zip over Azure Powershell. Some cmdlets won't work.
		  
	3. From your desktop, open a new Azure PowerShell window, and run the following cmdlets. Make sure you log in as one of the subscription admininistrators/owners for the first time:
		
		    Add-AzureAccount
		    Select-AzureSubscription -SubscriptionId <Your Azure Subscription ID>
		    Register-AzureProvider -ProviderNamespace "Microsoft.Kona"
		    Register-AzureProvider -ProviderNamespace "Microsoft.DataLake"


##Create a Big Analytics account

You must have a Big Analytics account before you can run a Big Analytics job. To create a Big Analytics account, you must specify the following:

- **Azure Resource Group**: A Big Analytics account must be created within a Azure Resource group. [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/) enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.  

	To enumerate the resource groups in your subscription:
    
    	Get-AzureResourceGroup
    
	To create a new resource group:

    	New-AzureResourceGroup `
			-Name "<Your resource group name>" `
			-Location "<Azure Data Center>" # For example, "East US 2"

- **Big Analytics account name**
- **Location**: one of the Azure data centers that supports Big Analytics.
- **Data Lake account**: An Big Analytics account uses an Data Lake account for data storage.

	To create a new Data Lake account:

	    New-AzureDataLakeAccount `
	        -ResourceGroupName "<Your Azure resource group name>" `
	        -Name "<Your Data Lake account name>" `
	        -Location "<Azure Data Center>"  # For example, "East US 2"

	> [AZURE.NOTE] The Data Lake account name must only contain lowercase letters and numbers.


To create a new Big Analytics account
   
    New-AzureKonaAccount `
        -ResourceGroupName "<You Azure resource group name>" `
        -Name "<Your Azure Kona account name>" `
        -Location "<Azure Data Center>"  #"East US 2" `
        -DefaultDataLake "<Your Knoa account name>"

> [AZURE.NOTE] The Big Analytics account name must only contain lowercase letters and numbers.


**To create a Big Analytics account**

1. Open PowerShell ISE from your Windows workstation.
2. Run the following script:

		$resourceGroupName = "<ResourceGroupName>"
		$dataLakeName = "<DataLakeAccountName>"
		$bigAnalyticesName = "<BigAnalyticsAccountName>"
		$location = "East US 2"
		
		Write-Host "Create a resource group ..." -ForegroundColor Green
		New-AzureResourceGroup `
		    -Name  $resourceGroupName `
		    -Location $location
		
		Write-Host "Create a data lake account ..."  -ForegroundColor Green
		New-AzureDataLakeAccount `
		    -ResourceGroupName $resourceGroupName `
		    -Name $dataLakeName `
		    -Location $location 
		
		Write-Host "Create a Kona account ..."  -ForegroundColor Green
		New-AzureKonaAccount `
		    -Name $bigAnalyticesName `
		    -ResourceGroupName $resourceGroupName `
		    -Location $location `
		    -DefaultDataLake $dataLakeName
		
		Write-Host "The newly created Kona account ..."  -ForegroundColor Green
		Get-AzureKonaAccount `
			-ResourceGroupName $resourceGroupName `
		    -Name $bigAnalyticesName  

##Upload data to Data Lake

Now you have a Big Analytics account.  You will still need some data to run a Big Analytics job. The data file used in this tutorial is a tab separated file with the following fields:

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

**To upload the file to the Data Lake account associated with the Big Analytics account**

	Import-AzureDataLakeItem -AccountName "<Your Data Lake account>" `
                     -Path "c:\OlympicAthletes.tsv" `
                     -Destination "SampleData\OlympicAthletes.tsv"

	Get-AzureDataLakeChildItem -AccountName "<Your Data Lake account>" `
                        -path "SampleData"


For more information on uploading data to Data Lake, see ....

Big Analytics can also access Azure Blob storage.  For uploading data to Azure Blob storage, see ....

##Submit Big Analytics jobs

**To create a Big Analytics job script**

- Create a text file with following U-SQL script, and save the text file to your workstation:

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

	This U-SQL script reads the input data file using the DefaultTextExtrator, and then make a copy of the file using the DefaultTextOutputter.

	Both the inbound and the outbound file are stored in /SampleData folder. Update the path accordingly.

**To submit the job**

1. Open PowerShell ISE from your Windows workstation.
2. Run the following script:

		$bigAnalyticsName = "<BigAnalyticsAccountName>"
		$usqlScriptPath = "c:\tutorials\big-analytics\copyFile.sip"
		
		Submit-AzureKonaJob -
		
		Submit-AzureKonaJob -Name "copyAthleteFile" -AccountName $bigAnalyticsName –ScriptPath $usqlScriptPath 
		                
		Get-AzureKonaJob -AccountName $bigAnalyticsName

	In the script, the U-SQL script file is stored at c:\tutorials\big-analytics\copyFile.sip.  Update the file path accordingly.
 
After the job is completed, you can use the following cmdlets to list the files:

		$dataLakeName = "<DataLakeAccountName>"
		Get-AzureDataLakeChildItem -AccountName $dataLakeName `
		                            -path "SampleData"

And use the following cmdlets to download the file:

		$sourceFile = "mafs://accounts/$bigAnalyticsName/fs/SampleData/OlympicAthletes_Copy.tsv"
		$destFile = "C:\tutorials\kona\OlympicAtheletes_Copy.tsv"
		Export-AzureDataLakeItem -AccountName $bigAnalyticsName -Path $sourceFile -Destination $destFile


#See also

Until now, you’ve learned: 

- Upload, list, and upload files to Azure Data Lake
- Submit a Big Analytics jobs

To read more:

- [Azure Big Analytics overview](big-analytics-overview.md)
- [Get started with Azure Big Analytics using Azure PowerShell](big-analytics-get-started-powershell.md)
- [Get started with Azure Big Analytics and U-SQL using Visual Studio](big-analytics-get-started-u-sql.md)





