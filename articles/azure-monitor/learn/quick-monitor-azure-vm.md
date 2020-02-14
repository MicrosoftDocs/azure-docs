---
title: Monitor an Azure resource with Azure Monitor
description: Learn how to collect and analyze data for an Azure resource in Azure Monitor.
ms.service:  azure-monitor
ms. subservice: logs
ms.topic: quickstart
author: bwren
ms.author: bwren
ms.date: 12/15/2019
---

# Quickstart: Monitor an Azure virtual machine with Azure Monitor
[Azure Monitor](../overview.md) starts collecting data from Azure virtual machines the moment that they're created. In this quickstart, you'll take a brief walkthrough the data that's automatically collected for an Azure VM and how to view it in the Azure portal. You'll then enable [Azure Monitor for VMs](../insights/vminsights-overview.md) for your VM which will enable agents on the VM to collect and analyze data from the guest operating system including processes and their dependencies.

This quickstart assumes you have an existing Azure virtual machine. If not you can create a [Windows VM](../../virtual-machines/windows/quick-create-portal.md) or create a [Linux VM](../../virtual-machines/linux/quick-create-cli.md) following our VM quickstarts.

For more detailed descriptions of monitoring data collected from Azure resources  see [Monitoring Azure virtual machines with Azure Monitor](../insights/monitor-vm-azure.md).


## Complete the Monitor an Azure resource quickstart.
Complete [Monitor an Azure resource with Azure Monitor](quick-monitor-azure-resource.md) to view the overview page, activity log, and metrics for a VM in your subscription. Azure VMs collect the same monitoring data as any other Azure resource, but this is only for the host VM. The rest of this quickstart will focus on monitoring the guest operating system and its workloads.


## Enable Azure Monitor for VMs
While metrics and activity logs will be collected for the host VM, you need an agent and some configuration to collect and analyze monitoring data from the guest operating system and its workloads. Azure Monitor for VMs installs these agents and provides additional powerful features for monitoring your virtual machines.

1. Go to the menu for your virtual machine.
2. Either click **Go to Insights** from the tile in the **Overview** page, or click on **Insights** from the **Monitoring** menu.

    ![Overview page](media/quick-monitor-azure-vm/overview-insights.png)

3. If Azure Monitor for VMs has not yet been enabled for the virtual machine, click **Enable**. This will take a few minutes as extensions are enabled and agents are installed on your virtual machine. When that'scom

    ![Enable insights](media/quick-monitor-azure-vm/enable-insights.png)





## Next steps
In this quickstart, you viewed the Activity log and metrics for an Azure resource which are automatically collected by Azure Monitor. Resource logs provide insight into the detailed operation of the resource but must be configured in order to be collected. Continue to the tutorial for collecting resource logs into a Log Analytics workspace where they can be analyzed using log queries.

> [!div class="nextstepaction"]
> [Collect and analyze resource logs with Azure Monitor](tutorial-resource-logs.md)
