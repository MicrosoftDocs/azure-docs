---
title: Azure Container Service (AKS) quotas and region availability
description: The default quotas and region availability of the Azure Container Service (AKS).
services: container-service
author: david-stanford
manager: timlt

ms.service: container-service
ms.topic: overview
ms.date: 01/16/2018
ms.author: dastanfo
---
# Quotas and region availability for Azure Container Service (AKS)

All Azure services include certain default limits and quotas for resources and features. The following sections detail the default resource limits for several Azure Container Service (AKS) resources, as well as the availability of the AKS service in Azure regions.

## Service quotas and limits

[!INCLUDE [container-service-limits](../../includes/container-service-limits.md)]

## Provisioned infrastructure

All other network, compute, and storage limitations apply to the provisioned infrastructure. See [Azure subscription and service limits](../azure-subscription-service-limits.md) for the relevant limits.

## Region availability

Azure Container Service (AKS) is available for preview in the following regions:
- East US
- West Europe
- Central US
- Canada Central
- Canada East

## Next steps

Certain default limits and quotas can be increased. To request an increase of one or more resources that support such an increase, please submit an [Azure support request][azure-support] (select "Quota" for **Issue type**).

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
