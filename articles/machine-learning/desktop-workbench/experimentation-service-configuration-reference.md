---
title: Azure Machine Learning Experimentation Service configuration files
description: This document details the configuration settings for Azure ML Experimentation Service.
services: machine-learning
author: gokhanuluderya-msft
ms.author: gokhanu
manager: haining
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/28/2017

ROBOTS: NOINDEX
---

# Azure Machine Learning Experimentation Service configuration files

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

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

## conda_dependencies.yml
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

## spark_dependencies.yml
This file specifies the Spark application name when you submit a PySpark script and Spark packages that need to be installed. You can also specify a public Maven repository as well as Spark packages that can be found in those Maven repositories.

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
>Cluster tuning parameters such as worker size and cores should go into "configuration" section in the spark_dependecies.yml file 

>[!NOTE]
>If you are executing the script in Python environment, *spark_dependencies.yml* file is ignored. It is used only if you are running against Spark (either on Docker or HDInsight Cluster).

## Run configuration
To specify a particular run configuration, you need a .compute file and a .runconfig file. These are typically generated using a CLI command. You can also clone exiting ones, rename them, and edit them.

```azurecli
# create a compute target pointing to a VM via SSH
$ az ml computetarget attach remotedocker -n <compute target name> -a <IP address or FQDN of VM> -u <username> -w <password>

# create a compute context pointing to an HDI cluster head-node via SSH
$ az ml computetarget attach cluster -n <compute target name> -a <IP address or FQDN of HDI cluster> -u <username> -w <password> 
```

This command creates a pair of files based on the compute target specified. Let's say you named your compute target _foo_. This command generates _foo.compute_ and _foo.runconfig_ in your **aml_config** folder.

>[!NOTE]
> _local_ or _docker_ names for the run configuration files are arbitrary. Azure ML Workbench adds these two run configurations when you create a blank project for your convenience. You can rename "<run configuration name>.runconfig" files that come with the project template, or create new ones with any name you want.

### \<compute target name>.compute
_\<compute target name>.compute_ file specifies connection and configuration information for the compute target. It is a list of name-value pairs. Following are the supported settings:

**type**: Type of the compute environment. Supported values are:
  - local
  - remote
  - docker
  - remotedocker
  - cluster

**baseDockerImage**: The Docker image used to run the Python/PySpark script. The default value is _microsoft/mmlspark:plus-0.7.91_. We also support one other image: _microsoft/mmlspark:plus-gpu-0.7.91_, which gives you GPU access to the host machine (if GPU is present).

**address**: The IP address, or FQDN (fully qualified domain name) of the virtual machine, or HDInsight cluster head-node.

**username**: The SSH username for accessing the virtual machine or the HDInsight head-node.

**password**: The encrypted password for the SSH connection.

**sharedVolumes**: Flag to signal that execution engine should use Docker shared volume feature to ship project files back and forth. Having this flag turned on can speed up execution since Docker can access projects directly without the need to copy them. It is best to set _false_ if the Docker engine is running on Windows since volume sharing for Docker on Windows can be flaky. Set it to _true_ if it is running on macOS or Linux.

**nvidiaDocker**: This flag, when set to _true_, tells the Azure ML Experimentation Service to use _nvidia-docker_ command, as opposed to the regular _docker_ command, to launch the Docker image. The _nvidia-docker_ engine allows the Docker container to access GPU hardware. The setting is required if you want to run GPU execution in the Docker container. Only Linux host supports _nvidia-docker_. For example, Linux-based DSVM in Azure ships with _nvidia-docker_. _nvidia-docker_ as of now is not supported on Windows.

**nativeSharedDirectory**: This property specifies the base directory (For example: _~/.azureml/share/_) where files can be saved in order to be shared across runs on the same compute target. If this setting is used when running on a Docker container, _sharedVolumes_ must be set to true. Otherwise, execution fails.

**userManagedEnvironment**: This property specifies whether this compute target is managed by the user directly or managed through experimentation service.  

