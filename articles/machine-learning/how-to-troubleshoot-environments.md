---
title: Troubleshoot environment images
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot issues with environment image builds and package installations.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: edebar01
ms.author:  ericadebarge
ms.date: 03/01/2022
ms.topic: troubleshooting
ms.custom: devx-track-python, event-tier1-build-2022, ignite-2022
---

# Troubleshooting environment image builds using troubleshooting log error messages

In this article, learn how to troubleshoot common problems you may encounter with environment image builds.

## Azure Machine Learning environments

Azure Machine Learning environments are an encapsulation of the environment where your machine learning training happens.
They specify the base docker image, Python packages, and software settings around your training and scoring scripts.
Environments are managed and versioned assets within your Machine Learning workspace that enable reproducible, auditable, and portable machine learning workflows across various compute targets.

## Types of environments

Environments can broadly be divided into three categories: curated, user-managed, and system-managed.

Curated environments are pre-created environments that are managed by Azure Machine Learning (AzureML) and are available by default in every workspace.

Intended to be used as is, they contain collections of Python packages and settings to help you get started with various machine learning frameworks.
These pre-created environments also allow for faster deployment time.

In user-managed environments, you're responsible for setting up your environment and installing every package that your training script needs on the compute target.
Also be sure to include any dependencies needed for model deployment.
These types of environments are represented by two subtypes. For the first type, BYOC (bring your own container), you bring an existing Docker image to AzureML. For the second type, Docker build context based environments, AzureML materializes the image from the context that you provide.

System-managed environments are used when you want conda to manage the Python environment for you.
A new isolated conda environment is materialized from your conda specification on top of a base Docker image. By default, common properties are added to the derived image.
Note that environment isolation implies that Python dependencies installed in the base image won't be available in the derived image.

## Create and manage environments

You can create and manage environments from clients like AzureML Python SDK, AzureML CLI, AzureML Studio UI, VS code extension. 

"Anonymous" environments are automatically registered in your workspace when you submit an experiment without registering or referencing an already existing environment.
They won't be listed but may be retrieved by version or label.

AzureML builds environment definitions into Docker images.
It also caches the environments in the Azure Container Registry associated with your AzureML Workspace so they can be reused in subsequent training jobs and service endpoint deployments.
Multiple environments with the same definition may result the same image, so the cached image will be reused.
Running a training script remotely requires the creation of a Docker image.

## Reproducibility and vulnerabilities

### Vulnerabilities

Vulnerabilities can be addressed by upgrading to a newer version of a dependency or migrating to a different dependency that satisfies security
requirements. Mitigating vulnerabilities is time consuming and costly since it can require refactoring of code and infrastructure. With the prevalence
of open source software and the use of complicated nested dependencies, it's important to manage and keep track of vulnerabilities.

There are some ways to decrease the impact of vulnerabilities:

- Reduce your number of dependencies - use the minimal set of the dependencies for each scenario.
- Compartmentalize your environment so issues can be scoped and fixed in one place.
- Understand flagged vulnerabilities and their relevance to your scenario.

### Vulnerabilities vs Reproducibility

Reproducibility is one of the foundations of software development. While developing production code, a repeated operation must guarantee the same
result. Mitigating vulnerabilities can disrupt reproducibility by changing dependencies.

AzureML's primary focus is to guarantee reproducibility. Environments can broadly be divided into three categories: curated,
user-managed, and system-managed.

**Curated environments** are pre-created environments that are managed by Azure Machine Learning (AzureML) and are available by default in every AzureML workspace provisioned.

Intended to be used as is, they contain collections of Python packages and settings to help you get started with various machine learning frameworks.
These pre-created environments also allow for faster deployment time.

In **user-managed environments**, you're responsible for setting up your environment and installing every package that your training script needs on the
compute target and for model deployment. These types of environments are represented by two subtypes:

- BYOC (bring your own container): the user provides a Docker image to AzureML
- Docker build context: AzureML materializes the image from the user provided content

Once you install more dependencies on top of a Microsoft-provided image, or bring your own base image, vulnerability
management becomes your responsibility.

You use **system-managed environments** when you want conda to manage the Python environment for you. A new isolated conda environment is materialized
from your conda specification on top of a base Docker image. While Azure Machine Learning patches base images with each release, whether you use the
latest image may be a tradeoff between reproducibility and vulnerability management. So, it's your responsibility to choose the environment version used
for your jobs or model deployments while using system-managed environments.

