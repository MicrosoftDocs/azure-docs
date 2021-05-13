---
title: Deploy a custom container as a managed online endpoint
titleSuffix: Azure Machine Learning
description: Learn how to use a custom container to leverage open source servers in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.reviewer: larryfr
ms.date: 05/07/2021
ms.topic: how-to
ms.custom: deploy
---

# Deploy a model using a custom container

Learn how to deploy a custom container as a managed online endpoint in Azure Machine Learning.

Using a custom container lets you deploy web servers that may not listen on same ports and paths as the default Flask server used by Azure Machchine Learning, while still taking advantage of Azure Machine Learning's built-in monitoring, scaling, alerting, and authentication.

> [!WARNING]
> Microsoft may not be able to help troubleshoot problems caused by a custom image. If you encounter problems, you may be asked to use the default image or one of the images Microsoft provides to see if the problem is specific to your image.

## Prerequisites

* An Azure Machine Learning workspace. For more information, see the [Create a workspace](how-to-manage-workspace.md) article.
* A Linux machine with [Docker](https://docs.docker.com/engine/install/ubuntu/) and Python installed. If you don't have a Linux machine locally, you can use a [compute instance](how-to-create-manage-compute-instance.md).

## How to file bugs

To file bugs specific to custom containers, use [this template](https://msdata.visualstudio.com/Vienna/_workitems/create/Bug?templateId=405d465d-f360-4289-a148-0b58977d8648&ownerId=80b4b67c-37f8-4778-8433-367a704cbb9a)

To file bugs that are related to MIRv2 more broadly, use [this template](https://msdata.visualstudio.com/Vienna/_workitems/create/Bug?templateId=ee7fe228-9841-4de5-b658-4f9b1136729d&ownerId=80b4b67c-37f8-4778-8433-367a704cbb9a)

## Install and configure extension

Once you have created your compute instance, go to **Compute** -> **name of compute instance** -> **JupyterLab** -> **Terminal** to run the command below.

```azurecli-interactive
# Install Azure CLI
# Do not run installation if using a fresh compute instance! This will mess things up
# curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

az --version # Needs to be >= 2.15.0

# Remove any previously installed versions of the az ml extension
az extension remove -n ml; az extension remove -n azure-cli-ml
az extension add --source https://azuremlsdktestpypi.blob.core.windows.net/wheels/sdk-cli-v2/ml-0.0.75-py3-none-any.whl \
     --pip-extra-index-urls https://azuremlsdktestpypi.azureedge.net/sdk-cli-v2 -y
az login
az account set -s "<subscription_name>"
az configure --defaults group="<resource_group>" workspace="<workspace_name>"
```

## Download source code

```azurecli-interactive
git clone https://github.com/Azure/azureml-examples.git --branch cli-preview
cd azureml-examples/cli
```

## Deploy TensorFlow Serving model

To deploy a TensorFlow serving model, first open the `how-to-deploy-tfserving.sh` script and change the value of the `ENDPOINT_NAME` environment variable to something unique.

The, run the script below.

```azurecli-interactive

./how-to-deploy-tfserving.sh

```

If you'd rather run the steps one by one, see below.

### Download a simple TensorFlow model that divides an input by two and adds 2 to the result


```azurecli-interactive

wget https://aka.ms/half_plus_two-model -O $BASE_PATH/half_plus_two.tar.gz
tar -xvf $BASE_PATH/half_plus_two.tar.gz -C $BASE_PATH

```

### Run a tensorflow serving image locally to test that it works

```azurecli-interactive

docker run --rm -d -v $PWD/$BASE_PATH:$MODEL_BASE_PATH -p 8501:8501 \
 -e MODEL_BASE_PATH=$MODEL_BASE_PATH -e MODEL_NAME=$MODEL_NAME \
 --name="tfserving-test" docker.io/tensorflow/serving:latest

```

### Check that you can send liveness and scoring requests to the image

```azurecli-interactive

# Check liveness locally
curl -v http://localhost:8501/v1/models/$MODEL_NAME

# Check scoring locally
curl --header "Content-Type: application/json" \
  --request POST \
  --data @$BASE_PATH/sample_request.json \
  http://localhost:8501/v1/models/$MODEL_NAME:predict

```

### Stop the image

```azurecli-interactive
docker stop tfserving-test
```

### Create a YAML file for your endpoint

```yaml
$schema: https://azuremlsdk2.blob.core.windows.net/latest/managedOnlineEndpoint.schema.json
name: tfserving-endpoint
type: online
auth_mode: aml_token
traffic:
  tfserving: 100

deployments:
  - name: tfserving
    model:
      name: tfserving-mounted
      version: 1
      local_path: ./half_plus_two
    environment_variables:
      MODEL_BASE_PATH: /var/azureml-app/azureml-models/tfserving-mounted/1
      MODEL_NAME: half_plus_two
    environment:
      docker:
        image: docker.io/tensorflow/serving:latest
      inference_config:
        liveness_route:
          port: 8501
          path: /v1/models/half_plus_two
        readiness_route:
          port: 8501
          path: /v1/models/half_plus_two
        scoring_route:
          port: 8501
          path: /v1/models/half_plus_two:predict
    instance_type: Standard_F2s_v2
    scale_settings:
      scale_type: manual
      instance_count: 1
      min_instances: 1
      max_instances: 2
```

### Deploy the endpoint

```azurecli-interactive
az ml endpoint create -f $BASE_PATH/$ENDPOINT_NAME.yml -n $ENDPOINT_NAME
```

### Create a sample JSON payload

```json
{"instances": [1.0, 2.0, 5.0]}
```

### Run scoring

```azurecli-interactive
az ml endpoint invoke -n $ENDPOINT_NAME --request-file $BASE_PATH/sample_request.json
```

### Check endpoint logs

```azurecli-interactive
az ml endpoint get-logs -n $ENDPOINT_NAME --deployment $DEPLOYMENT_NAME
az ml endpoint get-logs -n $ENDPOINT_NAME --deployment $DEPLOYMENT_NAME --container storage-initializer
```

View metrics for your endpoint in the [Azure portal](https://portal.azure.com)

### Delete endpoint and model

```azurecli-interactive
az ml endpoint delete -n $ENDPOINT_NAME -y
az ml model delete -n tfserving-mounted --version 1
```

## Deploy Triton ensemble model

To deploy a TensorFlow serving model, first open the `how-to-deploy-triton.sh` script and change the value of the `ENDPOINT_NAME` environment variable to something unique.

Then install some required python packages:

```azurecli-interactive
pip install nvidia-pyindex
pip install tritonclient[http] gevent
pip install numpy
```

Then run the script below.

```azurecli-interactive
./how-to-deploy-triton.sh
```

This script will:
1. Download a Triton ensemble model that classifies images
2. Build an image from the NVIDIA Triton base image, adding some pip packages along the way
3. Push this image into your workspace's Azure Container Registry
4. Run the image locally to test that it works
5. Deploy the image as a managed online endpoint
6. Run predictions against that deployed endpoint

Once the script finishes running, open up the Azure portal and click on the endpoint in order to see the metrics that were collected.

### Bonus points

For bonus points, try testing the classifier with a different JPEG. Look up an image on Bing Image search. Then run:

```azurecli-interactive
KEY=$(az ml endpoint list-keys -n triton-endpoint --query accessToken -o tsv)
BASE_URL=$(az ml endpoint show -n triton-endpoint --query scoring_uri -o tsv | cut -d'/' -f3)
endpoints/online/custom-container/test_triton.py --base_url=$BASE_URL --token=$KEY --num_requests=1 --image_url=<paste_image_link>
```
and see if the classifier works.

## Next steps

* Learn more about [Where to deploy and how](how-to-deploy-and-where.md).
* Learn how to [Train and deploy machine learning models using Azure Pipelines](/azure/devops/pipelines/targets/azure-machine-learning).