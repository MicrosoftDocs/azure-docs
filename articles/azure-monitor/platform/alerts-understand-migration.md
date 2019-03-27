---
title: "Understand how voluntary migration tool works"
description: Understand how the migration tool works and troubleshoot if you run into issues.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 03/19/2018
ms.author: snmuvva
ms.subservice: alerts
---
# Understand how the migration tool works

As [previously announced](monitoring-classic-retirement.md), classic alerts in Azure Monitor are being retired in July 2019. The migration tool to trigger migration voluntarily is available in Azure portal and is rolling out to customers who use classic alert rules.

This article will walk you through how the voluntary migration tool works and provides remediation for some issues you might run into.

## Which classic alert rules can be migrated?

While almost all classic alert rules can be migrated using the tool, there are some exceptions. The following alert rules will not be migrated using the tool (or during the automatic migration in July 2019)

- Classic alert rules on virtual machine guest metrics (both Windows and Linux). [See guidance on how to recreate these in new metric alerts](#guest-metrics-on-virtual-machines)
- Classic alert rules on classic storage metrics. [See guidance on monitoring your classic storage accounts](https://azure.microsoft.com/blog/modernize-alerting-using-arm-storage-accounts/)
- Classic alert rules on some storage account metrics. [Details below](#storage-account-metrics)

If your subscription has any such classic rules, rest of the rules will be migrated but these will need to be manually migrated. As we cannot provide an automatic migration, existing classic metric alerts will continue working up to June 2020 to provide you time to move over to new alerts.

### Guest Metrics on virtual machines

To be able to create new metric alerts on guest metrics, the guest metrics need to be sent to the Azure Monitor custom metrics store. This can be done by enabling the new Azure Monitor sink in diagnostic settings.

- [Enabling guest metrics for Windows VMs](collect-custom-metrics-guestos-resource-manager-vm.md)
- [Enabling guest metrics for Linux VMs](https://docs.microsoft.com/azure/azure-monitor/platform/collect-custom-metrics-linux-telegraf)

Once the above steps are done, new metric alerts can be created on these. Once you have recreated new metric alerts, classic alerts can be deleted.

### Storage account metrics

All classic alerts on storage accounts can be migrated except those alerts on the following metrics:

- PercentAuthorizationError
- PercentClientOtherError
- PercentNetworkError
- PercentServerOtherError
- PercentSuccess
- PercentThrottlingError
- PercentTimeoutError
- AnonymousThrottlingError
- SASThrottlingError

Classic alert rules on Percent metrics will need to be migrated based on [the mapping between old and new storage metrics](https://docs.microsoft.com/azure/storage/common/storage-metrics-migration#metrics-mapping-between-old-metrics-and-new-metrics). Thresholds will need to be appropriately modified as the new metric available is an absolute one.

Classic alert rules AnonymousThrottlingError and SASThrottlingError will need to be split into two new alerts as there is no combined metric that provides these. Thresholds will need to be appropriately adapted.

## Roll-out phases

The migration tool is rolling out in phases to customers that use classic alert rules. **Subscription Owners** will receive an email when the subscription is ready to be migrated using the tool.

> [!NOTE]
> As the tool is being rolled out in phases, in early phases, you will see that most of your subscriptions are not yet ready to be migrated. However, by April, all subscriptions that have classic alert rules will be migratable using the migration tool.

Currently a **sub-set** of subscriptions which **only** have classic alert rules on following resource types are marked as ready for migration. Support for more resource types will be added in upcoming phases.

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

Any user who has the built-in role of **Monitoring Contributor** at the subscription level will be able to trigger the migration. Users with a custom role with the following permissions can also trigger the migration:

- */read
- Microsoft.Insights/actiongroups/*
- Microsoft.Insights/AlertRules/*
- Microsoft.Insights/metricAlerts/*

## Common Issues and remediations

Once you [trigger the migration](alerts-using-migration-tool.md), we will use the email address(es) provided to notify you of completion of migration or if there is an action needed from you. The following section describes some common issues and how to remediate them

### Validation failed

Due to some recent changes to classic alert rules in your subscription, the subscription cannot be migrated. This is a temporary issue. You can restart the migration once the migration status moves back **Ready for migration** in a few days.

### Policy/scope lock preventing us from migrating your rules

As part of the migration, new metric alerts and new action groups will be created and classic alert rules will be deleted (once new rules are created). However, there is either a policy or scope lock preventing us from creating resources. Depending on the policy or scope lock, some or all rules could not be migrated. You can resolve this by removing the scope lock/policy temporarily and re-trigger the migration.

## Next steps

- [How to use the migration tool](alerts-using-migration-tool.md)
- [Prepare for migration](alerts-prepare-migration.md)
