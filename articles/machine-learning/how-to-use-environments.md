---
title: Create reusable ML environments 
titleSuffix: Azure Machine Learning
description: Create and manage environments for model training and deployment. Manage Python packages and other settings for the environment.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 01/06/2020

## As a developer, I need to configure my experiment context with the necessary software packages so my machine learning models can be trained and deployed on different compute targets.

---

# Reuse environments for training & deployment with Azure Machine Learning.
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, learn how to create and manage Azure Machine Learning [environments](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) so you can track and reproduce your projects' software dependencies as they evolve.

Software dependency management is a common task for developers. You want to be able to ensure that builds are reproducible without a lot of manual software configuration. With  solutions for local development, such as pip and Conda in mind, the Azure Machine Learning Environments class provides a solution for both local and distributed cloud development.

The examples in this article show how to:

* Create an environment and specify package dependencies
* Retrieve and update environments
* Use environment for training
* Use environment for web service  deployment

See the [conceptual article](concept-environments.md) for a high-level overview of how environments work in Azure Machine Learning.

## Prerequisites

* The Azure Machine Learning SDK for Python [installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).
* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

## Create an environment

There are multiple ways to create an environment for your experiments.

### Use curated environment

You can select one of the curated environments to start with. 

* The __AzureML-Minimal__ environment contains a minimal set of packages to enable run tracking and asset uploading. You can use it as a starting point for your own environment.

* The __AzureML-Tutorial__ environment contains common data science packages, such as Scikit-Learn, Pandas and Matplotlib, and larger set of azureml-sdk packages.

Curated environments are backed by cached Docker images, reducing the run preparation cost.

Use __Environment.get__ method to select one of the curated environments:

```python
from azureml.core import Workspace, Environment

ws = Workspace.from_config()
env = Environment.get(workspace=ws, name="AzureML-Minimal")
```

You can list the curated environments and their packages using following code:
```python
envs = Environment.list(workspace=ws)

for env in envs:
    if env.startswith("AzureML"):
        print("Name",env)
        print("packages", envs[env].python.conda_dependencies.serialize_to_string())
```

> [!WARNING]
>  Do not start your own environment name with _AzureML_ prefix. It is reserved for curated environments.

### Instantiate an environment object

To manually create an environment, import the Environment class from the SDK and instantiate an environment object with the following code.

```python
from azureml.core.environment import Environment
Environment(name="myenv")
```

### Conda and pip specification files

You can also create an environment from a Conda specification or a pip requirements file.
Use the [from_conda_specification()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-conda-specification-name--file-path-) or the [from_pip_requirements()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-pip-requirements-name--file-path-) method, and include your environment name and the file path of the desired file in the method argument.

```python
# From a Conda specification file
myenv = Environment.from_conda_specification(name = "myenv",
                                             file_path = "path-to-conda-specification-file")

#From a pip requirements file
myenv = Environment.from_pip_requirements(name = "myenv"
                                          file_path = "path-to-pip-requirements-file")
```

### Existing Conda environment

If you have an existing Conda environment on your local computer, the service offers a solution for creating an environment object from it. This way you can reuse your local interactive environment on remote runs.

The following code creates an environment object out of the existing Conda environment `mycondaenv` with the [from_existing_conda_environment()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-existing-conda-environment-name--conda-environment-name-) method.

``` python
myenv = Environment.from_existing_conda_environment(name = "myenv",
                                                    conda_environment_name = "mycondaenv")
```

### Automatically create environments

Automatically create an environment by submitting a training run with the submit() method. When you submit a training run, the building of new environment can take several minutes depending on the size of the required dependencies. 

If you don't specify an environment in your run configuration prior to submitting the run, a default environment is created for you.

```python
from azureml.core import ScriptRunConfig, Experiment, Environment
# Create experiment 
myexp = Experiment(workspace=ws, name = "environment-example")

# Attaches training script and compute target to run config
runconfig = ScriptRunConfig(source_directory=".", script="example.py")
runconfig.run_config.target = "local"

# Submit the run
run = myexp.submit(config=runconfig)

# Shows each step of run 
run.wait_for_completion(show_output=True)
```

