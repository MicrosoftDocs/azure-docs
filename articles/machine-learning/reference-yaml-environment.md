---
title: 'CLI (v2) environment YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) environment YAML schema.
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022, build-2023
author: ositanachi
ms.author: osiotugo
ms.date: 03/31/2022
ms.reviewer: scottpolly
---

# CLI (v2) environment YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/environment.schema.json.


[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the environment. | | |
| `version` | string | Version of the environment. If omitted, Azure Machine Learning will autogenerate a version. | | |
| `description` | string | Description of the environment. | | |
| `tags` | object | Dictionary of tags for the environment. | | |
| `image` | string | The Docker image to use for the environment. **One of `image` or `build` is required.** | | |
| `conda_file` | string or object | The standard conda YAML configuration file of the dependencies for a conda environment. See https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually. <br> <br> If specified, `image` must be specified as well. Azure Machine Learning will build the conda environment on top of the Docker image provided. | | |
| `build` | object | The Docker build context configuration to use for the environment. **One of `image` or `build` is required.** | | |
| `build.path` | string | Local path to the directory to use as the build context. | | |
| `build.dockerfile_path` | string | Relative path to the Dockerfile within the build context. | | `Dockerfile` |
| `os_type` | string | The type of operating system. | `linux`, `windows` | `linux` |  
| `inference_config` | object | Inference container configurations. Only applicable if the environment is used to build a serving container for online deployments. See [Attributes of the `inference_config` key](#attributes-of-the-inference_config-key). | | |

### Attributes of the `inference_config` key

| Key | Type | Description |
| --- | ---- | ----------- |
| `liveness_route` | object | The liveness route for the serving container. |
| `liveness_route.path` | string | The path to route liveness requests to. |
| `liveness_route.port` | integer | The port to route liveness requests to. |
| `readiness_route` | object | The readiness route for the serving container. |
| `readiness_route.path` | string | The path to route readiness requests to. |
| `readiness_route.port` | integer | The port to route readiness requests to. |
| `scoring_route` | object | The scoring route for the serving container. |
| `scoring_route.path` | string | The path to route scoring requests to. |
| `scoring_route.port` | integer | The port to route scoring requests to. |

## Remarks

The `az ml environment` command can be used for managing Azure Machine Learning environments.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/assets/environment). Several are shown below.

## YAML: local Docker build context

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-context.yml":::

## YAML: Docker image

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image.yml":::

## YAML: Docker image plus conda file

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image-plus-conda.yaml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
