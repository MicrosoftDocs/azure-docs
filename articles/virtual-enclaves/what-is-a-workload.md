---
title: What is a Workload?
description: What is a Workload?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is a Workload?

Workloads are logical groups of Azure resources that you define to create and audit connections in Azure Virtual Enclaves. Only Community and Enclave Owners can view the workloads and networks that have network access to their data. Workloads are not discoverable to external networks. Enclave Owners can deploy Azure resources or services into Workloads. Workloads are provisioned within an enclave. Maintenance of customer workloads belongs to the customer, following the standard [Shared responsibility model in the cloud](https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility). 

Workloads also automatically inherit security posture and policies of their enclave. Workloads can also, by default, utilize Community services reachable from their Enclave.

## Why use a Workload?
Workloads allow customers to group resources, the same as other Azure Resource Groups, and importantly also separate groups of policies and exceptions can be scoped and applied to a Workload and therefore the individual apps and services within the Workload. When using the managed resource group that comes with a Workload there are minor restrictions described [here](/docs/Concepts/Concepts-and-best-practices).

The alternative is to deploy an Azure Resource Group through the portal that is not managed. The Workload managed resource group is equivalent to a normal Azure resource group aside from these minor restrictions, which help to keep the resource group secured within the enclave boundary. Deploying a normal Azure resource group through the portal is still an option, but a normal Azure resource group would not be secured within the enclave boundary.

## Architecture of a workload
Workloads come with the following primary platform-managed and platform-deployed resources:

- Workload managed resource group
- [Azure Virtual Enclaves governance](/docs/Concepts/Governance)
- [Enclave services and properties](/docs/overview/what%20is%20an%20enclave)

## Workload managed resource group
When you create a workload, the Azure Virtual Enclaves resource provider also creates a resource group which is managed by the Virtual Enclaves service. This managed resource group has a controlled configuration that allows for specific control plane actions.

For more details regarding the Workload managed resource group, learn more about [Concepts and best practices of Azure Virtual Enclaves](/docs/Concepts/Concepts-and-best-practices).

## What can I add to my Workload?
The managed resource group functions just like an Azure resource group with the managed aspects mentioned above. You can create new resources using the methods you are familiar with for your Azure resources. Additionally, you can create resources from the Portal through the Service Catalog: [What is the Service Catalog](/docs/overview/what%20is%20the%20service%20catalog)

## Next Steps
- [What is the Service Catalog?](/docs/overview/what%20is%20the%20service%20catalog)
- [What is Azure Virtual Enclaves?](/docs/overview/what%20is%20azure%20virtual%20enclaves)
- [What is a Community?](/docs/overview/what%20is%20a%20community)
- [What is an Enclave?](/docs/overview/what%20is%20an%20enclave)
- [Shared responsibility model in the cloud](https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility)
- [Concepts and best practices of Azure Virtual Enclaves](/docs/Concepts/Concepts-and-best-practices)
- [Tutorial: Create a Workload](/docs/Tutorials/3.-Create-workloads-in-an-enclave/)
