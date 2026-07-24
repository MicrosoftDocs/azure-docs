---
title: include file
description: include file
services: private-link
author: mbender
ms.service: azure-private-link
ms.topic: include
ms.date: 07/09/2026
ms.author: mbender-ms
ms.custom: include file
---

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Permission to create and manage a network security perimeter.
- Register the `AllowNspLink` preview feature on the `Microsoft.Network` provider. For steps, see [Register preview feature for perimeter link](#register-preview-feature-for-perimeter-link).
- Have the required permissions for your scenario:
  - Same subscription - Contributor or Owner access on the NSP resources.
  - Cross-subscription - one of the following:
    - Initiating user has **Contributor** access on the remote subscription.
    - Grant the `Microsoft.Network/networkSecurityPerimeters/linkPerimeter/action` permission on the remote NSP:
- Enable diagnostic logging on the following resources, which is required for troubleshooting and validating cross-perimeter connectivity:
  - `Network security perimeters`
  - `Network security perimeter profiles`
  - `Associated resources`
- Create two network security perimeters (a local and a remote perimeter) with at least the following configurations:
  - At least one profile each, and configure inbound and outbound access rules as required. To create a network security perimeter, see [Create a network security perimeter in the Azure portal](../../../private-link/create-network-security-perimeter-portal.md).
- Associate at least one PaaS resource with each NSP profile. For example, associate a Storage Account and Key Vault with the local profile, and a SQL Database and Storage Account with the remote profile.
- Validate successful association of the PaaS resources with the respective NSP profiles using any of the available methods (Azure portal, CLI, PowerShell, or API). 