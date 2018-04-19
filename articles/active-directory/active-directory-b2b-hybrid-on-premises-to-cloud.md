---
title: Grant locally-managed partner accounts access to cloud resources as Azure AD B2B users | Microsoft Docs
description: Give locally-managed external partners access to both local and cloud resources using the same credentials with Azure AD B2B collaboration.
services: active-directory
documentationcenter: ''
author: twooley
manager: mtillman
editor: ''
tags: ''

ms.service: active-directory
ms.topic: article
ms.workload: identity
ms.date: 04/20/2017
ms.author: twooley
ms.reviewer: sasubram

---

# Grant locally-managed partner accounts access to cloud resources using Azure AD B2B collaboration

Before Azure Active Directory (Azure AD), organizations with on-premises identity systems have traditionally managed partner accounts in their on-premises directory. In such an organization, when you start to move apps to Azure AD, you want to make sure your partners can access the resources they need. It shouldn't matter whether the resources are on-premises or in the cloud. Also, you want your partner users to be able to use the same sign-in credentials for both on-premises and Azure AD resources. 

We now provide a solution where you can synchronize your partner users' local accounts to the cloud, where they behave and can be managed just like Azure AD B2B users. 

## Sync partner accounts with local credentials to the cloud

If you create accounts for your external partners in your on-premises directory (for example, you create an account with a sign-in name of "wmoran" for an external user named Wendy Moran in your partners.contoso.com domain), you can now sync these accounts to the cloud. Specifically, you can use Azure Active Directory (Azure AD) Connect to sync the partner accounts to the cloud as Azure AD B2B users (that is, users with UserType = Guest). This enables your partner users to access cloud resources using the same credentials as their local accounts, without giving them more access than they need.

> [!NOTE]
> If your external partners use their external email address to sign in, see the section [Let your partners use email as sign-in to access cloud apps (Preview)](#let-your-partners-use-email-as-sign-in-to-access-cloud-apps-preview).

### Identify unique attributes for UserType

Before you enable synchronization of the UserType attribute, you must first decide how to derive the UserType attribute from on-premises Active Directory. In other words, what parameters in your on-premises environment are unique to your external collaborators? Determine a parameter that distinguishes these external collaborators from members of your own organization.

Two common approaches for this are to:

- Designate an unused on-premises Active Directory attribute (for example, extensionAttribute1) to use as the source attribute. 
- Alternatively, derive the value for UserType attribute from other properties. For example, you want to synchronize all users as Guest if their on-premises Active Directory UserPrincipalName attribute ends with the domain *@partners.contoso.com*.
 
For detailed attribute requirements, see [Enable synchronization of UserType](connect/active-directory-aadconnectsync-change-the-configuration.md#enable-synchronization-of-usertype). 

### Configure Azure AD Connect to sync users to the cloud

After you identify the unique attribute, you can configure Azure AD Connect to sync these users to the cloud as Azure AD B2B users (that is, users with UserType = Guest). From an authorization point of view, these users are indistinguishable from B2B users created through the Azure AD B2B collaboration invitation process.

For implementation instructions, see [Enable synchronization of UserType](connect/active-directory-aadconnectsync-change-the-configuration.md#enable-synchronization-of-usertype).

## Let your partners use email as sign-in to access cloud apps (Preview)

For access to on-premises resources, you might have a configuration where you create local accounts for your external partners, and enable them to use their own external email address to access local apps. Your on-premises identity provider (IdP) knows to look up the user by their email address. For example, an external user (Wendy Moran) can sign in to partners.contoso.com as wmoran@fabrikam.com to access on-premises apps in your organization, Contoso.com.

This configuration works fine when it's used for on-premises authentication. However, when using Azure AD for authentication, typically the home realm of the user is discovered based on the domain of the sign-in name that's used. For example, a user who signs in as wmoran@fabrikam.com is redirected for authentication to the tenancy that the fabrikam.com domain is registered with. This means that Wendy can't use local credentials in Contoso.com for authentication.

To address this issue, there's now a solution available where Azure AD can use the cloud UPN of the user to see which IdP the account is federated with. If it's a local IdP, the authentication request is redirected to the local IdP, and not to Microsoft. To enable this functionality, you must do the following:

1. Use Azure AD Connect to synchronize external user accounts from the on-premises Active Directory to Azure AD. For example:
   - User Type=Guest
   - OnPremisesUserPrincipalName = wmoran@fabrikam.com (e-mail address of the external user)
   - Cloud UPN = wmoran@partners.contoso.com
2. Federate the Cloud UPN suffix of the external partner accounts with the on-premises IdP.
3. Migrate the app trust from the on-premises IdP to Azure AD.
4. Teach end users to sign in to target apps with a tenanted endpoint, for example, *contoso.sharepoint.com*.

For detailed instructions, see [Synchronizing guest user accounts that use email for sign-in (Preview)](connect/active-directory-aadconnect-guest-sync.md).

## Next steps

- [Azure Active Directory B2B collaboration for hybrid organizations](active-directory-b2b-hybrid-organizations.md)
- [Grant B2B users in Azure AD access to your on-premises applications](active-directory-b2b-hybrid-cloud-to-on-premises.md)
- For an overview of Azure AD Connect, see [Integrate your on-premises directories with Azure Active Directory](connect/active-directory-aadconnect.md).

