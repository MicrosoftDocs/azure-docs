---
title: Overview
description: This site describes a set of REST APIs created to make data collected by Azure Log Analytics easily available.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Overview

This site describes a set of REST APIs created to make data collected by [Azure Log Analytics](https://azure.microsoft.com/blog/announcing-the-new-and-improved-azure-log-analytics/) easily available. Using these APIs you can build new visualizations of your data and extend the capabilities of Log Analytics.

The following documentation describes how to use these APIs. To test the APIs yourself, use this site's [API Explorer](https://dev.loganalytics.io/apiexplorer/query) to create and execute queries, examine results and even build HTTP requests to execute from the command line using [cURL](https://curl.haxx.se/).

To learn more about the query language, see the [query language documentation](https://docs.loganalytics.io/) which includes a [language reference](https://docs.loganalytics.io/docs/Language-Reference), [examples](https://docs.loganalytics.io/docs/Examples), [tutorials](https://docs.loganalytics.io/docs/Learn/Tutorials/Date-and-time-operations) and [cheat sheets](https://docs.loganalytics.io/docs/Learn/References/Legacy-to-new-to-Azure-Log-Analytics-Language) It also offers a full-featured [demo environment](https://portal.loganalytics.io/demo) that lets you try out any query on sample data. We are also launching a [community site](https://aka.ms/azureloganalyticscommunity) enabling you to interact with other product users, as well as the product team, with questions regarding query language.

## Capabilities

There are several APIs which can be applied to building a variety solutions using data from Log Analytics.

1.  **Query**: the query API is designed to give users API access to the same data and queries as with [Log Analytics](https://azure.microsoft.com/blog/announcing-the-new-and-improved-azure-log-analytics/).

## Trying the APIs

If you would like to try the API without writing any code:

  - Use your favorite client such as [Fiddler](https://www.telerik.com/fiddler) or [Postman](https://www.getpostman.com/) to manually generate queries with a user interface.

  - To try these APIs from the command line, you can use [cURL](https://curl.haxx.se/) and then piping the output into [jsonlint](https://github.com/zaach/jsonlint) to get readable JSON.
