---
title: Azure App Configuration preview API life cycle
titleSuffix: Azure App Configuration
description: Learn about the preview API life cycle.
services: azure-app-configuration
author: amerjusupovic
ms.author: ajusupovic
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/12/2025
---

# Preview API life cycle

The Azure App Configuration preview APIs (APIs that end in `-preview`) have a lifespan of ~one year from their release date.
This means that you can expect the 2024-06-01-preview API to be deprecated somewhere around June 1, 2025. 

We love when people try our preview features and give us feedback, so we encourage you to use the preview APIs.

After an API version is deprecated, it will no longer function! We recommend you routinely:
- Update your ARM/BICEP templates using preview API versions to use the latest version of the preview API.
- Update any preview SDKs or other tools built on the preview API to the latest version.

You should perform these updates at a minimum every 6-9 months. If you fail to do so, you'll be notified that you're using a soon-to-be deprecated 
API version as deprecation approaches.

## How to check what API versions you're using

If you're unsure what client or tool is using this API version, check the [activity logs](/azure/azure-monitor/essentials/activity-log)
using the following command:

```bash
API_VERSION=<impacted API version, such as 2021-10-01-preview>
az monitor activity-log list --offset 30d --max-events 10000 --namespace Microsoft.AppConfiguration --query "[?eventName.value == 'EndRequest' && contains(not_null(httpRequest.uri,''), '${API_VERSION}')]"
```

## How to find the available API versions

If you want to know what API versions are available, you can use the following command for a resource:

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

## Completed deprecations

| API version        | Announce Date     | Deprecation Date  |
|--------------------|-------------------|-------------------|
