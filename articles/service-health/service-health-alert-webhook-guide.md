---
title: Configure health notifications for existing problem management systems using a webhook | Microsoft Docs
description: Get personalized notifications about service health events to your existing problem management system.
author: shawntabrizi
manager: scotthit
editor: ''
services: service-health
documentationcenter: service-health

ms.assetid:
ms.service: service-health
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/27/2018
ms.author: shtabriz

---

# Configure health notifications for existing problem management systems using a webhook

This article shows you how to configure your service health alerts to send data through Webhooks to your existing notification system.

Today, you can configure service health alerts so that when an Azure Service Incident affects you, you get notified via text message or e-mail.
However, you might already have existing external notification system in place that you would like to use.
This document shows you the most important parts of the webhook payload, and how you can create custom alerts to get notified when service issues affect you.

If you want to use a preconfigured integration, see how to:
* [Configure alerts with ServiceNow](service-health-alert-webhook-servicenow.md)
* [Configure alerts with PagerDuty](service-health-alert-webhook-pagerduty.md)
* [Configure alerts with OpsGenie](service-health-alert-webhook-opsgenie.md)

## Configuring a custom notification using the service health webhook payload
If you want to set up your own custom webhook integration, you need to parse the JSON payload that is sent during service health notifications.

Look [here to see an example](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md) of what the `ServiceHealth` webhook payload looks like.

You can detect this is a service health alert by looking at `context.eventSource == "ServiceHealth"`. From there, the properties that are most relevant to ingest are:
 * `data.context.activityLog.status`
 * `data.context.activityLog.level`
 * `data.context.activityLog.subscriptionId`
 * `data.context.activityLog.properties.title`
 * `data.context.activityLog.properties.impactStartTime`
 * `data.context.activityLog.properties.communication`
 * `data.context.activityLog.properties.impactedServices`
 * `data.context.activityLog.properties.trackingId`

## Creating a direct link to the Service Health dashboard for an incident
You can create a direct link to your Service Health dashboard on desktop or mobile by generating a specialized URL. Use the `trackingId`, as well as the first and last three digits of your `subscriptionId`, to form:
```
https://app.azure.com/h/<trackingId>/<first and last three digits of subscriptionId>
```

For example, if your `subscriptionId` is `bba14129-e895-429b-8809-278e836ecdb3` and your `trackingId` is `0DET-URB`, then your Service Health URL is:

```
https://app.azure.com/h/0DET-URB/bbadb3
```

## Using the level to detect the severity of the issue
From lowest severity to highest severity, the `level` property in the payload can be any of `Informational`, `Warning`, `Error`, and `Critical`.

## Parsing the impacted services to understand the full scope of the incident
Service health alerts can inform you about issues across multiple Regions and services. To get the full details, you need to parse the value of `impactedServices`.
The content inside is a [JSON escaped](http://json.org/) string, when unescaped, contains another JSON object that can be parsed regularly.

```json
{"data.context.activityLog.properties.impactedServices": "[{\"ImpactedRegions\":[{\"RegionName\":\"Australia East\"},{\"RegionName\":\"Australia Southeast\"}],\"ServiceName\":\"Alerts & Metrics\"},{\"ImpactedRegions\":[{\"RegionName\":\"Australia Southeast\"}],\"ServiceName\":\"App Service\"}]"}
```

Becomes:

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

This shows that there are problems with "Alerts & Metrics" in both Australia East and Southeast, as well as problems with "App Service" in Australia Southeast.


## Testing your webhook integration via an HTTP POST request
1. Create the service health payload you want to send. You can find an example service health webhook payload at [Webhooks for Azure activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md).

2. Create an HTTP POST request as follows:

    ```
    POST        https://your.webhook.endpoint

    HEADERS     Content-Type: application/json

    BODY        <service health payload>
    ```
3. You should receive a `2XX - Successful` response.

4. Go to [PagerDuty](https://www.pagerduty.com/) to confirm that your integration was set up successfully.

## Next steps
- Review the [activity log alert webhook schema](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md). 
- Learn about [service health notifications](../monitoring-and-diagnostics/monitoring-service-notifications.md).
- Learn more about [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md).