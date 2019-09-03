---
author: larryfr
ms.service: machine-learning
ms.topic: include
ms.date: 07/19/2019
ms.author: larryfr
---

The entries in the `inferenceconfig.json` document map to the parameters for the [InferenceConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) class. The following table describes the mapping between entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `entryScript` | `entry_script` | Path to a local file that contains the code to run for the image. |
| `runtime` | `runtime` | Which runtime to use for the image. Current supported runtimes are `spark-py` and `python`. |
| `condaFile` | `conda_file` | Optional. Path to a local file that contains a Conda environment definition to use for the image. |
| `extraDockerFileSteps` | `extra_docker_file_steps` | Optional. Path to a local file that contains additional Docker steps to run when setting up the image. |
| `sourceDirectory` | `source_directory` | Optional. Path to folders that contain all files to create the image. |
| `enableGpu` | `enable_gpu` | Optional. Whether to enable GPU support in the image. The GPU image must be used on an Azure service, like Azure Container Instances, Azure Machine Learning Compute, Azure Virtual Machines, and Azure Kubernetes Service. The default is False. |
| `baseImage` | `base_image` | Optional. Custom image to be used as a base image. If no base image is provided, the image will be based on the provided runtime parameter. |
| `baseImageRegistry` | `base_image_registry` | Optional. Image registry that contains the base image. |
| `cudaVersion` | `cuda_version` | Optional. Version of CUDA to install for images that need GPU support. The GPU image must be used on an Azure service, like Azure Container Instances, Azure Machine Learning Compute, Azure Virtual Machines, and Azure Kubernetes Service. Supported versions are 9.0, 9.1, and 10.0. If `enable_gpu` is set, the default is 9.1. |
| `description` | `description` | A description for the image. |

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