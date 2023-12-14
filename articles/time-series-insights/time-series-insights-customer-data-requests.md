---
title: 'Customer data request features​ - Azure Time Series Insights | Microsoft Docs'
description: Learn about customer data request features in Azure Time Series Insights.
author: esung22
ms.author: elsung
manager: cnovak
ms.reviewer: orspodek
ms.topic: conceptual
ms.service: time-series-insights
services: time-series-insights
ms.date: 10/02/2020
ms.custom: seodec18
---

# Summary of customer data request features

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

Azure Time Series Insights is a managed cloud service with storage, analytics, and visualization components that make it easy to ingest, store, explore, and analyze billions of events simultaneously.

[!INCLUDE [gdpr-intro-sentence](../../includes/gdpr-intro-sentence.md)]

To view, export, and delete personal data that may be subject to a data subject request, an Azure Time Series Insights tenant administrator can use either the Azure portal or the REST APIs. Using the Azure portal to service data subject requests, provides a less complex method to perform these operations that most users prefer.

## Identifying customer data

Azure Time Series Insights considers personal data to be data associated with administrators and users of Time Series Insights. Time Series Insights stores the Microsoft Entra object-ID of users with access to the environment. The Azure portal displays user email addresses, but these email addresses are not stored within Time Series Insights, they are dynamically looked up using the Microsoft Entra object-ID in Microsoft Entra ID.

## Deleting customer data

A tenant administrator can delete customer data using the Azure portal.

[!INCLUDE [gdpr-dsr-and-stp-note](../../includes/gdpr-dsr-and-stp-note.md)]

However, before you delete customer data through the portal, you should remove the user's access policies from the Time Series Insights environment within the Azure portal. For more information, read [Grant data access to a Time Series Insights environment using Azure portal](./concepts-access-policies.md).

You can also perform delete operations on access policies using the REST API. For more information, read [Access Policies - Delete](/rest/api/time-series-insights/management(gen1/gen2)/accesspolicies/delete).

Time Series Insights is integrated with the Policy blade in the Azure portal. Both Time Series Insights and the Policy blade enable you to view, export, and delete user data stored within the service. Any delete action taken within the Policy blade of the Azure portal results in the deletion of user data within Time Series Insights. For example, if a user has a saved personal query, that query is permanently deleted from the Time Series Insights explorer. If the user has a saved shared query, the query persists, but the user information is permanently deleted. The following note contains instructions on how to accomplish these tasks.

## Exporting customer data

Similarly to deleting data, a tenant administrator can view and export data stored in Time Series Insights from the Policy blade in the Azure portal.

[!INCLUDE [gdpr-dsr-and-stp-note](../../includes/gdpr-dsr-and-stp-note.md)]

If you are a tenant administrator, you can view data access policies within the Time Series Insights environment in the Azure portal. For more information, read [Grant data access to a Time Series Insights environment using Azure portal](./concepts-access-policies.md).

It is also possible to perform export operations on access policies using the "list by environment" operation in the provided REST API. For more information, read [Access Policies - List By Environment](/rest/api/time-series-insights/management(gen1/gen2)/accesspolicies/listbyenvironment).

## To delete data stored within Time Series Insights

Personal data might make its way into Time Series Insights storage, a different scenario from user and admin data. If you consider the data stored in Time Series Insights as personal data, you can export and delete that data using the following steps:

### View and export data

To view and export data stored within Time Series Insights, you need to search for that data. You can use the Time Series Insights explorer or Time Series Insights query APIs to view and export data. To view and export data using the Time Series Insights explorer, first search to find the user data in question. After searching, right-click on the chart and select **Explore events**. The events grid appears and presents options to export the data as CSV and JSON.

For more information, read [Azure Time Series Insights explorer](time-series-insights-explorer.md).

### Delete data

Currently, Time Series Insights does not support granular deletion of data. However, Time Series Insights provides the ability to remove customer data stored within Time Series Insights by configuring retention policies. You can adjust the retention period of the entire Time Series Insights environment to any number of days to support your deletion requirements.

For more information, read [Configuring retention in Time Series Insights](time-series-insights-how-to-configure-retention.md).

## Next steps

* Read more about [granting data access to your Azure Time Series Insights environment](./concepts-access-policies.md).

* View the [Azure Time Series Insights explorer](time-series-insights-explorer.md).

* Learn about [Configuring retention in Time Series Insights](time-series-insights-how-to-configure-retention.md).
