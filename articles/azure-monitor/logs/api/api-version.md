---
title: API Version
description: The API comes in stable and experimental versions.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# API Version

The API comes in stable and experimental versions. Because we might introduce breaking changes to our beta APIs, we recommend that you use the beta version only to test apps that are in development; do not use beta APIs in your production apps. Use a stable version for all production apps.

The API is offered via two [endpoints](api-endpoints.md). We generally offer parity of versions between our direct endpoint and our Azure Resource Manager endpoint, but using different syntax and version strings:

Direct: [https://api.loganalytics.io/{api-version}/workspaces/query](https://api.loganalytics.io/%7Bapi-version%7D/workspaces/query)

ARM: [https://management.azure.com/subscriptions/{guid}/resourceGroups/{name}/providers/Microsoft.OperationalInsights/workspaces/{name}?api-version={api-version}](https://management.azure.com/subscriptions/%7Bguid%7D/resourceGroups/%7Bname%7D/providers/Microsoft.OperationalInsights/workspaces/%7Bname%7D?api-version=%7Bapi-version%7D)

## Current Versions

| Version     | Direct API | ARM API      |
| ---- | ---------- | ------------------ |
| v1   | v1         | 2017-10-01         |
| Beta | beta       | 2017-01-01-preview |
