# Manage Kona users

*****working in progress****

[introduction - we need to explain the terms, and connect the pieces. ]

 - What is Kona
 
 	- How is Kona related to Hadoop in HDInsight in addition to service vs. cluster?
	- Is Kona based on Hadoop?
	- Performance comparison

 - the data storage supported by Kona
	 - Kona Catalog / Kona store?
	 - Cabo HDFS store / Azure Data Lake?
	 - Azure Blob storage
	 - Azure SQL database

 - the languages supported by kona
	 - SQLIP
	 - Hive (Future?)
	 - Pig (Future)

 - The process
	 - upload data
	 - run job
	 - donwload the job results

 - The tools
	 - SQLIP studio / SCOPE studio
	 - HDI studio (Is this Visual Studio tools for HDI?)

## TOC [The TOC will be removed before the release]

- Prerequisite
- Connect to Kona
- Manage Kona users (is this absolutely necessary for going through this tutorial?)
- Upload data to Azure Data Lake
- Submit Kona jobs using Azure PowerShell
- Submit jobs using SQLIP Studio


## Prerequisites

Before you begin this tutorial, you must have the following:

- **An Azure subscription and a Kona account that is associated with that Azure subscription**

- **Azure PowerShell**. 

	1. Download the [Azure PowerShell module](https://github.com/MicrosoftBigData/ProjectKona/releases).
	2. Extract **Azure_PowerShell.msi** from the zip file, and install it.
	3. From your desktop, open a new Azure PowerShell window, and run the following cmdlets. Make sure you log in as one of the subscription admininistrators/owners this first time:
	
	        Add-AzureAccount
	        Select-AzureSubscription -SubscriptionId <the Subscription ID that you wrote down previously>
	        Register-AzureProvider -ProviderNamespace "Microsoft.Kona"
	        Register-AzureProvider -ProviderNamespace "Microsoft.DataLake"

- **Download the data and scripts**

	[We need an easier way for user to access the data file.  For example, put the data file into a public blob so it can be copied to Kona store using PowerShell]
	[saveenr - we are workign on that for public preview]

	The data file used in this tutorial is a tab separated file with the following fields:

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



## Manage Kona users

[**jgao:** If this is not needed to go through the tutorial, then we shall separated it into a management topic]
[saveenr - sounds good - talk to mahi about the correct way to do user management]

To add a user to your Kona Account:


	New-KonaUser –UserEmail user1@aadtenant.onmicrosoft.com –UserRole User 


To list the existing Kona users:

	Get-KonaUser 

The following is a sample output:

	CreationTime                LastModifiedTime            Name                        Roles                      
	------------                ----------------            ----                        -----                      
	Mon, 13 Oct 2014 18:42:3... Mon, 13 Oct 2014 18:42:3... KiwiPublicTest@JianywKiw... {Admin}                    
	Tue, 14 Oct 2014 02:24:3... Tue, 14 Oct 2014 02:24:3... konauser2@test              {Admin}                    
	Tue, 14 Oct 2014 02:26:0... Tue, 14 Oct 2014 02:26:0... konauser1@onboardflow.on... {Admin}                    
	Wed, 15 Oct 2014 00:14:1... Wed, 15 Oct 2014 00:14:1... This Obviously Isn't a user {ReadOnly}  
	               

To remove a Kona user account:

	Remove-KonaUser –UserEmail user1@aadtenant.onmicrosoft.com 




##Upload data to [Azure Data Lake?]

This section covers how to upload data to [Azure Data Lake][link to the Azure DataLake overview article].

The following PowerShell script upload the data file to Azure Data Lake:

[saveenr - this is is all going to change on 2016/06/30. Mahi has details]

	# define some helper functions
	function kdir( [string] $Path )
	{
	    $result = @()
	    $items = (Get-KonaStorageItem -Path $Path)
	    $files = $items.Files | Select-Object -Property Name,Length
	    $folders = $items.SubFolders| Select-Object -Property Name,Length
	    $result += $files 
	    $result += $folders
	    $result
	}
	
	function kmkdir ( [string] $Path )
	{
	    New-KonaStorageItem -Path $Path -PathType Container 
	}
	
	function kupload ( [string] $Local, [string] $Remote )
	{
	    New-KonaStorageItem -Path $Remote -PathType Leaf -SourcePath $Local
	}

	# list the directory
	kdir /

	# create a folder for storing the sample data file
	kmkdir /KonaDemo

	# upload the sample data file to the folder
	kupload D:\KonaDemo\OlympicAthletes.tsv /KonaDemo/OlympicAthletes.tsv
	# kupload https://azurebigdatatutorials.blob.core.windows.net/konaquickstart/OlympicAthletes.tsv /jgaoKonaDemo/OlympicAthletes.tsv

	# list the uploaded file
	kdir /KonaDemo


>[AZURE.NOTE] The path is case sensitive.


##Submit Kona jobs using Azure PowerShell

Create a text file with following SQLIP script, and save the text file on your workstation:

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
	    FROM @"/KonaDemo/OlympicAthletes.tsv"
	    USING new DefaultTextExtractor();
	
	OUTPUT @athletes
	    TO @"/KonaDemo/OlympicAthletes_Copy.tsv"
	    USING new DefaultTextOutputter();

> [AZURE.NOTE] Kona allows you to also process data in other cloud stores. In particular Kona can read and write data from the Microsoft Azure Blob store.


Submit the job to your account.

	$job = Submit-AzureKonaJob -AccountName sandbox –ScriptPath D:\KonaDemo\demo.sip 


Information about the job submission are stored in the $job object. You can examine that job object if you need, but it’s not so interesting at the moment. Instead let’s see what is happening to the job.

NOTE: this $job object is a “snapshot” it doesn’t automatically update as time passes. So we have to use different cmdlets to ask Kona about the current state of the jobs in the system.




Look at Jobs in Kona

    Get-AzureKonaJob -AccountName sandbox | Out-GridView 

There are a lot of columns here, so find the one that called “State” – you’ll eventually see your job is running and finally completed – the State will be ended and the Status will be Succeeded. Let’s verify that the Output file exists.

	kdir ./KonaDemo
	
	Name                                                                          Length
	----                                                                          ------
	mafs://accounts/<Your Kona Account name>/fs/KonaDemo/Olympic...               526136
	mafs://accounts/<Your Kona Account name>/fs/KonaDemo/Olympic...               526136
	mafs://accounts/<Your Kona Account name>/fs/KonaDemo/__place...                    0

As you can see the output file exists.
Now let’s download the output to examine it.

	Export-KonaStorageItem mafs://accounts/<Your Kona Account name>/fs/KonaDemo/OlympicAthletes_Copy.tsv d:\KonaDemo\OlympicAtheletes_Copy.tsv

At this point you are done with your very first scenario. You’ve learned: * Uploading, Listing, and Downloading files in the Kona FileSystem * Submitting a simple SQLIP Script and verifying its status and that it ran correctly


## Submit jobs using SQLIP Studio

[Introduce SQLIP Studio]

### Install and configure SQLIP Studio

* Install Kona PowerShell using these instructions
SQL IP Studio
* You can choose one of the following VS options:
    * Install Visual Studio 2012 or higher with Visual C++. 
    * Or if you have Visual Studio 2013 you will need to have Update 4 installed also. 
    * NOTE: VS 2015 is not supported yet
* Install Microsoft Azure SDK for .NET- 2.4 or above: 
    * For VS 2012: Install Microsoft Azure SDK for .NET (VS 2012) 
    * For VS 2013: Install Microsoft Azure SDK for .Net (VS 2013) 
* Side-by-side installs of SQL-IP Studio, SCOPE Studio, and HDI Studio are not supported currently. Uninstall any existing SCOPE Studio.
    * Most likely, you previously installed Scope Studio using an MSI, uninstall through Control Panel->Add/Remove Programs (search for Cosmos).
    * Otherwise, uninstall from Tools->Extensions in VS. 
    * Install Microsoft.Cosmos.SqlIPStudio.msi



**To connect to Kona**

1. Open Visual Studio.
2. From the **SQLIP** menu, click **Options and Settings**.
3. Click the **Credentials** tab.
4. Click **Sign In**, and follow the instructions to sign in.
5. Click **OK** to close the Options and Settings dialog.


**To create and submit a SQLIP job** 

1. From the **File** menu, click **New**, and then click **Project**.
2. Type or select the following:

	Templates: SQL IP
	template: SQL Information Production Project
	Name: MyFirstSQLIPApplication
	Location: c:\tutorials\kona
3. Click **OK**. Visual studio creates a solution with a Script.sip file.
4. Copy and paste the following script into the Script.sip file:

		@athletes =
		    EXTRACT Athlete string,
		            Age string,
		            Country string,
		            Year string,
		            ClosingCeremonyDate string,
		            Sport string,
		            GoldMedals string,
		            SilverMedals string,
		            BronzeMedals string,
		            TotalMedals string
		    FROM @"mafs://accounts/<Your Kona Account name>/fs/KonaDemo/OlympicAthletes.tsv"
		    USING new DefaultTextExtractor();
	
		OUTPUT @athletes
		TO @" mafs://accounts/<Your Kona Account name>/fs/KonaDemo/OlympicAthletes_copy.tsv "
		USING new DefaultTextOutputter();
5. From **Solution Explorer**, right click **Script.sip**, and then click **Compile Script**.
6. From **Solution Explorer**, right click **Script.sip**, and then click **Submit Script**.
7. Click **Submit**. Submission results and job link are available in the SqlipStudio Results window when the submission is completed.

**To check job state**

1. From the View menu, click Server Explorer
2. From Server Explorer, expand **Azure**, expand **SQL IP**, expand the Kona account name, expand Job Queues, and then expand DefaultQueue.
3. Find your job, and then check the **Status** column.

	![image here]()
4. Right-click the job, and then click Open in New Window. You can see its execution progress and identity performance bottleneck in Job View:

	![insert image here]()

SQLIP Studio diagnoses job execution automatically. You will receive alerts when there are some errors or performance issues in their jobs. See Job Diagnostics (link TBD) part for more information. * Job Details. Detailed information on this job is provided. * Job Graph. 

Four graphs are provided to visualize the job’s information: Stage Connection View, Stage Table View, Stage Timing View and Vertex Run Time Stats by Stage View. Tabs are used to switch among them. You can also right click on stage node or row to navigate to other views.
