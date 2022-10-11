---
title: Set up Private Link for Azure Virtual Desktop preview - Azure
description: How to set up Private Link for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: how-to
ms.date: 09/08/2022
ms.author: helohr
manager: femila
---

# Set up Private Link for Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Private Link for Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article will show you how to set up Private Link for Azure Virtual Desktop (preview) in your Azure Virtual Desktop deployment. For more information about what Private Link can do for your deployment, as well as the limitations of the public preview version, see [Private Link for Azure Virtual Desktop (preview)](private-link-overview.md).

## Prerequisites

In order to use Private Link in your Azure Virtual Desktop deployment, you'll need the following things:

- An Azure account with an active subscription.
- An Azure Virtual Desktop deployment with service objects, such as host pools, app groups, and workspaces.
- The [required permissions to use Private Link](../private-link/rbac-permissions.md).

## Set up Private Link in the Azure portal

To configure Private Link in the Azure portal:

1. Open the Azure portal and sign in.

2. Create a private endpoint to connect the host pool to the customer Virtual Network (VNet) by going to **Home** > **Azure Virtual Desktop** > **Host pools**. Select the name of the host pool you want to connect to, then go to **Networking** > **Private Endpoints** > **Add**.

3. Create a private endpoint that will connect the host pool to a customer VNet by going to **Azure Virtual Desktop** > **Host pools**. Select the name of the host pool you want to connect to, then go to **Networking** > **Private endpoints** and select **Add**. <!--Do we need to create processes for in-Azure Virtual Desktop and outside of Azure Virtual Desktop at the same time like this, or can we create one and then go back to do the other?-->

4. Enter the name of your new private endpoint, then select the location you want to put the endpoint in. The endpoint's location must be the same location as the VNet you're connecting the endpoint to. It must also be in the same VNet as your session host VM.

5. Select the Azure Virtual Desktop resource you're creating this private endpoint for. The Private Link feature supports the Microsoft.DesktopVirtualization resource type.

   >[!NOTE]
   >You'll need to repeat this process to create a private endpoint for every resource you want to put into Private Link.

6. Select the VNet and subnet you want to use. You can use your own DNS service, but we recommend you select **Integrate with private DNS zone** to use Azure private DNS zones.

7. On the **Review and create** page, select **Create** to finish making the private endpoint.

8. Repeat this process to create an endpoint to connect in the opposite direction between the VNet and the host pool for every resource you connected to.

## Closing public routes

In addition to creating private routes, you can also control if the Azure Virtual Desktop resource allows traffic to come from public routes.

To control public traffic:

1. Go to **Host pools** > **Networking** > **Firewall and virtual networks**. You should see the two check boxes shown in the following screenshot:

   :::image type="content" source="media/firewall-and-virtual-networks.png" alt-text="A screenshot of two check boxes labeled allow end users access from public network and allow session hosts access from public network.":::

2. First, configure the **Allow end users access from public network** setting.

    - If you select the check box, users can connect to the host pool using public internet or private endpoints.

    - If you don't select the check box, users can only connect to host pool using private endpoints.

3. Next, configure the **Allow session hosts access from public network** setting.

    - If you select the check box, Azure Virtual Desktop session hosts will talk to the Azure Virtual Desktop service over public internet or private endpoints.

    - If you don't select the check box, Azure Virtual Desktop session hosts can only talk to the Azure Virtual Desktop service over private endpoint connections.

## Network security groups

You can [set up a network security group (NSG)](../virtual-network/tutorial-filter-network-traffic.md) to block the **WindowsVirtualDesktop** server tag. If you block this server tag, all service traffic will use private routes only.

When you set up your NSG, you must configure it to allow the URLs in the [required URL list](safe-url-list.md). Make sure to include the URLs for Azure Monitor.

## Validate your Private Link deployment

To validate your Private Link for Azure Virtual Desktop and make sure it's working:

1. Check to see if your session hosts are registered and functional on the VNet. You can check their health status with [Azure Monitor](azure-monitor.md).

2. Next, test your feed connections to make sure they perform as expected. Use the client and make sure you can add and refresh workspaces.

3. Finally, run the following end-to-end tests:
   
   - Make sure your clients can't connect to Azure Virtual Desktop and your session hosts from public routes.
   - Make sure the session hosts can't connect to Azure Virtual Desktop from public routes.

## Next steps

- Learn more about how Private Link for Azure Virtual Desktop at [Use Private Link with Azure Virtual Desktop](private-link-overview.md).
- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)
- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md)
- See the [Required URL list](safe-url-list.md) for the list of URLs you'll need to unblock to ensure network access to the Azure Virtual Desktop service.
