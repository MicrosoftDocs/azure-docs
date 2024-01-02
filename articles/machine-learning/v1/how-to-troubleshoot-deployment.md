---
title: Troubleshooting remote model deployment 
titleSuffix: Azure Machine Learning
description: Learn how to work around, solve, and troubleshoot some common Docker deployment errors with Azure Kubernetes Service and Azure Container Instances.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.date: 11/16/2022
author: dem108
ms.author: sehan
ms.reviewer: larryfr
ms.topic: troubleshooting
ms.custom: UpdateFrequency5, contperf-fy20q4, deploy, contperf-fy21q2, cliv1, sdkv1, event-tier1-build-2022
#Customer intent: As a data scientist, I want to figure out why my model deployment fails so that I can fix it.
---

# Troubleshooting remote model deployment 

Learn how to troubleshoot and solve, or work around, common errors you may encounter when deploying a model to Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) using Azure Machine Learning.

> [!NOTE]
> If you are deploying a model to Azure Kubernetes Service (AKS), we advise you enable [Azure Monitor](/azure/azure-monitor/containers/container-insights-enable-existing-clusters) for that cluster. This will help you understand overall cluster health and resource usage. You might also find the following resources useful:
>
> * [Check for Resource Health events impacting your AKS cluster](../../aks/aks-resource-health.md)
> * [Azure Kubernetes Service Diagnostics](../../aks/concepts-diagnostics.md)
>
> If you are trying to deploy a model to an unhealthy or overloaded cluster, it is expected to experience issues. If you need help troubleshooting AKS cluster problems please contact AKS Support.

## Prerequisites

* An **Azure subscription**. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* The [Azure Machine Learning SDK](/python/api/overview/azure/ml/install).
* The [Azure CLI](/cli/azure/install-azure-cli).
* The [CLI extension v1 for Azure Machine Learning](reference-azure-machine-learning-cli.md).

    [!INCLUDE [cli v1 deprecation](../includes/machine-learning-cli-v1-deprecation.md)]

## Steps for Docker deployment of machine learning models

When you deploy a model to non-local compute in Azure Machine Learning, the following things happen:

1. The Dockerfile you specified in your Environments object in your InferenceConfig is sent to the cloud, along with the contents of your source directory
1. If a previously built image isn't available in your container registry, a new Docker image is built in the cloud and stored in your workspace's default container registry.
1. The Docker image from your container registry is downloaded to your compute target.
1. Your workspace's default Blob store is mounted to your compute target, giving you access to registered models
1. Your web server is initialized by running your entry script's `init()` function
1. When your deployed model receives a request, your `run()` function handles that request

The main difference when using a local deployment is that the container image is built on your local machine, which is why you need to have Docker installed for a local deployment.

Understanding these high-level steps should help you understand where errors are happening.

## Get deployment logs

