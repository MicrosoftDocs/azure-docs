---
title:  Migrate from federation to Azure AD CBA
description: Learn how to migrate from Federated server to Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023


ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Migrate from federation to Azure AD certificate-based authentication (CBA)

This article explains how to migrate from running federated servers such as Active Directory Federation Services (AD FS) on-premises to cloud authentication using Azure Active Directory (Azure AD) certificate-based authentication (CBA).

## Staged Rollout 

[Staged Rollout](../hybrid/how-to-connect-staged-rollout.md) helps customers transition from AD FS to Azure AD by testing cloud authentication with selected groups of users before switching the entire tenant. 

## Enable Staged Rollout for certificate-based authentication on your tenant

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To configure Staged Rollout, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) in the User Administrator role for the organization.
1. Search for and select **Azure Active Directory**.
1. From the left menu, select **Azure AD Connect**.
1. On the Azure AD Connect page, under the Staged Rollout of cloud authentication, click **Enable Staged Rollout for managed user sign-in**.
1. On the **Enable Staged Rollout** feature page, click **On** for the option [Certificate-based authentication](active-directory-certificate-based-authentication-get-started.md)
1. Click **Manage groups** and add groups you want to be part of cloud authentication. To avoid a time-out, ensure that the security groups contain no more than 200 members initially.

For more information, see [Staged Rollout](../hybrid/how-to-connect-staged-rollout.md).

>[!NOTE]
> When Staged rollout is enabled for a user, the user is considered a managed user and all authentication will happen at Azure AD. For a federated Tenant, if CBA is enabled on Staged Rollout, password authentication only works if PHS is enabled too otherwise password authentication will fail.

## Use Azure AD connect to update certificateUserIds attribute

An AD FS admin can use **Synchronization Rules Editor** to create rules to sync the values of attributes from AD FS to Azure AD user objects. For more information, see [Sync rules for certificateUserIds](concept-certificate-based-authentication-certificateuserids.md#update-certificate-user-ids-using-azure-ad-connect).

Azure AD Connect requires a special role named **Hybrid Identity Administrator**, which grants the necessary permissions. You need this role for permission to write to the new cloud attribute.

>[!NOTE] 
>If a user is using synchronized attributes, such as the onPremisesUserPrincipalName attribute in the user object for username binding, be aware that any user that has administrative access to the Azure AD Connect server can change the synchronized attribute mapping, and change the value of the synchronized attribute. The user does not need to be a cloud admin. The AD FS admin should make sure the administrative access to the Azure AD Connect server should be limited, and privileged accounts should be cloud-only accounts.

## Frequently asked questions about migrating from AD FS to Azure AD

### Can we have privileged accounts with a federated AD FS server?
        
Although it's possible, Microsoft recommends privileged accounts be cloud-only accounts. Using cloud-only accounts for privileged access limits exposure in Azure AD from a compromised on-premises environment. For more information, see [Protecting Microsoft 365 from on-premises attacks](../fundamentals/protect-m365-from-on-premises-attacks.md).

### If an organization is a hybrid running both AD FS and Azure CBA, are they still vulnerable to the AD FS compromise?

Microsoft recommends privileged accounts be cloud-only accounts. This practice will limit the exposure in Azure AD from a compromised on-premises environment. Maintaining privileged accounts a cloud-only is foundational to this goal. 

For synchronized accounts:

- If they're in a managed domain (not federated), there's no risk from the federated IdP.
- If they're in a federated domain, but a subset of accounts is being moved to Azure AD CBA by Staged Rollout, they're subject to risks related to the federated Idp until the federated domain is fully switched to cloud authentication.

### Should organizations eliminate federated servers like AD FS to prevent the capability to pivot from AD FS to Azure?
 
With federation, an attacker could impersonate anyone, such as a CIO, even if they can't obtain a cloud-only role like the Global Administrator account.

When a domain is federated in Azure AD, a high level of trust is being placed on the Federated IdP. AD FS is one example, but the notion holds true for *any* federated IdP. Many organizations deploy a federated IdP such as AD FS exclusively to accomplish certificate based authentication. Azure AD CBA completely removes the AD FS dependency in this case. With Azure AD CBA, customers can move their application estate to Azure AD to modernize their IAM infrastructure and reduce costs with increased security.

From a security perspective, there's no change to the credential, including the X.509 certificate, CACs, PIVs, and so on, or to the PKI being used. The PKI owners retain complete control of the certificate issuance and revocation lifecycle and policy. The revocation check and the authentication happen at Azure AD instead of federated Idp. These checks enable passwordless, phishing-resistant authentication directly to Azure AD for all users.

### How does authentication work with Federated AD FS and Azure AD cloud authentication with Windows?

Azure AD CBA requires the user or application to supply the Azure AD UPN of the user who signs in. 

In the browser example, the user most often types in their Azure AD UPN. The Azure AD UPN is used for realm and user discovery. The certificate used then must match this user by using one of the configured username bindings in the policy. 

In Windows sign-in, the match depends on if the device is hybrid or Azure AD joined. But in both cases, if username hint is provided, Windows will send the hint as an Azure AD UPN. The certificate used then must match this user by using one of the configured username bindings in the policy.


## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Azure AD CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [FAQ](certificate-based-authentication-faq.yml)
