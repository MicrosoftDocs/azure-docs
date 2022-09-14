---
title: 'Migrate from v1 to v2'
titleSuffix: Azure Machine Learning
description: Migrate from v1 to v2 of Azure Machine Learning REST APIs, CLI extension, and Python SDK (preview).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: s-polly
ms.author: scottpolly
ms.date: 06/01/2022
ms.reviewer: blackmist
ms.custom: devx-track-azurecli, devplatv2
---

# How to migrate from v1 to v2

Azure Machine Learning's v2 REST APIs, Azure CLI extension, and Python SDK (preview) introduce consistency and a set of new features to accelerate the production machine learning lifecycle. This article provides an overview of migrating from v1 to v2 with recommendations to help you decide on v1, v2, or both.

## Prerequisites

- General familiarity with Azure ML and the v1 Python SDK.
- Understand [what is v2?](concept-v2.md)

## Should I use v2?

You should use v2 if you're starting a new machine learning project. A new v2 project can reuse resources like workspaces and compute and assets like models and environments created using v1. You can also use v1 and v2 in tandem, for example using the v1 Python SDK within jobs that are submitted from the v2 CLI extension. However, see the [section below](#can-i-use-v1-and-v2-together) for details on why separating v1 and v2 use is recommended.

We recommend assessing the effort needed to migrate a project from v1 to v2. First, you should ensure all the features needed from v1 are available in v2. Some notable feature gaps include:

- Spark support in jobs.
- Publishing jobs (pipelines in v1) as endpoints.
- AutoML jobs within pipeline jobs (AutoML step in a pipeline in v1).
- Model deployment to Azure Container Instance (ACI), replaced with managed online endpoints.
- An equivalent for ParallelRunStep in jobs.
- Support for SQL/database datastores.
- Built-in components in the designer.

You should then ensure the features you need in v2 meet your organization's requirements, such as being generally available. You and your team will need to assess on a case-by-case basis whether migrating to v2 is right for you.

> [!IMPORTANT]
> New features in Azure ML will only be launched in v2.

## How do I migrate to v2?

To migrate to v2, start by prototyping an existing v1 workflow into v2. Migrating will typically include:

- Optionally (and recommended in most cases), re-create resources and assets with v2.
- Refactor model training code to de-couple Azure ML code from ML model code (model training, model logging, and other model tracking code).
- Refactor Azure ML model deployment code and test with v2 endpoints.
- Refactor CI/CD code to use the v2 CLI (recommended), v2 Python SDK, or directly use REST.

