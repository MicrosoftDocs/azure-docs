---
title: Train R models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to train R models in Azure Machine Learning.'
ms.service: machine-learning
ms.date: 11/10/2022
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# How to train R models in Azure Machine Learning

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This article explains how to take the R script that you [adapted to run in production](how-to-razureml-modify-script-for-prod.md) and set it up to run as an R job using the AzureML CLI V2.

> [!NOTE]
> Although the title of this article refers to _training_ a model, you can actually run any kind of R script as long as it meets the requirements listed in the adapting article.

## Prerequisites

- An AzureML workspace
- [A registered data asset](how-to-create-data-assets.md)
- [A compute cluster](how-to-create-attach-compute-cluster.md)
- [An R environment](how-to-razureml-modify-script-for-prod.md#create-an-environment)

## Create a folder with this structure

Create this folder structure for your project:
```
📁 r-job-azureml
├─ src
│  ├─ azureml_utils.R
│  ├─ r-source.R
├─ job.yml
```
> [!IMPORTANT]
> All source code goes in the `src` directory.

* The `r-source.R` file is the R script that you adapted to run in production
* The `azureml_utils.R` file is necessary. The source code is shown [here](how-to-razureml-modify-script-for-prod.md#source-the-azureml_utilsr-helper-script)



## Submit job

- Gather the name of the registered data asset
- Gather the name of the environment you created
- Gather the name of the compute cluster

> [!TIP]
> For AzureML resources that require versions (data assets, environments), you can use the shortcut URI 


```yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: >
  Rscript train.R 
  --data_file ${{inputs.iris}}
  --model_folder ${{outputs.model}}
code: src

inputs:
  iris: 
    type: uri_file
    path: https://azuremlexamples.blob.core.windows.net/datasets/iris.csv
outputs:
  model:
    type: custom_model
environment: azureml:<name-of-r-environment>@latest
compute: azureml:<name-of-compute-cluster>
display_name: r-iris-example
experiment_name: r-iris-example
description: Train an R model on the Iris dataset.
```

