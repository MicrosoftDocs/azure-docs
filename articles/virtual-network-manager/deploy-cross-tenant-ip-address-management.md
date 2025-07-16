---
title: Configure Cross-Tenant IPAM with Azure Virtual Network Manager
description: Manage IP addresses across tenants with IPAM pools. Follow this guide to deploy and verify cross-tenant allocations.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: tutorial
ms.date: 05/21/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/21/2025
#customer intent: As an IT operator, I want to set up cross-tenant IPAM using Azure Virtual Network Manager so that I can simplify IP address management for multiple tenants.
---

# Configure cross-tenant IPAM with Azure Virtual Network Manager

Managing IP addresses across multiple Azure tenants can be complex, especially in large or distributed organizations. Azure Virtual Network Manager simplifies this process by enabling centralized IP address management (IPAM) across tenants. This article shows you how to deploy a virtual network in a managed tenant using an IP address allocation from an IPAM pool in a management tenant, all through the Azure portal. You'll learn about prerequisites, step-by-step configuration, and how to remove IPAM allocations when they're no longer needed.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Two Azure tenants: a management tenant (Tenant A) and a managed tenant (Tenant B)
    - Management tenant (Tenant A) must have:
        - An Azure Virtual Network Manager instance. If you don't have a network manager instance, see [Create a network manager instance](create-virtual-network-manager-portal.md).
        - An IPAM pool created in the network manager instance. If you don't have an IPAM pool, see [Create an IPAM pool](how-to-manage-ip-addresses-network-manager.md#create-an-ip-address-pool).
        - Network manager configured with cross-tenant connection to Tenant B. For more information, see [Add remote tenant scope in Azure Virtual Network Manager](how-to-configure-cross-tenant-portal.md).
        - *IPAM Pool User* role assigned to your user or service principal.
    - Managed tenant (Tenant B) must have:
        - *Network Contributor* role assigned at the subscription or virtual network level.

## Deploy cross-tenant IPAM using the Azure portal

### Create an IPAM allocation in the management tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) using credentials with access to Tenant A.

1. Navigate to **Azure Virtual Network Manager** and locate your network manager instance.

1. Select **IP address pools** under **IP address management**.

1. Select the IPAM pool where you want to create an allocation.

1. Select **+ Create** > **Allocate resources**.

1. In the **Allocate resources** pane, select the **Tenant :** dropdown and choose the managed tenant (Tenant B) where you want to allocate IP addresses.

1. Select **Apply** and then select **Authenticate**.

    > [!NOTE]
    > The authentication process requires you to sign in with a user or service principal that has the *Network Contributor* role in Tenant B at the subscription or resource level.

1. After authentication, select the virtual network, you want to associate with the IP address pool and select **Associate**.

### Verify the cross-tenant association

1. In Tenant A's portal view, navigate to your IP address pool and select **Allocations** under **Settings**.

1. Select **Resources** and verify that the virtual network from Tenant B is listed as an allocated resource.

1. Switch to Tenant B's portal view and navigate to the virtual network that received the allocation.

1. Select **Subnets** under **Settings** and verify the name listed under **IPAM pool** matches the name of the IPAM pool in the management tenant (Tenant A).

    :::image type="content" source="media/deploy-cross-tenant-ip-address-management/managed-tenant-virtual-network-subnets-settings-thumb.png" alt-text="Screenshot of virtual network subnet settings to verify IPAM pool matches management tenant pool." lightbox="media/deploy-cross-tenant-ip-address-management/managed-tenant-virtual-network-subnets-settings.png":::

## Remove IPAM allocation

To remove an IP allocation from a cross-tenant resource:

1. Sign in to the [Azure portal](https://portal.azure.com/) with credentials for Tenant A.

1. Navigate to **Azure Virtual Network Manager** and locate your network manager instance.

1. Select **IP address pools** under **IP address management**.

1. On the **IP address pools** page, select **Allocations** under **Settings**.

1. Select the virtual network that you want to remove the IPAM allocation from.

1. Select **X Remove**.

1. Authenticate to Tenant B and complete authentication.

1. Once authenticated, select **Yes** to remove the IPAM allocation.

1. Refresh the page to verify that the IPAM allocation is removed.


## Next steps

- [Learn about IP address management in Azure Virtual Network Manager](./concept-ip-address-management.md)

- [Add remote tenant scope in Azure Virtual Network Manager](./how-to-configure-cross-tenant-portal.md)
