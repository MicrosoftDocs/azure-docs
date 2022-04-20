---
title: Secure online endpoints with private endpoints
titleSuffix: Azure Machine Learning
description: Use private endpoints to secure your Azure Machine Learning online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: seramasu
author: rsethur
ms.date: 04/14/2022
ms.custom: 

---

# Secure online endpoints with private endpoints

With a private endpoint, you can configure your Azure Machine Learning online endpoints to securely communicate with resources in an Azure Virtual Network (VNet). Using a private endpoint with online endpoints is currently a preview feature.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

When securing an online endpoint with a private endpoint, you can secure the inbound communication from clients (scoring requests for example) separately from the outbound communications between the online endpoint and associated resources. For example, you may allow scoring requests over the public network while restricting communications between the online endpoint and the Azure Machine Learning workspace, blob storage, and container registry.

## Prerequisites

* To use Azure machine learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and ML extension. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* You must have an Azure Resource group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your ML extension per the above article. 

* You must have an Azure Machine Learning workspace, and the workspace must use a private endpoint to communicate with a virtual network. If you don't have one, the steps in this article create an example workspace and VNet, then deploy a model to an online endpoint secured with a private endpoint.

> [!IMPORTANT]
> The end-to-end example in this article comes from the files in the __azureml-examples__ GitHub repository. To clone the samples repository and switch to the repository's `cli/` directory, use the following commands: 
>
> ```azurecli
> git clone https://github.com/Azure/azureml-examples
> cd azureml-examples/cli
> ```

## Limitations

* If your Azure Machine Learning workspace has a private endpoint that was created before 5/24/2022, you must recreate the workspace's private endpoint before configuring your online endpoints to use a private endpoint. For more information on creating a private endpoint for your workspace, see [How to configure a private endpoint for Azure Machine Learning workspace](how-to-configure-private-link.md).
 
## Inbound (scoring)

To restrict communications to the online endpoint to the virtual network, set the `public_network_access` flag for the endpoint to `disabled`:

```azurecli
az ml online-endpoint create -f endpoint.yml --set public_network_access=disabled
```

When `public_network_access` is `disabled`, inbound scoring requests are received using the private endpoint(s) of the Azure Machine Learning workspace.

## Outbound (resource access)

To restrict communication between the online endpoint and the Azure resources used by the endpoint set the `private_network_connection` flag to `true`. Enable this flag to ensure that the download of the model, code, and images needed by your endpoint deployment are secured within the VNet and not sent over the public network.

The following are the resources that the online endpoint uses outbound communication with:

* The Azure Machine Learning workspace.
* The Azure Storage blob that is the default storage for the workspace.
* The Azure Container Registry for the workspace.

When you configure the `private_network_connection` to `true`, a new private endpoint is created for each service, _per deployment_. For example, if you set the flag to `true` for three deployments to an online endpoint, nine private endpoints are created.

```azurecli
az ml online-deployment create -f deployment.yml --set private_network_connection true
```

## Scenarios

The following table lists the supported configurations when configuring inbound and outbound communications for an online endpoint:

| Configuration | Inbound </br> (Endpoint property) | Outbound </br> (Deployment property) | Supported? |
| -------- | -------------------------------- | --------------------------------- | --------- |
| secure inbound with secure outbound | `public_network_access` is disabled | `private_network_connection` is true   | Yes |
| secure inbound with public outbound | `public_network_access` is disabled | `private_network_connection` is false  | Yes |
| public inbound with secure outbound | `public_network_access` is enabled | `private_network_connection` is true    | Yes |
| public inbound with public outbound | `public_network_access` is enabled | `private_network_connection` is false  | Yes |

## End-to-end example

Use the information in this section to create an example configuration that uses private endpoints to secure online endpoints.

> [!TIP]
> In this example, and Azure Virtual Machine is created inside the VNet. You connect to the VM using SSH, and run the deployment from the VM. This configuration is used to simplify the steps in this example, and does not represent a typical secure configuration. For example, in a production environment you would most likely use a VPN client or Azure ExpressRoute to directly connect clients to the virtual network.

### Create workspace and secured resources

The steps in this section use an Azure Resource Manager template to create the following Azure resources:

* Azure Virtual Network
* Azure Machine Learning workspace
* Azure Container Registry
* Azure Key Vault
* Azure Storage account (blob & file storage)

Public access is disabled for all the services. A scoring subnet is created, along with outbound rules that allow communication with the following Azure services:

