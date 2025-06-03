---
title: Azure App Configuration preview API life cycle
titleSuffix: Azure App Configuration
description: Learn about the preview API life cycle.
services: azure-app-configuration
author: amerjusupovic
ms.author: ajusupovic
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 04/30/2025
---

# Preview API life cycle

The Azure App Configuration control plane preview APIs (all control plane APIs that end in `-preview`) are deprecated 90 days after a newer preview, or stable, API version is released. The policy applies to all API versions released after, and including, 2023-09-01-preview.

We love when people try our preview features and give us feedback, so we encourage you to use the preview APIs.

After an API version is deprecated, it will no longer function! We recommend you routinely:
- Update your ARM/BICEP templates using preview API versions to use the latest version of the preview API.
- Update any preview SDKs or other tools built on the preview API to the latest version.

You should perform these updates at a minimum every 6-9 months. If you fail to do so, you'll be notified that you're using a soon-to-be deprecated API version as deprecation approaches.

> [!NOTE]
> API versions before 2023-09-01-preview won't follow the 90 day pattern outlined in the beginning of this document. Refer to the [Upcoming Deprecations](#upcoming-deprecations) and [Completed Deprecations](#completed-deprecations) tables to see if a preview API version you're using has a deprecation date. 

## How to check what API versions you're using

If you're unsure what client or tool is using this API version, check the [activity logs](/azure/azure-monitor/essentials/activity-log)
using the following command:

### [bash](#tab/bash)

```bash
API_VERSION=<impacted API version, such as 2021-10-01-preview>
az monitor activity-log list --offset 30d --max-events 10000 --namespace Microsoft.AppConfiguration --query "[?eventName.value == 'EndRequest' && httpRequest.uri != null && contains(httpRequest.uri, '$API_VERSION')].[eventTimestamp, httpRequest.uri]" --output table
```

### [PowerShell](#tab/PowerShell)

```powershell
$API_VERSION=<impacted API version, such as 2021-10-01-preview>
az monitor activity-log list --offset 30d --max-events 10000 --namespace Microsoft.AppConfiguration | ConvertFrom-Json | Where-Object { $_.eventName.value -eq "EndRequest" -and $_.httpRequest.uri -match $API_VERSION } | Select-Object eventTimestamp, httpRequest | Format-Table -Wrap -AutoSize
```

---

## How to find the available API versions

If you want to know what API versions are available, you can use the following command for a resource type:

```bash
az provider show --namespace Microsoft.AppConfiguration --query "resourceTypes[?resourceType=='configurationStores'].apiVersions"
```

## How to update to a newer version of the API

- For Azure SDKs: Use a newer API version by updating to a [newer version of the SDK](https://github.com/Azure/AppConfiguration?tab=readme-ov-file#sdks).
- For Azure CLI: Update the CLI itself, usually by running `az upgrade`.
- For REST requests: Update the `api-version` query parameter.
- For other tools: Update the tool to the latest version.

## Upcoming deprecations

| API version        | Announce Date     | Deprecation Date  |
|--------------------|-------------------|-------------------|
| 2023-09-01-preview | April 30, 2025    | July 29, 2025     |

## Completed deprecations

There are no completed deprecations yet.
