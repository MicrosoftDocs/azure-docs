# Working with Models in Azure Machine Learning CLI 2.0

## Model creation using YAML
This repository contains example `YAML` files for creating 'models` using Azure Machine learning CLI 2.0. This directory includes:

- Sample `YAML` files for creating a `model` asset by uploading local file.
- Sample `YAML` files for creating a MLflow `model` asset by uploading local folder.

To create a model using any of the sample `YAML` files provided in this directory, execute following command:

```cli
az ml model create -f <file-name>.yml
```

## Model creation without YAML

A model can be created by from local file(s) or from a cloud path. 

### From local path
**1. Registering a local model** 
```cli
az ml model create --name my-model --version 1 --path ./mlflow-model/model.pkl
```

**1. Registering a local MLFLow model** 

For MLFlow model local path has to reference [a folder that contain `MLModel` file](https://mlflow.org/docs/latest/models.html#storage-format)
```cli
az ml model create --name my-model --version 1 --path ./mlflow-model --type mlflow_model
```

### From cloud path
A model can created from a cloud path using any one of the following supported URI foramts.

```cli
az ml model create --name <model-name> --version <model-version> --path <azureml datastore reference URI/mlflow run URI/azureml job URI>
```

**1. Using the azureml datastore reference URI**

```cli
az ml model create --name my-model --version 1 --path azureml://datastores/myblobstore/paths/models/cifar10/cifar.pt
```

The examples use shorthand `azureml` scheme for pointing to a path on the `datastore` using syntax `azureml://datastores/${{datastore-name}}/paths/${{path_on_datastore}}`. 


**2. Using the mlflow run URI format**

This option is optimized for mlflow users who are likely already familiar with the mlflow run URI format. This option allows mlflow users to create a model from artifacts in the default artifact location (where all mlflow-logged models and artifacts will be located). This establishes a lineage between a registered model and the run the model came from.

Format:
`runs:/<run-id>/<path-to-model-relative-to-the-root-of-the-artifact-location>`

Example:
`runs:/$RUN_ID/model/`

```cli
az ml model create --name my-model --version 1 --path runs:/$RUN_ID/model/ --type mlflow_model
```

```
> az ml model show -n my-model -v 1
{
  "creation_context": {
    ...
  },
  "description": "",
  "flavors": {},
  "id": "azureml:/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/models/my-model/versions/1",
  "model_format": "mlflow",
  "model_uri": "runs:/$RUN_ID/model/",
  "name": "my-model",
  "version": "1",
  "job_name": "$RUN_ID"
}
```

**3. Using the azureml job URI format**

We will also have an azureml job reference URI format to allow users to register a model from artifacts in any of the job's outputs. This format is aligned with the existing azureml datastore reference URI format, and also supports referencing artifacts from named outputs of the job (not just the default artifact location). This also enables establishing a lineage between a registered model and the job it was trained from if the user did not directly register their model within the training script using mlflow.

Format:
`azureml://jobs/<job-name>/outputs/<output-name>/paths/<path-to-model-relative-to-the-named-output-location>`

Examples:
- Defaut artifact location: `azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/`
    * this is equivalent to `runs:/$RUN_ID/model/` from the #2 mlflow run URI format
    * **note: "artifacts"** is the reserved key word we use to refer to the output that represents the **default artifact location**
- From a named output dir: `azureml://jobs/$RUN_ID/outputs/trained-model`
- From a specific file or folder path within the named output dir:
    * `azureml://jobs/$RUN_ID/outputs/trained-model/paths/cifar.pt`
    * `azureml://jobs/$RUN_ID/outputs/checkpoints/paths/model/`

Saving model from a named output:

```cli
az ml model create --name my-model --version 1 --path azureml://jobs/$RUN_ID/outputs/trained-model
```

```
> az ml model show -n my-model -v 1
{
  "creation_context": {
    ...
  },
  "description": "",
  "flavors": {},
  "id": "azureml:/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/models/my-model/versions/1",
  "type": "custom_model",
  "path": "azureml://jobs/$RUN_ID/outputs/trained-model",
  "name": "my-model",
  "version": "1",
  "job_name": "$RUN_ID"
}
```
To learn more about Azure Machine Learning CLI 2.0, [follow this link](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-configure-cli).
