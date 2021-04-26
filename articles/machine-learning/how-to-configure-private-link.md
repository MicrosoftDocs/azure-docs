---
title: Configure a private endpoint
titleSuffix: Azure Machine Learning
description: 'Use Azure Private Link to securely access your Azure Machine Learning workspace from a virtual network.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 02/09/2021
---

# Configure Azure Private Link for an Azure Machine Learning workspace

In this document, you learn how to use Azure Private Link with your Azure Machine Learning workspace. For information on creating a virtual network for Azure Machine Learning, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

Azure Private Link enables you to connect to your workspace using a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. Private Link helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](../private-link/private-link-overview.md) article.

> [!IMPORTANT]
> Azure Private Link does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal. Data plane operations, such as using Azure Machine Learning studio, APIs (including published pipelines), or the SDK use the private endpoint.
>
> You may encounter problems trying to access the private endpoint for your workspace if you are using Mozilla Firefox. This problem may be related to DNS over HTTPS in Mozilla. We recommend using Microsoft Edge or Google Chrome as a workaround.

## Prerequisites

* If you plan on using a private link enabled workspace with a customer-managed key, you must request this feature using a support ticket. For more information, see [Manage and increase quotas](how-to-manage-quotas.md#private-endpoint-and-private-dns-quota-increases).

* You must have an existing virtual network to create the private endpoint in. You must also [disable network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md) before adding the private endpoint.
## Limitations

* Using an Azure Machine Learning workspace with private link is not available in the Azure Government regions.
* If you enable public access for a workspace secured with private link and use Azure Machine Learning studio over the public internet, some features such as the designer may fail to access your data. This problem happens when the data is stored on a service that is secured behind the VNet. For example, an Azure Storage Account.

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

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace create](/cli/azure/ml/workspace#az_ml_workspace_create) command. The following parameters for this command can be used to create a workspace with a private network, but it requires an existing virtual network:

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

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace private-endpoint add](/cli/azure/ml/workspace/private-endpoint#az_ml_workspace_private_endpoint_add) command.

```azurecli
az ml workspace private-endpoint add -w myworkspace  --pe-name myprivateendpoint --pe-auto-approval true --pe-vnet-name myvnet
```

# [Portal](#tab/azure-portal)

From the Azure Machine Learning workspace in the portal, select __Private endpoint connections__ and then select __+ Private endpoint__. Use the fields to create a new private endpoint.

* When selecting the __Region__, select the same region as your virtual network. 
* When selecting __Resource type__, use __Microsoft.MachineLearningServices/workspaces__. 
* Set the __Resource__ to your workspace name.

Finally, select __Create__ to create the private endpoint.

---

## Remove a private endpoint

Use one of the following methods to remove a private endpoint from a workspace:

# [Python](#tab/python)

Use [Workspace.delete_private_endpoint_connection](/python/api/azureml-core/azureml.core.workspace(class)#delete-private-endpoint-connection-private-endpoint-connection-name-) to remove a private endpoint.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
# get the connection name
_, _, connection_name = ws.get_details()['privateEndpointConnections'][0]['id'].rpartition('/')
ws.delete_private_endpoint_connection(private_endpoint_connection_name=connection_name)
```

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace private-endpoint delete](/cli/azure/ml/workspace/private-endpoint#az_ml_workspace_private_endpoint_delete) command.

# [Portal](#tab/azure-portal)

From the Azure Machine Learning workspace in the portal, select __Private endpoint connections__, and then select the endpoint you want to remove. Finally, select __Remove__.

---

## Using a workspace over a private endpoint

Since communication to the workspace is only allowed from the virtual network, any development environments that use the workspace must be members of the virtual network. For example, a virtual machine in the virtual network.

> [!IMPORTANT]
> To avoid temporary disruption of connectivity, Microsoft recommends flushing the DNS cache on machines connecting to the workspace after enabling Private Link. 

For information on Azure Virtual Machines, see the [Virtual Machines documentation](../virtual-machines/index.yml).

## Enable public access

In some situations, you may want to allow someone to connect to your secured workspace over a public endpoint, instead of through the VNet. After configuring a workspace with a private endpoint, you can optionally enable public access to the workspace. Doing so does not remove the private endpoint. All communications between components behind the VNet is still secured. It enables public access only to the workspace, in addition to the private access through the VNet.

> [!WARNING]
> When connecting over the public endpoint, some features of studio will fail to access your data. This problem happens when the data is stored on a service that is secured behind the VNet. For example, an Azure Storage Account. Also please note compute instance Jupyter/JupyterLab/RStudio functionality and running notebooks will not work.

To enable public access to a private link-enabled workspace, use the following steps:

# [Python](#tab/python)

Use [Workspace.delete_private_endpoint_connection](/python/api/azureml-core/azureml.core.workspace(class)#delete-private-endpoint-connection-private-endpoint-connection-name-) to remove a private endpoint.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
ws.update(allow_public_access_when_behind_vnet=True)
```

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace update](/cli/azure/ml/workspace#az_ml_workspace_update) command. To enable public access to the workspace, add the parameter `--allow-public-access true`.

# [Portal](#tab/azure-portal)

Currently there is no way to enable this functionality using the portal.

---


## Next steps

* For more information on securing your Azure Machine Learning workspace, see the [Virtual network isolation and privacy overview](how-to-network-security-overview.md) article.

* If you plan on using a custom DNS solution in your virtual network, see [how to use a workspace with a custom DNS server](how-to-custom-dns.md).
