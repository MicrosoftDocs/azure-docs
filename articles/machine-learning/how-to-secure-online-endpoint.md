---
title: Network isolation of managed online endpoints
titleSuffix: Azure Machine Learning
description: Use private endpoints to provide network isolation for Azure Machine Learning managed online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: mopeakande
author: dem108
ms.author: sehan
ms.date: 04/26/2023
ms.custom: event-tier1-build-2022, devx-track-azurecli
---

# Use network isolation with managed online endpoints

[!INCLUDE [SDK/CLI v2](includes/machine-learning-dev-v2.md)]

When deploying a machine learning model to a managed online endpoint, you can secure communication with the online endpoint by using [private endpoints](../private-link/private-endpoint-overview.md).

You can secure the inbound scoring requests from clients to an _online endpoint_. You can also secure the outbound communications between a _deployment_ and the Azure resources it uses. Security for inbound and outbound communication are configured separately. For more information on endpoints and deployments, see [What are endpoints and deployments](concept-endpoints-online.md).

The following diagram shows how communications flow through private endpoints to the managed online endpoint. Incoming scoring requests from clients are received through the workspace private endpoint from your virtual network. Outbound communication with services is handled through private endpoints to those service instances from the deployment:

:::image type="content" source="./media/how-to-secure-online-endpoint/endpoint-network-isolation-ingress-egress.png" alt-text="Diagram of overall ingress/egress communication.":::

## Prerequisites

