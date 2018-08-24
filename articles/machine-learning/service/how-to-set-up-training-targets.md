---
title: Set up compute targets for model training with Azure Machine Learning service | Microsoft Docs
description: This article explains how to configure compute targets on which you can train your machine learning models with Azure Machine Learning service
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
manager: danielsc
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/24/2018
---
# Select and use a compute target to train your model

With the Azure Machine Learning service, you can train your model in several different environments. These environments, called __compute targets__, can be local or in the cloud. In this document, you will learn about the supported compute targets and how to use them.

A compute target is the compute resource used to execute your training script or host your web service deployment. They can be created and managed using the Azure Machine Learning Python SDK or CLI. You can also create and attach existing compute targets to your workspace in the Azure portal. You can start with local runs on your machine, but then follow an easy path for scaling up and out to other environments such as remote Data Science VMs with GPU or Batch AI clusters. 

## Supported compute targets

The following is a list of supported compute targets:

* Your local computer
* Data Science Virtual Machines (DSVM)
* Azure Batch AI clusters
* Linux Based Container instances in Azure Container Instances (ACI)
* HDInsight 

|Compute target|Key differentiators|Support in SDK/CLI | Support in Web Portal| AML Hyper Parameter Optimization| AML Automated Machine Learning| AML Pipelines|
|----|-----|----|----|----|----|----|
|Local computer|Run directly on your own machine.| Y | N| N | Y| N|
|DSVM|Train models on a customized VM image on Microsoft’s Azure cloud built specifically for doing data science.| Create, Attach| Create, Attach | Y | Y| Y|
|Azure Batch AI|Train models at scale across GPU and CPU clusters with multiple CPUs or GPUs per model, running experiments in parallel, and having shared storage for training data, logs, and model outputs.|Create, Attach|Create, Attach|Y|Y | Y| Y|
|Azure Container Instance| Operate in isolated containers without having to manage any virtual machines and with faster startup times. Good for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs.| Create only| N| N| N|N|
|HDInsight| A popular platform for big-data analytics supporting Apache Spark.|Attach only | N| N|N|Y|

## Workflow

The workflow for developing and deploying a model with Azure Machine Learning follows these steps:

1. Develop machine learning training scripts in Python.
1. Create and configure or attach an existing compute target.
1. Submit the training scripts to the compute target.
1. Inspect the run history to find the best model.
1. Register the model in the model registry.
1. Deploy the model.

Your training script isn't tied to a specific compute target. You can train initially on your local computer, then switch targets to a VM or Azure Batch AI without having to rewrite the training script.

## Provision Compute Using the SDK

## Local computer

You can start training an experiment locally on small datasets and then scale up and out as they become more complex and require more compute power. You can run locally through user-managed and system-managed environments. 

### User-Managed Environment
In a user-managed environment, you are responsible for ensuring that all the necessary packages are available in the Python environment you choose to run the script in. 

1. Start by creating a local run config
```python
from azureml.core.runconfig import RunConfiguration

# Editing a run configuration property on-fly.
run_config = RunConfiguration.load(project_object = project, run_config_name = "local")

run_config.environment.python.user_managed_dependencies = True
run_config.prepare_environment = False

# You can choose a specific Python environment by pointing to a Python path 
#run_config.environment.python.interpreter_path = '/home/ninghai/miniconda3/envs/sdk2/bin/pytho
```
2. Submit the script to run in the user-managed environment. The whole project folder is actually submitted for execution.

```python
%%time 
from azureml.core.run import Run

run = Run.submit(project_object = project,
                 run_config = run_config,
                 script_to_run = 'train.py')

# Shows output of the run on stdout.
run.wait_for_completion(show_output = True)
```
### System-Managed Environment
Before submitting to a remote compute target, you will need to create a conda dependencies file with packages you need for the training script to complete. You can then ask the system to build a new conda environment and execute your scripts in it. The environment is built once and can be reused later as long as the conda_dependencies.yml files remains unchanged. You can then submit the experiment the same way as in the local example. Setting up the new environment might take up to 5 minutes the first time the command is run.

