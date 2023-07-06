---
title: Request format
description: The Azure Monitor Log Analytics API request format.
ms.date: 11/22/2021
author: guywi-ms
ms.author: guywild
ms.topic: article
---
# Azure Monitor Log Analytics API request format

There are two endpoints through which you can communicate with the Log Analytics API:
- A direct URL for the API: `https://api.loganalytics.azure.com`
- Through Azure Resource Manager (ARM).

While the URLs are different, the query parameters are the same for each endpoint. Both endpoints require authorization through Azure Active Directory (Azure AD).

The API supports the `POST` and `GET` methods.

## Public API format

The Public API format is:

```
    https://api.loganalytics.azure.com/{api-version}/workspaces/{workspaceId}/query?[parameters]
```
where:
 - **api-version**: The API version. The current version is "v1"
 - **workspaceId**: Your workspace ID
 - **parameters**: The data required for this query

## GET /query

When the HTTP method executed is `GET`, the parameters are included in the query string.

For example, to count AzureActivity events by Category, make this call:

```
    GET https://api.loganalytics.azure.com/v1/workspaces/{workspace-id}/query?query=AzureActivity%20|%20summarize%20count()%20by%20Category
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
    POST https://api.loganalytics.azure.com/v1/workspaces/{workspace-id}/query
    
    Authorization: Bearer <access token>
    Content-Type: application/json
    
    {
      "query": "AzureActivity | summarize count() by Category"
    }
```