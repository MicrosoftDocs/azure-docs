---
title: What is Everpure Cloud Azure Native?
description: Discover Everpure Cloud Azure Native, which offers scalable and flexible enterprise-class cloud block storage with built-in capabilities via the Azure portal.
author: Reshmi-Sriram
ms.author: reshmisriram
ms.topic: overview
ms.date: 08/22/2026
ai-usage: ai-assisted
---
# What is Everpure Cloud Azure Native?

Everpure Cloud Azure Native is a jointly developed and managed cloud block storage as a service. It enables organizations to provision and manage Everpure block storage directly in Azure by using familiar Azure tools, workflows, and billing. [!INCLUDE [what-is](../includes/what-is.md)]. 

Everpure Cloud is designed for organizations that need scalable, flexible block storage for Azure workloads. It supports both Azure Virtual Machines and Azure VMware Solution environments, while preserving an Azure-native management experience.

## What is it used for?

Everpure Cloud can be used for the following scenarios:
- Scaling storage and compute independently so that workload capacity and performance can be aligned more closely with application needs.
- Run business-critical workloads on Azure virtual machines that require persistent block storage with consistent performance.
- Provide storage for Azure VMware Solution environments that benefit from externalized storage capacity and its decoupling from compute.
- Manage storage through Azure-native workflows instead of separate storage administration platforms.

## Why use Everpure Cloud Azure Native?

Everpure Cloud provides the following customer benefits:
- Native Azure storage and operational model, managed through the Azure portal, ARM/Azure Bicep, and Terraform alongside existing Azure tools.
- Reduced cloud consumption and cost through inline data reduction, thin provisioning, and space-efficient snapshots and clones.
- Simplified deployment as a fully managed Azure Native Integration, with no storage infrastructure to deploy, operate, or maintain.
- Improved resiliency through built-in protection, always-on encryption, and immutable snapshot capabilities.
- Support for cost optimization and migration scenarios, including VMware-to-AVS migration, independent scaling of storage from compute, and external storage for Azure virtual machines.

## Azure VM and Azure VMware Solution scenarios

For native Azure VM environments, organizations often want more than disk capacity alone. They also need a way to align storage operations with Azure governance, automation, and cost management practices. Everpure Cloud addresses this need by exposing storage resources through Azure APIs and resource constructs, with support for Azure automation workflows and resource-based management.

You can create and manage these resources in Azure, then connect them to virtual machines in the same Azure region and subscription. The service also supports automated VM connectivity through a dedicated VM extension that configures the required iSCSI connectivity on supported guest operating systems.

For Azure VMware Solution, the service helps customers separate storage growth from AVS compute scaling. This model can be useful for workloads with larger data footprints, for VMware migration scenarios, or for environments where customers generally want external storage capabilities without relying only on compute-attached capacity.


## Key features

The following key features are available for Everpure:

- **Flexible performance**: Configure storage performance for workload requirements and adjust it as needs evolve.
- **Elastic and scalable capacity**: Increase storage capacity automatically as data grows without requiring scaling of compute resources or storage performance.
- **Thin provisioning**: Allocate storage more efficiently and reduce overprovisioning.
- **Instant resizing**: Expand storage volumes without interrupting applications.
- **Shareable Volumes**: Support workload patterns that require shared access to storage across multiple hosts.
- **Snapshots and clones**: Create point-in-time copies of data for rapid recovery, backup workflows, and dev/test use cases.

## Deployment model

Deployment starts by creating the service resource in Azure with the required subscription, region, and billing details. Customers then deploy a storage pool, presented as a native Azure resource, into their virtual network. Everpure in cooperation with Microsoft manages the underlying back-end storage automatically.

In Azure VM deployments, the service is deployed into a delegated subnet within a virtual network, while application virtual machines run in customer VM subnets. This design keeps the managed storage service logically separate from application compute while still allowing the virtual machines to connect to storage over the Azure virtual network.

In Azure VMware Solution environments, the service can be used as external storage for supported AVS architectures, helping organizations align storage consumption more closely to workload needs instead of scaling compute only to gain more capacity.

To get started, create the service resource in Azure. Depending on the intended use case, the next steps typically include creating a storage pool and then configuring the resources needed for either Azure virtual machine storage workflows or Azure VMware Solution connectivity workflows.


## Subscribe to Everpure Cloud Azure Native

[!INCLUDE [subscribe](../includes/subscribe.md)] *Everpure Cloud*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Additional information

For more information, see [Everpure Cloud Azure Native documentation](https://support.purestorage.com/bundle/m_azure_native_pure_storage_cloud/page/Pure_Cloud_Block_Store/Azure_Native_Pure_Storage_Cloud/topics/c_azure_native_pure_storage_cloud.html).

## Next step

> [!div class="nextstepaction"]
> [Create a resource](create.md)
