---
title: Troubleshoot Azure savings plan utilization
titleSuffix: Microsoft Cost Management
description: This article helps you understand why Azure savings plans can temporarily have utilization greater than 100% in usage reporting UIs and APIs.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: troubleshooting
ms.date: 10/14/2022
ms.author: banders
---

# Troubleshoot Azure savings plan utilization

This article helps you understand why Azure savings plans can temporarily have high utilization.

## Why is my savings plan utilization greater than 100%?

Azure savings plans can temporarily have utilization greater than 100%, as shown in the Azure portal and from APIs.

Azure saving plan benefits are flexible and cover usage across various products and regions. Under an Azure savings plan, Azure applies plan benefits to your usage that has the largest percentage discount off its pay-as-you-go rate first, until we reach your hourly commitment.

The Azure usage and billing systems determine your hourly cost by examining your usage for each hour. Usage is reported to the Azure billing systems. It's sent by all services that you used for the previous hour. However, usage isn't always sent instantly, which makes it difficult to determine which resources should receive the benefit. To compensate, Azure temporarily applies the maximum benefit to all usage received. Azure then does extra processing to quickly reconcile utilization to 100%.

Periods of such high utilization are most likely to occur immediately after a usage hour.

## Next steps

- Learn more about [Azure saving plans](index.yml).
