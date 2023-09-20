---
title:  Migrate from federation to Microsoft Entra CBA
description: Learn how to migrate from Federated server to Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/13/2023


ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Migrate from federation to Microsoft Entra certificate-based authentication (CBA)

This article explains how to migrate from running federated servers such as Active Directory Federation Services (AD FS) on-premises to cloud authentication using Microsoft Entra certificate-based authentication (CBA).

## Staged Rollout 

[Staged Rollout](../hybrid/connect/how-to-connect-staged-rollout.md) helps customers transition from AD FS to Microsoft Entra ID by testing cloud authentication with selected groups of users before switching the entire tenant. 

## Enable Staged Rollout for certificate-based authentication on your tenant

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To configure Staged Rollout, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Search for and select **Microsoft Entra Connect**.
1. On the Microsoft Entra Connect page, under the Staged Rollout of cloud authentication, click **Enable Staged Rollout for managed user sign-in**.
1. On the **Enable Staged Rollout** feature page, click **On** for the option [Certificate-based authentication](./certificate-based-authentication-federation-get-started.md)
1. Click **Manage groups** and add groups you want to be part of cloud authentication. To avoid a time-out, ensure that the security groups contain no more than 200 members initially.

For more information, see [Staged Rollout](../hybrid/connect/how-to-connect-staged-rollout.md).

>[!NOTE]
> When Staged rollout is enabled for a user, the user is considered a managed user and all authentication will happen at Microsoft Entra ID. For a federated Tenant, if CBA is enabled on Staged Rollout, password authentication only works if PHS is enabled too otherwise password authentication will fail.

<a name='use-azure-ad-connect-to-update-certificateuserids-attribute'></a>

## Use Microsoft Entra Connect to update certificateUserIds attribute

An AD FS admin can use **Synchronization Rules Editor** to create rules to sync the values of attributes from AD FS to Microsoft Entra user objects. For more information, see [Sync rules for certificateUserIds](concept-certificate-based-authentication-certificateuserids.md#update-certificate-user-ids-using-azure-ad-connect).

Microsoft Entra Connect requires a special role named **Hybrid Identity Administrator**, which grants the necessary permissions. You need this role for permission to write to the new cloud attribute.

>[!NOTE] 
>If a user is using synchronized attributes, such as the onPremisesUserPrincipalName attribute in the user object for username binding, be aware that any user that has administrative access to the Microsoft Entra Connect server can change the synchronized attribute mapping, and change the value of the synchronized attribute. The user does not need to be a cloud admin. The AD FS admin should make sure the administrative access to the Microsoft Entra Connect server should be limited, and privileged accounts should be cloud-only accounts.

<a name='frequently-asked-questions-about-migrating-from-ad-fs-to-azure-ad'></a>

## Frequently asked questions about migrating from AD FS to Microsoft Entra ID

### Can we have privileged accounts with a federated AD FS server?
        
Although it's possible, Microsoft recommends privileged accounts be cloud-only accounts. Using cloud-only accounts for privileged access limits exposure in Microsoft Entra ID from a compromised on-premises environment. For more information, see [Protecting Microsoft 365 from on-premises attacks](../architecture/protect-m365-from-on-premises-attacks.md).

### If an organization is a hybrid running both AD FS and Azure CBA, are they still vulnerable to the AD FS compromise?

Microsoft recommends privileged accounts be cloud-only accounts. This practice will limit the exposure in Microsoft Entra ID from a compromised on-premises environment. Maintaining privileged accounts a cloud-only is foundational to this goal. 

For synchronized accounts:

- If they're in a managed domain (not federated), there's no risk from the federated IdP.
- If they're in a federated domain, but a subset of accounts is being moved to Microsoft Entra CBA by Staged Rollout, they're subject to risks related to the federated Idp until the federated domain is fully switched to cloud authentication.

### Should organizations eliminate federated servers like AD FS to prevent the capability to pivot from AD FS to Azure?
 
With federation, an attacker could impersonate anyone, such as a CIO, even if they can't obtain a cloud-only role like the Global Administrator account.

When a domain is federated in Microsoft Entra ID, a high level of trust is being placed on the Federated IdP. AD FS is one example, but the notion holds true for *any* federated IdP. Many organizations deploy a federated IdP such as AD FS exclusively to accomplish certificate based authentication. Microsoft Entra CBA completely removes the AD FS dependency in this case. With Microsoft Entra CBA, customers can move their application estate to Microsoft Entra ID to modernize their IAM infrastructure and reduce costs with increased security.

From a security perspective, there's no change to the credential, including the X.509 certificate, CACs, PIVs, and so on, or to the PKI being used. The PKI owners retain complete control of the certificate issuance and revocation lifecycle and policy. The revocation check and the authentication happen at Microsoft Entra ID instead of federated Idp. These checks enable passwordless, phishing-resistant authentication directly to Microsoft Entra ID for all users.

<a name='how-does-authentication-work-with-federated-ad-fs-and-azure-ad-cloud-authentication-with-windows'></a>

### How does authentication work with Federated AD FS and Microsoft Entra cloud authentication with Windows?

Microsoft Entra CBA requires the user or application to supply the Microsoft Entra UPN of the user who signs in. 

In the browser example, the user most often types in their Microsoft Entra UPN. The Microsoft Entra UPN is used for realm and user discovery. The certificate used then must match this user by using one of the configured username bindings in the policy. 

In Windows sign-in, the match depends on if the device is hybrid or Microsoft Entra joined. But in both cases, if username hint is provided, Windows will send the hint as a Microsoft Entra UPN. The certificate used then must match this user by using one of the configured username bindings in the policy.


## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Microsoft Entra CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [FAQ](certificate-based-authentication-faq.yml)
