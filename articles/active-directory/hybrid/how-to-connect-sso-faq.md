---
title: 'Azure AD Connect: Seamless Single Sign-On - Frequently asked questions | Microsoft Docs'
description: Answers to frequently asked questions about Azure Active Directory Seamless Single Sign-On.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: mtillman
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/04/2018
ms.component: hybrid
ms.author: billmath
---

# Azure Active Directory Seamless Single Sign-On: Frequently asked questions

In this article, we address frequently asked questions about Azure Active Directory Seamless Single Sign-On (Seamless SSO). Keep checking back for new content.

## What sign-in methods do Seamless SSO work with?

Seamless SSO can be combined with either the [Password Hash Synchronization](how-to-connect-password-hash-synchronization.md) or [Pass-through Authentication](how-to-connect-pta.md) sign-in methods. However this feature cannot be used with Active Directory Federation Services (ADFS).

## Is Seamless SSO a free feature?

Seamless SSO is a free feature and you don't need any paid editions of Azure AD to use it.

## Is Seamless SSO available in the [Microsoft Azure Germany cloud](http://www.microsoft.de/cloud-deutschland) and the [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/)?

No. Seamless SSO is only available in the worldwide instance of Azure AD.

## What applications take advantage of `domain_hint` or `login_hint` parameter capability of Seamless SSO?

Listed below is a non-exhaustive list of applications that can send these parameters to Azure AD, and therefore provides users a silent sign-on experience using Seamless SSO (i.e., no need for your users to input their usernames or passwords):

| Application name | Application URL to be used |
| -- | -- |
| Access panel | https://myapps.microsoft.com/contoso.com |
| Outlook on Web | https://outlook.office365.com/contoso.com |
| Office 365 portal | https://portal.office.com?domain_hint=contoso.com |

In addition, users get a silent sign-on experience if an application sends sign-in requests to Azure AD's tenanted endpoints - that is, https://login.microsoftonline.com/contoso.com/<..> or https://login.microsoftonline.com/<tenant_ID>/<..> - instead of Azure AD's common endpoint - that is, https://login.microsoftonline.com/common/<...>. Listed below is a non-exhaustive list of applications that make these types of sign-in requests.

| Application name | Application URL to be used |
| -- | -- |
| SharePoint Online | https://contoso.sharepoint.com |
| Azure portal | https://portal.azure.com/contoso.com |

In the above tables, replace "contoso.com" with your domain name to get to the right application URLs for your tenant.

If you want other applications using our silent sign-on experience, let us know in the feedback section.

## Does Seamless SSO support `Alternate ID` as the username, instead of `userPrincipalName`?

Yes. Seamless SSO supports `Alternate ID` as the username when configured in Azure AD Connect as shown [here](how-to-connect-install-custom.md). Not all Office 365 applications support `Alternate ID`. Refer to the specific application's documentation for the support statement.

## What is the difference between the single sign-on experience provided by [Azure AD Join](../active-directory-azureadjoin-overview.md) and Seamless SSO?

[Azure AD Join](../active-directory-azureadjoin-overview.md) provides SSO to users if their devices are registered with Azure AD. These devices don't necessarily have to be domain-joined. SSO is provided using *primary refresh tokens* or *PRTs*, and not Kerberos. The user experience is most optimal on Windows 10 devices. SSO happens automatically on the Edge browser. It also works on Chrome with the use of a browser extension.

You can use both Azure AD Join and Seamless SSO on your tenant. These two features are complementary. If both features are turned on, then SSO from Azure AD Join takes precedence over Seamless SSO.

## I want to register non-Windows 10 devices with Azure AD, without using AD FS. Can I use Seamless SSO instead?

