# Install the Python SDK v2 for Azure Machine Learning SDK

This article is a guide for different installation options for the Python SDK v2 for Azure Machine Learning.

## Prerequisites

* [Python installed](https://www.python.org/downloads/) version 3.6 or later. For azureml-automl packages, use only version 3.6 or 3.7. 
* [pip installed](https://pip.pypa.io/en/stable/installation/)

## Default install

Use `azureml-ml`.

```bash
pip install azureml-ml
```

## Upgrade install

> [!TIP]
> We recommend that you always keep azureml-ml updated to the latest version.

Upgrade a previous version:

```bash
pip install --upgrade azureml-ml
```

## Check version

Verify your SDK version:

```bash
pip show azureml-ml
```

To see all packages in your environment:

```bash
pip list
```

You can also show the SDK version in Python, but this version does not include the minor version.

```python
import azure.ml
print(azure.ml.version.VERSION)
```

## Next steps

Try these next steps to learn how to use the Azure Machine Learning SDK (v2) for Python:

1. [Train models with the Azure ML Python SDK (v2)](./train-sdkv2.md)
1. [Use pipelines with the Azure ML Python SDK (v2)](./pipeline-sdkv2.md)