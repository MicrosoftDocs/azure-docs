---
title: Understanding Azure Virtual Desktop per-user access pricing for RemoteApp streaming - Azure
description: An overview of Azure Virtual Desktop licensing considerations for RemoteApp streaming.
services: virtual-desktop
author: Heidilohr
ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 12/01/2022
ms.author: helohr
manager: femila
---
# Understanding licensing and per-user access pricing

This article explains the licensing requirements for using Azure Virtual Desktop to stream applications remotely to external users. In this article, you'll learn how licensing Azure Virtual Desktop for external commercial purposes is different than for internal purposes, how per-user access pricing works in detail, and how to license other products you plan to use with Azure Virtual Desktop.

## Internal and external purposes

In the context of providing virtualized infrastructure with Azure Virtual Desktop, *internal users* refers to people who are members of your own organization, such as employees of a business or students of a school. *External users* aren't members of your organization, such as customers of a business.

>[!NOTE]
>Take care not to confuse external *users* with external *identities*. Azure Virtual Desktop doesn't currently support external identities, including guest accounts or business-to-business (B2B) identities. Whether you're serving internal users or external users with Azure Virtual Desktop, you'll need to create and manage identities for those users yourself. Per-user access pricing is not a way to enable guest user accounts with Azure Virtual Desktop. For more information, see [Architecture recommendations](architecture-recs.md).

Licensing Azure Virtual Desktop works differently for internal and external commercial purposes. Consider the following examples:

- A manufacturing company called Fabrikam, Inc. might use Azure Virtual Desktop to provide Fabrikam's employees (internal users) with access to virtual workstations and line-of-business apps. Because Fabrikam is serving internal users, Fabrikam must purchase one of the eligible licenses listed in [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for each of their employees that will access Azure Virtual Desktop.
  
- A retail company called Wingtip Toys might use Azure Virtual Desktop to provide an external contractor company (external users) with access to line-of-business apps. Because these external users are serving internal purposes, Wingtip Tops  must purchase one of the eligible licenses listed in [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for each of their contractors that will access Azure Virtual Desktop. Per-user access pricing is not applicable in this scenario. 

- A software vendor called Contoso might use Azure Virtual Desktop to sell remote streams of Contoso’s productivity app to Contoso’s customers (external users). Because Contoso is serving external users for external commercial purposes, Contoso must enroll in Azure Virtual Desktop’s per-user access pricing. This enables Contoso to pay for Azure Virtual Desktop access rights on behalf of those external users who connect to Contoso's deployment. The users don't need a separate license like Microsoft 365 to access Azure Virtual Desktop. Contoso still needs to create and manage identities for those external users.

> [!IMPORTANT]
> Per-user access pricing can only be used for external commercial purposes, not internal purposes. Check if your Azure Virtual Desktop solution is compatible with per-user access pricing by reviewing [our licensing documentation](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#Documents).

## Per-user access pricing for Azure Virtual Desktop

Per-user access pricing lets you pay for Azure Virtual Desktop access rights on behalf of external users. You must enroll in per-user access pricing to build a compliant deployment for external users. To learn more, see [Enroll in per-user access pricing](per-user-access-pricing.md).

You pay for per-user access pricing through your enrolled Azure subscription or subscriptions on top of your charges for virtual machines, storage, and other Azure services. Each billing cycle, you only pay for users who actually used the service. Only users that connect at least once to Azure Virtual Desktop that month incur an access charge.

There are two price tiers for Azure Virtual Desktop per-user access pricing. Charges are determined automatically each billing cycle based on the type of [application groups](../environment-setup.md#app-groups) a user connected to.

- The first price tier is called "Apps." This flat price is charged for each user who accesses at least one RemoteApp application group and zero Desktop application groups.
- The second tier is "Apps + Desktops." This flat price is charged for each user who accesses at least one Desktop application group.
- If a user doesn't access any application groups, then there's no charge.

For more information about prices, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

Each price tier has flat per-user access charges. For example, a user incurs the same charge to your subscription no matter when or how many hours they used the service during that billing cycle.

> [!IMPORTANT]
> Azure Virtual Desktop will also charge users with separate assigned licenses that otherwise entitle them to Azure Virtual Desktop access. If you have internal users you're purchasing eligible licenses for, we recommend you give them access to Azure Virtual Desktop through a separate subscription that isn't enrolled in per-user access pricing to avoid effectively paying twice for those users.

Azure Virtual Desktop will issue at most one access charge for a given user in a given billing period. For example, if your deployment grants user Alice access to Azure Virtual Desktop resources across two different Azure subscriptions in the same tenant, only the first subscription accessed by Alice will incur a usage charge.

## Comparing licensing options

Here's a summary of the two types of licenses for Azure Virtual Desktop you can choose from:

- An eligible Windows or Microsoft 365 license:
  - Grants Azure Virtual Desktop access rights for *internal purposes* only. It doesn't grant permission for external commercial purposes, not even identities you create in your own Microsoft Entra tenant.
  - Paid in advance through a subscription
  - Same cost per user each month regardless of user behavior
  - Includes entitlements to some other Microsoft products and services

- Per-user access pricing:
  - Grants Azure Virtual Desktop access rights for *external commercial purposes* only. It doesn't grant access to members of your own organization or contractors for internal business purposes.
  - Pay-as-you-go through an Azure meter
  - Cost per user each month depends on user behavior
  - Only includes access rights to Azure Virtual Desktop
  - Includes use rights to leverage [FSlogix](/fslogix/overview-what-is-fslogix)

> [!IMPORTANT]
> Per-user access pricing only supports Windows Enterprise and Windows Enterprise multi-session client operating systems for session hosts. Windows Server session hosts are not supported with per-user access pricing.

## Licensing other products and services for use with Azure Virtual Desktop

The Azure Virtual Desktop per-user access license isn't a full replacement for a Windows or Microsoft 365 license. Per-user licenses only grant access rights to Azure Virtual Desktop and don't include Microsoft Office, Microsoft Defender XDR, or Universal Print. This means that if you choose a per-user license, you'll need to separately license other products and services to grant your users access to them in your Azure Virtual Desktop environment.

There are a few ways to enable your external users to access Office: 

- Users can sign in to Office with their own Office account.
- You can re-sell Office through your Cloud Service Provider (CSP). 
- You can distribute Office by using a Service Provider Licensing Agreement (SPLA).

## Next steps

Now that you're familiar with your licensing pricing options, you can start planning your Azure Virtual Desktop environment. Here are some articles that might help you:

- [Enroll your subscription in per-user access pricing](per-user-access-pricing.md)
- [Estimate per-user app streaming costs for Azure Virtual Desktop](streaming-costs.md)
- If you feel ready to start setting up your first deployment, get started with our [Tutorials](../create-host-pools-azure-marketplace.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json).
