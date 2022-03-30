---
title: CLI (v2) release notes
titleSuffix: Azure Machine Learning
description: Learn about the latest updates to Azure Machine Learning CLI (v2)
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: minxia
author: mx-iao
ms.date: 11/03/2021
ms.custom: cliv2
---

# Azure Machine Learning CLI (v2) release notes

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]


In this article, learn about Azure Machine Learning CLI (v2) releases.

__RSS feed__: Get notified when this page is updated by copying and pasting the following URL into your feed reader:
`https://docs.microsoft.com/api/search/rss?search=%22Azure+machine+learning+release+notes-v2%22&locale=en-us`

## 2021-10-04

### Azure Machine Learning CLI (v2) v2.0.2

- `az ml workspace`
  - Updated [workspace YAML schema](reference-yaml-workspace.md)
- `az ml compute`
  - Updated YAML schemas for [AmlCompute](reference-yaml-compute-aml.md) and [Compute Instance](reference-yaml-compute-instance.md)
  - Removed support for legacy AKS attach via `az ml compute attach`. Azure Arc-enabled Kubernetes attach will be supported in the next release
- `az ml datastore`
  - Updated YAML schemas for [Azure blob](reference-yaml-datastore-blob.md), [Azure file](reference-yaml-datastore-files.md), [Azure Data Lake Gen1](reference-yaml-datastore-data-lake-gen1.md), and [Azure Data Lake Gen2](reference-yaml-datastore-data-lake-gen2.md) datastores
  - Added support for creating Azure Data Lake Storage Gen1 and Gen2 datastores
- `az ml job`
  - Updated YAML schemas for [command job](reference-yaml-job-command.md) and [sweep job](reference-yaml-job-sweep.md)
  - Added support for running pipeline jobs ([pipeline job YAML schema](reference-yaml-job-pipeline.md))
  - Added support for job input literals and input data URIs for all job types
  - Added support for job outputs for all job types
  - Changed the expression syntax from `{ <expression> }` to `${{ <expression> }}`. For more information, see [Expression syntax for configuring Azure ML jobs](reference-yaml-core-syntax.md#expression-syntax-for-configuring-azure-ml-jobs-and-components)
- `az ml environment`
  - Updated [environment YAML schema](reference-yaml-environment.md)
  - Added support for creating environments from Docker build context
- `az ml model`
  - Updated [model YAML schema](reference-yaml-model.md)
  - Added new `model_format` property to Model for no-code deployment scenarios
- `az ml dataset`
  - Renamed `az ml data` subgroup to `az ml dataset`
  - Updated [dataset YAML schema](reference-yaml-dataset.md)
- `az ml component`
  - Added the `az ml component` commands for managing Azure ML components
  - Added support for command components ([command component YAML schema](reference-yaml-component-command.md))
- `az ml online-endpoint`
  - `az ml endpoint` subgroup split into two separate groups: `az ml online-endpoint` and `az ml batch-endpoint`
  - Updated [online endpoint YAML schema](reference-yaml-endpoint-managed-online.md)
  - Added support for local endpoints for dev/test scenarios
  - Added interactive VSCode debugging support for local endpoints (added the `--vscode-debug` flag to `az ml batch-endpoint create/update`)
- `az ml online-deployment`
  - `az ml deployment` subgroup split into two separate groups: `az ml online-deployment` and `az ml batch-deployment`
  - Updated [managed online deployment YAML schema](reference-yaml-endpoint-managed-online.md)
  - Added autoscaling support via integration with Azure Monitor Autoscale
  - Added support for updating multiple online deployment properties in the same update operation
  - Added support for performing concurrent operations on deployments under the same endpoint
- `az ml batch-endpoint`
  - `az ml endpoint` subgroup split into two separate groups: `az ml online-endpoint` and `az ml batch-endpoint`
  - Updated [batch endpoint YAML schema](reference-yaml-endpoint-batch.md)
  - Removed `traffic` property; replaced with a configurable default deployment property
  - Added support for input data URIs for `az ml batch-endpoint invoke`
  - Added support for VNet ingress (private link)
- `az ml batch-deployment`
  - `az ml deployment` subgroup split into two separate groups: `az ml online-deployment` and `az ml batch-deployment`
  - Updated [batch deployment YAML schema](reference-yaml-deployment-batch.md)

## 2021-05-25

### Announcing the CLI (v2) (preview) for Azure Machine Learning

The `ml` extension to the Azure CLI is the next-generation interface for Azure Machine Learning. It enables you to train and deploy models from the command line, with features that accelerate scaling data science up and out while tracking the model lifecycle. [Install and get started](how-to-configure-cli.md).
