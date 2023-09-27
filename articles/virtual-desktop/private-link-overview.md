---
title:  Azure Private Link with Azure Virtual Desktop - Azure
description: Learn about using Private Link with Azure Virtual Desktop to privately connect to your remote resources.
author: dknappettmsft
ms.topic: conceptual
ms.date: 07/17/2023
ms.author: daknappe
---

# Azure Private Link with Azure Virtual Desktop

You can use [Azure Private Link](../private-link/private-link-overview.md) with Azure Virtual Desktop to privately connect to your remote resources. By creating a [private endpoint](../private-link/private-endpoint-overview.md), traffic between your virtual network and the service remains on the Microsoft network, so you no longer need to expose your service to the public internet. You also use a VPN or ExpressRoute for your users with the Remote Desktop client to connect to the virtual network. Keeping traffic within the Microsoft network improves security and keeps your data safe. This article describes how Private Link can help you secure your Azure Virtual Desktop environment.

## How does Private Link work with Azure Virtual Desktop?

Azure Virtual Desktop has three workflows with three corresponding resource types of private endpoints:

1. **Initial feed discovery**: lets the client discover all workspaces assigned to a user. To enable this process, you must create a single private endpoint to the *global* sub-resource to any workspace. However, you can only create one private endpoint in your entire Azure Virtual Desktop deployment. This endpoint creates Domain Name System (DNS) entries and private IP routes for the global fully qualified domain name (FQDN) needed for initial feed discovery. This connection becomes a single, shared route for all clients to use.

2. **Feed download**: the client downloads all connection details for a specific user for the workspaces that host their application groups. You create a private endpoint for the *feed* sub-resource for each workspace you want to use with Private Link.

3. **Connections to host pools**: every connection to a host pool has two sides - clients and session host virtual machines (VMs). To enable connections, you need to create a private endpoint for the *connection* sub-resource for each host pool you want to use with Private Link.

The following table summarizes the private endpoints you need to create:

| Purpose | Resource type | Target sub-resource | Quantity |
|--|--|--|--|
| Initial feed discovery | Microsoft.DesktopVirtualization/workspaces | global | One for all your Azure Virtual Desktop deployments |
| Feed download | Microsoft.DesktopVirtualization/workspaces | feed | One per workspace |
| Connections to host pools | Microsoft.DesktopVirtualization/hostpools | connection | One per host pool |

You can either share these private endpoints across your network topology or you can isolate your virtual networks so that each has their own private endpoint to the host pool or workspace.

