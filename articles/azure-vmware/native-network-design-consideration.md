---
title: Azure VMware Solution Generation 2 private cloud design considerations 
description: Learn about Azure VMware Solution Generation 2 private cloud design considerations.
ms.topic: concept-article
ms.service: azure-vmware
ms.date: 05/11/2026
ms.custom:
  - build-2025
# Customer intent: As a cloud administrator, I want to understand the design considerations for Azure VMware Solution Generation 2 private clouds so that I can effectively plan and implement my private cloud deployment while ensuring compliance with current limitations and requirements.
---

# Design considerations for Azure VMware Solution Generation 2 Private Clouds

This article outlines key design considerations for Azure VMware Solution Generation 2 (Gen 2) private clouds. It explains the capabilities this generation brings to VMware-based private cloud environments, enabling access for your applications from both on-premises infrastructure and Azure-based resources. There are several considerations to review before you set up your Azure VMware Solution Gen 2 private cloud. This article provides solutions for use cases that you might encounter when you're using the private cloud type.

> [!Note]
> Generation 2 is available in specific Azure public regions. Contact your Microsoft account team or Microsoft Support to confirm coverage.

## Limitations

The following functionality is limited during this time. These limitations will be lifted in the future:

- You can't delete your **Resource Group**, which contains your private cloud. You must delete the private cloud first before deleting the resource group.  
- You can only deploy **1 private cloud per Azure virtual network**.  
- You can only create **1 private cloud per Resource Group**. Multiple private clouds in a single Resource Group aren't supported. 
- Your private cloud and virtual network for your private cloud must be in the ***same*** Resource Group.  
- You can't ***move*** your private cloud from one Resource Group to another after the private cloud is created.  
- You can't ***move*** your private cloud from one tenant to another after the private cloud is created.  
- If you require **ExpressRoute FastPath** or **Global Virtual Network Peering** for your AVS Private Cloud, create a Support Case through the Azure portal. 
- **Service Endpoints** direct connectivity from Azure VMware Solution workloads isn't supported.
- **Private Endpoints when globally peered** across regions connected to Azure VMware Solution isn't supported.
- **vCloud Director** using Private Endpoints is supported. However, vCloud Director using Public Endpoints isn't supported.  
- **vSAN Stretched Clusters** isn't supported.
- **Public IP down to the VMware NSX Microsoft Edge** for configuring internet isn't supported. You can find what internet options are supported in [Internet connectivity options](native-internet-connectivity-design-considerations.md).  
- During **unplanned maintenance** – like a host hardware failure – on any of the first four hosts in your Software Defined Data Center (SDDC), you may experience a temporary North-South network connectivity disruption for some workloads, lasting up to 30 seconds. North-South connectivity refers to traffic between your AVS VMware workloads and external endpoints beyond the NSX-T Tier-0 (T0) Edge, such as Azure services or on-premises environments. This limitation was removed in specific Azure regions. Confirm whether your region is affected by this limitation by checking with Azure Support.  
- **Network Security Groups** associated with the private cloud host virtual network must be created in the ***same*** resource group as the private cloud and its virtual network.  
- **Cross-resource group and cross-subscription references** from customer virtual networks to the Azure VMware Solution virtual network aren't supported by default. This includes resource types such as: User-defined routes (UDRs), DDoS Protection Plans, and other linked networking resources. If a customer virtual network is associated with one of these references that resides in a different resource group or subscription than the Azure VMware Solution virtual network, network programming (such as NSX segment propagation) may fail. To avoid problems, customers should make sure the Azure VMware Solution virtual network isn't connected to resources in another resource group or subscription. Before continuing, remove any such connections, such as DDoS Protection Plans, from the virtual network.  
  - To maintain your cross-resource group reference, create a role assignment from your cross-resource group or subscription and give the "AzS VIS Prod App” the "AVS on Fleet VIS Role." The role assignment allows you to use reference and have your reference correctly applied for your Azure VMware Solution private cloud.  
