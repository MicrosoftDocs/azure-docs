---
title: Network planning for Oracle Database@Azure
description: Learn about network planning for Oracle Database@Azure. 
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.custom: engagement-fy23
ms.date: 12/12/2023
---
# Network planning for Oracle Database@Azure
In this article, learn about network topologies and constraints in Oracle Database@Azure.
After you purchase an offer through Azure Marketplace and provision the Oracle Exadata infrastructure, the next step is to create your virtual machine cluster to host your instance of Oracle Exadata Database@Azure. The Oracle database clusters are connected to your Azure virtual network via a virtual network interface card (virtual NIC) from your delegated subnet (delegated to `Oracle.Database/networkAttachment`).  

## Network features

There are two types of network features: default and advance.

### Default network features
Default network features enable basic network connectivity for both new and existing Oracle Database@Azure deployments. These features are available across all supported Oracle Database@Azure regions and provide the foundational networking required for your deployment
### Advanced network features 
Advanced network features enhance the virtual networking experience, offering improved security, performance, and control—similar to standard Azure VMs. These features are generally available for new deployments in the following regions:

* Australia East
* Australia Southeast
* Canada Central
* Central US 
* East US 
* East US2
* South Central US
* US West  
* UK South 
* UK West
* Germany West Central 

> [!NOTE]
> Advanced network features are currently supported only for new Oracle Database@Azure deployments. 
> Existing virtual networks with previously created Oracle Database@Azure delegated subnets will not support these features at this time. Support for existing deployments is planned for later this year. 
> ### Registration required for delegated subnets
>To use advanced network features, use the following commands (via AZCLI) to register before creating your virtual network for the Oracle Database@Azure deployment.
>
> ```Register-AzProviderFeature  -FeatureName "EnableRotterdamSdnApplianceForOracle" -ProviderNamespace "Microsoft.Baremetal" ```
>
> ```Register-AzProviderFeature  -FeatureName "EnableRotterdamSdnApplianceForOracle" -ProviderNamespace "Microsoft.Network" ```

> [!NOTE]
> Registration state can be in the 'Registering' state for up to 60 minutes before changing to 'Registered'. Wait until the status is 'Registered' before continuing with the delegated subnet creation. 

## Supported topologies

The following table describes the network topologies that are supported by each configuration of network features for Oracle Database@Azure.

|Topology |Default network features | Advanced network features |
| :------------------- |---------------:| ---------------:|
|Connectivity to an Oracle database cluster in a local virtual network| Yes | Yes |
|Connectivity to an Oracle database cluster in a peered virtual network (in the same region)|Yes |Yes |
|Connectivity to an Oracle database cluster in a spoke virtual network in a different region with a virtual wide area network (virtual WAN) |Yes | Yes |
|Connectivity to an Oracle database cluster in a peered virtual network in different region (Global Peering) | No| Yes |
|On-premises connectivity to an Oracle database cluster via global and local Azure ExpressRoute |Yes| Yes|
|Azure ExpressRoute FastPath |No | Yes|
|Connectivity from on-premises to an Oracle database cluster in a spoke virtual network over an ExpressRoute gateway and virtual network peering with a gateway transit|Yes | Yes|
|On-premises connectivity to a delegated subnet via a virtual private network (VPN) gateway | Yes | Yes|
|Connectivity from on-premises to an Oracle database in a spoke virtual network over a VPN gateway and virtual network peering with gateway transit| Yes | Yes|
|Connectivity over active/passive VPN gateways| Yes |Yes|
|Connectivity over active/active VPN gateways| No | Yes|
|Connectivity over zone-redundant, zonal ExpressRoute gateways | Yes | Yes|
|Transit connectivity via a virtual WAN for an Oracle database cluster provisioned in a spoke virtual network| Yes |Yes|
|On-premises connectivity to an Oracle database cluster via a virtual WAN and attached software-defined wide area network (SD-WAN)|No|Yes|
|On-premises connectivity via a secured hub (a firewall network virtual appliance) |Yes|Yes|
|Connectivity from an Oracle database cluster on Oracle Database@Azure nodes to Azure resources|Yes|Yes|

## Constraints

The following table describes required configurations of supported network features.

