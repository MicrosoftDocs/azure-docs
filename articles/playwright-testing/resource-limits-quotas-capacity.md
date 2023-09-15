---
title: Service limits
description: 'Service limitations and quotas for running Playwright testing with Microsoft Playwright Testing Preview.'
ms.topic: reference
ms.date: 09/14/2023
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
| Workspaces per subscription | 2 |
| Parallel workers per workspace | 50 |

## Test code limitations

- Only tests Playwright version 1.37 and higher is supported.
- Only the Playwright runner and test code written in JavaScript or TypeScript are supported.

## Supported operating systems and browsers

- The service supports running hosted browsers on Linux and Windows.
- Supports all [browsers that Playwright supports](https://playwright.dev/docs/browsers).

## Request quota increases

To raise the limit or quota above the default limit, [open an online customer support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) at no charge.

1. Select **Create a support ticket**.

1. Provide a **summary** of your issue.

1. Select **Issue type** as *Service and subscription limits (quotas)*.

1. Select your subscription. Then, select **Quota Type** as *Microsoft Playwright Testing*.

1. Select **Next** to continue.

1. In **Problem details**, select **Enter details**.

1. On the **Quota details** pane, for **Location**, enter the Azure region where you want to increase the limit.

1. Select the **Quota type** for which you want to increase the limit.

1. Enter the **New limit requested** and select **Save and continue**.

1. Fill the details for **Advanced diagnostic information**, **Support method**, and **Contact information**.

1. Select **Next** to continue.

1. Select **Create** to submit the support request.

## Related content

- Get started and [run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
