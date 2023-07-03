---
title: Planned maintenance notification - Azure Database for PostgreSQL - Single Server
description: This article describes the Planned maintenance notification feature in Azure Database for PostgreSQL - Single Server
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal 
ms.date: 06/24/2022
---

# Planned maintenance notification in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Learn how to prepare for planned maintenance events on your Azure Database for PostgreSQL.

## What is a planned maintenance?

Azure Database for PostgreSQL service performs automated patching of the underlying hardware, OS, and database engine. The patch includes new service features, security, and software updates. For PostgreSQL engine, minor version upgrades are automatic and included as part of the patching cycle. There is no user action or configuration settings required for patching. The patch is tested extensively and rolled out using safe deployment practices.

A planned maintenance is a maintenance window when these service updates are deployed to servers in a given Azure region. During planned maintenance, a notification event is created to inform customers when the service update is deployed in the Azure region hosting their servers. Minimum duration between two planned maintenance periods is 30 days. You receive a notification of the next maintenance window 72 hours in advance.

## Planned maintenance - duration and customer impact

A planned maintenance for a given Azure region is typically expected to complete within 15 hours. This time-window also includes buffer time to execute a rollback plan if necessary. Azure Database for PostgreSQL servers are running in containers so database server restarts typically take 60-120 seconds to complete but there is no deterministic way to know when within this 15 hours window your server will be impacted. The entire planned maintenance event including each server restarts is carefully monitored by the engineering team. The server failover time is dependent on database recovery, which can cause the database to come online longer if you have heavy transactional activity on the server at the time of failover. To avoid longer restart time, it is recommended to avoid any long running transactions (bulk loads) during planned maintenance events.

In summary, while the planned maintenance event runs for 15 hours, the individual server impact generally lasts 60 seconds depending on the transactional activity on the server. A notification is sent 72 calendar hours before planned maintenance starts and another one while maintenance is in progress for a given region.

## How can I get notified of planned maintenance?

You can utilize the planned maintenance notifications feature to receive alerts for an upcoming planned maintenance event. You will receive the notification about the upcoming maintenance 72 calendar hours before the event and another one while maintenance is in-progress for a given region.

### Planned maintenance notification

**Planned maintenance notifications** allow you to receive alerts for upcoming planned maintenance event to your Azure Database for PostgreSQL. These notifications are integrated with [Service Health's](../../service-health/overview.md) planned maintenance and allow you to view all scheduled maintenance for your subscriptions in one place. It also helps to scale the notification to the right audiences for different resource groups, as you may have different contacts responsible for different resources. You will receive the notification about the upcoming maintenance 72 calendar hours before the event.

We will make every attempt to provide **Planned maintenance notification** 72 hours notice for all events. However, in cases of critical or security patches, notifications might be sent closer to the event or be omitted.

You can either check the planned maintenance notification on Azure portal or configure alerts to receive notification.

### Check planned maintenance notification from Azure portal

1. In the [Azure portal](https://portal.azure.com), select **Service Health**.
2. Select **Planned Maintenance** tab
3. Select **Subscription**, **Region, and **Service** for which you want to check the planned maintenance notification.

### To receive planned maintenance notification

1. In the [portal](https://portal.azure.com), select **Service Health**.
2. In the **Alerts** section, select **Health alerts**.
3. Select **+ Add service health alert** and fill in the fields.
4. Fill out the required fields. 
5. Choose the **Event type**, select **Planned maintenance** or **Select all**
6. In **Action groups** define how you would like to receive the alert (get an email, trigger a logic app etc.)  
7. Ensure Enable rule upon creation is set to Yes.
8. Select **Create alert rule** to complete your alert

For detailed steps on how to create **service health alerts**, refer to [Create activity log alerts on service notifications](../../service-health/alerts-activity-log-service-notifications-portal.md).

## Can I cancel or postpone planned maintenance?

Maintenance is needed to keep your server secure, stable, and up-to-date. The planned maintenance event cannot be canceled or postponed. Once the notification is sent to a given Azure region, the patching schedule changes cannot be made for any individual server in that region. The patch is rolled out for entire region at once. Azure Database for PostgreSQL - Single server service is designed for cloud native application that doesn't require granular control or customization of the service. If you are looking to have ability to schedule maintenance for your servers, we recommend you consider [Flexible servers](../flexible-server/overview.md).

## Are all the Azure regions patched at the same time?

No, all the Azure regions are patched during the deployment wise window timings. The deployment wise window generally stretches from 5 PM - 8 AM local time next day, in a given Azure region. Geo-paired Azure regions are patched on different days. For high availability and business continuity of database servers, leveraging [cross region read replicas](./concepts-read-replicas.md#cross-region-replication) is recommended.

## Retry logic

A transient error, also known as a transient fault, is an error that will resolve itself. [Transient errors](./concepts-connectivity.md#transient-errors) can occur during maintenance. Most of these events are automatically mitigated by the system in less than 60 seconds. Transient errors should be handled using [retry logic](./concepts-connectivity.md#handling-transient-errors).

## Next steps

- For any questions or suggestions you might have about working with Azure Database for PostgreSQL, send an email to the Azure Database for PostgreSQL Team at AskAzureDBforPostgreSQL@service.microsoft.com
- See [How to set up alerts](how-to-alert-on-metric.md) for guidance on creating an alert on a metric.
- [Troubleshoot connection issues to Azure Database for PostgreSQL - Single Server](how-to-troubleshoot-common-connection-issues.md)
- [Handle transient errors and connect efficiently to Azure Database for PostgreSQL - Single Server](concepts-connectivity.md)
