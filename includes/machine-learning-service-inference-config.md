---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 01/28/2020
ms.author: larryfr
---

The entries in the `inferenceconfig.json` document map to the parameters for the [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig) class. The following table describes the mapping between entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `entryScript` | `entry_script` | Path to a local file that contains the code to run for the image. |
| `sourceDirectory` | `source_directory` | Optional. Path to folders that contain all files to create the image, which makes it easy to access any files within this folder or subfolder. You can upload an entire folder from your local machine as dependencies for the Webservice. Note: your entry_script, conda_file, and extra_docker_file_steps paths are relative paths to the source_directory path. |
| `environment` | `environment` | Optional.  Azure Machine Learning [environment](/python/api/azureml-core/azureml.core.environment.environment).|

You can include full specifications of an Azure Machine Learning [environment](/python/api/azureml-core/azureml.core.environment.environment) in the inference configuration file. If this environment doesn't exist in your workspace, Azure Machine Learning will create it. Otherwise, Azure Machine Learning will update the environment if necessary. The following JSON is an example:

```json
{
    "entryScript": "score.py",
    "environment": {
        "docker": {
            "arguments": [],
            "baseDockerfile": null,
            "baseImage": "mcr.microsoft.com/azureml/intelmpi2018.3-ubuntu18.04",
            "enabled": false,
            "sharedVolumes": true,
            "shmSize": null
        },
        "environmentVariables": {
            "EXAMPLE_ENV_VAR": "EXAMPLE_VALUE"
        },
        "name": "my-deploy-env",
        "python": {
            "baseCondaEnvironment": null,
            "condaDependencies": {
                "channels": [
                    "conda-forge"
                ],
                "dependencies": [
                    "python=3.7",
                    {
                        "pip": [
                            "azureml-defaults",
                            "azureml-telemetry",
                            "scikit-learn==0.22.1",
                            "inference-schema[numpy-support]"
                        ]
                    }
                ],
                "name": "project_environment"
            },
            "condaDependenciesFile": null,
            "interpreterPath": "python",
            "userManagedDependencies": false
        },
        "version": "1"
    }
}
```

You can also use an existing Azure Machine Learning [environment](/python/api/azureml-core/azureml.core.environment.environment) in separated CLI parameters and remove the "environment" key from the inference configuration file. Use -e for the environment name, and --ev for the environment version. If you don't specify --ev, the latest version will be used. Here is an example of an inference configuration file:

```json
{
    "entryScript": "score.py",
    "sourceDirectory": null
}
```

The following command demonstrates how to deploy a model using the previous inference configuration file (named myInferenceConfig.json). 

It also uses the latest version of an existing Azure Machine Learning [environment](/python/api/azureml-core/azureml.core.environment.environment) (named AzureML-Minimal).

```azurecli-interactive
az ml model deploy -m mymodel:1 --ic myInferenceConfig.json -e AzureML-Minimal --dc deploymentconfig.json
```
