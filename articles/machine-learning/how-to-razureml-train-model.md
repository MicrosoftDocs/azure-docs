---
title: Train R models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to train R models in Azure Machine Learning.'
ms.service: machine-learning
ms.date: 01/03/2023
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

- Azure CLI and ml extension installed
- An AzureML workspace
- [A registered data asset](how-to-create-data-assets.md)
- [A compute cluster](how-to-create-attach-compute-cluster.md)
- [An R environment](how-to-razureml-modify-script-for-prod.md#create-an-environment)

## Create a folder with this structure

Create this folder structure for your project:
> ```
> 📁 r-job-azureml
> ├─ src
> │  ├─ azureml_utils.R
> │  ├─ r-source.R
> ├─ job.yml
> ```

> [!IMPORTANT]
> All source code goes in the `src` directory.

* The `r-source.R` file is the R script that you adapted to run in production
* The `azureml_utils.R` file is necessary. The source code is shown [here](how-to-razureml-modify-script-for-prod.md#source-the-azureml_utilsr-helper-script)



## Prepare the job YAML

When using the AzureML CLI V2, you can use different [different YAML schemas](reference-yaml-overview.md) for different operations. You will use the [job YAML schema](reference-yaml-job-command.md) to submit a job. This is the `job.yml` file that is a part of this project.

You will need to gather specific pieces of information to put into the YAML:

- The URI of the registered data asset you will use as the data input (with version): `azureml:<REGISTERED-DATA-ASSET>:<VERSION>`
- The URI of the environment you created (with version): `azureml:<R-ENVIRONMENT-NAME>:<VERSION>`
- The URI of the compute cluster: `azureml:<COMPUTE-CLUSTER-NAME>`


> [!TIP]
> For AzureML artifacts that require versions (data assets, environments), you can use the shortcut URI `azureml:<AZUREML-ASSET>@latest` to get the latest version of that artifact unless you need to set a specific version.


### Sample YAML schema to submit a job

Modify any value shown below <IN-BRACKETS-AND-CAPS> (remove the brackets).

```yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
# the Rscript command goes in the command key below. Here you also specify 
# which parameters are passed into the R script and can reference the input
# keys and values further below
command: >
Rscript <name-of-r-script>.R
--data_file ${{inputs.datafile}}  
--other_input_parameter ${{inputs.other}}
code: src   # this is the code directory
inputs:
  datafile: # this is a registered data asset
    type: uri_file
    path: azureml:<REGISTERED-DATA-ASSET>@latest
  other: 1  # this is a sample parameter, which is the number 1 (as text)
environment: azureml:<R-ENVIRONMENT-NAME>@latest
compute: azureml:<COMPUTE-CLUSTER-NAME>
experiment_name: <NAME-OF-EXPERIMENT>
description: <DESCRIPTION>
```

## Submit the job

You will also need to gather other pieces of information about your AzureMl workspace to use in the job submission:

- The AzureML workspace name
- The resource group name where the workspace is
- The subscription id where the workspace is

Using the AzureML CLI v2, change directories into the `r-job-azureml` and submit the job.

```bash
az ml job create -f job.yml  --workspace-name <WORKSPACE-NAME> --resource-group <RG-NAME> --subscription <SUBSCRIPTION-ID>
```
