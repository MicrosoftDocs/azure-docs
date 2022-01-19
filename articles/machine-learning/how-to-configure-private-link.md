---
title: Configure a private endpoint
titleSuffix: Azure Machine Learning
description: 'Use a private endpoint to securely access your Azure Machine Learning workspace from a virtual network.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 01/12/2022
---

# Configure a private endpoint for an Azure Machine Learning workspace

In this document, you learn how to configure a private endpoint for your Azure Machine Learning workspace. For information on creating a virtual network for Azure Machine Learning, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md).

Azure Private Link enables you to connect to your workspace using a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. A private endpoint helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](../private-link/private-link-overview.md) article.

> [!WARNING]
> Securing a workspace with private endpoints does not ensure end-to-end security by itself. You must secure all of the individual components of your solution. For example, if you use a private endpoint for the workspace, but your Azure Storage Account is not behind the VNet, traffic between the workspace and storage does not use the VNet for security.
>
> For more information on securing resources used by Azure Machine Learning, see the following articles:
>
> * [Virtual network isolation and privacy overview](how-to-network-security-overview.md).
> * [Secure workspace resources](how-to-secure-workspace-vnet.md).
> * [Secure training environments](how-to-secure-training-vnet.md).
> * [Secure inference environments](how-to-secure-inferencing-vnet.md).
> * [Use Azure Machine Learning studio in a VNet](how-to-enable-studio-virtual-network.md).

## Prerequisites

* You must have an existing virtual network to create the private endpoint in. 
* [Disable network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md) before adding the private endpoint.

## Limitations

* If you enable public access for a workspace secured with private endpoint and use Azure Machine Learning studio over the public internet, some features such as the designer may fail to access your data. This problem happens when the data is stored on a service that is secured behind the VNet. For example, an Azure Storage Account.
* You may encounter problems trying to access the private endpoint for your workspace if you are using Mozilla Firefox. This problem may be related to DNS over HTTPS in Mozilla. We recommend using Microsoft Edge or Google Chrome as a workaround.
* Using a private endpoint does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal. Data plane operations, such as using Azure Machine Learning studio, APIs (including published pipelines), or the SDK use the private endpoint.
* When creating a compute instance or compute cluster in a workspace with a private endpoint, the compute instance and compute cluster must be in the same Azure region as the workspace.
* When creating or attaching an Azure Kubernetes Service cluster to a workspace with a private endpoint, the cluster must be in the same region as the workspace.
* When using a workspace with multiple private endpoints, one of the private endpoints must be in the same VNet as the following dependency services:

    * Azure Storage Account that provides the default storage for the workspace
    * Azure Key Vault for the workspace
    * Azure Container Registry for the workspace.

    For example, one VNet ('services' VNet) would contain a private endpoint for the dependency services and the workspace. This configuration allows the workspace to communicate with the services. Another VNet ('clients') might only contain a private endpoint for the workspace, and be used only for communication between client development machines and the workspace.

## Create a workspace that uses a private endpoint

Use one of the following methods to create a workspace with a private endpoint. Each of these methods __requires an existing virtual network__:

> [!TIP]
> If you'd like to create a workspace, private endpoint, and virtual network at the same time, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).

# [Python](#tab/python)

