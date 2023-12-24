---
title: Overview of the Azure AI Generative SDK packages
titleSuffix: Azure AI Studio
description: This article provides overview of the Azure AI Generative SDK packages.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.topic: overview
ms.date: 12/15/2023
ms.reviewer: eur
ms.author: eur
---

# Overview of the Azure AI Generative SDK packages

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

The Azure AI Generative package is part of the Azure AI SDK for Python and contains functionality for building, evaluating and deploying Generative AI applications that use Azure AI services. The default installation of the package contains capabilities for cloud-connected scenarios, and by installing extras you can also run operations locally (such as building indexes and calculating metrics).

[Source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/ai/azure-ai-generative) | [Package (PyPI)](https://pypi.org/project/azure-ai-generative/) | [API reference documentation](/python/api/overview/azure/ai-generative-readme)

This package is tested with Python 3.7, 3.8, 3.9 and 3.10.

For a more complete set of Azure libraries, see [https://aka.ms/azsdk/python/all](https://aka.ms/azsdk/python/all).

## Getting started

### Prerequisites

- Python 3.7 or later is required to use this package.
- You must have an [Azure subscription](https://portal.azure.com).
- An [Azure AI project](./create-projects.md) in your Azure subscription. 


### Install the package

Install the Azure AI generative package for Python with pip:

```bash
pip install azure-ai-generative[index,evaluate,promptflow]
pip install azure-identity
```

## Key concepts

The `[index,evaluate,promptflow]` syntax specifies extra packages that you can optionally remove if you don't need the functionality:

- `[index]` adds the ability to build indexes on your local development environment.
- `[evaluate]` adds the ability to run evaluation and calculate metrics in your local development environment.
- `[promptflow]` adds the ability to develop with prompt flow connected to your Azure AI project.


## Usage


### Connecting to Projects
The generative package includes the [azure-ai-resources](https://pypi.org/project/azure-ai-resources) package and uses the `AIClient` for connecting to your project.

First, create an `AI Client`:

```python
from azure.ai.resources.client import AIClient
from azure.identity import DefaultAzureCredential

ai_client = AIClient(
    credential=DefaultAzureCredential(),
    subscription_id='subscription_id',
    resource_group_name='resource_group',
    project_name='project_name'
)
```

### Using the generative package

Azure AI Generative Python SDK offers the following key capabilities.

To build an index locally, import the `build_index` function:

```python
from azure.ai.generative.index import build_index
```

To run a local evaluation, import the `evaluate` function:
```python
from azure.ai.generative.evaluate import evaluate
```

To deploy chat functions and prompt flows, import the `deploy` function:
```python
from azure.ai.resources.entities.deployment import Deployment
```


## Examples

See our [samples repository](https://github.com/Azure-Samples/azureai-samples) for examples of how to use the Azure AI Generative Python SDK.

## Logs and telemetry

### General

Azure AI clients raise exceptions defined in Azure Core.

```python
from azure.core.exceptions import HttpResponseError

try:
    ai_client.compute.get("cpu-cluster")
except HttpResponseError as error:
    print("Request failed: {}".format(error.message))
```

### Logging

This library uses the standard logging library for logging. Basic information about HTTP sessions (URLs, headers, etc.) is logged at INFO level.

Detailed `DEBUG` level logging, including request/response bodies and unredacted headers, can be enabled on a client with the `logging_enable` argument.


### Telemetry

The Azure AI Generative Python SDK includes a telemetry feature that collects usage and failure data about the SDK and sends it to Microsoft when you use the SDK in a Jupyter Notebook only. Telemetry won't be collected for any use of the Python SDK outside of a Jupyter Notebook.

Telemetry data helps the SDK team understand how the SDK is used so it can be improved and the information about failures helps the team resolve problems and fix bugs. The SDK telemetry feature is enabled by default for Jupyter Notebook usage and can't be enabled for non-Jupyter scenarios. To opt out of the telemetry feature in a Jupyter scenario, set the environment variable `"AZURE_AI_GENERATIVE_ENABLE_LOGGING"` to `"False"`.


## Next steps

- [Get started building a sample copilot application](https://github.com/azure/aistudio-copilot-sample)
- [Get started with the Azure AI SDK](./sdk-install.md)
- [Azure SDK for Python reference documentation](/python/api/overview/azure/ai)
