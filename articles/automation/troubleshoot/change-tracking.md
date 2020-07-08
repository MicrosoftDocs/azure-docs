---
title: Troubleshoot Azure Automation Change Tracking and Inventory issues
description: This article tells how to troubleshoot and resolve issues with the Azure Automation Change Tracking and Inventory feature.
services: automation
ms.service: automation
ms.subservice: change-inventory-management
author: mgoedtel
ms.author: magoedte
ms.date: 01/31/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Change Tracking and Inventory issues

This article describes how to troubleshoot and resolve Azure Automation Change Tracking and Inventory issues. For general information about Change Tracking and Inventory, see [Change Tracking and Inventory overview](../change-tracking.md).

## Windows

### <a name="records-not-showing-windows"></a>Scenario: Change Tracking and Inventory records aren't showing for Windows machines

#### Issue

You don't see any Change Tracking and Inventory results for Windows machines that have been enabled for the feature.

#### Cause

This error can have the following causes:

* The Azure Log Analytics agent for Windows isn't running.
* Communication back to the Automation account is being blocked.
* The Change Tracking and Inventory management packs aren't downloaded.
* The VM being enabled might have come from a cloned machine that wasn't prepared with System Preparation (sysprep) with the Log Analytics agent for Windows installed.

#### Resolution

On the Log Analytics agent machine, go to **C:\Program Files\Microsoft Monitoring Agent\Agent\Tools** and run the following commands:

```cmd
net stop healthservice
StopTracing.cmd
StartTracing.cmd VER
net start healthservice
```

If you still need help, you can collect diagnostics information and contact support.

> [!NOTE]
> The Log Analytics agent enables error tracing by default. To enable verbose error messages as in the preceding example, use the `VER` parameter. For information traces, use `INF` when you invoke `StartTracing.cmd`.

##### Log Analytics agent for Windows not running

Verify that the Log Analytics agent for Windows (**HealthService.exe**) is running on the machine.

##### Communication to Automation account blocked

Check Event Viewer on the machine, and look for any events that have the word `changetracking` in them.

To learn about addresses and ports that must be allowed for Change Tracking and Inventory to work, see [Network planning](../automation-hybrid-runbook-worker.md#network-planning).

##### Management packs not downloaded

Verify that the following Change Tracking and Inventory management packs are installed locally:

* `Microsoft.IntelligencePacks.ChangeTrackingDirectAgent.*`
* `Microsoft.IntelligencePacks.InventoryChangeTracking.*`
* `Microsoft.IntelligencePacks.SingletonInventoryCollection.*`

##### VM from cloned machine that has not been sysprepped

If using a cloned image, sysprep the image first and then install the Log Analytics agent for Windows.

## Linux

### Scenario: No Change Tracking and Inventory results on Linux machines

#### Issue

You don't see any Change Tracking and Inventory results for Linux machines that are enabled for the feature. 

#### Cause
Here are possible causes specific to this issue:
* The Log Analytics agent for Linux isn't running.
* The Log Analytics agent for Linux isn't configured correctly.
* There are file integrity monitoring (FIM) conflicts.

#### Resolution 

##### Log Analytics agent for Linux not running

Verify that the daemon for the Log Analytics agent for Linux (**omsagent**) is running on your machine. Run the following query in the Log Analytics workspace that's linked to your Automation account.

```loganalytics Copy
Heartbeat
| summarize by Computer, Solutions
```

If you don't see your machine in query results, it hasn't recently checked in. There's probably a local configuration issue and you should reinstall the agent. For information about installation and configuration, see [Collect log data with the Log Analytics agent](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent).

If your machine shows up in the query results, verify the scope configuration. See [Targeting monitoring solutions in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/solution-targeting).

For more troubleshooting of this issue, see [Issue: You are not seeing any Linux data](https://docs.microsoft.com/azure/azure-monitor/platform/agent-linux-troubleshoot#issue-you-are-not-seeing-any-linux-data).

##### Log Analytics agent for Linux not configured correctly

The Log Analytics agent for Linux might not be configured correctly for log and command-line output collection by using the OMS Log Collector tool. See [Change Tracking and Inventory overview](../change-tracking.md).

##### FIM conflicts

Azure Security Center's FIM feature might be incorrectly validating the integrity of your Linux files. Verify that FIM is operational and correctly configured for Linux file monitoring. See [Change Tracking and Inventory overview](../change-tracking.md).

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
