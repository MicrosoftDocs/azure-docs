---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager - Azure portal'
description: Learn to a mesh virtual network topology with Azure Virtual Network Manager by using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: quickstart
ms.date: 07/11/2025
ms.custom:
  - template-quickstart
  - mode-ui
  - engagement-fy23
  - sfi-image-nochange
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager - Azure portal

Get started with Azure Virtual Network Manager by using the Azure portal to manage connectivity for all your virtual networks.

In this quickstart, you deploy three virtual networks and use Azure Virtual Network Manager to create a mesh network topology. Then you verify the connectivity configuration was applied.

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager." lightbox="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- To modify network groups using Azure Policy to conditionally define membership, you must be [granted access through Azure Role-based Access Control (RBAC) role](concept-network-groups.md#network-groups-and-azure-policy) assignment only. Classic Admin or legacy authorization isn't supported.

[!INCLUDE [virtual-network-manager-create-instance](../../includes/virtual-network-manager-create-instance.md)]

## Create virtual networks

Create three virtual networks by using the portal. Each virtual network has a `networkType` tag that's used in Azure Policy for network group membership. If you have existing virtual networks for your mesh configuration, add the tags listed in the table to your virtual networks and skip to the next section.

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual networks**. Then select **Create** to begin configuring a virtual network.

1. On the **Basics** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy this virtual network. |
    | **Resource group** | Select **resource-group**. |
    | **Virtual network name** | Enter **vnet-000**. |
    | **Region** | Select **(US) West 2**. |

1. Select the **IP addresses** tab.
1. On the **IP addresses** tab, configure the following network address spaces.

    | Setting | Value |
    | -------- | ----- |
    | **IPv4 address space** | 10.0.0.0/16 |
    | **Subnet name** | default |
    | **Subnet address space** | 10.0.0.0/24 |

1. Select the **Tags** tab. Enter the following tag information and select **Review + Create**.

    | Setting | Value |
    | ------- | ----- |
    | Name | NetworkType |
    | Value | Production |
    | Resource | Select **Virtual network**. |

1. After your configuration passes validation, select **Create** to deploy the virtual network.

1. Repeat the preceding steps to create more virtual networks with the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the same subscription that you selected in step 2. |
    | **Resource group** | Select **resource-group**. |
    | **Name** | Enter **vnet-01** and **vnet-02** for the other virtual networks. |
    | **Region** | Select **(US) West 2**. |
    | **vnet-01 IP addresses** | IPv4 address space: **10.1.0.0/16** </br> Subnet name: **default** </br> Subnet address space: **10.1.0.0/24**|
    | **vnet-01 Tags** | Name: **NetworkType** </br> Value: **Production** </br> Resource: **Virtual network**. |
    | **vnet-02 IP addresses** | IPv4 address space: **10.2.0.0/16** </br> Subnet name: **default** </br> Subnet address space: **10.2.0.0/24**|
    | **vnet-02 Tags** | Name: **NetworkType** </br> Value: **Production** </br> Resource: **Virtual network**. |

## Create a network group

Azure Virtual Network Manager applies configurations to groups of virtual networks known as network groups. To create a network group:

[!INCLUDE [virtual-network-manager-create-network-group](../../includes/virtual-network-manager-create-network-group.md)]

## Define membership for a connectivity configuration

After you create your network group, you add virtual networks as members. Choose one of the following options for the network group's membership. The members of this network group will be used in the connectivity configuration that you create later in this quickstart.

# [Manual membership](#tab/manualmembership)

### Add a virtual network manually

In this task, you manually add two virtual networks to your network group for your mesh connectivity configuration:

1. From the list of network groups, select **network-group**. On the **network-group** pane, under **Manually add members**, select **Add virtual networks**.

1. On the **Manually add members** pane, select **vnet-00** and **vnet-01**, and then select **Add**.

1. On the **Network Group** pane, select **View group members**. Confirm **vnet-00** and **vnet-01** are listed with a **Source** of *Manually added*. If no virtual networks are listed, select **Refresh**.

# [Azure Policy](#tab/azurepolicy)

### Add a virtual network conditionally with a policy definition

By using [Azure Policy](concept-azure-policy-integration.md), you define a condition to automatically add two virtual networks to your network group when the virtual network has a tag with the name `NetworkType` and the value `Production`.

1. From the list of network groups, select **network-group**. Under **Create policy to dynamically add members**, select **Create Azure policy**.

1. On the **Create Azure policy** pane, select or enter the following information, and then select **Preview resources**.

    | Setting | Value |
    | ------- | ----- |
    | **Policy name** | Enter **azure-policy**. |
    | **Scope** | Choose **Select scopes** and then select your current subscription. |
    | **Parameter** | Select **Name** from the dropdown list.|
    | **Operator** | Select **Key value pair** from the dropdown list.|
    | **Condition** | Enter name of **NetworkType**.</br> Enter value of **Production**. |

    :::image type="content" source="./media/create-virtual-network-manager-portal/network-group-conditional-thumb.png" alt-text="Screenshot of the pane for creating an Azure policy, including criteria for definitions." lightbox="media/create-virtual-network-manager-portal/network-group-conditional.png":::

2. The **Preview resources** pane shows the virtual networks for addition to the network group based on the defined conditions in Azure Policy. When you're ready, select **Close**.

    :::image type="content" source="media/create-virtual-network-manager-portal/preview-virtual-networks.png" alt-text="Screenshot of the pane for previewing the virtual networks.":::

3. Select **Save** to deploy the Azure Policy. It can take up to one minute for the policy to take effect and be added to your network group.

4. On the **Network Group** pane, under **Settings**, select **Group members** to view the membership of the group based on the conditions that you defined in Azure Policy. Confirm the **Source** is listed as **azure-policy - subscriptions/subscription_id**.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list.png" alt-text="Screenshot of listed group members with a configured source.":::

---

## Create a configuration

Now that you created the network group and updated its membership with virtual networks, you create a mesh connectivity configuration. Replace `<subscription_id>` with your subscription.

1. Under **Settings**, select **Configurations**. Then select **Create**.

1. Select **Connectivity configuration** from the dropdown menu to begin creating a connectivity configuration.

1. On the **Basics** tab, enter the following information, and then select **Next: Topology**.

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **connectivity-configuration**. |
    | **Description** | *(Optional)* Provide a description about this connectivity configuration. |

1. On the **Topology** tab, select the **Mesh** topology, and leave the **Enable mesh connectivity across regions** checkbox unselected. Cross-region connectivity isn't required for this setup since all the virtual networks are in the same region.

1. Under **Network groups**, select **Add** > **Add network group**.
1. On the **Add network groups** window, select **network-group**, and then choose **Select** to add the network group to the configuration.

1. Select the **View topology** tab to visualize the topology of the configuration. This tab shows a visual representation of the network group that you added to the configuration and the connectivity to be established.

    :::image type="content" source="./media/create-virtual-network-manager-portal/preview-topology-thumb.png" alt-text="Screenshot of previewing a topology for network group connectivity configuration." lightbox="media/create-virtual-network-manager-portal/preview-topology.png":::

1. Select **Next: Review + Create** > **Create** to create the configuration.

1. After the deployment finishes, select **Refresh**. The new connectivity configuration appears on the **Configurations** pane.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration-list.png" alt-text="Screenshot of a connectivity configuration list.":::

## Deploy the connectivity configuration

To apply your configurations to your environment, you need to commit the configuration by deployment. Deploy the configuration to the West US 2 region where the virtual networks are deployed:

1. Under **Settings**, select **Deployments**. Then select **Deploy configurations** and **Connectivity configuration** from the dropdown.

1. On the **Deploy a configuration** window, select the following settings, and then select **Next**.

    | Setting | Value |
    | ------- | ----- |
    | **Connectivity configurations** | Select **connectivity-configuration** under **Connectivity - Mesh** in the dropdown menu. |
    | **Target regions** | Select **West US 2** as the deployment region. |

1. Select **Next** and **Deploy** to complete the deployment.

1. Confirm that the deployment appears in the list for the selected region. The deployment of the configuration can take a few minutes to finish.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-in-progress-thumb.png" alt-text="Screenshot of a configuration deployment that shows a status of succeeded." lightbox="media/create-virtual-network-manager-portal/deployment-in-progress.png":::

## Verify configuration deployment

Use the **Network Manager** section for each virtual network to verify that you deployed your configuration:

1. Go to the **vnet-00** virtual network.
1. Under **Settings**, select **Network Manager**.
1. On the **Connectivity configurations** tab, verify that **connectivity-configuration** appears in the list.

    :::image type="content" source="./media/create-virtual-network-manager-portal/vnet-configuration-association.png" alt-text="Screenshot of a connectivity configuration listed for a virtual network." lightbox="./media/create-virtual-network-manager-portal/vnet-configuration-association.png":::

1. Repeat the previous steps on **vnet-01**.

## Clean up resources

If you no longer need Azure Virtual Network Manager and the resources in this quickstart, you can remove them by following these steps:

1. To delete the resource group and all the resources it contains, select **resource-group** in the Azure portal and select **Delete resource group**. Confirm that you want to delete by entering **resource-group** in the text box, and then select **Delete**.
1. To delete the Azure Policy assignment, go to the **Policy** section in the Azure portal, select **Assignments**, and then select **azure-policy**. Select **Delete** to remove the policy definition.
1. In the **Policy** section, select **Definitions** and then select **azure-policy**. Select **Delete** to remove the policy definition.

## Next steps

> [!div class="nextstepaction"]
> [Learn about connectivity configurations](concept-connectivity-configuration.md)
> [Block network traffic with Azure Virtual Network Manager](how-to-block-network-traffic-portal.md)
