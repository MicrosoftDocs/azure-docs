---
title: Create monitoring resources by using Bicep
description: Describes how to create monitoring resources by using Bicep.
author: willvelida
ms.author: willvelida
ms.topic: conceptual
ms.date: 04/03/2022
---
# Create monitoring resources by using Bicep

Azure has a comprehensive suite of tools that can monitor your applications and services. We can programmictally create our monitoring resources using Bicep to automate the creation of rules, diagnostic settings and alerts when provisioning our Azure infrastructure.

## Setting up monitoring configuration through Bicep

Bringing your monitoring configuration into your Bicep code may seem unusal, considering that we have tools available inside the Azure Portal to set up rules, diagnostic settings and dashboards. 

However, by bringing your monitoring configuration to your Bicep code, we gain the benefit of having that configuration in our git commit history to see how alerts were set up and configured. Our alerts and diagnostic settings are essentially the same as our other infrastructure resources. By including them in our Bicep code, we can deploy and test our alerting resources as we would for our other Azure resources.

## Log Analytics and Application Insights workspaces

We can create Log Analytics workspaces with the type [`Microsoft.OperationalInsights/workspaces`](/azure/templates/microsoft.operationalinsights/workspaces?tabs=bicep) and Application Insights workspaces with the type [`Microsoft.Insights/components`](/azure/templates/microsoft.insights/components?tabs=bicep). Both of these components can be deployed to resource groups.

## Diagnostic Settings

When creating [Diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings?tabs=CMD) in Bicep, bear in mind that this is an **extension resource**, meaning that we can apply is to another resource. We can create Diagnostic Settings in Bicep using the type [`Microsoft.Insights/diagnosticSettings`](/azure/templates/microsoft.insights/diagnosticsettings?tabs=bicep).

When creating diagnostic settings in Bicep, we need to apply the scope of the diagnostic setting which can be at the Management, Subscription or Resource Group level. [Use the *scope* property on this resource to set the scope for this resource](/azure/azure-resource-manager/bicep/scope-extension-resources).

Take the following example:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/diagnostic-settings.bicep" :::

Here, we create a diagnostic setting for our App Service Plan and send those diagnostics to Log Analytics. We use the `scope` property to define our App Service Plan as the scope for our diagnostic setting and use the `workspaceId` property to send our diagnostics to our Log Analytics workspace. Diagnostic settings differ between resources, so ensure that the diagnostic settings you want to create are applicable for the resource you're using.

## Alert rules

Alerts proactively notify you when issues are found within your Azure infrastructure and applications by monitoring data within Azure Monitor. By configuring our monitoring and alerting configuration within our Bicep code, we can automate the creation of these alerts alongside the infrastructure that we are provisioning in Azure.

Read [`Overview of alerts in Microsoft Azure`](/azure/azure-monitor/alerts/alerts-overview) to further understand how alerts work in Azure, what you can alert on and how we can manage alerts and rules.

The following sections demonstrate how you can configure different types of alerts using Bicep code.

### Action Groups

To be notified when alerts have been triggered, we need to create **Action Groups**. An action group is a collection of notification preferences defined by the owner of an Azure subscription and are used to notify users that an alert have been triggered.

To create action groups in Bicep, we can use the type [`Microsoft.Insights/actionGroups`](/azure/templates/microsoft.insights/actiongroups?tabs=bicep). Here is an example:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/action-group.bicep" :::

This example creates an Action Group that will send alerts to an email address, but you could also define Action Groups that send alerts to Event Hubs, Azure Functions, Logic Apps and more.

### Alert Processing Rules

Alert processing rules (previously referred to as action rules) allow you to apply processing on **fired alerts**. We can create alert processing rules in Bicep using the type [`Microsoft.AlertsManagement/actionRules`](/azure/templates/microsoft.alertsmanagement/actionrules?tabs=bicep).

Each alert processing rule has a scope, which could be a list of one or more specific resources, a specific resource group or your entire Azure subscription. When we define alert processing rules in Bicep, we can pass in a list of ARM IDs in the *scope* property which will the target for the alert processing rule.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/alert-processing-rules.bicep" :::

In this example, we define a  "MonitorService" alert processing rule on Azure Backup Vault, which we apply to our existing action group. This will trigger alerts to that action group.

### Log Alert rules

Log alerts allow users to use a Log Analytics query which can evaluate resource logs at a set interval and then fire an alert based on the results.

You can create Log Alert rules in Bicep using the type [`Microsoft.Insights/scheduledQueryRules`](/azure/templates/microsoft.insights/scheduledqueryrules?tabs=bicep).

### Metric Alert rules

