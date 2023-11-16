---
title: Set up Private Link with Azure Virtual Desktop - Azure
description: Learn how to set up Private Link with Azure Virtual Desktop to privately connect to your remote resources.
author: dknappettmsft
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 07/17/2023
ms.author: daknappe
---

# Set up Private Link with Azure Virtual Desktop

This article shows you how to set up Private Link with Azure Virtual Desktop to privately connect to your remote resources. For more information about using Private Link with Azure Virtual Desktop, including limitations, see [Azure Private Link with Azure Virtual Desktop](private-link-overview.md).

## Prerequisites

In order to use Private Link with Azure Virtual Desktop, you need the following things:

- An existing [host pool](create-host-pool.md) with [session hosts](add-session-hosts-host-pool.md), [application group, and workspace](create-application-group-workspace.md).

- An existing [virtual network](../virtual-network/manage-virtual-network.md) and [subnet](../virtual-network/virtual-network-manage-subnet.md) you want to use for private endpoints.

- The [required Azure role-based access control permissions to create private endpoints](../private-link/rbac-permissions.md).

- If you're using the [Remote Desktop client for Windows](./users/connect-windows.md), you must use version 1.2.4066 or later to connect using a private endpoint.

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

- Azure PowerShell cmdlets for Azure Virtual Desktop that support Private Link are in preview. You'll need to download and install the [preview version of the Az.DesktopVirtualization module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/5.0.0-preview) to use these cmdlets, which have been added in version 5.0.0.

## Enable the feature

To use Private Link with Azure Virtual Desktop, you need to re-register the *Microsoft.DesktopVirtualization* resource provider on each subscription you want to use Private Link with Azure Virtual Desktop.

> [!IMPORTANT]
> For Azure US Gov and Azure operated by 21Vianet, you also need to register the feature for each subscription.

### Register the feature (Azure US Gov and Azure operated by 21Vianet only)

To register the *Azure Virtual Desktop Private Link* feature:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter **Subscriptions** and select the matching service entry.

1. Select the name of your subscription, then in the **Settings** section, select **Preview features**.

1. Select the drop-down list for the filter **Type** and set it to **Microsoft.DesktopVirtualization**.

1. Select **Azure Virtual Desktop Private Link**, then select **Register**.

### Re-register the resource provider

To re-register the *Microsoft.DesktopVirtualization* resource provider:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter **Subscriptions** and select the matching service entry.

1. Select the name of your subscription, then in the section **Settings**, select **Resource providers**.

1. Search for and select **Microsoft.DesktopVirtualization**, then select **Re-register**.

1. Verify that the status of *Microsoft.DesktopVirtualization* is **Registered**.

## Create private endpoints

During the setup process, you create private endpoints to the following resources:

| Purpose | Resource type | Target sub-resource | Quantity | Private DNS zone name |
|--|--|--|--|--|
| Connections to host pools | Microsoft.DesktopVirtualization/hostpools | connection | One per host pool | `privatelink.wvd.microsoft.com` |
| Feed download | Microsoft.DesktopVirtualization/workspaces | feed | One per workspace | `privatelink.wvd.microsoft.com` |
| Initial feed discovery | Microsoft.DesktopVirtualization/workspaces | global | **Only one for all your Azure Virtual Desktop deployments** | `privatelink-global.wvd.microsoft.com` |

### Connections to host pools

To create a private endpoint for the *connection* sub-resource for connections to a host pool, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to create a private endpoint for the *connection* sub-resource for connections to a host pool using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry to go to the Azure Virtual Desktop overview.

1. Select **Host pools**, then select the name of the host pool for which you want to create a *connection* sub-resource.

1. From the host pool overview, select **Networking**, then **Private endpoint connections**, and finally **New private endpoint**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the private endpoint in from the drop-down list. |
   | Resource group | This automatically defaults to the same resource group as your workspace for the private endpoint, but you can also select an alternative existing one from the drop-down list, or create a new one. |
   | Name | Enter a name for the new private endpoint. |
   | Network interface name | The network interface name fills in automatically based on the name you gave the private endpoint, but you can also specify a different name. |
   | Region | This automatically defaults to the same Azure region as the workspace and is where the private endpoint is deployed. This must be the same region as your virtual network and session hosts. |

   Once you've completed this tab, select **Next: Resource**.

1. On the **Resource** tab, validate the values for *Subscription*, *Resource type*, and *Resource*, then for **Target sub-resource**, select **connection**. Once you've completed this tab, select **Next: Virtual Network**.

