---
ai-usage: ai-assisted
title: Evaluate GPU acceleration for financial models
description: Evaluate whether GPU-enabled Azure Batch pools improve the performance and cost of financial simulation models.
ms.topic: concept-article
ms.date: 09/09/2026
# Customer intent: As a developer, I want to evaluate GPU acceleration for my financial model, so that I can choose compute that improves performance at an acceptable cost.
---

# Evaluate GPU acceleration for financial models

GPU-enabled pools can accelerate financial models that perform enough parallel numerical work to offset data transfer and initialization costs. A model doesn't benefit from a GPU only because its simulation trials run independently. Profile the calculation before you change the pool.

## Identify a suitable calculation

A GPU is more likely to help when the model:

- Applies the same numerical operations across large arrays of scenarios or paths.
- Has enough work per task to keep the GPU busy.
- Transfers a small amount of data compared with the amount of calculation.
- Uses a framework or implementation that already supports the target GPU runtime.

A CPU pool can be more efficient when tasks are short, branch heavily, transfer large datasets, or spend most of their time reading storage.

## Compare configurations

Use the same model version, input, partition count, and validation criteria for each benchmark. Compare:

- Pool allocation and node initialization time.
- Model and driver initialization time.
- Task duration and throughput.
- Failure and retry rates.
- Total VM cost per completed and validated run.

Start with a small pool and confirm numerical results against the CPU implementation. Different hardware or numeric libraries can produce small floating-point differences, so define acceptable tolerances before testing.

## Prepare a GPU pool

Use a supported GPU-enabled VM size with an image that provides the required NVIDIA drivers. Choose a preconfigured Azure Marketplace image or install the drivers in a custom image. Don't carry forward image names, driver versions, or CUDA versions from older samples without validating current support.

For current pool requirements and examples, see [Use GPU-enabled VM sizes in a Batch pool](../../batch-pool-compute-intensive-sizes.md).

GPU VMs can have limited regional capacity and separate quota requirements. Review [Batch capacity planning](../../batch-capacity-planning.md) before you schedule a production run.

## Next step

> [!div class="nextstepaction"]
> [Package financial models with containers](package-models-with-containers.md)