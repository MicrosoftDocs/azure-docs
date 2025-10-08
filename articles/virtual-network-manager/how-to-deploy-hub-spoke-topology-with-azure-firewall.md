---
title: How to deploy hub and spoke topology with Azure Firewall
description: Learn how to deploy a hub and spoke topology with Azure Firewall using Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/11/2025
---

# How to deploy hub-and-spoke topology with Azure Firewall

In this article, you learn how to deploy a hub-and-spoke topology with Azure Firewall using Azure Virtual Network Manager. You create an Azure Virtual Network Manager instance, or network manager, and implement network groups for trusted and untrusted traffic. Next, you deploy a connectivity configuration that defines your hub-and-spoke topology. When deploying the connectivity configuration, you have a choice of adding [direct connectivity](concept-connectivity-configuration.md#enable-direct-connectivity) for trusted communication between spoke virtual networks, or requiring spoke virtual networks to communicate through the hub virtual network. You finish by deploying a routing configuration to route all traffic to Azure Firewall, except for the traffic within the same virtual network when the virtual networks are trusted.

Many organizations use Azure Firewall to protect their virtual networks from threats and unwanted traffic, and they route all traffic to Azure Firewall except trusted traffic within the same virtual network. Traditionally, setting up such a scenario is cumbersome because new user-defined routes (UDRs) need to be created for each new subnet and route tables have different UDRs among them. [UDR management](concept-user-defined-route.md) in Azure Virtual Network Manager can help you easily achieve this scenario by creating a routing rule that routes all traffic to Azure Firewall, except for the traffic within the same virtual network, and applying this rule easily across your spoke virtual networks.

## Prerequisites

- An Azure subscription with permissions to create resources in the subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- Three virtual networks with subnets in the same region. One virtual network is the hub virtual network, and the other two virtual networks are the spoke virtual networks. 
  - For this example, the hub virtual network is named **hub-vnet**, and the spoke virtual networks are **spoke-vnet-1** and **spoke-vnet-2**.
  - The hub virtual network requires a subnet for the Azure Firewall named **AzureFirewallSubnet**.

- An Azure Virtual Network Manager instance with user-defined routing and connectivity features enabled.

- All virtual networks configured in a hub-and-spoke topology through a connectivity configuration or manually created.

- An Azure Firewall in the hub virtual network. For more information, see [Deploy and configure Azure Firewall and policy using the Azure portal](../firewall/tutorial-firewall-deploy-portal-policy.md).

[!INCLUDE [virtual-network-manager-create-udr-instance](../../includes/virtual-network-manager-create-udr-instance.md)]

[!INCLUDE [virtual-network-manager-create-spoke-network-group](../../includes/virtual-network-manager-create-spoke-network-group.md)]

[!INCLUDE [virtual-network-manager-deploy-hub-spoke-topology](../../includes/virtual-network-manager-deploy-hub-spoke-topology.md)]

## Create a routing configuration and rule collection

In this task, you create a routing configuration and rule collection that includes your spoke network group. Routing configurations define the routing rules for traffic between virtual networks.

1. In the network manager instance, select **Configurations** under **Settings**.
2. On the **Create a routing configuration** page, enter the routing configuration's **Name** and **Description** on the **Basics** tab, then select **Next: Rule collection >**.
3. Select **Add** on the **Rule collections** tab.
4. In the **Add a rule collection** window, enter or select the following settings for the rule collection:

    | **Setting** | **Value** |
    |---|---|
    | **Name** | Enter a name for your rule collection. |
    | **Description** | (Optional) Enter a description for your rule collection. |
    | **Local route setting** | Select **Direct routing within virtual network**. |
    | **Enable BGP route propagation** | (Optional) Select **Enable BGP route propagation** if you want to enable Border Gateway Protocol (BGP) route propagation. |
    | **Target network group** | Select your spoke network group. |

1. Under **Routing rules**, select **Add** to create a new routing rule.
2. In the **Add a routing rule** window, enter or select the following settings for the routing rule:

    | **Setting** | **Value** |
    |---|---|
    | **Name** | Enter a name for your routing rule. |
    | **Destination** |  |
    | **Destination type** | Select **IP Address**. |
    | **Destination IP Addresses/CIDR ranges** | enter **0.0.0.0/0**. |
    | **Next hop** |  |
    | **Next hop type** | Select **Virtual Appliance**.</br> Select **Import Azure firewall private IP address**|
    | **Azure firewalls** | Select your Azure firewall then choose **Select**. | 

3. Select **Add** to add the routing rule to the rule collection.
4. Select **Add** to add the rule collection to the routing configuration.
5. Select **Review + create** then select **Create**.

## Deploy the routing configuration

In this task, you deploy the routing configuration to create the routing rules for the hub-and-spoke topology.

1. In the network manager instance, select **Deployments** under **Settings**.
2. Select **Deploy configurations** then select **Routing configuration - Preview**.
3. In the **Deploy a configuration** window, select the routing configuration you created, and select the **Target regions** you wish to deploy the configuration to.
1. Select **Next** or **Review + deploy** to review the deployment then select **Deploy**.

## Delete all resources

If you no longer need the resources created in this article, you can delete them to avoid incurring more costs.

1. In the Azure portal, search for and select **Resource groups**.
2. Select the resource group that contains the resources you want to delete.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about user-defined route management in Azure Virtual Network Manager](concept-user-defined-route.md).
> [Learn how to use user-defined route management in Azure Virtual Network Manager](how-to-create-user-defined-route.md).
> [Learn how to manage multiple hub-and-spoke topologies in Azure Virtual Network Manager](how-to-manage-user-defined-routes-multiple-hub-spoke-topologies.md).