```python
from azureml.core.conda_dependencies import CondaDependencies

# Editing a run configuration property on-fly.
run_config = RunConfiguration.load(project_object = project, run_config_name = "local")

# Use a new conda environment that is to be created from the conda_dependencies.yml file
run_config.environment.python.user_managed_dependencies = False

# Automatically create the conda environment before the run
run_config.prepare_environment = True

# add scikit-learn to the conda_dependencies.yml file
cd = CondaDependencies()
cd.add_conda_package('scikit-learn')
cd.save_to_file(project_dir = project_folder, conda_file_path = run_config.environment.python.conda_dependencies_file)
```

## Azure Virtual Machines

In some cases, resources available on your local machine may not be enough to train the desired model. In this situation, You can easily scale up or scale out your machine learning experiment by adding additional compute targets such as Ubuntu-based Data Science Virtual Machines (DSVM).

### Create the Virtual Machine
```python
from azureml.core.compute import DsvmCompute
dsvm_config = DsvmCompute.provisioning_configuration(vm_size="Standard_D2_v2")
dsvm_compute = DsvmCompute.create(ws, name="mydsvm", provisioning_configuration=dsvm_config)
dsvm_compute.wait_for_provisioning(show_output=True)
```
### Configure a Docker run with new conda environment on the VM
You can execute in a Docker container in the VM. If you choose this route, you don't need to install anything on the VM yourself. Azure ML execution service will take care of it for you.

```python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies

# Load the "cpu-dsvm.runconfig" file (created by the above attach operation) in memory
run_config = RunConfiguration(project_object = project, 
                              run_config_name = "cpu-dsvm",
                              target = dsvm_compute.name, 
                              framework = "python")

# Use Docker in the remote VM
run_config.environment.docker.enabled = True

# Use the MMLSpark CPU based image.
# https://hub.docker.com/r/microsoft/mmlspark/
run_config.environment.docker.base_image = azureml.core.runconfig.DEFAULT_CPU_IMAGE
#run_config.environment.docker.base_image = 'microsoft/mmlspark:plus-0.9.9'
print('Base Docker image is:', run_config.environment.docker.base_image )

# Ask system to provision a new one based on the conda_dependencies.yml file
run_config.environment.python.user_managed_dependencies = False

# Prepare the Docker and conda environment automatically when executingfor the first time.
run_config.prepare_environment = True

# create a new CondaDependencies obj
cd = CondaDependencies()

# add scikit-learn as a conda dependency
cd.add_conda_package('scikit-learn')

# overwrite the default conda_dependencies.yml file
cd.save_to_file(project_dir = project_folder, file_name='conda_dependencies.yml')
```

## Azure Batch AI

The following example looks for an existing Batch AI compute, and creates a new one if it is not found. The `compute_target` object can be used to submit your project for training:

```python
# Create a new compute target to train on Azure Batch AI
from azureml.core.compute import ComputeTarget, BatchAiCompute
from azureml.core.compute_target import ComputeTargetException

# Name the Batch AI cluster
batchai_cluster_name = "gpucluster2"

# Try to find an existing compute target in the workspace. If none exists,
#   create a new one.
try:
    compute_target = ComputeTarget(workspace = ws, name = batchai_cluster_name)
    print('found compute target. just use it.')
except ComputeTargetException:
    print('creating a new compute target...')
    provisioning_config = BatchAiCompute.provisioning_configuration(vm_size = "STANDARD_NC6", # NC6 is GPU-enabled
                                                                #vm_priority = 'lowpriority', # optional
                                                                autoscale_enabled = True,
                                                                cluster_min_nodes = 1, 
                                                                cluster_max_nodes = 4)
    # create the cluster
    compute_target = ComputeTarget.create(ws, batchai_cluster_name, provisioning_config)

    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_provisioning(show_output = True, min_node_count = None, timeout_in_minutes = 20)

     # For a more detailed view of current Batch AI cluster status, use the 'status' property    
    print(compute_target.status.serialize())
```

