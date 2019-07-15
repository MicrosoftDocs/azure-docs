---
title: "Understand how the voluntary migration tool works for Azure Monitor alerts"
description: Understand how the alerts migration tool works and troubleshoot problems.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: snmuvva
ms.subservice: alerts
---
# Understand how the migration tool works

As [previously announced](monitoring-classic-retirement.md), classic alerts in Azure Monitor are being retired by August 31, 2019 (was originally June 30, 2019). A migration tool is available in the Azure portal to customers who use classic alert rules and who want to trigger migration themselves.

This article explains how the voluntary migration tool works. It also describes remedies for some common problems.

> [!NOTE]
> Due to delay in roll-out of migration tool, the retirement date for classic alerts migration has been [extended to August 31st, 2019](https://azure.microsoft.com/updates/azure-monitor-classic-alerts-retirement-date-extended-to-august-31st-2019/) from the originally announced date of June 30th, 2019.

## Classic alert rules that will not be migrated

> [!IMPORTANT]
> Activity log alerts (including Service health alerts) and Log alerts are not impacted by the migration. The migration only applies to classic alert rules described [here](monitoring-classic-retirement.md#retirement-of-classic-monitoring-and-alerting-platform).

Although the tool can migrate almost all [classic alert rules](monitoring-classic-retirement.md#retirement-of-classic-monitoring-and-alerting-platform), there are some exceptions. The following alert rules won't be migrated by using the tool (or during the automatic migration starting September 2019):

- Classic alert rules on virtual-machine guest metrics (both Windows and Linux). See the [guidance for recreating such alert rules in new metric alerts](#guest-metrics-on-virtual-machines) later in this article.
- Classic alert rules on classic storage metrics. See the [guidance for monitoring your classic storage accounts](https://azure.microsoft.com/blog/modernize-alerting-using-arm-storage-accounts/).
- Classic alert rules on some storage account metrics. See [details](#storage-account-metrics) later in this article.
- Classic alert rules on some Cosmos DB metrics. See [details](#cosmos-db-metrics) later in this article.
- Classic alert rules on all classic virtual machines and cloud services metrics (Microsoft.ClassicCompute/virtualMachines and Microsoft.ClassicCompute/domainNames/slots/roles). See [details](#classic-compute-metrics) later in this article.

If your subscription has any such classic rules, you must migrate them manually. Because we can't provide an automatic migration, any existing, classic metric alerts of these types will continue to work until June 2020. This extension gives you time to move over to new alerts. However, no new classic alerts can be created after August 2019.

> [!NOTE]
> Besides the above listed exceptions, if your classic alert rules are invalid i.e. they are on [deprecated metrics](#classic-alert-rules-on-deprecated-metrics) or resources that have been deleted, they will not be migrated during voluntary migration. Any such invalid classic alert rules will be deleted when automatic migration happens.

### Guest metrics on virtual machines

Before you can create new metric alerts on guest metrics, the guest metrics must be sent to the Azure Monitor custom metrics store. Follow these instructions to enable the Azure Monitor sink in diagnostic settings:

- [Enabling guest metrics for Windows VMs](collect-custom-metrics-guestos-resource-manager-vm.md)
- [Enabling guest metrics for Linux VMs](collect-custom-metrics-linux-telegraf.md)

After these steps are done, you can create new metric alerts on guest metrics. And after you have created new metric alerts, you can delete classic alerts.

### Storage account metrics

All classic alerts on storage accounts can be migrated except alerts on these metrics:

- PercentAuthorizationError
- PercentClientOtherError
- PercentNetworkError
- PercentServerOtherError
- PercentSuccess
- PercentThrottlingError
- PercentTimeoutError
- AnonymousThrottlingError
- SASThrottlingError
- ThrottlingError

Classic alert rules on Percent metrics must be migrated based on [the mapping between old and new storage metrics](https://docs.microsoft.com/azure/storage/common/storage-metrics-migration#metrics-mapping-between-old-metrics-and-new-metrics). Thresholds will need to be modified appropriately because the new metric available is an absolute one.

Classic alert rules on AnonymousThrottlingError, SASThrottlingError and ThrottlingError must be split into two new alerts because there is no combined metric that provides the same functionality. Thresholds will need to be adapted appropriately.

### Cosmos DB metrics

All classic alerts on Cosmos DB metrics can be migrated except alerts on these metrics:

- Average Requests per Second
- Consistency Level
- Http 2xx
- Http 3xx
- Http 400
- Http 401
- Internal Server Error
- Max RUPM Consumed Per Minute
- Max RUs Per Second
- Mongo Count Failed Requests
- Mongo Delete Failed Requests
- Mongo Insert Failed Requests
- Mongo Other Failed Requests
- Mongo Other Request Charge
- Mongo Other Request Rate
- Mongo Query Failed Requests
- Mongo Update Failed Requests
- Observed Read Latency
- Observed Write Latency
- Service Availability
- Storage Capacity
- Throttled Requests
- Total Requests

Average Requests per Second, Consistency Level, Max RUPM Consumed Per Minute, Max RUs Per Second, Observed Read Latency, Observed Write Latency, Storage Capacity are not currently available in the [new system](metrics-supported.md#microsoftdocumentdbdatabaseaccounts).

Alerts on request metrics like Http 2xx, Http 3xx, Http 400, Http 401, Internal Server Error, Service Availability, Throttled Requests and Total Requests are not migrated because the way requests are counted is different between classic metrics and new metrics. Alerts on these will need to be manually recreated with thresholds adjusted.

Alerts on Mongo Failed Requests metrics must be split into multiple alerts because there is no combined metric that provides the same functionality. Thresholds will need to be adapted appropriately.

### Classic compute metrics

Any alerts on classic compute metrics will not be migrated using the migration tool as classic compute resources are not yet supported with new alerts. Support for new alerts on these resource types will be added in future. Once that is available, customers must recreate new equivalent alert rules based on their classic alert rules before June 2020.

### Classic alert rules on deprecated metrics

These are classic alert rules on metrics which were previously supported but were eventually deprecated. A small percentage of customer might have invalid classic alert rules on such metrics. Since these alert rules are invalid, they won't be migrated.

| Resource type| Deprecated metric(s) |
|-------------|----------------- |
| Microsoft.DBforMySQL/servers | compute_consumption_percent, compute_limit |
| Microsoft.DBforPostgreSQL/servers | compute_consumption_percent, compute_limit |
| Microsoft.Network/publicIPAddresses | defaultddostriggerrate |
| Microsoft.SQL/servers/databases | service_level_objective, storage_limit, storage_used, throttling, dtu_consumption_percent, storage_used |
| Microsoft.Web/hostingEnvironments/multirolepools | averagememoryworkingset |
| Microsoft.Web/hostingEnvironments/workerpools | bytesreceived, httpqueuelength |

## How equivalent new alert rules and action groups are created

The migration tool converts your classic alert rules to equivalent new alert rules and action groups. For most classic alert rules, equivalent new alert rules are on the same metric with the same properties such as `windowSize` and `aggregationType`. However, there are some classic alert rules are on metrics that have a different, equivalent metric in the new system. The following principles apply to the migration of classic alerts unless specified in the section below:

- **Frequency**: Defines how often a classic or new alert rule checks for the condition. The `frequency` in classic alert rules was not configurable by the user and was always 5 mins for all resource types except Application Insights components for which it was 1 min. So frequency of equivalent rules is also set to 5 min and 1 min respectively.
- **Aggregation Type**: Defines how the metric is aggregated over the window of interest. The `aggregationType` is also the same between classic alerts and new alerts for most metrics. In some cases, since the metric is different between classic alerts and new alerts, equivalent `aggregationType` or the `primary Aggregation Type` defined for the metric is used.
- **Units**: Property of the metric on which alert is created. Some equivalent metrics have different units. The threshold is adjusted appropriately as needed. For example, if the original metric has seconds as units but equivalent new metric has milliSeconds as units, the original threshold is multiplied by 1000 to ensure same behavior.
- **Window Size**: Defines the window over which metric data is aggregated to compare against the threshold. For standard `windowSize` values like 5mins, 15mins, 30mins, 1hour, 3hours, 6 hours, 12 hours, 1 day, there is no change made for equivalent new alert rule. For other values, the closest `windowSize` is chosen to be used. For most customers, there is no impact with this change. For a small percentage of customers, there might be a need to tweak the threshold to get exact same behavior.

In the following sections, we detail the metrics that have a different, equivalent metric in the new system. Any metric that remains the same for classic and new alert rules is not listed. You can find a list of metrics supported in the new system [here](metrics-supported.md).

### Microsoft.StorageAccounts/services

For Storage account services like blob, table, file and queue, the following metrics are mapped to equivalent metrics as shown below:

| Metric in classic alerts | Equivalent metric in new alerts | Comments|
|--------------------------|---------------------------------|---------|
| AnonymousAuthorizationError| Transactions metric with dimensions "ResponseType"="AuthorizationError" and "Authentication" = "Anonymous"| |
| AnonymousClientOtherError | Transactions metric with dimensions "ResponseType"="ClientOtherError" and "Authentication" = "Anonymous" | |
| AnonymousClientTimeOutError| Transactions metric with dimensions "ResponseType"="ClientTimeOutError" and "Authentication" = "Anonymous" | |
| AnonymousNetworkError | Transactions metric with dimensions "ResponseType"="NetworkError" and "Authentication" = "Anonymous" | |
| AnonymousServerOtherError | Transactions metric with dimensions "ResponseType"="ServerOtherError" and "Authentication" = "Anonymous" | |
| AnonymousServerTimeOutError | Transactions metric with dimensions "ResponseType"="ServerTimeOutError" and "Authentication" = "Anonymous" | |
| AnonymousSuccess | Transactions metric with dimensions "ResponseType"="Success" and "Authentication" = "Anonymous" | |
| AuthorizationError | Transactions metric with dimensions "ResponseType"="AuthorizationError" | |
| AverageE2ELatency | SuccessE2ELatency | |
| AverageServerLatency | SuccessServerLatency | |
| Capacity | BlobCapacity | Use `aggregationType` 'average' instead of 'last'. Metric only applies to Blob services |
| ClientOtherError | Transactions metric with dimensions "ResponseType"="ClientOtherError"  | |
| ClientTimeoutError | Transactions metric with dimensions "ResponseType"="ClientTimeOutError" | |
| ContainerCount | ContainerCount | Use `aggregationType` 'average' instead of 'last'. Metric only applies to Blob services |
| NetworkError | Transactions metric with dimensions "ResponseType"="NetworkError" | |
| ObjectCount | BlobCount| Use `aggregationType` 'average' instead of 'last'. Metric only applies to Blob services |
| SASAuthorizationError | Transactions metric with dimensions "ResponseType"="AuthorizationError" and "Authentication" = "SAS" | |
| SASClientOtherError | Transactions metric with dimensions "ResponseType"="ClientOtherError" and "Authentication" = "SAS" | |
| SASClientTimeOutError | Transactions metric with dimensions "ResponseType"="ClientTimeOutError" and "Authentication" = "SAS" | |
| SASNetworkError | Transactions metric with dimensions "ResponseType"="NetworkError" and "Authentication" = "SAS" | |
| SASServerOtherError | Transactions metric with dimensions "ResponseType"="ServerOtherError" and "Authentication" = "SAS" | |
| SASServerTimeOutError | Transactions metric with dimensions "ResponseType"="ServerTimeOutError" and "Authentication" = "SAS" | |
| SASSuccess | Transactions metric with dimensions "ResponseType"="Success" and "Authentication" = "SAS" | |
| ServerOtherError | Transactions metric with dimensions "ResponseType"="ServerOtherError" | |
| ServerTimeOutError | Transactions metric with dimensions "ResponseType"="ServerTimeOutError"  | |
| Success | Transactions metric with dimensions "ResponseType"="Success" | |
| TotalBillableRequests| Transactions | |
| TotalEgress | Egress | |
| TotalIngress | Ingress | |
| TotalRequests | Transactions | |

### Microsoft.insights/components

For Application Insights, equivalent metrics are as shown below:

| Metric in classic alerts | Equivalent metric in new alerts | Comments|
|--------------------------|---------------------------------|---------|
| availability.availabilityMetric.value | availabilityResults/availabilityPercentage|   |
| availability.durationMetric.value | availabilityResults/duration| Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds.  |
| basicExceptionBrowser.count | exceptions/browser|  Use `aggregationType` 'count' instead of 'sum'. |
| basicExceptionServer.count | exceptions/server| Use `aggregationType` 'count' instead of 'sum'.  |
| clientPerformance.clientProcess.value | browserTimings/processingDuration| Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds.  |
| clientPerformance.networkConnection.value | browserTimings/networkDuration|  Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds. |
| clientPerformance.receiveRequest.value | browserTimings/receiveDuration| Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds.  |
| clientPerformance.sendRequest.value | browserTimings/sendDuration| Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds.  |
| clientPerformance.total.value | browserTimings/totalDuration| Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds.  |
| performanceCounter.available_bytes.value | performanceCounters/memoryAvailableBytes|   |
| performanceCounter.io_data_bytes_per_sec.value | performanceCounters/processIOBytesPerSecond|   |
| performanceCounter.number_of_exceps_thrown_per_sec.value | performanceCounters/exceptionsPerSecond|   |
| performanceCounter.percentage_processor_time_normalized.value | performanceCounters/processCpuPercentage|   |
| performanceCounter.percentage_processor_time.value | performanceCounters/processCpuPercentage| Threshold will need to be appropriately modified as original metric was across all cores and new metric is normalized to one core. Migration tool doesn't change thresholds.  |
| performanceCounter.percentage_processor_total.value | performanceCounters/processorCpuPercentage|   |
| performanceCounter.process_private_bytes.value | performanceCounters/processPrivateBytes|   |
| performanceCounter.request_execution_time.value | performanceCounters/requestExecutionTime|   |
| performanceCounter.requests_in_application_queue.value | performanceCounters/requestsInQueue|   |
| performanceCounter.requests_per_sec.value | performanceCounters/requestsPerSecond|   |
| request.duration | requests/duration| Multiply original threshold by 1000 as units for classic metric are in seconds and for new one are in milliSeconds.  |
| request.rate | requests/rate|   |
| requestFailed.count | requests/failed| Use `aggregationType` 'count' instead of 'sum'.   |
| view.count | pageViews/count| Use `aggregationType` 'count' instead of 'sum'.   |

### Microsoft.DocumentDB/databaseAccounts

For Cosmos DB, equivalent metrics are as shown below:

| Metric in classic alerts | Equivalent metric in new alerts | Comments|
|--------------------------|---------------------------------|---------|
| AvailableStorage     |AvailableStorage|   |
| Data Size | DataUsage| |
| Document Count | DocumentCount||
| Index Size | IndexUsage||
| Mongo Count Request Charge| MongoRequestCharge with dimension "CommandName" = "count"||
| Mongo Count Request Rate | MongoRequestsCount with dimension "CommandName" = "count"||
| Mongo Delete Request Charge | MongoRequestCharge with dimension "CommandName" = "delete"||
| Mongo Delete Request Rate | MongoRequestsCount with dimension "CommandName" = "delete"||
| Mongo Insert Request Charge | MongoRequestCharge with dimension "CommandName" = "insert"||
| Mongo Insert Request Rate | MongoRequestsCount with dimension "CommandName" = "insert"||
| Mongo Query Request Charge | MongoRequestCharge with dimension "CommandName" = "find"||
| Mongo Query Request Rate | MongoRequestsCount with dimension "CommandName" = "find"||
| Mongo Update Request Charge | MongoRequestCharge with dimension "CommandName" = "update"||
| Service Unavailable| ServiceAvailability||
| TotalRequestUnits | TotalRequestUnits||

### How equivalent action groups are created

Classic alert rules had email, webhook, logic app and runbook actions tied to the alert rule itself. New alert rules use action groups which can be reused across multiple alert rules. The migration tool creates single action group for same actions irrespective of how many alert rules are using the action. Action groups created by the migration tool use the naming format 'Migrated_AG*'.

> [!NOTE]
> Classic alerts sent localized emails based on the locale of classic administrator when used to notify classic administrator roles. New alert emails are sent via Action Groups and are only in English.

## Rollout phases

The migration tool is rolling out in phases to customers that use classic alert rules. Subscription owners will receive an email when the subscription is ready to be migrated by using the tool.

> [!NOTE]
> Because the tool is being rolled out in phases, you might see that some of your subscriptions are not yet ready to be migrated during the early phases.

Most of the subscriptions are currently marked as ready for migration. Only subscriptions that have classic alerts on following resource types are still not ready for migration.

- Microsoft.classicCompute/domainNames/slots/roles
- Microsoft.insights/components

## Who can trigger the migration?

Any user who has the built-in role of Monitoring Contributor at the subscription level can trigger the migration. Users who have a custom role with the following permissions can also trigger the migration:

- */read
- Microsoft.Insights/actiongroups/*
- Microsoft.Insights/AlertRules/*
- Microsoft.Insights/metricAlerts/*
- Microsoft.AlertsManagement/smartDetectorRules/*

> [!NOTE]
> In addition to having above permissions, your subscription should additionally be registered with Microsoft.AlertsManagement resource provider. This is required to successfully migrate Failure Anomaly alerts on Application Insights. 

## Common problems and remedies

After you [trigger the migration](alerts-using-migration-tool.md), you'll receive email at the addresses you provided to notify you that migration is complete or if any action is needed from you. This section describes some common problems and how to deal with them.

### Validation failed

Due to some recent changes to classic alert rules in your subscription, the subscription cannot be migrated. This problem is temporary. You can restart the migration after the migration status moves back **Ready for migration** in a few days.

### Policy or scope lock preventing us from migrating your rules

As part of the migration, new metric alerts and new action groups will be created, and then classic alert rules will be deleted. However, there's either a policy or scope lock preventing us from creating resources. Depending on the policy or scope lock, some or all rules could not be migrated. You can resolve this problem by removing the scope lock or policy temporarily and triggering the migration again.

## Next steps

- [How to use the migration tool](alerts-using-migration-tool.md)
- [Prepare for the migration](alerts-prepare-migration.md)
