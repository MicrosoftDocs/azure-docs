---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager - Azure portal'
description: Learn to a mesh virtual network topology with Azure Virtual Network Manager by using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: quickstart
ms.date: 08/24/2023
ms.custom: template-quickstart, mode-ui, engagement-fy23
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager - Azure portal

Get started with Azure Virtual Network Manager by using the Azure portal to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify that the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Mesh connectivity configurations and security admin rules remain in public preview.
>
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- To modify dynamic network groups, you must be [granted access via Azure RBAC role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin/legacy authorization is not supported.

## Create a Virtual Network Manager instance

Deploy a Virtual Network Manager instance with the defined scope and access that you need:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Network Manager** > **Create** to begin setting up Virtual Network Manager.

1. On the **Basics** tab, enter or select the following information, and then select **Review + create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-basics-thumbnail.png" alt-text="Screenshot of basic information for creating a network manager." lightbox="./media/create-virtual-network-manager-portal/network-manager-basics-thumbnail.png":::

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy Virtual Network Manager. |
    | **Resource group** | Select **Create new** and enter **rg-learn-eastus-001**.
    | **Name** | Enter **vnm-learn-eastus-001**. |
    | **Region** | Enter **eastus** or a region of your choosing. Virtual Network Manager can manage virtual networks in any region. The selected region is where the Virtual Network Manager instance will be deployed. |
    | **Description** | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it's managing. |
    | [Scope](concept-network-manager-scope.md#scope) | Choose **Select scopes** and then select your subscription.</br> Select **Add to selected scope** > **Select**. </br> Scope information defines the resources that Virtual Network Manager can manage. You can choose subscriptions and management groups.
    | [Features](concept-network-manager-scope.md#features) | Select **Connectivity** and **Security Admin** from the dropdown list.  </br> **Connectivity** enables the creation of a full mesh or hub-and-spoke network topology between virtual networks within the scope. </br> **Security Admin** enables the creation of global network security rules. |

1. Select **Create** after your configuration passes validation.

## Create virtual networks

Create three virtual networks by using the portal. Each virtual network has a `networkType` tag that's used for dynamic membership. If you have existing virtual networks for your mesh configuration, add the tags listed in the table to your virtual networks and skip to the next section.

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual networks**. Then select **Create** to begin configuring a virtual network.

1. On the **Basics** tab, enter or select the following information.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-basic.png" alt-text="Screenshot of basic information for creating a virtual network.":::

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy this virtual network. |
    | **Resource group** | Select **rg-learn-eastus-001**.
    | **Virtual network name** | Enter **vnet-learn-prod-eastus-001**. |
    | **Region** | Select **(US) East US**. |

1. Select **Next** or the **IP addresses** tab, configure the following network address spaces, and then select **Review + create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-ip.png" alt-text="Screenshot of IP address information for creating a virtual network.":::

    | Setting | Value |
    | -------- | ----- |
    | **IPv4 address space** | 10.0.0.0/16 |
    | **Subnet name** | default |
    | **Subnet address space** | 10.0.0.0/24 |

1. After your configuration passes validation, select **Create** to deploy the virtual network.

1. Repeat the preceding steps to create more virtual networks with the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the same subscription that you selected in step 2. |
    | **Resource group** | Select **rg-learn-eastus-001**. |
    | **Name** | Enter **vnet-learn-prod-eastus-002** and **vnet-learn-test-eastus-003** for each additional virtual network. |
    | **Region** | Select **(US) East US**. |
    | **vnet-learn-prod-eastus-002 IP addresses** | IPv4 address space: **10.1.0.0/16** </br> Subnet name: **default** </br> Subnet address space: **10.1.0.0/24**|
    | **vnet-learn-test-eastus-003 IP addresses** | IPv4 address space: **10.2.0.0/16** </br> Subnet name: **default** </br> Subnet address space: **10.2.0.0/24**|

## Create a network group

Virtual Network Manager applies configurations to groups of virtual networks by placing them in network groups. To create a network group:

1. Browse to the **rg-learn-eastus-001** resource group, and select the **vnm-learn-eastus-001** Virtual Network Manager instance.

1. Under **Settings**, select **Network groups**. Then select **Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of an empty list of network groups and the button for creating a network group.":::

1. On the **Create a network group** pane, enter **ng-learn-prod-eastus-001** and select **Create**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-network-group.png" alt-text="Screenshot of the pane for creating a network group."  lightbox="./media/create-virtual-network-manager-portal/create-network-group.png":::

1. Confirm that the new network group is now listed on the **Network groups** pane.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-groups-list.png" alt-text="Screenshot of a newly created network group on the pane that list network groups.":::

## Define membership for a connectivity configuration

After you create your network group, you add virtual networks as members. Choose one of the following options for your mesh membership configuration.

# [Manual membership](#tab/manualmembership)

### Add a membership manually

In this task, you manually add two virtual networks for your mesh configuration to your network group:

1. From the list of network groups, select **ng-learn-prod-eastus-001**.  On the **ng-learn-prod-eastus-001** pane, under **Manually add members**, select **Add virtual networks**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-static-member.png" alt-text="Screenshot of add a virtual network f.":::

1. On the **Manually add members** pane, select **vnet-learn-prod-eastus-001** and **vnet-learn-prod-eastus-002**, and then select **Add**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-virtual-networks.png" alt-text="Screenshot of selecting virtual networks on the pane for manually adding members.":::

1. On the **Network Group** pane, under **Settings**, select **Group Members**. Confirm the membership of the group that you manually selected.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list.png" alt-text="Screenshot that shows a list of group members." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

# [Azure Policy](#tab/azurepolicy)

### Create a policy definition for dynamic membership

By using [Azure Policy](concept-azure-policy-integration.md), you define a condition to dynamically add two virtual networks to your network group when the name of the virtual network includes *prod*:

1. From the list of network groups, select **ng-learn-prod-eastus-001**.  Under **Create policy to dynamically add members**, select **Create Azure policy**.

    :::image type="content" source="media/create-virtual-network-manager-portal/define-dynamic-membership.png" alt-text="Screenshot of the button for creating an Azure policy.":::

1. On the **Create Azure policy** pane, select or enter the following information, and then select **Preview resources**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-conditional.png" alt-text="Screenshot of the pane for creating an Azure policy, including criteria for definitions.":::

    | Setting | Value |
    | ------- | ----- |
    | **Policy name** | Enter **azpol-learn-prod-eastus-001**. |
    | **Scope** | Choose **Select scopes** and then select your current subscription. |
    | **Parameter** | Select **Name** from the dropdown list.|
    | **Operator** | Select **Contains** from the dropdown list.|
    | **Condition** | Enter **-prod**. |

1. The **Effective virtual networks** pane shows the virtual networks that will be added to the network group based on the conditions that you defined in Azure Policy. When you're ready, select **Close**.

    :::image type="content" source="media/create-virtual-network-manager-portal/effective-virtual-networks.png" alt-text="Screenshot of the pane for effective virtual networks.":::

1. Select **Save** to deploy the group membership. It can take up to one minute for the policy to take effect and be added to your network group.

1. On the **Network Group** pane, under **Settings**, select **Group members** to view the membership of the group based on the conditions that you defined in Azure Policy. Confirm that **Source** is listed as **azpol-learn-prod-eastus-001 - subscriptions/subscription_id**.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list.png" alt-text="Screenshot of listed group members with a configured source." lightbox="media/create-virtual-network-manager-portal/group-members-list.png":::

---

## Create a configuration

Now that you've created the network group and given it the correct virtual networks, create a mesh network topology configuration. Replace `<subscription_id>` with your subscription.

1. Under **Settings**, select **Configurations**. Then select **Create**.

1. Select **Connectivity configuration** from the dropdown menu to begin creating a connectivity configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration-dropdown.png" alt-text="Screenshot of the configuration dropdown menu.":::

1. On the **Basics** tab, enter the following information, and then select **Next: Topology**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration.png" alt-text="Screenshot of the pane for adding a connectivity configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **cc-learn-prod-eastus-001**. |
    | **Description** | *(Optional)* Provide a description about this connectivity configuration. |

1. On the **Topology** tab, select the **Mesh** topology if it's not selected, and leave the **Enable mesh connectivity across regions** checkbox cleared.  Cross-region connectivity isn't required for this setup, because all the virtual networks are in the same region. When you're ready, select **Add** > **Add network group**.

     :::image type="content" source="./media/create-virtual-network-manager-portal/topology-configuration.png" alt-text="Screenshot of topology selection for network group connectivity configuration.":::

1. Under **Network groups**, select **ng-learn-prod-eastus-001**. Then choose **Select** to add the network group to the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-configuration.png" alt-text="Screenshot of adding a network group to a connectivity configuration.":::

1. Select the **Visualization** tab to view the topology of the configuration. This tab shows a visual representation of the network group that you added to the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/preview-topology.png" alt-text="Screenshot of previewing a topology for network group connectivity configuration.":::

1. Select **Next: Review + Create** > **Create** to create the configuration.

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-connectivity-configuration.png" alt-text="Screenshot of the tab for reviewing and creating a connectivity configuration.":::

1. After the deployment finishes, select **Refresh**. The new connectivity configuration appears on the **Configurations** pane.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration-list.png" alt-text="Screenshot of a connectivity configuration list.":::

## Deploy the connectivity configuration

To apply your configurations to your environment, you need to commit the configuration by deployment. Deploy the configuration to the East US region where the virtual networks are deployed:

1. Under **Settings**, select **Deployments**. Then select **Deploy configurations**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of the pane for deployments in Virtual Network Manager.":::

1. Select the following settings, and then select **Next**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deploy-configuration.png" alt-text="Screenshot of the tab for configuring a goal state for network resources.":::

    | Setting | Value |
    | ------- | ----- |
    | **Configurations** | Select **Include connectivity configurations in your goal state**. |
    | **Connectivity configurations** | Select **cc-learn-prod-eastus-001**.  |
    | **Target regions** | Select **East US** as the deployment region. |

1. Select **Deploy** to complete the deployment.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-confirmation.png" alt-text="Screenshot of the tab for reviewing a deployment.":::

1. Confirm that the deployment appears in the list for the selected region. The deployment of the configuration can take a few minutes to finish.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-in-progress.png" alt-text="Screenshot of a configuration deployment that shows a status of succeeded.":::

## Verify configuration deployment

Use the **Network Manager** section for each virtual network to verify that you deployed your configuration:

1. Go to the **vnet-learn-prod-eastus-001** virtual network.
1. Under **Settings**, select **Network Manager**.
1. On the **Connectivity Configurations** tab, verify that **cc-learn-prod-eastus-001** appears in the list.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of a connectivity configuration listed for a virtual network." lightbox="./media/create-virtual-network-manager-portal/vnet-configuration-association.png":::

1. Repeat the previous steps on **vnet-learn-prod-eastus-002**.

## Clean up resources

If you no longer need Azure Virtual Network Manager, you can remove it after you remove all configurations, deployments, and network groups:

1. To remove all configurations from a region, start in Virtual Network Manager and select **Deploy configurations**. Select the following settings, and then select **Next**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/none-configuration.png" alt-text="Screenshot of the tab for configuring a goal state for network resources, with the option for removing existing connectivity configurations selected.":::

    | Setting | Value |
    | ------- | ----- |
    | **Configurations** | Select **Include connectivity configurations in your goal state**. |
    | **Connectivity configurations** | Select **None - Remove existing connectivity configurations**. |
    | **Target regions** | Select **East US** as the deployed region. |

1. Select **Deploy** to complete the deployment removal.

1. To delete a configuration, go to the left pane of Virtual Network Manager. Under **Settings**, select **Configurations**. Select the checkbox next to the configuration that you want to remove, and then select **Delete** at the top of the resource pane.

1. On the **Delete a configuration** pane, select the following options, and then select **Delete**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-delete-options.png" alt-text="Screenshot of the pane for deleting a configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | **Delete option** | Select **Force delete the resource and all dependent resources**. |
    | **Confirm deletion** | Enter the name of the configuration. In this example, it's **cc-learn-prod-eastus-001**. |

1. To delete a network group, go to the left pane of Virtual Network Manager. Under **Settings**, select **Network groups**. Select the checkbox next to the network group that you want to remove, and then select **Delete** at the top of the resource pane.

1. On the **Delete a network group** pane, select the following options, and then select **Delete**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-delete-options.png" alt-text="Screenshot of Network group to be deleted option selection." lightbox="./media/create-virtual-network-manager-portal/network-group-delete-options.png":::

    | Setting | Value |
    | ------- | ----- |
    | **Delete option** | Select **Force delete the resource and all dependent resources**. |
    | **Confirm deletion** | Enter the name of the network group. In this example, it's **ng-learn-prod-eastus-001**. |

1. Select **Yes** to confirm the network group deletion.

1. After you remove all network groups, go to the left pane of Virtual Network Manager. Select **Overview**, and then select **Delete**.

1. On the **Delete a network manager** pane, select the following options, and then select **Delete**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-manager-delete.png" alt-text="Screenshot of the pane for deleting a network manager.":::

    | Setting | Value |
    | ------- | ----- |
    | **Delete option** | Select **Force delete the resource and all dependent resources**. |
    | **Confirm deletion** | Enter the name of the Virtual Network Manager instance. In this example, it's **vnm-learn-eastus-001**. |

1. Select **Yes** to confirm the deletion.

1. To delete the resource group and virtual networks, locate **rg-learn-eastus-001** and select **Delete resource group**. Confirm that you want to delete by entering **rg-learn-eastus-001** in the text box, and then select **Delete**.

## Next steps

Now that you've created an Azure Virtual Network Manager instance, learn how to block network traffic by using a security admin configuration:

> [!div class="nextstepaction"]
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-portal.md)
