---
title: Set up Private Link for Azure Virtual Desktop preview - Azure
description: How to set up Private Link for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: how-to
ms.date: 11/04/2022
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
- An Azure Virtual Desktop deployment with service objects, such as host pools, app groups, and [workspaces](environment-setup.md#workspaces).
- The [required permissions to use Private Link](../private-link/rbac-permissions.md).

## Enable preview content on your Azure subscription

In order to use Private Link, you'll need to enable preview features on your Azure subscription first. To enable preview features:

1. Go to [Preview features - Microsoft Azure](https://portal.azure.com/#view/Microsoft_Azure_Resources/PreviewFeaturesBlade).

1. In the search box under **Preview features**, search for **Private**.

2. Select the **Azure Virtual Desktop Private Link Public Preview** check box.

3. In the bottom-right corner of the screen, select **Register**.

Once you select **Register**, you'll be able to use Private Link.

## Create a placeholder workspace

A private endpoint to the global sub-resource of any workspace controls the shared fully-qualified domain name (FQDN) for initial feed discovery. This control enables feed discovery for all workspaces. Because the workspace connected to the private endpoint is so important, deleting it will cause all feed discovery processes to stop working. Instead of deleting the workspace, you should create an unused placeholder workspace to terminate the global endpoint before you start using Private Link. To create a workspace, follow the instructions in [Workspace information](create-host-pools-azure-marketplace.md#workspace-information).

## Set up Private Link in the Azure portal

Now, let's set up Private Link for your host pool. During the setup process, you'll create private endpoints to the following resources:

| Resource type | Target sub-resource | Quantity |
|--|--|
| Microsoft.DesktopVirtualization/workspaces | global | One for all Azure Virtual Desktop deployments |
| Microsoft.DesktopVirtualization/workspaces | feed | One per workspace |
| Microsoft.DesktopVirtualization/hostpools | connection | One per host pool |

To configure Private Link in the Azure portal:

1. Open the Azure portal and sign in.

1. Search for and select **Azure Virtual Desktop**.

1. Go to **Host pools**, then select the name of the host pool you want to use.

   >[!TIP]
   >You can also start setting up by going to **Private Link Center** > **Private Endpoints** > **Add a private endpoint**.

1. After you've opened the host pool, go to **Networking** > **Private Endpoint connections**.

1. Select **Add a private endpoint**.

1. In the **Basics** tab, either use the drop-down menus to select the **Subscription** and **Resource group** you want to use or create a new resource group.

1. Next, enter a name for your new private endpoint. The network interface name will fill automatically.

1. Select the **region** your private endpoint will be located in. You must choose the same location as your session host and the virtual network (VNet) you plan to use.

1. When you're done, select **Next: Resource >**.

1. In the **Resource** tab, use the following resource:
    
    - Resource type: **Microsoft.DesktopVirtualization/hostpools**
    - Resource: *your host pool*
    - Target sub-resource: connection

1.  Select **Next: Virtual Network >**.

1. In the **Virtual Network** tab, make sure the values in the **Virtual Network** and **subnet** fields are correct.

1. In the **Private IP configuration** field, choose whether you want to dynamically or statically allocate IP addresses from the subnet you selected in the previous step. <!--What's the difference between these two and why should I choose each?-->
    
    - If you choose to statically allocate IP addresses, you'll need to fill in the **Name** and **Private IP** for each listed member.

1. Next, select an existing application security group or create a new one.
    
    - If you're creating a new application security group, select **Create new**, then enter a name for the new security group.

1. When you're finished, select **Next: DNS >**.

1. In the **DNS** tab, in the **Integrate with private DNS zone** field, select **Yes** if you want to integrate with an Azure private DNS zone. Learn more about integration at [Azure Private endpoint DNS configuration](../private-link/private-endpoint-dns.md).

1. When you're done, select **Next: Tags >**.

1. In the **Tags** tab, you can optionally add tags to help the Azure service categorize your resources. If you don't want to add tags, select **Next: Review + create**.

1. Review the details of your private endpoint. If everything looks good, select **Create** and wait for the deployment to finish.

1. Now, repeat the process to create private endpoints for your resources. Return to step 3, but select **Workspaces** instead of host pools and use the following resources, then follow the rest of the steps until the end.

    - Resource type: **Microsoft.DesktopVirtualization/workspaces**
    - Resource: *your placeholder workspace*
    - Target sub-resource: global

    - Resource type: **Microsoft.DesktopVirtualization/workspaces**
    - Resource: *your workspace*
    - Target sub-resource: feed

>[!NOTE]
>You'll need to repeat this process to create a private endpoint for every resource you want to put into Private Link.

## Closing public routes

In addition to creating private routes, you can also control if the Azure Virtual Desktop resource allows traffic to come from public routes.

To control public traffic:

1. Open the Azure portal and sign in.

1. Search for and select **Azure Virtual Desktop**.

1. Go to **Host pools** > **Networking** > **Firewall and virtual networks**.

1. First, configure the **Allow end users access from public network** setting.

    - If you select the check box, users can connect to the host pool using public internet or private endpoints.

    - If you don't select the check box, users can only connect to host pool using private endpoints.

1. Next, configure the **Allow session hosts access from public network** setting.

    - If you select the check box, Azure Virtual Desktop session hosts will talk to the Azure Virtual Desktop service over public internet or private endpoints.

    - If you don't select the check box, Azure Virtual Desktop session hosts can only talk to the Azure Virtual Desktop service over private endpoint connections.

## Network security groups

Follow the directions in [Tutorial: Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md) to set up a network security group (NSG). You can use this NSG to block the **WindowsVirtualDesktop** service tag. If you block this service tag, all service traffic will use private routes only.

When you set up your NSG, you must configure it to allow both the URLs in the [required URL list](safe-url-list.md) and your private endpoints. Make sure to include the URLs for Azure Monitor.

## Validate your Private Link deployment

To validate your Private Link for Azure Virtual Desktop and make sure it's working:

1. Check to see if your session hosts are registered and functional on the VNet. You can check their health status with [Azure Monitor](azure-monitor.md).

1. Next, test your feed connections to make sure they perform as expected. Use the client and make sure you can add and refresh workspaces.

1. Finally, run the following end-to-end tests:
   
   - Make sure your clients can't connect to Azure Virtual Desktop and your session hosts from public routes.
   - Make sure the session hosts can't connect to Azure Virtual Desktop from public routes.

## Next steps

- Learn more about how Private Link for Azure Virtual Desktop at [Use Private Link with Azure Virtual Desktop](private-link-overview.md).
- Learn how to configure Azure Private Endpoint DNS at [Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).
- For general troubleshooting guides for Private Link, see [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)
- Understand how connectivity for the Azure Virtual Desktop service works at[Azure Virtual Desktop network connectivity](network-connectivity.md)
- See the [Required URL list](safe-url-list.md) for the list of URLs you'll need to unblock to ensure network access to the Azure Virtual Desktop service.