For more information on using the BatchAiCompute object, see [tbd]. 

## Azure Container Instances (ACI)
```python
# Create a new compute target to train on Azure Container Instances (ACI)
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies

# create a new runconfig object
run_config = RunConfiguration(project_object = project, run_config_name = 'my-aci-run-config')

# signal that you want to use ACI to execute script.
run_config.target = "containerinstance"

# ACI container group is only supported in certain regions, which can be different than the region the Workspace is in.
run_config.container_instance.region = 'eastus'

# set the ACI CPU and Memory 
run_config.container_instance.cpu_cores = 1
run_config.container_instance.memory_gb = 2

# enable Docker 
run_config.environment.docker.enabled = True

# set Docker base image to the default CPU-based image
run_config.environment.docker.base_image = azureml.core.runconfig.DEFAULT_CPU_IMAGE
#run_config.environment.docker.base_image = 'microsoft/mmlspark:plus-0.9.9'

# use conda_dependencies.yml to create a conda environment in the Docker image for execution
run_config.environment.python.user_managed_dependencies = False

# auto-prepare the Docker image when used for execution (if it is not already prepared)
run_config.prepare_environment = True

# create a new CondaDependencies obj
cd = CondaDependencies()

# add scikit-learn as a conda dependency
cd.add_conda_package('psutil')
cd.add_conda_package('scikit-learn')

# overwrite the default conda_dependencies.yml file
cd.save_to_file(project_dir = project_folder, conda_file_path = run_config.environment.python.conda_dependencies_file)
```

