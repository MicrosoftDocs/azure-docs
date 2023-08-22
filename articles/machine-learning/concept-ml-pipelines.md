---
title: 'What are machine learning pipelines?'
titleSuffix: Azure Machine Learning
description: Learn how machine learning pipelines help you build, optimize, and manage machine learning workflows.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
ms.author: lagayhar
author: lgayhardt
ms.reviewer: lagayhar
ms.date: 05/10/2022
ms.custom: event-tier1-build-2022
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# What are Azure Machine Learning pipelines?

:::moniker range="azureml-api-1"
[!INCLUDE [dev v1](includes/machine-learning-dev-v1.md)]
:::moniker-end
:::moniker range="azureml-api-2"
[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]
:::moniker-end

An Azure Machine Learning pipeline is an independently executable workflow of a complete machine learning task. An Azure Machine Learning pipeline helps to standardize the best practices of producing a machine learning model, enables the team to execute at scale, and improves the model building efficiency.

## Why are Azure Machine Learning pipelines needed?

The core of a machine learning pipeline is to split a complete machine learning task into a multistep workflow. Each step is a manageable component that can be developed, optimized, configured, and automated individually. Steps are connected through well-defined interfaces. The Azure Machine Learning pipeline service automatically orchestrates all the dependencies between pipeline steps. This modular approach brings two key benefits:
- [Standardize the Machine learning operation (MLOps) practice and support scalable team collaboration](#standardize-the-mlops-practice-and-support-scalable-team-collaboration)
- [Training efficiency and cost reduction](#training-efficiency-and-cost-reduction)

### Standardize the MLOps practice and support scalable team collaboration

Machine learning operation (MLOps) automates the process of building machine learning models and taking the model to production. This is a complex process. It usually requires collaboration from different teams with different skills. A well-defined machine learning pipeline can abstract this complex process into a multiple steps workflow, mapping each step to a specific task such that each team can work independently.  

For example, a typical machine learning project includes the steps of data collection, data preparation, model training, model evaluation, and model deployment. Usually, the data engineers concentrate on data steps, data scientists spend most time on model training and evaluation, the machine learning engineers focus on model deployment and automation of the entire workflow. By leveraging machine learning pipeline, each team only needs to work on building their own steps. The best way of building steps is using [Azure Machine Learning component (v2)](concept-component.md), a self-contained piece of code that does one step in a machine learning pipeline. All these steps built by different users are finally integrated into one workflow through the pipeline definition. The pipeline is a collaboration tool for everyone in the project. The process of defining a pipeline and all its steps can be standardized by each company's preferred DevOps practice. The pipeline can be further versioned and automated. If the ML projects are described as a pipeline, then the best MLOps practice is already applied.  

### Training efficiency and cost reduction

Besides being the tool to put MLOps into practice, the machine learning pipeline also improves large model training's efficiency and reduces cost. Taking modern natural language model training as an example. It requires pre-processing large amounts of data and GPU intensive transformer model training. It takes hours to days to train a model each time. When the model is being built, the data scientist wants to test different training code or hyperparameters and run the training many times to get the best model performance. For most of these trainings, there's usually small changes from one training to another one. It will be a significant waste if every time the full training from data processing to model training takes place. By using machine learning pipeline, it can automatically calculate which steps result is unchanged and reuse outputs from previous training. Additionally, the machine learning pipeline supports running each step on different computation resources. Such that, the memory heavy data processing work and run-on high memory CPU machines, and the computation intensive training can run on expensive GPU machines. By properly choosing which step to run on which type of machines, the training cost can be significantly reduced.

## Getting started best practices

Depending on what a machine learning project already has, the starting point of building a machine learning pipeline may vary. There are a few typical approaches to building a pipeline.

The first approach usually applies to the team that hasn't used pipeline before and wants to take some advantage of pipeline like MLOps. In this situation, data scientists typically have developed some machine learning models on their local environment using their favorite tools. Machine learning engineers need to take data scientists' output into production. The work involves cleaning up some unnecessary code from original notebook or Python code, changes the training input from local data to parameterized values, split the training code into multiple steps as needed, perform unit test of each step, and finally wraps all steps into a pipeline.

Once the teams get familiar with pipelines and want to do more machine learning projects using pipelines, they'll find the first approach is hard to scale. The second approach is set up a few pipeline templates, each try to solve one specific machine learning problem. The template predefines the pipeline structure including how many steps, each step's inputs and outputs, and their connectivity. To start a new machine learning project, the team first forks one template repo. The team leader then assigns members which step they need to work on. The data scientists and data engineers do their regular work. When they're happy with their result, they structure their code to fit in the pre-defined steps. Once the structured codes are checked-in, the pipeline can be executed or automated. If there's any change, each member only needs to work on their piece of code without touching the rest of the pipeline code. 

Once a team has built a collection of machine learnings pipelines and reusable components, they could start to build the machine learning pipeline from cloning previous pipeline or tie existing reusable component together. At this stage, the team's overall productivity will be improved significantly.  

:::moniker range="azureml-api-2"
Azure Machine Learning offers different methods to build a pipeline. For users who are familiar with DevOps practices, we recommend using [CLI](how-to-create-component-pipelines-cli.md). For data scientists who are familiar with python, we recommend writing pipeline using the [Azure Machine Learning SDK v2](how-to-create-component-pipeline-python.md). For users who prefer to use UI, they could use the [designer to build pipeline by using registered components](how-to-create-component-pipelines-ui.md).


:::moniker-end

<a name="compare"></a>
## Which Azure pipeline technology should I use?

The Azure cloud provides several types of pipeline, each with a different purpose. The following table lists the different pipelines and what they're used for:

| Scenario | Primary persona | Azure offering | OSS offering | Canonical pipe | Strengths |
| -------- | --------------- | -------------- | ------------ | -------------- | --------- |
| Model orchestration (Machine learning) | Data scientist | Azure Machine Learning Pipelines | Kubeflow Pipelines | Data -> Model | Distribution, caching, code-first, reuse | 
| Data orchestration (Data prep) | Data engineer | [Azure Data Factory pipelines](../data-factory/concepts-pipelines-activities.md) | Apache Airflow | Data -> Data | Strongly typed movement, data-centric activities |
| Code & app orchestration (CI/CD) | App Developer / Ops | [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) | Jenkins | Code + Model -> App/Service | Most open and flexible activity support, approval queues, phases with gating |

## Next steps

Azure Machine Learning pipelines are a powerful facility that begins delivering value in the early development stages.

:::moniker range="azureml-api-2"
+ [Define pipelines with the Azure Machine Learning CLI v2](./how-to-create-component-pipelines-cli.md)
+ [Define pipelines with the Azure Machine Learning SDK v2](./how-to-create-component-pipeline-python.md)
+ [Define pipelines with Designer](./how-to-create-component-pipelines-ui.md)
+ Try out [CLI v2 pipeline example](https://github.com/Azure/azureml-examples/tree/sdk-preview/cli/jobs/pipelines-with-components)
+ Try out [Python SDK v2 pipeline example](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines)
+ Learn about [SDK and CLI v2 expressions](concept-expressions.md) that can be used in a pipeline.
:::moniker-end
:::moniker range="azureml-api-1"
+ [Create and run machine learning pipelines](v1/how-to-create-machine-learning-pipelines.md)
+ [Define pipelines with Designer](./how-to-create-component-pipelines-ui.md)
:::moniker-end