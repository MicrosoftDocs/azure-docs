---
title: Use private Python packages 
titleSuffix: Azure Machine Learning
description: Learn how to securely work with private Python packages from your Azure Machine Learning environments.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: laobri
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 10/21/2021
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022, devx-track-python
---

# Use private Python packages with Azure Machine Learning

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, learn how to use private Python packages securely within Azure Machine Learning. Use cases for private Python packages include:

 * You've developed a private package that you don't want to share publicly.
 * You want to use a curated repository of packages stored within an enterprise firewall.

The recommended approach depends on whether you have few packages for a single Azure Machine Learning workspace, or an entire repository of packages for all workspaces within an organization.

The private packages are used through [Environment](/python/api/azureml-core/azureml.core.environment.environment) class. Within an environment, you declare which Python packages to use, including private ones. To learn about environment in Azure Machine Learning in general, see [How to use environments](how-to-use-environments.md). 

## Prerequisites

 * The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install)
 * An [Azure Machine Learning workspace](../quickstart-create-resources.md)

## Use small number of packages for development and testing

For a small number of private packages for a single workspace, use the static [`Environment.add_private_pip_wheel()`](/python/api/azureml-core/azureml.core.environment.environment#add-private-pip-wheel-workspace--file-path--exist-ok-false-) method. This approach allows you to quickly add a private package to the workspace, and is well suited for development and testing purposes.

Point the file path argument to a local wheel file and run the ```add_private_pip_wheel``` command. The command returns a URL used to track the location of the package within your Workspace. Capture the storage URL and pass it the `add_pip_package()` method.

```python
whl_url = Environment.add_private_pip_wheel(workspace=ws,file_path = "my-custom.whl")
myenv = Environment(name="myenv")
conda_dep = CondaDependencies()
conda_dep.add_pip_package(whl_url)
myenv.python.conda_dependencies=conda_dep
```

Internally, Azure Machine Learning service replaces the URL by secure SAS URL, so your wheel file is kept private and secure.

## Use a repository of packages from Azure DevOps feed

If you're actively developing Python packages for your machine learning application, you can host them in an Azure DevOps repository as artifacts and publish them as a feed. This approach allows you to integrate the DevOps workflow for building packages with your Azure Machine Learning Workspace. To learn how to set up Python feeds using Azure DevOps, read [Get Started with Python Packages in Azure Artifacts](/azure/devops/artifacts/quickstarts/python-packages)

This approach uses Personal Access Token to authenticate against the repository. The same approach is applicable to other repositories
with token based authentication, such as private GitHub repositories. 

 1. [Create a Personal Access Token (PAT)](/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?tabs=preview-page#create-a-pat) for your Azure DevOps instance. Set the scope of the token to __Packaging > Read__. 

 2. Add the Azure DevOps URL and PAT as workspace properties, using the [Workspace.set_connection](/python/api/azureml-core/azureml.core.workspace.workspace#set-connection-name--category--target--authtype--value-) method.

     ```python
    from azureml.core import Workspace
    
    pat_token = input("Enter secret token")
    ws = Workspace.from_config()
    ws.set_connection(name="connection-1", 
        category = "PythonFeed",
        target = "https://pkgs.dev.azure.com/<MY-ORG>", 
        authType = "PAT", 
        value = pat_token) 
     ```

 3. Create an Azure Machine Learning environment and add Python packages from the feed.
    
    ```python
    from azureml.core import Environment
    from azureml.core.conda_dependencies import CondaDependencies
    
    env = Environment(name="my-env")
    cd = CondaDependencies()
    cd.add_pip_package("<my-package>")
    cd.set_pip_option("--extra-index-url https://pkgs.dev.azure.com/<MY-ORG>/_packaging/<MY-FEED>/pypi/simple")")
    env.python.conda_dependencies=cd
    ```

The environment is now ready to be used in training runs or web service endpoint deployments. When building the environment, Azure Machine Learning service uses the PAT to authenticate against the feed with the matching base URL.

## Use a repository of packages from private storage

You can consume packages from an Azure storage account within your organization's firewall. The storage account can hold a curated set of packages or an internal mirror of publicly available packages.

To set up such private storage, see [Secure an Azure Machine Learning workspace and associated resources](../how-to-secure-workspace-vnet.md#secure-azure-storage-accounts). You must also [place the Azure Container Registry (ACR) behind the VNet](../how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

> [!IMPORTANT]
> You must complete this step to be able to train or deploy models using the private package repository.

After completing these configurations, you can reference the packages in the Azure Machine Learning environment definition by their full URL in Azure blob storage.

## Next steps

 * Learn more about [enterprise security in Azure Machine Learning](../concept-enterprise-security.md)
