---
title: Set up compute targets for model training with Azure Machine Learning service | Microsoft Docs
description: This article explains how to configure compute targets on which you can train your machine learning models with Azure Machine Learning service
services: machine-learning
author: gokhanuluderya-msft
ms.author: gokhanu
manager: haining
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/24/2018
---
# How to select and use a compute target to train your model

With the Azure Machine Learning service, you can train your model in several different environments. These environments, called __compute targets__, can be local or in the cloud. In this document, you will learn about the supported compute targets and how to use them.

A compute target is the compute resource used to execute your training script or host your web service deployment. They can be created and managed by using Azure Machine Learning Python SDK or CLI. You can also attach existing compute targets to your workspace in Azure portal. You can start with local runs on your machine, but then follow an easy path for scaling up and out to other environments such as remote Data Science VMs with GPU or Batch AI clusters.

## Supported compute targets

The following is a list of supported compute targets:

* Your local computer
* A Linux virtual machine in Linux. For example, the Data Science Virtual Machine.
* Azure Batch AI
* Azure Container Instance

[TBD - why use one over the other This might be inline in the bulleted list, or it might be better formatted as a table.]

## Workflow

The workflow for developing and deploying a model with Azure Machine Learning generally follows these steps:

1. Develop machine learning training scripts in Python using Jupyter Notebooks, Visual Studio Code, or any other Python development environment of your choice.
1. Provision and configure a compute target, which can be either local or cloud compute resources, to use when training the model.
1. Submit the scripts to the configured compute target to run in that environment.
1. Query the run history for logged metric from the current, and past runs, of your training job. 
2. Once a satisfactory run is found, register the persisted model in the model registry.
3. Deploy the image as a web service in Azure.

## Supported compute targets for training

The supported compute targets for training are: 

* Your local computer
* A Linux VM in Azure (such as the Data Science Virtual Machine)
* Azure Batch AI Cluster
* Azure Container Instance
* Apache Spark for HDInsight

Key differentiators

|Compute target|Local or Remote|
|----|-----|
|Local computer|Local|

You can run your scripts on: 

