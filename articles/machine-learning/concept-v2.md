---
title: 'CLI & SDK v2'
titleSuffix: Azure Machine Learning
description: This article explains the difference between the v1 and v2 versions of Azure Machine Learning v1 and v2.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: balapv
author: balapv
ms.reviewer: sgilley
ms.date: 11/04/2022
ms.custom: cliv2, sdkv2, event-tier1-build-2022, ignite-2022, devx-track-python
#Customer intent: As a data scientist, I want to know whether to use v1 or v2 of CLI, SDK.
---

# What is Azure Machine Learning CLI & Python SDK v2?

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Azure Machine Learning CLI v2 and Azure Machine Learning Python SDK v2 introduce a consistency of features and terminology across the interfaces.  In order to create this consistency, the syntax of commands differs, in some cases significantly, from the first versions (v1).

There are no differences in functionality between SDK v2 and CLI v2. The command line based CLI may be more convenient in CI/CD MLOps type of scenarios, while the SDK may be more convenient for development.

## Azure Machine Learning CLI v2

The Azure Machine Learning CLI v2 (CLI v2) is the latest extension for the [Azure CLI](/cli/azure/what-is-azure-cli). The CLI v2 provides commands in the format *az ml __\<noun\> \<verb\> \<options\>__* to create and maintain Azure Machine Learning assets and workflows. The assets or workflows themselves are defined using a YAML file. The YAML file defines the configuration of the asset or workflow – what is it, where should it run, and so on.

A few examples of CLI v2 commands:

* `az ml job create --file my_job_definition.yaml`
* `az ml environment update --name my-env --file my_updated_env_definition.yaml`
* `az ml model list`
* `az ml compute show --name my_compute`

### Use cases for CLI v2

The CLI v2 is useful in the following scenarios:

* On board to Azure Machine Learning without the need to learn a specific programming language

    The YAML file defines the configuration of the asset or workflow – what is it, where should it run, and so on. Any custom logic/IP used, say data preparation, model training, model scoring can remain in script files, which are referred to in the YAML, but not part of the YAML itself. Azure Machine Learning supports script files in python, R, Java, Julia or C#. All you need to learn is YAML format and command lines to use Azure Machine Learning. You can stick with script files of your choice.

* Ease of deployment and automation

    The use of command-line for execution makes deployment and automation simpler, since workflows can be invoked from any offering/platform, which allows users to call the command line.

* Managed inference deployments

    Azure Machine Learning offers [endpoints](concept-endpoints.md) to streamline model deployments for both real-time and batch inference deployments. This functionality is available only via CLI v2 and SDK v2.

* Reusable components in pipelines

    Azure Machine Learning introduces [components](concept-component.md) for managing and reusing common logic across pipelines. This functionality is available only via CLI v2 and SDK v2.


## Azure Machine Learning Python SDK v2

Azure Machine Learning Python SDK v2 is an updated Python SDK package, which allows users to:

* Submit training jobs
* Manage data, models, environments
* Perform managed inferencing (real time and batch)
* Stitch together multiple tasks and production workflows using Azure Machine Learning pipelines

The SDK v2 is on par with CLI v2 functionality and is consistent in how assets (nouns) and actions (verbs) are used between SDK and CLI.  For example, to list an asset, the `list` action can be used in both CLI and SDK. The same `list` action can be used to list a compute, model, environment, and so on.

### Use cases for SDK v2

The SDK v2 is useful in the following scenarios:

* Use Python functions to build a single step or a complex workflow

    SDK v2 allows you to build a single command or a chain of commands like Python functions - the command has a name, parameters, expects input, and returns output.

* Move from simple to complex concepts incrementally

    SDK v2 allows you to: 
    * Construct a single command.
    * Add a hyperparameter sweep on top of that command, 
    * Add the command with various others into a pipeline one after the other. 
    
    This construction is useful, given the iterative nature of machine learning.

* Reusable components in pipelines

    Azure Machine Learning introduces [components](concept-component.md) for managing and reusing common logic across pipelines. This functionality is available only via CLI v2 and SDK v2.

* Managed inferencing

    Azure Machine Learning offers [endpoints](concept-endpoints.md) to streamline model deployments for both real-time and batch inference deployments. This functionality is available only via CLI v2 and SDK v2.

## Should I use v1 or v2?

### CLI v2

The Azure Machine Learning CLI v1 has been deprecated. We recommend you to use CLI v2 if:

* You were a CLI v1 user
* You want to use new features like - reusable components, managed inferencing
* You don't want to use a Python SDK - CLI v2 allows you to use YAML with scripts in python, R, Java, Julia or C#
* You were a user of R SDK previously - Azure Machine Learning won't support an SDK in `R`. However, the CLI v2 has support for `R` scripts.
* You want to use command line based automation/deployments
* You don't need Spark Jobs. This feature is currently available in preview in CLI v2.

### SDK v2

The Azure Machine Learning Python SDK v1 doesn't have a planned deprecation date. If you have significant investments in Python SDK v1 and don't need any new features offered by SDK v2, you can continue to use SDK v1. However, you should consider using SDK v2 if:

* You want to use new features like - reusable components, managed inferencing
* You're starting a new workflow or pipeline - all new features and future investments will be introduced in v2
* You want to take advantage of the improved usability of the Python SDK v2 - ability to compose jobs and pipelines using Python functions, easy evolution from simple to complex tasks etc.

## Next steps

* [How to upgrade from v1 to v2](how-to-migrate-from-v1.md)
* Get started with CLI v2

    * [Install and set up CLI (v2)](how-to-configure-cli.md)
    * [Train models with the CLI (v2)](how-to-train-model.md)
    * [Deploy and score models with online endpoints](how-to-deploy-online-endpoints.md)
    
* Get started with SDK v2

    * [Install and set up SDK (v2)](https://aka.ms/sdk-v2-install)
    * [Train models with the Azure Machine Learning Python SDK v2](how-to-train-model.md)
    * [Tutorial: Create production ML pipelines with Python SDK v2 in a Jupyter notebook](tutorial-pipeline-python-sdk.md)
