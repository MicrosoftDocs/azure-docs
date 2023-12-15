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

Before you begin relocation planning, make sure that you include the following considerations and recommended guidance:

- **Create a dependency map** with all the Azure services that use the Virtual Network. For the services that
are in scope of a relocation, you must select the appropriate [relocation strategy](./relocation-strategies.md).
    
- **Identify the source networking layout and all the resources that are currently used.** This layout can include load balancers, network security groups (NSGs), Route Tables, and reserved IPs.

- **Collect/List all virtual network resources and configurations**, such as Associated DDoS plan, Azure Firewall, Private endpoint connections and Diagnostic setting configuration.

## Dependencies

None.

## Dependent Resources

Below is a list of Virtual Network dependent resources.

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





| Category           | Service                                                                                                                                                                     | Dedicated Subnet                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Compute            | Virtual machines: Linux or Windows <br></br> Virtual machine scale sets<br></br>Azure Batch                                                                                 | No<br></br>No<br></br>No                                      |
| Network            | Application Gateway - WAF<br></br>VPN Gateway<br></br>Azure Firewall<br></br>Azure Bastion<br></br>Network Virtual Appliances<br></br>NAT gateway                           | Yes<br></br>Yes<br></br>Yes<br></br>Yes<br></br>No<br></br>No |
| Data               | RedisCache<br></br>Azure SQL Managed Instance                                                                                                                               | Yes<br></br>Yes                                               |
| Analytics          | Azure HDInsight<br></br>Azure Databricks                                                                                                                                    | No<br></br>No                                                 |
| Identity           | Azure Active Directory Domain Services                                                                                                                                      | No                                                            |
| Containers         | Azure Kubernetes Service (AKS)<br></br>Azure Container Instance (ACI)<br></br>Azure Container Service Engine with Azure Virtual Network CNI plug-in<br></br>Azure Functions | No<br></br>Yes<br></br>No<br></br>Yes                         |
| Web                | API Management<br></br>Web Apps<br></br>App Service Environment<br></br>Azure Logic Apps                                                                                    | Yes<br></br>Yes<br></br>Yes<br></br>Yes                       |
| Hosted             | Azure Dedicated HSM<br></br>Azure NetApp Files                                                                                                                              | Yes<br></br>Yes                                               |
| Azure Spring Cloud | Deploy in Azure virtual network (VNet injection)                                                                                                                            | Yes                                                           |


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


## How to relocate your Azure Virtual Network

To successfully relocate, you have to create a dependency map with all the Azure services used by the Virtual Network. For the services that are in scope of a relocation, you have to select the appropriate relocation strategy. The [automation guideline](/technical-delivery-playbook/automation/automation-foundation-framework/) in this technical playbook helps you orchestrate and sequence the multiple
relocation procedures.

### [Azure Resource Mover](/relocation-playbook/tools/az-resource-mover/)

Azure Resource Mover can helps you to move Azure virtual Network across Azure
regions.

- Step 1: Select resources - Select the Virtual network that need to be
  relocate. The resource will be added to the move collection.
- Step 2: Validate dependencies - If validation shows that dependent resources
  are pending, add them to the move collection. However its recommended to move
  them separated. So, Detach all the resources for the seamless movement.
- Step 3: Prepare - It initiates the preparation while creating a separate
  resource group to perform the move. If resource group is also selected for the
  movement with virtual network then it will not create separate resource group,
  just move the existing one.
- Step 4: Initiate move - Initialization of the movement happen with this stage.
  It will starts the process of transferring the resources to the target region.
- Step 5 : Commit move - Once movement completes, validate the resource and
  `Commit` to complete the move process else `Discard` the move process to keep
  the old resource and remove the replicated resource.
- Step 6 : Delete source (Optional) - After validation and commit.
  `Delete Source` will cleanup the resources from the source region.
  Consideration of vNet relocation using Azure resource mover

#### Consideration of virtual Network relocation while using Azure resource mover: [Ref](https://docs.microsoft.com/en-us/azure/resource-mover/overview)

- Before initiating any virtual network relocation, its necessary to do
  prioritization and sequencing of all landing Zone resources as per their
  dependencies.

##### Example of a sequencing flow

