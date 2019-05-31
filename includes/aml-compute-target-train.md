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
ms.date: 05/30/2019
---

|Training &nbsp;targets| GPU support |Automated ML | ML pipelines | Visual interface
|----|:----:|:----:|:----:|:----:|
|[Local computer](../articles/machine-learning/service/how-to-set-up-training-targets.md#local)| maybe | yes | &nbsp; | &nbsp; |
|[Azure Machine Learning Compute](../articles/machine-learning/service/how-to-set-up-training-targets.md#amlcompute)| yes | yes & <br/>hyperparameter&nbsp;tuning | yes | yes |
|[Remote VM](#vm) |yes | yes & <br/>hyperparameter tuning | yes | &nbsp; |
|[Azure&nbsp;Databricks](../articles/machine-learning/service/how-to-create-your-first-pipeline.md#databricks)| &nbsp; | yes | yes | &nbsp; |
|[Azure Data Lake Analytics](../articles/machine-learning/service/how-to-create-your-first-pipeline.md#adla)| &nbsp; | &nbsp; | yes | &nbsp; |
|[Azure HDInsight](../articles/machine-learning/service/how-to-set-up-training-targets.md#hdinsight)| &nbsp; | &nbsp; | yes | &nbsp; |
|[Azure Batch](../articles/machine-learning/service/how-to-set-up-training-targets.md#azbatch)| &nbsp; | &nbsp; | yes | &nbsp; |

**All compute targets can be reused for multiple training jobs**. For example, once you attach a remote VM to your workspace, you can reuse it for multiple jobs.