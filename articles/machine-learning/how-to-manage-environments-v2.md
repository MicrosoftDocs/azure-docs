---
title: 'Manage Azure Machine Learning environments with the CLI & SDK (v2)'
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning environments using Python SDK and Azure CLI extension for Machine Learning.
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: ositanachi  
ms.author: osiotugo
ms.reviewer: larryfr
ms.date: 09/27/2022
ms.custom: devx-track-azurecli, devplatv2, event-tier1-build-2022, devx-track-python
---

# Manage Azure Machine Learning environments with the CLI & SDK (v2)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]




Azure Machine Learning environments define the execution environments for your jobs or deployments and encapsulate the dependencies for your code. Azure Machine Learning uses the environment specification to create the Docker container that your training or scoring code runs in on the specified compute target. You can define an environment from a conda specification, Docker image, or Docker build context.

In this article, learn how to create and manage Azure Machine Learning environments using the SDK & CLI (v2).


## Prerequisites

[!INCLUDE [sdk/cliv2](includes/machine-learning-cli-sdk-v2-prereqs.md)]

> [!TIP]
> For a full-featured development environment, use Visual Studio Code and the [Azure Machine Learning extension](how-to-setup-vs-code.md) to [manage Azure Machine Learning resources](how-to-manage-resources-vscode.md) and [train machine learning models](tutorial-train-deploy-image-classification-model-vscode.md).

### Clone examples repository

To run the training examples, first clone the examples repository. For the CLI examples, change into the `cli` directory. For the SDK examples, change into the `SDK` directory:

```azurecli
git clone --depth 1 https://github.com/Azure/azureml-examples
```

Note that `--depth 1` clones only the latest commit to the repository, which reduces time to complete the operation.

### Connect to the workspace

> [!TIP]
> Use the tabs below to select the method you want to use to work with environments. Selecting a tab will automatically switch all the tabs in this article to the same tab. You can select another tab at any time.

# [Azure CLI](#tab/cli)

When using the Azure CLI, you need identifier parameters - a subscription, resource group, and workspace name. While you can specify these parameters for each command, you can also set defaults that will be used for all the commands. Use the following commands to set default values. Replace `<subscription ID>`, `<Azure Machine Learning workspace name>`, and `<resource group>` with the values for your configuration:

```azurecli
az account set --subscription <subscription ID>
az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
```

# [Python SDK](#tab/python)

To connect to the workspace, you need identifier parameters - a subscription, resource group, and workspace name. You'll use these details in the `MLClient` from the `azure.ai.ml` namespace to get a handle to the required Azure Machine Learning workspace. To authenticate, you use the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true). Check this [example](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/configuration.ipynb) for more details on how to configure credentials and connect to a workspace.

```python
#import required libraries for workspace
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

#import required libraries for environments examples
from azure.ai.ml.entities import Environment, BuildContext

#Enter details of your Azure Machine Learning workspace
subscription_id = '<SUBSCRIPTION_ID>'
resource_group = '<RESOURCE_GROUP>'
workspace = '<AZUREML_WORKSPACE_NAME>'

#connect to the workspace
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
```


---

## Curated environments

There are two types of environments in Azure Machine Learning: curated and custom environments. Curated environments are predefined environments containing popular ML frameworks and tooling. Custom environments are user-defined and can be created via `az ml environment create`.

Curated environments are provided by Azure Machine Learning and are available in your workspace by default. Azure Machine Learning routinely updates these environments with the latest framework version releases and maintains them for bug fixes and security patches. They're backed by cached Docker images, which reduce job preparation cost and model deployment time.

You can use these curated environments out of the box for training or deployment by referencing a specific environment using the `azureml:<curated-environment-name>:<version>` or `azureml:<curated-environment-name>@latest` syntax. You can also use them as reference for your own custom environments by modifying the Dockerfiles that back these curated environments.

You can see the set of available curated environments in the Azure Machine Learning studio UI, or by using the CLI (v2) via `az ml environment list`.

## Create an environment