<!-- prettier-ignore-start -->
<!-- MERMAID DIAGRAM - START -->
{{< mermaid align="left" theme="neutral" >}}
  classDiagram
  direction LR
        Governance --|> BaseNetworking : Stage1-2
        BaseNetworking --|> ConnectivityNetwork : Stage2-3
          class ConnectivityNetwork {
            ExpressRoute
            Site2site
            AzureFirewall
            Peering
    }
            class Workload {
            VirtualMachine
            VirtualMachineScaleSet
            AzureWebapp/ASE
            AzureKeyVault
    }
        BaseNetworking --|> Workload : Stage3-4
          class Governance {
            LogAnalytics
            EventHub
            DiagnosticStorageaccount
    }
          class BaseNetworking {
            VirtualNetwork
            NetworkSecurityGroup
            ApplicationSecurityGroup
            NATGateway
            UserDefinedRoute
            Loadbalancing
            reservedIPs
    }
{{< /mermaid >}}
<!-- MERMAID DIAGRAM - END -->
<!-- prettier-ignore-end -->

- Azure resource mover can move resources along with virtual network like
  Network Security Group, User Defined Route etc . However, its recommended to
  move them separately as it can lead to failure of the stage
  `Validate dependencies` in case of any gap.
- NAT gateway instances can't directly be moved from one region to another. A
  workaround is to use Azure Resource Mover to move all the resources associated
  with the existing NAT gateway to the new region. You then create a new
  instance of NAT gateway in the new region and then associate the moved
  resources with the new instance. After the new NAT gateway is functional in
  the new region, you delete the old instance in the previous region.
  [Follow the guidance provided here.](https://docs.microsoft.com/en-us/azure/virtual-network/nat-gateway/region-move-nat-gateway)
- It doesn't support any change/update of the address space while in move. So,
  when movement completes both source and target will have the same address
  space which lead to conflict of IP address space. Manual update of address
  space is recommended after movement completion though its optional and depend
  on requirement.
- Virtual Network Peering need to be reconfigured after the movement. In this
  case its recommended to move corresponding virtual network (peering virtual
  network) before or with source virtual network.
- While using `Azure Resource Mover`, resources might be temporarily unavailable
  while performing `Initiate move` steps.

### [Redeploy](/relocation-playbook/relocation-strategies/redeployment/)

With the prerequisites in mind, below is a five-stage approach for relocating a
virtual Network across geographies.

- Step 1 – Prepare the Source virtual network for the move by using a Resource
  Manager template. Export the Source virtual network template from Azure
  portal.
  - Remove associated resources if they're present in the template like Network
    Security Group, Application Security Group, User Define route etc.
  - Make the necessary changes to the template, such as updating all occurrences
    of the name and the location for the relocated virtual network.
  - In case you used route tables
    ([Deployment Template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/userdefined-routes-appliance)),
    load balancers, Network Security Group, Application Security Group, NAT
    gateway in the virtual network, create templates for them and update the
    parameters with information about the target landing zone. Before you deploy
    the resources make sure the dependent resource are deployed. For a load
    balancer for example the virtual machines.
- Step 2 - Update the parameter of the virtual network name and new IP Address
  space range, change the value property under parameters.
- Step 3 - In the target region datacenter the virtual Network is recreated
  using IAC (Exported template).
- Step 4 - Virtual Network Peering need to be reconfigure manually/or by using
  script. Ref -
  [Manual Virtual Network Peering](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering)
  /
  [Script based Virtual Network Peering](https://docs.microsoft.com/en-us/azure/virtual-network/scripts/virtual-network-powershell-sample-peer-two-virtual-networks)
- Step 5 - Once virtual network movement completes, Reconfigure associated
  resources manually/or by using script updated in dependent resources, configs
  and apps.

  - Reconfigure the Network security Group (NSG), Application Security Group
    (ASG) and User Define Route to the target virtual Network subnet which was
    previously associated to source virtual Network subnet and now moved to
    target region.
  - Diagnostic settings: Reconfigure the diagnostic setting for the target
    virtual network to send the logs to log analytic workspace/storage
    account/event hub which was capture from the source virtual network during
    consolidation of prerequisites.

#### Redeploy DDOS Protection Plan

DDoS Protection Plan don't have any client specific data and the instance itself
can be moved alone, a redeploy would suffice.

With the prerequisites in mind, below is a Two-stage approach for relocating a
DDOS Protection plan across geographies.

- Step 1 – Prepare the Source DDOS Protection plan for the move by using a
  Resource Manager template. Export the Source DDOS Protection plan template
  from Azure portal.
  - Make the necessary changes to the template, such as updating all occurrences
    of the name and the location for the relocated DDOS Protection plan.
  - Update the parameter of the DDOS Protection plan Name and change the value
    property under parameters like DDOS Protection plan name, target location
    etc.
- Step 2 – Once redeployment completes, then reconfigure DDOS Protection plan
  with the target Virtual network.
  ![ddos-reconfig](/relocation/patterns/az-services/virtualnetwork/ddos-reconfig.png)

#### Consideration of virtual Network relocation while using Azure Resource Manager template

- For Virtual Network which don't have any associated resources, the instance
  itself needs to be moved alone, a redeploy would suffice. In such case we can
  redeploy the virtual network using IAC. Ref –
  [Virtual Network Module](https://docs.microsoft.com/en-us/azure/templates/microsoft.network/virtualnetworks?tabs=json)
- With Azure Resource Manager template as well, its recommended to do
  prioritization and sequencing of all landing zone resources as per their
  dependency. [Ref](#Flow-chart)
- Azure Resource Manager template gives the feature to update/change the IP
  address space while redeploying the virtual network in the target region.
  **_Please Note_**: In case of same IP address space with force tunneling from
  on-premise via Azure firewall, its recommended to change the IP address of the
  Azure firewall to avoid any route conflict.
- In case of DDoS protection plan, it needs to be redeployed in the target
  region and reconfigured once the move is completed.
- In case a virtual network has network peering's with virtual networks, which
  not in scope of the relocation, it is recommended to disconnect the virtual
  network peering while exporting the template so that configuration of peering
  is not copied into the exported template.
- DDOS Protection plan is a independent security resource that work with
  association with Virtual network. Azure provides basic DDos protection for
  virtual network by default. In case of Azure DDoS Protection Standard, DDoS
  Protection plan need to be created. **_Please Note_**: If source has Standard
  DDoS Protection plan then same need to redeployed prior virtual network using
  above steps in the target region.

### Consideration of Network Watcher Relocation along with Virtual network.

- The moment virtual network get deployed in specific region then Network
  Watcher get enabled for that virtual network for the same region. So, no need
  to relocation Network Watcher. However some configuration need to be completed
- Network Performance Monitor from Network Watcher, by enabling the same, will
  provide centralized view of the Network Monitoring. To accomplish the same,
  ensure that the workspace associated with NPM is in a supported region.
- Recreate NSG flow logs for the target virtual network. However, it is
  imperative to move diagnostic storage account prior to relocation of virtual
  network & NSG flow log as same will be used for configuration.

### [Redeploy with Data Migration](/relocation-playbook/relocation-strategies/redeployment-data-migration/)

The approach to redeploy with data migration is not applicable for Virtual
Network.

## Links

- [Migrate Azure virtual network across regions](https://docs.microsoft.com/en-us/azure/virtual-network/move-across-regions-vnet-portal)

## Relocation Backlog

- Feature Virtual Network Relocation
  - User Stories _[Ref - [Approach](/relocation-playbook/patterns/)]_
    - Manual assessment of Current Virtual Network and Dependencies from the
      prerequisites, dependencies, dependent resources sections.
  - Prepare planning
    - Workload readiness backlog
    - Dependencies resolution plan
    - prepare test plan (smoke tests, code tests, integration tests)
  - Prepare & Construct Cloud Automation
    - Construct scripts
    - Capture the setting of source Virtual Network instance based on the above
      redeploy steps
    - Construct IaC modules for dependent & Virtual Network
    - Update configuration parameters and details
  - Testing Relocation components
    - PoC Of Virtual Network on sandbox env at target & smoke testing
    - Relocate Virtual Network instance and dependencies to staging & perform
      UAT and performance testing
  - Live Relocation of Virtual Network to production
  - Update Dependent configurations
  - Validate target Virtual Network with all intact dependencies
    - Smoke testing target
    - Integration testing with dependencies
    - UAT
    - Performance testing

## Validation

Once the relocation is completed, the Virtual Network needs to be tested and
validated. Below are some of the recommended guidelines.

- Once the Virtual Network is relocated to the target region, it is highly
  advisable to run a smoke test and integration test (either through a script or
  manually) to validate and ensure all configurations and dependent resources
  have been properly linked and all configured data are accessible.
- Validation of Virtual Network components and integration.

- In case, if there was any source peering, then connectivity and communication
  need to be validated once the peering is reconfigured. For that
  [Network Watcher](https://docs.microsoft.com/en-us/samples/azure-samples/network-dotnet-use-network-watcher-to-check-connectivity/use-network-watcher-to-check-connectivity-between-virtual-machines-in-peered-networks/)
  tool can be used.