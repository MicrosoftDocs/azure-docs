---
ai-usage: ai-assisted
title: Plan a financial risk simulation run
description: Plan partitions, data movement, compute resources, and validation for a financial risk simulation run on Azure Batch.
ms.topic: how-to
ms.date: 09/09/2026
# Customer intent: As a developer, I want to plan a financial simulation run, so that I can validate the workload in Azure Batch before I automate it.
---

# Plan a financial risk simulation run

Before you automate a financial simulation, define one small run that you can inspect in the Azure portal or Batch Explorer. A small run helps you validate the model, partitioning strategy, and output format before you scale the workload.

## Map the workload to Batch resources

| Simulation element | Batch resource | Planning decision |
| --- | --- | --- |
| One simulation run | Job | Use a unique job ID that identifies the run. |
| A portfolio segment or range of trials | Task | Give each partition a deterministic task ID. |
| Workers that execute the model | Pool | Choose a VM size and task slots from measured resource use. |
| Model executable and dependencies | Application package, resource files, or container image | Version the model separately from its input data. |
| Portfolio and market data | Azure Storage | Separate shared reference data from partition-specific input. |
| Partition results and logs | Task output files | Use a unique path for each job, task, and attempt. |
| Portfolio-level result | Dependent task or external orchestrator | Aggregate only after all required outputs are valid. |

For a general introduction to these resources, see [Batch service workflow and resources](../../batch-service-workflow-features.md).

## Define the run manifest

Record the following information before you create the job:

- Model and input data versions.
- Number of trials and partitions.
- Random-number seed policy.
- Expected output schema and partition count.
- Pool image, VM size, and application version.
- Retention requirements for results and diagnostic logs.

Store the manifest with the outputs. It provides the information needed to reproduce and audit the run.

## Choose the partition size

Start with partitions that take a few minutes rather than a few seconds. Very small partitions can spend more time in scheduling and data transfer than in calculation. Very large partitions increase the work lost after an interruption.

Use immutable run and partition identifiers to derive random-number seeds. The same partition should produce the same result when Batch retries or requeues it.

## Validate a small run

1. Complete the [portal quickstart](../../quick-create-portal.md) to create a small pool, job, and task.
1. Substitute a small, non-sensitive input dataset and your model command after you understand the basic workflow.
1. Confirm that every expected partition produces a result and diagnostic output.
1. Compare the aggregate result with a known local result or tolerance range.
1. Review task exit codes, retry counts, and output upload errors before you increase the pool or partition count.

Don't put secrets or sensitive financial data in task command lines, task IDs, job metadata, or logs.

## Next step

> [!div class="nextstepaction"]
> [Automate simulation runs with .NET](automate-with-dotnet.md)