---
title: Conditions in Conditional Access policy - Azure Active Directory
description: What are conditions in an Azure AD Conditional Access policy

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 02/11/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Conditional Access: Conditions

Within a Conditional Access policy, an administrator can make use of signals from conditions like risk, device platform, or location to enhance their policy decisions. 

![Define a Conditional Access policy and specify conditions](./media/concept-conditional-access-conditions/conditional-access-conditions.png)

Multiple conditions can be combined to create fine-grained and specific Conditional Access policies.

For example, when accessing a sensitive application an administrator may factor sign-in risk information from Identity Protection and location into their access decision in addition to other controls like multi-factor authentication.

## Sign-in risk

For customers with access to [Identity Protection](../identity-protection/overview-identity-protection.md), sign-in risk can be evaluated as part of a Conditional Access policy. Sign-in risk represents the probability that a given authentication request isn’t authorized by the identity owner. More information about sign-in risk can be found in the articles, [What is risk](../identity-protection/concept-identity-protection-risks.md#sign-in-risk) and [How To: Configure and enable risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md).

## Device platforms

The device platform is characterized by the operating system that runs on a device. Azure AD identifies the platform by using information provided by the device, such as user agent strings. Since user agent strings can be modified, this information is unverified. Device platform should be used in concert with Microsoft Intune device compliance policies or as part of a block statement. The default is to apply to all device platforms.

## Locations

When configuring location as a condition, organizations can choose to include or exclude locations. These named locations may include the public IPv4 network information, country or region, or even unknown areas that don't map to specific countries or regions. Only IP ranges can be marked as a trusted location.

When including **any location**, this option includes any IP address on the internet not just configured named locations. When selecting **any location**, administrators can choose to exclude **all trusted** or **selected locations**.

For example, some organizations may choose to not require multi-factor authentication when their users are connected to the network in a trusted location such as their physical headquarters. Administrators could create a policy that includes any location but excludes the selected locations for their headquarters networks

## Client apps (preview)

Conditional Access policies by default apply to browser-based applications and applications that utilize modern authentication protocols. In addition to these applications, administrators can choose to include Exchange ActiveSync clients and other clients that utilize legacy protocols.

- Browser
   - These include web-based applications that use protocols like SAML, WS-Federation, OpenID Connect, or services registered as an OAuth confidential client.
- Mobile apps and desktop clients
   - Modern authentication clients
      - This option includes applications like the Office desktop and phone applications.
   - Exchange ActiveSync clients
      - When policy blocks the use of Exchange ActiveSync the affected user will receive a single quarantine email. This email with provide information on why they are blocked and include remediation instructions if able.
   - Other clients
      - This option includes clients that use basic/legacy authentication protocols including IMAP, MAPI, POP, SMTP, and legacy Office applications that do not support modern authentication.

These conditions are commonly used when requiring a managed device, blocking legacy authentication, and blocking web applications but allowing mobile or desktop apps.

### Exchange ActiveSync clients

- Organizations can only select Exchange ActiveSync clients when assigning policy to users or groups. Selecting **All users**, **All guest and external users**, or **Directory roles** will cause all users to become blocked.
- When creating a policy assigned to Exchange ActiveSync clients, **Office 365 Exchange Online** should be the only cloud application assigned to the policy. 
- Organizations can narrow the scope of this policy to specific platforms using the **Device platforms** condition.

If the access control assigned to the policy uses **Require approved client app**, the user is directed to install and use the Outlook mobile client. In the case that **Multi-factor authentication** is required, affected users are blocked, because basic authentication does not support multi-factor authentication.

For more information, see the following articles:

- [Block legacy authentication with Conditional Access](block-legacy-authentication.md)
- [Requiring approved client apps with Conditional Access](app-based-conditional-access.md)

## Device state (preview)

The device state condition can be used to exclude devices that are hybrid Azure AD joined and/or devices marked as compliant with a Microsoft Intune compliance policy from an organization's Conditional Access policies.

For example, *All users* accessing the *Microsoft Azure Management* cloud app including **All device state** excluding **Device Hybrid Azure AD joined** and **Device marked as compliant** and for *Access controls*, **Block**. 
   - This example would create a policy that only allows access to Microsoft Azure Management from devices that are hybrid Azure AD joined and/or devices marked as compliant.

## Next steps

- [Conditional Access: Grant](concept-conditional-access-grant.md)

- [Conditional Access common policies](concept-conditional-access-policy-common.md)
