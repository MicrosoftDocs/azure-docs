---
title: 'Azure AD Pass-through Authentication - Quick Start | Microsoft Docs'
description: This article describes how to get started with Azure Active Directory (Azure AD) Pass-through Authentication.
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Quick start

## Deploy Azure AD Pass-through Authentication

With Azure Active Directory (Azure AD) Pass-through Authentication, your users can sign in to both on-premises and cloud-based applications with the same passwords. Pass-through Authentication signs users in by validating their passwords directly against your on-premises Active Directory.

>[!IMPORTANT]
>If you use this feature through a preview version, you should ensure that you upgrade the preview versions of the Authentication Agents by using the instructions provided in [Azure Active Directory Pass-through Authentication: Upgrade preview Authentication Agents](./active-directory-aadconnect-pass-through-authentication-upgrade-preview-authentication-agents.md).

Follow these instructions to deploy Pass-through Authentication:

## Step 1: Check the prerequisites

Ensure that the following prerequisites are in place.

### In the Azure Active Directory admin center

1. Create a cloud-only global administrator account on your Azure AD tenant. This way, you can manage the configuration of your tenant should your on-premises services fail or become unavailable. Learn about [adding a cloud-only global administrator account](../active-directory-users-create-azure-portal.md). Completing this step is critical to ensure that you don't get locked out of your tenant.
2. Add one or more [custom domain names](../active-directory-domains-add-azure-portal.md) to your Azure AD tenant. Your users can sign in with one of these domain names.

### In your on-premises environment

1. Identify a server running Windows Server 2012 R2 or later to run Azure AD Connect. Add the server to the same Active Directory forest as the users whose passwords you need to validate.
2. Install the [latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) on the server identified in the preceding step. If you already have Azure AD Connect running, ensure that the version is 1.1.644.0 or later.

    >[!NOTE]
    >Azure AD Connect versions 1.1.557.0, 1.1.558.0, 1.1.561.0, and 1.1.614.0 have a problem related to password hash synchronization. If you _don't_ intend to use password hash synchronization in conjunction with Pass-through Authentication, read the [Azure AD Connect release notes](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-version-history#116470).

3. Identify an additional server running Windows Server 2012 R2 or later on which to run a standalone Authentication Agent. The Authentication Agent version needs to be 1.5.193.0 or later. This additional server is needed to ensure the high availability of requests to sign-in. Add the server to the same Active Directory forest as the users whose passwords you need to validate.
4. If there is a firewall between your servers and Azure AD, you need to configure the following items:
   - Ensure that Authentication Agents can make *outbound* requests to Azure AD over the following ports:
   
    | Port number | How it's used |
    | --- | --- |
    | **80** | Downloads the certificate revocation lists (CRLs) while validating the SSL certificate |
    | **443** | Handles all outbound communication with the service |
   
    If your firewall enforces rules according to the originating users, open these ports for traffic from Windows services that run as a network service.
   - If your firewall or proxy allows DNS whitelisting, whitelist connections to **\*.msappproxy.net** and **\*.servicebus.windows.net**. If not, allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly.
   - Your Authentication Agents need access to **login.windows.net** and **login.microsoftonline.com** for initial registration, so open your firewall for those URLs as well.
   - For certificate validation, unblock the following URLs: **mscrl.microsoft.com:80**, **crl.microsoft.com:80**, **ocsp.msocsp.com:80**, and **www.microsoft.com:80**. These URLs are used for certificate validation with other Microsoft products, so you might already have these URLs unblocked.

## Step 2: Enable Exchange ActiveSync support (optional)

Follow these instructions to enable Exchange ActiveSync support:

