---
title: Publish Azure SaaS application offer | Azure Marketplace
description: Publishing process and steps for a SaaS application offer on the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 05/16/2019
ms.author: pbutlerm
---

# Publish a SaaS application offer

After you create a new offer by providing the information on the **New Offer** page, you can publish the offer. Select **Publish** to start the publishing process.

> [!IMPORTANT] 
> SaaS offer functionality is being migrated to the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/directory).  All new publishers must
> use Partner Center for creating new SaaS offers and managing existing offers.  Current publishers with SaaS offers are being batchwise migrated from the 
> Cloud Partner Portal to the Partner Center.  The Cloud Partner Portal will display status messages to indicate when specific existing offers have been migrated.
> For more information, see [Create a new SaaS offer](../../partner-center-portal/create-new-saas-offer.md).


The following diagram shows the high-level steps for publishing a new SaaS application offer.

![Offer publishing steps](./media/offer-publishing-steps.png)

## Detailed description of publishing steps

The following table describes each publishing step, with a time estimate (maximum) to complete each step.

|     **Step**       |     **Time**      |  **Description**  |
|  ---------------   |  ---------------  |  ---------------  |
|         Certification           |       2 weeks            |          Offer is analyzed by the Azure Certification Team. This step will perform scans for viruses, malware, safety compliance, and security issues. It will also verify that this offer meets all eligibility criteria (see [prerequisites](./cpp-prerequisites.md)). Feedback is provided if an issue is found.         |
|           Packaging         |       1 hour            |       Offer’s technical assets are packaged for customer use and the lead systems are configured and setup.            |
|        Publisher sign off            |         -          |        Final publisher review and confirmation before the offer goes live. You can deploy your offer in the selected subscriptions (in the offer information steps) to verify that it meets all your requirements. Select **Go Live** so your offer can move to the next step.           |
|        Packaging            |        1 hour           |        Finalized offer is replicated in marketplace production systems and regions.           |
|        Live            |       4 days            |         Offer is released, replicated to the required regions, and made available to the public.          |

Allow for up to 10 business days for the publishing process to finish and the offer is released. After you finish the publishing process, your SaaS offer will be listed in the [Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules).

## Next steps

[Update an existing offer](./cpp-update-existing-offer.md)
