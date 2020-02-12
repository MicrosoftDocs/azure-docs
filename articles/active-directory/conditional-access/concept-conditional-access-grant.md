---
title: Grant controls in Conditional Access policy - Azure Active Directory
description: What are grant controls in an Azure AD Conditional Access policy

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
# Conditional Access: Grant

Within a Conditional Access policy, an administrator can make use of access controls to either grant or block access to resources.

![Conditional Access policy with a grant control requiring multi-factor authentication](./media/concept-conditional-access-grant/conditional-access-grant.png)

## Block access

Block takes into account any assignments and prevents access based on the Conditional Access policy configuration.

Block is a powerful control that should be wielded with appropriate knowledge. It is something administrators should use [Report-only mode](concept-conditional-access-report-only.md) to test before enabling.

## Grant access

Administrators can choose to enforce one or more controls when granting access. These controls include the following options: 

- [Require multi-factor authentication (Azure Multi-Factor Authentication)](../authentication/concept-mfa-howitworks.md)
- [Require device to be marked as compliant (Microsoft Intune)](https://docs.microsoft.com/intune/protect/device-compliance-get-started)
- [Require hybrid Azure AD joined device](../devices/concept-azure-ad-join-hybrid.md)
- [Require approved client app](app-based-conditional-access.md)
- [Require app protection policy](app-protection-based-conditional-access.md)

When administrators choose to combine these options, they can choose the following methods:

- Require all the selected controls (control **AND** control)
- Require one of the selected controls (control **OR** control)

By default Conditional Access requires all selected controls.

### Require multi-factor authentication

Selecting this checkbox will require users to perform Azure Multi-Factor Authentication. More information about deploying Azure Multi-Factor Authentication can be found in the article [Planning a cloud-based Azure Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md).

### Require device to be marked as compliant

Organizations who have deployed Microsoft Intune can use the information returned from their devices to identify devices that meet specific compliance requirements. This policy compliance information is forwarded from Intune to Azure AD where Conditional Access can make decisions to grant or block access to resources. For more information about compliance policies, see the article [Set rules on devices to allow access to resources in your organization using Intune](https://docs.microsoft.com/intune/protect/device-compliance-get-started).

### Require hybrid Azure AD joined device

Organizations can choose to use the device identity as part of their Conditional Access policy. Organizations can require that devices are hybrid Azure AD joined using this checkbox. For more information about device identities, see the article [What is a device identity?](../devices/overview.md).

### Require approved client app

Organizations can require that an access attempt to the selected cloud apps needs to be made from an approved client app.

This setting applies to the following client apps:

- Microsoft Azure Information Protection
- Microsoft Bookings
- Microsoft Cortana
- Microsoft Dynamics 365
- Microsoft Edge
- Microsoft Excel
- Microsoft Flow
- Microsoft Intune Managed Browser
- Microsoft Invoicing
- Microsoft Kaizala
- Microsoft Launcher
- Microsoft OneDrive
- Microsoft OneNote
- Microsoft Outlook
- Microsoft Planner
- Microsoft PowerApps
- Microsoft Power BI
- Microsoft PowerPoint
- Microsoft SharePoint
- Microsoft Skype for Business
- Microsoft StaffHub
- Microsoft Stream
- Microsoft Teams
- Microsoft To-Do
- Microsoft Visio
- Microsoft Word
- Microsoft Yammer

**Remarks**

- The approved client apps support the Intune mobile application management feature.
- The **Require approved client app** requirement:
   - Only supports the iOS and Android for [device platform condition](#device-platform-condition).
- Conditional Access cannot consider Microsoft Edge in InPrivate mode an approved client app.

### Require app protection policy

In your Conditional Access policy, you can require an app protection policy be present on the client app before access is available to the selected cloud apps. 

![Control access with app protection policy](./media/technical-reference/22.png)

This setting applies to the following client apps:

- Microsoft Cortana
- Microsoft OneDrive
- Microsoft Outlook
- Microsoft Planner

**Remarks**

- Apps for app protection policy support the Intune mobile application management feature with policy protection.
- The **Require app protection policy** requirements:
    - Only supports the iOS and Android for [device platform condition](#device-platform-condition).

## Next steps

- [Conditional Access: Session controls](concept-conditional-access-session.md)

- [Conditional Access common policies](concept-conditional-access-policy-common.md)

- [Report-only mode](concept-conditional-access-report-only.md)
