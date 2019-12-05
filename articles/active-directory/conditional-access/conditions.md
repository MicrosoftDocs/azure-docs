---
title: What are conditions in Azure Active Directory Conditional Access? | Microsoft Docs
description: Learn how conditions are used in Azure Active Directory Conditional Access to trigger a policy.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 05/17/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

#Customer intent: As an IT admin, I need to understand the conditions in Conditional Access so that I can set them according to my business needs
ms.collection: M365-identity-device-management
---
# What are conditions in Azure Active Directory Conditional Access?

You can control how users access your cloud apps by using [Azure Active Directory (Azure AD) Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal). In a Conditional Access policy, you define the response ("Then do this") to the reason for triggering your policy ("When this happens").

![Reason and response](./media/conditions/10.png)

In the context of Conditional Access, **When this happens** is called a **condition**. **Then do this** is called an **access control**. The combination of your conditions and your access controls represents a Conditional Access policy.

![Conditional Access policy](./media/conditions/61.png)

Conditions you haven't configured in a Conditional Access policy aren't applied. Some conditions are [mandatory](best-practices.md) to apply a Conditional Access policy to an environment.

This article is an overview of the conditions and how they're used in a Conditional Access policy. 

## Users and groups

The users and groups condition is mandatory in a Conditional Access policy. In your policy, you can either select **All users** or select specific users and groups.

![Users and groups](./media/conditions/111.png)

When you select **All users**, your policy is applied to all users in the directory, including guest users.

When you **Select users and groups**, you can set the following options:

* **All guest users** targets a policy to B2B guest users. This condition matches any user account that has the **userType** attribute set to **guest**. Use this setting when a policy needs to be applied as soon as the account is created in an invite flow in Azure AD.
* **Directory roles** targets a policy based on a user’s role assignment. This condition supports directory roles like **Global administrator** or **Password administrator**.
* **Users and groups** targets specific sets of users. For example, you can select a group that contains all members of the HR department when an HR app is selected as the cloud app. A group can be any type of group in Azure AD, including dynamic or assigned security and distribution groups.

You can also exclude specific users or groups from a policy. One common use case is service accounts if your policy enforces multifactor authentication (MFA).

Targeting specific sets of users is useful for the deployment of a new policy. In a new policy, you should target only an initial set of users to validate the policy behavior.

## Cloud apps and actions

