---
title: Limits and configuration reference guide
description: 'Service limitations, quotas, and configuration settings for running Playwright testing with Microsoft Playwright Testing Preview.'
ms.topic: reference
ms.date: 02/08/2024
ms.custom: playwright-testing-preview
---

# Service limits in Microsoft Playwright Testing Preview

Azure uses limits and quotas to prevent budget overruns due to fraud, and to honor Azure capacity constraints. Consider these limits as you scale for production workloads. In this article, you learn about:

- Default limits on Azure resources related to Microsoft Playwright Testing Preview.
- Limitations for the Playwright test code
- Supported operating systems and browsers
- Requesting quota increases.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Default resource quotas

While the service is in preview, the following limits apply on a per-subscription basis.

| Resource  | Limit |
|---------|---------|
| Workspaces per region per subscription | 2 |
| Parallel workers per workspace | 100 |
| Access tokens per user per workspace | 10 |

## Test code limitations

- The service supports Playwright OSS version 1.47 or higher.
- The service supports the Playwright test runner and the NUnit test runner only.

## Supported operating systems and browsers

- The service supports running hosted browsers on Linux and Windows.
- Supports all [browsers that Playwright supports](https://playwright.dev/docs/browsers).

## Other limitations

- Moving a workspace to another resource group is not yet supported.
- The Playwright Testing service portal is only available in English. Localization in other languages is currently in progress.

## Request quota increases

To raise the resource quota above the default limit for your subscription, [create an issue in the Playwright Testing GitHub repository](https://github.com/microsoft/playwright-testing-service/issues/new/choose).

## Outbound IP addresses

This section lists the outbound IP address ranges that Microsoft Playwright Testing requires to communicate through your firewall.

| Azure region | IP address range |
|--------------|------------------|
| East US      | 52.190.15.208/28 |
| West US3     | 20.172.9.112/28  |
| East Asia    | 20.24.220.64/28  |
| West Europe  | 98.71.172.224/28 |

## Related content

- Get started and [run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
