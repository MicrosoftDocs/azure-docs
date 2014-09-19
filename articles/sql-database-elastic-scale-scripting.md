<properties title="Scripting Elastic Scale with Scripts" pageTitle="Scripting Elastic Scale with Scripts" description="Scripting Elastic Scale with Scripts, powershell, elastic scale" metaKeywords="Azure SQL Database, elastic scale, powershell scripts" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Managing  Scripting Elastic Scale with Scripts

##1. Costs 

Please note that the execution of the PowerShell example scripts will result in the creation of databases that will incur real costs to the subscription owner.  The underlying Azure SQL DBs will be charged at a rate no different than any other Azure SQL DB database.  As of June 2014, the costs are: 

* SetupShardedEnvironment runbook creates the shard map manager on a Basic database ($0.08/day) and provisions the first shard on a Basic database ($0.08/day) as well. 

* Both ProvisionBySize and ProvisionByDate runbooks will provision a Standard S1 database ($0.65/day).  To counter act these costs, if run in conjunction with the ReduceServiceTier runbook, the service tier of the newly provisioned database will be reduced from a Standard S1 ($0.65/day) to a Basic ($0.08/day) after a day’s time. 

Lastly, within the scope of the provided examples, the use of Azure Automation currently will not incur any charges to the subscription owner.  Please see the Azure Automation pricing page for more details. 


##2. Azure Automation Service 
Recently introduced as a public preview service, Azure Automation brings a powerful, much needed PowerShell Workflow execution service to the Azure platform.  Those once difficult maintenance tasks are now possible to automate, and conveniently encapsulated within the common Azure portal experience.  Simply author a PowerShell Workflow (called a “runbook” in Azure Automation), upload it to the cloud, and schedule when you want the runbook to execute. This document provides thorough details on the end-to-end setup of Azure Automation for a handful of shard elasticity examples. 

In the context of this example, Azure Automation will be utilized as the schedule and workload execution framework – think of Azure Automation as your SQL Agent in the cloud. 

In addition to the detailed steps provided in this document there have been a few getting started guides for Azure Automation to help supplement the content.  If you have any Azure Automation specific questions, please post them here.  



##3. Prerequisites
* Sign-up for the Microsoft Azure Automation Preview service [link] 
* Install Elastic Scale Starter Kit
	* This example builds upon the elastic scale foundation (i.e., shards and a shardmap) created in the Starter Kit 
* Familiarize yourself with the Azure Automation service by reviewing the getting started document [link] 

##4. Shard Elasticity PowerShell Files  

The following set of PowerhShell files provide the primitives in order to accomplish both of the previously described horizontal and vertically scaling scenarios using Azure Automation. 

To facilitate both horizontal and vertical elasticity, the provided examples illustrate how to use the Shard Elasticity with PowerShell sample module, Microsoft Azure Automation service and corresponding Azure Automation runbooks to create automated and scheduled jobs that can provision a new shard and/or change the performance level (i.e., edition) of specific shards in a shard set based on a set of rules. 


* **ShardElasticityModule.psm1** - Provides a set of methods to interact with Elastic Scale and Azure SQL DB libraries.
* **SetupShardedEnvironment.ps1** - This PowerShell runbook performs a one-time setup of a sharded environment complete with a shard map manager and range shard map.
* **ProvisionShardByDate.ps1** - This script provisions a new database in advance of the upcoming day's workload. The database is created and named based on date stamp (YYYYMMDD) and is registered with the shard map manager as a range [YYYYMMDD, YYYYMMDD + 1D). 
* **ProvisionShardBySize.ps1**– Similar to ProvisionShardByDate.ps1, but instead provisions a new database when the current database is running out of capacity.
* **ReduceServiceTier.ps1** - This script iterates through the shards in a provided shard map and determines if each individual shard is a candidate for performance tier reduction (i.e., change a database from Standard to Basic).  There are two criteria that determine whether or not the shard is a candidate 1) current service tier of the shard and 2) the age of the database.  In this implementation, the current DB service tier is 'Standard' and the desired database SKU when the DB is >= 1 day old is 'basic'. 


##5. Example Instructions 

To execute the shard elasticity scenario mentioned above, below are the detailed steps to exercise the provided example code: 

