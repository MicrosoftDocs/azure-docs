---
title: Guidance for personal data stored in Azure Application Insights | Microsoft Docs
description: This article describes how to manage personal data stored in Azure Application Insights and the methods to identify and remove it.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 05/18/2018
ms.reviewer: Evgeny.Ternovsky
ms.author: mbullwin

---

# Guidance for personal data stored in Application Insights

Application Insights is a data store where personal data is likely to be found. This article discusses where in Application Insights this data is typically found, as well as the capabilities available to you to handle this data.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

## Strategy for personal data handling

While it will be up to you and your company to ultimately determine the strategy with which you will handle your private data (if at all), the following are some possible approaches. They are listed in order of preference from a technical point of view from most to least preferable:
* Where possible, stop collection of, obfuscate, anonymize, or otherwise adjust the data being collected to exclude it from being considered _private_. This method, is the preferred approach, saving you the need to create a costly and impactful data handling strategy.
* Where not possible, attempt to normalize the data to reduce the impact on the data platform and performance. For example, instead of logging an explicit User ID, create a lookup to data that will correlate the username and their details to an internal ID that can then be logged elsewhere. That way, if one of your users ask you to delete their personal information, it is possible that only deleting the row in the lookup table corresponding to the user will be sufficient. 
* Finally, if private data must be collected, build a process around the purge API path and the existing query API path to meet any obligations you may have around exporting and deleting any private data associated with a user.

## Where to look for private data in Application Insights?

Application Insights is a completely flexible store, which while prescribing a schema to your data, allows you to override every field with custom values. As such, it's impossible to say exactly where private data will be found in your specific application. The following locations, however, are good starting points in your inventory:

* *IP addresses*: While Application Insights will by default obfuscate all IP address fields to "0.0.0.0", it is a fairly common pattern to override this value with the actual user IP to maintain session information. The Analytics query below can be used to find any table that contains values in the IP address column other than "0.0.0.0" over the last 24 hours:
    ```
    search client_IP != "0.0.0.0"
    | where timestamp > ago(1d)
    | summarize numNonObfuscatedIPs_24h = count() by $table
    ```
* *User IDs*: By default, Application Insights will use randomly generated IDs for user and session tracking. However, it is common to see these fields overridden to store an ID more relevant to the application. For example: usernames, AAD GUIDs, etc. These IDs are often considered to be in-scope as personal data, and therefore, should be handled appropriately. Our recommendation is always to attempt to obfuscate or anonymize these IDs. Fields where these values are commonly found include session_Id, user_Id, user_AuthenticatedId, user_AccountId, as well as customDimensions.
* *Custom data*: Application Insights allows you to append a set of custom dimensions to any data type. These dimensions can be *any* data. Use the following query to identify any custom dimensions collected over the last 24 hours:
    ```
    search * 
    | where isnotempty(customDimensions)
    | where timestamp > ago(1d)
    | project $table, timestamp, name, customDimensions 
    ```
* *In-memory and in-transit data*: Application Insights will track exceptions, requests, dependency calls, and traces. Private data can often be collected at the code and HTTP call level. Review the exceptions, requests, dependencies, and traces tables to identify any such data. Use [telemetry initializers](https://docs.microsoft.com/azure/application-insights/app-insights-api-filtering-sampling) where possible to obfuscate this data.
* *Snapshot Debugger captures*: The [Snapshot Debugger](https://docs.microsoft.com/azure/application-insights/app-insights-snapshot-debugger) feature in Application Insights allows you to collect debug snapshots whenever an exception is caught on the production instance of your application. Snapshots will expose the full stack trace leading to the exceptions as well as the values for local variables at every step in the stack. Unfortunately, this feature does not allow for selective deletion of snap points, or programmatic access to data within the snapshot. Therefore, if the default snapshot retention rate does not satisfy your compliance requirements, the recommendation is to turn off the feature.

## How to export and delete private data

It is __strongly__ recommended, when possible, to restructure your data collection policy to disable the collection of private data, obfuscating or anonymizing it, or otherwise modifying it to remove it from being considered "private." Handling the data after it has been collected, will result in costs to you and your team to define and automate a strategy, build an interface for your customers to interact with their data through, and ongoing maintenance costs. Further, it is computationally costly for Application Insights, and a large volume of concurrent query or purge API calls have the potential to negatively impact all other interaction with Application Insights functionality. That said, there are indeed some valid scenarios where private data must be collected. For these cases, data should be handled as described in this section.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

### View and export

For both view and export data requests, the [Query API](https://dev.applicationinsights.io/quickstart) should be used. Logic to convert the shape of the data to an appropriate one to deliver to your users will be up to you to implement. [Azure Functions](https://azure.microsoft.com/services/functions/) is a great place to host such logic.

### Delete

> [!WARNING]
> Deletes in Application Insights are destructive and non-reversible! Please use extreme caution in their execution.

We have made available as part of a privacy handling story a "purge" API path. This path should be used sparingly due to the risk associated with doing so, the potential performance impact, and the potential to skew all-up aggregations, measurements, and other aspects of your 
Application Insights data. See the [Strategy for personal data handling](#strategy-for-personal-data-handling) section above for alternative approaches to handle private data.

Purge is a highly privileged operation that no app or user in Azure (including even the resource owner) will have permissions to execute without explicitly being granted a role in Azure Resource Manager. This role is _Data Purger_ and should be carefully delegated due to the potential for data loss.

Once the Azure Resource Manager role has been assigned, two new API paths are available, full developer documentation and call shape linked:

* [POST purge](https://docs.microsoft.com/rest/api/application-insights/components/purge) - takes an object specifying parameters of data to delete and returns a reference GUID
* GET purge status - the POST purge call will return an 'x-ms-status-location' header that will include a URL that you can call to determine the status of your purge API. For example:
   ```
   x-ms-status-location: https://management.azure.com/subscriptions/[SubscriptionId]/resourceGroups/[ResourceGroupName]/providers/microsoft.insights/components/[ComponentName]/operations/purge-[PurgeOperationId]?api-version=2015-05-01
   ```

> [!IMPORTANT]
>  While the vast majority of purge operations may complete much quicker than the SLA, due to their heavy impact on the data platform used by Application Insights, **the formal SLA for the completion of purge operations is set at 30 days**.

## Next steps
To learn more about how data is collected, processed, and secured, see [Application Insights data security](app-insights-data-retention-privacy.md).