You can define an environment from a Docker image, a Docker build context, and a conda specification with Docker image. 

### Create an environment from a Docker image

To define an environment from a Docker image, provide the image URI of the image hosted in a registry such as Docker Hub or Azure Container Registry. 

# [Azure CLI](#tab/cli)

The following example is a YAML specification file for an environment defined from a Docker image. An image from the official PyTorch repository on Docker Hub is specified via the `image` property in the YAML file.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image.yml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-image.yml
```

# [Python SDK](#tab/python)

The following example creates an environment from a Docker image. An image from the official PyTorch repository on Docker Hub is specified via the `image` property.

```python
env_docker_image = Environment(
    image="pytorch/pytorch:latest",
    name="docker-image-example",
    description="Environment created from a Docker image.",
)
ml_client.environments.create_or_update(env_docker_image)
```


---

> [!TIP]
> Azure Machine Learning maintains a set of CPU and GPU Ubuntu Linux-based base images with common system dependencies. For example, the GPU images contain Miniconda, OpenMPI, CUDA, cuDNN, and NCCL. You can use these images for your environments, or use their corresponding Dockerfiles as reference when building your own custom images.
>  
> For the set of base images and their corresponding Dockerfiles, see the [AzureML-Containers repo](https://github.com/Azure/AzureML-Containers).

### Create an environment from a Docker build context

Instead of defining an environment from a prebuilt image, you can also define one from a Docker [build context](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#understand-build-context). To do so, specify the directory that will serve as the build context. This directory should contain a Dockerfile (not larger than 1MB) and any other files needed to build the image.

# [Azure CLI](#tab/cli)

The following example is a YAML specification file for an environment defined from a build context. The local path to the build context folder is specified in the `build.path` field, and the relative path to the Dockerfile within that build context folder is specified in the `build.dockerfile_path` field. If `build.dockerfile_path` is omitted in the YAML file, Azure Machine Learning will look for a Dockerfile named `Dockerfile` at the root of the build context.

In this example, the build context contains a Dockerfile named `Dockerfile` and a `requirements.txt` file that is referenced within the Dockerfile for installing Python packages.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-context.yml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-context.yml
```

# [Python SDK](#tab/python)

In the following example, the local path to the build context folder is specified in the `path' parameter. Azure Machine Learning will look for a Dockerfile named `Dockerfile` at the root of the build context.

```python
env_docker_context = Environment(
    build=BuildContext(path="docker-contexts/python-and-pip"),
    name="docker-context-example",
    description="Environment created from a Docker context.",
)
ml_client.environments.create_or_update(env_docker_context)
```


---

Azure Machine Learning will start building the image from the build context when the environment is created. You can monitor the status of the build and view the build logs in the studio UI.

### Create an environment from a conda specification

You can define an environment using a standard conda YAML configuration file that includes the dependencies for the conda environment. See [Creating an environment manually](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-file-manually) for information on this standard format.

You must also specify a base Docker image for this environment. Azure Machine Learning will build the conda environment on top of the Docker image provided. If you install some Python dependencies in your Docker image, those packages won't exist in the execution environment thus causing runtime failures. By default, Azure Machine Learning will build a Conda environment with dependencies you specified, and will execute the job in that environment instead of using any Python libraries that you installed on the base image.

## [Azure CLI](#tab/cli)

The following example is a YAML specification file for an environment defined from a conda specification. Here the relative path to the conda file from the Azure Machine Learning environment YAML file is specified via the `conda_file` property. You can alternatively define the conda specification inline using the `conda_file` property, rather than defining it in a separate file.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/environment/docker-image-plus-conda.yaml":::

To create the environment:

```cli
az ml environment create --file assets/environment/docker-image-plus-conda.yml
```

## [Python SDK](#tab/python)

The relative path to the conda file is specified using the `conda_file` parameter.

```python
env_docker_conda = Environment(
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04",
    conda_file="conda-yamls/pydata.yml",
    name="docker-image-plus-conda-example",
    description="Environment created from a Docker image plus Conda environment.",
)
ml_client.environments.create_or_update(env_docker_conda)
```


---

Azure Machine Learning will build the final Docker image from this environment specification when the environment is used in a job or deployment. You can also manually trigger a build of the environment in the studio UI.

## Manage environments

The SDK and CLI (v2) also allow you to manage the lifecycle of your Azure Machine Learning environment assets.

### List

List all the environments in your workspace:

# [Azure CLI](#tab/cli)

```cli
az ml environment list
```

# [Python SDK](#tab/python)

```python
envs = ml_client.environments.list()
for env in envs:
    print(env.name)
