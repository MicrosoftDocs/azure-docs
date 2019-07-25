---
title: Troubleshooting issues with Azure Change Tracking
description: This article provides information on troubleshooting Change Tracking
services: automation
ms.service: automation
ms.subservice: change-inventory-management
author: bobbytreed
ms.author: robreed
ms.date: 01/31/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Change Tracking and Inventory

## Windows

### <a name="records-not-showing-windows"></a>Scenario: Change Tracking records aren't showing for Windows Machines

#### Issue

You don't see any Inventory or Change Tracking results for Windows machines that are onboarded for Change Tracking.

#### Cause

This error can be caused by the following reasons:

1. The **Microsoft Monitoring Agent** isn't running
2. Communication back to the Automation Account is being blocked.
3. The Management Packs for Change Tracking aren't downloaded.
4. The VM being onboarded may have come from a cloned machine that wasn't sysprepped with the Microsoft Monitoring Agent installed.

#### Resolution

1. Verify the **Microsoft Monitoring Agent** (HealthService.exe) is running on the machine.
1. Check **Event Viewer** on the machine and look for any events that have the word `changetracking` in them.
1. Visit, [Network planning](../automation-hybrid-runbook-worker.md#network-planning) to learn about which addresses and ports need to be allowed for Change Tracking to work.
1. Verify that the following Change Tracking and Inventory management packs exist locally:
    * Microsoft.IntelligencePacks.ChangeTrackingDirectAgent.*
    * Microsoft.IntelligencePacks.InventoryChangeTracking.*
    * Microsoft.IntelligencePacks.SingletonInventoryCollection.*
1. If using a cloned image, sysprep the image first and install the Microsoft Monitoring Agent agent after the fact.

If these solutions don't resolve your problem and you contact support, you can run the following commands to collect the diagnostic on the agent

On the agent machine, navigate to `C:\Program Files\Microsoft Monitoring Agent\Agent\Tools` and run the following commands:

```cmd
set stop healthservice
StopTracing.cmd
StartTracing.cmd VER
net start healthservice
```

> [!NOTE]
> By default error tracing is enabled, if you want to enable verbose error messages like the preceding example, use `VER` parameter. For information traces, use `INF` when invoking `StartTracing.cmd`.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
