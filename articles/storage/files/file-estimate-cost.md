---
title: How to Estimate the Cost of Azure Files
description: Learn how to estimate the cost of Azure Files usage across different billing models.
ms.date: 08/14/2025
ms.custom: horz-monitor
ms.topic: concept-article
author: khdownie
ms.author: kendownie
ms.service: azure-file-storage
---

# Estimate the cost of Azure Files

In this article, you learn how to estimate the cost difference between the Provisioned v1 and Provisioned v2 SSD billing models for Azure Files in three scenarios.

> [!IMPORTANT]
> **These prices are meant only as examples and shouldn't be used to calculate your costs**. For official prices, see the [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/). For more information about how to choose the correct billing model, see [Understand Azure Files billing](understanding-billing.md). We also encourage you to use [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator/) to perform the actual calculations.
> For the following examples, we use pricing based on East US and LRS redundancy support. The Provisioned v1 billing model is billed hourly in a monthly rate, where provisioned storage costs $0.16 per GiB. Provisioned v2 is billed hourly in an hourly rate. Provisioned storage costs $0.000137 per GiB per hour, provisioned IOPS costs $0.000037 per IOPS per hour, and provisioned throughput costs $0.000054 per MiB per sec per hour. For the ease of calculations, we assume all months have 730 hours. To calculate the exact price, replace the hours with 24 × days in the specific month.

### Comparison using default IOPS and throughput

For this scenario, we are using the recommended IOPS and throughput based on our capacity request:

- 10,240 GiB in capacity
- 13,240 IOPS
- 1,125 MiB/sec throughput

|         Cost        |           Provisioned v1 SSD            |                             Provisioned v2 SSD                             |
| --------------- | :-------------------------------------: | :------------------------------------------------------------------------: |
| Cost components | 10,240 used GiB × $0.16/GiB = $1,638.40 |    Provisioned storage: 10,240 GiB × $0.000137 /GiB × 730hr = $1024.10     |
|                 |                                         |   Provisioned IOPS: (13,240 – 3,000) × $0.000037/IOPS × 730hr = $276.58    |
|                 |                                         | Provisioned throughput: (1,125 – 100) × $0.000054/MiB/sec × 730hr = $40.41 |
| Total cost      |             $1,638.40/month             |                              $1,341.09/month                               |

100 – ($1,341.09 / $1,638.40 × 100) = 18.15%

With the exact same provisioning size, IOPS, and throughput, using the Provisioned v2 billing model saves around 18% monthly on the total cost of ownership for the file share.

### Comparison of relational database workload

Assume we're making a price comparison in the following relational database workload deployment.

- 4,096 GiB in capacity
- 20,000 IOPS
- 1,536 MiB/sec throughput  
  If we're using the provisioned v1 billing model, we need to reverse calculate on the IOPS and throughput to see how much we need to provision the capacity to meet our exact requirements.
- To meet IOPS requirements, we'll need 20,000-3,000=17,000 GiB
- To meet throughput requirements, we'll need (1536-100)/ (0.04+0.06) = 14,360 GiB

To meet both requirements, in Provisioned v1, we need to provision 17,000 GiB to meet all three criteria.

|          Cost       |           Provisioned v1 SSD           |                             Provisioned v2 SSD                             |
| --------------- | :------------------------------------: | :------------------------------------------------------------------------: |
| Cost components | 17,000 used GiB × $0.16/GiB = $2720.00 |     Provisioned storage: 4,096 GiB × $0.000137 /GiB × 730hr = $409.64      |
|                 |                                        |   Provisioned IOPS: (20,000 – 3,000) × $0.000037/IOPS × 730hr = $ 459.17   |
|                 |                                        | Provisioned throughput: (1,536 – 100) × $0.000054/MiB/sec × 730hr = $56.61 |
| Total cost      |             $2720.00/month             |                               $925.42 /month                               |

100 – ($925.42 / $2720.00 × 100) = 65.98%

For this workload experience, Provisioned v2 SSD offers a 66% discount compared to the provisioned v1 billing model.

### Comparison of a hot archive for multimedia workload

Assume we're making a price comparison in the following hot archive for multimedia workload deployment.

- 102,400 GiB in capacity
- 15,000 IOPS
- 2048 MiB/sec throughput

For this scenario, if we're using the provisioned v1 billing model, we must follow the provisioned storage requirements and over-provision our IOPS and throughput. Here are the reverse calculations on the IOPS and throughput to see how much we are over-provisioned.

- IOPS limit will be 102,400 + 3,000 = 105,400 IOPS
- Throughput limit will be 102,400\*0.1+100=10,340 MiB / sec

|     Cost            |            Provisioned v1 SSD             |                             Provisioned v2 SSD                             |
| --------------- | :---------------------------------------: | :------------------------------------------------------------------------: |
| Cost components | 102,400 used GiB × $0.16/GiB = $16,384.00 |   Provisioned storage: 102,400 GiB × $0.000137 /GiB × 730hr = $10241.02    |
|                 |                                           |   Provisioned IOPS: (15,000 – 3,000) × $0.000037/IOPS × 730hr = $ 324.12   |
|                 |                                           | Provisioned throughput: (2,048 – 100) × $0.000054/MiB/sec × 730hr = $76.79 |
| Total cost      |             $16,384.00/month              |                              $10641.93/month                               |

100 – ($10641.93/ $16384.00 × 100) = 35.05%

For this workload, Provisioned v2 SSD provides a 35% discount compared to the Provisioned v1 billing model.
