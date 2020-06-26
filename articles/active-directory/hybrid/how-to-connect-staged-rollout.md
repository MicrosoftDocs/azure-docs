---
title: 'Azure AD Connect: Cloud authentication via staged rollout | Microsoft Docs'
description: This article explains how to migrate from federated authentication, to cloud authentication, by using a staged rollout.
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/03/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Migrate to cloud authentication using staged rollout (preview)

By using a staged rollout approach you can avoid a cutover of your entire domain.  This allows you to selectively test groups of users with cloud authentication capabilities like Azure Multi-Factor Authentication (MFA), Conditional Access, Identity Protection for leaked credentials, Identity Governance, and others.  This article discusses how to make the switch. Before you begin the staged rollout, however, you should consider the implications if one or more of the following conditions is true:
	
-  You're currently using an on-premises Multi-Factor Authentication server. 
-  You're using smart cards for authentication. 
-  Your current server offers certain federation-only features.

Before you try this feature, we suggest that you review our guide on choosing the right authentication method. For more information, see the "Comparing methods" table in [Choose the right authentication method for your Azure Active Directory hybrid identity solution](https://docs.microsoft.com/azure/security/fundamentals/choose-ad-authn#comparing-methods).

For an overview of the feature, view this "Azure Active Directory: What is staged rollout?" video:

>[!VIDEO https://www.microsoft.com/videoplayer/embed/RE3inQJ]



## Prerequisites

-   You have an Azure Active Directory (Azure AD) tenant with federated domains.

-   You have decided to move to either of two options:
    - **Option A** - *password hash synchronization (sync)* + *seamless single sign-on (SSO)*.  For more information, see [What is password hash sync](whatis-phs.md) and [What is seamless SSO](how-to-connect-sso.md)
    - **Option B** - *pass-through authentication* + *seamless SSO*.  For more information, see [What is pass-through authentication](how-to-connect-pta.md)  
    
    Although *seamless SSO* is optional, we recommend enabling it to achieve a silent sign-in experience for users who are running domain-joined machines from inside a corporate network.

-   You have configured all the appropriate tenant-branding and conditional access policies you need for users who are being migrated to cloud authentication.

-   If you plan to use Azure Multi-Factor Authentication, we recommend that you use [converged registration for self-service password reset (SSPR) and Multi-Factor Authentication](../authentication/concept-registration-mfa-sspr-combined.md) to have your users register their authentication methods once.

-   To use the staged rollout feature, you need to be a global administrator on your tenant.

-   To enable *seamless SSO* on a specific Active Directory forest, you need to be a domain administrator.


## Supported scenarios

The following scenarios are supported for staged rollout. The feature works only for:

- Users who are provisioned to Azure AD by using Azure AD Connect. It does not apply to cloud-only users.

- User sign-in traffic on browsers and *modern authentication* clients. Applications or cloud services that use legacy authentication will fall back to federated authentication flows. An example might be Exchange online with modern authentication turned off, or Outlook 2010, which does not support modern authentication.
- Group size is currently limited to 50,000 users.  If you have groups that are larger then 50,000 users, it is recommended to split this group over multiple groups for staged rollout.

## Unsupported scenarios

The following scenarios are not supported for staged rollout:

- Certain applications send the "domain_hint" query parameter to Azure AD during authentication. These flows will continue, and users who are enabled for staged rollout will continue to use federation for authentication.

<!-- -->

- Admins can roll out cloud authentication by using security groups. To avoid sync latency when you're using on-premises Active Directory security groups, we recommend that you use cloud security groups. The following conditions apply:

    - You can use a maximum of 10 groups per feature. That is, you can use 10 groups each for *password hash sync*, *pass-through authentication*, and *seamless SSO*.
    - Nested groups are *not supported*. This scope applies to public preview as well.
    - Dynamic groups are *not supported* for staged rollout.
    - Contact objects inside the group will block the group from being added.

- You still need to make the final cutover from federated to cloud authentication by using Azure AD Connect or PowerShell. Staged rollout doesn't switch domains from federated to managed.  For more information about domain cutover, see [Migrate from federation to password hash synchronization](plan-migrate-adfs-password-hash-sync.md) and [Migrate from federation to pass-through authentication](plan-migrate-adfs-pass-through-authentication.md)



- When you first add a security group for staged rollout, you're limited to 200 users to avoid a UX time-out. After you've added the group, you can add more users directly to it, as required.


## Get started with staged rollout

To test the *password hash sync* sign-in by using staged rollout, follow the pre-work instructions in the next section.

For information about which PowerShell cmdlets to use, see [Azure AD 2.0 preview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview#staged_rollout).

## Pre-work for password hash sync

1. Enable *password hash sync* from the [Optional features](how-to-connect-install-custom.md#optional-features) page in Azure AD Connect. 

   ![Screenshot of the "Optional features" page in Azure Active Directory Connect](media/how-to-connect-staged-rollout/sr1.png)

1. Ensure that a full *password hash sync* cycle has run so that all the users' password hashes have been synchronized to Azure AD. To check the status of *password hash sync*, you can use the PowerShell diagnostics in [Troubleshoot password hash sync with Azure AD Connect sync](tshoot-connect-password-hash-synchronization.md).

   ![Screenshot of the AADConnect Troubleshooting log](./media/how-to-connect-staged-rollout/sr2.png)

If you want to test *pass-through authentication* sign-in by using staged rollout, enable it by following the pre-work instructions in the next section.

## Pre-work for pass-through authentication

1. Identify a server that's running Windows Server 2012 R2 or later where you want the *pass-through authentication* agent to run. 

   *Do not* choose the Azure AD Connect server. Ensure that the server is domain-joined, can authenticate selected users with Active Directory, and can communicate with Azure AD on outbound ports and URLs. For more information, see the "Step 1: Check the prerequisites" section of [Quickstart: Azure AD seamless single sign-on](how-to-connect-sso-quick-start.md).

1. [Download the Azure AD Connect authentication agent](https://aka.ms/getauthagent), and install it on the server. 

1. To enable [high availability](how-to-connect-sso-quick-start.md), install additional authentication agents on other servers.

1. Make sure that you've configured your [Smart Lockout settings](../authentication/howto-password-smart-lockout.md) appropriately. Doing so helps ensure that your users' on-premises Active Directory accounts don't get locked out by bad actors.

We recommend enabling *seamless SSO* irrespective of the sign-in method (*password hash sync* or *pass-through authentication*) you select for staged rollout. To enable *seamless SSO*, follow the pre-work instructions in the next section.

## Pre-work for seamless SSO

Enable *seamless SSO* on the Active Directory forests by using PowerShell. If you have more than one Active Directory forest, enable it for each forest individually. *Seamless SSO* is triggered only for users who are selected for staged rollout. It doesn't affect your existing federation setup.

Enable *seamless SSO* by doing the following:

1. Sign in to Azure AD Connect Server.

2. Go to the *%programfiles%\\Microsoft Azure Active Directory Connect* folder.

3. Import the *seamless SSO* PowerShell module by running the following command: 

   `Import-Module .\AzureADSSO.psd1`

4. Run PowerShell as an administrator. In PowerShell, call `New-AzureADSSOAuthenticationContext`. This command opens a pane where you can enter your tenant's global administrator credentials.

5. Call `Get-AzureADSSOStatus | ConvertFrom-Json`. This command displays a list of Active Directory forests (see the "Domains" list) on which this feature has been enabled. By default, it is set to false at the tenant level.

   ![Example of the Windows PowerShell output](./media/how-to-connect-staged-rollout/sr3.png)

6. Call `$creds = Get-Credential`. At the prompt, enter the domain administrator credentials for the intended Active Directory forest.

7. Call `Enable-AzureADSSOForest -OnPremCredentials $creds`. This command creates the AZUREADSSOACC computer account from the on-premises domain controller for the Active Directory forest that's required for *seamless SSO*.

8. *Seamless SSO* requires URLs to be in the intranet zone. To deploy those URLs by using group policies, see [Quickstart: Azure AD seamless single sign-on](how-to-connect-sso-quick-start.md#step-3-roll-out-the-feature).

9. For a complete walkthrough, you can also download our [deployment plans](https://aka.ms/SeamlessSSODPDownload) for *seamless SSO*.

## Enable staged rollout

To roll out a specific feature (*pass-through authentication*, *password hash sync*, or *seamless SSO*) to a select set of users in a group, follow the instructions in the next sections.

### Enable a staged rollout of a specific feature on your tenant

You can roll out one of these options:

- **Option A** - *password hash sync* + *seamless SSO*
- **Option B** - *pass-through authentication* + *seamless SSO*
- **Not supported** - *password hash sync* + *pass-through authentication* + *seamless SSO*

Do the following:

1. To access the preview UX, sign in to the [Azure AD portal](https://aka.ms/stagedrolloutux).

2. Select the **Enable staged rollout for managed user sign-in (Preview)** link.

   For example, if you want to enable *Option A*, slide the **Password Hash Sync** and **Seamless single sign-on** controls to **On**, as shown in the following images.

   ![The Azure AD Connect page](./media/how-to-connect-staged-rollout/sr4.png)

   ![The "Enable staged rollout features (Preview)" page](./media/how-to-connect-staged-rollout/sr5.png)

3. Add the groups to the feature to enable *pass-through authentication* and *seamless SSO*. To avoid a UX time-out, ensure that the security groups contain no more than 200 members initially.

   ![The "Manage groups for Password Hash Sync (Preview)" page](./media/how-to-connect-staged-rollout/sr6.png)

   >[!NOTE]
   >The members in a group are automatically enabled for staged rollout. Nested and dynamic groups are not supported for staged rollout.

## Auditing

We've enabled audit events for the various actions we perform for staged rollout:

- Audit event when you enable a staged rollout for *password hash sync*, *pass-through authentication*, or *seamless SSO*.

  >[!NOTE]
  >An audit event is logged when *seamless SSO* is turned on by using staged rollout.

  ![The "Create rollout policy for feature" pane - Activity tab](./media/how-to-connect-staged-rollout/sr7.png)

  ![The "Create rollout policy for feature" pane - Modified Properties tab](./media/how-to-connect-staged-rollout/sr8.png)

- Audit event when a group is added to *password hash sync*, *pass-through authentication*, or *seamless SSO*.

  >[!NOTE]
  >An audit event is logged when a group is added to *password hash sync* for staged rollout.

  ![The "Add a group to feature rollout" pane - Activity tab](./media/how-to-connect-staged-rollout/sr9.png)

  ![The "Add a group to feature rollout" pane - Modified Properties tab](./media/how-to-connect-staged-rollout/sr10.png)

- Audit event when a user who was added to the group is enabled for staged rollout.

  ![The "Add user to feature rollout" pane - Activity tab](media/how-to-connect-staged-rollout/sr11.png)

  ![The "Add user to feature rollout" pane - Target(s) tab](./media/how-to-connect-staged-rollout/sr12.png)

## Validation

To test the sign-in with *password hash sync* or *pass-through authentication* (username and password sign-in), do the following:

1. On the extranet, go to the [Apps page](https://myapps.microsoft.com) in a private browser session, and then enter the UserPrincipalName (UPN) of the user account that's selected for staged rollout.

   Users who've been targeted for staged rollout are not redirected to your federated login page. Instead, they're asked to sign in on the Azure AD tenant-branded sign-in page.

1. Ensure that the sign-in successfully appears in the [Azure AD sign-in activity report](../reports-monitoring/concept-sign-ins.md) by filtering with the UserPrincipalName.

To test sign-in with *seamless SSO*:

1. On the intranet, go to the [Apps page](https://myapps.microsoft.com) in a private browser session, and then enter the UserPrincipalName (UPN) of the user account that's selected for staged rollout.

   Users who've been targeted for staged rollout of *seamless SSO* are presented with a "Trying to sign you in ..." message before they're silently signed in.

1. Ensure that the sign-in successfully appears in the [Azure AD sign-in activity report](../reports-monitoring/concept-sign-ins.md) by filtering with the UserPrincipalName.

   To track user sign-ins that still occur on Active Directory Federation Services (AD FS) for selected staged rollout users, follow the instructions at [AD FS troubleshooting: Events and logging](https://docs.microsoft.com/windows-server/identity/ad-fs/troubleshooting/ad-fs-tshoot-logging#types-of-events). Check vendor documentation about how to check this on third-party federation providers.

## Remove a user from staged rollout

Removing a user from the group disables staged rollout for that user. To disable the staged rollout feature, slide the control back to **Off**.

## Frequently asked questions

**Q: Can I use this capability in production?**

A: Yes, you can use this feature in your production tenant, but we recommend that you first try it out in your test tenant.

**Q: Can this feature be used to maintain a permanent "co-existence," where some users use federated authentication and others use cloud authentication?**

A: No, this feature is designed for migrating from federated to cloud authentication in stages and then to eventually cut over to cloud authentication. We do not recommend using a permanent mixed state, because this approach could lead to unexpected authentication flows.

**Q: Can I use PowerShell to perform staged rollout?**

A: Yes. To learn how to use PowerShell to perform staged rollout, see [Azure AD Preview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview#staged_rollout).

## Next steps
- [Azure AD 2.0 preview](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview#staged_rollout )
