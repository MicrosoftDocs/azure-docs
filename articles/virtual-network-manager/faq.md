---
title: Frequently asked questions about Azure Virtual Network Manager
description: Find answers to frequently asked questions about Azure Virtual Network Manager.
services: virtual-network-manager
author: mbender-ms
ms.service: azure-virtual-network-manager
ms.topic: faq
ms.date: 02/24/2026
ms.author: mbender
ms.custom:
  - references_regions
  - build-2025
---

# Azure Virtual Network Manager FAQ

This article answers frequently asked questions about Azure Virtual Network Manager.

## General

### Which Azure regions support Azure Virtual Network Manager?

For current information about region support, refer to [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=virtual-network-manager).

> [!NOTE]
> Many Azure regions support [availability zones](/azure/reliability/availability-zones-region-support). To see which regions support availability zones, see the [Azure regions list](/azure/reliability/regions-list).

### What are common use cases for Azure Virtual Network Manager?

* You can create network groups to meet the security requirements of your environment and its functions. For example, you can create network groups for your production and test environments to manage their connectivity and security rules at scale.

  For security admin rules, you can create a security admin configuration with two rule collections. Each rule collection is targeted on your production and test network groups, respectively. After deployment, this configuration enforces one set of security admin rules for network resources for your production environment, and another set for your test environment.

* You can apply connectivity configurations to create a mesh or a hub-and-spoke network topology for a large number of virtual networks across your organization's subscriptions.

* You can deny high-risk traffic. As an administrator of an enterprise, you can block specific protocols or sources that override any network security group rules that would normally allow the traffic.

* You can force-allow traffic. For example, you might permit a specific security scanner to always have inbound connectivity to all your resources, even if network security group rules are configured to deny the traffic.

### What's the cost of using Azure Virtual Network Manager?

Azure Virtual Network Manager charges are based on the number of virtual networks with an active Virtual Network Manager configuration deployed onto it. For example, if a Virtual Network Manager scope contains 100 virtual networks but configurations have only been deployed onto five of those virtual networks, you'll be charged for those five virtual networks (not all 100). Also note that a charge for peering applies to the traffic volume of virtual networks that are managed by a deployed connectivity configuration (either mesh or hub-and-spoke).

If a virtual network has multiple configurations deployed onto it by the same Virtual Network Manager instance, that virtual network only incurs a single charge rate; it will not duplicate charges. For example, if a Virtual Network Manager deploys both a connectivity configuration and a security admin configuration onto the same set of five virtual networks, you'll be charged for those five virtual networks, but not charged twice. This cost doesn't account for multiple configurations unless the configurations originate from different Virtual Network Manager instances. 

