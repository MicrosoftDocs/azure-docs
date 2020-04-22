---
title: Using SCIM and the Microsoft Graph together to provision users and enrich your application with the data it needs | Microsoft Docs
description: Using SCIM and the Microsoft Graph together to provision users and enrich your application with the data it needs .
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---


# Using SCIM and Microsoft Graph together to provision users and enrich your application with the data it needs

**Target audience:** This document is targeted towards developers building applications integrated with Azure AD. For others looking to integrate an existing application such as Zoom, ServiceNow, Dropbox, etc. you can skip this and review the application specific [tutorials](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list). 

**Common scenarios**

> [!div class="checklist"]
> * Automatically create users in my application
> * Automatically remove users from my application when they shouldn't have access anymore
> * Integrate my application with multiple identity providers for provisioning
> * Enrich my application with data from Microsoft services such as Sharepoint, Outlook, and Office.
> * Automatically create, update, and delete users and groups in Azure AD and Active Directory

![SCIM Graph decision tree](./media/user-provisioning/scim-graph.png)

## Scenario 1: Automatically create users in my application
Today, IT admins manually create user accounts in my application each time someone needs access or pereodically upload CSV files. The process is time consuming for customers and slows down adoption of my application. All I need is basic [user](https://docs.microsoft.com/graph/api/resources/user?view=graph-rest-1.0) information such as name, email, and userPrincipalName to create a user. Furthermore, my customers use various IdPs and I don't have the resources to maintain a sync engine and custom integrations with each IdP. 

**Recommendation**: Support a SCIM compliant [/Users](https://aka.ms/scimreferencecode) endpoint. Your customers will be able to easily use this endpoint to integrate with the Azure AD provisioning service and automatically create user accounts when they need access. You can build the endpoint once and it will be compatible with all IdPs, without having to maintain a sync engine. Check out the example request below for how a user would be created.

```json
POST /Users
{
	"schemas": [
	    "urn:ietf:params:scim:schemas:core:2.0:User",
	    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"],
	"externalId": "0a21f0f2-8d2a-4f8e-bf98-7363c4aed4ef",
	"userName": "BillG",
	"active": true,
	"meta": {
		"resourceType": "User"
	},
	"name": {
		"formatted": "Bill Gates",
		"familyName": "Gates",
		"givenName": "Bill"
	},
	"roles": []
}
```
    
## Scenario 2: Automatically remove users from my application when they shouldn't have access anymore
The customers using my application are security focused and have governance requirements to remove accounts when employees don't need them anymore. How can I automate deprovisioning from my application?

**Recommendation:** Support a SCIM compliant /Users endpoint. The Azure AD provisioning service will send requests to disable and delete when the user should not have access anymore. We recommend supporting both disabling and deleting users. See the examples below for what a disable and delete request look like. 

Disable user
```json
PATCH /Users/5171a35d82074e068ce2 HTTP/1.1
{
    "Operations": [
        {
            "op": "Replace",
            "path": "active",
            "value": false
        }
    ],
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ]
}
```
Delete user
```json
DELETE /Users/5171a35d82074e068ce2 HTTP/1.1
```

## Scenario 3: Automate provisioning groups and managing group memberships in my application. 
My application relies on groups for access to various resources, and customers want to reuse the groups that they have in Azure AD. How can I import groups from Azure AD and keep them updated as the memberships change?  

**Recommendation:** Support a SCIM compliant /Groups [endpoint](https://aka.ms/scimreferencecode). The Azure AD provisioning service will take care of creating groups and managing memmbership updates in your application. 

## Scenario 4: Enrich my application with data from Microsoft services such as Teams, Outlook, and OneDrive.
My application is built into Microsoft Teams and relies on message data. In addition, we store files for users in OneDriveHow can I enrich my application with resources across Microsoft?

**Recommendation:** The Microsoft Graph is your entry point to access Microsoft data. Each workload exposes APIs with the data that you need. The Microsoft graph can be used along with SCIM provisioning for the scenarios above. You can use SCIM to provision basic user attributes into your application while calling into graph to get any other data that you need. 

## Scenario 5: Track changes in Microsoft services such as Teams, Outlook, and others.
I need to be able to track changes to Teams and Outlook messages and react to them in real time. How can I get these changes pushed to my application?

**Recommendation:** The Microsoft Graph provides [change notifications](https://docs.microsoft.com/graph/webhooks) and change tracking for various resources. Note the following limitations of change notifications:
- If an event receiver acknowledges an event, but fails to act on it for any reason, the event may be lost
- If an event receiver acknowledges an event, but fails to act on it for any reason, the event may be lost
- Change notifications do not always contain the [resource data](https://docs.microsoft.com/graph/webhooks-with-resource-data)
For the reasons above, developers often use change notifications along with change tracking for synchronization scenarios. 

## Scenario 6: Automatically create, update, and delete users and groups in Azure AD and Active Directory
My application creates information about a user that customers need in Azure AD. This could be an HR application than manages hiring, a communications app that creates phone numbers for users, or some other app that generates data that would be valuable in Azure AD. How do I populate the user record in Azure AD with that data? 

**Recommendation** The Microsoft graph exposes /Users and /Groups endpoints that you can integrate with today to provision users into Azure AD. Please note that Azure Active Directory does not support writing those users back into Active Directory. 

> [!NOTE]
> Microsoft has a provisioning service that pulls in data from HR applications such as Workday and SuccessFactors. These integrations are built and managed by Microsoft. For onboarding a new HR application to our service, you can request it on [UserVoice](https://feedback.azure.com/forums/374982-azure-active-directory-application-requests). 

## Related articles

- [Review the synchronization Microsoft Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
