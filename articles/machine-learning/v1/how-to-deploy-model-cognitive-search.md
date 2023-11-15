---
title: Deploy a model for use with Azure AI Search
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning to deploy a model for use with Azure AI Search. The model is used as a custom skill to enrich the search experience.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: ssalgado
author: ssalgadodev
ms.reviewer: ssalgado
ms.date: 03/11/2021
ms.custom:
  - UpdateFrequency5
  - deploy
  - sdkv1
  - event-tier1-build-2022
  - ignite-2023
monikerRange: 'azureml-api-1'
---


# Deploy a model for use with Azure AI Search

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

This article teaches you how to use Azure Machine Learning to deploy a model for use with [Azure AI Search](/azure/search/search-what-is-azure-search).

Azure AI Search performs content processing over heterogenous content, to make it queryable by humans or applications. This process can be enhanced by using a model deployed from Azure Machine Learning.

Azure Machine Learning can deploy a trained model as a web service. The web service is then embedded in a Azure AI Search _skill_, which becomes part of the processing pipeline.

> [!IMPORTANT]
> The information in this article is specific to the deployment of the model. It provides information on the supported deployment configurations that allow the model to be used by Azure AI Search.
>
> For information on how to configure Azure AI Search to use the deployed model, see the [Build and deploy a custom skill with Azure Machine Learning](/azure/search/cognitive-search-tutorial-aml-custom-skill) tutorial.

When deploying a model for use with Azure AI Search, the deployment must meet the following requirements:

* Use Azure Kubernetes Service to host the model for inference.
* Enable transport layer security (TLS) for the Azure Kubernetes Service. TLS is used to secure HTTPS communications between Azure AI Search and the deployed model.
* The entry script must use the `inference_schema` package to generate an OpenAPI (Swagger) schema for the service.
* The entry script must also accept JSON data as input, and generate JSON as output.


## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create workspace resources](../quickstart-create-resources.md).

* A Python development environment with the Azure Machine Learning SDK installed. For more information, see [Azure Machine Learning SDK](/python/api/overview/azure/ml/install).  

* A registered model.

* A general understanding of [How and where to deploy models](how-to-deploy-and-where.md).

## Connect to your workspace

An Azure Machine Learning workspace provides a centralized place to work with all the artifacts you create when you use Azure Machine Learning. The workspace keeps a history of all training jobs, including logs, metrics, output, and a snapshot of your scripts.

To connect to an existing workspace, use the following code:

> [!IMPORTANT]
> This code snippet expects the workspace configuration to be saved in the current directory or its parent. For more information, see [Create and manage Azure Machine Learning workspaces](how-to-manage-workspace.md). For more information on saving the configuration to file, see [Create a workspace configuration file](how-to-configure-environment.md).

```python
from azureml.core import Workspace

try:
    # Load the workspace configuration from local cached inffo
    ws = Workspace.from_config()
    print(ws.name, ws.location, ws.resource_group, ws.location, sep='\t')
    print('Library configuration succeeded')
except:
    print('Workspace not found')
```

## Create a Kubernetes cluster

**Time estimate**: Approximately 20 minutes.

A Kubernetes cluster is a set of virtual machine instances (called nodes) that are used for running containerized applications.

When you deploy a model from Azure Machine Learning to Azure Kubernetes Service, the model and all the assets needed to host it as a web service are packaged into a Docker container. This container is then deployed onto the cluster.

The following code demonstrates how to create a new Azure Kubernetes Service (AKS) cluster for your workspace:

> [!TIP]
> You can also attach an existing Azure Kubernetes Service to your Azure Machine Learning workspace. For more information, see [How to deploy models to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md).

> [!IMPORTANT]
> Notice that the code uses the `enable_ssl()` method to enable transport layer security (TLS) for the cluster. This is required when you plan on using the deployed model from Azure AI Search.

```python
from azureml.core.compute import AksCompute, ComputeTarget
# Create or attach to an AKS inferencing cluster

# Create the provisioning configuration with defaults
prov_config = AksCompute.provisioning_configuration()

# Enable TLS (sometimes called SSL) communications
# Leaf domain label generates a name using the formula
#  "<leaf-domain-label>######.<azure-region>.cloudapp.azure.com"
#  where "######" is a random series of characters
prov_config.enable_ssl(leaf_domain_label = "contoso")

cluster_name = 'amlskills'
# Try to use an existing compute target by that name.
# If one doesn't exist, create one.
try:
    
    aks_target = ComputeTarget(ws, cluster_name)
    print("Attaching to existing cluster")
except Exception as e:
    print("Creating new cluster")
    aks_target = ComputeTarget.create(workspace = ws, 
                                  name = cluster_name, 
                                  provisioning_configuration = prov_config)
    # Wait for the create process to complete
    aks_target.wait_for_completion(show_output = True)
```

