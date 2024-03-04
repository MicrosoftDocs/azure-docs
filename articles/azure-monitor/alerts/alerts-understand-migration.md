---
title: Understand migration for Azure Monitor alerts
description: Understand how the alerts migration works and troubleshoot problems.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 06/20/2023
ms.reviewer: yalavi
---
# Understand migration options to newer alerts

Classic alerts are [retired](./monitoring-classic-retirement.md) for public cloud users. Classic alerts for Azure Government cloud and Microsoft Azure operated by 21Vianet will retire on **29 February 2024**.

This article explains how the manual migration and voluntary migration tool work, which will be used to migrate remaining alert rules. It also describes solutions for some common problems.

> [!IMPORTANT]
> Activity log alerts (including Service health alerts) and Log alerts are not impacted by the migration. The migration only applies to classic alert rules described [here](./monitoring-classic-retirement.md#retirement-of-classic-monitoring-and-alerting-platform).

> [!NOTE]
> If your classic alert rules are invalid i.e. they are on [deprecated metrics](#classic-alert-rules-on-deprecated-metrics) or resources that have been deleted, they will not be migrated and will not be available after service is retired.

## Manually migrating classic alerts to newer alerts

Customers that are interested in manually migrating their remaining alerts can already do so using the following sections. It also includes metrics that are retired and so cannot be migrated directly.

### Guest metrics on virtual machines

Before you can create new metric alerts on guest metrics, the guest metrics must be sent to the Azure Monitor logs store. Follow these instructions to create alerts:

- [Enabling guest metrics collection to log analytics](../agents/agent-data-sources.md)
- [Creating log alerts in Azure Monitor](./alerts-log.md)

There are more options to collect guest metrics and alert on them, [learn more](../agents/agents-overview.md).

### Storage and Classic Storage account metrics

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

Classic alert rules on Percent metrics must be migrated based on [the mapping between old and new storage metrics](../../storage/common/storage-metrics-migration.md#metrics-mapping-between-old-metrics-and-new-metrics). Thresholds will need to be modified appropriately because the new metric available is an absolute one.

Classic alert rules on AnonymousThrottlingError, SASThrottlingError, and ThrottlingError must be split into two new alerts because there's no combined metric that provides the same functionality. Thresholds will need to be adapted appropriately.

### Azure Cosmos DB metrics

All classic alerts on Azure Cosmos DB metrics can be migrated except alerts on these metrics:

- Average Requests per Second
- Consistency Level
- Http 2xx
- Http 3xx
- Max RUPM Consumed Per Minute
- Max RUs Per Second
- Mongo Other Request Charge
- Mongo Other Request Rate
- Observed Read Latency
- Observed Write Latency
- Service Availability
- Storage Capacity

Average Requests per Second, Consistency Level, Max RUPM Consumed Per Minute, Max RUs Per Second, Observed Read Latency, Observed Write Latency, and Storage Capacity aren't currently available in the [new system](../essentials/metrics-supported.md#microsoftdocumentdbdatabaseaccounts).

Alerts on request metrics like Http 2xx, Http 3xx, and Service Availability aren't migrated because the way requests are counted is different between classic metrics and new metrics. Alerts on these metrics will need to be manually recreated with thresholds adjusted.

### Classic alert rules on deprecated metrics

The following are classic alert rules on metrics that were previously supported but were eventually deprecated. A small percentage of customer might have invalid classic alert rules on such metrics. Since these alert rules are invalid, they won't be migrated.

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

- **Frequency**: Defines how often a classic or new alert rule checks for the condition. The `frequency` in classic alert rules wasn't configurable by the user and was always 5 mins for all resource types. Frequency of equivalent rules is also set to 5 min.
- **Aggregation Type**: Defines how the metric is aggregated over the window of interest. The `aggregationType` is also the same between classic alerts and new alerts for most metrics. In some cases, since the metric is different between classic alerts and new alerts, equivalent `aggregationType` or the `primary Aggregation Type` defined for the metric is used.
- **Units**: Property of the metric on which alert is created. Some equivalent metrics have different units. The threshold is adjusted appropriately as needed. For example, if the original metric has seconds as units but equivalent new metric has milliseconds as units, the original threshold is multiplied by 1000 to ensure same behavior.
- **Window Size**: Defines the window over which metric data is aggregated to compare against the threshold. For standard `windowSize` values like 5 mins, 15 mins, 30 mins, 1 hour, 3 hours, 6 hours, 12 hours, 1 day, there is no change made for equivalent new alert rule. For other values, the closest `windowSize` is used. For most customers, there's no effect with this change. For a small percentage of customers, there might be a need to tweak the threshold to get exact same behavior.

In the following sections, we detail the metrics that have a different, equivalent metric in the new system. Any metric that remains the same for classic and new alert rules isn't listed. You can find a list of metrics supported in the new system [here](../essentials/metrics-supported.md).

### Microsoft.Storage/storageAccounts and Microsoft.ClassicStorage/storageAccounts

For Storage account services like blob, table, file, and queue, the following metrics are mapped to equivalent metrics as shown below:

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

### Microsoft.DocumentDB/databaseAccounts

For Azure Cosmos DB, equivalent metrics are as shown below:

| Metric in classic alerts | Equivalent metric in new alerts | Comments|
|--------------------------|---------------------------------|---------|
| AvailableStorage | AvailableStorage||
| Data Size | DataUsage| |
| Document Count | DocumentCount||
| Index Size | IndexUsage||
| Service Unavailable | ServiceAvailability||
| TotalRequestUnits | TotalRequestUnits||
| Throttled Requests | TotalRequests with dimension "StatusCode" = "429"| 'Average' aggregation type is corrected to 'Count'|
| Internal Server Errors | TotalRequests with dimension "StatusCode" = "500"}| 'Average' aggregation type is corrected to 'Count'|
| Http 401 | TotalRequests with dimension "StatusCode" = "401"| 'Average' aggregation type is corrected to 'Count'|
| Http 400 | TotalRequests with dimension "StatusCode" = "400"| 'Average' aggregation type is corrected to 'Count'|
| Total Requests | TotalRequests| 'Max' aggregation type is corrected to 'Count'|
| Mongo Count Request Charge| MongoRequestCharge with dimension "CommandName" = "count"||
| Mongo Count Request Rate | MongoRequestsCount with dimension "CommandName" = "count"||
| Mongo Delete Request Charge | MongoRequestCharge with dimension "CommandName" = "delete"||
| Mongo Delete Request Rate | MongoRequestsCount with dimension "CommandName" = "delete"||
| Mongo Insert Request Charge | MongoRequestCharge with dimension "CommandName" = "insert"||
| Mongo Insert Request Rate | MongoRequestsCount with dimension "CommandName" = "insert"||
| Mongo Query Request Charge | MongoRequestCharge with dimension "CommandName" = "find"||
| Mongo Query Request Rate | MongoRequestsCount with dimension "CommandName" = "find"||
| Mongo Update Request Charge | MongoRequestCharge with dimension "CommandName" = "update"||
| Mongo Insert Failed Requests | MongoRequestCount with dimensions "CommandName" = "insert" and "Status" = "failed"| 'Average' aggregation type is corrected to 'Count'|
| Mongo Query Failed Requests | MongoRequestCount with dimensions "CommandName" = "query" and "Status" = "failed"| 'Average' aggregation type is corrected to 'Count'|
| Mongo Count Failed Requests | MongoRequestCount with dimensions "CommandName" = "count" and "Status" = "failed"| 'Average' aggregation type is corrected to 'Count'|
| Mongo Update Failed Requests | MongoRequestCount with dimensions "CommandName" = "update" and "Status" = "failed"| 'Average' aggregation type is corrected to 'Count'|
| Mongo Other Failed Requests | MongoRequestCount with dimensions "CommandName" = "other" and "Status" = "failed"| 'Average' aggregation type is corrected to 'Count'|
| Mongo Delete Failed Requests | MongoRequestCount with dimensions "CommandName" = "delete" and "Status" = "failed"| 'Average' aggregation type is corrected to 'Count'|

### How equivalent action groups are created

Classic alert rules had email, webhook, logic app, and runbook actions tied to the alert rule itself. New alert rules use action groups that can be reused across multiple alert rules. The migration tool creates single action group for same actions no matter of how many alert rules are using the action. Action groups created by the migration tool use the naming format 'Migrated_AG*'.

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
- Microsoft.AlertsManagement/smartDetectorAlertRules/*

> [!NOTE]
> In addition to having above permissions, your subscription should additionally be registered with Microsoft.AlertsManagement resource provider. This is required to successfully migrate Failure Anomaly alerts on Application Insights. 

## Common problems and remedies

After you trigger the migration, you'll receive email at the addresses you provided to notify you that migration is complete or if any action is needed from you. This section describes some common problems and how to deal with them.

### Validation failed

Because of some recent changes to classic alert rules in your subscription, the subscription cannot be migrated. This problem is temporary. You can restart the migration after the migration status moves back **Ready for migration** in a few days.

### Scope lock preventing us from migrating your rules

As part of the migration, new metric alerts and new action groups will be created, and then classic alert rules will be deleted. However, a scope lock can prevent us from creating or deleting resources. Depending on the scope lock, some or all rules couldn't be migrated. You can resolve this problem by removing the scope lock for the subscription, resource group, or resource, which is listed in the [migration tool](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/MigrationBladeViewModel), and triggering the migration again. Scope lock can't be disabled and must be removed during the migration process. [Learn more about managing scope locks](../../azure-resource-manager/management/lock-resources.md#portal).

### Policy with 'Deny' effect preventing us from migrating your rules

As part of the migration, new metric alerts and new action groups will be created, and then classic alert rules will be deleted. However, an [Azure Policy](../../governance/policy/index.yml) assignment can prevent us from creating resources. Depending on the policy assignment, some or all rules couldn't be migrated. The policy assignments that are blocking the process are listed in the [migration tool](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/MigrationBladeViewModel). Resolve this problem by either:

- Excluding the subscriptions, resource groups, or individual resources during the migration process from the policy assignment. [Learn more about managing policy exclusion scopes](../../governance/policy/tutorials/create-and-manage.md#remove-a-non-compliant-or-denied-resource-from-the-scope-with-an-exclusion).
- Set the 'Enforcement Mode' to **Disabled** on the policy assignment. [Learn more about policy assignment's enforcementMode property](../../governance/policy/concepts/assignment-structure.md#enforcement-mode).
- Set an Azure Policy exemption (preview) on the subscriptions, resource groups, or individual resources to the policy assignment. [Learn more about the Azure Policy exemption structure](../../governance/policy/concepts/exemption-structure.md).
- Removing or changing effect to 'disabled', 'audit', 'append', or 'modify' (which, for example, can solve issues relating to missing tags). [Learn more about managing policy effects](../../governance/policy/concepts/definition-structure.md#policy-rule).

## Next steps

- [Prepare for the migration](alerts-prepare-migration.md)
