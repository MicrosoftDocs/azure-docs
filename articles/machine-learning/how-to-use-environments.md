---
title: Use software environments 
titleSuffix: Azure Machine Learning
description: Create and manage environments for model training and deployment. Manage Python packages and other settings for the environment.
services: machine-learning
author: saachigopal
ms.author: sagopal
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.date: 07/23/2020
ms.topic: how-to
ms.custom: devx-track-python

## As a developer, I need to configure my experiment context with the necessary software packages so my machine learning models can be trained and deployed on different compute targets.

---

# Create & use software environments in Azure Machine Learning


In this article, learn how to create and manage Azure Machine Learning [environments](/python/api/azureml-core/azureml.core.environment.environment). Use the environments to track and reproduce your projects' software dependencies as they evolve.

Software dependency management is a common task for developers. You want to ensure that builds are reproducible without extensive manual software configuration. The Azure Machine Learning `Environment` class accounts for local development solutions such as pip and Conda and distributed cloud development through Docker capabilities.

The examples in this article show how to:

* Create an environment and specify package dependencies.
* Retrieve and update environments.
* Use an environment for training.
* Use an environment for web service deployment.

For a high-level overview of how environments work in Azure Machine Learning, see [What are ML environments?](concept-environments.md) For information about configuring development environments, see [here](how-to-configure-environment.md).

## Prerequisites

* The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install) (>= 1.13.0)
* An [Azure Machine Learning workspace](how-to-manage-workspace.md)

## Create an environment

The following sections explore the multiple ways that you can create an environment for your experiments.

### Instantiate an environment object

To manually create an environment, import the `Environment` class from the SDK. Then use the following code to instantiate an environment object.

```python
from azureml.core.environment import Environment
Environment(name="myenv")
```

### Use a curated environment

Curated environments contain collections of Python packages and are available in your workspace by default. These environments are backed by cached Docker images which reduces the run preparation cost. You can select one of these popular curated environments to start with: 

* The _AzureML-Minimal_ environment contains a minimal set of packages to enable run tracking and asset uploading. You can use it as a starting point for your own environment.

* The _AzureML-Tutorial_ environment contains common data science packages. These packages include Scikit-Learn, Pandas, Matplotlib, and a larger set of azureml-sdk packages.

For a list of curated environments, see the [curated environments article](resource-curated-environments.md).

Use the `Environment.get` method to select one of the curated environments:

```python
from azureml.core import Workspace, Environment

ws = Workspace.from_config()
env = Environment.get(workspace=ws, name="AzureML-Minimal")
```

You can list the curated environments and their packages by using the following code:

```python
envs = Environment.list(workspace=ws)

for env in envs:
    if env.startswith("AzureML"):
        print("Name",env)
        print("packages", envs[env].python.conda_dependencies.serialize_to_string())
```

> [!WARNING]
>  Don't start your own environment name with the _AzureML_ prefix. This prefix is reserved for curated environments.

### Use Conda dependencies or pip requirements files

