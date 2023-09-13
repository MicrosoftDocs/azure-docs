---
title: 'Quickstart: Azure Active Directory Seamless single sign-on'
description: Learn how to get started with Azure Active Directory Seamless single sign-on by using Azure AD Connect.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Quickstart: Azure Active Directory Seamless single sign-on

Azure Active Directory (Azure AD) Seamless single sign-on (Seamless SSO) automatically signs in users when they're using their corporate desktops that are connected to your corporate network. Seamless SSO provides your users with easy access to your cloud-based applications without using any other on-premises components.

To deploy Seamless SSO for Azure AD by using Azure AD Connect, complete the steps that are described in the following sections.

<a name="step-1-check-the-prerequisites"></a>

## Check the prerequisites

Ensure that the following prerequisites are in place:

- **Set up your Azure AD Connect server**: If you use [pass-through authentication](how-to-connect-pta.md) as your sign-in method, no other prerequisite check is required. If you use [password hash synchronization](how-to-connect-password-hash-synchronization.md) as your sign-in method and there's a firewall between Azure AD Connect and Azure AD, ensure that:
  - You use Azure AD Connect version 1.1.644.0 or later.
  - If your firewall or proxy allows, add the connections to your allowlist for `*.msappproxy.net` URLs over port 443. If you require a specific URL instead of a wildcard for proxy configuration, you can configure `tenantid.registration.msappproxy.net`, where `tenantid` is the GUID of the tenant for which you're configuring the feature. If URL-based proxy exceptions aren't possible in your organization, you can instead allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly. This prerequisite is applicable only when you enable the Seamless SSO feature. It isn't required for direct user sign-ins.

    > [!NOTE]
    >
    > - Azure AD Connect versions 1.1.557.0, 1.1.558.0, 1.1.561.0, and 1.1.614.0 have a problem related to password hash sync. If you *don't* intend to use password hash sync in conjunction with pass-through authentication, review the [Azure AD Connect release notes](./reference-connect-version-history.md) to learn more.

- **Use a supported Azure AD Connect topology**: Ensure that you're using one of the Azure AD Connect [supported topologies](plan-connect-topologies.md).

    > [!NOTE]
    > Seamless SSO supports multiple on-premises Windows Server Active Directory (Windows Server AD) forests, whether or not there are Windows Server AD trusts between them.

- **Set up domain administrator credentials**: You must have domain administrator credentials for each Windows Server AD forest that:

  - You sync to Azure AD through Azure AD Connect.
  - Contains users you want to enable Seamless SSO for.

- **Enable modern authentication**: To use this feature, you must enable [modern authentication](/office365/enterprise/modern-auth-for-office-2013-and-2016) on your tenant.

- **Use the latest versions of Microsoft 365 clients**: To get a silent sign-on experience with Microsoft 365 clients (for example, with Outlook, Word, or Excel), your users must use versions 16.0.8730.xxxx or later.

> [!NOTE]
> If you have an outgoing HTTP proxy, make sure that the URL `autologon.microsoftazuread-sso.com` is on your allowlist. You should specify this URL explicitly because the wildcard might not be accepted.

## Enable the feature

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Enable Seamless SSO through [Azure AD Connect](../whatis-hybrid-identity.md).

> [!NOTE]
> If Azure AD Connect doesn't meet your requirements, you can [enable Seamless SSO by using PowerShell](tshoot-connect-sso.md#manual-reset-of-the-feature). Use this option if you have more than one domain per Windows Server AD forest, and you want to target the domain to enable Seamless SSO for.

If you're doing a *fresh installation of Azure AD Connect*, choose the [custom installation path](how-to-connect-install-custom.md). On the **User sign-in** page, select the **Enable single sign on** option.

:::image type="content" source="media/how-to-connect-sso-quick-start/sso8.png" alt-text="Screenshot that shows the User sign-in page in Azure AD Connect, with Enable single sign on selected.":::

> [!NOTE]
> The option is available to select only if the sign-on method that's selected is **Password Hash Synchronization** or **Pass-through Authentication**.

