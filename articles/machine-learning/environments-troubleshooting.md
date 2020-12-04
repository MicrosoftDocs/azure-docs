---
title: Environments Troubleshooting
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot issues with environment image builds and package installations.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: saachigopal
ms.author:  sagopal
ms.date: 12/3/2020
ms.topic: troubleshooting
ms.custom: devx-track-python, deploy, contperfq2
---
# Troubleshoot environment builds
Learn how to troubleshoot issues with Docker image builds and package installations.

## Prerequisites

* An **Azure subscription**. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* The [Azure Machine Learning SDK](/python/api/overview/azure/ml/install?preserve-view=true&view=azure-ml-py).
* The [Azure CLI](/cli/azure/install-azure-cli?preserve-view=true&view=azure-cli-latest).
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To debug locally, you must have a working Docker installation on your local system.

## Docker Image Build Failures
 
For the majority of image build failures, the root cause can be found in the image build log.
You can find the image build log from the Azure Machine Learning portal (20\_image\_build\_log.txt) or from your ACR tasks runs logs
 
In most of the cases it is easy to reproduce error locally. Please check the kind of error and try one of the following setuptools:

- install conda dependency locally `conda install suspicious-dependency==X.Y.Z`
- install pip dependency locally `pip install suspicious-dependency==X.Y.Z`
- try to materialize the entire environment `conda create -f conda-specification.yml`

> [!NOTE]
> For a more confident check, please make sure that platform and interpreter on your local box match the ones on the remote. 

### Timeout 
 
Timeout issues can happen for various network issues
- Low internet bandwidth
- Server issues
- Large dependency that can't be downloaded with the given conda or pip timeout settings
 
Messages similar to the below will indicate the issue:
 
```
('Connection broken: OSError("(104, \'ECONNRESET\')")', OSError("(104, 'ECONNRESET')"))
```
```
ReadTimeoutError("HTTPSConnectionPool(host='****', port=443): Read timed out. (read timeout=15)",)
```

Possible solutions:
 
- Try a different source for the dependency if available such as mirrors, blob storage, other python feeds
- Update conda or pip then retry or if a custom docker file is used update the timeout settings
- Some pip versions have known issues, please consider adding a specific version of pip into environment dependencies 

### Package Not Found

This is the most common case of the image build failures.

- Conda package could not be found
```
ResolvePackageNotFound: 
  - not-existing-conda-package
```

Specified pip package or version could not be found
```
ERROR: Could not find a version that satisfies the requirement invalid-pip-package (from versions: none)
ERROR: No matching distribution found for invalid-pip-package
```

- Bad nested pip dependency
```
ERROR: No matching distribution found for bad-backage==0.0 (from good-package==1.0)
```

