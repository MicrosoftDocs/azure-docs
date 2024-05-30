---
title: Customize base image for compute session in prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to create base image for compute session in prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - build-2024
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 04/19/2024
---

# Customize base image for compute session

This section assumes you have knowledge of [Docker](https://www.docker.com/) and [Azure Machine Learning environments](../concept-environments.md).

## Step-1: Prepare the docker context

### Create `image_build` folder

In your local environment, create a folder contains following files, the folder structure should look like this:

```
|--image_build
|  |--requirements.txt
|  |--Dockerfile
|  |--environment.yaml
```

### Define your required packages in `requirements.txt`

**Optional**: Add packages in private pypi repository.

Using the following command to download your packages to local: `pip wheel <package_name> --index-url=<private pypi> --wheel-dir <local path to save packages>`

Open the `requirements.txt` file and add your extra packages and specific version in it.  For example:

```
###### Requirements with Version Specifiers ######
langchain == 0.0.149        # Version Matching. Must be version 0.0.149
keyring >= 4.1.1            # Minimum version 4.1.1
coverage != 3.5             # Version Exclusion. Anything except version 3.5
Mopidy-Dirble ~= 1.1        # Compatible release. Same as >= 1.1, == 1.*
<path_to_local_package>     # reference to local pip wheel package
```

For more information about structuring the `requirements.txt` file, see [Requirements file format](https://pip.pypa.io/en/stable/reference/requirements-file-format/) in the pip documentation.

### Define the `Dockerfile`

Create a `Dockerfile` and add the following content, then save the file:

```
FROM <Base_image>
COPY ./* ./
RUN pip install -r requirements.txt
```

> [!NOTE]
> This docker image should be built from prompt flow base image that is `mcr.microsoft.com/azureml/promptflow/promptflow-runtime:<newest_version>`. If possible use the [latest version of the base image](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime/tags/list). 

## Step 2: Create custom Azure Machine Learning environment 

### Define your environment in `environment.yaml`

In your local compute, you can use the CLI (v2) to create a customized environment based on your docker image.

> [!NOTE]
> - Make sure to meet the [prerequisites](../how-to-manage-environments-v2.md#prerequisites) for creating environment.
> - Ensure you have [connected to your workspace](../how-to-manage-environments-v2.md?#connect-to-the-workspace).


```shell
az login # if not already authenticated

az account set --subscription <subscription ID>
az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
```

Open the `environment.yaml` file and add the following content. Replace the <environment_name> placeholder with your desired environment name.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: <environment_name>
build:
  path: .
```

### Create an environment

```shell
cd image_build
az ml environment create -f environment.yaml --subscription <sub-id> -g <resource-group> -w <workspace>
```

> [!NOTE]
> Building the environment image may take several minutes.

Go to your workspace UI page, then go to the **environment** page, and locate the custom environment you created. 

You can also find the image in environment detail page and use it as base image for compute session of prompt flow. This image will also be used to build environment for flow deployment from UI. Learn more [how to specify base image in compute session](how-to-manage-compute-session.md#change-the-base-image-for-compute-session).

To learn more about environment CLI, see [Manage environments](../how-to-manage-environments-v2.md#manage-environments).


## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
