---
title: Run an LLM inferecing workflow with Flyte on Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to run an LLM inferencing workflow with Flyte on Azure Kubernetes Service (AKS).
ms.topic: how-to
ms.date: 05/22/2024
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
---

# Run an LLM inferencing workflow with Flyte on Azure Kubernetes Service (AKS)

This article shows you how to run an LLM inferencing workflow with [Flyte](https://docs.flyte.org/en/latest/introduction.html) on Azure Kubernetes Service (AKS).

In this article, you learn how to:

> [!div class="checklist"]
>
> * Install the PyTorch plugin for Flyte.
> * Create a Flyte task that uses the PyTorch Lightning deep learning framework to define LLM inferencing logic.
> * Create a Flyte workflow that orchestrates the LLM inferencing task.
> * Build Docker images for the task and workflow.
> * Register the workflow with Flyte.
> * Run the workflow on AKS.

## Before you begin

* See [Build and deploy data and machine learning pipelines with Flyte on Azure Kubernetes Service (AKS)](./use-flyte.md) for **initial setup and prerequisites**.
* This article assumes a basic understanding of Kubernetes concepts. For more information, see [Core Kubernetes concepts for Azure Kubernetes Service (AKS)](./concepts-clusters-workloads.md).

## Install the PyTorch plugin for Flyte

The PyTorch plugin for Flyte leverages the Kubeflow training operator to provide a streamlined interface for conducting distributed training. For more information, see [PyTorch Distributed plugin for Flyte](https://docs.flyte.org/en/latest/flytesnacks/examples/kfpytorch_plugin/index.html#).

* Install the PyTorch plugin for Flyte using the following `pip` command:

    ```bash
    pip install flytekitplugins-kfpytorch
    ```

## Create a Flyte task

A Flyte *task* is a function that performs a specific unit of work. Tasks are assembled into workflows to create data and machine learning pipelines. When deployed to a Flyte cluster, each task runs in its own Pod on the cluster. For more information, see [Flyte tasks](https://docs.flyte.org/en/latest/user_guide/basics/tasks.html).

Add step(s)

## Create a Flyte workflow

Flyte *workflows* consist of multiple tasks or workflows to produce a desired output. For more information, see [Flyte workflows](https://docs.flyte.org/en/latest/user_guide/basics/workflows.html).

Add step(s)

## Build Docker images

Add step(s)

## Register the workflow with Flyte

Packaging and registering, or *deploying*, a workflow with Flyte enables you to scale, schedule, and manage your workloads. There are different methods for registering your workflows with Flyte. In this article, we iterate on a single workflow script. For more information, see [Registering Flyte workflows](https://docs.flyte.org/en/latest/flyte_fundamentals/registering_workflows.html).

* Make sure you're in your Flyte project directory and register your workflow using the `pyflyte run` command.

    ```bash
    pyflyte run XYZ
    ```

    Your output should look similar to the following example output:

    ```output
    XYZ
    ```

## Run your workflow



## Next steps