1. Use [Exchange PowerShell](https://technet.microsoft.com/library/mt587043(v=exchg.150).aspx) to run the following command:
```
Get-OrganizationConfig | fl per*
```

2. Check the value of the `PerTenantSwitchToESTSEnabled` setting. If the value is **true**, your tenant is properly configured. This is generally the case for most customers. If the value is **false**, run the following command:
```
Set-OrganizationConfig -PerTenantSwitchToESTSEnabled:$true
```

3. Verify that the value of the `PerTenantSwitchToESTSEnabled` setting is now set to **true**. Wait an hour before moving on to the next step.

If you face any problems during this step, check the [troubleshoot guide](active-directory-aadconnect-troubleshoot-pass-through-authentication.md#exchange-activesync-configuration-issues).

## Step 3: Enable the feature

Enable Pass-through Authentication through [Azure AD Connect](active-directory-aadconnect.md).

>[!IMPORTANT]
>You can enable Pass-through Authentication on the Azure AD Connect primary or staging server. You should enable it from the primary server.

If you're installing Azure AD Connect for the first time, choose the [custom installation path](active-directory-aadconnect-get-started-custom.md). At the **User sign-in** page, choose **Pass-through Authentication** as the **Sign On method**. On successful completion, a Pass-through Authentication Agent is installed on the same server as Azure AD Connect. In addition, the Pass-through Authentication feature is enabled on your tenant.

![Azure AD Connect: User sign in](./media/active-directory-aadconnect-sso/sso3.png)

If you have already installed Azure AD Connect by using the [express installation](active-directory-aadconnect-get-started-express.md) or the [custom installation](active-directory-aadconnect-get-started-custom.md) path, select the **Change user sign-in** task on Azure AD Connect, and then select **Next**. Then select **Pass-through Authentication** as the sign-in method. On successful completion, a Pass-through Authentication Agent is installed on the same server as Azure AD Connect and the feature is enabled on your tenant.

![Azure AD Connect: Change user sign-in](./media/active-directory-aadconnect-user-signin/changeusersignin.png)

>[!IMPORTANT]
>Pass-through Authentication is a tenant-level feature. Turning it on impacts the sign-in for users across _all_ the managed domains in your tenant. If you're switching from Active Directory Federation Service (AD FS) to Pass-through Authentication, you should wait at least 12 hours before shutting down your AD FS infrastructure. This wait time is to ensure that users can keep signing in to Exchange ActiveSync during transition.

## Step 4: Test the feature

Follow these instructions to verify that you have enabled Pass-through Authentication correctly:

1. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com) with the global administrator credentials for your tenant.
2. Select **Azure Active Directory** on the left-hand pane.
3. Select **Azure AD Connect**.
4. Verify that the **Pass-through authentication** feature shows as **Enabled**.
5. Select **Pass-through authentication**. The **Pass-through authentication** pane lists the servers where your Authentication Agents are installed.

![Azure Active Directory admin center: Azure AD Connect pane](./media/active-directory-aadconnect-pass-through-authentication/pta7.png)

![Azure Active Directory admin center: Pass-through Authentication pane](./media/active-directory-aadconnect-pass-through-authentication/pta8.png)

At this stage, users from all the managed domains in your tenant can sign in by using Pass-through Authentication. However, users from federated domains continue to sign in by using AD FS or another federation provider that you have previously configured. If you convert a domain from federated to managed, all users from that domain automatically start signing in by using Pass-through Authentication. The Pass-through Authentication feature does not impact cloud-only users.

## Step 5: Ensure high availability

If you plan to deploy Pass-through Authentication in a production environment, you should install a standalone Authentication Agent. Install this second Authentication Agent on a server _other_ than the one running Azure AD Connect and the first Authentication Agent. This setup provides you with high availability for requests to sign-in. Follow these instructions to deploy a standalone Authentication Agent:

1. **Download the latest version of the Authentication Agent (versions 1.5.193.0 or later)**: Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com) with your tenant's global administrator credentials.
2. Select **Azure Active Directory** on the left-hand pane.
3. Select **Azure AD Connect**, select **Pass-through authentication**, and then select **Download Agent**.
4. Select the **Accept terms & download** button.
5. **Install the latest version of the Authentication Agent**: Run the executable that was downloaded in the preceding step. Provide your tenant's global administrator credentials when prompted.

![Azure Active Directory admin center: Download Authentication Agent button](./media/active-directory-aadconnect-pass-through-authentication/pta9.png)

![Azure Active Directory admin center: Download Agent pane](./media/active-directory-aadconnect-pass-through-authentication/pta10.png)

>[!NOTE]
>You can also download the [Azure Active Directory Authentication Agent](https://aka.ms/getauthagent). Ensure that you review and accept the Authentication Agent's [Terms of Service](https://aka.ms/authagenteula) _before_ installing it.

## Next steps
- [Smart Lockout](active-directory-aadconnect-pass-through-authentication-smart-lockout.md): Learn how to configure Smart Lockout capability on your tenant to protect user accounts.
- [Current limitations](active-directory-aadconnect-pass-through-authentication-current-limitations.md): Learn which scenarios are supported with the Pass-through Authentication and which ones are not.
- [Technical deep dive](active-directory-aadconnect-pass-through-authentication-how-it-works.md): Understand how the Pass-through Authentication feature works.
- [Frequently asked questions](active-directory-aadconnect-pass-through-authentication-faq.md): Find answers to frequently asked questions.
- [Troubleshoot](active-directory-aadconnect-troubleshoot-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security deep dive](active-directory-aadconnect-pass-through-authentication-security-deep-dive.md): Additional deep technical information on the Pass-through Authentication feature.
- [Azure AD Seamless SSO](active-directory-aadconnect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.

