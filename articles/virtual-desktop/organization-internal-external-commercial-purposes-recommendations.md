---
title: Recommendations for deploying Azure Virtual Desktop for internal or external commercial purposes
description: Learn about recommendations for deploying Azure Virtual Desktop for internal or external commercial purposes, such as for your organization's workers, or using delivering software-as-a-service applications.
ms.topic: conceptual
author: Heidilohr
ms.author: helohr
ms.date: 07/14/2021
---

# Recommendations for deploying Azure Virtual Desktop for internal or external commercial purposes

You can deploy Azure Virtual Desktop to be tailored to your requirements, depending on many factors like end-users, the existing infrastructure of the organization deploying the service, and so on. How do you make sure you meet your organization's needs?

This article provides guidance for your Azure Virtual Desktop deployment structure. The examples listed in this article aren't the only possible ways you can deploy Azure Virtual Desktop. However, we do cover two of the most basic types of deployments for internal or external commercial purposes.

## Deploying Azure Virtual Desktop for internal purposes

If you're making an Azure Virtual Desktop deployment for users inside your organization, you can host all your users and resources in the same Azure tenant. You can also use Azure Virtual Desktop's currently supported identity management methods to keep your users secure.

These components are the most basic requirements for an Azure Virtual Desktop deployment that can serve desktops and applications to users within your organization:

- One host pool to host user sessions
- One Azure subscription to host the host pool
- One Azure tenant to be the owning tenant for the subscription and identity management

However, you can also deploy Azure Virtual Desktop with multiple host pools that offer different applications to different groups of users.

Some customers choose to create separate Azure subscriptions to store each Azure Virtual Desktop deployment in. This practice lets you distinguish the cost of each deployment from each other based on the sub-organizations they provide resources to. Others choose to use Azure billing scopes to distinguish costs at a more granular level. To learn more, see [Understand and work with scopes](../cost-management-billing/costs/understand-work-scopes.md).

Licensing Azure Virtual Desktop works differently for internal and external commercial purposes. If you're providing Azure Virtual Desktop access for internal commercial purposes, you must purchase an eligible license for each user that accesses Azure Virtual Desktop. You can't use per-user access pricing for internal commercial purposes. To learn more about the different licensing options, see [License Azure Virtual Desktop](licensing.md).

## Deploying Azure Virtual Desktop for external purposes

If your Azure Virtual Desktop deployment serves end-users outside your organization, especially users that don't typically use Windows or don't have access to your organization's internal resources, you need to consider extra security recommendations.

Azure Virtual Desktop doesn't currently support external identities, including business-to-business (B2B) or business-to-client (B2C) users. You need to create and manage these identities manually and provide the credentials to your users yourself. Users then use these identities to access resources in Azure Virtual Desktop.

To provide a secure solution to your customers, Microsoft strongly recommends creating a Microsoft Entra tenant and subscription for each customer with their own dedicated Active Directory. This separation means you have to create a separate Azure Virtual Desktop deployment for each organization that's isolated from the other deployments and their resources. The virtual machines that each organization uses shouldn't be able to access the resources of other companies to keep information secure. You can set up these separate deployments by using either a combination of Active Directory Domain Services (AD DS) and Microsoft Entra Connect or by using Microsoft Entra Domain Services.

If you're providing Azure Virtual Desktop access for external commercial purposes, per-user access pricing lets you pay for Azure Virtual Desktop access rights on behalf of external users. You must enroll in per-user access pricing to build a compliant deployment for external users. You pay for per-user access pricing through an Azure subscription. To learn more about the different licensing options, see [License Azure Virtual Desktop](licensing.md).

## Next steps

- To learn more about licensing Azure Virtual Desktop, see [License Azure Virtual Desktop](licensing.md).
- Learn how to [Enroll in per-user access pricing](enroll-per-user-access-pricing.md).
- [Understand and estimate costs for Azure Virtual Desktop](understand-estimate-costs.md).
