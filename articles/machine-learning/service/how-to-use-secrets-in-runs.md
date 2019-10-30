---
title: Use secrets in training runs
titleSuffix: Azure Machine Learning
description: Pass secrets to training runs in secure fashion using Workspace Key Vault
services: machine-learning
author: rastala
ms.author: roastala
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 08/23/2019
ms.custom: seodec18

---

# Use secrets in training runs
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to use secrets in training runs securely. For example, to connect to an external database to query training data, you would need to pass username and password to the remote run context. Coding such values into training scripts in clear text is insecure as it would expose the secret. 

Instead, your Azure Machine Learning Workspace has [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) as associated resource. This Key Vault can be used for passing secrets to remote runs securely through a set of APIs in Azure Machine Learning Python SDK

The basic flow for using secrets is:
 1. On local computer, log in to Azure and connect to your Workspace
 2. On local computer, set a secret in Workspace Key Vault
 3. Submit a remote run.
 4. Within remote run, get the secret from Key Value and use it.

## Set secrets

In Azure Machine Learning Python SDK, the [Keyvault](https://docs.microsoft.com/python/api/azureml-core/azureml.core.keyvault.keyvault?view=azure-ml-py) class contains methods for setting secrets. In your local Python session, first obtain a reference to Workspace Key Vault, and then use [set_secret](https://docs.microsoft.com/python/api/azureml-core/azureml.core.keyvault.keyvault?view=azure-ml-py#set-secret-name--value-) method to set a secret by name and value.

```python
from azureml.core import Workspace
import os

ws = Workspace.from_config()
my_secret = os.environ.get("MY_SECRET")
keyvault = ws.get_default_keyvault()
keyvault.set_secret(name="mysecret", value = my_secret)
```

Do not put the secret value in Python code as it is insecure to store it in file as cleartext. Instead, obtain the secret value from environment variable, for example Azure DevOps build secret, or from interactive user input.

You can list secret names using [list_secrets](https://docs.microsoft.com/python/api/azureml-core/azureml.core.keyvault.keyvault?view=azure-ml-py#set-secret-name--value-) method. The __set_secret__ method updates the secret value if the name already exists.

## Get secrets

In your local code, you can use [Keyvault.get_secret](https://docs.microsoft.com/python/api/azureml-core/azureml.core.keyvault.keyvault?view=azure-ml-py#get-secret-name-) method to get the secret value by name.

In runs submitted using [Experiment.submit](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment?view=azure-ml-py#submit-config--tags-none----kwargs-), use [Run.get_secret](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#get-secret-name-) method. Because submitted run is aware of its Workspace, this method shortcuts the Workspace instantiation and returns the secret value directly.

```python
# Code in submitted run
from azureml.core import Run

run = Run.get_context()
secret_value = run.get_secret(name="mysecret")
```

Be careful not to expose the secret value by writing or printing it out.

The set and get methods also have batch versions [set_secrets](https://docs.microsoft.com/python/api/azureml-core/azureml.core.keyvault.keyvault?view=azure-ml-py#set-secrets-secrets-batch-) and [get_secrets](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#get-secrets-secrets-) for accessing multiple secrets at once.

## Next steps

 * [View example notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/manage-azureml-service/authentication-in-azureml/authentication-in-azureml.ipynb)
 * [Learn about enterprise security with Azure Machine Learning](concept-enterprise-security.md)
