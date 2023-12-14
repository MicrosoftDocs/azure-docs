---
title: Deploy models from HuggingFace hub to Azure Machine Learning online endpoints for real-time inference (Preview)
titleSuffix: Azure Machine Learning
description: Deploy and score transformers based large language models from the Hugging Face hub. 
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.custom: devx-track-python
ms.topic: how-to
ms.reviewer: ssalgado
author: ManojBableshwar
ms.author: swatig
ms.date: 05/15/2023
---

# Deploy models from HuggingFace hub to Azure Machine Learning online endpoints for real-time inference 


Microsoft has partnered with Hugging Face to bring open-source models from Hugging Face Hub to Azure Machine Learning. Hugging Face is the creator of Transformers, a widely popular library for building large language models. The Hugging Face model hub that has thousands of open-source models. The integration with Azure Machine Learning enables you to deploy open-source models of your choice to secure and scalable inference infrastructure on Azure. You can search from thousands of transformers models in Azure Machine Learning model catalog and deploy models to managed online endpoint with ease through the guided wizard. Once deployed, the managed online endpoint gives you secure REST API to score your model in real time. 

> [!NOTE] 
> Models from Hugging Face are subject to third party license terms available on the Hugging Face model details page. It is your responsibility to comply with the model's license terms.

## Benefits of using online endpoints for real-time inference

Managed online endpoints in Azure Machine Learning help you deploy models to powerful CPU and GPU machines in Azure in a turnkey manner. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure. The virtual machines are provisioned on your behalf when you deploy models. You can have multiple deployments behind and [split traffic or mirror traffic](./how-to-safely-rollout-online-endpoints.md) to those deployments. Mirror traffic helps you to test new versions of models on production traffic without releasing them production environments. Splitting traffic lets you gradually increase production traffic to new model versions while observing performance. [Auto scale](./how-to-autoscale-endpoints.md) lets you dynamically ramp up or ramp down resources based on workloads. You can configure scaling based on utilization metrics, a specific schedule or a combination of both. An example of scaling based on utilization metrics is to add nodes if CPU utilization goes higher than 70%. An example of schedule-based scaling is to add nodes based on peak business hours. 


## Deploy HuggingFace hub models using Studio 

To find a model to deploy, open the model catalog in Azure Machine Learning studio. Select on the HuggingFace hub collection. Filter by task or license and search the models. Select the model tile to open the model page.

### Deploy the model

Choose the real-time deployment option to open the quick deploy dialog. Specify the following options:
* Select the template for GPU or CPU. CPU instance types are good for testing and GPU instance types offer better performance in production. Models that are large don't fit in a CPU instance type. 
* Select the instance type. This list of instances is filtered down to the ones that the model is expected to deploy without running out of memory. 
* Select the number of instances. One instance is sufficient for testing but we recommend considering two or more instances for production. 
* Optionally specify an endpoint and deployment name.
* Select deploy. You're then navigated to the endpoint page which, might take a few seconds. The deployment takes several minutes to complete based on the model size and instance type. 

:::image type="content" source="media/how-to-deploy-models-from-huggingface/deploy-models-from-huggingface.gif" lightbox="media/how-to-deploy-models-from-huggingface/deploy-models-from-huggingface.gif" alt-text="Animation showing the location of the model catalog within the Azure Machine learning studio":::

Note: If you want to deploy to en existing endpoint, select `More options` from the quick deploy dialog and use the full deployment wizard.

### Test the deployed model