Similarly, if you use an [`Estimator`](https://docs.microsoft.com//python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) object for training you can submit the estimator instance directly as a run without having to specify an environment. The `Estimator` object already encapsulates the environment and compute target.


## Add packages to an environment

Add packages to an environment with Conda, pip, or private wheel files. Specify each package dependency using the [CondaDependency class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py), and add it to the environment's PythonSection.

### Conda and pip packages

If a package is available in a Conda package repository, it is recommended to use the Conda over pip installation. The reason is that Conda packages typically come with pre-built binaries that make installation more reliable.

The following example adds `scikit-learn`, specifically version 0.21.3, and `pillow` package to the environment, `myenv` with the [`add_conda_package()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py#add-conda-package-conda-package-) and [`add_pip_package()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py#add-pip-package-pip-package-)  methods, respectively.

```python
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies

myenv = Environment(name="myenv")
conda_dep = CondaDependencies()

# Installs scikit-learn version 0.21.3 conda package
conda_dep.add_conda_package("scikit-learn==0.21.3")

# Adds dependencies to PythonSection of myenv
myenv.python.conda_dependencies=conda_dep
```

### Private wheel files

You can use private pip wheel files by first uploading it to your workspace storage by using static [`add_private_pip_wheel()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#add-private-pip-wheel-workspace--file-path--exist-ok-false-) method, then capturing the storage URL, and passing the URL to the `add_pip_package()` method

```python
# During environment creation the service replaces the URL by secure SAS URL, so your wheel file is kept private and secure
whl_url = Environment.add_private_pip_wheel(workspace=ws,file_path = "my-custom.whl")
myenv = Environment(name="myenv")
conda_dep = CondaDependencies()
conda_dep.add_pip_package(whl_url)
myenv.python.conda_dependencies=conda_dep
```

## Manage environments

Manage environments so you can update, track, and reuse them across compute targets and with other users of the workspace.

### Register environments

The environment is automatically registered with your workspace when you submit a run or deploy a web service. You can also manually register the environment using the [register()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#register-workspace-) method. This operation makes the environment into an entity that is tracked and versioned in the cloud, and can be shared between workspace users.

The following code registers the environment, `myenv`, to the workspace, `ws`.

```python
myenv.register(workspace=ws)
```

When used for the first time, in training or deployment, the environment is registered with the workspace, built, and deployed on the compute target. The environments are cached by the service. Reusing a cached environment takes much less time than using a new service or one that has been updated.

### Get existing environments

The Environment class offers methods that allow you to retrieve existing environments in your workspace by name, as a list or by specific training run for troubleshooting or auditing purposes, as well as reproducibility.

#### View list of environments

View the environments in your workspace with [`Environment.list(workspace="workspace_name")`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#list-workspace-), and then select one to reuse.

#### Get environment by name

You can also get a specific environment by name and version.
The following code uses the [get()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#get-workspace--name--version-none-) method to retrieve version `1` of the environment, `myenv` on the `ws` workspace.

```python
restored_environment = Environment.get(workspace=ws,name="myenv",version="1")
```

#### Training run specific environment

To get the environment used for a specific run after training completes, use the [get_environment()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#get-environment--) method in the Run class.

```python
from azureml.core import Run
Run.get_environment()
```

### Update an existing environment

If you make changes to an existing environment, such as add a Python package, a new version of an environment is created when you either submit run, deploy model, or manually register the environment. The versioning allows you to view changes to the environment over time.

To update a Python package version of an existing environment, specify the exact version number for that package. Otherwise, the Azure Machine Learning will reuse the existing environment with package versions from when the environment was created.

### Debug the image build

This example uses the [build()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#build-workspace-) method to create an environment manually as a Docker image, and monitors the output logs from the image build using [wait_for_completion()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image(class)?view=azure-ml-py#wait-for-creation-show-output-false-). The built image then appears under the workspace Azure Container Registry, which is helpful for debugging.

```python
from azureml.core import Image
build = env.build(workspace=ws)
build.wait_for_completion(show_output=True)
```

## Docker and environments

 The [DockerSection](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.dockersection?view=azure-ml-py) of the Azure Machine Learning `Environments` class, allows you to customize and control in detail the guest operating system in which your training run executes.

When you `enable` Docker, the service builds a Docker image and creates a Python environment with your specifications within that Docker container. This provides additional isolation and reproducibility for your training runs.

```python
# Creates the environment inside a Docker container.
myenv.docker.enabled = True
```

Once built, the Docker image appears in the Azure Container Registry that's associated with the workspace, by default.  The repository name has the form *azureml/azureml_\<uuid\>*. The unique identifier (*uuid*) part corresponds to a hash computed from the environment configuration. This allows the service to determine whether an image corresponding to the given environment already exists for reuse.

Additionally, the service automatically uses one of the Ubuntu Linux-based [base images](https://github.com/Azure/AzureML-Containers), and installs the specified Python packages. The base image has CPU and GPU versions. Azure Machine Learning automatically detects which version to use.

```python
# Specify custom Docker base image and registry, if you don't want to use the defaults
myenv.docker.base_image="your_base-image"
myenv.docker.base_image_registry="your_registry_location"
# Alternatively, you can specify the contents of dockerfile of your base image
with open("docker_file_of_your_base_image", "r") as f:
    dockerfile_contents_of_your_base_image=f.read()
myenv.docker.base_dockerfile=dockerfile_contents_of_your_base_image 
```

> [!NOTE]
> If you specify `environment.python.user_managed_dependencies=False` while using a custom Docker image, the service will build a Conda environment within the image and execute the run in that environment, instead of using Python libraries you may have installed on the base image. Set the parameter to `True` to use your own installed packages.

## Using environments for training

To submit a training run, you need to combine your environment, [compute target](concept-compute-target.md)
and training Python script into a run configuration; a wrapper object used for submitting runs.

When you submit a training run, the building of a new environment can take several minutes depending on the size of the required dependencies. The environments are cached by the service, therefore as long as the environment definition remains unchanged, the full setup time is incurred only once.

The following local script run example shows where you would use [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py) as your wrapper object.

```python
from azureml.core import ScriptRunConfig, Experiment
from azureml.core.environment import Environment

exp = Experiment(name="myexp", workspace = ws)
# Instantiate environment
myenv = Environment(name="myenv")

# Add training script to run config
runconfig = ScriptRunConfig(source_directory=".", script="train.py")

# Attach compute target to run config
runconfig.run_config.target = "local"

# Attach environment to run config
runconfig.run_config.environment = myenv

# Submit run 
run = exp.submit(runconfig)
```

> [!NOTE]
> To disable run history or run snapshots, use the setting under `ScriptRunConfig.run_config.history`.

If you don't specify the environment in your run configuration, the service will create a default environment for you when you submit your run.

### Train with an estimator

If you are using an [estimator](how-to-train-ml-models.md) for training, you can simply submit the estimator instance directly, as it already encapsulates the environment and compute target.

The following code uses an estimator for a single-node training run on a remote compute for a scikit-learn model, and assumes a  previously created compute target object, `compute_target` and datastore object, `ds`.

```python
from azureml.train.estimator import Estimator

script_params = {
    '--data-folder': ds.as_mount(),
    '--regularization': 0.8
}

sk_est = Estimator(source_directory='./my-sklearn-proj',
                   script_params=script_params,
                   compute_target=compute_target,
                   entry_script='train.py',
                   conda_packages=['scikit-learn'])

# Submit the run 
run = experiment.submit(sk_est)
```

## Using environments for web service deployment

You can use environments when deploying your model as a web service. This enables a reproducible, connected workflow where you can train, test, and deploy your model using the exact same libraries in both your training and inference computes.

To deploy a web service, combine the environment, inference compute, scoring script, and registered model in your deployment object, [deploy()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-). Learn more about [deploying web services](how-to-deploy-and-where.md).

In this example, assume you have completed a training run and want to deploy that model to an Azure Container Instance (ACI). When building the web service, the model and scoring files are mounted on the image and the Azure Machine Learning inference stack is added to the image.

```python
from azureml.core.model import InferenceConfig, Model
from azureml.core.webservice import AciWebservice, Webservice

# Register the model to deploy
model = run.register_model(model_name = "mymodel", model_path = "outputs/model.pkl")

# Combine scoring script & environment in Inference configuration
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)

# Set deployment configuration
deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)

# Define the model, inference & deployment configuration and web service name and location to deploy
service = Model.deploy(
    workspace = ws,
    name = "my_web_service",
    models = [model],
    inference_config = inference_config,
    deployment_config = deployment_config)
```

## Example notebooks

This [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/using-environments) expands upon concepts and methods demonstrated in this article.

[Deploy a model using a custom Docker base image](how-to-deploy-custom-docker-image.md) demonstrates how to deploy a model using a custom Docker base image.

This [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/deployment/spark) demonstrates how to deploy a Spark model as a Web service.

## Create and manage environments with the CLI

The [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md) mirrors the majority of the functionality of the Python SDK, and can be used for environment creation and management. The following commands demonstrate basic functionality.

The following command scaffolds the files for a default environment definition in the specified directory. These files are JSON files that are similar in function to the corresponding class in the SDK, and can be used to create new environments with custom settings. 

```azurecli-interactive
az ml environment scaffold -n myenv -d myenvdir
```

Run the following command to register an environment from a specified directory.

```azurecli-interactive
az ml environment register -d myenvdir
```

Running the following command will list all registered environments.

```azurecli-interactive
az ml environment list
```

Download a registered environment with the following command.

```azurecli-interactive
az ml environment download -n myenv -d downloaddir
```

## Next steps

* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [Environment class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py) SDK reference.
