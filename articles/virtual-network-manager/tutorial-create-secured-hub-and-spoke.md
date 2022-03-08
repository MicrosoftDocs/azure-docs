---
title: 'Tutorial: Create a secured hub and spoke network'
description: In this tutorial, you'll learn how to create a hub and spoke network with Azure Virtual Network Manager. Then you'll secure all your virtual networks with a security policy.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: tutorial
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Tutorial: Create a secured hub and spoke network

In this tutorial, you'll create a hub and spoke network topology using Azure Virtual Network Manager. You'll then deploy a virtual network gateway in the hub virtual network to allow resources in the spoke virtual networks to communicate with remote networks using VPN. You'll also configure a security configuration to block outbound network traffic to the internet on ports 80 and 443. Lastly, you'll verify that configurations were applied correctly by looking at the virtual network and virtual machine settings.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create multiple virtual networks.
> * Deploy a virtual network gateway.
> * Create a hub and spoke network topology.
> * Create a security configuration blocking traffic on port 80 and 443.
> * Verify configurations were applied.

## Prerequisite

* Before you can complete steps in this tutorial, you must first [create an Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.

## Create virtual networks

This procedure walks you through creating three virtual networks. One will be in the *West US* region and the other two will be in the *East US* region.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Virtual network**. Then select **Create** to begin configuring the virtual network.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-vnet.png" alt-text="Screenshot of create a virtual network page.":::

1. On the *Basics* tab, enter or select the following information:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-hub-vnet-basic.png" alt-text="Screenshot of basics tab for hub and spoke virtual network.":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Resource group | Select or create a new resource group to store the virtual network. This quickstart will use a resource group named **myAVNMResourceGroup**.
    | Name | Enter **VNet-A-WestUS** for the virtual network name. |
    | Region | Select the **West US** region. |

 1. On the *IP Addresses* tab, configure the following network address space:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-hub-vnet-addresses.png" alt-text="Screenshot of IP addresses tab for hub and spoke virtual network.":::

    | Setting | Value |
    | -------- | ----- |
    | IPv4 address space | Enter **10.3.0.0/16** as the address space. |
    | Subnet name | Enter the name **default** for the subnet. |
    | Subnet address space | Enter the subnet address space of **10.3.0.0/24**. |

1. Select **Review + create** and then select **Create** to deploy the virtual network.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-vnet-validation.png" alt-text="Screenshot of validation page for hub and spoke virtual network.":::

1. Repeat steps 2-5 to create two more virtual networks into the same resource group with the following information:

    **Second virtual network**:
    * Name: **VNet-A-EastUS**
    * Region: **East US**
    * IPv4 address space: **10.4.0.0/16**
    * Subnet name: **default**
    * Subnet address space: **10.4.0.0/24**

    **Third virtual network**:
    * Name: **VNet-B-EastUS**
    * Region: **East US**
    * IPv4 address space: **10.5.0.0/16**
    * Subnet name: **default**
    * Subnet address space: **10.5.0.0/24**

## Deploy a virtual network gateway

Deploy a virtual network gateway into the hub virtual network. This virtual network gateway is necessary for the spokes to *Use hub as a gateway* setting.

1. Select **+ Create a resource** and search for **Virtual network gateway**. Then select **Create** to begin configuring the virtual network gateway.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-gateway.png" alt-text="Screenshot of create a virtual network gateway page.":::

1. On the *Basics* tab, enter or select the following settings:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/gateway-basics.png" alt-text="Screenshot of create the virtual network gateway basics tab." lightbox="./media/tutorial-create-secured-hub-and-spoke/gateway-basics-expanded.png":::

1. Select **Review + create** and then select **Create** after validation has passed. The deployment of a virtual network gateway can take about 30 minutes. You can move on to the next section while waiting for this deployment to complete.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/gateway-validation.png" alt-text="Screenshot of create a virtual network gateway validation page.":::

## Create a network group

1. Go to your Azure Virtual Network Manager instance. This tutorial assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide.

1. Select **Network groups** under *Settings*, and then select **+ Add** to create a new network group.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-network-group.png" alt-text="Screenshot of add a network group button.":::

1. On the *Basics* tab, enter the following information:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-basics.png" alt-text="Screenshot of the create a network group basics tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myNetworkGroupB** for the network group name. |
    | Description | Provide a description about this network group. |

1. Select the **Conditional statements** tab. For the *Parameter* select **Name** from the drop-down. For the *Operator* select **Contains**. For the *Condition*, enter **VNet-**. This conditional statement will add the three previously created virtual networks into this network group.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-conditional.png" alt-text="Screenshot of create a network group conditional statements tab.":::

1. Select **Evaluate** if you need to verify the virtual networks selected.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/evaluate-vnet.png" alt-text="Screenshot of effective virtual networks page.":::

1. Select **Review + create** and then select **Create** once validation has passed.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-validation.png" alt-text="Screenshot of create network group validation page.":::

## Create a hub and spoke connectivity configuration

1. Select **Configuration** under *Settings*, then select **+ Add a configuration**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-configuration.png" alt-text="Screenshot of add a configuration button for Network Manager.":::

1. Select **Connectivity** from the drop-down menu.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-menu.png" alt-text="Screenshot of configuration drop-down menu.":::

1. Enter and select the following information for the connectivity configuration:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **HubA** for the name of the configuration |
    | Description | Provide a description about what this connectivity configuration will do. |
    | Topology | Select **Hub and spoke**. |

1. When you select the *Hub and spoke* topology, more fields will appear. Select the following settings:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/hub-configuration.png" alt-text="Screenshot of selecting a hub for the connectivity configuration.":::

    | Settings | Value |
    | -------- | ----- |
    | Hub | Select **VNet-A-West** as the hub virtual network. |
    | Existing peerings | Leave this option **unchecked**. |
    | Spoke network groups | Select **Add network groups** and add **myNetworkGroupB** to the configuration. |

1. After you've added the network group, select the following options. Then select add to create the connectivity configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-options.png" alt-text="Screenshot of settings for network group configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | Transitivity | Select the checkbox for **Enable peering within network group**. This setting will allow spoke virtual networks in the network group in the same region to communicate with each other directly. |
    | Global Mesh | Leave this option **unchecked**. Since both spokes are in the same region this setting is not required. |
    | Gateway | Select **Use hub as a gateway**. |

## Deploy the connectivity configuration

Make sure the virtual network gateway has been successfully deployed before deploying the connectivity configuration. If you deploy a hub and spoke configuration with **Use the hub as a gateway** enabled and there's no gateway, the deployment will fail. For more information, see [use hub as a gateway](concept-connectivity-configuration.md#use-hub-as-a-gateway).

1. Select **Deployments** under *Settings*, then select **Deploy a configuration**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of deployments page in Network Manager.":::

1. Select the configuration type of **Connectivity** and the **HubA** configuration you created in the last section. Then select **West US** and **East US** as the target region and select **Deploy**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deploy-configuration.png" alt-text="Screenshot of deploy a configuration page.":::

1. Select **OK** to confirm you want to overwrite any existing configuration and deploy the security admin configuration. 

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-confirmation.png" alt-text="Screenshot of deployment confirmation message.":::

1. You should now see the deployment show up in the list for those regions. The deployment of the configuration can take about 15-20 minutes to complete.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deployment-in-progress.png" alt-text="Screenshot of deployment in progress in deployment list.":::

## Create security configuration

1. Select **Configuration** under *Settings* again, then select **+ Add a configuration**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-security-configuration.png" alt-text="Screenshot of adding another configuration for Network Manager.":::

1. Select **SecurityAdmin** from the menu to begin creating a SecurityAdmin configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/security-drop-down.png" alt-text="Screenshot of SecurityAdmin in drop-down menu.":::

1. Enter the name **mySecurityConfig** for the configuration, then select **+ Add a rule collection**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/security-admin-configuration.png" alt-text="Screenshot of Security Admin configuration page.":::

1. Enter the name **myRuleCollection** for the rule collection and select **myNetworkGroupB** for the target network group. Then select **+ Add a rule**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-rule-collection.png" alt-text="Screenshot of add a rule collection page.":::

1. Enter and select the following settings, then select **Add**:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-rule.png" alt-text="Screenshot of add a rule page.":::

1. Select **Save** to add the rule collection to the configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/save-rule-collection.png" alt-text="Screenshot of save button for a rule collection.":::

1. Select **Add** to create the security admin configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-configuration.png" alt-text="Screenshot of add button to create configuration.":::

## Deploy the security admin configuration

1. Select **Deployments** under *Settings*, then select **Deploy a configuration**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deployments.png" alt-text="Screenshot of security deployments page in Virtual Network Manager.":::

1. Select the configuration type of **SecurityAdmin** and the **mySecurityConfig** configuration you created in the last section. Then select **West US** and **East US** as the target region and select **Deploy**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deploy-security.png" alt-text="Screenshot of deploying a security configuration.":::

1. Select **OK** to confirm you want to overwrite any existing configuration and deploy the security admin configuration.

    :::image type="content" source="./media/how-to-block-network-traffic-portal/confirm-security.png" alt-text="Screenshot of confirmation message for deploying a security configuration.":::

1. You should now see the deployment show up in the list for the selected region. The deployment of the configuration can take about 15-20 minutes to complete.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/security-in-progress.png" alt-text="Screenshot of security deployment in progress in deployment list.":::

## Verify deployment of configurations

### Verify from a virtual network

1. Go to **VNet-A-WestUS** virtual network and select **Network Manager** under *Settings*. You'll see the **HubA** connectivity configuration applied.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vnet-connectivity-configuration.png" alt-text="Screenshot of connectivity configuration applied to the virtual network.":::

1. Select **Peerings** under *Settings*. You'll see virtual network peerings created by Virtual Network Manager with *AVNM* in the name.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vnet-peerings.png" alt-text="Screenshot of virtual network peerings created by Virtual Network Manager.":::

1. Select the **SecurityAdmin** tab to see the security admin rules applied to this virtual network.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vnet-admin-configuration.png" alt-text="Screenshot of security admin rules applied to the virtual network.":::

### Verify from a VM

1. Deploy a test Windows VM into **VNet-A-EastUS**. 

1. Go to the test VM created in *VNet-A-EastUS* and select **Networking** under *Settings*. Select **Outbound port rules** and you'll see the security admin rule applied.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vm-security-rules.png" alt-text="Screenshot of test VM's network security rules.":::

1. Select the network interface name.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vm-network-settings.png" alt-text="Screenshot of test VM's network settings.":::

1. Then select **Effective routes** under *Support + troubleshooting* to see the routes for the virtual network peerings. The `10.3.0.0/16` route with the next hop of `VNetGlobalPeering` is the route to the hub virtual network. The `10.5.0.0/16` route with the next hop of `ConnectedGroup` is route to the other spoke virtual network. All spokes virtual network will be in a *ConnectedGroup* when **Transitivity** is enabled.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/effective-routes.png" alt-text="Screenshot of effective routes from test VM network interface." lightbox="./media/tutorial-create-secured-hub-and-spoke/effective-routes-expanded.png" :::

## Clean up resources

If you no longer need the Azure Virtual Network Manager, you'll need to make sure all of following is true before you can delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

Use the [remove components checklist](concept-remove-components-checklist.md) to make sure no child resources are still available before deleting the resource group.

## Next steps

Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
