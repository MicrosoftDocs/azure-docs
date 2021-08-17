---
title: Troubleshoot environment images
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot issues with environment image builds and package installations.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: saachigopal
ms.author:  sagopal
ms.date: 07/27/2021
ms.topic: troubleshooting
ms.custom: devx-track-python
---
# Troubleshoot environment image builds

Learn how to troubleshoot issues with Docker environment image builds and package installations.

## Prerequisites

* An Azure subscription. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* The [Azure Machine Learning SDK](/python/api/overview/azure/ml/install).
* The [Azure CLI](/cli/azure/install-azure-cli).
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To debug locally, you must have a working Docker installation on your local system.

## Docker image build failures
 
For most image build failures, you'll find the root cause in the image build log.
Find the image build log from the Azure Machine Learning portal (20\_image\_build\_log.txt) or from your Azure Container Registry task run logs.
 
It's usually easier to reproduce errors locally. Check the kind of error and try one of the following `setuptools`:

- Install a conda dependency locally: `conda install suspicious-dependency==X.Y.Z`.
- Install a pip dependency locally: `pip install suspicious-dependency==X.Y.Z`.
- Try to materialize the entire environment: `conda create -f conda-specification.yml`.

> [!IMPORTANT]
> Make sure that the platform and interpreter on your local compute cluster match the ones on the remote compute cluster. 

### Timeout 
 
The following network issues can cause timeout errors:

- Low internet bandwidth
- Server issues
- Large dependencies that can't be downloaded with the given conda or pip timeout settings
 
Messages similar to the following examples will indicate the issue:
 
```
('Connection broken: OSError("(104, \'ECONNRESET\')")', OSError("(104, 'ECONNRESET')"))
```
```
ReadTimeoutError("HTTPSConnectionPool(host='****', port=443): Read timed out. (read timeout=15)",)
```

If you get an error message, try one of the following possible solutions:
 
- Try a different source, such as mirrors, Azure Blob Storage, or other Python feeds, for the dependency.
- Update conda or pip. If you're using a custom Docker file, update the timeout settings.
- Some pip versions have known issues. Consider adding a specific version of pip to the environment dependencies.

### Package not found

The following errors are most common for image build failures:

- Conda package couldn't be found:

   ```
   ResolvePackageNotFound: 
   - not-existing-conda-package
   ```

- Specified pip package or version couldn't be found:

   ```
   ERROR: Could not find a version that satisfies the requirement invalid-pip-package (from versions: none)
   ERROR: No matching distribution found for invalid-pip-package
   ```

- Bad nested pip dependency:

   ```
   ERROR: No matching distribution found for bad-package==0.0 (from good-package==1.0)
   ```

