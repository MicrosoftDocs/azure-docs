---
title: Licensing per-user access pricing Azure Virtual Desktop for remote app streaming - Azure
description: An overview of Azure Virtual Desktop licensing considerations for remote app streaming.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---
# Understanding licensing and per-user access pricing

This article explains the licensing requirements for using Azure Virtual Desktop to stream remote applications to external users. In this article, you'll learn how licensing Azure Virtual Desktop for external users is different than for internal users, how per-user access pricing works in detail, and how to license other products you plan to use with Azure Virtual Desktop.

## Licensing Azure Virtual Desktop for external users

There are two different ways you can use Azure Virtual Desktop. Each way has different licensing requirements:

- For streaming RemoteApps and desktops to internal users. For example, the manufacturing company Fabrikam, Inc. might use Azure Virtual Desktop to provide Fabrikam's employees with access to virtual workstations and line-of-business apps. In this case, Fabrikam must purchase one of the eligible licenses listed in [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for each of their employees that will access Azure Virtual Desktop.

- For streaming RemoteApps and desktops to external users. For example, a software vendor called Contoso might use Azure Virtual Desktop to serve remote streams of Contoso’s productivity app to Contoso’s customers (users who aren't Contoso employees). In this case, Contoso must enroll in Azure Virtual Desktop’s per-user access pricing. This license type lets Contoso pay for Azure Virtual Desktop access rights on behalf of those users through an Azure meter based on the number of users who access Azure Virtual Desktop each month. The users in the deployment don't need a separate license like Microsoft 365 to access Azure Virtual Desktop.

## Per-user access pricing for Azure Virtual Desktop

Per-user access pricing lets you pay for Azure Virtual Desktop access rights on behalf of external users. You must enroll in per-user access pricing to build a compliant deployment for external users. To learn more, see [Enroll in per-user access pricing](per-user-access-pricing.md).

You pay for per-user access pricing through your enrolled Azure subscription or subscriptions on top of your charges for virtual machines, storage, and other Azure services. Each billing cycle, you only pay for users who actually used the service. Only users that connect at least once to Azure Virtual Desktop that month incur an access charge.

There are two price tiers for Azure Virtual Desktop per-user access pricing. Charges are determined automatically each billing cycle based on the type of [application groups](../environment-setup.md#app-groups) a user connected to.

- The first price tier is called "Apps." This flat price is charged for each user who accesses at least one RemoteApp application group and zero Desktop application groups.
- The second tier is "Apps + Desktops." This flat price is charged for each user who accesses at least one Desktop application group.
- If a user doesn't access any application groups, then there's no charge.

For more information about prices, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

Each price tier has flat per-user access charges. For example, a user incurs the same charge to your subscription no matter when or how many hours they used the service during that billing cycle.

Azure Virtual Desktop will also charge users with separate assigned licenses that otherwise entitle them to Azure Virtual Desktop access. If you have internal users you're purchasing eligible licenses for, we recommend you give them access to Azure Virtual Desktop through a separate subscription that isn't enrolled in per-user access pricing to avoid effectively paying twice for those users.

Azure Virtual Desktop will issue at most one access charge for a given user in a given billing period. So if your deployment grants user Alice access to Azure Virtual Desktop resources across two different Azure subscriptions in the same tenant, only the first subscription accessed by Alice will incur a usage charge.

## Comparing licensing options

As mentioned in [Per-user access pricing for Azure Virtual Desktop](#per-user-access-pricing-for-azure-virtual-desktop), there are two types of licenses for Azure Virtual Desktop you can choose from:

- A Windows or Microsoft 365 license:
   - Grants Azure Virtual Desktop access rights for internal users only.
   - Paid in advance through a subscription.
   - Same cost per user each month regardless of user behavior
   - Includes entitlements to some other Microsoft products and services

- Per-user access pricing:
   - Grants Azure Virtual Desktop access rights for external users only
   - Pay-as-you-go through an Azure meter
   - Dynamic cost per user each month based on user behavior
   - Only includes access rights to Azure Virtual Desktop

## Licensing other products and services for use with Azure Virtual Desktop

The Azure Virtual Desktop per-user access license isn't a full replacement for a Windows or Microsoft 365 license. Per-user licenses only grant access rights to Azure Virtual Desktop and don't include Microsoft Office, Microsoft Defender, or Universal Print. This means that if you choose a per-user license, you'll need to separately license other products and services to grant your users access to them in your Azure Virtual Desktop environment.

## Next steps

Now that you're familiar with your licensing pricing options, you can start planning your Azure Virtual Desktop environment. Here are some articles that might help you:

- [Enroll your subscription in per-user access pricing](per-user-access-pricing.md)
- [Estimate per-user app streaming costs for Azure Virtual Desktop](streaming-costs.md)
- If you feel ready to start setting up your first deployment, get started with our [Tutorials](../create-host-pools-azure-marketplace.md?toc=/azure/virtual-desktop/remote-app-streaming/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json).
