---
title: Request format
description: The Log Analytics API request format.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/22/2021
ms.topic: article
---
# Request format

There are two endpoints through which you can communicate with the Log Analytics API:
- A direct URL for the API: [api.loganalytics.io](https://api.loganalytics.io/)
- Through Azure Resource Manager (ARM).

While the URLs are different, the query parameters are the same for each endpoint. Both endpoints require authorization through Azure Active Directory (AAD).

The API supports the `POST` and `GET` methods.

## Public API format

The Public API format is:

```
    https://api.loganalytics.io/{api-version}/workspaces/{workspaceId}/query?[parameters]
```
where:
 - **api-version**: The API version. The current version is "v1"
 - **workspaceId**: Your workspace ID
 - **parameters**: The data required for this query

## Azure Resource Manager (ARM) API format

The ARM API format is:

```
    https://management.azure.com/{resource}/query?[parameters]&api-version={api-version}
```
where:
 - **resource**: The Azure path of your Application Insights resource: `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}`
 - **parameters**: The data required for this query
 - **api-version**: The API version. The current version is "2017-01-01"


There are two parameters for the query.
1.  **query**: (required) the Log Analytics [query](https://docs.loganalytics.io/docs/Language-Reference) to execute.
2.  **timespan**: (optional) the timespan (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) duration format) in which to run the query. If this parameter is not specified, the query will run on all data.

Depending on the HTTP method, the parameters have to be included in either the query string or in the request body.

## GET /query

When the HTTP method executed is `GET`, the parameters are included in the query string.

For example, to count AzureActivity events by Category, make this call:

```
    GET https://api.loganalytics.io/v1/workspaces/{workspace-id}/query?query=AzureActivity%20|%20summarize%20count()%20by%20Category
    Authorization: Bearer <access token>
```
## POST /query

When the HTTP method executed is `POST`:
 - The body MUST be valid JSON.
 - The request must include the header: `Content-Type: application/json` 
 - The parameters are included as properties in the JSON body.
 - If the **timespan** parameter is included in both the query string and the JSON body, the timespan will be the intersection of the two values. 
 
For example, to count AzureActivity events by Category, make this call:

```
    POST https://api.loganalytics.io/v1/workspaces/{workspace-id}/query
    
    Authorization: Bearer <access token>
    Content-Type: application/json
    
    {
      "query": "AzureActivity | summarize count() by Category"
    }
```