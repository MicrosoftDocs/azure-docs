---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using the Azure portal'
description: Use this quickstart to learn how to create a mesh network topology with Virtual Network Manager using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 04/12/2023
ms.custom: template-quickstart, mode-ui, engagement-fy23
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager using the Azure portal

Get started with Azure Virtual Network Manager by using the Azure portal to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify if the connectivity configuration got applied.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create Virtual Network Manager
Deploy a network manager instance with the defined scope and access you need.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Network Manager**. 1. Select **Network Manager > Create** to begin setting up Azure Virtual Network Manager.

1. On the **Basics** tab, enter or select the following information:

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-basics-thumbnail.png" alt-text="Screenshot of Create a network manager Basics page." lightbox="./media/create-virtual-network-manager-portal/network-manager-basics-thumbnail.png":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy Azure Virtual Network Manager to. |
    | Resource group | Select **Create new** and enter **rg-learn-eastus-001**.
    | Name | Enter **vnm-learn-eastus-001**. |
    | Region | Enter **eastus** or a region of your choosing. Azure Virtual Network Manager can manage virtual networks in any region. The region selected is for where the Virtual Network Manager instance will be deployed. |
    | Description | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it's managing. |
    | Scope and features | |
    | [Scope](concept-network-manager-scope.md#scope) | Select **Select scopes** and choose your subscription.</br> Select **Add to selected scope > Select**. </br> *Scope* is used to define the resources which Azure Virtual Network Manager can manage. You can choose subscriptions and management groups.
    | [Features](concept-network-manager-scope.md#features) | Select **Connectivity** and **Security Admin** from the dropdown list.  </br> *Connectivity* - Enables the ability to create a full mesh or hub and spoke network topology between virtual networks within the scope. </br> *Security Admin* - Enables the ability to create global network security rules. |

1. Select **Review + create** and then select **Create** once validation has passed.

## Create virtual networks

Create three virtual networks using the portal. Each virtual network has a tag of networkType used for dynamic membership. If you have existing virtual networks for your mesh configuration, you'll need to add tags listed in the table to your virtual networks and skip to the next section.

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual networks**. Then select **Create** to begin configuring the virtual network.

1. On the **Basics** tab, enter or select the following information.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-basic.png" alt-text="Screenshot of create a virtual network basics page.":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Resource group | Select **rg-learn-eastus-001**.
    | Name | Enter a **vnet-learn-prod-eastus-001** for the virtual network name. |
    | Region | Select **(US) East US**. |

1. Select **Next** or the **IP addresses** tab and configure the following network address spaces:

     :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-ip.png" alt-text="Screenshot of create a virtual network IP addresses page.":::

    | Setting | Value |
    | -------- | ----- |
    | IPv4 address space | 10.0.0.0/16 |
    | Subnet name | default |
    | Subnet address space | 10.0.0.0/24 |

1. Select **Review + create** and then select **Create** once validation has passed to deploy the virtual network.

1. Repeat steps 2-5 to create more virtual networks with the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the same subscription you selected in step 3. |
    | Resource group | Select the **rg-learn-eastus-001**. |
    | Name | Enter **vnet-learn-prod-eastus-002** and **vnet-learn-test-eastus-003** for each additional virtual network. |
    | Region | Select **(US) East US** |
    | vnet-learn-prod-eastus-002 IP addresses | IPv4 address space: 10.1.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.1.0.0/24|
    | vnet-learn-test-eastus-003 IP addresses | IPv4 address space: 10.2.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.2.0.0/24|

## Create a network group

Virtual Network Manager applies configurations to groups of VNets by placing them in network groups. Create a network group as follows:

1. Browse to **rg-learn-eastus-001** resource group, and select the **vnm-learn-eastus-001** virtual network manager instance.

1. Select **Network Groups** under **Settings**, then select **+ Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of add a network group.":::

1. On the **Create a network group** page, enter **ng-learn-prod-eastus-001** and Select **Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-network-group.png" alt-text="Screenshot of create a network group page."  lightbox="./media/create-virtual-network-manager-portal/create-network-group.png":::

1. The new network group is now listed on the **Network Groups** page.
    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of network group page with list of network groups.":::

## Define membership for connectivity configuration

Once your network group is created, you add virtual networks as members. Choose one of the options: *[Manually add membership](#manually-add-membership)* or *[Create policy to dynamically add members](#create-azure-policy-for-dynamic-membership)* with Azure Policy. Choose one of the options for your mesh membership configuration:
# [Manual membership](#tab/manualmembership)

### Manually add membership

In this task, you manually add two virtual networks for your Mesh configuration to your network group using these steps:

1. From the list of network groups, select **ng-learn-prod-eastus-001** and select **Add virtual networks** under *Manually add members* on the *ng-learn-prod-eastus-001* page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-static-member.png" alt-text="Screenshot of add a virtual network f.":::

1. On the **Manually add members** page, select **vnet-learn-prod-eastus-001** and **vnet-learn-prod-eastus-002**, and select **Add**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-virtual-networks.png" alt-text="Screenshot of add virtual networks to network group page.":::

1. On the **Network Group** page under **Settings**, select **Group Members** to view the membership of the group you manually selected.
    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

# [Azure Policy](#tab/azurepolicy)
### Create Azure Policy for dynamic membership

Using [Azure Policy](concept-azure-policy-integration.md), you define a condition to dynamically add two virtual networks to your network group when the name of the virtual network includes **prod** using these steps:

1. From the list of network groups, select **ng-learn-prod-eastus-001** and select **Create Azure policy** under *Create policy to dynamically add members*.

    :::image type="content" source="media/create-virtual-network-manager-portal/define-dynamic-membership.png" alt-text="Screenshot of Create Azure Policy button.":::

1. On the **Create Azure policy** page, select or enter the following information:

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-conditional.png" alt-text="Screenshot of create a network group conditional statements tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Policy name | Enter **azpol-learn-prod-eastus-001** in the text box. |
    | Scope | Select **Select Scopes** and choose your current subscription. |
    | Criteria |  |
    | Parameter | Select **Name** from the drop-down.|
    | Operator | Select **Contains** from the drop-down.| 
    | Condition | Enter **-prod** for the condition in the text box. |

1. Select **Preview resources** to view the **Effective virtual networks** page and select **Close**. This page shows the virtual networks that will be added to the network group based on the conditions defined in Azure Policy.

    :::image type="content" source="media/create-virtual-network-manager-portal/effective-virtual-networks.png" alt-text="Screenshot of effective virtual networks page.":::

1. Select **Save** to deploy the group membership. It can take up to one minute for the policy to take effect and be added to your network group.

1. On the **Network Group** page under **Settings**, select **Group Members** to view the membership of the group based on the conditions defined in Azure Policy. You'll note the **Source** is listed as **azpol-learn-prod-eastus-001 - subscriptions/subscription_id**.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list.png" alt-text="Screenshot of group membership under Group Membership." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

---

## Create a configuration

Now that the Network Group is created, and has the correct VNets, create a mesh network topology configuration. Replace **<subscription_id>** with your subscription and follow these steps:

1. Select **Configurations** under **Settings**, then select **+ Create**.

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration-dropdown.png" alt-text="Screenshot of configuration drop-down menu.":::

1. On the **Basics** page, enter the following information, and select **Next: Topology >**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **cc-learn-prod-eastus-001**. |
    | Description | *(Optional)* Provide a description about this connectivity configuration. |

1. On the **Topology** tab, select the **Mesh** topology if not selected, and leave the **Enable mesh connectivity across regions** unchecked.  Cross-region connectivity isn't required for this set up since all the virtual networks are in the same region. 

     :::image type="content" source="./media/create-virtual-network-manager-portal/topology-configuration.png" alt-text="Screenshot of topology selection for network group connectivity configuration.":::

1. Select **+ Add > Add network group** and select **ng-learn-prod-eastus-001** under **Network Groups**. Choose **Select** to add the network group to the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-configuration.png" alt-text="Screenshot of add a network group to a connectivity configuration.":::

1. Select the **Visualization** tab to view the topology of the configuration. This tab shows you a visual representation of the network group you added to the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/preview-topology.png" alt-text="Screenshot of preview topology for network group connectivity configuration.":::

1. Select **Next: Review + Create >** and **Create** to create the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-connectivity-configuration.png" alt-text="Screenshot of create a connectivity configuration.":::

1. Once the deployment completes, select **Refresh**, and you see the new connectivity configuration added to the **Configurations** page.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration-list.png" alt-text="Screenshot of connectivity configuration list.":::

## Deploy the connectivity configuration

To have your configurations applied to your environment, you need to commit the configuration by deployment. You need to deploy the configuration to the **East US** region where the virtual networks are deployed.

1. Select **Deployments** under **Settings**, then select **Deploy configurations**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of deployments page in Network Manager.":::

1. Select the following settings:

    :::image type="content" source="./media/create-virtual-network-manager-portal/deploy-configuration.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state** . |
    | Connectivity configurations | Select **cc-learn-prod-eastus-001**.  |
    | Target regions | Select **East US** as the deployment region. |

1. Select **Next** and then select **Deploy** to complete the deployment.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-confirmation.png" alt-text="Screenshot of deployment confirmation message.":::

1. The deployment will display in the list for the selected region. The deployment of the configuration can take a few minutes to complete.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-in-progress.png" alt-text="Screenshot of configuration deployment in progress status.":::

## Verify configuration deployment

Use the **Network Manager** section for each virtual network to verify whether configuration was deployed in these steps:

1. Go to **vnet-learn-prod-eastus-001** virtual network and select **Network Manager** under **Settings**. Verify that **cc-learn-prod-eastus-001** is listed under **Connectivity Configurations** tab.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of connectivity configuration associated with vnet-learn-prod-eastus-001 virtual network." lightbox="./media/create-virtual-network-manager-portal/vnet-configuration-association.png":::

1. Repeat the previous step on **vnet-learn-prod-eastus-002**. 

## Clean up resources

If you no longer need Azure Virtual Network Manager, the following steps will remove all configurations, network groups, and Virtual Network Manager.

> [!NOTE]
> Before you can remove Azure Virtual Network Manager, you must remove all deployments, configurations, and network groups.

1. To remove all configurations from a region, start in the virtual network manager and select **Deploy configurations**. Select the following settings:

    :::image type="content" source="./media/create-virtual-network-manager-portal/none-configuration.png" alt-text="Screenshot of deploying a none connectivity configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state**. |
    | Connectivity configurations | Select the ****None - Remove existing connectivity configurations**** configuration. |
    | Target regions | Select **East US** as the deployed region. |

1. Select **Next** and select **Deploy** to complete the deployment removal.

1. To delete a configuration, select **Configurations** under **Settings** from the left pane of Azure Virtual Network Manager. Select the checkbox next to the configuration you want to remove and then select **Delete** at the top of the resource page. 

1. On the **Delete a configuration** page, select the following options:

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-delete-options.png" alt-text="Screenshot of configuration to be deleted option selection.":::

    | Setting | Value |
    | ------- | ----- |
    | Delete option | Select **Force delete the resource and all dependent resources**. |
    | Confirm deletion | Enter the name of the configuration. In this example, it's **cc-learn-prod-eastus-001**. |

1. To delete a network group, select **Network Groups** under **Settings** from the left pane of Azure Virtual Network Manager. Select the checkbox next to the network group you want to remove and then select **Delete** at the top of the resource page.

1. On the **Delete a network group** page, select the following options:

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-delete-options.png" alt-text="Screenshot of Network group to be deleted option selection." lightbox="./media/create-virtual-network-manager-portal/network-group-delete-options.png":::

    | Setting | Value |
    | ------- | ----- |
    | Delete option | Select **Force delete the resource and all dependent resources**. |
    | Confirm deletion | Enter the name of the network group. In this example, it's **ng-learn-prod-eastus-001**. |

1. Select **Delete** and Select **Yes** to confirm the network group deletion.

1. Once all network groups have been removed, select **Overview** from the left pane of Azure Virtual Network Manager and select **Delete**.

1. On the **Delete a network manager** page, select the following options and select **Delete**. Select **Yes** to confirm the deletion.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-delete.png" alt-text="Screenshot of network manager to be deleted option selection.":::

    | Setting | Value |
    | ------- | ----- |
    | Delete option | Select **Force delete the resource and all dependent resources**. |
    | Confirm deletion | Enter the name of the network manager. In this example, it's **vnm-learn-eastus-001**. |

1. To delete the resource group and virtual networks, locate **rg-learn-eastus-001** and select the **Delete resource group**. Confirm that you want to delete by entering **rg-learn-eastus-001** in the textbox, then select **Delete**

## Next steps

After you've created the Azure Virtual Network Manager, continue on to learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]

[Block network traffic with security admin rules](how-to-block-network-traffic-portal.md)
[Create a secured hub and spoke network](tutorial-create-secured-hub-and-spoke.md)
