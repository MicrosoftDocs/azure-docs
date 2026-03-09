---
title: Create User-Defined Routes with Azure Virtual Network Manager
description: Learn how to deploy User-Defined Routes (UDRs) with Azure Virtual Network Manager using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 12/17/2025
#customer intent: As a network engineer, I want to deploy User-Defined Routes (UDRs) with Azure Virtual Network Manager.
---

# Create User-Defined Routes (UDRs) in Azure Virtual Network Manager

In this article, you learn how to deploy [User-Defined Routes (UDRs)](concept-user-defined-route-management.md) with Azure Virtual Network Manager in the Azure portal. UDRs allow you to describe your desired routing behavior, and Virtual Network Manager orchestrates UDRs to create and maintain that behavior. You deploy all the resources needed to create UDRs in an existing network manager instance including a network group, routing configuration, and rule collection.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- You need to have the **Network Contributor Role** for the scope that you want to use for your virtual network manager instance.

- A Virtual Network Manager instance with *user defined routing* and *Connectivity* features enabled during setup. In this how-to, your Virtual Network Manager instance is named **network-manager**. If you don't have a Virtual Network Manager instance, see [Create a Virtual Network Manager instance](./create-virtual-network-manager-portal.md) for instructions.

## Create virtual networks and subnets

In this step, you create two virtual networks to become members of a network group. Before beginning, make sure you're using the same subscription and resource group as your Virtual Network Manager instance.

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual networks**. 

1. Select **Virtual networks > Create** to begin configuring a virtual network.

1. On the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy this virtual network. |
    | **Resource group** | Select **resource-group**. |
    | **Virtual network name** | Enter **vnet-001**. |
    | **Region** | Select **(US) West US 2**. |

1. Select **Next: Security** > **Next: IP Addresses** or the **IP addresses** tab.

1. On the **IP addresses** tab, enter an IPv4 address range of **10.1.0.0** and **/16**. The default subnet will be **10.1.0.0/24**

1. Select **Review + create** > **Create**.

1. Return to **Home**. From the home screen, create another virtual network in **West US 2** called **vnet-002** with an IPv4 address range of **10.2.0.0/16**. The default subnet will be **10.2.0.0/24**. Use the same subscription, resource group, and region as the first virtual network.

1. Select **Save** then **Review + create** > **Create**.

## Create a network group with Azure Policy

In this step, you create a network group containing your virtual networks using Azure policy.

1. From the **Home** page, select **Resource groups** and browse to the **resource-group** resource group, and select the network manager instance.

1. Under **Settings**, select **Network groups**. Then select **Create**.

1. On the **Create a network group** pane, enter the following information:
   
    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **network-group**. |
    | **Description** | *(Optional)* Provide a description about this network group. |
    | **Member type** | Select **Virtual network**. |

1. Select **Create**.

1. Select **network-group** and choose **Create Azure Policy**.
1. In **Create Azure Policy**, enter or select the following information:
   
    | Setting | Value |
    | ------- | ----- |
    | **Policy name** | Enter **azure-policy**. |
    | **Scope** | Select **Select Scope** and choose your subscription, if not already selected. |

1. Under **Criteria**, enter a conditional statement to define the network group membership. Enter or select the following information:
    
    | Setting | Value |
    | ------- | ----- |
    | **Parameter** | Select **Name** from the dropdown menu. |
    | **Operator** | Select **Contains** from the dropdown menu. |
    | **Condition** | Enter **vnet**. |

1. Select **Preview Resources** to see the resources included in the network group. The virtual networks that match the condition will be listed. 
1. Select **Close** then select **Save** to create the policy.
   
## Create a routing configuration and rule collection

In this step, you define the UDRs for the network group by creating a routing configuration and rule collection with routing rules.

1. Return the **vnm-1** Virtual Network Manager instance and **Configurations** under **Settings**.

1. Select **+ Create** or **Create routing configuration**.

1. In **Create a routing configuration**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **routing-configuration**. |
    | **Description** | *(Optional)* Provide a description about this routing configuration. |

1. Select **Rule collections** tab or **Next: Rule collections >**.

1. In **Rule collections**, select **+ Add**.

1. In **Add a rule collection**, enter, or select the following information:
   
    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **rule-collection-1**. |
    | **Description** | *(Optional)* Provide a description about this rule collection. |
    | **Enable BGP route propagation** | Leave **unchecked**. |
    | **Target network groups** | select **network-group**. |

1. Under **Routing rules**, select **+ add**.

1. In **Add a routing rule**, enter, or select the following information:
   
   | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **rr-spoke**. |
    | **Destination** | |
    | **Destination type** | Select **IP address**. |
    | **Destination IP addresses/CIDR ranges** | Enter **0.0.0.0/0**. |
    | **Next hop** | |
    | **Next hop type** | Select **Virtual network**. |

1. Select **Add** and **Add to save the routing rule collection.

1. Select **Review + create** and then **Create** to create the routing configuration.

## Deploy the routing configuration

In this step, you deploy the routing configuration to create the UDRs for the network group.

1. On the **Configurations** page, select the checkbox for **routing-configuration** and choose **Deploy** from the taskbar.
1. In **Deploy a configuration** , select, or enter the **routing-configuration**
   
   | Setting | Value |
    | ------- | ----- |
    | **Configurations** |  |
    | **Include user defined routing configurations in your goal state** | Select checkbox. |
    | **User defined routing configurations** | Select **routing-configuration**. |
    | **Region** |  |
    | **Target regions** | Select **(US) West US 2**. |

1. Select **Next** and then **Deploy** to deploy the routing configuration.

> [!NOTE]
> When you create and deploy a routing configuration, you need to be aware of the impact of existing routing rules. For more information, see [Impacts of user-defined routes](./concept-user-defined-route.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about User-Defined Routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md)