* Python (3.5.2) environment on your local computer installed by Workbench
* Conda Python environment inside of a Docker container on local computer
* On a Python environment that you own and manage on a remote Linux Machine
* Conda Python environment inside of a Docker container on a remote Linux machine. For example, an [Ubuntu-based DSVM on Azure]
(https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu)
* [HDInsight for Spark](https://azure.microsoft.com/services/hdinsight/apache-spark/) on Azure

>[!IMPORTANT]
>Azure Machine Learning service currently supports Python 3.5.2 and Spark 2.1.11 as Python and Spark runtime versions, respectively. 

>[!IMPORTANT]
> Windows VMs running Docker are **not** supported as remote compute targets.

## Local machine

This is a local machine.

## The Data Science VM

## Azure Batch AI Cluster

## Azure Container Instance

## Apache Spark for HDInsight

## Execution environment
The _execution environment_ defines the run time configuration and the dependencies needed to run the program in Workbench.

You manage the local execution environment using your favorite tools and package managers if you're running on the Workbench default runtime. 

Conda is used to manage local Docker and remote Docker executions as well as HDInsight-based executions. For these compute targets, the execution environment configuration is managed through **Conda_dependencies.yml** and **Spark_dependencies.yml files**. These files are in the **aml_config** folder inside your project.

**Supported runtimes for execution environments are:**
* Python 3.5.2
* Spark 2.1.11

### Run configuration
In addition to the compute target and execution environment, Azure Machine Learning provides a framework to define and change *run configurations*. Different executions of your experiment may require different configuration as part of iterative experimentation. You may be sweeping different parameter ranges, using different data sources, and tuning spark parameters. Experimentation Service provides a framework for managing run configurations.

Running _az ml computetarget attach_ command produces two files in your **aml_config** folder in your project: a ".compute" and  a ".runconfig" following this convention: _<your_computetarget_name>.compute_ and _<your_computetarget_name>.runconfig_. The .runconfig file is automatically created for your convenience when you create a compute target. You can create and manage other run configurations using _az ml runconfigurations_ command in CLI. You can also create and edit them on your file system.

Run configuration in Workbench also enables you to specify environment variables. You can specify environment variables and use them in your code by adding the following section in your .runconfig file. 

```
EnvironmentVariables:
    "EXAMPLE_ENV_VAR1": "Example Value1"
    "EXAMPLE_ENV_VAR2": "Example Value2"
```

These environment variables can be accessed in your code. For example, this phyton code snippet prints the environment variable named "EXAMPLE_ENV_VAR1"
```
print(os.environ.get("EXAMPLE_ENV_VAR1"))
```

## Experiment execution scenarios
In this section, we dive into execution scenarios and learn about how Azure Machine Learning runs experiments, specifically running an experiment locally, on a remote VM, and on an HDInsight Cluster. This section is a walkthrough starting from creating a compute target to executing your experiments.

>[!NOTE]
>For the rest of this article, we are using the CLI (Command-line interface) commands to show the concepts and the capabilities. Capabilities described here can also be used from Workbench.


## Local Docker image
You can also run your projects on a Docker container on your local machine through Experimentation Service. Workbench provides a base Docker image that comes with Azure Machine Learning libraries and as well as Spark 2.1.11 runtime to make local Spark executions easy. Docker needs to be already running on the local machine.

For running your Python or PySpark script on local Docker, you can execute the following commands in CLI.

```
$az ml experiment submit -c docker myscript.py
```
or
```
az ml experiment submit --run-configuration docker myscript.py
```

The execution environment on local Docker is prepared using the Azure Machine Learning base Docker image. Workbench downloads this image when running for the first time and overlays it with packages specified in your conda_dependencies.yml file. This operation makes the initial run slower but subsequent runs are considerably faster thanks to Workbench reusing cached layers. 

>[!IMPORTANT]
>You need to run _az ml experiment prepare -c docker_ command first to prepare the Docker image for your first run. You can also set the **PrepareEnvironment** parameter to true in your docker.runconfig file. This action automatically prepares your environment as part of your run execution.  

>[!NOTE]
>If running a PySpark script on Spark, spark_dependencies.yml is also used in addition to conda_dependencies.yml.

Running your scripts on a Docker image gives you the following benefits:

1. It ensures that your script can be reliably executed in other execution environments. Running on a Docker container helps you discover and avoid any local references that may impact portability. 

2. It allows you to quickly test code on runtimes and frameworks that are complex to install and configure, such as Apache Spark, without having to install them yourself.



## Remote Docker image
In some cases, resources available on your local machine may not be enough to train the desired model. In this situation, Experimentation Service allows an easy way to run your Python or PySpark scripts on more powerful VMs using remote Docker execution. 

Remote VM should satisfy the following requirements:
* Remote VM needs to be running Linux-Ubuntu and should be accessible through SSH. 
* Remote VM needs to have Docker running.

>[!IMPORTANT]
> Windows VMs running Docker is **not** supported as remote compute targets


You can use the following command to create both the compute target definition and run configuration for remote Docker-based executions.

```
az ml computetarget attach remotedocker --name "remotevm" --address "remotevm_IP_address" --username "sshuser" --password "sshpassword" 
```

Once you configure the compute target, you can use the following command to run your script.
```
$ az ml experiment submit -c remotevm myscript.py
```
>[!NOTE]
>Keep in mind that execution environment is configured using the specifications in conda_dependencies.yml. spark_dependencies.yml is also used if PySpark framework is specified in .runconfig file. 

The Docker construction process for remote VMs is exactly the same as the process for local Docker runs so you should expect a similar execution experience.

>[!TIP]
>If you prefer to avoid the latency introduced by building the Docker image for your first run, you can use the following command to prepare the compute target before executing your script. az ml experiment prepare -c remotedocker



## Remote VM 
Experimentation service also supports running a script on user's own Python environment inside a remote Ubuntu virtual machine. This allows you to manage your own environment for execution and still use Azure Machine Learning capabilities. 

Follow the following steps to run your script on your own environment.
* Prepare your Python environment on a remote Ubuntu VM or a DSVM installing your dependencies.
* Install Azure Machine Learning requirements using the following command.

```
pip install -I --index-url https://azuremldownloads.azureedge.net/python-repository/preview --extra-index-url https://pypi.python.org/simple azureml-requirements
```

>[!TIP]
>In some cases, you may need to run this command in sudo mode depending on your privileges. 
```
sudo pip install -I --index-url https://azuremldownloads.azureedge.net/python-repository/preview --extra-index-url https://pypi.python.org/simple azureml-requirements
```
 
* Use the following command to create both the compute target definition and run configuration for user-managed runs on remote VM executions.
```
az ml computetarget attach remote --name "remotevm" --address "remotevm_IP_address" --username "sshuser" --password "sshpassword" 
```
>[!NOTE]
>This will set "userManagedEnvironment" parameter in your .compute configuration file to true.

* Set location of your Python runtime executable in your .compute file. You should refer to the full path of your python executable. 
```
pythonLocation: python3
```

Once you configure the compute target, you can use the following command to run your script.
```
$ az ml experiment submit -c remotevm myscript.py
```

>[!NOTE]
> When you are running on a DSVM, you should use the following commands

If you would like to run directly on DSVM's global python environment, run this command.
```
sudo /anaconda/envs/py35/bin/pip install <package>
```


## HDInsight clusters
HDInsight is a popular platform for big-data analytics supporting Apache Spark. Workbench enables experimentation on big data using HDInsight Spark clusters. 

>[!NOTE]
>The HDInsight cluster must use Azure Blob as the primary storage. Using Azure Data Lake storage is not supported yet.

You can create a compute target and run configuration for an HDInsight Spark cluster using the following command:

```
$ az ml computetarget attach cluster --name "myhdi" --address "<FQDN or IP address>" --username "sshuser" --password "sshpassword"  
```

>[!NOTE]
>If you use FQDN instead of an IP address and your HDI Spark cluster is named _foo_, the SSH endpoint is on the driver node named _foo-ssh.azurehdinsight.net_. Don't forget the **-ssh** postfix in the server name when using FQDN for _--address_ parameter.


Once you have the compute context, you can run the following command to execute your PySpark script.

```
$ az ml experiment submit -c myhdi myscript.py
```

Workbench prepares and manages execution environment on HDInsight cluster using Conda. Configuration is managed by _conda_dependencies.yml_ and _spark_dependencies.yml_ configuration files. 

You need SSH access to the HDInsight cluster in order to execute experiments in this mode. 

>[!NOTE]
>Supported configuration is HDInsight Spark clusters running Linux (Ubuntu with Python/PySpark 3.5.2 and Spark 2.1.11).

## Authentication and compute targets
Azure Machine Learning Workbench allows you to create and use compute targets using SSH Key-based authentication in addition to the username/password-based scheme. You can use this capability when using remotedocker or cluster as your compute target. When you use this scheme, the Workbench creates a public/private key pair and reports back the public key. You append the public key to the ~/.ssh/authorized_keys files for your username. Azure Machine Learning Workbench then uses ssh key-based authentication for accessing and executing on this compute target. Since the private key for the compute target is saved in the key store for the workspace, other users of the workspace can use the compute target the same way by providing the username provided for creating the compute target.  

You follow these steps to use this functionality. 

- Create a compute target using one of the following commands.

```
az ml computetarget attach remotedocker --name "remotevm" --address "remotevm_IP_address" --username "sshuser" --use-azureml-ssh-key
```
or
```
az ml computetarget attach remotedocker --name "remotevm" --address "remotevm_IP_address" --username "sshuser" -k
```
- Append the public key generated by the Workbench to the ~/.ssh/authorized_keys file on the attached compute target. 

>[!IMPORTANT]
>You need to log on the compute target using the same username you used to create the compute target. 

- You can now prepare and use the compute target using SSH key-based authentication.

```
az ml experiment prepare -c remotevm
```

## More info on dependencies
When you run a script in Azure Machine Learning (Azure ML) Workbench, the behavior of the execution is controlled by files in the **aml_config** folder. This folder is under your project folder root. It is important to understand the contents of these files in order to achieve the desired outcome for your execution in an optimal way.

Following are the relevant files under this folder:
- conda_dependencies.yml
- spark_dependencies.yml
- compute target files
    - \<compute target name>.compute
- run configuration files
    - \<run configuration name>.runconfig

>[!NOTE]
>You typically have a compute target file and run configuration file for each compute target you create. However, you can create these files independently and have multiple run configuration files pointing to the same compute target.

### conda_dependencies.yml
This file is a [conda environment file](https://conda.io/docs/using/envs.html#create-environment-file-by-hand) that specifies the Python runtime version and packages that your code depends on. When Azure ML Workbench executes a script in a Docker container or HDInsight cluster, it creates a [conda environment](https://conda.io/docs/using/envs.html) for your script to run on. 

In this file, you specify Python packages that your script needs for execution. Azure ML  Experimentation Service creates the conda environment according to your list of dependencies. Packages listed here must be reachable by the execution engine through channels such as:

* [continuum.io](https://anaconda.org/conda-forge/repo)
* [PyPI](https://pypi.python.org/pypi)
* a publicly accessible endpoint (URL)
* or a local file path
* others reachable by the execution engine

>[!NOTE]
>When running on HDInsight cluster, Azure ML Workbench creates a conda environment for your specific run. This allows different users to run on different python environments on the same cluster.  

Here is an example of a typical **conda_dependencies.yml** file.
```yaml
name: project_environment
dependencies:
  # Python version
  - python=3.5.2
  
  # some conda packages
  - scikit-learn
  - cryptography
  
  # use pip to install some more packages
  - pip:
     # a package in PyPi
     - azure-storage
     
     # a package hosted in a public URL endpoint
     - https://cntk.ai/PythonWheel/CPU-Only/cntk-2.1-cp35-cp35m-win_amd64.whl
     
     # a wheel file available locally on disk (this only works if you are executing against local Docker target)
     - C:\temp\my_private_python_pkg.whl
```

Azure ML Workbench uses the same conda environment without rebuilding it as long as the **conda_dependencies.yml** remains the same. It will rebuild your environment if your dependencies change.

>[!NOTE]
>If you target execution against _local_ compute context, **conda_dependencies.yml** file is **not** used. Package dependencies for your local Azure ML Workbench Python environment need to be installed manually.



## Next steps
* [What is Azure Machine Learning service](overview-what-is-azure-ml.md)
* [Quickstart: Create a workspace with Python](quickstart-get-started.md)
* [Quickstart: Create a workspace with Azure CLI](quickstart-get-started-with-cli.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
