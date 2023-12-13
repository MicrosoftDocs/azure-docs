---
title: 'Virtual network enforcement with security admin rules in Azure Virtual Network Manager'
description: This article covers using security admin rules Azure Virtual Network Manager to enforcement security policies across virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual 
ms.date: 3/22/2023
---
# Virtual network enforcement with security admin rules in Azure Virtual Network Manager

In this article, you'll learn how [security admins rules](concept-security-admins.md) provide flexible and scalable enforcement of security policies over tools like [network security groups](../virtual-network/network-security-groups-overview.md). First, you learn the different models of virtual network enforcement. Then, you learn the general steps for enforcing security with security admin rules.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Virtual network enforcement 

With [network security groups (NSGs)](../virtual-network/network-security-group-how-it-works.md) alone, widespread enforcement on VNets across several applications, teams, or even entire organizations can be tricky. Often there’s a balancing act between attempts at centralized enforcement across an organization and handing over granular, flexible control to teams. 

[Security admin rules](concept-security-admins.md) aim to eliminate this sliding scale between enforcement and flexibility altogether by consolidating the pros of each of these models while reducing the cons of each. Central governance teams establish guard rails through security admin rules, while still leaving room for individual teams to flexibly pinpoint security as needed through NSG rules. Security admin rules aren't meant to override NSG rules. Instead, they work with NSG rules to provide enforcement and flexibility across your organization.

## Enforcement Models

Let’s look at a few common models of security management without security admin rules, and their pros and cons:

### Model 1 - Central governance
In this model, NSGs are managed by a central governance team within an organization.

| Pros | Cons |
| ---- | ---- |
| The central governance team can enforce important security rules. | Operational overhead is high as admins need to manage each NSG, as the number of NSGs increases, the burden increases. |

### Model 2 - NSGs are managed by individual teams.
In this model, NSGs are managed by individual teams within an organization without a centralized governance team.

| Pros | Cons |
| ---- | ---- |
| The individual team has flexible control in tailoring security rules based on their service requirements. | The central governance team can't enforce critical security rules, such as blocking risky ports. </br> </br> Individual team might also misconfigure or forget to attach NSGs, leading to vulnerability exposures.|

### Model 3 - NSGs are created through Azure Policy and managed by individual teams.
In this model, NSGs are still managed by individual teams. The difference is the NSGs are created using Azure Policy to set standard rules. Modifying these rules would trigger audit notifications.

| Pros | Cons |
| ---- | ---- |
| The individual team has flexible control in tailoring security rules. </br></br> The central governance team can create standard security rules and receive notifications if rules are modified. | The central governance team still can't enforce the standard security rules, since NSG owners in teams can still modify them. </br></br> Notifications would also be overwhelming to manage. |

## Enforcement and flexibility in practice

Let’s apply the concepts  discussed so far to an example scenario. A company network administrator wants to enforce a security rule to block inbound SSH traffic for the whole company. Enforcement of this type of security rule was difficult without a security admin rule. If the administrator manages all the NSGs, then management overhead is high, and the administrator can't rapidly respond to product teams’ needs to modify NSG rules. On the other hand, if the product teams manage their own NSGs without security admin rules, then the administrator can't enforce critical security rules, leaving potential security risks open. Using both security admin rules and NSGs can solve this dilemma. 

In this case, the administrator wants to make an exception to the application virtual networks as the application team needs management access to the application with SSH. The diagram shows how the administrator can achieve the following goals:
- Enforcement with security admin rules across the organization.
- Creating exceptions for the application team to handle SSH traffic through NSGs.

:::image type="content" source="media/concept-enforcement/sec-admin-scenario.png" alt-text="Diagram of security admin rules enforcement with network security groups.":::

#### Step 1: Create a network manager instance

The company administrator can create a network manager with the root management group of the firm as the scope of this network manager instance.

#### Step 2: Create network groups for VNets

The administrator creates two network groups – *ALL network group* consisting of all the VNets in the organization, and App network group consisting of VNets for the application needing an exception. ALL network group in the above diagram consists of *VNet 1* to *VNet 5*, and App network group has *VNet 4* and *VNet 5*. Users can easily define both network groups using dynamic membership.

#### Step 3: Create a security admin configuration

In this step, two security admin rules are defined with the following security admin configuration:
- a security admin rule to block inbound SSH traffic for ALL network group. 
- a security admin rule to allow inbound SSH traffic for App network group with a higher priority.

#### Step 4: Deploy the security admin configuration
 
After the deployment of the security admin configuration, all VNets in the company have the deny inbound SSH traffic rule enforced by the security admin rule. No individual team can modify this rule, only the defined company administrator. The App VNets have both an allow inbound SSH traffic rule and a deny inbound SSH traffic rule (inherited from All network group rule). The priority number of the allow inbound SSH traffic rule for App network group should be smaller so that it's evaluated first. When inbound SSH traffic comes to an App VNet, it is allowed by this higher priority security admin rule. Assuming there are NSGs on the subnets of the App VNets, this inbound SSH traffic is further evaluated by NSGs set by the application team. The security admin rule methodology described here allows the company administrator to effectively enforce company policies and create flexible security guard rails across an organization that work with NSGs.


## Next steps

- Learn how to [block high risk ports with security admin rules](how-to-block-high-risk-ports.md)

- Check out the [Azure Virtual Network Manager FAQ](faq.md)
