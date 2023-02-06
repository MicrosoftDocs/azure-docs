---
title: 'Azure AD Connect: Seamless single sign-on - quickstart | Microsoft Docs'
description: This article describes how to get started with Azure Active Directory Seamless single sign-on
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure Active Directory Seamless single sign-on: Quickstart

## Deploy Seamless single sign-on

Azure Active Directory (Azure AD) Seamless single sign-on (Seamless SSO) automatically signs in users when they are on their corporate desktops that are connected to your corporate network. Seamless SSO provides your users with easy access to your cloud-based applications without needing any other on-premises components.

To deploy Seamless SSO, complete the steps that are described in the following sections.

## Check the prerequisites

Ensure that the following prerequisites are in place:

- **Set up your Azure AD Connect server**: If you use [pass-through authentication](how-to-connect-pta.md) as your sign-in method, no other prerequisite check is required. If you use [password hash synchronization](how-to-connect-password-hash-synchronization.md) as your sign-in method, and if there's a firewall between Azure AD Connect and Azure AD, ensure that:
  - You use version 1.1.644.0 or later of Azure AD Connect.
  - If your firewall or proxy allows, add the connections to the allowed list for **\*.msappproxy.net** URLs over port 443. If you require a specific URL rather than a wildcard for proxy configuration, you can configure `tenantid.registration.msappproxy.net`, where `tenantid` is the GUID of the tenant where you're configuring the feature. If URL-based proxy exceptions aren't possible in your organization, you can instead allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly. This prerequisite is applicable only when you enable the feature. It isn't required for actual user sign-ins.

    > [!NOTE]
    > Azure AD Connect versions 1.1.557.0, 1.1.558.0, 1.1.561.0, and 1.1.614.0 have a problem related to password hash synchronization. If you _don't_ intend to use password hash synchronization in conjunction with Pass-through Authentication, read the [Azure AD Connect release notes](./reference-connect-version-history.md) to learn more.

    > [!NOTE]
    > If you have an outgoing HTTP proxy,  make sure this URL, autologon.microsoftazuread-sso.com, is on the allowed list. You should specify this URL explicitly since wildcard may not be accepted.

- **Use a supported Azure AD Connect topology**: Ensure that you're using one of the Azure AD Connect [supported topologies](plan-connect-topologies.md).

    > [!NOTE]
    > Seamless SSO supports multiple Windows Server AD forests, whether or not there are Windows Server AD trusts between them.

- **Set up domain administrator credentials**: You must have domain administrator credentials for each Windows Server AD forest that:
  - You sync to Azure AD through Azure AD Connect.
  - Contains users you want to enable for Seamless SSO.

- **Enable modern authentication**: You need to enable [modern authentication](/office365/enterprise/modern-auth-for-office-2013-and-2016) on your tenant for this feature to work.

- **Use the latest versions of Microsoft 365 clients**: To get a silent sign-on experience with Microsoft 365 clients (Outlook, Word, Excel, and others), your users need to use versions 16.0.8730.xxxx or later.

## Enable the feature

Enable Seamless SSO through [Azure AD Connect](whatis-hybrid-identity.md).

