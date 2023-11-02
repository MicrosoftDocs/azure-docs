---
title: 'Security admin rules in Azure Virtual Network Manager'
description: Learn about what security admin rules are in Azure Virtual Network Manager. Understand how they work and how traffic is evaluated along with network security groups.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 05/10/2023
ms.custom: template-concept, ignite-fall-2021, engagement-fy23
---

# Security admin rules in Azure Virtual Network Manager

In this article, you learn about security admin rules in Azure Virtual Network Manager. Security admin rules are used to define global network security rules that apply to all virtual networks within a [network group](concept-network-groups.md). You learn about what security admin rules are, how they work, and when to use them.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## What is a security admin rule?

Security admin rules are global network security rules that enforce security policies defined in the rule collection on virtual networks. These rules can be used to Allow, Always Allow, or Deny traffic across virtual networks within your targeted network groups. These network groups can only consist of virtual networks within the scope of your network manager instance; thus, security admin rules can't apply to virtual networks not managed by a network manager.

Here are some scenarios where security admin rules can be used:

| **Scenario** | **Description** |
| --- | --- |
| **Restricting access to high-risk network ports** | Security admin rules can be used to block traffic on specific ports commonly targeted by attackers, such as port 3389 for Remote Desktop Protocol (RDP) or port 22 for Secure Shell (SSH). |
| **Enforcing compliance requirements** | Security admin rules can be used to enforce compliance requirements. For example, blocking traffic to or from specific IP addresses or network blocks. |
| **Protecting sensitive data** | Security admin rules can be used to restrict access to sensitive data by blocking traffic to or from specific IP addresses or subnets. |
| **Enforcing network segmentation** | Security admin rules can be used to enforce network segmentation by blocking traffic between virtual networks or subnets. |
| **Enforcing application-level security** | Security admin rules can be used to enforce application-level security by blocking traffic to or from specific applications or services. |

With Azure Virtual Network Manager, you have a centralized location to manage security admin rules. Centralization allows you to define security policies at scale and apply them to multiple virtual networks at once.

> [!NOTE]
> Currently, security admin rules do not apply to private endpoints that fall under the scope of a managed virtual network.

## How do security admin rules work?

Security admin rules allow or deny traffic on specific ports, protocols, and source/destination IP prefixes in a specified direction. When you define a security admin rule, you specify the following conditions:

- The priority of the rule
- The action to be taken (allow, deny, or always allow)
- The direction of traffic (inbound or outbound)
- The protocol to be used

To enforce security policies across multiple virtual networks, you [create and deploy a security admin configuration](how-to-block-network-traffic-portal.md). This configuration contains a set of rule collections, and each rule collection contains one or more security admin rules. Once created, you associate the rule collection with the network groups requiring security admin rules. The rules are then applied to all virtual networks contained in the network groups when the configuration is deployed. A single configuration provides a centralized and scalable enforcement of security policies across multiple virtual networks.

### Evaluation of security admin rules and network security groups (NSGs)

Security admin rules and network security groups (NSGs) can be used to enforce network security policies in Azure. However, they have different scopes and priorities.

Security admin rules are intended to be used by network admins of a central governance team, thereby delegating NSG rules to individual application or service teams to further specify security as needed. Security admin rules have a higher priority than NSGs and are evaluated before NSG rules.

NSGs, on the other hand, are used to filter network traffic to and from individual subnets or network interfaces. They're intended to be used by individual application or service teams to further specify security as needed. NSGs have a lower priority than security admin rules and are evaluated after security admin rules.

Security admin rules are currently applied at the virtual network level, whereas network security groups can be associated at the subnet and NIC level. This table shows these differences and similarities:

| **Rule Type** | **Target Audience** | **Applied On** | **Evaluation Order** | **Action Types** | **Parameters** |
| --- | ---- | ---- | ---- | ---- | ---- | 
| **Security admin rules** | Network admins, central governance team | 	Virtual networks | 	Higher priority | 	Allow, Deny, Always Allow | 	Priority, protocol, action, source, destination |
| **Network security group rules** | 	Individual teams | 	Subnets, NICs | Lower priority, after security admin rules | Allow, Deny | Priority, protocol, action, source, destination |

Security admin rules can perform three actions on traffic: *Allow*, *Always Allow*, and *Deny*. If you create an *Allow* rule, it's evaluated first, followed by network security group rules. This action allows network security group rules to handle the traffic differently if needed. 

