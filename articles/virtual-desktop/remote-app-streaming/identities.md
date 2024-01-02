---
title: Create user accounts for RemoteApp streaming - Azure Virtual Desktop
description: How to create user accounts for RemoteApp streaming for your customers in Azure Virtual Desktop with Microsoft Entra ID, Microsoft Entra Domain Services, or AD DS.
author: Heidilohr
ms.topic: how-to
ms.date: 08/06/2021
ms.author: helohr
manager: femila
---

# Create user accounts for RemoteApp streaming

Because Azure Virtual Desktop doesn't currently support external profiles, or "identities," your users won't be able to access the apps you host with their own corporate credentials. Instead, you'll need to create identities for them in the Active Directory Domain that you'll use for RemoteApp streaming and sync user objects to the associated Microsoft Entra tenant.

In this article, we'll explain how you can manage user identities to provide a secure environment for your customers. We'll also talk about the different parts that make up an identity.

## Requirements

The identities you create need to follow these guidelines:

- Identities must be [hybrid identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which means they exist in both the [Active Directory (AD)](/previous-versions/windows/it-pro/windows-server-2003/cc781408(v=ws.10)) and [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md). You can use either [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/active-directory-domain-services) or [Microsoft Entra Domain Services](https://azure.microsoft.com/services/active-directory-ds) to create these identities. To learn more about each method, see [Compare identity solutions](../../active-directory-domain-services/compare-identity-solutions.md).
- You should keep users from different organizations in separate Microsoft Entra tenants to prevent security breaches. We recommend creating one Active Directory Domain and Microsoft Entra tenant per customer organization. That tenant should have its own associated Microsoft Entra Domain Services or AD DS subscription dedicated to that customer.

> [!NOTE]
> If you want to enable [single sign-on (SSO)](../configure-single-sign-on.md) and [Intune management](../management.md), you can do this for Microsoft Entra joined and Microsoft Entra hybrid joined VMs. Azure Virtual Desktop doesn't support SSO and Intune with VMs joined to Microsoft Entra Domain Services.

The following two sections will tell you how to create identities with AD DS and Microsoft Entra Domain Services. To follow [the security guidelines for cross-organizational apps](security.md), you'll need to repeat the process for each customer.

## Create users with Active Directory Domain Services

In this method, you'll set up hybrid identities using an Active Directory Domain Controller to manage user identities and sync them to Microsoft Entra ID.

This method involves setting up Active Directory Domain Controllers to manage the user identities and syncing the users to Microsoft Entra ID to create hybrid identities. These identities can then be used to access hosted applications in Azure Virtual Desktop. In this configuration, users are synced from Active Directory to Microsoft Entra ID and the session host VMs are joined to the AD DS domain.

To set up an identity in AD DS:

1. [Create a Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) and a subscription for your customer.

2. [Install Active Directory Domain Services](/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-) on the Windows Server virtual machine (VM) you're using for the customer.

3. Install and configure [Microsoft Entra Connect](../../active-directory/hybrid/how-to-connect-install-roadmap.md) on a separate domain-joined VM to sync the user accounts from Active Directory to Microsoft Entra ID.

4. If you plan to manage the VMs using Intune, enable [Microsoft Entra hybrid joined devices](../../active-directory/devices/hybrid-join-plan.md) with Microsoft Entra Connect.

5. Once you've configured the environment, [create new users](/previous-versions/windows/it-pro/windows-server-2003/cc755607(v=ws.10)) in the Active Directory. These users should automatically be synced with Microsoft Entra ID.

6. When deploying session hosts in your host pool, use the Active Directory domain name to join the VMs and ensure the session hosts have line-of-sight to the domain controller.

This configuration will give you more control over your environment, but its complexity can make it less easy to manage. However, this option lets you provide your users with Microsoft Entra ID-based apps. It also lets you manage your users' VMs with Intune.

<a name='create-users-with-azure-active-directory-domain-services'></a>

## Create users with Microsoft Entra Domain Services

Microsoft Entra Domain Services identities are stored in a Microsoft managed Active Directory platform as a service (PaaS) where Microsoft manages two AD domain controllers that lets users use AD DS within their Azure subscriptions. In this configuration, users are synced from Microsoft Entra ID to Microsoft Entra Domain Services, and the session hosts are joined to the Microsoft Entra Domain Services domain. Microsoft Entra Domain Services identities are easier to manage, but don't offer as much control as regular AD DS identities. You can only join the Azure Virtual Desktop VMs to the Microsoft Entra Domain Services domain, and you can't manage them with Intune.

To create an identity with Microsoft Entra Domain Services:

1. [Create a Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) and subscription for your customer.

2. [Deploy Microsoft Entra Directory Services](../../active-directory-domain-services/tutorial-create-instance.md) in the user’s subscription.

3. Once you've finished configuring the environment, [create new users](../../active-directory/fundamentals/add-users-azure-active-directory.md) in Microsoft Entra ID. These user objects will automatically sync with Microsoft Entra Domain Services.

4. When deploying session hosts in a host pool, use the Microsoft Entra Domain Services domain name to join the VMs.

## Next steps

If you'd like to learn more about security considerations for setting up identities and tenants, see the [Security guidelines for cross-organizational apps](security.md).
