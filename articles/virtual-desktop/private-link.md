---
title: Private Link for Azure Virtual Desktop preview - Azure
description: A brief overview of Private Link for Azure Virtual Desktop (preview) and how to set it up.
author: Heidilohr
ms.topic: how-to
ms.date: 09/02/2022
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

- The preview version of this feature doesn't currently support enabling both Private Link and RDP Shortpath at the same time.

## Set up Private Link

To use Azure portal to configure Private Link:

1. Open the Azure portal and sign in.

2. Create a private endpoint to connect the host pool to the customer VNET by going to **Home** > **Azure Virtual Desktop** > **Host pools**. Select the name of the host pool you want to connect to, then go to **Networking** > **Private Endpoints** > **Add**.

3. Create a private endpoint that will connect the host pool to a customer VNET by going to **Azure Virtual Desktop** > **Host pools**. Select the name of the host pool you want to connect to, then <!--Do we need to create these two at the same time like this, or can we create one and then go back to do the other?-->

Home-\>Private Link Center-\>Private Endpoints -\> Add

> Home-\> Azure Virtual Desktop hub -\> hostpools -\> select hostpool -\> Networking -\>
> Private Endpoints -\> Add

1. Enter the name of your new private endpoint, then select the location you want to put the endpoint in. The endpoint's location must be the same location as the VNET you're connecting the endpoint to. It must also be in the same VNET as your session host VM.

2. Select the Azure Virtual Desktop resource you're creating this private endpoint for. The Private Link feature supports the Microsoft.DesktopVirtualization resource type. 
   
   In the following screenshot, we selected Resource named "PrivateLinkHostpool" and target sub-resource "hostpool" to enable access to global URLs. <!--Remove?-->

   >[!NOTE]
   >You'll need to repeat this process to create a private endpoint for every resource you want to put into Private Link.

![](media/image4.png)

3. Select the VNET and subnet you want to use. You can use your own DNS service, or select "Integrate with private DNS zone" to use Azure private DNS zones (recommended)

![](media/image5.png)

1. On the **Review and create** page, select **Create** to finish making the private endpoint.

![](media/image6.png)

6. Repeat this process to create an endpoint to connect in the opposite direction between the VNET and the host pool for every resource you connected to.

## Closing public routes

In addition to creating private routes, you can also control if the Azure Virtual Desktop resource allows traffic to come from public routes.

To control public traffic:

1. Go to **Host pools** > **Networking** > **Firewall and virtual networks**.

![](media/image7.emf){width="3.2291666666666665in"
height="0.9588790463692038in"}

2. Configure the **Allow end users access from public network** setting.

    - If you enable the setting, users can connect to the host pool using public internet or private endpoints.

    - If you disable the setting, users can only connect to host pool using private endpoints.

3. Configure the **Allow session hosts access from public network** setting.

    - If you enable this setting, Azure Virtual Desktop VMs will talk to the Azure Virtual Desktop service over public internet or private endpoints.

    - If you disable this setting, Azure Virtual Desktop VMs can only talk to the Azure Virtual Desktop service over private endpoint connections.

## Network connectivity <!--How/where do we configure network connectivity?-->

You can set up a network security group (NSG) to block the WindowsVirtualDesktop server tag. If you block this server tag, all service traffic will use private routes only.

When you set up your NSG, you must configure it to allow the URLs in the [required URL list](safe-url-list.md). Make sure to include the URLs for Azure Monitor.

## Validate your Private Link deployment

To validate your Private Link for Azure Virtual Desktop and make sure it's working:

1. Check to see if your session hosts are registered and functional on the VNET. You can check their health status with Azure Monitor.

2. Next, test your feed connections to make sure they perform as expected. If you've disabled public network access, make sure the workspace doesn't show up in feeds from public routes. Feeds from private routes should always work.

3. Finally, run the following tests on your end-to-end connections to make sure they work:
   
   - For clients, if you've disabled the publicNetworkAccess or EnabledForSessionHostsOnly settings, make sure your clients can't connect from public routes. Connections from private routes should always work.
   - For session hosts, if you've disabled the publicNetworkAccess or EnabledForSessionHostsOnly settings, make sure the session hosts can't connect from public routes. Connections from private routes should always work.

## Next steps

- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)
- Learn how to use Azure Firewall to inspect traffic going towards a private endpoint at [Use Azure Firewall to inspect traffic destined to a private endpoint](../private-link/inspect-traffic-with-azure-firewall.md).
- Learn more about Azure Virtual Desktop architecture at [Azure Virtual Desktop for the enterprise](/azure/architecture/example-scenario/wvd/windows-virtual-desktop?context=/azure/virtual-desktop/context/context).
- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md)
- See the [Required URL list](safe-url-list.md) for the list of URLs you'll need to unblock to ensure network access to the Azure Virtual Desktop service.
