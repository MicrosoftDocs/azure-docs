---
title: Prebuilt Docker Images - Python Package Extensibility Solution
titleSuffix: Azure Machine Learning
description: 'Extend Prebuilt docker images with Python Package Extensibility Solution'
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

# Python Package Extensibility Solution - Prebuilt Docker images for Inference

Need a python package which isn't included in the prebuilt docker container image? 
There are two ways to add a package to a prebuilt image without rebuilding it.

## 1. Dynamic installation via requirements.txt

This approach will automatically restore the python packages given through a [requirements](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file) file at runtime.

#### When to Use?

This approach is great for rapid prototyping, but is not recommended for production.

#### How it works?

In order to extend your prebuilt docker container image through a requirements.txt, follow these steps:

1. Create a `requirements.txt` file alongside your `score.py` script.
2. Add **all** of your required packages to the `requirements.txt` file.
3. Set the `AZUREML_EXTRA_REQUIREMENTS_TXT` environment variable in your AML environment to the location of requirements.txt file.

Once deployed, the packages will automatically be restored for your score script.

> **Pin each package version:**
Even while prototyping, pin each package version in `requirements.txt`.
For example, use `scipy == 1.2.3` instead of just `scipy` or even `scipy > 1.2.3`.
If you don't pin an exact version and `scipy` releases a new version, this can break your scoring script and cause failures during deployment and scaling.

#### Code Snippet

```python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies 

myenv = Environment(name="my_aml_env")
myenv.docker.enabled = True
myenv.docker.base_image = <MCR-path>
myenv.python.user_managed_dependencies = True

myenv.environment_variables = {
    "AZUREML_EXTRA_REQUIREMENTS_TXT": "requirements.txt"
}
```
[comment] : <> (Adding requirements.txt diagram here)

## 2. Pre-installed python packages

Give us a folder containing preinstalled Python packages and we'll mount this folder into the container for `score.py` to use.

#### When to Use?

Use this approach when you don't want the container to install dependencies at startup.
This can be useful if you plan to deploy the model inside a virtual network, since the container may not have public internet access to download packages.

#### How it works?

In order to extend your prebuilt docker container image through pre-installed python packages, follow these steps:

##### Prerequisites

- Python 3.7 (All current images are pinned to Python 3.7)

