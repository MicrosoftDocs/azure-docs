---
title: Use environments for model training and deployment
titleSuffix: Azure Machine Learning service
description: Create, use and manage environment from model training and deployment. Manage Python packages and other settings for the environment.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 08/02/2019
ms.custom: seodec18
---
# Use environments for model training and deployment 

Environment specifies the the Python packages, environment variables and other software settings around your training or scoring script. It also let you choose and specify the
settings for different runtimes, such as plain Python, Spark, or Docker. 

Environments are managed and versioned entities within the Workspace that enable reproducible, auditable machine learning workflows. Thet are portable across different compute targets. You can use an environment on local compute to develop your training script, then re-use that same environment on Azure Machine Learning Compute to train your model at scale, and finally deploy your model using that same environment.

![Diagram of environment in machine learning workflow](./media/how-to-use-environments/ml-environment.PNG)

This article describes how you can
 * Create an environment and specify package dependencies
 * Use environment for training
 * Use environment for web service deployment
 * Retrieve and update environments

## How to create environment?

Environments can be created using Azure Machine Learning SDK:

 * Automatically when submitting an [__Estimator__](https://docs.microsoft.com/en-us/python/api/azureml-train-core/azureml.train.estimator.estimator?view=azure-ml-py) run
 * By instantiating a new [__Environment__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) object
 * From existing conda environment on your local computer
 * From conda specification file
 * From pip requirements file
 * Automatically when submitting a run without user-defined environment.

For example, to create a new environment, you can execute:

```python
from azureml.core import Environment
myenv = Environment(name="myenv")
```

When used first time, either for training or deployment, the environment is registered with Workspace, built and deployed on the compute target. You can also manually register an environment using the [__register__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#register-workspace-) method.

When you submit a training run, the building of new environment can take several minutes depending on the size of the required dependencies. The environments are cached by the service. Therefore as long as the environment definition remains unchanged, the full setup time is incurred only once.

## Attributes of environment

[__Environment__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) class has a name, a version and a dictionary of environment variables you want to pass to training run. Furthermore, Environment class contains 
sections, which are applicable depending on where your script executes. The sections are

 * PythonSection
 * DockerSection
 * SparkSection
 * DatabricksSection

The first two, PythonSection and DockerSection are generally applicable, and can be used to control, for example, location of Python executable, or Docker base image. The SparkSection is relevant only when submitting PySpark training scripts. The DatabricksSection is relevant only when executing [__DatabricksStep__](https://docs.microsoft.com/en-us/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricksstep?view=azure-ml-py) in Machine Learning Pipeline.

Environments can broadly be divided into system-managed and user-managed. 

### System-managed environment

Use a system-managed environment when you want [Conda](https://conda.io/docs/) to manage the Python environment and the script dependencies for you. A system-managed environment is assumed by default and the most common choice. It is useful on remote compute targets, especially when you cannot configure that target.

Python packages can be specified as:

 * Conda dependencies
 * Pip dependencies
 * Private wheel (.whl) files

If package is available in a conda package repository, it is recommended to use the conda over pip. The reason is that conda packages typically come with pre-build binaries, making the installation more reliable.

All you need to do is specify each package dependency using the [CondaDependency class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py), and adding it to environments PythonSection. For example, add scikit-learn package to environment using following script:


```python
from azureml.core import Environment
from azureml.core.environment import CondaDependencies

myenv = Environment(name="myenv")
conda_dep = CondaDependencies()
conda_dep.add_conda_package("scikit-learn")
myenv.python.conda_dependencies=conda_dep
```

You can also use the "package==version" syntax to specify exact, minimum or maximum varsion of the package.

#### Using private wheel files

You can use private pip wheel files by first uploading it to your workspace storage by using static __add_private_pip_wheel__ method, then capturing the storage URL, and passing the URL to conda dependencies __add_pip_package__ method


```python
whl_url = Environment.add_private_pip_wheel(workspace=ws,file_path = "my-custom.whl")
myenv = Environment(name="myenv")
conda_dep = CondaDependencies()
conda_dep.add_pip_package(whl_url)
myenv.python.conda_dependencies=conda_dep
```

Note that during environment creation the service replaces the URL by secure SAS URL, so your wheel file is kept private and secure.

### User-managed environment

For a user-managed environment, you're responsible for setting up your environment and installing every package your training script needs on the compute target. If your training environment is already configured (such as on your local machine), you can skip the setup step by setting __user_managed_dependencies__ in [PythonSection](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.pythonsection?view=azure-ml-py) to True. Conda will not check your environment or install anything for you.

### Docker and environments

Azure Machine Learning supports Docker when building environments, providing additional
isolation and reproducibility.

On local compute or VM, you can choose between Docker-based and bare metal environments. However, for Machine Learning Compute clusters or web service 
deployments,the environment must be Docker-based.

By default, Azure Machine Learning service uses one of the Ubuntu Linux-based [base images](https://github.com/Azure/AzureML-Containers), and installs the specified Python packages. The base image has CPU and GPU versions. You can specify the GPU image by turning the __Environment.docker.gpu_support__ flag on.

You can also specify your own custom Docker image, by specifying __Environment.docker.base_image__ and __Environment.docker.base_image_registry__ variables. The default for the image registry is Azure Container Registry of your Workspace. You can push custom images there to have authenticated access by default.

## Using environment for training

To submit a training run, you need to combine environment, [compute target](concept-compute-target.md)
and training Python script into run configuration: a wrapper object used for submitting runs. For example, for a local script run, you would use [__ScriptRunConfig__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.script_run_config.scriptrunconfig?view=azure-ml-py):

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

To get the environment used for a specific run afterwards, use [__Run.get_environment()__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#get-environment--) method.

If you are using [__Estimator__](how-to-train-ml-models.md), you can simply sumbit the Estimator instance directly, as it already encapsulates the environment and compute target. 

> [!NOTE]
> To disable run history or run snapshots, use setting under __ScriptRunConfig.run_config.history__ property.

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

## Managing environments

### Register environment

The environment is automatically registered with your workspace when you submit a run or deploy a web service. You can also manually register the environment using [__Environment.register__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#register-workspace-) method. This
operation makes the environment into an entity that is tracked and versioned in cloud, and can be shared between workspace users.

### Build environment manually

You can build an environment as Docker image and monitor the output logs from image build using

```python
build = env.build()
build.wait_for_completion(show_output=True)
```

The built image then appears under the Workspace Azure Container Registry.

### Retrieve existing environment

You can use [__Environment.list__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#list-workspace-) method to view the environments in your workspace, and then select one to re-use. To get a specific version of an environment, you can use [__Environment.get__](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py#get-workspace--name--version-none-) method.

Also, registered environments appear as a dictionary under Workspace object. You can use _env = ws.environments["my-env"]_ to get a specific named environment from Workspace instance _ws_.



### Update existing environment 

If you make changes to the environment, such as add a Python package, a new version of an environment is created when you either submit run, deploy model or manually register the environment. The versioning allows you to view changes to the environment over time.

## Next steps

* View [example Notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/using-environments) to see code examples of using environments.
* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* Learn how to [efficiently tune hyperparameters](how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [Environment class](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment(class)?view=azure-ml-py) SDK reference.

