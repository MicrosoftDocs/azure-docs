---
title: Investigate risk Azure Active Directory Identity Protection
description: Learn how to investigate risky users, detections, and sign-ins in Azure Active Directory Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 11/11/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# How To: Investigate risk

Identity Protection provides organizations with three reports they can use to investigate identity risks in their environment. These reports are the **risky users**, **risky sign-ins**, and **risk detections**. Investigation of events is key to better understanding and identifying any weak points in your security strategy.

All three reports allow for downloading of events in .CSV format for further analysis outside of the Azure portal. The risky users and risky sign-ins reports allow for downloading the most recent 2500 entries, while the risk detections report allows for downloading the most recent 5000 records.

Organizations can take advantage of the Microsoft Graph API integrations to aggregate data with other sources they may have access to as an organization.

The three reports are found in the **Azure portal** > **Azure Active Directory** > **Security**.

## Navigating the reports

Each report launches with a list of all detections for the period shown at the top of the report. Each report allows for the addition or removal of columns based on administrator preference. Administrators can choose to download the data in .CSV or .JSON format. Reports can be filtered using the filters across the top of the report.

Selecting individual entries may enable more entries at the top of the report such as the ability to confirm a sign-in as compromised or safe, confirm a user as compromised, or dismiss user risk.

Selecting individual entries expands a details window below the detections. The details view allows administrators to investigate and take action on each detection. 

## Risky users

:::image type="content" source="media/howto-identity-protection-investigate-risk/risky-users-without-details.png" alt-text="Risky users report in the Azure portal" lightbox="media/howto-identity-protection-investigate-risk/risky-users-with-details.png":::

With the information provided by the risky users report, administrators can find:

- Which users are at risk, have had risk remediated, or have had risk dismissed?
- Details about detections
- History of all risky sign-ins
- Risk history
 
Administrators can then choose to take action on these events. Administrators can choose to:

- Reset the user password
- Confirm user compromise
- Dismiss user risk
- Block user from signing in
- Investigate further using Microsoft Defender for Identity

## Risky sign-ins

:::image type="content" source="media/howto-identity-protection-investigate-risk/risky-sign-ins-without-details.png" alt-text="Risky sign-ins report in the Azure portal" lightbox="media/howto-identity-protection-investigate-risk/risky-sign-ins-with-details.png":::

The risky sign-ins report contains filterable data for up to the past 30 days (one month).

With the information provided by the risky sign-ins report, administrators can find:

- Which sign-ins are classified as at risk, confirmed compromised, confirmed safe, dismissed, or remediated.
- Real-time and aggregate risk levels associated with sign-in attempts.
- Detection types triggered
- Conditional Access policies applied
- MFA details
- Device information
- Application information
- Location information

Administrators can then choose to take action on these events. Administrators can choose to:

- Confirm sign-in compromise
- Confirm sign-in safe

> [!NOTE] 
> Identity Protection evaluates risk for all authentication flows, whether it be interactive or non-interactive. The risky sign-in report now shows both interactive and non-interactive sign-ins. Use the "sign-in type" filter to modify this view.

## Risk detections

:::image type="content" source="media/howto-identity-protection-investigate-risk/risk-detections-without-details.png" alt-text="Risk detections report in the Azure portal" lightbox="media/howto-identity-protection-investigate-risk/risk-detections-with-details.png":::

The risk detections report contains filterable data for up to the past 90 days (three months).

With the information provided by the risk detections report, administrators can find:

- Information about each risk detection including type.
- Other risks triggered at the same time
- Sign-in attempt location
- Link out to more detail from Microsoft Defender for Cloud Apps.

Administrators can then choose to return to the user's risk or sign-ins report to take actions based on information gathered.

> [!NOTE] 
> Our system may detect that the risk event that contributed to the risk user risk score was a false positives or the user risk was remediated with policy enforcement such as completing an MFA prompt or secure password change. Therefore our system will dismiss the risk state and a risk detail of “AI confirmed sign-in safe” will surface and it will no longer contribute to the user’s risk. 

## Investigation framework

Organizations may use the following frameworks to begin their investigation into any suspicious activity. Investigations may require having a conversation with the user in question, review of the [sign-in logs](../reports-monitoring/concept-sign-ins.md), or review of the [audit logs](../reports-monitoring/concept-audit-logs.md) to name a few.

1. Check the logs and validate whether the suspicious activity is normal for the given user.
   1. Look at the user’s past activities including at least the following properties to see if they're normal for the given user. 
      1. Application
      1. Device - Is the device registered or compliant?
      1. Location - Is the user traveling to a different location or accessing devices from multiple locations?
      1. IP address 
      1. User agent string
   1. If you have access to other security tools like [Microsoft Sentinel](../../sentinel/overview.md), check for corresponding alerts that might indicate a larger issue.
1. Reach out to the user to confirm if they recognize the sign-in. Methods such as email or Teams may be compromised.
   1. Confirm the information you have such as:
      1. Application
      1. Device 
      1. Location 
      1. IP address 

### Investigate Azure AD threat intelligence detections

To investigate an Azure AD Threat Intelligence risk detection, follow these steps: 

If more information is shown for the detection:

1. Sign-in was from a suspicious IP Address:
   1. Confirm if the IP address shows suspicious behavior in your environment.
   1. Does the IP generate a high number of failures for a user or set of users in your directory?
   1. Is the traffic of the IP coming from an unexpected protocol or application, for example Exchange legacy protocols?
   1. If the IP address corresponds to a cloud service provider, rule out that there are no legitimate enterprise applications running from the same IP.
1. This account was attacked by a Password spray:
   1. Validate that no other users in your directory are targets of the same attack.
   1. Do other users have sign-ins with similar atypical patterns seen in the detected sign-in within the same time frame? Password spray attacks may display unusual patterns in:
      1. User agent string
      1. Application
      1. Protocol
      1. Ranges of IPs/ASNs
      1. Time and frequency of sign-ins

## Next steps

- [Remediate and unblock users](howto-identity-protection-remediate-unblock.md)

- [Policies available to mitigate risks](concept-identity-protection-policies.md)

- [Enable sign-in and user risk policies](howto-identity-protection-configure-risk-policies.md)
