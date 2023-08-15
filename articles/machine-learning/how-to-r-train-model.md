---
title: Train R models
titleSuffix: Azure Machine Learning
description: 'Learn how to train your machine learning model with R for use in Azure Machine Learning.'
ms.service: machine-learning
ms.subservice: core
ms.date: 01/12/2023
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Run an R job to train a model

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

This article explains how to take the R script that you [adapted to run in production](how-to-r-modify-script-for-production.md) and set it up to run as an R job using the Azure Machine Learning CLI V2.

> [!NOTE]
> Although the title of this article refers to _training_ a model, you can actually run any kind of R script as long as it meets the requirements listed in the adapting article.

## Prerequisites

- An [Azure Machine Learning workspace](quickstart-create-resources.md).
- [A registered data asset](how-to-create-data-assets.md) that your training job will use.
- Azure [CLI and ml extension installed](how-to-configure-cli.md).  Or use a [compute instance in your workspace](quickstart-create-resources.md), which has the CLI preinstalled.
- [A compute cluster](how-to-create-attach-compute-cluster.md) or [compute instance](quickstart-create-resources.md#create-a-compute-instance) to run your training job.
- [An R environment](how-to-r-modify-script-for-production.md#create-an-environment) for the compute cluster to use to run the job.

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

* The **r-source.R** file is the R script that you adapted to run in production
* The **azureml_utils.R** file is necessary. The source code is shown [here](how-to-r-modify-script-for-production.md#source-the-azureml_utilsr-helper-script)



## Prepare the job YAML

Azure Machine Learning CLI v2 has different [different YAML schemas](reference-yaml-overview.md) for different operations. You'll use the [job YAML schema](reference-yaml-job-command.md) to submit a job. This is the **job.yml** file that is a part of this project.

You'll need to gather specific pieces of information to put into the YAML:

- The name of the registered data asset you'll use as the data input (with version): `azureml:<REGISTERED-DATA-ASSET>:<VERSION>`
- The name of the environment you created (with version): `azureml:<R-ENVIRONMENT-NAME>:<VERSION>`
- The name of the compute cluster: `azureml:<COMPUTE-CLUSTER-NAME>`


> [!TIP]
> For Azure Machine Learning artifacts that require versions (data assets, environments), you can use the shortcut URI `azureml:<AZUREML-ASSET>@latest` to get the latest version of that artifact if you don't need to set a specific version.


### Sample YAML schema to submit a job

Edit your **job.yml** file to contain the following.  Make sure to replace values shown `<IN-BRACKETS-AND-CAPS>` and remove the brackets.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
# the Rscript command goes in the command key below. Here you also specify 
# which parameters are passed into the R script and can reference the input
# keys and values further below
# Modify any value shown below <IN-BRACKETS-AND-CAPS> (remove the brackets)
command: >
Rscript <NAME-OF-R-SCRIPT>.R
--data_file ${{inputs.datafile}}  
--other_input_parameter ${{inputs.other}}
code: src   # this is the code directory
inputs:
  datafile: # this is a registered data asset
    type: uri_file
    path: azureml:<REGISTERED-DATA-ASSET>@latest
  other: 1  # this is a sample parameter, which is the number 1 (as text)
environment: azureml:<R-ENVIRONMENT-NAME>@latest
compute: azureml:<COMPUTE-CLUSTER-OR-INSTANCE-NAME>
experiment_name: <NAME-OF-EXPERIMENT>
description: <DESCRIPTION>
```

## Submit the job

In the following commands in this section, you may need to know:

- The Azure Machine Learning workspace name
- The resource group name where the workspace is
- The subscription where the workspace is

Find these values from [Azure Machine Learning studio](https://ml.azure.com):

1. Sign in and open your workspace.
1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. You can copy the values from the section that appears.  

:::image type="content" source="media/how-to-r-train-model/find-values.png" alt-text="Screenshot: Find the values to use in your CLI command." lightbox="media/how-to-r-train-model/find-values.png":::

To submit the job, run the following commands in a terminal window:

1. Change directories into the `r-job-azureml`.

    ```bash
    cd r-job-azureml
    ```

1. Sign in to Azure.  If you're doing this from an [Azure Machine Learning compute instance](quickstart-create-resources.md#create-a-compute-instance), use:

    ```azurecli
    az login --identity
    ```

    If you're not on the compute instance, omit `--identity` and follow the prompt to open a browser window to authenticate.

1. Make sure you have the most recent versions of the CLI and the `ml` extension:
    
    ```azurecli
    az upgrade
    ```

1. If you have multiple Azure subscriptions, set the active subscription to the one you're using for your workspace. (You can skip this step if you only have access to a single subscription.)  Replace `<SUBSCRIPTION-NAME>` with your subscription name.  Also remove the brackets `<>`.

    ```azurecli
    az account set --subscription "<SUBSCRIPTION-NAME>"
    ```

1. Now use CLI to submit the job. If you're doing this on a compute instance in your workspace, you can use environment variables for the workspace name and resource group as show in the following code.  If you aren't on a compute instance, replace these values with your workspace name and resource group.

    ```azurecli
    az ml job create -f job.yml  --workspace-name $CI_WORKSPACE --resource-group $CI_RESOURCE_GROUP
    ```

Once you've submitted the job, you can check the status and results in studio:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Select your workspace if it isn't already loaded.
1. On the left navigation, select **Jobs**.
1. Select the **Experiment name** that you used to train your model.
1. Select the **Display name** of the job to view details and artifacts of the job, including metrics, images, child jobs, outputs, logs, and code used in the job.  


## Register model

Finally, once the training job is complete, register your model if you want to deploy it.  Start in the studio from the page showing your job details.

1. Once your job completes, select **Outputs + logs** to view outputs of the job.
1. Open the **models** folder to verify that **crate.bin** and **MLmodel** are present.  If not, check the logs to see if there was an error.
1. On the toolbar at the top, select **+ Register model**.

    :::image type="content" source="media/how-to-r-train-model/register-model.png" alt-text="Screenshot shows the Job section of studio with the Outputs section open.":::

1. For **Model type**, change the default from **MLflow** to **Unspecified type**.
1. For **Job output**, select **models**, the folder that contains the model.
1. Select **Next**.
1. Supply the name you wish to use for your model.  Add **Description**, **Version**, and **Tags** if you wish.
1. Select **Next**.
1. Review the information.
1. Select **Register**.

At the top of the page, you'll see a confirmation that the model is registered.  The confirmation looks similar to this:

:::image type="content" source="media/how-to-r-train-model/registered.png" alt-text="Screenshot shows example of successful registration.":::

Select **Click here to go to this model.** if you wish to view the registered model details.

## Next steps
 
Now that you have a registered model, learn [How to deploy an R model to an online (real time) endpoint](how-to-r-deploy-r-model.md).
