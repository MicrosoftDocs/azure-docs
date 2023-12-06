---
title: Deploy machine learning models 
titleSuffix: Azure Machine Learning
description: 'Learn how and where to deploy machine learning models. Deploy to Azure Container Instances, Azure Kubernetes Service, and FPGA.'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.reviewer: larryfr
author: dem108
ms.author: sehan
ms.date: 11/16/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, deploy, devx-track-azurecli, contperf-fy21q2, contperf-fy21q4, mktng-kw-nov2021, cliv1, sdkv1, event-tier1-build-2022
adobe-target: true
---


# Deploy machine learning models to Azure

[!INCLUDE [sdk & cli v1](../includes/machine-learning-dev-v1.md)]

Learn how to deploy your machine learning or deep learning model as a web service in the Azure cloud.

[!INCLUDE [endpoints-option](../includes/machine-learning-endpoints-preview-note.md)]

## Workflow for deploying a model

The workflow is similar no matter where you deploy your model:

1. Register the model.
1. Prepare an entry script.
1. Prepare an inference configuration.
1. Deploy the model locally to ensure everything works.
1. Choose a compute target.
1. Deploy the model to the cloud.
1. Test the resulting web service.

For more information on the concepts involved in the machine learning deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning](concept-model-management-and-deployment.md).

## Prerequisites

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

[!INCLUDE [cli10-only](../includes/machine-learning-cli-version-1-only.md)]

- An Azure Machine Learning workspace. For more information, see [Create workspace resources](../quickstart-create-resources.md).
- A model. The examples in this article use a pre-trained model.
- A machine that can run Docker, such as a [compute instance](../how-to-create-compute-instance.md).

# [Python SDK](#tab/python)

- An Azure Machine Learning workspace. For more information, see [Create workspace resources](../quickstart-create-resources.md).
- A model. The examples in this article use a pre-trained model.
- The [Azure Machine Learning software development kit (SDK) for Python](/python/api/overview/azure/ml/intro).
- A machine that can run Docker, such as a [compute instance](../how-to-create-compute-instance.md).
---

## Connect to your workspace

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

To see the workspaces that you have access to, use the following commands:

```azurecli-interactive
az login
az account set -s <subscription>
az ml workspace list --resource-group=<resource-group>
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core import Workspace
ws = Workspace(subscription_id="<subscription_id>",
               resource_group="<resource_group>",
               workspace_name="<workspace_name>")
```

For more information on using the SDK to connect to a workspace, see the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro#workspace) documentation.


---

## <a id="registermodel"></a> Register the model

A typical situation for a deployed machine learning service is that you need the following components:
    
+ Resources representing the specific model that you want deployed (for example: a pytorch model file).
+ Code that you will be running in the service that executes the model on a given input.

Azure Machine Learnings allows you to separate the deployment into two separate components, so that you can keep the same code, but merely update the model. We define the mechanism by which you upload a model _separately_ from your code as "registering the model".

When you register a model, we upload the model to the cloud (in your workspace's default storage account) and then mount it to the same compute where your webservice is running.

The following examples demonstrate how to register a model.

> [!IMPORTANT]
> You should use only models that you create or obtain from a trusted source. You should treat serialized models as code, because security vulnerabilities have been discovered in a number of popular formats. Also, models might be intentionally trained with malicious intent to provide biased or inaccurate output.

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

The following commands download a model and then register it with your Azure Machine Learning workspace:

```azurecli-interactive
wget https://aka.ms/bidaf-9-model -O model.onnx --show-progress
az ml model register -n bidaf_onnx \
    -p ./model.onnx \
    -g <resource-group> \
    -w <workspace-name>
```

Set `-p` to the path of a folder or a file that you want to register.

For more information on `az ml model register`, see the [reference documentation](/cli/azure/ml(v1)/model).

### Register a model from an Azure Machine Learning training job

If you need to register a model that was created previously through an Azure Machine Learning training job, you can specify the experiment, run, and path to the model:

```azurecli-interactive
az ml model register -n bidaf_onnx --asset-path outputs/model.onnx --experiment-name myexperiment --run-id myrunid --tag area=qna
```

The `--asset-path` parameter refers to the cloud location of the model. In this example, the path of a single file is used. To include multiple files in the model registration, set `--asset-path` to the path of a folder that contains the files.

For more information on `az ml model register`, see the [reference documentation](/cli/azure/ml(v1)/model).

# [Python SDK](#tab/python)

### Register a model from a local file

You can register a model by providing the local path of the model. You can provide the path of either a folder or a single file on your local machine.
<!-- pyhton nb call -->
[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=register-model-from-local-file-code)]