Metric alerts notify you when on of your metrics crosses a defined threshold. You can define a metric rule in your Bicep code using the type [`Microsoft.Insights/metricAlerts`](/azure/templates/microsoft.insights/metricalerts?tabs=bicep).

### Activity Log alerts

Activity log alerts are alerts that are activated when a new activity log event occurs that matches the conditions specified in the alert. 

We can use the `scope` property within the type [`Microsoft.Insights/activityLogAlerts`](/azure/templates/microsoft.insights/activitylogalerts?tabs=bicep) to create activity log alerts on a specific resource or a list of resources using the resource IDs as a prefix.

We define our alert rule conditions within the `condition` property and then configure the Alert Group to trigger these alerts to using the `actionGroup` array. Here you can pass a single or multiple Action Groups to send Activity Log Alerts to, depending on your requirements.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/activity-log-alert.bicep" :::

## Dashboards

In Bicep, we can create Dashboards with the type [`Microsoft.Portal/dashboards`](/azure/templates/microsoft.portal/dashboards?tabs=bicep).

For more information about creating dashboards with code, see the [`Programmatically create and Azure Dashboard`](/azure/azure-portal/azure-portal-dashboards-create-programmatically) reference guide. 

## Resource health

Azure Resource Health keeps you informed about the current and historical health status of your Azure resources. By creating your Resource Health alerts using Bicep, you can create and customize these alerts in bulk.

In Bicep, we can create Resource Health alerts with the type [`Microsoft.Insights/activityLogAlerts`](/azure/templates/microsoft.insights/activitylogalerts?tabs=bicep).

Resource Health Alerts can be configured to monitor events at either the Subscription, Resource Group and Resource Level.

Take the following example. Here we create a Resource Health alert reporting on Service Health alerts that we apply at the subscription level (using the `scope` property) that we send to an existing Action Group:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/resource-health-alerts.bicep" :::

## Smart Detection Alerts

Smart detection alerts warn you of potential performance problems and failure anomalies in your web application. We can create smart detection alerts in Bicep using the type [`microsoft.alertsManagement/smartDetectorAlertRules](/azure/templates/microsoft.alertsmanagement/smartdetectoralertrules?tabs=bicep).

## Creating Autoscaling rules.

To create a autoscaling setting, we define a resource of type [`Microsoft.Ingsights/autoscalesettings`](/azure/templates/microsoft.insights/autoscalesettings?tabs=bicep). 

To target the resource that we want to apply the autoscaling setting to, we need to provide the target resource identifier of the resource that the setting should be added to.

In this example, we create a Scale Up condition for our App Service Plan based on the average CPU Percentage over a 10 minute timespan. If our App Service Plan exceeds 70% average CPU consumption over 10 minutes, we scale up our App Service Plan by 1 instance. 

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-monitoring/resource-health-alerts.bicep" :::

> [!NOTE]
> When defining autoscaling rules, keep best practices in mind to avoid issues when attempting to autoscale, such as Flapping. For more information, see the following documentation on [best practices for Autoscale](/azure/azure-monitor/autoscale/autoscale-best-practices)

Within our autoscaling setting, we can define notification settings within our resource that sends emails to defined e-mail lists and administrators and/or webhook notifications that other services can subscribe to that informs subscribers when a autoscaling event has occured.

## Related resources

- Resource documentation
    - [`Microsoft.OperationalInsights/workspaces`](/azure/templates/microsoft.operationalinsights/workspaces?tabs=bicep)
    - [`Microsoft.Insights/components`](/azure/templates/microsoft.insights/components?tabs=bicep)
    - [`Microsoft.Insights/diagnosticSettings`](/azure/templates/microsoft.insights/diagnosticsettings?tabs=bicep)
    - [`Microsoft.Insights/actionGroups`](/azure/templates/microsoft.insights/actiongroups?tabs=bicep)
    - [`Microsoft.Insights/scheduledQueryRules`](/azure/templates/microsoft.insights/scheduledqueryrules?tabs=bicep)
    - [`Microsoft.Insights/metricAlerts`](/azure/templates/microsoft.insights/metricalerts?tabs=bicep)
    - [`Microsoft.Portal/dashboards`](/azure/templates/microsoft.portal/dashboards?tabs=bicep)
    - [`Microsoft.Insights/activityLogAlerts`](/azure/templates/microsoft.insights/activitylogalerts?tabs=bicep)
    - [`microsoft.alertsManagement/smartDetectorAlertRules](/azure/templates/microsoft.alertsmanagement/smartdetectoralertrules?tabs=bicep).
    - [`Microsoft.Ingsights/autoscalesettings`](/azure/templates/microsoft.insights/autoscalesettings?tabs=bicep)