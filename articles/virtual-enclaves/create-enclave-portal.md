---
title: Create an Enclave in the Azure portal
description: Learn how to create an enclave in Azure Virtual Enclaves using the Azure portal.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 06/11/2026
---

# Create an Enclave in the Azure portal

An [enclave](./what-enclave.md) is an isolated Azure virtual network that belongs to a community and hosts one or more workloads. Workloads in an enclave are isolated from other enclaves in the same community unless you explicitly enable connectivity by creating endpoints and connections.

In this how-to guide, you create an enclave in the Azure portal.

## Prerequisites

- To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- Before you can create an enclave, you must [create a community](./create-community-portal.md) using the Azure portal.
- If you use on-premises or custom DNS, plan how resources in the enclave resolve private endpoints for Azure Storage, Key Vault, and Log Analytics.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an enclave

Enclave deployments can take several minutes to complete. After deployment completes, open your enclave and verify that `Status` is `Succeeded`.

1. Enter `Azure Virtual Enclaves` in the search.

2. Under `Services`, select `Azure Virtual Enclaves`.

3. In the `Azure Virtual Enclaves` page, select `Enclaves` in the left menu.

![Screenshot showing the Azure Virtual Enclaves portal page with the Enclaves list selected.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list.png)

4. On the `Enclaves` page, select `Create`.

5. Enter the basic details for your enclave:
   - `Subscription`: Select an existing subscription.
   - `Resource group`: Create a new resource group or select an existing resource group.
   - `Enclave name`: Enter a name for the enclave, for example, `My-Enclave`.
   - `Region`: Select the Azure region where the enclave is created.
   - `Select a community`: Select an existing community.

![Screenshot showing Enclave create basics input page.](./media/create-enclave-tab-1-basics.png)

6. Select `Next`. On the `Monitoring` page, select where enclave logs are stored.

![Screenshot showing Enclave create logging and monitoring input page.](./media/create-enclave-tab-2-monitoring.png)

7. Select `Next`. On the `Networking` page, select the network size, choose whether enclave subnet communication is allowed by default, create subnets, and enable Azure Bastion as needed. For planning guidance, see [Azure Virtual Network concepts and best practices](/azure/virtual-network/concepts-and-best-practices) and [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm).

![Screenshot showing Enclave create networking input page.](./media/create-enclave-tab-3-networking.png)

> [!NOTE]
>
> Azure Virtual Enclaves automatically allocates the next best-fit block of network address space based on the existing networks allocated to the target community.

8. Select `Next`. On the `Maintenance Mode` page, choose whether to request maintenance mode when the enclave is created. Maintenance mode allows privileged changes to managed resources that are critical to enclave security. [Learn more about maintenance mode](./maintenance-mode.md).

![Screenshot showing Enclave create maintenance mode input page.](./media/create-enclave-tab-4-maintenance-mode.png)

9. Select `Next`. On the `Enclave Administration` page, select the users and groups that should have privileged access to the managed resource group for the enclave.

![Screenshot showing Enclave create Enclave Administration input page.](./media/create-enclave-tab-5-enclave-administration.png)

10. Select `Next`. On the `Workload Administration` page, select the users and groups that should have privileged access to workload resource groups that customers create for their resources.

![Screenshot showing Enclave create Workload Administration input page.](./media/create-enclave-tab-6-workload-administration.png)

11. Select `Next`, and then create any [tags](/azure/azure-resource-manager/management/tag-resources) for your enclave.

12. Select `Review + create`, validate that the details for your enclave are correct, and then select `Create`.

## References

- [What is an enclave?](./what-enclave.md)
- [Create a community](./create-community-portal.md)
- [Best practices](./best-practices.md)
- [Azure best practices regarding Azure Virtual Networks](/azure/virtual-network/concepts-and-best-practices)
- [Plan Azure Virtual Networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm)
