---
title: Create a workload in the Azure portal
description: Learn how to create a workload in Azure Enclave by using the Azure portal.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: how-to
ms.service: azure-enclave
ms.date: 09/14/2026
---

# Create a workload in the Azure portal

[Workloads](./what-workload.md) are logical groups of zero or more workload resource groups and their underlying Azure resources in an enclave.

In this how-to guide, you create a workload within an existing enclave and optionally add workload resource groups.

## Prerequisites
- To access Azure Enclave, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- All access to Azure Enclave takes place through a community or an enclave. For this how-to article, create a [community](./create-community-portal.md) and [enclave](./create-enclave-portal.md) using the Azure portal.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a workload

1. Enter `Azure Enclave` in the search.

1. Under `Services`, select `Azure Enclave`.

1. In the `Azure Enclave` page, select `Workloads` in the left menu.

    [ ![Screenshot showing the Azure Enclave portal homepage.](./media/azure-enclave-homepage.png) ](./media/azure-enclave-homepage.png#lightbox)

1. On the `Workloads` page, select `Create`.

1. Enter the basic details for your workload:
   - `Enclave`: Select an existing enclave. This value is automatically applied if you started workload creation from an existing enclave.
   - `Workload name`: Enter a workload name, for example, `cyber-monitoring-apps`.

    [ ![Screenshot showing the workload creation basics page.](./media/create-workload-tab-1-basics.png) ](./media/create-workload-tab-1-basics.png#lightbox)

> [!NOTE]
>
> Choose a workload naming convention that makes sense for your organization. For more information, see [Define your naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming).

## Add workload resource groups

1. To add a new resource group during workload creation, select `Add`, enter a resource group name, and repeat as needed. You can also create resource groups later or attach an existing resource group to the workload after the workload is created. The resource group must be in the same subscription and can't already be linked to another workload.

1. Select `Next`, and then enter any [tags](/azure/azure-resource-manager/management/tag-resources) for your workload.

1. Select `Review + create`, confirm that the workload details are correct, and then select `Create`.

> [!NOTE]
>
> You can decide how to logically organize your resources in [workload resource groups](./what-workload.md#workload-resource-group), subject to the workload resource group restrictions.

## Validate the workload

After you create the workload, confirm that it appears on the `Workloads` page and that any workload resource groups you added appear in the workload details.

> [!IMPORTANT]
>
> You can't delete a workload while its linked resource groups contain resources.

## References
- [What is a workload?](./what-workload.md)
- [Create a community](./create-community-portal.md)
- [Create an enclave](./create-enclave-portal.md)
- [List of service catalog templates](./list-service-catalog-templates.md)
- [Best practices](./best-practices.md)
- [Define your naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
