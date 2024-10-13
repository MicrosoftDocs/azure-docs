---
title: Frequently asked questions
description: "Frequently asked questions to understand and troubleshoot Azure Arc sites and site manager"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: faq #Don't change
ms.date: 02/16/2024
ms.custom: references_regions

#customer intent: As a customer, I want answers to questions so that I can answer my own questions.

---

# Frequently asked questions: Azure Arc site manager (preview)

The following are frequently asked questions and answers for Azure Arc site manager.

**Question:** I have resources in the resource group, which aren't yet supported by site manager. Do I need to move them?

**Answer:** Site manager provides status aggregation for only the supported resource types. Resources of other types won't be managed via site manager. They continue to function normally as they would without otherwise.

**Question:** Does site manager have a subscription or fee for usage?

**Answer:** Site manager is free. However, the Azure services that integrated with sites and site manager might have a fee. Additionally, alerts used with site manager via monitor might have fees as well.

**Question:** What regions are currently supported via site manager? What regions of these supported regions aren't fully supported?

**Answer:** Site manager supports resources that exist in [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc&regions=all), with a few exceptions. For the following regions, connectivity and update status aren't supported for Arc-enabled machines or Arc-enabled Kubernetes clusters:

* Brazil South
* UAE North
* South Africa North