## Attach an HDI Cluster
HDInsight is a popular platform for big-data analytics supporting Apache Spark. To use an HDI compute target:
- Create a Spark for HDI cluster in Azure following [this](https://docs.microsoft.com/en-us/azure/hdinsight/spark/apache-spark-jupyter-spark-sql) guide.  Make sure you use the Ubuntu version, __NOT__ CentOS.
- Enter the IP address, username and password in the example below
```python
from azureml.core.compute_target import HDIClusterTarget

try:
    # Attaches a HDI cluster as a compute target.
    project.attach_legacy_compute_target(HDIClusterTarget(name = "myhdi",
                                                          address = "<IP Address>", 
                                                          username = "<username>", 
                                                          password = "<pwd>"))
except UserErrorException as e:
    print("Caught = {}".format(e.message))
    print("Compute config already attached.")

# Configure HDI run
# load the runconfig object from the "myhdi.runconfig" file generated by the attach operaton above.
run_config = RunConfiguration.load(project_object = project, run_config_name = 'myhdi')

# ask system to prepare the conda environment automatically when executed for the first time
run_config.prepare_environment = True
```

# Provision Compute Using the CLI
You can also create and attach compute targets from the CLI. You can reference the CLI commands [here](). After you attach your project to the local folder, you can provision compute and submit a training script to the new targets.

## DSVM

- Provision DSVM compute target
```az ml computetarget setup dsvm -n <computetarget name> -w <workspacename> -g <resource-group>```
- Prepare compute by creating a run config (This step can take a few minutes)
```
# create runconfiguration
az ml runconfiguration create -n dsvmrun -t dsvm

# prepare run
#az ml experiment prepare -c dsvm -d aml_config/conda_dependencies.yml
az ml run prepare -c dsvmrun -d aml_config/conda_dependencies.yml
```
- Run experiment against the DSVM
```az ml run submit -c mydsvm train.py -w myws -g myrg```
-View results 
```az ml history last```

## BatchAI
- Provision BatchAI compute target
```az ml computetarget setup batach -n mybaicluster -w <workspace-name> -g <resource-group> --autoscale-enables --autoscale-max-nodes 1 --autoscale-min-nodes 1 -s STANDARD_D2_V2```
- Check the status of deployment
```az ml computetarget show -n mybaicluster -w <workspace-name> -g <resource-group>```
- Create a runconfig file based on this example. Be sure to change the target:
```# The script to run.
script: train.py
# The arguments to the script file.
arguments: []
# The name of the compute target to use for this run.
target: mybaicluster
# Framework to execute inside. Allowed values are "Python" ,  "PySpark", "TensorFlowParameterServer" and "PythonMPI".
framework: Python
# Automatically prepare the run environment as part of the run itself.
prepareEnvironment: true
# Maximum allowed duration for the run.
maxRunDurationSeconds:
# Environment details.
environment:
# Environment variables set for the run.
  environmentVariables:
    EXAMPLE_ENV_VAR: EXAMPLE_VALUE
# Python details.
  python:
# user_managed_dependencies=False indicates that the environment will be user managed. False indicates that AzureML will manage the user environment.
    userManagedDependencies: false
# The python interpreter path
    interpreterPath: python
# Path to conda dependencies file to be used by this run. If a project
# contains multiple programs with different sets of dependencies, it may be
# convenient to manage those environments with separate files.
    condaDependenciesFile: aml_config/conda_dependencies.yml
# Docker details.
  docker:
# Set True to perform this run inside a Docker container.
    enabled: true
# Base image used for Docker-based runs.
    baseImage: continuumio/miniconda3:4.4.10
# Set False if necessary to work around shared volume bugs.
    sharedVolumes: true
# Run with NVidia Docker extension to support GPUs.
    gpuSupport: false
# Extra arguments to the Docker run command.
    arguments: []
# Image registry that contains the base image.
    baseImageRegistry:
# DNS name or IP address of azure container registry(ACR).
      address:
# The username for ACR.
      username:
# The password for ACR.
      password:
# Spark details.
  spark:
# List of spark repositories.
    repositories:
    - https://mmlspark.azureedge.net/maven
    - https://azuremldownloads.blob.core.windows.net/repo5qh91kdjs6
    packages:
    - group: com.microsoft.ml.spark
      artifact: mmlspark_2.11
      version: '0.12'
    - group: com.microsoft
      artifact: dprep_2.11
      version: 0.18.0
    - group: com.microsoft.sqlserver
      artifact: mssql-jdbc
      version: 6.2.1.jre8
    precachePackages: true
# History details.
history:
# Enable history tracking -- this allows status, logs, metrics, and outputs
# to be collected for a run.
  outputCollection: true
# whether to take snapshots for history.
  snapshotProject: true
# Spark configuration details.
spark:
  configuration:
    spark.app.name: Azure ML Experiment
    spark.yarn.maxAppAttempts: 1
# HDI details.
hdi:
# Yarn deploy mode. Options are cluster and client.
  yarnDeployMode: cluster
# BatchAI details.
batchai:
# Number of nodes to use for running batchai jobs.
  nodeCount: 1
# Tensorflow details.
tensorflow:
  workerCount: 2
  parameterServerCount: 1
# Mpi details.
mpi:
  processCountPerNode: 1
# Container instance details.
containerInstance:
# Number of cores to allocate for the container.
  cpuCores: 1
# Memory to allocate for the container in GB.
  memoryGb: 4
# Azure region for the container; defaults to the same as workspace.
  region:
# data reference configuration details
dataReferences: {}
```
- Prepare Compute
```az ml run prepare -c mybaicluster```
- Run experiment against the DSVM
```az ml run submit -c mybaicluster train.py```
-View results 
```az ml history last`

# Provision Compute Using the Web Portal

## Next steps
* [What is Azure Machine Learning service](overview-what-is-azure-ml.md)
* [Quickstart: Create a workspace with Python](quickstart-get-started.md)
* [Quickstart: Create a workspace with Azure CLI](quickstart-get-started-with-cli.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
