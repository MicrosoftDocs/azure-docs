---
title: 'Security admin rules in Azure Virtual Network Manager'
description: Learn about what security admin rules are in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 3/1/2023
ms.custom: template-concept, ignite-fall-2021
---

# Security admin rules in Azure Virtual Network Manager

Azure Virtual Network Manager provides two different types of configurations you can deploy across your virtual networks, one of them being a **security admin** configuration. A security admin configuration contains a set of rule collections. Each rule collection contains one or more security admin rules. You then associate the rule collection with the network groups that you want to apply the security admin rules to.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Security admin rules

A security admin rule allows you to enforce security policy criteria that match the conditions set. You can only define security administrative rules for resources within the scope of the Azure Virtual Network Manager instance. These security rules have a higher priority than network security group rules and are evaluated before network security group rules. Also note that security admin rules don't change your network security group rules. 

### The order of evaluation

Security admin rules are evaluated before network security rules. Depending on the type of security admin rule you create, they can interact differently with network security group rules.  When this happens, organizations can set enforced security policies alongside the teams' network security groups that address their own use cases. This diagram illustrates the order of evaluation of traffic.

:::image type="content" source="media/concept-security-admins/traffic-evaluation.png" alt-text="Diagram showing order of evaluation for network traffic with security admin rules and network security rules.":::

There are three kinds of actions – Allow, Always Allow, and Deny. If you create a security admin rule to *Allow* a certain type of traffic, this rule is evaluated first. When the traffic is allowed by a security admin rule, it's further evaluated by network security group rules. It leaves room for network security group rules down the line to handle this type of traffic differently as needed. If you create a security admin rule to *Always Allow* or *Deny* a certain type of traffic, the rule is evaluated first. Then it terminates the network security group evaluation of this traffic – meaning the evaluation is stopped. If the security admin rule is *Always Allow*, the traffic doesn't hit network security groups, and instead delivers directly to virtual machines or other resource. This action can be useful when administrators want to enforce some traffic to be not denied by network security group rules. For example, administrators may want to force the organization to consume software updates from certain ports. When *Deny* is used, evaluation and therefore traffic is stopped without being delivered to the destination. This means that you can use security admin rules to set definitive security rules that can't be overridden by others.
Security admin rules don't depend on network security groups in order to exist. This means that administrators can use security admin rules to create default security rules. Even if application owners misconfigured or forgot to establish network security groups, your organization is protected by default!

### Management at scale