1. On the **Virtual Network** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Virtual network | Select the virtual network you want to create the private endpoint in from the drop-down list. |
   | Subnet | Select the subnet of the virtual network you want to create the private endpoint in from the drop-down list. |
   | Network policy for private endpoints | Select **edit** if you want to choose a subnet network policy. For more information, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md). |
   | Private IP configuration | Select **Dynamically allocate IP address** or **Statically allocate IP address**. The address space is from the subnet you selected.<br /><br />If you choose to statically allocate IP addresses, you need to fill in the **Name** and **Private IP** for each listed member. |
   | Application security group | *Optional*: select an existing application security group for the private endpoint from the drop-down list, or create a new one. You can also add one later. |

   Once you've completed this tab, select **Next: DNS**.

1. On the **DNS** tab, choose whether you want to use [Azure Private DNS Zone](../dns/private-dns-privatednszone.md) by selecting **Yes** or **No** for **Integrate with private DNS zone**. If you select **Yes**, select the subscription and resource group in which to create the private DNS zone `privatelink.wvd.microsoft.com`. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any [name/value pairs](../azure-resource-manager/management/tag-resources.md) you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the private endpoint for the connection sub-resource.


# [Azure PowerShell](#tab/powershell)

Here's how to create a private endpoint for the *connection* sub-resource used for connections to a host pool using the [Az.Network](/powershell/module/az.network/) and [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell modules.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Get the details of the virtual network and subnet you want to use for the private endpoint and store them in a variable by running the following commands:

   ```azurepowershell
   # Get the subnet details for the virtual network
   $subnet = (Get-AzVirtualNetwork -Name <VNetName> -ResourceGroupName <ResourceGroupName>).Subnets | ? Name -eq <SubnetName>
   ```

3. Create a Private Link service connection for a host pool with the connection sub-resource by running the following commands.

   ```azurepowershell
   # Get the resource ID of the host pool
   $hostPoolId = (Get-AzWvdHostPool -Name <HostPoolName> -ResourceGroupName <ResourceGroupName>).Id

   # Create the service connection
   $parameters = @{
       Name = '<ServiceConnectionName>'
       PrivateLinkServiceId = $hostPoolId
       GroupId = 'connection'
   }

   $serviceConnection = New-AzPrivateLinkServiceConnection @parameters
   ```

4. Finally, create the private endpoint by running the commands in one of the following examples.

   1. To create a private endpoint with a dynamically allocated IP address:
   
      ```azurepowershell
      # Specify the Azure region. This must be the same region as your virtual network and session hosts.
      $location = '<Location>'
   
      # Create the private endpoint
      $parameters = @{
          Name = '<PrivateEndpointName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = $location
          Subnet = $subnet
          PrivateLinkServiceConnection = $serviceConnection
      }
   
      New-AzPrivateEndpoint @parameters
      ```

   1. To create a private endpoint with statically allocated IP addresses:
   
      ```azurepowershell
      # Specify the Azure region. This must be the same region as your virtual network and session hosts.
      $location = '<Location>'

      # Create a hash table for each private endpoint IP configuration
      $ip1 = @{
          Name = 'ipconfig1'
          GroupId = 'connection'
          MemberName = 'broker'
          PrivateIPAddress = '<IPAddress>'
      }

      $ip2 = @{
          Name = 'ipconfig2'
          GroupId = 'connection'
          MemberName = 'diagnostics'
          PrivateIPAddress = '<IPAddress>'
      }

      $ip3 = @{
          Name = 'ipconfig3'
          GroupId = 'connection'
          MemberName = 'gateway-ring-map'
          PrivateIPAddress = '<IPAddress>'
      }

      $ip4 = @{
          Name = 'ipconfig4'
          GroupId = 'connection'
          MemberName = 'web'
          PrivateIPAddress = '<IPAddress>'
      }

      # Create the private endpoint IP configurations
      $ipConfig1 = New-AzPrivateEndpointIpConfiguration @ip1
      $ipConfig2 = New-AzPrivateEndpointIpConfiguration @ip2
      $ipConfig3 = New-AzPrivateEndpointIpConfiguration @ip3
      $ipConfig4 = New-AzPrivateEndpointIpConfiguration @ip4

      # Create the private endpoint
      $parameters = @{
          Name = '<PrivateEndpointName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = $location
          Subnet = $subnet
          PrivateLinkServiceConnection = $serviceConnection
          IpConfiguration = $ipConfig1, $ipConfig2, $ipConfig3, $ipConfig4
      }

      New-AzPrivateEndpoint @parameters
      ```

   Your output should be similar to the following. Check that the value for **ProvisioningState** is **Succeeded**.

   ```output
   ResourceGroupName Name            Location ProvisioningState Subnet
   ----------------- ----            -------- ----------------- ------
   privatelink       endpoint-hp01   uksouth  Succeeded
   ```

