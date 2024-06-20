---
title: Create alert rules for an Azure resource
description: Describes the different options for creating alert rules in Azure Monitor and where you can find more information about each option.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/16/2024
ms.reviewer: robb

---

# Create alert rules for Azure resources
Alerts in Azure Monitor proactively notify you of critical conditions based on collected telemetry and potentially attempt to take corrective action. Alerts are generated from alert rules which define the criteria for the alert and what action to take when the alert triggers. There are no alert rules created by default in Azure Monitor. In addition to creating your own, there are multiple options for getting started quickly with alert rules based on pre-defined conditions, and different options are available for different Azure services. This article describes the different options for creating alert rules in Azure Monitor and where you can find more information about each option.


## Recommended alerts
Recommended alerts is a feature in Azure Monitor for some services that allows you to quickly create a set of alert rules for a particular resource. Simply select **Set up recommendations** from the **Alerts** tab for the resource in the Azure portal, and select the rules you want to enable. This feature isn't available for all services, and you need to select the option for each resource you want to monitor. One strategy is to use the recommended alerts as guidance for the alert rules that should be created for a particular type of resource. You can use [Azure Policy](#azure-policy) to automatically create these same alert rules for all resources of a particular type.


## Azure Monitor Baseline Alerts (AMBA)
AMBA is a central repository that combines product group and field experience driven alert definitions that allow customers and partners to improve their observability experience through the adoption of Azure Monitor. It's organized by resource type so you can quickly identify alert definitions that fit your requirements. AMBA leverages Azure Monitor alerts and helps you detect and address issues consistently and at scale indicating problems with monitored resource in your infrastructure. AMBA includes definitions for both metric and log alerts for resources including:

- Service Health
- Compute resources
- Networking resources
- Many more

AMBA also includes example snippets of alert definitions to be directly used in an ARM or BICEP deployments in addition to policy definitions. Read more about on Azure Landing Zone monitoring at [Monitor Azure platform landing zone components](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-monitor#azure-landing-zone-monitoring-guidance) .

AMBA has patterns that group alerts from different resource types to address specific scenarios. Azure landing zone (ALZ), which is also suitable for non-ALZ aligned customers, is a pattern of AMBA that collates platform alerts into a deployable at-scale solution. Other patterns are under development including SAP and Azure Virtual Desktop, which are intended to minimize friction in adopting observability into your environment. 

See [Azure Monitor Baseline Alerts](https://aka.ms/amba) for details.

## Manual alert rules
You can manually create alert rules for any of your Azure resources using the appropriate metric values or log queries as a signal. You must create and maintain each alert rule for each resource individually, so you will probably want to use one of the other options when they're applicable and only manually create alert rules for special cases. Multiple services in Azure have documentation articles that describe recommended telemetry to collect and alert rules that are recommended for that service. These articles are typically found in the **Monitor** section of the service's documentation. For example, [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md) and [Monitor Azure Kubernetes Service (AKS)](../../aks/monitor-aks.md).

See [Choosing the right type of alert rule](./alerts-types.md) for more information about the different types of alert rules and articles such as [Create or edit a metric alert rule](./alerts-create-metric-alert-rule.yml) and [Create or edit a log alert rule](./alerts-create-log-alert-rule.md) for detailed guidance on manually creating alert rules.

## Azure Policy
Using [Azure Policy](../../governance/policy/overview.md), you can automatically create alert rules for all resources of a particular type instead of manually creating rules for each individual resource. You still must define the alerting condition, but the alert rules for each resource will automatically be created for you, for both existing resources and any new ones that you create.

See [Resource Manager template samples for metric alert rules in Azure Monitor](./resource-manager-alerts-metric.md) and [Resource Manager template samples for log alert rules in Azure Monitor](./resource-manager-alerts-log.md) for ARM templates that can be used in policy definitions.

## Next steps

- [Read more about alerts in Azure Monitor](./alerts-overview.md)