- Gen 2 private cloud **deployments may fail if Azure policies enforce strict rules for Network Security Groups or route tables (for example, specific naming conventions)**. These policy constraints can block required Azure VMware Solution Network Security Group and route table creation during deployment. You must remove these policies from the Azure VMware Solution virtual network before deploying your private cloud. Once your private cloud is deployed, these policies can be added back to your Azure VMware Solution private cloud.  
- If you're using **Private DNS** for your Azure VMware Solution Gen 2 private cloud, using **Custom DNS** on the virtual network where an Azure VMware Solution Gen 2 private cloud is deployed is unsupported. Custom DNS breaks lifecycle operations such as scaling, upgrades, and patching.  
- If you're **deleting** your private cloud and some Azure VMware Solution created resources aren't removed, you can retry the deletion of the Azure VMware Solution private cloud using the Azure CLI.
- Azure VMware Solution Gen 2 uses an HTTP Proxy to distinguish between customer and management network traffic. Certain VMware cloud service endpoints **may not follow the same network path or proxy rules as general vCenter-managed traffic**. Examples include: "scapi.vmware" and "apigw.vmware." The VAMI proxy governs the vCenter Server Appliance’s (VCSA) general outbound internet access, but not all service endpoint interactions flow through this proxy. Some interactions originate directly from the user’s browser or from integration components, which instead follow the workstation’s proxy settings or initiate connections independently. As a result, traffic to VMware cloud service endpoints may bypass the VCSA proxy entirely.
- HCX RAV and Bulk migrations on Gen 2 can experience slower performance due to stalls during Base Sync and Online Sync phases. Customers should plan for longer migration windows and schedule waves accordingly for now. For suitable workloads, vMotion offers a faster, low‑overhead option when host and network conditions allow.
- Virtual HUB (virtual WAN) peering: To establish a peering connection between a Gen-2 virtual network and a virtual hub (virtual WAN), the virtual hub must be in the same region as the Gen-2 virtual network. If you need to peer with a virtual hub in a different region, you need to create a Support Case through the Azure portal.
- /32 route destination from peered Virtual Network (VNET): If you're advertising /32 routes from NSX (such as HCX MON routes or DNS forwarder routes) and need access to that /32 destination from a peered virtual network, you need to open a Support Case in the Azure portal. Connectivity to the /32 destination works correctly from within the local VNET.
- VNET Peer Sync Subnet advertisement and Azure Route Table (UDR) association – Azure VMware Solution Gen 2 utilizes two internal architectures. The current architecture synchronizes both specific subnets and the broader Azure address space for NSX segment or subnet routes with peered Azure virtual networks. As a result, with Gen 2’s current architecture, you may need to configure Azure route tables (UDR) with more specific NSX segment subnet routes rather than using general address space routes for Azure VMware Solution workload segments.
  
## Unsupported integrations

The following 1st-party and 3rd-party integrations aren't available:
- **Zerto DR**

## Delegated Subnets and Network Security Groups for Gen 2
When an Azure VMware Solution (AVS) Gen 2 private cloud is deployed, Azure automatically creates several delegated subnets within the private cloud’s host virtual network. These subnets are used to isolate and protect the private cloud’s management components.

Customers can manage access to these subnets using Network Security Groups (NSGs) that are visible in the Azure portal or through Azure CLI/PowerShell. In addition to customer-manageable NSGs, AVS applies extra system-managed NSGs to critical management interfaces. These system-managed NSGs aren't visible or editable by customers and exist to ensure that the private cloud remains secure by default.

As part of the default security posture:
- Internet access is disabled for the private cloud unless the customer explicitly enables it.
- Only required management traffic is allowed to reach platform services.

> [!Note]
> You may see a warning in the Azure portal indicating that certain ports appear to be exposed to the internet. This occurs because the portal evaluates only the customer-visible Network Security Group (NSG) configuration. However, Azure VMware Solution also applies additional system-managed Network Security Groups that aren't visible in the portal. These system-managed Network Security Groups block inbound traffic unless access has been explicitly enabled through Azure VMware Solution configuration.

This design keeps the AVS environment secure and separated by default, while still letting customers manage and adjust network access to fit their needs.

## Routing and subnet considerations

Azure VMware Solution Gen 2 private clouds provide a VMware private cloud environment accessible to users and applications from on-premises and Azure-based environments or resources. Connectivity is delivered through standard Azure Networking. Specific network address ranges and firewall ports are required to enable these services. This section helps you configure your networking to work with Azure VMware Solution. 

