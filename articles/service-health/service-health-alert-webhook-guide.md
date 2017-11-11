# Configure webhook notifications for existing problem management systems

This article shows you how to configure your Service Health alerts to send data through Webhooks to your existing notification system.

Today, you can configure Service Health Alerts so that when an Azure Service Incident affects you, you get notified via SMS or e-mail, and equipped with the information to follow up and track the incident.
However, you might already have existing external notification system in place that you would like to use.
We show you the most important parts of the webhook payload, and how you can create custom alerts to get notified when service issues affect you.

If you want to use our preconfigured integrations, see how to:
* [Configure alerts with OpsGenie](service-health-alert-webhook-opsgenie.md)
* [Configure alerts with PagerDuty](service-health-alert-webhook-pagerduty.md)
* [Configure alerts with ServiceNow](service-health-alert-webhook-servicenow.md)

## Configuring a custom service health alert using the webhook payload
If you want to set up your own custom webhook integration, you need to parse the JSON payload that we send during Service Health notifications.

Look [here to see an example](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md) of what the `Service Health` webhook payload looks like.

You can detect this is a Service Health alert by looking at `context.eventSource == "ServiceHealth"`. From there, the properties which are most relevant to ingest are:
 * `data.context.activityLog.status`
 * `data.context.activityLog.level`
 * `data.context.activityLog.subscriptionId`
 * `data.context.activityLog.properties.title`
 * `data.context.activityLog.properties.impactStartTime`
 * `data.context.activityLog.properties.communication`
 * `data.context.activityLog.properties.impactedServices`
 * `data.context.activityLog.properties.trackingId`

#### Creating a Direct Link to Azure Service Health for an Incident
You can create a direct link to your personalized Azure Service Health incident on desktop or mobile by generating the following URL using the `trackingId` as well as the first and last 3 digits of your `subscriptionId`:
```
https://app.azure.com/h/<trackingId>/<first and last 3 digits of subscriptionId>
```

For example, if your `subscriptionId` is `45529734-0ed9-4895-a0df-44b59a5a07f9` and your `trackingId` is `0NIH-U2O`, then your personalized Azure Service Health URL is:

```
https://app.azure.com/h/0NIH-U2O/4557f9
```

#### Using the level to detect the severity of the issue
From lowest severity to highest severity, the `level` property in the payload can be any of `Informational`, `Warning`, `Error`, and `Critical`.

#### Parsing the Impacted Services to understand the full scope of the Incident
Service Health Alerts can inform you about issues across multiple Regions and services. To get the full details, you need to parse the value of `impactedServices`.
The content inside is a [JSON escaped](http://json.org/) string which, when unescaped, contains another JSON object which can be parsed regularly.

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


