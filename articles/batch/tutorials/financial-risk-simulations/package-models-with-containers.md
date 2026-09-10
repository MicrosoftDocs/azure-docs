---
ai-usage: ai-assisted
title: Package financial models with containers
description: Package a financial simulation model and its dependencies for repeatable execution on Azure Batch container pools.
ms.topic: how-to
ms.date: 09/09/2026
# Customer intent: As a developer, I want to package my financial model in a container, so that Batch tasks use a consistent and versioned runtime.
---

# Package financial models with containers

A container image can package a financial model with its runtime and dependencies. This approach helps you reproduce runs and move the same tested application version between development and Batch compute environments.

Use [Run container applications on Azure Batch](../../batch-docker-container-workloads.md) for the current pool and task configuration. Apply the following practices to a financial simulation image.

## Define the image boundary

Include the following items in the image:

- The versioned model executable or script.
- Runtime libraries and operating system packages.
- A stable command-line interface for input, output, and partition identifiers.
- Health or version commands that operators can use for diagnostics.

Keep portfolio data, market data, credentials, and run manifests outside the image. Deliver input through protected storage and persist results after each task.

## Build for repeatable runs

1. Pin the base image and package versions that you test.
1. Record the image digest in the run manifest.
1. Run the image locally against a small known dataset.
1. Confirm that the container writes results and diagnostics to paths that the Batch task can upload.
1. Scan the image for vulnerabilities before you deploy it.

Store private images in Azure Container Registry. Assign a user-assigned managed identity to the Batch pool and grant it only the registry and storage access that the tasks require.

## Configure the Batch pool and tasks

Create the pool with a supported container image and node agent. Set each task's container settings, command line, resource files, and output files. Use immutable image tags or digests for production runs instead of a mutable `latest` tag.

If the model uses GPUs, choose a GPU-enabled pool image that supports containers and the model's runtime. Validate driver and framework compatibility by following [Use GPU-enabled VM sizes in a Batch pool](../../batch-pool-compute-intensive-sizes.md).

## Validate before scaling

Run one partition first. Confirm the model version, input version, output schema, exit code, and diagnostic logs. Then increase the task and node counts while you monitor storage throughput and image-pull time.

For cost controls, combine autoscale with dedicated or [Spot nodes](../../batch-spot-vms.md) according to the run deadline and tolerance for interruption. Scale the pool to zero or delete it when the run finishes.

## Next steps

- Review [Azure Batch best practices](../../best-practices.md).
- Learn how to [plan and manage Azure Batch costs](../../plan-to-manage-costs.md).
- Review [reliability in Azure Batch](/azure/reliability/reliability-batch).