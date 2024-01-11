---
title: SDK & CLI (v1)
titleSuffix: Azure Machine Learning
description: Learn about Azure Machine Learning SDK & CLI (v1). 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

ms.reviewer: larryfr
ms.author: balapv
author: balapv
ms.date: 05/10/2022
ms.custom: UpdateFrequency5, cliv1, event-tier1-build-2022, ignite-2022
---

# Azure Machine Learning SDK & CLI (v1) 

[!INCLUDE [dev v1](../includes/machine-learning-dev-v1.md)]


All articles in this section document the use of the first version of Azure Machine Learning Python SDK (v1) or Azure CLI ml extension (v1). For information on the current SDK and CLI, see [Azure Machine Learning SDK and CLI v2](../concept-v2.md).

## SDK v1

The Azure SDK examples in articles in this section require the `azureml-core`, or Python SDK v1 for Azure Machine Learning. The Python SDK v2 is now available.

The v1 and v2 Python SDK packages are incompatible, and v2 style of coding will not work for articles in this directory. However, machine learning workspaces and all underlying resources can be interacted with from either, meaning one user can create a workspace with the SDK v1 and another can submit jobs to the same workspace with the SDK v2.

We recommend not to install both versions of the SDK on the same environment, since it can cause clashes and confusion in the code.

## How do I know which SDK version I have?

* To find out whether you have Azure Machine Learning Python SDK v1, run `pip show azureml-core`. (Or, in a Jupyter notebook, use `%pip show azureml-core` )
* To find out whether you have Azure Machine Learning Python SDK v2, run `pip show azure-ai-ml`. (Or, in a Jupyter notebook, use `%pip show azure-ai-ml`)

Based on the results of `pip show` you can determine which version of SDK you have.

## CLI v1

The Azure CLI commands in articles in this section __require__ the `azure-cli-ml`, or v1, extension for Azure Machine Learning. The enhanced v2 CLI using the `ml` extension is now available and recommended. 

The extensions are incompatible, so v2 CLI commands will not work for articles in this directory. However, machine learning workspaces and all underlying resources can be interacted with from either, meaning one user can create a workspace with the v1 CLI and another can submit jobs to the same workspace with the v2 CLI.

## How do I know which CLI extension I have?

To find which extensions you have installed, use `az extension list`. 
* If the list of __Extensions__ contains `azure-cli-ml`, you have the v1 extension.
* If the list contains `ml`, you have the v2 extension.


## Next steps

For more information on installing and using the different extensions, see the following articles:

* `azure-cli-ml` - [Install, set up, and use the CLI (v1)](reference-azure-machine-learning-cli.md)
* `ml` - [Install and set up the CLI (v2)](../how-to-configure-cli.md?view=azureml-api-2&preserve-view=true)

For more information on installing and using the different SDK versions:

* `azureml-core` - [Install the Azure Machine Learning SDK (v1) for Python](/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true)
* `azure-ai-ml` - [Install the Azure Machine Learning SDK (v2) for Python](https://aka.ms/sdk-v2-install)
