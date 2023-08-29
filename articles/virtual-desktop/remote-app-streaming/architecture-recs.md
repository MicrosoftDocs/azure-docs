---
title: Azure Virtual Desktop architecture recommendations - Azure
description: Architecture recommendations for Azure Virtual Desktop for app developers.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---

# Architecture recommendations

Azure Virtual Desktop deployments come in many different shapes and sizes depending on many factors like end-user needs, the existing infrastructure of the organization deploying the service, and so on. How do you make sure you're using the right architecture that meets your organization's needs?

This article will provide guidance for your Azure Virtual Desktop deployment structure. The examples listed in this article aren't the only possible ways you can deploy Azure Virtual Desktop. However, we do cover two of the most basic types of deployments for users inside and outside of your organization.

## Deploying Azure Virtual Desktop for users within your organization

If you're making an Azure Virtual Desktop deployment for users inside your organization, you can host all your users and resources in the same Azure tenant. You can also use Azure Virtual Desktop's currently supported identity management methods to keep your users secure.

These are the most basic requirements for an Azure Virtual Desktop deployment that can serve desktops and applications to users within your organization:

- One host pool to host user sessions
- One Azure subscription to host the host pool
- One Azure tenant to be the owning tenant for the subscription and identity management

However, you can also build a deployment with multiple host pools that offer different apps to different groups of users.

Some customers choose to create separate Azure subscriptions to store each Azure Virtual Desktop deployment in. This practice lets you distinguish the cost of each deployment from each other based on the sub-organizations they provide resources to. Others choose to use Azure billing scopes to distinguish costs at a more granular level. To learn more, see [Understand and work with scopes](../../cost-management-billing/costs/understand-work-scopes.md).

## Deploying Azure Virtual Desktop for users outside your organization

If your Azure Virtual Desktop deployment will serve end-users outside your organization, especially users that don't typically use Windows or don't have access to your organization's internal resources, you'll need to consider additional security recommendations.

Azure Virtual Desktop doesn't currently support external identities, including business-to-business (B2B) or business-to-client (B2C) users. You'll need to create and manage these identities manually and provide the credentials to your users yourself. Users will then use these identities to access resources in Azure Virtual Desktop.

To provide a secure solution to your customers, Microsoft strongly recommends creating an Azure Active Directory (Azure AD) tenant and subscription for each customer with their own dedicated Active Directory. This separation means you'll have to create a separate Azure Virtual Desktop deployment for each organization that's totally isolated from the other deployments and their resources. The virtual machines that each organization uses shouldn't be able to access the resources of other companies to keep information secure. You can set up these separate deployments by using either a combination of Active Directory Domain Services (AD DS) and Azure AD Connect or by using Azure AD Domain Services.