If you create an *Always Allow* or *Deny* rule, traffic evaluation is terminated after the security admin rule is evaluated. With an *Always Allow* rule, the traffic goes directly to the resource and terminates further (and possibly conflicting) evaluation by NSG rules. This action can be useful for enforcing traffic and preventing denial by network security group rules. With a *Deny* rule, the traffic is stopped without being delivered to the destination. Security admin rules don't depend on NSGs, so they can be used to create default security rules on their own.

:::image type="content" source="media/concept-security-admins/traffic-evaluation.png" alt-text="Diagram showing order of evaluation for network traffic with security admin rules and network security rules.":::

By using security admin rules and NSGs together, you can enforce network security policies at both the global and individual levels, ensuring that your virtual networks are secure and compliant with your organization's security policies.

> [!IMPORTANT]
> When security admin rules are deployed, the eventual consistency model is used. This means that security admin rules will be eventually applied to the resources contained in a virtual network after a short delay.   Resources that are added to a virtual network that already has security admin rules applied on it will eventually receive those same security admin rules with a delay as well.

## Benefits of security admin rules

Security admin rules provide many benefits for securing your organization's resources. By using security admin rules, you can enforce allowed traffic and prevent denial by conflicting network security group rules. You can also create default security admin rules that don't depend on NSGs to exist. These default rules can be especially useful when application owners misconfigure or forget to establish NSGs. Additionally, security admin rules provide a way to manage security at scale, which reduces the operational overhead that comes with a growing number of network resources.

### Protect high-risk ports

Based on the industry study and suggestions from Microsoft, we recommend customers restrict the traffic from outside using security admin rules for this list of high-risk ports. These ports are often used for the management of resources or unsecure/unencrypted data transmission and shouldn't be exposed to the internet. However, there are times when certain virtual networks and their resources need to allow traffic for management or other processes. You can create exceptions where needed. Learn how to [blocking high-risk ports with exceptions](how-to-block-high-risk-ports.md) for these types of scenarios.

| **Port** | **Protocol** | **Description** |
| --- | ---- | ------- |
| **20** | TCP | Unencrypted FTP Traffic |
| **21** | TCP | Unencrypted FTP Traffic |
| **22** | TCP | SSH. Potential brute force attacks |
| **23** | TCP | TFTP allows unauthenticated and/or unencrypted traffic |
| **69** | UDP | TFTP allows unauthenticated and/or unencrypted traffic |
| **111** | TCP/UDP | RPC. Unencrypted authentication allowed |
| **119** | TCP | NNTP for unencrypted authentication |
| **135** | TCP/UDP | End Point Mapper, multiple remote management services |
| **161** | TCP | SNMP for unsecure / no authentication |
| **162** | TCP/UDP | SNMP Trap - unsecure / no authentication |
| **445** | TCP | SMB - well known attack vector |
| **512** | TCP | Rexec on Linux - remote commands without encryption authentication |
| **514** | TCP | Remote Shell - remote commands without authentication or encryption |
| **593** | TCP/UDP | HTTP RPC EPMAP - unencrypted remote procedure call |
| **873** | TCP | Rsync - unencrypted file transfer |
| **2049** | TCP/UDP | Network File System |
| **3389** | TCP | RDP - Common brute force attack port |
| **5800** | TCP | VNC Remote Frame Buffer over HTTP |
| **5900** | TCP | VNC Remote Frame Buffer over HTTP |
| **11211** | UDP | Memcached |

### Management at scale

Azure Virtual Network Manager provides a way to manage your security policies at scale with security admin rules. When you apply a security admin configuration to a [network group](./concept-network-groups.md), a network group can contain dozens or hundreds of VNets, and all of the resources in the network groups’ scope have those security admin rules applied to them.

New resources are protected along with existing resources. For example, if you add new VMs to a virtual network in the scope of a security admin rule, the VMs are automatically secured as well. Shortly after you deploy these VMs, security admin rules will be applied and protect them.

When new security risks are identified, you can deploy them at scale by creating a security admin rule to protect against the new risk and applying it to your network groups. Once this new rule is deployed, all resources in the scope of the network groups will be protected now and in the future.

## Nonapplication of security admin rules

In most instances, security admin rules are applied to all virtual networks and subnets within the scope of a network group's applied security configuration. However, there are some services that don't apply security admin rules due to the network requirements of the service. These requirements are enforced by the service's network intent policy.