If you *already have an installation of Azure AD Connect*, in **Additional tasks**, select **Change user sign-in**, and then select **Next**. If you're using Azure AD Connect versions 1.1.880.0 or later, the **Enable single sign on** option is selected by default. If you're using an earlier version of Azure AD Connect, select the **Enable single sign on** option.

:::image type="content" source="media/how-to-connect-pta-quick-start/changeusersignin.png" alt-text="Screenshot that shows the Additional tasks page with Change the user sign-in selected.":::

Continue through the wizard to the **Enable single sign on** page. Provide Domain Administrator credentials for each Windows Server AD forest that:

- You sync to Azure AD through Azure AD Connect.
- Contains users you want to enable Seamless SSO for.

When you complete the wizard, Seamless SSO is enabled on your tenant.

> [!NOTE]
> The Domain Administrator credentials are not stored in Azure AD Connect or in Azure AD. They're used only to enable the feature.

To verify that you have enabled Seamless SSO correctly:

1. Sign in to the [Azure portal](https://portal.azure.com) with the Hybrid Identity Administrator account credentials for your tenant.
1. In the left menu, select **Azure Active Directory**.
1. Select **Azure AD Connect**.
1. Verify that **Seamless single sign-on** is set to **Enabled**.

:::image type="content" source="media/how-to-connect-sso-quick-start/sso10.png" alt-text="Screenshot that shows the Azure AD Connect pane in the admin portal.":::

> [!IMPORTANT]
> Seamless SSO creates a computer account named `AZUREADSSOACC` in each Windows Server AD forest in your on-premises Windows Server AD directory. The `AZUREADSSOACC` computer account must be strongly protected for security reasons. Only Domain Administrator accounts should be allowed to manage the computer account. Ensure that Kerberos delegation on the computer account is disabled, and that no other account in Windows Server AD has delegation permissions on the `AZUREADSSOACC` computer account. Store the computer accounts in an organization unit so that they're safe from accidental deletions and only Domain Administrators can access them.

> [!NOTE]
> If you're using Pass-the-Hash and Credential Theft Mitigation architectures in your on-premises environment, make appropriate changes to ensure that the `AZUREADSSOACC` computer account doesn't end up in the Quarantine container.

<a name="step-3-roll-out-the-feature"></a>

## Roll out the feature

You can gradually roll out Seamless SSO to your users by using the instructions provided in the next sections. You start by adding the following Azure AD URL to all or selected user intranet zone settings through Group Policy in Windows Server AD:

`https://autologon.microsoftazuread-sso.com`

You also must enable an intranet zone policy setting called **Allow updates to status bar via script** through Group Policy.

> [!NOTE]
> The following instructions work only for Internet Explorer, Microsoft Edge, and Google Chrome on Windows (if Google Chrome shares a set of trusted site URLs with Internet Explorer). Learn how to set up [Mozilla Firefox](#mozilla-firefox-all-platforms) and [Google Chrome on macOS](#google-chrome-all-platforms).

### Why you need to modify user intranet zone settings

By default, a browser automatically calculates the correct zone, either internet or intranet, from a specific URL. For example, `http://contoso/` maps to the *intranet* zone, and `http://intranet.contoso.com/` maps to the *internet* zone (because the URL contains a period). Browsers don't send Kerberos tickets to a cloud endpoint, like to the Azure AD URL, unless you explicitly add the URL to the browser's intranet zone.

There are two ways you can modify user intranet zone settings:

| Option | Admin consideration | User experience |
| --- | --- | --- |
| Group policy | Admin locks down editing of intranet zone settings | Users can't modify their own settings |
| Group policy preference |  Admin allows editing of intranet zone settings | Users can modify their own settings |

### Group policy detailed steps

1. Open the Group Policy Management Editor tool.
1. Edit the group policy that's applied to some or all your users. This example uses **Default Domain Policy**.
1. Go to **User Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Internet Explorer** > **Internet Control Panel** > **Security Page**. Select **Site to Zone Assignment List**.

    :::image type="content" source="media/how-to-connect-sso-quick-start/sso6.png" alt-text="Screenshot that shows the Security Page with Site to Zone Assignment List selected.":::
1. Enable the policy, and then enter the following values in the dialog:

   - **Value name**: The Azure AD URL where the Kerberos tickets are forwarded.
   - **Value** (Data): **1** indicates the intranet zone.

     The result looks like this example:

     Value name: `https://autologon.microsoftazuread-sso.com`
  
     Value (Data): 1

   > [!NOTE]
   > If you want to prevent some users from using Seamless SSO (for instance, if these users sign in on shared kiosks), set the preceding values to **4**. This action adds the Azure AD URL to the restricted zone and Seamless SSO fails for the users all the time.
   >

1. Select **OK**, and then select **OK** again.

    :::image type="content" source="media/how-to-connect-sso-quick-start/sso7.png" alt-text="Screenshot that shows the Show Contents window with a zone assignment selected.":::

1. Go to **User Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Internet Explorer** > **Internet Control Panel** > **Security Page** > **Intranet Zone**. Select **Allow updates to status bar via script**.

    :::image type="content" source="media/how-to-connect-sso-quick-start/sso11.png" alt-text="Screenshot that shows the Intranet Zone page with Allow updates to status bar via script selected."   lightbox="media/how-to-connect-sso-quick-start/sso11.png":::
1. Enable the policy setting, and then select **OK**.

    :::image type="content" source="media/how-to-connect-sso-quick-start/sso12.png" alt-text="Screenshot that shows the Allow updates to status bar via script window with the policy setting enabled.":::

### Group policy preference detailed steps

1. Open the Group Policy Management Editor tool.
1. Edit the group policy that's applied to some or all your users. This example uses **Default Domain Policy**.
1. Go to **User Configuration** > **Preferences** > **Windows Settings** > **Registry** > **New** > **Registry item**.

    :::image type="content" source="media/how-to-connect-sso-quick-start/sso15.png" alt-text="Screenshot that shows Registry selected and Registry Item selected.":::
1. Enter or select the following values as demonstrated, and then select **OK**.

   - **Key Path**: Software\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains\microsoftazuread-sso.com\autologon
   - **Value name**: https
   - **Value type**: REG_DWORD
   - **Value data**: 00000001

     :::image type="content" source="media/how-to-connect-sso-quick-start/sso16.png" alt-text="Screenshot that shows the New Registry Properties window.":::

     :::image type="content" source="media/how-to-connect-sso-quick-start/sso17.png" alt-text="Screenshot that shows the new values listed in Registry Editor.":::

### Browser considerations

The next sections have information about Seamless SSO that's specific to different types of browsers.

#### Mozilla Firefox (all platforms)

If you're using the [Authentication](https://github.com/mozilla/policy-templates/blob/master/README.md#authentication) policy settings in your environment, ensure that you add the Azure AD URL (`https://autologon.microsoftazuread-sso.com`) to the **SPNEGO** section. You can also set the **PrivateBrowsing** option to **true** to allow Seamless SSO in private browsing mode.

#### Safari (macOS)

Ensure that the machine running the macOS is joined to Windows Server AD.

Instructions for joining your macOS device to Windows Server AD are outside the scope of this article.

#### Microsoft Edge based on Chromium (all platforms)

If you've overridden the [AuthNegotiateDelegateAllowlist](/DeployEdge/microsoft-edge-policies#authnegotiatedelegateallowlist) or [AuthServerAllowlist](/DeployEdge/microsoft-edge-policies#authserverallowlist) policy settings in your environment, ensure that you also add the Azure AD URL (`https://autologon.microsoftazuread-sso.com`) to these policy settings.

#### Microsoft Edge based on Chromium (macOS and other non-Windows platforms)

For Microsoft Edge based on Chromium on macOS and other non-Windows platforms, see the [Microsoft Edge based on Chromium Policy List](/DeployEdge/microsoft-edge-policies#authserverallowlist) for information on how to add the Azure AD URL for integrated authentication to your allowlist.

#### Google Chrome (all platforms)

If you've overridden the [AuthNegotiateDelegateAllowlist](https://chromeenterprise.google/policies/#AuthNegotiateDelegateAllowlist) or [AuthServerAllowlist](https://chromeenterprise.google/policies/#AuthServerAllowlist) policy settings in your environment, ensure that you also add the Azure AD URL (`https://autologon.microsoftazuread-sso.com`) to these policy settings.

#### macOS

The use of third-party Active Directory Group Policy extensions to roll out the Azure AD URL to Firefox and Google Chrome for macOS users is outside the scope of this article.

#### Known browser limitations

Seamless SSO doesn't work on Internet Explorer if the browser is running in Enhanced Protected mode. Seamless SSO supports the next version of Microsoft Edge based on Chromium, and it works in InPrivate and Guest mode by design. Microsoft Edge (legacy) is no longer supported.

You might need to configure `AmbientAuthenticationInPrivateModesEnabled` for InPrivate or guest users based on the corresponding documentation:

- [Microsoft Edge Chromium](/DeployEdge/microsoft-edge-policies#ambientauthenticationinprivatemodesenabled)
- [Google Chrome](https://chromeenterprise.google/policies/?policy=AmbientAuthenticationInPrivateModesEnabled)

## Test Seamless SSO

To test the feature for a specific user, ensure that all the following conditions are in place:

- The user signs in on a corporate device.
- The device is joined to your Windows Server AD domain. The device *doesn't* need to be [Azure AD Joined](../../devices/overview.md).
- The device has a direct connection to your domain controller, either on the corporate wired or wireless network or via a remote access connection, such as a VPN connection.
- You've [rolled out the feature](#roll-out-the-feature) to this user through Group Policy.

To test a scenario in which the user enters a username, but not a password:

- Sign in to [https://myapps.microsoft.com](https://myapps.microsoft.com/). Be sure to either clear the browser cache or use a new private browser session with any of the supported browsers in private mode.

To test a scenario in which the user doesn't have to enter a username or password, use one of these steps:

- Sign in to `https://myapps.microsoft.com/contoso.onmicrosoft.com`. Be sure to either clear the browser cache or use a new private browser session with any of the supported browsers in private mode. Replace `contoso` with your tenant name.
- Sign in to `https://myapps.microsoft.com/contoso.com` in a new private browser session. Replace `contoso.com` with a verified domain (not a federated domain) on your tenant.

## Roll over keys

In [Enable the feature](#enable-the-feature), Azure AD Connect creates computer accounts (representing Azure AD) in all the Windows Server AD forests on which you enabled Seamless SSO. To learn more, see [Azure Active Directory Seamless single sign-on: Technical deep dive](how-to-connect-sso-how-it-works.md).

> [!IMPORTANT]
> The Kerberos decryption key on a computer account, if leaked, can be used to generate Kerberos tickets for any user in its Windows Server AD forest. Malicious actors can then impersonate Azure AD sign-ins for compromised users. We highly recommend that you periodically roll over these Kerberos decryption keys, or at least once every 30 days.

For instructions on how to roll over keys, see [Azure Active Directory Seamless single sign-on: Frequently asked questions](how-to-connect-sso-faq.yml).

> [!IMPORTANT]
> You don't need to do this step *immediately* after you have enabled the feature. Roll over the Kerberos decryption keys at least once every 30 days.

## Next steps

- [Technical deep dive](how-to-connect-sso-how-it-works.md): Understand how the Seamless single sign-on feature works.
- [Frequently asked questions](how-to-connect-sso-faq.yml): Get answers to frequently asked questions about Seamless single sign-on.
- [Troubleshoot](tshoot-connect-sso.md): Learn how to resolve common problems with the Seamless single sign-on feature.
- [UserVoice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789): Use the Azure Active Directory Forum to file new feature requests.
