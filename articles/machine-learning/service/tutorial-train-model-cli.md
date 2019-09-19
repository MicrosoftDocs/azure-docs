---
title: Train ML models from the CLI
titleSuffix: Azure Machine Learning service
description: Learn how to use the machine learning extension for Azure CLI to train and register models from the command line.
ms.author: larryfr
author: Blackmist
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 09/12/2019
---

# Tutorial: Train a ML model from the CLI

In this tutorial, learn how you can use the machine learning extension for the Azure CLI to submit your model training jobs.

[scikit-learn blah blah blah]

## Prerequisites

* An Azure subscription.

* The Azure CLI.

## Download the example project

For this tutorial, you can find the files needed to train a model at [https://github.com/microsoft/MLOps/tree/master/model-training](https://github.com/microsoft/MLOps/tree/master/model-training).

To get a local copy of the files, either [download a .zip archive](https://github.com/microsoft/MLOps/archive/master.zip), or use Git command to clone the repository. The URL to use when cloning the repository is `https://github.com/microsoft/MLOps.git`.

## What does this example do?

The example project contains the following files:

* `.azureml\sklearn.runconfig`: The __run configuration__ file. This file defines the runtime environment needed to train the model.
* `train-sklearn.py`: The training script. This file trains the model.
* `mylib.py`: A helper module, used by `train-sklearn.py`.
* `training-env.yml`: Defines the software dependencies needed to run the training script.

The training script uses the diabetes dataset provided with scikit-learn to train a model. Once trained, the model can be registered in your Azure Machine Learning workspace, downloaded locally, or deployed as a web service or to an IoT Edge device.

## Connect to your Azure subscription

There are several ways that you can authenticate to your Azure subscription from the CLI. The most basic is to interactively authenticate using a browser. To authenticate interactively, open a command line or terminal and use the following command:

```azurecli
az login
```

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

For other methods of authenticating, see [Sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

## Install the machine learning extension

To install the machine learning extension, use the following command:

```azurecli-interactive
az extension add -n azure-cli-ml
```

## Create a resource group

A resource group is a basic container of resources on the Azure platform. When working with the Azure Machine Learning service, the resource group will contain your Azure Machine Learning service workspace. It will also contain other Azure services used by the workspace. For example, if you train your model using a cloud-based compute resource, that resource is created in the resource group.

You can use an existing resource group or create a new one. To __create a new resource group__, use the following command. Replace `<resource-group-name>` with the name to use for this resource group. Replace `<location>` with the Azure region to use for this resource group:

> [!TIP]
> You should select a region where the Azure Machine Learning service is available. For information, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service).

```azurecli-interactive
az group create --name <resource-group-name> --location <location>
```

The response from this command is similar to the following JSON:

```json
{
  "id": "/subscriptions/<subscription-GUID>/resourceGroups/<resourcegroupname>",
  "location": "<location>",
  "managedBy": null,
  "name": "<resource-group-name>",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": null
}
```

For more information on working with resource groups, see [az group](https://docs.microsoft.com//cli/azure/group?view=azure-cli-latest).

## Create a workspace

To create a new workspace use the following command. Replace `<workspace-name>` with the name you want to use for this workspace. Replace `<resource-group-name>` with the name of the resource group:

> [!TIP]
> This command creates a workspace and the Azure services it depends on. For information on creating a workspace that uses existing Azure services, see [Create workspaces with the CLI](how-to-manage-workspace-cli.md).

```azurecli-interactive
az ml workspace create -w <workspace-name> -g <resource-group-name>
```

The output of this command is similar to the following JSON:

```json
{
  "applicationInsights": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<application-insight-name>",
  "containerRegistry": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.containerregistry/registries/<acr-name>",
  "creationTime": "2019-08-30T20:24:19.6984254+00:00",
  "description": "",
  "friendlyName": "<workspace-name>",
  "id": "/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>",
  "identityPrincipalId": "<GUID>",
  "identityTenantId": "<GUID>",
  "identityType": "SystemAssigned",
  "keyVault": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.keyvault/vaults/<key-vault-name>",
  "location": "<location>",
  "name": "<workspace-name>",
  "resourceGroup": "<resource-group-name>",
  "storageAccount": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.storage/storageaccounts/<storage-account-name>",
  "type": "Microsoft.MachineLearningServices/workspaces",
  "workspaceid": "<GUID>"
}
```

## Connect local project to workspace

> [!TIP]
> This step is optional. If you do not attach the folder, then you must provide the `-w <workspace-name>` and `-g <resource-group-name>` information to all the other commands after this section.

From a terminal or command prompt, change directories to the `model-training` directory, then use the following command to connect to your workspace:

```azurecli-interactive
az ml folder attach -w <workspace-name> -g <resource-group-name>
```

The output of this command is similar to the following JSON:

```json
{
  "Experiment name": "model-training",
  "Project path": "/Code/MLOps/model-training",
  "Resource group": "<resource-group-name>",
  "Subscription id": "<subscription-id>",
  "Workspace name": "<workspace-name>"
}
```

This command creates a `.azureml/config.json` file, which contains information needed to connect to your workspace.

## Create the compute target for training

This example uses an Azure Machine Learning Compute instance to train the model. To create a new compute instance, use the following command:

```azurecli-interactive
az ml computetarget create amlcompute -n cpu --max-nodes 4 --vm-size Standard_D2_V2
```

The output of this command is similar to the following JSON:

```json
{
  "location": "<location>",
  "name": "cpu",
  "provisioningErrors": null,
  "provisioningState": "Succeeded"
}
```

This command creates a new compute target named `cpu`, with a maximum of 4 nodes. The VM size selected provides a VM with a GPU resource. For information on the VM size, see [VM types and sizes].

> [!TIP]
> When not in use, the VM scales down to 0 nodes to reduce costs.

> [!IMPORTANT]
> The name of the compute target (`cpu` in this case), is important; it is referenced by the `.azureml

## Submit the training run

To start a training run on the `cpu` compute target, use the following command:

```azurecli-interactive
az ml run submit-script -e myexperiment -c sklearn -d training-env.yml -t runoutput.json train-sklearn.py
```

This command specifies a name for the experiment (`myexperiment`). The experiment stores information about this run in the workspace.

The `-c sklearn` parameter specifies the `.azureml/sklearn.runconfig` file. As mentioned earlier, this file contains information used to configure the environment used by the training run. If you inspect this file, you'll see that it references the `cpu` compute target you created earlier. It also lists the number of nodes to use when training (`"nodeCount": "4"`), and contains a `"condaDependenciees"` section that lists the Python packages needed to run the training script.

For more information on run configuration files, see [TBD](TBD).

The `-t` parameter stores a reference to this run in a JSON file, and will be used in the next steps to register and download the model.

As the training run processes, it streams information from the training session on the remote compute resource. Part of the information is similar to the following text:

```text
alpha is 0.00, and mse is 3424.32
alpha is 0.05, and mse is 3408.92
alpha is 0.10, and mse is 3372.65
alpha is 0.15, and mse is 3345.15
alpha is 0.20, and mse is 3325.29
alpha is 0.25, and mse is 3311.56
alpha is 0.30, and mse is 3302.67
alpha is 0.35, and mse is 3297.66
alpha is 0.40, and mse is 3295.74
alpha is 0.45, and mse is 3296.32
alpha is 0.50, and mse is 3298.91
alpha is 0.55, and mse is 3303.14
alpha is 0.60, and mse is 3308.70
alpha is 0.65, and mse is 3315.36
alpha is 0.70, and mse is 3322.90
alpha is 0.75, and mse is 3331.17
alpha is 0.80, and mse is 3340.02
alpha is 0.85, and mse is 3349.36
alpha is 0.90, and mse is 3359.09
alpha is 0.95, and mse is 3369.13


The experiment completed successfully. Finalizing run...
Cleaning up all outstanding Run operations, waiting 300.0 seconds
```

This text is logged from the training script (`train-sklearn.py`) and displays two of the performance metrics for this model. In this case, we want the model with the highest alpha value.

> [!IMPORTANT]
> The performance metrics are specific to the model you are training. Other models will have different performance metrics.

If you inspect the `train-sklearn.py`, you'll notice that it also uses the alpha value when it stores the trained model(s) to file. In this case, it trains several models. The one with the highest alpha should be the best one. Looking at the output above, and the code, the model with an alpha of 0.95 was saved as `./outputs/ridge_0.95.pkl`

```python
model_file_name = 'ridge_{0:.2f}.pkl'.format(alpha)
    # save model in the outputs folder so it automatically get uploaded
    with open(model_file_name, "wb") as file:
        joblib.dump(value=reg, filename=os.path.join('./outputs/',
                                                     model_file_name))
```

> [!IMPORTANT]
> The model was saved to the `./outputs` directory on the compute target where it was trained. In this case, the Azure Machine Learning Compute instance in the Azure cloud. The training process automatically uploads the contents of the `./outputs` directory from the compute target where training occurs to your Azure Machine Learning workspace. It's stored as part of the experiment (`myexperiment` in this example).

## Register the model

To register the model directly from the stored version in your experiment, use the following command:

```azurecli-interactive
az ml model register -n mymodel -f runoutput.json --asset-path "outputs/ridge_0.95.pkl" -t registeredmodel.json
```

This command registers the `outputs/ridge_0.95.pkl` file created by the training run as a new model registration named `mymodel`. The `--assets-path` references a path in an experiment. In this case, the experiment and run information is loaded from the `runoutput.json` file created by the training command. The `-t registeredmodel.json` creates a JSON file that references the new registered model created by this command, and is used by other CLI commands that work with registered models.

The output of this command is similar to the following JSON:

```json
{
  "createdTime": "2019-09-19T15:25:32.411572+00:00",
  "description": "",
  "experimentName": "myexperiment",
  "framework": "Custom",
  "frameworkVersion": null,
  "id": "mymodel:1",
  "name": "mymodel",
  "properties": "",
  "runId": "myexperiment_1568906070_5874522d",
  "tags": "",
  "version": 1
}
```

Note the version number. This is incremented each time you register a new model with this name. For example, you can download the model and register it from a local file by using the following commands:

```azurecli-interactive
az ml model download -i "mymodel:1" -t .
az ml model register -n mymodel -p "ridge_0.95.pkl"
```

The first command downloads the registered model to the current directory. The file name is `ridge_0.95.pkl`, which is the file referenced when you registered the model. The second command registers the local model (`-p "ridge_0.95.pkl"`) with the same name as the previous registration (`mymodel`). This time, the JSON data returned lists the version as 2.

> [!TIP]
> An important concept is that a model registration is not limited to one model. You can specify a directory instead of a file, and the contents of the directory are stored in the model registration.

## Clean up resources




