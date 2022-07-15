---
title: Default setting for OS Disk Size
titleSuffix: Azure Kubernetes Service
description: Learn about default setting behavior change for OS Disk Size
services: container-service
ms.date: 07/15/2022

---
# Default setting for OS Disk Size

This article details the default OS Disk setting for creating new AKS Clusters.

## SKU vs. OS Disk Size

For the selected VM SKU for new AKS Clusters, the system will set the default OS Disk Size according to the vCPUs of the SKU, following the table below:

|VM SKU Cores (vCPUs)| Default OS Disk Tier | Provisioned IOPS | Provisioned Throughput (Mpbs) |
|--|--|--|--|
| 1~7 | P10/128G | 500 | 100 |
| 8~15 | P15/256G | 1100 | 125 |
| 16~63 | P20/512G | 2300 | 150 |
| 64+ | P30/1024G | 5000 | 200 |

## Conditions

The default OS Disk setting change applies only when all following conditions are met:
1. OS Disk Size is not specified at creation.
2. Ephemeral OS not supported.
3. New AKS nodes/clusters are created.

## Cost impact

There will be cost impact if all conditions above are met. Customers will potentially be assigned with larger OS Disk Size than the previous default setting. However, customers can manually downgrade the OS Disk Size via Azure Cli if they wish to use smaller OS Disk Size.
