---
title: Geographical availability and data residency in Microsoft Sentinel
description: In this article, you learn about geographical availability and data residency in Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 11/22/2022
#Customer intent: As a security operator setting up Microsoft Sentinel, I want to understand where data is stored, so I can meet compliance guidelines.
---

# Geographical availability and data residency in Microsoft Sentinel

When you set up Microsoft Sentinel or prepare for compliance checks, you might need to know where Microsoft Sentinel data is stored. In this article, you learn where Microsoft Sentinel data is stored so you can understand the system and meet compliance guidelines.

## Where Microsoft Sentinel data is stored

Microsoft Sentinel is a [non-regional service](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview). However, Microsoft Sentinel is built on top of Azure Monitor Logs, which is a regional service. Note that:

- Sentinel can run on workspaces in most [regions where Log Analytics is generally available](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=monitor).
- Regions where Log Analytics is newly available may take some time to onboard the Microsoft Sentinel service.
- Microsoft Sentinel stores customer data in the same geography as the Log Analytics workspace associated with Microsoft Sentinel.
- Microsoft Sentinel processes customer data in one of two locations:
    - If the Log Analytics workspace is located in Europe, customer data is processed in Europe.
    - For all other locations, customer data is processed in the US