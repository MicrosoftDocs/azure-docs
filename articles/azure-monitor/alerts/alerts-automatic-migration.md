---
title: Understand how the automatic migration process for your Azure Monitor classic alerts works
description: Learn how the automatic migration process works.
ms.topic: conceptual
ms.date: 06/20/2023
---
# Understand the automatic migration process for your classic alert rules

As [previously announced](monitoring-classic-retirement.md), classic alerts in Azure Monitor are retired for public cloud users, though still in limited use until **31 May 2021**. Classic alerts for Azure Government cloud and Microsoft Azure operated by 21Vianet will retire on **29 February 2024**.

[A migration tool](alerts-using-migration-tool.md) is available in the Azure portal for customers to trigger migration themselves. This article explains the automatic migration process in public cloud, that will start after 31 May 2021. It also details issues and solutions you might run into.

## Important things to note

The migration process converts classic alert rules to new, equivalent alert rules, and creates action groups. In preparation, be aware of the following points:

- The notification payload formats for new alert rules are different from payloads of the classic alert rules because they support more features. If you have a classic alert rule with logic apps, runbooks, or webhooks, they might stop functioning as expected after migration, because of differences in payload. [Learn how to prepare for the migration](alerts-prepare-migration.md).

- Some classic alert rules can't be migrated by using the tool. [Learn which rules can't be migrated and what to do with them](alerts-understand-migration.md#manually-migrating-classic-alerts-to-newer-alerts).

## What will happen during the automatic migration process in public cloud?

- Starting 31 May 2021, you won't be able to create any new classic alert rules and migration of classic alerts will be triggered in batches.
- Any classic alert rules that are monitoring deleted target resources or on [metrics that are no longer supported](alerts-understand-migration.md#classic-alert-rules-on-deprecated-metrics) are considered invalid.
- Classic alert rules that are invalid will be removed sometime after 31 May 2021.
- Once migration for your subscription starts, it should be complete within an hour. Customers can monitor the status of migration on [the migration tool in Azure Monitor](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring/MigrationBladeViewModel).
- Subscription owners will receive an email on success or failure of the migration.

    > [!NOTE]
    > If you don't want to wait for the automatic migration process to start, you can still trigger the migration voluntarily using the migration tool.

## What if the automatic migration fails?

When the automatic migration process fails, subscription owners will receive an email notifying them of the issue. You can use the migration tool in Azure Monitor to see the full details of the issue. See the [troubleshooting guide](alerts-understand-migration.md#common-problems-and-remedies) for help with problems you might face during migration.

  > [!NOTE]
  > In case an action is needed from customers, like temporarily disabling a resource lock or changing a policy assignment, customers will need to resolve any such issues. If the issues are not resolved by then, successful migration of your classic alerts cannot be guaranteed.

## Next steps

- [Prepare for the migration](alerts-prepare-migration.md)
- [Understand how the migration tool works](alerts-understand-migration.md)