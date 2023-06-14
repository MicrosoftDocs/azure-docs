---
title: 'View configurations applied by Azure Virtual Network Manager '
description: Learn how to view configurations applied by Azure Virtual Network Manager.
author: mbender-ms    
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 03/22/2023
ms.custom: template-how-to
---
# View configurations applied by Azure Virtual Network Manager

Azure Virtual Network Manager provides a few different ways for you to verify if configurations are being applied correctly. In this article, we'll look at how you can verify configurations applied both at virtual network and virtual machine level. We'll also go over operations you'll see in the activity log.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Virtual network visibility
Effective network group membership and applied configurations can be viewed on the per virtual network level.

### Network group membership
All network group memberships are recorded and available for query inside [Azure Resource Graph](../governance/resource-graph/overview.md). You'll be using the `networkResources` table for the extension resource type of `Microsoft.Network/networkGroupMemberships` in your query.

Open the [Azure portal](https://portal.azure.com) to find and use the Resource Graph Explorer with the following steps:

1. Select **All services** in the left pane. Search for and select **Resource Graph Explorer**, or connect directly to the [Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade) 

1. In the **Query 1** portion of the window, enter the following query to find all network groups containing your virtual network:
    ```kusto
    networkresources
    | where type == "microsoft.network/networkgroupmemberships"
    | where id == "{virtualNetworkId}/providers/Microsoft.Network/networkGroupMemberships/default"
    | mv-expand properties.GroupMemberships
    | project properties_GroupMemberships.NetworkGroupId
    ```
1. Select **Run query**.
1. Review the query response in the **Results** tab. Select the **Messages** tab to see details about the query, including the count of results and duration of the query. Errors, if any, are displayed under this tab.
1. To find all resources inside your network group, repeat steps above with the following query:
    ```kusto
    networkresources
    | where type == "microsoft.network/networkgroupmemberships"
    | mv-expand properties.GroupMemberships
    | where properties_GroupMemberships.NetworkGroupId == {networkGroupId}
    | parse id with virtualNetworkId "/providers/Microsoft.Network/networkGroupMemberships/default"
    |    project virtualNetworkId
    ```
Learn more about [Azure Resource Graph queries using Resource Graph Explorer](../governance/resource-graph/first-query-portal.md).

> [!NOTE]
> Azure Resource Graph will only return networking resources you have read access to at the time of running the query. 

### Applied configurations

Once your configuration has been deployed by Virtual Network Manager, you can view the applied configuration from the virtual network resource. 

1. Go to your virtual network resource and select **Network Manager** under *Settings*. On the Connectivity tab, you'll see all the connectivity configurations the virtual network is associated with. 

    :::image type="content" source="./media/how-to-view-applied-configurations/vnet-connectivity.png" alt-text="Screenshot of connectivity configuration associated to a virtual network.":::

2. Select the **Security admin configurations** tab to see all the security rules currently applied to your virtual network.

    :::image type="content" source="./media/how-to-view-applied-configurations/vnet-security.png" alt-text="Screenshot of security rules associated to a virtual network.":::


## Virtual machine visibility

At the virtual machine level, you can view security rules applied by Virtual Network Manager and the effective routes for the connectivity configurations.

### Applied security rules

1. Go to a virtual machine in a virtual network that has a configuration applied by Virtual Network Manager. Then select **Networking** under *Settings* on the left menu pane.

    :::image type="content" source="./media/how-to-view-applied-configurations/virtual-machine.png" alt-text="Screenshot of virtual machine overview page.":::

1. You'll see a list of inbound network security groups and also a section for inbound security rules applied by Virtual Network Manager.

    :::image type="content" source="./media/how-to-view-applied-configurations/vm-inbound-rules.png" alt-text="Screenshot of virtual machine outbound security rules.":::

1. Select the **Outbound port rules** tab to see the outbound security rules for the virtual machine.

    :::image type="content" source="./media/how-to-view-applied-configurations/vm-outbound-rules.png" alt-text="Screenshot of virtual machine inbound security rules.":::

### Effective routes

1. To see the effective routes for the applied connectivity configuration, select the network interface name under the *Networking* settings of the virtual machine.

    :::image type="content" source="./media/how-to-view-applied-configurations/vm-network-interface.png" alt-text="Screenshot of selecting virtual machine network interface card.":::

1. Then select **Effective routes** under *Support + troubleshooting*.

    :::image type="content" source="./media/how-to-view-applied-configurations/network-interface.png" alt-text="Screenshot of effective routes button from a VM network interface card.":::

1. Routes with the next hop type of *ConnectedGroup* are either part of mesh configuration or when [*Direct connectivity*](concept-connectivity-configuration.md#direct-connectivity) is enabled for a network group. Routes between the hub and spoke virtual networks will appear as next hop type *VNetPeering* or *GlobalVNetPeering*.

    :::image type="content" source="./media/how-to-view-applied-configurations/effective-routes.png" alt-text="Screenshot of effective routes that shows connected groups and hub routes." lightbox="./media/how-to-view-applied-configurations/effective-routes-expanded.png":::

    > [!NOTE]
    > The hub virtual network address space is also **included** in the *ConnectedGroup*. Therefore, if virtual network peering fails between the hub and spoke virtual networks, they can still communicate with each other because they're in a connected group.
    > 

### Effective security rules

1. To see effective security rules for an applied security rule configuration, select the network interface name under the *Networking* settings of the virtual machine.

    :::image type="content" source="./media/how-to-view-applied-configurations/vm-network-interface.png" alt-text="Screenshot of selecting virtual machine network interface card for security rules.":::

1. Then select **Effective security rules** under *Support + troubleshooting*.

    :::image type="content" source="./media/how-to-view-applied-configurations/network-interface-security-rules.png" alt-text="Screenshot of effective security rules button for a VM network interface card.":::

1. Select the name of the Azure Virtual Network Manager to see the security admin rules associated to the virtual machine.

    :::image type="content" source="./media/how-to-view-applied-configurations/effective-security-rules.png" alt-text="Screenshot of effective security rules associated to the virtual machine.":::

## Activity Log

You can view the activity log for your Azure Virtual Network Manager resource to see the changes that you or your network administrator have made. To view the activity log, go to your Network Manager resource in the Azure portal. Select **Activity log** in the left pane menu. If necessary, adjust the *Timespan* and add more filters to narrow the list of operations. You can also view the *Activity Log* by searching for the service at the top of the Azure portal.

:::image type="content" source="./media/how-to-view-applied-configurations/activity-log.png" alt-text="Screenshot of activity log page for Network Manager.":::

### List of operations

The following list contains operations you'll see in the activity log:

| Name | Description |
| ---- | ----------- |
| Commit | Deployment of a configuration has been committed to a region(s). |
| Delete ConnectivityConfiguration | Deleting a connectivity configuration from Network Manager. |
| Delete NetworkGroups | Deleting a network group from Network Manager.|
| Delete StaticMembers | Deleting a member from a network group.|
| Delete Rules | Deleting a rule from a rule collection. |
| Delete RuleCollections | Deleting a rule collection from a security admin configuration. |
| Delete SecurityAdminConfigurations | Deleting a security admin configuration from Network Manager. |
| ListDeploymentStatus | Viewing the deployment status of a connectivity or security admin configuration. |
| ListActiveConnectivityConfiguration | Viewing the list of connectivity configurations applied to the virtual network.|
| ListActiveSecurityAdminRules | Viewing the list of security admin configurations applied to the virtual network. |
| Write ConnectivityConfiguration. | Creating a new connectivity configuration. |
| Write NetworkGroups | Creating a new network group. |
| Delete StaticMembers | Adding a member from a network group.|
| Write NetworkManager | Creating a new Azure Virtual Network Manager instance. |
| Write Rules | Creating a new security rule to add to a rule collection. |
| Write RuleCollections | Creating a new rule collection to add to a security admin configuration. |
| Write SecurityAdminConfiguration | Creating a new security admin configuration. |

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
- See [Network Manager FAQ](faq.md) for frequently asked questions.
