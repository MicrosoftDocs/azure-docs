---
title: What is Azure Active Directory Identity Protection?
description: Automation to detect, remediate, investigate, and analyze risk data with Azure AD Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: overview
ms.date: 05/19/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# What is Identity Protection?

Azure AD Identity Protection helps organizations detect, investigate, and remediate identity-based risks. These identity-based risks can be further fed into tools like Conditional Access to make access decisions or fed back to a security information and event management (SIEM) tool for further investigation and correlation. 

Identity Protection is unique in the fact that Microsoft analyses trillions of signals per day to identify and protect our customers from threats. We use the learnings acquired from Azure Active Directory, Microsoft Accounts, and in gaming with Xbox to protect your users. 

## Detect 

Microsoft is continually adding new detections to our catalog. Identity Protection detects risky behavior like: 

- Anonymous IP address usage
- Password spray attacks
- Leaked credentials 
- and more... 

During each sign-in, Identity Protection runs all real-time sign-in detections generating a sign-in session risk level, indicating how likely the sign-in has been compromised. Based on this risk level, policies are then applied to protect the user and the organization.

For a full listing of risks and how they're detected, see the article [What is risk](concept-identity-protection-risks.md).

## Investigate

Any risks detected on an identity are tracked with reporting. Identity Protection provides three key reports for administrators to investigate risks and take action: 

- Risk detections: Each risk detected is reported as a risk detection.
- Risky sign-ins: A risky sign-in is reported when there are one or more risk detections reported for that sign-in.
- Risky users: A Risky user is reported when either or both of the following are true:
   - The user has one or more Risky sign-ins.
   - One or more risk detections have been reported.

For more information about how to use the reports, see the article [How To: Investigate risk](howto-identity-protection-investigate-risk.md).

## Remediate 

Why automation is critical in security? 

In the blog post *[Cyber Signals: Defending against cyber threats with the latest research, insights, and trends](https://www.microsoft.com/security/blog/2022/02/03/cyber-signals-defending-against-cyber-threats-with-the-latest-research-insights-and-trends/)* dated February 3, 2022 Microsoft shared a threat intelligence brief including the following statistics: 

> Analyzed ...24 trillion security signals combined with intelligence we track by monitoring more than 40 nation-state groups and over 140 threat groups... 
> 
> ...From January 2021 through December 2021, we’ve blocked more than 25.6 billion Azure AD brute force authentication attacks... 

The sheer scale of signals and attacks requires some level of automation just to keep up. 

### User remediation

Risk-based Conditional Access policies can be enabled to require access controls such as providing a strong authentication method, performing multifactor authentication, or performing a secure password reset based on the detected risk level. If the user successfully completes the access control, the risk is automatically remediated. 

### Manual remediation 

When user remediation isn't enabled, an administrator must manually review them in the reports in the portal, through the API, or in Microsoft 365 Defender. Administrators can perform manual actions to dismiss, confirm safe, or confirm compromise on the risks.

## Making use of the data

Data from Identity Protection can be exported to other tools for archive, further investigation, and correlation. The Microsoft Graph based APIs allow organizations to collect this data for further processing in a tool such as their SIEM. Information about how to access the Identity Protection API can be found in the article, Get started with Azure Active Directory Identity Protection and Microsoft Graph 

Information about integrating Identity Protection information with Microsoft Sentinel can be found in the article, Connect data from Azure AD Identity Protection. 

Organizations may store data for longer periods by changing the diagnostic settings in Azure AD. They can choose to send data to a Log Analytics workspace, archive data to a storage account, stream data to Event Hubs, or send data to another solution. Detailed information about how to do so can be found in the article, How To: Export risk data. 

## Required roles

Identity Protection requires users be a Security Reader, Security Operator, Security Administrator, Global Reader, or Global Administrator in order to access.

| Role | Can do | Can't do |
| --- | --- | --- |
| Security Administrator | Full access to Identity Protection | Reset password for a user |
| Security Operator | View all Identity Protection reports and Overview <br><br> Dismiss user risk, confirm safe sign-in, confirm compromise | Configure or change policies <br><br> Reset password for a user <br><br> Configure alerts |
| Security Reader | View all Identity Protection reports and Overview | Configure or change policies <br><br> Reset password for a user <br><br> Configure alerts <br><br> Give feedback on detections |
| Global Reader | Read-only access to Identity Protection |   |
| Global Administrator | Full access to Identity Protection |   |

Currently, the Security Operator role can't access the Risky sign-ins report.

Conditional Access administrators can create policies that factor in user or sign-in risk as a condition. Find more information in the article [Conditional Access: Conditions](../conditional-access/concept-conditional-access-conditions.md#sign-in-risk).

## License requirements

[!INCLUDE [Active Directory P2 license](../../../includes/active-directory-p2-license.md)]

| Capability | Details | Azure AD Free / Microsoft 365 Apps | Azure AD Premium P1 | Azure AD Premium P2 |
| --- | --- | --- | --- | --- |
| Risk policies | Sign-in and user risk policies (via Identity Protection or Conditional Access) | No | No | Yes |
| Security reports | Overview | No | No | Yes |
| Security reports | Risky users | Limited Information. Only users with medium and high risk are shown. No details drawer or risk history. | Limited Information. Only users with medium and high risk are shown. No details drawer or risk history. | Full access|
| Security reports | Risky sign-ins | Limited Information. No risk detail or risk level is shown. | Limited Information. No risk detail or risk level is shown. | Full access |
| Security reports | Risk detections | No | Limited Information. No details drawer.| Full access |
| Notifications | Users at risk detected alerts | No | No | Yes |
| Notifications | Weekly digest | No | No | Yes | 
| MFA registration policy |   | No | No | Yes |

More information on these rich reports can be found in the article, [How To: Investigate risk](howto-identity-protection-investigate-risk.md#navigating-the-reports).

## Next steps

- [Plan an Identity Protection deployment](how-to-deploy-identity-protection.md)