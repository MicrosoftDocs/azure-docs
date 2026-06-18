---
title: Create an Enclave in the Azure portal
description: Learn how to create an enclave in Azure Enclave using the Azure portal.
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

- To access Azure Enclave, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- Before you can create an enclave, you must [create a community](./create-community-portal.md) using the Azure portal.
- If you use on-premises or custom DNS, plan how resources in the enclave resolve private endpoints for Azure Storage, Key Vault, and Log Analytics.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an enclave

Enclave deployments can take several minutes to complete. After deployment completes, open your enclave and verify that `Status` is `Succeeded`.

1. Enter `Azure Enclave` in the search.

2. Under `Services`, select `Azure Enclave`.

3. In the `Azure Enclave` page, select `Enclaves` in the left menu.

   ![Screenshot showing the Azure Enclave portal page with the Enclaves list selected.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list.png)

4. On the `Enclaves` page, select `Create`.

5. Enter details for your enclave on the `Basics` tab:
   - `Subscription`: Select an existing subscription.
   - `Resource group`: Create a new resource group or select an existing resource group.
   - `Enclave name`: Enter a name for the enclave, for example, `My-Enclave`.
   - `Region`: Select the Azure region where the enclave is created.
   - `Select a community`: Select an existing community.
   - `Dedicated hub`: Select the dedicated hub to use for this enclave.

   ![Screenshot showing Enclave create basics input tab.](./media/create-enclave-tab-1-basics.png)

6. Select `Next`. On the `Network` tab, select the network size, choose whether enclave subnet communication is allowed by default, create subnets, and enable Azure Bastion as needed. For planning guidance, see [Azure Virtual Network concepts and best practices](/azure/virtual-network/concepts-and-best-practices) and [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm).

   ![Screenshot showing Enclave create networking input tab.](./media/create-enclave-tab-3-networking.png)

   > [!NOTE]
   >
   > Azure Enclave automatically allocates the next best-fit block of network address space based on the existing networks allocated to the target community.

7. Select `Next`. On the `Maintenance mode` tab, choose whether to request maintenance mode when the enclave is created. Maintenance mode allows privileged changes to managed resources that are critical to enclave security. [Learn more about maintenance mode](./maintenance-mode.md).

   ![Screenshot showing enclave create maintenance mode input tab.](./media/create-enclave-tab-4-maintenance-mode.png)

8. Select `Next` and on the `Approvals` tab, decide which [approval settings](./configure-approvals.md) to apply to your enclave.

9. Select `Next` and on the `Policy management` tab and customize your settings as needed.

10. Select `Next`. On the `Monitoring` tab, select where enclave logs are stored.

   ![Screenshot showing Enclave create logging and monitoring input tab.](./media/create-enclave-tab-2-monitoring.png)
   
11. Select `Next`. On the `Enclave administration` tab, select the users and groups that should have privileged access to the managed resource group for the enclave.

   ![Screenshot showing enclave create enclave administration input tab.](./media/create-enclave-tab-5-enclave-administration.png)

12. Select `Next`. On the `Workload permissions` tab, select the users and groups that should have privileged access to workload resource groups that customers create for their resources.

   ![Screenshot showing enclave create workload permissions input tab.](./media/create-enclave-tab-6-workload-administration.png)

13. Select `Next`, and then create any [tags](/azure/azure-resource-manager/management/tag-resources) for your enclave.

14. Select `Next`, and then select `Review + create`, validate that the details for your enclave are correct, and then select `Create`.

## References

- [What is an enclave?](./what-enclave.md)
- [Create a community](./create-community-portal.md)
- [Best practices](./best-practices.md)
- [Azure best practices regarding Azure Virtual Networks](/azure/virtual-network/concepts-and-best-practices)
- [Plan Azure Virtual Networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm)
