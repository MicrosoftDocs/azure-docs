---
title: Service limits
titleSuffix: Azure Load Testing
description: 'Service limits used for capacity planning and configuring high-scale load tests in Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 08/30/2022
---

# Service limits in Azure Load Testing Preview

Azure uses limits and quotas to prevent budget overruns due to fraud, and to honor Azure capacity constraints. Consider these limits as you scale for production workloads. In this article, you learn about:

- Default limits on Azure resources related to Azure Load Testing Preview.
- Requesting quota increases.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Default resource quotas

In this section, you learn about the default and maximum quota limits.

### Test engine instances

The following limits apply on a per-region, per-subscription basis.

| Resource  | Limit | 
|---------|---------| 
| Concurrent engine instances |    100     |
| Engine instances per test run | 45 |

### Test runs

The following limits apply on a per-region, per-subscription basis.

| Resource  | Limit |
|---------|---------|
| Concurrent test runs | 25 |
| Test duration | 3 hours |

### Data retention

Azure Load Testing captures metrics, test results, and logs for each test run. The following data retention limits apply:

| Resource | Limit | Notes |
|----------|-------|-------|
| Server-side metrics | 90 days | Learn how to [configure server-side metrics](./how-to-monitor-server-side-metrics.md). |
| Client-side metrics | 365 days | |
| Test results | 6 months | Learn how to [export test results](./how-to-export-test-results.md). |
| Test log files | 6 months | Learn how to [download the logs for troubleshooting tests](./how-to-find-download-logs.md). |

## Request quota increases

To raise the limit or quota above the default limit, [open an online customer support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) at no charge.

1. Select **create a support ticket**.

1. Provide a summary of your issue.

1. Select **Issue type** as *Technical*.

1. Select your subscription. Then, select **Service Type** as *Azure Load Testing - Preview*.

1. Select **Problem type** as *Test Execution*.

1. Select **Problem subtype** as *Provisioning stalls or fails*.

## Next steps

- Learn how to [set up a high-scale load test](./how-to-high-scale-load.md).
- Learn how to [configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