The Azure Machine Learning Python SDK provides the [PrivateEndpointConfig](/python/api/azureml-core/azureml.core.privateendpointconfig) class, which can be used with [Workspace.create()](/python/api/azureml-core/azureml.core.workspace.workspace#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---tags-none--friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--adb-workspace-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--private-endpoint-config-none--private-endpoint-auto-approval-true--exist-ok-false--show-output-true-) to create a workspace with a private endpoint. This class requires an existing virtual network.

```python
from azureml.core import Workspace
from azureml.core import PrivateEndPointConfig

pe = PrivateEndPointConfig(name='myprivateendpoint', vnet_name='myvnet', vnet_subnet_name='default')
ws = Workspace.create(name='myworkspace',
    subscription_id='<my-subscription-id>',
    resource_group='myresourcegroup',
    location='eastus2',
    private_endpoint_config=pe,
    private_endpoint_auto_approval=True,
    show_output=True)
```

# [Azure CLI extension 2.0 preview](#tab/azurecliextensionv2)

When using the Azure CLI [extension 2.0 CLI preview for machine learning](how-to-configure-cli.md), a YAML document is used to configure the workspace. The following is an of creating a new workspace using a YAML configuration:

> [!TIP]
> When using private link, your workspace cannot use Azure Container Registry tasks compute for image building. The `image_build_compute` property in this configuration specifies a CPU compute cluster name to use for Docker image environment building. You can also specify whether the private link workspace should be accessible over the internet using the `public_network_access` property.
>
> In this example, the compute referenced by `image_build_compute` will need to be created before building images.

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/privatelink.yml":::

```azurecli-interactive
az ml workspace create \
    -g <resource-group-name> \
    --file privatelink.yml
```

After creating the workspace, use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az_network_private_endpoint_create) to create a private link endpoint for the workspace.

```azurecli-interactive
az network private-endpoint create \
    --name <private-endpoint-name> \
    --vnet-name <vnet-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id "/subscriptions/<subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>" \
    --group-id amlworkspace \
    --connection-name workspace -l <location>
```

To create the private DNS zone entries for the workspace, use the following commands:

```azurecli-interactive
# Add privatelink.api.azureml.ms
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.api.azureml.ms'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.api.azureml.ms' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.api.azureml.ms' \
    --zone-name 'privatelink.api.azureml.ms'

# Add privatelink.notebooks.azure.net
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.notebooks.azure.net'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.notebooks.azure.net' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group add \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.notebooks.azure.net' \
    --zone-name 'privatelink.notebooks.azure.net'
```

# [Azure CLI extension 1.0](#tab/azurecliextensionv1)

