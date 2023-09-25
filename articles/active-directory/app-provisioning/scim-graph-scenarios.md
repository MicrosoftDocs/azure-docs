---
title: Use SCIM, Microsoft Graph, and Microsoft Entra ID to provision users and enrich apps with data
description: Using SCIM and the Microsoft Graph together to provision users and enrich your application with the data it needs in Microsoft Entra ID.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: reference
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: arvinh
---


# Using SCIM and Microsoft Graph together to provision users and enrich your application with the data it needs

**Target audience:** This article is targeted towards developers building applications to be integrated with Microsoft Entra ID. If you're looking to use applications already integrated with Microsoft Entra ID, such as Zoom, ServiceNow, and DropBox, you can skip this article and review the application specific [tutorials](../saas-apps/tutorial-list.md) or review [how the provisioning service works](./how-provisioning-works.md).

**Common scenarios**

Microsoft Entra ID provides an out of the box service for provisioning and an extensible platform to build your applications on. The decision tree outlines how a developer would use [SCIM](https://aka.ms/scimoverview) and the [Microsoft Graph](/graph/overview) to automate provisioning. 

> [!div class="checklist"]
> * Automatically create users in my application
> * Automatically remove users from my application when they shouldn't have access anymore
> * Integrate my application with multiple identity providers for provisioning
> * Enrich my application with data from Microsoft services such as Teams, Outlook, and Office.
> * Automatically create, update, and delete users and groups in Microsoft Entra ID and Active Directory

![SCIM Graph decision tree](./media/user-provisioning/scim-graph.png)

## Scenario 1: Automatically create users in my app
Today, IT admins provision users by manually creating user accounts or periodically uploading CSV files into my application. The process is time consuming for customers and slows down adoption of my application. All I need is basic user information such as name, email, and userPrincipalName to create a user. 

**Recommendation**: 
* If your customers use various IdPs and you do not want to maintain a sync engine to integrate with each, support a SCIM compliant [/Users](https://aka.ms/scimreferencecode) endpoint. Your customers will be able to easily use this endpoint to integrate with the Microsoft Entra provisioning service and automatically create user accounts when they need access. You can build the endpoint once and it will be compatible with all IdPs. Check out the example request below for how a user would be created using SCIM.
* If you require user data found on the user object in Microsoft Entra ID and other data from across Microsoft, consider building a SCIM endpoint for user provisioning and calling into the Microsoft Graph to get the rest of the data. 

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

## Scenario 2: Automatically remove users from my app
The customers using my application are security focused and have governance requirements to remove accounts when employees don't need them anymore. How can I automate deprovisioning from my application?

**Recommendation:** Support a SCIM compliant /Users endpoint. The Microsoft Entra provisioning service will send requests to disable and delete when the user shouldn't have access anymore. We recommend supporting both disabling and deleting users. See the examples below for what a disable and delete request look like. 

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

## Scenario 3: Automate managing group memberships in my app
My application relies on groups for access to various resources, and customers want to reuse the groups that they have in Microsoft Entra ID. How can I import groups from Microsoft Entra ID and keep them updated as the memberships change?  

**Recommendation:** Support a SCIM compliant /Groups [endpoint](https://aka.ms/scimreferencecode). The Microsoft Entra provisioning service will take care of creating groups and managing membership updates in your application. 

## Scenario 4: Enrich my app with data from Microsoft services such as Teams, Outlook, and OneDrive
My application is built into Microsoft Teams and relies on message data. In addition, we store files for users in OneDrive. How can I enrich my application with the data from these services and across Microsoft?

**Recommendation:** The [Microsoft Graph](/graph/) is your entry point to access Microsoft data. Each workload exposes APIs with the data that you need. The Microsoft graph can be used along with [SCIM provisioning](./use-scim-to-provision-users-and-groups.md) for the scenarios above. You can use SCIM to provision basic user attributes into your application while calling into graph to get any other data that you need. 

<a name='scenario-5-track-changes-in-microsoft-services-such-as-teams-outlook-and-azure-ad'></a>

## Scenario 5: Track changes in Microsoft services such as Teams, Outlook, and Microsoft Entra ID
I need to be able to track changes to Teams and Outlook messages and react to them in real time. How can I get these changes pushed to my application?

**Recommendation:** The Microsoft Graph provides [change notifications](/graph/webhooks) and [change tracking](/graph/delta-query-overview) for various resources. Note the following limitations of change notifications:
- If an event receiver acknowledges an event, but fails to act on it for any reason, the event may be lost.
- The order in which changes are received are not guaranteed to be chronological.
- Change notifications don't always contain the [resource data](/graph/webhooks-with-resource-data)
For the reasons above, developers often use change notifications along with change tracking for synchronization scenarios. 

<a name='scenario-6-provision-users-and-groups-in-azure-ad'></a>

## Scenario 6: Provision users and groups in Microsoft Entra ID
My application creates information about a user that customers need in Microsoft Entra ID. This could be an HR application than manages hiring, a communications app that creates phone numbers for users, or some other app that generates data that would be valuable in Microsoft Entra ID. How do I populate the user record in Microsoft Entra ID with that data? 

**Recommendation** The Microsoft graph exposes /Users and /Groups endpoints that you can integrate with today to provision users into Microsoft Entra ID. Please note that Microsoft Entra ID doesn't support writing those users back into Active Directory. 

> [!NOTE]
> Microsoft has a provisioning service that pulls in data from HR applications such as Workday and SuccessFactors. These integrations are built and managed by Microsoft. For onboarding a new HR application to our service, you can request it on [UserVoice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789). 

## Related articles

- [Review the synchronization Microsoft Graph documentation](/graph/api/resources/synchronization-overview)
- [Integrating a custom SCIM app with Microsoft Entra ID](use-scim-to-provision-users-and-groups.md)
