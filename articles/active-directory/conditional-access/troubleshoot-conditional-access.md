---
title: Troubleshooting sign-in problems with Conditional Access
description: This article describes what to do when your Conditional Access policies result in unexpected outcomes

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: troubleshooting
ms.date: 03/31/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Troubleshooting sign-in problems with Conditional Access

The information in this article can be used to troubleshoot unexpected sign-in outcomes related to Conditional Access using error messages and Microsoft Entra sign-in logs.

## Select "all" consequences

The Conditional Access framework provides you with a great configuration flexibility. However, great flexibility also means that you should carefully review each configuration policy before releasing it to avoid undesirable results. In this context, you should pay special attention to assignments affecting complete sets such as **all users / groups / cloud apps**.

Organizations should avoid the following configurations:

**For all users, all cloud apps:**

- **Block access** - This configuration blocks your entire organization.
- **Require device to be marked as compliant** - For users that haven't enrolled their devices yet, this policy blocks all access including access to the Intune portal. If you're an administrator without an enrolled device, this policy blocks you from getting back in to change the policy.
- **Require Hybrid Microsoft Entra domain joined device** - This policy block access has also the potential to block access for all users in your organization if they don't have a Microsoft Entra hybrid joined device.
- **Require app protection policy** - This policy block access has also the potential to block access for all users in your organization if you don't have an Intune policy. If you're an administrator without a client application that has an Intune app protection policy, this policy blocks you from getting back into portals such as Intune and Azure.

**For all users, all cloud apps, all device platforms:**

- **Block access** - This configuration blocks your entire organization.

## Conditional Access sign-in interrupt

The first way is to review the error message that appears. For problems signing in when using a web browser, the error page itself has detailed information. This information alone may describe what the problem is and that may suggest a solution.

![Screenshot showing a sign in error where a compliant device is required.](./media/troubleshoot-conditional-access/image1.png)

In the above error, the message states that the application can only be accessed from devices or client applications that meet the company's mobile device management policy. In this case, the application and device don't meet that policy.

<a name='azure-ad-sign-in-events'></a>

## Microsoft Entra sign-in events

The second method to get detailed information about the sign-in interruption is to review the Microsoft Entra sign-in events to see which Conditional Access policy or policies were applied and why.

More information can be found about the problem by clicking **More Details** in the initial error page. Clicking **More Details** reveals troubleshooting information that is helpful when searching the Microsoft Entra sign-in events for the specific failure event the user saw or when opening a support incident with Microsoft.

![Screenshot showing more details from a Conditional Access interrupted web browser sign-in.](./media/troubleshoot-conditional-access/image2.png)

To find out which Conditional Access policy or policies applied and why do the following.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Identity** > **Monitoring & health** > **Sign-in logs**.
1. Find the event for the sign-in to review. Add or remove filters and columns to filter out unnecessary information.
   1. Add filters to narrow the scope:
      1. **Correlation ID** when you have a specific event to investigate.
      1. **Conditional Access** to see policy failure and success. Scope your filter to show only failures to limit results.
      1. **Username** to see information related to specific users.
      1. **Date** scoped to the time frame in question.

   ![Screenshot showing selecting the Conditional Access filter in the sign-in log.](./media/troubleshoot-conditional-access/image3.png)

1. Once the sign-in event that corresponds to the user's sign-in failure has been found select the **Conditional Access** tab. The Conditional Access tab shows the specific policy or policies that resulted in the sign-in interruption.
   1. Information in the **Troubleshooting and support** tab may provide a clear reason as to why a sign-in failed such as a device that didn't meet compliance requirements.
   1. To investigate further, drill down into the configuration of the policies by clicking on the **Policy Name**. Clicking the **Policy Name** shows the policy configuration user interface for the selected policy for review and editing.
   1. The **client user** and **device details** that were used for the Conditional Access policy assessment are also available in the **Basic Info**, **Location**, **Device Info**, **Authentication Details**, and **Additional Details** tabs of the sign-in event.

### Policy not working as intended

Selecting the ellipsis on the right side of the policy in a sign-in event brings up policy details. This option gives administrators additional information about why a policy was successfully applied or not.

:::image type="content" source="media/troubleshoot-conditional-access/activity-details-sign-ins.png" alt-text="Screenshot showing Conditional Access Policy details click thru to see why policy applied or not." lightbox="media/troubleshoot-conditional-access/policy-details.png":::

The left side provides details collected at sign-in and the right side provides details of whether those details satisfy the requirements of the applied Conditional Access policies. Conditional Access policies only apply when all conditions are satisfied or not configured.

If the information in the event isn't enough to understand the sign-in results, or adjust the policy to get desired results, the sign-in diagnostic tool can be used. The sign-in diagnostic can be found under **Basic info** > **Troubleshoot Event**. For more information about the sign-in diagnostic, see the article [What is the sign-in diagnostic in Microsoft Entra ID](../reports-monitoring/howto-use-sign-in-diagnostics.md). You can also [use the What If tool to troubleshoot Conditional Access policies](what-if-tool.md).

If you need to submit a support incident, provide the request ID and time and date from the sign-in event in the incident submission details. This information allows Microsoft support to find the specific event you're concerned about.

### Common Conditional Access error codes

| Sign-in Error Code | Error String |
| --- | --- |
| 53000 | DeviceNotCompliant |
| 53001 | DeviceNotDomainJoined |
| 53002 | ApplicationUsedIsNotAnApprovedApp |
| 53003 | BlockedByConditionalAccess |
| 53004 | ProofUpBlockedDueToRisk |

More information about error codes can be found in the article [Microsoft Entra authentication and authorization error codes](../develop/reference-error-codes.md). Error codes in the list appear with a prefix of `AADSTS` followed by the code seen in the browser, for example `AADSTS53002`.

## Service dependencies

In some specific scenarios, users are blocked because there are cloud apps with dependencies on resources blocked by Conditional Access policy.

To determine the service dependency, check the sign-in log for the application and resource called by the sign-in. In the following screenshot, the application called is **Azure Portal** but the resource called is **Windows Azure Service Management API**. To target this scenario appropriately all the applications and resources should be similarly combined in Conditional Access policy.

:::image type="content" source="media/troubleshoot-conditional-access/service-dependency-example-sign-in.png" alt-text="Screenshot that shows an example sign-in log showing an Application calling a Resource. This scenario is also known as a service dependency." lightbox="media/troubleshoot-conditional-access/service-dependency-example-sign-in.png":::

## What to do if you're locked out?

If you're locked out of the due to an incorrect setting in a Conditional Access policy:

- Check is there are other administrators in your organization that aren't blocked yet. An administrator with access can disable the policy that is impacting your sign-in. 
- If none of the administrators in your organization can update the policy, submit a support request. Microsoft support can review and upon confirmation update the Conditional Access policies that are preventing access.

## Next steps

- [Use the What If tool to troubleshoot Conditional Access policies](what-if-tool.md)
- [Sign-in activity reports](../reports-monitoring/concept-sign-ins.md)
- [Troubleshooting Conditional Access using the What If tool](troubleshoot-conditional-access-what-if.md)
