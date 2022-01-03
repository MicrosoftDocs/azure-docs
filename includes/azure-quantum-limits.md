---
title: "Include file"
description: "Include file"
author: danielstocker
ms.service: azure-quantum
ms.topic: "include"
ms.date: 10/27/2021
ms.author: dasto
---

### Provider Limits & Quota

The Azure Quantum Service supports both first and third-party service providers. 
Third-party providers own their limits and quotas. Users can view offers and limits in the Azure portal when configuring third-party providers. 

You can find the published quota limits for Microsoft's first party Optimization Solutions provider below. 

#### Learn & Develop SKU

| Resource | Limit |
| --- | --- |
| CPU-based concurrent jobs | up to 5<sup>1</sup> concurrent jobs |
| FPGA-based concurrent jobs | up to 2<sup>1</sup> concurrent jobs |
| CPU-based solver hours | 20 hours per month  |
| FPGA-based solver hours | 1 hour per month  |

While on the Learn & Develop SKU, you **cannot** request an increase on your quota limits. Instead you should switch to the Performance at Scale SKU.

#### Performance at Scale SKU

| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| CPU-based concurrent jobs | up to 100<sup>1</sup> concurrent jobs | same as default limit |
| FPGA-based concurrent jobs | up to 10<sup>1</sup> concurrent jobs | same as default limit |
| Solver hours | 1,000 hours per month  | up to 50,000 hours per month |

Reach out to Azure Support to request a limit increase.

For more information, please review the [Azure Quantum pricing page](https://aka.ms/AQ/Pricing).
Review the relevant provider pricing pages in the Azure portal for details on third-party offerings.

<sup>1</sup> Describes the number of jobs that can be queued at the same time.
