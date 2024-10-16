---
title: "Limits and quotas: Azure Modeling and Simulation Workbench"
description: "Learn about limits and quotas in the Azure Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: limits-and-quotas
ms.date: 10/15/2024

#customer intent: As a user in Azure Modeling and Simulation Workbench, I want to learn about limitations and quotas in the environment.
---

# Azure Modeling and Simulation Workbench limits and quotas

The Modeling and Simulation Workbench has various quotas and limitations on deploying resources or configurations. Workbenches and chambers have overhead which might affect some of the available resource quotas. Those cases are called out in this article.

## About limits and quotas

The Modeling and Simulation Workbench resources appear in your user subscription, but are deployed into a Microsoft managed environment and subscription. Quotas applied to your own subscription don't apply to Modeling and Simulation Workbench.

## Chambers

| Item                                 | Quota or limit | Notes                                                                                         |
|--------------------------------------|----------------|-----------------------------------------------------------------------------------------------|
| Maximum chambers per workbench       | 3              |                                                                                               |
| Users per chamber                    | no limit       |                                                                                               |
| Supports parallel deployment?        | No             | Only one chamber can be deployed at any given time.                                           |
| Identity and Access Management (IAM) | User only      | Chambers don't support Azure Groups. Only individual user assignments are supported.  |
| Deployment location | Same as workbench | All chambers and dependent resources (VMs, connectors) are deployed to the workbench's location, regardless of requested location. |

## Virtual machines

Virtual machines (VM) are limited by a different subscription quota than your customer quota. Requesting quota increases to your customer subscription doesn't affect your VM quota in Modeling and Simulation Workbench. Modeling and Simulation Workbench provides a select set of high-performance and general computing VMs. To learn about which offerings and families are available, see the [VM offerings](./concept-vm-offerings.md) guide. The following table lists the quota by family.

The table lists quota by virtual CPUs (vCPU), where each physical CPU is equivalent to two vCPUs. Consult the VM guide to determine how many vCPUs each VM has.

| Item                          | Quota or limit     | Notes                                                                                |
|-------------------------------|--------------------|--------------------------------------------------------------------------------------|
| D-series                      | 156 vCPUs          | D-series support workbench infrastructure. Deploying more chambers reduces this limit. |
| E-series                      | 256 vCPUs          |                                                                                      |
| F-series                      | 100 vCPUs          |                                                                                      |
| M-series                      | 128 vCPUs          |                                                                                      |
| Supports parallel deployment? | Yes                |                                                                                      |
| Deployment location           | Same as workbench. |                                                                                      |

## Storage

| Item                             | Quota or limit                                       | Notes                                                                       |
|----------------------------------|------------------------------------------------------|-----------------------------------------------------------------------------|
| Home volume quota                | 200 GB                                               | For entire volume, shared across all users.                                 |
| `datain` volume                  | 1 TB                                                 |                                                                             |
| `dataout` volume                 | 1 TB                                                 |                                                                             |
| File size limit on data pipeline | 100 GB per file                                      |                                                                             |
| File name character set          | alphanumeric, period (.), hyphen (-)                 | Any other character causes a pipeline failures and file are dropped. |
| Chamber storage volumes          | 4 TB minimum, increments by 4 TB up to 20 TB maximum |                                                                             |
| Shared storage volumes           | 4 TB minimum, increments by 4 TB up to 20 TB maximum |                                                                             |

## Networking

| Item                                                       | Quota or limit | Notes                                                                                                                                                |
|------------------------------------------------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Connectors per chamber                                     | 1              | Only one connector per chamber, if multiple access methods are needed, the private network connector is recommended.                                 |
| Maximum number of allowlist entries in public IP connector | 200            | Upper limit on entries in the table. Subnets up to /24 are permitted and consecutive addresses should be combined to improve manageability. |
| Maximum subnet mask for public connector                   | /24            |                                                                                                                                                      |

## License service

* Only one license file can be uploaded to each license server at a time. Subsequent uploads overwrite the previously uploaded file.

## Related content

* [VM Offerings in Azure Modeling and Simulation Workbench](concept-vm-offerings.md)
* [Storage and access in Azure Modeling and Simulation Workbench](concept-storage.md)