1. Author and package a PowerShell module
2. Create a Microsoft Azure Automation Account
3. Upload PowerShell module to Azure Automation as an Asset 
4. Create Azure Automation credential and variable Assets 
5. Upload PowerShell runbooks to Azure Automation 
6. Setup a sharded environment 
7. Test the Automation runbooks 
8. Publish the runbooks 
9. Schedule the runbooks 


##8.1 Author and Package a PowerShell Module 

The first step is to create a PowerShell module that references the Elastic Scale assemblies and package this module so that it is ready to be uploaded to the Azure Automation Service. 

1. Download the “ShardElasticityPowerShellSamples.zip” file from the Azure DB Elastic Scale Private Preview Yammer Files page [link]
2.  Extract all content 
3.  From your Elastic Scale Starter Kit project (must be built), go to \bin\Debug\ and copy the following files into your local “ShardElasticityModule” folder that was downloaded in step a 
	1.  Microsoft.Azure.SqlDatabase.ElasticScale.Common.dll
	2.   Microsoft.Azure.SqlDatabase.ElasticScale.ShardManagement.dll 
3.   Zip the ShardElasticityModule folder.  Note: Azure Automation requires several name conventions: given the module name ShardElasticityModule.psm1, the zip file name must match exactly (ShardElasticityModule.zip). The zip file contains the folder ShardElasticityModule (name matching name of module), which in turn contains psm1 file. If this structure is not followed, Azure Automation will not be able to unpack the module.
4.   Once you have verified that the contents and structure of the zipped folder match requirements, proceed to the next step. It should look like the following: 

##8.2 Create a Microsoft Azure Automation Account 

The second step is to create an Azure Automation Account. 
1. Go to Microsoft Azure portal [link]
2. 1. Click on **Automation**.
3. To create new Azure Automation Account, click “NEW” in the bottom-left hand corner of the screen. 
4. In the prompt shown below, please enter a valid account name and click the check in the bottom right-hand corner of the box. 
5. Proceed to the next step.  Success looks like the following: 

##8.3 Upload PowerShell module to Azure Automation as an Asset 

The third step is to upload the PowerShell module (i.e., a set of Shard Elasticity functions and Elastic Scale DLLs that can be referenced from the runbooks) from Step 1 to the Azure Automation Account created in Step 2. 

a. Click “ASSETS” from the ribbon on the top of the screen 
b. Click “IMPORT MODULE” at the bottom of the page 
c. To import the module, please click “BROWSE FOR FILE…”, locate the “ShardElasticityModule.zip” file from Step 6.1 using the prompted file browser, and then, once the correct file has been chosen, click the check in the bottom right-hand corner of the box to import.  Azure Automation service will import the module, progress can be tracked in the status bar at the bottom of the screen. 
d. Proceed to the next step. Success looks like the following. If module was not imported successfully, please ensure that zip file matches conventions detailed in step 6.2. 
##8.4 Create Azure Automation Credential and Variable Assets 

Instead of hard coding credentials and commonly used variables into the runbooks, Azure Automation provides facility to create credential and variable assets respectively that can be referenced across many runbooks.  Thus, if one needs to change a password, it only has to be changed in one location. Below are the steps to setup a credential and variable asset that will subsequently be used within the Shard Elasticity runbooks.  Let’s first start with the credential asset followed by the variable asset. 

a. Under the ShardElasticityExamples account, click “ASSETS” from the ribbon on the top of the screen 
b. Click “ADD SETTING” at the bottom of the screen.  
c. Click “ADD CREDENTIAL” 
d. Select “Windows PowerShell Credential” as the CREDENTIAL TYPE and “ElasticScaleCredential” as the Name.  Providing a DESCRIPTION is optional.  Click the arrow point to the right in the bottom right-hand corner of the box. Note: To use the runbooks without modification, it is required that one uses the variable names verbatim as provided in the instructions as these explicit variable names are referenced by the runbooks. 
e. Insert the USER NAME and PASSWORD (and CONFIRM PASSWORD) for the Azure SQL DB server on which you wish to run the Shard Elasticity Examples. Click the check in the bottom right-hand corner of the box when finished. 
f. To create the variable asset, repeat step c but this time select “ADD VARIABLE” 
g. For our purposes, we are going to create a variable for the fully-qualified Azure SQL DB server name under which the shard map manager and sharded databases will reside.  Select “String” as the VARIABLE TYPE and enter “SqlServerName”. Click the arrow pointing to the right in the bottom right-hand corner of the box to proceed. 
h. Next, enter the fully-qualified Azure SQL DB server name as the VALUE and click on the check in the bottom-right hand corner of the box to finish. 
i. You have now setup both a credential and variable asset that will be used in the Shard Elasticity runbooks.  Proceed to the next step. Success looks like the following: 

