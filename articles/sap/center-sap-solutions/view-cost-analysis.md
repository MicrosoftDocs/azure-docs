---
title: View cost analysis for SAP systems in Azure Center for SAP solutions
description: Learn how to view the post-deployment cost of running an SAP system through the Virtual Instance for SAP solutions resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 04/15/2026
ms.author: kanamudu
author: kalyaninamuduri
# Customer intent: As an SAP Basis Admin, I want to view the post-deployment costs of my SAP systems in Azure, so that I can effectively manage and optimize my cloud expenses.
---

# View cost analysis for SAP systems in Azure Center for SAP solutions

You can view the running cost of your SAP systems through the *Virtual Instance for SAP solutions (VIS)* resource in *Azure Center for SAP solutions*.

After you deploy or register an SAP system as a VIS resource, you can [view the cost of running that SAP system on the VIS resource's page](#view-cost-analysis). This feature shows the post-deployment running costs in the context of your SAP system. When you have Azure resources of multiple SAP systems in a single resource group, you no longer need to analyze the cost for each system. Instead, you can view the system-level cost from the VIS resource.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An SAP system that you [deployed in Azure Center for SAP solutions](quickstart-create-distributed-non-high-availability.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).
- **Cost Management Reader** role or equivalent permissions on the subscription. For more information, see [Manage access with Azure RBAC](manage-with-azure-rbac.md#view-cost-analysis).

## Understand how cost analysis works

When you deploy infrastructure for a new SAP system with Azure Center for SAP solutions or register an existing system with Azure Center for SAP solutions, the **costanalysis-parent** tag is added to all virtual machines (VMs), disks, and load balancers related to that SAP system. The cost is determined by the total cost of all the Azure resources in the system with the **costanalysis-parent** tag.
Whenever there are changes to the SAP system, such as the addition or removal of Application Server Instance VMs, tags are updated on the relevant Azure resources.

> [!NOTE]
> If you register an existing SAP system as a VIS, the cost analysis only shows data after the time of registration. Even if some infrastructure resources were deployed before the registration, the cost analysis tags aren't applied to historical data.

The following Azure resources aren't included in the SAP system-level cost analysis. This list includes some resources that might be shared across multiple SAP systems.

- Virtual networks
- Storage accounts
- Azure NetApp files (ANF)
- Azure Key Vault
- Azure Monitor for SAP solutions resources
- Azure Backup resources

Cost and usage data is typically available within 8-24 hours. As such, your VIS resource can take 8-24 hours to start showing cost analysis data.

## View cost analysis

To view the post-deployment costs of running an SAP system registered as a VIS resource:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Center for SAP solutions** in the Azure portal's search bar.
1. Select **Virtual Instance for SAP solutions** in the sidebar menu.
1. Select a VIS resource that is either successfully deployed or registered.
1. Select **Cost Analysis** in the sidebar menu.
1. To change the cost analysis from table view to a chart view, select the **Column (grouped)** option.

## Related content

- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Get quality checks and insights for a VIS resource](get-quality-checks-insights.md)
- [Start and stop SAP systems](start-stop-sap-systems.md)
