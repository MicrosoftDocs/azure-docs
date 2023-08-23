---
title: Overview
description: This article describes the REST API that makes the data collected by Azure Log Analytics easily available.
ms.date: 02/28/2023
author: guywi-ms
ms.author: guywild
ms.topic: article
---
# Azure Monitor Log Analytics API overview

The Log Analytics Query API is a REST API that you can use to query the full set of data collected by Azure Monitor logs. You can use the same query language that's used throughout the service. Use this API to retrieve data, build new visualizations of your data, and extend the capabilities of Log Analytics.

## Log Analytics API authentication

You must authenticate to access the Log Analytics API:
- To query your workspaces, you must use [Azure Active Directory (Azure AD) authentication](../../../active-directory/fundamentals/active-directory-whatis.md).
- To quickly explore the API without using Azure AD authentication, you can use an API key to query sample data in a non-production environment.

### Azure AD authentication for workspace data

The Log Analytics API supports Azure AD authentication with three different [Azure AD OAuth2](/azure/active-directory/develop/active-directory-protocols-oauth-code) flows:
- Authorization code
- Implicit
- Client credentials

The authorization code flow and implicit flow both require at least one user interactive sign-in to your application. If you need a non-interactive flow, use the client credentials flow.

After you receive a token, the process for calling the Log Analytics API is the same for all flows. Requests require the `Authorization: Bearer` header, populated with the token received from the OAuth2 flow.

### API key authentication for sample data

To quickly explore the API without using Azure AD authentication, we provide a demonstration workspace with sample data. You can [authenticate by using an API key](./access-api.md#authenticate-with-a-demo-api-key).

> [!NOTE]
> When you use Azure AD authentication, it might take up to 60 minutes for the Application Insights REST API to recognize new role-based access control permissions. While permissions are propagating, REST API calls might fail with [error code 403](./errors.md#insufficient-permissions).

## Log Analytics API query limits

For information about query limits, see the [Query API section of this webpage](../../service-limits.md).

## Try the Log Analytics API

To try the API without writing any code, you can use:
  - Your favorite client such as [Fiddler](https://www.telerik.com/fiddler) or [Postman](https://www.getpostman.com/) to manually generate queries with a user interface.
  - [cURL](https://curl.haxx.se/) from the command line. Then pipe the output into [jsonlint](https://github.com/zaach/jsonlint) to get readable JSON.

Instead of calling the REST API directly, you can use the idiomatic Azure Monitor Query client libraries:

- [.NET](/dotnet/api/overview/azure/Monitor.Query-readme)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azquery)
- [Java](/java/api/overview/azure/monitor-query-readme)
- [JavaScript](/javascript/api/overview/azure/monitor-query-readme)
- [Python](/python/api/overview/azure/monitor-query-readme)

Each client library is a wrapper around the REST API that allows you to retrieve log data from the workspace.
