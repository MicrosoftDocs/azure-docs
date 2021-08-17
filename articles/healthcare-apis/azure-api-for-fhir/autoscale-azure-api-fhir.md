---
title: Autoscale for Azure API for FHIR 
description: This article describes the autoscale feature for Azure API for FHIR.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/26/2021
ms.author: zxue
---

# Autoscale for Azure API for FHIR 

The Azure API for FHIR as a managed service allows customers to persist with FHIR compliant healthcare data and exchange it securely through the service API. To accommodate different transaction workloads, customers can use manual scale or autoscale.

## What is autoscale?

By default, the Azure API for FHIR is set to manual scale. This option works well when the transaction workloads are known and consistent. Customers can adjust the throughput `RU/s` through the portal up to 10,000 and submit a request to increase the limit. 

With autoscale, customers can run various workloads and the throughput `RU/s` are scaled up and down automatically without manual adjustments.

## How to enable autoscale?

To enable the autoscale feature, you can create a one-time support ticket to request it. The Microsoft support team will enable the autoscale feature based on the support priority.

> [!NOTE]
> The autoscale feature isn't available from the Azure portal.

## How to adjust the maximum throughput RU/s?

When autoscale is enabled, the system calculates and sets the initial `Tmax` value. The scalability is governed by the maximum throughput `RU/s` value, or `Tmax`, and runs between `0.1 *Tmax` (or 10% `Tmax`) and `Tmax RU/s`. 

You can increase the max `RU/s` or `Tmax` value and go as high as the service supports. When the service is busy, the throughput `RU/s` are scaled up to the `Tmax` value. When the service is idle, the throughput `RU/s` are scaled down to 10% `Tmax` value.
 
You can also decrease the max `RU/s` or `Tmax` value. When you lower the max `RU/s`, the minimum value you can set it to is: `MAX (4000, highest max RU/s ever provisioned / 10, current storage in GB * 400)`, rounded to the nearest 1000 `RU/s`.

* **Example 1**: You have 1-GB data and the highest provisioned `RU/s` is 10,000. The minimum value is Max (**4000**, 10,000/10, 1x400) = 4000. The first number, **4000**, is used.
* **Example 2**: You have 20-GB data and the highest provisioned `RU/s` is 100,000. The minimum value is Max (4000, **100,000/10**, 20x400) = 10,000. The second number, **100,000/10 =10,000**, is used.
* **Example 3**: You have 80-GB data and the highest provisioned RU/s is 300,000. The minimum value is Max (4000, 300,000/10, **80x400**) = 32,000. The third number, **80x400=32,000**, is used.

You can adjust the max `RU/s` or `Tmax` value through the portal if it is a valid number, and it is no greater than 10,000 `RU/s`. You can create a support ticket to request `Tmax` value larger than 10,000.

## What is the cost impact of autoscale?

The autoscale feature incurs costs because of managing the provisioned throughput units automatically. This cost increase doesn't apply to storage and runtime costs. For information about pricing, see [Azure API for FHIR pricing](https://azure.microsoft.com/pricing/details/azure-api-for-fhir/).

>[!div class="nextstepaction"]
>[About Azure API for FHIR](overview.md)
