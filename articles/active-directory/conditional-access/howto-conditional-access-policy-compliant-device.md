---
title: Conditional Access - Require compliant devices - Azure Active Directory
description: Create a custom Conditional Access policy to require compliant devices

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/26/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: Require compliant devices

Organizations who have deployed Microsoft Intune can use the information returned from their devices to identify devices that meet compliance requirements such as:

* Requiring a PIN to unlock
* Requiring device encryption
* Requiring a minimum or maximum operating system version
* Requiring a device is not jailbroken or rooted

This policy compliance information is forwarded to Azure AD where Conditional Access can make decisions to grant or block access to resources. More information about device compliance policies can be found in the article, [Set rules on devices to allow access to resources in your organization using Intune](/intune/protect/device-compliance-get-started)

## Create a Conditional Access policy

The following steps will help create a Conditional Access policy to require devices accessing resources be marked as compliant with your organization's Intune compliance policies.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions** > **Include**, select **All cloud apps**.
   1. If you must exclude specific applications from your policy, you can choose them from the **Exclude** tab under **Select excluded cloud apps** and choose **Select**.
   1. Select **Done**.
1. Under **Conditions** > **Client apps (Preview)**, set **Configure** to **Yes**, and select **Done**.
1. Under **Access controls** > **Grant**, select **Require device to be marked as compliant**.
   1. Select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

> [!NOTE]
> You can enroll your new devices to Intune even if you select **Require device to be marked as compliant** for **All users** and **All cloud apps** using the steps above. **Require device to be marked as compliant** control does not block Intune enrollment. 

### Known behavior

On Windows 7, iOS, Android, macOS, and some third-party web browsers Azure AD identifies the device using a client certificate that is provisioned when the device is registered with Azure AD. When a user first signs in through the browser the user is prompted to select the certificate. The end user must select this certificate before they can continue to use the browser.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)

[Device compliance policies work with Azure AD](/intune/device-compliance-get-started#device-compliance-policies-work-with-azure-ad)