The following high-level diagram shows how Private Link securely connects a local client to the Azure Virtual Desktop service. For more detailed information about client connections, see [Client connection sequence](#client-connection-sequence).

:::image type="content" source="media/private-link-diagram.png" alt-text="A high-level diagram that shows Private Link connecting a local client to the Azure Virtual Desktop service.":::

## Supported scenarios

When adding Private Link with Azure Virtual Desktop, you have the following options to connect to Azure Virtual Desktop. Each can be enabled or disabled depending on your requirements.

- Both clients and session host VMs use private routes.
- Clients use public routes while session host VMs use private routes.
- Both clients and session host VMs use public routes. Private Link isn't used.

For connections to a workspace, except the workspace used for initial feed discovery (global sub-resource), the following table details the outcome of each scenario:

| Configuration | Outcome |
|--|--|
| Public access **enabled** from all networks | Workspace feed requests are **allowed** from *public* routes.<br /><br />Workspace feed requests are **allowed** from *private* routes. |
| Public access **disabled** from all networks | Workspace feed requests are **denied** from *public* routes.<br /><br />Workspace feed requests are **allowed** from *private* routes. |

With the [reverse connect transport](network-connectivity.md#reverse-connect-transport), there are two network connections for connections to host pools: the client to the gateway, and the session host to the gateway. In addition to enabling or disabling public access for both connections, you can also choose to enable public access for clients connecting to the gateway and only allow private access for session hosts connecting to the gateway. The following table details the outcome of each scenario:

| Configuration | Outcome |
|--|--|
| Public access **enabled** from all networks | Remote sessions are **allowed** when either the client or session host is using a *public* route.<br /><br />Remote sessions are **allowed** when either the client or session host is using a *private* route. |
| Public access **disabled** from all networks | Remote sessions are **denied** when either the client or session host is using a *public* route.<br /><br />Remote sessions are **allowed** when both the client and session host are using a *private* route. |
| Public access **enabled** for client networks, but **disabled** for session host networks | Remote sessions are **denied** if the session host is using a *public* route, regardless of the route the client is using.<br /><br />Remote sessions are **allowed** as long as the session host is using a *private* route, regardless of the route the client is using. |

> [!IMPORTANT]
> - A private endpoint to the global sub-resource of any workspace controls the shared fully qualified domain name (FQDN) for initial feed discovery. This in turn enables feed discovery for all workspaces. Because the workspace connected to the private endpoint is so important, deleting it will cause all feed discovery processes to stop working. We recommend you create an unused placeholder workspace for the global sub-resource. 
>
> - You can't control access to the workspace used for the initial feed discovery (global sub-resource). If you configure this workspace to only allow private access, the setting is ignored. This workspace is always accessible from public routes.
> 
> - If you intend to restrict network ports from either the user client devices or your session host VMs to the private endpoints, you will need to allow traffic across the entire TCP dynamic port range of 1 - 65535 to the private endpoint for the host pool resource using the *connection* sub-resource. The entire TCP dynamic port range is needed because port mapping is used to all global gateways through the single private endpoint IP address corresponding to the *connection* sub-resource. If you restrict ports to the private endpoint, your users may not be able to connect successfully to Azure Virtual Desktop. 

## Client connection sequence

When a user connects to Azure Virtual Desktop over Private Link, and Azure Virtual Desktop is configured to only allow client connections from private routes, the connection sequence is as follows:

1. With a supported client, a user subscribes to a workspace. The user's device queries DNS for the address `rdweb.wvd.microsoft.com` (or the corresponding address for other Azure environments).

1. Your private DNS zone for **privatelink-global.wvd.microsoft.com** returns the private IP address for the initial feed discovery (global sub-resource).

1. For each workspace in the feed, a DNS query is made for the address `<workspaceId>.privatelink.wvd.microsoft.com`.

1. Your private DNS zone for **privatelink.wvd.microsoft.com** returns the private IP address for the workspace feed download.

1. When connecting a remote session, the `.rdp` file that comes from the workspace feed download contains the Remote Desktop gateway address. A DNS query is made for the address `<hostpooId>.afdfp-rdgateway.wvd.microsoft.com`.

1. Your private DNS zone for **privatelink.wvd.microsoft.com** returns the private IP address for the Remote Desktop gateway to use for the host pool providing the remote session.

## Limitations

Private Link with Azure Virtual Desktop has the following limitations:

- Before you use Private Link for Azure Virtual Desktop, you need to [enable the feature](private-link-setup.md#enable-the-feature) on each Azure subscription you want to Private Link with Azure Virtual Desktop.

- All [Remote Desktop clients to connect to Azure Virtual Desktop](users/remote-desktop-clients-overview.md) can be used with Private Link, but we currently only offer troubleshooting support for the web client with Private Link.

- After you've changed a private endpoint to a host pool, you must restart the *Remote Desktop Agent Loader* (*RDAgentBootLoader*) service on each session host in the host pool. You also need to restart this service whenever you change a host pool's network configuration. Instead of restarting the service, you can restart each session host.

- Using both Private Link and [RDP Shortpath](./shortpath.md) at the same time isn't currently supported.

- Early in the preview of Private Link with Azure Virtual Desktop, the private endpoint for the initial feed discovery (for the *global* sub-resource) shared the private DNS zone name of `privatelink.wvd.microsoft.com` with other private endpoints for workspaces and host pools. In this configuration, users are unable to establish private endpoints exclusively for host pools and workspaces. Starting September 1, 2023, sharing the private DNS zone in this configuration will no longer be supported. You need to create a new private endpoint for the *global* sub-resource to use the private DNS zone name of `privatelink-global.wvd.microsoft.com`. For the steps to do this, see [Initial feed discovery](private-link-setup.md#initial-feed-discovery).

- Azure PowerShell cmdlets for Azure Virtual Desktop that support Private Link are in preview. You need to download and install the [preview version of the Az.DesktopVirtualization module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/5.0.0-preview) to use these cmdlets, which have been added in version 5.0.0.

## Next steps

- Learn how to [Set up Private Link with Azure Virtual Desktop](private-link-setup.md).
- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).
- Understand [Azure Virtual Desktop network connectivity](network-connectivity.md).
- See the [Required URL list](safe-url-list.md) for the list of URLs you need to unblock to ensure network access to the Azure Virtual Desktop service.
