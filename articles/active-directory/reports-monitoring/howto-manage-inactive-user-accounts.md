---
title: How to manage inactive user accounts
description: Learn how to detect and resolve user accounts that have become obsolete
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/05/2023
ms.author: sarahlipsey
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---
# How To: Manage inactive user accounts

In large environments, user accounts are not always deleted when employees leave an organization. As an IT administrator, you want to detect and resolve these obsolete user accounts because they represent a security risk.

This article explains a method to handle obsolete user accounts in Azure Active Directory (Azure AD). 

## What are inactive user accounts?

Inactive accounts are user accounts that are not required anymore by members of your organization to gain access to your resources. One key identifier for inactive accounts is that they haven't been used *for a while* to sign in to your environment. Because inactive accounts are tied to the sign-in activity, you can use the timestamp of the last sign-in that was successful to detect them. 

The challenge of this method is to define what *for a while* means in the case of your environment. For example, users might not sign in to an environment *for a while*, because they are on vacation. When defining what your delta for inactive user accounts is, you need to factor in all legitimate reasons for not signing in to your environment. In many organizations, the delta for inactive user accounts is between 90 and 180 days. 

The last successful sign-in provides potential insights into a user's continued need for access to resources.  It can help with determining if group membership or app access is still needed or could be removed. For external user management, you can understand if an external user is still active within the tenant or should be cleaned up. 

## How to detect inactive user accounts

You can detect inactive accounts by evaluating the `lastSignInDateTime` property exposed by the `signInActivity` resource type of the **Microsoft Graph API**. The `lastSignInDateTime` property shows the last time a user made a successful interactive sign-in to Azure AD. Using this property, you can implement a solution for the following scenarios:

- **Users by name**: In this scenario, you search for a specific user by name, which enables you to evaluate the `lastSignInDateTime`:
    - `https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'markvi')&$select=displayName,signInActivity`

- **Users by date**: In this scenario, you request a list of users with a `lastSignInDateTime` before a specified date:
    - `https://graph.microsoft.com/v1.0/users?$filter=signInActivity/lastSignInDateTime le 2019-06-01T00:00:00Z`

- **Last sign-in date and time for all users**: In this scenario you need to generate a report of the last sign-in date of all users. You request a list of all users, and the last `lastSignInDateTime` for each respective user:
    - `https://graph.microsoft.com/v1.0/users?$select=displayName,signInActivity` 

> [!NOTE]
> When you request the `signInActivity` property while listing users, the maximum page size is 120 users. Requests with $top set higher than 120 will fail. The `signInActivity` property supports `$filter` (`eq`, `ne`, `not`, `ge`, `le`) *but not with any other filterable properties*. 

## What you need to know

This section lists several details about the `lastSignInDateTime` property.

- The `lastSignInDateTime` property is exposed by the [signInActivity resource type](/graph/api/resources/signinactivity) of the [Microsoft Graph API](/graph/overview#whats-in-microsoft-graph).   

- The property is *not* available through the Get-AzureAdUser cmdlet.

- To access the property, you need an Azure Active Directory Premium edition license.

- To read the property, you need to grant the app the following Microsoft Graph permissions: 
    - AuditLog.Read.All
    - Directory.Read.All  
    - User.Read.All

- Each interactive sign-in that was successful results in an update of the underlying data store. Typically, successful sign-ins show up in the related sign-in report within 10 minutes.
 
- To generate a `lastSignInDateTime` timestamp, you need a successful sign-in. Because the `lastSignInDateTime` property is a new feature, the value of the `lastSignInDateTime` property may be blank if:
    - The last successful sign-in of a user took place before April 2020.
    - The affected user account was never used for a successful sign-in.

- The last sign-in date is associated with the user object. The value is retained until the next sign-in of the user. 

## Next steps

* [Get data using the Azure Active Directory reporting API with certificates](tutorial-access-api-with-certificates.md)
* [Audit API reference](/graph/api/resources/directoryaudit) 
* [Sign-in activity report API reference](/graph/api/resources/signin)

