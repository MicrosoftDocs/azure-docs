---
title: 'CLI (v2) command job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) command job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: lostmygithubaccount
ms.author: copeters
ms.date: 09/20/2021
ms.reviewer: laobri
---

# CLI (v2) command job YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

### Hello world

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/misc/hello-world.yml":::

### Hello world with an environment variable

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/misc/hello-world-env-var.yml":::

### Basic Python job

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris/job.yml":::

### Command job invoking bash script to run Python code

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/jobs/train/lightgbm/iris-bash/job.yml":::

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/commandJob.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-cli-preview/cli/.schemas/jsons/latest/commandJob.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/.schemas/yamls/latest/commandJob.schema.yml":::

---

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
