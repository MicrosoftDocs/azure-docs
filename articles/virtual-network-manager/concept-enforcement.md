---
title: 'Virtual network enforcement with security admin rules in Azure Virtual Network Manager (Preview)'
description: You'll learn how security admin rules provide enforcement and flexible application of security policies in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 06/28/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---
# Virtual network enforcement with security admin rules in Azure Virtual Network Manager (Preview)

In this article, you'll learn how [security admins rules](concept-security-admins.md) provide flexible and scalable enforcement of security policies over tools like [network security groups](../virtual-network/network-security-groups-overview.md). First, you learn the different models of virtual network enforcement. Then, you'll learn the general steps for enforcing security with security admin rules.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Virtual network enforcement 

With network security groups (NSGs) alone, widespread enforcement on VNets across several applications, teams, or even entire organizations can be tricky. Often there’s a balancing act between attempts at centralized enforcement across an organization and handing over granular, flexible control to teams. 

Security admin rules aim to eliminate this sliding scale between enforcement and flexibility altogether by consolidating the pros of each of these models while reducing the cons of each. Central governance teams establish guard rails through security admin rules, while still leaving room for individual teams to flexibly pinpoint security as needed through NSG rules. Security admin rules aren't meant to override NSG rules. Instead they interact in different ways depending on the type of action specified in the security admin rule. 

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
| The individual team has flexible control in tailoring security rules based on their service requirements. | The central governance team can't enforce critical security rules, such as blocking risky ports. </br> </br> Individual team might also misconfigure or forget to attach NSGs, leading vulnerability exposures.|

### Model 3 - NSGs are created through Azure Policy and managed by individual teams.
In this model, NSGs are still managed by individual teams. The difference is the NSGs created using Azure Policy to set standard rules. Modifying these rules would trigger audit notifications.

| Pros | Cons |
| ---- | ---- |
| The individual team has flexible control in tailoring security rules. </br></br> The central governance team can create standard security rules and receive notifications if rules are modified. | The central governance team still can't enforce the standard security rules, since NSG owners in teams can still modify them. </br></br> Notifications would also be overwhelming to manage. |

## Enforcement and flexibility in practice

Let’s apply the concepts  discussed so far to an example scenario. A company network administrator wants to enforce a security rule to block inbound SSH traffic for the whole company. As mentioned above, having such enforcement was difficult without AVNM’s security admin rule. If the administrator manages all the NSGs, then management overhead is high, and the administrator can't rapidly respond to product teams’ needs to modify NSG rules. On the other hand, if the product teams manage their own NSGs without security admin rules, then the administrator can't enforce critical security rules, leaving potential security risks open. Using both security admin rules and NSGs can solve this dilemma. In this case, the administrator wants to make an exception for application as the application team needs more time to make changes to not rely on SSH. The diagram below shows how the administrator can achieve the goal of enforcement with security admin rules, and leave an exception for the Application team to handle SSH traffic through NSGs.

:::image type="content" source="media/concept-enforcement/example-rules-enforcement.png" alt-text="Diagram of security admin rules enforcement with network security groups.":::

#### Step 1: Create a network manager instance

The company administrator can create a network manager with the root management group of the firm as the scope of this network manager instance.

#### Step 2: Create network groups for VNets

The administrator creates the following network groups:
– *ALL Network Group*: consisting of all the VNets in the organization
- *App 1 Network Group* consisting of VNets for Application 1. 
ALL Network Group in the above diagram consists of VNet 1 to VNet 5, and App 1 Network Group has VNet 4 and VNet 5. Users can easily define both network groups with dynamic membership.

#### Step 3: Create a security admin configuration

This security admin configuration contains a security admin rule to block inbound SSH traffic for *ALL Network Group* and another security admin rule to allow inbound SSH traffic for *App 1 Network *Group* with a higher priority.

#### Step 4: Deploy the security admin configuration
 
After the deployment of the security admin configuration, all VNets in the company will have the deny inbound SSH traffic rule enforced by the security admin rule. No individual team can modify this rule, only the administrator. The App 1 VNets will have both an allow inbound SSH traffic rule and a deny inbound SSH traffic rule. The priority number of the allow inbound SSH traffic rule for App 1 Network Group should be smaller so that it's evaluated first. When inbound SSH traffic comes to an App 1 VNet, it will be allowed by this higher priority security admin rule. Assuming there are NSGs on the subnets of the App 1 VNets, this inbound SSH traffic will be further evaluated by NSGs set by the Application 1 team. With this method, the company administrator can effectively enforce company policies and create security guard rails. And the product teams can simultaneously react to meet their needs by owning the control of NSGs.


## Next steps

- Learn how to [block high risk ports with security admin rules](how-to-block-high-risk-ports.md)

- Check out the [Azure Virtual Network Manager FAQ](faq.md)
