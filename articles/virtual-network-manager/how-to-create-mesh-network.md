---
title: 'Create a mesh network topology with Azure Virtual Network Manager (Preview)'
description: Learn how to create a mesh network topology with Azure Virtual Network Manager.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Create a mesh network topology with Azure Virtual Network Manager (Preview)

In this article, you'll learn how to create a mesh network topology using Azure Virtual Network Manager. With this configuration, all the virtual networks of the same region in the same network group can communicate with one another. You can enable cross region connectivity by enabling the global mesh setting in the connectivity configuration.

> [!IMPORTANT]
> *Azure Virtual Network Manager* is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

* Read about [mesh](concept-connectivity-configuration.md#mesh-network-topology) network topology.
* Created a [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md#create-virtual-network-manager).
* Identify virtual networks you want to use in the mesh configuration or create new [virtual networks](../virtual-network/quick-create-portal.md).

## Create a network group

This section will help you create a network group containing the virtual networks you'll be using for the hub-and-spoke network topology.

1. Go to your Azure Virtual Network Manager instance. This how-to guide assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide.

1. Select **Network groups** under *Settings*, and then select **+ Add** to create a new network group.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-network-group.png" alt-text="Screenshot of add a network group button.":::

1. On the *Basics* tab, enter a **Name** and a **Description** for the network group.

    :::image type="content" source="./media/how-to-create-hub-and-spoke/basics.png" alt-text="Screenshot of basics tab for add a network group.":::

1. To add virtual network manually, select the **Static group members** tab. For more information, see [static members](concept-network-groups.md#static-membership).

    :::image type="content" source="./media/how-to-create-hub-and-spoke/static-group.png" alt-text="Screenshot of static group members tab.":::

1. To add virtual networks dynamically, select the **Conditional statements** tab. For more information, see [dynamic membership](concept-network-groups.md#dynamic-membership).

    :::image type="content" source="./media/how-to-create-hub-and-spoke/conditional-statements.png" alt-text="Screenshot of conditional statements tab.":::

1. Once you're satisfied with the virtual networks selected for the network group, select **Review + create**. Then select **Create** once validation has passed.

## Create a mesh connectivity configuration

This section will guide you through how to create a mesh configuration with the network group you created in the previous section.

1. Select **Configuration** under *Settings*, then select **+ Add a configuration**.

    :::image type="content" source="./media/how-to-create-hub-and-spoke/configuration-list.png" alt-text="Screenshot of the configurations list.":::

1. Select **Connectivity** from the drop-down menu.

    :::image type="content" source="./media/create-virtual-network-manager-portal/configuration-menu.png" alt-text="Screenshot of configuration drop-down menu.":::

1. On the *Add a connectivity configuration* page, enter, or select the following information:

    :::image type="content" source="./media/how-to-create-mesh-network/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *Optional* Enter a description about what this configuration will do. |
    | Topology | Select the **Mesh** topology. |
    | Global Mesh | Select this option to enable cross region connectivity between virtual networks in the same network group. |

1. Then select **+ Add network groups**. 

1. On the *Add network groups* page, select the network groups you want to add to this configuration. Then select **Add** to save.

1. Select **Add** again to create the mesh connectivity configuration.

## Deploy the mesh configuration

To have this configuration take effect in your environment, you'll need to deploy the configuration to the regions where your selected virtual networks are created.

1. Select **Deployments** under *Settings*, then select **Deploy a configuration**.

1. On the *Deploy a configuration* select the following settings:

    :::image type="content" source="./media/how-to-create-hub-and-spoke/deploy.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configuration type | Select **Connectivity**. |
    | Configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions that apply to virtual networks you select for the configuration. |

1. Select **Deploy** and then select **OK** to commit the configuration to the selected regions.

1. The deployment of the configuration can take up to 15-20 minutes, select the **Refresh** button to check on the status of the deployment.

## Confirm deployment

1. See [view applied configurations](how-to-view-applied-configurations.md).

1. To test connectivity between virtual networks, deploy a test virtual machine into each virtual network and start an ICMP request between them.

## Next steps

- Learn about [Security admin rules](concept-security-admins.md)
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