To include multiple files in the model registration, set `model_path` to the path of a folder that contains the files.

For more information, see the documentation for the [Model class](/python/api/azureml-core/azureml.core.model.model).


### Register a model from an Azure Machine Learning training job

  When you use the SDK to train a model, you can receive either a [Run](/python/api/azureml-core/azureml.core.run.run) object or an [AutoMLRun](/python/api/azureml-train-automl-client/azureml.train.automl.run.automlrun) object, depending on how you trained the model. Each object can be used to register a model created by an experiment run.

  + Register a model from an `azureml.core.Run` object:
 
    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    model = run.register_model(model_name='bidaf_onnx',
                               tags={'area': 'qna'},
                               model_path='outputs/model.onnx')
    print(model.name, model.id, model.version, sep='\t')
    ```

    The `model_path` parameter refers to the cloud location of the model. In this example, the path of a single file is used. To include multiple files in the model registration, set `model_path` to the path of a folder that contains the files. For more information, see the [Run.register_model](/python/api/azureml-core/azureml.core.run.run#register-model-model-name--model-path-none--tags-none--properties-none--model-framework-none--model-framework-version-none--description-none--datasets-none--sample-input-dataset-none--sample-output-dataset-none--resource-configuration-none----kwargs-) documentation.

  + Register a model from an `azureml.train.automl.run.AutoMLRun` object:

    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    description = 'My AutoML Model'
    model = run.register_model(description = description,
                                tags={'area': 'qna'})

    print(run.model_id)
    ```

    In this example, the `metric` and `iteration` parameters aren't specified, so the iteration with the best primary metric will be registered. The `model_id` value returned from the run is used instead of a model name.

    For more information, see the [AutoMLRun.register_model](/python/api/azureml-train-automl-client/azureml.train.automl.run.automlrun#register-model-model-name-none--description-none--tags-none--iteration-none--metric-none-) documentation.

    To deploy a registered model from an `AutoMLRun`, we recommend doing so via the [one-click deploy button in Azure Machine Learning studio](../how-to-use-automated-ml-for-ml-models.md#deploy-your-model). 

---

> [!NOTE]
>
> You can also register a model from a local file via the Workspace UI portal.
>
> Currently, there are two options to upload a local model file in the UI:
> - **From local files**, which will register a v2 model.
> - **From local files (based on framework)**, which will register a v1 model.
>
>Note that only models registered via the **From local files (based on framework)** entrance (which are known as v1 models) can be deployed as webservices using SDKv1/CLIv1.

## Define a dummy entry script

The entry script receives data submitted to a deployed web service and passes it to the model. It then returns the model's response to the client. *The script is specific to your model*. The entry script must understand the data that the model expects and returns.

The two things you need to accomplish in your entry script are:

1. Loading your model (using a function called `init()`)
1. Running your model on input data (using a function called `run()`)

For your initial deployment, use a dummy entry script that prints the data it receives.

:::code language="python" source="~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/source_dir/echo_score.py":::

Save this file as `echo_score.py` inside of a directory called `source_dir`. This dummy script returns the data you send to it, so it doesn't use the model. But it is useful for testing that the scoring script is running.

## Define an inference configuration

An inference configuration describes the Docker container and files to use when initializing your web service. All of the files within your source directory, including subdirectories, will be zipped up and uploaded to the cloud when you deploy your web service.

The inference configuration below specifies that the machine learning deployment will use the file `echo_score.py` in the `./source_dir` directory to process incoming requests and that it will use the Docker image with the Python packages specified in the `project_environment` environment.

You can use any [Azure Machine Learning inference curated environments](../concept-prebuilt-docker-images-inference.md#list-of-prebuilt-docker-images-for-inference) as the base Docker image when creating your project environment. We will install the required dependencies on top and store the resulting Docker image into the repository that is associated with your workspace.

> [!NOTE]
> Azure machine learning [inference source directory](/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py#constructor&preserve-view=true) upload does not respect **.gitignore** or **.amlignore**

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

A minimal inference configuration can be written as:

:::code language="json" source="~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/dummyinferenceconfig.json":::

Save this file with the name `dummyinferenceconfig.json`.


[See this article](reference-azure-machine-learning-cli.md#inference-configuration-schema) for a more thorough discussion of inference configurations. 

# [Python SDK](#tab/python)

The following example demonstrates how to create a minimal environment with no pip dependencies, using the dummy scoring script you defined above.

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=inference-configuration-code)]

For more information on environments, see [Create and manage environments for training and deployment](../how-to-use-environments.md).

For more information on inference configuration, see the [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig) class documentation.

---


## Define a deployment configuration

A deployment configuration specifies the amount of memory and cores your webservice needs in order to run. It also provides configuration details of the underlying webservice. For example, a deployment configuration lets you specify that your service needs 2 gigabytes of memory, 2 CPU cores, 1 GPU core, and that you want to enable autoscaling.

The options available for a deployment configuration differ depending on the compute target you choose. In a local deployment, all you can specify is which port your webservice will be served on.

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

[!INCLUDE [aml-local-deploy-config](../includes/machine-learning-service-local-deploy-config.md)]

For more information, see the [deployment schema](reference-azure-machine-learning-cli.md#deployment-configuration-schema).

# [Python SDK](#tab/python)

The following Python demonstrates how to create a local deployment configuration: 

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=deployment-configuration-code)]

---

## Deploy your machine learning model

You are now ready to deploy your model. 

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

Replace `bidaf_onnx:1` with the name of your model and its version number.

```azurecli-interactive
az ml model deploy -n myservice \
    -m bidaf_onnx:1 \
    --overwrite \
    --ic dummyinferenceconfig.json \
    --dc deploymentconfig.json \
    -g <resource-group> \
    -w <workspace-name>
```

# [Python SDK](#tab/python)


[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=deploy-model-code)]

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=deploy-model-print-logs)]

