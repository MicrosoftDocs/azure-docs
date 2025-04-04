---
title: Azure VMware Solution in an Azure Virtual Network design consideration (Public Preview)
description: Learn about Azure VMware Solution in an Azure Virtual Network design consideration.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 4/3/2025
# customer intent: As a cloud administrator, I want to learn about Azure VMware Solution in an Azure Virtual Network design consideration so that I can make informed decisions about my Azure VMware Solution deployment.
---

# Azure VMware Solution in an Azure Virtual Network design considerations (Public Preview)

In this article, you learn about design considerations for Azure VMware Solution in an Azure Virtual Network. It discusses what this solution offers in a VMware private cloud environment that your applications can access from on-premises and Azure-based environments or resources. There are several considerations to review before you set up your Azure VMware Solution private cloud in an Azure Virtual Network. This article provides solutions for use cases that you might encounter when you're using the private cloud type.

> [!Note]
> This is currently a Public Preview offering. For more information, see our [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/Preview-supplemental-terms/).

## Limitations during Public Preview

The following functionality is limited during this time. These limitations will be lifted in the future:

- You cannot delete your Resource Group, which contains your Private Cloud.
- You can only deploy **1 Private Cloud per Azure Virtual Network**.
- You can only create **1 SDDC per Resource Group**. Multiple Private Clouds in a single Resource Group are not supported. 
- Your Private Cloud and Virtual Network for your Private Cloud must be in the *same* Resource Group.
- You can not move your Private Cloud from one Resource Group to another after the Private Cloud is created.
- Virtual Network Service Endpoints direct connectivity from Azure VMware Solution workloads is not supported.
- **vCloud Director** using Private Endpoints is supported. However, vCloud Director using Public Endpoints is not supported.
- **vSAN Stretched Clusters** is not supported.
- Public IP down to the NSX Microsoft Edge for configuring internet will not be supported.
- Support for **AzCLI**, **PowerShell**, and **.NET SDK** are not available during Public Preview.
- **Run Commands** interacting with customer segments aren't supported including run commands interacting with Zerto, Jetstream, and other 3rd-party integrations.

## Unsupported integrations during Public Preview

The following 1st-party and 3rd-party integrations won't be available during Public Preview:
- **ElasticSAN**
- **Zerto**
- **Jetstream**

## Routing and Subnet Considerations

Azure VMware Solution in an Azure Virtual Network provides a VMware private cloud environment accessible to users and applications from on-premises and Azure-based environments or resources. Connectivity is delivered through standard Azure Networking. Specific network address ranges and firewall ports are required to enable these services. This section helps you configure your networking to work with Azure VMware Solution. 

The private cloud connects to your Azure virtual network using standard Azure networking. Azure VMware Solution private clouds require a minimum /22 CIDR network address block for subnets. This network complements your on-premises networks, so the address block shouldn't overlap with address blocks used in other virtual networks in your subscription and on-premises networks. Management, vMotion, and Replication networks are provisioned automatically within this address block as subnets inside your Virtual Network.


> [!Note]
> Permitted ranges for your address block are the RFC 1918 private address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), except for 172.17.0.0/16. Replication network is not applicable to AV64 nodes and is planned for general deprecation at a future date.

Avoid using the following IP schemas reserved for NSX usage: 

- 169.254.0.0/24 - used for internal transit network 
- 169.254.2.0/23 - used for inter-VRF transit network 
- 100.64.0.0/16 - used to connect T1 and T0 gateways internally 
- 100.73.x.x – used by Microsoft’s management network

Example /22 CIDR network address block: 10.31.0.0/22 

The subnets: 

| **Network Usage** | **Subnet** | **Description** | **Example** |
| :-- | :-- | :-- | :-- |
| NSX Network | /27 | NSX Manager network. | 10.31.0.0/27 |
| vCSA Network | /27 | vCenter network. | 10.31.0.32/27  |
| esx-cust-fdc | /27 | The management appliances (vCenter and NSX manager) are behind the "esx-cust-fdc” subnet, programmed as secondary IP ranges on this subnet. | 10.31.0.64/27  |
| cust-fds | /27 | Used by Azure VMware Solution to program routes created in NSX into the virtual network. | 10.31.0.96/27 |
| services | /27 | Used for Azure VMware Solution provider services. Also used to configure private DNS resolution for your private cloud. | 10.31.0.160/27  |
| esx-lrnsxuplink, esx-lrnsxuplink-1 | /28 | Subnets off each of the T0s per edge. These subnets are used to program NSX network segments as secondary IPs addresses. | 10.31.0.224/28, 10.31.0.240/28 |  
| esx-cust-vmk1 | /24 | vmk1 is the management interface used by customers to access the host. IPs from the vmk1 interface come from these subnets. All of the vmk1 traffic for all hosts comes from this subnet range. | 10.31.1.0/24  |
| esx-vmotion-vmk2 | /24 | vMotion VMkernel interfaces. | 10.31.2.0/24  |
| esx-vsan-vmk3  | /24 | vSAN VMkernel interfaces and node communication. | 10.31.3.0/24 |
| Reserved | Reserved Space. | /27 | 10.31.0.128/27 |
| Reserved | Reserved Space. | /27 | 10.31.0.192/27 |


## Next steps

- Get started with configuring your Azure VMware Solution service principal as a prerequisite. To learn how, see the [Enabling Azure VMware Solution service principal](native-first-party-principle-security.md) quickstart.
  
- Follow a tutorial for [Creating an Azure VMware Private Cloud in an Azure Virtual Network](native-create-azure-vmware-virtual-network-private-cloud.md)
