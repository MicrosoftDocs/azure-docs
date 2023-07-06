---
title: Set up Private Link with Azure Virtual Desktop (preview) - Azure
description: Learn how to set up Private Link with Azure Virtual Desktop (preview) to privately connect to your remote resources.
author: dknappettmsft
ms.topic: how-to
ms.date: 07/04/2023
ms.author: daknappe
---
TODO: REMOVE PREVIEW
# Set up Private Link with Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Using Private Link with Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article shows you how to set up Private Link with Azure Virtual Desktop (preview) to privately connect to your remote resources. For more information about using Private Link with Azure Virtual Desktop, including limitations with the preview version, see [Azure Private Link with Azure Virtual Desktop (preview)](private-link-overview.md).

## Prerequisites

In order to use Private Link with Azure Virtual Desktop, you need the following things:

- An existing [host pool](create-host-pool.md) with [session hosts](add-session-hosts-host-pool.md), [application group, and workspace](create-application-group-workspace.md).

- An existing [virtual network](../virtual-network/manage-virtual-network.md) and [subnet](../virtual-network/virtual-network-manage-subnet.md) you want to use for private endpoints.

- The [required Azure role-based access control permissions to create private endpoints](../private-link/rbac-permissions.md).

- If you're using the [Remote Desktop client for Windows](./users/connect-windows.md), you must use version 1.2.4066 or later to connect using a private endpoint.

- If you want to use Azure CLI or Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [desktopvirtualization](/cli/azure/desktopvirtualization) Azure CLI extension or the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

## Enable the preview

To use the preview of Private Link with Azure Virtual Desktop, you need to re-register the *Microsoft.DesktopVirtualization* resource provider and register the *Azure Virtual Desktop Private Link Public Preview* preview feature on your Azure subscription.

### Re-register the resource provider

To re-register the *Microsoft.DesktopVirtualization* resource provider:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter **Subscriptions** and select the matching service entry.

1. Select the name of your subscription, then in the section **Settings**, select **Resource providers**.

1. Search for and select **Microsoft.DesktopVirtualization**, then select **Re-register**.

1. Verify that the status of *Microsoft.DesktopVirtualization* is **Registered**.

You need to do these steps for each subscription you want to use with the preview.

### Register the preview feature

To register the *Azure Virtual Desktop Private Link Public Preview* preview feature:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter **Subscriptions** and select the matching service entry.

1. Select the name of your subscription, then in the **Settings** section, select **Preview features**.

1. Select the drop-down list for the filter **Type** and set it to **Microsoft.DesktopVirtualization**.

1. Select **Azure Virtual Desktop Private Link Public Preview**, then select **Register**.

You need to do these steps for each subscription you want to use with the preview.

## Create private endpoints

During the setup process, you create private endpoints to the following resources:

| Purpose | Resource type | Target sub-resource | Quantity | Private DNS zone name |
|--|--|--|--|--|
| Initial feed discovery | Microsoft.DesktopVirtualization/workspaces | global | One for all your Azure Virtual Desktop deployments | `privatelink-global.wvd.microsoft.com` |
| Feed download | Microsoft.DesktopVirtualization/workspaces | feed | One per workspace | `privatelink.wvd.microsoft.com` |
| Connections to host pools | Microsoft.DesktopVirtualization/hostpools | connection | One per host pool | `privatelink.wvd.microsoft.com` |

> [!IMPORTANT]
> You must create a private endpoint for each type of sub-resource.

### Initial feed discovery

To create a private endpoint for the *global* sub-resource used for the initial feed discovery, select the relevant tab for your scenario and follow the steps.

> [!IMPORTANT]
> A private endpoint to the global sub-resource of any workspace controls the shared fully qualified domain name (FQDN) for initial feed discovery. This in turn enables feed discovery for all workspaces. Because the workspace connected to the private endpoint is so important, deleting it will cause all feed discovery processes to stop working. We recommend you create an unused placeholder workspace for the global sub-resource.

