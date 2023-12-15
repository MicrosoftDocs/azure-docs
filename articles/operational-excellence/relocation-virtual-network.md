---
title: Relocation guidance for Azure Virtual Network
titleSufffix: Azure Virtual Network
description: Find out about relocation guidance for Azure Virtual Network
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 12/11/2023
ms.service: virtual-network
ms.topic: conceptual
ms.custom:
  - references_regions
  - subject-reliability
---


# Relocation guidance for Azure Virtual Network

This article covers the recommended approaches, guidelines and practices for Azure Virtual Network.


## Prepare for relocation

Before you begin relocation, make sure that you include the following considerations and recommended guidance in your planning:

- **Create a dependency map** with all the Azure services that use the Virtual Network. For the services that are in scope of a relocation, you must select the appropriate [relocation strategy](./relocation-strategies.md).
    
- **Identify the source networking layout and all the resources that are currently used.** This layout can include load balancers, network security groups (NSGs), Route Tables, and reserved IPs.

- **Collect/List all virtual network resources and configurations**, such as Associated DDoS plan, Azure Firewall, Private endpoint connections and Diagnostic setting configuration.

- **To move Network Watcher NSG logs**, you'll need to make sure that you move the diagnostic storage account prior to relocation of the virtual network and the NSG flow log.

## Dependencies

None.


## Relocation strategies

To move Azure Virtual Network to a new region, you can choose either migration or redeployment. However, it's highly recommended that you use the [redeployment method](#redeployment-strategy-recommended).


### Redeployment strategy (Recommended)

Redeployment is the recommended way to move your virtual network to a new region.  Redeployment supports both independent relocation of multiple workloads, as well as private IP address range change in the target region.


### Redeployment considerations

- [Peered Virtual networks](/azure/virtual-network/virtual-network-peering-overview) can't be re-created in the new region, even if they're defined in the exported template. To have virtual networking peering in the new region, you need to create a separate export template for the peering.
- If you enable private IP address range change, multiple workloads in a virtual network can be relocated independently of each other, 
- Supports option to enable and disable private IP address range change in the target region.
- If you don't enable private IP address change in the target region, data migration scenarios that require
communication between source and target region can only be established using public endpoints (public IP addresses).

#### How to redeploy

1. If you want virtual networking peering to be redeployed along with the virtual network, create a separate export template for the peering. 

**To create a separate peering template:**

    1. Copy the details of the peering to create a peering template.
    1. Remove the peering information from the primary export template.
    1. Use the peering template to reestablish the peering after the relocation of the network.
    
1. Redeploy your virtual network to another region by choosing the appropriate guides:

    |To learn how to move...| Using...| Go to...|
    |----|---|---|
    |Network Security Groups (NSG)| Azure portal|[Move Azure NSG to another region using the Azure portal](/azure/virtual-network/move-across-regions-nsg-portal).|
    | |PowerShell|[Move Azure NSG to another region using the PowerShell](/azure/virtual-network/move-across-regions-nsg-powershell).|
    |Virtual Network| Azure portal|[Move Azure Virtual Network to another region using the Azure portal](/azure/virtual-network/move-across-regions-vnet-portal).|
    || PowerShell|[Move Azure Virtual Network to another region using the PowerShell](/azure/virtual-network/move-across-regions-vnet-powershell).|
    |Public IP| Azure portal|[Move Azure Public IP to another region using the Azure portal](/azure/virtual-network/move-across-regions-vnet-portal).|
    || PowerShell|[Move Azure Public IP to another region using the PowerShell](/azure/virtual-network/move-across-regions-vnet-powershell).|
    

### Migration strategy

Although it's not recommended, you can choose to use Azure Resource Mover to migrate your virtual network to another region. 

### Migration considerations

Below are some features and limitations of using the migration strategy.

- All workloads in a virtual network must be relocated together.

- A relocation using Azure Resource Mover doesn't support private IP address range change.

- Azure Resource Mover can move resources such as Network Security Group and User Defined Route along with the virtual network. However, its recommended that you move them separately. Moving them altogether can lead to failure of the  `Validate dependencies` stage.

- Resource Mover cannot directly move NAT gateway instances from one region to another. To work around this limitation, see [Create and configure NAT gateway after moving resources to another region](/azure/nat-gateway/region-move-nat-gateway).

- Azure Resource Mover doesn’t support any changes to the address space during the relocation process. As a result, when movement completes, both source and target have the same, and thus conflicting, address space. It's recommended that you do manual update of address space as soon as relocation completes.

- Virtual Network Peering must be reconfigured after the relocation. Its recommended that you move the peering virtual network either before or with the source virtual network.

- While performing the Initiate move steps with Azure Resource Mover, resources may be temporarily unavailable.


