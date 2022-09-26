---
title: Overview
description: This site describes the REST API created to make the data collected by Azure Log Analytics easily available.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/29/2021
ms.topic: article
---
# Azure Monitor Log Analytics API Overview

The Log Analytics **Query API** is a REST API that lets you query the full set of data collected by Azure Monitor logs using the same query language used throughout the service. You can use this API to build new visualizations of your data and extend the capabilities of Log Analytics.

## Log Analytics API Authentication

You must authenticate to access the Log Analytics API. 
- To query your workspaces, you must use [Azure Active Directory authentication](../../../active-directory/fundamentals/active-directory-whatis.md).
- To quickly explore the API without using Azure AD authentication, you can use an API key to query sample data in a non-production environment.

### Azure AD authentication for workspace data

The Log Analytics API supports Azure AD authentication with three different [Azure AD OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Authorization code
- Implicit
- Client credentials 

The authorization code flow and implicit flow both require at least one user-interactive login to your application. If you need a completely non-interactive flow, you must use the client credentials flow.

After receiving a token, the process for calling the Log Analytics API is identical for all flows. Requests require the `Authorization: Bearer` header, populated with the token received from the OAuth2 flow.

### API key authentication for sample data

To quickly explore the API without using Azure AD authentication, we provide a demonstration workspace with sample data, which allows [authenticating with an API key](authentication-authorization.md#authenticating-with-an-api-key).

> [!NOTE]
> When using Azure AD authentication, it may take up to 60 minutes for the Azure Application Insights REST API to recognize new 
> role-based access control (RBAC) permissions. While permissions are propagating, REST API calls may fail with [error code 403](./errors.md#insufficient-permissions). 

## Log Analytics API Query Limits

See [the **Query API** section of this page](../../service-limits.md#la-query-api) for information about query limits.

## Trying the Log Analytics API

To try the API without writing any code, you can use:
  - Your favorite client such as [Fiddler](https://www.telerik.com/fiddler) or [Postman](https://www.getpostman.com/) to manually generate queries with a user interface.
  - [cURL](https://curl.haxx.se/) from the command line, and then pipe the output into [jsonlint](https://github.com/zaach/jsonlint) to get readable JSON. 

Instead of calling the REST API directly, you can also use the Azure Monitor Query SDK. The SDK contains idiomatic client libraries for [.NET](/dotnet/api/overview/azure/Monitor.Query-readme), [Java](/java/api/overview/azure/monitor-query-readme), [JavaScript](/javascript/api/overview/azure/monitor-query-readme), and [Python](/python/api/overview/azure/monitor-query-readme). Each client library is a wrapper around the REST API that allows you to retrieve log data from the workspace.
