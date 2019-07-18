---
title: 'Pipelines: optimize machine learning workflows'
titleSuffix: Azure Machine Learning service
description: In this article, learn about the machine learning pipelines you can build with the Azure Machine Learning SDK for Python and the advantages to using pipelines. Machine learning (ML) pipelines are used by data scientists to build, optimize, and manage their machine learning workflows.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: sanpil
author: sanpil
ms.date: 05/14/2019
ms.custom: seodec18
---

# Build reusable ML pipelines in Azure Machine Learning service

In this article, learn about the machine learning pipelines you can build with the Azure Machine Learning SDK for Python, and the advantages to using pipelines.

## What are machine learning pipelines?

Using machine learning (ML) pipelines, data scientists, data engineers, and IT professionals can collaborate on the steps involved in:
+ Data preparation, such as normalizations and transformations
+ Model training
+ Model evaluation
+ Deployment 

The following diagram shows an example pipeline:

![Machine learning pipelines in Azure Machine Learning service](./media/concept-ml-pipelines/pipelines.png)

<a name="compare"></a>
### Which Azure pipeline technology should I use?

The Azure cloud provides several other pipelines, each with a different purpose. The following table lists the different pipelines and what they are used for:

| Pipeline | What it does | Canonical pipe |
| ---- | ---- | ---- |
| Azure Machine Learning pipelines | Defines reusable machine learning workflows that can be used as a template for your machine learning scenarios. | Data -> model |
| [Azure Data Factory pipelines](https://docs.microsoft.com/azure/data-factory/concepts-pipelines-activities) | Groups data movement, transformation, and control activities needed to perform a task.  | Data -> data |
| [Azure pipelines](https://azure.microsoft.com/services/devops/pipelines/) | Continuous integration and delivery of your application to any platform/any cloud  | Code -> app/service |

## Why build pipelines with Azure Machine Learning?

You can use the [Azure Machine Learning SDK for Python](#the-python-sdk-for-pipelines) to create ML pipelines, as well as to submit and track individual pipeline runs.

With pipelines, you can optimize your workflow with simplicity, speed, portability, and reuse. When building pipelines with Azure Machine Learning, you can focus on your expertise, machine learning, rather than on infrastructure.

Using distinct steps makes it possible to rerun only the steps you need, as you tweak and test your workflow. A step is a computational unit in the pipeline. As shown in the preceding diagram, the task of preparing data can involve many steps. These steps include, but aren't limited to, normalization, transformation, validation, and featurization. Data sources and intermediate data are reused across the pipeline, which saves compute time and resources. 

After the pipeline is designed, there is often more fine-tuning around the training loop of the pipeline. When you rerun a pipeline, the run jumps to the steps that need to be rerun, such as an updated training script, and skips what hasn't changed. The same paradigm applies to unchanged scripts used for the execution of the step. 

With Azure Machine Learning, you can use various toolkits and frameworks, such as PyTorch or TensorFlow, for each step in your pipeline. Azure coordinates between the various [compute targets](concept-azure-machine-learning-architecture.md) you use, so that your intermediate data can be shared with the downstream compute targets easily. 

You can [track the metrics for your pipeline experiments](https://docs.microsoft.com/azure/machine-learning/service/how-to-track-experiments) directly in the Azure portal. 

## Key advantages

The key advantages to building pipelines for your machine learning workflows are:

|Key advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;runs**|Schedule a few steps to run in parallel or in sequence in a reliable and unattended manner. Because data prep and modeling can last days or weeks, you can now focus on other tasks while your pipeline is running. |
|**Mixed and diverse compute**|Use multiple pipelines that are reliably coordinated across heterogeneous and scalable computes and storages. You can run individual pipeline steps on different compute targets, such as HDInsight, GPU Data Science VMs, and Databricks. This makes efficient use of available compute options.|
|**Reusability**|You can templatize pipelines for specific scenarios, such as retraining and batch scoring. Trigger them from external systems via simple REST calls.|
|**Tracking and versioning**|Instead of manually tracking data and result paths as you iterate, use the pipelines SDK to explicitly name and version your data sources, inputs, and outputs. You can also manage scripts and data separately for increased productivity.|

## The Python SDK for pipelines

Use Python to create your ML pipelines. The Azure Machine Learning SDK offers imperative constructs for sequencing and parallelizing the steps in your pipelines when no data dependency is present. You can interact with it in Jupyter notebooks, or in another preferred integrated development environment. 

Using declarative data dependencies, you can optimize your tasks. The SDK includes a framework of pre-built modules for common tasks, such as data transfer and model publishing. You can extend the framework to model your own conventions, by implementing custom steps that are reusable across pipelines. You can also manage compute targets and storage resources directly from the SDK.

You can save pipelines as templates, and deploy them to a REST endpoint so you can schedule batch-scoring or retraining jobs.

To see how to build your own, see the [Python SDK reference docs for pipelines](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py) and the notebook in the next section.

## Example notebooks
 
The following notebooks demonstrate pipelines with Azure Machine Learning:  [how-to-use-azureml/machine-learning-pipelines](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines).
 
[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

Learn how to [create your first pipeline](how-to-create-your-first-pipeline.md).