##### Create Virtual Environment
We will use [virtualenv](https://virtualenv.pypa.io/en/latest/index.html) to create a Python environment.

1. Install with `pip install virtualenv`

2. Then create a directory or navigate to a directory that holds your `score.py`. For our purposes, let's call this directory `inference_dir`, and navigate there.

    ```bash
    cd inference_dir
    ```

3. Create your virtual environment inside of your directory. Let's call this virtual environment `myenv`

   ```bash
    virtualenv myenv
    ```

    If your default Python version is not Python 3.7, you can specify the virtual environment to use Python 3.7 as follows:

    ```bash
    virtualenv -p <path to Python 3.7>/python3.7 myenv
    ```

4. Activate your virtual environment. Depending on your OS, this line may looks different. Refer to the `virtualenv` [docs](https://virtualenv.pypa.io/en/latest/index.html) for more information. 

   ```bash
    source myenv/bin/activate
    ```

##### Install your Dependencies

1. Install your dependencies! If you have a list of dependencies in a `requirements.txt`, for example, you can use that to install with `pip install -r requirements.txt` or just `pip install` individual dependencies.

2. When you specify the `AZUREML_EXTRA_PYTHON_LIB_PATH` environment variable, make sure that you point to the correct site packages folder, which will vary depending on your environment name and python version. For our example, this will look like:

    ```bash
    "AZUREML_EXTRA_PYTHON_LIB_PATH": "myenv/lib/python3.7/site-packages"
    ```


#### Code Snippet

```python
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies 

myenv = Environment(name='my_aml_env')
myenv.docker.enabled = True
myenv.docker.base_image = <MCR-path>
myenv.python.user_managed_dependencies = True

myenv.environment_variables = {
    "AZUREML_EXTRA_PYTHON_LIB_PATH": "myenv/lib/python3.7/site-packages"
}
```

### Common Pitfalls

The mounting solution will only work if your `myenv` site packages folder contains all of your dependencies. If for some reason your local environment is using dependencies installed in a different location, this will fail.

So here are some things to look out for:

* `virtualenv` creates an isolated environment by default. Once you activate the virtual environment, global dependencies cannot be used.
* However, if you have a `PYTHONPATH` environment variable pointing to your global dependencies, this may interfere with your virtual environment. Run `pip list` and `pip freeze` after activating your environment to make sure no unwanted dependencies are in your environment!
* Conda and `virtualenv` environments can interfere, so ensure that no [Conda environment](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) is active.

## Limitations

### Model.package 
Model.package() lets you create a model package in the form of a Docker image or Dockerfile build context.

You cannot install conda or pip dependencies to the non-root curated images via Model.package() because this triggers an intermediate image build that changes the non-root user to root user.

While running the model produced by Model.package(), you need to append an extra parameter.

The final command is shown below.

```sh
docker run --rm -ti -p 5001:5001 NON-ROOT-IMAGE bash -c "source activate myenv; runsvdir /var/runit"
```

For normal images, customer run images with the following shorter command:

```sh
docker run --rm -ti -p 5001:5001 NON-ROOT-IMAGE
```

If the image build is triggered, the docker image is changed to root user. To work around this, set `user_managed_dependencies = true` in the *InferenceConfig*.

This avoids the image build, so user stays non-root. But it also means we cannot install any additional dependencies.

Instead of using Model.package() to add additional dependencies, we encourage you to use our python package extensibility solutions, or if additional dependencies are required (such as `apt` packages), to create your own Dockerfile extending from the inferencing image.

## Frequently asked questions

1. In the requirements.txt extensibility approach is it mandatory for the file name to be `requirements.txt`?

You can name the pip requirements file whatever you like. Then specify the filename using this environment variable.
    
```python
myenv.environment_variables = {
    "AZUREML_EXTRA_REQUIREMENTS_TXT": "name of your pip requirements file goes here"
}
```

2. Can you summarize *requirements.txt* approach versus *mounting approach*?

Start prototyping with the *requirements.txt* approach.
After some iteration, when you're confident about which packages (and versions) you need for a successful model deployment, switch to the *Mounting Solution*.
    
Here's a detailed comparison.

| | Requirements.txt (dynamic installation)  | Package Mount 
--- | --- | --- | 
Solution | Create a requirements.txt that installs the specified packages at container boot time. | Create a local python environment with all of the dependencies. Mount          this folder into container at runtime. |
Package Installation | No additional installation (assuming pip already installed)| Virtual environment or conda environment installation. |
Virtual Env Setup| No additional set up of virtual environment required, as users can pull the current local user environment with pip freeze as needed to create the requirements.txt. | Need to set up a clean virtual environment, may take extra steps depending on the current user local environment. |
Debuggability | Easy to set up and debug server, since dependencies are clearly listed. | Unclean virtual environment could impact debuggability of server, i.e., it’s not clear if errors come from the environment or user code. |
Consistency during scaling out | Not consistent as dependent on external PyPi packages and users pinning their dependencies. These external downloads could be flaky. |             Relies solely on user environment, so no consistency issues. |

3. Why are my `requirements.txt` and mounted dependencies directory not found in the container?

First, verify locally that the environment variables are set properly and the paths that are specified are spelled properly and exist.

If your `requirements.txt` and mounted dependencies are in the same directory as the one set for your registered model (specified in `Model.register()`), then you will need to prepend your "model_folder" directory name to the rest of your path. 

For example, if your registered model directory is "model_folder" and the `requirements.txt` is within that directory, then your environment variable would be `"AZUREML_EXTRA_REQUIREMENTS_TXT": "model_folder/requirements.txt"`

## Best Practices

We recommend following this document for Best Practices when using Inference-optimized Curated Images.

* Refer to [Load registered model](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script#load-registered-models) section of Azure Machine Learning public documetation. Specifically, make sure that when you register a model directory, to not include your scoring script and your mounted dependencies folder or *requirements.txt* within that folder. If you must do this, refer to the [FAQs Guide](faq.md) for proper setup of the environment variables.

* Recommended Folder Structure:
  * When setting up a complex project with multiple model files, please separate your model directory that you register via `Model.register` from the source directory that you set in your `InferenceConfig`.
  * Here is an example folder structure, where `code` is the source directory specified in your `InferenceConfig` and `model` is the directory registered for `Model.register`. For `Model.register` if there is only one model file, you can also directly point to the file instead of passing in the directory.

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

* Refer to [Where and how to deploy](https://docs.microsoft.com/azure/machine-learning/how-to-deploy-and-where?tabs=azcli#writing-init) **Writing init()** section to understand how to load a registered model and how to load a local model.