Please check package existance on the specified sources. Use [pip search](https://pip.pypa.io/en/stable/reference/pip_search/) to verify pip dependencies.

`pip search azureml-core`

For conda dependencies, use [conda search](https://docs.conda.io/projects/conda/en/latest/commands/search.html).

`conda search conda-forge::numpy`

For more options:
- `pip search -h`
- `conda search -h`

#### Installer Notes

Please make sure that needed distribution exists for the specified platform an python interpreter version

For pip dependencies, navigate to `https://pypi.org/project/[PROJECT NAME]/[VERSION]/#files` to see if required version is available. For example, https://pypi.org/project/azureml-core/1.11.0/#files

For conda dependencies, check package on the channel repository.
For channels maintaned by Anaconda, Inc. please check [here](https://repo.anaconda.com/pkgs/).

### Pip Package Update/Install Problems

It happens that during install or update of a pip package the resolver needs to update an already installed package to satisfy the new requirements.
Uninstall can fail for various reasons related to pip version or the way the dependency was installed.
The most common scenario is that a dependency installed by conda could not be uninstalled by pip.
For this scenario please consider uninstalling the dependency using `conda remove mypackage`.

```
  Attempting uninstall: mypackage
    Found existing installation: mypackage X.Y.Z
ERROR: Cannot uninstall 'mypackage'. It is a distutils installed project and thus we cannot accurately determine which files belong to it which would lead to only a partial uninstall.
``` 
### Installer issues

It happens that certain installer versions have issues in the package resolvers that can lead to a build failure.

If a custom base image or dockerfile is used, we recommend using conda version 4.5.4 or higher.

Pip package is required to install pip dependencies and if a version is not specified in the environment the latest version will be used.
We recommend using a known version of pip to avoid transient issues or breaking changes that can be caused by the latest version of the tool.

Please consider to pin the pip version in your environment if you see any of the messages below:

`Warning: you have pip-installed dependencies in your environment file, but you do not list pip itself as one of your conda dependencies. Conda may not use the correct pip to install your packages, and they may end up in the wrong place.  Please add an explicit pip dependency.  I'm adding one for you, but still nagging you.`

`Pip subprocess error:
ERROR: THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE. If you have updated the package versions, please update the hashes. Otherwise, examine the package contents carefully; someone may have tampered with them.`

## Service Side Failures

### Unable to pull image from MCR/Address could not be resolved for Container Registry.
Possible issues:
- Path name to CR may not be resolving correctly. Check that image names use double slashes and the direction of slashes on linux vs Windows hosts is correct
- If the ACR behind Vnet is using a private endpoint in [an unsupported region](https://docs.microsoft.com/azure/private-link/private-link-overview#availability), configure the ACR behind VNet using the service endpoint (Public access) from the portal and retry.
- After putting the ACR behind VNet, ensure that the [ARM template](https://docs.microsoft.com/azure/machine-learning/how-to-enable-virtual-network#azure-container-registry) is run. This enables the workspace to communicate with the ACR instance.

### 401 error from workspace ACR
- Resynchronize storage keys using [ws.sync_keys()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#sync-keys--)

### Environment keeps throwing "Waiting for other Conda operations to finish…" Error
- When an image build is ongoing, Conda is locked by the SDK client. If process crashed or was cancelled incorrectly by the customer - conda stays in the locked state. Manually delete the lock file. 

### Custom docker image not in registry
 - Check if the [correct tag](https://docs.microsoft.com/azure/machine-learning/how-to-use-environments#create-an-environment) is used and that user_managed_dependencies = True. Environment.python.user_managed_dependencies = True disables Conda and uses the user's installed packages.

### Common VNet issues

1. Check that storage account, compute cluster, and Azure Container Registry are all in the same subnet of the virtual network.
2. When ACR is behind a VNet, it can't directly be used to build images. The compute cluster needs to be used to build images.
3. Storage may need to be placed behind a VNet when:
    - using inferencing or private wheel
    - you're seeing 403 (not authorized) service errors
    - you can't get image details from ACR/MCR

### Image build fails when trying to access network protected storage
- ACR tasks do not work behind the VNet. If the user has their ACR behind the VNet, they need to use the compute cluster to build an image.
- Storage should be behind VNet in order to be able to pull dependencies from it. 

### Cannot run experiments when storage has network security enabled
- When using default Docker images and enabling user managed dependencies, you must use the MicrosoftContainerRegistry and AzureFrontDoor.FirstParty [service tags](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-enable-virtual-network) to whitelist MCR and its dependencies.

 See [enabling VNET](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-enable-virtual-network#azure-container-registry) for more.

### Premium ACR

Private ACR feature that is fully supported by EMS. With premium ACR for non-admin users with repository-scoped access token for get manifest operation ACR returns 401.
The feature itself is in Preview mode, that is stated on their [doc page](https://docs.microsoft.com/azure/container-registry/container-registry-repository-scoped-permissions).

Customer can mitigate the issue on their side, expanding the repository-scoped permissions or use custom dockerfile.
Documentation and samples for base dockerfile can be found under the links
https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.dockersection?view=azure-ml-py
https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/using-environments/using-environments.ipynb

To mitigate with custom dockerfile please use

```python
myenv = Environment("sample")
myenv.docker.base_dockerfile="FROM adminacr.azurecr.io/repo/shared/with/me:latest"
```

### Creating an ICM

When creating/assigning an ICM to Metastore please include the CSS support ticket so that we can better understand the issue.
