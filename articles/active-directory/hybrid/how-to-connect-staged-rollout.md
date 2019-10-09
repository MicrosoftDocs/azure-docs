---
title: Cloud Authentication - Staged Rollout
description: Explains how migrate from federated authentication to cloud auth.
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/09/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Cloud Authentication - Staged Rollout (Public Preview)

## What is Cloud Authentication -- Staged Rollout?

This feature allows you to test cloud authentication and migrate from federated authentication (ADFS, Ping Federate, Okta etc.) to cloud authentication (Pass-through authentication / Password Hash Sync) with seamless SSO using a staged approach, instead of using the hard cutover approach of converting domains from federated to managed as documented [here](../fundamentals/active-directory-deployment-plans.md).

Moving away from federated authentication has implications especially if you have on-premises MFA server or if you are using smart cards for authentication and other federation only features. Before trying this feature, we suggest you review our guide on choosing the right authentication method. See [this table](https://docs.microsoft.com/azure/security/fundamentals/choose-ad-authn#comparing-methods) for more details.

>[!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE3inQJ]



## Pre-requisites

-   The customer must have an Azure AD tenant with federated domains.

-   The customer should choose to move to either Password Hash Sync + Seamless SSO **(Option A),** or Pass-through Authentication + Seamless SSO **(Option B).** Although seamless SSO is optional, we recommend enabling seamless SSO to achieve a silent sign-in experience for users using domain joined machines from inside corporate network.

-   The customer has configured all the appropriate tenant branding and conditional access policies they need for users who are being migrated over to cloud authentication.

-   If you plan to use Azure MFA, we recommend you use [converged registration for Self-service Password Reset (SSPR) and Azure MFA](../authentication/concept-registration-mfa-sspr-combined.md) to get your users to register their authentication methods once.

-   To use this feature, you need to be Global Administrator on your tenant.

-   To enable Seamless SSO on a specific AD forest, you need to be Domain Administrator.

## Supported Scenarios

1.  This feature only works for users provisioned to Azure AD using Azure AD Connect and is not applicable for cloud-only users.

2.  This feature only works for user sign-in traffic on browsers and modern authentication clients. Applications or Cloud services using legacy authentication will fall back to federated authentication flows. (Ex: Exchange online with Modern Authentication turned off or Outlook 2010 which does not support Modern Authentication )

## Unsupported Scenarios

1.  Certain applications send the "domain\_hint" query parameter to Azure AD during authentication. These flows will continue to hit the federation provider and users enabled for staged rollout will continue to use federation for authentication.

<!-- -->

3.  Admin can rollout cloud authentication using security groups. ( Cloud Security groups are recommended to avoid sync latency when using on-premises AD security groups )

    a.  You can use a **maximum of 10 groups per feature**; i.e., for each of Password Hash Sync / Pass-through Authentication / Seamless SSO.

    b.  Nested groups are **not supported**. This is the scope for public preview as well.

    c.  Dynamic groups are **not supported** for staged rollout.

4.  The final cutover from federated to cloud authentication still needs to happen using Azure AD Connect or PowerShell. This feature doesn't switch domains from federate to managed.

5.  When you first add a security group for staged rollout, it is limited to 200 users to avoid the UX from timing out. Once the group is added in the UX, you can add more users directly to the group as required.

## Getting Started with Staged Rollout

If you want to test Password Hash Sync (PHS) Sign-in using staged rollout, please complete the below pre-work to enable Password Hash Sync staged rollout.

## Pre-work for Password Hash Sync

-   Enable Password Hash Sync from the "[Optional features](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-install-custom#optional-features)" page in Azure AD Connect. 

![](media/how-to-connect-staged-rollout/sr1.png)

-   Ensure that a full Password Hash Sync cycle has run through so that all the users' password hashes have been synchronized to Azure AD. You can use the PowerShell diagnostics [here](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/tshoot-connect-password-hash-synchronization) to check the status of Password Hash Sync.

![](./media/how-to-connect-staged-rollout/sr2.png)

If you want to test Pass through-authentication (PTA) Sign-in using staged rollout, please complete the below pre-work to enable PTA for staged rollout.

## Pre-work for Pass-through Authentication

-   Identify a server running Windows Server 2012 R2 or later where you want the Pass through Authentication Agent to run (**DO NOT choose the Azure AD Connect server**). Ensure that the server is domain-joined, can authenticate selected users with Active Directory, and can communicate with Azure AD on outbound ports / URLs (see detailed [[pre-requisites]{.underline}](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnect-pass-through-authentication-quick-start)).

-   [[Download]{.underline}](https://aka.ms/getauthagent) & install the Microsoft Azure AD Connect Authentication Agent on the server. 

-   To enable [[high availability]{.underline}](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnect-pass-through-authentication-quick-start), install additional Authentication Agents on other servers.

-   Ensure that you have configured your [Smart Lockout settings](https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-password-smart-lockout) appropriately. This is to ensure that your users' on-premises Active Directory accounts don't get locked out by bad actors.

We recommend to enable Seamless SSO irrespective of the sign-in method ( PHS or PTA ) you select for staged rollout. Please complete the below pre-work to enable Seamless SSO for staged rollout.

## Pre-work for Seamless SSO

1.  Enable Seamless SSO on the AD forests using PowerShell. If you have more than one AD Forest, please enable the same for each forest individually. Seamless SSO will only be triggered for users selected for staged rollout and won't impact your existing federation setup.

**Brief Summary of the steps are below**

1.  First, login to Azure AD Connect Server

2.  Navigate to the %programfiles%\\Microsoft Azure Active Directory Connect folder.

3.  Import the Seamless SSO PowerShell module using this command: Import-Module .\\AzureADSSO.psd1.

4.  Run PowerShell as an Administrator. In PowerShell, call New-AzureADSSOAuthenticationContext. This command should give you a popup to enter your tenant\'s Global Administrator credentials.

5.  Call Get-AzureADSSOStatus \| ConvertFrom-Json. This command provides you the list of AD forests (look at the \"Domains\" list) on which this feature has been enabled.

> **Example:**
![](./media/how-to-connect-staged-rollout/sr3.png)

6.  Call \$creds = Get-Credential. When prompted, enter the Domain Administrator credentials for the intended AD forest.

7.  Call Enable-AzureADSSOForest -OnPremCredentials \$creds. This command creates the AZUREADSSOACC computer account from the on-premises domain controller for this specific Active Directory forest that is required for Seamless SSO.

8.  Seamless SSO requires URL's to be in the intranet zone. Please refer to the link [here](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-sso-quick-start#step-3-roll-out-the-feature) to deploy those URL's using Group Policies.

9.  You could also download our [deployment plans](https://aka.ms/SeamlessSSODPDownload) for Seamless SSO for a complete walkthrough.

## Enable Staged Rollout

Use the following steps to rollout a specific feature (Pass-through Authentication / Password Hash Sync / Seamless SSO) to a select set of users in a group:

### Enable the staged rollout of a specific feature on your tenant

-   Password Hash Sync + Seamless SSO **(Option A)**

-   Pass-through Authentication + Seamless SSO **(Option B)**

-   Password Hash Sync + Pass-through Authentication + Seamless SSO **-\>** ***Not Supported***

1.  Login to the Azure AD Portal using the below URL to access the Preview UX.

> <http://aka.ms/stagedrolloutux>

2.  Click on Enable staged rollout for managed user sign-in ( preview )

*For Example:* (**OPTION B**) If you wish to enable Password Hash Sync and Seamless SSO, please slide the Password Hash Sync and Seamless single sign-on features to **'ON'** as shown below.



![](./media/how-to-connect-staged-rollout/sr4.png)

![](./media/how-to-connect-staged-rollout/sr5.png)

3.  Please add the respective groups to the feature to enable Pass-through Authentication and Seamless single sign-on. Please ensure the security groups have no more than 200 members initially to avoid UX time out.

![](./media/how-to-connect-staged-rollout/sr6.png)

>[!NOTE]
>The members in a group are automatically enabled for staged rollout. Nested and Dynamic groups are not supported for staged rollout.

# Auditing

We have enabled audit events for the different actions we perform for staged rollout.

1.  Audit event when you enable Staged Rollout for Password Hash Sync / Pass-through Authentication / Seamless SSO.

>[!NOTE]
>Audit event that is logged when SeamlessSSO is turned **ON** using StagedRollout.

![](./media/how-to-connect-staged-rollout/sr7.png)

![](./media/how-to-connect-staged-rollout/sr8.png)

2.  Audit event when a group is added to Password Hash Sync / Pass-through Authentication / Seamless SSO.

>[!NOTE]
>Audit event logged when a group is added to Password Hash Sync for staged rollout

![](./media/how-to-connect-staged-rollout/sr9.png)

![](./media/how-to-connect-staged-rollout/sr10.png)

3.  Audit event when a user who was added to the group is enabled for staged rollout

![](media/how-to-connect-staged-rollout/sr11.png)

![](./media/how-to-connect-staged-rollout/sr12.png)
# Validation

To test sign-in with Password Hash Sync or Pass-through Authentication (username / password sign-in):

-   Browse to <https://myapps.microsoft.com> on a private browser session from extranet and enter the UserPrincipalName (UPN) of the user account selected for staged roll out.

-   If user has been targeted for staged rollout, the user will not be redirected to your federated login page and instead will be asked to sign in on the Azure AD tenant-branded sign-in page.

-   Ensure that the sign-in successfully appears in the [Azure AD sign-in activity report](https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/concept-sign-ins) by filtering with the UserPrincipalName..

To test sign-in with Seamless SSO:

-   Browse to <https://myapps.microsoft.com>/ on a private browser session from intranet and enter the UserPrincipalName (UPN) of the user account selected for staged roll out.

-   If the user has been targeted for staged rollout of Seamless SSO, the user will see a "Trying to sign you in ..." message before being silently signed in.

-   Ensure that the sign-in successfully appears in the [Azure AD sign-in activity report](https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/concept-sign-ins) by filtering with the UserPrincipalName.

To check user sign-ins still happening on federation providers:

-   Here is how you can track user sign-ins still happening on AD FS for selected staged rollout users using [these instructions](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/troubleshooting/ad-fs-tshoot-logging#types-of-events). Check vendor documentation on how to check this on 3rd party federation providers.

# Roll back

### Remove a user from staged rollout

1.  Removing the user from the group disables staged rollout for the user.

2.  If you wish to disable staged rollout feature, please slide the feature back to **'OFF'** state to turn off staged rollout.

# [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=167256) - For filing new feature requests.

# Frequently asked questions

-   **Q: Can a customer use this capability in production?**

-   A: Yes, this feature can be used in your production tenant, but we recommend that you first try this capability out in your test tenant.

-   **Q: Can this feature be used to maintain a permanent "co-existence" where some users use federated authentication, and others cloud authentication?**

-   A: No, this feature is designed for migrating from federated to cloud authentication in stages and then to eventually cut over to Cloud authentication. We do not recommend a permanent mixed state as this could lead to unexpected authentication flows.

-   Q Can we use PowerShell to perform staged rollout?

-   A: Yes, Please find the documentation to use PowerShell to perform staged rollout here.
