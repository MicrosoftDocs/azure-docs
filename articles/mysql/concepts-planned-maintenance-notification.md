---
title: Planned maintenance notification - Azure Database for MySQL
description: This article describes the Planned maintenance notification feature in Azure Database for MySQL
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: conceptual
ms.date: 10/2/2020
---
# Planned maintenance notification in Azure Database for MySQL

Learn how to prepare for planned maintenance events on your Azure Database for MySQL.

## What is a planned maintenance event and what to expect during maintenance

Azure Database for MySQL performs periodic maintenance to keep your managed database secure, stable, and up-to-date. During planned maintenance event, the server gets new features, updates, and patches.
During maintenance, your Azure Database for MySQL server may experience a brief drop in connectivity for a short number of seconds. You can expect your server to restart and [transient errors](./concepts-connectivity#transient-errors.md) can occur. Most of these events are automatically mitigated by the system in less than 60 seconds.

> [!Note]
> Maintenance is needed keep your managed database secure, stable, and up-to-date. The planned maintenance event cannot be cancelled or postponed.

## How can I get notified of planned maintenance event

You can utilize the planned maintenance notifications feature to receive alerts for upcoming planned maintenance event. You will receive the notification about the upcoming maintenance 72 hours before the event. 

## Planned maintenance notification

> [!IMPORTANT]
> Planned maintenance notifications are currently available in preview in all regions **except** West Central US

**Planned maintenance notifications** allow you to receive alerts for upcoming planned maintenance event to your Azure Database for MySQL. These notifications are integrated with [Service Health's](../service-health/overview.md) planned maintenance and allow you to view all scheduled maintenance for your subscriptions in one place. It also helps to scale the notification to the right audiences for different resource groups, as you may have different contacts responsible for different resources. You will receive the notification about the upcoming maintenance 72 hours before the event.

We will make every attempt to provide **Planned maintenance notification** 72 hours notice for all events. However, in cases of critical or security patches, notifications might be sent closer to the event or be omitted.

You can either check the planned maintenance notification on Azure portal or configure alerts to receive notification. 

### Check planned maintenance notification on Azure portal

1. In the [portal](https://portal.azure.com), select **Service Health**.
2. Select **Planned Maintenance** tab
3. Select **Subscription**, **Region** and **Service** for which you want to check the planned maintenance notification. 
   
### To receive planned maintenance notification

1. In the [portal](https://portal.azure.com), select **Service Health**.
2. In the **Alerts** section, select **Health alerts**.
3. Select **+ Add service health alert** and fill in the fields.
4. Fill out the required fields. 
5. Choose the **Event type**, select **Planned maintenance** or **Select all**
6. In **Action groups** define how you would like to receive the alert (get an email, trigger a logic app etc.)  
7. Ensure Enable rule upon creation is set to Yes.
8. Select **Create alert rule** to complete your alert

For detailed steps on how to create **service health alerts**, refer to [Create activity log alerts on service notifications](../service-health/alerts-activity-log-service-notifications.md).

## Retry logic

A transient error, also known as a transient fault, is an error that will resolve itself. [Transient errors](./concepts-connectivity#transient-errors.md) can occur during maintenance. Most of these events are automatically mitigated by the system in less than 60 seconds.

Transient errors should be handled using [retry logic](concepts-connectivity#handling-transient-errors).

## Next steps

- See [How to set up alerts](howto-alert-on-metric.md) for guidance on creating an alert on a metric.
- [Troubleshoot connection issues to Azure Database for MySQL](howto-troubleshoot-common-connection-issues.md)
- [Handle transient errors and connect efficiently to Azure Database for MySQL](concepts-connectivity.md)