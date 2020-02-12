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

# Reuse environments for training and deployment by using Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, learn how to create and manage Azure Machine Learning [environments](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py). Use the environments to track and reproduce your projects' software dependencies as they evolve.

Software dependency management is a common task for developers. You want to ensure that builds are reproducible without extensive manual software configuration. The Azure Machine Learning `Environment` class accounts for local development solutions such as pip and Conda, and it provides a solution for both local and distributed cloud development.

The examples in this article show how to:

* Create an environment and specify package dependencies.
* Retrieve and update environments.
* Use an environment for training.
* Use an environment for web service deployment.

For a high-level overview of how environments work in Azure Machine Learning, see [What are ML environments?](concept-environments.md).

## Prerequisites

* The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py)
* An [Azure Machine Learning workspace](how-to-manage-workspace.md)

## Create an environment

The following sections explore the multiple ways that you can create an environment for your experiments.

### Use a curated environment

You can select one of the curated environments to start with: 

* The _AzureML-Minimal_ environment contains a minimal set of packages to enable run tracking and asset uploading. You can use it as a starting point for your own environment.

* The _AzureML-Tutorial_ environment contains common data science packages. These packages include Scikit-Learn, Pandas, Matplotlib, and a larger set of azureml-sdk packages.

Curated environments are backed by cached Docker images. This backing reduces the run preparation cost.

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

### Instantiate an environment object

To manually create an environment, import the `Environment` class from the SDK. Then use the following code to instantiate an environment object.

```python
from azureml.core.environment import Environment
Environment(name="myenv")
```

### Use Conda and pip specification files

You can also create an environment from a Conda specification or a pip requirements file. Use the [`from_conda_specification()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-conda-specification-name--file-path-) method or the [`from_pip_requirements()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-pip-requirements-name--file-path-) method. In the method argument, include your environment name and the file path of the file that you want.

```python
# From a Conda specification file
myenv = Environment.from_conda_specification(name = "myenv",
                                             file_path = "path-to-conda-specification-file")

# From a pip requirements file
myenv = Environment.from_pip_requirements(name = "myenv"
                                          file_path = "path-to-pip-requirements-file")
```

### Use existing Conda environments

If you have an existing Conda environment on your local computer, then you can use the service to create an environment object. By using this strategy, you can reuse your local interactive environment on remote runs.

