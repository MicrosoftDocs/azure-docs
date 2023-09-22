---
title: What is Azure Firewall Manager?
description: Learn about Azure Firewall Manager features
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: overview
ms.date: 01/17/2023
ms.author: victorh
---

# What is Azure Firewall Manager?

Azure Firewall Manager is a security management service that provides central security policy and route management for cloud-based security perimeters. 

Firewall Manager can provide security management for two network architecture types:

- **Secured virtual hub**

   An [Azure Virtual WAN Hub](../virtual-wan/virtual-wan-about.md#resources) is a Microsoft-managed resource that lets you easily create hub and spoke architectures. When security and routing policies are associated with such a hub, it is referred to as a *[secured virtual hub](secured-virtual-hub.md)*. 
- **Hub virtual network**

   This is a standard Azure virtual network that you create and manage yourself. When security policies are associated with such a hub, it is referred to as a *hub virtual network*. At this time, only Azure Firewall Policy is supported. You can peer spoke virtual networks that contain your workload servers and services. You can also manage firewalls in standalone virtual networks that aren't peered to any spoke.

For a detailed comparison of *secured virtual hub* and *hub virtual network* architectures, see [What are the Azure Firewall Manager architecture options?](vhubs-and-vnets.md).

![firewall-manager](media/overview/trusted-security-partners.png)

## Azure Firewall Manager features

Azure Firewall Manager offers the following features:

### Central Azure Firewall deployment and configuration​

You can centrally deploy and configure multiple Azure Firewall instances that span different Azure regions and subscriptions. 

### Hierarchical policies (global and local)​

You can use Azure Firewall Manager to centrally manage Azure Firewall policies across multiple secured virtual hubs. Your central IT teams can author global firewall policies to enforce organization wide firewall policy across teams. Locally authored firewall policies allow a DevOps self-service model for better agility.

### Integrated with third-party security-as-a-service for advanced security

In addition to Azure Firewall, you can integrate third-party security as a service (SECaaS) providers to provide additional network protection for your VNet and branch Internet connections.

This feature is available only with secured virtual hub deployments.

- VNet to Internet (V2I) traffic filtering

   - Filter outbound virtual network traffic with your preferred third-party security provider.
   - Leverage advanced user-aware Internet protection for your cloud workloads running on Azure.

- Branch to Internet (B2I) traffic filtering

   Leverage your Azure connectivity and global distribution to easily add third-party filtering for branch to Internet scenarios.

For more information about security partner providers, see [What are Azure Firewall Manager security partner providers?](trusted-security-partners.md)

### Centralized route management

Easily route traffic to your secured hub for filtering and logging without the need to manually set up User Defined Routes (UDR) on spoke virtual networks. 

This feature is available only with secured virtual hub deployments.

You can use third-party providers for Branch to Internet (B2I) traffic filtering, side by side with Azure Firewall for Branch to VNet (B2V), VNet to VNet (V2V) and VNet to Internet (V2I).

### DDoS protection plan

You can associate your virtual networks with a DDoS protection plan within Azure Firewall Manager. For more information, see [Configure an Azure DDoS Protection Plan using Azure Firewall Manager](configure-ddos.md).

### Manage Web Application Firewall policies

You can centrally create and associate Web Application Firewall (WAF) policies for your application delivery platforms, including Azure Front Door and Azure Application Gateway. For more information, see [Manage Web Application Firewall policies](manage-web-application-firewall-policies.md).

## Region availability

Azure Firewall Policies can be used across regions. For example, you can create a policy in West US, and use it in East US. 

## Known issues

Azure Firewall Manager has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|Traffic splitting|Microsoft 365 and Azure Public PaaS traffic splitting isn't currently supported. As such, selecting a third-party provider for V2I or B2I also sends all Azure Public PaaS and Microsoft 365 traffic via the partner service.|Investigating traffic splitting at the hub.
|Base policies must be in same region as local policy|Create all your local policies in the same region as the base policy. You can still apply a policy that was created in one region on a secured hub from another region.|Investigating|
|Filtering inter-hub traffic in secure virtual hub deployments|Secured Virtual Hub to Secured Virtual Hub communication filtering is supported with the Routing Intent feature.|Enable Routing Intent on your Virtual WAN Hub by setting Inter-hub to **Enabled** in Azure Firewall Manager. See [Routing Intent documentation](../virtual-wan/how-to-routing-policies.md) for more information about this feature.|
|Branch to branch traffic with private traffic filtering enabled|Branch to branch traffic can be inspected by Azure Firewall in secured hub scenarios if Routing Intent is enabled. |Enable Routing Intent on your Virtual WAN Hub by setting Inter-hub to **Enabled** in Azure Firewall Manager. See [Routing Intent documentation](../virtual-wan/how-to-routing-policies.md) for more information about this feature.|
|All Secured Virtual Hubs sharing the same virtual WAN must be in the same resource group.|This behavior is aligned with Virtual WAN Hubs today.|Create multiple Virtual WANs to allow Secured Virtual Hubs to be created in different resource groups.|
|Bulk IP address addition fails|The secure hub firewall goes into a failed state if you add multiple public IP addresses.|Add smaller public IP address increments. For example, add 10 at a time.|
|DDoS Protection not supported with secured virtual hubs|DDoS Protection is not integrated with vWANs.|Investigating|
|Activity logs not fully supported|Firewall policy does not currently support Activity logs.|Investigating|
|Description of rules not fully supported|Firewall policy does not display the description of rules in an ARM export.|Investigating|
|Azure Firewall Manager overwrites static and custom routes causing downtime in virtual WAN hub.|You should not use Azure Firewall Manager to manage your settings in deployments configured with custom or static routes. Updates from Firewall Manager can potentially overwrite static or custom route settings.|If you use static or custom routes, use the Virtual WAN page to manage security settings and avoid configuration via Azure Firewall Manager.<br><br>For more information, see [Scenario: Azure Firewall - custom](../virtual-wan/scenario-route-between-vnets-firewall.md).|

## Next steps

- [Learn module: Introduction to Azure Firewall Manager](/training/modules/intro-to-azure-firewall-manager/)
- Review [Azure Firewall Manager deployment overview](deployment-overview.md)
- Learn about [secured Virtual Hubs](secured-virtual-hub.md)
- [Learn more about Azure network security](../networking/security/index.yml)

