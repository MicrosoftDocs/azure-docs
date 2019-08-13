---
title: Create, use and manage environments for model training and deployment
titleSuffix: Azure Machine Learning service
description: Create, use and manage environments for model training and deployment. Manage Python packages and other settings for the environment.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 08/12/2019
ms.custom: seodec18

## As a developer, I need to configure my experiment context with the necessary software packages so my machine learning models can be trained and deployed either locally or remotely.

---

# Create and manage environments for training and deployment

In this article learn to

* Create an environment and specify package dependencies
* Retrieve and update environments
* Use environment for training
* Use environment for web service deployment

## What are environments

In Azure Machine Learning, Environments specify the Python packages, environment variables, and software settings around your training & scoring scripts and run times, such as Python, Spark, or Docker. They are managed and versioned entities within your Azure Machine Learning workspace that enable reproducible, auditable and portable machine learning workflows across different compute targets. You can use an environment object on your local compute to develop your training script,  re-use that same environment on Azure Machine Learning Compute for model training at scale, and finally deploy your model using that same environment.

![Diagram of environment in machine learning workflow](./media/how-to-use-environments/ml-environment.PNG)

### Types of environments

Environments can broadly be divided into two categories: system-managed and user-managed.

System managed environments are used when you want [Conda](https://conda.io/docs/) to manage the Python environment and the script dependencies for you. This type of environment is assumed by default, and the most common choice due to its usefulness on remote compute targets that are not manually configurable.

For a user-managed environment, you're responsible for setting up your environment and installing every package your training script needs on the compute target. Conda will not check your environment or install anything for you. If your training environment is already configured, you can skip the setup step by setting `user_managed_dependencies=True` parameter in the [PythonSection](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.pythonsection?view=azure-ml-py).

## Prerequisites

* The Azure Machine Learning SDK for Python [installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py). 
* An [Azure Machine Learning service workspace](how-to-manage-workspace.md).

## Create an environment and add packages
The below table lists the different ways to create an environment object with the Azure Machine Learning SDK.

Way| Description
---|---
[Environment](https://docs.microsoft.com/python/api/azureml-core/newazureml.core.environment.environment?view=azure-ml-py) object|Instantiate an environment with <br> `Environment(name="myenv")`.
[Estimator](https://docs.microsoft.com//python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) run |  When you submit a run using an estimator object an environment is automatically created.
Existing Conda environment on your local computer| Create an environment from an existing Conda environment on your local computer. This makes it easy to reuse your local interactive environment in Azure ML remote runs. <br>For example, if you've created conda environment using `conda create -n mycondaenv` you can create Azure ML environment out of that conda environment using `myenv = Environment.from_existing_conda_environment(name="myenv",conda_environment_name="mycondaenv")`.
Conda specification file| Create an environment from a conda specification file <br> For example,  `myenv = Environment.from_conda_specification(name="myenv", file_path="path-to-conda-specification-file")`
Pip requirements file | use a pip requirement file <br> `myenv = Environment.from_pip_requirements(name="myenv", file_path="path-to-pip-requirements-file")`
Submit a run |Automatically when submitting a run without user-defined environment. When you submit a training run, the building of new environment can take several minutes depending on the size of the required dependencies.

### Adding packages

To add packages, specify each package dependency using the [CondaDependency class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py), and add it to the environment's PythonSection.

#### Using Conda and pip packages

If a package is available in a Conda package repository, it is recommended to use the Conda over pip installation. The reason is that Conda packages typically come with pre-built binaries that make installation more reliable.

The following example adds the `scikit-learn` and `pillow` package to the environment, `myenv` with the [`add_conda_package()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py#add-conda-package-conda-package-) and [`add_pip_package()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py#add-pip-package-pip-package-)  methods, respectively.

```python
from azureml.core import Environment
from azureml.core.environment import CondaDependencies

myenv = Environment(name="myenv")
conda_dep = CondaDependencies()

# Install scikit learn conda package
conda_dep.add_conda_package("scikit-learn")

# Install pillow version 5.4.1 pip package
conda_dep.add_pip_package("pillow==5.4.1")

myenv.python.conda_dependencies=conda_dep
```

#### Using private wheel files

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

### Register environment

The environment is automatically registered with your workspace when you submit a run or deploy a web service. You can also manually register the environment using the[Environment.register](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#register-workspace-) method. This
operation makes the environment into an entity that is tracked and versioned in cloud, and can be shared between workspace users.

When used for the first time, in training or deployment, the environment is registered with the workspace, built and then deployed on the compute target. The environments are cached by the service, therefore as long as the environment definition remains unchanged, the full setup time is incurred only once.

### Retrieve existing environment

View the environments in your workspace with [list()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#list-workspace-), and then select one to re-use.

```python
from azureml.core import Environment
list("workspace_name")
```

The following code uses [get()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#get-workspace--name--version-none-) to retrieve the version `1` of the environment, `myenv` on the `ws` workspace.

```python
restored_environment = Environment.get(workspace=ws,name="myenv",version="1")
```

Also, registered environments appear as a dictionary under workspace object. You can use `env = ws.environments["my-env"]` to get a specific environment by name from workspace, `ws`.

### Update existing environment

If you make changes to the environment, such as add a Python package, a new version of an environment is created when you either submit run, deploy model or manually register the environment. The versioning allows you to view changes to the environment over time.

### Attributes of environment

[Environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) class has a name, a version and a dictionary of environment variables you want to pass to training run. 

Furthermore, Environment class contains sections, which are applicable depending on where your script executes. The sections are automatically created and populated with default values when you create the environment. You can change the properties under each section to control the behavior of training or scoring.

Attributes| Description
---|---
Name| Unique name of your new environment.
Version| System-assigned version number for the environment.
Variables dictionary| A dictionary of environment variables to pass to remote run. They are accessible from remote run, for example, using [os.getenv](https://docs.python.org/3.7/library/os.html#os.getenv).
[PythonSection](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.pythonsection?view=azure-ml-py)|Generally applicable, and can be used to control the Python packages and Python interpreter. For example, you can set the location of Python executable using `environment.python.interpreter_path`
[DockerSection](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.dockersection?view=azure-ml-py)|Generally applicable, and can be used to control the behavior of Docker execution. For example, you can enable or disable Docker execution using `environment.docker.enabled`, and pass additional arguments to Docker run command using `environment.docker.arguments`
[SparkSection](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.sparksection?view=azure-ml-py)|Relevant only when submitting PySpark training scripts.
DatabricksSection|Relevant only when executing [DatabricksStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricksstep?view=azure-ml-py) in Machine Learning Pipeline.

## Using environment for training

To submit a training run, you need to combine environment, [compute target](concept-compute-target.md)
and training Python script into run configuration: a wrapper object used for submitting runs. For example, for a local script run, you would use [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py):

```python
from azureml.core import Environment, ScriptRunConfig, Experiment

exp = Experiment(name="myexp", workspace = ws)
myenv = Environment(name="myenv")
runconfig = ScriptRunConfig(source_directory=".", script="train.py")
runconfig.compute_target = "local"
runconfig.environment = myenv
run = exp.submit(runconfig)
```

If you don't specify the environment, the service will create a default environment for you.

To get the environment used for a specific run afterwards, use [Run.get_environment()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#get-environment--) method.

If you are using [__Estimator__](how-to-train-ml-models.md), you can simply sumbit the Estimator instance directly, as it already encapsulates the environment and compute target.

> [!NOTE]
> To disable run history or run snapshots, use setting under __ScriptRunConfig.run_config.history__ property.

When you submit a training run, the building of new environment can take several minutes depending on the size of the required dependencies. The environments are cached by the service. Therefore as long as the environment definition remains unchanged, the full setup time is incurred only once.

## Using environment for web service deployment

You can use environments when deploying your model as a web service. This enables a reproducible, connected workflow where you can train, test, and deploy your model using the exact same libraries in both training and inferencing compute.

To deploy a web service, combine environment, inference compute, scoring script and registered model. For example, assume you have completed a training run which produced a model "outputs/model.pkl". To deploy that model to Azure Container Instance, you would use:

```python
from azureml.core.model import InferenceConfig, Model
from azureml.core.webservice import AciWebservice, Webservice

model = run.register_model(model_name = "mymodel", model_path = "outputs/model.pkl")

inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)

service = Model.deploy(
    workspace = ws,
    name = "my_web_service",
    models = [model],
    inference_config = inference_config,
    deployment_config = deployment_config)
```

When building the web service, the model and scoring files are mounted on the image, Azure Machine Learning inferencing stack is added on the image,

Learn more about [deploying web services](how-to-deploy-and-where.md).

### Docker and environments

Azure Machine Learning supports Docker when building environments, providing additional
isolation and reproducibility.

On local compute or VM, you can choose between Docker-based and bare metal environments. However, for Machine Learning Compute clusters or web service deployments, the environment must be Docker-based.

By default, Azure Machine Learning service uses one of the Ubuntu Linux-based [base images](https://github.com/Azure/AzureML-Containers), and installs the specified Python packages. The base image has CPU and GPU versions. You can specify the GPU image by turning the `Environment.docker.gpu_support` flag on.

You can also specify your own custom Docker image, by specifying `Environment.docker.base_image` and `Environment.docker.base_image_registry` variables. The default for the image registry is Azure Container Registry of your Workspace. You can push custom images there to have authenticated access by default.

### Build environment manually

You can build an environment as Docker image and monitor the output logs from image build using

```python
build = env.build()
build.wait_for_completion(show_output=True)
```

The built image then appears under the Workspace Azure Container Registry.

## Example notebooks

This [example notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/using-environments) expands upon concepts and methods demonstrated in this article.

## Next steps

* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [Environment class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py) SDK reference.
