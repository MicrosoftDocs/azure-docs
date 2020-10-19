---
title: Configure a private endpoint
titleSuffix: Azure Machine Learning
description: 'Use Azure Private Link to securely access your Azure Machine Learning workspace from a virtual network.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 09/30/2020
---

# Configure Azure Private Link for an Azure Machine Learning workspace

In this document, you learn how to use Azure Private Link with your Azure Machine Learning workspace. For information on creating a virtual network for Azure Machine Learning, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

Azure Private Link enables you to connect to your workspace using a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. Private Link helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](/azure/private-link/private-link-overview) article.

> [!IMPORTANT]
> Azure Private Link does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal. Data plane operations, such as using Azure Machine Learning studio, APIs (including published pipelines), or the SDK use the private endpoint.
>
> You may encounter problems trying to access the private endpoint for your workspace if you are using Mozilla Firefox. This problem may be related to DNS over HTTPS in Mozilla. We recommend using Microsoft Edge of Google Chrome as a workaround.

## Prerequisites

If you plan on using a private link enabled workspace with a customer-managed key, you must request this feature using a support ticket. For more information, see [Manage and increase quotas](how-to-manage-quotas.md#private-endpoint-and-private-dns-quota-increases).

## Limitations

Using an Azure Machine Learning workspace with private link is not available in the Azure Government regions or Azure China 21Vianet regions.

## Create a workspace that uses a private endpoint

Use one of the following methods to create a workspace with a private endpoint. Each of these methods __requires an existing virtual network__:

> [!TIP]
> If you'd like to create a workspace, private endpoint, and virtual network at the same time, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).

# [Python](#tab/python)

The Azure Machine Learning Python SDK provides the [PrivateEndpointConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.privateendpointconfig?view=azure-ml-py) class, which can be used with [Workspace.create()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---tags-none--friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--adb-workspace-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--private-endpoint-config-none--private-endpoint-auto-approval-true--exist-ok-false--show-output-true-) to create a workspace with a private endpoint. This class requires an existing virtual network.

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace create](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/workspace?view=azure-cli-latest#ext_azure_cli_ml_az_ml_workspace_create) command. The following parameters for this command can be used to create a workspace with a private network, but it requires an existing virtual network:

* `--pe-name`: The name of the private endpoint that is created.
* `--pe-auto-approval`: Whether private endpoint connections to the workspace should be automatically approved.
* `--pe-resource-group`: The resource group to create the private endpoint in. Must be the same group that contains the virtual network.
* `--pe-vnet-name`: The existing virtual network to create the private endpoint in.
* `--pe-subnet-name`: The name of the subnet to create the private endpoint in. The default value is `default`.

# [Portal](#tab/azure-portal)

The __Networking__ tab in Azure Machine Learning studio allows you to configure a private endpoint. However, it requires an existing virtual network. For more information, see [Create workspaces in the portal](how-to-manage-workspace.md).

---

## Add a private endpoint to a workspace

Use one of the following methods to add a private endpoint to an existing workspace:

> [!IMPORTANT]
>
> You must have an existing virtual network to create the private endpoint in. You must also [disable network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md) before adding the private endpoint.

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

For more information on the classes and methods used in this example, see [PrivateEndpointConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.privateendpointconfig?view=azure-ml-py) and [Workspace.add_private_endpoint](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py#add-private-endpoint-private-endpoint-config--private-endpoint-auto-approval-true--location-none--show-output-true--tags-none-).

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace private-endpoint add](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/workspace/private-endpoint?view=azure-cli-latest#ext_azure_cli_ml_az_ml_workspace_private_endpoint_add) command.

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

Use [Workspace.delete_private_endpoint_connection](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace(class)?view=azure-ml-py#delete-private-endpoint-connection-private-endpoint-connection-name-) to remove a private endpoint.

```python
from azureml.core import Workspace

ws = Workspace.from_config()
# get the connection name
_, _, connection_name = ws.get_details()['privateEndpointConnections'][0]['id'].rpartition('/')
ws.delete_private_endpoint_connection(private_endpoint_connection_name=connection_name)
```

# [Azure CLI](#tab/azure-cli)

The [Azure CLI extension for machine learning](reference-azure-machine-learning-cli.md) provides the [az ml workspace private-endpoint delete](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/workspace/private-endpoint?view=azure-cli-latest#ext_azure_cli_ml_az_ml_workspace_private_endpoint_delete) command.

# [Portal](#tab/azure-portal)

From the Azure Machine Learning workspace in the portal, select __Private endpoint connections__, and then select the endpoint you want to remove. Finally, select __Remove__.

---

## Using a workspace over a private endpoint

Since communication to the workspace is only allowed from the virtual network, any development environments that use the workspace must be members of the virtual network. For example, a virtual machine in the virtual network.

> [!IMPORTANT]
> To avoid temporary disruption of connectivity, Microsoft recommends flushing the DNS cache on machines connecting to the workspace after enabling Private Link. 

For information on Azure Virtual Machines, see the [Virtual Machines documentation](/azure/virtual-machines/).


## Next steps

* For more information on securing your Azure Machine Learning workspace, see the [Virtual network isolation and privacy overview](how-to-network-security-overview.md) article.

* If you plan on using a custom DNS solution in your virtual network, see [how to use a workspace with a custom DNS server](how-to-custom-dns.md).
