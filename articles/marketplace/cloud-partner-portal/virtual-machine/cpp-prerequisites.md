---
title: Virtual machine prerequisites for Microsoft Azure | Azure Marketplace
description: List of prerequisites required to publish a VM offer to the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal
author: v-miclar
ms.service: marketplace
ms.topic: article
ms.date: 03/13/2019
ms.author: pabutler
---

# Virtual machine prerequisites

This article lists both the technical and business requirements that you must meet before you can publish a VM offer to the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/).  If you have not already done so, review the [Virtual Machine Offer Publishing Guide](../../marketplace-virtual-machines.md).


## Technical requirements

The technical prerequisites for publishing a virtual machine (VM) solution are straightforward:

- You must have an active Azure account. If you do not have one, you can sign up at the [Microsoft Azure site](https://azure.microsoft.com).  
- You must have an environment configured to support either Windows or Linux VM development.  For more information, see the associated VM documentation site:
    - [Linux VMs Documentation](https://docs.microsoft.com/azure/virtual-machines/linux/)
    - [Windows VMs Documentation](https://docs.microsoft.com/azure/virtual-machines/windows/)


## Business requirements

The business requirements include procedural, contractual, and legal obligations: 

<!-- TD: Aren't most of these business requirements common to all AMP offerings?  If yes, then move to higher level, perhaps to the AMP section "Become a Cloud Marketplace Publisher" -->
<!-- TD: Need references for remaining docs/business reqs!-->

- You must be a registered Cloud Marketplace Publisher.  If you are not registered yet, follow the steps in the article [Become a Cloud Marketplace Publisher](https://docs.microsoft.com/azure/marketplace/become-publisher).

    > [!NOTE]
    > You should use the same Microsoft Developer Center registration account to sign onto the [Cloud Partner Portal](https://cloudpartner.azure.com).
    > You should have only one Microsoft account for your Azure Marketplace offerings. It should not be specific to individual services or offers.
    
- Your company (or its subsidiary) must be located in a sell-from-country/region supported by the Azure Marketplace.  For a current list of these countries/regions, see [Microsoft Azure Marketplace Participation Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies/).
- Your product must be licensed in a way that is compatible with billing models supported by the Azure Marketplace.  For more information, see [Billing options in the Azure Marketplace](https://docs.microsoft.com/azure/marketplace/billing-options-azure-marketplace). 
- You are responsible for making technical support available to customers in a commercially reasonable manner. This support can be free, paid, or through community approaches.
- You are responsible for licensing your software and any third-party software dependencies.
- You must provide content that meets criteria for your offering to be listed on Azure Marketplace and in the Azure portal. <!-- TD: Meaning/links? -->
- You must agree to the terms of the [Microsoft Azure Marketplace Participation Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies/) and Publisher Agreement.
- You must comply with the [Microsoft Azure Website Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/), [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement), and [Microsoft Azure Certified Program Agreement](https://azure.microsoft.com/support/legal/marketplace/certified-program-agreement/).


## Next steps

After you have met these prerequisites, you can [create your VM offer](./cpp-create-offer.md).
