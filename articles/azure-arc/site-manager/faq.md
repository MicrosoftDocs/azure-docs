---
title: Frequently asked questions
description: "Frequently asked questions to understand and troubleshoot Azure Arc sites and site manager"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: faq #Don't change
ms.date: 02/16/2024

#customer intent: As a customer, I want answers to questions so that I can answer my own questions.

---

# Frequently asked questions: Azure Arc site manager

The following are frequently asked questions and answers for Azure Arc site manager:

*Question:* I have resources in the resource group, which aren't yet supported by site manager. Do I need to move them?

*Answer:* Site manager provides health status aggregation for only the supported resource types. Resources of other types won't be managed via site manager. They'll continue to function normally as they would without otherwise.

*Question:* Can I update a site after it has been created?

*Answer:* Site properties and details can't be updated.

*Question:* Does site manager have a subscription or fee for usage?

*Answer:* Site manager doesn't have any fee. However, the Azure services that it integrates with might have a fee.

*Question:* What regions are currently supported via site manager?

*Answer:* Site manager currently supports resources in Azure Global.

