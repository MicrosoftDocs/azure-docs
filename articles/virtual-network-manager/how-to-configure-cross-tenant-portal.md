---
title: Configure Cross-Tenant Connections in Azure Virtual Network Manager
description: Learn how to create cross-tenant connections in Azure Virtual Network Manager to manage virtual networks across tenants. Centralize network management and get started today.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 05/21/2025
ms.custom:
  - template-how-to
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/21/2025
#customer intent: As a network engineer, I want to connect virtual networks in different Azure tenants so that I can centralize network management and policies.
---

# Configure cross-tenant connections in Azure Virtual Network Manager

This article explains how to create [cross-tenant connections](concept-cross-tenant.md) in Azure Virtual Network Manager using the Azure portal. Cross-tenant connections let you centrally manage virtual networks across different tenants and subscriptions, streamlining network management and policy enforcement.

First, you create the scope connection on the central network manager. Then, you create the network manager connection on the connecting tenant and verify the connection. Last, you add virtual networks from different tenants to your network group and verify. After you complete all the tasks, you can centrally manage the resources of other tenants from a single network manager.

## Prerequisites

- Two Azure tenants with virtual networks that you want to manage through Azure Virtual Network Manager. This article refers to the tenants as follows:
  - **Central management tenant**: The tenant where an Azure Virtual Network Manager instance is installed, and where you'll centrally manage network groups from cross-tenant connections.
  - **Target managed tenant**: The tenant that contains virtual networks to be managed. This tenant is connected to the central management tenant.

- Azure Virtual Network Manager deployed in the central management tenant.
- These permissions:

  - The administrator of the central management tenant has a guest account in the target managed tenant.
  - The administrator guest account has *Network Contributor* permissions applied at the appropriate scope level (management group, subscription, or virtual network).  

Need help with setting up permissions? Check out how to [Add guest users in the Azure portal](/entra/external-id/b2b-quickstart-add-guest-users-portal) and how to [assign user roles to resources in the Azure portal](../role-based-access-control/role-assignments-portal.yml).

## Create a scope connection within a network manager

Creation of the scope connection begins on the central management tenant with a network manager deployed. This is the network manager where you plan to manage all of your resources across tenants. 

In this task, you set up a scope connection to add a subscription from a target tenant:

1. Sign in to the Azure portal on the central management tenant.

1. Search for **Virtual network managers** and select your network manager from the list.

1. Under **Settings**, select **Cross-tenant connections**, and then select **Create cross-tenant connection**.

1. On the **Create a connection** page, enter the connection name and target tenant information, and then select **Create**.

   :::image type="content" source="media/how-to-configure-cross-tenant-portal/create-connection-settings.png" alt-text="Screenshot of settings entered to create a cross-tenant connection in Azure Virtual Network Manager.":::

1. Verify that the scope connection is listed under **Cross-tenant connections** and the status is **Pending**.

## Create a network manager connection on a subscription in another tenant

After you create the scope connection, switch to the target managed tenant. Connect to the target managed tenant by creating another cross-tenant connection in the **Virtual Network Manager** hub:

1. In the target tenant, search for **Virtual network manager** and select **Virtual Network Managers**.

1. Under **Virtual Network Manager**, select **Cross-tenant connections**.

1. Select **+ Create** or **Create a connection**.

1. On the **Create a connection** page, enter the information for your central management tenant, and then select **Create**.

   :::image type="content" source="media/how-to-configure-cross-tenant-portal/create-connection-settings-target.png" alt-text="Screenshot of settings for creating a cross-tenant connection in Azure Virtual Network Manager.":::

## Verify the connection status

After you create both connections, it's time to verify the connection on the central management tenant:

1. On your central management tenant, select your network manager.

1. Select **Cross-tenant connections** under **Settings**, and verify that your cross-tenant connection is listed as **Connected**.

   :::image type="content" source="media/how-to-configure-cross-tenant-portal/verify-status.png" alt-text="Screenshot of cross-tenant connection status showing Connected in Azure Virtual Network Manager.":::

## Add static members to a network group

Now, add virtual networks from both tenants into a network group for static members. 

> [!NOTE]
> Currently, cross-tenant connections support only static memberships within a network group. Dynamic membership with Azure Policy isn't supported.

1. From your network manager, add a network group if needed.

1. Select your network group, and then select **Add virtual networks** under **Manually add members**.

1. On the **Manually add members** page, select **Tenant:...** next to the search box, select the linked tenant from the list, and then select **Apply**.

1. To view the available virtual networks from the target managed tenant, select **Authenticate** and proceed through the authentication process. If you have multiple Azure accounts, select the one you're currently signed in with that has permissions to the target managed tenant.

1. Select the virtual networks to include in the network group, and then select **Add**.

## Verify group members

In the final step, you verify the virtual networks that are now members of the network group.

On the **Overview** page of the network group, select **View group members**. Verify that the virtual networks that you added manually are listed.

:::image type="content" source="media/how-to-configure-cross-tenant-portal/network-group-membership.png" alt-text="Screenshot of network group membership in Azure Virtual Network Manager." lightbox="media/how-to-configure-cross-tenant-portal/network-group-membership-thumb.png":::

## Next steps

In this article, you deployed a cross-tenant connection between two Azure subscriptions. To learn more about using Azure Virtual Network Manager, see:

- [Common uses cases for Azure Virtual Network Manager](concept-use-cases.md)
- [Learn to build a secure hub-and-spoke network](tutorial-create-secured-hub-and-spoke.md)
- [FAQ](faq.md)

