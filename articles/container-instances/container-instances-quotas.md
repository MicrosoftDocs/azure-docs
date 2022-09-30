---
title: Service quotas and region availability
description: Quotas, limits, and region availability of the Azure Container Instances service.
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.topic: conceptual
ms.date: 06/17/2022
---
# Quotas and limits for Azure Container Instances

All Azure services include certain default limits and quotas for resources and features. This article details the default quotas and limits for Azure Container Instances.

Availability of compute, memory, and storage resources for Azure Container Instances varies by region and operating system. For details, see [Resource availability for Azure Container Instances](container-instances-region-availability.md).

Use the [List Usage](/rest/api/container-instances/location/listusage) API to review current quota usage in a region for a subscription.

## Service quotas and limits

[!INCLUDE [container-instances-limits](../../includes/container-instances-limits.md)]

## Next steps

Certain default limits and quotas can be increased. To request an increase of one or more resources that support such an increase, please submit an [Azure support request][azure-support] (select "Quota" for **Issue type**).

<!-- LINKS - External -->
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
