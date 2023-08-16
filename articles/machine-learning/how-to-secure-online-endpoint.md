---
title: How to secure managed online endpoints with network isolation
titleSuffix: Azure Machine Learning
description: Use private endpoints to provide network isolation for Azure Machine Learning managed online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: mopeakande
author: dem108
ms.author: sehan
ms.date: 08/15/2023
ms.custom: event-tier1-build-2022, devx-track-azurecli
---

# How to secure managed online endpoints with network isolation

[!INCLUDE [machine-learning-dev-v2](includes/machine-learning-dev-v2.md)]

In this article, you'll implement network isolation for a managed online endpoint by working with a workspace configured for network isolation. The workspace uses a **managed virtual network** that **allows internet outbound**. You'll create a managed online endpoint that uses the workspace's private endpoint for secure inbound communication. You'll also create a deployment that uses the private endpoints of the managed virtual network (VNet) for outbound communication.

> [!NOTE]
> This article uses the recommended [network isolation method](concept-secure-online-endpoint.md) that is based on the workspace managed VNet. For an example that uses the legacy method for network isolation, you can see the deployment files [deploy-moe-vnet.sh](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-moe-vnet.sh) and [deploy-moe-vnet-mlflow.sh](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-moe-vnet-mlflow.sh) (for deployment using a generic model or an MLflow model) in the azureml-examples GitHub repo.

## Prerequisites

To begin, you need an Azure subscription, CLI or SDK to interact with Azure Machine Learning workspace and related entities, and the right permission.

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and `ml` extension or the Azure Machine Learning Python SDK v2. For more information, see the following articles:

    * [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).
    * [Install the Python SDK v2](https://aka.ms/sdk-v2-install).

* You must have an Azure Resource Group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your `ml` extension per the above article.

* If you want to use a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp) to create and manage online endpoints and online deployments, the identity should have the proper permissions. For details about the required permissions, see [Set up service authentication](./how-to-identity-based-service-authentication.md#workspace). For example, you need to assign the proper RBAC permission for Azure Key Vault on the identity.

There are additional prerequisites for a workspace and its related entities.

* You must have an Azure Machine Learning workspace, and the workspace must use a **managed virtual network** that **allows internet outbound**. If you don't have one, follow the steps in [Configure a managed virtual network to allow internet outbound](how-to-managed-network.md#configure-a-managed-virtual-network-to-allow-internet-outbound) to create a new workspace or to upgrade your existing workspace to use a manged virtual network.

* The workspace has its `public_network_access` flag that can be either enabled or disabled. If you plan on using managed online endpoint deployments that use __public outbound__, then you must also [configure the workspace to allow public access](how-to-configure-private-link.md#enable-public-access). This is because outbound communication from managed online endpoint deployment is to the _workspace API_. When the deployment is configured to use __public outbound__, then the workspace must be able to accept that public communication (allow public access).

* When the workspace is configured with a private endpoint, the Azure Container Registry for the workspace must be configured for __Premium__ tier. For more information, see [Azure Container Registry service tiers](../container-registry/container-registry-skus.md).

## Limitations

[!INCLUDE [machine-learning-managed-vnet-online-endpoint-limitations](includes/machine-learning-managed-vnet-online-endpoint-limitations.md)]

## Prepare your system

1. Create the environment variables used by this example by running the following commands. Replace `<YOUR_SUBSCRIPTION_ID>` with your Azure subscription ID. Replace `<YOUR_RESOURCE_GROUP>` with the resource group that contains your workspace. Replace `<LOCATION>` with the location of your Azure workspace. Replace `<YOUR_ENDPOINT_NAME>` with the name to use for the endpoint.

    > [!NOTE]
    > As mentioned earlier in the prerequisites, you'll be using a workspace that has a managed VNet configured to allow internet outbound. Be sure to use this workspace for your configuration.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-vnet.sh" id="set_env_vars":::

1. Configure the defaults for the CLI so that you can avoid passing in the values for your subscription, workspace, location, and resource group multiple times.

    ```azurecli
    az account set --subscription <subscription ID>
    az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
    ```

1. Clone the examples repository to get the example files for the deployment, then go to the repository's `/home/samples/azureml-examples/cli/` directory.

    ```azurecli
    git clone --depth 1 https://github.com/Azure/azureml-examples
    cd /home/samples/azureml-examples/cli/
    ```

<!-- The commands in this tutorial are in the files `deploy-local-endpoint.sh` and `deploy-managed-online-endpoint.sh` in the `cli` directory, and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory. -->

## Create a secured managed online endpoint

This example assumes that your workspace is configured for network isolation with a **managed virtual network** that **allows internet outbound**. In this workspace, you can create an endpoint with the `public_network_access` disabled so that the endpoint uses the workspace's private endpoint for inbound communication. 
Any deployments of the endpoint will use the private endpoints of the managed VNet for outbound communication.

1. Create an endpoint with `public_network_access` disabled.

    ```azurecli
    az ml online-endpoint create --name $ENDPOINT_NAME -f $ENDPOINT_FILE_PATH --set public_network_access="disabled"
    ```

1. Create a deployment in the workspace managed VNet.

    ```azurecli
    az ml online-deployment create --name blue --endpoint $ENDPOINT_NAME -f $DEPLOYMENT_FILE_PATH --all-traffic
    ```

1. Make a scoring request with the endpoint.

    ```azurecli
    # Try scoring using the CLI
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file $SAMPLE_REQUEST_PATH
    ```

### Cleanup

To delete the endpoint, use the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-vnet.sh" id="delete_endpoint":::

To delete all the resources created in this article, use the following command. Replace `<resource-group-name>` with the name of the resource group used in this example:

```azurecli
az group delete --resource-group <resource-group-name>
```

## Troubleshooting

[!INCLUDE [network isolation issues](includes/machine-learning-online-endpoint-troubleshooting.md)]

## Next steps

- [Network isolation with managed online endpoints](concept-secure-online-endpoint.md)
- [Workspace managed network isolation](how-to-managed-network.md)
- [Tutorial: How to create a secure workspace](tutorial-create-secure-workspace.md)
- [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoints deployment](how-to-troubleshoot-online-endpoints.md)
