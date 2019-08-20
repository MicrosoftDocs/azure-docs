---
title: "Understand how the automatic migration process for your Azure Monitor classic alerts works"
description: Learn how the automatic migration process works.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 08/19/2019
ms.author: snmuvva
ms.subservice: alerts
---
# Understand the automatic migration process for your classic alert rules

As [previously announced](monitoring-classic-retirement.md), classic alerts in Azure Monitor are being retired in September 2019 (was originally July 2019). As part of the retirement process, [a migration tool](alerts-using-migration-tool.md) had been made available in the Azure portal to customers who use classic alert rules to trigger migration themselves. In case you haven't used the migration tool till August 31, 2019, Azure Monitor will start the process of automatic migration of your classic alerts starting September 1, 2019.
This article walks you through the timelines of the automatic migration process, what to expect and help you resolve any issues you might run into.

  > [!NOTE]
  > This article only applies to Azure public cloud. Retirement process for Azure Monitor classic alerts in Azure Government cloud and Azure China 21Vianet will be announced at future date.

## What will happen during the automatic migration process?

- Starting **September 1, 2019**, customers will not be able to create any new classic alert rules with the exception of [certain metrics](alerts-understand-migration.md#classic-alert-rules-that-will-not-be-migrated).
  - For the exceptions, customer can continue to create new classic alert rules and use their classic alerts till June 2020.
- Starting **September 1, 2019**, migration of classic alerts will be triggered in batches for any customers that have classic alerts.
- As with the voluntary migration tool, certain classic alert rules which are not migratable will be left as they are. These will continue to be supported till June 2020. However, any invalid classic alert rules which might have target resources that have been deleted or [metrics that are no longer supported](alerts-understand-migration.md#classic-alert-rules-on-deprecated-metrics) will be deleted as they are non-functional.
- Once migration for your subscription starts, unless there are any issues, migration should be complete within an hour. Customers can monitor the status of migration on [the migration blade in Azure Monitor](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/MigrationBladeViewModel).
- Subscription owners will receive an email on successful completion of migration.
- If there are any issues during the migration, subscription owners will also receive an email informing them of the same. Customers can use the migration blade to see full details of the issue.
- In case an action is needed from customer like temporarily disabling a resource lock or changing a policy assignment, customers will need to resolve any issues by Oct 31, 2019. If the issues are not resolved by then, successful migration of your classic alerts cannot be guaranteed.

    > [!NOTE]
    > If you don't want to wait for the automatic migration process to start, you can still trigger the migration voluntarily using the migration tool.

## Important things to note

The migration process converts classic alert rules to new, equivalent alert rules, and creates action groups. In preparation, be aware of the following points:

- Both the notification payload format and the APIs to create and manage new alert rules are different from those of the classic alert rules because they support more features. If you have classic alerts which trigger logic apps, runbooks or webhooks, they might stop functioning as expected once migration is complete due to differences in notification payloads. [Learn how to prepare for the migration](alerts-prepare-migration.md).

- Some classic alert rules cannot be migrated by using the tool. [Learn which rules cannot be migrated and what to do with them](alerts-understand-migration.md#classic-alert-rules-that-will-not-be-migrated).

    > [!NOTE]
    > The migration process won't impact the evaluation of your classic alert rules. They'll continue to run and send alerts until they're migrated and the new alert rules take effect.

## What if the automatic migration fails?

When the automatic migration process fails, subscription owners will receive an email notifying them of the issue. You can use the migration blade in Azure Monitor to see the full details of the issue.

See the [troubleshooting guide](alerts-understand-migration.md#common-problems-and-remedies) for help with problems you might face during migration.

  > [!NOTE]
  > In case an action is needed from customer like temporarily disabling a resource lock or changing a policy assignment, customers will need to resolve any issues by Oct 31, 2019. If the issues are not resolved by then, successful migration of your classic alerts cannot be guaranteed.

## Next steps

- [Prepare for the migration](alerts-prepare-migration.md)
- [Understand how the migration tool works](alerts-understand-migration.md)