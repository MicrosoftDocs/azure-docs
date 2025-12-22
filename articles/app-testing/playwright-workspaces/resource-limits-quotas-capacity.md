---
title: Limits and configuration reference guide
titleSuffix: Playwright Workspaces
description: 'Service limitations, quotas, and configuration settings for running Playwright testing with Playwright Workspaces.'
ms.topic: reference
ms.date: 08/07/2025
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: johnsta
ms.author: johnsta
ms.custom: playwright-workspaces
---

# Service limits in Playwright Workspaces

Azure uses limits and quotas to prevent budget overruns due to fraud, and to honor Azure capacity constraints. Consider these limits as you scale for production workloads. In this article, you learn about:

- Default limits on Azure resources related to Playwright Workspaces.
- Limitations for the Playwright test code
- Supported operating systems and browsers
- Requesting quota increases.

## Default resource quotas

The following limits apply on a per-subscription basis.

| Resource  | Limit |
|---------|---------|
| Workspaces per region per subscription | 2 |
| Parallel workers per workspace | 100 |
| Access tokens per user per workspace | 10 |

## Test code limitations

- The service supports Playwright OSS version 1.50 or higher.
- The service supports the Playwright test runner and the NUnit test runner only.

## Supported operating systems and browsers

- The service supports running hosted browsers on Linux and Windows.
- Supports all [browsers that Playwright supports](https://playwright.dev/docs/browsers).

## Other limitations

- Moving a workspace to another resource group is not yet supported.
- The Playwright Workspaces service portal is only available in English. Localization in other languages is currently in progress.

## Request quota increases

To raise the resource quota above the default limit for your subscription, [create an issue in the Playwright Workspaces GitHub repository](https://aka.ms/pww/feedback).

## Outbound IP addresses

This section lists the outbound IP address ranges that Playwright Workspaces requires to communicate through your firewall.

| Azure region | IP address range |
|--------------|------------------|
| East US      | 52.190.15.208/28 |
| West US3     | 20.172.9.112/28  |
| East Asia    | 20.24.220.64/28  |
| West Europe  | 98.71.172.224/28 |

## Related content

- Get started and [run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
