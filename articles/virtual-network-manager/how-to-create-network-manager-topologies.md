---
title: 'Create network topologies with Azure Virtual Network Manager'
description: Learn how to create a mesh or hub-and-spoke network topology with Azure Virtual Network Manager using the Azure portal or Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/08/2026
ms.custom:
  - template-concept
  - engagement-fy23
---

# Create network topologies with Azure Virtual Network Manager

In this article, you learn how to create a network topology with Azure Virtual Network Manager. You can choose between two connectivity topologies and complete the steps by using either the Azure portal or Azure PowerShell:

- **Mesh**: All the virtual networks of the same region in the network groups included in the configuration can communicate with one another. You can enable cross-region connectivity by enabling the *global mesh* setting.
- **Hub and spoke**: You select a virtual network to act as a hub, and all spoke virtual networks have bi-directional peering with only the hub by default. You can also enable direct connectivity between spoke virtual networks in the same spoke network group and enable the spoke virtual networks to use the gateway in the hub virtual network.

Use the tabs throughout this article to select your topology, and then select whether you want to use the Azure portal or Azure PowerShell.

## Prerequisites

* An [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md#create-a-virtual-network-manager-instance). If you use PowerShell, create the instance with the [PowerShell quickstart](create-virtual-network-manager-powershell.md#create-a-virtual-network-manager-instance).
* Virtual networks that you want to use in the configuration. If you need to create them, see [Create a virtual network](../virtual-network/quick-create-portal.md) (portal) or [Create a virtual network - PowerShell](../virtual-network/quick-create-powershell.md).
* Read about the [Mesh](concept-connectivity-configuration.md#mesh-topology) and [Hub and spoke](concept-connectivity-configuration.md#hub-and-spoke-topology) network topologies.
* For Azure PowerShell:
  * Version `5.3.0` of `Az.Network` is required to access the required cmdlets for Azure Virtual Network Manager.
  * If you're running PowerShell locally, run `Connect-AzAccount` to create a connection with Azure.

## Choose a topology

Select the network topology you want to create. Then select the **Azure portal** or **PowerShell** tab to complete the steps.

#### [Mesh](#tab/mesh)

With a mesh topology, all the virtual networks of the same region in the network groups included in the configuration can communicate with one another. You can enable cross-region connectivity by enabling the *global mesh* setting in the connectivity configuration.

#### [Hub and spoke](#tab/hubspoke)

With a hub-and-spoke topology, you select a virtual network to act as a hub, and all spoke virtual networks have bi-directional peering with only the hub by default. You can also enable direct connectivity between spoke virtual networks in the same spoke network group and enable the spoke virtual networks to use the gateway in the hub virtual network.

---

## Create the topology

#### [Azure portal](#tab/portal/mesh)

### Create a network group

This section helps you create a network group containing the virtual networks you're using for the mesh topology.

> [!NOTE]
> This how-to guide assumes you created an Azure Virtual Network Manager instance using the [quickstart](create-virtual-network-manager-portal.md) guide.

[!INCLUDE [virtual-network-manager-create-network-group](../networking/includes/azure-virtual-network-manager/virtual-network-manager-create-network-group.md)]

### Define network group members

Azure Virtual Network Manager provides two methods for adding membership to a network group. You can manually add virtual networks or use Azure Policy to conditionally add virtual networks to the network group. This how-to [manually adds membership](concept-network-groups.md#static-membership). For information on defining group membership with Azure Policy, see [Define network group membership with Azure Policy](concept-network-groups.md#dynamic-membership).

To manually add the desired virtual networks to your network group for use in your connectivity configuration, follow these steps:

1. From the list of network groups, select your network group. Under *Manually add members*, select **Add virtual networks**.

1. On *Manually add members*, select all desired virtual networks and select **Add**.

1. To review the network group membership that you manually added, select **Group Members** on the *Network Group* page under **Settings**.

### Create a mesh connectivity configuration

This section guides you through creating a mesh configuration with the network group you created in the previous section.

1. Select **Configurations** under *Settings*, and then select **+ Create**.

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

1. On **Basics**, enter the following information, and select **Next: Topology >**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *Optional* Enter a description about what this configuration does. |

1. On the **Topology** tab, select the **Mesh** topology if not already selected, and leave the **Enable mesh connectivity across regions** unchecked. Cross-region connectivity isn't required for this setup since all the virtual networks in the network group are in the same region.

1. On *Add network groups*, select the network group you want to add to this configuration. Then select **Select** to save.

    > [!IMPORTANT]
    > Add multiple network groups to a mesh connectivity configuration to establish connectivity between all the member virtual networks of all the selected network groups in the same regions by default. *Enable mesh connectivity across regions* connects all virtual networks of all selected network groups across all regions.

1. Select **Review + create** and then **Create** to create the mesh connectivity configuration.

### Deploy the mesh configuration

To apply this configuration in your environment, deploy the configuration to the regions where your selected virtual networks reside.

1. Select **Deployments** under *Settings*, and then select **Deploy configuration**.

1. On *Deploy a configuration*, select the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state**. |
    | Connectivity Configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions that apply to virtual networks you select for the configuration. To gradually roll out this configuration, select a subset of regions. |

1. Select **Next** and then select **Deploy** to complete the deployment.

1. The deployment displays in the list for the selected region. The deployment of the configuration can take a few minutes to complete. Select the **Refresh** button to check on the status of the deployment.

### Confirm deployment

1. See [view applied configurations](how-to-view-applied-configurations.md).

1. To test connectivity between virtual networks, deploy a test virtual machine into each virtual network and start an ICMP request between them.

#### [PowerShell](#tab/powershell/mesh)

### Create a network group and add members

This section helps you create a network group containing the virtual networks you're using for the mesh topology.

1. Create a network group for virtual networks by using `New-AzNetworkManagerGroup`.

    ```azurepowershell-interactive
    $ng = @{
        Name = 'myNetworkGroup'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
    }
    $networkgroup = New-AzNetworkManagerGroup @ng
    ```

1. Add the static member to the static membership group by using `New-AzNetworkManagerStaticMember`.

    ```azurepowershell-interactive
        $vnet = get-AZVirtualNetwork -ResourceGroupName 'myAVNMResourceGroup' -Name 'VNetA'
        $sm = @{
        NetworkGroupName = $networkgroup.name
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        Name = 'staticMember'
        ResourceId = $vnet.id
        }
        $staticmember = New-AzNetworkManagerStaticMember @sm
    ```

### Create a mesh connectivity configuration

This section guides you through how to create a mesh configuration with the network group you created in the previous section.

1. Create a connectivity group item to add a network group to by using `New-AzNetworkManagerConnectivityGroupItem`.

    ```azurepowershell-interactive
    $gi = @{
        NetworkGroupId = $networkgroup.Id
    }
    $groupItem = New-AzNetworkManagerConnectivityGroupItem @gi
    ```

1. Create a configuration group and add the group item from the previous step.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.PSNetworkManagerConnectivityGroupItem]]$configGroup = @()
    $configGroup.Add($groupItem)
    ```

1. Create the connectivity configuration by using `New-AzNetworkManagerConnectivityConfiguration`.

    ```azurepowershell-interactive
    $config = @{
        Name = 'connectivityconfig'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        ConnectivityTopology = 'Mesh'
        AppliesToGroup = $configGroup
    }
    $connectivityconfig = New-AzNetworkManagerConnectivityConfiguration @config
     ```

### Deploy the mesh configuration

Commit the configuration to the target regions by using `Deploy-AzNetworkManagerCommit`.

```azurepowershell-interactive
[System.Collections.Generic.List[string]]$configIds = @()  
$configIds.add($connectivityconfig.id) 
[System.Collections.Generic.List[string]]$target = @()   
$target.Add("westus")     

$deployment = @{
    Name = 'myAVNM'
    ResourceGroupName = 'myAVNMResourceGroup'
    ConfigurationId = $configIds
    TargetLocation = $target
    CommitType = 'Connectivity'
}
Deploy-AzNetworkManagerCommit @deployment
```

### Confirm deployment

1. Go to one of the virtual networks in the portal and select **Network Manager** under *Settings*. You should see the configuration listed on that page.

1. To test connectivity between virtual networks, deploy a test virtual machine into each virtual network and start an ICMP request between them.

#### [Azure portal](#tab/portal/hubspoke)

### Create a network group

This section helps you create a network group containing the virtual networks you're using as the spokes for the hub-and-spoke topology.

> [!NOTE]
> This how-to guide assumes you created an Azure Virtual Network Manager instance using the [quickstart](create-virtual-network-manager-portal.md) guide.

[!INCLUDE [virtual-network-manager-create-network-group](../networking/includes/azure-virtual-network-manager/virtual-network-manager-create-network-group.md)]

### Define network group members

Azure Virtual Network Manager provides two methods for adding membership to a network group. You can manually add virtual networks or use Azure Policy to conditionally add virtual networks to the network group. This how-to [manually adds membership](concept-network-groups.md#static-membership). For information on defining group membership with Azure Policy, see [Define network group membership with Azure Policy](concept-network-groups.md#dynamic-membership).

To manually add the desired virtual networks to your network group for use in your connectivity configuration, follow these steps:

1. From the list of network groups, select your network group. Under *Manually add members*, select **Add virtual networks**.

1. On *Manually add members*, select all desired virtual networks and select **Add**.

1. To review the network group membership that you manually added, select **Group Members** on the *Network Group* page under **Settings**.

### Create a hub and spoke connectivity configuration

This section guides you through creating a hub and spoke configuration with the network group you created in the previous section.

1. Select **Configurations** under *Settings*, and then select **+ Create**.

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

1. On **Basics**, enter the following information, and select **Next: Topology >**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a *name* for this configuration. |
    | Description | *(Optional)* Enter a description about what this configuration does. |

1. On the **Topology** tab, select the **Hub and spoke** topology under *Topology*.

1. Select the **Delete existing peerings** checkbox if you want to remove all previously created virtual network peerings between virtual networks in the network groups included in this configuration. Then select **Select a hub**.

1. On **Select a hub**, select the virtual network intended as the hub virtual network and select **Select**.
    
1. Select **+ Add network groups**. 

1. On **Add network groups**, select the network groups you want to add to this configuration as spokes. Then select **Add** to save.

1. Select the settings you want to enable for each spoke network group. The following three options appear next to each network group name under **Spoke network groups**:

    - *Direct connectivity*: Select **Enable peering within network group** if you want to establish connectivity between virtual networks in the network group. By default, this connectivity is only established between virtual networks in this network group that belong to the same region.
    - *Global Mesh*: This option is only selectable if *direct connectivity* is enabled. Select **Enable mesh connectivity across regions** if you want to establish connectivity across regions for all virtual networks in this network group.
    - *Gateway*: Select **Use hub as a gateway** if you have a virtual network gateway in the hub virtual network that you want the virtual networks of this spoke network group to use to pass traffic to on-premises.

1. Select **Review + Create > Create** to create the hub and spoke connectivity configuration.

### Deploy the hub and spoke configuration

To apply this configuration in your environment, deploy the configuration to the regions where your selected virtual networks reside.

1. Select **Deployments** under *Settings*, and then select **Deploy a configuration**.

1. On **Deploy a configuration**, select the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state**. |
    | Connectivity configurations | Select the name of the configuration you created in the previous section. |
    | Target regions | Select all the regions that apply to virtual networks you select for the configuration. To gradually roll out this configuration, select a subset of regions. |

1. Select **Next** and then select **Deploy** to complete the deployment.

1. The deployment displays in the list for the selected region. The deployment of the configuration can take a few minutes to complete. Select the **Refresh** button to check on the status of the deployment.

    :::image type="content" source="./media/how-to-create-hub-and-spoke/deployment-succeeded.png" alt-text="Screenshot of configuration deployment in progress status.":::

> [!NOTE]
> If you're currently using virtual network peerings created outside of Azure Virtual Network Manager and want to manage your topology and connectivity by using Azure Virtual Network Manager, you have a few options for deployment to eliminate or minimize downtime to your network:
> - **Deploy Azure Virtual Network Manager connectivity configurations on top of existing peerings.** Connectivity configurations are fully compatible with preexisting manual peerings. When you deploy a connectivity configuration, by default Azure Virtual Network Manager reuses existing peerings that achieve the connectivity described in the configuration and establishes additional connectivity as needed. This behavior means that you don't need to delete any existing peerings between the hub and spoke virtual networks.
> - **Fully manage connectivity by using Azure Virtual Network Manager.** If you want to fully manage connectivity from a single control plane, you can opt to *Delete existing peerings* to remove all previously created peerings from the network groups' virtual networks targeted in this configuration upon deployment.

### Confirm configuration deployment

1. See [view applied configurations](how-to-view-applied-configurations.md).

1. To test *direct connectivity* between spoke virtual networks, deploy a virtual machine into each spoke virtual network. Then initiate an ICMP request from one virtual machine to the other.

### Use a Virtual WAN hub as the hub

[!INCLUDE [virtual-network-manager-virtual-wan-hub-preview-includes](../../includes/virtual-network-manager-virtual-wan-hub-preview-includes.md)]

This section shows how to create an Azure Virtual Network Manager hub-and-spoke connectivity configuration where the hub is a Virtual WAN hub.

#### Prerequisites

* Read about [Hub-and-spoke](concept-connectivity-configuration.md#hub-and-spoke-topology) topology behavior with hub virtual networks and Virtual WAN hubs.
* Have an existing Azure Virtual Network Manager instance and at least one network group.
* Have an existing Virtual WAN and virtual hub.
* Have permission to create or update connectivity configurations in Azure Virtual Network Manager and create or select connection policies in Virtual WAN.

#### Create the connectivity configuration

1. In the Azure portal, go to your **Network manager** instance.

1. Select **Configurations** under *Settings*, and then select **+ Create**.

1. Select **Connectivity configuration**.

1. On the **Basics** tab, enter a name and optional description, and then select **Next: Topology >**.

#### Select the Virtual WAN hub and connection policy

1. On the **Topology** tab, select **Hub and spoke**, and then select **Select a hub**.

1. In the **Select a hub** pane, select your Virtual WAN hub, and then select **Select**.

1. Select **Select connection policy**.

1. Select an existing connection policy, or select **Create new** to create a policy that applies to Virtual WAN virtual network connections that this connectivity configuration creates or updates.

1. A connection policy defines routing behavior for the virtual network connections, including route table association and propagation, route maps, and internet security behavior. For more information, see [Connection policy](../virtual-wan/how-to-connection-policy.md).

#### Add spoke network groups

1. Select **+ Add network groups**.

1. On **Add network groups**, select one or more network groups to use as spokes, and then select **Add**.

When you deploy this connectivity configuration:

* For virtual networks that aren't already connected to the selected Virtual WAN hub, Azure Virtual Network Manager creates Virtual WAN virtual network connections and applies the selected connection policy.
* For virtual networks that are already connected to the selected Virtual WAN hub, Azure Virtual Network Manager updates the existing connections to apply the selected connection policy.

#### Create, deploy, and validate

1. Select **Review + Create > Create** to create the connectivity configuration.

1. Open **Deployments** under *Settings*, and then select **Deploy a configuration**.

1. On the deployment page, select **Include connectivity configurations in your goal state**, select your new connectivity configuration, select the target regions, and then select **Deploy**.

1. In your Virtual WAN resource, go to **Virtual network connections** and verify that the expected spoke virtual network connections are in a connected state.

1. In the virtual hub, review effective routes to confirm route behavior reflects the selected connection policy.

#### [PowerShell](#tab/powershell/hubspoke)

### Create a virtual network group and add members

This section shows you how to create a network group that contains the virtual networks you're using for the hub-and-spoke topology.

1. Create a network group for virtual networks by using `New-AzNetworkManagerGroup`.

    ```azurepowershell-interactive
    $ng = @{
            Name = 'myNetworkGroup'
            ResourceGroupName = 'myAVNMResourceGroup'
            NetworkManagerName = 'myAVNM'
        }
        $networkgroup = New-AzNetworkManagerGroup @ng
    ```

1. Add the static member to the static membership group by using `New-AzNetworkManagerStaticMember`.

    ```azurepowershell-interactive
        $vnet = get-AZVirtualNetwork -ResourceGroupName 'myAVNMResourceGroup' -Name 'VNetA'
        $sm = @{
        NetworkGroupName = $networkgroup.name
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        Name = 'staticMember'
        ResourceId = $vnet.id
        }
        $staticmember = New-AzNetworkManagerStaticMember @sm
    ```

### Create a hub-and-spoke connectivity configuration

This section shows you how to create a hub-and-spoke configuration by using the network group you created in the previous section.

1. Create a spokes connectivity group item to add a network group by using `New-AzNetworkManagerConnectivityGroupItem`. You can enable direct connectivity by using the `-GroupConnectivity` flag, global mesh by using the `-IsGlobal` flag, or use the gateway in the hub virtual network by using the `-UseHubGateway` flag.

    ```azurepowershell-interactive
    $spokes = @{
        NetworkGroupId = $networkgroup.Id
    }
    $spokesGroup = New-AzNetworkManagerConnectivityGroupItem @spokes -UseHubGateway -GroupConnectivity 'DirectlyConnected' -IsGlobal
    ```

1. Create a spokes connectivity group and add the group item from the previous step.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.NetworkManager.PSNetworkManagerConnectivityGroupItem]]$configGroup = @()
    $configGroup.Add($spokesGroup) 
    ```

1. Create a hub connectivity group item and define the virtual network you use as the hub by using `New-AzNetworkManagerHub`.

    ```azurepowershell-interactive
    [System.Collections.Generic.List[Microsoft.Azure.Commands.Network.Models.NetworkManager.PSNetworkManagerHub]]$hubList = @()
    
    $hub = @{
        ResourceId = '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myAVNMResourceGroup/providers/Microsoft.Network/virtualNetworks/VNetA'
        ResourceType = 'Microsoft.Network/virtualNetworks'
    } 
    $hubvnet = New-AzNetworkManagerHub @hub

    $hubList.Add($hubvnet)
    ```

1. Create the connectivity configuration by using `New-AzNetworkManagerConnectivityConfiguration`.

    ```azurepowershell-interactive
    $config = @{
        Name = 'connectivityconfig'
        ResourceGroupName = 'myAVNMResourceGroup'
        NetworkManagerName = 'myAVNM'
        ConnectivityTopology = 'HubAndSpoke'
        Hub = $hubList
        AppliesToGroup = $configGroup
    }
    $connectivityconfig = New-AzNetworkManagerConnectivityConfiguration @config -DeleteExistingPeering -IsGlobal
     ```

> [!NOTE]
> If you're currently using virtual network peerings created outside of Azure Virtual Network Manager and want to manage your topology and connectivity by using Azure Virtual Network Manager, you have a few options for deployment to eliminate or minimize downtime to your network:
> - **Deploy Azure Virtual Network Manager connectivity configurations on top of existing peerings.** Connectivity configurations are fully compatible with preexisting manual peerings. When you deploy a connectivity configuration, by default Azure Virtual Network Manager reuses existing peerings that achieve the connectivity described in the configuration and establishes additional connectivity as needed. This behavior means that you don't need to delete any existing peerings between the hub and spoke virtual networks.
> - **Fully manage connectivity by using Azure Virtual Network Manager.** If you want to fully manage connectivity from a single control plane, you can opt to *Delete existing peerings* to remove all previously created peerings from the network groups' virtual networks targeted in this configuration upon deployment.

### Deploy the hub and spoke configuration

Commit the configuration to the target regions by using `Deploy-AzNetworkManagerCommit`.

```azurepowershell-interactive
[System.Collections.Generic.List[string]]$configIds = @()  
$configIds.add($connectivityconfig.id) 
[System.Collections.Generic.List[string]]$regions = @()   
$regions.Add("westus")     

$deployment = @{
    Name = 'myAVNM'
    ResourceGroupName = 'myAVNMResourceGroup'
    ConfigurationId = $configIds
    TargetLocation = $regions
    CommitType = 'Connectivity'
}
Deploy-AzNetworkManagerCommit @deployment
```

### Confirm configuration deployment

1. Go to one of the virtual networks in the Azure portal and select **Peerings** under **Settings**. You see a new peering connection created between the hub and the spoke virtual networks with *AVNM* in the name.

1. To test *direct connectivity* between spokes, deploy a virtual machine into each spokes virtual network. Then start an ICMP request from one virtual machine to the other.

---

## Next steps

- [Create a secured hub-and-spoke topology in this tutorial](tutorial-create-secured-hub-and-spoke.md).
- [Learn how to deploy a hub-and-spoke topology with Azure Firewall](how-to-deploy-hub-spoke-topology-with-azure-firewall.md).
- Learn about [Security admin rules](concept-security-admins.md).
- Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
