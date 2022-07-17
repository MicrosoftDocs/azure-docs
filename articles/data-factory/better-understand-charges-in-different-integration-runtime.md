---
title: Examples for better understanding pricing model under different integration runtime types
description: Learn about pricing model under different integration runtime types from some examples.
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions, devx-track-azurepowershell
ms.date: 07/17/2022
---

# Examples for better understanding pricing model under different integration runtime types

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this article, we'll illustrate the pricing model using different integration runtime through some concrete examples. These examples only focus on copy activity, pipeline activity and external activity running on the integration runtime. It doesn't involve charges for Data Factory Pipeline Orchestration, Data Factory Operations and Data Factory Operations. For all pricing details, see [Data Pipeline Pricing and FAQ](pricing-concepts.md).

The integration runtime, which is serverless in Azure and self-hosted in hybrid scenarios, provides the compute resources used to execute the activities in a pipeline. Integration runtime charges are prorated by the minute and rounded up.

> [!NOTE] 
> The prices used in these examples below are hypothetical and are not intended to imply actual pricing.

## Azure integration runtime

**Example 1: If there are 6 copy activities executed sequentially. 4 DIUs are used for the first 2 copy activities and the execution time of each is 40 seconds. The other 4 choose using 8 DIUs and the execution time of each is 1 minute and 20 seconds.**

The execution time of the first 2 activities is both rounded up to 1 minute each. The other 4 are all rounded up to 2 minutes each. The price for copy activity using Azure integration runtime is $0.25 /DIU-hour.

:::image type="content" source="./media/integration-runtime-pricing/azure-integration-runtime-example1.png" alt-text="Screenshot that shows calculation formula for Azure integration runtime example 1.":::


**Example 2: If there are 50 copy activities triggered by Foreach. 4 DIUs are used for each copy activity, and each executes for 40 seconds. The parallel is configured as 50 in Foreach.**

The execution time of each copy activity is rounded up to 1 minute. Although the 50 copy activities run in parallel, they use different computes. So they're charged independently. The price for copy activity using Azure integration runtime is $0.25 /DIU-hour.

:::image type="content" source="./media/integration-runtime-pricing/azure-integration-runtime-example2.png" alt-text="Screenshot that shows calculation formula for Azure integration runtime example 2.":::


**Example 3: If there are 6 HDInsight activities triggered by Foreach. The execution time of each is 9 minutes and 40 seconds. The parallel is configured as 50 in Foreach.**

The execution time of each HDInsight activity is rounded up to 10 minutes. Although the 6 HDInsight activities run in parallel, they use different computes. So they're charged independently. The price for external activity using Azure integration runtime is $0.00025/hour.

:::image type="content" source="./media/integration-runtime-pricing/azure-integration-runtime-example3.png" alt-text="Screenshot that shows calculation formula for Azure integration runtime example 3.":::


## Azure integration runtime with managed virtual network enabled

**Example 1: If there are 6 copy activities executed sequentially. 4 DIUs are used for each copy activity and the execution time of each is 40 seconds. Assume the queue time is 1 minute and no TTL enabled.**

The execution time and queue time totally are rounded up to 2 minutes. As no TTL is enabled, every copy activity has a queue time. The price for copy activity using Azure integration runtime with managed virtual network enabled is $0.25 /DIU-hour.

:::image type="content" source="./media/integration-runtime-pricing/vnet-integration-runtime-example1.png" alt-text="Screenshot that shows calculation formula for Azure integration runtime with managed virtual network example 1.":::

**Example 2: If there are 6 copy activities executed sequentially. 4 DIUs are reserved for copy activity and the execution time of each is 40 seconds. Assume the queue time is 1 minute and TTL is 5 minutes.**

As the compute is reserved, the 6 copy activities aren't rounded up independently and are charged together. And TTL is enabled, so only the first copy activity has queue time. The price for copy activity using Azure integration runtime with managed virtual network enabled is $0.25 /DIU-hour.

:::image type="content" source="./media/integration-runtime-pricing/vnet-integration-runtime-example2.png" alt-text="Screenshot that shows calculation formula for Azure integration runtime with managed virtual network example 2.":::

**Example 3: If there are 6 HDInsight activities triggered by Foreach. The execution time of each is 9 minutes and 40 seconds. The parallel is configured as 50 in Foreach. TTL is 30 minutes.**

The execution time of each HDInsight activity is rounded up to 10 minutes. As the 6 HDInsight activities run in parallel and within the concurrency limitation (800), they're only charged once. The price for external activity using Azure integration runtime with managed virtual network enabled is $1/hour.

:::image type="content" source="./media/integration-runtime-pricing/vnet-integration-runtime-example3.png" alt-text="Screenshot that shows calculation formula for Azure integration runtime with managed virtual network example 3.":::


## Self-hosted integration runtime

**Example 1: If there are 6 copy activities executed sequentially. The execution time of each is 40 seconds.**

The execution time of each copy activity is rounded up to 1 minute each. The price for copy activity using self-hosted integration runtime is $0.1/hour.

:::image type="content" source="./media/integration-runtime-pricing/self-hosted-integration-runtime-example1.png" alt-text="Screenshot that shows calculation formula for Self-hosted integration runtime example 1.":::

**Example 2: If there are 50 copy activities triggered by Foreach. The execution time of each is 40 seconds. The parallel is configured as 50 in Foreach.**

The execution time of each copy activity is rounded up to 1 minute. Although the 50 copy activities run in parallel, they're charged independently.

:::image type="content" source="./media/integration-runtime-pricing/self-hosted-integration-runtime-example2.png" alt-text="Screenshot that shows calculation formula for Self-hosted integration runtime example 2.":::

**Example 3: If there are 6 HDInsight activities triggered by Foreach. The execution time of each is 9 minutes and 40 seconds. The parallel is configured as 50 in Foreach.**

The execution time of each HDInsight activity is rounded up to 10 minutes. Although the 6 HDInsight activities run in parallel, they're charged independently.

:::image type="content" source="./media/integration-runtime-pricing/self-hosted-integration-runtime-example3.png" alt-text="Screenshot that shows calculation formula for Self-hosted integration runtime example 3.":::
