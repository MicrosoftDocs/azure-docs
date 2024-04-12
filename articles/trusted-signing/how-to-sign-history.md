---
title: Access signed transactions in Trusted Signing 
description: How-to access signed transactions in Trusted Signing in Azure portal. 
author: mehasharma 
ms.author: mesharm 
ms.service: azure-code-signing 
ms.topic: how-to 
ms.date: 04/01/2024 
---

# Access signed transactions in Trusted Signing

Review the details of the signing requests executed by Trusted Signing in Azure portal. 
Currently there are four different options enabled:  
- Log Analytics workspace  
- Storage Account  
- Event Hub  
- Partner Solution   

Following is an example of how to view signing transactions through storage account.
## Prerequisites:  
- Ability to create storage accounts in a subscription. (Note: The billing of storage accounts is separate from Trusted Signing resources.)  
- Sign in to the Azure portal.

## Send signed transactions to storage account 
Follow the steps to access and send sign transactions to your storage account:  
1.	Follow this guide to create Storage Accounts, Create a storage account - Azure Storage | Microsoft Learn, in the same region as your trusted signing account (Basic storage account is sufficient)  
2.	Navigate to your trusted signing account in the Azure portal.
3.	On the trusted signing account overview page, locate **Diagnostics Settings** under Monitoring section. 
    1.	Select Diagnostics Settings on the left-side blade and click **+ Add diagnostic setting** link on the left side.
    2.	From **Diagnostics setting** page, select **Sign Transactions** category and choose ‘Archive to a storage account’ option and select the subscription and Storage account that you newly created or already have. 
    4.	After selecting subscription & storage account, click **Save**. This action brings you to previous page where it displays list of all diagnostics settings created for this code sign account.  
    5.	After creating a diagnostic setting, wait for 10-15 mins before the events begin to get ingested to the newly created storage account.  
    6.	Navigate to the storage account created in step 1. In this example, we will use storage account **storagetestneu1**.  
    7.	From storage account resource, navigate to **Containers** under **Data storage**. 
    8.	From the list, select container named **insights-logs-signtransactions** and navigate to the date and time you're looking to download the log.    