Yes, this scenario needs version 2.1 or later of the [workplace-join client](https://www.microsoft.com/download/details.aspx?id=53554).

## How can I roll over the Kerberos decryption key of the `AZUREADSSOACC` computer account?

It is important to frequently roll over the Kerberos decryption key of the `AZUREADSSOACC` computer account (which represents Azure AD) created in your on-premises AD forest.

>[!IMPORTANT]
>We highly recommend that you roll over the Kerberos decryption key at least every 30 days.

Follow these steps on the on-premises server where you are running Azure AD Connect:

### Step 1. Get list of AD forests where Seamless SSO has been enabled

1. First, download, and install [Azure AD PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/overview).
2. Navigate to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
3. Import the Seamless SSO PowerShell module using this command: `Import-Module .\AzureADSSO.psd1`.
4. Run PowerShell as an Administrator. In PowerShell, call `New-AzureADSSOAuthenticationContext`. This command should give you a popup to enter your tenant's Global Administrator credentials.
5. Call `Get-AzureADSSOStatus`. This command provides you the list of AD forests (look at the "Domains" list) on which this feature has been enabled.

### Step 2. Update the Kerberos decryption key on each AD forest that it was set it up on

1. Call `$creds = Get-Credential`. When prompted, enter the Domain Administrator credentials for the intended AD forest.

    >[!NOTE]
    >We use the Domain Administrator's username, provided in the User Principal Names (UPN) (johndoe@contoso.com) format or the domain qualified sam-account name (contoso\johndoe or contoso.com\johndoe) format, to find the intended AD forest. If you use domain qualified sam-account name, we use the domain portion of the username to [locate the Domain Controller of the Domain Administrator using DNS](https://social.technet.microsoft.com/wiki/contents/articles/24457.how-domain-controllers-are-located-in-windows.aspx). If you use UPN instead, we [translate it to a domain qualified sam-account name](https://docs.microsoft.com/windows/desktop/api/ntdsapi/nf-ntdsapi-dscracknamesa) before locating the appropriate Domain Controller.

2. Call `Update-AzureADSSOForest -OnPremCredentials $creds`. This command updates the Kerberos decryption key for the `AZUREADSSOACC` computer account in this specific AD forest and updates it in Azure AD.
3. Repeat the preceding steps for each AD forest that you’ve set up the feature on.

>[!IMPORTANT]
>Ensure that you _don't_ run the `Update-AzureADSSOForest` command more than once. Otherwise, the feature stops working until the time your users' Kerberos tickets expire and are reissued by your on-premises Active Directory.

## How can I disable Seamless SSO?

### Step 1. Disable the feature on your tenant

#### Option A: Disable using Azure AD Connect

1. Run Azure AD Connect, choose **Change user sign-in page** and click **Next**.
2. Uncheck the **Enable single sign on** option. Continue through the wizard.

After completing the wizard, Seamless SSO will be disabled on your tenant. However, you will see a message on screen that reads as follows:

"Single sign-on is now disabled, but there are additional manual steps to perform in order to complete clean-up. Learn more"

To complete the clean-up process, follow steps 2 and 3 on the on-premises server where you are running Azure AD Connect.

#### Option B: Disable using PowerShell

Run the following steps on the on-premises server where you are running Azure AD Connect:

1. First, download, and install [Azure AD PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/overview).
2. Navigate to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
3. Import the Seamless SSO PowerShell module using this command: `Import-Module .\AzureADSSO.psd1`.
4. Run PowerShell as an Administrator. In PowerShell, call `New-AzureADSSOAuthenticationContext`. This command should give you a popup to enter your tenant's Global Administrator credentials.
5. Call `Enable-AzureADSSO -Enable $false`.

>[!IMPORTANT]
>Disabling Seamless SSO using PowerShell will not change the state in Azure AD Connect. Seamless SSO will show as enabled in the **Change user sign-in** page.

### Step 2. Get list of AD forests where Seamless SSO has been enabled

Follow tasks 1 through 4 below if you have disabled Seamless SSO using Azure AD Connect. If you have disabled Seamless SSO using PowerShell instead, jump ahead to task 5 below.

1. First, download, and install [Azure AD PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/overview).
2. Navigate to the `%programfiles%\Microsoft Azure Active Directory Connect` folder.
3. Import the Seamless SSO PowerShell module using this command: `Import-Module .\AzureADSSO.psd1`.
4. Run PowerShell as an Administrator. In PowerShell, call `New-AzureADSSOAuthenticationContext`. This command should give you a popup to enter your tenant's Global Administrator credentials.
5. Call `Get-AzureADSSOStatus`. This command provides you the list of AD forests (look at the "Domains" list) on which this feature has been enabled.

### Step 3. Manually delete the `AZUREADSSOACCT` computer account from each AD forest that you see listed.

## Next steps

- [**Quick Start**](how-to-connect-sso-quick-start.md) - Get up and running Azure AD Seamless SSO.
- [**Technical Deep Dive**](how-to-connect-sso-how-it-works.md) - Understand how this feature works.
- [**Troubleshoot**](tshoot-connect-sso.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
