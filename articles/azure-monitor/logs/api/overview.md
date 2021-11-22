---
title: Overview
description: This site describes the REST API created to make data collected by Azure Log Analytics easily available.
author: bwren
ms.author: abbyweisberg
ms.date: 11/15/2021
ms.topic: article
---
# Overview

The **Query API** is a REST API designed to give users API access to the same data and queries as with [Log Analytics](https://azure.microsoft.com/blog/announcing-the-new-and-improved-azure-log-analytics/). You can use this API to build new visualizations of your data and extend the capabilities of Log Analytics.

## Trying the APIs

To try the API yourself without writing any code you can use:
  - Your favorite client such as [Fiddler](https://www.telerik.com/fiddler) or [Postman](https://www.getpostman.com/) to manually generate queries with a user interface.
  - [API Explorer](https://dev.loganalytics.io/apiexplorer/query) to create and execute queries, examine results and even build HTTP requests to execute from the command line using [cURL](https://curl.haxx.se/).
  - [cURL](https://curl.haxx.se/) from the command line, and then pipe the output into [jsonlint](https://github.com/zaach/jsonlint) to get readable JSON. 

To learn more about the query language, see the [query language documentation](https://docs.loganalytics.io/) which includes a [language reference](https://docs.loganalytics.io/docs/Language-Reference), [examples](https://docs.loganalytics.io/docs/Examples), [tutorials](https://docs.loganalytics.io/docs/Learn/Tutorials/Date-and-time-operations) and [cheat sheets](https://docs.loganalytics.io/docs/Learn/References/Legacy-to-new-to-Azure-Log-Analytics-Language) It also offers a full-featured [demo environment](https://portal.loganalytics.io/demo) that lets you try out any query on sample data.gfd                                                                                  
  