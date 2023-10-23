---
title: Troubleshoot inbound provisioning API
description: Learn how to troubleshoot issues with the inbound provisioning API.
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: troubleshooting
ms.workload: identity
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: chmutali
---

# Troubleshoot inbound provisioning API issues (Public preview)

## Introduction

This document covers commonly encountered errors and issues with inbound provisioning API and how to troubleshoot them.

## Troubleshooting scenarios

### Invalid data format 

**Issue description**
* You're getting the error message 'Invalid Data Format" with HTTP 400 (Bad Request) response code.

**Probable causes**
1. You're sending a valid bulk request as per the provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API specs, but you have not set the HTTP Request Header 'Content-Type' to `application/scim+json`. 
2. You're sending a bulk request that doesn't comply to the provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API specs.

**Resolution:**
1. Ensure the HTTP Request has the `Content-Type` header set to the value ```application/scim+json```.
1. Ensure that the bulk request payload complies to the provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API specs.

### There's nothing in the provisioning logs

**Issue description**
* You sent a request to the provisioning /bulkUpload API endpoint and you got HTTP 202 response code, but there's no data in the provisioning logs corresponding to your request. 

**Probable causes**
1. Your API-driven provisioning app is paused. 
1. The provisioning service is yet to update the provisioning logs with the bulk request processing details.
2. Your On-premises provisioning agent status is inactive (If you are running the [/API-driven inbound user provisioning to on-premises Active Directory](https://go.microsoft.com/fwlink/?linkid=2245182)).


**Resolution:**
1. Verify that your provisioning app is running. If it isn't running, select the menu option **Start provisioning** to process the data.
2. Turn your On-premises provisioning agent status to active by restarting the On-premise agent.
1. Expect 5 to 10-minute delay between processing the request and writing to the provisioning logs. If your API client is sending data to the provisioning /bulkUpload API endpoint, then introduce a time delay between the request invocation and provisioning logs query. 

### Forbidden 403 response code 

**Issue description**
* You sent a request to the provisioning /bulkUpload API endpoint and you got HTTP 403 (Forbidden) response code. 

**Probable causes**
* The Graph permission `SynchronizationData-User.Upload` is not assigned to your API client. 

**Resolution:**
* Assign your API client the Graph permission `SynchronizationData-User.Upload` and retry the operation. 

### Unauthorized 401 response code

**Issue description**
* You sent a request to the provisioning /bulkUpload API endpoint and you got HTTP 401 (Unauthorized) response code. The error code displays "InvalidAuthenticationToken" with a message that the "Access token has expired or is not yet valid."  

**Probable causes**
* Your access token has expired. 

**Resolution:**
* Generate a new access token for your API client. 

### The job enters quarantine state

**Issue description**
* You just started the provisioning app and it is in quarantine state. 

**Probable causes**
* You have not set the notification email prior to starting the job. 

**Resolution:**
Go to the **Edit Provisioning** menu item. Under **Settings** there's a checkbox next to **Send an email notification when a failure occurs** and a field to input your **Notification Email**. Make sure to check the box, provide an email, and save the change. Click on **Restart provisioning** to get the job out of quarantine. 

### User creation - Invalid UPN

**Issue description**
There's a user provisioning failure. The provisioning logs displays the error code: ```AzureActiveDirectoryInvalidUserPrincipalName```.  

**Resolution:**
1. Got to the **Edit Attribute Mappings** page.
2. Select the ```UserPrincipalName``` mapping and update it to use the ```RandomString``` function. 
3. Copy and paste this expression into the expression box:
```Join("", Replace([userName], , "(?<Suffix>@(.)*)", "Suffix", "", , ), RandomString(3, 3, 0, 0, 0, ), "@", DefaultDomain())```

This expression fixes the issue by appending a random number to the UPN value accepted by Microsoft Entra ID.

### User creation failed - Invalid domain

**Issue description**
There's a user provisioning failure. The provisioning logs displays an error message that states ```domain does not exist```.  

**Resolution:**
1. Go to the **Edit Attribute Mappings** page. 
2. Select the ```UserPrincipalName``` mapping and copy and paste this expression into the expression input box: 
```Join("", Replace([userName], , "(?<Suffix>@(.)*)", "Suffix", "", , ), RandomString(3, 3, 0, 0, 0, ), "@", DefaultDomain())```

This expression fixes the issue by appending a default domain to the UPN value accepted by Microsoft Entra ID. 

## Next steps

* [Learn more about API-driven inbound provisioning](inbound-provisioning-api-concepts.md)
