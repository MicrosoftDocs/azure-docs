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

# Azure Machine Learning Services architecture and key terms 

## Overall achitecture
## [Taxonomy diagram goes here]

## Compute Target
A compute target is the compute resource that you can use to execute your training script or host your web service deployment. The supported compute target includes local computer, remote Linux VM, Azure Batch AI cluster, Apache Spark for HDInsight cluster, Azure Container Instance (ACI), and Azure Kubernetes Service cluster (AKS). A compute target is attached to a Workspace and shared by all authorized users in a Workspace.

## Datastore
Datastore is a storage abstraction associated with a Workspace. It can be backed up by an Azure blob storage container, or an Azure File share. Each Workspace can have one default datastore, and zero or more additional datastores. With Python SDK API, user can easily store and retrieve files in their Python scripts running from within any compute target under the workspace.

## Deployment
A deployment refers to a deployed web service in either ACI or AKS. It is typically created from a Docker image that contains user's model, scoring scripts and other file.

## Estimator
An estimator is a class in Azure ML Python SDK. It is a high-level abstraction of a machine learning model training operation. The supported estimators include the generic estimator, and two special estimators -- TensorFlow estimator and CNTK estimator.

## Image
An image is a Docker image created by Azure ML Image Construction Engine (ICE) and registered with an Azure ML Workspace. It typically encapsulates one or model files, user's scoring script and  library files, schema files, and other dependency Python package files.

## Metrics
Metrics refer to name-value pairs that are logged calling Azure ML Python SDK in user's Python scripts during an execution. The name is typically a string, and the value can be of a single numeric or a string value, or an array of numerics or strings, or a `matplotlib` figure object representing a plotted image.

## Model
A model is a scoring logic operation materialized in one or files. It can be typically produced by a run. But it can also be existing files brought into the system. A model can be registered under a Workspace, and can be version-managed. It can also be used to create image and deployment.

## Project
A project is simply a local folder on user's computer that contains arbitrary files. It is attached to a run history under a Workspace through a configuration file `project.json` under the `aml_config` folder. When submitted for execution, the entire project folder (with some exceptions) is copied into the compute target, and the entry script is executed in a designated Python environment configured through Run Configuration.

## Run
A run is an execution record stored in Azure ML run history service. It typically is consisted of metadata about the run (timestamp, duration etc.), metrics logged by user's script, output files collected by the run history service, and snapshot of the project when the run is produced. A run can have zero or more child runs.

## Run Configuration
A run configuration is a set of instructions that defines how a script should be executed in a given compute target. It includes a wide set of behavior definitions such as whether to directly use an existing Python environment on the compute target, or use a Conda environment built by the system according to specification, whether or not to use a Docker container to execute the script, environment variables to add to the execution environment, Python interpreter path, and many more user settings. A run configuration can be persisted into a file inside the project, or can be constructed as an in-memory object and used to submit a run.

## Run History
A run history is a logical grouping of many runs. It always belongs to a Workspace. An authorized Workspace user can submit a run using an arbitrary run history name, and the submitted run is then listed under that run history.

## Snapshot
When submitting a project run, Azure ML automatically picks up the entire project folder from the user's local computer, compresses it into a ZIP file, ships it to the compute target, expands it and then executes it there. Simultaneously, it creates a run under a specified run history, and stores the ZIP file as a snapshot as part of the run record. Any authorized Workspace user can browse a run record, and download the snapshot.

## Task
A task represents a long running operation, such as provisioning/deprovisioning a compute target, executing a script in a compute target, etc. It can provide notification through SDK or Web UI so user can easily monitor the progress of these operations. 

## Workspace
Azure ML Workspace is an Azure resource, and the logical container of all artifacts created through Azure Machine Learning Services, such as run history, models, images, deployments, etc. It is the security boundary of these artifacts. Multiple users can share a single Workspace under the roles of Owner, Contributor, or Reader. A single user can also create multiple Workspaces, each for a set of users to share their work.
