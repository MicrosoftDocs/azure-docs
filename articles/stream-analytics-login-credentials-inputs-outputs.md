<properties 
	pageTitle="Stream Analytics: Rotate log-in credentials for inputs and outputs | Azure" 
	description="Learn how to update the credentials for Stream Analytics inputs and outputs." 
	services="stream-analytics" 
	documentationCenter="" 
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="04/16/2015" 
	ms.author="jeffstok"/>

#Rotate input/output credentials

##Abstract
Azure Stream Analytics today doesn’t allow replacing the credentials on an input/output while the job is running.

While Azure Stream Analytics does support restarting a job to process output the first event that wasn’t yet processed output by the job, it has come to our attention that people would like to know how to we wanted to share the entire process for minimizeing the lag between the stopping and starting of the job.

##Part 1 - Prepare the new set of credentials:
This part is applicable to the following inputs/outputs:

* Blob Storage
* Event Hubs
* SQL Database
* Table Storage

For other inputs/outputs, proceed with Part 2.

##Blog Storage/Table Storage
1.  Go to the Storage extention on the Azure Management Portal:
<graphic>
2.  Locate the storage used by your job and go into it:
<graphic>
3.  Click the Manage Access Keys command:
<graphic>
4.  Between the Primary Access Key and the Secondary Access Key, **pick the one not used by your job**.
5.  Hit regenerate:
<graphic>
6.  Copy the newly generated key:
<graphic>
7.  Continue to Part 2.

##Event Hubs
1.  Go to the Service Bus extension on the Azure Management Portal:
<graphic>
2.  Locate the Service Bus Namespace used by your job and go into it:
<graphic>
3.  If your job uses a shared access policy on the Service Bus Namespace, jump to step 6
4.  Go to the Event Hubs tab:
<graphic>
5.  Locate the Event Hub used by your job and go into it:
<graphic>
6.  Go to the Configure Tab:
<graphic>
7.  On the Policy Name drop-down, locate the shared access policy used by your job:
<graphic>
8.  Between the Primary Key and the Secondary Key, **pick the one not used by your job**.
9.  Hit regenerate:
<graphic>
10. Copy the newly generated key:
<graphic>
11. Continue to Part 2.

##SQL Database
[AZURE.NOTE] Note: you will need to connect to the SQL Databse Service. We are going to show how to do this using the management experience on the Azure Management Portal but you may choose to use some client-side tool such as SQL Server Management Studio as well.

1.  Go to the SQL Databases extension on the Azure Management Portal:
<graphic>
2.  Locate the SQL Database used by your job and **click on the server** link on the same line:
<graphic>
3.  Click the Manage command:
<graphic>
4.  Type Database Master:
<graphic>
5.  Type in your User Name, Password and click Log on:
<graphic>
6.  Click New Query:
<graphic>
7.  Type in the following query replacing <login_name> with your User Name and replacing <enterStrongPasswordHere> with your new password:
`CREATE LOGIN <login_name> WITH PASSWORD = '<enterStrongPasswordHere>'`
8.  Click Run:
<graphic>
9.  Go back to step 2 and this time click the database:
<graphic>
10. Click the Manage command:
<graphic>
11. type in your User Name, Password, and click Log on:
<graphic>
12. Click New Query:
<graphic>
13. Type in the following query replacing <user_name> with a name by which you want to identify this login in the context of this database (you can provide the same value you gave for <login_name>, for example) and replacing <login_name> with your new user name:
`CREATE USER <user_name> FROM LOGIN <login_name>`
14. Click Run:
<graphic>
15. You should now provide your new user with the same roles and privledges your original user had.
16. Continue to Part 2.

##Part 2: Stopping the Stream Analytics Job
1.  Go to the Stream Analytics extension on the Azure Management Portal:
<graphic>
2.  Locate your job and go into it:
<graphic>
3.  Go to the Inputs tab or the Outputs tab based on whether you are rotating the credentials on an Input or on an Output.
<graphic>
4.  Click the Stop command and confirm the job has stopped:
<graphic>
Wait for the job to stop.
5.  Locate the input/output you want to rotate credentials on and go into it:
<graphic>
6.  Proceed to Part 3.

##Part 3: Editing the credentials on the Stream Analytics Job

##Blob Storage/Table Storage
1.	Find the Storage Account Key field and paste your newly generated key into it:
<graphic>
2.	Click the Save command and confirm saving your changes:
<graphic>
3.	A connection test will automatically start when you save your changes, make sure that is has successfully passed.
4.	Proceed to Part 4.

##Event Hubs
1.	Find the Event Hub Policy Key field and paste your newly generated key into it:
<graphic>
2.	Click the Save command and confirm saving your changes:
<graphic>
3.	A connection test will automatically start when you save your changes, make sure that it has successfully passed.
<graphic>
4.	Proceed to Part 4.

##Power BI
1.	Click the Renew authorization:
* <graphic>
* You will get the following confirmation:
* <graphic>
2.	Click the Save command and confirm saving your changes:
<graphic>
3.	A connection test will automatically start when you save your changes, make sure it has successfully passed.
4.	Proceed to Part 4.

##SQL Database
1.	Find the User Name and Password fields and paste your newly created set of credentials into them:
<graphic>
2.	Click the Save command and confirm saving your changes:
<graphic>
3.	A connection test will automatically start when you save your changes, make sure that it has successfully passed.
4.	Proceed to Part 4.

##Part 4: Starting you job from last stopped time
1.	Navigate away from the Input/Output:
<graphic>
2.	Click the Start command:
<graphic>
3.	Pick the Last Stopped Time and click OK:
<graphic>
4.	Proceed to Part 5.

##Part 5: Removing the old set of credentials
This part is applicable to the following inputs/outputs:
* Blob Storage
* Event Hubs
* SQL Database
* Table Storage

##Blob Storage/Table Storage
Repeat Part 1 for the Access Key that was previously used by your job to renew the now unused Access Key.

##Event Hubs
Repeat Part 1 for the Key that was previously used by your job to renew the now unused Key.

##SQL Database
1.	Go back to the query window from Part 1 Step 7 and type in the following query, replacing <previous_login_name> with the User Name that was previously used by your job:
`DROP LOGIN <previous_login_name>`
2.	Click Run:
		<graphic>
		You should get the following confirmation: Command(s) completed successfully.