Associated to your Azure Machine Learning workspace is an Azure Container Registry instance that's used as a cache for container images. Any image
materialized is pushed to the container registry and used if experimentation or deployment is triggered for the corresponding environment. Azure
Machine Learning doesn't delete images from your container registry, and it's your responsibility to evaluate which images you need to maintain over time. You
can monitor and maintain environment hygiene with [Microsoft Defender for Container Registry](../defender-for-cloud/defender-for-containers-vulnerability-assessment-azure.md)
to help scan images for vulnerabilities. To
automate this process based on triggers from Microsoft Defender, see [Automate responses to Microsoft Defender for Cloud triggers](../defender-for-cloud/workflow-automation.md).

## **Environment definition problems**

### *Environment name issues*
### Curated prefix not allowed
<!--issueDescription-->
This issue can happen when the name of your custom environment uses terms reserved only for curated environments. *Curated* environments are environments that Microsoft maintains. *Custom* environments are environments that you create and maintain.
 
**Potential causes:**
* Your environment name starts with *Microsoft* or *AzureML*
 
**Affected areas (symptoms):**
* Failure in registering your environment
<!--/issueDescription-->
 
**Troubleshooting steps**

 Update your environment name to exclude the reserved prefix you're currently using
 
**Resources**
* [Create and manage reusable environments](https://aka.ms/azureml/environment/create-and-manage-reusable-environments)

### Environment name is too long
<!--issueDescription-->
 
**Potential causes:**
* Your environment name is longer than 255 characters
 
**Affected areas (symptoms):**
* Failure in registering your environment
<!--/issueDescription-->
 
**Troubleshooting steps**

 Update your environment name to be 255 characters or less

### *Docker issues*

*Applies to: Azure CLI & Python SDK v1 (Deprecated)*

To create a new environment, you must use one of the following approaches (see [DockerSection](https://aka.ms/azureml/environment/environment-docker-section)):
- Base image
    - Provide base image name, repository from which to pull it, and credentials if needed
    - Provide a conda specification
- Base Dockerfile 
    - Provide a Dockerfile
    - Provide a conda specification
- Docker build context
    - Provide the location of the build context (URL)
    - The build context must contain at least a Dockerfile, but may contain other files as well

*Applies to: Azure CLI & Python SDK v2*

To create a new environment, you must use one of the following approaches:
- Docker image
    - Provide the image URI of the image hosted in a registry such as Docker Hub or Azure Container Registry
    - [Sample here](https://aka.ms/azureml/environment/create-env-docker-image-v2)
- Docker build context
    - Specify the directory that will serve as the build context
    - The directory should contain a Dockerfile and any other files needed to build the image
    - [Sample here](https://aka.ms/azureml/environment/create-env-build-context-v2)
- Conda specification 
    - You must specify a base Docker image for the environment; the conda environment will be built on top of the Docker image provided
    - Provide the relative path to the conda file
    - [Sample here](https://aka.ms/azureml/environment/create-env-conda-spec-v2)

### Missing Docker definition
*Applies to: Azure CLI & Python SDK v1 (Deprecated)*
<!--issueDescription-->
This issue can happen when your environment definition is missing a `DockerSection.` This section configures settings related to the final Docker image built from your environment specification.
 
**Potential causes:**
* The `DockerSection` of your environment definition isn't defined (null)
 
**Affected areas (symptoms):**
* Failure in registering your environment
<!--/issueDescription-->
 
**Troubleshooting steps**

 Add a `DockerSection` to your environment definition, specifying either a base image, base dockerfile, or docker build context.

```
from azureml.core import Environment
myenv = Environment(name="myenv")
# Specify docker steps as a string.
dockerfile = r'''
FROM mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04
RUN echo "Hello from custom container!"
'''

myenv.docker.base_dockerfile = dockerfile
```
 
**Resources**
* [DockerSection](https://aka.ms/azureml/environment/environment-docker-section)

### Missing Docker build context location
- If you're specifying a Docker build context as part of your environment build, you must provide the path of the build context directory
- See [BuildContext](https://aka.ms/azureml/environment/build-context-class)

### Too many Docker options
<!--issueDescription-->
 
**Potential causes:**

*Applies to: Azure CLI & Python SDK v1*

You have more than one of these Docker options specified in your environment definition
- `base_image`
- `base_dockerfile`
- `build_context`
- See [DockerSection](https://aka.ms/azureml/environment/docker-section-class)

*Applies to: Azure CLI & Python SDK v2*

You have more than one of these Docker options specified in your environment definition
- `image`
- `build`
- See [azure.ai.ml.entities.Environment](https://aka.ms/azureml/environment/environment-class-v2)
 
**Affected areas (symptoms):**
* Failure in registering your environment
<!--/issueDescription-->
 
**Troubleshooting steps**

Choose which Docker option you'd like to use to build your environment. Then set all other specified options to None.

*Applies to: Azure CLI & Python SDK v1*

```
from azureml.core import Environment
myenv = Environment(name="myEnv")
dockerfile = r'''
FROM mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04
RUN echo "Hello from custom container!"
'''
myenv.docker.base_dockerfile = dockerfile
myenv.docker.base_image = "pytorch/pytorch:latest"

# Having both base dockerfile and base image set will cause failure. Delete the one you won't use.
myenv.docker.base_image = None
```

### Missing Docker option
<!--issueDescription-->
 
**Potential causes:**

*Applies to: Azure CLI & Python SDK v1*

You didn't specify one of the following options in your environment definition
- `base_image`
- `base_dockerfile`
- `build_context`
- See [DockerSection](https://aka.ms/azureml/environment/docker-section-class)

*Applies to: Azure CLI & Python SDK v2*

You didn't specify one of the following options in your environment definition
- `image`
- `build`
- See [azure.ai.ml.entities.Environment](https://aka.ms/azureml/environment/environment-class-v2)
 
**Affected areas (symptoms):**
* Failure in registering your environment
<!--/issueDescription-->
 
**Troubleshooting steps**

Choose which Docker option you'd like to use to build your environment, then populate that option in your environment definition.

*Applies to: Azure CLI & Python SDK v1*

```
from azureml.core import Environment
myenv = Environment(name="myEnv")
myenv.docker.base_image = "pytorch/pytorch:latest"
```

*Applies to: Azure CLI & Python SDK v2*

```
env_docker_image = Environment(
    image="pytorch/pytorch:latest",
    name="docker-image-example",
    description="Environment created from a Docker image.",
)
ml_client.environments.create_or_update(env_docker_image)
```

**Resources**
* [Create and manage reusable environments v2](https://aka.ms/azureml/environment/create-and-manage-reusable-environments)
* [Environment class v1](https://aka.ms/azureml/environment/environment-class-v1)

### Container registry credentials missing either username or password
- To access the base image in the container registry specified, you must provide both a username and password. One is missing.
- Providing credentials in this way is deprecated. For the current method of providing credentials, see the *secrets in base image registry* section.

### Multiple credentials for base image registry
- When specifying credentials for a base image registry, you must specify only one set of credentials. 
- The following authentication types are currently supported:
    - Basic (username/password)
    - Registry identity (clientId/resourceId)
- If you're using workspace connections to specify credentials, [delete one of the connections](https://aka.ms/azureml/environment/delete-connection-v1)
- If you've specified credentials directly in your environment definition, choose either username/password or registry identity 
to use, and set the other credentials you won't use to `null`
    - Specifying credentials in this way is deprecated. It's recommended that you use workspace connections. See
    *secrets in base image registry* below

### Secrets in base image registry
- If you specify a base image in your `DockerSection`, you must specify the registry address from which the image will be pulled,
and credentials to authenticate to the registry, if needed.
- Historically, credentials have been specified in the environment definition. However, this method isn't secure and should be 
avoided.
- Users should set credentials using workspace connections. For instructions, see [set_connection](https://aka.ms/azureml/environment/set-connection-v1) 

### Deprecated Docker attribute
- The following `DockerSection` attributes are deprecated:
    - `enabled`
    - `arguments`
    - `shared_volumes`
    - `gpu_support`
        - Azure Machine Learning now automatically detects and uses NVIDIA Docker extension when available.
    - `smh_size`
- Use [DockerConfiguration](https://aka.ms/azureml/environment/docker-configuration-class) instead
- See [DockerSection deprecated variables](https://aka.ms/azureml/environment/docker-section-class)

### Dockerfile length over limit
- The specified Dockerfile can't exceed the maximum Dockerfile size of 100 KB
- Consider shortening your Dockerfile to get it under this limit

### *Docker build context issues*
### Missing Dockerfile path
- In the Docker build context, a Dockerfile path must be specified
- The path should be relative to the root of the Docker build context directory
- See [Build Context class](https://aka.ms/azureml/environment/build-context-class)

### Not allowed to specify attribute with Docker build context
- If a Docker build context is specified, then the following items can't also be specified in the
environment definition:
    - Environment variables
    - Conda dependencies
    - R
    - Spark 

### Location type not supported/Unknown location type
- The following are accepted location types:
    - Git
        - Git URLs can be provided to AzureML, but images can't yet be built using them. Use a storage
        account until builds have Git support
        - [How to use git repository as build context](https://aka.ms/azureml/environment/git-repo-as-build-context)
    - Storage account 

### Invalid location
- The specified location of the Docker build context is invalid
- If the build context is stored in a git repository, the path of the build context must be specified as a git URL
- If the build context is stored in a storage account, the path of the build context must be specified as 
    - `https://storage-account.blob.core.windows.net/container/path/`

### *Base image issues*
### Base image is deprecated
- The following base images are deprecated:
    - `azureml/base`
    - `azureml/base-gpu`
    - `azureml/base-lite`
    - `azureml/intelmpi2018.3-cuda10.0-cudnn7-ubuntu16.04`
    - `azureml/intelmpi2018.3-cuda9.0-cudnn7-ubuntu16.04`
    - `azureml/intelmpi2018.3-ubuntu16.04`
    - `azureml/o16n-base/python-slim`
    - `azureml/openmpi3.1.2-cuda10.0-cudnn7-ubuntu16.04`
    - `azureml/openmpi3.1.2-ubuntu16.04`
    - `azureml/openmpi3.1.2-cuda10.0-cudnn7-ubuntu18.04`
    - `azureml/openmpi3.1.2-cuda10.1-cudnn7-ubuntu18.04`
    - `azureml/openmpi3.1.2-cuda10.2-cudnn7-ubuntu18.04`
    - `azureml/openmpi3.1.2-cuda10.2-cudnn8-ubuntu18.04`
- AzureML can't provide troubleshooting support for failed builds with deprecated images. 
- Deprecated images are also at risk for vulnerabilities since they're no longer updated or maintained. 
It's best to use newer, non-deprecated versions.

### No tag or digest
- For the environment to be reproducible, one of the following must be included on a provided base image:
    - Version tag
    - Digest
- See [image with immutable identifier](https://aka.ms/azureml/environment/pull-image-by-digest)

### *Environment variable issues*
### Misplaced runtime variables
- An environment definition shouldn't contain runtime variables
- Use the `environment_variables` attribute on the [RunConfiguration object](https://aka.ms/azureml/environment/environment-variables-on-run-config) instead

### *Python issues*
### Python section missing
*V1*

- An environment definition must have a Python section
- Conda dependencies are specified in this section, and Python (along with its version) should be one of them
```json
"python": {
    "baseCondaEnvironment": null,
    "condaDependencies": {
        "channels": [
            "anaconda",
            "conda-forge"
        ],
        "dependencies": [
            "python=3.8"
        ],
    },
    "condaDependenciesFile": null,
    "interpreterPath": "python",
    "userManagedDependencies": false
}
```
- See [PythonSection class](https://aka.ms/azureml/environment/environment-python-section)

### Python version missing
*V1*

- A Python version must be specified in the environment definition 
- A Python version can be added by adding Python as a conda package and specifying the version:

```python
from azureml.core.environment import CondaDependencies

myenv = Environment(name="myenv")
conda_dep = CondaDependencies()
conda_dep.add_conda_package("python==3.8")
```
- See [Add conda package](https://aka.ms/azureml/environment/add-conda-package-v1)

### Multiple Python versions
- Only one Python version can be specified in the environment definition

### Python version not supported
- The Python version provided in the environment definition isn't supported
- Consider using a newer version of Python
- See [Python versions](https://aka.ms/azureml/environment/python-versions) and [Python end-of-life dates](https://aka.ms/azureml/environment/python-end-of-life)

### Python version not recommended
- The Python version used in the environment definition is deprecated, and its use should be avoided
- Consider using a newer version of Python as the specified version will eventually be unsupported
- See [Python versions](https://aka.ms/azureml/environment/python-versions) and [Python end-of-life dates](https://aka.ms/azureml/environment/python-end-of-life)

### Failed to validate Python version
- The provided Python version may have been formatted improperly or specified with incorrect syntax
- See [conda package pinning](https://aka.ms/azureml/environment/how-to-pin-conda-packages)

### *Conda issues*
### Missing conda dependencies
- The [environment definition](https://aka.ms/azureml/environment/environment-class-v1)
has a [PythonSection](https://aka.ms/azureml/environment/environment-python-section)
that contains a `user_managed_dependencies` bool and a `conda_dependencies` object
- If `user_managed_dependencies` is set to `True`, you're responsible for ensuring that all the necessary packages are available in the
Python environment in which you choose to run the script
- If `user_managed_dependencies` is set to `False` (the default), Azure ML will create a Python environment for you based on `conda_dependencies`.
The environment is built once and is reused as long as the conda dependencies remain unchanged
- You'll receive a *"missing conda dependencies"* error when `user_managed_dependencies` is set to `False` and you haven't provided a conda specification.
- See [how to create a conda file manually](https://aka.ms/azureml/environment/how-to-create-conda-file)
- See [CondaDependencies class](https://aka.ms/azureml/environment/conda-dependencies-class)
- See [how to set a conda specification on the environment definition](https://aka.ms/azureml/environment/set-conda-spec-on-environment-definition)

### Invalid conda dependencies
- Make sure the conda dependencies specified in your conda specification are formatted correctly
- See [how to create a conda file manually](https://aka.ms/azureml/environment/how-to-create-conda-file)

### Missing conda channels
- If no conda channels are specified, conda will use defaults that might change
- For reproducibility of your environment, specify channels from which to pull dependencies
- For more information, see [how to manage conda channels](https://aka.ms/azureml/environment/managing-conda-channels)

### Base conda environment not recommended
- Partial environment updates can lead to dependency conflicts and/or unexpected runtime errors,
so the use of base conda environments isn't recommended
- Instead, specify all packages needed for your environment in the `conda_dependencies` section of your
environment definition
    - See [from_conda_specification](https://aka.ms/azureml/environment/set-conda-spec-on-environment-definition)
    - See [CondaDependencies class](https://aka.ms/azureml/environment/conda-dependencies-class)
- If you're using V2, add a conda specification to your [build context](https://aka.ms/azureml/environment/environment-build-context)

### Unpinned dependencies
- For reproducibility, specify dependency versions for the packages in your conda specification
- If versions aren't specified, there's a chance that the conda or pip package resolver will choose a different
version of a package on subsequent builds of an environment. This behavior can lead to unexpected errors
- See [conda package pinning](https://aka.ms/azureml/environment/how-to-pin-conda-packages)

### *Pip issues*
### Pip not specified
- For reproducibility, pip should be specified as a dependency in your conda specification, and it should be pinned
- See [how to set a conda dependency](https://aka.ms/azureml/environment/add-conda-package-v1)

### Pip not pinned
- For reproducibility, specify the pip resolver version in your conda dependencies
- If the pip version isn't specified, there's a chance different versions of pip will be used on subsequent
image builds on the environment
    - This behavior could cause the build to fail if the different pip versions resolve your packages differently
    - To avoid this issue and to achieve reproducibility of your environment, specify the pip version
- See [conda package pinning](https://aka.ms/azureml/environment/how-to-pin-conda-packages)
- See [how to set pip as a dependency](https://aka.ms/azureml/environment/add-conda-package-v1)

### *Deprecated environment property issues*
### R section is deprecated
- The Azure Machine Learning SDK for R will be deprecated by the end of 2021 to make way for an improved R training and deployment
experience using Azure Machine Learning CLI 2.0
- See the [samples repository](https://aka.ms/azureml/environment/train-r-models-cli-v2) to get started with the edition CLI 2.0.

## **Image build problems**

### *Miscellaneous issues*
### Build log unavailable
- Build logs are optional and not available for all environments since the image might already exist

### ACR unreachable
<!--issueDescription-->
This issue can happen by failing to access a workspace's associated Azure Container Registry (ACR) resource.

**Potential causes:**
* Workspace's ACR is behind a virtual network (VNet) (private endpoint or service endpoint), and no compute cluster is used to build images.
* Workspace's ACR is behind a virtual network (private endpoint or service endpoint), and the compute cluster used for building images have no access to the workspace's ACR.

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
* Pipeline job failures
* Model deployment failures
<!--/issueDescription-->

**Troubleshooting steps**

*Applies to: Python SDK azureml V1*

Update the workspace image build compute property using SDK:

```
from azureml.core import Workspace
ws = Workspace.from_config()
ws.update(image_build_compute = 'mycomputecluster')
```

*Applies to: Azure CLI extensions V1 & V2*

Update the workspace image build compute property using Azure CLI:

```
az ml workspace update --name myworkspace --resource-group myresourcegroup --image-build-compute mycomputecluster
```

> [!NOTE]
> * Only Azure Machine Learning compute clusters are supported. Compute, Azure Kubernetes Service (AKS), or other instance types are not supported for image build compute.
> * Make sure the compute cluster's VNet that's used for the image build compute has access to the workspace's ACR.
> * Make sure the compute cluster is CPU based.

**Resources**
* [Enable Azure Container Registry (ACR)](https://aka.ms/azureml/environment/acr-private-endpoint)
* [How To Use Environments](https://aka.ms/azureml/environment/how-to-use-environments)

### *Docker pull issues*
### Failed to pull Docker image
<!--issueDescription-->
This issue can happen when a Docker image pull fails during an image build.

**Potential causes:**
* The path name to the container registry is incorrect
* A container registry behind a virtual network is using a private endpoint in an [unsupported region](https://aka.ms/azureml/environment/private-link-availability)
* The image you're trying to reference doesn't exist in the container registry you specified 
* You haven't provided credentials for a private registry you're trying to pull the image from, or the provided credentials are incorrect

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

If you suspect that the path name to your container registry is incorrect
* For a registry `my-registry.io` and image `test/image` with tag `3.2`, a valid image path would be `my-registry.io/test/image:3.2`
* See [registry path documentation](https://aka.ms/azureml/environment/docker-registries)

If your container registry is behind a virtual network and is using a private endpoint in an [unsupported region](https://aka.ms/azureml/environment/private-link-availability)
* Configure the container registry by using the service endpoint (public access) from the portal and retry
* After you put the container registry behind a virtual network, run the [Azure Resource Manager template](https://aka.ms/azureml/environment/secure-resources-using-vnet) so the workspace can communicate with the container registry instance

If the image you're trying to reference doesn't exist in the container registry you specified
* Check that the correct tag is used and that `user_managed_dependencies` is set to `True`. Setting [user_managed_dependencies](https://aka.ms/azureml/environment/environment-python-section) to `True` disables conda and uses the user's installed packages

If you haven't provided credentials for a private registry you're trying to pull from, or the provided credentials are incorrect
* Set [workspace connections](https://aka.ms/azureml/environment/set-connection-v1) for the container registry if needed

### I/O Error
<!--issueDescription-->
This issue can happen when a Docker image pull fails due to a network issue.  

**Potential causes:**
* Network connection issue, which could be temporary
* Firewall is blocking the connection
* ACR is unreachable and there's network isolation. For more details, see [ACR unreachable](#acr-unreachable). 

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**  

Add the host to the firewall rules  
* See [configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md) to learn how to use Azure Firewall for your workspace and resources behind a VNet

Assess your workspace set-up. Are you using a virtual network, or are any of the resources you're trying to access during your image build behind a virtual network?
* Ensure that you've followed the steps in this article on [securing a workspace with virtual networks](https://aka.ms/azureml/environment/acr-private-endpoint)
* Azure Machine Learning requires both inbound and outbound access to the public internet. If there's a problem with your virtual network setup, there might be an issue with accessing certain repositories required during your image build  

If you aren't using a virtual network, or if you've configured it correctly
* Try rebuilding your image. If the timeout was due to a network issue, the problem might be transient, and a rebuild could fix the problem

### *Conda issues during build*
### Bad spec
<!--issueDescription-->
This issue can happen when a package listed in your conda specification is invalid or when a conda command is executed incorrectly.

**Potential causes:**
* The syntax you used in your conda specification is incorrect
* You're executing a conda command incorrectly

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

Conda spec errors can happen when the conda create command is used incorrectly
* Read the [documentation](https://aka.ms/azureml/environment/conda-create) and ensure that you're using valid options and syntax
* There's known confusion regarding `conda env create` versus `conda create`. You can read more about conda's response and other users' known solutions [here](https://aka.ms/azureml/environment/conda-env-create-known-issue)

To ensure a successful build, ensure that you're using proper syntax and valid package specification in your conda yaml
* See [package match specifications](https://aka.ms/azureml/environment/conda-package-match-specifications) and [how to create a conda file manually](https://aka.ms/azureml/environment/how-to-create-conda-file)

### Communications error
<!--issueDescription-->
This issue can happen when there's a failure in communicating with the entity from which you wish to download packages listed in your conda specification.

**Potential causes:**
* Failed to communicate with a conda channel or a package repository
* These failures may be due to transient network failures 

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

Ensure that the conda channels/repositories you're using in your conda specification are correct
* Check that they exist and are spelled correctly

If the conda channels/repositories are correct
* Try to rebuild the image--there's a chance that the failure is transient, and a rebuild might fix the issue
* Check to make sure that the packages listed in your conda specification exist in the channels/repositories you specified

### Compile error
<!--issueDescription-->
This issue can happen when there's a failure building a package required for the conda environment due to a compiler error.

**Potential causes:**
* A package was spelled incorrectly and therefore wasn't recognized
* There's something wrong with the compiler

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

If you're using a compiler
* Ensure that the compiler you're using is recognized
* If needed, add an installation step to your Dockerfile
* Verify the version of your compiler and check that all commands or options you're using are compatible with the compiler version
* If necessary, upgrade your compiler version

Ensure that all packages you've listed are spelled correctly and that any pinned versions are correct

**Resources**
* [Dockerfile reference on running commands](https://docs.docker.com/engine/reference/builder/#run)
* [Example compiler issue](https://stackoverflow.com/questions/46504700/gcc-compiler-not-recognizing-fno-plt-option)

### Missing command
<!--issueDescription-->
This issue can happen when a command isn't recognized during an image build.

**Potential causes:**
* The command wasn't spelled correctly
* The command can't be executed because a required package isn't installed

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

* Ensure that the command is spelled correctly
* Ensure that any package needed to execute the command you're trying to perform is installed
* If needed, add an installation step to your Dockerfile

**Resources**
* [Dockerfile reference on running commands](https://docs.docker.com/engine/reference/builder/#run)

### Conda timeout
<!--issueDescription-->
This issue can happen when conda package resolution takes too long to complete.

**Potential causes:**
* There's a large number of packages listed in your conda specification and unnecessary packages are included
* You haven't pinned your dependencies (you included tensorflow instead of tensorflow=2.8)
* You've listed packages for which there's no solution (you included package X=1.3 and Y=2.8, but X's version is incompatible with Y's version)

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**
* Remove any packages from your conda specification that are unnecessary
* Pin your packages--environment resolution will be faster
* If you're still having issues, review this article for an in-depth look at [understanding and improving conda's performance](https://aka.ms/azureml/environment/improve-conda-performance)

### Out of memory
<!--issueDescription-->
This issue can happen when conda package resolution fails due to available memory being exhausted.

**Potential causes:**
* There's a large number of packages listed in your conda specification and unnecessary packages are included
* You haven't pinned your dependencies (you included tensorflow instead of tensorflow=2.8)
* You've listed packages for which there's no solution (you included package X=1.3 and Y=2.8, but X's version is incompatible with Y's version)

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**
* Remove any packages from your conda specification that are unnecessary
* Pin your packages--environment resolution will be faster
* If you're still having issues, review this article for an in-depth look at [understanding and improving conda's performance](https://aka.ms/azureml/environment/improve-conda-performance)

### Package not found
<!--issueDescription-->
This issue can happen when one or more conda packages listed in your specification can't be found in a channel/repository.

**Potential causes:**
* The package's name or version was listed incorrectly in your conda specification 
* The package exists in a conda channel that you didn't list in your conda specification

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**
* Ensure that the package is spelled correctly and that the specified version exists
* Ensure that the package exists on the channel you're targeting
* Ensure that the channel/repository is listed in your conda specification so the package can be pulled correctly during package resolution

Specify channels in your conda specification:

```
channels:
  - conda-forge
  - anaconda
dependencies:
  - python=3.8
  - tensorflow=2.8
Name: my_environment
```

**Resources**
* [Managing channels](https://aka.ms/azureml/environment/managing-conda-channels)

### Missing Python module
<!--issueDescription-->
This issue can happen when a Python module listed in your conda specification doesn't exist or isn't valid.

**Potential causes:**
* The module was spelled incorrectly
* The module isn't recognized

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**
* Ensure that the module is spelled correctly and exists
* Check to make sure that the module is compatible with the Python version you've specified in your conda specification
* If you haven't listed a specific Python version in your conda specification, make sure to list a specific version that's compatible with your module otherwise a default may be used that isn't compatible

Pin a Python version that's compatible with the pip module you're using:
```
channels:
  - conda-forge
  - anaconda
dependencies:
  - python=3.8
  - pip:
    - dataclasses
Name: my_environment
```

### No matching distribution 
<!--issueDescription-->
This issue can happen when there's no package found that matches the version you specified.

**Potential causes:**
* The package name was spelled incorrectly
* The package and version can't be found on the channels or feeds that you specified
* The version you specified doesn't exist

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

* Ensure that the package is spelled correctly and exists
* Ensure that the version you specified for the package exists
* Ensure that you've specified the channel from which the package will be installed. If you don't specify a channel, defaults will be used and those defaults may or may not have the package you're looking for

How to list channels in a conda yaml specification:

```
channels:
	- conda-forge
	- anaconda
dependencies:
	- python = 3.8
	- tensorflow = 2.8
Name: my_environment
```

**Resources**
* [Managing channels](https://aka.ms/azureml/environment/managing-conda-channels)
* [pypi](https://aka.ms/azureml/environment/pypi)

### Can't build mpi4py
<!--issueDescription-->
This issue can happen when building wheels for mpi4py fails.

**Potential causes:**
* Requirements for a successful mpi4py installation aren't met
* There's something wrong with the method you've chosen to install mpi4py

**Affected areas (symptoms):**
* Failure in building environments from UI, SDK, and CLI.
* Failure in running jobs because it will implicitly build the environment in the first step.
<!--/issueDescription-->

**Troubleshooting steps**

Ensure that you have a working MPI installation (preference for MPI-3 support and for MPI being built with shared/dynamic libraries) 
* See [mpi4py installation](https://aka.ms/azureml/environment/install-mpi4py)
* If needed, follow these [steps on building MPI](https://mpi4py.readthedocs.io/en/stable/appendix.html#building-mpi-from-sources)

Ensure that you're using a compatible python version
* Python 2.5 or 3.5+ is required, but Python 3.7+ is recommended
* See [mpi4py installation](https://aka.ms/azureml/environment/install-mpi4py)

**Resources**
* [mpi4py installation](https://aka.ms/azureml/environment/install-mpi4py)

### Interactive auth was attempted
- Failed to create or update the conda environment because pip attempted interactive authentication 
- Instead, provide authentication via [workspace connection](https://aka.ms/azureml/environment/set-connection-v1)

### Forbidden blob
- Failed to create or update the conda environment because a blob contained in the associated storage account was inaccessible
- Either open up permissions on the blob or add/replace the SAS token in the URL

### Horovod build
- Failed to create or update the conda environment because horovod failed to build
- See [horovod installation](https://aka.ms/azureml/environment/install-horovod)

### Conda command not found
- Failed to create or update the conda environment because the conda command is missing 
- For system-managed environments, conda should be in the path in order to create the user's environment
from the provided conda specification

### Incompatible Python version
- Failed to create or update the conda environment because a package specified in the conda environment isn't compatible with the specified python version
- Update the Python version or use a different version of the package

### Conda bare redirection
- Failed to create or update the conda environment because a package was specified on the command line using ">" or "<"
without using quotes. Consider adding quotes around the package specification

### *Pip issues during build*
### Failed to install packages
- Failed to install Python packages
- Review the image build log for more information on this error

### Can't uninstall package
- Pip failed to uninstall a Python package that was installed via the OS's package manager
- Consider creating a separate environment using conda instead
