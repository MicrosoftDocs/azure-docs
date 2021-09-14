---
title: 'CLI (v2) Kubernetes online endpoint YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Kubernetes online endpoint YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: lostmygithubaccount
ms.author: copeters
ms.date: 08/03/2021
ms.reviewer: laobri
---

# CLI (v2) Kubernetes online endpoint YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/k8sOnlineEndpoint.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-main/cli/.schemas/jsons/latest/k8sOnlineEndpoint.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-main/cli/.schemas/yamls/latest/k8sOnlineEndpoint.schema.yml":::

---

## Remarks

The `az ml endpoint` command can be used for managing Azure Machine Learning endpoints.

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
