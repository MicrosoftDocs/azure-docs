---
title: Publish Azure Containers image offer | Azure Marketplace
description: How to publish an Azure container offer.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: pabutler
---

# Publish container offer

 After you create a new offer using the **New Offer** page, you can publish the offer. Select **Publish** to start the publishing process.

The following diagram shows the main steps in the publishing process for an offer to "go live".

![Publishing steps for container offer](./media/offer-publishing-steps.png)

## Detailed description of publishing steps

The following table describes each publishing step. An estimated time to finish each step is also given.


|  **Publishing Step**           | **Time**    | **Description**                                                            |
|  -------------------           | --------    | ---------------                                                            |
| Validate prerequisites         | 15 min   | Offer information and offer settings are validated.                        |
| Certification                  | 1 week | Offer is analyzed by the Azure Certification Team. The offer is scanned for viruses, malware, safety compliance, and security issues. The offer is checked to see that it meets all the eligibility criteria. For more information, see [prerequisites](./cpp-prerequisites.md) and [preparing your technical assets](./cpp-create-technical-assets.md). Feedback's provided if an issue is found. |
| Packaging | 1 hour  | Offer’s technical assets are packaged for customer use and the lead systems are configured and setup. |
|  Publisher sign-off             |  -        | Final publisher review and confirmation before the offer goes live. You can deploy your offer in the selected subscriptions (in the offer information steps) to verify that it meets all your requirements.  Select **Go Live** so your offer can move to the next step. |
| Packaging                 | 1 hour | The finished offer is replicated in marketplace production systems and regions. | 
| Live                           | 4 days |Offer is released, replicated to the required regions, and made available to the public. |

Allow for up to 10 business days for the publishing process to finish and the offer is released. After you finish the publishing process, your container offer will be listed in the [Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules).

## Next steps

[Update an existing container offer on Azure Marketplace](./cpp-update-existing-offer.md)
