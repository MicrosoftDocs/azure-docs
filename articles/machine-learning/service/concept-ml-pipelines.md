---
title: 'What are ML Pipelines'
titleSuffix: Azure Machine Learning service
description: In this article, learn about the machine learning pipelines you can build with the Azure Machine Learning SDK for Python and the advantages to using pipelines. Machine learning (ML) pipelines are used by data scientists to build, optimize, and manage their machine learning workflows.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: sanpil
author: sanpil
ms.date: 08/08/2019
ms.custom: seodec18
---

# What are ML pipelines in Azure Machine Learning service?

Learn how about the machine learning pipelines you can build and manage with Azure Machine Learning service. 

Using machine learning (ML) pipelines, data scientists, data engineers, and IT professionals can collaborate on the steps involved in:
+ Data preparation, such as normalizations and transformations
+ Model training
+ Model evaluation
+ Deployment

Learn how to [create your first pipeline](how-to-create-your-first-pipeline.md).

![Machine learning pipelines in Azure Machine Learning service](./media/concept-ml-pipelines/pipeline-flow.png)

<a name="compare"></a>
### Which Azure pipeline technology should I use?

The Azure cloud provides several other pipelines, each with a different purpose. The following table lists the different pipelines and what they are used for:

| Pipeline | What it does | Canonical pipe |
| ---- | ---- | ---- |
| Azure Machine Learning pipelines | Defines reusable machine learning workflows that can be used as a template for your machine learning scenarios. | Data -> model |
| [Azure Data Factory pipelines](https://docs.microsoft.com/azure/data-factory/concepts-pipelines-activities) | Groups data movement, transformation, and control activities needed to perform a task.  | Data -> data |
| [Azure pipelines](https://azure.microsoft.com/services/devops/pipelines/) | Continuous integration and delivery of your application to any platform/any cloud  | Code -> app/service |

## Why build pipelines with Azure Machine Learning?

Machine learning pipelines optimize your workflow with speed, portability, and reuse so you can focus on your expertise, machine learning, rather than on infrastructure and automation.

Pipelines are constructed from multiple **steps**, which are distinct computational units in the pipeline. Each step can run independently and use isolated compute resources. This allows multiple data scientists to work on the same pipeline at the same time without over-taxing compute resources, and also makes it easy to use different compute types/sizes for each step.

After the pipeline is designed, there is often more fine-tuning around the training loop of the pipeline. When you rerun a pipeline, the run jumps to the distinct steps that need to be rerun, such as an updated training script, and skips what hasn't changed. The same paradigm applies to unchanged scripts used for the execution of the step. This functionality helps to avoid running costly and time-intensive steps like data ingestion and transformation if the underlying data hasn't changed.

With Azure Machine Learning, you can use various toolkits and frameworks, such as PyTorch or TensorFlow, for each step in your pipeline. Azure coordinates between the various [compute targets](concept-azure-machine-learning-architecture.md) you use, so that your intermediate data can be shared with the downstream compute targets easily.

You can [track the metrics for your pipeline experiments](https://docs.microsoft.com/azure/machine-learning/service/how-to-track-experiments) directly in the Azure portal. After a pipeline has been published, you can configure a REST endpoint which allows you to rerun the pipeline from any platform or stack.

## Key advantages

The key advantages of using pipelines for your machine learning workflows are:

|Key advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;runs**|Schedule steps to run in parallel or in sequence in a reliable and unattended manner. Data preparation and modeling can last days or weeks, and pipelines allow you to focus on other tasks while the process is running. |
|**Heterogenous compute**|Use multiple pipelines that are reliably coordinated across heterogeneous and scalable compute resources and storage locations. Run individual pipeline steps on different compute targets, such as HDInsight, GPU Data Science VMs, and Databricks. This makes efficient use of available compute options.|
|**Reusability**|Create pipeline templates for specific scenarios, such as retraining and batch-scoring. Trigger published pipelines from external systems via simple REST calls.|
|**Tracking and versioning**|Instead of manually tracking data and result paths as you iterate, use the pipelines SDK to explicitly name and version your data sources, inputs, and outputs. You can also manage scripts and data separately for increased productivity.|
|**Collaboration**|Pipelines allow data scientists to collaborate across all areas of the machine learning design process, while being able to concurrently work on pipeline steps.|

## The Python SDK for pipelines

[Use Python SDK](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py) to create your ML pipelines in your preferred IDE or Jupyter notebooks. The Azure Machine Learning SDK offers imperative constructs for sequencing and parallelizing the steps in your pipelines when no data dependency is present. 

Using declarative data dependencies, you can optimize your tasks. The SDK includes a framework of pre-built modules for common tasks, such as data transfer and model publishing. You can extend the framework to model your own conventions by implementing custom steps reusable across pipelines. You can also manage compute targets and storage resources directly from the SDK.

Save your pipelines as templates, and deploy them to a REST endpoint for batch-scoring or retraining jobs.

There are two Python packages for pipelines with Azure Machine Learning: [azureml-pipelines-core](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py) and [azureml-pipeline-steps](https://docs.microsoft.com/en-us/python/api/azureml-pipeline-steps/?view=azure-ml-py).

## Next steps

+ Learn how to [create your first pipeline](how-to-create-your-first-pipeline.md).

+ Learn how to [run batch predictions on large data](how-to-run-batch-predictions.md).

+ Read the [SDK reference docs for pipelines](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py)

+ Try out example Jupyter notebooks showcasing [Azure Machine Learning pipelines](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines). Learn how to [run notebooks to explore this service](samples-notebooks.md).
