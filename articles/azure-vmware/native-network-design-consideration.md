---
title: Azure VMware Solution Generation 2 private cloud design considerations 
description: Learn about Azure VMware Solution Generation 2 private cloud design considerations.
ms.topic: concept-article
ms.service: azure-vmware
ms.date: 12/16/2025
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

1. You cannot delete your **Resource Group**, which contains your private cloud. You must delete the private cloud first before deleting the resource group.  
2. You can only deploy **1 private cloud per Azure virtual network**.  
1. You can only create **1 private cloud per Resource Group**. Multiple private clouds in a single Resource Group are not supported. 

4. Your private cloud and virtual network for your private cloud must be in the ***same*** Resource Group.  
5. You cannot ***move*** your private cloud from one Resource Group to another after the private cloud is created.  
6. You cannot ***move*** your private cloud from one tenant to another after the private cloud is created.  
1. **Service Endpoints** direct connectivity from Azure VMware Solution workloads isn't supported.

1. **Private Endpoints when globally peered** across regions connected to Azure VMware Solution isn't supported.

9. **vCloud Director** using Private Endpoints is supported. However, vCloud Director using Public Endpoints isn't supported.  
1. **vSAN Stretched Clusters** isn't supported.

11. **Public IP down to the VMware NSX Microsoft Edge** for configuring internet will not be supported. You can find what internet options are supported in [Internet connectivity options](native-internet-connectivity-design-considerations.md).  
1. During **unplanned maintenance** – like a host hardware failure – on any of the first four hosts in your SDDC, you may experience a temporary North-South network connectivity disruption for some workloads, lasting up to 30 seconds. North-South connectivity refers to traffic between your AVS VMware workloads and external endpoints beyond the NSX-T Tier-0 (T0) Edge, such as Azure services or on-premises environments. This limitation has been removed in specific Azure regions. Check with with Azure Support to see if your region is affected by this limitation.
13. **Network Security Groups** associated with the private cloud host virtual network must be created in the ***same*** resource group as the private cloud and its virtual network.  
14. **Cross-resource group and cross-subscription references** from customer virtual networks to the Azure VMware Solution virtual network are not supported by default. This includes resource types such as: User-defined routes (UDRs), DDoS Protection Plans, and other linked networking resources. If a customer virtual network is associated with one of these references that resides in a different resource group or subscription than the Azure VMware Solution virtual network, network programming (such as NSX segment propagation) may fail. To avoid issues, customers must ensure that the Azure VMware Solution virtual network isn't linked to resources in a different resource group or subscription and detach such resources (for example, DDoS Protection Plans) from the virtual network before proceeding.  
    - To maintain your cross-resource group reference, create a role assignment from your cross-resource group or subscription and give the “AzS VIS Prod App” the "AVS on Fleet VIS Role". The role assignment allows you to use reference and have your reference correctly applied for your Azure VMware Solution private cloud.  
15. Gen 2 private cloud **deployments may fail if Azure policies that enforce strict rules for Network Security Groups or route tables (for example, specific naming conventions)**. These policy constraints can block required Azure VMware Solution Network Security Group and route table creation during deployment. You must remove these policies from the Azure VMware Solution virtual network before deploying your private cloud. Once your private cloud is deployed, these policies can be added back to your Azure VMware Solution private cloud.  
16. If you are using **Private DNS** for your Azure VMware Solution Gen 2 private cloud, using **Custom DNS** on the virtual network where an Azure VMware Solution Gen 2 private cloud is deployed is unsupported. Custom DNS breaks lifecycle operations such as scaling, upgrades, and patching.  
17. If you are **deleting** your private cloud and some Azure VMware Solution created resources are not removed, you can retry the deletion of the Azure VMware Solution private cloud using the Azure CLI.
18. Azure VMware Solution Gen 2 uses an HTTP Proxy to distinguish between customer and management network traffic. Certain VMware cloud service endpoints **may not follow the same network path or proxy rules as general vCenter-managed traffic**. Examples include: "scapi.vmware" and "apigw.vmware". The VAMI proxy governs the vCenter Server Appliance’s (VCSA) general outbound internet access, but not all service endpoint interactions flow through this proxy. Some interactions originate directly from the user’s browser or from integration components, which instead follow the workstation’s proxy settings or initiate connections independently. As a result, traffic to VMware cloud service endpoints may bypass the VCSA proxy entirely.
19. HCX RAV and Bulk migrations on Gen 2 can experience significantly slower performance due to stalls during Base Sync and Online Sync phases. Customers should plan for longer migration windows and schedule waves accordingly for now. For suitable workloads, vMotion offers a faster, low‑overhead option when host and network conditions allow.