When you apply a security admin configuration to a [network group](concept-network-groups.md#network-group), all of the resources in the selected network groups’ virtual networks have those security admin rules applied to them. It doesn't matter how many or how few virtual networks are contained in the network group. This protection extends to new resources as they're added. If you add new VMs to a virtual network that has a security admin configuration applied on it, those VMs are secured as well. In effect, security admin rules protect your resources from day zero. As soon as your resources are provisioned, they fall under the protection of security admin rules.
Then, if new security risks are identified, new security admin rules can still protect your resources at scale. You can create security admin rules to protect against the new risk, then apply them to network groups – essentially, hundreds of virtual networks at once.

### Protect high-risk ports

Based on the industry study and suggestions from Microsoft, we recommend customers restrict the traffic from outside using security admin rules for this list of high-risk ports. These ports are often used for the management of resources or unsecure/unencrypted data transmission and shouldn't be exposed to the internet. However, there are times when certain virtual networks and their resources need to allow traffic for management or other processes. You can create exceptions where needed. Learn how to [blocking high-risk ports with exceptions](how-to-block-high-risk-ports.md) for these types of scenarios.

|Port |	Protocol | Description |
| --- | ---- | ------- |
|20| TCP |Unencrypted FTP Traffic | 
|21| TCP |Unencrypted FTP Traffic | 
|22| TCP |SSH. Potential brute force attacks | 
|23| TCP  |TFTP allows unauthenticated and/or unencrypted traffic | 
|69	| UDP | TFTP allows unauthenticated and/or unencrypted traffic | 
| 111	| TCP/UDP | RPC. Unencrypted authentication allowed | 
| 119| TCP |NNTP for unencrypted authentication | 
| 135	| TCP/UDP | End Point Mapper, multiple remote management services | 
| 161| TCP |SNMP for unsecure / no authentication | 
| 162 | TCP/UDP | SNMP Trap - unsecure / no authentication | 
| 445| TCP |SMB - well known attack vector | 
| 512| TCP |Rexec on Linux - remote commands without encryption authentication | 
| 514| TCP |Remote Shell - remote commands without authentication or encryption | 
| 593	| TCP/UDP | HTTP RPC EPMAP - unencrypted remote procedure call | 
| 873| TCP |Rsync - unencrypted file transfer | 
| 2049 | TCP/UDP |	Network File System | 
| 3389| TCP | RDP - Common brute force attack port | 
| 5800| TCP | VNC Remote Frame Buffer over HTTP | 
| 5900| TCP | VNC Remote Frame Buffer over HTTP | 
| 11211	 | UDP	 | Memcached |

## Security admin rules vs. network security groups

Security admin rules are similar to network security group rules in structure and the parameters they intake, but they’re not the exact same construct. The first difference is intended audience. Admin rules are intended to be used by network admins of a central governance team. In this model, network security group rules are delegated to individual application or service teams to further specify security as needed. With these intentions, admin rules were designed to have a higher priority than network security groups and therefore be evaluated before network security group rules. Admin rules include another action type of *Always Allow*. This action allows the specified traffic through to its intended destination and terminates further (and possibly conflicting) evaluation by network security groups rules. Admin rules are also applied not only to a network group’s existing virtual networks but also to newly provisioned resources, as described in the previous section. Admin rules are currently applied at the virtual network level, whereas network security groups can be associated at the subnet and NIC level. This table shows these differences and similarities:

| Rule Type | Target Audience | Applied On | Evaluation Order | Action Types | Parameters |
| --- | ---- | ---- | ---- | ---- | ---- | 
| **Security admin rules** | Network admins, central governance team | 	Virtual networks | 	Higher priority | 	Allow, Deny, Always Allow | 	Priority, protocol, action, source, destination |
| **Network security group rules** | 	Individual teams | 	Subnets, NICs | Lower priority, after security admin rules | Allow, Deny | Priority, protocol, action, source, destination |

## Network intent policies and security admin rules

A network intent policy is applied to some network services to ensure the network traffic is working as needed for these services. By default, a security admin configuration doesn't apply security admin rules to virtual networks with services that use network intent policies such as SQL managed instance service. If you deploy a service using network intent policies in a virtual network with existing security admin rules applied, those security admin rules are removed from those virtual networks. In virtual networks with services that use network intent policies. You can elect for your security admin configuration to act differently and apply security admin rules to those virtual networks unless the security admin rule is of a "deny" action type. With either option, your security admin rules don't block traffic to or from virtual networks with services that use network intent policies. Both options ensure your services continue to function as expected.

If you need to apply security admin rules on virtual networks with services that use network intent policies, contact AVNMFeatureRegister@microsoft.com to enable this functionality. Overriding the default behavior described could break the network intent policies created for those services. For example, creating a deny admin rule can block some traffic allowed by the SQL managed instance service, which is defined by their network intent policies. Make sure to review your environment before applying a security admin configuration. For an example of how to allow the traffic of services that use network intent policies, see [How can I explicitly allow SQLMI traffic before having deny rules](faq.md#how-can-i-explicitly-allow-azure-sql-managed-instance-traffic-before-having-deny-rules)
## Security admin fields

When you define a security admin rule, there are required and optional fields. 
### Required fields

#### Priority

Security rule priority is determined by an integer between 0 and 99. The lower the value the higher the priority of the rule. For example, a deny rule with a priority of 10 override an allow rule with a priority of 20. 

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

## Next steps 

Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
