
# How to use an existing model with Azure Machine Learning service

Learn how to use an existing machine learning model with the Azure Machine Learning service.

If you have a machine learning model that was trained outside the Azure Machine Learning service, you can still use the service to deploy the model as a web service or to an IoT Edge device.

## Prerequisites

* An Azure Machine Learning service workgroup. For more information, see the [Create a workspace](setup-create-workspace.md) article.

    > [!TIP]
    > The examples in this article assume that the `ws` variable is set to your Azure Machine Learning service workspace.

* The Azure Machine Learning SDK. For more information, see the Python SDK section of the [Create a workspace](setup-create-workspace.md#sdk) article.
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* A trained model. The model model must be persisted to one or more files. For example, saved to Pickle files.

## Register the model

Registering a model allows you to store, version, and apply metadata to your trained models. During registration, the model is uploaded to your Azure Machine Learning service workspace. From there, you can search, download, or deploy the model. When deploying, you can deploy as a web service or to an Azure IoT Edge device.

> [!TIP]
> Each time you register a model using the same name, the model version is automatically incremented. The first model registered with a specific name is version 1. The second registered with the same name is version 2, and so on. You can optionally add other metadata such as tags, properties, and descriptions.

You can register a model using either the Azure Machine Learning SDK or the Azure Machine Learning extension for the Azure CLI.

> [!IMPORTANT]
> When registering a trained model, the model must be persisted to one or more files. These files are then used to register the model.

### Using the SDK

The following Python code demonstrates how to register a model that is stored in Pickle format:

```python
from azureml.core.model import Model

model = Model.register(model_path = "./mymodels/sklearn_regression_model.pkl",
                       model_name = "mymodel",
                       tags = {'area': "diabetes", 'type': "regression"},
                       description = "Ridge regression model to predict diabetes",
                       workspace = ws)
```

This example registers the model contained in the `sklearn_regression_model.pkl` file. The registration uses a friendly name of `mymodel`, and applies a description and tags to the model.

> [!TIP]
> If your model consists of multiple files, you can provide a list of paths for the `model_path` paramter. For example, `model_path = ["modelfile1.pkl","modelfile2.pkl"]`.

### Using the CLI

Use the following steps to register a model using the ML CLI:

1. From a terminal or command prompt, login to your Azure subscription:

    ```azurecli-interactive
    az login
    ```

2. To register a model using the CLI, use the following command. Replace `<model_path>` with the path to the file that contains the model. Replace `<model_name>` with the name to register the model as. Replace `<workspace>` with the name of your Azure Machine Learning service workspace. Replace `<resource_group>` with the name of the Azure resource group that contains your workspace:

    ```azurecli-interactive
    az ml model register -p <model_path> -n <model_name> -w <workspace> -g <resource_group>
    ```

## Define inference environment

Azure Machine Learning service uses the [InferenceConfig]() class to define the inference environment for the model.

When deploying a file, the conda environment defines the Python packages needed to run the model and score data.
## Define deployment



## Create entry script

## Create inference configuration

## Create deployment configuration

