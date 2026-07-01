---
title: Create an enclave in the Azure portal
description: Learn how to create an enclave in Azure Enclave using the Azure portal.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 06/11/2026
---

# Create an enclave in the Azure portal

An [enclave](./what-enclave.md) is an isolated Azure Virtual Network that belongs to a community and hosts one or more workloads. Workloads in an enclave are isolated from other enclaves in the same community unless you explicitly enable connectivity by creating endpoints and connections.

In this how-to guide, you create an enclave in the Azure portal.

## Prerequisites

- To access Azure Enclave, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- Before you can create an enclave, you must [create a community](./create-community-portal.md) using the Azure portal.
- If you use on-premises or custom DNS, plan how resources in the enclave resolve private endpoints for Azure Storage, Key Vault, and Log Analytics.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an enclave

Enclave deployments can take several minutes to complete. After deployment completes, open your enclave and verify that `Status` is `Succeeded`.

1. Enter `Azure Enclave` in the search.

1. Under `Services`, select `Azure Enclave`.

1. In the `Azure Enclave` page, select `Enclaves` in the left menu.

   :::image type="content" source="./media/tutorial-step-two-azure-enclave-page-enclaves-list.png" alt-text="Screenshot showing the Azure Enclave portal page with the enclaves list selected." border="True" lightbox="./media/tutorial-step-two-azure-enclave-page-enclaves-list.png":::

1. On the `Enclaves` page, select `Create`.

1. Enter details for your enclave on the `Basics` tab:
   - `Subscription`: Select an existing subscription.
   - `Resource group`: Create a new resource group or select an existing resource group.
   - `Enclave name`: Enter a name for the enclave, for example, `My-Enclave`.
   - `Region`: Select the Azure region where the enclave is created.
   - `Select a community`: Select an existing community.
   - `Dedicated hub`: Select the dedicated hub to use for this enclave.

   :::image type="content" source="./media/create-enclave-tab-1-basics.png" alt-text="Screenshot showing the enclave basics settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-1-basics.png":::

1. Select `Next`. On the `Network` tab, select the network size, choose whether enclave subnet communication is allowed by default, [create subnets](./create-new-enclave-subnet.md), and enable Azure Bastion as needed. For planning guidance, see [Azure Virtual Network concepts and best practices](/azure/virtual-network/concepts-and-best-practices) and [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm).

   :::image type="content" source="./media/create-enclave-tab-2-network.png" alt-text="Screenshot showing the enclave networking settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-2-network.png":::

   > [!NOTE]
   >
   > Azure Enclave automatically allocates the next best-fit block of network address space based on the existing networks allocated to the target community.

1. Select `Next`. On the `Maintenance mode` tab, choose whether to request maintenance mode when the enclave is created. Maintenance mode allows privileged changes to managed resources that are critical to enclave security. [Learn more about maintenance mode](./maintenance-mode.md).

   :::image type="content" source="./media/create-enclave-tab-3-maintenance-mode.png" alt-text="Screenshot showing the enclave maintenance mode settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-3-maintenance-mode.png":::

1. Select `Next` and on the `Approvals` tab, decide which [approval settings](./configure-approvals.md) to apply to your enclave.

   :::image type="content" source="./media/create-enclave-tab-4-approvals.png" alt-text="Screenshot showing the enclave approvals settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-4-approvals.png":::

1. Select `Next` and on the `Policy management` tab and customize your settings as needed.

   :::image type="content" source="./media/create-enclave-tab-5-policy-management.png" alt-text="Screenshot showing the enclave policy management settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-5-policy-management.png":::

1. Select `Next`. On the `Monitoring` tab, select where enclave logs are stored.

   :::image type="content" source="./media/create-enclave-tab-6-monitoring.png" alt-text="Screenshot showing the enclave monitoring settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-6-monitoring.png":::
   
1. Select `Next`. On the `Enclave administration` tab, select the users and groups that should have privileged access to the managed resource group for the enclave.

   :::image type="content" source="./media/create-enclave-tab-7-enclave-administration.png" alt-text="Screenshot showing the enclave administration settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-7-enclave-administration.png":::

1. Select `Next`. On the `Workload permissions` tab, select the users and groups that should have privileged access to workload resource groups that you create for their resources.

   - `RBAC Inheritance`
     - Enabled: Standard Azure RBAC inheritance is enabled for Workload resources.
     - Disabled: Only permissions defined under workload admin settings apply to workload resources.
   - `Reader Access`
     - Allowed: Standard RBAC inheritance is enabled for read permissions only over workload resources.
     - Denied: Read access is denied unless explicitly defined under workload admin settings. 
   - `Workload Access Controls`: Define role assignments and deny assignment exclusions over workload resource group(s). 

   :::image type="content" source="./media/create-enclave-tab-8-workload-permissions.png" alt-text="Screenshot showing the enclave workload permissions settings page during enclave creation in the portal." border="True" lightbox="./media/create-enclave-tab-8-workload-permissions.png":::


1. Select `Next`, and then create any [tags](/azure/azure-resource-manager/management/tag-resources) for your enclave.

1. Select `Next`, and then select `Review + create`, validate that the details for your enclave are correct, and then select `Create`.

   :::image type="content" source="./media/tutorial-step-two-webapp-enclave-overview-page.png" alt-text="Screenshot showing created enclave on its overview page." border="True" lightbox="./media/tutorial-step-two-webapp-enclave-overview-page.png":::

## References

- [What is an enclave?](./what-enclave.md)
- [Create a community](./create-community-portal.md)
- [Create workloads](./create-workload-portal.md)
- [Best practices](./best-practices.md)
- [Azure best practices regarding Azure Virtual Networks](/azure/virtual-network/concepts-and-best-practices)
- [Plan Azure Virtual Networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm)
