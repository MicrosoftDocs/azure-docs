---
title: Create a forest trust in Azure AD Domain Services | Microsoft Docs
description: Learn how to create an outbound forest to an on-premises AD DS domain in the Azure portal for Azure AD Domain Services
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 11/15/2019
ms.author: iainfou
---

# Create an outbound forest trust to an on-premises domain in Azure Active Directory Domain Services

## Azure AD DS forest behavior

By default, an Azure AD DS managed domain is created as a *User* forest. This type of forest synchronizes all objects from Azure AD, including any user accounts created in an on-premises AD DS environment. User accounts can authenticate against the Azure AD DS managed domain, such as to sign in to a domain-joined VM. A user forest is the most common type of managed domain you create.

A resource forest only synchronizes objects from Azure AD. User accounts created in an on-premises AD DS environment aren't synchronized. However, even those synchronized Azure AD user accounts can't be authenticated by the Azure AD DS managed domain. A resource forest is for environments where you only want to run applications and services, and don't need user authentication.

Resource forests can only be created in the *Enterprise* or *Premium* SKUs. You can change SKUs after the Azure AD DS managed domain is created, but you can't change the forest type. For more information, see [What are resource forests?][resource-forests]

## Configure DNS in the on-premises domain

To correctly resolve the Azure AD DS managed domain from the on-premises environment, you may need to add forwarders to the existing DNS servers. If you haven't configure the on-premises environment to communicate with the Azure AD DS managed domain, complete the following steps from a management workstation for the on-premises AD DS domain:

1. Select **Start | Administrative Tools | DNS**
1. Right-select DNS server, such as *myAD01*, select **Properties**
1. Choose **Forwarders**, then **Edit** to add additional forwarders.
1. Add the IP addresses of the Azure AD DS managed domain, such as *10.0.1.4* and *10.0.1.5*.

## Create inbound forest trust in the on-premises domain

The on-premises AD DS domain needs an incoming forest trust for the Azure AD DS managed domain. This trust must be manually created in the on-premises AD DS domain, it can't be created from the Azure portal.

To configure inbound trust on the on-premises AD DS domain, complete the following steps from a management workstation for the on-premises AD DS domain:

1. Select **Start | Administrative Tools | Active Directory Domains and Trusts**
1. Right-select domain, such as *onprem.contoso.com*, select **Properties**
1. Choose **Trusts** tab, then **New Trust**
1. Enter name on Azure AD DS domain name, such as *aadds.contoso.com*, then select **Next**
1. Select the option to create a **Forest trust**, then to create a **One way: incoming** trust.
1. Choose to create the trust for **This domain only**. In the next step, you create the trust in the Azure portal for the Azure AD DS managed domain.
1. Choose to use **Forest-wide authentication**, then enter and confirm a trust password. This same password is also entered in the Azure portal in the next section.
1. Step through the next few windows with default options, then choose the option for **No, do not confirm the outgoing trust**.
1. Select **Finish**

## Create outbound forest trust in the Azure AD DS managed domain

With the on-premises AD DS domain configured to resolve the Azure AD DS managed domain and an inbound forest trust created, now created the outbound forest trust. This outbound forest trust completes the trust relationship between the on-premises AD DS domain and the Azure AD DS managed domain.

To create the outbound trust for the Azure AD DS managed domain in the Azure portal, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**, then select your managed domain, such as *aadds.contoso.com*
1. From the menu on the left-hand side of the Azure AD DS managed domain, select **Trusts**, then choose to **+ Add** a trust.
1. Enter a display name that identifies your trust, then the on-premises trusted forest DNS name, such as *onprem.contoso.com*
1. Provide the same trust password that was used when configuring the inbound forest trust for the on-premises AD DS domain in the previous section.
1. Provide at least two DNS servers for the on-premises AD DS domain, such as *10.0.2.4* and *10.0.2.5*
1. When ready, **Save** the outbound forest trust

    [Create outbound forest trust in the Azure portal](./media/tutorial-create-instance-advanced/portal-create-outbound-trust.png)

## Next steps

For more conceptual information about forest types in Azure AD DS, see [What are resource forests?][resource-forests]

<!-- INTERNAL LINKS -->
[resource-forests]: resource-forests.md