Check that the package exists on the specified sources. Use [pip search](https://pip.pypa.io/en/stable/reference/pip_search/) to verify pip dependencies:

- `pip search azureml-core`

For conda dependencies, use [conda search](https://docs.conda.io/projects/conda/en/latest/commands/search.html):

- `conda search conda-forge::numpy`

For more options, try:
- `pip search -h`
- `conda search -h`

#### Installer notes

Make sure that the required distribution exists for the specified platform and Python interpreter version.

For pip dependencies, go to `https://pypi.org/project/[PROJECT NAME]/[VERSION]/#files` to see if the required version is available. Go to https://pypi.org/project/azureml-core/1.11.0/#files to see an example.

For conda dependencies, check the package on the channel repository.
For channels maintained by Anaconda, Inc., check the [Anaconda Packages page](https://repo.anaconda.com/pkgs/).

### Pip package update

During an installation or an update of a pip package, the resolver might need to update an already-installed package to satisfy the new requirements.
Uninstallation can fail for various reasons related to the pip version or the way the dependency was installed.
The most common scenario is that a dependency installed by conda couldn't be uninstalled by pip.
For this scenario, consider uninstalling the dependency by using `conda remove mypackage`.

```
  Attempting uninstall: mypackage
    Found existing installation: mypackage X.Y.Z
ERROR: Cannot uninstall 'mypackage'. It is a distutils installed project and thus we cannot accurately determine which files belong to it which would lead to only a partial uninstall.
``` 
### Installer issues

Certain installer versions have issues in the package resolvers that can lead to a build failure.

If you're using a custom base image or Dockerfile, we recommend using conda version 4.5.4 or later.

A pip package is required to install pip dependencies. If a version isn't specified in the environment, the latest version will be used.
We recommend using a known version of pip to avoid transient issues or breaking changes that the latest version of the tool might cause.

Consider pinning the pip version in your environment if you see the following message:

   ```
   Warning: you have pip-installed dependencies in your environment file, but you do not list pip itself as one of your conda dependencies. Conda may not use the correct pip to install your packages, and they may end up in the wrong place. Please add an explicit pip dependency. I'm adding one for you, but still nagging you.
   ```

Pip subprocess error:
   ```
   ERROR: THESE PACKAGES DO NOT MATCH THE HASHES FROM THE REQUIREMENTS FILE. If you have updated the package versions, update the hashes as well. Otherwise, examine the package contents carefully; someone may have tampered with them.
   ```

Pip installation can be stuck in an infinite loop if there are unresolvable conflicts in the dependencies. 
If you're working locally, downgrade the pip version to < 20.3. 
In a conda environment created from a YAML file, you'll see this issue only if conda-forge is the highest-priority channel. To mitigate the issue, explicitly specify pip < 20.3 (!=20.3 or =20.2.4 pin to other version) as a conda dependency in the conda specification file.

### ModuleNotFoundError: No module named 'distutils.dir_util'

When setting up your environment, sometimes you'll run into the issue **ModuleNotFoundError: No module named 'distutils.dir_util'**. To fix it, run the following command:

```bash
apt-get install -y --no-install-recommends python3 python3-distutils && \
ln -sf /usr/bin/python3 /usr/bin/python
```

When working with a Dockerfile, run it as part of a RUN command.

```dockerfile
RUN apt-get update && \
  apt-get install -y --no-install-recommends python3 python3-distutils && \
  ln -sf /usr/bin/python3 /usr/bin/python
```

Running this command installs the correct module dependencies to configure your environment. 

## Service-side failures

See the following scenarios to troubleshoot possible service-side failures.

### You're unable to pull an image from a container registry, or the address couldn't be resolved for a container registry

Possible issues:
- The path name to the container registry might not be resolving correctly. Check that image names use double slashes and the direction of slashes on Linux versus Windows hosts is correct.
- If a container registry behind a virtual network is using a private endpoint in [an unsupported region](../private-link/private-link-overview.md#availability), configure the container registry by using the service endpoint (public access) from the portal and retry.
- After you put the container registry behind a virtual network, run the [Azure Resource Manager template](./how-to-network-security-overview.md) so the workspace can communicate with the container registry instance.

### You get a 401 error from a workspace container registry

Resynchronize storage keys by using [ws.sync_keys()](/python/api/azureml-core/azureml.core.workspace.workspace#sync-keys--).

### The environment keeps throwing a "Waiting for other conda operations to finish…" error

When an image build is ongoing, conda is locked by the SDK client. If the process crashed or was canceled incorrectly by the user, conda stays in the locked state. To resolve this issue, manually delete the lock file. 

### Your custom Docker image isn't in the registry

Check if the [correct tag](./how-to-use-environments.md#create-an-environment) is used and that `user_managed_dependencies = True`. `Environment.python.user_managed_dependencies = True` disables conda and uses the user's installed packages.

### You get one of the following common virtual network issues

- Check that the storage account, compute cluster, and container registry are all in the same subnet of the virtual network.
- When your container registry is behind a virtual network, it can't directly be used to build images. You'll need to use the compute cluster to build images.
- Storage might need to be placed behind a virtual network if you:
    - Use inferencing or private wheel.
    - See 403 (not authorized) service errors.
    - Can't get image details from Azure Container Registry.

### The image build fails when you're trying to access network protected storage

- Azure Container Registry tasks don't work behind a virtual network. If the user has their container registry behind a virtual network, they need to use the compute cluster to build an image.
- Storage should be behind a virtual network in order to pull dependencies from it.

### You can't run experiments when storage has network security enabled

If you're using default Docker images and enabling user-managed dependencies, use the MicrosoftContainerRegistry and AzureFrontDoor.FirstParty [service tags](./how-to-network-security-overview.md) to allowlist Azure Container Registry and its dependencies.

 For more information, see [Enabling virtual networks](./how-to-network-security-overview.md).

### You need to create an ICM

When you're creating/assigning an ICM to Metastore, include the CSS support ticket so that we can better understand the issue.

## Next steps

- [Train a machine learning model to categorize flowers](how-to-train-scikit-learn.md)
- [Train a machine learning model by using a custom Docker image](how-to-train-with-custom-image.md)