# [Portal](#tab/portal)

Here's how to create a private endpoint for the *global* sub-resource used for the initial feed discovery using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Workspaces**.

   1. *Optional*: Create a placeholder workspace to terminate the global endpoint by following the instructions to [Create a workspace](create-application-group-workspace.md?tabs=portal#create-a-workspace).

1. Select the name of the workspace you want to use for the global sub-resource.

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
   | Application security group | Select an existing application security group for the private endpoint from the drop-down list, or create a new one. |

   Once you've completed this tab, select **Next: DNS**.

1. On the **DNS** tab, choose whether you want to use [Azure Private DNS Zone](../dns/private-dns-privatednszone.md) by selecting **Yes** or **No** for **Integrate with private DNS zone**. If you select **Yes**, select the subscription and resource group in which to create the private DNS zone `privatelink-global.wvd.microsoft.com`. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the private endpoint for the global sub-resource.

# [Azure CLI](#tab/cli)

Here's how to create a private endpoint for the *global* sub-resource used for the initial feed discovery using the [network](/cli/azure/network) extension for Azure CLI.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Get the details of the virtual network and subnet you want to use for the private endpoint and store them in a variable by running the following commands:

   ```azurecli
   # Get the subnet details for the virtual network
   subnet=$(az network vnet subnet show --vnet-name <VNetName> --name <SubnetName> --resource-group <ResourceGroupName>)
   ```

3. *Optional*: Create a placeholder workspace to terminate the global endpoint by following the instructions to [Create a workspace](create-application-group-workspace.md?tabs=cli#create-a-workspace).

4. Create a Private Link service connection for the workspace with the global sub-resource by running the following commands:

   ```azurepowershell
   # Get the details of the workspace
   workspaceId=$(az desktopvirtualization workspace show --name <WorkspaceName> --resource-group <ResourceGroupName> --query [id] --output tsv)

   # Create the service connection
   TODO: 
   ```

5. TODO:

# [Azure PowerShell](#tab/powershell)

Here's how to create a private endpoint for the *global* sub-resource used for the initial feed discovery using the [Az.Network](/powershell/module/az.network/) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Get the details of the virtual network and subnet you want to use for the private endpoint and store them in a variable by running the following commands:

   ```azurepowershell
   # Get the virtual network details
   $vnet = Get-AzVirtualNetwork -Name <VNetName> -ResourceGroupName <ResourceGroupName>

   # Get the subnet details
   $subnet = ($vnet).Subnets | ? Name -eq <SubnetName>
   ```

3. *Optional*: Create a placeholder workspace to terminate the global endpoint by following the instructions to [Create a workspace](create-application-group-workspace.md?tabs=powershell#create-a-workspace).

4. Create a Private Link service connection for the workspace with the global sub-resource by running the following commands:

   ```azurepowershell
   # Get the details of the workspace
   $workspaceId = (Get-AzWvdWorkspace -Name <WorkspaceName> -ResourceGroupName <ResourceGroupName>).Id

   # Create the service connection
   $parameters = @{
       Name = '<ServiceConnectionName>'
       PrivateLinkServiceId = $workspaceId
       GroupId = 'global'
   }

   $serviceConnection = New-AzPrivateLinkServiceConnection @parameters
   ```

5. Finally, create the private endpoint by running the following commands in one of the following examples.

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

   Your output should be similar to the following. Check that **ProvisioningState** is **Succeeded**.

   ```output
   ResourceGroupName Name            Location ProvisioningState Subnet
   ----------------- ----            -------- ----------------- ------
   privatelink       endpoint-global uksouth  Succeeded
   ```

---

### Feed download

To create a private endpoint for the *feed* sub-resource for a workspace, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

1. Return to the list of workspaces, then select the name of a workspace you want to create a feed sub-resource for.

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
   | Application security group | Select an existing application security group for the private endpoint from the drop-down list, or create a new one. |

   Once you've completed this tab, select **Next: DNS**.

1. On the **DNS** tab, choose whether you want to use [Azure Private DNS Zone](../dns/private-dns-privatednszone.md) by selecting **Yes** or **No** for **Integrate with private DNS zone**. If you select **Yes**, select the subscription and resource group in which to create the private DNS zone `privatelink.wvd.microsoft.com`. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the private endpoint for the feed sub-resource.

# [Azure CLI](#tab/cli)

TODO: ADD

# [Azure PowerShell](#tab/powershell)

Here's how to create a private endpoint for the *feed* sub-resource used for the feed download.

1. In the same PowerShell session, create a Private Link service connection for a workspace with the feed sub-resource by running the following commands. In these example the same virtual network and subnet are used.

   ```azurepowershell
   # Get the details of the workspace
   $workspaceId = (Get-AzWvdWorkspace -Name <WorkspaceName> -ResourceGroupName <ResourceGroupName>).Id

   # Create the service connection
   $parameters = @{
       Name = '<ServiceConnectionName>'
       PrivateLinkServiceId = $workspaceId
       GroupId = 'feed'
   }

   $serviceConnection = New-AzPrivateLinkServiceConnection @parameters
   ```

1. Finally, create the private endpoint by running the following commands in one of the following examples.

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

   Your output should be similar to the following. Check that **ProvisioningState** is **Succeeded**.

   ```output
   ResourceGroupName Name            Location ProvisioningState Subnet
   ----------------- ----            -------- ----------------- ------
   privatelink       endpoint-ws01   uksouth  Succeeded
   ```

---

> [!IMPORTANT]
> You need to create private endpoint for the feed sub-resource for each workspace you want to use with the Private Link.

### Connections to host pools

To create a private endpoint for the *connection* sub-resource for connections to a host pool, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool you want to create a *connection* sub-resource for.

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
   | Application security group | *Optional*: select an existing application security group for the private endpoint from the drop-down list, or create a new one. |

   Once you've completed this tab, select **Next: DNS**.

1. On the **DNS** tab, choose whether you want to use [Azure Private DNS Zone](../dns/private-dns-privatednszone.md) by selecting **Yes** or **No** for **Integrate with private DNS zone**. If you select **Yes**, select the subscription and resource group in which to create the private DNS zone `privatelink.wvd.microsoft.com`. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

   Once you've completed this tab, select **Next: Tags**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Next: Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment.

1. Select **Create** to create the private endpoint for the connection sub-resource.

# [Azure CLI](#tab/cli)

TODO: ADD

# [Azure PowerShell](#tab/powershell)

Here's how to create a private endpoint for the *connection* sub-resource used for the feed download.

1. In the same PowerShell session, create a Private Link service connection for a host pool with the connection sub-resource by running the following commands. In these example the same virtual network and subnet are used.

   ```azurepowershell
   # Get the details of the host pool
   $hostPoolId = (Get-AzWvdHostPool -Name <HostPoolName> -ResourceGroupName <ResourceGroupName>).Id

   # Create the service connection
   $parameters = @{
       Name = '<ServiceConnectionName>'
       PrivateLinkServiceId = $hostPoolId
       GroupId = 'connection'
   }

   $serviceConnection = New-AzPrivateLinkServiceConnection @parameters
   ```

1. Finally, create the private endpoint by running the following commands in one of the following examples.

   1. To create a private endpoint with a dynamically allocated IP addresses:
   
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

   Your output should be similar to the following. Check that **ProvisioningState** is **Succeeded**.

   ```output
   ResourceGroupName Name            Location ProvisioningState Subnet
   ----------------- ----            -------- ----------------- ------
   privatelink       endpoint-hp01   uksouth  Succeeded
   ```

---

> [!IMPORTANT]
> You need to create private endpoint for the connection sub-resource for each host pool you want to use with the Private Link.

---

## Closing public routes

Once you've created private endpoints, you can also control if traffic is allowed to come from public routes. You can control this at a granular level using Azure Virtual Desktop, or more broadly using a [network security group](../virtual-network/network-security-groups-overview.md) (NSG) or [Azure Firewall](../firewall/protect-azure-virtual-desktop.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&bc=%2Fazure%2Fvirtual-desktop%2Fbreadcrumb%2Ftoc.json).

### Control routes with Azure Virtual Desktop

With Azure Virtual Desktop, you can independently control public traffic for workspaces and host pools. Select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

#### Workspaces

1. From the Azure Virtual Desktop overview, select **Workspaces**, then select the name of the workspace to control public traffic.

1. From the workspace overview, select **Networking**, then **Private endpoint connections**, and finally **Firewall and virtual networks**.

1. Configure **Allow end user access from public network**:

   - **Checked**: end users can access the feed over the public internet or the private endpoints.

   - **Unchecked**: end users can only access the feed over the private endpoints.

1. Select **Save**.

#### Host pools

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool to control public traffic.

1. From the host pool overview, select **Networking**, then **Private endpoint connections**, and finally **Firewall and virtual networks**.

1. Configure **Allow end users access from public network**:

   - **Checked**: end users can connect to the host pool over the public internet or the private endpoints.

   - **Unchecked**: end users can only access the feed over the private endpoints.

1. Configure **Allow session hosts access from public network**:

   - **Checked**: session hosts can connect to the host pool over the public internet or the private endpoints.

   - **Unchecked**: session hosts can only access the feed over the private endpoints.

1. Select **Save**.

> [!IMPORTANT]
> Unchecking the **Allow session host access from public network** setting won't affect existing sessions. You must restart the session host virtual machines for the change to take effect.

# [Azure CLI](#tab/cli)

TODO: IS THERE A WAY TO DO THIS IN CLI?

# [Azure PowerShell](#tab/powershell)

TODO: IS THERE A WAY TO DO THIS IN POWERSHELL?

---

### Block public routes with network security groups or Azure Firewall

If you're using network security groups or Azure Firewall to control connections from user client devices or your session hosts to the private endpoints, you can use the **WindowsVirtualDesktop** service tag to block traffic from the public internet. If you block public internet traffic using this service tag, all service traffic uses private routes only.

> [!CAUTION]
> - Make sure you don't block traffic between your private endpoints and the addresses in the [required URL list](safe-url-list.md).
>
> - Don't block certain ports from either the user client devices or your session hosts to the private endpoint for a host pool resource using the *connection* sub-resource. The entire TCP dynamic port range of *1 - *65535* to the private endpoint is needed because port mapping is used to all global gateways through the single private endpoint IP address corresponding to the *connection* sub-resource. If you restrict ports to the private endpoint, your users may not be able to connect successfully to Azure Virtual Desktop. 

## Validate Private Link with Azure Virtual Desktop

To validate that Private Link with Azure Virtual Desktop is working once you've closed public routes:

TODO: ADD IN CHECK PRIVATE LINK CONNECTION STATES

1. Check the status of your session hosts in Azure Virtual Desktop.
   
   1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool.
   
   1. In the **Manage** section, select **Session hosts**.
   
   1. Review the list of session hosts and check their status is **Available**.

1. Next, test your feed connections to make sure they perform as expected. Use the Remote Desktop client and make sure you can [subscribe to and and refresh workspaces](users/remote-desktop-clients-overview.md).

1. Finally, make sure your users can connect to a remote session over the private endpoints and not from public routes.

## Next steps

- Learn more about how Private Link for Azure Virtual Desktop at [Use Private Link with Azure Virtual Desktop](private-link-overview.md).

- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).

- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).

- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md).

- See the [Required URL list](safe-url-list.md) for the list of URLs you need to unblock to ensure network access to the Azure Virtual Desktop service.
