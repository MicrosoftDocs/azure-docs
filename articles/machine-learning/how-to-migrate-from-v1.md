---
title: 'Migrate from v1 to v2'
titleSuffix: Azure Machine Learning
description: Migrate from v1 to v2 of Azure Machine Learning REST APIs, CLI extension, and Python SDK (preview).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: lostmygithubaccount
ms.author: copeters
ms.date: 06/01/2022
ms.reviewer: blackmist
ms.custom: devx-track-azurecli, devplatv2
---

# How to migrate from v1 to v2

Azure Machine Learning's v2 REST APIs, Azure CLI extension, and Python SDK (preview) introduce consistency and a set of new features to accelerate the production machine learning lifecycle. In this article, we'll overview migrating from v1 to v2 with recommendations to help you decide on v1, v2, or both.

## Prerequisites

- understand [what is v2?](concept-v2.md)
- an understanding of the v1 Python SDK

## Should I use v2?

You should use v2 if you're starting a new machine learning project. A new v2 project can reuse assets like models and environments created using v1.

We also recommend migrating to v2 for existing projects built on v1 with the following caveats:

- features used in v1 available in v2
- general availability of features needed in v2
- effort needed for migration

Note that new features in Azure ML will only be launched in v2, such as managed endpoints and Azure Arc support. You and your team will need to assess on a case-by-case basis whether migrating to v2 is right for you.

## A note on GitOps with v2

A key paradigm with v2 is serializing machine learning entities as YAML files for source control with `git`, enabling better GitOps approaches than were possible with v1. For instance, you could enforce policy by which only a service principal used in CI/CD pipelines can create/update/delete some or all entities, ensuring changes go through a governed process like pull requests with required reviewers. Since the files in source control are YAML, they're easy to diff and track changes over time. You and your team may consider shifting to this paradigm as you migrate to v2.

You can obtain a YAML representation of any entity with the CLI via `az ml <entity> show --output yaml`. Note that this output will have system-generated properties, which can be ignored or deleted.

## How do I migrate to v2?

To migrate to v2, start by prototyping an existing v1 workflow into v2. Migrating will typically include:

- optionally, re-create resources and assets with v2 APIs
- refactor model training code to de-couple Azure ML control-plane code from data-plane code (model training, logging, and other tracking code)
- refactor model deployment code and test with v2 endpoints
- refactor CI/CD code to use the v2 CLI (recommended), v2 Python SDK, or directly use REST

Based on this prototype, you can estimate the effort involved for a full migration to v2. Consider the workflow patterns (like GitOps) your organization wants to establish for use with v2 and factor this effort in.

## Which v2 API should I use?

In v2, REST, CLI, and Python SDK (preview) are available. The API you should use depends on your scenario and preferences.

|API|Notes|
|-|-|
|REST|Fewest dependencies and overhead. Use for building applications on Azure ML as a platform, directly in programming languages without an SDK provided, or per personal preference.|
|CLI|Recommended for automation with CI/CD or per personal preference. Allows quick iteration with YAML files and straightforward separation between control and data plane code.|
|Python SDK|Recommended for complicated scripting (for example, programmatically generating large pipeline jobs) or per personal preference. Allows quick iteration with YAML files or development solely in Python.|

## Can I use v1 and v2 together?

Generally, yes. Resources like workspace, compute, and datastore work across v1 and v2, with some exceptions. A user can call the v1 Python SDK to change a workspace's description, then using the v2 CLI extension change it again. Jobs (experiments/runs/pipelines in v1) can be submitted to the same workspace from the v1 or v2 Python SDK. A workspace can have both v1 and v2 model deployment endpoints.

You can also call v1 Python SDK code within jobs created via v2, though this pattern isn't recommended. See the [production model training](#production-model-training) section for details.

## Migrating resources and assets

This section gives an overview of migration recommendations for specific resources and assets in Azure ML. See the concept article for each entity for details on their usage in v2.

### Workspace

Workspaces don't need to be migrated with v2. You can use the same workspace, regardless of whether you're using v1 or v2.

Do consider migrating the code for deploying a workspace to v2. Typically Azure resources are managed via Azure Resource Manager (and Bicep) or similar resource provisioning tools. Alternatively, you can use the CLI (v2) and YAML files.

### Connection (workspace connection in v1)

Workspace connections from v1 are persisted on the workspace, and fully available with v2.

We recommend migrating the code for creating connections to v2.

