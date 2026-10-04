---
ai-usage: ai-assisted
title: Financial risk simulation series for Azure Batch
description: Follow a guided series to plan, automate, accelerate, and package financial risk simulation workloads for Azure Batch.
ms.topic: overview
ms.date: 09/09/2026
# Customer intent: As a developer, I want to understand how financial risk simulations map to Azure Batch, so that I can choose the right implementation path.
---

# Financial risk simulation series for Azure Batch

Financial risk workloads often run many independent calculations against a portfolio or set of market scenarios. Examples include Monte Carlo simulations, stress tests, back tests, and instrument valuations. Azure Batch can distribute these calculations across a managed pool of compute nodes and scale the pool for each run.

This series follows a financial simulation from initial workload design through automation and optimization. It focuses on the decisions that are specific to simulation workloads and links to validated Azure Batch procedures for implementation. It doesn't prescribe a financial model or provide financial advice.

## Decide whether Batch fits your workload

Batch is a good fit when:

- You can split the calculation into independent partitions that don't communicate while they run.
- Each partition can run from a command line or in a container.
- A later step can aggregate the partition outputs into a final result.
- The application can tolerate a task running again after an interruption.
- You want to scale compute capacity for each run instead of maintaining a cluster continuously.

Consider a tightly coupled high-performance computing (HPC) solution when workers must exchange data frequently during a calculation. For more information, see [High-performance computing (HPC) on Azure](/azure/architecture/guide/compute/high-performance-computing).

## Follow the series

1. [Plan a financial risk simulation run](plan-a-run.md) to define partitions, inputs, outputs, and validation requirements.
1. [Automate simulation runs with .NET](automate-with-dotnet.md) to submit tasks, persist results, and aggregate outputs.
1. [Evaluate GPU acceleration for financial models](evaluate-gpu-acceleration.md) to determine whether GPU pools improve performance and cost.
1. [Package financial models with containers](package-models-with-containers.md) to create a repeatable runtime environment.

For a production network and security topology, see [Use Azure Batch to run Financial Service Industry workloads](/industry/financial-services/architecture/fsi-workloads-using-batch).

## Next step

> [!div class="nextstepaction"]
> [Plan a financial risk simulation run](plan-a-run.md)