##8.5 Upload PowerShell runbooks to Azure Automation 

Continuing from Step 4, we will now upload the four example PowerShell runbooks provided. 

a. To upload a new Azure Automation Runbook, click “RUNBOOKS” in the ribbon in the center of the screen. 
b. At the bottom of the screen, click “IMPORT” 
c. Navigate to folder as discussed in Step 1 and select the SetupShardedEnvironment.ps1 first workflow and click the check mark. 
d. Repeat steps b and c for the three remaining PowerShell runbooks (ProvisionByDate.ps1, ProvisionBySize.ps1, and ReduceServiceTier.ps1) 
e. Proceed to the next step.  Success looks like the following: 

##8.6 Setup a Sharded Environment 

The next step is to execute the SetupShardedEnvironment runbook which will, unsurprisingly, setup a sharded environment complete with a shard map manager DB, a range shard map, and a shard for the current day.   
a. Following from the last action of Step 6, select the SetupShardedEnvironment runbook by clicking on its name. 
b. Click “AUTHOR” on the ribbon at the top of the page 
c. From this screen, you will see the code (and be able to edit, if you so choose) that composes the runbook complete with syntax highlighting. To setup the sharded environment, simply click the “TEST” button at the bottom of the screen to start the execution of the script.  Before the script actually executes, you will be prompted to confirm that you want to save and test the runbook, please select “YES”. 
d. You will be able to watch the status of the job in the OUTPUT PANE as it transitions from Submitting to Queued to Starting to Finished.  When finished, the Azure SQL DB server that you specified will be populated with a shard map manager database as well as a shard database.  Remember, the SetupShardedEnvironment runbook is only intended to bootstrap the sharded environment and is not intended to run on a reoccurring schedule. Proceed to the next step. Success looks like the following: 

##8.7 Test the Automation Runbook 

The next step is to test the successful execution of each of the runbooks before publishing and scheduling the runbook. 

a. Click “RUNBOOK” on the ribbon at the top of the page 
b. Click the “ProvisionByDate” runbook 
c. Click “AUTHOR” on the ribbon at the top of the page 
d. Click “SAVE” then “TEST” 
e. Success looks like the following: 
f. Repeat for the ReduceServiceTier.  Note, since ProvisionBySize and ProvisionByDate both provision new shards (just using different algorithms), it is not necessary to run ProvisionByDate at this time. 
##8.8 Publish the Runbook 
The eighth step is to publish the runbook so that it can be scheduled to execute on a periodic basis. 
a. Click “PUBLISH” on the bottom of the page 
b. Click “Published” 
c. Proceed to the next step.  Success looks like the following: 
##8.9 Schedule the Runbook 

The final step is to create and link a schedule to the runbook published in Step 8. 
a. Click “SCHEDULE” at the top of the page 
b. Click “LINK TO A NEW SCHEDULE” 
c. Name the schedule appropriately and click the right arrow button 
d. Configure the schedule 
e. When finished, click the check at the bottom of the box 
f. Once the job has been executed based on the previously established schedule, click the “JOBS” option on the ribbon at the top of the page and then select the scheduled job. 
g. Success looks like the following: 

##6. Conclusion 

You have now successfully authored and packaged a PowerShell module, uploaded the PowerShell module to Azure automation as an Asset, and created, tested, published and scheduled a runbook.  To monitor the health and status of the runbook, use the DASHBOARD and JOBS tabs. 

The provided examples only scratch the surface for what is possible when combining elastic scale, Azure SQL DB, and Azure Automation.  It is highly encouraged that you experiment with and build upon these examples to enable your elastic scale application to scale horizontal, vertically, or both. 
