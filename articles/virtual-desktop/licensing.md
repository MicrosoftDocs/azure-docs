---
title: Licensing Azure Virtual Desktop
description: An overview of licensing Azure Virtual Desktop for internal and external commercial purposes, including per-user access pricing.
ms.topic: overview
author: dknappettmsft
ms.author: daknappe
ms.date: 01/08/2024
---

# Licensing Azure Virtual Desktop

This article explains the licensing requirements for using Azure Virtual Desktop, whether you're providing desktops or applications to users in your organization, or to external users. This article shows you how licensing Azure Virtual Desktop for external commercial purposes is different than for internal purposes, how per-user access pricing works in detail, and how you can license other products you plan to use with Azure Virtual Desktop.

## Internal and external commercial purposes

In the context of providing virtualized infrastructure with Azure Virtual Desktop, *internal users* (for internal commercial purposes) refers to people who are members of your own organization, such as employees of a business or students of a school, including external vendors or contractors. *External users* (for external commercial purposes) aren't members of your organization, but your customers where you might provide a Software-as-a-Service (SaaS) application using Azure Virtual Desktop.

> [!NOTE]
> Take care not to confuse external *users* with external *identities*. Azure Virtual Desktop doesn't support external identities, including external guest accounts or business-to-business (B2B) identities. Whether you're serving internal commercial purposes or external users with Azure Virtual Desktop, you'll need to create and manage identities for those users yourself. For more information, see [Recommendations for deploying Azure Virtual Desktop for internal or external commercial purposes](organization-internal-external-commercial-purposes-recommendations.md).

Licensing Azure Virtual Desktop works differently for internal and external commercial purposes. Consider the following examples:

- A manufacturing company called *Fabrikam, Inc*. might use Azure Virtual Desktop to provide Fabrikam's employees (internal users) with access to virtual workstations and line-of-business apps. Because Fabrikam is serving internal users, Fabrikam must purchase one of the eligible licenses listed in [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for each of their employees that access Azure Virtual Desktop.
  
- A retail company called *Wingtip Toys* might use Azure Virtual Desktop to provide an external contractor company (external users) with access to line-of-business apps. Because these external users are serving internal purposes, Wingtip Toys must purchase one of the eligible licenses listed in [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for each of their contractors that access Azure Virtual Desktop. Per-user access pricing isn't applicable in this scenario. 

- A software vendor called *Contoso* might use Azure Virtual Desktop to sell remote access of Contoso's productivity app to Contoso's customers (external users). Because Contoso is serving external users for external commercial purposes, Contoso must enroll in Azure Virtual Desktop's per-user access pricing. This enables Contoso to pay for Azure Virtual Desktop access rights on behalf of those external users who connect to Contoso's deployment. The users don't need a separate license like Microsoft 365 to access Azure Virtual Desktop. Contoso still needs to create and manage identities for those external users.

> [!IMPORTANT]
> Per-user access pricing can only be used for external commercial purposes, not internal purposes. Per-user access pricing isn't a way to enable external guest user accounts with Azure Virtual Desktop. Check if your Azure Virtual Desktop solution is is applicable for per-user access pricing by reviewing [our licensing documentation](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#Documents).

## Eligible licenses to use Azure Virtual Desktop

You must provide an eligible license for each user that accesses Azure Virtual Desktop. The license you need also depends on whether you're using a Windows client operating system or a Windows Server operating system for your session hosts, and whether it's for internal or external commercial purposes. The following table shows the eligible licensing methods for each scenario:

[!INCLUDE [Operating systems and user access rights](includes/include-operating-systems-user-access-rights.md)]

### Per-user access pricing for external commercial purposes to use Azure Virtual Desktop

Per-user access pricing lets you pay for Azure Virtual Desktop access rights for external commercial purposes. You must enroll in per-user access pricing to build a compliant deployment for external users.

You pay for per-user access pricing through your enrolled Azure subscription or subscriptions on top of your charges for virtual machines, storage, and other Azure services. Each billing cycle, you only pay for users who actually used the service. Only users that connect at least once in that month to Azure Virtual Desktop incur an access charge.

There are two price tiers for Azure Virtual Desktop per-user access pricing. Charges are determined automatically each billing cycle based on the type of [application groups](terminology.md#application-groups) a user connected to. Each price tier has flat per-user access charges. For example, a user incurs the same charge to your subscription no matter when or how many hours they used the service during that billing cycle. If a user doesn't access a RemoteApp or desktop, then there's no charge.

| Price tier | Description |
|--|--|
| *Apps* | A flat price is charged for each user who accesses at least one published RemoteApp, but doesn't access a published full desktop. |
| *Desktops + apps* | A flat price is charged for each user who accesses at least one published full desktop. The user can also access published applications. |

For more information about prices, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

> [!IMPORTANT]
> Azure Virtual Desktop will also charge users with separate assigned licenses that otherwise entitle them to Azure Virtual Desktop access. If you have internal users you're purchasing eligible licenses for, we recommend you give them access to Azure Virtual Desktop through a separate subscription that isn't enrolled in per-user access pricing to avoid effectively paying twice for those users.

Azure Virtual Desktop issues at most one access charge for a given user in a given billing period. For example, if you grant the user Alice access to Azure Virtual Desktop resources across two different Azure subscriptions in the same tenant, only the first subscription accessed by Alice incurs a usage charge.

To learn how to enroll an Azure subscription for per-user access pricing, see [Enroll in per-user access pricing](enroll-per-user-access-pricing.md).

### Licensing other products and services for use with Azure Virtual Desktop

The Azure Virtual Desktop per-user access license isn't a full replacement for a Windows or Microsoft 365 license. Per-user licenses only grant access rights to Azure Virtual Desktop and don't include Microsoft Office, Microsoft Defender XDR, or Universal Print. This means that if you choose a per-user license, you need to separately license other products and services to grant your users access to them in your Azure Virtual Desktop environment.

There are a few ways to enable your external users to access Office: 

- Users can sign in to Office with their own Office account.
- You can resell Office through your Cloud Service Provider (CSP). 
- You can distribute Office by using a Service Provider Licensing Agreement (SPLA).

## Comparing licensing options

Here's a summary of the two types of licenses for Azure Virtual Desktop you can choose from:

| Component | Eligible Windows, Microsoft 365, or RDS license | Per-user access pricing |
|--|--|--|
| Access rights | Internal purposes only. It doesn't grant permission for external commercial purposes, not even identities you create in your own Microsoft Entra tenant. | External commercial purposes only. It doesn't grant access to members of your own organization or contractors for internal business purposes. |
| Billing | Licensing channels. | Pay-as-you-go through an Azure meter, billed to an Azure subscription. |
| User behavior | Fixed cost per user each month regardless of user behavior. | Cost per user each month depends on user behavior. |
| Other products | Dependent on the license. | Only includes access rights to Azure Virtual Desktop and [FSlogix](/fslogix/overview-what-is-fslogix). |

## Next steps

Now that you're familiar with your licensing pricing options, you can start planning your Azure Virtual Desktop environment. Here are some articles that might help you:

- [Enroll in per-user access pricing](enroll-per-user-access-pricing.md)
- [Understand and estimate costs for Azure Virtual Desktop](understand-estimate-costs.md)
