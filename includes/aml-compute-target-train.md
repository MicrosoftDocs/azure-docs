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
ms.date: 09/17/2020
---
**Compute targets can be reused from one training job to the next**. For example, once you attach a remote VM to your workspace, you can reuse it for multiple jobs.  For machine learning pipelines, use the appropriate [pipeline step](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps?view=azure-ml-py&preserve-view=true) for each compute target.

You can use any of the resources below for a training compute target for most jobs.  However, not all resources can be used for automated machine learning, machine learning pipelines, or designer:

|Training &nbsp;targets|[Automated ML](../articles/machine-learning/concept-automated-ml.md) | [ML pipelines](../articles/machine-learning/concept-ml-pipelines.md) | [Azure Machine Learning designer](../articles/machine-learning/concept-designer.md)
|----|:----:|:----:|:----:|
|[Local computer](../articles/machine-learning/how-to-attach-compute-targets.md#local)| yes | &nbsp; | &nbsp; |
|[Azure Machine Learning compute cluster](../articles/machine-learning/how-to-create-attach-compute-cluster.md)| yes | yes | yes |
|[Azure Machine Learning compute instance](../articles/machine-learning/how-to-create-manage-compute-instance.md) | yes (through SDK)  | yes |  |
|[Remote VM](../articles/machine-learning/how-to-attach-compute-targets.md#vm) | yes  | yes | &nbsp; |
|[Azure&nbsp;Databricks](../articles/machine-learning/how-to-attach-compute-targets.md#databricks)| yes (SDK local mode only) | yes | &nbsp; |
|[Azure Data Lake Analytics](../articles/machine-learning/how-to-attach-compute-targets.md#adla) | &nbsp; | yes | &nbsp; |
|[Azure HDInsight](../articles/machine-learning/how-to-attach-compute-targets.md#hdinsight) | &nbsp; | yes | &nbsp; |
|[Azure Batch](../articles/machine-learning/how-to-attach-compute-targets.md#azbatch) | &nbsp; | yes | &nbsp; |
