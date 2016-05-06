<properties
   pageTitle="How to require multi-factor authentication | Microsoft Azure"
   description="Learn how to require multi-factor authentication (MFA) for privileged identities with the Azure Active Directory Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="03/17/2016"
   ms.author="kgremban"/>

# Azure AD Privileged Identity Management: How to require MFA

We recommend that you require multi-factor authentication for all of your administrators.

## Requiring MFA in Azure AD Privileged Identity Management

When you sign in as a PIM administrator, you will receive alerts that suggest that your privileged accounts should require multi-factor authentication (MFA).  Click the security alert in the PIM dashboard and a new blade will open with a list of the administrator accounts that should require MFA.  You can require MFA by selecting multiple roles and then clicking the **Fix** button, or you can click the ellipses next to individual roles and then click the **Fix** button.

Additionally, you can change the MFA requirement for a specific role by clicking on the role in the Roles section of the dashboard, then enabling MFA for that role by clicking on **Settings** in the role blade and then selecting **Enable** under multi-factor authentication.

## How Azure AD PIM validates MFA

> [AZURE.IMPORTANT] Since Microsoft accounts (e.g. @outlook.com, @live.com, or @hotmail.com) are not currently supported to register for Azure MFA, they will not be permitted as temporary admins for highly privileged roles. If users need to continue managing workloads using a Microsoft account, please convert them to permanent administrators for now.

There are two options for validating MFA when a user activates a role.

The simplest way is to rely on Azure MFA for users activating a privileged role. To do this, first check that those users are licensed if necessary, and have registered for Azure MFA. More information on how to do this is in [Getting started with Azure Multi-Factor Authentication in the cloud](../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md#assigning-an-azure-mfa-azure-ad-premium-or-enterprise-mobility-license-to-users). Please note that it is recommended, but not required, to configure Azure AD to enforce MFA for these users when they sign in. This is because the MFA checks will be made by Azure AD PIM itself.

Alteratively, if users authenticate on-premises, you can have your identity provider be responsible for MFA. For example, if you have configured AD Federation Services to require smartcard-based authentication before accessing Azure AD, [Securing cloud resources with Azure Multi-Factor Authentication and AD FS](../multi-factor-authentication/multi-factor-authentication-get-started-adfs-cloud.md) includes instructions for configuring AD FS to send claims to Azure AD. When a user tries to activate a role, and Azure AD PIM will accept that MFA has already been validated for the user once it receives the appropriate claims.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
