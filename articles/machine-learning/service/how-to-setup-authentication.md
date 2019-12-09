---
title: Setup authentication
titleSuffix: Azure Machine Learning
description: 
services: machine-learning
author: trevorbye
ms.author: trbye
ms.reviewer: trbye
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 12/09/2019
---

# Setup authentication for ML resources
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to setup and configure authentication for various resources and workflows in Azure Machine Learning. There are multiple ways to setup and use authentication within the service, ranging from simple UI-based auth for development or testing purposes, to full Azure Active Directory service principal authentication, which allows you to retrieve OAuth2.0 bearer-type tokens for use with HTTP calls on any platform.

This how-to shows you how to do the following tasks:

* Use interactive UI auth for testing/development
* Setup service principal auth
* Authenticating to your workspace
* Get OAuth2.0 bearer-type tokens for REST calls
* Authenticate to the Azure Machine Learning REST API

## Prerequisites

* Create an [Azure Machine Learning workspace](how-to-manage-workspace.md).
* [Configure your development environment](how-to-configure-environment.md) to install the Azure Machine Learning SDK, or use a [Azure Machine Learning Notebook VM](concept-azure-machine-learning-architecture.md#compute-instance) with the SDK already installed.

## Interactive authentication

Most examples in the documentation for this service use interactive authentication in Jupyter notebooks as a simple method for testing and demonstration. This is a lightweight way to test what you're building. There are two function calls that will automatically prompt you with a UI-based authentication flow.

Calling the `from_config()` function will issue the prompt.

```python
from azureml.core import Workspace
ws = Workspace.from_config()
```

The `from_config()` function looks for a JSON file containing your workspace connection information. You can also specify the connection details explicitly by using the `Workspace` constructor, which will also prompt for interactive authentication. Both calls are equivalent.

```python
ws = Workspace(subscription_id="<your_sub-id>",
               resource_group="<your-resource-grp-id>",
               workspace_name="<your-workspace-name>"))
```

While useful for testing and learning, interactive authentication will not help you with building automated or headless workflows. Setting up service principal authentication is the best approach for automated requirements.

## Setup service principal authentication


