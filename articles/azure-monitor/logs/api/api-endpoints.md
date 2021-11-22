---
title: Accessing the API
description: There are two endpoints through which you can communicate with the Log Analytics API.
author: bwren
ms.author: abbyweisberg
ms.date: 11/18/2021
ms.topic: article
---
# Accessing the API

There are two endpoints through which you can communicate with the Log Analytics API. While the URLs are different, the query parameters are the same for each endpoint, Both endpoints require authorization through Azure Active Directory (AAD). 

The two endpoints are:
- A direct URL for the API: [api.loganalytics.io](https://api.loganalytics.io/)
- Through Azure Resource Manager (ARM).

## Public API format

The Public API format is:

```
    https://{hostname}/{api-version}/workspaces/{workspaceId}/query?[parameters]
```
where:
 - **hostname**: [api.loganalytics.io](https://api.loganalytics.io/)
 - **api-version**: The API version. The current version is "v1"
 - **workspaceId**: Your workspace ID
 - **parameters**: The data required for this query

## Azure Resource Manager (ARM) API format

The ARM API format is:

```
    https://{hostname}/{resource}/query?[parameters]&api-version={api-version}
```
where:

1.  **hostname**: [management.azure.com](https://management.azure.com/)
1.  **resource**: The Azure path of your Application Insights resource: `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}`
1.  **parameters**: The data required for this query
1.  **api-version**: The API version. The current version is "2017-01-01"