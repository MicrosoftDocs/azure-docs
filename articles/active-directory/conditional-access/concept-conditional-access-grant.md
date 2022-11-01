---
title: Grant controls in Conditional Access policy - Azure Active Directory
description: Grant controls in an Azure Active Directory Conditional Access policy.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 09/06/2022
ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, sandeo

ms.collection: M365-identity-device-management
---
# Conditional Access: Grant

Within a Conditional Access policy, an administrator can use access controls to grant or block access to resources.

:::image type="content" source="media/concept-conditional-access-session/conditional-access-session.png" alt-text="Screenshot of a Conditional Access policy with a grant control that requires multifactor authentication." lightbox="media/concept-conditional-access-session/conditional-access-session.png":::

## Block access

The control for blocking access considers any assignments and prevents access based on the Conditional Access policy configuration.

**Block access** is a powerful control that you should apply with appropriate knowledge. Policies with block statements can have unintended side effects. Proper testing and validation are vital before you enable the control at scale. Administrators should use tools such as [Conditional Access report-only mode](concept-conditional-access-report-only.md) and [the What If tool in Conditional Access](what-if-tool.md) when making changes.

## Grant access

Administrators can choose to enforce one or more controls when granting access. These controls include the following options: 

- [Require multifactor authentication (Azure AD Multi-Factor Authentication)](../authentication/concept-mfa-howitworks.md)
- [Require device to be marked as compliant (Microsoft Intune)](/intune/protect/device-compliance-get-started)
- [Require hybrid Azure AD joined device](../devices/concept-azure-ad-join-hybrid.md)
- [Require approved client app](app-based-conditional-access.md)
- [Require app protection policy](app-protection-based-conditional-access.md)
- [Require password change](#require-password-change)

When administrators choose to combine these options, they can use the following methods:

- Require all the selected controls (control *and* control)
- Require one of the selected controls (control *or* control)

By default, Conditional Access requires all selected controls.

### Require Multi-Factor Authentication

Selecting this checkbox requires users to perform Azure Active Directory (Azure AD) Multi-factor Authentication. You can find more information about deploying Azure AD Multi-Factor Authentication in [Planning a cloud-based Azure AD Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md).

[Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) satisfies the requirement for multifactor authentication in Conditional Access policies.

### Require device to be marked as compliant

Organizations that have deployed Intune can use the information returned from their devices to identify devices that meet specific policy compliance requirements. Intune sends compliance information to Azure AD so Conditional Access can decide to grant or block access to resources. For more information about compliance policies, see [Set rules on devices to allow access to resources in your organization by using Intune](/intune/protect/device-compliance-get-started).

A device can be marked as compliant by Intune for any device operating system or by a third-party mobile device management system for Windows 10 devices. You can find a list of supported third-party mobile device management systems in [Support third-party device compliance partners in Intune](/mem/intune/protect/device-compliance-partners).

Devices must be registered in Azure AD before they can be marked as compliant. You can find more information about device registration in [What is a device identity?](../devices/overview.md).

The **Require device to be marked as compliant** control:
   - Only supports Windows 10+, iOS, Android, and macOS devices registered with Azure AD and enrolled with Intune.
   - Considers Microsoft Edge in InPrivate mode a non-compliant device.

> [!NOTE]
> On Windows 7, iOS, Android, macOS, and some third-party web browsers, Azure AD identifies the device by using a client certificate that is provisioned when the device is registered with Azure AD. When a user first signs in through the browser, the user is prompted to select the certificate. The user must select this certificate before they can continue to use the browser.

You can use the Microsoft Defender for Endpoint app with the approved client app policy in Intune to set the device compliance policy to Conditional Access policies. There's no exclusion required for the Microsoft Defender for Endpoint app while you're setting up Conditional Access. Although Microsoft Defender for Endpoint on Android and iOS (app ID dd47d17a-3194-4d86-bfd5-c6ae6f5651e3) isn't an approved app, it has permission to report device security posture. This permission enables the flow of compliance information to Conditional Access.

### Require hybrid Azure AD joined device

Organizations can choose to use the device identity as part of their Conditional Access policy. Organizations can require that devices are hybrid Azure AD joined by using this checkbox. For more information about device identities, see [What is a device identity?](../devices/overview.md).

When you use the [device-code OAuth flow](../develop/v2-oauth2-device-code.md), the required grant control for the managed device or a device state condition isn't supported. This is because the device that is performing authentication can't provide its device state to the device that is providing a code. Also, the device state in the token is locked to the device performing authentication. Use the **Require Multi-Factor Authentication** control instead.

The **Require hybrid Azure AD joined device** control:
   - Only supports domain-joined Windows down-level (before Windows 10) and Windows current (Windows 10+) devices.
   - Doesn't consider Microsoft Edge in InPrivate mode as a hybrid Azure AD-joined device.

### Require approved client app

Organizations can require that an approved client app is used  to access selected cloud apps. These approved client apps support [Intune app protection policies](/intune/app-protection-policy) independent of any mobile device management solution.

To apply this grant control, the device must be registered in Azure AD, which requires using a broker app. The broker app can be Microsoft Authenticator for iOS, or either Microsoft Authenticator or Microsoft Company Portal for Android devices. If a broker app isn't installed on the device when the user attempts to authenticate, the user is redirected to the appropriate app store to install the required broker app.

The following client apps support this setting:

- Microsoft Azure Information Protection
- Microsoft Bookings
- Microsoft Cortana
- Microsoft Dynamics 365
- Microsoft Edge
- Microsoft Excel
- Microsoft Power Automate
- Microsoft Invoicing
- Microsoft Kaizala
- Microsoft Launcher
- Microsoft Lists
- Microsoft Office
- Microsoft OneDrive
- Microsoft OneNote
- Microsoft Outlook
- Microsoft Planner
- Microsoft Power Apps
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
- Microsoft Whiteboard
- Microsoft 365 Admin

**Remarks**
   - The approved client apps support the Intune mobile application management feature.
   -  The **Require approved client app** requirement:
      - Only supports the iOS and Android for device platform condition.
      - Requires a broker app to register the device. The broker app can be Microsoft Authenticator for iOS, or either Microsoft Authenticator or Microsoft Company Portal for Android devices.
- Conditional Access can't consider Microsoft Edge in InPrivate mode an approved client app.
- Conditional Access policies that require Microsoft Power BI as an approved client app don't support using Azure AD Application Proxy to connect the Power BI mobile app to the on-premises Power BI Report Server.

See [Require approved client apps for cloud app access with Conditional Access](app-based-conditional-access.md) for configuration examples.

### Require app protection policy

In your Conditional Access policy, you can require that an [Intune app protection policy](/intune/app-protection-policy) is present on the client app before access is available to the selected cloud apps.

To apply this grant control, Conditional Access requires that the device is registered in Azure AD, which requires using a broker app. The broker app can be either Microsoft Authenticator for iOS or Microsoft Company Portal for Android devices. If a broker app isn't installed on the device when the user attempts to authenticate, the user is redirected to the app store to install the broker app.

Applications must have the Intune SDK with policy assurance implemented and must meet certain other requirements to support this setting. Developers who are implementing applications with the Intune SDK can find more information on these requirements in the [SDK documentation](/mem/intune/developer/app-sdk-get-started).

The following client apps are confirmed to support this setting:

- Microsoft Cortana
- Microsoft Edge
- Microsoft Excel
- Microsoft Lists
- Microsoft Office
- Microsoft OneDrive
- Microsoft OneNote
- Microsoft Outlook
- Microsoft Planner
- Microsoft Power BI
- Microsoft PowerPoint
- Microsoft SharePoint
- Microsoft Teams
- Microsoft To Do
- Microsoft Word
- Microsoft Power Apps
- Microsoft Field Service (Dynamics 365)
- MultiLine for Intune
- Nine Mail - Email and Calendar
- Notate for Intune

This list is not all encompassing, if your app is not in this list please check with the application vendor to confirm support.

> [!NOTE]
> Kaizala, Skype for Business, and Visio don't support the **Require app protection policy** grant. If you require these apps to work, use the **Require approved apps** grant exclusively. Using the "or" clause between the two grants will not work for these three applications.

Apps for the app protection policy support the Intune mobile application management feature with policy protection.

The **Require app protection policy** control:

- Only supports iOS and Android for device platform condition.
- Requires a broker app to register the device. On iOS, the broker app is Microsoft Authenticator. On Android, the broker app is Intune Company Portal.

See [Require app protection policy and an approved client app for cloud app access with Conditional Access](app-protection-based-conditional-access.md) for configuration examples.

### Require password change

When user risk is detected, administrators can employ the user risk policy conditions to have the user securely change a password by using Azure AD self-service password reset. Users can perform a self-service password reset to self-remediate. This process will close the user risk event to prevent unnecessary alerts for administrators.

When a user is prompted to change a password, they'll first be required to complete multifactor authentication. Make sure all users have registered for multifactor authentication, so they're prepared in case risk is detected for their account.  

> [!WARNING]
> Users must have previously registered for self-service password reset before triggering the user risk policy.

The following restrictions apply when you configure a policy by using the password change control:  

- The policy must be assigned to "all cloud apps." This requirement prevents an attacker from using a different app to change the user's password and resetting their account risk by signing in to a different app.
- **Require password change** can't be used with other controls, such as requiring a compliant device.  
- The password change control can only be used with the user and group assignment condition, cloud app assignment condition (which must be set to "all"), and user risk conditions.

### Terms of use

If your organization has created terms of use, other options might be visible under grant controls. These options allow administrators to require acknowledgment of terms of use as a condition of accessing the resources that the policy protects. You can find more information about terms of use in [Azure Active Directory terms of use](terms-of-use.md).

### Custom controls (preview)

Custom controls is a preview capability of Azure AD. When you use custom controls, your users are redirected to a compatible service to satisfy authentication requirements that are separate from Azure AD. For more information, check out the [Custom controls](controls.md) article.

## Next steps

- [Conditional Access: Session controls](concept-conditional-access-session.md)

- [Conditional Access common policies](concept-conditional-access-policy-common.md)

- [Report-only mode](concept-conditional-access-report-only.md)
