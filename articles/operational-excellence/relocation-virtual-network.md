---
title: Relocation guidance for Azure Virtual Network
description: Find out about relocation guidance for Azure Virtual Network
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/24/2023
ms.service: virtual-network
ms.topic: how-to
ms.custom:
  - references_regions
  - subject-relocation
---


# Relocation guidance for Azure Virtual Network

This article covers the recommended approaches, guidelines and practices for relocating an Azure Virtual Network.

To move Azure Virtual Network to a new region, it's highly recommended that you [redeployment](#redeploy) your virtual network. However, you can choose to use Azure Resource Mover or simply redeploy. 

## Prerequisites


- Identify all Azure Virtual Network dependant resources.
    
- Identify the source networking layout and all the resources that are currently used. This layout can include load balancers, network security groups (NSGs), Route Tables, and reserved IPs.

- Collect all virtual network resources and configurations, such as Associated DDoS plan, Azure Firewall, Private endpoint connections and Diagnostic setting configuration.

- Move the diagnostic storage account that contains Network Watcher NSG logs *prior* to relocation of the virtual network and the NSG flow log.

> [!IMPORTANT]
> Starting July 1, 2021, you won't be able to add new tests in an existing workspace or enable a new workspace with Network performance monitor. You can continue to use the tests created prior to July 1, 2021. To minimize service disruption to your current workloads, migrate your tests from Network performance monitor to the new Connection monitor in Azure Network Watcher before February 29, 2024.


## Disconnected and connected scenarios

To plan your relocation of an Azure Virtual Network, you must understand whether the virtual network is being used in either a connected or disconnected scenario. In a connected scenario, the virtual network has a routed IP connection to an on-premise datacenter using a hub, VPN Gateway or an ExpressRoute connection. In a disconnected scenario, the virtual network is used by workload components to communicate with each other.


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


## Redeploy

Redeployment is the recommended way to move your virtual network to a new region.  Redeployment supports both independent relocation of multiple workloads, as well as private IP address range change in the target region. To redeploy, you'll use a Resource Manager template.

When choosing to redeploy, it's important that you understand the following considerations:

- [Peered Virtual networks](/azure/virtual-network/virtual-network-peering-overview) can't be re-created in the new region, even if they're defined in the exported template. To have virtual networking peering in the new region, you need to create a separate export template for the peering.
- If you enable private IP address range change, multiple workloads in a virtual network can be relocated independently of each other, 
- The redeployment method supports the option to enable and disable private IP address range change in the target region.
- If you don't enable private IP address change in the target region, data migration scenarios that require communication between source and target region can only be established using public endpoints (public IP addresses).

**To redeploy your virtual network to a new region:**

1. Redeploy your virtual network to another region by choosing the appropriate guides:

    |To learn how to move...| Using...| Go to...|
    |----|---|---|
    |Network Security Groups (NSG)| Azure portal|[Move Azure NSG to another region using the Azure portal](/azure/virtual-network/move-across-regions-nsg-portal).|
    | |PowerShell|[Move Azure NSG to another region using the PowerShell](/azure/virtual-network/move-across-regions-nsg-powershell).|
    |Virtual Network| Azure portal|[Move Azure Virtual Network to another region using the Azure portal](/azure/virtual-network/move-across-regions-vnet-portal).|
    || PowerShell|[Move Azure Virtual Network to another region using the PowerShell](/azure/virtual-network/move-across-regions-vnet-powershell).|
    
1. Virtual Network Peering need to be reconfigure manually/or by using a Powershell script.
 
    |To learn how to move...| Using...| Go to...|
    |----|---|---|
    | Virtual Network Peering|  Azure Portal |  [Create, change, or delete a virtual network peering](/azure/virtual-network/virtual-network-manage-peering) |
    | | Powershell | [Peer two virtual networks script sample](/azure/virtual-network/scripts/virtual-network-powershell-sample-peer-two-virtual-networks)|
1. Once virtual network movement completes, Reconfigure associated
  resources manually/or by using script updated in dependent resources, configs
  and apps.
  1. Reconfigure the Network security Group (NSG), Application Security Group
    (ASG) and User Define Route to the target virtual Network subnet which was
    previously associated to source virtual Network subnet and now moved to
    target region.
  1. Diagnostic settings: Reconfigure the diagnostic setting for the target
    
        

## Relocate with Azure Resource Mover

Although it's not recommended, you can choose to use Azure Resource Mover to migrate your virtual network to another region. 

Below are some features and limitations of using the migration strategy.

- All workloads in a virtual network must be relocated together.

- A relocation using Azure Resource Mover doesn't support private IP address range change.

- Azure Resource Mover can move resources such as Network Security Group and User Defined Route along with the virtual network. However, its recommended that you move them separately. Moving them altogether can lead to failure of the  `Validate dependencies` stage.

- Resource Mover cannot directly move NAT gateway instances from one region to another. To work around this limitation, see [Create and configure NAT gateway after moving resources to another region](/azure/nat-gateway/region-move-nat-gateway).

- Azure Resource Mover doesn’t support any changes to the address space during the relocation process. As a result, when movement completes, both source and target have the same, and thus conflicting, address space. It's recommended that you do manual update of address space as soon as relocation completes.

- Virtual Network Peering must be reconfigured after the relocation. Its recommended that you move the peering virtual network either before or with the source virtual network.

- While performing the Initiate move steps with Azure Resource Mover, resources may be temporarily unavailable.

To relocate your virtual network across regions with Resource Mover, follow the steps in [move Azure Virtual Network across Azure regions](/azure/resource-mover/overview#move-across-regions).

>[!IMPORTANT]
>During the Resource Mover validation step, you may see a list of dependencies that can also be prepared to move with the virtual network. It's highly recommended that you move dependent resources separately by detaching them from the move collection.


## Relocate DDOS Protection Plan

DDoS Protection Plan doesn't have any client specific data and the instance itself can be moved alone.

**To relocate a DDOS Protection plan to a new region:**

1. Prepare the Source DDOS Protection plan for the move by using a [Resource Manager template](/azure/templates/microsoft.network/ddosprotectionplans?pivots=deployment-language-bicep):
    1. Export the Source DDOS Protection plan template from Azure portal.
    1. Make the necessary changes to the template, such as updating all occurrences of the name and the location for the relocated DDOS Protection plan.

1. Once redeployment completes, use the Azure portal to reconfigure the DDOS Protection plan with the target virtual network.

## Relocate Network Watcher

As soon as the virtual network get deployed in a specific region, Network Watcher is automatically enabled. However, you'll still need to perform some configuration steps:

- To get a centralized view of the Network Monitoring, you'll need to enable Connection Monitor ([Migrate to Connection monitor from Network performance monitor](/azure/network-watcher/migrate-to-connection-monitor-from-network-performance-monitor)). 

- Recreate the NSG flow logs for the target virtual network.

## Validate

Once the entire relocation is completed, you need to test and validate the virtual network by doing the following:

- Once the virtual network is relocated to the target region, run a smoke test and integration test (either through a script or manually) to validate and ensure that all configurations and dependent resources have been properly linked and all configured data are accessible.

- Validate all virtual network components and integration.

- If you relocated source peering, use Network Watcher to validate connectivity and communication once the peering is reconfigured. 