> [!NOTE]
> You can also [enable Seamless SSO using PowerShell](tshoot-connect-sso.md#manual-reset-of-the-feature) if Azure AD Connect doesn't meet your requirements. Use this option if you have more than one domain per Windows Server AD forest, and you want to be more targeted about the domain you want to enable Seamless SSO for.

If you're doing a fresh installation of Azure AD Connect, choose the [custom installation path](how-to-connect-install-custom.md). At the **User sign-in** page, select the **Enable single sign on** option.

![Azure AD Connect: User sign-in](./media/how-to-connect-sso-quick-start/sso8.png)

> [!NOTE]
> The option is available to select only if the sign-on method is **Password Hash Synchronization** or **Pass-through Authentication**.

If you already have an installation of Azure AD Connect, select the **Change user sign-in** page in Azure AD Connect, and then select **Next**. If you're using Azure AD Connect versions 1.1.880.0 or above, the **Enable single sign on** option will be selected by default. If you're using older versions of Azure AD Connect, select the **Enable single sign on** option.

![Azure AD Connect: Change the user sign-in](./media/how-to-connect-sso-quick-start/changeusersignin.png)

Continue through the wizard until you get to the **Enable single sign on** page. Provide domain administrator credentials for each Active Directory forest that:

- You sync to Azure AD through Azure AD Connect.
- Contains users you want to enable for Seamless SSO.

After you complete the wizard, Seamless SSO is enabled on your tenant.

> [!NOTE]
> The domain administrator credentials are not stored in Azure AD Connect or in Azure AD. They're used only to enable the feature.

To verify that you have enabled Seamless SSO correctly:

1. Sign in to the [Azure Active Directory administrative center](https://aad.portal.azure.com) with the Hybrid Identity Administrator credentials for your tenant.
1. In the left pane, select **Azure Active Directory**.
1. Select **Azure AD Connect**.
1. Verify that the **Seamless single sign-on** feature appears as **Enabled**.

![Screenshot that shows the Azure AD Connect pane in the Azure portal.](./media/how-to-connect-sso-quick-start/sso10.png)

> [!IMPORTANT]
> Seamless SSO creates a computer account named `AZUREADSSOACC` in your on-premises Active Directory (AD) in each AD forest. The `AZUREADSSOACC` computer account needs to be strongly protected for security reasons. Only Domain Admins should be able to manage the computer account. Ensure that Kerberos delegation on the computer account is disabled, and that no other account in Active Directory has delegation permissions on the `AZUREADSSOACC` computer account. Store the computer account in an Organization Unit (OU) where they are safe from accidental deletions and where only Domain Admins have access.

> [!NOTE]
> If you are using Pass-the-Hash and Credential Theft Mitigation architectures in your on-premises environment, make appropriate changes to ensure that the `AZUREADSSOACC` computer account doesn't end up in the Quarantine container.

## Roll out the feature

You can gradually roll out Seamless SSO to your users by using the instructions provided in the next sections. You start by adding the following Azure AD URL to all or selected user intranet zone settings by using Group Policy in Windows Server AD:

`https://autologon.microsoftazuread-sso.com`

You also must enable an intranet zone policy setting called **Allow updates to status bar via script** through Group Policy.

> [!NOTE]
> The following instructions work only for Internet Explorer, Microsoft Edge, and Google Chrome on Windows (if it shares a set of trusted site URLs with Internet Explorer). Read the next section for instructions on how to set up Mozilla Firefox and Google Chrome on macOS.

### Why do you need to modify user intranet zone settings?

By default, the browser automatically calculates the correct zone, either internet or intranet, from a specific URL. For example, `http://contoso/` maps to the intranet zone, whereas `http://intranet.contoso.com/` maps to the internet zone (because the URL contains a period). Browsers don't send Kerberos tickets to a cloud endpoint, like the Azure AD URL, unless you explicitly add the URL to the browser's intranet zone.

There are two ways to modify user intranet zone settings:

| Option | Admin consideration | User experience |
| --- | --- | --- |
| Group policy | Admin locks down editing of intranet zone settings | Users can't modify their own settings |
| Group policy preference |  Admin allows editing on intranet zone settings | Users can modify their own settings |

### Group policy option detailed steps

1. Open the Group Policy Management Editor tool.
1. Edit the group policy that's applied to some or all your users. This example uses **Default Domain Policy**.
1. Browse to **User Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Internet Explorer** > **Internet Control Panel** > **Security Page**. Then select **Site to Zone Assignment List**.

    ![Screenshot that shows the Security Page with Site to Zone Assignment List selected.](./media/how-to-connect-sso-quick-start/sso6.png)
1. Enable the policy, and then enter the following values in the dialog box:

   - **Value name**: The Azure AD URL where the Kerberos tickets are forwarded.
   - **Value** (Data): **1** indicates the intranet zone.

     The result looks like this example:

     Value name: `https://autologon.microsoftazuread-sso.com`
  
     Value (Data): 1

   > [!NOTE]
   > If you want to disallow some users from using Seamless SSO (for instance, if these users sign in on shared kiosks), set the preceding values to **4**. This action adds the Azure AD URL to the Restricted zone, and fails Seamless SSO all the time.
   >

1. Select **OK**, and then select **OK** again.

    ![Screenshot that shows the Show Contents window with a zone assignment selected.](./media/how-to-connect-sso-quick-start/sso7.png)

1. Browse to **User Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Internet Explorer** > **Internet Control Panel** > **Security Page** > **Intranet Zone**. Then select **Allow updates to status bar via script**.

    ![Screenshot that shows the Intranet Zone page with Allow updates to status bar via script selected.](./media/how-to-connect-sso-quick-start/sso11.png)

1. Enable the policy setting, and then select **OK**.

    ![Screenshot that shows "Allow updates to status bar via script" window with the policy setting enabled.](./media/how-to-connect-sso-quick-start/sso12.png)

### Group policy preference option - Detailed steps

1. Open the Group Policy Management Editor tool.
1. Edit the group policy that's applied to some or all your users. This example uses **Default Domain Policy**.
1. Browse to **User Configuration** > **Preferences** > **Windows Settings** > **Registry** > **New** > **Registry item**.

    ![Screenshot that shows "Registry" selected and "Registry Item" selected.](./media/how-to-connect-sso-quick-start/sso15.png)

1. Enter or select the following values as demonstrated, and then select **OK**.

   - **Key Path**: Software\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains\microsoftazuread-sso.com\autologon
   - **Value name**: https
   - **Value type**: REG_DWORD
   - **Value data**: 00000001

     ![Screenshot that shows the New Registry Properties window.](./media/how-to-connect-sso-quick-start/sso16.png)

     ![Single sign-on](./media/how-to-connect-sso-quick-start/sso17.png)

### Browser considerations

#### Mozilla Firefox (all platforms)

If you're using the [Authentication](https://github.com/mozilla/policy-templates/blob/master/README.md#authentication) policy settings in your environment, ensure that you add Azure AD's URL (`https://autologon.microsoftazuread-sso.com`) to the **SPNEGO** section. You can also set the **PrivateBrowsing** option to true to allow Seamless SSO in private browsing mode.

#### Safari (macOS)

Ensure that the machine running the macOS is joined to AD. Instructions for AD-joining your macOS device are outside the scope of this article.

#### Microsoft Edge based on Chromium (all platforms)

If you've overridden the [AuthNegotiateDelegateAllowlist](/DeployEdge/microsoft-edge-policies#authnegotiatedelegateallowlist) or the [AuthServerAllowlist](/DeployEdge/microsoft-edge-policies#authserverallowlist) policy settings in your environment, ensure that you add Azure AD's URL (`https://autologon.microsoftazuread-sso.com`) to them as well.

#### Microsoft Edge based on Chromium (macOS and other non-Windows platforms)

For Microsoft Edge based on Chromium on macOS and other non-Windows platforms, refer to [the Microsoft Edge based on Chromium Policy List](/DeployEdge/microsoft-edge-policies#authserverallowlist) for information on how to add the Azure AD URL for integrated authentication to your allowlist.

#### Google Chrome (all platforms)

If you've overridden the [AuthNegotiateDelegateAllowlist](https://chromeenterprise.google/policies/#AuthNegotiateDelegateAllowlist) or the [AuthServerAllowlist](https://chromeenterprise.google/policies/#AuthServerAllowlist) policy settings in your environment, ensure that you add Azure AD's URL (`https://autologon.microsoftazuread-sso.com`) to them as well.

#### macOS

The use of third-party Active Directory Group Policy extensions to roll out the Azure AD URL to Firefox and Google Chrome to macOS users is outside the scope of this article.

#### Known browser limitations

Seamless SSO doesn't work on Internet Explorer if the browser is running in Enhanced Protected mode. Seamless SSO supports the next version of Microsoft Edge based on Chromium and it works in InPrivate and Guest mode by design. Microsoft Edge (legacy) is no longer supported.

 `AmbientAuthenticationInPrivateModesEnabled`may need to be configured for InPrivate and / or guest users based on the corresponding documentations:

- [Microsoft Edge Chromium](/DeployEdge/microsoft-edge-policies#ambientauthenticationinprivatemodesenabled)
- [Google Chrome](https://chromeenterprise.google/policies/?policy=AmbientAuthenticationInPrivateModesEnabled)

## Step 4: Test the feature

To test the feature for a specific user, ensure that all the following conditions are in place:

- The user signs in on a corporate device.
- The device is joined to your Active Directory domain. The device *doesn't* need to be [Azure AD Joined](../devices/overview.md).
- The device has a direct connection to your domain controller (DC), either on the corporate wired or wireless network or via a remote access connection, such as a VPN connection.
- You've [rolled out the feature](#step-3-roll-out-the-feature) to this user through Group Policy.

To test the scenario where the user enters only the username, but not the password:

- Sign in to <https://myapps.microsoft.com/>. Be sure to either clear the browser cache or use a new private browser session with any of the supported browsers in private mode.

To test the scenario where the user doesn't have to enter the username or the password, use one of these steps:

- Sign in to `https://myapps.microsoft.com/contoso.onmicrosoft.com` Be sure to either clear the browser cache or use a new private browser session with any of the supported browsers in private mode. Replace *contoso* with your tenant's name.
- Sign in to `https://myapps.microsoft.com/contoso.com` in a new private browser session. Replace *contoso.com* with a verified domain (not a federated domain) on your tenant.

## Step 5: Roll over keys

In Step 2, Azure AD Connect creates computer accounts (representing Azure AD) in all the Active Directory forests on which you have enabled Seamless SSO. To learn more, see [Azure Active Directory Seamless single sign-on: Technical deep dive](how-to-connect-sso-how-it-works.md).

> [!IMPORTANT]
> The Kerberos decryption key on a computer account, if leaked, can be used to generate Kerberos tickets for any user in its AD forest. Malicious actors can then impersonate Azure AD sign-ins for compromised users. We highly recommend that you periodically roll over these Kerberos decryption keys - at least once every 30 days.

For instructions on how to roll over keys, see [Azure Active Directory Seamless single sign-on: Frequently asked questions](how-to-connect-sso-faq.yml).

> [!IMPORTANT]
> You don't need to do this step *immediately* after you have enabled the feature. Roll over the Kerberos decryption keys at least once every 30 days.

## Next steps

- [Technical deep dive](how-to-connect-sso-how-it-works.md): Understand how the Seamless single sign-on feature works.
- [Frequently asked questions](how-to-connect-sso-faq.yml): Get answers to frequently asked questions about Seamless single sign-on.
- [Troubleshoot](tshoot-connect-sso.md): Learn how to resolve common problems with the Seamless single sign-on feature.
- [UserVoice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789): Use the Azure Active Directory Forum to file new feature requests.
