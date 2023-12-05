---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.topic: include
ms.date: 08/01/2023
---


## Prerequisites

The following prerequisites must be met before setting up failover groups between two instances of SQL Managed Instance enabled by Azure Arc:

- An Azure Arc data controller and an Arc enabled SQL managed instance provisioned at the primary site with `--license-type` as one of `BasePrice` or `LicenseIncluded`. 
- An Azure Arc data controller and an Arc enabled SQL managed instance provisioned at the secondary site with identical configuration as the primary in terms of:
  - CPU
  - Memory
  - Storage
  - Service tier
  - Collation
  - Other instance settings
- The instance at the secondary site requires `--license-type` as `DisasterRecovery`. This instance needs to be new, without any user objects. 

> [!NOTE]
> - It is important to specify the `--license-type` **during** the Azure Arc-enabled SQL MI creation. This will allow the DR instance to be seeded from the primary instance in the primary data center. Updating this property post deployment will not have the same effect.

## Deployment process

To set up an Azure failover group between two instances, complete the following steps:

1. Create custom resource for distributed availability group at the primary site
1. Create custom resource for distributed availability group at the secondary site
1. Copy the binary data from the mirroring certificates 
1. Set up the distributed availability group between the primary and secondary sites
 either in `sync` mode or `async` mode

The following image shows a properly configured distributed availability group:

![Diagram showing a properly configured distributed availability group.](..\media\business-continuity\distributed-availability-group.png)

## Synchronization modes

Failover groups in Azure Arc data services support two synchronization modes - `sync` and `async`. The synchronization mode directly impacts how the data is synchronized between the instances, and potentially the performance on the primary managed instance. 

If primary and secondary sites are within a few miles of each other, use `sync` mode. Otherwise use `async` mode to avoid any performance impact on the primary site.
