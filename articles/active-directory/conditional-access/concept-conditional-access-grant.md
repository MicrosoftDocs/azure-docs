---
title: Grant controls in Conditional Access policy
description: Grant controls in an Azure Active Directory Conditional Access policy.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 06/26/2023
ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, sandeo

ms.collection: M365-identity-device-management
---
# Conditional Access: Grant

Within a Conditional Access policy, an administrator can use access controls to grant or block access to resources.

:::image type="content" source="media/concept-conditional-access-grant/conditional-access-grant.png" alt-text="Screenshot of a Conditional Access policy with a grant control that requires multifactor authentication." lightbox="media/concept-conditional-access-grant/conditional-access-grant.png":::

## Block access

The control for blocking access considers any assignments and prevents access based on the Conditional Access policy configuration.

**Block access** is a powerful control that you should apply with appropriate knowledge. Policies with block statements can have unintended side effects. Proper testing and validation are vital before you enable the control at scale. Administrators should use tools such as [Conditional Access report-only mode](concept-conditional-access-report-only.md) and [the What If tool in Conditional Access](what-if-tool.md) when making changes.

## Grant access

Administrators can choose to enforce one or more controls when granting access. These controls include the following options: 

- [Require multifactor authentication (Azure AD Multifactor Authentication)](../authentication/concept-mfa-howitworks.md)
- [Require authentication strength](#require-authentication-strength)
- [Require device to be marked as compliant (Microsoft Intune)](/intune/protect/device-compliance-get-started)
- [Require hybrid Azure AD joined device](../devices/concept-hybrid-join.md)
- [Require approved client app](app-based-conditional-access.md)
- [Require app protection policy](app-protection-based-conditional-access.md)
- [Require password change](#require-password-change)

When administrators choose to combine these options, they can use the following methods:

- Require all the selected controls (control *and* control)
- Require one of the selected controls (control *or* control)

By default, Conditional Access requires all selected controls.

### Require Multifactor Authentication

Selecting this checkbox requires users to perform Azure Active Directory (Azure AD) Multifactor Authentication. You can find more information about deploying Azure AD Multifactor Authentication in [Planning a cloud-based Azure AD Multifactor Authentication deployment](../authentication/howto-mfa-getstarted.md).

[Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) satisfies the requirement for multifactor authentication in Conditional Access policies.

### Require authentication strength

Administrators can choose to require [specific authentication strengths](../authentication/concept-authentication-strengths.md) in their Conditional Access policies. These authentication strengths are defined in the **Azure portal** > **Azure Active Directory** > **Security** > **Authentication methods** > **Authentication strengths**. Administrators can choose to create their own or use the built-in versions.

### Require device to be marked as compliant

Organizations that have deployed Intune can use the information returned from their devices to identify devices that meet specific policy compliance requirements. Intune sends compliance information to Azure AD so Conditional Access can decide to grant or block access to resources. For more information about compliance policies, see [Set rules on devices to allow access to resources in your organization by using Intune](/intune/protect/device-compliance-get-started).

A device can be marked as compliant by Intune for any device operating system or by a third-party mobile device management system for Windows devices. You can find a list of supported third-party mobile device management systems in [Support third-party device compliance partners in Intune](/mem/intune/protect/device-compliance-partners).

Devices must be registered in Azure AD before they can be marked as compliant. You can find more information about device registration in [What is a device identity?](../devices/overview.md).

The **Require device to be marked as compliant** control:

   - Only supports Windows 10+, iOS, Android, and macOS devices registered with Azure AD and enrolled with Intune.
   - Microsoft Edge in InPrivate mode is considered a non-compliant device.

> [!NOTE]
> On Windows, iOS, Android, macOS, and some third-party web browsers, Azure AD identifies the device by using a client certificate that is provisioned when the device is registered with Azure AD. When a user first signs in through the browser, the user is prompted to select the certificate. The user must select this certificate before they can continue to use the browser.

You can use the Microsoft Defender for Endpoint app with the approved client app policy in Intune to set the device compliance policy to Conditional Access policies. There's no exclusion required for the Microsoft Defender for Endpoint app while you're setting up Conditional Access. Although Microsoft Defender for Endpoint on Android and iOS (app ID dd47d17a-3194-4d86-bfd5-c6ae6f5651e3) isn't an approved app, it has permission to report device security posture. This permission enables the flow of compliance information to Conditional Access.

### Require hybrid Azure AD joined device

Organizations can choose to use the device identity as part of their Conditional Access policy. Organizations can require that devices are hybrid Azure AD joined by using this checkbox. For more information about device identities, see [What is a device identity?](../devices/overview.md).

When you use the [device-code OAuth flow](../develop/v2-oauth2-device-code.md), the required grant control for the managed device or a device state condition isn't supported. This is because the device that is performing authentication can't provide its device state to the device that is providing a code. Also, the device state in the token is locked to the device performing authentication. Use the **Require Multifactor Authentication** control instead.

The **Require hybrid Azure AD joined device** control:
   - Only supports domain-joined Windows down-level (before Windows 10) and Windows current (Windows 10+) devices.
   - Doesn't consider Microsoft Edge in InPrivate mode as a hybrid Azure AD-joined device.

### Require approved client app

Organizations can require that an approved client app is used  to access selected cloud apps. These approved client apps support [Intune app protection policies](/intune/app-protection-policy) independent of any mobile device management solution.

To apply this grant control, the device must be registered in Azure AD, which requires using a broker app. The broker app can be Microsoft Authenticator for iOS, or either Microsoft Authenticator or Microsoft Company Portal for Android devices. If a broker app isn't installed on the device when the user attempts to authenticate, the user is redirected to the appropriate app store to install the required broker app.

The following client apps support this setting. This list isn't exhaustive and is subject to change:

- Microsoft Azure Information Protection
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

In Conditional Access policy, you can require that an [Intune app protection policy](/intune/app-protection-policy) is present on the client app before access is available to the selected applications. These mobile application management (MAM) app protection policies allow you to manage and protect your organization's data within specific applications.

To apply this grant control, Conditional Access requires that the device is registered in Azure AD, which requires using a broker app. The broker app can be either Microsoft Authenticator for iOS or Microsoft Company Portal for Android devices. If a broker app isn't installed on the device when the user attempts to authenticate, the user is redirected to the app store to install the broker app. App protection policies are generally available for iOS and Android, and in public preview for Microsoft Edge on Windows. [Windows devices support no more than 3 Azure AD user accounts in the same session](../devices/faq.yml#i-can-t-add-more-than-3-azure-ad-user-accounts-under-the-same-user-session-on-a-windows-10-11-device--why). For more information about how to apply policy to Windows devices, see the article [Require an app protection policy on Windows devices (preview)](how-to-app-protection-policy-windows.md).

Applications must meet certain requirements to support app protection policies. Developers can find more information about these requirements in the section [Apps you can manage with app protection policies](/mem/intune/apps/app-protection-policy#apps-you-can-manage-with-app-protection-policies). 

The following client apps support this setting. This list isn't exhaustive and is subject to change. If your app isn't in the list please check with the application vendor to confirm support:

- Adobe Acrobat Reader mobile app
- iAnnotate for Office 365
- Microsoft Cortana
- Microsoft Edge
- Microsoft Excel
- Microsoft Flow Mobile
- Microsoft Launcher
- Microsoft Lists
- Microsoft Office
- Microsoft OneDrive
- Microsoft OneNote
- Microsoft Outlook
- Microsoft Planner
- Microsoft Power BI
- Microsoft PowerApps
- Microsoft PowerPoint
- Microsoft SharePoint
- Microsoft Stream Mobile Native 2.0
- Microsoft Teams
- Microsoft To Do
- Microsoft Word
- Microsoft Whiteboard Services
- Microsoft Field Service (Dynamics 365)
- MultiLine for Intune
- Nine Mail - Email and Calendar
- Notate for Intune
- Provectus - Secure Contacts
- Yammer (Android, iOS, and iPadOS)

> [!NOTE]
> Kaizala, Skype for Business, and Visio don't support the **Require app protection policy** grant. If you require these apps to work, use the **Require approved apps** grant exclusively. Using the "or" clause between the two grants will not work for these three applications.

See [Require app protection policy and an approved client app for cloud app access with Conditional Access](app-protection-based-conditional-access.md) for configuration examples.

### Require password change

When user risk is detected, administrators can employ the user risk policy conditions to have the user securely change a password by using Azure AD self-service password reset. Users can perform a self-service password reset to self-remediate. This process closes the user risk event to prevent unnecessary alerts for administrators.

When a user is prompted to change a password, they'll first be required to complete multifactor authentication. Make sure all users have registered for multifactor authentication, so they're prepared in case risk is detected for their account.  

> [!WARNING]
> Users must have previously registered for multifactor authentication before triggering the user risk policy.

The following restrictions apply when you configure a policy by using the password change control:  

- The policy must be assigned to "all cloud apps." This requirement prevents an attacker from using a different app to change the user's password and resetting their account risk by signing in to a different app.
- **Require password change** can't be used with other controls, such as requiring a compliant device.  
- The password change control can only be used with the user and group assignment condition, cloud app assignment condition (which must be set to "all"), and user risk conditions.

### Terms of use

If your organization has created terms of use, other options might be visible under grant controls. These options allow administrators to require acknowledgment of terms of use as a condition of accessing the resources that the policy protects. You can find more information about terms of use in [Azure Active Directory terms of use](terms-of-use.md).

### Custom controls (preview)

Custom controls are a preview capability of Azure AD. When you use custom controls, your users are redirected to a compatible service to satisfy authentication requirements that are separate from Azure AD. For more information, check out the [Custom controls](controls.md) article.

## Next steps

- [Conditional Access: Session controls](concept-conditional-access-session.md)

- [Conditional Access common policies](concept-conditional-access-policy-common.md)

- [Report-only mode](concept-conditional-access-report-only.md)
