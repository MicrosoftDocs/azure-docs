---
title: Service limits
description: 'Service limitations and quotas for running Playwright testing with Microsoft Playwright Testing Preview.'
ms.topic: reference
ms.date: 10/04/2023
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
| Parallel workers per workspace | 50 |
| Access tokens per user per workspace | 10 |

## Test code limitations

- Only tests Playwright version 1.37 and higher is supported.
- Only the Playwright runner and test code written in JavaScript or TypeScript are supported.

## Supported operating systems and browsers

- The service supports running hosted browsers on Linux and Windows.
- Supports all [browsers that Playwright supports](https://playwright.dev/docs/browsers).

## Other limitations

- Moving a workspace to another resource group is not yet supported.
- The Playwright portal is only available in English. Localization in other languages is currently in progress.

## Request quota increases

To raise the resource quota above the default limit for your subscription, [create an issue in the Playwright Testing GitHub repository](https://github.com/microsoft/playwright-testing-service/issues/new/choose).

## Related content

- Get started and [run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
