---
title: 'Stream Analytics: Rotate log-in credentials for inputs and outputs | Microsoft Docs'
description: Learn how to update the credentials for Stream Analytics inputs and outputs.
keywords: login credentials
services: stream-analytics
documentationcenter: ''
author: SnehaGunda
manager: jhubbard
editor: cgronlun

ms.assetid: 42ae83e1-cd33-49bb-a455-a39a7c151ea4
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 01/11/2018
ms.author: sngun

---
# Rotate login credentials for inputs and outputs in Stream Analytics Jobs

Azure Stream Analytics currenlty doesn’t allow replacing the credentials on an input/output while the job is running. 

While Azure Stream Analytics does support resuming a job from last output, we wanted to share the entire process for minimizing the lag between the stopping and starting of the job and rotating the login credentials.

## Regenerate the credentials
This part is applicable to the following inputs/outputs:

* Blob Storage
* Event Hubs
* SQL Database
* Table Storage

For other inputs/outputs, proceed to [stop the Stream Analytics job](#part-2-stopping-the-stream-analytics-job) section.

### Blob storage/Table storage

1. Sign in to the Azure portal > browse the storage account that you used as input/output for the Stream Analytics job.  
2. From the Settings section, open **Access keys**. Between the two default keys (key1, key2), pick the one that is not used by your job and regenerate it:  
   ![Regenerate keys for storage account][.\media\stream-analytics-login-credentials-inputs-outputs\image1.png]
3. Copy the newly generated key.  
4. From the Azure portal, browse your Stream Analytics job > Select **Stop** and wait for the job to stop.  
5. Next, locate the input/output for which you want to rotate credentials.
6. Find the **Storage Account Key** field and paste your newly generated key > **Save**  
7. A connection test will automatically start when you save your changes, you can view it from the notifications tab. There ar two notifications- one corresponds to saving the update and other corresponds to testing the connection: 
   ![Notifications after editing the key][.\media\stream-analytics-login-credentials-inputs-outputs\image3.png]
8. Proceed to Part 4.

### Event hubs

1. Sign in to the Azure portal > browse the Event Hub that you used as input/output for the Stream Analytics job.  
2. From the Settings section, open **Shared access policies** and select the required access policy. Between the Primary Key and the Secondary Key, pick the one that is not used by your job and regenerate it:
   ![Regenerate keys for Event Hub][.\media\stream-analytics-login-credentials-inputs-outputs\image2.png]
3. Copy the newly generated key.  
4. From the Azure portal, browse your Stream Analytics job > Select **Stop** and wait for the job to stop.  
5. Next, locate the input/output for which you want to rotate credentials.  
6. Find the **Event Hub policy Key** field and paste your newly generated key > **Save**  
7. A connection test will automatically start when you save your changes, make sure that it has successfully passed.  
8. Proceed to Part 4.

### SQL Database

You need to connect to the SQL database to create a new user and login credentials. You can rotate credentials by using Azure portal or a client-side tool such as SQL Server Management Studio. This section demonstrates the process of rotating credentials by using Azure portal.

1. Go to the SQL Databases extension on the Azure Management portal:  
   ![graphic14][graphic14]
2. Locate the SQL Database used by your job and **click on the server** link on the same line:  
   ![graphic15][graphic15]
3. Click the Manage command:  
   ![graphic16][graphic16]
4. Type Database Master:  
   ![graphic17][graphic17]
5. Type in your User Name, Password, and click Log on:  
   ![graphic18][graphic18]
6. Click New Query:  
   ![graphic19][graphic19]
7. Type in the following query replacing <login_name> with your User Name and replacing <enterStrongPasswordHere> with your new password:  
   `CREATE LOGIN <login_name> WITH PASSWORD = '<enterStrongPasswordHere>'`
8. Click Run:  
   ![graphic20][graphic20]
9. Go back to step 2 and this time click the database:  
   ![graphic21][graphic21]
10. Click the Manage command:  
   ![graphic22][graphic22]
11. type in your User Name, Password, and click Logon:  
   ![graphic23][graphic23]
12. Click New Query:  
   ![graphic24][graphic24]
13. Type in the following query replacing <user_name> with a name by which you want to identify this login in the context of this database (you can provide the same value you gave for <login_name>, for example) and replacing <login_name> with your new user name:  
   `CREATE USER <user_name> FROM LOGIN <login_name>`
14. Click Run:  
   ![graphic25][graphic25]
15. You should now provide your new user with the same roles and privileges your original user had.
16. Continue to [stop the Stream Analytics job](part-2-stopping-the-stream-analytics-job) section.

## Stop the Stream Analytics Job
1. Sign in to the Azure portal > browse your Stream Analytics job > Select **Stop** and wait for the job to stop.  
2. Browse to the Inputs or the Outputs tile based on whether you are rotating credentials for an Input or an Output.  
3. Locate the input/output for which you want to rotate credentials.  
4. Proceed to Part 3.

## Update credentials for the Stream Analytics Job

### Blob storage/Table storage
1. Find the **Storage Account Key** field and paste your newly generated key > **Save** 
2. A connection test will automatically start when you save your changes, you can view it from the notifications tab. There ar two notifications- one corresponds to saving the update and other corresponds to testing the connection: 
   ![Notifications after editing the key][.\media\stream-analytics-login-credentials-inputs-outputs\image3.png]
4. Proceed to Part 4.

### Event hubs
1. Find the **Event Hub policy Key** field and paste your newly generated key > **Save**  
3. A connection test will automatically start when you save your changes, make sure that it has successfully passed.
4. Proceed to Part 4.

### Power BI
1. Sign in to the Azure portal > browse your Stream Analytics job > Select **Stop** and wait for the job to stop.  
2. Locate the input/output for which you want to rotate credentials.  
3. Click the Renew authorization:  

   ![graphic35][graphic35]
2. You will get the following confirmation:  

   ![graphic36][graphic36]
3. Click the Save command and confirm saving your changes:  
   ![graphic37][graphic37]
4. A connection test will automatically start when you save your changes, make sure it has successfully passed.
5. Proceed to Part 4.

### SQL Database
1. Find the User Name and Password fields and paste your newly created set of credentials into them:  
   ![graphic38][graphic38]
2. Click the Save command and confirm saving your changes:  
   ![graphic39][graphic39]
3. A connection test will automatically start when you save your changes, make sure that it has successfully passed.  
4. Proceed to Part 4.

## Part 4: Start your job from last stopped time
1. Navigate away from the Input/Output:  
   ![graphic40][graphic40]
2. Click the Start command:  
   ![graphic41][graphic41]
3. Pick the Last Stopped Time and click OK:  
   ![graphic42][graphic42]
4. Proceed to Part 5.  

## Part 5: Remove the old credentials
This part is applicable to the following inputs/outputs:

* Blob Storage
* Event Hubs
* SQL Database
* Table Storage

### Blob storage/Table storage
Repeat Part 1 for the Access Key that was previously used by your job to renew the now unused Access Key.

### Event hubs
Repeat Part 1 for the Key that was previously used by your job to renew the now unused Key.

### SQL Database
1. Go back to the query window from Part 1 Step 7 and type in the following query, replacing <previous_login_name> with the User Name that was previously used by your job:  
   `DROP LOGIN <previous_login_name>`  
2. Click Run:  
   ![graphic43][graphic43]  

You should get the following confirmation: 

    Command(s) completed successfully.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

[graphic14]: ./media/stream-analytics-login-credentials-inputs-outputs/14-stream-analytics-login-credentials-inputs-outputs.png
[graphic15]: ./media/stream-analytics-login-credentials-inputs-outputs/15-stream-analytics-login-credentials-inputs-outputs.png
[graphic16]: ./media/stream-analytics-login-credentials-inputs-outputs/16-stream-analytics-login-credentials-inputs-outputs.png
[graphic17]: ./media/stream-analytics-login-credentials-inputs-outputs/17-stream-analytics-login-credentials-inputs-outputs.png
[graphic18]: ./media/stream-analytics-login-credentials-inputs-outputs/18-stream-analytics-login-credentials-inputs-outputs.png
[graphic19]: ./media/stream-analytics-login-credentials-inputs-outputs/19-stream-analytics-login-credentials-inputs-outputs.png
[graphic20]: ./media/stream-analytics-login-credentials-inputs-outputs/20-stream-analytics-login-credentials-inputs-outputs.png
[graphic21]: ./media/stream-analytics-login-credentials-inputs-outputs/21-stream-analytics-login-credentials-inputs-outputs.png
[graphic22]: ./media/stream-analytics-login-credentials-inputs-outputs/22-stream-analytics-login-credentials-inputs-outputs.png
[graphic23]: ./media/stream-analytics-login-credentials-inputs-outputs/23-stream-analytics-login-credentials-inputs-outputs.png
[graphic24]: ./media/stream-analytics-login-credentials-inputs-outputs/24-stream-analytics-login-credentials-inputs-outputs.png
[graphic25]: ./media/stream-analytics-login-credentials-inputs-outputs/25-stream-analytics-login-credentials-inputs-outputs.png
./media/stream-analytics-login-credentials-inputs-outputs/34-stream-analytics-login-credentials-inputs-outputs.png
[graphic35]: ./media/stream-analytics-login-credentials-inputs-outputs/35-stream-analytics-login-credentials-inputs-outputs.png
[graphic36]: ./media/stream-analytics-login-credentials-inputs-outputs/36-stream-analytics-login-credentials-inputs-outputs.png
[graphic37]: ./media/stream-analytics-login-credentials-inputs-outputs/37-stream-analytics-login-credentials-inputs-outputs.png
[graphic38]: ./media/stream-analytics-login-credentials-inputs-outputs/38-stream-analytics-login-credentials-inputs-outputs.png
[graphic39]: ./media/stream-analytics-login-credentials-inputs-outputs/39-stream-analytics-login-credentials-inputs-outputs.png
[graphic40]: ./media/stream-analytics-login-credentials-inputs-outputs/40-stream-analytics-login-credentials-inputs-outputs.png
[graphic41]: ./media/stream-analytics-login-credentials-inputs-outputs/41-stream-analytics-login-credentials-inputs-outputs.png
[graphic42]: ./media/stream-analytics-login-credentials-inputs-outputs/42-stream-analytics-login-credentials-inputs-outputs.png
[graphic43]: ./media/stream-analytics-login-credentials-inputs-outputs/43-stream-analytics-login-credentials-inputs-outputs.png

