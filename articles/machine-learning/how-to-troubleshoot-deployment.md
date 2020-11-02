---
title: Docker deployment troubleshooting
titleSuffix: Azure Machine Learning
description: Learn how to work around, solve, and troubleshoot the common Docker deployment errors with Azure Kubernetes Service and Azure Container Instances using Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: gvashishtha
ms.author:  gopalv
ms.reviewer: jmartens
ms.date: 11/02/2020
ms.topic: troubleshooting
ms.custom: contperfq4, devx-track-python, deploy
---

# Troubleshoot model deployment

Learn how to troubleshoot and solve, or work around, common Docker deployment errors with Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) using Azure Machine Learning.

## Prerequisites

* An **Azure subscription**. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* The [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true).
* The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true).
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To debug locally, you must have a working Docker installation on your local system.

    To verify your Docker installation, use the command `docker run hello-world` from a terminal or command prompt. For information on installing Docker, or troubleshooting Docker errors, see the [Docker Documentation](https://docs.docker.com/).

## Steps for Docker deployment of machine learning models

When you deploy a model to non-local compute in Azure Machine Learning, the following things happen:

1. The Dokerfile you specified in your Environments object in your InferenceConfig is sent to the cloud, along with the contents of your source directory
1. If a previously built image is not available in your container registry, a new Docker image is built in the cloud and stored in your Workspace's default container registry.
1. The Docker image from your container registry is downloaded to your compute target.
1. Your workspace's default blob store is mounted to your compute target, giving you access to registered models
1. Your web server is initialized by running your entry script's `init()` function
1. When your deployed model receives a request, your `run()` function handles that request

The main difference when using a local deployment is that the container image is built on your local machine, which is why you need to have Docker installed for a local deployment.

Understanding these high-level steps should help you understand where errors are happening.

## Get deployment logs

The first step in debugging errors is to get your deployment logs. First, follow the [instructions here](how-to-deploy-and-where.md#connect-to-your-workspace) to connect to your workspace.

# [Azure CLI](#tab/azcli)

To get the logs from a deployed webservice, do:

```bash
az ml service get-logs --verbose --workspace-name <my workspace name> --name <service name>
```

# [Python](#tab/python)


Assuming you have an object called `ws`, you can do the following:

```python
print(ws.webservices)

# Choose the webservice you are interested in

from azureml.core import Webservice

service = Webservice(ws, '<insert name of webservice>')
print(service.get_logs())
```

---

## Debug locally

If you have problems when deploying a model to ACI or AKS, deploy it as a local web service. Using a local web service makes it easier to troubleshoot problems.

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

To change the model, Conda dependencies, or deployment configuration, use [update()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py&preserve-view=true#&preserve-view=trueupdate--args-). The following example updates the model used by the service:

```python
service.update([different_model], inference_config, deployment_config)
```

### Delete the service

To delete the service, use [delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py&preserve-view=true#&preserve-view=truedelete--).

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
 
## Container cannot be scheduled

When deploying a service to an Azure Kubernetes Service compute target, Azure Machine Learning will attempt to schedule the service with the requested amount of resources. If there are no nodes available in the cluster with the appropriate amount of resources after 5 minutes, the deployment will fail. The failure message is `Couldn't Schedule because the kubernetes cluster didn't have available resources after trying for 00:05:00`. You can address this error by either adding more nodes, changing the SKU of your nodes, or changing the resource requirements of your service. 

The error message will typically indicate which resource you need more of - for instance, if you see an error message indicating `0/3 nodes are available: 3 Insufficient nvidia.com/gpu` that means that the service requires GPUs and there are three nodes in the cluster that do not have available GPUs. This could be addressed by adding more nodes if you are using a GPU SKU, switching to a GPU enabled SKU if you are not or changing your environment to not require GPUs.  

## Service launch fails

After the image is successfully built, the system attempts to start a container using your deployment configuration. As part of container starting-up process, the `init()` function in your scoring script is invoked by the system. If there are uncaught exceptions in the `init()` function, you might see **CrashLoopBackOff** error in the error message.

Use the info in the [Inspect the Docker log](#dockerlog) section to check the logs.

## Function fails: get_model_path()

Often, in the `init()` function in the scoring script, [Model.get_model_path()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py&preserve-view=true#&preserve-view=trueget-model-path-model-name--version-none---workspace-none-) function is called to locate a model file or a folder of model files in the container. If the model file or folder cannot be found, the function fails. The easiest way to debug this error is to run the below Python code in the Container shell:

```python
from azureml.core.model import Model
import logging
logging.basicConfig(level=logging.DEBUG)
print(Model.get_model_path(model_name='my-best-model'))
```

This example prints out the local path (relative to `/var/azureml-app`) in the container where your scoring script is expecting to find the model file or folder. Then you can verify if the file or folder is indeed where it is expected to be.

Setting the logging level to DEBUG may cause additional information to be logged, which may be useful in identifying the failure.

## Function fails: run(input_data)

If the service is successfully deployed, but it crashes when you post data to the scoring endpoint, you can add error catching statement in your `run(input_data)` function so that it returns detailed error message instead. For example:

```python
def run(input_data):
    try:
        data = json.loads(input_data)['data']
        data = np.array(data)
        result = model.predict(data)
        return json.dumps({"result": result.tolist()})
    except Exception as e:
        result = str(e)
        # return error message back to the client
        return json.dumps({"error": result})
```

**Note**: Returning error messages from the `run(input_data)` call should be done for debugging purpose only. For security reasons, you should not return error messages this way in a production environment.

## HTTP status code 502

A 502 status code indicates that the service has thrown an exception or crashed in the `run()` method of the score.py file. Use the information in this article to debug the file.

## HTTP status code 503

Azure Kubernetes Service deployments support autoscaling, which allows replicas to be added to support additional load. The autoscaler is designed to handle **gradual** changes in load. If you receive large spikes in requests per second, clients may receive an HTTP status code 503. Even though the autoscaler reacts quickly, it takes AKS a significant amount of time to create additional containers.

Decisions to scale up/down is based off of utilization of the current container replicas. The number of replicas that are busy (processing a request) divided by the total number of current replicas is the current utilization. If this number exceeds `autoscale_target_utilization`, then more replicas are created. If it is lower, then replicas are reduced. Decisions to add replicas are eager and fast (around 1 second). Decisions to remove replicas are conservative (around 1 minute). By default, autoscaling target utilization is set to **70%**, which means that the service can handle spikes in requests per second (RPS) of **up to 30%**.

There are two things that can help prevent 503 status codes:

> [!TIP]
> These two approaches can be used individually or in combination.

* Change the utilization level at which autoscaling creates new replicas. You can adjust the utilization target by setting the `autoscale_target_utilization` to a lower value.

    > [!IMPORTANT]
    > This change does not cause replicas to be created *faster*. Instead, they are created at a lower utilization threshold. Instead of waiting until the service is 70% utilized, changing the value to 30% causes replicas to be created when 30% utilization occurs.
    
    If the web service is already using the current max replicas and you are still seeing 503 status codes, increase the `autoscale_max_replicas` value to increase the maximum number of replicas.

* Change the minimum number of replicas. Increasing the minimum replicas provides a larger pool to handle the incoming spikes.

    To increase the minimum number of replicas, set `autoscale_min_replicas` to a higher value. You can calculate the required replicas by using the following code, replacing values with values specific to your project:

    ```python
    from math import ceil
    # target requests per second
    targetRps = 20
    # time to process the request (in seconds)
    reqTime = 10
    # Maximum requests per container
    maxReqPerContainer = 1
    # target_utilization. 70% in this example
    targetUtilization = .7

    concurrentRequests = targetRps * reqTime / targetUtilization

    # Number of container replicas
    replicas = ceil(concurrentRequests / maxReqPerContainer)
    ```

    > [!NOTE]
    > If you receive request spikes larger than the new minimum replicas can handle, you may receive 503s again. For example, as traffic to your service increases, you may need to increase the minimum replicas.

For more information on setting `autoscale_target_utilization`, `autoscale_max_replicas`, and `autoscale_min_replicas` for, see the [AksWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice?view=azure-ml-py&preserve-view=true) module reference.

## HTTP status code 504

A 504 status code indicates that the request has timed out. The default timeout is 1 minute.

You can increase the timeout or try to speed up the service by modifying the score.py to remove unnecessary calls. If these actions do not correct the problem, use the information in this article to debug the score.py file. The code may be in a non-responsive state or an infinite loop.

## Advanced debugging

You may need to interactively debug the Python code contained in your model deployment. For example, if the entry script is failing and the reason cannot be determined by additional logging. By using Visual Studio Code and the debugpy, you can attach to the code running inside the Docker container.

For more information, visit the [interactive debugging in VS Code guide](how-to-debug-visual-studio-code.md#debug-and-troubleshoot-deployments).

## [Model deployment user forum](https://docs.microsoft.com/answers/topics/azure-machine-learning-inference.html)

## Next steps

Learn more about deployment:

* [How to deploy and where](how-to-deploy-and-where.md)
* [Tutorial: Train & deploy models](tutorial-train-models-with-aml.md)
