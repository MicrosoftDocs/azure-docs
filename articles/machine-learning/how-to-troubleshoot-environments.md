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

Curated environments are pre-created environments that are managed by Azure Machine Learning (AzureML) and are available by default in every workspace provisioned. ```

Intended to be used as is, they contain collections of Python packages and settings to help you get started with various machine learning frameworks.
These pre-created environments also allow for faster deployment time.

In user-managed environments, you're responsible for setting up your environment and installing every package that your training script needs on the compute target.
Also be sure to include any dependencies needed for model deployment.
These types of environments are represented by two subtypes, BYOC (bring your own container) – a Docker image user brings to AzureML and Docker build context based environment where AzureML materializes the image from the user provided content.

You use system-managed environments when you want conda to manage the Python environment for you.
A new isolated conda environment is materialized from your conda specification on top of a base Docker image. By default, common properties are added to the derived image.
Note that environment isolation implies that Python dependencies installed in the base image won't be available in the derived image.

## Create and manage environments

You can create and manage environments from clients like AzureML Python SDK, AzureML CLI, AzureML Studio UI, VS code extension. 

"Anonymous" environments are automatically registered in your workspace when you submit an experiment without registering or referencing an already existing environment.
They won't be listed but may be retrieved by version or label.

AzureML builds environment definitions into Docker images.
It also caches the environments in Azure Container Registry associated with your AzureML Workspace so they can be reused in subsequent training jobs and service endpoint deployments.
Multiple environments with the same definition may result the same image, so the cached image will be reused.
Running a training script remotely requires the creation of a Docker image.

## Reproducibility and vulnerabilities

Over time vulnerabilities are discovered and Docker images that correspond to AzureML environments may be flagged by the scanning tools.
Updates for AzureML based images are released regularly, with a commitment of no unpatched vulnerabilities older than 30 days in the latest version of the image.
It's your responsibility to evaluate the threat and address vulnerabilities in environments.
Not all the vulnerabilities are exploitable, so you need to use your judgment when choosing between reproducibility and resolving vulnerabilities.
> [!IMPORTANT]
> There's no guarantee that the same set of python dependencies will be materialized with an image rebuild or for a new environment with the same set of Python dependencies. 

## **Environment definition problems**

### *Environment name issues*
### Curated prefix not allowed
Terminology:  

"Curated": environments Microsoft creates and maintains.  

"Custom": environments you create and maintain.

- The name of your custom environment uses terms reserved only for curated environments
- Don't start your environment name with *Microsoft* or *AzureML*--these prefixes are reserved for curated environments
- To customize a curated environment, you must clone and rename the environment
- For more information about proper curated environment usage, see [create and manage reusable environments](https://aka.ms/azureml/environment/create-and-manage-reusable-environments)

### Environment name is too long
- Environment names can be up to 255 characters in length
- Consider renaming and shortening your environment name

### *Docker issues*
To create a new environment, you must use one of the following approaches:
1. Base image
    - Provide base image name, repository from which to pull it, credentials if needed
    - Provide a conda specification
2. Base Dockerfile (V1 only, Deprecated)
    - Provide a Dockerfile
    - Provide a conda specification
3. Docker build context
    - Provide the location of the build context (URL)
    - The build context must contain at least a Dockerfile, but may contain other files as well


### Missing Docker definition
- An environment has a `DockerSection` that must be populated with either a base image, base Dockerfile, or build context
- This section configures settings related to the final Docker image built to the specifications of the environment and whether to use Docker containers to build the environment
- See [DockerSection](https://aka.ms/azureml/environment/environment-docker-section)

### Missing Docker build context location
- If you're specifying a Docker build context as part of your environment build, you must provide the path of the build context directory
- See [BuildContext](https://aka.ms/azureml/environment/build-context-class)

### Too many Docker options
Only one of the following options can be specified:

*V1*
- `base_image`
- `base_dockerfile`
- `build_context`
- See [DockerSection](https://aka.ms/azureml/environment/docker-section-class)

*V2*
- `image`
- `build`
- See [azure.ai.ml.entities.Environment](https://aka.ms/azureml/environment/environment-class-v2)

### Missing Docker option
*V1*
- You must specify one of: base image, base Dockerfile, or build context

*V2:*
- You must specify one of: image or build context

### Container registry credentials missing either username or password
- To access the base image in the container registry specified, you must provide both a username and password. One is missing.
- Note that providing credentials in this way is deprecated. For the current method of providing credentials, see the *secrets in base image registry* section.

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
- Historically, credentials have been specified in the environment definition. However, this isn't secure and should be 
avoided.
- Users should set credentials using workspace connections. For instructions on how to 
do this, see [set_connection](https://aka.ms/azureml/environment/set-connection-v1) 

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
- The specified Dockerfile can't exceed the maximum Dockerfile size of 100KB
- Consider shortening your Dockerfile to get it under this limit

### *Docker build context issues*
### Missing Dockerfile path
- In the Docker build context, a Dockerfile path must be specified
- This is the path to the Dockerfile relative to the root of Docker build context directory
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
- A Python version can be added by adding Python as a conda package, specifying the version (this is specific to SDK V1):

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
- Consider using a newer version of Python as the specified version will eventually unsupported
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
- See [how to manage conda channels](https://aka.ms/azureml/environment/managing-conda-channels)
for more information

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
version of a package on subsequent builds of an environment. This can lead to unexpected errors and incorrect behavior
- See [conda package pinning](https://aka.ms/azureml/environment/how-to-pin-conda-packages)

### *Pip issues*
### Pip not specified
- For reproducibility, pip should be specified as a dependency in your conda specification, and it should be pinned
- See [how to set a conda dependency](https://aka.ms/azureml/environment/add-conda-package-v1)

### Pip not pinned
- For reproducibility, specify the pip resolver version in your conda dependencies
- If the pip version isn't specified, there's a chance different versions of pip will be used on subsequent
image builds on the environment
    - This could cause the build to fail if the different pip versions resolve your packages differently
    - To avoid this and to achieve reproducibility of your environment, specify the pip version
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
This can happen by failing to access a workspace's associated Azure Container Registry (ACR) resource.

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

**Note:**
* Only Azure Machine Learning compute clusters are supported. Compute, Azure Kubernetes Service (AKS), or other instance types are not supported for image build compute.
* Make sure the compute cluster's VNet that's used for the image build compute has access to the workspace's ACR.
* Make sure the compute cluster is CPU based.

**Resources**
* [Enable Azure Container Registry (ACR)](https://aka.ms/azureml/environment/acr-private-endpoint)
* [How To Use Environments](https://aka.ms/azureml/environment/how-to-use-environments)

### *Docker pull issues*
### Failed to pull Docker image
- Possible issues:
    - The path name to the container registry might not be resolving correctly
        - For a registry `my-registry.io` and image `test/image` with tag `3.2`, a valid image path would be `my-registry.io/test/image:3.2`
        - See [registry path documentation](https://aka.ms/azureml/environment/docker-registries)
    - If a container registry behind a virtual network is using a private endpoint in an [unsupported region](https://aka.ms/azureml/environment/private-link-availability),
     configure the container registry by using the service endpoint (public access) from the portal and retry
    - After you put the container registry behind a virtual network, run the [Azure Resource Manager template](https://aka.ms/azureml/environment/secure-resources-using-vnet)
     so the workspace can communicate with the container registry instance
    - The image you're trying to reference doesn't exist in the container registry you specified 
        - Check that the correct tag is used and that `user_managed_dependencies` is set to `True`. 
        Setting [user_managed_dependencies](https://aka.ms/azureml/environment/environment-python-section)
        to `True` disables conda and uses the user's installed packages.
    - You haven't provided credentials for a private registry you're trying to pull the image from, or the provided credentials are incorrect 
        - Set [workspace connections](https://aka.ms/azureml/environment/set-connection-v1) for the container registry if needed

### *Conda issues during build*
### Bad spec
- Failed to create or update the conda environment due to an invalid package specification
    - See [package match specifications](https://aka.ms/azureml/environment/conda-package-match-specifications)
    - See [how to create a conda file manually](https://aka.ms/azureml/environment/how-to-create-conda-file)

### Communications error
- Failed to communicate with a conda channel or package repository
- Retrying the image build may work if the issue is transient

### Compile error
- Failed to build a package required for the conda environment
- Another version of the failing package may work. If it doesn't, review the image build log, hunt for a solution, and update the environment definition.

### Missing command
- Failed to build a package required for the conda environment due to a missing command
- Identify the missing command from the image build log, determine how to add it to your image, and then update the environment definition.

### Conda timeout
- Failed to create or update the conda environment because it took too long
- Consider removing unnecessary packages and pinning specific versions
- See [understanding and improving conda's performance](https://aka.ms/azureml/environment/improve-conda-performance)

### Out of memory
- Failed to create or update the conda environment due to insufficient memory
- Consider removing unnecessary packages and pinning specific versions
- See [understanding and improving conda's performance](https://aka.ms/azureml/environment/improve-conda-performance)

### Package not found
- One or more packages specified in your conda specification couldn't be found
- Ensure that all packages you've specified exist, and can be found using the channels you've specified in your conda specification
- If you don't specify conda channels, conda will use defaults that are subject to change
    - For reproducibility, specify channels from which to pull dependencies
- See [managing channels](https://aka.ms/azureml/environment/managing-conda-channels)

### Missing Python module
- Check the Python modules specified in your environment definition and correct any misspellings or incorrect pinned versions.

### No matching distribution
- Failed to find Python package matching a specified distribution
- Search for the distribution you're looking for and ensure it exists: [pypi](https://aka.ms/azureml/environment/pypi)

### Cannot build mpi4py
- Failed to build wheel for mpi4py
- Review and update your build environment or use a different installation method
- See [mpi4py installation](https://aka.ms/azureml/environment/install-mpi4py)

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

### Cannot uninstall package
- Pip failed to uninstall a Python package that was installed via the OS's package manager
- Consider creating a separate environment using conda instead
