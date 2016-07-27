<properties
   pageTitle="How to require multi-factor authentication | Microsoft Azure"
   description="Learn how to require multi-factor authentication (MFA) for privileged identities with the Azure Active Directory Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/01/2016"
   ms.author="kgremban"/>

# How to require MFA in Azure AD Privileged Identity Management

We recommend that you require multi-factor authentication (MFA) for all of your administrators. This reduces the risk of an attack due to a compromised password.

You can require that users complete an MFA challenge when they sign in. The blog post [MFA for Office 365 and MFA for Azure](https://blogs.technet.microsoft.com/ad/2014/02/11/mfa-for-office-365-and-mfa-for-azure/) compares what is included in Office and Azure subscriptions, with the features contained in the Microsoft Azure Multi-Factor Authentication offering.

You can also require that users complete an MFA challenge when they activate a role in Azure AD PIM. This way, if the user didn't complete an MFA challenge when they signed in, they will be prompted to do so by PIM.

## Requiring MFA in Azure AD Privileged Identity Management

When you manage identities in PIM as a privileged role administrator, you may see alerts that recommend MFA for privileged accounts. Click the security alert in the PIM dashboard, and a new blade will open with a list of the administrator accounts that should require MFA.  You can require MFA by selecting multiple roles and then clicking the **Fix** button, or you can click the ellipses next to individual roles and then click the **Fix** button.

> [AZURE.IMPORTANT] Right now, Azure MFA only works with work or school accounts, not Microsoft accounts (usually a personal account that's used to sign in to Microsoft services like Skype, Xbox, Outlook.com, etc.). Because of this, anyone using a Microsoft account can't be an eligible admin because they can't use MFA to activate their roles. If these users need to continue managing workloads using a Microsoft account, elevate them to permanent administrators for now.

Additionally, you can change the MFA requirement for a specific role by clicking on it in the Roles section of the PIM dashboard. Then, click on **Settings** in the role blade and then selecting **Enable** under multi-factor authentication.

## How Azure AD PIM validates MFA

There are two options for validating MFA when a user activates a role.

The simplest option is to rely on Azure MFA for users who are activating a privileged role. To do this, first check that those users are licensed, if necessary, and have registered for Azure MFA. More information on how to do this is in [Getting started with Azure Multi-Factor Authentication in the cloud](../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md). It is recommended, but not required, that you configure Azure AD to enforce MFA for these users when they sign in. This is because the MFA checks will be made by Azure AD PIM itself.

Alternatively, if users authenticate on-premises you can have your identity provider be responsible for MFA. For example, if you have configured AD Federation Services to require smartcard-based authentication before accessing Azure AD, [Securing cloud resources with Azure Multi-Factor Authentication and AD FS](../multi-factor-authentication/multi-factor-authentication-get-started-adfs-cloud.md) includes instructions for configuring AD FS to send claims to Azure AD. When a user tries to activate a role, Azure AD PIM will accept that MFA has already been validated for the user once it receives the appropriate claims.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
