---
title: Set up managed identities
description: How to set up managed identities for your customers in Azure Virtual Desktop with Azure AD, Azure AD DS, or AD DS.
author: Heidilohr
ms.topic: how-to
ms.date: 07/16/2021
ms.author: helohr
manager: femila
---

# Set up managed identities

In this article, we will explain different ways you can manage user identities to provide a secure environment for your customers. This includes the different components that can be used.

To provide access to the different hosted applications, you will create and manage new identities and provide those to the users. As external identities are not currently supported with Azure Virtual Desktop, users cannot access the hosted applications using their own corporate credentials and must use the identity you provide for them.

The identities you create should be [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md),
meaning they have a presence in both [Active Directory](/previous-versions/windows/it-pro/windows-server-2003/cc781408(v=ws.10)) (AD) and [Azure Active Directory](..e/active-directory/fundamentals/active-directory-whatis.md) (Azure AD). This can be achieved by leveraging either [Active Directory Domain Services](windows-server/identity/ad-ds/active-directory-domain-services) (AD DS) or [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds) (AAD DS). These 2 identity services differ in cost and [functionality](../active-directory-domain-services/compare-identity-solutions.md).

In both cases, to ensure users from different customers are kept separate and provide a secure solution, Microsoft recommends creating an Azure AD tenant per customer with their own subscription and dedicated identities. The following sections explain how to deploy for one customer and the steps can be replicated for each customer.

## Managing users with Active Directory Domain Services

This method involves setting up Active Directory Domain Controllers to manage the user identities and syncing the users to Azure AD to create hybrid identities. These identities can then be used to access hosted applications in Azure Virtual Desktop. In this configuration, users are synced from Active Directory to Azure AD and the session host VMs are joined to the AD DS domain.

The steps below highlight the key components that need to be deployed to manage the user accounts for a given customer.

1. [Create an Azure AD tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) and subscription for the customer.

2. [Install Active Directory Domain Services](/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-) on Windows Server VMs in the customer’s subscription.

3. Install and configure [Azure AD Connect](../active-directory/hybrid/how-to-connect-install-roadmap.md) on a domain joined VM to sync the user accounts from Active Directory to Azure Active Directory.

4. If you plan to manage the VMs using Intune, enable [Hybrid Azure AD joined devices](../active-directory/devices/hybrid-azuread-join-plan.md) using Azure AD Connect.

5. Once the environment is configured, [create new users](/previous-versions/windows/it-pro/windows-server-2003/cc755607(v=ws.10)) in Active Directory and they will automatically be synced with Azure AD.

6. The user accounts can be provided to end-users to access Azure Virtual Desktop resources.

7. When deploying session hosts in a host pool, use the Active Directory domain name to join the VMs and ensure the sessions hosts have line-of-sight to the domain controller.

Using this configuration provides more control over the environment but it can be more complicated to manage. This option enables support for Hybrid Azure AD joined VMs which can provide a single sign-on experience for Azure AD based applications and allows the VMs to be managed using Intune.

## Managing users with Azure Active Directory Domain Services

This method involves setting up Azure Active Directory Domain Services to use as the domain controller, and then creating and managing the users directly in Azure AD. In this configuration, the users are synced from Azure AD to AAD DS and the session host VMs are joined to the AAD DS domain.

The steps below detail the components needed to manage the user accounts in Azure AD for a given customer.

1. [Create an Azure AD tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md) and subscription for the customer.

2. [Deploy Azure AD Directory Services](../active-directory-domain-services/tutorial-create-instance.md) in the customer’s subscription.

3. Once the environment is configured, [create new users](../active-directory/fundamentals/add-users-azure-active-directory.md) in Azure Active Directory and they will automatically be synced with Azure AD DS.

4. The user accounts can be provided to end-users to access Azure Virtual Desktop resources.

5. When deploying session hosts in a host pool, use the Azure AD DS domain name to join the VMs.

Using this configuration, the VMs can only be joined to Active Directory and cannot be managed using Intune.
