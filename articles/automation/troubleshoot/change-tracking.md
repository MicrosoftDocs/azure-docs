---
title: Troubleshoot Azure Automation Change Tracking and Inventory issues
description: This article tells how to troubleshoot and resolve issues with the Azure Automation Change Tracking and Inventory feature.
services: automation
ms.subservice: change-inventory-management
ms.date: 02/15/2021
ms.topic: troubleshooting
---

# Troubleshoot Change Tracking and Inventory issues

This article describes how to troubleshoot and resolve Azure Automation Change Tracking and Inventory issues. For general information about Change Tracking and Inventory, see [Change Tracking and Inventory overview](../change-tracking/overview.md).

## General errors

### <a name="machine-already-registered"></a>Scenario: Machine is already registered to a different account

### Issue

You receive the following error message:

```error
Unable to Register Machine for Change Tracking, Registration Failed with Exception System.InvalidOperationException: {"Message":"Machine is already registered to a different account."}
```

### Cause

The machine has already been deployed to another workspace for Change Tracking.

### Resolution

1. Make sure that your machine is reporting to the correct workspace. For guidance on how to verify this, see [Verify agent connectivity to Azure Monitor](../../azure-monitor/agents/agent-windows.md#verify-agent-connectivity-to-azure-monitor). Also make sure that this workspace is linked to your Azure Automation account. To confirm, go to your Automation account and select **Linked workspace** under **Related Resources**.

1. Make sure that the machines show up in the Log Analytics workspace linked to your Automation account. Run the following query in the Log Analytics workspace.

   ```kusto
   Heartbeat
   | summarize by Computer, Solutions
   ```

   If you don't see your machine in the query results, it hasn't checked in recently. There's probably a local configuration issue. You should reinstall the Log Analytics agent.

   If your machine is listed in the query results, verify under the Solutions property that **changeTracking** is listed. This verifies it is registered with Change Tracking and Inventory. If it is not, check for scope configuration problems. The scope configuration determines which machines are configured for Change Tracking and Inventory. To configure the scope configuration for the target machine, see [Enable Change Tracking and Inventory from an Automation account](../change-tracking/enable-from-automation-account.md).

   In your workspace, run this query.

   ```kusto
   Operation
   | where OperationCategory == 'Data Collection Status'
   | sort by TimeGenerated desc
   ```

1. If you get a ```Data collection stopped due to daily limit of free data reached. Ingestion status = OverQuota``` result, the quota defined on your workspace has been reached, which has stopped data from being saved. In your workspace, go to **Usage and estimated costs**. Either select a new **Pricing tier** that allows you to use more data, or click on **Daily cap**, and remove the cap.

:::image type="content" source="./media/change-tracking/change-tracking-usage.png" alt-text="Usage and estimated costs." lightbox="./media/change-tracking/change-tracking-usage.png":::

If your issue is still unresolved, follow the steps in [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md) to reinstall the Hybrid Worker for Windows. For Linux, follow the steps in  [Deploy a Linux Hybrid Runbook Worker](../automation-linux-hrw-install.md).

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

```loganalytics
Copy
Heartbeat
| summarize by Computer, Solutions
```

If you don't see your machine in query results, it hasn't recently checked in. There's probably a local configuration issue and you should reinstall the agent. For information about installation and configuration, see [Collect log data with the Log Analytics agent](../../azure-monitor/agents/log-analytics-agent.md).

If your machine shows up in the query results, verify the scope configuration. See [Targeting monitoring solutions in Azure Monitor](/previous-versions/azure/azure-monitor/insights/solution-targeting).

For more troubleshooting of this issue, see [Issue: You are not seeing any Linux data](../../azure-monitor/agents/agent-linux-troubleshoot.md#issue-you-arent-seeing-any-linux-data).

##### Log Analytics agent for Linux not configured correctly

The Log Analytics agent for Linux might not be configured correctly for log and command-line output collection by using the OMS Log Collector tool. See [Change Tracking and Inventory overview](../change-tracking/overview.md).

##### FIM conflicts

Microsoft Defender for Cloud's FIM feature might be incorrectly validating the integrity of your Linux files. Verify that FIM is operational and correctly configured for Linux file monitoring. See [Change Tracking and Inventory overview](../change-tracking/overview.md).

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
