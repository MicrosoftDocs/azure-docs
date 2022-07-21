---
title: 'How to block high-risk network ports with SecurityAdmin Rules in Azure Virtual Network Manager.'
description: #Required; In this article, you will deploy Security admin rules to block high-risk security ports with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 06/28/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a how-to article.
See the [how-to guidance](contribute-how-to-write-howto.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# How to block high-risk network ports with Security Admin Rules in Azure Virtual Network Manager

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

In this article, you will learn to block high risk network ports using Azure Virtual Network Manager and Security Admin Rules. You'll walk through the creation of an Azure Virtual Network Manager instance, group your vnets with network groups, and create & deploy security admin configurations for your orginization. You'll deploy an general block rule for high risk ports. Then you'll create an exception for managing a specific application's vnet. This is will allow you to manage access to the application vnets using network security groups.

### Describe Scenario

:::image type="content" source="media/how-to-block-high-risk-ports/sec-admin-rules-scenario.png" alt-text="This diagram describes the scenario for the how-to. It includes virtual networks, network groups, and admin security policies.":::

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## Prerequisites
* You understand how to 
* You understand each element in a [Security admin rule](concept-security-admins.md).
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Deploy Virtual Network environment 5 VNETS (3 PROD, 2 Test)
You will deploy a virtual network environment that includes production and test virtual networks.


## Create a Virtual Network Manager
In this section, you will deploy a Virtual Network Manager instance with the Security admin feature in your organization.

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Create** to begin setting up Azure Virtual Network Manager.

1. On the *Basics* tab, enter or select the information for your organization:

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-basics.png" alt-text="Screenshot of Create a network manager Basics page.":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy Azure Virtual Network Manager to. |
    | Resource group | Select or create a resource group to store Azure Virtual Network Manager. This example will use the **myAVNMResourceGroup** previously created.
    | Name | Enter a name for this Azure Virtual Network Manager instance. This example will use the name **myAVNM**. |
    | Region | Select the region for this deployment. Azure Virtual Network Manager can manage virtual networks in any region. The region selected is for where the Virtual Network Manager instance will be deployed. |
    | Description | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it will be managing. |
    | [Scope](concept-network-manager-scope.md#scope) | Define the scope for which Azure Virtual Network Manager can manage. This example will use a subscription-level scope.
    | [Features](concept-network-manager-scope.md#features) | Select the features you want to enable for Azure Virtual Network Manager. Available features are *Connectivity*, *SecurityAdmin*, or *Select All*. </br> Connectivity - Enables the ability to create a full mesh or hub and spoke network topology between virtual networks within the scope. </br> SecurityAdmin - Enables the ability to create global network security rules. |

1. Select **Review + create** and then select **Create** once validation has passed.

## Create a Network Group
With your virtual network manager created, you now create a network group to encapsulate the VNets you want to protect. This will include all of the VNets in the organization as a general all-encompassing rule to block high risk network ports is needed.
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Security Admin Configuration
It’s time to construct our security admin rules within a configuration so that we can apply those rules to all the VNets within OurNetworkGroup at once. Create rules for all of your high risk ports. In this section, you'll add rules for SSH, FTP, and HTTP.
1. Select **Configurations** under *Settings* and then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-configuration.png" alt-text="Screenshot of add a security admin configuration.":::

1. Select **Security admin configuration** from the drop-down menu.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/security-admin-drop-down.png" alt-text="Screenshot of add a configuration drop-down.":::

1. On the **Basics** tab, enter a *Name* to identify this security configuration and select **Next: Rule collections**.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/security-configuration-name.png" alt-text="Screenshot of security configuration name field.":::

## Add a rule collection

1. Enter a *Name* to identify this rule collection and then select the *Target network groups* you want to apply the set of rules to.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/rule-collection-target.png" alt-text="Screenshot of rule collection name and target network groups.":::

## Add a security rule

1. Select **+ Add** from the *Add a rule collection page*.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/add-rule-button.png" alt-text="Screenshot of add a rule button.":::

1. Enter or select the following information, then select **Add** to add the rule to the rule collection.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/add-rule.png" alt-text="Screenshot of add a rule page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter the name **Deny_RDP** for the rule name. |
    | Description | Enter a description about the rule. |
    | Priority* | Enter a value between 0 and 99 to determine the priority of the rule. The lower the value the higher the priority. Enter **1** for this example|
    | Action* | Select **Deny** to block traffic. For more information, see [Action](concept-security-admins.md#action)
    | Direction* | Select **Inbound** as you want to deny inbound traffic with this rule. |
    | Protocol* | Select the **TCP** protocol. HTTP and HTTPS are TCP ports. |
    |**Source**| |
    | Source type | Select the source type of either **IP address** or **Service tags**. |
    | Source IP addresses | This field will appear when you select the source type of *IP address*. Enter an IPv4 or IPv6 address or a range using CIDR notation. When defining more than one address or blocks of addresses separate using a comma. Leave blank for this example.|
    | Source service tag | This field will appear when you select the source type of *Service tag*. Select service tag(s) for services you want to specify as the source. See [Available service tags](../virtual-network/service-tags-overview.md#available-service-tags), for the list of supported tags. |
    | Source port | Enter a single port number or a port range such as (1024-65535). When defining more than one port or port ranges, separate them using a comma. To specify any port, enter *. Leave blank for this example.|
    |**Desination**| |
    | Destination type | Select the destination type of either **IP address** or **Service tags**. |
    | Destination IP addresses | This field will appear when you select the destination type of *IP address*. Enter an IPv4 or IPv6 address or a range using CIDR notation. When defining more than one address or blocks of addresses separate using a comma. |
    | Destination service tag | This field will appear when you select the destination type of *Service tag*. Select service tag(s) for services you want to specify as the destination. See [Available service tags](../virtual-network/service-tags-overview.md#available-service-tags), for the list of supported tags. |
    | Destination port | Enter a single port number or a port range such as (1024-65535). When defining more than one port or port ranges, separate them using a comma. To specify any port, enter *. Enter **3389** for this example. |

1. Repeat steps 1-3 again if you want to add more rules to the rule collection.

1. Once you're satisfied with all the rules you wanted to create, select **Add** to add the rule collection to the security admin configuration.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/save-rule-collection.png" alt-text="Screenshot of a rule collection.":::

1. Then select **Review + Create** and **Create** to complete the security configuration.
## Deploy a Security Admin Configuration
We’re at the final step, which is to deploy OurSecurityConfig. This is how the security admin configuration will actually take effect on the VNets in OurNetworkGroup, and we can control the regions to which this deployment rolls out.

If you just created a new security admin configuration, make sure to deploy this configuration to apply to virtual networks in the network group.

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/deploy-configuration.png" alt-text="Screenshot of deploy a configuration button.":::

1. Select the **Include security admin in your goal state** checkbox and choose the security configuration you created in the last section from the dropdown menu. Then choose the region(s) you would like to deploy this configuration to.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/deploy-security-configuration.png" alt-text="Screenshot of deploy a security configuration page.":::

1. Select **Next** and **Deploy** to deploy the security admin configuration.
## Create a Network Group for traffic exceptions for allowed application traffic
We need to create a network group specifically for the Application 1 team’s VNets so that we can create security admin rules that pertain only to Application 1’s VNets and allow them to handle SSH traffic through their own NSGs. Since we already have OurNetworkManager created, we can go ahead and create another network group. 

## Create a Security Admin Rule Collection for Application 1
We can now create an exception for Application 1’s VNets by adding a new rule collection and security admin rule to our existing security admin configuration.

## Re-deploy the Security Admin Configuration
We’re at the final step, which is to redeploy OurSecurityConfig since we’ve modified this configuration by adding a rule collection.


## Verify security admin rules

Go to the **Networking** settings for a virtual machine in the one of the virtual networks you applied the security admin rules to. If you don't have one, deploy a test virtual machine into one of the virtual networks. You'll now see a new section below the network security group rules about security rules applied by Azure Virtual Network Manager.

:::image type="content" source="./media/how-to-block-network-traffic-portal/vm-security-rules.png" alt-text="Screenshot of security admin rules under virtual machine network settings." lightbox="./media/how-to-block-network-traffic-portal/vm-security-rules-expanded.png":::

## Clean up

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
