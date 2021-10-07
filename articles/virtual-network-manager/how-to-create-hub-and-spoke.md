---
title: 'Create a hub and spoke topology with Azure Virtual Network Manager (Preview)'
description: Learn how to create a hub and spoke network topology with Azure Virtual Network Manager.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-concept
---

# Create a hub and spoke topology with Azure Virtual Network Manager (Preview)

In this article, you'll learn how to create a hub and spoke network topology using Azure Virtual Network Manager. With this configuration, you select a virtual network to act as a hub and all spoke virtual networks will have bi-directional peering with only the hub by default. You also can enable transitivity between spoke virtual networks and enable the spoke virtual networks to use the virtual network gateway in the hub.

> [!IMPORTANT]
> *Azure Virtual Network Manager* is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md).
* Read about [Hub-and-spoke](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology.md) network topology.

## Create virtual networks

This procedure walks you through creating three virtual networks, two of which will be in the *West US* region and one will be in the *East US* region. If you already have virtual networks set up in your environment, skip to [create a network group](#group).

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Virtual network**. Then select **Create** to begin configuring the virtual network.

1. On the *Basics* tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Resource group | Select or create a new resource group to store the virtual network. This quickstart will use a resource group named **myAVNMResourceGroup**.
    | Name | Enter **VNet-A-WestUS** for the virtual network name. |
    | Region | Select the **West US** region. |

 1. On the *IP Addresses* tab, configure the following network address space:

    | Setting | Value |
    | -------- | ----- |
    | IPv4 address space | Enter **10.3.0.0/16** as the address space. |
    | Subnet name | Enter the name **default** for the subnet. |
    | Subnet address space | Enter the subnet address space of **10.3.0.0/24**. |

1. Select **Review + create** and then select **Create** to deploy the virtual network.

1. Repeat steps 2-5 to create two more virtual networks into the same resource group. Enter the following information:

    **Second virtual network**:
    * Name: **VNet-B-WestUS**
    * Region: **West US**
    * IPv4 address space: **10.4.0.0/16**
    * Subnet name: **default**
    * Subnet address space: **10.4.0.0/24**

    **Third virtual network**:
    * Name: **VNet-A-EastUS**
    * Region: **East US**
    * IPv4 address space: **10.5.0.0/16**
    * Subnet name: **default**
    * Subnet address space: **10.5.0.0/24**

## <a name="group"></a> Create a network group

This section will help you create a network group containing the three virtual networks created in the previous section.

1. Go to your Azure Virtual Network Manager instance. This how-to guide assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide.

1. Select **Network groups** under *Settings*, and then select **+ Add** to create a new network group.

1. Enter a *Name* and a *Description* about this network group.

1. Select the *Static group members* tab, and then select **+ Add virtual networks**. 

1. Select only **VNet-A-EastUS** and then select **Add**.

1. Select the *Conditional statements* tab to configure dynamic members.

1. For *Parameter*, select **Name** from the drop-down. Then for the *Operator* select **Contains**. Lastly for *Condition*, enter **WestUS**. Select the **Evaluate** button to see which virtual networks match the conditional query. Then select **Close** to go back to the *Add network group* page. With this conditional statement, you've selected the two West US virtual networks as dynamic members. For more information about static and dynamic membership, see [network groups](concept-network-groups.md).

1. Once you're satisfied with the virtual networks selected for the network group, select **Review + create**. Then select **Create** once validation has passed.
 
## Create a hub and spoke connectivity configuration

This section will guide you through how to create a hub-and-spoke configuration with the network group you created in the previous section.

1. Select **Configuration** under *Settings*, then select **+ Add a configuration**.
1. Select **Connectivity** from the drop-down menu.
1. On the *Add a connectivity configuration* page, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. This example will use **HubA**. |
    | Description | *Optional* Enter a description about what this configuration will do. |
    | Topology | Select the **Hub and spoke** topology. |
    | Hub | Select a virtual network that will act as the hub virtual network. |
    | Existing peerings | Select this checkbox if you want to remove all previously created VNet peering between virtual networks in the network group defined in this configuration. |

1. Then select **+ Add network groups**. 

1. On the *Add network groups* page, select the checkbox next to the **GroupA_Hub** network group. Then select **Add** to add the network group to the configuration.

1. You'll see the following three options appear next to the network group name under *Spoke network groups*:
    
    * *Transitivity*: Select **Enable peering within network group** if you want to establish VNet peering between virtual networks in the network group of the same region.
    * *Global Mesh*: Select **Enable mesh connectivity across regions** if you want to establish VNet peering for all virtual networks in the network group across regions.
    * *Gateway*: Select **Use hub as a gateway** if you have a virtual network gateway in the hub virtual network that you want this network group to use to pass traffic to on-premises.

    For this example, select the checkbox for **Enable peering within network group** and **Enable mesh connectivity across regions**.

1. Select **Add** to create the hub and spoke connectivity configuration.

## Deploy the hub and spoke configuration

1. Select **Deployments** under *Settings*, then select **Deploy a configuration**.

1. On the *Deploy a configuration* select the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Configuration type | Select **Connectivity**. |
    | Configurations | Select **HubA**. |
    | Target regions | Select **West US** and **East US**. |

1. Select **Deploy** and then select **OK** to commit the configuration to the selected regions.

1. After a few minutes, select the **Refresh** button to check the status of the deployment.

## Confirm deployment

1. Go to **VNet-A-WestUS** virtual network in the portal and select **Peerings** under *Settings*. You should see two peerings listed, one peering to *VNet-B-WestUS* and another peering to *VNet-A-EastUS*. 

1. To test *transitivity* between **VNet-B-WestUS** and **VNet-A-EastUS**, deploy a virtual machine into each virtual network. Then start an ICMP request between the two virtual machines.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).