To learn how to migrate your virtual network to a new region using Azure Resource Mover, see [Move Azure VMs across regions](/azure/resource-mover/tutorial-move-region-virtual-machine).


## Additional relocation resources

### Relocate DDOS Protection Plan

DDoS Protection Plan doesn't have any client specific data and the instance itself can be moved alone.

**To relocating a DDOS Protection plan to a new region:**

1. Prepare the Source DDOS Protection plan for the move by using a Resource Manager template:
    1. Export the Source DDOS Protection plan template from Azure portal.
    1. Make the necessary changes to the template, such as updating all occurrences of the name and the location for the relocated DDOS Protection plan.

1. Once redeployment completes,  reconfigure DDOS Protection plan with the target virtual network.


### Relocate Network Watcher

As soon as the virtual network get deployed in a specific region,  Network Watcher is automatically enabled. However, you'll need to perform some configuration:

- To get a centralized view of the Network Monitoring, you'll need to enable Network Performance Monitor (NPM). Also ensure that the workspace associated with NPM is in a supported region.

- Recreate the NSG flow logs for the target virtual network. You must make sure that you move diagnostic storage account **prior** to virtual network relocation.

## Relocation validation

Once the relocation is completed, the Virtual Network needs to be tested and validated. Below are some of the recommended guidelines.

- Once the virtual network is relocated to the target region, it's highly advisable to run a smoke test and integration test (either through a script or manually) to validate and ensure all configurations and dependent resources have been properly linked and all configured data are accessible.

- Validate all virtual network components and integration.

-  If you relocated source peering, use Network Watcher to validate connectivity and communication once the peering is reconfigured. 

## Disconnected and connected scenarios

To plan your relocation of an Azure Virtual Network, you must understand whether the virtual network is being used in either a connected or disconnected scenario. In the connect scenario the virtual network has a routed IP connection to an on-premise datacenter using an hub, VPN Gateway or an ExpressRoute connection. In the disconnected scenario the virtual network is used by workload components to communicate with each other.


:::image type="content" source="media/relocation/vnet-connected-scenarios.png" alt-text="Diagrams showing both connect scenario and disconnect scenarios for virtual network.":::


### Disconnected Scenario

| Relocation with no IP Address Change  | Relocation with IP Address Change    |
| -----------------------------|-----------|
| No additional IP address ranges are needed.      | Additional IP Address ranges are needed.     |
| No IP Address change for resources after relocation.        | IP Address change of resources after relocation         |
| All workloads in a virtual network must relocated together.     | Workload relocation without considering dependencies or partial relocation is possible (Take communication latency into account)    |
| Virtual Network in the source region needs to be disconnect or removed before the Virtual Network in the target region can be connected. | Enable communication shortcuts between source and target region using vNetwork peering.                                                                              |
| No support for data migration scenarios where communication between source and target region is needed. | Enable data migration scenarios where communication between source and target region is needed by establishing a network peering for the duration of the relocation. |

#### Disconnected relocation with the same IP-address range

:::image type="content" source="media/relocation/vnet-disconnected-relocation-no-ip-address-change.png" alt-text="Diagram showing disconnected workload relocation with no vNet IP address range change.":::


#### Disconnected relocation with  a new IP-address range

:::image type="content" source="media/relocation/vnet-disconnected-relocation-ip-address-change.png" alt-text="Diagram showing disconnected workload relocation with vNet IP address range change..":::

### Connected Scenario

| Relocation with no IP Address Change                                                                                                                                                     | Relocation with IP Address Change                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No additional IP address ranges are needed.                                                                                                                                              | Additional IP Address ranges are needed.                                                                                                                             |
| No IP Address change for resources after relocation.                                                                                                                                     | IP Address change of resources after relocation.                                                                                                                     |
| All workloads with dependencies on each other need to be relocated together.                                                                                                             | Workload relocation without considering dependencies possible (Take communication latency into account).                                                             |
| No communication between the two virtual networks in the source and target regions is possible.                                                                                          | Possible to enable communication between source and target region using vNetwork peering.                                                                            |
| Data migrations scenarios where an communication between source and target region is needed, are not possible (using virtual networks) or can only established through public endpoints. | Enable data migration scenarios where communication between source and target region is needed by establishing a network peering for the duration of the relocation. |

#### Connected relocation with the same IP-address range

:::image type="content" source="media/relocation/vnet-connected-relocation-no-ip-address-change.png" alt-text="Diagram showing connected workload relocation with no vNet IP address range change.":::

#### Connected relocation with a new IP-address range

:::image type="content" source="media/relocation/vnet-connected-relocation-ip-address-change.png" alt-text="Diagram showing connected workload relocation with vNet IP address range change..":::


