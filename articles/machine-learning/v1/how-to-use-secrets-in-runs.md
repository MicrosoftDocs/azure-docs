---
title: Authentication secrets in training
titleSuffix: Azure Machine Learning
description: Learn how to pass secrets to training jobs in secure fashion using the Azure Key Vault for your workspace.
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.date: 11/16/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022
---

# Use authentication credential secrets in Azure Machine Learning training jobs

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, you learn how to use secrets in training jobs securely. Authentication information such as your user name and password are secrets. For example, if you connect to an external database in order to query training data, you would need to pass your username and password to the remote job context. Coding such values into training scripts in cleartext is insecure as it would expose the secret. 

Instead, your Azure Machine Learning workspace has an associated resource called a [Azure Key Vault](../../key-vault/general/overview.md). Use this Key Vault to pass secrets to remote jobs securely through a set of APIs in the Azure Machine Learning Python SDK.

The standard flow for using secrets is:
 1. On local computer, log in to Azure and connect to your workspace.
 2. On local computer, set a secret in Workspace Key Vault.
 3. Submit a remote job.
 4. Within the remote job, get the secret from Key Vault and use it.

## Set secrets

In the Azure Machine Learning, the [Keyvault](/python/api/azureml-core/azureml.core.keyvault.keyvault) class contains methods for setting secrets. In your local Python session, first obtain a reference to your workspace Key Vault, and then use the [`set_secret()`](/python/api/azureml-core/azureml.core.keyvault.keyvault#set-secret-name--value-) method to set a secret by name and value. The __set_secret__ method updates the secret value if the name already exists.

```python
from azureml.core import Workspace
from azureml.core import Keyvault
import os


ws = Workspace.from_config()
my_secret = os.environ.get("MY_SECRET")
keyvault = ws.get_default_keyvault()
keyvault.set_secret(name="mysecret", value = my_secret)
```

Do not put the secret value in your Python code as it is insecure to store it in file as cleartext. Instead, obtain the secret value from an environment variable, for example Azure DevOps build secret, or from interactive user input.

You can list secret names using the [`list_secrets()`](/python/api/azureml-core/azureml.core.keyvault.keyvault#list-secrets--) method and there is also a batch version,[set_secrets()](/python/api/azureml-core/azureml.core.keyvault.keyvault#set-secrets-secrets-batch-) that allows you to set multiple secrets at a time.

> [!IMPORTANT]
> Using `list_secrets()` will only list secrets created through `set_secret()` or `set_secrets()` using the Azure Machine Learning SDK. It will not list secrets created by something other than the SDK. For example, a secret created using the Azure portal or Azure PowerShell will not be listed.
> 
> You can use [`get_secret()`](#get-secrets) to get a secret value from the key vault, regardless of how it was created. So you can retrieve secrets that are not listed by `list_secrets()`.

## Get secrets

In your local code, you can use the [`get_secret()`](/python/api/azureml-core/azureml.core.keyvault.keyvault#get-secret-name-) method to get the secret value by name.

For jobs submitted the [`Experiment.submit`](/python/api/azureml-core/azureml.core.experiment.experiment#submit-config--tags-none----kwargs-)  , use the [`get_secret()`](/python/api/azureml-core/azureml.core.run.run#get-secret-name-) method with the [`Run`](/python/api/azureml-core/azureml.core.run%28class%29) class. Because a submitted run is aware of its workspace, this method shortcuts the Workspace instantiation and returns the secret value directly.

```python
# Code in submitted job
from azureml.core import Experiment, Run

run = Run.get_context()
secret_value = run.get_secret(name="mysecret")
```

Be careful not to expose the secret value by writing or printing it out.

There is also a batch version, [get_secrets()](/python/api/azureml-core/azureml.core.run.run#get-secrets-secrets-) for accessing multiple secrets at once.

## Next steps

 * [View example notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/manage-azureml-service/authentication-in-azureml/authentication-in-azureml.ipynb)
 * [Learn about enterprise security with Azure Machine Learning](../concept-enterprise-security.md)