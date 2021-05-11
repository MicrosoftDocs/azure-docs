---
title: Create and manage resources VS Code Extension (preview)
titleSuffix: Azure Machine Learning
description: Learn how to create and manage Azure Machine Learning resources using the Azure Machine Learning Visual Studio Code extension.
services: machine-learning
author: luisquintanilla
ms.author: luquinta
ms.reviewer: luquinta
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 05/10/2021
---

# Manage Azure Machine Learning resources with the VS Code Extension(preview)

Learn how to manage Azure Machine Learning resources with the VS Code extension.

![Azure Machine Learning VS Code Extension](media/how-to-manage-resources-vscode/azure-machine-learning-vscode-extension.png)

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
- Visual Studio Code. If you don't have it, [install it](https://code.visualstudio.com/docs/setup/setup-overview).
- VS Code Azure Machine Learning Extension. Follow the [Azure Machine Learning VS Code extension installation guide](how-to-setup-vs-code.md) to set up the extension.

## Create resources

The quickest way to create resources is using the extension's toolbar.

1. Open the Azure Machine Learning view.
1. Select **+** in the extension toolbar.
1. Choose your resource from the dropdown list.
1. Configure the resource template. The information required depends on the type of resource you want to create.
1. Save the resource template
1. Right-click the template file and select **Azure ML: Create Resource**.

Alternatively, you can create a resource by using the command palette:

1. Open the command palette **View > Command Palette**
1. Enter **> Azure ML: Create <RESOURCE-TYPE>** into the text box. Replace `RESOURCE-TYPE` with the type of resource you want to create.
1. Configure the resource template.
1. Save the resource template.
1. Open the command palette **View > Command Palette**
1. Enter **> Azure ML: Create Resource** into the text box.

## Workspaces

For more information, see [workspaces](concept-workspace.md).

### Create a workspace

1. In the Azure Machine Learning view, right-click your subscription node and select **Create Workspace**.
1. A resource template appears. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

### Remove workspace

1. Expand the subscription node that contains your workspace.
1. Right-click the workspace you want to remove.
1. Select whether you want to remove:
    - *Only the workspace*: This option deletes **only** the workspace Azure resource. The resource group, storage accounts, and any other resources the workspace was attached to are still in Azure.
    - *With associated resources*: This option deletes the workspace **and** all resources associated with it.

Alternatively, use the **> Azure ML: Remove Workspace** command in the command palette.

## Datastores

The Visual Studio Code extension currently supports datastores of the following types:

- Azure Blob
- Azure Data Lake Gen 1
- Azure Data Lake Gen 2
- Azure File

### Create a datastore

1. Expand the subscription node that contains your workspace.
1. Expand the workspace node you want to create the datastore under.
1. Right-click the **Datastores** node and select **Create Datastore**.
1. Choose the datastore type.
1. A resource template appears. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

### Manage a datastore

1. Expand the subscription node that contains your workspace.
1. Expand your workspace node.
1. Expand the **Datastores** node inside your workspace.
1. Right-click the datastore you want to:
    - *Set Default Datastore*. Whenever you run experiments, this is the datastore that will be used.
    - *Unregister Datastore*. Removes datastore from your workspace.
    - *Update credentials*. Change the authentication type and credentials. Supported authentication types include account key and SAS token.
    - *View Datastore*. Display read-only datastore settings

## Datasets

### Create dataset

1. Expand the subscription node that contains your workspace.
1. Expand the workspace node you want to create the datastore under.
1. Right-click the **Datasets** node and select **Create Dataset**.
1. A resource template appears. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

### Manage a dataset

1. Expand the subscription node that contains your workspace.
1. Expand your workspace node.
1. Expand the **Datasets** node.
1. Right-click the dataset you want to:
    - **View Dataset Properties**. Lets you view metadata associated with a specific dataset.
    > [!NOTE]
    > If you have multiple version of your dataset, you can choose to only view the dataset properties of a specific version by expanding the dataset node and performing the same steps described in this section on the version of interest.
    - Preview dataset. This option is only available for tabular datasets.
    - **Unregister dataset**. Removes a dataset and all versions of it from your workspace.

## Environments

For more information, see [environments](concept-environments.md).

### Create environment

1. Expand the subscription node that contains your workspace.
1. Expand the workspace node you want to create the datastore under.
1. Right-click the **Environments** node and select **Create Environment**.
1. A resource template appears. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

### View environment configurations

To view the dependencies and configurations for a specific environment in the extension:

1. Expand the subscription node that contains your workspace.
1. Expand your workspace node.
1. Expand the **Environments** node.
1. Right-click the environment you want to view and select **View Environment**.

### Edit environment configurations

To edit the dependencies and configurations for a specific environment in the extension:

1. Expand the subscription node that contains your workspace.
1. Expand the **Environments** node inside your workspace.
1. Right-click the environment you want to edit and select **Edit Environment**.
1. After making the modifications, if you're satisfied with your configuration, select **Save and continue** or open the VS Code command palette (**View > Command Palette**) and type **Azure ML: Save and Continue**.

## Experiments

