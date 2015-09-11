# Manage Kona users

*****working in progress - doesn't seem there is enough information to make this subject as an article by itself.  Maybe creating a general management article for Kona***

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