For more information, see the documentation for [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) and [Webservice](/python/api/azureml-core/azureml.core.webservice.webservice).

---

## Call into your model

Let's check that your echo model deployed successfully. You should be able to do a simple liveness request, as well as a scoring request:

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

```azurecli-interactive
curl -v http://localhost:32267
curl -v -X POST -H "content-type:application/json" \
    -d '{"query": "What color is the fox", "context": "The quick brown fox jumped over the lazy dog."}' \
    http://localhost:32267/score
```

# [Python SDK](#tab/python)
<!-- python nb call -->
[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=call-into-model-code)]

---

## Define an entry script

Now it's time to actually load your model. First, modify your entry script:


:::code language="python" source="~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/source_dir/score.py":::

Save this file as `score.py` inside of `source_dir`.

Notice the use of the `AZUREML_MODEL_DIR` environment variable to locate your registered model. Now that you've added some pip packages.

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

:::code language="json" source="~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/inferenceconfig.json":::

Save this file as `inferenceconfig.json` 

# [Python SDK](#tab/python)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
env = Environment(name='myenv')
python_packages = ['nltk', 'numpy', 'onnxruntime']
for package in python_packages:
    env.python.conda_dependencies.add_pip_package(package)

inference_config = InferenceConfig(environment=env, source_directory='./source_dir', entry_script='./score.py')
```

For more information, see the documentation for [LocalWebservice](/python/api/azureml-core/azureml.core.webservice.local.localwebservice), [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-), and [Webservice](/python/api/azureml-core/azureml.core.webservice.webservice).

---

## Deploy again and call your service

Deploy your service again:

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

Replace `bidaf_onnx:1` with the name of your model and its version number.

```azurecli-interactive
az ml model deploy -n myservice \
    -m bidaf_onnx:1 \
    --overwrite \
    --ic inferenceconfig.json \
    --dc deploymentconfig.json \
    -g <resource-group> \
    -w <workspace-name>
