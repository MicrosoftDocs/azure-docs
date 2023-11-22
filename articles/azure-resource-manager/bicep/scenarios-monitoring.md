---
title: Create monitoring resources by using Bicep
description: Describes how to create monitoring resources by using Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 07/28/2023
---

# Create monitoring resources by using Bicep

Azure has a comprehensive suite of tools that can monitor your applications and services. You can programmatically create your monitoring resources using Bicep to automate the creation of rules, diagnostic settings, and alerts when provisioning your Azure infrastructure.

Bringing your monitoring configuration into your Bicep code might seem unusual, considering that there are tools available inside the Azure portal to set up alert rules, diagnostic settings and dashboards.

However, alerts and diagnostic settings are essentially the same as your other infrastructure resources. By including them in your Bicep code, you can deploy and test your alerting resources as you would for other Azure resources.

If you use Git or another version control tool to manage your Bicep files, you also gain the benefit of having a history of your monitoring configuration so that you can see how alerts were set up and configured.

## Log Analytics and Application Insights workspaces

You can create Log Analytics workspaces with the resource type [Microsoft.OperationalInsights/workspaces](/azure/templates/microsoft.operationalinsights/workspaces?tabs=bicep) and Application Insights workspaces with the type [Microsoft.Insights/components](/azure/templates/microsoft.insights/components?tabs=bicep). Both of these components are deployed to resource groups.

## Diagnostic settings

Diagnostic settings enable you to configure Azure Monitor to export your logs and metrics to a number of destinations, including Log Analytics and Azure Storage.

When creating [diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md) in Bicep, remember that this resource is an [extension resource](scope-extension-resources.md), which means it's applied to another resource. You can create diagnostic settings in Bicep by using the resource type [Microsoft.Insights/diagnosticSettings](/azure/templates/microsoft.insights/diagnosticsettings?tabs=bicep).

When creating diagnostic settings in Bicep, you need to apply the scope of the diagnostic setting. The diagnostic setting can be applied at the management, subscription, or resource group level. [Use the scope property on this resource to set the scope for this resource](../../azure-resource-manager/bicep/scope-extension-resources.md).

Consider the following example:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/diagnostic-settings.bicep" :::

In the preceding example, you create a diagnostic setting for the App Service plan and send those diagnostics to Log Analytics. You can use the `scope` property to define your App Service plan as the scope for your diagnostic setting, and use the `workspaceId` property to define the Log Analytics workspace to send the diagnostic logs to. You can also export diagnostic settings to Event Hubs and Azure Storage Accounts.

Log types differ between resources, so ensure that the logs you want to export are applicable for the resource you're using.

### Activity log diagnostic settings

To use Bicep to configure diagnostic settings to export the Azure activity log, deploy a diagnostic setting resource at the [subscription scope](deploy-to-subscription.md).

The following example shows how to export several activity log types to a Log Analytics workspace:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/diagnostic-settings-activity-log.bicep" :::

## Alerts

Alerts proactively notify you when issues are found within your Azure infrastructure and applications by monitoring data within Azure Monitor. By configuring your monitoring and alerting configuration within your Bicep code, you can automate the creation of these alerts alongside the infrastructure that you are provisioning in Azure.

For more information about how alerts work in Azure see [Overview of alerts in Microsoft Azure](../../azure-monitor/alerts/alerts-overview.md).

The following sections demonstrate how you can configure different types of alerts using Bicep code.

### Action groups

To be notified when alerts have been triggered, you need to create an action group. An action group is a collection of notification preferences that are defined by the owner of an Azure subscription. Action groups are used to notify users that an alert has been triggered, or to trigger automated responses to alerts.

To create action groups in Bicep, you can use the type [Microsoft.Insights/actionGroups](/azure/templates/microsoft.insights/actiongroups?tabs=bicep). Here is an example:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/action-group.bicep" :::

The preceding example creates an action group that sends alerts to an email address, but you can also define action groups that send alerts to Event Hubs, Azure Functions, Logic Apps and more.

### Alert processing rules

Alert processing rules (previously referred to as action rules) allow you to apply processing on alerts that have fired. You can create alert processing rules in Bicep using the type [Microsoft.AlertsManagement/actionRules](/azure/templates/microsoft.alertsmanagement/actionrules?tabs=bicep).

Each alert processing rule has a scope, which could be a list of one or more specific resources, a specific resource group or your entire Azure subscription. When you define alert processing rules in Bicep, you define a list of resource IDs in the *scope* property, which targets those resources for the alert processing rule.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/alert-processing-rules.bicep" :::

In the preceding example, the `MonitorService` alert processing rule on Azure Backup Vault is defined, which is applied to the existing action group. This rule triggers alerts to the action group.

### Log alert rules

Log alerts automatically run a Log Analytics query. The query which is used to evaluate resource logs at an interval that you define, determines if the results meet some criteria that you specify, and then fires an alert.