If you are using the Azure CLI [extension 1.0 for machine learning](reference-azure-machine-learning-cli.md), use the [az ml workspace create](/cli/azure/ml/workspace#az_ml_workspace_create) command. The following parameters for this command can be used to create a workspace with a private network, but it requires an existing virtual network:

* `--pe-name`: The name of the private endpoint that is created.
* `--pe-auto-approval`: Whether private endpoint connections to the workspace should be automatically approved.
* `--pe-resource-group`: The resource group to create the private endpoint in. Must be the same group that contains the virtual network.
* `--pe-vnet-name`: The existing virtual network to create the private endpoint in.
* `--pe-subnet-name`: The name of the subnet to create the private endpoint in. The default value is `default`.

These parameters are in addition to other required parameters for the create command. For example, the following command creates a new workspace in the West US region, using an existing resource group and VNet:

```azurecli
az ml workspace create -r myresourcegroup \
    -l westus \
    -n myworkspace \
    --pe-name myprivateendpoint \
    --pe-auto-approval \
    --pe-resource-group myresourcegroup \
    --pe-vnet-name myvnet \
    --pe-subnet-name mysubnet
```

# [Portal](#tab/azure-portal)

The __Networking__ tab in Azure Machine Learning studio allows you to configure a private endpoint. However, it requires an existing virtual network. For more information, see [Create workspaces in the portal](how-to-manage-workspace.md).

---

## Add a private endpoint to a workspace

Use one of the following methods to add a private endpoint to an existing workspace:

> [!WARNING]
>
> If you have any existing compute targets associated with this workspace, and they are not behind the same virtual network tha the private endpoint is created in, they will not work.

# [Python](#tab/python)

```python
from azureml.core import Workspace
from azureml.core import PrivateEndPointConfig

pe = PrivateEndPointConfig(name='myprivateendpoint', vnet_name='myvnet', vnet_subnet_name='default')
ws = Workspace.from_config()
ws.add_private_endpoint(private_endpoint_config=pe, private_endpoint_auto_approval=True, show_output=True)
```

For more information on the classes and methods used in this example, see [PrivateEndpointConfig](/python/api/azureml-core/azureml.core.privateendpointconfig) and [Workspace.add_private_endpoint](/python/api/azureml-core/azureml.core.workspace(class)#add-private-endpoint-private-endpoint-config--private-endpoint-auto-approval-true--location-none--show-output-true--tags-none-).

# [Azure CLI extension 2.0 preview](#tab/azurecliextensionv2)

When using the Azure CLI [extension 2.0 CLI preview for machine learning](how-to-configure-cli.md), use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az_network_private_endpoint_create) to create a private link endpoint for the workspace.

```azurecli-interactive
az network private-endpoint create \
    --name <private-endpoint-name> \
    --vnet-name <vnet-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id "/subscriptions/<subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>" \
    --group-id amlworkspace \
    --connection-name workspace -l <location>
```

To create the private DNS zone entries for the workspace, use the following commands:

```azurecli-interactive
# Add privatelink.api.azureml.ms
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.api.azureml.ms'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.api.azureml.ms' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.api.azureml.ms' \
    --zone-name 'privatelink.api.azureml.ms'

# Add privatelink.notebooks.azure.net
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.notebooks.azure.net'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.notebooks.azure.net' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group add \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.notebooks.azure.net' \
    --zone-name 'privatelink.notebooks.azure.net'
```

# [Azure CLI extension 1.0](#tab/azurecliextensionv1)

The Azure CLI [extension 1.0 for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace private-endpoint add](/cli/azure/ml(v1)/workspace/private-endpoint#az_ml_workspace_private_endpoint_add) command.

```azurecli
az ml workspace private-endpoint add -w myworkspace  --pe-name myprivateendpoint --pe-auto-approval --pe-vnet-name myvnet
```

# [Portal](#tab/azure-portal)

From the Azure Machine Learning workspace in the portal, select __Private endpoint connections__ and then select __+ Private endpoint__. Use the fields to create a new private endpoint.

* When selecting the __Region__, select the same region as your virtual network. 
* When selecting __Resource type__, use __Microsoft.MachineLearningServices/workspaces__. 
* Set the __Resource__ to your workspace name.

Finally, select __Create__ to create the private endpoint.

---

## Remove a private endpoint

You can remove one or all private endpoints for a workspace. Removing a private endpoint removes the workspace from the VNet that the endpoint was associated with. This may prevent the workspace from accessing resources in that VNet, or resources in the VNet from accessing the workspace. For example, if the VNet does not allow access to or from the public internet.

> [!WARNING]
> Removing the private endpoints for a workspace __doesn't make it publicly accessible__. To make the workspace publicly accessible, use the steps in the [Enable public access](#enable-public-access) section.

To remove a private endpoint, use the following information:

# [Python](#tab/python)

To remove a private endpoint, use [Workspace.delete_private_endpoint_connection](/python/api/azureml-core/azureml.core.workspace(class)#delete-private-endpoint-connection-private-endpoint-connection-name-). The following example demonstrates how to remove a private endpoint:

```python
from azureml.core import Workspace

ws = Workspace.from_config()
# get the connection name
_, _, connection_name = ws.get_details()['privateEndpointConnections'][0]['id'].rpartition('/')
ws.delete_private_endpoint_connection(private_endpoint_connection_name=connection_name)
```
# [Azure CLI extension 2.0 preview](#tab/azurecliextensionv2)

When using the Azure CLI [extension 2.0 CLI preview for machine learning](how-to-configure-cli.md), use the following command to remove the private endpoint:

```azurecli
az network private-endpoint delete \
    --name <private-endpoint-name> \
    --resource-group <resource-group-name> \
```

# [Azure CLI extension 1.0](#tab/azurecliextensionv1)

The Azure CLI [extension 1.0 for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace private-endpoint delete](/cli/azure/ml(v1)/workspace/private-endpoint#az_ml_workspace_private_endpoint_delete) command.

# [Portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning workspace.
1. From the left side of the page, select __Networking__ and then select the __Private endpoint connections__ tab.
1. Select the endpoint to remove and then select __Remove__.

:::image type="content" source="./media/how-to-configure-private-link/remove-private-endpoint.png" alt-text="Screenshot of the UI to remove a private endpoint.":::

---

## Enable public access

In some situations, you may want to allow someone to connect to your secured workspace over a public endpoint, instead of through the VNet. Or you may want to remove the workspace from the VNet and re-enable public access.

> [!IMPORTANT]
> Enabling public access doesn't remove any private endpoints that exist. All communications between components behind the VNet that the private endpoint(s) connect to is still secured. It enables public access only to the workspace, in addition to the private access through any private endpoints.

> [!WARNING]
> When connecting over the public endpoint while the workspace uses a private endpoint to communicate with other resources:
> * __Some features of studio will fail to access your data__. This problem happens when the _data is stored on a service that is secured behind the VNet_. For example, an Azure Storage Account. 
> * Using Jupyter, JupyterLab, and RStudio on a compute instance, including running notebooks, __is not supported__.

To enable public access, use the following steps:

# [Python](#tab/python)

To enable public access, use [Workspace.update](/python/api/azureml-core/azureml.core.workspace(class)#update-friendly-name-none--description-none--tags-none--image-build-compute-none--service-managed-resources-settings-none--primary-user-assigned-identity-none--allow-public-access-when-behind-vnet-none-) and set `allow_public_access_when_behind_vnet=True`.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
ws.update(allow_public_access_when_behind_vnet=True)
```

# [Azure CLI extension 2.0 preview](#tab/azurecliextensionv2)

When using the Azure CLI [extension 2.0 CLI preview for machine learning](how-to-configure-cli.md), create a YAML document that sets the `public_network_access` property to `Enabled`. Then use the `az ml update` command to update the workspace:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/workspace.schema.json
name: mlw-privatelink-prod
location: eastus
display_name: Private Link endpoint workspace-example
description: When using private link, you must set the image_build_compute property to a cluster name to use for Docker image environment building. You can also specify whether the workspace should be accessible over the internet.
image_build_compute: cpu-compute
public_network_access: Enabled
tags:
  purpose: demonstration
```

```azurecli
az ml workspace update \
    -n <workspace-name> \
    -f workspace.yml
    -g <resource-group-name>
```

# [Azure CLI extension 1.0](#tab/azurecliextensionv1)

The Azure CLI [extension 1.0 for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace update](/cli/azure/ml/workspace#az_ml_workspace_update) command. To enable public access to the workspace, add the parameter `--allow-public-access true`.

# [Portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning workspace.
1. From the left side of the page, select __Networking__ and then select the __Public access__ tab.
1. Select __All networks__, and then select __Save__.

:::image type="content" source="./media/how-to-configure-private-link/workspace-public-access.png" alt-text="Screenshot of the UI to enable public endpoint.":::

---

## Securely connect to your workspace

[!INCLUDE [machine-learning-connect-secure-workspace](../../includes/machine-learning-connect-secure-workspace.md)]

## Multiple private endpoints

Azure Machine Learning supports multiple private endpoints for a workspace. Multiple private endpoints are often used when you want to keep different environments separate. The following are some scenarios that are enabled by using multiple private endpoints:

* Client development environments in a separate VNet.
* An Azure Kubernetes Service (AKS) cluster in a separate VNet.
* Other Azure services in a separate VNet. For example, Azure Synapse and Azure Data Factory can use a Microsoft managed virtual network. In either case, a private endpoint for the workspace can be added to the managed VNet used by those services. For more information on using a managed virtual network with these services, see the following articles:

    * [Synapse managed private endpoints](../synapse-analytics/security/synapse-workspace-managed-private-endpoints.md)
    * [Azure Data Factory managed virtual network](../data-factory/managed-virtual-network-private-endpoint.md).

    > [!IMPORTANT]
    > [Synapse's data exfiltration protection](../synapse-analytics/security/workspace-data-exfiltration-protection.md) is not supported with Azure Machine Learning.

> [!IMPORTANT]
> Each VNet that contains a private endpoint for the workspace must also be able to access the Azure Storage Account, Azure Key Vault, and Azure Container Registry used by the workspace. For example, you might create a private endpoint for the services in each VNet.

Adding multiple private endpoints uses the same steps as described in the [Add a private endpoint to a workspace](#add-a-private-endpoint-to-a-workspace) section.

### Scenario: Isolated clients

If you want to isolate the development clients, so they do not have direct access to the compute resources used by Azure Machine Learning, use the following steps:

> [!NOTE]
> These steps assume that you have an existing workspace, Azure Storage Account, Azure Key Vault, and Azure Container Registry. Each of these services has a private endpoints in an existing VNet.

1. Create another VNet for the clients. This VNet might contain Azure Virtual Machines that act as your clients, or it may contain a VPN Gateway used by on-premises clients to connect to the VNet.
1. Add a new private endpoint for the Azure Storage Account, Azure Key Vault, and Azure Container Registry used by your workspace. These private endpoints should exist in the client VNet.
1. If you have additional storage that is used by your workspace, add a new private endpoint for that storage. The private endpoint should exist in the client VNet and have private DNS zone integration enabled.
1. Add a new private endpoint to your workspace. This private endpoint should exist in the client VNet and have private DNS zone integration enabled.
1. Use the steps in the [Use studio in a virtual network](how-to-enable-studio-virtual-network.md#datastore-azure-storage-account) article to enable studio to access the storage account(s).

The following diagram illustrates this configuration. The __Workload__ VNet contains computes created by the workspace for training & deployment. The __Client__ VNet contains clients or client ExpressRoute/VPN connections. Both VNets contain private endpoints for the workspace, Azure Storage Account, Azure Key Vault, and Azure Container Registry.

:::image type="content" source="./media/how-to-configure-private-link/multiple-private-endpoint-workspace-client.png" alt-text="Diagram of isolated client VNet":::

### Scenario: Isolated Azure Kubernetes Service

If you want to create an isolated Azure Kubernetes Service used by the workspace, use the following steps:

> [!NOTE]
> These steps assume that you have an existing workspace, Azure Storage Account, Azure Key Vault, and Azure Container Registry. Each of these services has a private endpoints in an existing VNet.

1. Create an Azure Kubernetes Service instance. During creation, AKS creates a VNet that contains the AKS cluster.
1. Add a new private endpoint for the Azure Storage Account, Azure Key Vault, and Azure Container Registry used by your workspace. These private endpoints should exist in the client VNet.
1. If you have other storage that is used by your workspace, add a new private endpoint for that storage. The private endpoint should exist in the client VNet and have private DNS zone integration enabled.
1. Add a new private endpoint to your workspace. This private endpoint should exist in the client VNet and have private DNS zone integration enabled.
1. Attach the AKS cluster to the Azure Machine Learning workspace. For more information, see [Create and attach an Azure Kubernetes Service cluster](how-to-create-attach-kubernetes.md#attach-an-existing-aks-cluster).

:::image type="content" source="./media/how-to-configure-private-link/multiple-private-endpoint-workspace-aks.png" alt-text="Diagram of isolated AKS VNet":::

## Next steps

* For more information on securing your Azure Machine Learning workspace, see the [Virtual network isolation and privacy overview](how-to-network-security-overview.md) article.

* If you plan on using a custom DNS solution in your virtual network, see [how to use a workspace with a custom DNS server](how-to-custom-dns.md).
