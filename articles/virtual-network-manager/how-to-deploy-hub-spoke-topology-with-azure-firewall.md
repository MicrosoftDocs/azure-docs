---
title: How to deploy Hub-Spoke topology with Azure Firewall
description: Learn how to deploy a Hub-Spoke topology with Azure Firewall using Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 05/7/2024
---

# How to deploy Hub-Spoke topology with Azure Firewall

In this article, you will learn how to deploy a Hub-Spoke topology with Azure Firewall using Azure Virtual Network Manager (AVNM). 

Many organizations use Azure Firewall to protect their virtual networks from threats and unwanted traffic, and they will route all traffic to Azure Firewall except trusted traffic within the same virtual network. Traditionally, setting up such a scenario is cumbersome because new user-defined routes (UDRs) need to be created for each new subnet, and all route tables have different UDRs. UDR management in Azure Virtual Network Manager can help you easily achieve this scenario by creating a routing rule that routes all traffic to Azure Firewall, except the traffic within the same virtual network.

## Prerequisites

- An Azure subscription with permissions to create resources in the subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- 

## Create virtual networks and subnets

In this step, you create a hub virtual network and spoke virtual networks with subnets.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **rg-vnm** in Name. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **hub-vnet-1**. |
    | Region | Select **East US 2**. |

    :::image type="content" source="./media/virtual-network-create/create-virtual-network-basics.png" alt-text="Screenshot of Basics tab of Create virtual network in the Azure portal." lightbox="./media/virtual-network-create/create-virtual-network-basics.png":::

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP Addresses** tab.
    
1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-1**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Subnet size | Leave the default of **/24(256 addresses)**. |

    :::image type="content" source="./media/virtual-network-create/address-subnet-space.png" alt-text="Screenshot of default subnet rename and configuration.":::

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.

1. Repeat the virtual network creation steps to create two spoke virtual networks with subnets using the following details:

| **Name** | **Region** | **Subnet name** | **Starting address** | **Subnet size** |
|---|---|---|---|---|
| spoke-vnet-1 | East US 2 |  subnet-1 | 10.0.1.0 | /24(256 addresses) |
| spoke-vnet-2 | East US 2 |  subnet-1 | 10.0.2.0 | /24(256 addresses) |

[!INCLUDE [virtual-network-manager-create-udr-instance](../../includes/virtual-network-manager-create-udr-instance.md)]

## Add a spoke network group

In this step, you add a network group of spoke virtual networks to your virtual network manager.

1. Browse to the your resource group, and select the your Virtual Network Manager instance.

1. Under **Settings**, select **Network groups**. Then select **Add a network group**.

1. On the **Add a network group** pane, enter **ng-1** and select **Create**.


Graphical user interface, text, application, email

Description automatically generated 

Create a network group by naming it and adding VNets to the group. You can add VNets manually as static group members, or automatically as dynamic group members through conditional statements.  

Here, we are going to create a network group of spoke VNets in the hub and spoke topology with the condition of VNets’ name containing “ANMDemo-Spoke” 

A screenshot of a computer

Description automatically generated 

Step 3. Create a routing configuration and rule collection 

Navigate to the Configurations page under Settings and select Create” with the type “Routing configuration,” and add a rule collection, where the target network group is your spoke network group. 

Step 4. Create routing rules 

Create the following rule. 

A screenshot of a computer

Description automatically generated. 

A screenshot of a computer

Description automatically generated with low confidence 

By using the above rule, you can easily route all traffic to an Azure Firewall, except the destination is in the same VNet to reduce latency for routing and inspection cost if the traffic within the same VNet is trusted. All new subnets in the VNets in the spoke network group can automatically get the necessary UDRs to make this routing behavior happen. 

Step 5. Commit the configuration 

Deploy the configurations, and the target regions to commit your desired configuration(s).  

A screenshot of a computer

Description automatically generated with medium confidence 

Variation - route all traffic to Azure Firewall in a hub and spoke topology but trusted VNets can have communicate directly 

In this topology, some spoke virtual networks are directly connected by using AVNM's direct connectivity, unlike the hub and spoke topology above. This topology helps some trusted virtual networks communicate directly without the hub's firewall. This way, the latency between these virtual networks can be reduced. You can monitor the traffic between these virtual networks by using virtual network flow logs. 

 

Step 1. Create a network group of trusted VNets 

In your Network Manager resource, navigate to the Network groups page under Settings and select Create and create Network group with Member type Virtual network. 



In the previously created Network group, select Group members and click Add to add existing VNets 


 

Step 2. Create a connectivity configuration 

In your Network Manager resource, navigate to the Configurations page under Settings and select Create - Connectivity configuration and create Connectivity configurations. 



In Topology tab, select Hub and spoke option and choose Hub VNet where the trusted spoke VNet connected, and add the Nework group created in the previous Step 1. Also, check Enable connectivity within network group option to enable direct connectivity within trusted VNets. 



 

Step 3. Commit the configuration 

Deploy the Connectivity configuration to the target region to commit your desired configuration. 

In your Network Manager resource, navigate to the Deployments page under Settings and click Deploy configurations – Connectivity configuration. 



In Connectivity configurations, select Connectivity configuration you have created, and select the target regions where the configuration to be deployed.   

Click Next and review the configuration to be deployed, then click Deploy. 