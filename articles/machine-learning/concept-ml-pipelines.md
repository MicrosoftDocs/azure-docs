---
title: 'What are machine learning pipelines?'
titleSuffix: Azure Machine Learning
description: Learn how machine learning pipelines help you build, optimize, and manage machine learning workflows.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
ms.author: larryfr
author: blackmist
ms.date: 01/15/2022
ms.custom: devx-track-python
---

# What are Azure Machine Learning pipelines?

In this article, you learn how a machine learning pipeline helps you build, optimize, and manage your machine learning workflow. 

<a name="compare"></a>
## Which Azure pipeline technology should I use?

The Azure cloud provides several types of pipeline, each with a different purpose. The following table lists the different pipelines and what they're used for:

| Scenario | Primary persona | Azure offering | OSS offering | Canonical pipe | Strengths | 
| -------- | --------------- | -------------- | ------------ | -------------- | --------- | 
| Model orchestration (Machine learning) | Data scientist | Azure Machine Learning Pipelines | Kubeflow Pipelines | Data -> Model | Distribution, caching, code-first, reuse | 
| Data orchestration (Data prep) | Data engineer | [Azure Data Factory pipelines](../data-factory/concepts-pipelines-activities.md) | Apache Airflow | Data -> Data | Strongly typed movement, data-centric activities |
| Code & app orchestration (CI/CD) | App Developer / Ops | [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) | Jenkins | Code + Model -> App/Service | Most open and flexible activity support, approval queues, phases with gating | 

## What can machine learning pipelines do?

An Azure Machine Learning pipeline is an independently executable workflow of a complete machine learning task. Subtasks are encapsulated as a series of steps within the pipeline. An Azure Machine Learning pipeline can be as simple as one that calls a Python script, so _may_ do just about anything. Pipelines _should_ focus on machine learning tasks such as:

+ Data preparation
+ Training configuration 
+ Efficient training and validation
+ Repeatable deployments

Time-consuming steps can be done only when their input changes. A change to the training script may be run without redoing the data loading and preparation steps. Separate steps can use different compute type/sizes for each steps. Independent steps allow multiple data scientists to work on the same pipeline at the same time without over-taxing compute resources. 

## Key advantages

The key advantages of using pipelines for your machine learning workflows are:

|Key advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;runs**|Schedule steps to run in parallel or in sequence in a reliable and unattended manner. Data preparation and modeling can last days or weeks, and pipelines allow you to focus on other tasks while the process is running. |
|**Heterogenous compute**|Use multiple pipelines that are reliably coordinated across heterogeneous and scalable compute resources and storage locations. Make efficient use of available compute resources by running individual pipeline steps on different compute targets, such as HDInsight, GPU Data Science VMs, and Databricks.|
|**Reusability**|Create pipeline templates for specific scenarios, such as retraining and batch-scoring. Trigger published pipelines from external systems via simple REST calls.|
|**Tracking and versioning**|Instead of manually tracking data and result paths as you iterate, use the pipelines SDK to explicitly name and version your data sources, inputs, and outputs. You can also manage scripts and data separately for increased productivity.|
| **Modularity** | Separating areas of concerns and isolating changes allows software to evolve at a faster rate with higher quality. | 
|**Collaboration**|Pipelines allow data scientists to collaborate across all areas of the machine learning design process, while being able to concurrently work on pipeline steps.|

### Analyzing dependencies

The dependency analysis in Azure Machine Learning pipelines is more sophisticated than simple timestamps. Every step may run in a different hardware and software environment. Azure Machine Learning automatically orchestrates all of the dependencies between pipeline steps. This orchestration might include spinning up and down Docker images, attaching and detaching compute resources, and moving data between the steps in a consistent and automatic manner.

### Coordinating the steps involved

When you create and run a `Pipeline` object, the following high-level steps occur:

+ For each step, the service calculates requirements for:
    + Hardware compute resources
    + OS resources (Docker image(s))
    + Software resources (Conda / virtualenv dependencies)
    + Data inputs 
+ The service determines the dependencies between steps, resulting in a dynamic execution graph
+ When each node in the execution graph runs:
    + The service configures the necessary hardware and software environment (perhaps reusing existing resources)
    + The step runs, providing logging and monitoring information to its containing `Experiment` object
    + When the step completes, its outputs are prepared as inputs to the next step and/or written to storage
    + Resources that are no longer needed are finalized and detached

![Pipeline steps](./media/concept-ml-pipelines/run_an_experiment_as_a_pipeline.png)

## Next steps

Azure Machine Learning pipelines are a powerful facility that begins delivering value in the early development stages. 

+ [Define pipelines with the Azure CLI](./how-to-train-cli.md#hello-pipelines)
+ [Define pipelines with the Azure SDK](./how-to-create-machine-learning-pipelines.md)
+ [Define pipelines with Designer](./tutorial-designer-automobile-price-train-score.md)
+ See the SDK reference docs for [pipeline core](/python/api/azureml-pipeline-core/) and [pipeline steps](/python/api/azureml-pipeline-steps/).
+ Try out example Jupyter notebooks showcasing [Azure Machine Learning pipelines](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines). Learn how to [run notebooks to explore this service](samples-notebooks.md).