Once the deployment completes, you can find the REST endpoint for the model in the endpoints page, which can be used to score the model. You find options to add more deployments, manage traffic and scaling the Endpoints hub. You also use the Test tab on the endpoint page to test the model with sample inputs. Sample inputs are available on the model page. You can find input format, parameters and sample inputs on the [Hugging Face hub inference API documentation](https://huggingface.co/docs/api-inference/detailed_parameters).

## Deploy HuggingFace hub models using Python SDK

[Setup the Python SDK](/python/api/overview/azure/ai-ml-readme). 

### Find the model to deploy

Browse the model catalog in Azure Machine Learning studio and find the model you want to deploy. Copy the model name you want to deploy. Import the required libraries. The models shown in the catalog are listed from the `HuggingFace` registry. Create the `model_id` using the model name you copied from the model catalog and the `HuggingFace` registry. You deploy the `bert_base_uncased` model with the latest version in this example. 

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    Environment,
    CodeConfiguration,
)
registry_name = "HuggingFace"
model_name = "bert_base_uncased"
model_id = f"azureml://registries/{registry_name}/models/{model_name}/labels/latest"
```
### Deploy the model

Create an online endpoint. Next, create the deployment. Lastly, set all the traffic to use this deployment. You can find the optimal CPU or GPU `instance_type` for a model by opening the quick deployment dialog from the model page in the model catalog. Make sure you use an `instance_type` for which you have quota. 

```python
import time
endpoint_name="hf-ep-" + str(int(time.time())) # endpoint name must be unique per Azure region, hence appending timestamp 
ml_client.begin_create_or_update(ManagedOnlineEndpoint(name=endpoint_name) ).wait()
ml_client.online_deployments.begin_create_or_update(ManagedOnlineDeployment(
    name="demo",
    endpoint_name=endpoint_name,
    model=model_id,
    instance_type="Standard_DS2_v2",
    instance_count=1,
)).wait()
endpoint.traffic = {"demo": 100}
ml_client.begin_create_or_update(endpoint_name).result()
```

### Test the deployed model

Create a file with inputs that can be submitted to the online endpoint for scoring. Below code sample input for the `fill-mask` type since we deployed the `bert-base-uncased` model. You can find input format, parameters and sample inputs on the [Hugging Face hub inference API documentation](https://huggingface.co/docs/api-inference/detailed_parameters).

```python
import json
scoring_file = "./sample_score.json"
with open(scoring_file, "w") as outfile:
    outfile.write('{"inputs": ["Paris is the [MASK] of France.", "The goal of life is [MASK]."]}')   
response = workspace_ml_client.online_endpoints.invoke(
    endpoint_name=endpoint_name,
    deployment_name="demo",
    request_file=scoring_file,
)
response_json = json.loads(response)
print(json.dumps(response_json, indent=2))
``` 
## Deploy HuggingFace hub models using CLI

[Setup the CLI](./how-to-configure-cli.md). 

### Find the model to deploy

Browse the model catalog in Azure Machine Learning studio and find the model you want to deploy. Copy the model name you want to deploy. The models shown in the catalog are listed from the `HuggingFace` registry. You deploy the `bert_base_uncased` model with the latest version in this example. 

### Deploy the model

You need the `model` and `instance_type` to deploy the model. You can find the optimal CPU or GPU `instance_type` for a model by opening the quick deployment dialog from the model page in the model catalog. Make sure you use an `instance_type` for which you have quota. 

The models shown in the catalog are listed from the `HuggingFace` registry. You deploy the `bert_base_uncased` model with the latest version in this example. The fully qualified `model` asset id based on the model name and registry is `azureml://registries/HuggingFace/models/bert-base-uncased/labels/latest`. We create the `deploy.yml` file used for the `az ml online-deployment create` command inline. 

Create an online endpoint. Next, create the deployment.

```shell
# create endpoint
endpoint_name="hf-ep-"$(date +%s)
model_name="bert-base-uncased"
az ml online-endpoint create --name $endpoint_name 

# create deployment file. 
cat <<EOF > ./deploy.yml
name: demo
model: azureml://registries/HuggingFace/models/$model_name/labels/latest
endpoint_name: $endpoint_name
instance_type: Standard_DS3_v2
instance_count: 1
EOF
az ml online-deployment create --file ./deploy.yml --workspace-name $workspace_name --resource-group $resource_group_name

```

### Test the deployed model

