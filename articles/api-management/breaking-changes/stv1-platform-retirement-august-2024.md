---
title: Azure API Management - global Azure - stv1 platform retirement (August 2024)
description: In the global Azure cloud, Azure API Management will retire stv1 compute platform effective 31 August 2024. Instances must be migrated to stv2 platform.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: reference
ms.date: 02/19/2025
ms.author: danlep
---

# API Management stv1 platform retirement - Global Azure cloud (August 2024)

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. **The infrastructure associated with the API Management `stv1` compute platform version will be retired effective 31 August 2024 in the global Microsoft Azure cloud.** A more current compute platform version (`stv2`) is already available, and provides enhanced service capabilities.

> [!NOTE]
> For API Management instances deployed in Microsoft Azure Government cloud or Microsoft Azure operated by 21Vianet cloud (Azure in China), the retirement date for the `stv1` platform is 24 February 2025. [Learn more](stv1-platform-retirement-sovereign-clouds-february-2025.md)

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints | Developer, Basic, Standard, Premium |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multitenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

**For continued support and to take advantage of upcoming features, customers must [migrate](../migrate-stv1-to-stv2.md) their Azure API Management instances from the `stv1` compute platform to the `stv2` compute platform.** The `stv2` compute platform comes with additional features and improvements such as support for Azure Private Link and other networking features. 

New instances created in service tiers other than the Consumption tier are mostly hosted on the `stv2` platform already. Existing instances on the `stv1` compute platform will continue to work normally until the retirement date, but those instances won't receive the latest features available to the `stv2` platform. Support for `stv1` instances will be retired by 31 August 2024.  

## Is my service affected by this?

If the value of the `platformVersion` property of your service is `stv1`, it's hosted on the `stv1` platform. See [How do I know which platform hosts my API Management instance?](../compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance)

## What is the deadline for the change?

Support for API Management instances hosted on the `stv1` platform will be retired by 31 August 2024.

## What do I need to do?

**Migrate all your existing instances hosted on the `stv1` compute platform to the `stv2` compute platform.**  

If you have existing instances hosted on the `stv1` platform, follow our **[migration guide](../migrate-stv1-to-stv2.md)** to ensure a successful migration. 

## What happens after 31 August 2024?

**Your `stv1` instance will not be shut down, deactivated, or deleted.** However, the SLA commitment for the instance ends, and any `stv1` instance after the retirement date will be scheduled for automatic migration to the `stv2` platform.

### End of SLA commitment for `stv1` instances

As of 1 September 2024, API Management will no longer provide any service level guarantees, and by extension service credits, for performance or availability issues related to the Developer, Basic, Standard, and Premium service instances running on the `stv1` compute platform. Also, no new security and compliance investments will be made in the API Management `stv1` platform. 

Through continued use of an instance hosted on the `stv1` platform beyond the retirement date, you acknowledge that Azure does not commit to the SLA of 99.95% for the retired instances.

[!INCLUDE [api-management-automatic-migration](../../../includes/api-management-automatic-migration.md)]


[!INCLUDE [api-management-migration-support](../../../includes/api-management-migration-support.md)]

> [!NOTE]
> Azure support can't extend the timeline for automatic migration or for SLA support of `stv1` instances after the retirement date.

## Related content

* [Migrate from stv1 platform to stv2](../migrate-stv1-to-stv2.md)
* See all [upcoming breaking changes and feature retirements](overview.md).
