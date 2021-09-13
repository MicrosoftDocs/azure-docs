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
ms.date: 06/18/2021
---

**Compute targets can be reused from one training job to the next.** For example, after you attach a remote VM to your workspace, you can reuse it for multiple jobs. For machine learning pipelines, use the appropriate [pipeline step](/python/api/azureml-pipeline-steps/azureml.pipeline.steps) for each compute target.

You can use any of the following resources for a training compute target for most jobs. Not all resources can be used for automated machine learning, machine learning pipelines, or designer. Azure Databricks can be used as a training resource for local runs and machine learning pipelines, but not as a remote target for other training.

|Training &nbsp;targets|[Automated machine learning](../articles/machine-learning/concept-automated-ml.md) | [Machine learning pipelines](../articles/machine-learning/concept-ml-pipelines.md) | [Azure Machine Learning designer](../articles/machine-learning/concept-designer.md)
|----|:----:|:----:|:----:|
|[Local computer](../articles/machine-learning/how-to-attach-compute-targets.md#local)| Yes | &nbsp; | &nbsp; |
|[Azure Machine Learning compute cluster](../articles/machine-learning/how-to-create-attach-compute-cluster.md)| Yes | Yes | Yes |
|[Azure Machine Learning compute instance](../articles/machine-learning/how-to-create-manage-compute-instance.md) | Yes (through SDK)  | Yes |  |
|[Remote VM](../articles/machine-learning/how-to-attach-compute-targets.md#vm) | Yes  | Yes | &nbsp; |
|[Apache Spark pools (preview)](../articles/machine-learning/how-to-attach-compute-targets.md#synapse)| Yes (SDK local mode only) | Yes | &nbsp; |
|[Azure&nbsp;Databricks](../articles/machine-learning/how-to-attach-compute-targets.md#databricks)| Yes (SDK local mode only) | Yes | &nbsp; |
|[Azure Data Lake Analytics](../articles/machine-learning/how-to-attach-compute-targets.md#adla) | &nbsp; | Yes | &nbsp; |
|[Azure HDInsight](../articles/machine-learning/how-to-attach-compute-targets.md#hdinsight) | &nbsp; | Yes | &nbsp; |
|[Azure Batch](../articles/machine-learning/how-to-attach-compute-targets.md#azbatch) | &nbsp; | Yes | &nbsp; |
|[Azure Kubernetes Service](../articles/machine-learning/how-to-attach-compute-targets.md#kubernetes) (preview) | Yes | Yes | Yes |
|[Azure Arc enabled Kubernetes](../articles/machine-learning/how-to-attach-compute-targets.md#kubernetes) (preview) | Yes | Yes | Yes |

> [!TIP]
> The compute instance has 120GB OS disk. If you run out of disk space, [use the terminal](../articles/machine-learning/how-to-access-terminal.md) to clear at least 1-2 GB before you [stop or restart](../articles/machine-learning/how-to-create-manage-compute-instance.md#manage) the compute instance.
