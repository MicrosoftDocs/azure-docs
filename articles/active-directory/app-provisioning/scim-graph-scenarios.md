---
title: Using SCIM and Microsoft Graph together to provision users and enrich your application with the data it needs | Microsoft Docs
description: Need to set up provisioning for multiple instances of an application? Learn how to save time by using the Microsoft Graph APIs to automate the configuration of automatic provisioning.
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

Developers can use this reference to understand the various tools that Microsoft provides to automate provisioning. 

**Common scenarios**

> [!div class="checklist"]
> * Automatically create user accounts in my application
> * Automatically remove users from my applications when they shouldn't have access anymore
> * Integrate my application with multiple identity providers for provisioning
> * Enrich my application with data from Microsoft services such as Sharepoint, Outlook, and Office.
> * Automatically create, update, and delete users and groups in Azure AD and Active Directory
>* Flows..


## Scenario 1: Automatically create user accounts in my application
Today, IT manually create user accounts in my application each time someone needs access. My app is so widely used in the organization that IT has to create 100s of accounts a week and it's really slowing down adoption. I just need basic information such as name, email, and userPrincipalName to create a user account. How can I automatically create user accounts in my application?

**Recommendation**: Support a SCIM compliant /Users endpoint. Your customers will be able to easily use this endpoint to integrate with the Azure AD provisioning service and automatically create user accounts when they need access. Check out the example request below for how a user would be created.

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
    
## Scenario 2: Automatically remove users from my applications when they shouldn't have access anymore
The customers using my application are security focused and have governance requirements to remove accounts when people don't need them anymore. How can I automate deprovisioning from my application?

**Recommendation:** Support a SCIM compliant /Users endpoint, allowing for deletidisabling and deleting users. We know accidents happen and customers may unintentionally remove a user from a group causing our service to remove the user from your application. Supporting the disable functionality helps customers recover from these mistakes. 

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

## Scenario 3: Integrate my application with multiple identity providers for provisioning
My customers use various IdPs, not just Azure AD. Is there a way to automate provisioning to all? 

**Recommendation:** Ensure that your SCIM endpoint adheres to the protocol specifications. A SCIM compliant endpoint should work out of the box with an SCIM compliant client. The majority of IdPs have SCIM clients that you can integrate with. Azure AD provides a [test suite](https://github.com/AzureAD/SCIMReferenceCode/wiki/Test-Your-SCIM-Endpoint) that you can use to check if your endpoint is SCIM compliant. 

<Image>

## Scenario 4: Enrich my application with data from Microsoft services such as Sharepoint, Outlook, and Office.
My application relies on Sharepoint to provide access to users to resources as well as information from Outlook. How can I enrich my application with data from those resources?

**Recommendation:** The Microsoft Graph is your entry point to access Microsoft resources. Each workload exposes APIs so that you can access the Microsoft data that you need. The Microsoft graph can be used along with SCIM provisioning for the scenarios above. You can use SCIM to provision basic user attributes into your application while calling into graph to get any other data that you need. 

## Scenario 5: Automatically create, update, and delete users and groups in Azure AD and Active Directory
My application creates information about a user that customers need in Azure AD. This could be an HR application than manages hiring, a communications app that creates phone numbers for users, or some other app that generates data that would be baluable in Azure AD. How do I populate the user record in Azure AD with that data? 

**Recommendation** The Microsoft graph exposes / Users and /Groups endpoints that you can integrate with today. Please note that this only supports pushing users into Azure AD, not Active Directory. 

> [!NOTE]
> Microsoft has a provisioning service that pulls in data from HR applications such as Workday and SuccessFactors. These integrates are built and managed by Microsoft. 

## Related articles

- [Review the synchronization Microsoft Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
