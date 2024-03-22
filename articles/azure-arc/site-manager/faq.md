---
title: Frequently Asked Questions
description: "FAQ"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: faq #Don't change
ms.date: 02/16/2024

#customer intent: As a customer, I want answers to questions so that I can answer my own questions.

---


# Frequently Asked Questions

Below are frequently asked questions and answers for Azure Arc site manager

*Question:* I have resources in the resource group which are not yet supported by site manager. Do I need to move them?

*Answer:* Site manager will only provide health status aggregation for the supported resource types. Resources of other types will simply not be managed by site manager. They will continue to function normally as they would without otherwise.

*Question:* Can I update a site after it has been created?

*Answer:* Site properties and details cannot be updated. This may be available in future versions of the feature.

*Question:* Does site manager have a subscription or fee for usage?

*Answer:* Site manager does not have any fee. However, the Azure services that it integrates with may have a fee.

*Question:* What regions are currently supported by site manager?

*Answer:* Site manager currently supports resources in Azure Global.