* Azure Active Directory
* Azure Resource Manager
* Azure Front Door
* Microsoft Container Registries

To create the resources, use the following Azure CLI commands. Replace `<UNIQUE_SUFFIX>` with a unique suffix for the resources that are created.

```azurecli
# SUFFIX will be used as resource name suffix in created workspace and related resources
export SUFFIX="<UNIQUE_SUFFIX>"
# This bicep template sets up secure workspace and relevant resources
az deployment group create --template-file endpoints/online/managed/vnet/setup_vm/vm-main.bicep --parameters suffix=$SUFFIX
```

### Create the virtual machine jump box

To create an Azure Virtual Machine that can be used to connect to the VNet, use the following command. Replace `<your-new-password>` with the password you want to use when connecting to this VM:

```azurecli
# create vm
az vm create --name test-vm --vnet-name vnet-$SUFFIX --subnet snet-scoring --image UbuntuLTS --admin-username azureuser --admin-password <your-new-password>
```

> [!IMPORTANT]
> The VM created by these commands has a public endpoint that you can connect to over the public network.

The response from this command is a JSON document similar to the following:

```json
{
  "fqdns": "",
  "id": "/subscriptions/<GUID>/resourceGroups/<my-resource-group>/providers/Microsoft.Compute/virtualMachines/test-vm",
  "location": "westus",
  "macAddress": "00-0D-3A-ED-D8-E8",
  "powerState": "VM running",
  "privateIpAddress": "192.168.0.12",
  "publicIpAddress": "20.114.122.77",
  "resourceGroup": "<my-resource-group>",
  "zones": ""
}
```

Use the following command to connect to the VM using SSH. Replace `publicIpAddress` with the value of the public IP address in the response from the previous command:

```azurecli
ssh azureusere@publicIpAddress
```

When prompted, enter the password you used when creating the VM.

### Configure the VM

1. Use the following commands from the SSH session to install the CLI and Docker:

    :::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/endpoints/online/managed/vnet/setup_vm/scripts/vmsetup.sh" id="setup_docker_az_cli":::

1. To create the environment variables used by this example, run the following commands. Replace `<YOUR_SUBSCRIPTION_ID>` with your Azure subscription ID. Replace `<YOUR_RESOURCE_GROUP>` with the resource group that contains your workspace. Replace `<SUFFIX_USED_IN_SETUP>` with the suffix you provided earlier. Replace `<LOCATION>` with the location of your Azure workspace. Replace `<YOUR_ENDPOINT_NAME>` with the name to use for the endpoint.

    > [!TIP]
    > Use the tabs to select whether you want to perform a deployment using an MLflow model or generic ML model.

    # [MLflow model](#tab/mlflow)

    :::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/deploy-moe-vnet-mlflow.sh" id="set_env_vars":::

    # [Generic model](#tab/model)

    :::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/deploy-moe-vnet.sh" id="set_env_vars":::

    ---

1. To login to the Azure CLI in the VM environment, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_login":::

1. To configure the defaults for the CLI, use the following commands:

    :::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/endpoints/online/managed/vnet/setup_vm/scripts/vmsetup.sh" id="configure_defaults":::

1. To clone the example files for the deployment, use the following command:

    ```azurecli
    sudo mkdir -p /home/samples; sudo git clone -b main --depth 1 https://github.com/Azure/azureml-examples.git /home/samples/azureml-examples
    ```
    

1. To build a custom docker image to use with the deployment, use the following commands:

    :::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/endpoints/online/managed/vnet/setup_vm/scripts/build_image.sh" id="build_image":::

    > [!TIP]
    > In a production environment, when Azure Container Registry is behind the virtual network, you would use an Azure Machine Learning compute cluster and Azure Machine Learning environments. For more information, see [Secure Azure Machine Learning workspace](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

### Create a secured managed online endpoint

1. To create a managed online endpoint that is secured using a private endpoint for inbound and outbound communication, use the following commands:

1. To make a scoring request using the endpoint, use the following commands:

### Cleanup

To delete the endpoint, use the following command:

:::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/deploy-moe-vnet.sh" id="delete_endpoint":::

To delete the VM, use the following command:

:::code language="azurecli" source="~/azureml-examples-online-endpoint-vnet/cli/deploy-moe-vnet.sh" id="delete_vm":::

To delete the example workspace/VNet configuration, use the following command:



## Next steps