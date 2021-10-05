---
title: 'CLI (v2) dataset YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) dataset YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: lostmygithubaccount
ms.author: copeters
ms.date: 08/03/2021
ms.reviewer: laobri
---

# CLI (v2) dataset YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/dataset.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-main/cli/.schemas/jsons/latest/dataset.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-main/cli/.schemas/yamls/latest/dataset.schema.yml":::

---

## Remarks

The `az ml dataset` command can be used for managing Azure Machine Learning datasets.

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
