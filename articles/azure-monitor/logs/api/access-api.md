---
title: Access the API
description: There are two endpoints through which you can communicate with the Azure Monitor Log Analytics API.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/18/2021
ms.topic: article
---
# Access the Azure Monitor Log Analytics API

You can communicate with the Azure Monitor Log Analytics API using this endpoint: `https://api.loganalytics.io`. To access the API, you must authenticate through Azure Active Directory (Azure AD). 
## Public API format

The public API format is:

```
    https://{hostname}/{api-version}/workspaces/{workspaceId}/query?[parameters]
```
where:
 - **hostname**: `https://api.loganalytics.io`
 - **api-version**: The API version. The current version is "v1"
 - **workspaceId**: Your workspace ID
 - **parameters**: The data required for this query
 
## Next Steps
Get detailed information about the [API format](request-format.md). 