### Nonapplication of security admin rules at virtual network level

By default, security admin rules aren't applied to a virtual network containing the following services:

- [Azure SQL Managed Instances](/azure/azure-sql/managed-instance/connectivity-architecture-overview#mandatory-security-rules-with-service-aided-subnet-configuration)
- Azure Databricks  

When a virtual network contains these services, the security admin rules skip this virtual network. If you want *Allow* rules applied to this virtual network, you create your security configuration with the `AllowRulesOnly` field set in the [securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices](/dotnet/api/microsoft.azure.management.network.models.networkintentpolicybasedservice?view=azure-dotnet) .NET class. When set, *Allow* rules in your security configuration will be applied to this virtual network. All *Deny* rules will not be applied on this virtual network. Virtual networks without these services can continue using *Allow* and *Deny* rules. 

You can create a security configuration with *Allow* rules only and deploy it to your virtual networks with [Azure PowerShell](/powershell/module/az.network/new-aznetworkmanagersecurityadminconfiguration#example-1) and [Azure CLI](/cli/azure/network/manager/security-admin-config#az-network-manager-security-admin-config-create-examples).

> [!NOTE]
> When multiple Azure Virtual Network Manager instances apply different settings in the `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices` class to the same virtual network, the setting of the network manager instance with the highest scope will be used.
> Let's say you have two virtual network managers. The first network manager is scoped to the root management group and has a security configuration with set to *AllowRulesOnly* in the `securityConfiguration.properties.applyOnNetworkIntentPolicyBasedServices` class. The second virtual network manager is scoped to a subscription under the root management group and uses the default field of *None* in it's security configuration. When both configurations apply security admin rules to the same virtual network, the *AllowRulesOnly* setting will be applied to the virtual network.

### Nonapplication of security admin rules at subnet level

Similarly, there are some services that don't apply security admin rules at the subnet level when those subnets' virtual networks are a part of a network group targeted by a security admin configuration. Those services include:

- Azure Application Gateway
- Azure Bastion
- Azure Firewall
- Azure Route Server
- Azure VPN Gateway
- Azure Virtual WAN
- Azure ExpressRoute Gateway

In this case, the resources in the subnet with these services won’t be applied with security admin rules; however, other subnets will still have security admin rules applied to them.

> [!NOTE]
> If you want to apply security admin rules on subnets containing an Azure Application Gateway, ensure each subnet only contains gateways that have been provisioned with [network isolation](../application-gateway/application-gateway-private-deployment.md) enabled. If a subnet contains an Azure Application Gateway without network isolation, security admin rules won't be applied to this subnet.

## Security admin fields

When you define a security admin rule, there are required and optional fields. 

### Required fields

#### Priority

The priority of a security admin rule is an integer between 1 and 4096. The lower the value the higher the priority of the rule. For example, a deny rule with a priority of 10 overrides an allow rule with a priority of 20. 

#### <a name = "action"></a>Action

You can define one of three actions for a security rule:

| Action | Description |
| -------------- | --- |
| **Allow** | Allows traffic on the specific port, protocol, and source/destination IP prefixes in the specified direction. |
| **Deny** | Block traffic on the specified port, protocol, and source/destination IP prefixes in the specified direction. |
| **Always allow** | Regardless of other rules with lower priority or user-defined network security groups, allow traffic on the specified port, protocol, and source/destination IP prefixes in the specified direction. |

#### Direction

You can specify the direction of traffic for which the rule applies. You can define either inbound or outbound.

#### Protocol

Protocols currently supported with security admin rules are:

* TCP
* UDP
* ICMP
* ESP
* AH
* Any protocols

### Optional fields

#### Source and destination types

* **IP addresses**: You can provide IPv4 or IPv6 addresses or blocks of address in CIDR notation. To list multiple IP address, separate each IP address with a comma.
* **Service Tag**: You can define specific service tags based on regions or a whole service. See [Available service tags](../virtual-network/service-tags-overview.md#available-service-tags), for the list of supported tags.

#### Source and destination ports

You can define specific common ports to block from the source or to the destination. Here's a list of common TCP ports:

| Ports | Service name |
| ----- | ------------ |
| 20, 21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3389 | RDP |
| 1433 | SQL |

## Next steps 
> [!div class="nextstepaction"]
> Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
