---
title: Upgrade steps for Azure Container Instances web services to managed online endpoints
titleSuffix: Azure Machine Learning
description: Upgrade steps for Azure Container Instances web services to managed online endpoints in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: dem108
ms.author: sehan
ms.date: 09/28/2022
ms.reviewer: mopeakande
ms.custom: upgrade
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade steps for Azure Container Instances web services to managed online endpoints

[Managed online endpoints](concept-endpoints-online.md) help to deploy your ML models in a turnkey manner. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way. Managed online endpoints take care of serving, scaling, securing, and monitoring your models, freeing you from the overhead of setting up and managing the underlying infrastructure. Details can be found on [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

You can deploy directly to the new compute target with your previous models and environments, or use the [scripts](https://aka.ms/moeonboard) provided by us to export the current services and then deploy to the new compute without affecting your existing services. If you regularly create and delete Azure Container Instances (ACI) web services, we strongly recommend the deploying directly and not using the scripts. 

> [!IMPORTANT]
> **The scoring URL will be changed after upgrade**. For example, the scoring url for ACI web service is like `http://aaaaaa-bbbbb-1111.westus.azurecontainer.io/score`. The scoring URI for a managed online endpoint is like `https://endpoint-name.westus.inference.ml.azure.com/score`.

## Supported scenarios and differences

### Auth mode
No auth isn't supported for managed online endpoint. If you use the upgrade scripts, it will convert it to key auth.
For key auth, the original keys will be used. Token-based auth is also supported.

### TLS
For ACI service secured with HTTPS, you don't need to provide your own certificates anymore, all the managed online endpoints are protected by TLS.

Custom DNS name **isn't** supported.

### Resource requirements
[ContainerResourceRequirements](/python/api/azureml-core/azureml.core.webservice.aci.containerresourcerequirements) isn't supported, you can choose the proper [SKU](reference-managed-online-endpoints-vm-sku-list.md) for your inferencing.
The upgrade tool will map the CPU/Memory requirement to corresponding SKU. If you choose to redeploy manually through CLI/SDK V2, we also suggest the corresponding SKU for your new deployment.

| CPU request | Memory request in GB | Suggested SKU |
| :----| :---- | :---- |
| (0, 1] | (0, 1.2] | DS1 V2 |
| (1, 2] | (1.2, 1.7] | F2s V2 |
| (1, 2] | (1.7, 4.7] | DS2 V2 |
| (1, 2] | (4.7, 13.7] | E2s V3 |
| (2, 4] | (0, 5.7] | F4s V2 |
| (2, 4] | (5.7, 11.7] | DS3 V2 |
| (2, 4] | (11.7, 16] | E4s V3 |

"(" means greater than and "]" means less than or equal to. For example, “(0, 1]” means “greater than 0 and less than or equal to 1”.

> [!IMPORTANT]
> When upgrading from ACI, there will be some changes in how you'll be charged. See [our blog](https://aka.ms/acimoemigration) for a rough cost comparison to help you choose the right VM SKUs for your workload.

### Network isolation
For private workspace and VNet scenarios, see [Use network isolation with managed online endpoints](how-to-secure-online-endpoint.md?tabs=model).

> [!IMPORTANT]
> As there are many settings for your workspace and VNet, we strongly suggest that redeploy through the Azure CLI extension v2 for machine learning instead of the script tool.

## Not supported
+ [EncryptionProperties](/python/api/azureml-core/azureml.core.webservice.aci.encryptionproperties) for ACI container isn't supported.
+ ACI web services deployed through deploy_from_model and deploy_from_image isn't supported by the upgrade tool. Redeploy manually through CLI/SDK V2.

## Upgrade steps

### With our [CLI](how-to-deploy-online-endpoints.md) or [SDK](how-to-deploy-managed-online-endpoint-sdk-v2.md)
Redeploy manually with your model files and environment definition.
You can find our examples on [azureml-examples](https://github.com/Azure/azureml-examples). Specifically, this is the [SDK example for managed online endpoint](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/managed).

### With our [upgrade tool](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/migration)
This tool will automatically create new managed online endpoint based on your existing web services. Your original services won't be affected. You can safely route the traffic to the new endpoint and then delete the old one.

> [!NOTE]
> The upgrade script is a sample script and is provided without a service level agreement (SLA).

Use the following steps to run the scripts:

> [!TIP]
> The new endpoint created by the scripts will be created under the same workspace.

1. Use a bash shell to run the scripts. For example, a terminal session on Linux or the Windows Subsystem for Linux (WSL).
2. Install [Python SDK V1](/python/api/overview/azure/ml/install) to run the Python script.
3. Install [Azure CLI](/cli/azure/install-azure-cli).
4. Clone [the repository](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/managed/migration) to your local env. For example, `git clone https://github.com/Azure/azureml-examples`.
5. Edit the following values in the `migrate-service.sh` file. Replace the values with ones that apply to your configuration.

    * `<SUBSCRIPTION_ID>` - The subscription ID of your Azure subscription that contains your workspace.
    * `<RESOURCEGROUP_NAME>` - The resource group that contains your workspace.
    * `<WORKSPACE_NAME>` - The workspace name.
    * `<SERVICE_NAME>` - The name of your existing ACI service.
    * `<LOCAL_PATH>` - A local path where resources and templates used by the script are downloaded.
    * `<NEW_ENDPOINT_NAME>` - The name of the new endpoint that will be created. We recommend that the new endpoint name is different from the previous service name. Otherwise, the original service won't be displayed if you check your endpoints on the portal.
    * `<NEW_DEPLOYMENT_NAME>` - The name of the deployment to the new endpoint.
6. Run the bash script. For example, `./migrate-service.sh`. It will take about 5-10 minutes to finish the new deployment.

    > [!TIP]
    > If you receive an error that the script is not executable, or an editor opens when you try to run the script, use the following command to mark the script as executable:
    > ```bash
    > chmod +x migrate-service.sh
    > ```
7. After the deployment is completes successfully, you can verify the endpoint with the [az ml online-endpoint invoke](/cli/azure/ml/online-endpoint#az-ml-online-endpoint-invoke) command.

## Contact us
If you have any questions or feedback on the upgrade script, contact us at moeonboard@microsoft.com.

## Next steps

* [What are Azure Machine Learning endpoints?](concept-endpoints.md)
* [Deploy and score a model with an online endpoint](how-to-deploy-online-endpoints.md)
