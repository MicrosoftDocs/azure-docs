---
title: Execution Configuration Files
description: This document details the configuration settings for Azure ML Workbench experiment execution.
services: machine-learning
author: gokhanuluderya-msft
ms.author: gokhanu
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/08/2017
---

# Execution Configuration Files

When you submit a script for Azure Machine Learning (Azure ML) Workbench, the behavior of the execution is controlled by files in the **aml_config** folder. This folder is under your project folder root. It is important to understand the contents of these files in order to achieve the desired outcome for your execution in an optimal way.

Following are the relevant files under this folder:
- conda_dependencies.yml
- spark_dependencies.yml
- run configuration file pairs
    - \<compute context name>.compute
    - \<compute context name>.runconfig


## conda_dependencies.yml
This file is a [conda environment file](https://conda.io/docs/using/envs.html#create-environment-file-by-hand) that specifies the Python runtime version and packages that your code depends on. When Azure ML Workbench executes a script in a Docker container (either locally or in a remote Linux Docker host machine), it creates a [conda environment](https://conda.io/docs/using/envs.html) for your script to run. 

In this file, you specify Python packages that your script needs for execution. Azure ML Workbench execution service creates the conda environment in the Docker image according to your list of dependencies. The packages list here must be reachable by the execution engine. For that reason, packages need to be listed in channels such as:

* [continuum.io](https://anaconda.org/conda-forge/repo)
* [PyPI](https://pypi.python.org/pypi)
* a publicly accessible endpoint (URL)
* or a local file path
* others reachable by the execution engine

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
     
     # a wheel file available locally on disk (this only works if you are executing against local target)
     - C:\temp\my_private_python_pkg.whl
```

Docker engine in the compute target caches the image built after the first execution. Azure ML Workbench uses the same image without rebuilding as long as the **docker_dependencies.yml** remains intact. However, if anything changes in this file, it results in rebuild of the Docker image.

>[!NOTE]
>If you target execution against _local_ compute context, **conda_dependencies.yml** file is **not** used. Package dependencies for your local Azure ML Workbench Python environment need to be installed manually.

## spark_dependencies.yml
This file specifies the Spark application name when you submit a PySpark script and Spark packages that needs to be installed. You can also specify any public Maven repository as well as Spark package that can be found in those Maven repositories.

Here is an example:

```yaml
configuration:
  # Spark application name
  "spark.app.name": "ClassifyingIris"
  
repositories:
  # Maven repository hosted in Azure CDN
  - "https://mmlspark.azureedge.net/maven"
  
  # Maven repository hosted in spark-packages.org
  - "https://spark-packages.org/packages"
  
packages:
  # MMLSpark package hosted in the Azure CDN Maven
  - group: "com.microsoft.ml.spark"
    artifact: "mmlspark_2.11"
    version: "0.5"
    
  # spark-sklearn packaged hosted in the spark-packages.org Maven
  - group: "databricks"
    artifact: "spark-sklearn"
    version: "0.2.0"
```

>[!NOTE]
>If you are executing the script in Python environment, *spark_dependencies.yml* file is ignored. It only has effect if you are running against Spark (either in Docker or in HDInsight Cluster).

## Run Configuration
To specify a particular run configuration, a pair of files is needed. They are typically generated using a CLI command. But you can also clone exiting ones, rename them, and edit them.

```shell
# create a compute target pointing to a VM via SSH
$ az ml computetarget attach -n <compute target name> -a <IP address or FQDN of VM> -u <username> -w <password> --type remotedocker

# create a compute context pointing to an HDI cluster head-node via SSH
$ az ml computetarget attach -n <compute target name> -a <IP address or FQDN of HDI cluster> -u <username> -w <password> -type cluster
```

This command creates a pair files based on the compute target specified. Let's say you named your compute target _foo_. This command generates _foo.compute_ and _foo.runconfig_ in your **aml_config** folder.

>[!NOTE]
> _local_ or _docker_ names for the run configuration files are arbitrary. Azure ML Workbench adds these two run configurations when you create a blank project for your convenience. You can rename the .runconfig files that come with the project template, or create new ones with any name you want.

### <compute target name>.compute
_<compute target name>.compute_ file specifies connection and configuration information for the compute target. It is a list of name-value pairs. Follwing are the supported settings.

**type**: Type of the compute environment. Supported values are:
  - local
  - docker
  - remotedocker
  - cluster

**address**: The IP address, or FQDN (fully qualified domain name) of the virtual machine, or HDInsight cluster head-node.

**username**: The SSH username for accessing the virtual machine or the HDInsight head-node.

**password**: The encrypted password for the SSH connection.

**baseDockerImage**: The Docker image used to run the Python/PySpark script. The default value is _microsoft/mmlspark:0.7_. We also support one other image: _microsoft/mmlspark:gpu_, which gives you GPU access to the host machine (if GPU is present).

**sharedVolumes**: Flag to signal that execution engine should use Docker shared volume feature to ship project files back and forth. Having this flag turned on can speed up execution since Docker can access projects directly without the need to copy them. It is best to set _false_ if the Docker engine is running on Windows since volume sharing for Docker on Windows can be flaky. Set it to _true_ if it is running on macOS or Linux.

**nvidiaDocker**: This flag, when set to _true_, tells the Azure ML Workbench execution service to use _nvidia-docker_ command, as opposed to the regular _docker_ command, to launch the Docker image. The _nvidia-docker_ engine allows the Docker container to access GPU hardware.  setting is required if you want to run GPU execution in the Docker container. Only Linux host supports _nvidia-docker_. For example, Linux-based DSVM in Azure ships with _nvidia-docker_ out of the box. _nvidia-docker_ as of now is not supported on Windows.

**nativeSharedDirectory**: This property specifies the base directory (For example: _~/.azureml/share/_) where files can be saved in order to be shared across runs on the same compute target. If this setting is used when running on a Docker container, _sharedVolumes_ must be set to true. Otherwise, execution fails.

### <run configuration name>.runconfig
_<run configuration name>.runconfig_ specifies the Azure ML Workbench execution behavior. It specifies whether or not to track the run using the run history service, which computes target to user, etc... The names of the run configuration files are used to populate the execution context dropdown in the Azure ML Workbench desktop app.

**SparkDependenciesFile**: This property points to the file that specifies the Spark dependencies in the **aml_config** folder. If let to the default value of _null_, it points to the default **spark_dependencies.yml** file.

**Framework**: This property specifies if Azure ML Workbench should launch a Spark session to run the script. The default value is _PySpark_. Set it to _Python_ if you are not running PySpark code, which can help launching the job quicker with less overhead.

**CondaDependenciesFile**: This property points to the file that specifies the conda environment dependencies in the *aml_config* folder. If set to _null_, it points to the default **conda_dependencies.yml** file.

**PrepareEnvironment**: This property, when set to _true_ (which is the default value), tells the execution service to prepare the conda environment based on the conda dependencies specified. This property is effective only when you execute against a Docker environment. This setting has no effect if you are running against a _local_ environment. 

**TrackedRun**: This flag signals the execution service whether or not to track the run in Azure ML Workbench run history infrastructure. The default value is _true_. If you set it to _false_, you can skip run history tracking and achieve some performance gains.

**ArgumentVector**: This section specifies the script to be run as part of this execution and the parameters for the script. For example, if you have the following snippet in your .runconfig file 

```
 "ArgumentVector":[
  - "myscript.py"
  - 234
  - "-v" 
 ] 
```
_az ml experiment submit foo.runconfig_  automatically runs the command with _myscript.py_ file passing in 234 as a parameter and sets the --verbose flag.


**Target**: This parameter is the name of the _.compute_ file that the _runconfig_ file references. It generally points the _foo.compute_ file but you can edit it to point to a different compute target.
