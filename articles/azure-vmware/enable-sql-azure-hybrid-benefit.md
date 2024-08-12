---
title: Enable unlimited virtualization with Azure Hybrid Benefit for SQL Server in Azure VMware Solution
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to enable unlimited virtualization with Azure Hybrid Benefit for SQL Server in Azure VMware Solution. A VM-Host placement policy is configured to register the licenses to hosts and VMs.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/13/2023
ms.custom: engagement-fy23
---

# Enable unlimited virtualization with Azure Hybrid Benefit for SQL Server in Azure VMware Solution

In this article, you learn how to enable unlimited virtualization through Azure Hybrid Benefit for SQL Server in an Azure VMware Solution private cloud. You can register the licenses by configuring a placement policy. The placement policy defines the hosts and the virtual machines (VMs) on the hosts that are running SQL Server.

> [!IMPORTANT]
> SQL Server licenses are applied at the host level and must cover all the physical cores on a host. For example, if each host in Azure VMware Solution has 36 cores and you intend to have 2 hosts run SQL Server, the Azure Hybrid Benefit applies to 72 cores. This amount is regardless of the number of SQL Server instances or other VMs that are on that host.

View a [video tutorial for configuring Azure Hybrid Benefit for SQL Server in Azure VMware Solution](https://www.youtube.com/watch?v=vJIQ1K2KTa0).

## Configure VM-Host placement policy

You can configure the VM-Host placement policy to enable Azure Hybrid Benefit for SQL Server by using the Azure CLI or the Azure portal.

To enable by using the Azure CLI, see [az vmware placement-policy vm-host](/cli/azure/vmware/placement-policy/vm-host).

To use the Azure portal:

1. From your Azure VMware Solution private cloud, select **Azure Hybrid Benefit** > **Create VM-Host affinity placement policy**.

    :::image type="content" source="media/sql-azure-hybrid-benefit/azure-hybrid-benefit.png" alt-text="Screenshot that shows how to create a new VM-Host affinity placement policy.":::

1. Fill in the required fields for creating the placement policy:
     - **Name**: Select the name that identifies this policy.
     - **Type**: Select the type of policy. This type must be a VM-Host affinity rule only.
     - **Azure Hybrid Benefit**: Select the checkbox to apply Azure Hybrid Benefit for SQL Server.
     - **Cluster**: Select the correct cluster. The policy is scoped to host in this cluster only.
     - **Enabled**: Select **Enabled** to apply the policy immediately after creation.

     :::image type="content" source="media/sql-azure-hybrid-benefit/create-placement-policy.png" alt-text="Screenshot that shows how to create a host VM placement policy by using the host VM affinity.":::

1. Select the hosts and VMs to be applied to the VM-Host affinity policy:
     - **Select hosts**: Select the hosts to run SQL Server. When hosts are replaced, policies are re-created on the new hosts automatically.
     - **Select virtual machines**: Select the VMs that should run on the selected hosts.
     - **Review and Create**: Select to create the policy.

     :::image type="content" source="media/sql-azure-hybrid-benefit/select-policy-host.png" alt-text="Screenshot that shows how to create a host VM affinity.":::

## Manage placement policies

After you create the placement policy, you can review, manage, or edit the policy by using options on the **Placement policies** menu in the Azure VMware Solution private cloud.

When you select the Azure Hybrid Benefit checkbox in the configuration setting, you can enable existing VM-Host affinity policies with Azure Hybrid Benefit for SQL Server.

:::image type="content" source="media/sql-azure-hybrid-benefit/placement-policies.png" alt-text="Screenshot that shows how to configure VM placement policies.":::

## Related content

- [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/)
- [az vmware placement-policy vm-host](/cli/azure/vmware/placement-policy/vm-host)