**pythonLocation**: This property specifies the location of the python runtime to be used on the compute target to execute user's program. 

### \<run configuration name>.runconfig
_\<run configuration name>.runconfig_ specifies the Azure ML experiment execution behavior. You can configure execution behavior such as tracking run history or what compute target to use along with many others. The names of the run configuration files are used to populate the execution context dropdown in the Azure ML Workbench desktop application.

**ArgumentVector**: This section specifies the script to be run as part of this execution and the parameters for the script. For example, if you have the following snippet in your "<run configuration name>.runconfig" file 

```
 "ArgumentVector":[
  - "myscript.py"
  - 234
  - "-v" 
 ] 
```
_"az ml experiment submit foo.runconfig"_  automatically runs the command with _myscript.py_ file passing in 234 as a parameter and sets the --verbose flag.

**Target**: This parameter is the name of the _.compute_ file that the _runconfig_ file references. It generally points the _foo.compute_ file but you can edit it to point to a different compute target.

**Environment Variables**: This section enables users to set environment variables as part of their runs. User can specify environment variables using name-value pairs in the following format:
```
EnvironmentVariables:
  "EXAMPLE_ENV_VAR1": "Example Value1"
  "EXAMPLE_ENV_VAR2": "Example Value2"
```

These environment variables can be accessed in user's code. For example, this Python code prints the environment variable named "EXAMPLE_ENV_VAR"
```
print(os.environ.get("EXAMPLE_ENV_VAR1"))
```

**Framework**: This property specifies if Azure ML Workbench should launch a Spark session to run the script. The default value is _PySpark_. Set it to _Python_ if you are not running PySpark code, which can help launching the job quicker with less overhead.

**CondaDependenciesFile**: This property points to the file that specifies the conda environment dependencies in the *aml_config* folder. If set to _null_, it points to the default **conda_dependencies.yml** file.

**SparkDependenciesFile**: This property points to the file that specifies the Spark dependencies in the **aml_config** folder. It is set to _null_ by default and it points to the default **spark_dependencies.yml** file.

**PrepareEnvironment**: This property, when set to _true_, tells the Experimentation Service to prepare the conda environment based on the conda dependencies specified as part of your initial run. This property is effective only when you execute against a Docker environment. This setting has no effect if you are running against a _local_ environment. 

**TrackedRun**: This flag signals the Experimentation Service whether or not to track the run in Azure ML Workbench run history infrastructure. The default value is _true_. 

**UseSampling**: _UseSampling_ specifies whether the active sample datasets for data sources are used for the run. If set to _false_, data sources ingest and use the full data read from the data store. If set to _true_, active samples are used. Users can use the **DataSourceSettings** to specify which specific sample datasets to use if they want to override the active sample. 

**DataSourceSettings**: This configuration section specifies the data source settings. In this section, user specifies which existing data sample for a particular data source is used as part of the run. 

The following configuration setting specifies that sample named "MySample" is used for the data source named "MyDataSource"
```
DataSourceSettings:
    MyDataSource.dsource:
    Sampling:
    Sample: MySample
```

**DataSourceSubstitutions**: Data source substitutions can be used when the user wants to switch from one data source to another without changing their code. For example, users can switch from a sampled-down, local file to the original, larger dataset stored in Azure Blob by changing the data source reference. When a substitution is used, Azure ML Workbench runs your data sources and data preparation packages by referencing the substitute data source.

The following example replaces the "mylocal.datasource" references in Azure ML data sources and data preparation packages with "myremote.dsource". 
 
```
DataSourceSubstitutions:
    mylocal.dsource: myremote.dsource
```

Based on the substitution above, the following code sample now reads from "myremote.dsource" instead of "mylocal.dsource" without users changing their code.
```
df = datasource.load_datasource('mylocal.dsource')
```
## Next steps
Learn more about [Experimentation Service configuration](experimentation-service-configuration.md).