To start with, you would need an Azure subscription, CLI or SDK to interact with Azure Machine Learning workspace and related entities, and the right permission.

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* You must install and configure the Azure CLI and `ml` extension or the Azure Machine Learning Python SDK v2. For more information, see the following articles:

    * [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).
    * [Install the Python SDK v2](https://aka.ms/sdk-v2-install).

* You must have an Azure Resource Group, in which you (or the service principal you use) need to have `Contributor` access. You'll have such a resource group if you configured your `ml` extension per the above article.

* If you want to use a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp) to create and manage online endpoints and online deployments, the identity should have the proper permissions. For details about the required permissions, see [Set up service authentication](./how-to-identity-based-service-authentication.md#workspace). For example, you need to assign the proper RBAC permission for Azure Key Vault on the identity.

There are additional prerequisites for workspace and its related entities.

* You must have an Azure Machine Learning workspace, and the workspace must use a private endpoint. If you don't have one, the steps in this article create an example workspace, virtual network (VNet), and VM. For more information, see [Configure a private endpoint for Azure Machine Learning workspace](./how-to-configure-private-link.md).

* The workspace has its `public_network_access` flag that can be either enabled or disabled. If you plan on using managed online endpoint deployments that use __public outbound__, then you must also [configure the workspace to allow public access](how-to-configure-private-link.md#enable-public-access). This is because outbound communication from managed online endpoint deployment is to the _workspace API_. When the deployment is configured to use __public outbound__, then the workspace must be able to accept that public communication (allow public access).

* When the workspace is configured with a private endpoint, the Azure Container Registry for the workspace must be configured for __Premium__ tier. For more information, see [Azure Container Registry service tiers](../container-registry/container-registry-skus.md).

## Limitations

* The `v1_legacy_mode` flag must be disabled (false) on your Azure Machine Learning workspace. If this flag is enabled, you won't be able to create a managed online endpoint. For more information, see [Network isolation with v2 API](how-to-configure-network-isolation-with-v2.md).

* If your Azure Machine Learning workspace has a private endpoint that was created before May 24, 2022, you must recreate the workspace's private endpoint before configuring your online endpoints to use a private endpoint. For more information on creating a private endpoint for your workspace, see [How to configure a private endpoint for Azure Machine Learning workspace](how-to-configure-private-link.md).

    > [!TIP]
    > To confirm when a workspace is created, you can check the workspace properties. In Studio, click `View all properties in Azure Portal` from `Directory + Subscription + Workspace` section (top right of the Studio), Click JSON View from top right of the Overview page, and choose the latest API Version. You can check the value of `properties.creationTime`. You can do the same by using `az ml workspace show` with [CLI](how-to-manage-workspace-cli.md#get-workspace-information), or `my_ml_client.workspace.get("my-workspace-name")` with [SDK](how-to-manage-workspace.md?tabs=python#find-a-workspace), or `curl` on workspace with [REST API](how-to-manage-rest.md#drill-down-into-workspaces-and-their-resources).

* When you use network isolation with a deployment, Azure Log Analytics is partially supported. All metrics and the `AMLOnlineEndpointTrafficLog` table are supported via Azure Log Analytics. `AMLOnlineEndpointConsoleLog` and `AMLOnlineEndpointEventLog` tables are currently not supported. As a workaround, you can use the [az ml online-deployment get_logs](/cli/azure/ml/online-deployment#az-ml-online-deployment-get-logs) CLI command, the [OnlineDeploymentOperations.get_logs()](/python/api/azure-ai-ml/azure.ai.ml.operations.onlinedeploymentoperations#azure-ai-ml-operations-onlinedeploymentoperations-get-logs) Python SDK, or the Deployment log tab in the Azure Machine Learning studio instead. For more information, see [Monitoring online endpoints](how-to-monitor-online-endpoints.md).
    
* When you use network isolation with a deployment, you can use Azure Container Registry (ACR), Storage account, Key Vault and Application Insights from a different resource group in the same subscription, but you cannot use them if they are in a different subscription. 

* For online deployments with `egress_public_network_access` flag set to `disabled`, access from the deployments to Microsoft Container Registry (MCR) is restricted. If you want to leverage container images from MCR (such as when using curated environment or mlflow no-code deployment), recommendation is to build the image locally inside the virtual network ([docker build](https://docs.docker.com/engine/reference/commandline/build/)) and push the image into the private Azure Container Registry (ACR) which is attached with the workspace (for instance, using [docker push](../container-registry/container-registry-get-started-docker-cli.md#push-the-image-to-your-registry)). The images in this ACR is accessible to secured deployments via the private endpoints which are automatically created on behalf of you when you set `egress_public_network_access` flag to `disabled`. For a quick example, please refer to [build image under virtual network](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/managed/vnet/setup_vm/scripts/build_image.sh) and [end to end example for model deployment under virtual network](https://github.com/Azure/azureml-examples/blob/main/cli/deploy-moe-vnet.sh).

> [!NOTE]
> Requests to create, update, or retrieve the authentication keys are sent to the Azure Resource Manager over the public network.
 
## Inbound (scoring)

To secure scoring requests to the online endpoint to your virtual network, set the `public_network_access` flag for the endpoint to `disabled`:

# [Azure CLI](#tab/cli)

```azurecli
az ml online-endpoint create -f endpoint.yml --set public_network_access=disabled
```

# [Python](#tab/python)

```python
from azure.ai.ml.entities import ManagedOnlineEndpoint

endpoint = ManagedOnlineEndpoint(name='my-online-endpoint',  
                         description='this is a sample online endpoint', 
                         tags={'foo': 'bar'}, 
                         auth_mode="key", 
                         public_network_access="disabled" 
                         # public_network_access="enabled" 
)
```

# [Studio](#tab/azure-studio)

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. Select the **Workspaces** page from the left navigation bar.
1. Enter a workspace by clicking its name.
1. Select the **Endpoints** page from the left navigation bar.
1. Select **+ Create** to open the **Create deployment** setup wizard.
1. Disable the **Public network access** flag at the **Create endpoint** step.

    :::image type="content" source="media/how-to-secure-online-endpoint/endpoint-disable-public-network-access.png" alt-text="A screenshot of how to disable public network access for an endpoint." lightbox="media/how-to-secure-online-endpoint/endpoint-disable-public-network-access.png":::

---

When `public_network_access` is `disabled`, inbound scoring requests are received using the [private endpoint of the Azure Machine Learning workspace](./how-to-configure-private-link.md), and the endpoint can't be reached from public networks.

> [!NOTE]
> You can update (enable or disable) the `public_network_access` flag of an online endpoint after creating it.

## Outbound (resource access)

To restrict communication between a deployment and external resources, including the Azure resources it uses, set the deployment's `egress_public_network_access` flag to `disabled`. Use this flag to ensure that the download of the model, code, and images needed by your deployment are secured with a private endpoint. Note that disabling the flag alone is not enough — your workspace must also have a private link that allows access to Azure resources via a private endpoint. See the [Prerequisites](#prerequisites) for more details.

Secure outbound communication creates three private endpoints per deployment. One to the Azure Blob storage, one to the Azure Container Registry, and one to your workspace.

> [!IMPORTANT]
> * Each managed online endpoint deployment has its own independent Azure Machine Learning managed VNet. If the endpoint has multiple deployments, each deployment has its own managed VNet.
> * We do not support peering between a deployment's managed VNet and your client VNet. For secure access to resources needed by the deployment, we use private endpoints to communicate with the resources.

> [!WARNING]
> * You cannot update (enable or disable) the `egress_public_network_access` flag after creating the deployment. Attempting to change the flag while updating the deployment will fail with an error.

# [Azure CLI](#tab/cli)

```azurecli
az ml online-deployment create -f deployment.yml --set egress_public_network_access=disabled
```

# [Python](#tab/python)

```python
blue_deployment = ManagedOnlineDeployment(name='blue', 
                                          endpoint_name='my-online-endpoint', 
                                          model=model, 
                                          code_configuration=CodeConfiguration(code_local_path='./model-1/onlinescoring/',
                                                                               scoring_script='score.py'),
                                          environment=env, 
                                          instance_type='Standard_DS2_v2', 
                                          instance_count=1, 
                                          egress_public_network_access="disabled"
                                          # egress_public_network_access="enabled" 
) 
                              
ml_client.begin_create_or_update(blue_deployment) 
```

# [Studio](#tab/azure-studio)

1. Follow the steps in the **Create deployment** setup wizard to the **Deployment** step.
1. Disable the **Egress public network access** flag.

    :::image type="content" source="media/how-to-secure-online-endpoint/deployment-disable-egress-public-network-access.png" alt-text="A screenshot of how to disable the egress public network access for a deployment." lightbox="media/how-to-secure-online-endpoint/deployment-disable-egress-public-network-access.png":::

---

The deployment communicates with these resources over the private endpoint:

* The Azure Machine Learning workspace
* The Azure Storage blob that is associated with the workspace
* The Azure Container Registry for the workspace

When you configure the `egress_public_network_access` to `disabled`, a new private endpoint is created per deployment, per service. For example, if you set the flag to `disabled` for three deployments to an online endpoint, a total of nine private endpoints are created. Each deployment would have three private endpoints to communicate with the workspace, blob, and container registry. To confirm the creation of the private endpoints, first check the storage account and container registry associated with the workspace (see [Download a configuration file](how-to-manage-workspace.md#download-a-configuration-file)), find each resource from Azure portal and check `Private endpoint connections` tab under the `Networking` menu.

> [!IMPORTANT]
> - As mentioned earlier, outbound communication from managed online endpoint deployment is to the _workspace API_. When the endpoint is configured to use __public outbound__ (in other words, `public_network_access` flag for the endpoint is set to `enabled`), then the workspace must be able to accept that public communication (`public_network_access` flag for the workspace set to `enabled`).
> - When online deployments are created with `egress_public_network_access` flag set to `disabled`, they will have access to above secured resources only. For instance, if the deployment uses model assets uploaded to other storage accounts, the model download will fail. Ensure model assets are on the storage account associated with the workspace.
> - When `egress_public_network_access` is set to `disabled`, the deployment can only access the workspace-associated resources secured in the virtual network. On the contrary, when `egress_public_network_access` is set to `enabled`, the deployment can only access the resources with public access, which means it cannot access the resources secured in the virtual network.


## Scenarios

The following table lists the supported configurations when configuring inbound and outbound communications for an online endpoint:

| Configuration | Inbound </br> (Endpoint property) | Outbound </br> (Deployment property) | Supported? |
| -------- | -------------------------------- | --------------------------------- | --------- |
| secure inbound with secure outbound | `public_network_access` is disabled | `egress_public_network_access` is disabled   | Yes |
| secure inbound with public outbound | `public_network_access` is disabled | `egress_public_network_access` is enabled</br>The workspace must also allow public access as the deployment outbound is to the workspace API. | Yes |
| public inbound with secure outbound | `public_network_access` is enabled | `egress_public_network_access` is disabled    | Yes |
| public inbound with public outbound | `public_network_access` is enabled | `egress_public_network_access` is enabled</br>The workspace must also allow public access as the deployment outbound is to the workspace API. | Yes |


## End-to-end example

Use the information in this section to create an example configuration that uses private endpoints to secure online endpoints.

> [!TIP]
> The end-to-end example in this article comes from the files in the __azureml-examples__ GitHub repository. To clone the samples repository and switch to the repository's `cli/` directory, use the following commands: 
>
> ```azurecli
> git clone https://github.com/Azure/azureml-examples
> cd azureml-examples/cli
> ```
> 
> In this example, an Azure Virtual Machine is created inside the virtual network. You connect to the VM using SSH, and run the deployment from the VM. This configuration is used to simplify the steps in this example, and does not represent a typical secure configuration. For example, in a production environment you would most likely use a VPN client or Azure ExpressRoute to directly connect clients to the virtual network.

### Create workspace and secured resources

The steps in this section use an Azure Resource Manager template to create the following Azure resources:

* Azure Virtual Network
* Azure Machine Learning workspace
* Azure Container Registry
* Azure Key Vault
* Azure Storage account (blob & file storage)

Public access is disabled for all the services. While the Azure Machine Learning workspace is secured behind a virtual network, it's configured to allow public network access. For more information, see [CLI 2.0 secure communications](how-to-configure-cli.md#secure-communications). A scoring subnet is created, along with outbound rules that allow communication with the following Azure services:

* Azure Active Directory
* Azure Resource Manager
* Azure Front Door
* Microsoft Container Registries

The following diagram shows the different components created in this architecture:

The following diagram shows the overall architecture of this example:

:::image type="content" source="./media/how-to-secure-online-endpoint/endpoint-network-isolation-diagram.png" alt-text="Diagram of the services created.":::

To create the resources, use the following Azure CLI commands. To create a resource group. Replace `<my-resource-group>` and `<my-location>` with the desired values.  

```azurecli
# create resource group
az group create --name <my-resource-group> --location <my-location>
```

Clone the example files for the deployment, use the following command:

```azurecli
#Clone the example files
git clone https://github.com/Azure/azureml-examples
```

To create the resources, use the following Azure CLI commands. Replace `<UNIQUE_SUFFIX>` with a unique suffix for the resources that are created.

```azurecli
az deployment group create --template-file endpoints/online/managed/vnet/setup_ws/main.bicep --parameters suffix=$SUFFIX --resource-group <my-resource-group>
```
### Create the virtual machine jump box

To create an Azure Virtual Machine that can be used to connect to the virtual network, use the following command. Replace `<your-new-password>` with the password you want to use when connecting to this VM:

```azurecli
# create vm
az vm create --name test-vm --vnet-name vnet-$SUFFIX --subnet snet-scoring --image UbuntuLTS --admin-username azureuser --admin-password <your-new-password> --resource-group <my-resource-group>
```

> [!IMPORTANT]
> The VM created by these commands has a public endpoint that you can connect to over the public network.

The response from this command is similar to the following JSON document:

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

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/managed/vnet/setup_vm/scripts/vmsetup.sh" id="setup_docker_az_cli":::

1. To create the environment variables used by this example, run the following commands. Replace `<YOUR_SUBSCRIPTION_ID>` with your Azure subscription ID. Replace `<YOUR_RESOURCE_GROUP>` with the resource group that contains your workspace. Replace `<SUFFIX_USED_IN_SETUP>` with the suffix you provided earlier. Replace `<LOCATION>` with the location of your Azure workspace. Replace `<YOUR_ENDPOINT_NAME>` with the name to use for the endpoint.

    > [!TIP]
    > Use the tabs to select whether you want to perform a deployment using an MLflow model or generic ML model.

    # [Generic model](#tab/model)

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-vnet.sh" id="set_env_vars":::

    # [MLflow model](#tab/mlflow)

    :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-vnet-mlflow.sh" id="set_env_vars":::

    ---

1. To sign in to the Azure CLI in the VM environment, use the following command:

    :::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_login":::

1. To configure the defaults for the CLI, use the following commands:

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/managed/vnet/setup_vm/scripts/vmsetup.sh" id="configure_defaults":::

1. To clone the example files for the deployment, use the following command:

    ```azurecli
    sudo mkdir -p /home/samples; sudo git clone -b main --depth 1 https://github.com/Azure/azureml-examples.git /home/samples/azureml-examples
    ```

1. To build a custom docker image to use with the deployment, use the following commands:

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/managed/vnet/setup_vm/scripts/build_image.sh" id="build_image":::

    > [!TIP]
    > In this example, we build the Docker image before pushing it to Azure Container Registry. Alternatively, you can build the image in your virtual network by using an Azure Machine Learning compute cluster and environments. For more information, see [Secure Azure Machine Learning workspace](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

### Create a secured managed online endpoint

1. To create a managed online endpoint that is secured using a private endpoint for inbound and outbound communication, use the following commands:

    > [!TIP]
    > You can test or debug the Docker image locally by using the `--local` flag when creating the deployment. For more information, see the [Deploy and debug locally](how-to-deploy-online-endpoints.md#deploy-and-debug-locally-by-using-local-endpoints) article.

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/managed/vnet/setup_vm/scripts/create_moe.sh" id="create_vnet_deployment":::


1. To make a scoring request with the endpoint, use the following commands:

    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/managed/vnet/setup_vm/scripts/score_endpoint.sh" id="check_deployment":::

### Cleanup

To delete the endpoint, use the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-vnet.sh" id="delete_endpoint":::

To delete the VM, use the following command:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-vnet.sh" id="delete_vm":::

To delete all the resources created in this article, use the following command. Replace `<resource-group-name>` with the name of the resource group used in this example:

```azurecli
az group delete --resource-group <resource-group-name>
```

## Troubleshooting

[!INCLUDE [network isolation issues](includes/machine-learning-online-endpoint-troubleshooting.md)]

## Next steps

- [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md)
- [How to autoscale managed online endpoints](how-to-autoscale-endpoints.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Access Azure resources with a online endpoint and managed identity](how-to-access-resources-from-endpoints-managed-identities.md)
- [Troubleshoot online endpoints deployment](how-to-troubleshoot-online-endpoints.md)
