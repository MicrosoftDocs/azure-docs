---
title: Preview API life cycle
titleSuffix: Azure App Configuration
description: Learn about the preview API life cycle.
services: azure-app-configuration
author: amerjusupovic
ms.author: ajusupovic
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/05/2025
---

# Preview API life cycle

The Azure App Configuration preview APIs (APIs that end in `-preview`) have a lifespan of ~one year from their release date.
This means that you can expect the 2024-06-01-preview API to be deprecated somewhere around June 1st, 2025. 

We love when people try our preview features and give us feedback, so we encourage you to use the preview APIs.

After an API version is deprecated, it will no longer function! We recommend you routinely:
- Update your ARM/BICEP templates using preview API versions to use the latest version of the preview API.
- Update any preview SDKs or other tools built on the preview API to the latest version.

You should perform these updates at a minimum every 6-9 months. If you fail to do so, you will be notified that you are using a soon-to-be deprecated 
API version as deprecation approaches.

## How to check what API versions you're using

If you're unsure what client or tool is using this API version, check the [activity logs](/azure/azure-monitor/essentials/activity-log)
using the following command:

```bash
API_VERSION=<impacted API version, such as 2021-10-01-preview>
az monitor activity-log list --offset 30d --max-events 10000 --namespace Microsoft.AppConfiguration --query "[?eventName.value == 'EndRequest' && contains(not_null(httpRequest.uri,''), '${API_VERSION}')]"
```

## How to update to a newer version of the API

- For Azure SDKs: use a newer API version by updating to a [newer version of the SDK](https://azure.github.io/azure-sdk/releases/latest/index.html?search=containerservice).
- For Azure CLI: Update the CLI itself and the aks-preview extension (if used) to the latest version by running `az upgrade` and `az extension update --name "aks-preview"`.
- For Terraform: Update to the latest version of the AzureRM Terraform module. To find out what version of the API a particular Terraform release is using,
  check the [Terraform release notes](/azure/developer/terraform/provider-version-history-azurerm) or 
  git log [this file](https://github.com/hashicorp/terraform-provider-azurerm/blob/main/internal/services/containers/client/client.go).
- For other tools: Update the tool to the latest version.


## Upcoming deprecations

| API version        | Announce Date     | Deprecation Date  |
|--------------------|-------------------|-------------------|
| 2022-09-02-preview | March 27, 2024    | June 20, 2024     |
| 2022-10-02-preview | March 27, 2024    | June 20, 2024     |
| 2023-01-02-preview | March 27, 2024    | June 20, 2024     |
| 2023-02-02-preview | March 27, 2024    | June 20, 2024     |
| 2023-03-02-preview | Oct 21, 2024      | February 3, 2025  |
| 2023-04-02-preview | Oct 21, 2024      | February 10, 2025 |
| 2023-05-02-preview | Oct 21, 2024      | February 17, 2025 |
| 2023-06-02-preview | Oct 21, 2024      | February 24, 2025 |
| 2023-07-02-preview | Oct 21, 2024      | March 3, 2025     |
| 2023-08-02-preview | Oct 21, 2024      | March 10, 2025    |

## Completed deprecations

| API version        | Announce Date     | Deprecation Date  |
|--------------------|-------------------|-------------------|