```


---

List all the environment versions under a given name:

# [Azure CLI](#tab/cli)

```cli
az ml environment list --name docker-image-example
```

# [Python SDK](#tab/python)

```python
envs = ml_client.environments.list(name="docker-image-example")
for env in envs:
    print(env.version)
```


---

### Show

Get the details of a specific environment:

# [Azure CLI](#tab/cli)

```cli
az ml environment show --name docker-image-example --version 1
```

# [Python SDK](#tab/python)

```python
env = ml_client.environments.get(name="docker-image-example", version="1")
print(env)
```

---

### Update

Update mutable properties of a specific environment:

# [Azure CLI](#tab/cli)

```cli
az ml environment update --name docker-image-example --version 1 --set description="This is an updated description."
```

# [Python SDK](#tab/python)

```python
env.description="This is an updated description."
ml_client.environments.create_or_update(environment=env)
```

---

> [!IMPORTANT]
> For environments, only `description` and `tags` can be updated. All other properties are immutable; if you need to change any of those properties you should create a new version of the environment.

### Archive

Archiving an environment will hide it by default from list queries (`az ml environment list`). You can still continue to reference and use an archived environment in your workflows. You can archive either all versions of an environment or only a specific version.

If you don't specify a version, all versions of the environment under that given name will be archived. If you create a new environment version under an archived environment container, that new version will automatically be set as archived as well.

Archive all versions of an environment:

# [Azure CLI](#tab/cli)

```cli
az ml environment archive --name docker-image-example
```

# [Python SDK](#tab/python)

```python
ml_client.environments.archive(name="docker-image-example")
```


---
            
Archive a specific environment version:

# [Azure CLI](#tab/cli)

```cli
az ml environment archive --name docker-image-example --version 1
```

# [Python SDK](#tab/python)

```python
ml_client.environments.archive(name="docker-image-example", version="1")
```


---



## Use environments for training

# [Azure CLI](#tab/cli)

To use an environment for a training job, specify the `environment` field of the job YAML configuration. You can either reference an existing registered Azure Machine Learning environment via `environment: azureml:<environment-name>:<environment-version>` or `environment: azureml:<environment-name>@latest` (to reference the latest version of an environment), or define an environment specification inline. If defining an environment inline, don't specify the `name` and `version` fields, as these environments are treated as "unregistered" environments and aren't tracked in your environment asset registry.

# [Python SDK](#tab/python)

To use an environment for a training job, specify the `environment` property of the [command](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command).

For examples of submitting jobs, see the examples at [https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs).

---
When you submit a training job, the building of a new environment can take several minutes. The duration depends on the size of the required dependencies. The environments are cached by the service. So as long as the environment definition remains unchanged, you incur the full setup time only once.

---

For more information on how to use environments in jobs, see [Train models](how-to-train-model.md).

## Use environments for model deployments

# [Azure CLI](#tab/cli)

You can also use environments for your model deployments for both online and batch scoring. To do so, specify the `environment` field in the deployment YAML configuration.

For more information on how to use environments in deployments, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

# [Python SDK](#tab/python)

You can also use environments for your model deployments. For more information, see [Deploy and score a machine learning model](how-to-deploy-managed-online-endpoint-sdk-v2.md).

---

## Next steps

- [Train models (create jobs)](how-to-train-model.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Environment YAML schema reference](reference-yaml-environment.md)


