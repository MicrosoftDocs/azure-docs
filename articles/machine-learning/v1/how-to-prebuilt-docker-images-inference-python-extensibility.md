---
title: Prebuilt Docker image Python extensibility
titleSuffix: Azure Machine Learning
description: 'Extend prebuilt docker images with Python package extensibility solution.'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.author: sehan
author: dem108
ms.date: 08/15/2022
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: UpdateFrequency5, deploy, docker, prebuilt, sdkv1, event-tier1-build-2022, devx-track-python
---

# Python package extensibility for prebuilt Docker images (preview)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

The [prebuilt Docker images for model inference](../concept-prebuilt-docker-images-inference.md) contain packages for popular machine learning frameworks. There are two methods that can be used to add Python packages __without rebuilding the Docker image__:

* [Dynamic installation](#dynamic): This approach uses a [requirements](https://pip.pypa.io/en/stable/cli/pip_install/#requirements-file-format) file to automatically restore Python packages when the Docker container boots.

    Consider this method __for rapid prototyping__. When the image starts, packages are restored using the `requirements.txt` file. This method increases startup of the image, and you must wait longer before the deployment can handle requests.

* [Pre-installed Python packages](#preinstalled): You provide a directory containing preinstalled Python packages. During deployment, this directory is mounted into the container for your entry script (`score.py`) to use.

    Use this approach __for production deployments__. Since the directory containing the packages is mounted to the image, it can be used even when your deployments don't have public internet access. For example, when deployed into a secured Azure Virtual Network.

> [!IMPORTANT]
> Using Python package extensibility for prebuilt Docker images with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure Machine Learning workspace. For a tutorial on creating a workspace, see [Get started with Azure Machine Learning](../quickstart-create-resources.md).
* Familiarity with using Azure Machine Learning [environments](../how-to-use-environments.md).
* Familiarity with [Where and how to deploy models](how-to-deploy-and-where.md) with Azure Machine Learning.

<a id="dynamic"></a>

## Dynamic installation

This approach uses a [requirements](https://pip.pypa.io/en/stable/cli/pip_install/#requirements-file-format) file to automatically restore Python packages when the image starts up.

To extend your prebuilt docker container image through a requirements.txt, follow these steps:

1. Create a `requirements.txt` file alongside your `score.py` script.
2. Add **all** of your required packages to the `requirements.txt` file.
3. Set the `AZUREML_EXTRA_REQUIREMENTS_TXT` environment variable in your Azure Machine Learning [environment](../how-to-use-environments.md) to the location of `requirements.txt` file.

Once deployed, the packages will automatically be restored for your score script.

> [!TIP]
> Even while prototyping, we recommend that you pin each package version in `requirements.txt`.
> For example, use `scipy == 1.2.3` instead of just `scipy` or even `scipy > 1.2.3`.
> If you don't pin an exact version and `scipy` releases a new version, this can break your scoring script and cause failures during deployment and scaling.

The following example demonstrates setting the `AZUREML_EXTRA_REQUIRMENTS_TXT` environment variable:

```python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies 

myenv = Environment(name="my_azureml_env")
myenv.docker.enabled = True
myenv.docker.base_image = <MCR-path>
myenv.python.user_managed_dependencies = True

myenv.environment_variables = {
    "AZUREML_EXTRA_REQUIREMENTS_TXT": "requirements.txt"
}
```

The following diagram is a visual representation of the dynamic installation process:

:::image type="content" source="./media/how-to-prebuilt-docker-images-inference-python-extensibility/dynamic-install-python-extend.svg" alt-text="Diagram of dynamic installation process":::

<a id="preinstalled"></a>

## Pre-installed Python packages

This approach mounts a directory that you provide into the image. The Python packages from this directory can then be used by the entry script (`score.py`).

To extend your prebuilt docker container image through pre-installed Python packages, follow these steps:

> [!IMPORTANT]
> You must use packages compatible with Python 3.7. All current images are pinned to Python 3.7.

1. Create a virtual environment using [virtualenv](https://virtualenv.pypa.io/).

1. Install your Dependencies. If you have a list of dependencies in a `requirements.txt`, for example, you can use that to install with `pip install -r requirements.txt` or just `pip install` individual dependencies.

1. When you specify the `AZUREML_EXTRA_PYTHON_LIB_PATH` environment variable, make sure that you point to the correct site packages directory, which will vary depending on your environment name and Python version. The following code demonstrates setting the path for a virtual environment named `myenv` and Python 3.7:


    ```python
    from azureml.core import Environment
    from azureml.core.conda_dependencies import CondaDependencies 

    myenv = Environment(name='my_azureml_env')
    myenv.docker.enabled = True
    myenv.docker.base_image = <MCR-path>
    myenv.python.user_managed_dependencies = True

    myenv.environment_variables = {
        "AZUREML_EXTRA_PYTHON_LIB_PATH": "myenv/lib/python3.7/site-packages"
    }
    ```

The following diagram is a visual representation of the pre-installed packages process:

:::image type="content" source="./media/how-to-prebuilt-docker-images-inference-python-extensibility/pre-install-python-extend.svg" alt-text="Diagram of the process using preinstalled packages":::

### Common problems

The mounting solution will only work when your `myenv` site packages directory contains all of your dependencies. If your local environment is using dependencies installed in a different location, they won't be available in the image.

Here are some things that may cause this problem:

* `virtualenv` creates an isolated environment by default. Once you activate the virtual environment, __global dependencies cannot be used__.
* If you have a `PYTHONPATH` environment variable pointing to your global dependencies, __it may interfere with your virtual environment__. Run `pip list` and `pip freeze` after activating your environment to make sure no unwanted dependencies are in your environment.
* __Conda and `virtualenv` environments can interfere__. Make sure that not to use [Conda environment](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) and `virtualenv` at the same time.

## Limitations

### Model.package()

* The [Model.package()](/python/api/azureml-core/azureml.core.model(class)) method lets you create a model package in the form of a Docker image or Dockerfile build context. Using Model.package() with prebuilt inference docker images triggers an intermediate image build that changes the non-root user to root user.

* We encourage you to use our Python package extensibility solutions. If other dependencies are required (such as `apt` packages), create your own [Dockerfile extending from the inference image](how-to-extend-prebuilt-docker-image-inference.md#buildmodel).

## Frequently asked questions

* In the requirements.txt extensibility approach is it mandatory for the file name to be `requirements.txt`?

        
    ```python
    myenv.environment_variables = {
        "AZUREML_EXTRA_REQUIREMENTS_TXT": "name of your pip requirements file goes here"
    }
    ```

* Can you summarize the `requirements.txt` approach versus the *mounting approach*?

    Start prototyping with the *requirements.txt* approach.
    After some iteration, when you're confident about which packages (and versions) you need for a successful model deployment, switch to the *Mounting Solution*.
        
    Here's a detailed comparison.

    | Compared item | Requirements.txt (dynamic installation) | Package Mount |
    | ----- | ----- | ------ |
    | Solution  | Create a `requirements.txt` that installs the specified packages when the container starts. | Create a local Python environment with all of the dependencies. Mount this directory into container at runtime. |
    | Package Installation           | No extra installation (assuming pip already installed)                                                                                                          | Virtual environment or conda environment installation.                                                                                   |
    | Virtual environment Setup              | No extra setup of virtual environment required, as users can pull the current local user environment with pip freeze as needed to create the `requirements.txt`. | Need to set up a clean virtual environment, may take extra steps depending on the current user local environment.                        |
    | [Debugging](../how-to-inference-server-http.md)                 | Easy to set up and debug server, since dependencies are clearly listed. | Unclean virtual environment could cause problems when debugging of server. For example, it may not be clear if errors come from the environment or user code. |
    | Consistency during scaling out | Not consistent as dependent on external PyPi packages and users pinning their dependencies. These external downloads could be flaky.                                 | Relies solely on user environment, so no consistency issues.                                                                             |

* Why are my `requirements.txt` and mounted dependencies directory not found in the container?

    Locally, verify the environment variables are set properly. Next, verify the paths that are specified are spelled properly and exist.
    Check if you have set your source directory correctly in the [inference config](/python/api/azureml-core/azureml.core.model.inferenceconfig#constructor) constructor.

* Can I override Python package dependencies in prebuilt inference docker image?

    Yes. If you want to use other version of Python package that is already installed in an inference image, our extensibility solution will respect your version. Make sure there are no conflicts between the two versions.

## Best Practices

* Refer to the [Load registered model](how-to-deploy-advanced-entry-script.md#load-registered-models) docs. When you register a model directory, don't include your scoring script, your mounted dependencies directory, or `requirements.txt` within that directory.


* For more information on how to load a registered or local model, see [Where and how to deploy](how-to-deploy-and-where.md?tabs=azcli#define-a-dummy-entry-script).

## Bug Fixes

### 2021-07-26

* `AZUREML_EXTRA_REQUIREMENTS_TXT` and `AZUREML_EXTRA_PYTHON_LIB_PATH` are now always relative to the directory of the score script.
For example, if both the requirements.txt and score script is in **my_folder**, then `AZUREML_EXTRA_REQUIREMENTS_TXT` will need to be set to requirements.txt. No longer will `AZUREML_EXTRA_REQUIREMENTS_TXT` be set to **my_folder/requirements.txt**.

## Next steps

To learn more about deploying a model, see [How to deploy a model](how-to-deploy-and-where.md).

To learn how to troubleshoot prebuilt docker image deployments, see [how to troubleshoot prebuilt Docker image deployments](how-to-troubleshoot-prebuilt-docker-image-inference.md).
