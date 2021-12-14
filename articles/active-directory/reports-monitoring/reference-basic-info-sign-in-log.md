---
title: Basic info in the Azure AD sign-in log | Microsoft Docs
description: Learn what the basic info in the sign-in log is about.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenhoran
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 12/14/2021
ms.author: markvi
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---

# Basic info in the Azure AD sign-in log

Azure AD logs all sign-ins into an Azure tenant for compliance. As an IT administrator, you need to know what the values in a sign-in log mean, so that you can interpret the log values correctly.
This article explains the identifiers on the Basic info tab of the sign-ins log.

## Unique identifiers 

In Azure AD, a resource access has three relevant components:

- **Who** – The identity (User) performing the sign-in. 
- **How** – The client (Application) used for the access.  
- **What** – The target (Resource) accessed by the identity.


Each component has an associated unique identifier (ID). Below is an example of user using the Windows Azure Service Management API to access the Azure portal.

![Open audit logs](./media/reference-basic-info-sign-in-log/sign-in-details-basic-info.png)

### Tenant identifiers

The sign-in log tracks two tenant identifiers:

- **Home tenant** – The tenant that owns the user identity. 
- **Resource tenant** – The tenant that owns the (target) resource.

These identifiers are relevant in cross-tenant scenarios. For example, to find out how users outside your tenant are accessing your resources, select all entries where the home tenant doesn’t match the resource tenant.

### Request ID

The request ID is an identifier that corresponds to an issued token. If you are looking for sign-ins that were performed with a specific token, you need to extract the request ID from the token, first.


### Correlation ID

The correlation ID is an identifier that correlates sign-ins from the same sign-in session. The identifier was implemented for convenience. Its accuracy is not guaranteed because the value is based on parameters passed by a client. 



## Authentication requirement 

This attribute shows the highest level of authentication needed through all the sign-in steps for the sign-in to succeed. In the Graph API, supports `$filter` (`eq` and `startsWith` operators only).

## Sign-in event types 

Indicates the category of sign in that the event represents. For user sign ins, the category can be `interactiveUser` or `nonInteractiveUser` and corresponds to the value for the **isInteractive** property on the signin resource. For managed identity sign ins, the category is `managedIdentity`. For service principal sign ins, the category is **servicePrincipal**. In the Azure Portal UX, this value is not shown, but the sign-in event is placed in the tab that matches its sign-in event type. Possible values are: `interactiveUser`, `nonInteractiveUser`, `servicePrincipal`, `managedIdentity`, `unknownFutureValue`. In the Graph API, supports `$filter` (`eq` operator only).

## User type 

Type of user. Examples include member, guest, or external.


## Cross tenant access type 

Describes the type of cross tenant access used by the actor to access the resource. Possible values are: `none`, `b2bCollaboration`, `b2bDirectConnect`, `microsoftSupport`, `serviceProvider`, `unknownFutureValue`. If the sign in did not cross tenant boundaries, the value is `none`.

## Conditional access evaluation 

Shows whether continuous access evaluation (CAE) was applied to the sign-in event. There are multiple sign-in requests for each authentication. Some will be shown on the interactive tab, while others will be shown on the non-interactive tab. CAE will only be displayed as true for one of the requests, and it can be on the interactive tab or non-interactive tab. For more details, see Monitor and troubleshoot sign-ins with continuous access evaluation in Azure AD | Microsoft Docs. 































## Next steps

* [Sign-in logs in Azure Active Directory](concept-sign-ins.md)
* [What is the sign-in diagnostic in Azure AD?](overview-sign-in-diagnostics.md)
