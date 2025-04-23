---
title: Azure Virtual Enclaves Best Practices
description: Azure Virtual Enclaves Best Practices.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Azure Virtual Enclaves Best Practices
This article describes key concepts and best practices for Azure Virtual Enclaves.

Azure Virtual Enclaves (AVE) accelerates and streamlines the deployment and management of secure, isolated, and compliant cloud environments for the most sensitive missions and workloads across Commercial and air-gapped environments.

Building and running workloads successfully in AVE requires understanding and implementation of some key concepts, including:

- [Networking and organizational design patterns](#networking-and-organizational-design-patterns-for-azure-virtual-enclaves)
- [Security design patterns](#security-design-patterns-for-azure-virtual-enclaves)
- [Managed resource groups](#managed-resource-groups-in-azure-virtual-enclaves)

The AVE product group, engineering teams, and field teams contributed to, wrote, and grouped the following best practices and conceptual articles. Their purpose is to help Community and Enclave Owners and developers better understand the concepts above and implement the appropriate features.

## Networking and Organizational Design Patterns for Azure Virtual Enclaves

### Multi-tenancy
- [How to organize resources](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources)

### Networking design

AVE brings together the capabilities and flexibility of several Azure networking products such as Azure Virtual WAN, Azure Firewall, Azure Virtual Network, and Network Security Groups in a simplified user interface.

AVE makes the following overall recommendations:
1. [Communities](./what-community.md) should be deployed when you have networking requirements to provide an [Azure Firewall](https://aka.ms/azurefirewall), which is Azure's intelligent firewall security Platform-as-a-Service.
2. Communities should be deployed when you have organizational or data sensitivity requirements to separate a hub-and-spoke virtual wide-area-network (VWAN) from another hub-and-spoke VWAN.
3. Communities should be deployed when you have networking requirements to support systems spanning [multiple Azure regions](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-setup-guide/regions), in which each region requires its own Azure Firewall. [Learn more about multi-hub Azure Firewall use-cases](../firewall/firewall-multi-hub-spoke.md). 
4. Communities should be deployed when you have networking requirements to support a very large number of systems on a distributed, hub-and-spoke wide area network. Learn more about [Azure VWAN](../virtual-wan/virtual-wan-faq).
5. [Enclaves](./what-enclave.md) should be deployed when you have networking requirements to deploy similar workloads as part of the same private network.
6. Enclaves should be deployed when you have a planned workload requirement that needs to be within the same VWAN as an existing community for ease of network management.

#### Community network design considerations
AVE advises customers to follow, wherever possible, underlying Azure service best practices documentation when planning their community networks. Some, but not all, of these best practices documentation are provided below:
- [Azure Firewall best practices](../firewall/firewall-best-practices)
- [Azure Firewall multi-hub-and-spoke](../firewall/firewall-multi-hub-spoke)
- [Hub-and-spoke Azure VWAN Architecture](https://learn.microsoft.com/azure/architecture/networking/hub-spoke-vwan-architecture)
- [Azure VWAN Network topology](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/virtual-wan-network-topology)
- [Azure VWAN FAQ](../virtual-wan/virtual-wan-faq)

#### Enclave network design considerations
AVE advises customers to follow, wherever possible, underlying Azure service best practices documentation when planning their enclave networks. Some, but not all, of these best practices documentation are provided below:
- [Azure Virtual Network concepts and best practices](../virtual-network/concepts-and-best-practices)
- [Network security groups overview](../virtual-network/network-security-groups-overview)

Learn more about overall [Azure networking best practices](https://learn.microsoft.com/azure/security/fundamentals/network-best-practices).

### Workload deployment
- Workloads contain a managed resource group, which Enclave Contributors can use to deploy Azure resources to
- By default, all AVE Workloads are [governed](./what-azure-virtual-enclaves.md#multi-layered-governance-security-and-monitoring) through built-in Azure Policy initiatives
- Workloads associated with a [community](./what-community.md) that has a custom governance setup, will use this unique configuration instead of the default AVE governance configuration.
- [Considerations for naming Azure resources](https://learn.microsoft.com/azure/azure-government/documentation-government-concept-naming-resources)

## Security design patterns for Azure Virtual Enclaves

### Security boundaries
AVE employs a defense-in-depth approach when it comes to cybersecurity. When you deploy a community and enclaves within a community, AVE establishes several layers of network isolation, security, access controls, and logging and monitoring capabilities. 

### Shared security responsibilities
As a service on Azure, AVE also is committed to upholding the [shared responsibility model](https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility) in the cloud. For AVE specifically, [workloads](./what-workload.md) are the customer's responsibility. Platform shared responsibility is inherited in workloads if the customer deployed PaaS services into their workloads.

Customer instances of [communities](./what-community.md) and [enclaves](./what-enclave.md) represent a shared responsibility. Communities and enclaves are shared responsibilities in that the AVE Resource Provider will initially deploy a secured, pre-configured hub-and-spoke network environment for the customer. This network environment can then be managed by the customer by creating [enclave endpoints](./create-enclave-endpoint-portal.md), [community endpoints](./create-community-endpoint-portal.md), [transit hubs](./create-transit-hub-portal.md), or [enclave connections](./create-enclave-connection-portal.md). Certain preview versions of AVE also allow the customer to manually make changes to the network through underlying controls provided by [Azure VWAN](../virtual-wan/virtual-wan-about.md), [Azure Virtual Network](../virtual-network/virtual-networks-overview.md), and other underlying Azure networking services.

AVE [governance/Governance](./what-azure-virtual-enclaves.md#multi-layered-governance-security-and-monitoring) is also a shared responsibility. The AVE Resource Provider will initially establish a secured, pre-configured list of [Azure Policy initiatives](/docs/concepts/governance/Governance/governance/Governance-Overview) per [workload](./what-workload.md) deployment. However, [communities](./what-community.md) now have the capability to configure their own list of Azure Policy Initiatives, which will override the pre-configured list for the workload. Despite this, customers retain the ability to make manual [exemptions](/docs/concepts/governance/Governance/Policy-compliance-exemptions) to these Azure Policy Initiative assignments depending on their compliance or governance requirements.

### Azure Security best practices
AVE recommends following [Microsoft Azure Security best practices and patterns](https://learn.microsoft.com/azure/security/fundamentals/best-practices-and-patterns) for deploying Azure resources and implementing workloads. Certain exclusions to the general rule apply where the recommendation has either already been implemented as part of the default settings deployed by the AVE Resource Provider or was slightly tweaked as part of the broader hub-and-spoke network architecture and design patterns of AVE.

Customers are also recommended to follow the [Azure security best practices - Cloud Adoption Framework](https://learn.microsoft.com/azure/cloud-adoption-framework/secure/security-top-10) when it comes to organizing their systems, cloud infrastructure, IT personnel and teaming structures, and corporate cybersecurity awareness trainings.

## Managed resource groups in Azure Virtual Enclaves

### Community managed resource group
The _Community managed resource group_ contains the infrastructure resources described in [What is a Community?](./what-community.md).

The Community managed resource group is assigned a name by default following this convention `myCommunityName-HostedResources-<GUID>`. Every Community deployment will create this resource group and create the Community infrastructure inside. When you delete your community, the Azure Virtual Enclaves resource provider automatically deletes the Community managed resource group.

![Screenshot showing an example of the Community resources managed by Azure Virtual Enclaves.](./media/fabrikam-hosted-resources.png)

The Community managed resource group has the following limitations:
- You can't specify an existing resource group for the Community managed resource group.
- You can't specify a different subscription for the Community managed resource group.
- You can't change the Community managed resource group name after the Community has been created.
- You can't specify names for the managed resources within the Community  managed resource group.
- You can't modify or delete Azure-created tags of managed resources within the Community managed resource group.

If you modify or delete Azure-created tags, resources, and other resource properties in the Community managed resource group, you could get unexpected results, such as network, access, and monitoring errors. As Azure Virtual Enclaves manages the lifecycle of infrastructure in the Community managed resource group, any changes could potentially move your enclave into an unsupported state.

A common scenario where customers want to modify resources is through tags. Azure Virtual Enclaves allows you to create and modify tags that are propagated to resources in the Community managed resource group, and you can add those tags when creating the Community. You might want to create or modify custom tags, for example, to assign a business unit or cost center. This can also be achieved by creating Azure Policies with a scope on the Community managed resource group.

> [!NOTE]
> 
> If you don't have Community managed resource group lockdown enabled, you can directly modify any resource in the Community managed resource group. Directly modifying resources in the Community managed resource group can cause your enclave to become unstable or unresponsive.

### Enclave managed resource group
The _Enclave managed resource group_ contains the infrastructure resources described in [What is an Enclave?](./what-enclave.md).

The Enclave managed resource group is assigned a name by default following this convention `myEnclaveName-HostedResources-<GUID>`. Every Enclave deployment will create this resource group and create the Enclave infrastructure inside. When you delete your enclave, the Azure Virtual Enclaves resource provider automatically deletes the Enclave managed resource group.

![Screenshot showing an example of the Enclave resources managed by Azure Virtual Enclaves.](./media/enclave-webapp-hosted-resources.png)

The Enclave managed resource group has the following limitations:
- You can't specify an existing resource group for the Enclave managed resource group.
- You can't specify a different subscription for the Enclave managed resource group.
- You can't change the Enclave managed resource group name after the Enclave has been created.
- You can't specify names for the managed resources within the Enclave managed resource group.
- You can't modify or delete Azure-created tags of managed resources within the Enclave managed resource group.

If you modify or delete Azure-created tags, resources, and other resource properties in the Enclave managed resource group, you could get unexpected results, such as network, access, and monitoring errors. As Azure Virtual Enclaves manages the lifecycle of infrastructure in the Enclave managed resource group, any changes could potentially move your enclave into an unsupported state.

A common scenario where customers want to modify resources is through tags. Azure Virtual Enclaves allows you to create and modify tags that are propagated to resources in the Enclave managed resource group, and you can add those tags when creating the enclave. You might want to create or modify custom tags, for example, to assign a business unit or cost center. This can also be achieved by creating Azure Policies with a scope on the Enclave managed resource group.

> [!NOTE]
> 
> If you don't have Enclave managed resource group lockdown enabled, you can directly modify any resource in the Enclave managed resource group. Directly modifying resources in the Enclave managed resource group can cause your enclave to become unstable or unresponsive.

### Workload managed resource group
The _Workload managed resource group_ contains the infrastructure resources described in [What is a Workload?](./what-workload.md).

The Workload managed resource group is assigned a name by default following this convention `myWorkloadName`. When you delete your Workload, the Azure Virtual Enclaves resource provider automatically deletes the Workload managed resource group.

The Workload managed resource group has the following limitations:
- You can't specify an existing resource group for the Workload managed resource group.
- You can't specify a different subscription for the Workload managed resource group.
- You can't change the Workload managed resource group name after the Workload has been created.
- You can't modify or delete Azure-created tags of managed resources within the Workload managed resource group.

A common scenario where customers want to modify resources is through tags. Azure Virtual Enclaves allows you to create and modify tags that are propagated to resources in the Workload managed resource group, and you can add those tags when creating the Workload. You might want to create or modify custom tags, for example, to assign a business unit or cost center. This can also be achieved by creating Azure Policies with a scope on the Workload managed resource group.

## Other Azure best practices
As you build your communities, enclaves, and workloads in Azure, it's important to keep in mind the following universal design principles:

- [Networking architecture design in Azure](https://learn.microsoft.com/azure/architecture/guide/networking/networking-start-here)
- [Hub-spoke network topology in Azure](https://learn.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli)
- [Azure Private Link in a hub-and-spoke network](https://learn.microsoft.com/azure/architecture/guide/networking/private-link-hub-spoke-network)
- [Azure Firewall - Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/services/networking/azure-firewall)
- [Considerations for naming Azure resources](https://learn.microsoft.com/azure/azure-government/documentation-government-concept-naming-resources)
- [Microsoft Azure Security best practices and patterns](https://learn.microsoft.com/azure/security/fundamentals/best-practices-and-patterns)