### Datastore

Object storage datastore types created with v1 are fully available for use in v2. Database datastores are not supported; export to object storage (usually Azure Blob) is the recommended migration path.

We recommend migrating the code for creating datastores to v2.

### Compute

Compute of type `AmlCompute` and `ComputeInstance` are fully available for use in v2.

We recommend migrating the code for creating compute to v2.

### Endpoint and deployment (endpoint or web service in v1)

Generally, you need to redeploy your model with v2 APIs to migrate endpoints and deployments. The deploy button in the studio for a model uses the v2 APIs for online and batch endpoints.

We recommend using managed endpoints in v2 for online (near real-time) and batch (massively parallel) scenarios.

### Jobs (experiments, runs, pipelines in v1)

In v2, "experiments", "runs", and "pipelines" are consolidated into jobs. A job has a type. Most jobs are `command` jobs that run a command, like `python main.py`. What runs in a job is agnostic to any programming language, so you can run `bash` scripts, invoke `python` interpreters, run a bunch of `curl` commands, or anything else. Another type of job is `pipeline`, which defines child jobs that may have input/output relationships, forming a directed acyclic graph (DAG).

You'll need to refactor the v1 analogs for v2, though the code being run in the job generally doesn't need to change. However, it's recommended with v2 to remove any code specific to Azure ML from your model training code. This separation allows for an easier transition between local and cloud and is considered best practice for MLOps.

We recommend migrating the code for creating jobs to v2.

### Data (datasets in v1)

Datasets are renamed to data assets. Interoperability between v1 datasets and v2 data assets is the most complex of any entity in Azure ML.

Data assets in v2 (or File Datasets in v1) are *references* to files in object storage. Thus, deleting a data asset (or v1 dataset) doesn't actually delete anything in underlying storage, only a reference. Therefore, it may be easier to avoid backward and forward compatibility considerations for data by re-creating v1 datasets as v2 data assets.

For details on data in v2, see the [data concept article](concept-data.md).

We recommend migrating the code for creating data assets to v2.

### Model

Models created from v1 can be used in v2. In v2, explicit model types are introduced. Similar to data assets, it may be easier to re-create a v1 model as a v2 model, setting the type appropriately.

We recommend migrating the code for creating models to v2.

### Environment

Environments created from v1 can be used in v2. In v2, environments have new features like creation from a local Docker context.

We recommend migrating the code for creating environments to v2.

## Scenarios across the machine learning lifecycle

There are a few scenarios that are common across the machine learning lifecycle using Azure ML. We'll look at a few and give general recommendations for migrating to v2.

### Azure setup

Azure generally recommends Azure Resource Manager templates (often via Bicep for ease of use) for creating resources. The same is a good approach for using Azure ML as well.

If your team is only using Azure ML, you may consider provisioning the workspace and any other resources via YAML  files and CLI instead.

### Prototyping models

We recommend v2 for prototyping models. You may consider using the CLI for control plane (like submitting jobs iteratively), while your model training code is Python, or adopt a full-stack approach with Python only with the Azure ML SDK.

### Production model training

We recommend v2 for production model training. Jobs consolidate the terminology and provide a set of consistency that allows for easier transition between types (for example, `command` to `sweep`) and a GitOps-friendly process for serializing jobs into YAML files.

With v2, you should separate your machine learning code from the control plane code. This separation allows for easier iteration and allows for easier transition between local and cloud.

Typically, converting to v2 will involve refactoring your code to use MLflow for tracking and model logging. See the [MLflow concept article](concept-mlflow.md) for details.

### Production model deployment

We recommend v2 for production model deployment. Managed endpoints abstract the IT overhead and provide a performant solution for deploying and scoring models, both for online (near real-time) and batch (massively parallel) scenarios.

Kubernetes deployments are supported in v2 through Azure Arc, enabling usage through Azure Kubernetes Service (AKS) or on-premise deployments managed by your organization.

### Machine learning operations (MLOps)

A MLOps workflow typically involves CI/CD through an external tool. It's recommended refactor existing CI/CD workflows to use v2 APIs. Typically a CLI is used in CI/CD, though you can alternatively invoke Python or directly use REST.

The solution accelerator for MLOps with v2 is being developed at https://github.com/Azure/mlops-v2 and can be used as reference or adopted for setup and automation of the machine learning lifecycle.

## Next steps

- [Get started with the CLI (v2)](how-to-configure-cli.md)