The private cloud connects to your Azure virtual network using standard Azure networking. Azure VMware Solution Gen 2 private clouds require a minimum /22 CIDR network address block for subnets. This network complements your on-premises networks, so the address block shouldn't overlap with address blocks used in other virtual networks in your subscription and on-premises networks. Management, vMotion, and Replication networks are provisioned automatically within this address block as subnets inside your virtual network.

> [!Note]
> Permitted ranges for your address block are the RFC 1918 private address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), except for 172.17.0.0/16. Replication network isn't applicable to AV64 nodes and is planned for general deprecation at a future date.

Avoid using the following IP schema reserved for VMware NSX usage: 

- 169.254.0.0/24 - used for internal transit network 
- 169.254.2.0/23 - used for inter-VRF transit network 
- 100.64.0.0/16 - used to connect T1 and T0 gateways internally 
- 100.73.x.x – used by Microsoft’s management network

> [!Note]
> Most of the subnets listed in the table will show up as subnets within the Azure virtual network. Please do not make manual changes to the subnet configuration on these, as they are managed by the Azure VMware Solution control plane and any modifications could have negative consequences.

Example /22 CIDR network address block **10.31.0.0/22** is divided into the following subnets: 

|**Network Usage** |**Subnet** |**Description** |**Example** |
| :-- | :-- | :-- | :-- |
|VMware NSX Network | /27 | NSX Manager network. | 10.31.0.0/27 |
|vCSA Network | /27 | vCenter Server network. | 10.31.0.32/27  |
|avs-mgmt| /27|The management appliances (vCenter Server, NSX manager and HCX cloud manager) are behind the "avs-mgmt” subnet, programmed as secondary IP ranges on this subnet. You may need to adjust the route tables associated with this subnet if your network traffic, for your management appliances, needs to route through an NVA or firewall | 10.31.0.64/27  |
|avs-vnet-sync| /27 |Used by Azure VMware Solution Gen 2 to program routes created in VMware NSX into the virtual network. | 10.31.0.96/27 |
|avs-services | /27 |Used for Azure VMware Solution Gen 2 provider services. Also used to configure private DNS resolution for your private cloud. | 10.31.0.224/27  |
|avs-nsx-gw, avs-nsx-gw-1| /27 |The two avs-nsx-gw subnets handle all outbound traffic from Azure VMware Solution to the Virtual Network and beyond. Therefore, Azure route tables (UDR) and Network Security Groups (NSG) should be applied to these subnets in every scenario. In initial AVS Gen-2 private clouds, these subnets also manage incoming traffic, with all NSX segment subnets configured as secondary IPs. In current AVS Gen-2 private clouds, a third subnet known as "avs-network-infra-gw” is added to handle all incoming traffic. Now, all NSX segments are assigned to this subnet rather than the avs-nsx-gw subnets.  |10.31.0.128/27, 10.31.0.160/27 |
|avs-network-infra-gw|/26|When this subnet is present, it handles incoming traffic for all NSX workloads from VNET and is used by Azure VMware Solution management to configure NSX segment subnets as secondary IPs. Avoid associating any Azure route table with this subnet; instead, use the "avs-nsx-gw” subnet to manage outbound AVS traffic, such as to Azure Firewall or third-party Network Virtual Appliances (NVA).|10.31.2.128/26|
|esx-mgmt-vmk1 | /25 |vmk1 is the management interface used by customers to access the host. IPs from the vmk1 interface come from these subnets. All of the vmk1 traffic for all hosts comes from this subnet range. | 10.31.1.0/25  |
|esx-vmotion-vmk2 | /25 | vMotion VMkernel interfaces. | 10.31.1.128/25  |
|esx-vsan-vmk3  | /25 | vSAN VMkernel interfaces and node communication. | 10.31.2.0/25 |
|Reserved | /27 | Reserved Space. | 10.31.0.128/27 |
|Reserved | /27 | Reserved Space. | 10.31.0.192/27 |

> [!Note]
> For Azure VMware Solution Gen 2 deployments, customers must now allocate an two additional /24 subnets for HCX management and uplink, in addition to the /22 entered during SDDC deployment. In AVS Gen 2, only the HCX mgmt and HCX uplink subnets are required. The vMotion and replication networks aren't required for AVS Gen 2.

