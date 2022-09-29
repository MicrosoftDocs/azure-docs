---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using the Azure portal'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 09/22/2022
ms.custom: template-quickstart, ignite-fall-2022, mode-ui
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

## Create Virtual Network Manager
Deploy a network manager instance with the defined scope and access you need.

1. Sign in to the [Azure portal](https://portal.azure.com/).

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
    | [Features](concept-network-manager-scope.md#features) | Select the features you want to enable for Azure Virtual Network Manager. Available features are *Connectivity* and *SecurityAdmin*. </br> Connectivity - Enables the ability to create a full mesh or hub and spoke network topology between virtual networks within the scope. </br> SecurityAdmin - Enables the ability to create global network security rules. |

1. Select **Review + create** and then select **Create** once validation has passed.

## Create virtual networks
Create five virtual networks using the portal. This example creates virtual networks named VNetA, VNetB, VNetC and VNetD in the West US location. Each virtual network will have a tag of networkType used for dynamic membership. If you have existing virtual networks for your mesh configuration, you'll need to add tags listed below to your virtual networks and skip to the next section.

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual network**. Then select **Create** to begin configuring the virtual network.

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

1. Select the **Tags** tab and enter the following values:

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-tag.png" alt-text="Screenshot of create a virtual network tag page.":::

    | Setting | Value |
    |---- | ---- |
    | Name | Enter **NetworkType** |
    | Value | Enter **Prod**. |

1. Select **Review + create** and then select **Create** once validation has passed to deploy the virtual network.

1. Repeat steps 2-5 to create more virtual networks with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the same subscription you selected in step 3. |
    | Resource group | Select the **myAVNMResourceGroup**. |
    | Name | Enter **VNetB**, **VNetC**, and **VNetD** for each of the three extra virtual networks. |
    | Region | Region will be selected for you when you select the resource group. |
    | VNetB IP addresses | IPv4 address space: 10.1.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.1.0.0/24|
    | VNetC IP addresses | IPv4 address space: 10.2.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.2.0.0/24|
    | VNetD IP addresses | IPv4 address space: 10.3.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.3.0.0/24|
    | VNetB NetworkType tag | Enter **Prod**. |
    | VNetC NetworkType tag | Enter **Prod**. |
    | VNetD NetworkType tag | Enter **Test**. |

## Create a network group
Virtual Network Manager applies configurations to groups of VNets by placing them in network groups. Create a network group as follows:

1. Go to Azure Virtual Network Manager instance you created.

1. Select **Network Groups** under *Settings*, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of add a network group button.":::

1. On the *Create a network group* page, enter a **Name** for the network group. This example will use the name **myNetworkGroup**. Select **Add** to create the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-basics.png" alt-text="Screenshot of create a network group page.":::

1. You'll see the new network group added to the *Network Groups* page.
    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of network group page with list of network groups.":::

1. Once your network group is created, you'll add virtual networks as members. Choose one of the options: *[Manually add membership](#manually-add-membership)* or *[Create policy to dynamically add members](#create-azure-policy-for-dynamic-membership)* with Azure Policy.

## Define membership for a mesh configuration
Azure Virtual Network manager allows you two methods for adding membership to a network group. You can manually add virtual networks or use Azure Policy to dynamically add virtual networks based on conditions. Choose the option below for your mesh membership configuration:
### Manually add membership
In this task, you'll manually add three virtual networks for your Mesh configuration to your network group using the steps below:

1. From the list of network groups, select **myNetworkGroup** and select **Add virtual networks** under *Manually add members* on the *myNetworkGroup* page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-static-member.png" alt-text="Screenshot of add a virtual network f.":::

1. On the *Manually add members* page, select three virtual networks created previously (VNetA, VNetB, and VNetC). Then select **Add** to add the 3 virtual networks to the network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-virtual-networks.png" alt-text="Screenshot of add virtual networks to network group page.":::

1. On the **Network Group** page under *Settings*, select **Group Members** to view the membership of the group you manually selected.
    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list-thumb.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

### Create Azure Policy for dynamic membership
Using [Azure Policy](concept-azure-policy-integration.md), you'll define a condition to dynamically add three virtual networks tagged as **Prod** to your network group using the steps below.

1. From the list of network groups, select **myNetworkGroup** and select **Create Azure Policy** under *Create policy to dynamically add members*.

    :::image type="content" source="media/create-virtual-network-manager-portal/define-dynamic-membership.png" alt-text="Screenshot of Create Azure Policy button.":::

1. On the **Create Azure Policy** page, select or enter the following information:

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-conditional.png" alt-text="Screenshot of create a network group conditional statements tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Policy name | Enter **ProdVNets** in the text box. |
    | Scope | Select **Select Scopes** and choose your current subscription. |
    | Criteria |  |
    | Parameter | Select **Tags** from the drop-down.|
    | Operator | Select **Exists** from the drop-down.| 
    | Condition | Enter **Prod** to dynamically add the three previously created virtual networks into this network group. |

1. Select **Save** to deploy the group membership. It can take up to one minute for the policy to take effect and be added to your network group.

1. On the *Network Group* page under **Settings**, select **Group Members** to view the membership of the group based on the conditions defined in Azure Policy.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list-thumb.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::
## Create  a configuration
Now that the Network Group is created, and has the correct VNets, create a mesh network topology configuration. Replace <subscription_id> with your subscription and follow the steps below:

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

1. Once the deployment completes, select **Refresh**, and you'll see the new connectivity configuration added to the *Configurations* page.

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

## Verify configuration deployment
Use the **Network Manager** section for each virtual machine to verify whether configuration was deployed in the steps below:

1. Select **Refresh** on the *Deployments* page to see the updated status of the configuration that you committed.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-status.png" alt-text="Screenshot of refresh button for updated deployment status.":::

1. Go to **VNetA** virtual network and select **Network Manager** under *Settings*. You'll see the configuration you deployed with Azure Virtual Network Manager associated to the virtual network.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of connectivity configuration associated with VNetA virtual network.":::

1. You can also confirm the same for **VNetB**,**VNetC**, and **VNetD**.

## Clean up resources

If you no longer need Azure Virtual Network Manager, you'll need to make sure all of following is true before you can delete the resource:

* There are no configurations deployed to any region.
* All configurations have been deleted.
* All network groups have been deleted.

1. To remove all configurations from a region, start in the virtual network manager and select **Deploy configurations**. Select the following settings:

    :::image type="content" source="./media/create-virtual-network-manager-portal/none-configuration.png" alt-text="Screenshot of deploying a none connectivity configuration.":::

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

1. To delete the resource group and virtual networks, locate the resource group and select the **Delete resource group**. Confirm that you want to delete by entering the name of the resource group, then select **Delete**

## Next steps

After you've created the Azure Virtual Network Manager, continue on to learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]

[Block network traffic with security admin rules](how-to-block-network-traffic-portal.md)
[Create a secured hub and spoke network](tutorial-create-secured-hub-and-spoke.md)
