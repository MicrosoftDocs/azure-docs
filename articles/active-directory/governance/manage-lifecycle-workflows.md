---
title: Manage lifecycle with Lifecycle workflows - Azure Active Directory
description: Learn how to manage user lifecycles with Lifecycle Workflows
services: active-directory
documentationcenter: ''
author: owinfrey
manager: karenhoran
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 01/24/2021
ms.author: owinfrey
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
---

# Manage user lifecycle with Lifecycle Workflows (preview)
With Lifecycle Workflows, you can easily ensure that users have the appropriate entitlements no matter where they fall under the Joiner-Mover-Leaver(JML) scenario. Before a new hire's start date you can add them to a group. You can generate a temporary password that is sent to their manager to help speed up the onboarding process. You can enable a user account when they join on their hire date, and send a welcome email to them. When a user is moving to a different group you can remove them from that group, and add them to a new one. When a user leaves, you can also delete user accounts.

## Prerequisites

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)]

The following **Delegated permissions** and **Application permissions** are required for access to Lifecycle Workflows:

> [!IMPORTANT]
> The Microsoft Graph API permissions shown below are currently hidden from user interfaces such as Graph Explorer and Azure AD’s API permissions UI for app registrations. In such cases you can fall back to Entitlement Managements permissions which also work for Lifecycle Workflows (“EntitlementManagement.Read.All” and “EntitlementManagement.ReadWrite.All”). The Entitlement Management permissions will stop working with Lifecycle Workflows in future versions of the preview.

|Column1  |Display String  |Description  |Admin Consent Required  |
|---------|---------|---------|---------|
|LifecycleManagement.Read.All     | Read all Lifecycle workflows, tasks, user states| Allows the app to list and read all workflows, tasks, user states related to lifecycle workflows on behalf of the signed-in user.| Yes
|LifecycleManagement.ReadWrite.All     | Read and write all lifecycle workflows, tasks, user states.| Allows the app to create, update, list, read and delete all workflows, tasks, user states related to lifecycle workflows on behalf of the signed-in user.| Yes






## Language determination within email notifications

When sending email notifications, Lifecycle Workflows can automatically set the language that is displayed. For language priority, Lifecycle Workflows follow the following hierarchy:
- The user **preferredLanguage** property in the user object takes highest priority.
- The tenant **preferredLanguage** attribute takes next priority.
If neither can be determined, Lifecycle Workflows will default the language to English. 

## Supported languages in Lifecycle Workflows


|Culture Code  |Language  |
|---------|---------|
|en-us     | English (United States)        |
|ja-jp     | Japanese (Japan)        |
|de-de     | German (Germany)        |
|fr-fr     | French (France)        |
|pt-br     | Portuguese (Brazil)        |
|zh-cn     | Chinese (Simplified, China)        |
|zh-tw     | Chinese (Simplified, Taiwan)        |
|es-es     | Spanish (Spain, International Sort)        |
|ko-kr     | Korean (Korea)        |
|it-it     | Italian (Italy)        |
|nl-nl     | Dutch (Netherlands)        |
|ru-ru     | Russian (Russia)        |
|cs-cz     | Czech (Czech Republic)        |
|pl-pl     | Polish (Poland)        |
|tr-tr     | Turkish (Turkey)        |
|da-dk     | Danish (Denmark)        |
|en-gb     | English (United Kingdom)        |
|hu-hu     | Hungarian (Hungary)        |
|nb-no     | Norwegian Bokmål (Norway)        |
|pt-pt     | Portuguese (Portugal)        |
|sv-se     | Swedish (Sweden)        |

## Supported user and query parameters

Lifecycle Workflows support a rich set of user properties that are available on the user profile in Azure AD. Lifecycle Workflows also support many of the advanced query capabilities available in Graph API. This allows you, for example, to filter on the user properties when managing user execution conditions and making API calls. For more information about currently supported user properties, and query parameters, see: [User properties](/graph/aad-advanced-queries?tabs=http#user-properties)


## Limits and constraints

|Item  |Limit  |
|---------|---------|
|Custom Workflows     |    50     |
|Number of custom tasks     |  25 per workflow       |
|Value range for offsetInDays      |    Between -60 and 60 days     |
|Default Workflow execution schedule     |     Every 3 hours    |


## Next steps
- [What are Lifecycle Workflows?](what-are-lifecycle-workflows.md)
- [Create Lifecycle workflows](create-lifecycle-workflow.md)