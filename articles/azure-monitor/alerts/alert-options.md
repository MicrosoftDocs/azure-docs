---
title: Create alert rules for an Azure resource
description: Describes the different options for creating alert rules in Azure Monitor and where you can find more information about each option.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/29/2023
ms.reviewer: robb

---

# Create alert rules for an Azure resource
Alerts in Azure Monitor proactively notify you of critical conditions based on collected telemetry and potentially attempt to take corrective action. Alerts are generated from alert rules which define the criteria for the alert and what action to take when the alert triggers. There are no alert rules created by default in Azure Monitor. In addition to creating your own, there are multiple options for getting started quickly with alert rules based on pre-defined conditions. Different options are available for different Azure services. This article describes the different options for creating alert rules in Azure Monitor and where you can find more information about each option.

## Manual alert rules
You can manually create alert rules for any of your Azure resources using the appropriate metric values or log queries as a signal. You must create and maintain each alert rule for each resource individually, so you will probably want to use one of the other options when they're applicable and only manually create alert rules for special cases. Multiple services in Azure have documentation articles that describe recommended telemetry to collect and alert rules that are recommended for that service. These articles are typically found in the **Monitor** section of the service's documentation. For example, [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md) and [Monitor Azure Kubernetes Service (AKS)](../../aks/monitor-aks.md).

## Azure Policy
Using Azure Policy, you can automatically create alert rules for all resources of a particular type instead of manually creating rules for each individual resource. You still must define the alerting condition, but the alert rules for each resource will automatically be created for you, for both existing resources and any new ones that you create.


## Recommended alerts
Recommended alerts is a feature in Azure Monitor for some services that allows you to quickly create a set of alert rules for a particular resource. Simply select **Set up recommendations** from the **Alerts** tab for the resource in the Azure portal, and select the rules you want to enable. This feature isn't available for all services, and you need to select the option for each resource you want to monitor. One strategy is to use the recommended alerts as guidance for the alert rules that should be created for a particular type of resource. You can use [Azure Policy](#azure-policy) to automatically create these same alert rules for all resources of a particular type.


## Azure Monitor Baseline Alerts
Azure Monitor Baseline Alerts (AMBA) provides a library of recommended alert rules for different Azure services. ARM templates are provided for each in addition to Azure Policy definitions to ensure that all of your existing and new resources are monitored. AMBA is primarily focused on services included in [Azure Landing Zones](/azure/cloud-adoption-framework/ready/landing-zone/)

See [Azure Monitor Baseline Alerts](https://aka.ms/amba) for details.

## Azure Monitor Starter Packs
Azure Monitor Starter Packs provides a library of recommended data collection and alert rules for different VM workloads. They're intended to replace the functionality of management packs, so they're ideal for customers migrating from SCOM. The starter packs provide a set of ARM templates and policy definitions that create data collection rules (DCRs) and alert rules for common workloads. 

See [Azure Monitor Starter Packs](https://github.com/Azure/AzureMonitorStarterPacks) for details.

## Next steps

- [Create a metric query alert for an Azure resource](../alerts/tutorial-metric-alert.md)
- [Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md)