---
title: Create user accounts for RemoteApp streaming - Azure Virtual Desktop
description: How to create user accounts for RemoteApp streaming for your customers in Azure Virtual Desktop with Azure AD, Azure AD DS, or AD DS.
author: Heidilohr
ms.topic: how-to
ms.date: 08/06/2021
ms.author: helohr
manager: femila
---

# Create user accounts for RemoteApp streaming

Because Azure Virtual Desktop doesn't currently support external profiles, or "identities," your users won't be able to access the apps you host with their own corporate credentials. Instead, you'll need to create identities for them in the Active Directory Domain that you'll use for RemoteApp streaming and sync user objects to the associated Azure Active Directory (Azure AD) tenant.

In this article, we'll explain how you can manage user identities to provide a secure environment for your customers. We'll also talk about the different parts that make up an identity.

## Requirements

The identities you create need to follow these guidelines:

- Identities must be [hybrid identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which means they exist in both the [Active Directory (AD)](/previous-versions/windows/it-pro/windows-server-2003/cc781408(v=ws.10)) and [Azure Active Directory (Azure AD)](../../active-directory/fundamentals/active-directory-whatis.md). You can use either [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/active-directory-domain-services) or [Azure Active Directory Domain Services (Azure AD DS)](https://azure.microsoft.com/services/active-directory-ds) to create these identities. To learn more about each method, see [Compare identity solutions](../../active-directory-domain-services/compare-identity-solutions.md).
- You should keep users from different organizations in separate Azure AD tenants to prevent security breaches. We recommend creating one Active Directory Domain and Azure Active Directory tenant per customer organization. That tenant should have its own associated Azure AD DS or AD DS subscription dedicated to that customer.

> [!NOTE]
> If you want to enable [single sign-on (SSO)](../configure-single-sign-on.md) and [Intune management](../management.md), you can do this for Azure AD-joined and Hybrid Azure AD-joined VMs. Azure Virtual Desktop doesn't support SSO and Intune with VMs joined to Azure AD Domain Services.

The following two sections will tell you how to create identities with AD DS and Azure AD DS. To follow [the security guidelines for cross-organizational apps](security.md), you'll need to repeat the process for each customer.

## Create users with Active Directory Domain Services

In this method, you'll set up hybrid identities using an Active Directory Domain Controller to manage user identities and sync them to Azure AD.

This method involves setting up Active Directory Domain Controllers to manage the user identities and syncing the users to Azure AD to create hybrid identities. These identities can then be used to access hosted applications in Azure Virtual Desktop. In this configuration, users are synced from Active Directory to Azure AD and the session host VMs are joined to the AD DS domain.

To set up an identity in AD DS:

1. [Create an Azure AD tenant](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) and a subscription for your customer.

2. [Install Active Directory Domain Services](/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-) on the Windows Server virtual machine (VM) you're using for the customer.

3. Install and configure [Azure AD Connect](../../active-directory/hybrid/how-to-connect-install-roadmap.md) on a separate domain-joined VM to sync the user accounts from Active Directory to Azure Active Directory.

4. If you plan to manage the VMs using Intune, enable [Hybrid Azure AD-joined devices](../../active-directory/devices/hybrid-join-plan.md) with Azure AD Connect.

5. Once you've configured the environment, [create new users](/previous-versions/windows/it-pro/windows-server-2003/cc755607(v=ws.10)) in the Active Directory. These users should automatically be synced with Azure AD.

6. When deploying session hosts in your host pool, use the Active Directory domain name to join the VMs and ensure the session hosts have line-of-sight to the domain controller.

This configuration will give you more control over your environment, but its complexity can make it less easy to manage. However, this option lets you provide your users with Azure AD-based apps. It also lets you manage your users' VMs with Intune.

## Create users with Azure Active Directory Domain Services

Azure AD DS identities are stored in a Microsoft managed Active Directory platform as a service (PaaS) where Microsoft manages two AD domain controllers that lets users use AD DS within their Azure subscriptions. In this configuration, users are synced from Azure AD to Azure AD DS, and the session hosts are joined to the Azure AD DS domain. Azure AD DS identities are easier to manage, but don't offer as much control as regular AD DS identities. You can only join the Azure Virtual Desktop VMs to the Azure AD DS domain, and you can't manage them with Intune.

To create an identity with Azure AD DS:

1. [Create an Azure AD tenant](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) and subscription for your customer.

2. [Deploy Azure AD Directory Services](../../active-directory-domain-services/tutorial-create-instance.md) in the user’s subscription.

3. Once you've finished configuring the environment, [create new users](../../active-directory/fundamentals/add-users-azure-active-directory.md) in Azure Active Directory. These user objects will automatically sync with Azure AD DS.

4. When deploying session hosts in a host pool, use the Azure AD DS domain name to join the VMs.

## Next steps

If you'd like to learn more about security considerations for setting up identities and tenants, see the [Security guidelines for cross-organizational apps](security.md).