> [!IMPORTANT]
> Azure will bill you as long as the AKS cluster exists. Make sure to delete your AKS cluster when you're done with it.

For more information on using AKS with Azure Machine Learning, see [How to deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md).

## Write the entry script

The entry script receives data submitted to the web service, passes it to the model, and returns the scoring results. The following script loads the model on startup, and then uses the model to score data. This file is sometimes called `score.py`.

> [!TIP]
> The entry script is specific to your model. For example, the script must know the framework to use with your model, data formats, etc.

> [!IMPORTANT]
> When you plan on using the deployed model from Azure AI Search you must use the `inference_schema` package to enable schema generation for the deployment. This package provides decorators that allow you to define the input and output data format for the web service that performs inference using the model.

```python
from azureml.core.model import Model
from nlp_architect.models.absa.inference.inference import SentimentInference
from spacy.cli.download import download as spacy_download
import traceback
import json
# Inference schema for schema discovery
from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.numpy_parameter_type import NumpyParameterType
from inference_schema.parameter_types.standard_py_parameter_type import StandardPythonParameterType

def init():
    """
    Set up the ABSA model for Inference  
    """
    global SentInference
    spacy_download('en')
    aspect_lex = Model.get_model_path('hotel_aspect_lex')
    opinion_lex = Model.get_model_path('hotel_opinion_lex') 
    SentInference = SentimentInference(aspect_lex, opinion_lex)

# Use inference schema decorators and sample input/output to
# build the OpenAPI (Swagger) schema for the deployment
standard_sample_input = {'text': 'a sample input record containing some text' }
standard_sample_output = {"sentiment": {"sentence": "This place makes false booking prices, when you get there, they say they do not have the reservation for that day.", 
                                        "terms": [{"text": "hotels", "type": "AS", "polarity": "POS", "score": 1.0, "start": 300, "len": 6}, 
                                                  {"text": "nice", "type": "OP", "polarity": "POS", "score": 1.0, "start": 295, "len": 4}]}}
@input_schema('raw_data', StandardPythonParameterType(standard_sample_input))
@output_schema(StandardPythonParameterType(standard_sample_output))    
def run(raw_data):
    try:
        # Get the value of the 'text' field from the JSON input and perform inference
        input_txt = raw_data["text"]
        doc = SentInference.run(doc=input_txt)
        if doc is None:
            return None
        sentences = doc._sentences
        result = {"sentence": doc._doc_text}
        terms = []
        for sentence in sentences:
            for event in sentence._events:
                for x in event:
                    term = {"text": x._text, "type":x._type.value, "polarity": x._polarity.value, "score": x._score,"start": x._start,"len": x._len }
                    terms.append(term)
        result["terms"] = terms
        print("Success!")
        # Return the results to the client as a JSON document
        return {"sentiment": result}
    except Exception as e:
        result = str(e)
        # return error message back to the client
        print("Failure!")
        print(traceback.format_exc())
        return json.dumps({"error": result, "tb": traceback.format_exc()})
```

For more information on entry scripts, see [How and where to deploy](how-to-deploy-and-where.md).

## Define the software environment

The environment class is used to define the Python dependencies for the service. It includes dependencies required by both the model and the entry script. In this example, it installs packages from the regular pypi index, as well as from a GitHub repo. 

```python
from azureml.core.conda_dependencies import CondaDependencies 
from azureml.core import Environment

conda = None
pip = ["azureml-defaults", "azureml-monitoring", 
       "git+https://github.com/NervanaSystems/nlp-architect.git@absa", 'nlp-architect', 'inference-schema',
       "spacy==2.0.18"]

conda_deps = CondaDependencies.create(conda_packages=None, pip_packages=pip)

myenv = Environment(name='myenv')
myenv.python.conda_dependencies = conda_deps
```

For more information on environments, see [Create and manage environments for training and deployment](how-to-use-environments.md).

## Define the deployment configuration

The deployment configuration defines the Azure Kubernetes Service hosting environment used to run the web service.

> [!TIP]
> If you aren't sure about the memory, CPU, or GPU needs of your deployment, you can use profiling to learn these. For more information, see [How and where to deploy a model](how-to-deploy-and-where.md).

