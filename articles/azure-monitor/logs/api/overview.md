---
title: Overview
description: This site describes the REST API created to make data collected by Azure Log Analytics easily available.
author: bwren
ms.author: abbyweisberg
ms.date: 11/15/2021
ms.topic: article
---
# Overview

The **Query API** is a REST API that lets you query the full set of data collected by Log Analytics using the same query language used throughout the service. You can use this API to build new visualizations of your data and extend the capabilities of Log Analytics.

## Log Analytics API Authentication

You must authenticate to access the API. 
- To query your workspaces, you must use [Azure Active Directory authentication](https://azure.microsoft.com/documentation/articles/active-directory-whatis/).
- To quickly explore the API without using AAD authentication, you can use an API key to query sample data.

### AAD authentication for workspace data

The Log Analytics API supports AAD authentication with three different [AAD OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Authorization code
- Implicit
- Client credentials 

The authorization code flow and implicit flow both require at least one user-interactive login to your application. If you need a totally non-interactive flow, you must use the client credentials flow.

Once you have received a token, the process for calling the Log Analytics API is identical for all flows. Requests require the `Authorization: Bearer` header, populated with the token received from the OAuth2 flow.

### API key authentication for sample data

To quickly explore the API without using AAD authentication, we provide a demonstration workspace with sample data, which allows API key authentication. [Learn more about using API key authentication](api-keys.md).

## Trying the APIs

To try the API yourself without writing any code you can use:
  - Your favorite client such as [Fiddler](https://www.telerik.com/fiddler) or [Postman](https://www.getpostman.com/) to manually generate queries with a user interface.
  - [API Explorer](https://dev.loganalytics.io/apiexplorer/query)to create and execute queries, examine results and even build HTTP requests to execute from the command line using [cURL](https://curl.haxx.se/).
  - [cURL](https://curl.haxx.se/) from the command line, and then pipe the output into [jsonlint](https://github.com/zaach/jsonlint) to get readable JSON. 

To learn more about the query language, see the [query language documentation](https://docs.loganalytics.io/) which includes a [language reference](https://docs.loganalytics.io/docs/Language-Reference), [examples](https://docs.loganalytics.io/docs/Examples), [tutorials](https://docs.loganalytics.io/docs/Learn/Tutorials/Date-and-time-operations) and [cheat sheets](https://docs.loganalytics.io/docs/Learn/References/Legacy-to-new-to-Azure-Log-Analytics-Language). It also offers a full-featured [demo environment](https://portal.loganalytics.io/demo) that lets you try out any query on sample data.