---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 08/19/2020
---
**Compute targets can be reused from one training job to the next**. For example, once you attach a remote VM to your workspace, you can reuse it for multiple jobs.  For machine learning pipelines, use the appropriate [pipeline step](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps?view=azure-ml-py) for each compute target.

|Training &nbsp;targets|[Automated ML](../articles/machine-learning/concept-automated-ml.md) | [ML pipelines](../articles/machine-learning/concept-ml-pipelines.md) | [Azure Machine Learning designer](../articles/machine-learning/concept-designer.md)
|----|:----:|:----:|:----:|
|[Local computer](../articles/machine-learning/how-to-create-attach-compute-sdk.md#local)| yes | &nbsp; | &nbsp; |
|[Azure Machine Learning compute cluster](../articles/machine-learning/how-to-create-attach-compute-sdk.md#amlcompute)| yes & <br/>hyperparameter&nbsp;tuning | yes | yes |
|[Azure Machine Learning compute instance](../articles/machine-learning/how-to-create-attach-compute-sdk.md#instance) | yes & <br/>hyperparameter tuning | yes |  |
|[Remote VM](../articles/machine-learning/how-to-create-attach-compute-sdk.md#vm) | yes & <br/>hyperparameter tuning | yes | &nbsp; |
|[Azure&nbsp;Databricks](../articles/machine-learning/how-to-create-attach-compute-sdk.md#databricks)| yes (SDK local mode only) | yes | &nbsp; |
|[Azure Data Lake Analytics](../articles/machine-learning/how-to-create-attach-compute-sdk.md#adla) | &nbsp; | yes | &nbsp; |
|[Azure HDInsight](../articles/machine-learning/how-to-create-attach-compute-sdk.md#hdinsight) | &nbsp; | yes | &nbsp; |
|[Azure Batch](../articles/machine-learning/how-to-create-attach-compute-sdk.md#azbatch) | &nbsp; | yes | &nbsp; |
