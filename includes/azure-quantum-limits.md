---
title: "include file"
description: "include file"
author: danielstocker
ms.service: azure-quantum
ms.topic: "include"
ms.date: 01/08/2021
ms.author: dasto
---

### Provider Limits & Quota

The Azure Quantum Service supports both first and third-party service providers. 
Third-party providers own their limits and quotas. Users can view offers and limits in the Azure portal when configuring third-party providers in the provider blade. 

You can find the published quota limits for Microsoft's first party Optimization Solutions provider below. 

#### Learn & Develop SKU

| Resource | Limit |
| --- | --- |
| CPU-based concurrent jobs | up to 5 concurrent jobs |
| FPGA-based concurrent jobs | up to 2 concurrent jobs |
| CPU-based solver hours | 20 hours per month  |
| FPGA-based solver hours | 1 hour per month  |

If you are using the Learn & Develop SKU, you **cannot** request an increase on your quota limits. Instead you should switch to the Performance at Scale SKU.

#### Performance at Scale SKU

| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| CPU-based concurrent jobs | up to 100 concurrent jobs | same as default limit |
| FPGA-based concurrent jobs | up to 10 concurrent jobs | same as default limit |
| Solver hours | 1,000 hours per month  | up to 50,000 hours per month |

If you need to request a limit increase, please reach out to Azure Support. 

For more information, please review the [Azure Quantum pricing page](https://aka.ms/AQ/Pricing).
For information on third-party offerings, please review the relevant provider page in the Azure portal.
