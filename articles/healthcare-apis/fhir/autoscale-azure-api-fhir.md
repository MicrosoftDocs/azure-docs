---
title: Autoscale for Azure API for FHIR 
description: This article describes the autoscale feature for Azure API for FHIR.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/13/2021
ms.author: zxue
---

# Autoscale for Azure API for FHIR 

The Azure API for FHIR as a managed service allows customers to persist with FHIR compliant healthcare data and exchange it securely through the service API. To accommodate different transaction workloads, customers can use manual scale or autoscale.

## What is autoscale?

By default, the Azure API for FHIR is set to manual scale. This option works well when the transaction workloads are known and consistent. Customers can adjust the throughput RU/s through the portal up to 10,000 and submit a request to increase the limit. 

With autoscale, customers can run various workloads and the throughput RU/s are scaled up and down automatically without manual adjustments.

It is important to note that the throughput RU/s are subject to the limits of the minimum/maximum values.

* The maximum throughput values are calculated by the managed service when the autoscale feature is enabled. If it is needed, customers can request to increase the maximum value.

* The minimum values at any time will be 10% of the maximum specified, or 4,000 RU, or the current storage in GB * 100 RU/s, whichever is larger. When the service is idle, the throughput RU/s are maintained at the minimum value, and not zero.

## How to enable autoscale?

To enable the autoscale feature, which is not available from the Azure portal, customers can create a one-time support ticket to request it. The Microsoft support team will enable the autoscale feature based on the support priority.

## What is the cost impact of autoscale?

The autoscale feature incurs costs as a result of managing the provisioned throughput units automatically. This cost increase does not apply to storage and runtime costs. For information about pricing, see [Azure API for FHIR pricing](https://azure.microsoft.com/pricing/details/azure-api-for-fhir/).

>[!div class="nextstepaction"]
>[About Azure API for FHIR](overview.md)
