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
ms.date: 09/28/2023
ms.custom: event-tier1-build-2022, devx-track-azurecli, moe-wsvnet
---

# Secure your managed online endpoints with network isolation

[!INCLUDE [machine-learning-dev-v2](includes/machine-learning-dev-v2.md)]

In this article, you'll use network isolation to secure a managed online endpoint. You'll create a managed online endpoint that uses an Azure Machine Learning workspace's private endpoint for secure inbound communication. You'll also configure the workspace with a **managed virtual network** that **allows only approved outbound** communication for deployments. Finally, you'll create a deployment that uses the private endpoints of the workspace's managed virtual network for outbound communication.

For examples that use the legacy method for network isolation, see the deployment files [deploy-moe-vnet-legacy.sh](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-moe-vnet-legacy.sh) (for deployment using a generic model) and [deploy-moe-vnet-mlflow-legacy.sh](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-moe-vnet-mlflow-legacy.sh) (for deployment using an MLflow model) in the azureml-examples GitHub repo.

## Prerequisites

To begin, you need an Azure subscription, CLI or SDK to interact with Azure Machine Learning workspace and related entities, and the right permission.

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* install and configure the [Azure CLI](/cli/azure/) and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).
    >[!TIP]
    > Azure Machine Learning managed virtual network was introduced on May 23rd, 2023. If you have an older version of the ml extension, you may need to update it for the examples in this article work. To update the extension, use the following Azure CLI command:
    >
    > ```azurecli
    > az extension update -n ml
    > ```

* The CLI examples in this article assume that you're using the Bash (or compatible) shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about).

* You must have an Azure Resource Group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you've configured your `ml` extension.

* If you want to use a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp) to create and manage online endpoints and online deployments, the identity should have the proper permissions. For details about the required permissions, see [Set up service authentication](./how-to-identity-based-service-authentication.md#workspace). For example, you need to assign the proper RBAC permission for Azure Key Vault on the identity.

## Limitations

[!INCLUDE [machine-learning-managed-vnet-online-endpoint-limitations](includes/machine-learning-managed-vnet-online-endpoint-limitations.md)]

## Prepare your system

1. Create the environment variables used by this example by running the following commands. Replace `<YOUR_WORKSPACE_NAME>` with the name to use for your workspace. Replace `<YOUR_RESOURCEGROUP_NAME>` with the resource group that will contain your workspace.
    > [!TIP]
    > before creating a new workspace, you must create an Azure Resource Group to contain it. For more information, see [Manage Azure Resource Groups](/azure/azure-resource-manager/management/manage-resource-groups-cli).

    ```azurecli
    export RESOURCEGROUP_NAME="<YOUR_RESOURCEGROUP_NAME>"
    export WORKSPACE_NAME="<YOUR_WORKSPACE_NAME>"
    ```

1. Create your workspace. The `-m allow_only_approved_outbound` parameter configures a managed virtual network for the workspace and blocks outbound traffic except to approved destinations.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="create_workspace_allow_only_approved_outbound" :::

    Alternatively, if you'd like to allow the deployment to send outbound traffic to the internet, uncomment the following code and run it instead.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="create_workspace_internet_outbound" :::

    For more information on how to create a new workspace or to upgrade your existing workspace to use a manged virtual network, see [Configure a managed virtual network to allow internet outbound](how-to-managed-network.md#configure-a-managed-virtual-network-to-allow-internet-outbound).

    When the workspace is configured with a private endpoint, the Azure Container Registry for the workspace must be configured for __Premium__ tier to allow access via the private endpoint. For more information, see [Azure Container Registry service tiers](../container-registry/container-registry-skus.md). Also, the workspace should be set with the `image_build_compute` property, as deployment creation involves building of images. See [Configure image builds](how-to-managed-network.md#configure-image-builds) for more.

1. Configure the defaults for the CLI so that you can avoid passing in the values for your workspace and resource group multiple times.

    ```azurecli
    az configure --defaults workspace=$WORKSPACE_NAME group=$RESOURCEGROUP_NAME
    ```

1. Clone the examples repository to get the example files for the endpoint and deployment, then go to the repository's `/cli` directory.

    ```azurecli
    git clone --depth 1 https://github.com/Azure/azureml-examples
    cd /cli
    ```

The commands in this tutorial are in the file `deploy-managed-online-endpoint-workspacevnet.sh` in the `cli` directory, and the YAML configuration files are in the `endpoints/online/managed/sample/` subdirectory.

## Create a secured managed online endpoint

To create a secured managed online endpoint, create the endpoint in your workspace and set the endpoint's `public_network_access` to `disabled` to control inbound communication. The endpoint will then have to use the workspace's private endpoint for inbound communication.

Because the workspace is configured to have a managed virtual network, any deployments of the endpoint will use the private endpoints of the managed virtual network for outbound communication.

1. Set the endpoint's name.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="set_endpoint_name" :::

1. Create an endpoint with `public_network_access` disabled to block inbound traffic.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="create_endpoint_inbound_blocked" :::

    If we disable public network access for the endpoint, you will need to have a Private Endpoint to the workspace in your virtual network to invoke the endpoint. See [secure inbound scoring requests](concept-secure-online-endpoint.md#secure-inbound-scoring-requests) and [configure a private endpoint for an Azure Machine Learning workspace](how-to-configure-private-link.md) for more.

    Alternatively, if you'd like to allow the endpoint to receive scoring requests from the internet, uncomment the following code and run it instead.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="create_endpoint_inbound_allowed" :::

1. Create a deployment in the workspace managed virtual network.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="create_deployment" :::

1. Get the status of the deployment.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="get_status" :::

1. Test the endpoint with a scoring request, using the CLI.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="test_endpoint" :::

1. Get deployment logs.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="get_logs" :::

1. Delete the endpoint if you no longer need it.

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint-workspacevnet.sh" ID="delete_endpoint" :::

1. Delete all the resources created in this article. Replace `<resource-group-name>` with the name of the resource group used in this example:

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
