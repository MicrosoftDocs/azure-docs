---
title: Autoscale diagnostics
description: This article shows you how to configure diagnostics in autoscale.
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: how-to
ms.date: 01/25/2023
ms.reviewer: akkumari

# Customer intent: As a DevOps admin, I want to collect and analyze autoscale metrics and logs.
---
# Diagnostic settings in autoscale

Autoscale has two log categories and a set of metrics that can be enabled via the **Diagnostics settings** tab on the **Autoscale setting** page.

:::image type="content" source="./media/autoscale-diagnostics/autoscale-diagnostics-menu.png" alt-text="Screenshot that shows the menu on the Autoscale setting page.":::

The two categories are:

* [Autoscale Evaluations](/azure/azure-monitor/reference/tables/autoscaleevaluationslog) contain log data relating to rule evaluation.
* [Autoscale Scale Actions](/azure/azure-monitor/reference/tables/autoscalescaleactionslog) log data relating to each scale event.

For more information about autoscale metrics, see the [Supported metrics](../essentials/metrics-supported.md#microsoftinsightsautoscalesettings) document.

You can send logs and metrics to various destinations:

* Log Analytics workspaces
* Storage accounts
* Event hubs
* Partner solutions

For more information on diagnostics, see [Diagnostic settings in Azure Monitor](../essentials/diagnostic-settings.md?tabs=portal).

## Run history

View the history of your autoscale activity on the **Run history** tab. The **Run history** tab includes a chart of resource instance counts over time and the resource activity log entries for autoscale.

:::image type="content" source="./media/autoscale-diagnostics/autoscale-run-history.png" alt-text="Screenshot that shows the Run history tab on the Autoscale setting page.":::

## Resource log schemas

The following examples are the general formats for autoscale resource logs with example data included. Not all the examples are properly formed JSON because they might include a valid list for a given field.

Use these logs to troubleshoot issues in autoscale. For more information, see [Troubleshooting autoscale problems](autoscale-troubleshoot.md).

> [!NOTE]
> Although the logs may refer to "scale up" and "scale down" actions, the actual action taken is scale in or scale out.  

## Autoscale evaluations log
The following schemas appear in the autoscale evaluations log.

### Profile evaluation

Logged when autoscale first looks at an autoscale profile:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": ["FixedDateProfileEvaluation", "RecurrentProfileEvaluation", "DefaultProfileEvaluation"],
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "profile": "defaultProfile",
    "profileSelected": [true, false]
  }
}
```

### Profile cool-down evaluation

Logged when autoscale evaluates if it shouldn't scale because of a cool-down period:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "ScaleRuleCooldownEvaluation",
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "selectedProfile": "defaultProfile",
    "scaleDirection": ["Increase", "Decrease"]
    "lastScaleActionTime": "2018-09-10 18:08:00.6132593",
    "cooldown": "00:30:00",
    "evaluationTime": "2018-09-10 18:11:00.6132593",
    "skipRuleEvaluationForCooldown": true
  }
}
```

### Rule evaluation

Logged when autoscale first starts evaluating a particular scale rule:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "ScaleRuleEvaluation",
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "timeGrain": "00:01:00",
    "timeGrainStatistic": "Average",
    "timeWindow": "00:10:00",
    "timeAggregationType": "Average",
    "operator": "GreaterThan",
    "threshold": 70,
    "observedValue": 25,
    "estimateScaleResult": ["Triggered", "NotTriggered", "Unknown"]
  }
}
```

### Metric evaluation

Logged when autoscale evaluates the metric being used to trigger a scale action:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "MetricEvaluation",
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "timeGrain": "00:01:00",
    "timeGrainStatistic": "Average",
    "startTime": "2018-09-10 18:00:00.43833793",
    "endTime": "2018-09-10 18:10:00.43833793",
    "data": [0.33333333333333331,0.16666666666666666,1.0,0.33333333333333331,2.0,0.16666666666666666,9.5]
  }
}
```

### Instance count evaluation

