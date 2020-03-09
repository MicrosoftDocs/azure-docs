---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 01/28/2020
ms.author: larryfr
---

The entries in the `inferenceconfig.json` document map to the parameters for the [InferenceConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) class. The following table describes the mapping between entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `entryScript` | `entry_script` | Path to a local file that contains the code to run for the image. |
| `runtime` | `runtime` | Optional. Which runtime to use for the image. Supported runtimes are `spark-py` and `python`. If `environment` is set, this entry is ignored. |
| `condaFile` | `conda_file` | Optional. Path to a local file that contains a Conda environment definition to use for the image.  If `environment` is set, this entry is ignored. |
| `extraDockerFileSteps` | `extra_docker_file_steps` | Optional. Path to a local file that contains additional Docker steps to run when setting up the image.  If `environment` is set, this entry is ignored.|
| `sourceDirectory` | `source_directory` | Optional. Path to folders that contain all files to create the image, which makes it easy to access any files within this folder or subfolder. You can upload an entire folder from your local machine as dependencies for the Webservice. Note: your entry_script, conda_file, and extra_docker_file_steps paths are relative paths to the source_directory path. |
| `enableGpu` | `enable_gpu` | Optional. Whether to enable GPU support in the image. The GPU image must be used on an Azure service, like Azure Container Instances. For example, Azure Machine Learning Compute, Azure Virtual Machines, and Azure Kubernetes Service. The default is False. If `environment` is set, this entry is ignored.|
| `baseImage` | `base_image` | Optional. Custom image to be used as a base image. If no base image is provided, the image will be based on the provided runtime parameter. If `environment` is set, this entry is ignored. |
| `baseImageRegistry` | `base_image_registry` | Optional. Image registry that contains the base image. If `environment` is set, this entry is ignored.|
| `cudaVersion` | `cuda_version` | Optional. Version of CUDA to install for images that need GPU support. The GPU image must be used on an Azure service. For example, Azure Container Instances, Azure Machine Learning Compute, Azure Virtual Machines, and Azure Kubernetes Service. Supported versions are 9.0, 9.1, and 10.0. If `enable_gpu` is set, the default is 9.1. If `environment` is set, this entry is ignored. |
| `description` | `description` | A description for the image. If `environment` is set, this entry is ignored.  |
| `environment` | `environment` | Optional.  Azure Machine Learning [environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py).|

The following JSON is an example inference configuration for use with the CLI:

```json
{
    "entryScript": "score.py",
    "runtime": "python",
    "condaFile": "myenv.yml",
    "extraDockerfileSteps": null,
    "sourceDirectory": null,
    "enableGpu": false,
    "baseImage": null,
    "baseImageRegistry": null
}
```

You can include full specifications of an Azure Machine Learning [environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) in the inference configuration file. If this environment doesn't exist in your workspace, Azure Machine Learning will create it. Otherwise, Azure Machine Learning will update the environment if necessary. The following JSON is an example:

```json
{
    "entryScript": "score.py",
    "environment": {
        "docker": {
            "arguments": [],
            "baseDockerfile": null,
            "baseImage": "mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04",
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
                    "python=3.6.2",
                    {
                        "pip": [
                            "azureml-defaults",
                            "azureml-telemetry",
                            "scikit-learn",
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

You can also use an existing Azure Machine Learning [environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) in separated CLI parameters and remove the "environment" key from the inference configuration file. Use -e for the environment name, and --ev for the environment version. If you don't specify --ev, the latest version will be used. Here is an example of an inference configuration file:

```json
{
    "entryScript": "score.py",
    "sourceDirectory": null
}
```

The following command demonstrates how to deploy a model using the previous inference configuration file (named myInferenceConfig.json). 

It also uses the latest version of an existing Azure Machine Learning [environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py) (named AzureML-Minimal).

```azurecli-interactive
az ml model deploy -m mymodel:1 --ic myInferenceConfig.json -e AzureML-Minimal --dc deploymentconfig.json
```
