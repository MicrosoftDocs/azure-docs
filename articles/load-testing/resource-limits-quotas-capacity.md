---
title: Service limits
titleSuffix: Azure Load Testing
description: 'Service limits used for capacity planning and configuring high-scale load tests in Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 06/20/2022
---

# Service limits in Azure Load Testing Preview

This section lists basic quotas and limits for Azure Load Testing Preview.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Limits

|Resource  |Limit  |
|---------|---------|
|Maximum concurrent engine instances that can be utilized per region per subscription     |    100     |
|Maximum concurrent test runs per region per subscription     |    25     |

## Increase quotas

You can increase the default limits and quotas by requesting the increase through an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

1. Select **create a support ticket**.

1. Provide a summary of your issue.

1. Select **Issue type** as *Technical*.

1. Select your subscription. Then, select **Service Type** as *Azure Load Testing - Preview*.

1. Select **Problem type** as *Test Execution*.

1. Select **Problem subtype** as *Provisioning stalls or fails*.

## Next steps

- Learn how to [set up a high-scale load test](./how-to-high-scale-load.md).
- Learn how to [configure automated performance testing](./tutorial-cicd-azure-pipelines.md).