```

# [Python SDK](#tab/python)

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=re-deploy-model-code)]

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=re-deploy-model-print-logs)]

For more information, see the documentation for [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) and [Webservice](/python/api/azureml-core/azureml.core.webservice.webservice).

---
Then ensure you can send a post request to the service:

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

```azurecli-interactive
curl -v -X POST -H "content-type:application/json" \
    -d '{"query": "What color is the fox", "context": "The quick brown fox jumped over the lazy dog."}' \
    http://localhost:32267/score
```

# [Python SDK](#tab/python)

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=send-post-request-code)]

---

## Choose a compute target

The compute target you use to host your model will affect the cost and availability of your deployed endpoint. Use this table to choose an appropriate compute target.

| Compute target | Used for | GPU support | Description |
| ----- | ----- | ----- | ----- | 
| [Local&nbsp;web&nbsp;service](how-to-deploy-local-container-notebook-vm.md) | Testing/debugging |  &nbsp; | Use for limited testing and troubleshooting. Hardware acceleration depends on use of libraries in the local system. |
| [Azure Machine Learning Kubernetes](how-to-deploy-azure-kubernetes-service.md) | Real-time inference | Yes | Run inferencing workloads in the cloud. |  
| [Azure Container Instances](how-to-deploy-azure-container-instance.md) | Real-time inference <br/><br/> Recommended for dev/test purposes only.| &nbsp;  | Use for low-scale CPU-based workloads that require less than 48 GB of RAM. Doesn't require you to manage a cluster.<br/><br/> Only suitable for models less than 1 GB in size.<br/><br/> Supported in the designer. |

> [!NOTE]
> When choosing a cluster SKU, first scale up and then scale out. Start with a machine that has 150% of the RAM your model requires, profile the result and find a machine that has the performance you need. Once you've learned that, increase the number of machines to fit your need for concurrent inference.

> [!IMPORTANT]
> The information in this table applies when using SDK v1 or CLI v1 capabilities. When using SDK or CLI v2, there are additional compute targets available. For more information, see [Compute targets](../concept-compute-target.md).

## Deploy to cloud

Once you've confirmed your service works locally and chosen a remote compute target, you are ready to deploy to the cloud. 

Change your deploy configuration to correspond to the compute target you've chosen, in this case Azure Container Instances:

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

The options available for a deployment configuration differ depending on the compute target you choose.

:::code language="json" source="~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/re-deploymentconfig.json":::

Save this file as `re-deploymentconfig.json`.

For more information, see [this reference](reference-azure-machine-learning-cli.md#deployment-configuration-schema).

# [Python SDK](#tab/python)

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=deploy-model-on-cloud-code)]

---

Deploy your service again:


# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

Replace `bidaf_onnx:1` with the name of your model and its version number.

```azurecli-interactive
az ml model deploy -n myservice \
    -m bidaf_onnx:1 \
    --overwrite \
    --ic inferenceconfig.json \
    --dc re-deploymentconfig.json \
    -g <resource-group> \
    -w <workspace-name>
