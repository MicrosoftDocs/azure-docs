---
title: 'Why Security Admin Rules?'
description: #Required; You'll learn why you should use Security Admin Rules and how they differ from NSGs. 
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 06/28/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

<!-- reference of WHY doc: https://docs.microsoft.com/en-us/azure/applied-ai-services/why-applied-ai-services -->

<!-- reference of WHAT doc: https://docs.microsoft.com/en-us/azure/applied-ai-services/what-are-applied-ai-services -->

# Why Security Admin Rules?

[add your introductory paragraph]

### Virtual network enforcement
Enforcement
With NSGs alone, widespread enforcement on VNets across several applications, teams, or even entire organizations can be tricky. Often there’s a balancing act between attempts at centralized enforcement across an organization and handing over granular, flexible control to teams. Let’s look at a few common models of security management without security admin rules, and their pros and cons:

Model 1: NSGs are managed by a central governance team.
- Pros – The central governance team can enforce important security rules.
- Cons – Operational overhead is high as admins need to manage each NSG, as the number of NSGs increases, the burden increases.

Model 2: NSGs are managed by individual teams.
- Pros – The individual team has flexible control in tailoring security rules based on their service requirements.
- Cons – The central governance team can't enforce critical security rules, such as blocking risky ports. Individual team might also misconfigure or forget to attach NSGs, leading vulnerability exposures.

Model 3: NSGs are managed by individual teams, but NSGs are created using Azure Policy to have standard rules. Modifying these rules would trigger audit notifications.
- Pros – The individual team has flexible control in tailoring security rules. The central governance team can create standard security rules and receive notifications if these are modified.
- Cons – The central governance team still can't enforce the standard security rules, since NSG owners in teams can still modify them. Notifications would also be overwhelming to manage.
Security admin rules aim to eliminate this sliding scale between enforcement and flexibility altogether by consolidating the pros of each of these models while reducing the cons of each. Central governance teams establish guard rails through security admin rules, while still leaving room for individual teams to flexibly pinpoint security as needed through NSG rules. Security admin rules aren't meant to override NSG rules, but rather interact in different ways depending on the type of action specified in the security admin rule. We’ll explore these interactions after we discuss the immense scaling benefits of security admin rules.



### Management at scale

When you apply a security admin configuration to a network group – a collection of VNets that were selected either manually or conditionally – then all of the resources in the selected network groups’ VNets have those security admin rules applied to them, regardless a network group contains dozens or hundreds of VNets matters not, since a security admin configuration would apply its rules to all the VNets in the selected network groups.
This protection encapsulates not only existing resources, but extends even to new resources. If you add new VMs to a VNet that belongs to a network group that has a security admin configuration applied on it, then those VMs will automatically be secured as well. In effect, security admin rules protect your resources from day zero. As soon as your resources are provisioned, they'll fall under the protection of security admin rules.
Then, if new security risks are identified, new security admin rules can still protect your resources at scale. You can create security admin rules to protect against the new risk, then apply them to network groups – essentially, hundreds of VNets at once.

### Protect high-risk ports
Based on the industry study and suggestions from Microsoft, below is what we recommend customers restrict the traffic from outside using security admin rules. These ports are often used for the management of resources or unsecure/unencrypted data transmission and shouldn't be exposed to the internet.

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

### Enforcement and flexibility in practice
Let’s apply the concepts we’ve discussed so far to an example scenario. A company network administrator wants to enforce a security rule to block inbound SSH traffic for the whole company. As mentioned above, having such enforcement was difficult without AVNM’s security admin rule. If the administrator manages all the NSGs, then management overhead is high, and the administrator cannot rapidly respond to product teams’ needs to modify NSG rules. On the other hand, if the product teams manage their own NSGs without security admin rules, then the administrator cannot enforce critical security rules, leaving potential security risks open. Using both security admin rules and NSGs can solve this dilemma. In this case, the administrator wants to make an exception for Application 1 as the Application 1 team needs more time to make changes to not rely on SSH. The diagram below visualizes how the administrator can achieve the goal of enforcement with security admin rules, while leaving an exception open for the Application 1 team to handle SSH traffic through NSGs.

:::image type="content" source="media/concept-security-admins/avnm-sec-admin-rough.png" alt-text="This is a rough mock-up of the sec admin rules flow using an example of SSH traffic.":::
#### Step 1: Create a network manager instance

The company administrator can create a network manager with the root management group of the firm as the scope of this network manager instance.

#### Step 2: Create network groups for VNets

The administrator creates two network groups – “ALL Network Group,” consisting of all the VNets in the organization, and “App 1 Network Group,” consisting of VNets for Application 1. ALL Network Group in the above diagram consists of VNet 1 to VNet 5, and App 1 Network Group has VNet 4 and VNet 5. Users can easily define both network groups using dynamic membership.

#### Step 3: Create a security admin configuration

This security admin configuration contains a security admin rule to block inbound SSH traffic for ALL Network Group and another security admin rule to allow inbound SSH traffic for App 1 Network Group with a higher priority.

#### Step 4: Deploy the security admin configuration
 
After the deployment of the security admin configuration, all VNets in the company will have the deny inbound SSH traffic rule enforced by the security admin rule. No individual team can modify this rule, only the administrator. The App 1 VNets will have both an allow inbound SSH traffic rule and a deny inbound SSH traffic rule. The priority number of the allow inbound SSH traffic rule for App 1 Network Group should be smaller so that it's evaluated first. When inbound SSH traffic comes to an App 1 VNet, it will be allowed by this higher priority security admin rule. Assuming there are NSGs on the subnets of the App 1 VNets, this inbound SSH traffic will be further evaluated by NSGs set by the Application 1 team. Using this methodology, the company administrator can effectively enforce company policies and create security guard rails, while product teams can simultaneously react to meet their needs by owning the control of NSGs.

## When to use Security Admin Rules

<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