The first step in debugging errors is to get your deployment logs. First, follow the [instructions here to connect to your workspace](how-to-deploy-and-where.md#connect-to-your-workspace).

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

To get the logs from a deployed webservice, do:

```azurecli
az ml service get-logs --verbose --workspace-name <my workspace name> --name <service name>
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

Assuming you have an object of type `azureml.core.Workspace` called `ws`, you can do the following:

```python
print(ws.webservices)

# Choose the webservice you are interested in

from azureml.core import Webservice

service = Webservice(ws, '<insert name of webservice>')
print(service.get_logs())
```

---

## Debug locally

If you have problems when deploying a model to ACI or AKS, deploy it as a local web service. Using a local web service makes it easier to troubleshoot problems. To troubleshoot a deployment locally, see the [local troubleshooting article](how-to-troubleshoot-deployment-local.md).

## Azure Machine Learning inference HTTP server

The local inference server allows you to quickly debug your entry script (`score.py`). In case the underlying score script has a bug, the server fails to initialize or serve the model. Instead, it throws an exception & the location where the issues occurred. [Learn more about Azure Machine Learning inference HTTP Server](../how-to-inference-server-http.md)

1. Install the `azureml-inference-server-http` package from the [pypi](https://pypi.org/) feed:

    ```bash
    python -m pip install azureml-inference-server-http
    ```

2. Start the server and set `score.py` as the entry script:

    ```bash
    azmlinfsrv --entry_script score.py
    ```

3. Send a scoring request to the server using `curl`:

    ```bash
    curl -p 127.0.0.1:5001/score
    ```
> [!NOTE]
> [**Learn frequently asked questions**](../how-to-inference-server-http.md#frequently-asked-questions) about Azure machine learning Inference HTTP server.

## Container can't be scheduled

When deploying a service to an Azure Kubernetes Service compute target, Azure Machine Learning attempts to schedule the service with the requested amount of resources. If there are no nodes available in the cluster with the appropriate amount of resources after 5 minutes, the deployment will fail. The failure message is `Couldn't Schedule because the kubernetes cluster didn't have available resources after trying for 00:05:00`. You can address this error by either adding more nodes, changing the SKU of your nodes, or changing the resource requirements of your service. 

The error message will typically indicate which resource you need more of - for instance, if you see an error message indicating `0/3 nodes are available: 3 Insufficient nvidia.com/gpu` that means that the service requires GPUs and there are three nodes in the cluster that don't have available GPUs. This could be addressed by adding more nodes if you're using a GPU SKU, switching to a GPU enabled SKU if you aren't or changing your environment to not require GPUs.  

## Service launch fails

After the image is successfully built, the system attempts to start a container using your deployment configuration. As part of container starting-up process, the `init()` function in your scoring script is invoked by the system. If there are uncaught exceptions in the `init()` function, you might see **CrashLoopBackOff** error in the error message.

Use the info in the [Inspect the Docker log](how-to-troubleshoot-deployment-local.md#dockerlog) article.

## Container azureml-fe-aci launch fails

When deploying a service to an Azure Container Instance compute target, Azure Machine Learning attempts to create a front-end container that has the name `azureml-fe-aci` for the inference request. If `azureml-fe-aci` crashes, you can see logs by running `az container logs --name MyContainerGroup --resource-group MyResourceGroup --subscription MySubscription --container-name azureml-fe-aci`. You can follow the error message in the logs to make the fix. 

The most common failure for `azureml-fe-aci` is that the provided SSL certificate or key is invalid.

## Function fails: get_model_path()

Often, in the `init()` function in the scoring script, [Model.get_model_path()](/python/api/azureml-core/azureml.core.model.model#get-model-path-model-name--version-none---workspace-none-) function is called to locate a model file or a folder of model files in the container. If the model file or folder can't be found, the function fails. The easiest way to debug this error is to run the below Python code in the Container shell:

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core.model import Model
import logging
logging.basicConfig(level=logging.DEBUG)
print(Model.get_model_path(model_name='my-best-model'))
```

This example prints the local path (relative to `/var/azureml-app`) in the container where your scoring script is expecting to find the model file or folder. Then you can verify if the file or folder is indeed where it's expected to be.

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

**Note**: Returning error messages from the `run(input_data)` call should be done for debugging purpose only. For security reasons, you shouldn't return error messages this way in a production environment.

## HTTP status code 502

A 502 status code indicates that the service has thrown an exception or crashed in the `run()` method of the score.py file. Use the information in this article to debug the file.

## HTTP status code 503

Azure Kubernetes Service deployments support autoscaling, which allows replicas to be added to support extra load. The autoscaler is designed to handle **gradual** changes in load. If you receive large spikes in requests per second, clients may receive an HTTP status code 503. Even though the autoscaler reacts quickly, it takes AKS a significant amount of time to create more containers.

Decisions to scale up/down is based off of utilization of the current container replicas. The number of replicas that are busy (processing a request) divided by the total number of current replicas is the current utilization. If this number exceeds `autoscale_target_utilization`, then more replicas are created. If it's lower, then replicas are reduced. Decisions to add replicas are eager and fast (around 1 second). Decisions to remove replicas are conservative (around 1 minute). By default, autoscaling target utilization is set to **70%**, which means that the service can handle spikes in requests per second (RPS) of **up to 30%**.

There are two things that can help prevent 503 status codes:

> [!TIP]
> These two approaches can be used individually or in combination.

* Change the utilization level at which autoscaling creates new replicas. You can adjust the utilization target by setting the `autoscale_target_utilization` to a lower value.

    > [!IMPORTANT]
    > This change does not cause replicas to be created *faster*. Instead, they are created at a lower utilization threshold. Instead of waiting until the service is 70% utilized, changing the value to 30% causes replicas to be created when 30% utilization occurs.
    
    If the web service is already using the current max replicas and you're still seeing 503 status codes, increase the `autoscale_max_replicas` value to increase the maximum number of replicas.

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

For more information on setting `autoscale_target_utilization`, `autoscale_max_replicas`, and `autoscale_min_replicas` for, see the [AksWebservice](/python/api/azureml-core/azureml.core.webservice.akswebservice) module reference.

## HTTP status code 504

A 504 status code indicates that the request has timed out. The default timeout is 1 minute.

You can increase the timeout or try to speed up the service by modifying the score.py to remove unnecessary calls. If these actions don't correct the problem, use the information in this article to debug the score.py file. The code may be in a non-responsive state or an infinite loop.

## Other error messages

Take these actions for the following errors:

|Error  | Resolution  |
|---------|---------|
| 409 conflict error| When an operation is already in progress, any new operation on that same web service responds with 409 conflict error. For example, If create or update web service operation is in progress and if you trigger a new Delete operation it throws an error. |
|Image building failure when deploying web service     |  Add "pynacl==1.2.1" as a pip dependency to Conda file for image configuration       |
|`['DaskOnBatch:context_managers.DaskOnBatch', 'setup.py']' died with <Signals.SIGKILL: 9>`     |   Change the SKU for VMs used in your deployment to one that has more memory. |
|FPGA failure     |  You can't deploy models on FPGAs until you've requested and been approved for FPGA quota. To request access, fill out the quota request form: https://aka.ms/aml-real-time-ai       |


## Advanced debugging

You may need to interactively debug the Python code contained in your model deployment. For example, if the entry script is failing and the reason can't be determined with extra logging. By using Visual Studio Code and the debugpy, you can attach to the code running inside the Docker container.

For more information, visit the [interactive debugging in VS Code guide](how-to-debug-visual-studio-code.md#debug-and-troubleshoot-deployments).

## [Model deployment user forum](/answers/topics/azure-machine-learning-inference.html)

## Next steps

Learn more about deployment:

* [How to deploy and where](how-to-deploy-and-where.md)
* [How to run and debug experiments locally](how-to-debug-visual-studio-code.md)
