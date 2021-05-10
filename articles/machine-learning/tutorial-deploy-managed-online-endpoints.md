---
title: "Tutorial: Deploy ML models with a managed online endpoint" 
titleSuffix: Azure Machine Learning
description: Learn to deploy your machine learning model as a web service automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: seramasu
ms.reviewer: laobri
author: rsethur
ms.date: 05/06/2021
ms.topic: tutorial
ms.custom: tutorial
---

# Tutorial: Deploy and score a machine learning model with a managed online endpoint (preview)

Managed online endpoints (preview) provides you the ability to deploy your trained model without you having to create and manage the underlying infrastructure. In this article you start with deploying a model in your local machine to debug any errors, then deploy and test it in the cloud. You will also learn how to view the logs and monitor the SLA. You start with a model and endup with a scalable HTTPS/REST endpoint that can be used for online/realtime scoring.

## Prerequisites
* Install the CLI <todo add link>
* Install [Docker engine](https://docs.docker.com/engine/install/) if you don't have it. This step is optional, but **highly recommended** since help you debug issues swiftly.
* If you have not already set the defaults for azure cli, set it to save time
```azurecli
az account set --subscription <subcription id>
az configure --defaults workspace=<azureml workspace name> group=<resource group>
```
* To follow along with the sample, clone the samples repository and navigate to the right directory by running the following:
```azurecli
git clone https://github.com/Azure/azureml-examples
cd azureml-examples
git checkout cli-preview
cd cli
```
* Set your endpoint name (rename the below YOUR_ENDPOINT_NAME to a unique name). The below command is for linux based systems
```azurecli
export ENDPOINT_NAME=YOUR_ENDPOINT_NAME
```
> [!TIP]
> If you use Windows operating system, use this command instead `set ENDPOINT_NAME=YOUR_ENDPOINT_NAME`
> [!NOTE]
> Endpoint names needs to be unique at Azure region level. For e.g. there can be only one endpoint with the name `my-endpoint` in westus2 (or any other region).
## Understand the endpoint configuration & code required to deploy the sample model

The key inputs needed to deploy a model in an online endpoint are:
1. model files (or name and version of a registered model). In this case we have a scikit-learn model.
1. code that is needed to score the model. In this case we have a `score.py` file.
1. environment in which your model is run (as you will see this can be a docker image with conda dependencies or a dockerfile)
1. instance type & scale settings

The following shows the `endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yaml` file that captures all the above information: 

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml":::

| Key | Description |
| --- | --- |
| $schema    | [Optional] The YAML schema. You can view the schema in the above example in a browser to see all available options in the YAML file.|
| name       | Name of the endpoint. Needs to be unique at Azure region level. |
| auth_mode | use `key` for key based authentication and `aml_token` for Azure ML token based authentication. `key` does not expire but `aml_token` does expire (you can get the latest token by using `az ml endpoint list-keys` command) |
| deployments | This contains a list of deployments to be created in the endpoint. In this case we have only one deployment named `blue`. You can have more than one deployment. For details see the safe rollout flow <todo: add link> |

Attributes of the `deployment`

| Key | Description |
| --- | --- |
| name  | name of the deployment |
| model | In this example we are specifying the model properties inline: name, version and local_path. The model files will be uploaded and registered automatically. One downside of this inline specification is that you have to increment the version manually if you want to update model files. Read the `Tip` in the below section for best practices here. |
| code_configuration.code.local_path | the directory which contains all the source python code for scoring the model. |
| code_configuration.scoring_script | The python file in the above scoring directory that is expected to have an init() function and a run() function. init() will be called after create/update of the model (you can use it to cache the model in memory etc). run() is called for every invocation of the endpoint to perform the actual scoring/prediction |
| environment | contains the details of the environment to host the model and code. In this example we have inline definition that includes name, version and path. In this example `environment.docker.image` will be used as the image and the `conda_file` dependencies will be installed on top of it. Similar to `model` read the `Tip` in the below section for best practices here |
| instance_type | the VM sku to host your deployment instances. <todo: add link to supported sku> |
| scale_settings.scale_type | currently managed online endpoints support only `manual`. To scale up or scale down after the endpoint and deployment are created, , update the `instance_count` and run the command `az ml endpoint update -n $ENDPOINT_NAME`.|
| scale_settings.instance_count | number of instances in the deployment. This will be based on the workload you expect. For high availability it is recommended to have 3 |
| scale_settings.min_instances | The minimum number of instances to always be present <todo: remove this after the bug fix (this is optional attribute)> |
| scale_settings.max_instances | The maximum number of instances that the deployment can scale to <todo: remove this after the bug fix (this is optional attribute)> |

> [!TIP]
> **Best practice:** In this example we are specifying the model and environment properties inline: name, version and local_path to upload files from. Under the covers, the CLI will upload the files and register the model/environment automatically. As a best practice for use in production, you should separately register the model and environment and specify the registered name and version using in the above yaml: `model: azureml:my-model:1` or `environment: azureml:my-env:1`. To learn more on registering these assets, refer to the CLI commands `az ml model create -h` and `az ml environment create -h`
### Understand the scoring script
The `code_configuration.scoring_script` which is present in the `code_configuration.code.local_path` is expected to have an init() function and a run() function. This example uses this [score.py file](https://github.com/Azure/azureml-examples/blob/cli-preview/cli/endpoints/online/model-1/onlinescoring/score.py). init() will be called when the container is initialized/started. This is typically after create/update of the deployment. You can write logic here to perform init operations like caching the model in memory (which is done in this example). run() is called for every invocation of the endpoint to perform the actual scoring/prediction. In the example we extract the data from the json input and call the scikit-learn model's predict() method and return the result back.

## 1. Deploy and debug locally using Local Endpoints
Inorder to save time in debugging when you deploy to cloud, it is **highly recommended** you run test your endpoint locally.
> [!Note]
> * Make sure you have installed [Docker engine](https://docs.docker.com/engine/install/)
> * Start the Docker engine. Typically this should already be running, if not you can [troubleshoot here](https://docs.docker.com/config/daemon/#start-the-daemon-manually)
> [!Important]
> Goal of local endpoint is to help you validate/debug your code and configuration before deploying to cloud. It has the following limitations:
> 1. Local endpoints do **not** support traffic rules, authentication, scale settings & probe settings. It supports only one deployment per endpoint.
> 1. Currently it supports only inline specification of model and environment (like in the above yaml) i.e. you cannot provide registered models and environments
### Step 1: To deploy the above model locally, you can run the following command

```azurecli
az ml endpoint create --local -n $ENDPOINT_NAME -f endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml
```
the `--local` flag directs the cli to deploy the endpoint in the docker environment.

> [!TIP]
>If you use Windows operating system, use `%ENDPOINT_NAME%` instead of `$ENDPOINT_NAME` (in subsequent commands as well)
### Step 2: Check if deployment was successful
Check if the model was deployed without error by checking the logs

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```

### Step 3: Invoke the model
Invoke/score the model by using the convenience command `invoke`
```azurecli
az ml endpoint invoke --local -n $ENDPOINT_NAME --request-file endpoints/online/model-1/sample-request.json
```

<todo: provide guidance on using curl>

### Step 4: Check the logs to see any output from the invoke operation
In the example score.py, the run() method which is invoked, logs some output to the console logs. You can retrieve it using the same `get-logs` command above

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```

## 2. Deploy to cloud with managed online endpoints
### Step 1: Inorder to deploy the above yaml configuration into the cloud, run the following command

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint.sh" id="deploy" :::
This can take approximately 8-14 minutes depending on whether the underlying environment/image is being built ofr the first time.
If you prefer not to block your cli console, you add the flag `--no-wait` to the command.

If you face any issues with the deployment creation, you can troubleshoot using our guide [here](https://github.com/vmagelo/azure-docs-pr-1/blob/909b3f3702259173d632c40bbc288895698463b4/articles/machine-learning/how-to-troubleshoot-managed-online-endpoints.md) <todo: change link>

### Step 2: Check the status of the deployment
The `show` command contains `provisioning_status` for both endpoint and deployment
::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint.sh" id="get_status" :::

### Step 3: Check if deployment was successful
Now let us see if the model was deployed without error by checking the logs

```azurecli
az ml endpoint get-logs --local -n $ENDPOINT_NAME --deployment blue
```
by default logs are pulled from the inference-server. If you want to see the logs from the storage-initializer (which mounts the assets like model & code to the container), add the flag `--container storage-initializer`

### Step 4: Test the endpoint by invoking it
You can either use the `invoke` command or use a REST client of your choice
::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint.sh" id="test_endpoint" :::

You can again use the `get-logs` command from above to see invocation logs.

To use REST client of your choice, you need the `scoring_uri` and the access key/token. The `scoring_uri` is avaialble in the output of the `show` command. 
::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint.sh" id="get_scoring_uri" :::
Note how we are using the `--query` to filter attributes that are needed. You can learn more about `--query` [here](https://docs.microsoft.com/en-us/cli/azure/query-azure-cli)

The key/token can be got by using `list-keys` command:
::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint.sh" id="get_access_token" :::

<todo: provide guidance on using curl>

### Step 5: Troubleshoot and update deployment
You can use our [troubleshooting guide](https://github.com/MicrosoftDocs/azure-docs-pr/blob/b515a67a9a676854b6e81341d7011100e19a50cf/articles/machine-learning/how-to-troubleshoot-managed-online-endpoints.md) to help identify and debug errors.
<todo: update link>

If you want to update the code, model, environment or your scale settings, just update the yaml file and run the `az ml endpoint update` command. However there are restrictions that you can update one one aspect at a time (either traffic or scale settings or code/model/environment).

For the sake of excercise, open the score.py('online/model-1/onlinescoring/score.py') and update the first line in the `run()` function:
Change from `logging.info("Request received")` to `logging.info("Updated: Request received")`. Now run the command 
```azurecli
az ml endpoint update -n $ENDPOINT_NAME -f endpoints/online/managed/simple-flow/1-create-endpoint-with-blue.yml
```

Now you can invoke the model and check the logs to see if the change has been reflected.

In a rare case that you want to delete and recreate your deployment, you can use `az ml endpoint delete -n $ENDPOINT_NAME --deployment blue`. You can create again using the commands above.

### Step 6: Review metrics in azure portal
You can view the metrics & set alerts based on your SLA by following instructions [here](https://review.docs.microsoft.com/en-us/azure/machine-learning/how-to-monitor-online-endpoints?branch=release-build-2021-azureml)

### Step 7: Integrate with log analytics
The `get-logs` command will only provide last few hundred lines of logs from a automatically selected instance. Log analytics provides a way to store and anlayze logs durably. Follow the steps in [Create a Log Analytics workspace in the Azure portal](https://docs.microsoft.com/azure/azure-monitor/logs/quick-create-workspace#create-a-workspace).

In the Azure Portal:

1. Go to the resource group
1. Choose your endpoint
1. Select the **ARM resource page**
1. Select **Diagnostic settings**
1. Select **Add settings** : Enable sending console logs to the log analytics workspace

Note that it might take 45 mins for this to be enabled. Send some scoring requests after thsi time perion and then check the logs using the below.

Open the Log Analytics workspace and: 
1. Select **Logs** in the left navigation area
1. Close the **Queries** popup that automatically opens
1. Double-click on **AmlOnlineEndpointConsoleLog**
1. Select *Run*


### Step 8: Delete the endpoint and deployment

If you are not going use the deployment, you should delete it with the below command (it deletes the endpoint and all the underlying deployments):

::: code language="azurecli" source="~/azureml-examples-cli-preview/cli/how-to-deploy-managed-online-endpoint.sh" id="delete_endpoint" :::