---
title: Tutorial - Configure virtual networking for Azure AD Domain Services | Microsoft Docs
description: In this tutorial, you learn how to create and configure an Azure virtual network subnet or network peering for an Azure Active Directory Domain Services instance using the Azure portal.
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: tutorial
ms.date: 10/10/2019
ms.author: iainfou

#Customer intent: As an identity administrator, I want to create and configure a virtual network subnet or network peering for application workloads in an Azure Active Directory Domain Services managed domain
---

# Tutorial: Configure virtual networking for an Azure Active Directory Domain Services instance

To provide connectivity to users and applications, an Azure Active Directory Domain Services (Azure AD DS) managed domain is deployed into an Azure virtual network subnet. This virtual network subnet should only be used for the managed domain resources provided by the Azure platform. As you create your own VMs and applications, they shouldn't be deployed into the same virtual network subnet. Instead, you should create and deploy your applications into a separate virtual network subnet, or in a separate virtual network that's peered to the Azure AD DS virtual network.

This tutorial shows you how to create and configure a dedicated virtual network subnet or how to peer a different network to the Azure AD DS managed domain's virtual network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * 

If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* You need *global administrator* privileges in your Azure AD tenant to enable Azure AD DS.
* You need *Contributor* privileges in your Azure subscription to create the required Azure AD DS resources.
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, the first tutorial [creates and configures an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].

## Sign in to the Azure portal

In this tutorial, you create and configure the Azure AD DS instance using the Azure portal. To get started, first sign in to the [Azure portal](https://portal.azure.com).

## Application workload connectivity options

For more information on how to plan and configure the virtual network, see [networking considerations for Azure Active Directory Domain Services][network-considerations].

## Create a virtual network subnet

## Configure virtual network peering

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * 

To see this managed domain in action, create and join a virtual machine to the domain.

> [!div class="nextstepaction"]
> [Join a Windows Server virtual machine to your managed domain](join-windows-vm.md)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[create-join-windows-vm]: join-windows-vm.md
