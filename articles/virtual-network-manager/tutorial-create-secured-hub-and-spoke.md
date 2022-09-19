---
title: 'Tutorial: Create a secured hub and spoke network'
description: In this tutorial, you'll learn how to create a hub and spoke network with Azure Virtual Network Manager. Then you'll secure all your virtual networks with a security policy.
author: mbender-ms
ms.author: mbender
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

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Before you can complete steps in this tutorial, you must first [create an Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.

## Create virtual networks

This procedure walks you through creating three virtual networks. One will be in the *West US* region and the other two will be in the *East US* region.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Virtual network**. Then select **Create** to begin configuring the virtual network.

1. On the *Basics* tab, enter or select the following information:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-hub-vnet-basic.png" alt-text="Screenshot of basics tab for hub and spoke virtual network.":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Resource group | Select or create a new resource group to store the virtual network. This quickstart will use a resource group named **myAVNMResourceGroup**. |
    | Name | Enter **VNet-A-WestUS** for the virtual network name. |
    | Region | Select the **West US** region. |

 1. Select **Next: IP Addresses** and configure the following network address space:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/create-hub-vnet-addresses.png" alt-text="Screenshot of IP addresses tab for hub and spoke virtual network.":::

    | Setting | Value |
    | -------- | ----- |
    | IPv4 address space | Enter **10.3.0.0/16** as the address space. |
    | Subnet name | Enter the name **default** for the subnet. |
    | Subnet address space | Enter the subnet address space of **10.3.0.0/24**. |

1. Select **Review + create** and then select **Create** to deploy the virtual network.


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


1. On the *Basics* tab, enter or select the following settings:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/gateway-basics.png" alt-text="Screenshot of create the virtual network gateway basics tab." lightbox="./media/tutorial-create-secured-hub-and-spoke/gateway-basics-expanded.png":::

    | Setting | Value |
    | -------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Name | Enter **VNet-A-WestUS-GW** for the virtual network gateway name. |
    | SKU | Select **VpnGW1** for the SKU. |
    | Generation | Select **Generation1** for the generation. |
    | Virtual network | Select the **VNet-A-WestUS** for the VNet. |
    | Public IP address name | Enter the name **VNet-A-WestUS-GW-IP** for the public IP. |

    
1. Select **Review + create** and then select **Create** after validation has passed. The deployment of a virtual network gateway can take about 30 minutes. You can move on to the next section while waiting for this deployment to complete.

## Create a dynamic network group

1. Go to your Azure Virtual Network Manager instance. This tutorial assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide.

1. Select **Network groups** under *Settings*, and then select **+ Add** to create a new network group.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-network-group.png" alt-text="Screenshot of add a network group button.":::

1. On the *Basics* tab, enter the following information:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-basics.png" alt-text="Screenshot of the create a network group basics tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myNetworkGroupB** for the network group name. |
    | Description | Provide a description about this network group. |

1. Select **Add** to create the virtual network group.

1. From the **Network groups** page, select the created network group from above to configure the network group.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-page.png" alt-text="Screenshot of the network groups page.":::

1. On the **Overview** page, select **Create Azure Policy** under *Create policy to dynamically add members*.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/define-dynamic-membership.png" alt-text="Screenshot of the define dynamic membership button.":::

1. On the **Create Azure Policy** page, select or enter the following information:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-conditional.png" alt-text="Screenshot of create a network group conditional statements tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Policy name | Enter **VNetAZPolicy** in the text box. |
    | Scope | Select **Select Scopes** and choose your current subscription. |
    | Criteria |  |
    | Parameter | Select **Name** from the drop-down.|
    | Operator | Select **Contains** from the drop-down.| 
    | Condition | Enter **VNet-** to dynamically add the three previously created virtual networks into this network group. |

1. Select **Save** to deploy the group membership.
1. Under **Settings**, select **Group Members** to view the membership of the group based on the conditions defined in Azure Policy.
:::image type="content" source="media/tutorial-create-secured-hub-and-spoke/group-members-dynamic-thumb.png" alt-text="Screenshot of dynamic group membership under Group Membership blade." lightbox="media/tutorial-create-secured-hub-and-spoke/group-members-dynamic.png":::
## Create a hub and spoke connectivity configuration

1. Select **Configuration** under *Settings*, then select **+ Add a configuration**. Select **Connectivity** from the drop-down menu.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-configuration.png"   alt-text="Screenshot of add a configuration button for Network Manager.":::

1. On the **Basics** tab, enter and select the following information for the connectivity configuration:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **HubA** for the name of the configuration |
    | Description | Provide a description about what this connectivity configuration will do. |


1. Select **Next: Topology >**. Select **Hub and Spoke** under the **Topology** setting. This will reveal additional settings.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/hub-configuration.png" alt-text="Screenshot of selecting a hub for the connectivity configuration.":::

1.  Select **Select a hub** under **Hub** setting. Then, select **VNet-A-WestUS** to serve as your network hub and click **Select**.

    :::image type="content" source="media/tutorial-create-secured-hub-and-spoke/select-hub.png" alt-text="Screenshot of Select a hub configuration.":::
    
1.  Under **Spoke network groups**, select **+ add**. Then, select **myNetworkGroupB** for the network group and click **Select**.

    :::image type="content" source="media/tutorial-create-secured-hub-and-spoke/select-network-group.png" alt-text="Screenshot of Add network groups page.":::

1. After you've added the network group, select the following options. Then select add to create the connectivity configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-options.png" alt-text="Screenshot of settings for network group configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | Direct Connectivity | Select the checkbox for **Enable connectivity within network group**. This setting will allow spoke virtual networks in the network group in the same region to communicate with each other directly. |
    | Hub as gateway | Select the checkbox for **Use hub as a gateway**. |    
    | Global Mesh | Leave this option **unchecked**. Since both spokes are in the same region this setting is not required. |

1. Select **Next: Review + create >** and then create the connectivity configuration.

## Deploy the connectivity configuration

Make sure the virtual network gateway has been successfully deployed before deploying the connectivity configuration. If you deploy a hub and spoke configuration with **Use the hub as a gateway** enabled and there's no gateway, the deployment will fail. For more information, see [use hub as a gateway](concept-connectivity-configuration.md#use-hub-as-a-gateway).

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of deployments page in Network Manager.":::

1. Select **Include connectivity configurations in your goal state** and **HubA** as the **Connectivity configurations** setting. Then select **West US** and **East US** as the target regions and select **Next**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deploy-configuration.png" alt-text="Screenshot of deploy a configuration page.":::


1. Select **Deploy**. You should now see the deployment show up in the list for those regions. The deployment of the configuration can take several minutes to complete.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deployment-in-progress.png" alt-text="Screenshot of deployment in progress in deployment list.":::

## Create security configuration

1. Select **Configuration** under *Settings* again, then select **+ Create**, and select **SecurityAdmin** from the menu to begin creating a SecurityAdmin configuration..

1. Enter the name **mySecurityConfig** for the configuration, then select **Next: Rule collections**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/security-admin-configuration.png" alt-text="Screenshot of Security Admin configuration page.":::

1. Enter the name **myRuleCollection** for the rule collection and select **myNetworkGroupB** for the target network group. Then select **+ Add**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-rule-collection.png" alt-text="Screenshot of add a rule collection page.":::

1. Enter and select the following settings, then select **Add**:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-rule.png" alt-text="Screenshot of add a rule page and rule settings.":::

    | Setting | Value |
    | ------- | ----- |
    | Name    | Enter **DENY_INTERNET** |
    | Description | Enter **This rule blocks traffic to the internet on HTTP and HTTPS** |
    | Priority | Enter **1** |
    | Action | Select **Deny** |
    | Direction | Select **Outbound** |
    | Protocol | Select **TCP** |
    | Destination port | Enter **80, 443** |

1. Select **Add** to add the rule collection to the configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/save-rule-collection.png" alt-text="Screenshot of save button for a rule collection.":::

1. Select **Review + create** and **Create** to create the security admin configuration.

## Deploy the security admin configuration

1. Select **Deployments** under *Settings*, then select **Deploy configurations**.

1. Under *Configurations*, Select **Include security admin in your goal state** and the **mySecurityConfig** configuration you created in the last section. Then select **West US** and **East US** as the target regions and select **Next**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deploy-security.png" alt-text="Screenshot of deploying a security configuration.":::

1. Select **Next** and then **Deploy**.You should now see the deployment show up in the list for the selected region. The deployment of the configuration can take about 15-20 minutes to complete.

## Verify deployment of configurations

### Verify from a virtual network

1. Go to **VNet-A-EastUS** virtual network and select **Network Manager** under *Settings*. You'll see the **HubA** connectivity configuration applied.

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

1. Then select **Effective routes** under *Help* to see the routes for the virtual network peerings. The `10.3.0.0/16` route with the next hop of `VNetGlobalPeering` is the route to the hub virtual network. The `10.5.0.0/16` route with the next hop of `ConnectedGroup` is route to the other spoke virtual network. All spokes virtual network will be in a *ConnectedGroup* when **Transitivity** is enabled.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/effective-routes.png" alt-text="Screenshot of effective routes from test VM network interface." lightbox="./media/tutorial-create-secured-hub-and-spoke/effective-routes-expanded.png" :::

## Clean up resources

If you no longer need the Azure Virtual Network Manager, you'll need to make sure all of following is true before you can delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

Use the [remove components checklist](concept-remove-components-checklist.md) to make sure no child resources are still available before deleting the resource group.

## Next steps

Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
