---
title: Monitor Azure resources with Azure Monitor | Microsoft Docs
description: This article describes how to collect and analyze monitoring data from resources in Azure by using Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/17/2023
ms.reviewer: robb

---

# Create alert rules for an Azure resource
Alerts in Azure Monitor proactively notify you of critical conditions based on collected telemetry and potentially attempt to take corrective action. Alerts are generated from alert rules which define the criteria for the alert and what action to take when the alert triggers. There are no alert rules created by default in Azure Monitor. In addition to creating your own alert rules, there are multiple options for getting started quickly with alert rules based on pre-defined conditions.

This article describes the different options for creating alert rules in Azure Monitor and where you can find more information about each option.

## Manual alerts
You can create your own alert rules 

## Azure Policy
Using Azure Policy, you can create policies that automatically create alert rules for all resources of a particular type. For example, you can create a policy that creates an alert rule for all virtual machines that have a CPU usage greater than 90 percent for five minutes. You can also create policies that automatically enable recommended alerts for a particular resource type. For example, you can create a policy that automatically enables recommended alerts for all virtual machines.

## Recommended alerts
Recommended alerts is a feature in Azure Monitor for some services that allows you to quickly create a set of alert rules for a particular resource. Simply select **Set up recommendations** from the **Alerts** tab for the resource in the Azure portal, and select the rules you want to enable. This feature isn't available for all services, and you need to select the option for each resource you want to monitor. Alternatively, you can create policies to automatically create alert rules for all resources of a particular type.


## Horizontal articles

## Azure Monitor Baseline Alerts
Azure Monitor Baseline Alerts (AMBA) provides a library of recommended alert rules for different Azure services. ARM templates are provided for each in addition to Azure Policy definitions to ensure that all of your existing and new resources are monitored. AMBA is primarily focused on services included in [Azure Landing Zones]()

See [Azure Monitor Baseline Alerts](https://aka.ms/amba) for details.

## Azure Monitor Starter Packs
Azure Monitor Starter Packs provides a library of recommended data collection and alert rules for different VM workloads. They're intended to replace the functionality of management packs, so they're ideal for customers migrating from SCOM. The starter packs provide a set of ARM templates and policy definitions that create data collection rules (DCRs) and alert rules for common workloads. 

See [Azure Monitor Starter Packs](https://github.com/Azure/AzureMonitorStarterPacks) for details.

## Next steps

