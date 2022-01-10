---
title: 'What are machine learning pipelines?'
titleSuffix: Azure Machine Learning
description: Learn how machine learning pipelines help you build, optimize, and manage machine learning workflows.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
ms.author: laobri
author: lobrien
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

+ Data preparation including importing, validating and cleaning, munging and transformation, normalization, and staging
+ Training configuration including parameterizing arguments, filepaths, and logging / reporting configurations
+ Training and validating efficiently and repeatedly. Efficiency might come from specifying specific data subsets, different hardware compute resources, distributed processing, and progress monitoring
+ Deployment, including versioning, scaling, provisioning, and access control

Independent steps allow multiple data scientists to work on the same pipeline at the same time without over-taxing compute resources. Separate steps also make it easy to use different compute types/sizes for each step.

After the pipeline is designed, there is often more fine-tuning around the training loop of the pipeline. When you rerun a pipeline, the run jumps to the steps that need to be rerun, such as an updated training script. Steps that do not need to be rerun are skipped. 

With pipelines, you may choose to use different hardware for different tasks. Azure coordinates the various [compute targets](concept-azure-machine-learning-architecture.md) you use, so your intermediate data seamlessly flows to downstream compute targets.

You can [track the metrics for your pipeline experiments](./how-to-log-view-metrics.md) directly in  Azure portal or your [workspace landing page (preview)](https://ml.azure.com). After a pipeline has been published, you can configure a REST endpoint, which allows you to rerun the pipeline from any platform or stack.

In short, all of the complex tasks of the machine learning lifecycle can be helped with pipelines. Other Azure pipeline technologies have their own strengths. [Azure Data Factory pipelines](../data-factory/concepts-pipelines-activities.md) excels at working with data and [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) is the right tool for continuous integration and deployment. But if your focus is machine learning, Azure Machine Learning pipelines are likely to be the best choice for your workflow needs. 

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

+ [Define pipelines with the Azure CLI](./how-to-train-cli#hello-pipelines)
+ [Define pipelines with the Azure SDK](./how-to-create-machine-learning-pipelines.md)
+ [Define pipelines with Designer](./tutorial-designer-automobile-price-train-score.md)
+ See the SDK reference docs for [pipeline core](/python/api/azureml-pipeline-core/) and [pipeline steps](/python/api/azureml-pipeline-steps/).
+ Try out example Jupyter notebooks showcasing [Azure Machine Learning pipelines](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines). Learn how to [run notebooks to explore this service](samples-notebooks.md).