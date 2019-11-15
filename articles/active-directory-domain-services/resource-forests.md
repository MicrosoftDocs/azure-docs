---
title: Azure AD Domain Services resource forests overview | Microsoft Docs
description: Learn about user forests and resource forests for an Azure Active Directory Domain Services managed domain and how to decide the best forest type for your environment.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: iainfou
---

# Azure Active Directory Domain Services resource forests

## What are Active Directory forests?

A *forest* is a logical construct used by Active Directory Domain Services to group one or more domains. In Azure AD DS, the forest only contains the one domain.

## Azure AD DS forest behavior

By default, an Azure AD DS managed domain is created as a *User* forest. This type of forest synchronizes all objects from Azure AD, including any user accounts created in an on-premises AD DS environment. User accounts can authenticate against the Azure AD DS managed domain, such as to sign in to a domain-joined VM. A user forest is the most common type of managed domain you create.

A resource forest only synchronizes objects from Azure AD. User accounts created in an on-premises AD DS environment aren't synchronized. However, even those synchronized Azure AD user accounts can't be authenticated by the Azure AD DS managed domain. A resource forest is for environments where you only want to run applications and services, and don't need user authentication.

## SKU differences

Resource forests can only be created in the *Enterprise* or *Premium* SKUs. You can change SKUs after the Azure AD DS managed domain is created, but you can't change the forest type. For more information, see [Azure AD DS SKU types and features][skus].

## Scope synchronization for resource forests

When you create a resource forest, it's recommended to configure scoped group synchronization from Azure AD since you likely don't need all users and groups to become part of the Azure AD DS managed domain. For more information, see [Create and configure an Azure Active Directory Domain Services instance with advanced configuration options][tutorial-create-instance-advanced].

## Create trust

From a management workstation for the on-premises AD DS domain, add forwarders for the on-prem DNS servers:

* Select **Start | Administrative Tools | DNS**
* Right-select DNS server, such as *myAD01*, select **Properties**
* Choose **Forwarders**, then **Edit** to add additional forwarders.
* Add the IP addresses of the Azure AD DS managed domain, such as *10.0.1.4* and *10.0.1.5*.

Configure inbound trust on the on-premises AD DS domain:

* Select **Start | Administrative Tools | Active Directory Domains and Trusts**
* Right-select domain, such as *onprem.contoso.com*, select **Properties**
* Choose **Trusts** tab, then **New Trust**
* Enter name on Azure AD DS domain name, such as *aadds.contoso.com*, then select **Next**
* Select the option to create a **Forest trust**, then to create a **One-way: incoming** trust.
* Choose to create the trust for **This domain only**. In the next step, you create the trust in the Azure portal for the Azure AD DS managed domain.
* Choose to use **Forest-wide authentication**, then enter and confirm a trust password. This same password is also entered in the Azure portal in the next section.
* Step through the next few windows with default options, then choose the option for **No, do not confirm the outgoing trust**.
* Select **Finish**

Configure outbound trust for the Azure AD DS managed domain in the Azure portal:

* In the Azure portal, search for and select **Azure AD Domain Services**, then select your managed domain, such as *aadds.contoso.com*
* From the menu on the left-hand side of the Azure AD DS managed domain, select **Trusts**, then choose to **+ Add** a trust.
* Enter a display name that identifies your trust, then the on-premises trusted forest DNS name, such as *onprem.contoso.com*
* Provide the same trust password that was used when configuring the inbound forest trust for the on-premises AD DS domain in the previous section.
* Provide at least two DNS servers for the on-premises AD DS domain, such as *10.0.2.4* and *10.0.2.5*
* When ready, **Save** the outbound forest trust

    [Create outbound forest trust in the Azure portal](./media/tutorial-create-instance-advanced/portal-create-outbound-trust.png)


## Next steps

To get started, [create an Azure AD DS managed domain][create-instance].

<!-- INTERNAL LINKS -->
[azure-ad-password-sync]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services
[create-instance]: tutorial-create-instance.md
[tutorial-create-instance-advanced]: tutorial-create-instance-advanced.md
