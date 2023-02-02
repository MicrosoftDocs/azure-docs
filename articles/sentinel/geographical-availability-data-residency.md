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

When you set up Microsoft Sentinel or prepare for compliance checks, you need the ability to validate and prove who has access to what data in your environment. In this article, you learn where Microsoft Sentinel data is stored so you can meet compliance requirements.

## Why geographical availability and data residency is important

After your data is collected, stored, and processed, compliance can become an important design requirement, with a significant impact on your Microsoft Sentinel architecture. Having the ability to validate and prove who has access to what data under all conditions is a critical data sovereignty requirement in many countries and regions, and assessing risks and getting insights in Microsoft Sentinel workflows is a priority for many customers.

Learn more about [compliance considerations](best-practices-workspace-architecture.md#compliance-considerations).

## Where Microsoft Sentinel data is stored

Microsoft Sentinel is a [non-regional service](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview). However, Microsoft Sentinel is built on top of Azure Monitor Logs, which is a regional service. Note that:

- Sentinel can run on workspaces in most [regions where Log Analytics is generally available](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=monitor).
- Regions where Log Analytics is newly available may take some time to onboard the Microsoft Sentinel service.
- Microsoft Sentinel stores customer data in the same geography as the Log Analytics workspace associated with Microsoft Sentinel.
- Microsoft Sentinel processes customer data in one of two locations:
    - If the Log Analytics workspace is located in Europe, customer data is processed in Europe.
    - For all other locations, customer data is processed in the US