---

title: What are flagged sign-ins in Azure Active Directory?
description: Provides a general overview of flagged sign-ins in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: amycolannino
editor: ''

ms.assetid: e2b3d8ce-708a-46e4-b474-123792f35526
ms.service: active-directory
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: markvi
ms.reviewer: tspring  

# Customer intent: As an Azure AD administrator, I want a tool that gives me the right level of insights into the sign-in activities in my system so that I can easily diagnose and solve problems when they occur.
ms.collection: M365-identity-device-management
---

# What are flagged sign-ins in Azure Active Directory?

As an IT admin, when a user failed to sign-in, you want to resolve the issue as soon as possible to unblock your user. Due to the amount of available data in the sign-ins log, locating the right information can be a challenge.

This article gives you an overview of a feature that significantly improves the time it takes to resolve user sign-in problems by making the related problems easy to find.




## What it is

Azure AD sign-in events are critical to understanding what went right or wrong with user sign-ins and the authentication configuration in a tenant. However, Azure AD processes over 8 billion authentications a day, which can result in so many sign-in events that admins may find it difficult to find the ones which matter. In other words, the sheer number of sign-in events can make the signal of users who need assistance get lost in the volume of a large number of events.

Flagged Sign-ins is a feature intended to increase the signal to noise ratio for user sign-ins requiring help. The functionality is intended to empower users to raise awareness about sign-in errors they want help with and, for admins and help desk workers, make finding the right events faster and more efficient. Flagged Sign-in events contain the same information as other sign-in events contain with one addition: they also indicate that a user flagged the event for review by admins.
 
Flagged sign-ins gives the user the ability to enable flagging when an error is seen on a sign-in page and then reproduce that error. The error event will then appear as “Flagged for Review” in the Azure AD Reporting blade for Sign-ins.

In summary, you can use flagged sign-ins to:

- **Empower** users to indicate the sign-in errors they need their tenant admins help on.

- **Simplify** the process of locating the sign-in errors a user needs to be resolved.

- **Enable**  help desk personal find the problems users want help with proactively- without the end user having to do anything other than flag the event.

## How it works

Flagged sign-ins gives you the ability to enable flagging when signing in using a browser and receiving an authentication error. When a user sees a sign-in error, they can select to enable flagging. For the next 20 minutes, any sign-in event from that user, on the same browser and client device or computer, will show “Flagged for Review: Yes” in the Sign-ins Report. After 20 minutes, the flagging automatically turns off.

### User: How to flag an error

1. The user receives an error during sign-in.
2. The user clicks **View details** in the error page.
3. In **Troubleshooting details**, click **Enable Flagging**. The text changes to **Disable Flagging**. Flagging is now enabled.
4. Close the browser window.
5. Open a new browser window (in the same browser application) and attempt the same sign in that failed. 
6.	Reproduce the sign-in error that was seen before.

After enabling flagging, the same browser application and client must be used or the events will not be flagged.


### Admin: Find flagged events in reports

1.	In the Azure AD portal, select **Sign-in logs** in the left-hand pane.
2.	Click **Add Filters**.
3.	In the filter menu titled **Pick a field**, select **Flagged for review**, and click **Apply**.
4.	All events that were flagged by users are shown.
5.	If needed, apply additional filters to refine the event view.
6.	Select the event to review what happened.


### Admin or Developer: Find flagged events using MS Graph

You can find flagged sign-ins with a filtered query using the sign-ins reporting API.

Show all Flagged Sign-ins:
`https://graph.microsoft.com/beta/auditLogs/signIns?&$filter=flaggedforReview eq true`

Flagged Sign-ins query for specific user by UPN (e.g.: user@contoso.com):
`https://graph.microsoft.com/beta/auditLogs/signIns?&$filter=flaggedforReview eq true and userPrincipalname eq 'user@contoso.com'`

Flagged Sign-ins query for specific user and date greater than:
`https://graph.microsoft.com/beta/auditLogs/signIns?&$filter=flaggedforReview eq true and createdDateTime ge 2021-10-01 and userPrincipalname eq 'user@contoso.com'`
 
For more information on using the sign-ins Graph API, see [signIn resource type](/graph/api/resources/signin).



 
## Who can create flagged sign-ins?

Any user signing into Azure AD via web page can use flag sign-ins for review. Member and guest users alike can flag sign-in errors for review. 

## Who can review flagged sign-ins?

Reviewing flagged sign-in events requires permissions to read the Sign-in Report events in the Azure AD portal. For more information, see [who can access it?](concept-sign-ins.md#who-can-access-it)


To flag sign-in failures, you don't need additional permissions.


## What you should know 

While the names are similar, **flagged sign-ins** and **risky sign-ins** are different capabilities:

- Flagged sign-ins are sign-in error events users are asking assistance on. 
- A risky sign-in is a functionality of identity protection. For more information, see [what is identity protection](../identity-protection/overview-identity-protection.md).




## Next steps

- [Sign-in logs in Azure Active Directory](concept-sign-ins.md)
- [Sign in diagnostics for Azure AD scenarios](concept-sign-in-diagnostics-scenarios.md)