```

To view the service logs, use the following command:

```azurecli-interactive
az ml service get-logs -n myservice \
    -g <resource-group> \
    -w <workspace-name>
```

# [Python SDK](#tab/python)


[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=re-deploy-service-code)]

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=re-deploy-service-print-logs)]

For more information, see the documentation for [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) and [Webservice](/python/api/azureml-core/azureml.core.webservice.webservice).

---


## Call your remote webservice

When you deploy remotely, you may have key authentication enabled. The example below shows how to get your service key with Python in order to make an inference request.

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=call-remote-web-service-code)]

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=call-remote-webservice-print-logs)]



See the article on [client applications to consume web services](how-to-consume-web-service.md) for more example clients in other languages.

  [!INCLUDE [Email Notification Include](../includes/machine-learning-email-notifications.md)]

### Understanding service state

During model deployment, you may see the service state change while it fully deploys.

The following table describes the different service states:

| Webservice state | Description | Final state?
| ----- | ----- | ----- |
| Transitioning | The service is in the process of deployment. | No |
| Unhealthy | The service has deployed but is currently unreachable.  | No |
| Unschedulable | The service cannot be deployed at this time due to lack of resources. | No |
| Failed | The service has failed to deploy due to an error or crash. | Yes |
| Healthy | The service is healthy and the endpoint is available. | Yes |

> [!TIP]
> When deploying, Docker images for compute targets are built and loaded from Azure Container Registry (ACR). By default, Azure Machine Learning creates an ACR that uses the *basic* service tier. Changing the ACR for your workspace to standard or premium tier may reduce the time it takes to build and deploy images to your compute targets. For more information, see [Azure Container Registry service tiers](../../container-registry/container-registry-skus.md).

> [!NOTE]
> If you are deploying a model to Azure Kubernetes Service (AKS), we advise you enable [Azure Monitor](../../azure-monitor/containers/container-insights-enable-existing-clusters.md) for that cluster. This will help you understand overall cluster health and resource usage. You might also find the following resources useful:
>
> * [Check for Resource Health events impacting your AKS cluster](../../aks/aks-resource-health.md)
> * [Azure Kubernetes Service Diagnostics](../../aks/concepts-diagnostics.md)
>
> If you are trying to deploy a model to an unhealthy or overloaded cluster, it is expected to experience issues. If you need help troubleshooting AKS cluster problems please contact AKS Support.

## Delete resources

# [Azure CLI](#tab/azcli)

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]


[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/2.deploy-local-cli.ipynb?name=delete-resource-code)]

```azurecli-interactive
az ml service delete -n myservice
az ml service delete -n myaciservice
az ml model delete --model-id=<MODEL_ID>
```

To delete a deployed webservice, use `az ml service delete <name of webservice>`.

To delete a registered model from your workspace, use `az ml model delete <model id>`

Read more about [deleting a webservice](/cli/azure/ml(v1)/computetarget/create#az-ml-service-delete) and [deleting a model](/cli/azure/ml/model#az-ml-model-delete).

# [Python SDK](#tab/python)

[!Notebook-python[] (~/azureml-examples-archive/v1/python-sdk/tutorials/deploy-local/1.deploy-local.ipynb?name=delete-resource-code)]

To delete a deployed web service, use `service.delete()`.
To delete a registered model, use `model.delete()`.

For more information, see the documentation for [WebService.delete()](/python/api/azureml-core/azureml.core.webservice%28class%29#delete--) and [Model.delete()](/python/api/azureml-core/azureml.core.model.model#delete--).

---

## Next steps

* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Update web service](../how-to-deploy-update-web-service.md)
* [One click deployment for automated ML runs in the Azure Machine Learning studio](../how-to-use-automated-ml-for-ml-models.md#deploy-your-model)
* [Use TLS to secure a web service through Azure Machine Learning](../how-to-secure-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](../how-to-enable-app-insights.md)
* [Create event alerts and triggers for model deployments](../how-to-use-event-grid.md)
