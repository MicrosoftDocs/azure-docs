# Execution Configuration Files

When you submit a script for Azure ML Workbench to execute either from desktop app or from CLI, the behavior of the execution is controlled by files in the *aml_config* folder under your project folder root. It is important to understand the contents of these files in order to achieve the desired outcome for your execution in an optimal way.

Following are the relevant files under this folder:
- conda_dependencies.yml
- spark_dependencies.yml
- run configuration file pair
    - \<compute context name>.compute
    - \<compute context name>.runconfig


## conda_dependencies.yml
This file is a [conda environment file](https://conda.io/docs/using/envs.html#create-environment-file-by-hand) that specifies the Python runtime version and packages that your code depends on. When Azure ML Workbench executes a script in a Docker container (either locally or in a remote Linux Docker host machine), it will create a [conda environment](https://conda.io/docs/using/envs.html) for your script to run. 

In this file, you can specify Python packages that your script needs for execution. Azure ML Workbench execution service will create the conda environment in the Docker image according to your list of dependencies. This means that the packages list here must be reachable by the execution engine, which typically means they are listed in channels hosted by [continuum.io](https://anaconda.org/conda-forge/repo) and others, or in [PyPI](https://pypi.python.org/pypi), or a publicly accessible endpoint (URL), or a local file path that is reachable by the execution engine.

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

Docker engine in the compute target will cache the image built after the first execution. As long as the *docker_dependencies.yml* remains intact, Azure ML Workbench will use the same image without rebuilding. However, if anything changes in this file, it will cause a rebuild of the Docker image.

>[!NOTE]
>Note this **conda_dependencies.yml** file is **NOT USED** if you target execution against _local_ compute context. You must manually provision package dependencies for your local Azure ML Workbench Python environment.

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
>*spark_dependencies.yml* file is ignored if you are executing the script in Python environment. It only has effect if you are running against Spark (either in Docker or in HDInsight Cluster).

## Run Configuration
To specify a particular run configuration, a pair of files are needed. They are typically generated using a CLI command. But you can also clone exiting ones, rename them, and edit them.

```shell
# create a compute target pointing to a VM via SSH
$ az ml computetarget attach -n <compute context name> -a <IP address or FQDN of VM> -u <username> -w <password> --type remotedocker

# create a compute context pointing to an HDI cluster headnode via SSH
$ az ml computetarget attach -n <compute context name> -a <IP address or FQDN of HDI cluster> -u <username> -w <password> -type cluster
```

This command will create a pair files based on the compute target specified. Let's say you named your compute target _foo_. You will generate _foo.compute_ and _foo.runconfig_ in your *aml_config* folder.

>Note the runconfig name _local_ or _docker_ is arbitrary. Azure ML Workbench adds these two run configurations when you create a blank project for your convenience. You can rename the runconfig files that come with the project template, or create new ones with any name you want.

### foo.compute
_foo.compute_ file specifies connection and configuration information for the compute target. It is a list of name-value pairs. Below are the supported settings.

**type**: Type of compute environment. Supported values are:
  - local
  - virtualmachine
  - cluster

**address**: The IP address, or FQDN (fully qualified domain name) of the virtual machine, or HDInsight cluster headnode.

**username**: The SSH username for accessing the virtual machine or the HDInsight headnode.

**password**: The encrypted password for the SSH connection.

**baseDockerImage**: The Docker image used to run the Python/PySpark script. The default value is _microsoft/mmlspark:0.7_. We also support one other image: _microsoft/mmlspark:gpu_ which gives you GPU access to the host machine (if GPU is present).

**sharedVolumes**: Flag to signal that execution engine should use Docker shared volume feature to ship project files back and forth. Having this turned on can speed up execution since Docker can access projects directly without the need to copy them. But volume sharing for Docker on Windows can be flaky, so it is best to set _false_ if the Docker engine is running on Windows, and set it to _true_ if it is running on macOS or Linux.

**nvidiaDocker**: This flag, when set to _true_, tells the Azure ML Workbench execution service to use _nvidia-docker_ command, as opposed to the regular _docker_ command, to launch the Docker image. The _nvidia-docker_ engine allows the Docker container to access GPU hardware. This is required if you want to run GPU execution in the Docker container. Please note only Linux host supports _nvidia-docker_. For example, Linux based DSVM in Azure ships with _nvidia-docker_ out of the box. _nvidia-docker_ as of now is not supported on Windows.

**nativeSharedDirectory**: This property allows you to specify the base directory (e.g., _~/.azureml/share/_) where files can be saved in order to be shared across runs in the same compute target. Note if this is enabled when running on a Docker container, _sharedVolumes_ must be set to true, otherwise execution will fail.

### foo.runconfig
_foo.runconfig_ specifies the Azure ML Workbench execution behavior, such as whether or not to track the run using the run history service, which compute target to user, etc. The name of the run configuration files are used to populate the execution context dropdown in the Azure ML Workbench desktop app.

**SparkDependenciesFile**: This property points to the file that specifies the Spark dependencies in the *aml_config* folder. If let to the default value of _null_, it points to the default *spark_dependencies.yml* file.

**Framework**: This property specifies if Azure ML Workbench should launch a Spark session to run the script. The default value is _PySpark_. Set it to _Python_ if you are not running PySpark code which can help launching the job quicker with less overhead.

**CondaDependenciesFile**: This property points to the file that specifies the conda environment dependencies in the *aml_config* folder. If set to _null_, it points to the default **conda_dependencies.yml** file.

**PrepareEnvironment**: This property, when set to _true_ (which is the default value), tells the execution service to prepare the conda environment based on the conda dependencies specified. This is effective only when you execute against a Docker environment. This setting has no effect if you are running against a _local_ environment. 

**TrackedRun**: This flag signals the execution service whether or not to track the run in Azure ML Workbench run history infrastructure. The default value is _true_. If you set it to _false_ you can skip run history tracking and achieve some performance gains.

**ArgumentVector**: [To be documented.]

**Target**: This is the name of the _.compute_ file that the _runconfig_ file references. It generally points the _foo.compute_ file but you can edit it to point to a different compute target.
