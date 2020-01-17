---
title: Conditions in Conditional Access policy - Azure Active Directory
description: What are conditions in an Azure AD Conditional Access policy

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 01/10/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Conditional Access: Conditions

Within a Conditional Access policy administrators can make use of conditions like sign-in risk, device platform, or location to enhance their policy decisions. 

Multiple conditions can be combined to create fine-grained and specific Conditional Access policies.

For example, when accessing a sensitive application administrators may factor sign-in risk information from Identity Protection and location into their access decision in addition to other controls like multi-factor authentication.

## Sign-in risk

For customers with access to [Identity Protection](../identity-protection/overview-identity-protection.md), sign-in risk can be evaluated as part of a Conditional Access policy. Sign-in risk represents the probability that a given authentication request isn’t authorized by the identity owner. More information about sign-in risk can be found in the articles, [What is risk](../identity-protection/concept-identity-protection-risks.md#sign-in-risk) and [How To: Configure and enable risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md).

## Device platforms

The device platform is characterized by the operating system that runs on a device. Azure AD identifies the platform by using information provided by the device, such as user agent strings. Since user agent strings can be modified this information is unverified. Device platform should be used in concert with Microsoft Intune device compliance policies or as part of a block statement. The default is to apply to all device platforms.

## Locations

When configuring location as a condition organizations can choose to include or exclude locations. These named locations may include the public IPv4 network information, country or region, or even unknown areas that dont map to countries or regions. Only IP ranges can be marked as a trusted location.

When including **any location** this includes any IP address on the internet not just configured named locations. When selecting **any location** administrators can choose to exclude **all trusted** or **selected locations**.

For example, some organizations may choose to not require multi-factor authentication when their users are connected to the network in a trusted location such as their physical headquarters. Administrators could create a policy that includes any location but excludes the selected locations for their headquarters networks

## Client apps (preview)

## Device state (preview)

## Next steps