Before February 2025, Azure Virtual Network Manager charges were based by default on the number of subscriptions that contained a virtual network with an active Virtual Network Manager configuration deployed onto it. If you created your Virtual Network Manager instance prior to February 2025, you can choose to [switch your pricing to the virtual network-based pricing](overview.md#pricing).

Azure Virtual Network Manager's [**network verifier**](concept-virtual-network-verifier.md) tool charges per reachability analysis run in an Azure Virtual Network Manager verifier workspace. This charge is separate from Azure Virtual Network Manager charges. 

Azure Virtual Network Manager's [**IP address management**](concept-ip-address-management.md) feature charges per active IP address managed by Azure Virtual Network Manager's IP address management tool at an hourly rate. An active IP address is defined as any IP address associated with a network interface in a virtual network that is associated with an IP pool. This charge is separate from Azure Virtual Network Manager charges. 

You can find current pricing for your region on the [Azure Virtual Network Manager pricing](https://azure.microsoft.com/pricing/details/virtual-network-manager/) page.

### How do I deploy Azure Virtual Network Manager?

You can deploy and manage an Azure Virtual Network Manager instance and configurations through various tools, including:

* [Azure portal](create-virtual-network-manager-portal.md)
* [Azure CLI](create-virtual-network-manager-cli.md)
* [Azure PowerShell](create-virtual-network-manager-powershell.md)
* [ARM Template](create-virtual-network-manager-template.md)
* [Terraform](create-virtual-network-manager-terraform.md)
* [Bicep](create-virtual-network-manager-bicep.md)

## Technical

### What's the difference between static and dynamic network group membership?

A static network group is populated manually by explicitly adding virtual networks. A dynamic network group uses Azure Policy-based rules to determine membership automatically based on conditions such as subscription, tags, or resource group. This lets both existing and newly created virtual networks that match the rule join the network group automatically.

### Can a virtual network belong to multiple Azure Virtual Network Manager instances?

Yes, a virtual network can belong to more than one Azure Virtual Network Manager instance.

### How does Azure Virtual Network Manager scope work: management group vs. subscription vs. resource group?

Azure Virtual Network Manager supports scopes at the management group and subscription levels. If you scope a network manager to a management group, child subscriptions and their resources are included in that scope. If you need a narrower target such as a specific resource group, use network group membership rules to include only the virtual networks that match the resource group condition.

### When should I use hub-and-spoke versus mesh, and can they coexist?

Yes. Hub-and-spoke and mesh can coexist. Hub-and-spoke is useful when spokes need shared services in the hub such as gateways, firewalls, or other central infrastructure. Mesh is useful when selected spoke virtual networks need direct connectivity to each other for performance or latency reasons. A common pattern is to keep hub-and-spoke for shared services while placing a subset of spokes into a mesh so those spokes can communicate directly.

### Does Azure Virtual Network Manager replace user-defined routes for transitive routing through a firewall hub?

No. Azure Virtual Network Manager doesn't automatically replace user-defined routes when you want spoke-to-spoke or outbound traffic to flow through a firewall or network virtual appliance in the hub. You still need routing rules to steer traffic to that next hop. Azure Virtual Network Manager can help manage those routing settings at scale by applying a consistent routing configuration across existing and newly created virtual networks or subnets.

### Can spoke virtual networks be connected to a Virtual WAN hub while in a mesh connectivity configuration so that those spoke virtual networks can communicate directly?

Yes, spoke virtual networks can connect to Virtual WAN hubs while in the mesh connectivity configuration. Those virtual networks in the meshed group have direct connectivity with each other.

[!INCLUDE [virtual-network-manager-virtual-wan-hub-preview-includes](../../includes/virtual-network-manager-virtual-wan-hub-preview-includes.md)]

### Will operations to the IP prefixes in virtual networks that are a part of the Azure Virtual Network Manager mesh propagate automatically? 

Virtual networks in the mesh are automatically in sync. IP prefixes will be updated automatically. This means traffic within the mesh will work even after there are changes in IP prefixes in virtual networks in the mesh.

### Can Azure Virtual Network Manager manage cross-region hub-and-spoke or global peering?
Yes. Azure Virtual Network Manager can manage cross-region connectivity scenarios, including global connectivity patterns. The latency and cost characteristics remain the same as the underlying Azure networking construct, such as global virtual network peering. Azure Virtual Network Manager centralizes management and automation.

### How do I verify a mesh connectivity configuration is applied as intended? 

Refer to the documentation [How to view applied configurations](how-to-view-applied-configurations.md). A mesh connectivity configuration doesn't connect virtual networks with virtual network peering, so you can't see the mesh connectivity in peering blades.

### What happens if the region where the Azure Virtual Network Manager is created is down? Does it affect deployed configurations or only prevent configuration changes?

Only the ability to change configurations will be impacted. Once Azure Virtual Network Manager has programmed the configuration after you commit the configuration, it will continue to operate. For example, if the Azure Virtual Network Manager instance is created in region 1 and the mesh topology is established in region 2, the mesh in region 2 will continue to function even if region 1 becomes unavailable. 

### How do configuration changes propagate to virtual networks?

Configurations don't take effect until you deploy them to the target regions. After you create or update a configuration and deploy it, Azure Virtual Network Manager applies the configuration to the in-scope virtual networks in those regions.

### How do I roll back a connectivity or security configuration if it causes a problem?

You can roll back through the deployment model. If a configuration causes an issue in a region, remove or change the deployment for that region so the configuration no longer applies there.

### What is a global mesh network topology?

A global mesh allows for virtual networks across regions to communicate with one another. The effects are similar to how global virtual network peering works.

### Can I use Terraform with Azure Virtual Network Manager?

Yes. Azure Virtual Network Manager is supported through the AzureRM Terraform provider. ARM templates and Bicep are also supported, so you can manage Azure Virtual Network Manager resources and configurations through infrastructure as code workflows.

### How does Azure Virtual Network Manager integrate with monitoring and diagnostics?

You can use Azure monitoring tools to observe and troubleshoot Azure Virtual Network Manager behavior. Network Watcher can help analyze traffic and troubleshoot whether traffic is blocked by a rule. Flow logs can help inspect traffic patterns, and Azure Monitor Logs plus diagnostic settings can capture configuration and operational events.

### How do I audit who changed Azure Virtual Network Manager resources or configurations?

Use Azure Activity Log. It records control-plane operations, including who performed the action, what operation was performed, and when it occurred.

### Does Azure Virtual Network Manager automatically route spoke traffic through Azure Firewall in the hub?

No. Azure Virtual Network Manager doesn't automatically send spoke traffic through Azure Firewall just because a firewall exists in the hub. To route traffic through the firewall, configure routing so the desired prefixes use the firewall as the next hop, and use Azure Virtual Network Manager to apply that routing pattern at scale.

### How does Azure Virtual Network Manager work with ExpressRoute or VPN gateways in the hub?

In a hub-and-spoke topology, you can configure spokes to use the hub's remote gateway. When that option is enabled, spoke virtual networks can use the ExpressRoute or VPN gateway in the hub.

### Is there a limit to how many network groups I can create?

There's no limit to how many network groups you can create.

### How do security admin rules interact with network security groups?

Security admin rules are evaluated before network security group rules. If a security admin rule denies traffic, the traffic is blocked before the network security group is evaluated. This means security admin rules can block traffic that a network security group would otherwise allow.

### How do I handle exceptions to organization-wide security admin rules?

Use a separate network group for the exception scope and apply a higher priority security admin rule to that group. For example, you might deny inbound SSH from the internet for a broad network group, then create a smaller exception network group for a specific workload team and apply a higher priority allow rule for SSH to that group.

### How do I remove the deployment of all applied configurations?

You need to deploy a **None** configuration to all regions where you have a configuration applied.

### Can I add virtual networks from another subscription that I don't manage?

Yes, if you have the appropriate permissions to access those virtual networks.

### How does the deployment of configuration differ between network groups with manually added members and conditionally added members?

See [Configuration deployments in Azure Virtual Network Manager](concept-deployments.md).

### How do I delete an Azure Virtual Network Manager component?

See [Remove and update Azure Virtual Network Manager components checklist](concept-remove-components-checklist.md).

### Does Azure Virtual Network Manager store customer data?

No. Azure Virtual Network Manager doesn't store any customer data.

### Can an Azure Virtual Network Manager instance be moved?

No. Azure Virtual Network Manager doesn't currently support the ability to move its instance to another region, resource group, or subscription. If you need to move an instance, consider deleting it and using the Azure Resource Manager template to create another one in the desired location.

### Can I move a subscription with an Azure Virtual Network Manager to another tenant?

No, moving the subscription where the Azure Virtual Network Manager instance exists to another tenant isn't supported. For more information, see [Limitations with Azure Virtual Network Manager](concept-limitations.md).

### How can I see what configurations are applied to help me troubleshoot?

You can view Azure Virtual Network Manager settings under **Network Manager** for a virtual network. The settings show configurations that are applied. For more information, see [View configurations applied by Azure Virtual Network Manager](how-to-view-applied-configurations.md).

### What happens when all zones are down in a region with an Azure Virtual Network Manager instance?

If a regional outage occurs, all configurations applied to current managed virtual network resources remain intact during the outage. You can't create new configurations or modify existing configurations during the outage. After the outage is resolved, you can continue to manage your virtual network resources as before.

### Can a virtual network managed by Azure Virtual Network Manager be peered to an unmanaged virtual network?

Yes. Azure Virtual Network Manager is fully compatible with preexisting hub-and-spoke topologies created with manual peering. You don't need to delete any existing peered connections between the hub and spoke virtual networks. The migration occurs without any downtime to your network.

### Can I migrate an existing hub-and-spoke topology to Azure Virtual Network Manager?

Yes. Migrating existing virtual networks to the hub-and-spoke topology in Azure Virtual Network Manager is straightforward. You can [create a hub-and-spoke topology connectivity configuration](how-to-create-hub-and-spoke.md). When you deploy this configuration, Azure Virtual Network Manager automatically creates the necessary peerings. Any preexisting peerings remain intact, so there's no downtime.

### How do connected groups differ from virtual network peering in establishing connectivity between virtual networks?

In Azure, virtual network peering and connected groups are two methods of establishing connectivity between virtual networks. Virtual network peering works by creating a one-to-one mapping between virtual networks, whereas connected groups use a new construct that establishes connectivity without such a mapping.

In a connected group, all virtual networks are connected without individual peering relationships. For example, if three virtual networks are part of the same connected group, connectivity is enabled between each virtual network without the need for individual peering relationships.

The effect of each method is the same, where bi-directional connectivity is established between virtual networks. However, connected groups simplify the management of connectivity by allowing you to manage multiple virtual networks as a single entity and enabling you to achieve a higher scale of connectivity beyond peering limits.

### When managing virtual networks using virtual network peering, does this result in paying virtual network peering charges twice with Azure Virtual Network Manager?

There's no second or double charge for peering. Your virtual network manager respects all previously created virtual network peerings, and migrates those connections. All peering resources, whether created inside a virtual network manager or outside, incur a single peering charge.

### Can I create exceptions to security admin rules?

Normally, security admin rules are defined to block traffic across virtual networks. However, there are times when certain virtual networks and their resources need to allow traffic for management or other processes. For these scenarios, you can [create exceptions](./concept-enforcement.md#network-traffic-enforcement-and-exceptions-with-security-admin-rules) where necessary. [Learn how to block high-risk ports with exceptions](how-to-block-high-risk-ports.md) for these scenarios.

### How can I deploy multiple security admin configurations to a region?

You can deploy only one security admin configuration to a region. However, multiple connectivity configurations can exist in a region. To deploy multiple security admin rule sets to a region, [create multiple rule collections](how-to-block-network-traffic-portal.md#add-a-rule-collection-and-security-rule) in a security admin configuration.

### Do security admin rules apply to Azure private endpoints?

Currently, security admin rules don't apply to Azure private endpoints that fall under the scope of a virtual network managed by Azure Virtual Network Manager.

### Can an Azure Virtual WAN hub be part of a network group?

No, an Azure Virtual WAN hub can't be in a network group at this time.

### Can I use an Azure Virtual WAN instance as the hub in an Azure Virtual Network Manager hub-and-spoke connectivity configuration?

Yes. You can use an Azure Virtual WAN hub as the hub in an Azure Virtual Network Manager hub-and-spoke connectivity configuration. For steps, see [Use a Virtual WAN hub as the hub](how-to-create-hub-and-spoke.md#use-a-virtual-wan-hub-as-the-hub).

### My virtual network isn't receiving the configurations I'm expecting. How do I troubleshoot?

Use the following questions for possible solutions.

#### Have you deployed your configuration to the virtual network's region?

Configurations in Azure Virtual Network Manager don't take effect until they're deployed. Make a deployment to the virtual network's region with the appropriate configurations.

#### Is your virtual network in scope?

A network manager is delegated only enough access to apply configurations to virtual networks within your scope. If a resource is in your network group but out of scope, it doesn't receive any configurations.

#### Are you applying security rules to a virtual network that contains managed instances?

Azure SQL Managed Instance has some network requirements. These requirements are enforced through high-priority network intent policies whose purpose conflicts with security admin rules. By default, admin rule application is skipped on virtual networks that contain any of these intent policies. Because **Allow** rules pose no risk of conflict, you can opt to apply **Allow Only** rules by setting `AllowRulesOnly` on `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices`.

#### Are you applying security rules to a virtual network or subnet that contains services that block security configuration rules?

Certain services require specific network requirements to function properly. By default, security admin rules aren't applied to virtual networks containing Azure SQL Managed Instance or Azure Databricks. Additionally, security admin rules aren't applied at the subnet level for services such as Azure Application Gateway, Azure Bastion, Azure Firewall, Azure Route Server, Azure VPN Gateway, Azure Virtual WAN, and Azure ExpressRoute Gateway. For the full list, see [Nonapplication of security admin rules](./concept-security-admins.md#nonapplication-of-security-admin-rules). For virtual network-level nonapplication, because **Allow** rules pose no risk of conflict, you can opt to apply **Allow Only** rules by setting the security configurations' `AllowRulesOnly` field on the `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices` .NET class.

## Limits

### What are the service limitations of Azure Virtual Network Manager?

For the most current information, see [Limitations with Azure Virtual Network Manager](concept-limitations.md).

## Next steps

* Create an [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md) by using the Azure portal.
