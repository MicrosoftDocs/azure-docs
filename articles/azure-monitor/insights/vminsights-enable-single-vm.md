---
title: Enable Azure Monitor for single VM or VMSS in the Azure portal
description: Learn how to enable Azure Monitor for VMs on a single Azure virtual machine or virtual machine scale set.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/12/2020

---

# Enable Azure Monitor for VM or VMSS in the Azure portal
This article describes how to use the Azure portal to enable Azure Monitor for VMs on a single Azure virtual machine, hybrid virtual machine managed by Azure Arc, or an Azure virtual machine scale set.

## Prerequisites
Before you begin, review the [prerequisites](vminsights-enable-overview.md) and make sure your subscription and resources meet the requirements. You can create a new Log Analytics workspace during this process, but you'll typically select an existing workspace that consolidates the data for all the virtual machines in your environment.



## Enable monitoring for a single Azure VM or VMSS
The process is the same to enable an Azure VM, Arc VM, or Azure VMSS in the Azure portal. Simply select **Insights** in the menu and then **Enable**. Following is the detailed procedure.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Virtual machines**, **Virtual machine scale sets**, **Machines - Azure Arc**.

1. From the list, select a VM or VMSS.

1. In the **Monitoring** section, select **Insights** and then **Enable**.

    ![Enable Azure Monitor for VMs for a VM](media/vminsights-enable-single-vm/enable-vminsights-vm-portal.png)

1. On the **Azure Monitor Insights Onboarding** page, if you have an existing Log Analytics workspace in the same subscription, select it in the drop-down list.  

    The list preselects the default workspace and location where the VM is deployed in the subscription. 


6. You will receive status messages as the configuration is performed.

    ![Enable Azure Monitor for VMs monitoring deployment processing](media/vminsights-enable-single-vm/onboard-vminsights-vm-portal-status.png)

    > [!NOTE]
    > If you use a manual upgrade model for your scale set, upgrade the instances to complete the setup. You can start the upgrades from the Instances page, in the Settings section.



## Next steps

* To view discovered application dependencies, see [Use Azure Monitor for VMs Map](vminsights-maps.md). 
* To identify bottlenecks, overall utilization, and your VM's performance, see [View Azure VM performance](vminsights-performance.md).
