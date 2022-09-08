---
title: What is Private Link for Azure Virtual Desktop preview - Azure
description: A brief overview of Private Link for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: conceptual
ms.date: 09/08/2022
ms.author: helohr
manager: femila
---

# Private Link for Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Private Link for Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Private Link helps you access Azure products as a service (PaaS) Services (for example, Azure Storage and SQL Database) and Azure-hosted customer-owned or partner services over a [private endpoint](../private-link/private-endpoint-overview.md) in your virtual network.

With Pirvate Link, traffic between your virtual network and the service now travels the Microsoft "backbone" network, which means you'll no longer need to expose your service to the public internet. Instead, you can deliver Azure services to your customers using your own [private link service](../private-link/private-link-service-overview.md) in your virtual network. Setup and consumption using Azure Private Link is consistent across Azure PaaS, customer-owned, and shared partner services.

Using Private Link for Azure Virtual Desktop (preview) means you don't have to unblock a set of URLs or connect over a public network, as all network traffic between Azure Virtual Desktop and their environment stays within the Azure network only. Keeping traffic within this "backbone" network improves security and keeps your data safe. This article will show you how to deploy Private Link to secure your Azure Virtual Desktop environment.

## How does Private Link for Azure Virtual Desktop work?

Private Link for Azure Virtual Desktop has three workflows with three corresponding resource types of private endpoints:

- The first process, initial feed discovery, lets the client discover all workspaces assigned to a user. To enable this process, you must create a single private endpoint to the global sub-resource of any workspace. However, you can only create one private endpoint in your entire Azure Virtual Desktop deployment. This endpoint creates Domain Name System (DNS) entries and private IP routes for the global fully-qualified domain name (FQDN) needed for initial feed discovery. This connection becomes a single, shared route for all clients to use.

- The next process is feed download, which is when the client downloads all connection details for a specific user for the workspaces that each of their application groups are hosted in. To enable this feed download, you must create a private endpoint for each workspace you want to enable. This will be to the workspace sub-resource of the specific workspace you want to allow.

- Finally, connections are made to host pools. Every connection has two sides: clients and session host VMs. To enable connections, you need to create a private link to the host pool sub-resource of any host pool you want to allow.

You can either share these private endpoints across your network topology or you can isolate your virtual networks (VNets) so that each has their own private endpoint to the host pool or workspace.

## Supported scenarios

Private Link for Azure Virtual Desktop currently supports the following three scenarios:

- Both the clients and the session host VMs use public routes, which doesn't require Private Link.
- The clients use public routes while session host VMs use private routes.
- Both clients and session host VMs use private routes.

## Public preview limitations

The current public preview version of Private Link for Azure Virtual Desktop has the following limitations:

- A private endpoint to the global sub-resource of any workspace controls the shared FQDN for initial feed discovery. This control enables feed discovery for all workspaces. Because the workspace connected to the private endpoint is so important, deleting it will cause all feed discovery processes to stop working. Instead of deleting the workspace, you should create an unused placeholder workspace to terminate the global endpoint.

- Validation for data path access checks, particularly those that prevent exfiltration, are still being validated. To help us with validation, the preview version of this feature will collect feedback from customers regarding their exfiltration requirements, particularly their preferences for how to audit and analyze findings. We don't recommend or support using the preview version of this feature for production data traffic.

- After you've changed a private endpoint to a host pool, you must restart the Azure Virtual Desktop Agent and VM. You'll also need to restart whenever you change a host pool's network configuration. You can restart the session host from the Task Manager menu.

- Service tags are used for agent monitoring traffic.

- The preview version of this feature doesn't currently support enabling both Private Link and [RDP Shortpath](./shortpath.md) at the same time.

## Next steps

- Learn about how to set up Private Link for Azure Virtual Desktop at [Set up Private Link for Azure Virtual Desktop](private-link-setup.md).
- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)
- Learn how to use Azure Firewall to inspect traffic going towards a private endpoint at [Use Azure Firewall to inspect traffic destined to a private endpoint](../private-link/inspect-traffic-with-azure-firewall.md).
- Learn more about Azure Virtual Desktop architecture at [Azure Virtual Desktop for the enterprise](/azure/architecture/example-scenario/wvd/windows-virtual-desktop?context=/azure/virtual-desktop/context/context).
- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md)
- See the [Required URL list](safe-url-list.md) for the list of URLs you'll need to unblock to ensure network access to the Azure Virtual Desktop service.
