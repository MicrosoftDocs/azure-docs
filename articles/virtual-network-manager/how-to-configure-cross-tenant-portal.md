---
title: Configure cross-tenant connection in Azure Virtual Network Manager (Preview) - Portal
description: Learn how to create cross-tenant connections in Azure Virtual Network Manager to support virtual networks across subscriptions and management groups in different tenants.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to 
ms.date: 09/19/2022
ms.custom: template-how-to 
#customerintent: As a cloud admin, in need to manage multiple tenants from a single network manager instance. Cross tenant functionality will give me this so I can easily manage all network resources governed by azure virtual network manager.
---


# Configure cross-tenant connection in Azure Virtual Network Manager (Preview) - portal

In this article, you'll learn to create [cross-tenant connections](concept-cross-tenant.md) in the Azure portal with Azure Virtual Network Manager. First, you'll create the scope connection on the central network manager. Then you'll create the network manager connection on the connecting tenant, and verify connection. Last, you'll add virtual networks from different tenants to your network group and verify. Once completed, You can centrally manage the resources of other tenants from single network manager instance.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Two Azure tenants with virtual networks needing to be managed by an Azure Virtual Network Manager instance. During the how-to, the tenants will be referred to as follows:
  - **Central management tenant** - The tenant where an Azure Virtual Network Manager instance is installed, and you'll centrally manage network groups from cross-tenant connections.
  - **Target managed tenant** - The tenant containing virtual networks to be managed. This tenant will be connected to the central management tenant.
- Azure Virtual Network Manager deployed in the central management tenant.
- Required permissions include:
  - Administrator of central management tenant has guest account in target managed tenant.
  - Administrator guest account has *Network Contributor* permissions applied at appropriate scope level(Management group, subscription, or virtual network).

Need help with setting up permissions? Check out how to [add guest users in the Azure portal](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md), and how to [assign user roles to resources in Azure portal](../role-based-access-control/role-assignments-portal.md)

## Create scope connection within network manager
Creation of the scope connection begins on the central management tenant with a network manager deployed. This is the network manager where you plan to manager all of your resources across tenants. In this task, you'll set up a scope connection to add a subscription from a target tenant.
1. Go to your Azure Virtual Network Manager instance.
1. Under **Settings**, select **Cross-tenant connections** and select **Create cross-tenant connection**.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/create-cross-tenant-connection.png" alt-text="Screenshot of cross-tenant connections in network manager.":::
1. On the **Create a connection** page, enter the connection name and target tenant information, and select **Create** when completed.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/create-connection-settings.png" alt-text="Screenshot of Create a connection page and settings entered to create connection.":::
1. Verify the scope connection is listed under **Cross-tenant connections** and the status is **Pending**

## Create network manager connection on subscription in other tenant
Once the scope connection is created, you'll switch to the target managed tenant, and you'll connect to the target managed tenant by creating another cross-tennant connection in the **Virtual Network Manager** hub.
1. In the target tenant, search for **virtual network manager** and select **Virtual Network Manager**.
1. Under **Virtual network manager**, select **Cross-tenant connections**.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/virtual-network-manager-overview.png" alt-text="Screenshot of network managers in Virtual network manager on target tenant.":::
1. Select **Create a connection**.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/create-connection-target.png" alt-text="Screenshot of create a connection under Virtual network manager.":::
1. On the **Create a connection** page, enter the information for your central network manager tenant, and select **Create** when complete.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/create-connection-settings-target.png" alt-text="Screenshot of central network manager tenant for Create a connection.":::

## Verify the connection state
Once both connections are created, it's time to verify the connection on the central management tenant.
1. On your central management tenant, select your network manager.
1. Select **Cross-tenant connections** under **Settings**, and verify your cross-tenant connection is listed as **Connected**.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/verify-status.png" alt-text="Screenshot of cross-connection status showing Connected status message.":::

## Add static members to your network group
Now, you'll add virtual networks from both tenants into a static member network group. 

> [!NOTE]
> Currently, cross-tenant connections only support static memberships within a network group. Dynamic membership with Azure Policy is not supported.

1. From your network manager, add a network group if needed.
1. Select your network group and select **Add virtual networks** under **Manually add members**.
1. On the **Manually add members** page, select **Tenant:...** next to the search box, select the linked tenant from the list, and select **Apply**.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/select-target-tenant-network-group.png" alt-text="Screenshot of available tenants to choose for static network group membership.":::
1. To view the available virtual networks from the target managed tenant, select **authenticate** and proceed through the authentication process. If you have multiple Azure accounts, select the one you're currently signed in with that has permissions to the target managed tenant.
1. Select the VNets to include in the network group and select **Add**.

## Verify group members

In the final step, you'll verify the virtual networks that are now members of the network group.
1. On the **Overview** page of the network group, select **View group members** and verify the VNets you added manually are listed.
:::image type="content" source="media/how-to-configure-cross-tenant-portal/network-group-membership.png" alt-text="Screenshot of network group membership." lightbox="media/how-to-configure-cross-tenant-portal/network-group-membership-thumb.png":::
## Next steps
In this article, you deployed a cross-tenant connection between two Azure subscriptions. To learn more about using Azure Virtual Network Manager, see:
- [Common uses cases for Azure Virtual Network Manager](concept-use-cases.md)
- [Learn to build a secure hub-and-spoke network](tutorial-create-secured-hub-and-spoke.md)
- [FAQ](faq.md)