## NSX Routes programming on to Azure Virtual Network

Azure VMware Solution Gen-2 NSX routes are integrated into Azure by using address-space and assigning them as secondary IPs on the "avs-network-infra-gw” system-created subnet, enabling smooth connectivity between Azure and AVS customer workloads. When NSX Tier-0 advertises a route based on user settings—such as creating segments, adding static routes, or using HCX MON virtual machines—the Azure VMware Solution control plane checks whether the route prefix exists in the virtual network address space. If it doesn't, it creates the address-space and adds the route prefix as secondary IPs on the "avs-network-infra-gw” subnet. For Tier-0 advertised /32 routes, like HCX MON routes, secondary IPs aren't set, but the data plane is internally configured to ensure connectivity to /32 destinations on Azure VMware Solution.

Along with the address space and subnet update for NSX routes, there's internal programming that customers should be aware of, especially regarding supported scale when lower subnet masks are used. For more information on the scale aspect, see [Route architecture for Azure VMware Solution Gen 2](native-network-routing-architecture.md)

## Azure Route Table (UDR) Association consideration

Azure VMware Solution Gen-2 includes two internal architectures, with slight variation. Some of the initial Gen-2 private clouds use the initial internal architecture. These are updated to the current architecture through scheduled maintenance, coordinated with the customer. However, there's change in behavior with current architecture, compared to initial architecture, that may affect certain network design considerations, as described below.

**Initial Gen-2 private cloud's:**
-	Azure VNET has two base gateway subnets named "avs-nsx-gw” and doesn't have the "avs-network-infra-gw” subnet as in the current architecture.
-	All AVS NSX segment subnets are programmed under "avs-nsx-gw” subnet as additional IPv4 address for connecting Azure to NSX workloads.
-	The route table (UDR) or Azure NSG for traffic from AVS to Azure VNET and beyond (say on-premises) need to be applied to the "avs-nsx-gw” subnet.

**Current Gen-2 private cloud's:**

Be sure to take note of this change in behavior. 

-	Azure VNET would see additional subnet prefixed "avs-network-infra-gw” along with two base gateway subnets with name "avs-nsx-gw” like in initial architecture.
-	All AVS NSX segment subnets are now programmed under this subnet as secondary IPv4 address for connecting Azure to NSX workloads. This doesn't change customer network connectivity.
-	VNET peering advertises both the address space and subnets to the peered VNET, which differs from initial architecture or Azure native VNET sync where only the address space is synchronized.

:::image type="content" source="media/native-connectivity/native-gen-2-nsx-gateway-subnets.png" alt-text="Diagram showing the native Gen-2 gateway subnets." border="false" lightbox="media/native-connectivity/native-gen-2-nsx-gateway-subnets.png":::

**Design Considerations due to changes in Gen-2 internal architecture**

-	Customers observe additional effective routes for AVS subnets within the peered VNET due to change in VNET peer sync behavior.
-	If a customer uses an Azure route table (UDR) to send traffic from on‑premises to AVS through a firewall or network virtual appliance, they should update the UDR to use specific NSX subnet routes instead of the broad supernet address range used before. This is required to prevent traffic destined for AVS from taking more specific VNET subnet routes, bypassing intended firewall, due to longest prefix match [behavior of Azure routing](../virtual-network/virtual-networks-udr-overview.md#how-azure-selects-routes-for-traffic-routing). Otherwise, this can result in asymmetric routing, potentially causing connectivity problems.
-	However, the route table (UDR) or Azure NSG for traffic from AVS to Azure VNET and beyond (say on-premises) would continue to be applied to the "avs-nsx-gw” subnets, not "avs-network-infra-gw.” Customers shouldn't use the route table (UDR) on the "avs-network-infra-gw” subnet, even if NSX segment subnets are configured there as secondary IPs.

## Next steps

- Get started with configuring your Azure VMware Solution service principal as a prerequisite. To learn how, see the [Enabling Azure VMware Solution service principal](native-first-party-principle-security.md) quickstart.
  
- Follow a tutorial for [Creating an Azure VMware Gen 2 Private Cloud](native-create-azure-vmware-virtual-network-private-cloud.md)