The following code creates an environment object from the existing Conda environment `mycondaenv`. It uses the [`from_existing_conda_environment()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-existing-conda-environment-name--conda-environment-name-) method.

``` python
myenv = Environment.from_existing_conda_environment(name = "myenv",
                                                    conda_environment_name = "mycondaenv")
```

### Create environments automatically

Automatically create an environment by submitting a training run. Submit the run by using the `submit()` method. When you submit a training run, the building of the new environment can take several minutes. The build duration depends on the size of the required dependencies. 

If you don't specify an environment in your run configuration before you submit the run, then a default environment is created for you.

```python
from azureml.core import ScriptRunConfig, Experiment, Environment
# Create experiment 
myexp = Experiment(workspace=ws, name = "environment-example")

# Attach training script and compute target to run config
runconfig = ScriptRunConfig(source_directory=".", script="example.py")
runconfig.run_config.target = "local"

# Submit the run
run = myexp.submit(config=runconfig)

# Show each step of run 
run.wait_for_completion(show_output=True)
```

Similarly, if you use an [`Estimator`](https://docs.microsoft.com//python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) object for training, you can directly submit the estimator instance as a run without specifying an environment. The `Estimator` object already encapsulates the environment and the compute target.

## Add packages to an environment

Add packages to an environment by using Conda, pip, or private wheel files. Specify each package dependency by using the [`CondaDependency`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py) class. Add it to the environment's `PythonSection`.

### Conda and pip packages

If a package is available in a Conda package repository, then we recommend that you use the Conda installation rather than the pip installation. Conda packages typically come with prebuilt binaries that make installation more reliable.

The following example adds to the environment. It adds version 0.21.3 of `scikit-learn`. It also adds the `pillow` package, `myenv`. The example uses the [`add_conda_package()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py#add-conda-package-conda-package-) method and the [`add_pip_package()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py#add-pip-package-pip-package-) method, respectively.

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

You can use private pip wheel files by first uploading them to your workspace storage. You upload them by using a static [`add_private_pip_wheel()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#add-private-pip-wheel-workspace--file-path--exist-ok-false-) method. Then you capture the storage URL and pass the URL to the `add_pip_package()` method.

```python
# During environment creation the service replaces the URL by secure SAS URL, so your wheel file is kept private and secure
whl_url = Environment.add_private_pip_wheel(workspace=ws,file_path = "my-custom.whl")
myenv = Environment(name="myenv")
conda_dep = CondaDependencies()
conda_dep.add_pip_package(whl_url)
myenv.python.conda_dependencies=conda_dep
```

## Manage environments

Manage environments so that you can update, track, and reuse them across compute targets and with other users of the workspace.

### Register environments

The environment is automatically registered with your workspace when you submit a run or deploy a web service. You can also manually register the environment by using the [`register()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#register-workspace-) method. This operation makes the environment into an entity that's tracked and versioned in the cloud. The entity can be shared between workspace users.

The following code registers the `myenv` environment to the `ws` workspace.

```python
myenv.register(workspace=ws)
```

When you use the environment for the first time in training or deployment, it's registered with the workspace. Then it's built and deployed on the compute target. The service caches the environments. Reusing a cached environment takes much less time than using a new service or one that has been updated.

### Get existing environments

The `Environment` class offers methods that allow you to retrieve existing environments in your workspace. You can retrieve environments by name, as a list, or by a specific training run. This information is helpful for troubleshooting, auditing, and reproducibility.

#### View a list of environments

View the environments in your workspace by using the [`Environment.list(workspace="workspace_name")`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#list-workspace-) class. Then select an environment to reuse.

#### Get an environment by name

You can also get a specific environment by name and version. The following code uses the [`get()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#get-workspace--name--version-none-) method to retrieve version `1` of the `myenv` environment on the `ws` workspace.

```python
restored_environment = Environment.get(workspace=ws,name="myenv",version="1")
```

#### Train a run-specific environment

To get the environment that was used for a specific run after the training finishes, use the [`get_environment()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#get-environment--) method in the `Run` class.

```python
from azureml.core import Run
Run.get_environment()
```

### Update an existing environment

Say you change an existing environment, for example, by adding a Python package. A new version of the environment is then created when you submit a run, deploy a model, or manually register the environment. The versioning allows you to view the environment's changes over time.

To update a Python package version in an existing environment, specify the version number for that package. If you don't use the exact version number, then Azure Machine Learning will reuse the existing environment with its original package versions.

### Debug the image build

The following example uses the [`build()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#build-workspace-) method to manually create an environment as a Docker image. It monitors the output logs from the image build by using [`wait_for_completion()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image(class)?view=azure-ml-py#wait-for-creation-show-output-false-). The built image then appears in the workspace's Azure Container Registry instance. This information is helpful for debugging.

```python
from azureml.core import Image
build = env.build(workspace=ws)
build.wait_for_completion(show_output=True)
```

## Enable Docker

 The [`DockerSection`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.dockersection?view=azure-ml-py) of the Azure Machine Learning `Environment` class allows you to finely customize and control the guest operating system on which you run your training.

When you `enable` Docker, the service builds a Docker image. It also creates a Python environment that uses your specifications within that Docker container. This functionality provides additional isolation and reproducibility for your training runs.

```python
# Creates the environment inside a Docker container.
myenv.docker.enabled = True
```

By default, the newly built Docker image appears in the container registry that's associated with the workspace.  The repository name has the form *azureml/azureml_\<uuid\>*. The unique identifier (*uuid*) part of the name corresponds to a hash that's computed from the environment configuration. This correspondence allows the service to determine whether an image for the given environment already exists for reuse.

Additionally, the service automatically uses one of the Ubuntu Linux-based [base images](https://github.com/Azure/AzureML-Containers). It installs the specified Python packages. The base image has CPU versions and GPU versions. Azure Machine Learning automatically detects which version to use.

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
> If you specify `environment.python.user_managed_dependencies=False` while you're using a custom Docker image, then the service will build a Conda environment within the image. It will execute the run in that environment instead of using any Python libraries that you installed on the base image. Set the parameter to `True` to use your own installed packages.

## Use environments for training

To submit a training run, you need to combine your environment, [compute target](concept-compute-target.md), and your training Python script into a run configuration. This configuration is a wrapper object that's used for submitting runs.

When you submit a training run, the building of a new environment can take several minutes. The duration depends on the size of the required dependencies. The environments are cached by the service. So as long as the environment definition remains unchanged, you incur the full setup time only once.

The following local script run example shows where you would use [`ScriptRunConfig`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py) as your wrapper object.

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
> To disable the run history or run snapshots, use the setting under `ScriptRunConfig.run_config.history`.

If you don't specify the environment in your run configuration, then the service creates a default environment when you submit your run.

### Use an estimator for training

If you use an [estimator](how-to-train-ml-models.md) for training, then you can submit the estimator instance directly. It already encapsulates the environment and the compute target.

The following code uses an estimator for a single-node training run. It runs on a remote compute for a `scikit-learn` model. It assumes that you previously created a compute target object, `compute_target`, and a datastore object, `ds`.

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

## Use environments for web service deployment

You can use environments when you deploy your model as a web service. This capability enables a reproducible, connected workflow. In this workflow, you can train, test, and deploy your model by using the same libraries in both your training compute and your inference compute.

To deploy a web service, combine the environment, inference compute, scoring script, and registered model in your deployment object, [`deploy()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-). For more information, see [How and where to deploy models](how-to-deploy-and-where.md).

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

## Example notebooks

This [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/using-environments) expands upon concepts and methods demonstrated in this article.

[Deploy a model using a custom Docker base image](how-to-deploy-custom-docker-image.md) demonstrates how to deploy a model using a custom Docker base image.

This [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/deployment/spark) demonstrates how to deploy a Spark model as a web service.

## Create and manage environments with the CLI

The [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md) mirrors most of the functionality of the Python SDK. You can use it to create and manage environments. The commands that we discuss in this section demonstrate basic functionality.

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
* View the [`Environment` class SDK reference](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py).
* For more information about the concepts and methods described in this article, see the [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/using-environments).
