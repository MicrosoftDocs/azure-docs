---
title: 'Azure Machine Learning CLI & SDK v2'
titleSuffix: Azure Machine Learning
description: This article explains the difference between the v1 and v2 versions of Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: balapv
author: balapv
ms.reviewer: sgilley
ms.date: 01/17/2024
ms.custom: cliv2, sdkv2, event-tier1-build-2022, ignite-2022, devx-track-python
#Customer intent: As a data scientist, I want to know whether to use v1 or v2 of CLI and SDK.
---

# What is Azure Machine Learning CLI and Python SDK v2?

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Azure Machine Learning CLI v2 (CLI v2) and Azure Machine Learning Python SDK v2 (SDK v2) introduce a consistency of features and terminology across the interfaces. To create this consistency, the syntax of commands differs, in some cases significantly, from the first versions (v1).

There are no differences in functionality between CLI v2 and SDK v2. The command line-based CLI might be more convenient in CI/CD MLOps types of scenarios, while the SDK might be more convenient for development.

## Azure Machine Learning CLI v2

Azure Machine Learning CLI v2 is the latest extension for the [Azure CLI](/cli/azure/what-is-azure-cli). CLI v2 provides commands in the format *az ml __\<noun\> \<verb\> \<options\>__* to create and maintain Machine Learning assets and workflows. The assets or workflows themselves are defined by using a YAML file. The YAML file defines the configuration of the asset or workflow. For example, what is it, and where should it run?

A few examples of CLI v2 commands:

* `az ml job create --file my_job_definition.yaml`
* `az ml environment update --name my-env --file my_updated_env_definition.yaml`
* `az ml model list`
* `az ml compute show --name my_compute`

### Use cases for CLI v2

CLI v2 is useful in the following scenarios:

* Onboard to Machine Learning without the need to learn a specific programming language.

    The YAML file defines the configuration of the asset or workflow, such as what is it and where should it run? Any custom logic or IP used, say data preparation, model training, and model scoring, can remain in script files. These files are referred to in the YAML but aren't part of the YAML itself. Machine Learning supports script files in Python, R, Java, Julia, or C#. All you need to learn is YAML format and command lines to use Machine Learning. You can stick with script files of your choice.

* Take advantage of ease of deployment and automation.

    The use of command line for execution makes deployment and automation simpler because you can invoke workflows from any offering or platform, which allows users to call the command line.

* Use managed inference deployments.

    Machine Learning offers [endpoints](concept-endpoints.md) to streamline model deployments for both real-time and batch inference deployments. This functionality is available only via CLI v2 and SDK v2.

* Reuse components in pipelines.

    Machine Learning introduces [components](concept-component.md) for managing and reusing common logic across pipelines. This functionality is available only via CLI v2 and SDK v2.

## Azure Machine Learning Python SDK v2

Azure Machine Learning Python SDK v2 is an updated Python SDK package, which allows users to:

* Submit training jobs.
* Manage data, models, and environments.
* Perform managed inferencing (real time and batch).
* Stitch together multiple tasks and production workflows by using Machine Learning pipelines.

SDK v2 is on par with CLI v2 functionality and is consistent in how assets (nouns) and actions (verbs) are used between SDK and CLI. For example, to list an asset, you can use the `list` action in both SDK and CLI. You can use the same `list` action to list a compute, model, environment, and so on.

### Use cases for SDK v2

SDK v2 is useful in the following scenarios:

* Use Python functions to build a single step or a complex workflow.

    SDK v2 allows you to build a single command or a chain of commands like Python functions. The command has a name and parameters, expects input, and returns output.

* Move from simple to complex concepts incrementally.

    SDK v2 allows you to:

    * Construct a single command.
    * Add a hyperparameter sweep on top of that command.
    * Add the command with various others into a pipeline one after the other.
    
    This construction is useful because of the iterative nature of machine learning.

* Reuse components in pipelines.

    Machine Learning introduces [components](concept-component.md) for managing and reusing common logic across pipelines. This functionality is available only via CLI v2 and SDK v2.

* Use managed inferencing.

    Machine Learning offers [endpoints](concept-endpoints.md) to streamline model deployments for both real-time and batch inference deployments. This functionality is available only via CLI v2 and SDK v2.

## Should I use v1 or v2?

Support for CLI v2 will end on September 30, 2025.  

We encourage you to migrate your code for both CLI and SDK v1 to CLI and SDK v2. For more information, see [Upgrade to v2](how-to-migrate-from-v1.md).

### CLI v2

Azure Machine Learning CLI v1 has been deprecated. Support for the v1 extension will end on September 30, 2025. You will be able to install and use the v1 extension until that date.

We recommend that you transition to the `ml`, or v2, extension before September 30, 2025.

### SDK v2

Azure Machine Learning Python SDK v1 doesn't have a planned deprecation date. If you have significant investments in Python SDK v1 and don't need any new features offered by SDK v2, you can continue to use SDK v1. However, you should consider using SDK v2 if:

* You want to use new features like reusable components and managed inferencing.
* You're starting a new workflow or pipeline. All new features and future investments will be introduced in v2.
* You want to take advantage of the improved usability of the Python SDK v2 ability to compose jobs and pipelines by using Python functions, with easy evolution from simple to complex tasks.

## Next steps

* [Upgrade from v1 to v2](how-to-migrate-from-v1.md)
* Get started with CLI v2:

    * [Install and set up CLI (v2)](how-to-configure-cli.md)
    * [Train models with CLI (v2)](how-to-train-model.md)
    * [Deploy and score models with online endpoints](how-to-deploy-online-endpoints.md)
    
* Get started with SDK v2:

    * [Install and set up SDK (v2)](https://aka.ms/sdk-v2-install)
    * [Train models with Azure Machine Learning Python SDK v2](how-to-train-model.md)
    * [Tutorial: Create production Machine Learning pipelines with Python SDK v2 in a Jupyter notebook](tutorial-pipeline-python-sdk.md)
