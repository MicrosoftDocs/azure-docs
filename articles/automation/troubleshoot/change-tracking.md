---
title: Troubleshooting issues with Azure Change Tracking
description: Learn how to troubleshoot and resolve issues with the Azure Automation Change Tracking and Inventory feature.
services: automation
ms.service: automation
ms.subservice: change-inventory-management
author: mgoedtel
ms.author: magoedte
ms.date: 01/31/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Change Tracking and Inventory

## Windows

### <a name="records-not-showing-windows"></a>Scenario: Change Tracking records aren't showing for Windows machines

#### Issue

You don't see any Change Tracking or Inventory results for Windows machines that are onboarded for Change Tracking.

#### Cause

This error can have the following causes:

* The Microsoft Monitoring Agent isn't running.
* Communication back to the Automation account is being blocked.
* The management packs for Change Tracking aren't downloaded.
* The VM being onboarded might have come from a cloned machine that wasn't sysprepped with the Microsoft Monitoring Agent installed.

#### Resolution

The solutions described below might help resolve your issue. If you still need help, you can collect diagnostics information and contact support. On the agent machine, navigate to C:\Program Files\Microsoft Monitoring Agent\Agent\Tools and run the following commands:

```cmd
net stop healthservice
StopTracing.cmd
StartTracing.cmd VER
net start healthservice
```

> [!NOTE]
> By default, error tracing is enabled. To enable verbose error messages as in the preceding example, use the *VER* parameter. For information traces, use *INF* when invoking **StartTracing.cmd**.

##### Microsoft Monitoring Agent not running

Verify that the Microsoft Monitoring Agent (HealthService.exe) is running on the machine.

##### Communication to Automation account blocked

Check Event Viewer on the machine and look for any events that have the word "changetracking" in them.

See [Automate resources in your datacenter or cloud by using Hybrid Runbook Worker](../automation-hybrid-runbook-worker.md#network-planning) to learn about addresses and ports that must be allowed for Change Tracking to work.

##### Management packs not downloaded

Verify that the following Change Tracking and Inventory management packs are installed locally:

* Microsoft.IntelligencePacks.ChangeTrackingDirectAgent.*
* Microsoft.IntelligencePacks.InventoryChangeTracking.*
* Microsoft.IntelligencePacks.SingletonInventoryCollection.*

##### VM from cloned machine that has not been sysprepped

If using a cloned image, sysprep the image first and then install the Microsoft Monitoring Agent.

## Linux

### Scenario: No Change Tracking or Inventory results on Linux machines

#### Issue

You don't see any Inventory or Change Tracking results for Linux machines that are onboarded for Change Tracking. 

#### Cause
Here are possible causes specific to this issue:
* The Log Analytics agent for Linux isn't running.
* The Log Analytics agent for Linux isn't configured correctly.
* There are File Integrity Monitoring (FIM) conflicts.

#### Resolution 

##### Log Analytics agent for Linux not running

Verify that the daemon for the Log Analytics agent for Linux (omsagent) is running on your machine. Run the following query in the Log Analytics workspace that's linked to your Automation account.

```loganalytics Copy
Heartbeat
| summarize by Computer, Solutions
```

If you don't see your machine in query results, it hasn't recently checked in. There's probably a local configuration issue and you should reinstall the agent. For information about installation and configuration, see [Collect log data with the Log Analytics agent](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent). 

If your machine shows up in the query results, verify the scope configuration. See [Targeting monitoring solutions in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/solution-targeting).

For more troubleshooting of this issue, refer to [Issue: You are not seeing any Linux data](https://docs.microsoft.com/azure/azure-monitor/platform/agent-linux-troubleshoot#issue-you-are-not-seeing-any-linux-data).

##### Log Analytics agent for Linux not configured correctly

The Log Analytics agent for Linux might not be configured correctly for log and command line output collection using the OMS Log Collector tool. See [Track changes in your environment with the Change Tracking solution](../change-tracking.md).

##### FIM conflicts

Azure Security Center’s FIM feature might be incorrectly validating the integrity of your Linux files. Verify that FIM is operational and correctly configured for Linux file monitoring. See [Track changes in your environment with the Change Tracking solution](../change-tracking.md).

## Next steps

If you don't see your problem or are unable to solve your issue, use one of the following channels for more support.

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
