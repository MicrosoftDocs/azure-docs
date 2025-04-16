---
title: Create a Workload in Azure
description: Create a Workload in Azure
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Quickstart: Create a Workload in the Azure portal

[Workloads](./what-workload.md) are logical groups of Azure resources that you define to create and audit connections in Azure Virtual Enclaves.

## Prerequisites
- To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- All access to Azure Virtual Enclaves takes place through a community or an enclave. For this how-to article, create a [community](./create-community-portal.md) and [enclave](./create-enclave-portal.md) using the Azure portal.

## Sign-in to Azure
Sign-in to the [Azure portal](https://portal.azure.com).

## Create workload

1. Enter `Azure Virtual Enclaves` in the search.

2. Under `Services`, select `Azure Virtual Enclaves`.

3. In the `Azure Virtual Enclaves` page, select `Workloads` in the left menu.

[ ![Screenshot showing the Azure Virtual Enclaves portal homepage with the Workloads page selected.](./media/azure-virtual-enclaves-homepage-workloads.png) ](./media/azure-virtual-enclaves-homepage-workloads.png)

4. On the `Workloads` page, select `Create`.

5. Enter the basic details for your Workload
   - Enclave: Select an existing Enclave. This value is automatically applied if you started the Workload creation from the existing Enclave.
   - Workload name: Name of the Workload (for example `contoso4-identity`)

![Screenshot showing the Workload creation basics page.](./media/create-workload-tab-1-basics.png)

> [!NOTE]
>
> Organizations should choose a workload naming convention that makes sense for the organization. Learn more about [defining your naming convention](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming).

6. Select `Next` and enter any [Tags](../azure-resource-manager/management/tag-resources.md) for your Workload.

7. Select `Review + create`, ensure the details for your Workload are correct, and select `Create`.


**References**
- [What is a Workload?](./what-workload.md)
- [Create an Enclave](./create-enclave-portal.md)
- [Best practices](./best-practices.md)
- [Defining your naming convention](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
