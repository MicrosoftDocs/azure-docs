---
title: URL formats
description: There are two endpoints through which you can address the Log Analytics API.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# URL formats

There are two endpoints through which you can address the Log Analytics API. We offer [api.loganalytics.io](https://api.loganalytics.io/) as a direct URL for the API, and we offer access to the API through Azure Resource Manager (ARM). The query parameters are the same for each endpoint, but the URLs differ.

Both endpoints require authorization through Azure Active Directory (AAD).

## Public API format

It has the format:

```
    https://{hostname}/{api-version}/workspaces/{resource}/{area}/[path]?[parameters]
```

For the Public API format, the components of URL are:

1.  **hostname**: [api.loganalytics.io](https://api.loganalytics.io/)
2.  **resource**: this is your Workspace ID.
3.  **api-version**: the API versions required to use in the path, for example "v1"
4.  **area**: we support query and metadata endpoints.
5.  **path**: provides more specifics to the requests, for example if you wish to hit query/schema
6.  **parameters**: these parameters specify the details of the data and depend on the query-path

## Azure Resource Manager (ARM) API format

The format of this API is:

```
    https://{hostname}/{resource}/{area}/[path]?[parameters]&api-version={api-version}
```

For the Azure API format, the components of URL are:

1.  **hostname**: [management.azure.com](https://management.azure.com/)
2.  **resource**: this is Azure path of your Application Insights resource of the form `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}`
3.  **api-version**: the API versions used in the query string, for example `2017-01-01-preview`, are defined [here](https://dev.loganalytics.io/documentation/Overview/API-Version)
4.  **area**: the base supported query paths are query and metadata.
5.  **path**: provides more specifics to the request, for example query/schema
6.  **parameters**: these parameters specify the details of the data and depend on the query-path

Since most of the following content is going to focus on the parameters for a particular path, the Public API will be used in the examples.