|Features |Default network features | Advanced network features |
| :------------------- | -------------------: | -------------------: |
|Delegated subnet per virtual network |1| 1|
|[Network security groups](../../virtual-network/network-security-groups-overview.md) on Oracle Database@Azure delegated subnets|No| Yes |
|[User-defined routes (UDRs)](../../virtual-network/virtual-networks-udr-overview.md#user-defined) on Oracle Database@Azure delegated subnets|Yes| Yes|
|Connectivity from an Oracle database cluster to a [private endpoint](../../private-link/private-endpoint-overview.md) in the same virtual network on Azure-delegated subnets|No| Yes|
|Connectivity from an Oracle database cluster to a [private endpoint](../../private-link/private-endpoint-overview.md) in a different spoke virtual network connected to a virtual WAN|Yes| Yes|
|NSG support on the Private link | No| Yes| 
| Connectivity to serverless Apps like Azure functions via private endpoints | No| Yes|
| Azure SLB and ILB support for Oracle database cluster traffic  | No | No |
|Dual stack (IPv4 and IPv6) virtual network|Only IPv4 is supported| Only IPv4 is supported|
| Service tags support| No | Yes | 

> [!NOTE]
> When using NSGs (Network Security Groups) on the Azure side, ensure that any security rules configured on the Oracle (OCI) side are reviewed to avoid conflicts. While applying security policies on both Azure and OCI can enhance the overall security posture, it also introduces additional complexity in terms of management and requires careful manual synchronization between the two environments. Misalignment between these policies could lead to unintended access issues or operational disruptions. 


 ### UDR requirements for routing traffic to Oracle Database@Azure
When routing traffic to Oracle Database@Azure through a Network Virtual Appliance (NVA)/firewall, the User-Defined Route (UDR) prefix **must be at least as specific as the subnet delegated to the Oracle Database@Azure instance**. Broader prefixes may cause traffic to be dropped.
 
 If the delegated subnet for your instance is x.x.x.x/27, configure the UDR on the Gateway Subnet as:  

 | Route Prefix | Routing Outcome |
 |--------------|-----------------|
 |x.x.x.x/27 | (same as the subnet) ✅ | 
 |x.x.x.x/32 |(more specific) ✅| 
 |x.x.x.x/24 | (too broad) ❌ |

#### Topology-specific guidance
**Hub-and-spoke topology**
- Define the UDR on the gateway subnet.
- Use a route prefix of `x.x.x.x/27` or more specific.
- Set the next hop to your NVA/Firewall.

**Virtual WAN (VWAN)**
- **With Routing Intent**:
  - Add the delegated subnet prefix (`x.x.x.x/27`) to the Routing Intent’s list of prefixes.

- **Without Routing Intent**:
  - Add a route to the VWAN's route table for `x.x.x.x/27` and point the next hop to the NVA/firewall.

> [!Note]
>   When **advanced network features are not enabled**, and for **traffic originating from the Oracle Database@Azure delegated subnet that needs   to traverse a gateway** (for example, to reach on-premises networks, AVS, other clouds, etc.), you must configure specific UDRs on the delegated subnet.  
>These UDRs should define the specific destination IP prefixes and set the next hop to the appropriate NVA/firewall in the hub.  
> Without these routes, outbound traffic may bypass required inspection paths or fail to reach the intended destination.

 

## FAQ 
### What are advanced network features? 
Advanced network features enhance your virtual networking experience by providing better security, performance, and control—similar to standard Azure virtual machines. With this feature, customers can use native VNet integrations like Network Security Groups (NSG), User-Defined Routes (UDR), Private Link, Global VNet Peering, and ExpressRoute FastPath without needing any workarounds. 
### Will advanced network features work for existing deployments? 
Not at the moment. Support for existing deployments is on our roadmap, and we’re actively working to enable it. Stay tuned for updates in the near future. 
### Do I need to self-register to enable advanced network features for new deployments? 
Yes. To take advantage of advanced network features for new deployments, you must complete a registration process. Please run the registration commands before creating a new VNet and delegated subnet for your Oracle Database@Azure deployments. 
### How can I check if my deployment supports advanced network features? 
Currently, there’s no direct way to verify whether a VNet supports advanced network features. We recommend tracking your feature registration timeline and associating it with the VNets created afterward. You can also use the Activity Log blade under the VNet to review creation details—but note, logs are only available for the past 90 days by default. 


## Related content
* [Overview of Oracle Database@Azure](database-overview.md)
* [Onboard Oracle Database@Azure](onboard-oracle-database.md)
* [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
* [Support for Oracle Database@Azure](oracle-database-support.md)
* [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
