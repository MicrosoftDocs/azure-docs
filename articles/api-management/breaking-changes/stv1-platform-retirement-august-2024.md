---
title: Azure API Management - stv1 platform retirement (August 2024) | Microsoft Docs
description: Azure API Management will retire the stv1 compute platform effective 31 August 2024. Instances hosted on the stv1 platform must be migrated to the stv2 platform.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 10/19/2023
ms.author: danlep
---

# stv1 platform retirement (August 2024)

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. **The infrastructure associated with the API Management `stv1` compute platform version will be retired effective 31 August 2024.** A more current compute platform version (`stv2`) is already available, and provides enhanced service capabilities. 

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2`, `stv2.1` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints | Developer, Basic, Standard, Premium |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multi-tenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

For continued support and to take advantage of upcoming features, customers must migrate their Azure API Management instances from the `stv1` compute platform to the `stv2` compute platform. The `stv2` compute platform comes with additional features and improvements such as support for Azure Private Link and other networking features. 

New instances created in service tiers other than the Consumption tier are mostly hosted on the `stv2` platform already. Existing instances on the `stv1` compute platform will continue to work normally until the retirement date, but those instances won’t receive the latest features available to the `stv2` platform. Support for `stv1` instances will be retired by 31 August 2024.  

## Is my service affected by this?

If the value of the `platformVersion` property of your service is `stv1`, it's hosted on the `stv1` platform. See [How do I know which platform hosts my API Management instance?](../compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance)

## What is the deadline for the change?

Support for API Management instances hosted on the `stv1` platform will be retired by 31 August 2024.

> [!WARNING]
> * After 31 August 2024, any instance hosted on the `stv1` platform will be shut down, and the instance won't respond to API requests. 
> * Data from a shut-down instance will be backed up by Azure. The owner may trigger restoration of the instance on the `stv2` platform, but the instance will remain shut down until then.


## What do I need to do?

**Migrate all your existing instances hosted on the `stv1` compute platform to the `stv2` compute platform by 31 August 2024.**  

If you have existing instances hosted on the `stv1` platform, follow our [migration guide](../migrate-stv1-to-stv2.md) to ensure a successful migration. 

[!INCLUDE [api-management-migration-support](../../../includes/api-management-migration-support.md)]

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).