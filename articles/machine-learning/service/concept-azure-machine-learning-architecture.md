---
title: How does Azure Machine Learning service work?
description: Learn about the architecture and concepts that make up Azure Machine Learning service. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: haining
author: hning86
ms.date: 09/24/2018

---

# Azure Machine Learning service architecture and concepts

The __Azure Machine Learning workspace__ is the top-level Azure resource for Azure Machine Learning. It's a logical container for all artifacts created by users when using Azure Machine Learning. Each workspace is supported by a list of associated Azure sources including a blob storage account, a KeyVault, an Azure Container Registry, and an Application Insights instance. The workspace is also the security boundary for enabling secured sharing and collaboration among multiple users. 

The following diagram shows the major components of Azure Machine Learning, and illustrates the general workflow when using Azure Machine Learning: 

[![Azure Machine Learning architecture and workflow](./media/concept-azure-machine-learning-architecture/workflow.png)](./media/concept-azure-machine-learning-architecture/workflow.png#lightbox)

The workflow for developing and deploying a model with Azure Machine Learning generally follows these steps:

1. Develop machine learning training scripts in __Python__ using __Jupyter Notebooks__, __Visual Studio Code__, or any other Python development environment of your choice.
2. Provision and configure a __compute target__, which can be either local or cloud compute resources, to use when training the model.
3. Submit the scripts to the configured __compute target__ to run in that environment.
4. Query the __experiment__ for logged metric from the current, and past runs, of your training job. If the metric does not indicate a desired outcome, loop back to step 1 and iterate on your scripts.
5. Once a satisfactory run is found, register the persisted model in the __model registry__.
6. Develop a scoring script.
7. Create an Image and register it in the __image registry__. 
8. Deploy the image as a __web service__ in Azure.


[!INCLUDE [aml-preview-note](../../../includes/aml-preview-note.md)]

> [!NOTE]
> While this document defines terms and concepts used by Azure Machine Learning, it does not define terms and concepts for the Azure platform. For more information on Azure platform terminology, see the [Microsoft Azure glossary](https://docs.microsoft.com/azure/azure-glossary-cloud-terminology).

## Workspace

The workspace provides a list of compute targets that can be used to train your model. It also keeps a history of the training runs, including logs, metrics, output, and a snapshot of your scripts. This information can be used to determine which training run produces the best model.

Once you've determined the best model, you can register it with the workspace. From a registered model, coupled with scoring scripts, you can create an image. The image can then be deployed into Azure Container Instances, Azure Kubernetes Service, or to a field-programmable gate array (FPGA) as a REST-based HTTP endpoint.

You can create multiple workspaces, and each workspace can be shared by multiple people. When sharing a workspace, you can assign the following roles to users:

* Owner
* Contributor
* Reader

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) - Registers docker containers that are used during training and when deploying a model.
* [Azure Storage](https://azure.microsoft.com/services/storage/) - Used as the default datastore for the workspace.
* [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) - Stores monitoring information about your models.
* [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) - Stores secrets used by compute targets and other sensitive information needed by the workspace.

> [!NOTE]
> Instead of creating new versions, you can also use existing Azure services. 

The following diagram is a taxonomy of the workspace:

[![Workspace taxonomy](./media/concept-azure-machine-learning-architecture/taxonomy.png)](./media/concept-azure-machine-learning-architecture/taxonomy.png#lightbox)

## Scripts

To train a model, you specify the directory that contains the training script and associated files. You also specify an experiment name, which is used to store information gathered during training. During training, the entire directory is copied to the training environment (compute target), and the script specified by the __run configuration__ is started. A snapshot of the directory is also stored under the experiment in the workspace.

For an example of using scripts to train a model, see [Create a workspace with Python](quickstart-get-started.md)

## Model

A model is a logic operation, stored in one or more files. It is used to score input data. For example, an image classification model would take an image as input and return a value indicating whether the image contains a dog or a cat. A model can be produced by a run in Azure Machine Learning. You can also use a model trained outside of Azure Machine Learning. A model can be registered under a Workspace, and can be version-managed. It is used to create an image and deployment. 

Azure Machine Learning is framework agnostic. You can use any popular machine learning framework, including scikit-learn, xgboost, PyTorch, TensorFlow, Chainer, and CNTK.

## Image

We use images to group all the assets for your deployment. For example, when deploying to Azure Kubernetes Service, a Docker image is created from your scripts and registered with the workspace. Images encapsulate the following items:

* A model file, or a directory of model files
* A scoring script or application for device deployments
* Any number of supporting library files (optional)
* A Conda environment file listing Python package dependencies (optional)
* Schema files for swagger generation (optional)

## Deployment

A deployment is an instantiation of your image into either a Web Service that may be hosted in the cloud or and IoT Module for integrated device deployments. 

### Web Services

A deployed web service can use Azure Container Instances, Azure Kubernetes Service, or field-programmable gate arrays (FPGA).
The service is created from an image that encapsulates your model, script, and associated files. The image has an HTTP Load balanced endpoint to send scoring request to.

Azure helps you monitor your Web service deployment by collecting Application Insight telemetry and/or model telemetry if you have chosen to enable this feature. The telemetry data is only accessible to you, and stored in your Application Insights and storage account instances.

If you have enabled automatic scaling, Azure will automatically scale your deployment.

### IoT Modules

A deployed IoT Module is a Docker container that includes your model and associated script or application and any additional dependencies. These modules are deployed using Azure IoT Edge on edge devices. 

If you have enabled monitoring, Azure collects telemetry data from the model inside the Azure IoT Edge module. The telemetry data is only accessible to you, and stored in your storage account instance.

Azure IoT Edge will ensure that your module is running and monitor the device that is hosting it.

## Datastore

A datastore is a storage abstraction over an Azure Storage Account. The datastore can use either an Azure blob container or an Azure file share as the backend storage. Each workspace has a default datastore, and you may register additional datastores. 

You can use the Python SDK API or Azure Machine Learning CLI to store and retrieve files from the datastore. 

## Run
A run is an execution record stored in an experiment under a workspace.
It contains the following information:

* Metadata about the run (timestamp, duration etc.)
* Metrics logged by your script
* Output files auto-collected by the experiment, or explicitly uploaded by you.
* A snapshot of the directory that contains your scripts, prior to the run is executed

A run can have zero or more child runs.

## Experiment

An experiment is a logical grouping of many runs executed from a given script. It always belongs to a workspace. You can submit a run using an arbitrary experiment name, and the submitted run is then listed under that experiment.

## Run configuration

A run configuration is a set of instructions that defines how a script should be executed in a given compute target. It includes a wide set of behavior definitions, such as whether to use an existing Python environment or use a Conda environment built from specification.

A run configuration can be persisted into a file inside the directory that contains your training script, or can be constructed as an in-memory object and used to submit a run.

## Compute target

A compute target is the compute resource used to execute your training script or host your web service deployment. They can be created and managed by using Azure Machine Learning Python SDK or CLI. You can also attach existing compute targeted in Azure. The supported compute targets are: 

* Your local computer
* A Linux VM in Azure (such as the Data Science Virtual Machine)
* Azure Batch AI Cluster
* Apache Spark for HDInsight
* Azure Container Instance
* Azure Kubernetes Service

Compute targets are attached to a workspace. Computer targets other than the local machine are shared by users of the workspace.

## Metrics

When developing your solution, you can use the Azure Machine Learning Python SDK in your Python script to log any arbitrary metrics information. Post execution, you can query the metrics to determine if the run produces the model you want to deploy. 

## Snapshots

When submitting a training run, Azure Machine Learning compresses the directory that contains the script as a zip file and sends it to the compute target. The zip is then expanded and the script is executed there. Azure Machine Learning also stores the zip file as a snapshot as part of the run record. Anyone with access to the workspace can browse a run record and download the snapshot.

## Task

A task represents a long running operation. The following operations are examples of tasks:

* Creating or deleting a compute target
* Executing a script on a compute target

Tasks can provide notifications through the SDK or Web UI so you can easily monitor the progress of these operations.

## Next steps

You can get started using Azure Machine Learning:

* [What is Azure Machine Learning service](overview-what-is-azure-ml.md)
* [Quickstart: Create a workspace with Python](quickstart-get-started.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
