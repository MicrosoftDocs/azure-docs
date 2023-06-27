---
title: Troubleshoot Inbound Provisioning API
description: Learn how to troubleshoot issues with the Inbound Provisioning API
author: jfields
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: troubleshooting
ms.workload: identity
ms.date: 06/27/2023
ms.author: kenwith
ms.reviewer: chmutali
---

# Troubleshoot Inbound Provisioning API issues

## Introduction

This document covers commonly encountered errors and issues with inbound provisioning API and how to troubleshoot them.

## Troubleshooting scenarios

### Invalid data format 

When a valid SCIM bulk request payload is sent to the provisioning API endpoint, a ```invalid data format``` HTTP 400 response code displays.

**Resolution:**
Ensure the HTTP Request has the Content-Type header set to the value ```application/scim+json```.

### There's nothing in the provisioning logs

The provisioning logs update on 40-minute cycles, so you won't see the results of your provisioning job immediately. In the future, we'll support provision-on-demand for the API. 

**Resolution:**
Verify that your job is in the start state. If not, make sure to select **Start Provisioning**.

### Unauthorized error while calling the Provisioning API

- One possible issue is that your access token has expired.
**Resolution:**
Obtain a new access token.

- A second possible issue is that the user isn't assigned the **Application Administrator** role. 
**Resolution:**
Ensure to check permissions and assign the **Application Administrator** roles to the user running the job.

### The job enters quarantine state
If your job immediately enters a quarantine state after you start provisioning, it's most likely caused by not having set the notification email prior to starting the job. 

**Resolution:**
Go to the Edit Provisioning tab. Under **Settings** you''ll see a checkbox next to **Send an email notification when a failure occurs** and a field to input your **Notification Email**. Make sure to check the box, provide your email, and save the change. Click on **Restart provisioning** to get the job out of quarantine. 

### User creation - Invalid UPN

If a user fails to get provisioned check the provisioning logs troubleshooting tab. 
If the error code is: ```AzureActiveDirectoryInvalidUserPrincipalNam``` then you need to update the User Principal Name mapping. 

**Resolution:**
1. Got to the **Edit Attribute Mappings** page.
2. Select the ```UserPrincipalName``` mapping and update it to use the ```RandomString``` function. 
3. Copy and paste this expression into the expression box:
```Join("", Replace([userName], , "(?<Suffix>@(.)*)", "Suffix", "", , ), RandomString(3, 3, 0, 0, 0, ), "@", DefaultDomain())```

This fixes the issue in the getting started steps with the sample users provided by appending a random number to the UPN value accepted by Azure AD. 

### User creation failed - Invalid domain
If a user fails to get provisioned check the provisioning logs troubleshooting tab. 
If the error code states that the ```domain does not exist```, then you need to update the User Principal Name mapping. 

**Resolution:**
1. Go to the **Edit Attribute Mappings** page. 
2. Select the ```UserPrincipalName``` mapping and copy and paste this expression into the expression input box: 
```Join("", Replace([userName], , "(?<Suffix>@(.)*)", "Suffix", "", , ), RandomString(3, 3, 0, 0, 0, ), "@", DefaultDomain())```

This fixes the issue in the getting started steps with the sample users provided by appending a random number to the UPN value accepted by Azure AD. 


## Next steps

* [Learn more about the Inbound Provisioning API](application-provisioning-api-concepts.md)

