---
title: "Prepare for Azure Monitor classic alerts migration by updating your logic apps and runbooks"
description: Learn how to modify your webhooks, logic apps, and runbooks to prepare for voluntary migration.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 03/19/2018
ms.author: snmuvva
ms.subservice: alerts
---
# Prepare your logic apps and runbooks for migration of classic alert rules

As [previously announced](monitoring-classic-retirement.md), classic alerts in Azure Monitor are being retired in September 2019 (was originally July 2019). A migration tool is available in the Azure portal to customers who use classic alert rules and who want to trigger migration themselves.

> [!NOTE]
> Due to delay in roll-out of migration tool, the retirement date for classic alerts migration has been extended to August 31st, 2019 from the originally announced date of June 30th, 2019.

If you choose to voluntarily migrate your classic alert rules to new alert rules, be aware that there are some differences between the two systems. This article explains those differences and how you can prepare for the change.

## API changes

The APIs that create and manage classic alert rules (`microsoft.insights/alertrules`) are different from the APIs that create and manage new metric alerts (`microsoft.insights/metricalerts`). If you programmatically create and manage classic alert rules today, update your deployment scripts to work with the new APIs.

The following table is a reference to the programmatic interfaces for both classic and new alerts:

|         |Classic alerts  |New metric alerts |
|---------|---------|---------|
|REST API     | [microsoft.insights/alertrules](https://docs.microsoft.com/rest/api/monitor/alertrules)         | [microsoft.insights/metricalerts](https://docs.microsoft.com/rest/api/monitor/metricalerts)       |
|Azure CLI     | [az monitor alert](https://docs.microsoft.com/cli/azure/monitor/alert?view=azure-cli-latest)        | [az monitor metrics alert](https://docs.microsoft.com/cli/azure/monitor/metrics/alert?view=azure-cli-latest)        |
|PowerShell      | [Reference](https://docs.microsoft.com/powershell/module/az.monitor/add-azmetricalertrule)       |  [Reference](https://docs.microsoft.com/powershell/module/az.monitor/add-azmetricalertrulev2)    |
| Azure Resource Manager template | [For classic alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-enable-template)|[For new metric alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-metric-create-templates)|

## Notification payload changes

The notification payload format is slightly different between [classic alert rules](alerts-webhooks.md) and [new metric alerts](alerts-metric-near-real-time.md#payload-schema). If you have any webhook, logic app, or runbook actions that are triggered by classic alert rules, you must update those notification endpoints to accept the payload format of new metric alerts.

Use the following table to map the webhook payload fields from the classic format to the new format:

|  |Classic alerts  |New metric alerts |
|---------|---------|---------|
|Was the alert activated or resolved?    | **status**       | **data.status** |
|Contextual information about the alert     | **context**        | **data.context**        |
|Time stamp at which the alert was activated or resolved     | **context.timestamp**       | **data.context.timestamp**        |
| Alert rule ID | **context.id** | **data.context.id** |
| Alert rule name | **context.name** | **data.context.name** |
| Description of the alert rule | **context.description** | **data.context.description** |
| Alert rule condition | **context.condition** | **data.context.condition** |
| Metric name | **context.condition.metricName** | **data.context.condition.allOf[0].metricName** |
| Time aggregation (how the metric is aggregated over the evaluation window)| **data.context.condition.timeAggregation** | **data.context.condition.timeAggregation** |
| Evaluation period | **context.condition.windowSize** | **data.context.condition.windowSize** |
| Operator (how the aggregated metric value is compared against the threshold) | **context.condition.operator** | **data.context.condition.operator** |
| Threshold | **context.condition.threshold** | **data.context.condition.allOf[0].threshold** |
| Metric value | **context.condition.metricValue** | **data.context.condition.allOf[0].metricValue** |
| Subscription ID | **context.subscriptionId** | **data.context.subscriptionId** |
| Resource group of the affected resource | **context.resourceGroup** | **data.context.resourceGroup** |
| Name of the affected resource | **context.resourceName** | **data.context.resourceName** |
| Type of the affected resource | **context.resourceType** | **data.context.resourceType** |
| Resource ID of the affected resource | **context.resourceId** | **data.context.resourceId** |
| Direct link to the portal resource summary page | **context.portalLink** | **data.context.portalLink** |
| Custom payload fields to be passed to the webhook or logic app | **properties** | **data.properties** |

The payloads are similar, as you can see. The following section offers:

- Details about modifying logic apps to work with the new format.
- A runbook example that parses the notification payload for new alerts.

## Modify a logic app to receive a metric alert notification

If you're using logic apps with classic alerts, you must modify your logic-app code to parse the new metric alerts payload. Follow these steps:

1. Create a new logic app.

1. Use the template "Azure Monitor - Metrics Alert Handler". This template has an **HTTP request** trigger with the appropriate schema defined.

    ![logic-app-template](media/alerts-migration/logic-app-template.png "Metric alert template")

1. Add an action to host your processing logic.

## Use an automation runbook that receives a metric alert notification

The following example provides PowerShell code to use in your runbook. This code can parse the payloads for both classic metric alert rules and new metric alert rules.

```PowerShell
## Example PowerShell code to use in a runbook to handle parsing of both classic and new metric alerts.

[OutputType("PSAzureOperationResponse")]

param
(
    [Parameter (Mandatory=$false)]
    [object] $WebhookData
)

$ErrorActionPreference = "stop"

if ($WebhookData)
{
    # Get the data object from WebhookData.
    $WebhookBody = (ConvertFrom-Json -InputObject $WebhookData.RequestBody)

    # Determine whether the alert triggering the runbook is a classic metric alert or a new metric alert (depends on the payload schema).
    $schemaId = $WebhookBody.schemaId
    Write-Verbose "schemaId: $schemaId" -Verbose
    if ($schemaId -eq "AzureMonitorMetricAlert") {

        # This is the new metric alert schema.
        $AlertContext = [object] ($WebhookBody.data).context
        $status = ($WebhookBody.data).status

        # Parse fields related to alert rule condition.
        $metricName = $AlertContext.condition.allOf[0].metricName
        $metricValue = $AlertContext.condition.allOf[0].metricValue
        $threshold = $AlertContext.condition.allOf[0].threshold
        $timeAggregation = $AlertContext.condition.allOf[0].timeAggregation
    }
    elseif ($schemaId -eq $null) {
        # This is the classic metric alert schema.
        $AlertContext = [object] $WebhookBody.context
        $status = $WebhookBody.status

        # Parse fields related to alert rule condition.
        $metricName = $AlertContext.condition.metricName
        $metricValue = $AlertContext.condition.metricValue
        $threshold = $AlertContext.condition.threshold
        $timeAggregation = $AlertContext.condition.timeAggregation
    }
    else {
        # The schema is neither a classic metric alert nor a new metric alert.
        Write-Error "The alert data schema - $schemaId - is not supported."
    }

    # Parse fields related to resource affected.
    $ResourceName = $AlertContext.resourceName
    $ResourceType = $AlertContext.resourceType
    $ResourceGroupName = $AlertContext.resourceGroupName
    $ResourceId = $AlertContext.resourceId
    $SubId = $AlertContext.subscriptionId

    ## Your logic to handle the alert here.
}
else {
    # Error
    Write-Error "This runbook is meant to be started from an Azure alert webhook only."
}

```

For a full example of a runbook that stops a virtual machine when an alert is triggered, see the [Azure Automation documentation](https://docs.microsoft.com/azure/automation/automation-create-alert-triggered-runbook).

## Partner integration via webhooks

Most of [our partners that integrate with classic alerts](https://docs.microsoft.com/azure/azure-monitor/platform/partners) already support newer metric alerts through their integrations. Known integrations that already work with new metric alerts are:

- [PagerDuty](https://www.pagerduty.com/docs/guides/azure-integration-guide/)
- [OpsGenie](https://docs.opsgenie.com/docs/microsoft-azure-integration)
- [Signl4](https://www.signl4.com/blog/mobile-alert-notifications-azure-monitor/)

If you're using a partner integration that's not listed here, confirm with the integration provider that the integration works with new metric alerts.

## Next steps

- [How to use the migration tool](alerts-using-migration-tool.md)
- [Understand how the migration tool works](alerts-understand-migration.md)
