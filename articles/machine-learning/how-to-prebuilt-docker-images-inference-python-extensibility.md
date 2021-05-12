---
title: Prebuilt Docker image Python extensibility
titleSuffix: Azure Machine Learning
description: 'Extend prebuilt docker images with Python package extensibility solution'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
author: shivanissambare
ms.date: 05/07/2021
ms.topic: how-to
ms.reviewer: larryfr
ms.custom: deploy, docker, prebuilt
---

# Python package extensibility for prebuilt Docker images (Preview)

The [prebuilt Docker images for model inference](concept-prebuilt-docker-images-inference.md) contain packages for popular machine learning frameworks. There are two methods that can be used to add Python packages __without rebuilding the Docker image__:

* [Dynamic installation](#dynamic-installation): This approach uses a [requirements](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file) file to automatically restore python packages when the Docker container boots.

    Consider this method __for rapid prototyping__. When the image starts, packages are restored using the `requirements.txt` file. This method increases startup of the image, and you must wait longer before the deployment can handle requests.

* __Pre-installed python packages__: You provide a directory containing preinstalled Python packages. During deployment, this directory is mounted into the container for your entry script (`score.py`) to use.

    Use this approach __for production deployments__. Since the directory containing the packages is mounted to the image, it can be used even when your deployments don't have public internet access. For example, when deployed into a secured Azure Virtual Network.

> [!IMPORTANT]
> Using prebuilt docker images with Azure Machine Learning is currently in preview. Preview functionality is provided "as-is", with no guarantee of support or service level agreement. For more information, see the [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## Prerequisites

* An Azure Machine Learning workspace. For a tutorial on creating a workspace, see [Get started with Azure Machine Learning](quickstart-create-resources.md).
* Familiarity with using Azure Machine Learning [environments](how-to-use-environments.md).
* Familiarity with [Where and how to deploy models](how-to-deploy-and-where.md) with Azure Machine Learning.

## Dynamic installation

This approach uses a [requirements](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file) file to automatically restore python packages when the image starts up.

To extend your prebuilt docker container image through a requirements.txt, follow these steps:

1. Create a `requirements.txt` file alongside your `score.py` script.
2. Add **all** of your required packages to the `requirements.txt` file.
3. Set the `AZUREML_EXTRA_REQUIREMENTS_TXT` environment variable in your Azure Machine Learning [environment](how-to-use-environments.md) to the location of `requirements.txt` file.

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

[comment] : <> (Adding requirements.txt diagram here)

## Pre-installed python packages

This approach mounts a directory that you provide into the image. The Python packages from this directory can then be used by the entry script (`score.py`).

To extend your prebuilt docker container image through pre-installed python packages, follow these steps:

> [!IMPORTANT]
> You must use packages compatible with Python 3.7. All current images are pinned to Python 3.7.

1. Create a virtual environment using [virtualenv](https://virtualenv.pypa.io/en/latest/index.html):

    1. To install virtualenv, use the following command:
    
        ```bash
        pip install virtualenv
        ```

    1. Then create or navigate to a directory that holds your `score.py`. For example, the following command changes to the `inference_dir` directory:

        ```bash
        cd inference_dir
        ```

    1. Create your virtual environment in the directory. The following command creates a new virtual environment named `myenv`:

        ```bash
        virtualenv myenv
        ```

        If your default Python version isn't Python 3.7, use the `-p` parameter to set the version to 3.7:

        ```bash
        virtualenv -p <path to Python 3.7>/python3.7 myenv
        ```

    1. Activate your virtual environment. Depending on your operating system, this line may be different. For more information, see the [virtualenv documentation](https://virtualenv.pypa.io/en/latest/index.html) documentation.

        ```bash
        source myenv/bin/activate
        ```

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

### Common problems

The mounting solution will only work when your `myenv` site packages directory contains all of your dependencies. If your local environment is using dependencies installed in a different location, they won't be available in the image.

Here are some things that may cause this problem:

* `virtualenv` creates an isolated environment by default. Once you activate the virtual environment, __global dependencies cannot be used__.
* If you have a `PYTHONPATH` environment variable pointing to your global dependencies, __it may interfere with your virtual environment__. Run `pip list` and `pip freeze` after activating your environment to make sure no unwanted dependencies are in your environment.
* __Conda and `virtualenv` environments can interfere__. Make sure that no [Conda environment](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) is active.

## Limitations

### Model.package

The [Model.package()](/python/api/azureml-core/azureml.core.model(class)) method lets you create a model package in the form of a Docker image or Dockerfile build context.

You can't install conda or pip dependencies to the non-root curated images via `Model.package()`. Doing so triggers an intermediate image build that changes the non-root user to root user.

While running the model produced by Model.package(), you need to append an extra parameter.

The final command is shown below.

```bash
docker run --rm -ti -p 5001:5001 NON-ROOT-IMAGE bash -c "source activate myenv; runsvdir /var/runit"
```

For normal images, customer run images with the following shorter command:

```bash
docker run --rm -ti -p 5001:5001 NON-ROOT-IMAGE
```

If the image build is triggered, the Docker image is changed to root user. To work around this, set `user_managed_dependencies = true` in the *InferenceConfig*.

Setting `user_managed_dependencies = true` avoids the image build, so the user stays non-root. But it also means we can't install any other dependencies.

Instead of using `Model.package()` to add other dependencies, we encourage you to use our python package extensibility solutions. If other dependencies are required (such as `apt` packages), to create your own [Dockerfile extending from the inference image](how-to-extend-prebuilt-docker-image-inference.md).

## Frequently asked questions

* In the requirements.txt extensibility approach is it mandatory for the file name to be `requirements.txt`?

    You can name the pip requirements file whatever you like. Then specify the filename using this environment variable.
        
    ```python
    myenv.environment_variables = {
        "AZUREML_EXTRA_REQUIREMENTS_TXT": "name of your pip requirements file goes here"
    }
    ```

* Can you summarize the `requirements.txt` approach versus the *mounting approach*?

    Start prototyping with the *requirements.txt* approach.
    After some iteration, when you're confident about which packages (and versions) you need for a successful model deployment, switch to the *Mounting Solution*.
        
    Here's a detailed comparison.

    | Compared item                  | Requirements.txt (dynamic installation)                                                                                                                              | Package Mount                                                                                                                            |
    |--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--|
    | Solution                       | Create a `requirements.txt` that installs the specified packages when the container starts.                                                                               | Create a local python environment with all of the dependencies. Mount this directory into container at runtime.                    |
    | Package Installation           | No extra installation (assuming pip already installed)                                                                                                          | Virtual environment or conda environment installation.                                                                                   |
    | Virtual environment Setup              | No extra setup of virtual environment required, as users can pull the current local user environment with pip freeze as needed to create the `requirements.txt`. | Need to set up a clean virtual environment, may take extra steps depending on the current user local environment.                        |
    | Debugging                  | Easy to set up and debug server, since dependencies are clearly listed. | Unclean virtual environment could cause problems when debugging of server. For example, it may not be clear if errors come from the environment or user code. |
    | Consistency during scaling out | Not consistent as dependent on external PyPi packages and users pinning their dependencies. These external downloads could be flaky.                                 | Relies solely on user environment, so no consistency issues.                                                                             |

* Why are my `requirements.txt` and mounted dependencies directory not found in the container?

    Locally, verify the environment variables are set properly. Next, verify the paths that are specified are spelled properly and exist.

    If your `requirements.txt` and mounted dependencies are in the same directory as the one set for your registered model (specified in `Model.register()`), then you must prepend your model directory name to the rest of your path. 

    For example, if your registered model directory is `mymodel` and the `requirements.txt` is within that directory, then your environment variable would be `"AZUREML_EXTRA_REQUIREMENTS_TXT": "mymodel/requirements.txt"`

## Best Practices

We recommend following this document for Best Practices when using Inference-optimized Curated Images.

* Refer to the [Load registered model](how-to-deploy-advanced-entry-script.md#load-registered-models) docs. When you register a model directory, don't include your scoring script, your mounted dependencies directory, or `requirements.txt` within that directory.

* Recommended directory Structure:

    * When setting up a complex project with multiple model files, separate your model directory that you register via `Model.register` from the source directory that you set in your `InferenceConfig`.
    * The following tree diagram shows a directory structure, where `code` is the source directory specified in your `InferenceConfig` and `model` is the directory registered for `Model.register`. For `Model.register` if there's only one model file, you can directly point to the file instead of passing in the directory.

    ``` bash
    ├── code
    │   ├── devenv
    │   │   ├── bin
    │   │   │   ├── pip
    │   │   │   ├── python
    │   │   │   └── etc.
    │   │   └── lib
    │   │       └── python3.7
    │   │           └── site-packages
    │   │               ├── numpy
    |   |               ├── tensorflow
    │   │               └── etc.
    │   ├── main.py
    │   ├── requirements.txt
    │   └── score.py
    └── model
        └── sklearn_regression_model.pkl
    ```

* For more information on how to load a registered or local model, see [Where and how to deploy](how-to-deploy-and-where.md?tabs=azcli#define-a-dummy-entry-script).

## Next steps

To learn more about deploying a model, see [How to deploy a model](how-to-deploy-and-where.md).

To learn how to troubleshoot prebuilt docker image deployments, see [how to troubleshoot prebuilt Docker image deployments](how-to-troubleshoot-prebuilt-docker-image-inference.md).