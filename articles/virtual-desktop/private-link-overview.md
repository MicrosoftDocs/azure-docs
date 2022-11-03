---
title: Use Azure Private Link with Azure Virtual Desktop preview - Azure
description: Learn how Azure Private Link (preview) can help you keep network traffic private.
author: Heidilohr
ms.topic: conceptual
ms.date: 11/04/2022
ms.author: helohr
manager: femila
---

# Use Azure Private Link with Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Private Link for Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can use a [private endpoint](../private-link/private-endpoint-overview.md) from Azure Private Link with Azure Virtual Desktop to privately connect to your remote resources. With Private Link, traffic between your virtual network and the service travels the Microsoft "backbone" network, which means you'll no longer need to expose your service to the public internet. Keeping traffic within this "backbone" network improves security and keeps your data safe. This article describes how Private Link can help you secure your Azure Virtual Desktop environment.

## How does Private Link work with Azure Virtual Desktop?

Azure Virtual Desktop has three workflows with three corresponding resource types of private endpoints:

- The first workflow, initial feed discovery, lets the client discover all workspaces assigned to a user. To enable this process, you must create a single private endpoint to the global sub-resource of any workspace. However, you can only create one private endpoint in your entire Azure Virtual Desktop deployment. This endpoint creates Domain Name System (DNS) entries and private IP routes for the global fully-qualified domain name (FQDN) needed for initial feed discovery. This connection becomes a single, shared route for all clients to use.

- The next workflow is feed download, which is when the client downloads all connection details for a specific user for the workspaces that each of their application groups are hosted in. To enable this feed download, you must create a private endpoint for each workspace you want to enable. This will be to the workspace sub-resource of the specific workspace you want to allow.

- The final workflow involves making connections to host pools. Every connection has two sides: clients and session host VMs. To enable connections, you need to create a private endpoint for the host pool sub-resource of any host pool you want to allow.

You can either share these private endpoints across your network topology or you can isolate your virtual networks (VNets) so that each has their own private endpoint to the host pool or workspace.

The following diagram shows how Private Link securely connects a local client to the Azure Virtual Desktop service:

:::image type="content" source="media/private-link-diagram.png" alt-text="A diagram that shows Private Link connecting a local client to the Azure Virtual Desktop service.":::

## Supported scenarios

When adding Private Link, you can connect to Azure Virtual Desktop in the following ways:

- Both the clients and the session host VMs use public routes, which doesn't require Private Link.
- The clients use public routes while session host VMs use private routes.
- Both clients and session host VMs use private routes.

## Public preview limitations

The public preview of using Private Link with Azure Virtual Desktop has the following limitations:

- All Azure Virtual Desktop clients are compatible with Private Link, but we currently only offer troubleshooting support for the web client version of Private Link.

- A private endpoint to the global sub-resource of any workspace controls the shared FQDN for initial feed discovery. This control enables feed discovery for all workspaces. Because the workspace connected to the private endpoint is so important, deleting it will cause all feed discovery processes to stop working. Instead of deleting the workspace, you should create an unused placeholder workspace to terminate the global endpoint.

- Validation for data path access checks, particularly those that prevent exfiltration, are still being validated. To help us with validation, the preview version of this feature will collect feedback from customers regarding their exfiltration requirements, particularly their preferences for how to audit and analyze findings. We don't recommend or support using the preview version of this feature for production data traffic.

- After you've changed a private endpoint to a host pool, you must restart the *Remote Desktop Agent Loader* (RDAgentBootLoader) service on the session host VM. You'll also need to restart this service whenever you change a host pool's network configuration. Instead of restarting the service, you can restart the session host.

- Service tags are used by the Azure Virtual Desktop service for agent monitoring traffic. The service automatically creates these tags.

- The public preview doesn't support using both Private Link and [RDP Shortpath](./shortpath.md) at the same time.

## Next steps

- Learn about how to set up Private Link with Azure Virtual Desktop at [Set up Private Link for Azure Virtual Desktop](private-link-setup.md).
- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).
- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md).
- See the [Required URL list](safe-url-list.md) for the list of URLs you'll need to unblock to ensure network access to the Azure Virtual Desktop service.
