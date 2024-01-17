---
title: "Troubleshoot `descriptors cannot not be created directly`"
titleSuffix: Azure Machine Learning
description: Troubleshooting steps when you get the "descriptors cannot not be created directly" message.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: Blackmist
ms.author: larryfr
ms.reviewer: larryfr
ms.topic: troubleshooting 
ms.date: 01/16/2024
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Troubleshoot `descriptors cannot not be created directly` error

When using Azure Machine Learning, you may receive the following error:

```
TypeError: Descriptors cannot not be created directly. If this call came from a _pb2.py file, your generated code is out of date and must be regenerated with protoc >= 3.19.0." It is followed by the proposition to install the appropriate version of protobuf library.

If you cannot immediately regenerate your protos, some other possible workarounds are:
 1. Downgrade the protobuf package to 3.20.x or lower.
 2. Set PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python (but this will use pure-Python parsing and will be much slower).
```

You may notice this error specifically when using AutoML.

## Cause

This problem is caused by breaking changes introduced in protobuf 4.0.0. For more information, see [https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates](https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates).

## Resolution

For a local development environment or compute instance, install the Azure Machine Learning SDK version 1.42.0.post1 or greater.

```bash
pip install azureml-sdk[automl,explain,notebooks]>=1.42.0
```

For more information on updating an Azure Machine Learning environment (for training or deployment), see the following articles:

:::moniker range="azureml-api-1"
* [Manage environments in studio](how-to-manage-environments-in-studio.md#rebuild-an-environment)
* [Create & use software environments](./v1/how-to-use-environments.md)
:::moniker-end
:::moniker range="azureml-api-2"
* [Manage environments in studio](how-to-manage-environments-in-studio.md#rebuild-an-environment)
* [Create & manage environments](how-to-manage-environments-v2.md#update)
:::moniker-end

To verify the version of your installed SDK, use the following command:

```bash
pip show azureml-core
```

This command should return information similar to `Version: 1.42.0.post1`.

> [!TIP]
> If you can't upgrade your Azure Machine Learning SDK installation, you can pin the protobuf version in your environment to `3.20.1`. The following example is a `conda.yml` file that demonstrates how to pin the version:
>
> ```yml
> name: model-env
> channels:
>   - conda-forge
> dependencies:
>   - python=3.8
>   - numpy=1.21.2
>   - pip=21.2.4
>   - scikit-learn=0.24.2
>   - scipy=1.7.1
>   - pandas>=1.1,<1.2
>   - pip:
>     - inference-schema[numpy-support]==1.3.0
>     - xlrd==2.0.1
>     - mlflow== 1.26.0
>     - azureml-mlflow==1.41.0
>     - protobuf==3.20.1
> ```

## Next steps

For more information on the breaking changes in protobuf 4.0.0, see [https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates](https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates). 

For more information on updating an Azure Machine Learning environment (for training or deployment), see the following articles:

:::moniker range="azureml-api-1"
* [Manage environments in studio](how-to-manage-environments-in-studio.md#rebuild-an-environment)
* [Create & use software environments](./v1/how-to-use-environments.md)
:::moniker-end
:::moniker range="azureml-api-2"
* [Manage environments in studio](how-to-manage-environments-in-studio.md#rebuild-an-environment)
* [Create & manage environments](how-to-manage-environments-v2.md#update)
:::moniker-end