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

## Connect to your Azure subscription.

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

This command creates a `.azureml/config.json` file, which contains information needed to connect to your workspace.

## Create the compute target for training

This example uses an Azure Machine Learning Compute instance to train the model. To create a new compute instance, use the following command:

```azurecli-interactive
az ml computetarget create amlcompute -n cpu --max-nodes 4 --vm-size Standard_NC6
```

This command creates a new compute target named `cpu`, with a maximum of 4 nodes. The VM size selected provides a VM with a GPU resource. For information on the VM size, see [VM types and sizes].

> [!TIP]
> When not in use, the VM scales down to 0 nodes to reduce costs.

> [!IMPORTANT]
> The name of the compute target (`cpu` in this case), is important; it is referenced by the `.azureml

## Submit the training run

az ml run submit-script -e myexperiment -c sklearn -d training-env.yml -t runoutput.json train-sklearn.py
