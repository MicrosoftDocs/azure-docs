---
title: What's new in Power BI Workspace Collections
description: Get the latest info on what's new in Power BI Workspace Collections
services: power-bi-workspace-collections
ms.service: power-bi-embedded
author: rkarlin
ms.author: rkarlin
ms.topic: article
ms.workload: powerbi
ms.date: 09/20/2017
---

# What's new in Power BI Workspace Collections

Updates to **Power BI Workspace Collections** are released on a regular basis. However, not every release includes new user-facing features; some releases are focused on back-end service capabilities. We highlight new user-facing capabilities here.

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

## March 2017

**Self-service capabilities**

* [Create new report](create-report-from-dataset.md)
* [Report SaveAs](save-reports.md)
* Embed report in Read/Edit/Create new mode 
* [Toggle report between edit/read modes](toggle-mode.md)

**Data connectivity with REST APIs**

* [Create dataset](https://msdn.microsoft.com/library/azure/mt778875.aspx)
* Push data 

**Management APIs**

* Clone report and dataset
* Bind report to a different dataset

**Samples**

* Updated [JavaScript Report Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo)

## December 2016

* [New JavaScript embed sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)

## October 2016

* [Advanced Analytics with Power BI Workspace Collections and R](https://powerbi.microsoft.com/blog/r-in-pbie/)

## August 31, 2016
Included in this release:

* All new JavaScript SDK that supports [advanced filtering and page navigation](interact-with-reports.md).
* Power BI Workspace Collections are now supported in the Canada Central datacenter. Check [datacenter status](https://azure.microsoft.com/status/).

## July 11, 2016
Included in this release:

* **Great news!** The Power BI Workspace Collections service is no longer in preview - its now GA (generally available).  
* All REST APIs have moved from **/beta** to **/v1.0**.
* .NET and JavaScript SDKs has been updated for **v1.0**.
* Power BI API calls can now be authenticated directly by using API keys. App tokens are only needed for embedding. As part of this, provision and dev tokens have been deprecated in v1.0 APIs, but they’ll continue to work in the beta version until December 30, 2016. To learn more, see [Authenticating and Authorizing with Power BI Workspace Collections](app-token-flow.md).
* Row level security (RLS) support for app tokens and embedded reports. To learn more, see [Row level security with Power BI Workspace Collections](row-level-security.md).
* Updated sample application for all **v1.0** API calls.
* Power BI Workspace Collections support for Azure SDK, PowerShell, and CLI.
* Users can export visualization data to a **.csv**.
* Power BI Workspace Collections are now supported in all the same languages/locales as Microsoft Azure. To learn more, see  [Azure - Languages](https://social.technet.microsoft.com/wiki/contents/articles/4234.windows-azure-extent-of-localization.aspx).

