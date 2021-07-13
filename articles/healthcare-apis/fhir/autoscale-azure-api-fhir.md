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

In this article, you'll learn about the autoscale feature for Azure API for FHIR.

## What is autoscale?

The Azure API for FHIR as a managed service allows customers to persist with FHIR compliant healthcare data and exchange it securely through the service API.

The Azure API for FHIR as a managed service allows customers to persist with FHIR compliant healthcare data and exchange it securely through the service API.

By default, the Azure API for FHIR is set to manual scale.  To enable the autoscale feature, which is not available from the Azure portal, customers can create a one-time support ticket to request it. The Microsoft support team will enable the autoscale feature based on the support priority.

When the autoscale feature is enabled, customers can run various workloads and the throughput RU/s are scaled up and down automatically within the limits, or min/max values.

* The maximum throughput values are calculated by the managed service when the autocall feature is enabled. If needed, customers can request to increase the value.

* The minimum values at any time will be 10% of the maximum specified, or 4,000 RU, or the current storage in GB * 100 RU/s, whichever is larger. When the service is idle, the throughput RU/s are maintained at the min value, and do not go down to zero.

The autoscale feature incurs costs as a result of managing the provisioned throughput units automatically. This cost increase does not apply to storage and runtime costs. For information about pricing, see [Azure API for FHIR pricing](https://azure.microsoft.com/pricing/details/azure-api-for-fhir/).

>[!div class="nextstepaction"]
>[About Azure API for FHIR](overview.md)
