---
title: Deploy a custom container as an online endpoint
titleSuffix: Azure Machine Learning
description: Learn how to use a custom container to use open-source servers in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: ssambare
author: shivanissambare
ms.reviewer: larryfr
ms.date: 05/11/2022
ms.topic: how-to
ms.custom: deploy, devplatv2, devx-track-azurecli, cliv2
ms.devlang: azurecli
---

# Deploy a TensorFlow model served with TF Serving using a custom container in an online endpoint

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]


Learn how to deploy a custom container as an online endpoint in Azure Machine Learning.

Custom container deployments can use web servers other than the default Python Flask server used by Azure Machine Learning. Users of these deployments can still take advantage of Azure Machine Learning's built-in monitoring, scaling, alerting, and authentication.

> [!WARNING]
> Microsoft may not be able to help troubleshoot problems caused by a custom image. If you encounter problems, you may be asked to use the default image or one of the images Microsoft provides to see if the problem is specific to your image.

## Prerequisites

* Install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* You must have an Azure resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace. You'll have such a workspace if you configured your ML extension per the above article.

* If you've not already set the defaults for Azure CLI, you should save your default settings. To avoid having to repeatedly pass in the values, run:

   ```azurecli
   az account set --subscription <subscription id>
   az configure --defaults workspace=<azureml workspace name> group=<resource group>

* To deploy locally, you must have [Docker engine](https://docs.docker.com/engine/install/) running locally. This step is **highly recommended**. It will help you debug issues.

## Download source code

To follow along with this tutorial, download the source code below.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli
```

## Initialize environment variables

Define environment variables:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="initialize_variables":::

## Download a TensorFlow model

Download and unzip a model that divides an input by two and adds 2 to the result:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="download_and_unzip_model":::

## Run a TF Serving image locally to test that it works

Use docker to run your image locally for testing:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="run_image_locally_for_testing":::

### Check that you can send liveness and scoring requests to the image

First, check that the container is "alive," meaning that the process inside the container is still running. You should get a 200 (OK) response.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="check_liveness_locally":::

Then, check that you can get predictions about unlabeled data:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="check_scoring_locally":::

### Stop the image

Now that you've tested locally, stop the image:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="stop_image":::

## Create a YAML file for your endpoint and deployment

You can configure your cloud deployment using YAML. Take a look at the sample YAML for this example:

__tfserving-endpoint.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/custom-container/tfserving-endpoint.yml":::

__tfserving-deployment.yml__

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/custom-container/tfserving-deployment.yml":::

There are a few important concepts to notice in this YAML:

### Readiness route vs. liveness route

An HTTP server defines paths for both _liveness_ and _readiness_. A liveness route is used to check whether the server is running. A readiness route is used to check whether the server is ready to do work. In machine learning inference, a server could respond 200 OK to a liveness request before loading a model. The server could respond 200 OK to a readiness request only after the model has been loaded into memory.

Review the [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) for more information about liveness and readiness probes.

Notice that this deployment uses the same path for both liveness and readiness, since TF Serving only defines a liveness route.

### Locating the mounted model

When you deploy a model as an online endpoint, Azure Machine Learning _mounts_ your model to your endpoint. Model mounting enables you to deploy new versions of the model without having to create a new Docker image. By default, a model registered with the name *foo* and version *1* would be located at the following path inside of your deployed container: `/var/azureml-app/azureml-models/foo/1`

For example, if you have a directory structure of `/azureml-examples/cli/endpoints/online/custom-container` on your local machine, where the model is named `half_plus_two`:

:::image type="content" source="./media/how-to-deploy-custom-container/local-directory-structure.png" alt-text="Diagram showing a tree view of the local directory structure.":::

and `tfserving-deployment.yml` contains:

```yaml
model:
    name: tfserving-mounted
    version: 1
    path: ./half_plus_two
```

then your model will be located under `/var/azureml-app/azureml-models/tfserving-deployment/1` in your deployment:

:::image type="content" source="./media/how-to-deploy-custom-container/deployment-location.png" alt-text="Diagram showing a tree view of the deployment directory structure.":::

You can optionally configure your `model_mount_path`. It enables you to change the path where the model is mounted. For example, you can have `model_mount_path` parameter in your _tfserving-deployment.yml_:

> [!IMPORTANT]
> The `model_mount_path` must be a valid absolute path in Linux (the OS of the container image).

```YAML
name: tfserving-deployment
endpoint_name: tfserving-endpoint
model:
  name: tfserving-mounted
  version: 1
  path: ./half_plus_two
model_mount_path: /var/tfserving-model-mount
.....
```

then your model will be located at `/var/tfserving-model-mount/tfserving-deployment/1` in your deployment. Note that it is no longer under `azureml-app/azureml-models`, but under the mount path you specified:

:::image type="content" source="./media/how-to-deploy-custom-container/mount-path-deployment-location.png" alt-text="Diagram showing a tree view of the deployment directory structure when using mount_model_path.":::

### Create your endpoint and deployment

Now that you've understood how the YAML was constructed, create your endpoint.

```azurecli
az ml online-endpoint create --name tfserving-endpoint -f endpoints/online/custom-container/tfserving-endpoint.yml
```

Creating a deployment may take few minutes.



```azurecli
az ml online-deployment create --name tfserving-deployment -f endpoints/online/custom-container/tfserving-deployment.yml
```

### Invoke the endpoint

Once your deployment completes, see if you can make a scoring request to the deployed endpoint.

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-tfserving.sh" id="invoke_endpoint":::

### Delete endpoint and model

Now that you've successfully scored with your endpoint, you can delete it:

```azurecli
az ml online-endpoint delete --name tfserving-endpoint
```

```azurecli
az ml model delete -n tfserving-mounted --version 1
```

## Next steps

- [Safe rollout for online endpoints](how-to-safely-rollout-managed-endpoints.md)
- [Troubleshooting online endpoints deployment](./how-to-troubleshoot-online-endpoints.md)
- [Torch serve sample](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-torchserve.sh)
