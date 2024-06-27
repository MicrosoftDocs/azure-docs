---
title:  Azure Private Link with Azure Virtual Desktop - Azure
description: Learn about using Private Link with Azure Virtual Desktop to privately connect to your remote resources.
author: dknappettmsft
ms.topic: conceptual
ms.date: 12/08/2023
ms.author: daknappe
---

# Azure Private Link with Azure Virtual Desktop

You can use [Azure Private Link](../private-link/private-link-overview.md) with Azure Virtual Desktop to privately connect to your remote resources. By creating a [private endpoint](../private-link/private-endpoint-overview.md), traffic between your virtual network and the service remains on the Microsoft network, so you no longer need to expose your service to the public internet. You also use a VPN or ExpressRoute for your users with the Remote Desktop client to connect to the virtual network. Keeping traffic within the Microsoft network improves security and keeps your data safe. This article describes how Private Link can help you secure your Azure Virtual Desktop environment.

## How does Private Link work with Azure Virtual Desktop?

Azure Virtual Desktop has three workflows with three corresponding resource types to use with private endpoints. These workflows are:

1. **Initial feed discovery**: lets the client discover all workspaces assigned to a user. To enable this process, you must create a single private endpoint to the *global* sub-resource to any workspace. However, you can only create one private endpoint in your entire Azure Virtual Desktop deployment. This endpoint creates Domain Name System (DNS) entries and private IP routes for the global fully qualified domain name (FQDN) needed for initial feed discovery. This connection becomes a single, shared route for all clients to use.

2. **Feed download**: the client downloads all connection details for a specific user for the workspaces that host their application groups. You create a private endpoint for the *feed* sub-resource for each workspace you want to use with Private Link.

3. **Connections to host pools**: every connection to a host pool has two sides - clients and session hosts. You need to create a private endpoint for the *connection* sub-resource for each host pool you want to use with Private Link.

The following high-level diagram shows how Private Link securely connects a local client to the Azure Virtual Desktop service. For more detailed information about client connections, see [Client connection sequence](#client-connection-sequence).

:::image type="content" source="media/private-link-diagram.png" alt-text="A high-level diagram that shows Private Link connecting a local client to the Azure Virtual Desktop service.":::

## Supported scenarios

When adding Private Link with Azure Virtual Desktop, you have the following supported scenarios to connect to Azure Virtual Desktop. Which scenario you choose depends on your requirements. You can either share these private endpoints across your network topology or you can isolate your virtual networks so that each has their own private endpoint to the host pool or workspace.

[!INCLUDE [include-private-link-supported-scenarios](includes/include-private-link-supported-scenarios.md)]

### Configuration outcomes

You configure settings on the relevant Azure Virtual Desktop workspaces and host pools to set public or private access. For connections to a workspace, except the workspace used for initial feed discovery (global sub-resource), the following table details the outcome of each scenario:

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

## Client connection sequence

When a user connects to Azure Virtual Desktop over Private Link, and Azure Virtual Desktop is configured to only allow client connections from private routes, the connection sequence is as follows:

1. With a supported client, a user subscribes to a workspace. The user's device queries DNS for the address `rdweb.wvd.microsoft.com` (or the corresponding address for other Azure environments).

1. Your private DNS zone for **privatelink-global.wvd.microsoft.com** returns the private IP address for the initial feed discovery (global sub-resource). If you're not using a private endpoint for initial feed discovery, a public IP address is returned.

1. For each workspace in the feed, a DNS query is made for the address `<workspaceId>.privatelink.wvd.microsoft.com`.

1. Your private DNS zone for **privatelink.wvd.microsoft.com** returns the private IP address for the workspace feed download, and downloads the feed using TCP port 443.

1. When connecting to a remote session, the `.rdp` file that comes from the workspace feed download contains the address for the Azure Virtual Desktop gateway service with the lowest latency for the user's device. A DNS query is made to an address in the format `<hostpooId>.afdfp-rdgateway.wvd.microsoft.com`.

1. Your private DNS zone for **privatelink.wvd.microsoft.com** returns the private IP address for the Azure Virtual Desktop gateway service to use for the host pool providing the remote session. Orchestration through the virtual network and the private endpoint uses TCP port 443. 

1. Following orchestration, the network traffic between the client, Azure Virtual Desktop gateway service, and session host is transferred over to a port in the TCP dynamic port range of 1 - 65535.

> [!IMPORTANT]
> If you intend to restrict network ports from either the user client devices or your session host VMs to the private endpoints, you will need to allow traffic across the entire TCP dynamic port range of 1 - 65535 to the private endpoint for the host pool resource using the *connection* sub-resource. The entire TCP dynamic port range is needed because Azure private networking internally maps these ports to the appropriate gateway that was selected during client orchestration. If you restrict ports to the private endpoint, your users may not be able to connect to Azure Virtual Desktop. 

## Known issues and limitations

Private Link with Azure Virtual Desktop has the following limitations:

- Before you use Private Link for Azure Virtual Desktop, you need to [enable Private Link with Azure Virtual Desktop](private-link-setup.md#enable-private-link-with-azure-virtual-desktop-on-a-subscription) on each Azure subscription you want to Private Link with Azure Virtual Desktop.

- All [Remote Desktop clients to connect to Azure Virtual Desktop](users/remote-desktop-clients-overview.md) can be used with Private Link. If you're using the [Remote Desktop client for Windows](./users/connect-windows.md) on a private network without internet access and you're subscribed to both public and private feeds, you aren't able to access your feed.

- After you've changed a private endpoint to a host pool, you must restart the *Remote Desktop Agent Loader* (*RDAgentBootLoader*) service on each session host in the host pool. You also need to restart this service whenever you change a host pool's network configuration. Instead of restarting the service, you can restart each session host.

- Using both Private Link and 

- Using both Private Link and [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks) isn't supported, but they can work together. You can use Private Link and RDP Shortpath for managed networks at your own risk. All other RDP Shortpath options using STUN or TURN aren't supported with Private Link.

- Early in the preview of Private Link with Azure Virtual Desktop, the private endpoint for the initial feed discovery (for the *global* sub-resource) shared the private DNS zone name of `privatelink.wvd.microsoft.com` with other private endpoints for workspaces and host pools. In this configuration, users are unable to establish private endpoints exclusively for host pools and workspaces. Starting September 1, 2023, sharing the private DNS zone in this configuration will no longer be supported. You need to create a new private endpoint for the *global* sub-resource to use the private DNS zone name of `privatelink-global.wvd.microsoft.com`. For the steps to do this, see [Initial feed discovery](private-link-setup.md#initial-feed-discovery).

## Next steps

- Learn how to [Set up Private Link with Azure Virtual Desktop](private-link-setup.md).
- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns-integration.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).
- Understand [Azure Virtual Desktop network connectivity](network-connectivity.md).
- See the [Required URL list](safe-url-list.md) for the list of URLs you need to unblock to ensure network access to the Azure Virtual Desktop service.