5. You need to [configure DNS for your private endpoint](../private-link/private-endpoint-dns.md) to resolve the DNS name of the private endpoint in the virtual network. The private DNS zone name is `privatelink.wvd.microsoft.com`. For the steps to create and configure the private DNS zone with Azure PowerShell, see [Configure the private DNS zone](../private-link/create-private-endpoint-powershell.md#configure-the-private-dns-zone).

# [Azure CLI](#tab/cli)

Here's how to create a private endpoint for the *connection* sub-resource used for connections to a host pool using the [network](/cli/azure/network) and [desktopvirtualization](/cli/azure/desktopvirtualization) extensions for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Create a Private Link service connection and the private endpoint for a host pool with the connection sub-resource by running the commands in one of the following examples.

   1. To create a private endpoint with a dynamically allocated IP address:
   
      ```azurecli
      # Specify the Azure region. This must be the same region as your virtual network and session hosts.
      location=<Location>
      
      # Get the resource ID of the host pool
      hostPoolId=$(az desktopvirtualization hostpool show \
          --name <HostPoolName> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)
      
      # Create a service connection and the private endpoint
      az network private-endpoint create \
          --name <PrivateEndpointName> \
          --resource-group <ResourceGroupName> \
          --location $location \
          --vnet-name <VNetName> \
          --subnet <SubnetName> \
          --connection-name <ConnectionName> \
          --private-connection-resource-id $hostPoolId \
          --group-id connection \
          --output table
      ```

   1. To create a private endpoint with statically allocated IP addresses:
   
      ```azurecli
      # Specify the Azure region. This must be the same region as your virtual network and session hosts.
      location=<Location>
      
      # Get the resource ID of the host pool
      hostPoolId=$(az desktopvirtualization hostpool show \
          --name <HostPoolName> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)
      
      # Store each private endpoint IP configuration in a variable
      ip1={name:ipconfig1,group-id:connection,member-name:broker,private-ip-address:<IPAddress>}
      ip2={name:ipconfig2,group-id:connection,member-name:diagnostics,private-ip-address:<IPAddress>}
      ip3={name:ipconfig3,group-id:connection,member-name:gateway-ring-map,private-ip-address:<IPAddress>}
      ip4={name:ipconfig4,group-id:connection,member-name:web,private-ip-address:<IPAddress>}
      
      # Create a service connection and the private endpoint
      az network private-endpoint create \
          --name <PrivateEndpointName> \
          --resource-group <ResourceGroupName> \
          --location $location \
          --vnet-name <VNetName> \
          --subnet <SubnetName> \
          --connection-name <ConnectionName> \
          --private-connection-resource-id $hostPoolId \
          --group-id connection \
          --ip-configs [$ip1,$ip2,$ip3,$ip4] \
          --output table
      ```

   Your output should be similar to the following. Check that the value for **ProvisioningState** is **Succeeded**.

   ```output
   CustomNetworkInterfaceName    Location    Name                  ProvisioningState    ResourceGroup
   ----------------------------  ----------  --------------------  -------------------  ---------------
                                 uksouth     endpoint-hp01         Succeeded            privatelink
   ```

3. You need to [configure DNS for your private endpoint](../private-link/private-endpoint-dns.md) to resolve the DNS name of the private endpoint in the virtual network. The private DNS zone name is `privatelink.wvd.microsoft.com`. For the steps to create and configure the private DNS zone with Azure CLI, see [Configure the private DNS zone](../private-link/create-private-endpoint-cli.md#configure-the-private-dns-zone).

---

> [!IMPORTANT]
> You need to create a private endpoint for the connection sub-resource for each host pool you want to use with Private Link.

---

### Feed download

To create a private endpoint for the *feed* sub-resource for a workspace, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select the name of the workspace for which you want to create a *feed* sub-resource.

1. From the workspace overview, select **Networking**, then **Private endpoint connections**, and finally **New private endpoint**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the private endpoint in from the drop-down list. |
   | Resource group | This automatically defaults to the same resource group as your workspace for the private endpoint, but you can also select an alternative existing one from the drop-down list, or create a new one. |
   | Name | Enter a name for the new private endpoint. |
   | Network interface name | The network interface name fills in automatically based on the name you gave the private endpoint, but you can also specify a different name. |
   | Region | This automatically defaults to the same Azure region as the workspace and is where the private endpoint is deployed. This must be the same region as your virtual network. |

   Once you've completed this tab, select **Next: Resource**.

1. On the **Resource** tab, validate the values for *Subscription*, *Resource type*, and *Resource*, then for **Target sub-resource**, select **feed**. Once you've completed this tab, select **Next: Virtual Network**.

1. On the **Virtual Network** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Virtual network | Select the virtual network you want to create the private endpoint in from the drop-down list. |
   | Subnet | Select the subnet of the virtual network you want to create the private endpoint in from the drop-down list. |
   | Network policy for private endpoints | Select **edit** if you want to choose a subnet network policy. For more information, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md). |
   | Private IP configuration | Select **Dynamically allocate IP address** or **Statically allocate IP address**. The address space is from the subnet you selected.<br /><br />If you choose to statically allocate IP addresses, you need to fill in the **Name** and **Private IP** for each listed member. |
   | Application security group | *Optional*: select an existing application security group for the private endpoint from the drop-down list, or create a new one. You can also add one later. |

   Once you've completed this tab, select **Next: DNS**.

1. On the **DNS** tab, choose whether you want to use [Azure Private DNS Zone](../dns/private-dns-privatednszone.md) by selecting **Yes** or **No** for **Integrate with private DNS zone**. If you select **Yes**, select the subscription and resource group in which to create the private DNS zone `privatelink.wvd.microsoft.com`. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any [name/value pairs](../azure-resource-manager/management/tag-resources.md) you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the private endpoint for the feed sub-resource.


# [Azure PowerShell](#tab/powershell)

1. In the same PowerShell session, create a Private Link service connection for a workspace with the feed sub-resource by running the following commands. In these examples, the same virtual network and subnet are used.

   ```azurepowershell
   # Get the resource ID of the workspace
   $workspaceId = (Get-AzWvdWorkspace -Name <WorkspaceName> -ResourceGroupName <ResourceGroupName>).Id

   # Create the service connection
   $parameters = @{
       Name = '<ServiceConnectionName>'
       PrivateLinkServiceId = $workspaceId
       GroupId = 'feed'
   }

   $serviceConnection = New-AzPrivateLinkServiceConnection @parameters
   ```

1. Finally, create the private endpoint by running the commands in one of the following examples.

   1. To create a private endpoint with a dynamically allocated IP address:
   
      ```azurepowershell
      # Specify the Azure region. This must be the same region as your virtual network.
      $location = '<Location>'
   
      # Create the private endpoint
      $parameters = @{
          Name = '<PrivateEndpointName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = $location
          Subnet = $subnet
          PrivateLinkServiceConnection = $serviceConnection
      }
   
      New-AzPrivateEndpoint @parameters
      ```

   1. To create a private endpoint with a statically allocated IP address:
   
      ```azurepowershell
      # Specify the Azure region. This must be the same region as your virtual network.
      $location = '<Location>'

      # Create a hash table for each private endpoint IP configuration
      $ip1 = @{
          Name = 'ipconfig1'
          GroupId = 'feed'
          MemberName = 'web-r1'
          PrivateIPAddress = '<IPAddress>'
      }

      $ip2 = @{
          Name = 'ipconfig2'
          GroupId = 'feed'
          MemberName = 'web-r0'
          PrivateIPAddress = '<IPAddress>'
      }

      # Create the private endpoint IP configurations
      $ipConfig1 = New-AzPrivateEndpointIpConfiguration @ip1
      $ipConfig2 = New-AzPrivateEndpointIpConfiguration @ip2
      
      # Create the private endpoint
      $parameters = @{
          Name = '<PrivateEndpointName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = $location
          Subnet = $subnet
          PrivateLinkServiceConnection = $serviceConnection
          IpConfiguration = $ipConfig1, $ipConfig2
      }
   
      New-AzPrivateEndpoint @parameters
      ```

   Your output should be similar to the following. Check that the value for **ProvisioningState** is **Succeeded**.

   ```output
   ResourceGroupName Name            Location ProvisioningState Subnet
   ----------------- ----            -------- ----------------- ------
   privatelink       endpoint-ws01   uksouth  Succeeded
   ```

1. You need to [configure DNS for your private endpoint](../private-link/private-endpoint-dns.md) to resolve the DNS name of the private endpoint in the virtual network. The private DNS zone name is `privatelink.wvd.microsoft.com`. For the steps to create and configure the private DNS zone with Azure PowerShell, see [Configure the private DNS zone](../private-link/create-private-endpoint-powershell.md#configure-the-private-dns-zone).

# [Azure CLI](#tab/cli)

1. In the same CLI session, create a Private Link service connection and the private endpoint for a workspace with the feed sub-resource by running the following commands.

   1. To create a private endpoint with a dynamically allocated IP address:
   
      ```azurecli
      # Specify the Azure region. This must be the same region as your virtual network.
      location=<Location>
      
      # Get the resource ID of the workspace
      workspaceId=$(az desktopvirtualization workspace show \
          --name <WorkspaceName> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)
      
      # Create a service connection and the private endpoint
      az network private-endpoint create \
          --name <PrivateEndpointName> \
          --resource-group <ResourceGroupName> \
          --location $location \
          --vnet-name <VNetName> \
          --subnet <SubnetName> \
          --connection-name <ConnectionName> \
          --private-connection-resource-id $workspaceId \
          --group-id feed \
          --output table
      ```

   1. To create a private endpoint with statically allocated IP addresses:
   
      ```azurecli
      # Specify the Azure region. This must be the same region as your virtual network.
      location=<Location>
      
      # Get the resource ID of the workspace
      workspaceId=$(az desktopvirtualization workspace show \
          --name <WorkspaceName> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)
      
      # Store each private endpoint IP configuration in a variable
      ip1={name:ipconfig1,group-id:feed,member-name:web-r1,private-ip-address:<IPAddress>}
      ip2={name:ipconfig2,group-id:feed,member-name:web-r0,private-ip-address:<IPAddress>}
      
      # Create a service connection and the private endpoint
      az network private-endpoint create \
          --name <PrivateEndpointName> \
          --resource-group <ResourceGroupName> \
          --location $location \
          --vnet-name <VNetName> \
          --subnet <SubnetName> \
          --connection-name <ConnectionName> \
          --private-connection-resource-id $workspaceId \
          --group-id feed \
          --ip-configs [$ip1,$ip2] \
          --output table
      ```

   Your output should be similar to the following. Check that the value for **ProvisioningState** is **Succeeded**.

   ```output
   CustomNetworkInterfaceName    Location    Name                  ProvisioningState    ResourceGroup
   ----------------------------  ----------  --------------------  -------------------  ---------------
                                 uksouth     endpoint-ws01         Succeeded            privatelink
   ```

1. You need to [configure DNS for your private endpoint](../private-link/private-endpoint-dns.md) to resolve the DNS name of the private endpoint in the virtual network. The private DNS zone name is `privatelink.wvd.microsoft.com`. For the steps to create and configure the private DNS zone with Azure CLI, see [Configure the private DNS zone](../private-link/create-private-endpoint-cli.md#configure-the-private-dns-zone).

---

> [!IMPORTANT]
> You need to a create private endpoint for the feed sub-resource for each workspace you want to use with Private Link.

### Initial feed discovery

To create a private endpoint for the *global* sub-resource used for the initial feed discovery, select the relevant tab for your scenario and follow the steps.

> [!IMPORTANT]
> - Only create one private endpoint for the *global* sub-resource for all your Azure Virtual Desktop deployments.
> 
> - A private endpoint to the global sub-resource of any workspace controls the shared fully qualified domain name (FQDN) for initial feed discovery. This in turn enables feed discovery for all workspaces. Because the workspace connected to the private endpoint is so important, deleting it will cause all feed discovery processes to stop working. We recommend you create an unused placeholder workspace for the global sub-resource.

# [Portal](#tab/portal)

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select the name of a workspace you want to use for the global sub-resource.

   1. *Optional*: Instead, create a placeholder workspace to terminate the global endpoint by following the instructions to [Create a workspace](create-application-group-workspace.md?tabs=portal#create-a-workspace).

1. From the workspace overview, select **Networking**, then **Private endpoint connections**, and finally **New private endpoint**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the private endpoint in from the drop-down list. |
   | Resource group | This automatically defaults to the same resource group as your workspace for the private endpoint, but you can also select an alternative existing one from the drop-down list, or create a new one. |
   | Name | Enter a name for the new private endpoint. |
   | Network interface name | The network interface name fills in automatically based on the name you gave the private endpoint, but you can also specify a different name. |
   | Region | This automatically defaults to the same Azure region as the workspace and is where the private endpoint will be deployed. This must be the same region as your virtual network. |

   Once you've completed this tab, select **Next: Resource**.

1. On the **Resource** tab, validate the values for *Subscription*, *Resource type*, and *Resource*, then for **Target sub-resource**, select **global**. Once you've completed this tab, select **Next: Virtual Network**.

1. On the **Virtual Network** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Virtual network | Select the virtual network you want to create the private endpoint in from the drop-down list. |
   | Subnet | Select the subnet of the virtual network you want to create the private endpoint in from the drop-down list. |
   | Network policy for private endpoints | Select **edit** if you want to choose a subnet network policy. For more information, see [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md). |
   | Private IP configuration | Select **Dynamically allocate IP address** or **Statically allocate IP address**. The address space is from the subnet you selected.<br /><br />If you choose to statically allocate IP addresses, you need to fill in the **Name** and **Private IP** for each listed member. |
   | Application security group | *Optional*: select an existing application security group for the private endpoint from the drop-down list, or create a new one. You can also add one later. |

   Once you've completed this tab, select **Next: DNS**.

1. On the **DNS** tab, choose whether you want to use [Azure Private DNS Zone](../dns/private-dns-privatednszone.md) by selecting **Yes** or **No** for **Integrate with private DNS zone**. If you select **Yes**, select the subscription and resource group in which to create the private DNS zone `privatelink-global.wvd.microsoft.com`. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any [name/value pairs](../azure-resource-manager/management/tag-resources.md) you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the private endpoint for the global sub-resource.


# [Azure PowerShell](#tab/powershell)

1. *Optional*: Create a placeholder workspace to terminate the global endpoint by following the instructions to [Create a workspace](create-application-group-workspace.md?tabs=powershell#create-a-workspace).

1. In the same PowerShell session, create a Private Link service connection for the workspace with the global sub-resource by running the following commands. In these examples, the same virtual network and subnet are used.

   ```azurepowershell
   # Get the resource ID of the workspace
   $workspaceId = (Get-AzWvdWorkspace -Name <WorkspaceName> -ResourceGroupName <ResourceGroupName>).Id

   # Create the service connection
   $parameters = @{
       Name = '<ServiceConnectionName>'
       PrivateLinkServiceId = $workspaceId
       GroupId = 'global'
   }

   $serviceConnection = New-AzPrivateLinkServiceConnection @parameters
   ```

1. Finally, create the private endpoint by running the commands in one of the following examples.

   1. To create a private endpoint with a dynamically allocated IP address:
   
      ```azurepowershell
      # Specify the Azure region. This must be the same region as your virtual network.
      $location = '<Location>'
   
      # Create the private endpoint
      $parameters = @{
          Name = '<PrivateEndpointName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = $location
          Subnet = $subnet
          PrivateLinkServiceConnection = $serviceConnection
      }
   
      New-AzPrivateEndpoint @parameters
      ```

   1. To create a private endpoint with a statically allocated IP address:
   
      ```azurepowershell
      # Specify the Azure region. This must be the same region as your virtual network.
      $location = '<Location>'
   
      $ip = @{
          Name = '<IPConfigName>'
          GroupId = 'global'
          MemberName = 'web'
          PrivateIPAddress = '<IPAddress>'
      }

      $ipConfig = New-AzPrivateEndpointIpConfiguration @ip
      
      # Create the private endpoint
      $parameters = @{
          Name = '<PrivateEndpointName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = $location
          Subnet = $subnet
          PrivateLinkServiceConnection = $serviceConnection
          IpConfiguration = $ipconfig
      }
   
      New-AzPrivateEndpoint @parameters
      ```

   Your output should be similar to the following. Check that the value for **ProvisioningState** is **Succeeded**.

   ```output
   ResourceGroupName Name            Location ProvisioningState Subnet
   ----------------- ----            -------- ----------------- ------
   privatelink       endpoint-global uksouth  Succeeded
   ```

1. You need to [configure DNS for your private endpoint](../private-link/private-endpoint-dns.md) to resolve the DNS name of the private endpoint in the virtual network. The private DNS zone name is `privatelink-global.wvd.microsoft.com`. For the steps to create and configure the private DNS zone with Azure PowerShell, see [Configure the private DNS zone](../private-link/create-private-endpoint-powershell.md#configure-the-private-dns-zone).

# [Azure CLI](#tab/cli)

1. *Optional*: Create a placeholder workspace to terminate the global endpoint by following the instructions to [Create a workspace](create-application-group-workspace.md?tabs=cli#create-a-workspace).

1. In the same CLI session, create a Private Link service connection and the private endpoint for the workspace with the global sub-resource by running the following commands:

   1. To create a private endpoint with a dynamically allocated IP address:
   
      ```azurecli
      # Specify the Azure region. This must be the same region as your virtual network.
      location=<Location>
      
      # Get the resource ID of the workspace
      workspaceId=$(az desktopvirtualization workspace show \
          --name <WorkspaceName> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)
      
      # Create a service connection and the private endpoint
      az network private-endpoint create \
          --name <PrivateEndpointName> \
          --resource-group <ResourceGroupName> \
          --location $location \
          --vnet-name <VNetName> \
          --subnet <SubnetName> \
          --connection-name <ConnectionName> \
          --private-connection-resource-id $workspaceId \
          --group-id global \
          --output table
      ```

   1. To create a private endpoint with statically allocated IP addresses:
   
      ```azurecli
      # Specify the Azure region. This must be the same region as your virtual network.
      location=<Location>
      
      # Get the resource ID of the workspace
      workspaceId=$(az desktopvirtualization workspace show \
          --name <WorkspaceName> \
          --resource-group <ResourceGroupName> \
          --query [id] \
          --output tsv)
      
      # Store each private endpoint IP configuration in a variable
      ip={name:ipconfig,group-id:global,member-name:web,private-ip-address:<IPAddress>}
      
      # Create a service connection and the private endpoint
      az network private-endpoint create \
          --name <PrivateEndpointName> \
          --resource-group <ResourceGroupName> \
          --location $location \
          --vnet-name <VNetName> \
          --subnet <SubnetName> \
          --connection-name <ConnectionName> \
          --private-connection-resource-id $workspaceId \
          --group-id global \
          --ip-config $ip \
          --output table
      ```

   Your output should be similar to the following. Check that the value for **ProvisioningState** is **Succeeded**.

   ```output
   CustomNetworkInterfaceName    Location    Name                  ProvisioningState    ResourceGroup
   ----------------------------  ----------  --------------------  -------------------  ---------------
                                 uksouth     endpoint-global       Succeeded            privatelink
   ```

1. You need to [configure DNS for your private endpoint](../private-link/private-endpoint-dns.md) to resolve the DNS name of the private endpoint in the virtual network. The private DNS zone name is `privatelink-global.wvd.microsoft.com`. For the steps to create and configure the private DNS zone with Azure CLI, see [Configure the private DNS zone](../private-link/create-private-endpoint-cli.md#configure-the-private-dns-zone).

---

## Closing public routes

Once you've created private endpoints, you can also control if traffic is allowed to come from public routes. You can control this at a granular level using Azure Virtual Desktop, or more broadly using a [network security group](../virtual-network/network-security-groups-overview.md) (NSG) or [Azure Firewall](../firewall/protect-azure-virtual-desktop.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&bc=%2Fazure%2Fvirtual-desktop%2Fbreadcrumb%2Ftoc.json).

### Control routes with Azure Virtual Desktop

With Azure Virtual Desktop, you can independently control public traffic for workspaces and host pools. Select the relevant tab for your scenario and follow the steps. You can't configure this in Azure CLI. You need to repeat these steps for each workspace and host pool you use with Private Link.

# [Portal](#tab/portal-2)

#### Workspaces

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select the name of the workspace to control public traffic.

1. From the host pool overview, select **Networking**, then select the **Public access** tab.

1. Select one of the following options:

   | Setting | Description |
   |--|--|
   | **Enable public access from all networks** | End users can access the feed over the public internet or the private endpoints. |
   | **Disable public access and use private access** | End users can only access the feed over the private endpoints. |

1. Select **Save**.

#### Host pools

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool to control public traffic.

1. From the host pool overview, select **Networking**, then select the **Public access** tab.

1. Select one of the following options:

   | Setting | Description |
   |--|--|
   | **Enable public access from all networks** | End users can access the feed and session hosts securely over the public internet or the private endpoints. |
   | **Enable public access for end users, use private access for session hosts** | End users can access the feed securely over the public internet but must use private endpoints to access session hosts. |
   | **Disable public access and use private access** | End users can only access the feed and session hosts over the private endpoints. |

1. Select **Save**.

# [Azure PowerShell](#tab/powershell-2)

> [!IMPORTANT]
> Azure PowerShell cmdlets for Azure Virtual Desktop that support Private Link are in preview. You'll need to download and install the [preview version of the Az.DesktopVirtualization module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/5.0.0-preview) to use these cmdlets, which have been added in version 5.0.0.

#### Workspaces

1. In the same PowerShell session, you can disable public access and use private access by running the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<WorkspaceName>'
       ResourceGroupName = '<ResourceGroupName>'
       PublicNetworkAccess = 'Disabled'
   }
   
   Update-AzWvdWorkspace @parameters
   ```

1. To enable public access from all networks, run the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<WorkspaceName>'
       ResourceGroupName = '<ResourceGroupName>'
       PublicNetworkAccess = 'Enabled'
   }
   
   Update-AzWvdWorkspace @parameters
   ```

#### Host pools

1. In the same PowerShell session, you can disable public access and use private access by running the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       PublicNetworkAccess = 'Disabled'
   }

   Update-AzWvdHostPool @parameters 
   ```

1. To enable public access from all networks, run the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       PublicNetworkAccess = 'Enabled'
   }
   
   Update-AzWvdHostPool @parameters
   ```

1. To use public access for end users, but use private access for session hosts, run the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       PublicNetworkAccess = 'EnabledForSessionHostsOnly'
   }
   
   Update-AzWvdHostPool @parameters
   ```

1. To use private access for end users, but use public access for session hosts, run the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       PublicNetworkAccess = 'EnabledForClientsOnly'
   }
   
   Update-AzWvdHostPool @parameters
   ```

---

> [!IMPORTANT]
> Changing access for session hosts won't affect existing sessions. After you've changed a private endpoint to a host pool, you must restart the *Remote Desktop Agent Loader* (*RDAgentBootLoader*) service on each session host in the host pool. You also need to restart this service whenever you change a host pool's network configuration. Instead of restarting the service, you can restart each session host.

### Block public routes with network security groups or Azure Firewall

If you're using [network security groups](../virtual-network/network-security-groups-overview.md) or [Azure Firewall](../firewall/overview.md) to control connections from user client devices or your session hosts to the private endpoints, you can use the **WindowsVirtualDesktop** service tag to block traffic from the public internet. If you block public internet traffic using this service tag, all service traffic uses private routes only.

> [!CAUTION]
> - Make sure you don't block traffic between your private endpoints and the addresses in the [required URL list](safe-url-list.md).
>
> - Don't block certain ports from either the user client devices or your session hosts to the private endpoint for a host pool resource using the *connection* sub-resource. The entire TCP dynamic port range of *1 - 65535* to the private endpoint is needed because port mapping is used to all global gateways through the single private endpoint IP address corresponding to the *connection* sub-resource. If you restrict ports to the private endpoint, your users may not be able to connect successfully to Azure Virtual Desktop. 

## Validate Private Link with Azure Virtual Desktop

Once you've closed public routes, you should validate that Private Link with Azure Virtual Desktop is working. You can do this by checking the connection state of each private endpoint, the status of your session hosts, and testing your users can refresh and connect to their remote resources.

### Check the connection state of each private endpoint

To check the connection state of each private endpoint, select the relevant tab for your scenario and follow the steps. You should repeat these steps for each workspace and host pool you use with Private Link.

# [Portal](#tab/portal)

#### Workspaces

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select the name of the workspace for which you want to check the connection state.

1. From the workspace overview, select **Networking**, then **Private endpoint connections**.

1. For the private endpoint listed, check the **Connection state** is **Approved**.

#### Host pools

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool for which you want to check the connection state.

1. From the host pool overview, select **Networking**, then **Private endpoint connections**.

1. For the private endpoint listed, check the **Connection state** is **Approved**.


# [Azure PowerShell](#tab/powershell)

> [!IMPORTANT]
> You need to use the preview version of the Az.DesktopVirtualization module to run the following commands. For more information and to download and install the preview module, see [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/5.0.0-preview).

#### Workspaces

1. In the same PowerShell session, run the following commands to check the connection state of a workspace:

   ```azurepowershell
   (Get-AzWvdWorkspace -Name <WorkspaceName> -ResourceGroupName <ResourceGroupName).PrivateEndpointConnection | FL Name, PrivateLinkServiceConnectionStateStatus, PrivateLinkServiceConnectionStateDescription, PrivateLinkServiceConnectionStateActionsRequired
   ```

   Your output should be similar to the following. Check that the value for **PrivateLinkServiceConnectionStateStatus** is **Approved**.

   ```output
   Name                                             : endpoint-ws01
   PrivateLinkServiceConnectionStateStatus          : Approved
   PrivateLinkServiceConnectionStateDescription     : Auto-approved
   PrivateLinkServiceConnectionStateActionsRequired : None
   ```

#### Host pools

1. In the same PowerShell session, run the following commands to check the connection state of a host pool:

   ```azurepowershell
   (Get-AzWvdHostPool -Name <HostPoolName> -ResourceGroupName <ResourceGroupName).PrivateEndpointConnection | FL Name, PrivateLinkServiceConnectionStateStatus, PrivateLinkServiceConnectionStateDescription, PrivateLinkServiceConnectionStateActionsRequired
   ```

   Your output should be similar to the following. Check that the value for **PrivateLinkServiceConnectionStateStatus** is **Approved**.

   ```output
   Name                                             : endpoint-hp01
   PrivateLinkServiceConnectionStateStatus          : Approved
   PrivateLinkServiceConnectionStateDescription     : Auto-approved
   PrivateLinkServiceConnectionStateActionsRequired : None

# [Azure CLI](#tab/cli)

1. In the same CLI session, run the following commands to check the connection state of a workspace or a host pool:

   ```azurecli
   az network private-endpoint show \
       --name <PrivateEndpointName> \
       --resource-group <ResourceGroupName> \
       --query "{name:name, privateLinkServiceConnectionStates:privateLinkServiceConnections[].privateLinkServiceConnectionState}"
   ```

   Your output should be similar to the following. Check that the value for **status** is **Approved**.

   ```output
   {
     "name": "endpoint-ws01",
     "privateLinkServiceConnectionStates": [
       {
         "actionsRequired": "None",
         "description": "Auto-approved",
         "status": "Approved"
       }
     ]
   }
   ```

---

### Check the status of your session hosts

1. Check the status of your session hosts in Azure Virtual Desktop.
   
   1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool.
   
   1. In the **Manage** section, select **Session hosts**.
   
   1. Review the list of session hosts and check their status is **Available**.

### Check your users can connect

To test that your users can connect to their remote resources:

1. Use the Remote Desktop client and make sure you can [subscribe to and refresh workspaces](users/remote-desktop-clients-overview.md).

1. Finally, make sure your users can connect to a remote session.

## Next steps

- Learn more about how Private Link for Azure Virtual Desktop at [Use Private Link with Azure Virtual Desktop](private-link-overview.md).

- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).

- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).

- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md).

- See the [Required URL list](safe-url-list.md) for the list of URLs you need to unblock to ensure network access to the Azure Virtual Desktop service.
