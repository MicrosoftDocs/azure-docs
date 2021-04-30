---
title: Troubleshooting local model deployment
titleSuffix: Azure Machine Learning
description: Try a local model deployment as a first step in troubleshooting model deployment errors.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: gvashishtha
ms.author:  gopalv
ms.reviewer: luquinta
ms.date: 11/25/2020
ms.topic: troubleshooting
ms.custom: devx-track-python, deploy, contperf-fy21q2
#Customer intent: As a data scientist, I want to try a local deployment so that I can troubleshoot my model deployment problems.
---

# Troubleshooting with a local model deployment

Try a local model deployment as a first step in troubleshooting deployment to Azure Container Instances (ACI) or Azure Kubernetes Service (AKS).  Using a local web service makes it easier to spot and fix common Azure Machine Learning Docker web service deployment errors.

## Prerequisites

* An **Azure subscription**. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* Option A (**Recommended**) - Debug locally on Azure Machine Learning Compute Instance
   * An Azure Machine Learning Workspace with [compute instance](how-to-deploy-local-container-notebook-vm.md) running
* Option B - Debug locally on your compute
   * The [Azure Machine Learning SDK](/python/api/overview/azure/ml/install).
   * The [Azure CLI](/cli/azure/install-azure-cli).
   * The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
   * Have a working Docker installation on your local system. 
   * To verify your Docker installation, use the command `docker run hello-world` from a terminal or command prompt. For information on installing Docker, or troubleshooting Docker errors, see the [Docker Documentation](https://docs.docker.com/).

## Debug locally

You can find a sample [local deployment notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/deploy-to-local/register-model-deploy-local.ipynb) in the  [MachineLearningNotebooks](https://github.com/Azure/MachineLearningNotebooks) repo to explore a runnable example.

> [!WARNING]
> Local web service deployments are not supported for production scenarios.

To deploy locally, modify your code to use `LocalWebservice.deploy_configuration()` to create a deployment configuration. Then use `Model.deploy()` to deploy the service. The following example deploys a model (contained in the model variable) as a local web service:

```python
from azureml.core.environment import Environment
from azureml.core.model import InferenceConfig, Model
from azureml.core.webservice import LocalWebservice


# Create inference configuration based on the environment definition and the entry script
myenv = Environment.from_conda_specification(name="env", file_path="myenv.yml")
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
# Create a local deployment, using port 8890 for the web service endpoint
deployment_config = LocalWebservice.deploy_configuration(port=8890)
# Deploy the service
service = Model.deploy(
    ws, "mymodel", [model], inference_config, deployment_config)
# Wait for the deployment to complete
service.wait_for_deployment(True)
# Display the port that the web service is available on
print(service.port)
```

If you are defining your own conda specification YAML, list azureml-defaults version >= 1.0.45 as a pip dependency. This package is needed to host the model as a web service.

At this point, you can work with the service as normal. The following code demonstrates sending data to the service:

```python
import json

test_sample = json.dumps({'data': [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
]})

test_sample = bytes(test_sample, encoding='utf8')

prediction = service.run(input_data=test_sample)
print(prediction)
```

For more information on customizing your Python environment, see [Create and manage environments for training and deployment](how-to-use-environments.md). 

### Update the service

During local testing, you may need to update the `score.py` file to add logging or attempt to resolve any problems that you've discovered. To reload changes to the `score.py` file, use `reload()`. For example, the following code reloads the script for the service, and then sends data to it. The data is scored using the updated `score.py` file:

> [!IMPORTANT]
> The `reload` method is only available for local deployments. For information on updating a deployment to another compute target, see [how to update your webservice](how-to-deploy-update-web-service.md).

```python
service.reload()
print(service.run(input_data=test_sample))
```

> [!NOTE]
> The script is reloaded from the location specified by the `InferenceConfig` object used by the service.

To change the model, Conda dependencies, or deployment configuration, use [update()](/python/api/azureml-core/azureml.core.webservice%28class%29#update--args-). The following example updates the model used by the service:

```python
service.update([different_model], inference_config, deployment_config)
```

### Delete the service

To delete the service, use [delete()](/python/api/azureml-core/azureml.core.webservice%28class%29#delete--).

### <a id="dockerlog"></a> Inspect the Docker log

You can print out detailed Docker engine log messages from the service object. You can view the log for ACI, AKS, and Local deployments. The following example demonstrates how to print the logs.

```python
# if you already have the service object handy
print(service.get_logs())

# if you only know the name of the service (note there might be multiple services with the same name but different version number)
print(ws.webservices['mysvc'].get_logs())
```

If you see the line `Booting worker with pid: <pid>` occurring multiple times in the logs, it means, there isn't enough memory to start the worker.
You can address the error by increasing the value of `memory_gb` in `deployment_config`

## Next steps

Learn more about deployment:

* [How to troubleshoot remote deployments](how-to-troubleshoot-deployment.md)
* [How to deploy and where](how-to-deploy-and-where.md)
* [Tutorial: Train & deploy models](tutorial-train-models-with-aml.md)
* [How to run and debug experiments locally](./how-to-debug-visual-studio-code.md)