## Unsupported integrations

The following 1st-party and 3rd-party integrations aren't available:
- **Zerto DR**

## Delegated Subnets and Network Security Groups for Gen 2
When an Azure VMware Solution (AVS) Gen 2 private cloud is deployed, Azure automatically creates several delegated subnets within the private cloud’s host virtual network. These subnets are used to isolate and protect the private cloud’s management components.

Customers can manage access to these subnets using Network Security Groups (NSGs) that are visible in the Azure portal or through Azure CLI/PowerShell. In addition to customer-manageable NSGs, AVS applies additional system-managed NSGs to critical management interfaces. These system-managed NSGs are not visible or editable by customers and exist to ensure that the private cloud remains secure by default.

As part of the default security posture:
- Internet access is disabled for the private cloud unless the customer explicitly enables it.
- Only required management traffic is allowed to reach platform services.

> [!Note]
> You may see a warning in the Azure portal indicating that certain ports appear to be exposed to the internet. This occurs because the portal evaluates only the customer-visible Network Security Group (NSG) configuration. However, Azure VMware Solution also applies additional system-managed Network Security Groups that are not visible in the portal. These system-managed Network Security Groups block inbound traffic unless access has been explicitly enabled through Azure VMware Solution configuration.

This design ensures that the AVS environment is isolated and secure out of the box, while still allowing customers to control and customize network access based on their specific requirements.

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

Example /22 CIDR network address block **10.31.0.0/22** is divided into the following subnets: 

|**Network Usage** |**Subnet** |**Description** |**Example** |
| :-- | :-- | :-- | :-- |
|VMware NSX Network | /27 | NSX Manager network. | 10.31.0.0/27 |
|vCSA Network | /27 | vCenter Server network. | 10.31.0.32/27  |
|avs-mgmt| /27|The management appliances (vCenter Server and NSX manager) are behind the "avs-mgmt” subnet, programmed as secondary IP ranges on this subnet. You may need to adjust the route tables associated with this subnet if your network traffic, for your management appliances, needs to route through an NVA or firewall | 10.31.0.64/27  |
|avs-vnet-sync| /27 |Used by Azure VMware Solution Gen 2 to program routes created in VMware NSX into the virtual network. | 10.31.0.96/27 |
|avs-services | /27 |Used for Azure VMware Solution Gen 2 provider services. Also used to configure private DNS resolution for your private cloud. | 10.31.0.224/27  |
|avs-nsx-gw, avs-nsx-gw-1| /27 |Subnets off each of the T0 Gateways per edge. These subnets are used to program VMware NSX network segments as secondary IPs addresses. |10.31.0.128/27, 10.31.0.160/27 |
|esx-mgmt-vmk1 | /25 |vmk1 is the management interface used by customers to access the host. IPs from the vmk1 interface come from these subnets. All of the vmk1 traffic for all hosts comes from this subnet range. | 10.31.1.0/25  |
|esx-vmotion-vmk2 | /25 | vMotion VMkernel interfaces. | 10.31.1.128/25  |
|esx-vsan-vmk3  | /25 | vSAN VMkernel interfaces and node communication. | 10.31.2.0/25 |
|avs-network-infra-gw|/26|Used by Azure VMware Solution management for programming NSX segments. Customers do no need to modify this subnet because it s only used for Azure VMware Solution infrastructure.|10.31.2.128/26|
|Reserved | /27 | Reserved Space. | 10.31.0.128/27 |
|Reserved | /27 | Reserved Space. | 10.31.0.192/27 |

> [!Note]
> For Azure VMware Solution Gen 2 deployments, customers must now allocate an two additional /24 subnets for HCX management and uplink, in addition to the /22 entered during SDDC deployment. These additional /24s are not required for Gen 1.

## Next steps

- Get started with configuring your Azure VMware Solution service principal as a prerequisite. To learn how, see the [Enabling Azure VMware Solution service principal](native-first-party-principle-security.md) quickstart.
  
- Follow a tutorial for [Creating an Azure VMware Gen 2 Private Cloud](native-create-azure-vmware-virtual-network-private-cloud.md)
