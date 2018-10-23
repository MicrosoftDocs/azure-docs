---
title: How to configure monitoring in Azure Digital Twins | Microsoft Docs
description: How to configure monitoring in Azure Digital Twins
author: kingdomofends
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/22/2018
ms.author: adgera
---

# How to configure monitoring in Azure Digital Twins

Azure Digital Twins supports robust logging, monitoring, and analytics. Solutions developers can use Azure Log Analytics, diagnostic logs, activity logging, and other services to support the complex monitoring needs of an IoT app. Logging options can be combined to query or display records across several services and to provide granular logging coverage for many services.

This article summarizes logging and monitoring options and how to combine them in ways specific to Azure Digital Twins.

## Review activity logs

Azure [activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide quick insights into subscription-level event and operation histories for each Azure service instance.

Subscription-level events include:

* Resource creation
* Resource removal
* Creating app secrets
* Integrating with other services

Activity logging for Azure Digital Twins is enabled by default and can be found through the Azure portal by:

1. Selecting your Azure Digital Twins instance.
1. Choosing **Activity log** to bring up the display panel:

    ![Activity log][1]

For advanced activity logging:

1. Select the **Logs** option to display the **Activity Log Analytics Overview**:

    ![Selection][2]

1. The **Activity Log Analytics Overview** summarizes essential activity log data:

    ![Activity log analytics overview][3]

>[!TIP]
>Use **activity logs** for quick insights into subscription-level events.

## Enable customer diagnostic logs

Azure [diagnostic settings](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) can be set for each Azure instance to supplement activity logging. While activity logs pertain to subscription-level events, diagnostic logging provides insights into the operational history of the resources themselves.

Examples of diagnostic logging include:

* The execution time for a user-defined function
* The response status code of a successful API request
* Retrieving an app key from a vault

To enable diagnostic logs for an instance:

1. Bring up the resource in Azure portal.
1. Click **Diagnostic settings**:

    ![Diagnostic settings one][4]

1. Click **Turn on diagnostics** to collect data (if not previously enabled).
1. Fill in the requested fields and select how and where data will be saved:

    ![Diagnostic settings two][5]

    Diagnostic logs are often saved using [Azure File Storage](https://docs.microsoft.com/azure/storage/files/storage-files-deployment-guide) and shared with [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/query-language/get-started-analytics-portal). Both options can be selected.

>[!TIP]
>Use **diagnostic logs** for insights into resource operations.

## Azure monitor and log analytics

IoT applications unite disparate resources, devices, locations, and data into one. Fine-grained logging provides detailed information about each specific piece, service, or component of the overall application architecture but a unified overview is often required for maintenance and debugging.

Azure Monitor includes the powerful Log Analytics service, which allows logging sources to be viewed and analyzed in one location. Azure Monitor is therefore highly useful for analyzing logs within sophisticated IoT apps.

Examples of use include:

* Querying multiple diagnostic log histories
* Seeing logs for several user-defined functions
* Displaying logs for two or more services within a specific time-frame

Full log querying is provided through [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-queries). To set up these powerful features:

1. Search for **Log Analytics** in the Azure portal.
1. You will see your available **Log Analytics** instances. Choose one and select **Logs** to query:

    ![Log analytics][6]

1. If you don't already have a **Log Analytics** instance, you can create a workspace by clicking the **Add** button:

    ![Create OMS][7]

Once your **Log Analytics** instance is provisioned, you may use powerful queries to find entries in multiples logs or search using specific criteria using **Log Management**:

   ![Log management][8]

For more information about powerful query operations, see [getting started with queries](https://docs.microsoft.com/azure/log-analytics/query-language/get-started-queries).

> [!NOTE]
> You may experience a 5 minute delay when sending events to **Log Analytics** for the first time.

Azure Log Analytics also provides powerful error and alert notification services, which can be viewed by clicking **Diagnose and solve problems**:

   ![Alert and error notifications][9]

>[!TIP]
>Use **Log Analytics** to query log histories for multiple app functionalities, subscriptions, or services.

## Other options

Azure Digital Twins also supports application-specific logging and security auditing. For a thorough overview of all Azure logging options available to your Azure Digital Twins instance, see the [Azure log audit](https://docs.microsoft.com/azure/security/azure-log-audit) article.

## Next steps

Learn more about Azure [activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs).

Dive deeper into Azure diagnostic settings by reading an [overview of diagnostic logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs).

Read more about [Azure Log Analytics](https://docs.microsoft.com/azure/log-analytics/query-language/get-started-analytics-portal).

<!-- Images -->
[1]: media/how-to-configure-monitoring/activity-log.png
[2]: media/how-to-configure-monitoring/activity-log-select.png
[3]: media/how-to-configure-monitoring/log-analytics-overview.png
[4]: media/how-to-configure-monitoring/diagnostic-settings-one.png
[5]: media/how-to-configure-monitoring/diagnostic-settings-two.png
[6]: media/how-to-configure-monitoring/log-analytics.png
[7]: media/how-to-configure-monitoring/log-analytics-oms.png
[8]: media/how-to-configure-monitoring/log-analytics-management.png
[9]: media/how-to-configure-monitoring/log-analytics-notifications.png