You can create log alert rules in Bicep by using the type [Microsoft.Insights/scheduledQueryRules](/azure/templates/microsoft.insights/scheduledqueryrules?tabs=bicep).

### Metric alert rules

Metric alerts notify you when one of your metrics crosses a defined threshold. You can define a metric alert rule in your Bicep code by using the type [Microsoft.Insights/metricAlerts](/azure/templates/microsoft.insights/metricalerts?tabs=bicep).

### Activity log alerts

The [Azure activity log](../../azure-monitor/essentials/activity-log.md) is a platform log in Azure that provides insights into events at the subscription level. This includes information such as when a resource in Azure is modified.

Activity log alerts are alerts that are activated when a new activity log event occurs that matches the conditions that are specified in the alert.

You can use the `scope` property within the type [Microsoft.Insights/activityLogAlerts](/azure/templates/microsoft.insights/activitylogalerts?tabs=bicep) to create activity log alerts on a specific resource or a list of resources using the resource IDs as a prefix.

You define your alert rule conditions within the `condition` property and then configure the alert group to trigger these alerts to by using the `actionGroup` array. Here you can pass a single or multiple action groups to send activity log alerts to, depending on your requirements.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/activity-log-alert.bicep" :::

### Resource health alerts

Azure Resource Health keeps you informed about the current and historical health status of your Azure resources. By creating your resource health alerts using Bicep, you can create and customize these alerts in bulk.

In Bicep, you can create resource health alerts with the type [Microsoft.Insights/activityLogAlerts](/azure/templates/microsoft.insights/activitylogalerts?tabs=bicep).

Resource health alerts can be configured to monitor events at the level of a subscription, resource group, or individual resource.

Consider the following example, where you create a resource health alert that reports on service health alerts. The alert is applied at the subscription level (using the `scope` property), and sends alerts to an existing action group:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/resource-health-alerts.bicep" :::


### Smart detection alerts

Smart detection alerts warn you of potential performance problems and failure anomalies in your web application. You can create smart detection alerts in Bicep using the type [Microsoft.AlertsManagement/smartDetectorAlertRules](/azure/templates/microsoft.alertsmanagement/smartdetectoralertrules?tabs=bicep).

## Dashboards

In Bicep, you can create portal dashboards by using the resource type [Microsoft.Portal/dashboards](/azure/templates/microsoft.portal/dashboards?tabs=bicep).

For more information about creating dashboards with code, see [Programmatically create an Azure Dashboard](../../azure-portal/azure-portal-dashboards-create-programmatically.md).

## Autoscale rules

To create an autoscaling setting, you define these using the resource type [Microsoft.Insights/autoscaleSettings](/azure/templates/microsoft.insights/autoscalesettings?tabs=bicep).

To target the resource that you want to apply the autoscaling setting to, you need to provide the target resource identifier of the resource that the setting should be added to.

In this example, a *scale out* condition for the App Service plan based on the average CPU percentage over a 10 minute time period. If the App Service plan exceeds 70% average CPU consumption over 10 minutes, the autoscale engine scales out the plan by adding one instance.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/autoscaling-rules.bicep" :::

> [!NOTE]
> When defining autoscaling rules, keep best practices in mind to avoid issues when attempting to autoscale, such as flapping. For more information, see the following documentation on [best practices for Autoscale](../../azure-monitor/autoscale/autoscale-best-practices.md).

## Related resources

- Resource documentation
    - [Microsoft.OperationalInsights/workspaces](/azure/templates/microsoft.operationalinsights/workspaces?tabs=bicep)
    - [Microsoft.Insights/components](/azure/templates/microsoft.insights/components?tabs=bicep)
    - [Microsoft.Insights/diagnosticSettings](/azure/templates/microsoft.insights/diagnosticsettings?tabs=bicep)
    - [Microsoft.Insights/actionGroups](/azure/templates/microsoft.insights/actiongroups?tabs=bicep)
    - [Microsoft.Insights/scheduledQueryRules](/azure/templates/microsoft.insights/scheduledqueryrules?tabs=bicep)
    - [Microsoft.Insights/metricAlerts](/azure/templates/microsoft.insights/metricalerts?tabs=bicep)
    - [Microsoft.Portal/dashboards](/azure/templates/microsoft.portal/dashboards?tabs=bicep)
    - [Microsoft.Insights/activityLogAlerts](/azure/templates/microsoft.insights/activitylogalerts?tabs=bicep)
    - [Microsoft.AlertsManagement/smartDetectorAlertRules](/azure/templates/microsoft.alertsmanagement/smartdetectoralertrules?tabs=bicep).
    - [Microsoft.Insights/autoscaleSettings](/azure/templates/microsoft.insights/autoscalesettings?tabs=bicep)
