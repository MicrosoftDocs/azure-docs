---
title: Blue-green deployments with managed endpoints 
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model as a web service automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 04/24/2021
ms.topic: how-to 
ms.custom: how-to 
---

# Deploy managed inference (preview) endpoints

2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
~~* A machine learning model. If you don't have a trained model, find the notebook example that best fits your compute scenario in [this repo](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/ml-frameworks/using-mlflow) and follow its instructions. ~~
* The Azure Command Line Interface (CLI) and ML extension. You must have Azure CLI version `>=tk`. Check your version:

:::code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-configure-cli.sh" id="az_ml_verify":::
* Resource group, workspace, and tk defaults configured for the ML extension. Check your configuration with:

:::code language="azurecli" source="tk" id="confirm_rg_ws_config":::

For more information on installing and configuring the Azure CLI and ML extension, see [tk](tk).

## Clone the example repo

clobe
run config script
follow alogn or run deployment script

## Review the configuration YAML file for your deployment

To deploy a managed endpoint with the CLI, you'll need to define some parameters in a YAML file. You can find an example in the [azureml-examples](https://github.com/azure/azureml-examples/) repo. The following is defined in `endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yaml`: 

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yaml" :::

{>> Q: Docker image is ubuntu 16.04? Not 18?<<}

Explanatory tk: this will both register the model and environment

The initial keys and values specify the name by which you want to refer to the endpoint, the authorization mode, and that it is an `online` endpoint. In a basic deployment, leave the `traffic` node's `blue: 100` key-value pair as-is. This means that you just want a single deployment that will receive 100% of the traffic, not a more complex "blue-green" deployment. For more on creating a "blue-green" deployment, see [tk](tk). 

The first set of key-value pairs under the `deployments` node specify the model, scoring script, and environment. ~~You'll have to change these values to match your local paths. ~~

The `instance_type` key specifies the compute model you wish to use for inferencing. In this case, a `Standard_F2s_v2` is a 2-processor, compute-optimized machine. For more information, see [Fsv2-series](https://docs.microsoft.com/azure/virtual-machines/fsv2-series). 

Finally, the `scale_settings` node specifies that you want a single compute instance with the ability to scale to a second, but that starting the second node should be done manually. {>> Q: Confirm. I assume `manual` vs `auto` means something. <<} At the moment only manual supported.

## Create a deployment using your configuration

To perform the deployment, use the Azure CLI to run: 

{>> Better if pulled from sample. Possible? <<}
```azurecli
az ml endpoint create --name my-endpoint -f examples/endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yaml
```

Note that the value of the `--name` argument may override the `name` key inside the YAML file. Once the command executes, you can check the state of the deployment using: 

```azurecli
az ml endpoint show -n my-endpoint
```

To refine the above query to only return specific data, see (Query Azure CLI command output)[https://docs.microsoft.com/cli/azure/query-azure-cli]. 

## Test your endpoint

Once your endpoint is deployed, confirm its operation. Details of inferencing will of course vary from model to model. If you have deployed the sample regression model from the repo, the JSON query parameters look like: 

:::code language="json" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/simple-flow/sample-request.json" :::

To call your endpoint, run: 

```azurecli
az ml endpoint invoke -n my-endpoint --request-file examples/endpoints/online/model-1/sample-request.json
```

You should see output similar to: 

```bash
tk
```

### Call the endpoint using REST

If you want to test REST access to your endpoint, you'll need to know the URI to which you will POST the query. Retrieve this URI with: 

```azurecli
az ml endpoint show -n my-endpoint --query "scoring_uri"
```

You'll also need to pass an authorization token, which you can retrieve by running: 

```azurecli
az ml endpoint list-keys -n my-endpoint
```

You can then perform scoring using any REST client. For instance, a scoring request in curl might look like:

{>> I think a curl or wget example would be better than Postman. <<}

```bash
curl TODO
```

You should see a result similar to: 

```bash
tk
```

## Review your container logs

You can review the container logs by running: 

```azurecli
az ml endpoint log -n my-endpoint --deployment blue --tail 100
```

The first argument is the name of your endpoint. The second argument value (`blue`) is the deployment identifier, as specified in the configuration YAML file. The final argument requests the most recent 100 entries in the log file. 

By default the logs are pulled from the inference server. However you can pull them from the storage-initializer container by passing `–container storage-initializer`. {>> Q: Please explain this more. Are you pulling different logs? How does the data differ? Or is it that the storage-initializer container can be configured as the log store (if so, that needs to be explained) <<}

## Review metrics in the Azure Portal

In the [Azure Portal](https://portal.azure.com), open your resource group, navigate to the "Endpoints" {>> ?? <<} page and deployment ARM resources -> you can see summary view in the overview page and details in the metrics tab. {>> TODO: This needs more. For one thing, is it portal or Studio? Let's do a screenshot or two to show the data. Briefly review the metrics that they'll see for the regression model. <<}

## Use log analytics for insights into how your endpoint is being used

A Log Analytics workspace will give you much more information about how your endpoint is being used. Follow the steps in [Create a Log Analytics workspace in the Azure portal](https://docs.microsoft.com/azure/azure-monitor/logs/quick-create-workspace#create-a-workspace).

After you've generated several scoring requests, go to the Portal {>> Studio? <<} and choose your endpoint.

{>> Screenshot would be good here <<}

In the Portal {>> Studio <<}:

1. Choose your endpoint
1. Select the **ARM resource page**
1. Select **Diagnostic settings**
1. Select **Add settings** 
1. {>> Not sure what you see: dropdown or button or? ... <<}

{>> Is this sequence right? Original text is "Open the ARM resource page from endpoint -> select Diagnostic settings -> Add settings (add a log analytics workspace - create one if needed)." <<}

{>> Screenshot would be good here <<}

Open the Log Analytics workspace and: 

1. Select **Logs** in the left navigation area
1. Close the **Queries** popup that automatically opens
1. Double-click on **AmlOnlineEndpointConsoleLog**
1. Select *Run*

{>> Screenshot would be good here <<}

## Delete the endpoint and deployment

If you are not going use the deployment, you should delete it with:

```azurecli
az ml endpoint delete -n my-endpoint
```

## Next steps
- Perform a more complex, blue-green deployment by following [tk](blue-green.md)
- Understand managed inference [tk](concept-article.md)
- {>> Anything else? More on log analytics? <<}