For more information, see [experiments](concept-azure-machine-learning-architecture.md#experiments).

### Create experiment

1. Expand the subscription node that contains your workspace.
1. Expand your workspace node.
1. Right-click the **Experiments** node in your workspace and select **Create Job**.
1. Choose your job type.
1. A resource template appears. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

### Run Experiment

1. Expand the subscription node that contains your workspace.
1. Expand the **Experiments** node inside your workspace.
1. Right-click the experiment you want to run.
1. Select the **Run Experiment** icon in the activity bar.
1. Select **Job Configuration Template** from the list of options.
1. Configure the job configuration template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

Alternatively, using the command palette, use the **Azure ML: Create Resource** command.

### View experiment

To view your experiment in Azure Machine Learning Studio:

1. Expand the subscription node that contains your workspace.
1. Expand the **Experiments** node inside your workspace.
1. Right-click the experiment you want to view and select **View Experiment**. 
1. A prompt appears asking you to open the experiment URL in Azure Machine Learning studio. Select **Open**.

### Track run progress

As you're running your experiment, you may want to see its progress. To track the progress of a run in Azure Machine Learning studio from the extension:

1. Expand the subscription node that contains your workspace.
1. Expand the **Experiments** node inside your workspace.
1. Expand the experiment node you want to track progress for.
1. Right-click the run and select **View Run in Azure portal**.
1. A prompt appears asking you to open the run URL in Azure Machine Learning studio. Select **Open**.

### Download run logs & outputs

Once a run is complete, you may want to download the logs and assets such as the model generated as part of an experiment run.

1. Expand the subscription node that contains your workspace.
1. Expand the **Experiments** node inside your workspace.
1. Expand the experiment node you want to track progress for.
1. Right-click the run:
    - To download the outputs, select **Download outputs**.
    - To download the logs, select **Download logs**.

## Compute instances

### Create compute instance

1. Expand the subscription node that contains your workspace.
1. Expand your workspace node.
1. Right-click the **Compute instances** node in your workspace and select **Create Job**.
1. Choose your job type.
1. A resource template appears. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.

### Connect to compute instance

To use a compute instance as a full development environment or Jupyter server, see [Connect to a compute instance][https://docs.microsoft.com/en-us/azure/machine-learning/how-to-set-up-vs-code-remote?tabs=extension].

### Stop or restart compute instance

1. Expand the subscription node that contains your workspace.
1. Expand the **Compute instances** node inside your workspace.
1. Right-click the compute instance you want to stop or restart and select **Stop Compute instance** or **Restart Compute instance** respectively.

### View compute instance configuration

1. Expand the subscription node that contains your workspace.
1. Expand the **Compute instances** node inside your workspace.
1. Right-click the compute instance you want to inspect and select **View Compute instance Properties**.

### Delete compute instance

1. Expand the subscription node that contains your workspace.
1. Expand the **Compute instances** node inside your workspace.
1. Right-click the compute instance you want to delete and select **Delete Compute instance**.

Alternatively, use the `Azure ML: Delete Compute instance` command in the command palette and follow the prompts to delete your compute instance.

## Compute clusters

For more information, see [compute targets](concept-compute-target.md#train).

### View compute configuration

1. Expand the subscription node that contains your workspace.
1. Expand the **Compute clusters** node inside your workspace.
1. Right-click the compute you want to view and select **View Compute Properties**.

### Delete compute cluster

1. Expand the subscription node that contains your workspace.
1. Expand the **Compute clusters** node inside your workspace.
1. Right-click the compute you want to delete and select **Remove Compute**.

## Attached Compute

TODO

## Inference Clusters

TODO

## Models

For more information, see [models](concept-azure-machine-learning-architecture.md#models)

### View model properties

1. Expand the subscription node that contains your workspace.
1. Expand the **Models** node inside your workspace.
1. Right-click the model whose properties you want to see and select **View Model Properties**. A file opens in the editor containing your model properties.

### Download model

1. Expand the subscription node that contains your workspace.
1. Expand the **Models** node inside your workspace.
1. Right-click the model you want to download and select **Download Model File**.

### Delete a model

1. Expand the subscription node that contains your workspace.
1. Expand the **Models** node inside your workspace.
1. Right-click the model you want to delete and select **Remove Model**.

## Endpoints

For more information, see [web service endpoints](concept-azure-machine-learning-architecture.md#web-service-endpoint).

### Delete deployments

1. Expand the subscription node that contains your workspace.
1. Expand the **Endpoints** node inside your workspace.
1. Right-click the deployment you want to remove and select **Remove service**.
1. A prompt appears confirming you want to remove the service. Select **Ok**.

### Manage deployments

In addition to creating and deleting deployments, you can view and edit settings associated with the deployment.

1. Expand the subscription node that contains your workspace.
1. Expand the **Endpoints** node inside your workspace.
1. Right-click the deployment you want to manage:
    - To edit settings, select **Edit service**.
        - A configuration file for your deployment appears in the editor. If you're satisfied with your configuration, select **Save and continue** or open the VS Code command palette (**View > Command Palette**) and type **Azure ML: Save and Continue**.
    - To view deployment configuration settings, select **View service properties**.

## Next steps

[Train an image classification model](tutorial-train-deploy-image-classification-model-vscode.md) with the VS Code extension.