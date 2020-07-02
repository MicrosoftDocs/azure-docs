---
title: Send Azure Service Health notifications via webhooks
description: Send personalized notifications about service health events to your existing problem management system.
ms.topic: conceptual
ms.service: service-health
ms.date: 3/27/2018

---

# Use a webhook to configure health notifications for problem management systems

This article shows you how to configure Azure Service Health alerts to send data through webhooks to your existing notification system.

You can configure Service Health alerts to notify you by text message or email when an Azure service incident affects you.

But you might already have an existing external notification system in place that you prefer to use. This article identifies the most important parts of the webhook payload. And it describes how to create custom alerts to notify you when relevant service issues occur.

If you want to use a preconfigured integration, see:
* [Configure alerts with ServiceNow](service-health-alert-webhook-servicenow.md)
* [Configure alerts with PagerDuty](service-health-alert-webhook-pagerduty.md)
* [Configure alerts with OpsGenie](service-health-alert-webhook-opsgenie.md)

**Watch an introductory video:**

>[!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUV]

## Configure a custom notification by using the Service Health webhook payload
To set up your own custom webhook integration, you need to parse the JSON payload that's sent via Service Health notification.

See [an example](../azure-monitor/platform/activity-log-alerts-webhook.md) `ServiceHealth` webhook payload.

You can confirm that it's a service health alert by looking at `context.eventSource == "ServiceHealth"`. The following properties are the most relevant:
- **data.context.activityLog.status**
- **data.context.activityLog.level**
- **data.context.activityLog.subscriptionId**
- **data.context.activityLog.properties.title**
- **data.context.activityLog.properties.impactStartTime**
- **data.context.activityLog.properties.communication**
- **data.context.activityLog.properties.impactedServices**
- **data.context.activityLog.properties.trackingId**

## Create a link to the Service Health dashboard for an incident
You can create a direct link to your Service Health dashboard on a desktop or mobile device by generating a specialized URL. Use the *trackingId* and the first three and last three digits of your *subscriptionId* in this format:

https<i></i>://app.azure.com/h/*&lt;trackingId&gt;*/*&lt;first three and last three digits of subscriptionId&gt;*

For example, if your *subscriptionId* is bba14129-e895-429b-8809-278e836ecdb3 and your *trackingId* is 0DET-URB, your Service Health URL is:

https<i></i>://app.azure.com/h/0DET-URB/bbadb3

## Use the level to detect the severity of the issue
From lowest to highest severity, the **level** property in the payload can be *Informational*, *Warning*, *Error*, or *Critical*.

## Parse the impacted services to determine the incident scope
Service Health alerts can inform you about issues across multiple regions and services. To get  complete details, you need to parse the value of `impactedServices`.

The content that's inside is an escaped [JSON](https://json.org/) string that, when unescaped, contains another JSON object that can be parsed regularly. For example:

```json
{"data.context.activityLog.properties.impactedServices": "[{\"ImpactedRegions\":[{\"RegionName\":\"Australia East\"},{\"RegionName\":\"Australia Southeast\"}],\"ServiceName\":\"Alerts & Metrics\"},{\"ImpactedRegions\":[{\"RegionName\":\"Australia Southeast\"}],\"ServiceName\":\"App Service\"}]"}
```

becomes:

```json
[
   {
      "ImpactedRegions":[
         {
            "RegionName":"Australia East"
         },
         {
            "RegionName":"Australia Southeast"
         }
      ],
      "ServiceName":"Alerts & Metrics"
   },
   {
      "ImpactedRegions":[
         {
            "RegionName":"Australia Southeast"
         }
      ],
      "ServiceName":"App Service"
   }
]
```

This example shows problems for:
- "Alerts & Metrics" in Australia East and Australia Southeast.
- "App Service" in Australia Southeast.

## Test your webhook integration via an HTTP POST request

Follow these steps:

1. Create the service health payload that you want to send. See an example service health webhook payload at [Webhooks for Azure activity log alerts](../azure-monitor/platform/activity-log-alerts-webhook.md).

1. Create an HTTP POST request as follows:

    ```
    POST        https://your.webhook.endpoint

    HEADERS     Content-Type: application/json

    BODY        <service health payload>
    ```
   You should receive a "2XX - Successful" response.

1. Go to [PagerDuty](https://www.pagerduty.com/) to confirm that your integration was set up successfully.

## Next steps
- Review the [activity log alert webhook schema](../azure-monitor/platform/activity-log-alerts-webhook.md). 
- Learn about [service health notifications](../azure-monitor/platform/service-notifications.md).
- Learn more about [action groups](../azure-monitor/platform/action-groups.md).