Create a file with inputs that can be submitted to the online endpoint for scoring. Hugging Face as a code sample input for the `fill-mask` type for our deployed model the `bert-base-uncased` model. You can find input format, parameters and sample inputs on the [Hugging Face hub inference API documentation](https://huggingface.co/docs/api-inference/detailed_parameters).

```shell
scoring_file="./sample_score.json"
cat <<EOF > $scoring_file
{
  "inputs": [
    "Paris is the [MASK] of France.",
    "The goal of life is [MASK]."
  ]
}
EOF
az ml online-endpoint invoke --name $endpoint_name --request-file $scoring_file
```

## Hugging Face Model example code

Follow this link to find [hugging face model example code](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/huggingface/inference) for various scenarios including token classification, translation, question answering, and zero shot classification. 

## Troubleshooting: Deployment errors and unsupported models

HuggingFace hub has thousands of models with hundreds being updated each day. Only the most popular models in the collection are tested and others may fail with one of the below errors.

### Gated models
[Gated models](https://huggingface.co/docs/hub/models-gated) require users to agree to share their contact information and accept the model owners' terms and conditions in order to access the model. Attempting to deploy such models will fail with a `KeyError`.

### Models that need to run remote code
Models typically use code from the transformers SDK but some models run code from the model repo. Such models need to set the parameter `trust_remote_code` to `True`. Follow this link to learn more about using [remote code](https://huggingface.co/docs/transformers/custom_models#using-a-model-with-custom-code). Such models are not supported from keeping security in mind. Attempting to deploy such models will fail with the following error: `ValueError: Loading <model> requires you to execute the configuration file in that repo on your local machine. Make sure you have read the code there to avoid malicious use, then set the option trust_remote_code=True to remove this error.`

### Models with incorrect tokenizers
Incorrectly specified or missing tokenizer in the model package can result in `OSError: Can't load tokenizer for <model>` error.

### Missing libraries
Some models need additional python libraries. You can install missing libraries when running models locally. Models that need special libraries beyond the standard transformers libraries will fail with `ModuleNotFoundError` or `ImportError` error.

### Insufficient memory
If you see the `OutOfQuota: Container terminated due to insufficient memory`, try using a `instance_type` with more memory. 

## Frequently asked questions

**Where are the model weights stored?**

Hugging Face models are featured in the Azure Machine Learning model catalog through the `HuggingFace` registry. Hugging Face creates and manages this registry and is made available to Azure Machine Learning as a Community Registry. The model weights aren't hosted on Azure. The weights are downloaded directly from Hugging Face hub to the online endpoints in your workspace when these models deploy. `HuggingFace` registry in AzureML works as a catalog to help discover and deploy HuggingFace hub models in Azure Machine Learning.

**How to deploy the models for batch inference?**
Deploying these models to batch endpoints for batch inference is currently not supported. 

**Can I use models from the `HuggingFace` registry as input to jobs so that I can finetune these models using transformers SDK?**
Since the model weights aren't stored in the `HuggingFace` registry, you cannot access model weights by using these models as inputs to jobs.

**How do I get support if my deployments fail or inference doesn't work as expected?**
`HuggingFace` is a community registry and that is not covered by Microsoft support. Review the deployment logs and find out if the issue is related to Azure Machine Learning platform or specific to HuggingFace transformers. Contact Microsoft support for any platform issues. Example, not being able to create online endpoint or authentication to endpoint REST API doesn't work. For transformers specific issues, use the  [HuggingFace forum](https://discuss.huggingface.co/) or [HuggingFace support](https://huggingface.co/support). 

**What is a community registry?**
Community registries are Azure Machine Learning registries created by trusted Azure Machine Learning partners and available to all Azure Machine Learning users.

**Where can users submit questions and concerns regarding Hugging Face within Azure Machine Learning?**
Submit your questions in the [Azure Machine Learning discussion forum.](https://discuss.huggingface.co/t/about-the-azure-machine-learning-category/40677) 

## Learn more

Learn [how to use foundation models in Azure Machine Learning.](./how-to-use-foundation-models.md)
