---
title: Enable Azure Monitor for VMs in the Azure portal
description: Learn how to evaluate Azure Monitor for VMs on a single Azure virtual machine or on a virtual machine scale set.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/25/2020

---

# Enable Azure Monitor for single VM or VMSS in the Azure portal
This article describes how to enable Azure Monitor for VMs for a single  virtual machine or virtual machine scale set using the Azure portal. This procedure can be used for the following:

- Azure virtual machine
- Azure virtual machine scale set
- Azure Arc machine

Before you begin, review the [prerequisites](vminsights-enable-overview.md) and make sure your subscription and resources meet the requirements.  

## Enable Azure Monitor for VMs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Virtual machines**, **Virtual machine scale sets**, or **Machines - Azure Arc**.

1. Select a resource from the list.

1. In the **Monitoring** section of the menu, select **Insights** and then **Enable**. The following example shows an Azure virtual machine, but the menu is similar for Azure VMSS or Azure Arc.

    ![Enable Azure Monitor for VMs for a VM](media/vminsights-enable-single-vm/enable-vminsights-vm-portal.png)

1. If the VM isn't already connected to a Log Analytics workspace, then you'll be prompted to select one. If you haven't previously [created a workspace](../../azure-monitor/learn/quick-create-workspace.md), then you can select a default for the location where the VM or VMSS is deployed in the subscription. This workspace will be created and configured if it doesn't already exist.

2. You will receive status messages as the configuration is performed.

    >[!NOTE]
    >If you use a manual upgrade model for your scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.

    ![Enable Azure Monitor for VMs monitoring deployment processing](media/vminsights-enable-single-vm/onboard-vminsights-vm-portal-status.png)



## Next steps

* To view discovered application dependencies, see [Use Azure Monitor for VMs Map](vminsights-maps.md). 
* To identify bottlenecks, overall utilization, and your VM's performance, see [View Azure VM performance](vminsights-performance.md).
