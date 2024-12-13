---
title: "Limits and quotas: Azure Modeling and Simulation Workbench"
description: "Learn about limits and quotas in the Azure Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: limits-and-quotas
ms.date: 10/15/2024

#customer intent: As a user in Azure Modeling and Simulation Workbench, I want to learn about limitations and quotas in the environment.
---

# Azure Modeling and Simulation Workbench limits and quotas

The Modeling and Simulation Workbench has various quotas and limitations on deploying resources or configurations. Workbenches and chambers have overhead which might affect some of the available resource quotas. Those cases are called out in this article.

Resources, such as chambers and virtual machines, appear in your user subscription, but are deployed into a Microsoft managed environment and subscription. Quotas applied to your own subscription don't apply to Modeling and Simulation Workbench.

## Chambers

| Item                                 | Quota or limit    | Notes                                                                                                        |
|--------------------------------------|-------------------|--------------------------------------------------------------------------------------------------------------|
| Chambers per workbench               | Limit 3           |                                                                                                              |
| Users per chamber                    | No limit          |                                                                                                              |
| Supports parallel deployment?        | No                | Only one chamber can be deployed at any given time.                                                          |
| Identity and Access Management (IAM) | Users only        | Chambers don't support Azure Groups. Individual user role assignments only.                                  |
| Deployment location                  | Same as workbench | Chambers and dependent resources are deployed to the workbench's location, regardless of requested location. |

## Virtual machines

Virtual machines (VM) are limited by a different subscription quota than your customer quota. Requesting quota increases to your customer subscription doesn't affect your VM quota in Modeling and Simulation Workbench. Modeling and Simulation Workbench provides a select set of high-performance and general computing VMs. To learn about which offerings and families are available, see the [VM offerings](./concept-vm-offerings.md) guide. The following table lists the quota by family.

The table lists quota by virtual CPUs (vCPU), where each physical CPU is equivalent to two vCPUs. Consult the VM guide to determine how many vCPUs each VM has.

vCPU quotas listed are initial default. More capacity can be requested.

| Item                          | Quota or limit     | Notes                                                                                            |
|-------------------------------|--------------------|--------------------------------------------------------------------------------------------------|
| D-series                      | 156 vCPUs          | D-series are used in workbench infrastructure. Creating more chambers reduces D-series quantity. |
| E-series                      | 256 vCPUs          | Initial quota, more can be requested.                                                            |
| F-series                      | 100 vCPUs          | Initial quota, more can be requested.                                                            |
| M-series                      | 128 vCPUs          | Initial quota, more can be requested.                                                            |
| Supports parallel deployment? | Yes                | Multiple VMs can be deployed simultaneously.                                                     |
| Deployment location           | Same as workbench. |                                                                                                  |

## Storage and data pipeline

| Item                             | Quota or limit                   | Notes                                                |
|----------------------------------|----------------------------------|------------------------------------------------------|
| `datain` volume                  | 1 TB limit                       |                                                      |
| `dataout` volume                 | 1 TB limit                       |                                                      |
| File size limit on data pipeline | 100 GB limit per file            | See `datain` and and `dataout` volume limits.        |
| Chamber storage volumes          | 4 TB min, up to 20 TB per volume | Default quota can be increased with support request. |
| Shared storage volumes           | 4 TB min, up to 20 TB per volume | Default quota can be increased with support request. |

## Networking

| Item                                               | Quota or limit | Notes                                                                |
|----------------------------------------------------|----------------|----------------------------------------------------------------------|
| Connectors per chamber                             | 1              | Limit one connector per chamber.                                     |
| Number of allowlist entries (public IP connector)  | 200            | Max. limit on entries in the table. Subnets ranges can be specified. |
| Maximum subnet mask (public IP connector)          | /24            |                                                                      |

## License service

* Limit of one license file can be uploaded to each license server at a time. Subsequent uploads overwrite the current file.

## Related content

* [VM Offerings in Azure Modeling and Simulation Workbench](concept-vm-offerings.md)
* [Storage and access in Azure Modeling and Simulation Workbench](concept-storage.md)
