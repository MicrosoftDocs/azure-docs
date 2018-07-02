---
title: How does Azure Machine Learning services work?
description: Learn about the architecture and concepts that make up Azure Machine Learning Services. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: haining
author: hning86
ms.date: 06/18/2018

---

# Azure Machine Learning Services architecture and concepts

The __Azure Machine Learning workspace__ is the top-level resource for Azure Machine Learning.
It's a logical container for artifacts used by Azure Machine Learning.
In addition to resources in the Azure cloud, it also references things from your local development environment.
For example, files on your development environment can be used to create a __project__ in a workspace.
The workspace also defines your local develoment environment as one of the __compute targets__ for training a model.
 

The following diagram shows the major components of Azure Machine Learning, and illustrates the general workflow when using Azure Machine Learning: 

![Azure Machine Learning architecture and workflow](./media/concept-azure-machine-learning-architecture/workflow.png)

The workflow for developing and deploying a model with Azure Machine Learning follows these steps:

1. Develop machine learning training scripts in __Python scripts__ or __Jupyter Notebooks__.
2. Configure a __local__ or __cloud__ environment (__compute target__) to use when training the model.
3. Submit the scripts to __run__ in that environment.
4. Examine the __run history__ for information about this run of your training scripts.
    If the model does not perform as desired, loop back to step 1 and itereate on your scripts.
5. Register the model in the __model registry__.
6. Deploy the model and the scoring scripts as a __web service__ in Azure.


## Workspace

The workspace provides a list of environments (compute targets) that can be used to train your model.
It also keeps a history of the training runs, including logs, metrics, output, and a snapshot of your project.
These can be used to determine which version of the model is the best.

Once you've determined the best model, you can register it with the workspace.
This creates a Docker image, which can be used to deploy the model as a web service.
The web service is hosted on Azure Container Instances or Azure Kubernetes Service.

You can create multiple workspaces, and each workspace can be shared by multiple people.
When sharing a workspace, you can assign the following roles to users:

* Owner
* Contributor
* Reader

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

* [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)
* [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) - Used as the default datastore for the workspace.
* [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/)
* [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)

The following diagram is a taxonomy of the workspace:

![Workspace taxonomy](./media/concept-azure-machine-learning-architecture/taxonomy.png)

## Project

A project is a folder that contains the files for your machine learning solution.
To use a local folder with Azure Machine Learning Services, you must attach it to a workspace.
For an example of how to attach a project to a workspace, see one of the following documents:

* [Create a workspace with Python TBD]()
* [Create a workspace with Azure CLI TBD]()

When you submit a project for training, the folder is copied to the compute target.
The entry script is ran in the Python environment configured through the __run configuration__.

## Model

A model is a scoring logic operation materialized in one or more files.
A model can be produced by a run in Azure Machine Learning.
You can also use a model trained outside of Azure Machine Learning.
A model can be registered under a Workspace, and can be version-managed.
It can also be used to create a Docker image and deployment.

## Docker image

A Docker image is created from your project, and registered with the workspace.
It encapsulates:

* One or model files
* Your scoring script
* Library files
* Schema files
* Other dependency files

## Deployment

A deployment is a deployed web service in either Azure Container Instances or Azure Kubernetes Service.
It is created from a Docker image that encapsulates your model, script, and associated files.

## Datastore

A datastore is a storage abstraction over an Azure Storage Account.
The datastore can use an Azure blob container or Azure file share as the implementation.
Each workspace has a default datastore, and may have additional datastores.
For information on using additional datastores, see [TBD]().

You can use the Python SDK API to store and retrieve files from the datastore.
For more information, see [TBD]().

## Run

A __run__ is an execution record stored in the run history of a workgroup.
It contains the following information:

* Metadata about the run (timestamp, duration etc.)
* Metrics logged by your script
* Output files collected by the run history service
* A snapshot of the project when the run is produced

A run can have zero or more child runs.

## Run history

A __run history__ is a logical grouping of many runs.
It always belongs to a workspace.
You can submit a run using an arbitrary run history name, and the submitted run is then listed under that run history.

## Run configuration

A run configuration is a set of instructions that defines how a script should be executed in a given compute target.
It includes a wide set of behavior definitions, such as whether to use an existing Python environment or use a Conda environment built from specification.

A run configuration can be persisted into a file inside your project, or can be constructed as an in-memory object and used to submit a run.

## Compute target

A compute target is the service or environment used to execute your training script or host your web service deployment.
The supported compute targets are:

* Your local computer
* A Linux VM in Azure (such as the Data Science Virtual Machine)
* Azure Batch AI
* Apache Spark for HDInsight
* Azure Container Instance
* Azure Kubernetes Service

Compute targets are attached to a workspace.
Computer targets other than the local machine are shared by users of the workspace.

## Metrics

When developing your solution, you can use the Azure Machine Learning Python SDK in your Python script to log metrics information.
You can provide name-value pairs, where the name is a string and the value is one of the following items:

* String
* Number
* Array of strings or numbers
* `matplotlib` figure object representing a plotted image.

## Snapshots

When submitting a project run, Azure Machine Learning compresses the project folder as a zip file and sends it to the compute target.
The project is then expanded and executed there.
Azure Machine Learning also stores the zip file as a snapshot as part of the run record.
Anyone with access to the workspace can browse a run record and download the snapshot.

## Task

A task represents a long running operation.
The following operations are examples of tasks:

* Creating or deleting a compute target
* Executing a script on a compute target

Tasks can provide notifications through the SDK or Web UI so you can easily monitor the progress of these operations.
