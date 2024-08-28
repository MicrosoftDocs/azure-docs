---
title: Azure API Management - stv1 platform retirement - Azure Government, Azure in China (February 2025)
description: In Azure Government and Azure operated by 21Vianet, API Management will retire stv1 platform effective 28 February 2025. Instances must be migrated to stv2 platform.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: reference
ms.date: 08/09/2024
ms.author: danlep
---

# API Management stv1 platform retirement - Azure Government and Azure operated by 21Vianet  (February 2025)

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. **The infrastructure associated with the API Management `stv1` compute platform version will be retired effective 28 February 2025 in Microsoft Azure Government and in Microsoft Azure operated by 21 Vianet (Azure in China).** A more current compute platform version (`stv2`) is already available, and provides enhanced service capabilities.

> [!NOTE]
> For API Management instances deployed in global Microsoft Azure, the retirement date for the `stv1` platform is 31 August 2024. [Learn more](stv1-platform-retirement-august-2024.md)

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints | Developer, Basic, Standard, Premium |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multi-tenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

**For continued support and to take advantage of upcoming features, customers must [migrate](../migrate-stv1-to-stv2.md) their Azure API Management instances from the `stv1` compute platform to the `stv2` compute platform.** The `stv2` compute platform comes with additional features and improvements such as support for Azure Private Link and other networking features. 

New instances created in service tiers other than the Consumption tier are mostly hosted on the `stv2` platform already. Existing instances on the `stv1` compute platform will continue to work normally until the retirement date, but those instances won’t receive the latest features available to the `stv2` platform.   

## Is my service affected by this?

If the value of the `platformVersion` property of your service is `stv1`, it's hosted on the `stv1` platform. See [How do I know which platform hosts my API Management instance?](../compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance)

## What is the deadline for the change?

In Azure Government and Azure operated by 21Vianet, support for API Management instances hosted on the `stv1` platform will be retired by 28 February 2025.

## What do I need to do?

**Migrate all your existing instances hosted on the `stv1` compute platform to the `stv2` compute platform by 28 February 2025.**  

If you have existing instances hosted on the `stv1` platform, follow our **[migration guide](../migrate-stv1-to-stv2.md)** to ensure a successful migration. 

[!INCLUDE [api-management-migration-support](../../../includes/api-management-migration-support.md)]


## Related content

* [Migrate from stv1 platform to stv2](../migrate-stv1-to-stv2.md)
* See all [upcoming breaking changes and feature retirements](overview.md).
