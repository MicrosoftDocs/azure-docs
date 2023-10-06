---
title: 'Protect high-risk network ports with SecurityAdmin Rules in Azure Virtual Network Manager.'
description: You deploy Security admin rules to protect high-risk security ports with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to 
ms.date: 03/15/2023
ms.custom: template-how-to
---
# Protect high-risk network ports with Security Admin Rules in Azure Virtual Network Manager


In this article, you learn to block high risk network ports using [Azure Virtual Network Manager](overview.md) and Security Admin Rules. You walk through the creation of an Azure Virtual Network Manager instance, group your virtual networks (VNets) with [network groups](concept-network-groups.md), and create & deploy security admin configurations for your organization. You deploy a general block rule for high risk ports. Then you create an exception for managing a specific application's VNet using network security groups.

While this article focuses on a single port, SSH, you can protect any high-risk ports in your environment with the same steps. To learn more, review this list of [high risk ports](concept-security-admins.md#protect-high-risk-ports)

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites
- You understand how to create an [Azure Virtual Network Manager](./create-virtual-network-manager-portal.md)
- You understand each element in a [Security admin rule](concept-security-admins.md).
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A group of virtual networks that can be split into network groups for applying granular security admin rules.
- To modify dynamic network groups, you must be [granted access via Azure RBAC role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin/legacy authorization is not supported

## Deploy virtual network environment
You need a virtual network environment that includes virtual networks that can be segregated for allowing and blocking specific network traffic. You may use the following table or your own configuration of virtual networks:

| Name | IPv4 address space | subnet |
| ---- | ----| ---- |
| vnetA-gen | 10.0.0.0/16 | default - 10.0.0.0/24 |
| vnetB-gen | 10.1.0.0/16 | default - 10.1.0.0/24 |
| vnetC-gen | 10.2.0.0/16 | default - 10.2.0.0/24 |
| vnetD-app | 10.3.0.0/16 | default - 10.3.0.0/24 |
| vnetE-app | 10.4.0.0/16 | default - 10.4.0.0/24 |

* Place all virtual networks in the same subscription, region, and resource group

Not sure how to build a virtual network? Learn more in [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

## Create a Virtual Network Manager

In this section, you deploy a Virtual Network Manager instance with the Security admin feature in your organization.

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Create** to begin setting up Azure Virtual Network Manager.

1. On the *Basics* tab, enter or select the information for your organization:

    :::image type="content" source="media/how-to-block-high-risk-ports/network-manager-basics-thumb.png" alt-text="Screenshot of Create a network manager Basics page." lightbox="media/how-to-block-high-risk-ports/network-manager-basics.png":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy Azure Virtual Network Manager to. |
    | Resource group | Select or create a resource group to store Azure Virtual Network Manager. This example uses the **myAVNMResourceGroup** previously created. |
    | Name | Enter a name for this Azure Virtual Network Manager instance. This example uses the name **myAVNM**. |
    | Region | Select the region for this deployment. Azure Virtual Network Manager can manage virtual networks in any region. The region selected is for where the Virtual Network Manager instance will be deployed. |
    | Description | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it's managing. |
    | [Scope](concept-network-manager-scope.md#scope) | Define the scope for which Azure Virtual Network Manager can manage. This example uses a subscription-level scope. |
    | [Features](concept-network-manager-scope.md#features) | Select the features you want to enable for Azure Virtual Network Manager. Available features are *Connectivity*, *SecurityAdmin*, or *Select All*. </br> Connectivity - Enables the ability to create a full mesh or hub and spoke network topology between virtual networks within the scope. </br> SecurityAdmin - Enables the ability to create global network security rules. |

1. Select **Review + create** and then select **Create** once validation has passed.
1. Select **Go to resource** when deployment is complete and review the virtual network manager configuration

## Create a network group

With your virtual network manager created, you now create a network group containing all of the VNets in the organization, and you manually add all of the VNets.
1. Select **Network Groups**, under **Settings**.
1. Select **+ Create**, enter a *name* for the network group, and select **Add**.
1. On the *Network groups* page, select the network group you created.
1. Select **Add**, under **Static Membership** to manually add all the VNets.
1. On the **Add static members** page, select all of the virtual networks you wish to include, and select **Add**.
    :::image type="content" source="media/how-to-block-high-risk-ports/add-members-manual-network-group.png" alt-text="Screenshot of Add Static Members page showing manual selection of virtual networks.":::

## Create a security admin configuration denying traffic

It’s time to construct our security admin rules within a configuration in order to apply those rules to all the VNets within your network group at once. In this section, you create a security admin configuration. Then you create a rule collection and add rules for high risks ports like SSH or RDP. This configuration denies network traffic to all virtual networks in the network group.
1. Return to your virtual network manager resource.
1. Select **Configurations** under *Settings* and then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-configuration.png" alt-text="Screenshot of add a security admin configuration.":::

1. Select **Security configuration** from the drop-down menu.

    :::image type="content" source="./media/create-virtual-network-manager-portal/security-admin-dropdown.png" alt-text="Screenshot of add a configuration drop-down.":::

1. On the **Basics** tab, enter a *Name* to identify this security configuration and select **Next: Rule collections**.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/security-configuration-name.png" alt-text="Screenshot of security configuration name field.":::

1. Select **+ Add** from the *Add a security configuration page*.

1. Enter a *Name* to identify this rule collection and then select the *Target network groups* you want to apply the set of rules to. The target group is the network group containing all of your virtual networks.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/rule-collection-target.png" alt-text="Screenshot of rule collection name and target network groups.":::

## Add a security rule for all virtual networks

In this section, you define the security rule to block high-risk network traffic to all virtual networks. When assigning priority, keep in mind future exception rules. Set the priority so that exception rules are applied over this rule.

1. Select **+ Add** under **Security admin rules**.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/add-rule-button.png" alt-text="Screenshot of add a rule button.":::

1. Enter the information needed to define your security rule, then select **Add** to add the rule to the rule collection.

    :::image type="content" source="./media/how-to-block-high-risk-ports/add-deny-rule.png" alt-text="Screenshot of add a rule page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a rule name. |
    | Description | Enter a description about the rule. |
    | Priority* | Enter a value between 1 and 4096 to determine the priority of the rule. The lower the value the higher the priority.|
    | Action* | Select **Deny** to block traffic. For more information, see [Action](concept-security-admins.md#action)
    | Direction* | Select **Inbound** as you want to deny inbound traffic with this rule. |
    | Protocol* | Select the network protocol for the port. |
    |**Source**| |
    | Source type | Select the source type of either **IP address** or **Service tags**. |
    | Source IP addresses | This field appears when you select the source type of *IP address*. Enter an IPv4 or IPv6 address or a range using CIDR notation. When defining more than one address or blocks of addresses separate using a comma. Leave blank for this example.|
    | Source service tag | This field appears when you select the source type of *Service tag*. Select service tag(s) for services you want to specify as the source. See [Available service tags](../virtual-network/service-tags-overview.md#available-service-tags), for the list of supported tags. |
    | Source port | Enter a single port number or a port range such as (1024-65535). When defining more than one port or port ranges, separate them using a comma. To specify any port, enter *. Leave blank for this example.|
    |**Destination**| |
    | Destination type | Select the destination type of either **IP address** or **Service tags**. |
    | Destination IP addresses | This field appears when you select the destination type of *IP address*. Enter an IPv4 or IPv6 address or a range using CIDR notation. When defining more than one address or blocks of addresses separate using a comma. |
    | Destination service tag | This field appears when you select the destination type of *Service tag*. Select service tag(s) for services you want to specify as the destination. See [Available service tags](../virtual-network/service-tags-overview.md#available-service-tags), for the list of supported tags. |
    | Destination port | Enter a single port number or a port range such as (1024-65535). When defining more than one port or port ranges, separate them using a comma. To specify any port, enter *. Enter **3389** for this example. |

1. Repeat steps 1-3 again if you want to add more rules to the rule collection.

1. Once you're satisfied with all the rules you wanted to create, select **Add** to add the rule collection to the security admin configuration.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/save-rule-collection.png" alt-text="Screenshot of a rule collection.":::

1. Then select **Review + Create** and **Create** to complete the security configuration.
## Deploy a security admin configuration

In this section, the rules created take effect when you deploy the security admin configuration.

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/deploy-configuration.png" alt-text="Screenshot of deploy a configuration button.":::

1. Select the **Include security admin in your goal state** checkbox and choose the security configuration you created in the last section from the dropdown menu. Then choose the region(s) you would like to deploy this configuration to.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/deploy-security-configuration.png" alt-text="Screenshot of deploy a security configuration page.":::

1. Select **Next** and **Deploy** to deploy the security admin configuration.
## Create a network group for exception virtual networks

With traffic blocked across all of your VNets, you need an exception to allow traffic to specific virtual networks. You create a network group specifically for the VNets needing exclusion from the other security admin rule.

1. From your virtual network manager, select **Network Groups**, under **Settings**.
1. Select **+ Create**, enter a *name* for the application network group, and select **Add**.
1. Under **Define Dynamic Membership**, select **Define**.
1. Enter or select the values to allow traffic to your application virtual network. 
    :::image type="content" source="media/how-to-block-high-risk-ports/define-dynamic-network-group.png" alt-text="Screenshot of Define Network Group page with a condition for selecting virtual networks for group membership.":::
1. Select **Preview Resources** to review the **Effective Virtual Networks** included, and select **Close**.
    :::image type="content" source="media/how-to-block-high-risk-ports/effective-virtual-networks.png" alt-text="Screenshot of Effective Virtual Networks page showing virtual networks dynamically included in network group.":::
1. Select **Save**.

## Create an exception Security Admin Rule collection and Rule

In this section, you create a new rule collection and security admin rule that allows high-risk traffic to the subset of virtual networks you've defined as exceptions. Next, you add it to your existing security admin configuration.

> [!IMPORTANT]
> In order for your security admin rule to allow traffic to your application virtual networks, the priority needs to be set to a **lower number** than existing rules blocking traffic. 
>
>For example, an all network rule blocking **SSH** has a priority of **10** so your allow rule should have a priority from **1 to 9**.
1. From your virtual network manager, select **Configurations** and select your security configuration.
1. Select **Rule collections** under **Settings**, then select **+ Create** to create a new rule collection.
1. On the **Add a rule collection page**, enter a name for your application rule collection and choose the application network group you created.
1. Under the **Security admin rules**, select + Add.
1. Enter or select the values to allow specific network traffic to your application network group, and select **add** when completed.
1. Repeat the add rule process for all traffic needing an exception.
1. Select **Save** when you're done.
## Redeploy the security admin configuration

To apply the new rule collection, you redeploy your security admin configuration since it was modified by adding a rule collection.

1. From your virtual network manager, select **Configurations**.
1. Select your security admin configuration and select **Deploy**
1. On the **Deploy Configuration** page, select all target regions receiving the deployment and 
1. Select **Next** and **Deploy**.

## Next steps

- Learn how to [create a mesh network topology with Azure Virtual Network Manager using the Azure portal](how-to-create-mesh-network.md)

- Check out the [Azure Virtual Network Manager FAQ](faq.md)