Based on this prototype, you can estimate the effort involved for a full migration to v2. Consider the workflow patterns (like [GitOps](#a-note-on-gitops-with-v2)) your organization wants to establish for use with v2 and factor this effort in.

## Which v2 API should I use?

In v2 interfaces via REST API, CLI, and Python SDK (preview) are available. The interface you should use depends on your scenario and preferences.

|API|Notes|
|-|-|
|REST|Fewest dependencies and overhead. Use for building applications on Azure ML as a platform, directly in programming languages without an SDK provided, or per personal preference.|
|CLI|Recommended for automation with CI/CD or per personal preference. Allows quick iteration with YAML files and straightforward separation between Azure ML and ML model code.|
|Python SDK|Recommended for complicated scripting (for example, programmatically generating large pipeline jobs) or per personal preference. Allows quick iteration with YAML files or development solely in Python.|

## Can I use v1 and v2 together?

Generally, yes. Resources like workspace, compute, and datastore work across v1 and v2, with exceptions. A user can call the v1 Python SDK to change a workspace's description, then using the v2 CLI extension change it again. Jobs (experiments/runs/pipelines in v1) can be submitted to the same workspace from the v1 or v2 Python SDK. A workspace can have both v1 and v2 model deployment endpoints. You can also call v1 Python SDK code within jobs created via v2, though [this pattern isn't recommended](#production-model-training).

We recommend creating a new workspace for using v2 to keep v1/v2 entities separate and avoid backward/forward compatibility considerations.

> [!IMPORTANT]
> If your workspace uses a private endpoint, it will automatically have the `v1_legacy_mode` flag enabled, preventing usage of v2 APIs. See [how to configure network isolation with v2](how-to-configure-network-isolation-with-v2.md) for details.

## Migrating resources and assets

This section gives an overview of migration recommendations for specific resources and assets in Azure ML. See the concept article for each entity for details on their usage in v2.

### Workspace

Workspaces don't need to be migrated with v2. You can use the same workspace, regardless of whether you're using v1 or v2. We recommend creating a new workspace for using v2 to keep v1/v2 entities separate and avoid backward/forward compatibility considerations.

Do consider migrating the code for creating a workspace to v2. Typically Azure resources are managed via Azure Resource Manager (and Bicep) or similar resource provisioning tools. Alternatively, you can use the [CLI (v2) and YAML files](how-to-manage-workspace-cli.md#create-a-workspace).

> [!IMPORTANT]
> If your workspace uses a private endpoint, it will automatically have the `v1_legacy_mode` flag enabled, preventing usage of v2 APIs. See [how to configure network isolation with v2](how-to-configure-network-isolation-with-v2.md) for details.

### Connection (workspace connection in v1)

Workspace connections from v1 are persisted on the workspace, and fully available with v2.

We recommend migrating the code for creating connections to v2.

### Datastore

Object storage datastore types created with v1 are fully available for use in v2. Database datastores are not supported; export to object storage (usually Azure Blob) is the recommended migration path.

We recommend migrating the code for [creating datastores](how-to-datastore.md) to v2.

### Compute

Compute of type `AmlCompute` and `ComputeInstance` are fully available for use in v2.

We recommend migrating the code for creating compute to v2.

### Endpoint and deployment (endpoint or web service in v1)

You can continue using your existing v1 model deployments. For new model deployments, we recommend migrating to v2. In v2, we offer managed endpoints or Kubernetes endpoints. The following table guides our recommendation:

|Endpoint type in v2|Migrate from|Notes|
|-|-|-|
|Local|ACI|Quick test of model deployment locally; not for production.|
|Managed online endpoint|ACI, AKS|Enterprise-grade managed model deployment infrastructure with near real-time responses and massive scaling for production.|
|Managed batch endpoint|ParallelRunStep in a pipeline for batch scoring|Enterprise-grade managed model deployment infrastructure with massively parallel batch processing for production.|
|Azure Kubernetes Service (AKS)|ACI, AKS|Manage your own AKS cluster(s) for model deployment, giving flexibility and granular control at the cost of IT overhead.|
|Azure Arc Kubernetes|N/A|Manage your own Kubernetes cluster(s) in other clouds or on-premises, giving flexibility and granular control at the cost of IT overhead.|

### Jobs (experiments, runs, pipelines in v1)

In v2, "experiments", "runs", and "pipelines" are consolidated into jobs. A job has a type. Most jobs are `command` jobs that run a command, like `python main.py`. What runs in a job is agnostic to any programming language, so you can run `bash` scripts, invoke `python` interpreters, run a bunch of `curl` commands, or anything else. Another common type of job is `pipeline`, which defines child jobs that may have input/output relationships, forming a directed acyclic graph (DAG).

To migrate, you'll need to change your code for submitting jobs to v2. We recommend refactoring the control-plane code authoring a job into YAML file specification, which can then be submitted through the v2 CLI or Python SDK (preview). A simple `command` job looks like this:

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world.yml":::

What you run *within* the job does not need to be migrated to v2. However, it is recommended to remove any code specific to Azure ML from your model training scripts. This separation allows for an easier transition between local and cloud and is considered best practice for mature MLOps. In practice, this means removing `azureml.*` lines of code. Model logging and tracking code should be replaced with MLflow. For more details, see [how to use MLflow in v2](how-to-use-mlflow-cli-runs.md).

We recommend migrating the code for creating jobs to v2. You can see [how to train models with the CLI (v2)](how-to-train-cli.md) and the [job YAML references](reference-yaml-job-command.md) for authoring jobs in v2 YAMLs.

### Data (datasets in v1)

Datasets are renamed to data assets. Interoperability between v1 datasets and v2 data assets is the most complex of any entity in Azure ML.

Data assets in v2 (or File Datasets in v1) are *references* to files in object storage. Thus, deleting a data asset (or v1 dataset) doesn't actually delete anything in underlying storage, only a reference. Therefore, it may be easier to avoid backward and forward compatibility considerations for data by re-creating v1 datasets as v2 data assets.

For details on data in v2, see the [data concept article](concept-data.md).

We recommend migrating the code for [creating data assets](how-to-create-data-assets.md) to v2.

### Model

Models created from v1 can be used in v2. In v2, explicit model types are introduced. Similar to data assets, it may be easier to re-create a v1 model as a v2 model, setting the type appropriately.

We recommend migrating the code for creating models with [SDK](how-to-train-sdk.md) or [CLI](how-to-train-cli.md) to v2.

### Environment

Environments created from v1 can be used in v2. In v2, environments have new features like creation from a local Docker context.

We recommend migrating the code for creating environments to v2.

## Scenarios across the machine learning lifecycle

There are a few scenarios that are common across the machine learning lifecycle using Azure ML. We'll look at a few and give general recommendations for migrating to v2.

### Azure setup

Azure recommends Azure Resource Manager templates (often via Bicep for ease of use) to create resources. The same is a good approach for creating Azure ML resources as well.

If your team is only using Azure ML, you may consider provisioning the workspace and any other resources via YAML  files and CLI instead.

### Prototyping models

We recommend v2 for prototyping models. You may consider using the CLI for an interactive use of Azure ML, while your model training code is Python or any other programming language. Alternatively, you may adopt a full-stack approach with Python solely using the Azure ML SDK or a mixed approach with the Azure ML Python SDK and YAML files.

### Production model training

We recommend v2 for production model training. Jobs consolidate the terminology and provide a set of consistency that allows for easier transition between types (for example, `command` to `sweep`) and a GitOps-friendly process for serializing jobs into YAML files.

With v2, you should separate your machine learning code from the control plane code. This separation allows for easier iteration and allows for easier transition between local and cloud.

Typically, converting to v2 will involve refactoring your code to use MLflow for tracking and model logging. See the [MLflow concept article](concept-mlflow.md) for details.

### Production model deployment

We recommend v2 for production model deployment. Managed endpoints abstract the IT overhead and provide a performant solution for deploying and scoring models, both for online (near real-time) and batch (massively parallel) scenarios.

Kubernetes deployments are supported in v2 through AKS or Azure Arc, enabling Azure cloud and on-premises deployments managed by your organization.

### Machine learning operations (MLOps)

A MLOps workflow typically involves CI/CD through an external tool. It's recommended refactor existing CI/CD workflows to use v2 APIs. Typically a CLI is used in CI/CD, though you can alternatively invoke Python or directly use REST.

The solution accelerator for MLOps with v2 is being developed at https://github.com/Azure/mlops-v2 and can be used as reference or adopted for setup and automation of the machine learning lifecycle.

#### A note on GitOps with v2

A key paradigm with v2 is serializing machine learning entities as YAML files for source control with `git`, enabling better GitOps approaches than were possible with v1. For instance, you could enforce policy by which only a service principal used in CI/CD pipelines can create/update/delete some or all entities, ensuring changes go through a governed process like pull requests with required reviewers. Since the files in source control are YAML, they're easy to diff and track changes over time. You and your team may consider shifting to this paradigm as you migrate to v2.

You can obtain a YAML representation of any entity with the CLI via `az ml <entity> show --output yaml`. Note that this output will have system-generated properties, which can be ignored or deleted.

## Next steps

- [Get started with the CLI (v2)](how-to-configure-cli.md)
- [Get started with the Python SDK (v2)](https://aka.ms/sdk-v2-install)
