---
title: Service limits
titleSuffix: Azure Load Testing
description: 'Service limits used for capacity planning and configuring high-scale load tests in Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 09/21/2022
---

# Service limits in Azure Load Testing

Azure uses limits and quotas to prevent budget overruns due to fraud, and to honor Azure capacity constraints. Consider these limits as you scale for production workloads. In this article, you learn about:

- Default limits on Azure resources related to Azure Load Testing.
- Requesting quota increases.

## Default resource quotas

In this section, you learn about the default and maximum quota limits.

### Test engine instances

The following limits apply on a per-region, per-subscription basis.

| Resource  | Default limit | Maximum limit |
|---------|---------|---------|
| Concurrent engine instances |     5-100 <sup>1</sup>    |     1000    |
| Engine instances per test run | 1-45 <sup>1</sup> |  400   | 

<sup>1</sup> If you aren't already at the maximum limit, you can request an increase. We aren't currently able to approve increase requests past our maximum limitations stated above. To request an increase for your default limit, contact Azure Support. Default limits vary by offer category type.

### Test runs

The following limits apply on a per-region, per-subscription basis.

| Resource  | Default limit |  Maximum limit |
|---------|---------|---------|
| Concurrent test runs | 5-25 <sup>2</sup> |     1000    |
| Test duration | 3 hours <sup>2</sup> | 24 |
| Tests per resource | 10000 | |
| Test runs per test | 5000 | |
| File uploads per test | 1000 | |
| App Components per test or test run | 100 | |
| [Test criteria](./how-to-define-test-criteria.md#load-test-fail-criteria) per test | 10 | |

<sup>2</sup> If you aren't already at the maximum limit, you can request an increase. We aren't currently able to approve increase requests past our maximum limitations stated above. To request an increase for your default limit, contact Azure Support. Default limits vary by offer category type.

### Data retention

Azure Load Testing captures metrics, test results, and logs for each test run. The following data retention limits apply:

| Resource | Limit | Notes |
|----------|-------|-------|
| Server-side metrics | 90 days | Learn how to [configure server-side metrics](./how-to-monitor-server-side-metrics.md). |
| Client-side metrics | 365 days | |
| Test results | 6 months | Learn how to [export test results](./how-to-export-test-results.md). |
| Test log files | 6 months | Learn how to [download the logs for troubleshooting tests](./how-to-troubleshoot-failing-test.md). |

## Request quota increases

To raise the limit or quota above the default limit, [open an online customer support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) at no charge.

1. Select **Create a support ticket**.

1. Provide a **summary** of your issue.

1. Select **Issue type** as *Service and subscription limits (quotas)*.

1. Select your subscription. Then, select **Quota Type** as *Azure Load Testing*.

1. Select **Next** to continue.

1. In **Problem details**, select **Enter details**.

1. On the **Quota details** pane, for **Location**, enter the Azure region where you want to increase the limit.

1. Select the **Quota type** for which you want to increase the limit.

1. Enter the **New limit requested** and select **Save and continue**.

1. Fill the details for **Advanced diagnostic information**, **Support method**, and **Contact information**.

1. Select **Next** to continue.

1. Select **Create** to submit the support request.

## Next steps

- Learn how to [set up a high-scale load test](./how-to-high-scale-load.md).
- Learn how to [configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
