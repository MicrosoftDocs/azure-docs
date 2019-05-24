---
title: "Understand how the voluntary migration tool works for Azure Monitor alerts"
description: Understand how the alerts migration tool works and troubleshoot problems.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 03/19/2018
ms.author: snmuvva
ms.subservice: alerts
---
# Understand how the migration tool works

As [previously announced](monitoring-classic-retirement.md), classic alerts in Azure Monitor are being retired in September 2019 (was originally July 2019). A migration tool is available in the Azure portal to customers who use classic alert rules and who want to trigger migration themselves.

This article explains how the voluntary migration tool works. It also describes remedies for some common problems.

> [!NOTE]
> Due to delay in roll-out of migration tool, the retirement date for classic alerts migration has been [extended to August 31st, 2019](https://azure.microsoft.com/updates/azure-monitor-classic-alerts-retirement-date-extended-to-august-31st-2019/) from the originally announced date of June 30th, 2019.

## Which classic alert rules can be migrated?

Although the tool can migrate almost all classic alert rules, there are some exceptions. The following alert rules won't be migrated by using the tool (or during the automatic migration in September 2019):

- Classic alert rules on virtual-machine guest metrics (both Windows and Linux). See the [guidance for recreating such alert rules in new metric alerts](#guest-metrics-on-virtual-machines) later in this article.
- Classic alert rules on classic storage metrics. See the [guidance for monitoring your classic storage accounts](https://azure.microsoft.com/blog/modernize-alerting-using-arm-storage-accounts/).
- Classic alert rules on some storage account metrics. See [details](#storage-account-metrics) later in this article.

If your subscription has any such classic rules, you must migrate them manually. Because we can't provide an automatic migration, any existing, classic metric alerts of these types will continue to work until June 2020. This extension gives you time to move over to new alerts. However, no new classic alerts can be created after August 2019.

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

Classic alert rules on Percent metrics must be migrated based on [the mapping between old and new storage metrics](https://docs.microsoft.com/azure/storage/common/storage-metrics-migration#metrics-mapping-between-old-metrics-and-new-metrics). Thresholds will need to be modified appropriately because the new metric available is an absolute one.

Classic alert rules on AnonymousThrottlingError and SASThrottlingError must be split into two new alerts because there is no combined metric that provides the same functionality. Thresholds will need to be adapted appropriately.

## Rollout phases

The migration tool is rolling out in phases to customers that use classic alert rules. Subscription owners will receive an email when the subscription is ready to be migrated by using the tool.

> [!NOTE]
> Because the tool is being rolled out in phases, you might see that most of your subscriptions are not yet ready to be migrated during the early phases.

Currently a subset of subscriptions is marked as ready for migration. The subset includes those subscriptions that have classic alert rules only on the following resource types. Support for more resource types will be added in upcoming phases.

- Microsoft.apimanagement/service
- Microsoft.batch/batchaccounts
- Microsoft.cache/redis
- Microsoft.datafactory/datafactories
- Microsoft.dbformysql/servers
- Microsoft.dbforpostgresql/servers
- Microsoft.eventhub/namespaces
- Microsoft.logic/workflows
- Microsoft.network/applicationgateways
- Microsoft.network/dnszones
- Microsoft.network/expressroutecircuits
- Microsoft.network/loadbalancers
- Microsoft.network/networkwatchers/connectionmonitors
- Microsoft.network/publicipaddresses
- Microsoft.network/trafficmanagerprofiles
- Microsoft.network/virtualnetworkgateways
- Microsoft.search/searchservices
- Microsoft.servicebus/namespaces
- Microsoft.streamanalytics/streamingjobs
- Microsoft.timeseriesinsights/environments
- Microsoft.web/hostingenvironments/workerpools
- Microsoft.web/serverfarms
- Microsoft.web/sites

## Who can trigger the migration?

Any user who has the built-in role of Monitoring Contributor at the subscription level can trigger the migration. Users who have a custom role with the following permissions can also trigger the migration:

- */read
- Microsoft.Insights/actiongroups/*
- Microsoft.Insights/AlertRules/*
- Microsoft.Insights/metricAlerts/*

## Common problems and remedies

After you [trigger the migration](alerts-using-migration-tool.md), you'll receive email at the addresses you provided to notify you that migration is complete or if any action is needed from you. This section describes some common problems and how to deal with them.

### Validation failed

Due to some recent changes to classic alert rules in your subscription, the subscription cannot be migrated. This problem is temporary. You can restart the migration after the migration status moves back **Ready for migration** in a few days.

### Policy or scope lock preventing us from migrating your rules

As part of the migration, new metric alerts and new action groups will be created, and then classic alert rules will be deleted. However, there's either a policy or scope lock preventing us from creating resources. Depending on the policy or scope lock, some or all rules could not be migrated. You can resolve this problem by removing the scope lock or policy temporarily and triggering the migration again.

## Next steps

- [How to use the migration tool](alerts-using-migration-tool.md)
- [Prepare for the migration](alerts-prepare-migration.md)
