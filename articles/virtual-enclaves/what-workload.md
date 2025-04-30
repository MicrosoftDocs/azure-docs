---
title: What is a workload?
description: What is a workload?
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# What is a workload?

Workloads are logical groups of Azure resources that you define to create and audit connections in Azure Virtual Enclaves. Only community and enclave owners can view the workloads and networks that have network access to their data. Workloads aren't discoverable to external networks. Enclave Owners can deploy Azure resources or services into workloads. Workloads are createed within an enclave. Maintenance of customer workloads belongs to the customer, following the standard [Shared responsibility model in the cloud](../security/fundamentals/shared-responsibility.md). 

Workloads also automatically inherit security posture and policies of their enclave. Workloads can also, by default, utilize community services reachable from their Enclave.

## Why use a workload?
Workloads allow customers to group resources, the same as other Azure Resource Groups, and importantly also separate groups of policies and exceptions can be scoped and applied to a workload and therefore the individual apps and services within the workload. When using the managed resource group that comes with a workload there are minor restrictions described [here](./best-practices.md).

The alternative is to deploy an Azure Resource Group through the portal that isn't managed. The workload managed resource group is equivalent to a normal Azure resource group aside from these minor restrictions, which help to keep the resource group secured within the enclave boundary. Deploying a normal Azure resource group through the portal is still an option, but a normal Azure resource group wouldn't be secured within the enclave boundary.

## Architecture of a workload
Workloads come with the following primary platform-managed and platform-deployed resources:

- [Azure Virtual Enclaves governance](./what-azure-virtual-enclaves.md#multi-layered-governance-security-and-monitoring)
- [Enclave services and properties](./what-enclave.md)

## workload resource group
When you create a workload, you create workload Resource Groups that you need to organize your resources. You could separate 

For more details regarding the workload managed resource group, learn more about [Best practices of Azure Virtual Enclaves](./best-practices.md).

## What can I add to my workload?
The managed resource group functions just like an Azure resource group with the managed aspects mentioned above. You can create new resources using the methods you're familiar with for your Azure resources. Additionally, you can create resources from the Portal through the Service Catalog: [What is the Service Catalog](./what-service-catalog.md)

## Next Steps
- [What is the Service Catalog?](./what-service-catalog.md)
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [What is a community?](./what-community.md)
- [What is an Enclave?](./what-enclave.md)
- [Shared responsibility model in the cloud](../security/fundamentals/shared-responsibility.md)
- [Best practices](./best-practices.md)
- [Tutorial: Create a workload](./3-create-workloads-inside-enclave.md)