A cloud app is a website, service, or endpoint protected by Azure AD Application Proxy. For a detailed description of supported cloud apps, see [cloud apps assignments](technical-reference.md#cloud-apps-assignments). The **Cloud apps or actions** condition is mandatory in a Conditional Access policy. In your policy, you can either select **All cloud apps** or specify apps with **Select apps**.

Organizations can choose from the following:

* **All cloud apps** when applying baseline policies to apply to the entire organization. Use this selection for policies that require multi-factor authentication when sign-in risk is detected for any cloud app. A policy applied to All cloud apps applies to access to all websites and services. This setting isn't limited to the cloud apps that appear on the Select apps list.
* **Select apps** to target specific services by your policy. For example, you can require users to have a compliant device to access SharePoint Online. This policy is also applied to other services when they access SharePoint content. An example is Microsoft Teams.

> [!NOTE]
> You can exclude specific apps from a policy. However, these apps are still subject to the policies applied to the services they access.

**User actions** are tasks that can be performed by a user. The only currently supported action is **Register security information (preview)**, which allows Conditional Access policy to enforce when users who are enabled for combined registration attempt to register their security information. More information can be found in the article, [Enable combined security information registration (preview)](../authentication/howto-registration-mfa-sspr-combined.md).

## Sign-in risk

A sign-in risk is an indicator of the likelihood (high, medium, or low) that a sign-in wasn't made by the legitimate owner of a user account. Azure AD calculates the sign-in risk level during a user's sign-in. 
You can use the calculated sign-in risk level as condition in a Conditional Access policy.

![Sign-in risk levels](./media/conditions/22.png)

To use this condition, you need to have [Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection-enable) enabled.
 
Common use cases for this condition are policies that have the following protections: 

- Block users with a high sign-in risk. This protection prevents potentially non-legitimate users from accessing your cloud apps. 
- Require multifactor authentication for users with a medium sign-in risk. By enforcing multifactor authentication, you can provide additional confidence that the sign-in is done by the legitimate owner of an account.

For more information, see [block access when a session risk is detected](app-sign-in-risk.md).  

## Device platforms

The device platform is characterized by the operating system that runs on your device. Azure AD identifies the platform by using information provided by the device, such as user agent. This information is unverified. We recommend that all platforms have a policy applied to them. The policy should either block access, require compliance with Microsoft Intune policies, or require the device be domain joined. The default is to apply a policy to all device platforms. 

![Configure device platforms](./media/conditions/24.png)

For a list of the supported device platforms, see [device platform condition](technical-reference.md#device-platform-condition).

A common use case for this condition is a policy that restricts access to your cloud apps to [managed devices](require-managed-devices.md). For more scenarios including the device platform condition, see [Azure Active Directory app-based Conditional Access](app-based-conditional-access.md).

## Device state

The device state condition excludes hybrid Azure AD joined devices and devices marked as compliant from a Conditional Access policy. 

![Configure device state](./media/conditions/112.png)

This condition is useful when a policy should apply only to an unmanaged device to provide additional session security. For example, only enforce the Microsoft Cloud App Security session control when a device is unmanaged. 

## Locations

By using locations, you can define conditions based on where a connection was attempted. 

![Configure locations](./media/conditions/25.png)

Common use cases for this condition are policies with the following protections:

- Require multi-factor authentication for users accessing a service when they're off the corporate network.  
- Block access for users accessing a service from specific countries or regions. 

For more information, see [What is the location condition in Azure Active Directory Conditional Access?](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-locations).

## Client apps

By default, a Conditional Access policy applies to the following apps:

- **[Browser apps](technical-reference.md#supported-browsers)** -  Browser apps include websites using the SAML, WS-Federation, or OpenID Connect web SSO protocols. This also applies to any website or web service that has been registered as an OAuth confidential client. For example, the Office 365 SharePoint website. 
- **[Mobile and desktop apps using modern authentication](technical-reference.md#supported-mobile-applications-and-desktop-clients)** - These apps include the Office desktop apps and phone apps. 


Additionally, you can target a policy to specific client apps that are not using modern authentication, for example:

- **[Exchange ActiveSync clients](conditions.md#exchange-activesync-clients)** - When a policy blocks using Exchange ActiveSync, affected users get a single quarantine email with information on why they are blocked. If necessary, the email includes instructions for enrolling their device with Intune.
- **[Other clients](block-legacy-authentication.md)** - These apps include clients that use basic authentication with mail protocols like IMAP, MAPI, POP, SMTP, and older Office apps that don't use modern authentication. For more information, see [How modern authentication works for Office 2013 and Office 2016 client apps](https://docs.microsoft.com/office365/enterprise/modern-auth-for-office-2013-and-2016).

![Client apps](./media/conditions/41.png)

Common use cases for this condition are policies with the following requirements:

- **[Require a managed device](require-managed-devices.md)** for mobile and desktop applications that download  data to a device. At the same time, allow browser access from any device. This scenario prevents saving and syncing documents to an unmanaged device. With this method, you can reduce the probability for data loss if the device is lost or stolen.
- **[Require a managed device](require-managed-devices.md)** for apps using ActiveSync to access Exchange Online.
- **[Block legacy authentication](block-legacy-authentication.md)** to Azure AD (other clients)
- Block access from web applications but allow access from mobile and desktop applications.

### Exchange ActiveSync clients

You can only select **Exchange ActiveSync clients** if:

- Microsoft Office 365 Exchange Online is the only cloud app you've selected.

    ![Cloud apps](./media/conditions/32.png)

- You don't have other conditions configured in a policy. However, you can narrow down the scope of this condition to apply only to [supported platforms](technical-reference.md#device-platform-condition).
 
    ![Apply policy only to supported platforms](./media/conditions/33.png)

When access is blocked because a [managed device](require-managed-devices.md) is required, the affected users get a single mail that guides them to use Intune. 

If an approved app is required, the affected users get guidelines to install and use the Outlook mobile client.

In other cases, for example, if MFA is required, the affected users are blocked, because clients using Basic authentication don't support MFA.

You can only target this setting to users and groups. It doesn’t support guests or roles. If a guest or role condition is configured, all users are blocked because Conditional Access can't determine if the policy should apply to the user or not.

For more information, see:

- [Set up SharePoint Online and Exchange Online for Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-no-modern-authentication).
- [Azure Active Directory app-based Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-conditional-access). 

## Next steps

- To find out how to configure a Conditional Access policy, see [Quickstart: Require MFA for specific apps with Azure Active Directory Conditional Access](app-based-mfa.md).
- To configure Conditional Access policies for your environment, see the [Best practices for Conditional Access in Azure Active Directory](best-practices.md). 
