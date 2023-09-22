---

title: What are flagged sign-ins in Microsoft Entra ID?
description: Provides a general overview of flagged sign-ins in Microsoft Entra ID.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: overview
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/25/2023
ms.author: sarahlipsey
ms.reviewer: tspring  

# Customer intent: As a Microsoft Entra administrator, I want a tool that gives me the right level of insights into the sign-in activities in my system so that I can easily diagnose and solve problems when they occur.
---

# What are flagged sign-ins in Microsoft Entra ID?

As an IT admin, when a user failed to sign-in, you want to resolve the issue as soon as possible to unblock your user. Due to the amount of available data in the sign-ins log, locating the right information can be a challenge.

This article gives you an overview of a feature that significantly improves the time it takes to resolve user sign-in problems by making the related problems easy to find.

## What are flagged sign-ins?

Microsoft Entra sign-in events are critical to understanding what went right or wrong with user sign-ins and the authentication configuration in a tenant. However, Microsoft Entra ID processes over 8 billion authentications a day, which can result in so many sign-in events that admins may find it difficult to find the ones which matter. In other words, the sheer number of sign-in events can make the signal of users who need assistance get lost in the volume of a large number of events.

Flagged Sign-ins is a feature intended to increase the signal to noise ratio for user sign-ins requiring help. The functionality is intended to empower users to raise awareness about sign-in errors they want help with. Admins and help desk workers also benefit from finding the right events more efficiently. Flagged Sign-in events contain the same information as other sign-in events contain with one addition: they also indicate that a user flagged the event for review by admins.
 
Flagged sign-ins give the user the ability to enable flagging when an error is seen on a sign-in page and then reproduce that error. The error event then appears as “Flagged for Review” in the Microsoft Entra sign-ins log.

In summary, you can use flagged sign-ins to:

- **Empower** users to indicate the sign-in errors they need their tenant admins help on.

- **Simplify** the process of locating the sign-in errors a user needs to be resolved.

- **Enable**  help desk personal find the problems users want help with proactively- without the end user having to do anything other than flag the event.

## How it works

Flagged sign-ins gives you the ability to enable flagging when signing in using a browser and receiving an authentication error. When a user sees a sign-in error, they can select to enable flagging. For the next 20 minutes, any sign-in event from that user, on the same browser and client device or computer, will show “Flagged for Review: Yes” in the Sign-ins Report. After 20 minutes, the flagging automatically turns off.

### User: How to flag an error

1. The user receives an error during sign-in.
2. The user selects **View details** in the error page.
3. In **Troubleshooting details**, select **Enable Flagging**. The text changes to **Disable Flagging**. Flagging is now enabled.
4. Close the browser window.
5. Open a new browser window (in the same browser application) and attempt the same sign-in that failed. 
6. Reproduce the sign-in error that was seen before.

With flagging enabled, the same browser application and client must be used or the events aren't flagged.


### Admin: Find flagged events in reports

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Reader](../roles/permissions-reference.md#global-reader).
1. Browse to **Identity** > **Monitoring & health** > **Sign-in logs**.
1. Open the **Add filters** menu and select **Flagged for review**. All events that were flagged by users are shown.
1. If needed, apply more filters to refine the event view.
1. Select the event to review what happened.


### Admin or Developer: Find flagged events using MS Graph

You can find flagged sign-ins with a filtered query using the sign-ins reporting API.

Show all Flagged Sign-ins:
`https://graph.microsoft.com/beta/auditLogs/signIns?&$filter=flaggedforReview eq true`

Flagged Sign-ins query for specific user by UPN (for example: user@contoso.com):
`https://graph.microsoft.com/beta/auditLogs/signIns?&$filter=flaggedforReview eq true and userPrincipalname eq 'user@contoso.com'`

Flagged Sign-ins query for specific user and date greater than:
`https://graph.microsoft.com/beta/auditLogs/signIns?&$filter=flaggedforReview eq true and createdDateTime ge 2021-10-01 and userPrincipalname eq 'user@contoso.com'`
 
For more information on using the sign-ins Graph API, see [signIn resource type](/graph/api/resources/signin).



 
## Who can create flagged sign-ins?

Any user signing into Microsoft Entra ID via web page can use flag sign-ins for review. Member and guest users alike can flag sign-in errors for review. 

## Who can review flagged sign-ins?

Reviewing flagged sign-in events requires permissions to read the sign-in report events in the Azure portal. For more information, see [How to access activity logs](howto-access-activity-logs.md#prerequisites).


To flag sign-in failures, you don't need extra permissions.


## What you should know 

While the names are similar, **flagged sign-ins** and **risky sign-ins** are different capabilities:

- Flagged sign-ins are sign-in error events users are asking assistance on. 
- A risky sign-in is a functionality of identity protection. For more information, see [what is identity protection](../identity-protection/overview-identity-protection.md).




## Next steps

- [Sign-in logs in Microsoft Entra ID](concept-sign-ins.md)
- [Sign-in diagnostics for Microsoft Entra scenarios](concept-sign-in-diagnostics-scenarios.md)
