---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using the Azure portal'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 04/20/2021
ms.custom: template-quickstart, ignite-fall-2021, mode-ui
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager using the Azure portal

Get started with Azure Virtual Network Manager by using the Azure portal to manage connectivity for all your virtual networks.

In this quickstart, you'll deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you'll verify if the connectivity configuration got applied.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Register subscription for public preview

1. Go to the [Preview features](https://portal.azure.com/#blade/Microsoft_Azure_Resources/PreviewFeaturesBlade) page.

1. Search for **AllowAzureNetworkManager**.

1. Select the checkbox next to *AllowAzureNetworkManager* and then select **+ Register**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/registration.png" alt-text="Screenshot of preview feature registration page.":::

## Create Virtual Network Manager

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Create** to begin setting up Azure Virtual Network Manager.

1. On the *Basics* tab, enter or select the following information:

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

## Create three virtual networks

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Virtual network**. Then select **Create** to begin configuring the virtual network.

1. On the *Basics* tab, enter or select the following information.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-mesh-vnet-basic.png" alt-text="Screenshot of create a virtual network basics page.":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Resource group | Select or create a new resource group to store the virtual network. This quickstart will use new resource group named **myAVNMResourceGroup**.
    | Name | Enter a **VNetA** for the virtual network name. |
    | Region | Select **West US**. |

1. Select **Next: IP Addresses >** and configure the following network address spaces:

     :::image type="content" source="./media/create-virtual-network-manager-portal/create-mesh-vnet-ip.png" alt-text="Screenshot of create a virtual network ip addresses page.":::

    | Setting | Value |
    | -------- | ----- |
    | IPv4 address space | 10.0.0.0/16 |
    | Subnet name | default |
    | Subnet address space | 10.0.0.0/24 |

1. Select **Review + create** and then select **Create** once validation has passed to deploy the virtual network.

1. Repeat steps 2-5 to create two more virtual networks with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the same subscription you selected in step 3. |
    | Resource group | Select the **myAVNMResourceGroup**. |
    | Name | Enter **VNetB** for the second virtual network and **VNetC** for the third virtual network. |
    | Region | Region will be selected for you when you select the resource group. |
    | VNetB IP addresses | IPv4 address space: 10.1.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.1.0.0/24|
    | VNetC IP addresses | IPv4 address space: 10.2.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.2.0.0/24|

## Create a network group

1. Go to Azure Virtual Network Manager instance you created.

1. Select **Network Groups** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of add a network group button.":::

1. On the *Create a network group* page, enter a **Name** for the network group. This example will use the name **myNetworkGroup**. Select **Add** to create the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-basics.png" alt-text="Screenshot of create a network group page.":::

1. You'll see the new network group added to the *Network Groups* page.
    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of network group page with list of network groups.":::

1. From the list of network groups, select **myNetworkGroup** and select **Add** under **Static membership** on the *myNetworkGroup* page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-static-member.png" alt-text="Screenshot of add a virtual network f.":::

1. On the *Add static members* page, select all three virtual networks created previously (VNetA, VNetB, and VNetC). Then select **Add** to add the 3 virtual networks to the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-virtual-networks.png" alt-text="Screenshot of add virtual networks to network group page.":::

1. Return to the *Network groups* page, and you'll see 3 members added under **Member virtual network**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/list-network-members.png" alt-text="Screenshot of network manager instance page with three member virtual networks.":::

## Create  a connectivity configuration

1. Select **Configurations** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-configuration.png" alt-text="Screenshot of configuration creation screen for Network Manager.":::

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-menu.png" alt-text="Screenshot of configuration drop-down menu.":::

1. On the *Basics* page, enter the following information, and select **Next: Topology >**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name for this connectivity configuration. |
    | Description | *(Optional)* Provide a description about this connectivity configuration. |


1. On the *Topology* tab, select the *Mesh* topology if not selected, and leave the **Enable mesh connectivity across regions** unchecked.  Cross-region connectivity isn't required for this set up since all the virtual networks are in the same region. 
     :::image type="content" source="./media/create-virtual-network-manager-portal/topology-configuration.png" alt-text="Screenshot of topology selection for network group connectivity configuration.":::

1. Select **+ Add** and then select the network group you created in the last section. Select **Select** to add the network group to the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-configuration.png" alt-text="Screenshot of add a network group to a connectivity configuration.":::

1. Select **Next: Review + Create >** and **Create** to create the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-connectivity-configuration.png" alt-text="Screenshot of create a connectivity configuration.":::

1. Once the deployment completes, select **Refresh** and you'll see the new connectivity configuration added to the *Configurations* page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration-list.png" alt-text="Screenshot of connectivity configuration list.":::

## Deploy the connectivity configuration

To have your configurations applied to your environment, you'll need to commit the configuration by deployment. You'll need to deploy the configuration to the **West US** region where the virtual networks are deployed.

1. Select **Deployments** under *Settings*, then select **Deploy configurations**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of deployments page in Network Manager.":::

1. Select the following settings:

    :::image type="content" source="./media/create-virtual-network-manager-portal/deploy-configuration.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select the type of configuration you want to deploy. This example will select **Include connectivity configurations in your goal state** . |
    | Connectivity configurations | Select the **ConnectivityConfigA** configuration created from the previous section. |
    | Regions | Select the region to deploy this configuration to. For this example, choose the **West US** region since all the virtual networks were created in that region. |

1. Select **Next** and then select **Deploy** to complete the deployment.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-confirmation.png" alt-text="Screenshot of deployment confirmation message.":::

1. You should now see the deployment show up in the list for the selected region. The deployment of the configuration can take several minutes to complete.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-in-progress.png" alt-text="Screenshot of configuration deployment in progress status.":::

## Confirm configuration deployment

1. Select **Refresh** on the *Deployments* page to see the updated status of the configuration that you committed.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-status.png" alt-text="Screenshot of refresh button for updated deployment status.":::

1. Go to **VNetA** virtual network and select **Network Manager** under *Settings*. You'll see the configuration you deployed with Azure Virtual Network Manager associated to the virtual network.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of connectivity configuration associated with VNetA virtual network.":::

1. You can also confirm the same for **VNetB** and **VNetC**.

## Clean up resources

If you no longer need Azure Virtual Network Manager, you'll need to make sure all of following is true before you can delete the resource:

* There are no configurations deployed to any region.
* All configurations have been deleted.
* All network groups have been deleted.

1. To remove all configurations from a region, start in the virtual network manager and select **Deploy configurations**. Select the following settings:

    :::image type="content" source="./media/create-virtual-network-manager-portal/none-configuration.png" alt-text="Screenshot of deploy a none connectivity configuration settings.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state**. |
    | Connectivity configurations | Select the ****None - Remove existing connectivity configurations**** configuration. |
    | Regions | Select **West US** as the deployed region. |

1. Select **Next** and select **Deploy** to complete the deployment removal.

1. To delete a configuration, select **Configurations** under *Settings* from the left pane of Azure Virtual Network Manager. Select the checkbox next to the configuration you want to remove and then select **Delete** at the top of the resource page. Select **Yes** to confirm the configuration deletion.

    :::image type="content" source="./media/create-virtual-network-manager-portal/delete-configuration.png" alt-text="Screenshot of delete button for a connectivity configuration.":::

1. To delete a network group, select **Network Groups** under *Settings* from the left pane of Azure Virtual Network Manager. Select the checkbox next to the network group you want to remove and then select **Delete** at the top of the resource page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/delete-network-group.png" alt-text="Screenshot of delete a network group button.":::


1. On the **Delete a network group** page, select the following options:

    :::image type="content" source="./media/create-virtual-network-manager-portal/ng-delete-options.png" alt-text="Screenshot of Network group to be deleted option selection.":::

    | Setting | Value |
    | ------- | ----- |
    | Delete option | Select **Force delete the resource and all dependent resources**. |
    | Confirm deletion | Enter the name of the network group. In this example, it's **myNetworkGroup**. |

1. Select **Delete** and Select **Yes** to confirm the network group deletion.

1. Once all network groups have been removed, select **Overview** from the left pane of Azure Virtual Network Manager and select **Delete**.

1. On the **Delete a network manager** page, select the following options and select **Delete**. Select **Yes** to confirm the deletion.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-delete.png" alt-text="Screenshot of network manager to be deleted option selection.":::

    | Setting | Value |
    | ------- | ----- |
    | Delete option | Select **Force delete the resource and all dependent resources**. |
    | Confirm deletion | Enter the name of the network manager. In this example, it's **myAVNM**. |

1. To delete the resource group, locate the resource group and select the **Delete resource group**. Confirm that you want to delete by entering the name of the resource group, then select **Delete**

## Next steps

After you've created the Azure Virtual Network Manager, continue on to learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with security admin rules](how-to-block-network-traffic-portal.md)
