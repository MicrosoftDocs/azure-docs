---
title: What is Private Link for Azure Virtual Desktop preview - Azure
description: A brief overview of Private Link for Azure Virtual Desktop (preview) and how to set it up.
author: Heidilohr
ms.topic: conceptual
ms.date: 09/06/2022
ms.author: helohr
manager: femila
---

# Private Link for Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Private Link for Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Private Link lets customers access Azure products as a service (PaaS), such as Azure Storage and SQL Database. Private Link also lets customers access Azure-hosted customer-owned and partner services with a private endpoint in their virtual network. Learn more about Azure Private Link at [What is Azure Private Link](../private-link/private-link-overview.md).

Azure Virtual Desktop currently requires customers unblock a set of URLs and make connections between virtual machines (VMs) and end-user client machines over the public network. However, now you can use Private Link for Azure Virtual Desktop (preview) to keep all network traffic between Azure Virtual Desktop and their environment within the Azure network only. Keeping traffic within this "backbone" network improves security and keeps your data safe. This article will show you how to deploy Private Link to secure your Azure Virtual Desktop environment.

## Prerequisites

In order to use Private Link in your Azure Virtual Desktop deployment, you'll need the following things:

- An Azure account with an active subscription.
- An Azure Virtual Desktop deployment with service objects, such as host pools, app groups, and workspaces.

## How does Private Link for Azure Virtual Desktop work?

Private Link for Azure Virtual Desktop has three processes for connecting to the three types of Private Link endpoints:

- The first process, initial feed discovery, lets the client discover all workspaces assigned to a user. To enable this process, you must create a single private endpoint to the global sub-resource of any workspace. However, you can only create one private endpoint in your entire Azure Virtual Desktop deployment. This endpoint creates Domain Name System (DNS) entries and private IP routes for the global fully-qualified domain name (FQDN) needed for initial feed discovery. This connection becomes a single, shared route for all clients to use.

- The next process is feed download, which is when the client downloads all connection details (RDP files) for a specific user for the host pools that each of their application groups are hosted in. To enable this feed download, you must create a private endpoint for each workgroup you want to enable. This will be to the workspace sub-resource of the specific workspace you want to allow.

- Finally, connections are what happen within host pools in Private Link. Every connection has two sides: clients and session host VMs. To enable connections, you need to create a private link to the host pool sub-resource of any host pool you want to allow.

You can either share these private endpoints across your network topology or you can isolate your virtual networks (VNETs) so that each has their own private endpoint to the host pool or workspace.

## Supported scenarios <!--Come back to this later--->

1. Clients using public routes, session host VMs using public routes (no private link required).

2. Clients using public routes, session host VMs using private routes. 

3. Clients using private routes, session host VMs using private routes.

>[!NOTE}
>Even though it shows session host access from public network, it also means client access from public network.

## Public preview limitations

The current public preview version of Private Link for Azure Virtual Desktop has the following limitations:

- This feature currently controls the shared FQDN for initial feed discovery with a private endpoint to the global sub-resource of any workspace. This control enables feed discovery for all workspaces. Because the private endpoint workspace is so important, deleting it will cause all feed discovery processes to stop working. Instead of deleting the workspace, you should create an unused placeholder workspace to terminate the global endpoint.

- Validation for data path access checks, particularly those that prevent exfiltration, are still being validated. To help us with validation, the preview version of this feature will collect feedback from customers regarding their exfiltration requirements, particularly their preferences for how to audit and analyze findings. We don't recommend or support using the preview version of this eature for production data traffic.

- After you've changed a private endpoint to a host pool, you must restart the Azure Virtual Desktop Agent and VM. You'll also need to restart whenever you change a host pool's network configuration. You can restart the VM or RDAgentBootloader service from the Task Manager menu.

- Service tags are used for agent monitoring traffic.

- The preview version of this feature doesn't currently support enabling both Private Link and [RDP Shortpath](./shortpath.md) at the same time.