Logged when autoscale evaluates the number of instances already running in preparation for deciding if it should start more, shut down some, or do nothing:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "InstanceCountEvaluation",
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "currentInstanceCount": 20,
    "minimumInstanceCount": 15,
    "maximumInstanceCount": 30,
    "defaultInstanceCount": 20
  }
}
```

### Scale action evaluation

Logged when autoscale starts evaluation if a scale action should take place:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "ScaleActionOperationEvaluation",
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "lastScaleActionOperationId": "378ejr-7yye-892d-17dd-92ndijfe1738",
    "lastScaleActionOperationStatus": ["InProgress", "Timeout"]
	"skipCurrentAutoscaleEvaluation": [true, false]
  }
}
```

### Instance update evaluation

Logged when autoscale updates the number of compute instances running, either up or down:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "InstanceUpdateEvaluation",
  "category": "AutoscaleEvaluations",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "currentInstanceCount": 20,
    "newInstanceCount": 21,
    "shouldUpdateInstance": [true, false],
    "reason": ["Scale down action triggered", "Scale up to default instance count", ...]
  }
}
```

## Autoscale scale actions log

The following schemas appear in the autoscale evaluations log.

### Scale action

Logged when autoscale initiates a scale action, either up or down:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "InstanceScaleAction",
  "category": "AutoscaleScaleActions",
  "resultType": ["Succeeded", "InProgress", "Failed"],
  "resultDescription": ["Create async operation job failed", ...]
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "currentInstanceCount": 20,
    "newInstanceCount": 21,
    "scaleDirection": ["Increase", "Decrease"],
    ["createdAsyncScaleActionJob": [true, false],]
    ["createdAsyncScaleActionJobId": "378ejr-7yye-892d-17dd-92ndijfe1738",]
  }
}
```

### Scale action tracking

Logged at different intervals of an instance scale action:

```JSON
{
  "time": "2018-09-10 18:12:00.6132593",
  "resourceId": "/SUBSCRIPTIONS/BA13C41D-C957-4774-8A37-092D62ACFC85/RESOURCEGROUPS/AUTOSCALETRACKING12042017/PROVIDERS/MICROSOFT.INSIGHTS/AUTOSCALESETTINGS/DEFAULTSETTING",
  "operationName": "InstanceScaleAction",
  "category": "AutoscaleScaleActions",
  "correlationId": "e8f67045-f381-445d-bc2d-eeff81ec0d77",
  "property": {
    "targetResourceId": "/subscriptions/d45c994a-809b-4cb3-a952-e75f8c488d23/resourceGroups/RingAhoy/providers/Microsoft.Web/serverfarms/ringahoy",
    "scaleActionOperationId": "378ejr-7yye-892d-17dd-92ndijfe1738",
    "scaleActionOperationStatus": ["InProgress", "Timeout", "Canceled", ...],
    "scaleActionMessage": ["Scale action is inprogress", ...]
  }
}
```

## Activity logs
The following events are logged to the activity log with a `CategoryValue` of `Autoscale`:

* Autoscale scale-up initiated
* Autoscale scale-up completed
* Autoscale scale-down initiated
* Autoscale scale-down completed
* Predictive autoscale scale-up initiated
* Predictive autoscale scale-up completed
* Metric failure
* Metric recovery
* Predictive metric failure
* Flapping

An extract of each log event name, showing the relevant parts of the `Properties` element, are shown next.

### Autoscale action

Logged when autoscale attempts to scale in or out:

```JSON
{
   "eventCategory": "Autoscale",
    "eventName": "AutoscaleAction",
    ...
    "eventProperties": "{
        "Description": "The autoscale engine attempting to scale resource '/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourcegroups/ed-rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan' from 2 instances count to 1 instancescount.",
        "ResourceName": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourcegroups/ed-rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan",
        "OldInstancesCount": 2,
        "NewInstancesCount": 1,
        "ActiveAutoscaleProfile": {
            "Name": "Default scale condition",
            "Capacity": {
                "Minimum": "1",
                "Maximum": "5",
                "Default": "1"
            },
            "Rules": [
                {
                    "MetricTrigger": {
                        "Name": "CpuPercentage",
                        "Namespace": "microsoft.web/serverfarms",
                        "Resource": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/ed-rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan",
                        "ResourceLocation": "West Central US",
                        "TimeGrain": "PT1M",
                        "Statistic": "Average",
                        "TimeWindow": "PT2M",
                        "TimeAggregation": "Average",
                        "Operator": "GreaterThan",
                        "Threshold": 40.0,
                        "Source": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/ed-rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan",
                        "MetricType": "MDM",
                        "Dimensions": [],
                        "DividePerInstance": false
                    },
                    "ScaleAction": {
                        "Direction": "Increase",
                        "Type": "ChangeCount",
                        "Value": "1",
                        "Cooldown": "PT3M"
                    }
                },
                {
                    "MetricTrigger": {
                        "Name": "CpuPercentage",
                        "Namespace": "microsoft.web/serverfarms",
                        "Resource": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/ed-rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan",
                        "ResourceLocation": "West Central US",
                        "TimeGrain": "PT1M",
                        "Statistic": "Average",
                        "TimeWindow": "PT5M",
                        "TimeAggregation": "Average",
                        "Operator": "LessThanOrEqual",
                        "Threshold": 30.0,
                        "Source": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/ed-rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan",
                        "MetricType": "MDM",
                        "Dimensions": [],
                        "DividePerInstance": false
                    },
                    "ScaleAction": {
                        "Direction": "Decrease",
                        "Type": "ExactCount",
                        "Value": "1",
                        "Cooldown": "PT5M"
                    }
                }
            ]
                },
    "LastScaleActionTime": "Thu, 26 Jan 2023 12:57:14 GMT"
    }",
    ...
   "activityStatusValue": "Succeeded"
}

```

### Get operation status result

Logged following a scale event:

```JSON

"Properties":{
    "eventCategory": "Autoscale",
    "eventName": "GetOperationStatusResult",
    ...
    "eventProperties": "{"OldInstancesCount":3,"NewInstancesCount":2}",
    ...
    "activityStatusValue": "Succeeded"
}

```

### Metric failure

Logged when autoscale can't determine the value of the metric used in the scale rule:

```JSON
"Properties":{
    "eventCategory": "Autoscale",
    "eventName": "MetricFailure",
    ...
    "eventProperties": "{
        "Notes":"To ensure service availability, Autoscale will scale out the resource to the default capacity if it is greater than the current capacity}",
    ...
    "activityStatusValue": "Failed"
}
```

### Metric recovery

Logged when autoscale can once again determine the value of the metric used in the scale rule after a `MetricFailure` event:

```JSON
"Properties":{
    "eventCategory": "Autoscale",
    "eventName": "MetricRecovery",
    ...
    "eventProperties": "{}",
    ...
    "activityStatusValue": "Succeeded"
}
```

### Predictive metric failure

Logged when autoscale can't calculate predicted scale events because the metric is unavailable:

```JSON
"Properties": {
    "eventCategory": "Autoscale",
    "eventName": "PredictiveMetricFailure",
    ...
    "eventProperties": "{
        "Notes": "To ensure service availability, Autoscale will scale out the resource to the default capacity if it is greater than the current capacity"
    }",
   ...
    "activityStatusValue": "Failed"
}
```

### Flapping occurred

Logged when autoscale detects flapping could occur and scales differently to avoid it:

```JSON
"Properties":{
    "eventCategory": "Autoscale",
    "eventName": "FlappingOccurred",
    ...
    "eventProperties": 
        "{"Description":"Scale down will occur with updated instance count to avoid flapping. 
         Resource: '/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourcegroups/rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan'.
         Current instance count: '6', 
         Intended new instance count: '1'.
         Actual new instance count: '4'",
        "ResourceName":"/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourcegroups/rg-001/providers/Microsoft.Web/serverFarms/ScaleableAppServicePlan",
        "OldInstancesCount":6,
        "NewInstancesCount":4,
        "ActiveAutoscaleProfile":{"Name":"Auto created scale condition",
        "Capacity":{"Minimum":"1","Maximum":"30","Default":"1"},
        "Rules":[{"MetricTrigger":{"Name":"Requests","Namespace":"microsoft.web/sites","Resource":"/subscriptions/    d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/Microsoft.Web/sites/ScaleableWebApp1",    "ResourceLocation":"West Central US","TimeGrain":"PT1M","Statistic":"Average","TimeWindow":"PT1M","TimeAggregation":"Maximum",    "Operator":"GreaterThanOrEqual","Threshold":3.0,"Source":"/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/    rg-001/providers/Microsoft.Web/sites/ScaleableWebApp1","MetricType":"MDM","Dimensions":[],"DividePerInstance":true},    "ScaleAction":{"Direction":"Increase","Type":"ChangeCount","Value":"10","Cooldown":"PT1M"}},{"MetricTrigger":{"Name":"Requests",    "Namespace":"microsoft.web/sites","Resource":"/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/    providers/Microsoft.Web/sites/ScaleableWebApp1","ResourceLocation":"West Central US","TimeGrain":"PT1M","Statistic":"Max",    "TimeWindow":"PT1M","TimeAggregation":"Maximum","Operator":"LessThan","Threshold":3.0,"Source":"/subscriptions/    d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/Microsoft.Web/sites/ScaleableWebApp1","MetricType":"MDM",    "Dimensions":[],"DividePerInstance":true},"ScaleAction":{"Direction":"Decrease","Type":"ChangeCount","Value":"5",    "Cooldown":"PT1M"}}]}}",
    ...
    "activityStatusValue": "Succeeded"
}
```

### Flapping

Logged when autoscale detects flapping could occur and defers scaling in to avoid it:

```JSON
"Properties": {
    "eventCategory": "Autoscale",
    "eventName": "Flapping",
    "Description": "{"Cannot scale down due to flapping observed. Resource: '/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourcegroups/rg-001/providers/Microsoft.Compute/virtualMachineScaleSets/mac2'. Current instance count: '2', Intended new instance count '1'",
    "ResourceName": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourcegroups/rg-001/providers/Microsoft.Compute/virtualMachineScaleSets/mac2",
    "OldInstancesCount": "2",
    "NewInstancesCount": "2",
    "ActiveAutoscaleProfile": "ActiveAutoscaleProfile": {
        "Name": "Auto created default scale condition",
        "Capacity": {
            "Minimum": "1",
            "Maximum": "2",
            "Default": "1"
        },
        "Rules": [
            {
                "MetricTrigger": {
                    "Name": "StorageSuccesses",
                    "Namespace": "monitoringbackgroundjob",
                    "Resource": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/microsoft.monitor/accounts/MACAzureInsightsPROD",
                    "ResourceLocation": "EastUS2",
                    "TimeGrain": "PT1M",
                    "Statistic": "Average",
                    "TimeWindow": "PT10M",
                    "TimeAggregation": "Average",
                    "Operator": "LessThan",
                    "Threshold": 600.0,
                    "Source": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/microsoft.monitor/accounts/MACAzureInsightsPROD",
                    "MetricType": "MDM",
                    "Dimensions": [],
                    "DividePerInstance": false
                },
                "ScaleAction": {
                    "Direction": "Decrease",
                    "Type": "ChangeCount",
                    "Value": "1",
                    "Cooldown": "PT5M"
                }
            },
            {
                "MetricTrigger": {
                    "Name": "TimeToStartupInMs",
                    "Namespace": "armrpclient",
                    "Resource": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-123/providers/microsoft.monitor/accounts/MACMetricsRP",
                    "ResourceLocation": "eastus2",
                    "TimeGrain": "PT1M",
                    "Statistic": "Percentile99th",
                    "TimeWindow": "PT10M",
                    "TimeAggregation": "Average",
                    "Operator": "GreaterThan",
                    "Threshold": 70.0,
                    "Source": "/subscriptions/d1234567-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-123/providers/microsoft.monitor/accounts/MACMetricsRP",
                    "MetricType": "MDM",
                    "Dimensions": [],
                    "DividePerInstance": false
                },
                "ScaleAction": {
                    "Direction": "Increase",
                    "Type": "ChangeCount",
                    "Value": "1",
                    "Cooldown": "PT5M"
                }
            }
        ]
    }"
}...
```

## Next steps

* [Troubleshooting autoscale](./autoscale-troubleshoot.md)
* [Autoscale flapping](./autoscale-flapping.md)
* [Autoscale settings](./autoscale-understanding-settings.md)