You can create an environment from a Conda specification or a pip requirements file. Use the [`from_conda_specification()`](/python/api/azureml-core/azureml.core.environment.environment#from-conda-specification-name--file-path-) method or the [`from_pip_requirements()`](/python/api/azureml-core/azureml.core.environment.environment#from-pip-requirements-name--file-path-) method. In the method argument, include your environment name and the file path of the file that you want. 

```python
# From a Conda specification file
myenv = Environment.from_conda_specification(name = "myenv",
                                             file_path = "path-to-conda-specification-file")

# From a pip requirements file
myenv = Environment.from_pip_requirements(name = "myenv",
                                          file_path = "path-to-pip-requirements-file")                                          
```

### Enable Docker

When you enable Docker, Azure Machine Learning builds a Docker image and creates a Python environment within that container, given your specifications. The Docker images are cached and reused: the first run in a new environment typically takes longer as the image is build.

The [`DockerSection`](/python/api/azureml-core/azureml.core.environment.dockersection) of the Azure Machine Learning `Environment` class allows you to finely customize and control the guest operating system on which you run your training. The `arguments` variable can be used to specify extra arguments to pass to the Docker run command.

```python
# Creates the environment inside a Docker container.
myenv.docker.enabled = True
```

By default, the newly built Docker image appears in the container registry that's associated with the workspace.  The repository name has the form *azureml/azureml_\<uuid\>*. The unique identifier (*uuid*) part of the name corresponds to a hash that's computed from the environment configuration. This correspondence allows the service to determine whether an image for the given environment already exists for reuse.

#### Use a prebuilt Docker image

By default, the service automatically uses one of the Ubuntu Linux-based [base images](https://github.com/Azure/AzureML-Containers), specifically the one defined by `azureml.core.environment.DEFAULT_CPU_IMAGE`. It then installs any specified Python packages defined by the provided Azure ML environment. Other Azure ML CPU and GPU base images are available in the container [repository](https://github.com/Azure/AzureML-Containers). It is also possible to use a [custom Docker base image](./how-to-deploy-custom-docker-image.md#create-a-custom-base-image).

```python
# Specify custom Docker base image and registry, if you don't want to use the defaults
myenv.docker.base_image="your_base-image"
myenv.docker.base_image_registry="your_registry_location"
```

>[!IMPORTANT]
> Azure Machine Learning only supports Docker images that provide the following software:
> * Ubuntu 16.04 or greater.
> * Conda 4.5.# or greater.
> * Python 3.6+.

#### Use your own Dockerfile 

You can also specify a custom Dockerfile. It's simplest to start from one of Azure Machine Learning base images using Docker ```FROM``` command, and then add your own custom steps. Use this approach if you need to install non-Python packages as dependencies. Remember to set the base image to None.

Please note that Python is an implicit dependency in Azure Machine Learning so a custom dockerfile must have Python installed.

```python
# Specify docker steps as a string. 
dockerfile = r"""
FROM mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04
RUN echo "Hello from custom container!"
"""

# Set base image to None, because the image is defined by dockerfile.
myenv.docker.base_image = None
myenv.docker.base_dockerfile = dockerfile

# Alternatively, load the string from a file.
myenv.docker.base_image = None
myenv.docker.base_dockerfile = "./Dockerfile"
```

When using custom Docker images, it is recommended that you pin package versions in order to better ensure reproducibility.

#### Specify your own Python interpreter

In some situations, your custom base image may already contain a Python environment with packages that you want to use.

To use your own installed packages and disable Conda, set the parameter `Environment.python.user_managed_dependencies = True`. Ensure that the base image contains a Python interpreter, and has the packages your training script needs.

For example, to run in a base Miniconda environment that has NumPy package installed, first specify a Dockerfile with a step to install the package. Then set the user-managed dependencies to `True`. 

You can also specify a path to a specific Python interpreter within the image, by setting the `Environment.python.interpreter_path` variable.

```python
dockerfile = """
FROM mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04
RUN conda install numpy
"""

myenv.docker.base_image = None
myenv.docker.base_dockerfile = dockerfile
myenv.python.user_managed_dependencies=True
myenv.python.interpreter_path = "/opt/miniconda/bin/python"
```

> [!WARNING]
> If you install some Python dependencies in your Docker image and forget to set `user_managed_dependencies=True`, those packages will not exist in the execution environment thus causing runtime failures. By default, Azure ML will build a Conda environment with dependencies you specified, and will execute the run in that environment instead of using any Python libraries that you installed on the base image.

#### Retrieve image details

For a registered environment, you can retrieve image details using the following code where `details` is an instance of [DockerImageDetails](/python/api/azureml-core/azureml.core.environment.dockerimagedetails) (AzureML Python SDK >= 1.11) and provides all the information about the environment image such as the dockerfile, registry, and image name.

```python
details = environment.get_image_details(workspace=ws)
```

To obtain the image details from an environment autosaved from the execution of a run, use the following code:

```python
details = run.get_environment().get_image_details(workspace=ws)
```

### Use existing environments

If you have an existing Conda environment on your local computer, then you can use the service to create an environment object. By using this strategy, you can reuse your local interactive environment on remote runs.

The following code creates an environment object from the existing Conda environment `mycondaenv`. It uses the [`from_existing_conda_environment()`](/python/api/azureml-core/azureml.core.environment.environment#from-existing-conda-environment-name--conda-environment-name-) method.

``` python
myenv = Environment.from_existing_conda_environment(name="myenv",
                                                    conda_environment_name="mycondaenv")
```

An environment definition can be saved to a directory in an easily editable format with the [`save_to_directory()`](/python/api/azureml-core/azureml.core.environment.environment#save-to-directory-path--overwrite-false-) method. Once modified, a new environment can be instantiated by loading files from the directory.

```python
# save the enviroment
myenv.save_to_directory(path="path-to-destination-directory", overwrite=False)
# modify the environment definition
newenv = Environment.load_from_directory(path="path-to-source-directory")
```

### Implicitly use the default environment

If you don't specify an environment in your script run configuration before you submit the run, then a default environment is created for you.

```python
from azureml.core import ScriptRunConfig, Experiment, Environment
# Create experiment 
myexp = Experiment(workspace=ws, name = "environment-example")

# Attach training script and compute target to run config
src = ScriptRunConfig(source_directory=".", script="example.py", compute_target="local")

# Submit the run
run = myexp.submit(config=src)

# Show each step of run 
run.wait_for_completion(show_output=True)
```

## Add packages to an environment

Add packages to an environment by using Conda, pip, or private wheel files. Specify each package dependency by using the [`CondaDependency`](/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies) class. Add it to the environment's `PythonSection`.

### Conda and pip packages

If a package is available in a Conda package repository, then we recommend that you use the Conda installation rather than the pip installation. Conda packages typically come with prebuilt binaries that make installation more reliable.

The following example adds to the environment `myenv`. It adds version 1.17.0 of `numpy`. It also adds the `pillow` package. The example uses the [`add_conda_package()`](/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies#add-conda-package-conda-package-) method and the [`add_pip_package()`](/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies#add-pip-package-pip-package-) method, respectively.

```python
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies

myenv = Environment(name="myenv")
conda_dep = CondaDependencies()

# Installs numpy version 1.17.0 conda package
conda_dep.add_conda_package("numpy==1.17.0")

# Installs pillow package
conda_dep.add_pip_package("pillow")

# Adds dependencies to PythonSection of myenv
myenv.python.conda_dependencies=conda_dep
```

You can also add environment variables to your environment. These then become available using os.environ.get in your training script.

```python
myenv.environment_variables = {"MESSAGE":"Hello from Azure Machine Learning"}
```

>[!IMPORTANT]
> If you use the same environment definition for another run, the Azure Machine Learning service reuses the cached image of your environment. If you create an environment with an unpinned package dependency, for example ```numpy```, that environment will keep using the package version installed _at the time of environment creation_. Also, any future environment with matching definition will keep using the old version. For more information, see [Environment building, caching, and reuse](./concept-environments.md#environment-building-caching-and-reuse).

### Private Python packages

To use Python packages privately and securely without exposing them to the public internet, see the article [How to use private Python packages](how-to-use-private-python-packages.md).

## Manage environments

Manage environments so that you can update, track, and reuse them across compute targets and with other users of the workspace.

### Register environments

The environment is automatically registered with your workspace when you submit a run or deploy a web service. You can also manually register the environment by using the [`register()`](/python/api/azureml-core/azureml.core.environment%28class%29#register-workspace-) method. This operation makes the environment into an entity that's tracked and versioned in the cloud. The entity can be shared between workspace users.

The following code registers the `myenv` environment to the `ws` workspace.

```python
myenv.register(workspace=ws)
```

When you use the environment for the first time in training or deployment, it's registered with the workspace. Then it's built and deployed on the compute target. The service caches the environments. Reusing a cached environment takes much less time than using a new service or one that has been updated.

### Get existing environments

The `Environment` class offers methods that allow you to retrieve existing environments in your workspace. You can retrieve environments by name, as a list, or by a specific training run. This information is helpful for troubleshooting, auditing, and reproducibility.

#### View a list of environments

View the environments in your workspace by using the [`Environment.list(workspace="workspace_name")`](/python/api/azureml-core/azureml.core.environment%28class%29#list-workspace-) class. Then select an environment to reuse.

#### Get an environment by name

You can also get a specific environment by name and version. The following code uses the [`get()`](/python/api/azureml-core/azureml.core.environment%28class%29#get-workspace--name--version-none-) method to retrieve version `1` of the `myenv` environment on the `ws` workspace.

```python
restored_environment = Environment.get(workspace=ws,name="myenv",version="1")
```

#### Train a run-specific environment

To get the environment that was used for a specific run after the training finishes, use the [`get_environment()`](/python/api/azureml-core/azureml.core.run.run#get-environment--) method in the `Run` class.

```python
from azureml.core import Run
Run.get_environment()
```

### Update an existing environment

Say you change an existing environment, for example, by adding a Python package. This will take time to build as a new version of the environment is then created when you submit a run, deploy a model, or manually register the environment. The versioning allows you to view the environment's changes over time. 

To update a Python package version in an existing environment, specify the version number for that package. If you don't use the exact version number, then Azure Machine Learning will reuse the existing environment with its original package versions.

### Debug the image build

The following example uses the [`build()`](/python/api/azureml-core/azureml.core.environment%28class%29#build-workspace--image-build-compute-none-) method to manually create an environment as a Docker image. It monitors the output logs from the image build by using [`wait_for_completion()`](/python/api/azureml-core/azureml.core.image%28class%29#wait-for-creation-show-output-false-). The built image then appears in the workspace's Azure Container Registry instance. This information is helpful for debugging.

```python
from azureml.core import Image
build = env.build(workspace=ws)
build.wait_for_completion(show_output=True)
```

It is useful to first build images locally using the [`build_local()`](/python/api/azureml-core/azureml.core.environment.environment#build-local-workspace--platform-none----kwargs-) method. To build a docker image, set the optional parameter `useDocker=True`. To push the resulting image into the AzureML workspace container registry, set `pushImageToWorkspaceAcr=True`.

```python
build = env.build_local(workspace=ws, useDocker=True, pushImageToWorkspaceAcr=True)
```

> [!WARNING]
>  Changing the order of dependencies or channels in an environment will result in a new environment and will require a new image build. In addition, calling the `build()` method for an existing image will update its dependencies if there are new versions. 

## Use environments for training

To submit a training run, you need to combine your environment, [compute target](concept-compute-target.md), and your training Python script into a run configuration. This configuration is a wrapper object that's used for submitting runs.

When you submit a training run, the building of a new environment can take several minutes. The duration depends on the size of the required dependencies. The environments are cached by the service. So as long as the environment definition remains unchanged, you incur the full setup time only once.

The following local script run example shows where you would use [`ScriptRunConfig`](/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig) as your wrapper object.

```python
from azureml.core import ScriptRunConfig, Experiment
from azureml.core.environment import Environment

exp = Experiment(name="myexp", workspace = ws)
# Instantiate environment
myenv = Environment(name="myenv")

# Configure the ScriptRunConfig and specify the environment
src = ScriptRunConfig(source_directory=".", script="train.py", target="local", environment=myenv)

# Submit run 
run = exp.submit(src)
```

> [!NOTE]
> To disable the run history or run snapshots, use the setting under `src.run_config.history`.

If you don't specify the environment in your run configuration, then the service creates a default environment when you submit your run.

## Use environments for web service deployment

You can use environments when you deploy your model as a web service. This capability enables a reproducible, connected workflow. In this workflow, you can train, test, and deploy your model by using the same libraries in both your training compute and your inference compute.


If you are defining your own environment for web service deployment, you must list `azureml-defaults` with version >= 1.0.45 as a pip dependency. This package contains the functionality that's needed to host the model as a web service.

To deploy a web service, combine the environment, inference compute, scoring script, and registered model in your deployment object, [`deploy()`](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-). For more information, see [How and where to deploy models](how-to-deploy-and-where.md).

In this example, assume that you've completed a training run. Now you want to deploy that model to Azure Container Instances. When you build the web service, the model and scoring files are mounted on the image, and the Azure Machine Learning inference stack is added to the image.

```python
from azureml.core.model import InferenceConfig, Model
from azureml.core.webservice import AciWebservice, Webservice

# Register the model to deploy
model = run.register_model(model_name = "mymodel", model_path = "outputs/model.pkl")

# Combine scoring script & environment in Inference configuration
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)

# Set deployment configuration
deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)

# Define the model, inference, & deployment configuration and web service name and location to deploy
service = Model.deploy(
    workspace = ws,
    name = "my_web_service",
    models = [model],
    inference_config = inference_config,
    deployment_config = deployment_config)
```

## Notebooks

This [article](./how-to-access-terminal.md#add-new-kernels) provides information about how to install a Conda environment as a kernel in a notebook.

[Deploy a model using a custom Docker base image](how-to-deploy-custom-docker-image.md) demonstrates how to deploy a model using a custom Docker base image.

This [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/deployment/spark) demonstrates how to deploy a Spark model as a web service.

## Create and manage environments with the CLI

The [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md) mirrors most of the functionality of the Python SDK. You can use it to create and manage environments. The commands that we discuss in this section demonstrate fundamental functionality.

The following command scaffolds the files for a default environment definition in the specified directory. These files are JSON files. They work like the corresponding class in the SDK. You can use the files to create new environments that have custom settings. 

```azurecli-interactive
az ml environment scaffold -n myenv -d myenvdir
```

Run the following command to register an environment from a specified directory.

```azurecli-interactive
az ml environment register -d myenvdir
```

Run the following command to list all registered environments.

```azurecli-interactive
az ml environment list
```

Download a registered environment by using the following command.

```azurecli-interactive
az ml environment download -n myenv -d downloaddir
```

## Next steps

* To use a managed compute target to train a model, see [Tutorial: Train a model](tutorial-train-models-with-aml.md).
* After you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [`Environment` class SDK reference](/python/api/azureml-core/azureml.core.environment%28class%29).