```python
from azureml.core.model import Model
from azureml.core.webservice import Webservice
from azureml.core.image import ContainerImage
from azureml.core.webservice import AksWebservice, Webservice

# If deploying to a cluster configured for dev/test, ensure that it was created with enough
# cores and memory to handle this deployment configuration. Note that memory is also used by
# things such as dependencies and Azure Machine Learning components.

aks_config = AksWebservice.deploy_configuration(autoscale_enabled=True, 
                                                       autoscale_min_replicas=1, 
                                                       autoscale_max_replicas=3, 
                                                       autoscale_refresh_seconds=10, 
                                                       autoscale_target_utilization=70,
                                                       auth_enabled=True, 
                                                       cpu_cores=1, memory_gb=2, 
                                                       scoring_timeout_ms=5000, 
                                                       replica_max_concurrent_requests=2, 
                                                       max_request_wait_time=5000)
```

For more information, see the reference documentation for [AksService.deploy_configuration](/python/api/azureml-core/azureml.core.webservice.akswebservice#deploy-configuration-autoscale-enabled-none--autoscale-min-replicas-none--autoscale-max-replicas-none--autoscale-refresh-seconds-none--autoscale-target-utilization-none--collect-model-data-none--auth-enabled-none--cpu-cores-none--memory-gb-none--enable-app-insights-none--scoring-timeout-ms-none--replica-max-concurrent-requests-none--max-request-wait-time-none--num-replicas-none--primary-key-none--secondary-key-none--tags-none--properties-none--description-none--gpu-cores-none--period-seconds-none--initial-delay-seconds-none--timeout-seconds-none--success-threshold-none--failure-threshold-none--namespace-none--token-auth-enabled-none--compute-target-name-none-).

## Define the inference configuration

The inference configuration points to the entry script and the environment object:

```python
from azureml.core.model import InferenceConfig
inf_config = InferenceConfig(entry_script='score.py', environment=myenv)
```

For more information, see the reference documentation for [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig).

## Deploy the model

Deploy the model to your AKS cluster and wait for it to create your service. In this example, two registered models are loaded from the registry and deployed to AKS. After deployment, the `score.py` file in the deployment loads these models and uses them to perform inference.

```python
from azureml.core.webservice import AksWebservice, Webservice

c_aspect_lex = Model(ws, 'hotel_aspect_lex')
c_opinion_lex = Model(ws, 'hotel_opinion_lex') 
service_name = "hotel-absa-v2"

aks_service = Model.deploy(workspace=ws,
                           name=service_name,
                           models=[c_aspect_lex, c_opinion_lex],
                           inference_config=inf_config,
                           deployment_config=aks_config,
                           deployment_target=aks_target,
                           overwrite=True)

aks_service.wait_for_deployment(show_output = True)
print(aks_service.state)
```

For more information, see the reference documentation for [Model](/python/api/azureml-core/azureml.core.model.model).

## Issue a sample query to your service

The following example uses the deployment information stored in the `aks_service` variable by the previous code section. It uses this variable to retrieve the scoring URL and authentication token needed to communicate with the service:

```python
import requests
import json

primary, secondary = aks_service.get_keys()

# Test data
input_data = '{"raw_data": {"text": "This is a nice place for a relaxing evening out with friends. The owners seem pretty nice, too. I have been there a few times including last night. Recommend."}}'

# Since authentication was enabled for the deployment, set the authorization header.
headers = {'Content-Type':'application/json',  'Authorization':('Bearer '+ primary)} 

# Send the request and display the results
resp = requests.post(aks_service.scoring_uri, input_data, headers=headers)
print(resp.text)
```

The result returned from the service is similar to the following JSON:

```json
{"sentiment": {"sentence": "This is a nice place for a relaxing evening out with friends. The owners seem pretty nice, too. I have been there a few times including last night. Recommend.", "terms": [{"text": "place", "type": "AS", "polarity": "POS", "score": 1.0, "start": 15, "len": 5}, {"text": "nice", "type": "OP", "polarity": "POS", "score": 1.0, "start": 10, "len": 4}]}}
```

## Connect to Azure AI Search

For information on using this model from Azure AI Search, see the [Build and deploy a custom skill with Azure Machine Learning](/azure/search/cognitive-search-tutorial-aml-custom-skill) tutorial.

## Clean up the resources

If you created the AKS cluster specifically for this example, delete your resources after you're done testing it with Azure AI Search.

> [!IMPORTANT]
> Azure bills you based on how long the AKS cluster is deployed. Make sure to clean it up after you are done with it.

```python
aks_service.delete()
aks_target.delete()
```

## Next steps

* [Build and deploy a custom skill with Azure Machine Learning](/azure/search/cognitive-search-tutorial-aml-custom-skill)
