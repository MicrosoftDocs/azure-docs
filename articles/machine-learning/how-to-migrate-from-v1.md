---
title: 'Migrate from v1 to v2'
titleSuffix: Azure Machine Learning
description: Migrate from v1 to v2.
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

Azure Machine Learning's v2 REST APIs, Azure CLI extension, and Python SDK (preview) introduce consistency and a set of new features to accelerator the production machine learning lifecycle. In this article, we'll overview migrating from v1 to v2 with best practices and recommendations to help you decide on v1, v2, or both.

## Prerequisites

- an understanding of the v1 Python SDK is recommended

## Should I use v2?

If you're starting a new machine learning project, we recommend using v2. We also recommend migrating to v2 for existing projects built on v1 with the following caveats:

- features available in v2
- general availability of features needed in v2
- effort needed for migration

Note that new features in Azure ML will only be launched in v2, such as managed endpoints and Azure Arc support. You and your team will need to assess on a case-by-case basis whether migrating to v2 is right for you.

## A note on GitOps with v2

A key paradigm with v2 is serializing machine learning entities as YAML files for source control with `git`. This better enables GitOps approaches with Azure ML than were possible with v1. For instance, you could enforce policy by which only a service principal used in CI/CD pipelines can create/update/delete some or all entities, ensuring changes go through a governed `git` process like pull requests with required reviewers. Since the files in source control are YAML, they're easy to diff and track changes over time. You and your team may consider shifting to this paradigm as you migrate to v2.

You can obtain a YAML representation of any entity with the CLI via `az ml * show --output yaml`. Note that many entities will have system-generated properties, which can be ignored or deleted.

## How do I migrate to v2?

To migrate to v2, start by prototyping an existing v1 workflow into v2. This would include:

- optionally, re-create resources and assets with v2 APIs
- refactor model training code to de-couple Azure ML control-plane code from data-plane code (model training, logging, and other tracking code)
- refactor model deployment code and test with v2 endpoints
- refactor CI/CD code to use the v2 CLI (recommended), v2 Python SDK, or directly use REST

Based on this prototype, you can estimate the effort involved for a full migration to v2. Consider the workflow patterns (i.e. GitOps) your organization wants to establish for use with v2 and factor this effort in.

## Which v2 API should I use?

In v2, REST, CLI, and Python SDK (preview) are available. The API you should use depends on your scenario and preferences.

|API|Notes|
|-|-|
|REST|Fewest dependencies and overhead. Use for building applications on Azure ML as a platform, directly in programming languages without a SDK provided, or per personal preference.|
|CLI|Recommended for automation with CI/CD or per personal preference. Allows quick iteration with YAML files and straightforward separation between control and data plane code.|
|Python SDK|Recommended for complicated scripting (e.g. programmatically generating large pipeline jobs) or per personal preference. Allows quick iteration with YAML files or development solely in Python.|

## Can I use v1 and v2 together?

Generally, yes. The same resources -- like workspace, compute, and datastore -- work across v1 and v2, with some exceptions. A user can call the v1 Python SDK to change a workspace's description, then using the v2 CLI extension change it again. Jobs (experiments/runs/pipelines in v1) can be submitted to the same workspace from the v1 or v2 Python SDK. A workspace can have both v1 and v2 model deployment endpoints.

You can also call v1 Python SDK code within jobs created via v2, though this is not recommended -- see the [production model training](##production-model-training) section for details.

## Migrating resources and assets

This section gives an overview of migration recommendations for specific resources and assets in Azure ML.

### Workspace

Workspaces do not need to be migrated with v2. Simply use the same workspace, regardless of whether you're using v1 or v2.

Do consider migrating the code for deploying a workspace to v2. Typically Azure resources are managed via ARM (and Bicep) or similar resource provisioning tools. You can use the CLI (v2) and YAML files as well.

### Connection (workspace connection in v1)

Workspace connections from v1 are persisted on the workspace, and fully available with v2.

We recommend migrating the code for creating connections to v2.

### Datastore

Supported datastore types (object storage) created with v1 are fully available for use in v2.

We recommend migrating the code for creating datastores to v2.

### Compute

Compute of type `AmlCompute` and `ComputeInstance` are fully available for use in v2.

We recommend migrating the code for creating compute to v2.

### Endpoint and deployment (endpoint or web service in v1)

Generally, you need to re-deploy your model with v2 APIs to migrate endpoints and deployments. The deploy button in the studio for a model uses the v2 APIs for online and batch endpoints.

### Jobs (experiments, runs, pipelines in v1)

In v2, "experiments", "runs", and "pipelines" are consolidated into jobs. A job has a type. Most jobs are `command` jobs that run a command, like `python main.py`. Notice this is agnostic to any programming language -- you can run `bash` scripts, invoke `python` interpreters, run a bunch of `curl` commands, or anything else. Another type of job is `pipeline`, which defines a number of child jobs that may have input/output relationships, forming a directed acyclic graph (DAG).

You will need to refactor the v1 analogs for v2, though the code being run in the job generally does not need to change. However, it is strongly recommended with v2 to remove any code specific to Azure ML from your model training code. This allows for an easier transition between local and cloud and is considered best practice for MLOps.

### Data (datasets in v1)

Dataset assets are renamed to data assets. Interoperability between v1 datasets and v2 data assets is the most complex of any entity in Azure ML.

Note that in data assets are *references* to files in object storage. Thus, deleting a data asset (or v1 dataset) does not actually delete anything in underlying storage, but the reference. Therefore it may be easier to avoid backward and forward compatibility considerations for data and simply re-create v1 datasets as v2 data assets.

For details on interoperability between v1 datasets and v2 data, see [TODO].

### Model

Models created from v1 can be used in v2. In v2, explicit model types are introduced. Similar to data assets, it may be easier to re-create a v1 model as a v2 model, setting the type appropriately.

### Environment

Environments created from v1 can be used in v2. In v2, environments have new features like creation from a local Docker context.

We recommend migrating the code for creating environments to v2.

## Scenarios across the machine learning lifecycle

### Azure setup

Azure generally recommends ARM templates (often via Bicep for ease of use) for creating resources. This is a good approach for using Azure ML as well.

If your team is only using Azure ML, you may consider provisioning the workspace and any other resources via YAML and CLI instead.

### Prototyping models

For prototyping, we recommend what is most comfortable for you. You may consider using the CLI for control plane (i.e. submitting jobs iteratively), while your model training code is Python, or adopt a full-stack approach with Python only with the Azure ML SDK.

### Production model training

We firmly recommend v2 for production model training. Jobs consolidate the terminology and provide a set of consistency that allow for easier transition between types (e.g. `command` to `sweep`, allowing for hyperparameter optimization) and a GitOps-friendly process for serializing jobs into YAML files.

### Production model deployment

We firmly recommend v2 for production model deployment. Managed endpoints abstract the IT overhead and provide a performant solution for deploying and scoring models, both for online (near real-time) and batch (massively parallel) scenarios.

Kubernetes deployments are supported in v2 through Azure Arc, enabling usage through Azure Kubernetes Service (AKS) or on-premise deployments managed by your organization.

### Machine learning operations (MLOps)

A MLOps workflow typically involves CI/CD through an external tool. It is recommended refactor existing CI/CD workflows to leverage v2 APIs. Typically a CLI is used in CI/CD, though you can alternatively invoke Python or directly use REST.

The solution accelerator for MLOps with v2 is being developed at https://github.com/Azure/mlops-v2 and can be used as reference or adopted for setup and automation of the machine learning lifecycle.

## Next steps

- [Get started with the CLI (v2)](TODO)
- [Get started with the Python SDK (v2)](TODO)
