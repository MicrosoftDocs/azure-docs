---
title: Managed network isolation
titleSuffix: Azure Machine Learning
description: how to use managed network isolation for network security
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 05/23/2023
ms.topic: how-to
ms.custom: 
---

# Workspace managed network isolation (preview)

Azure Machine Learning provides preview support for managed network isolation. Managed network isolation streamlines and automates your network isolation configuration with a built-in, workspace-level Azure Machine Learning managed virtual network, instead of using your virtual network.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Managed network architecture

When you enable managed network isolation, a managed virtual network is created for the workspace. Managed compute resources (compute clusters and compute instances) for the workspace automatically use this managed virtual network. The managed virtual network can use private endpoints for Azure resources that are used by your workspace, such as Azure Storage, Azure Key Vault, and Azure Container Registry. 

The following diagram shows a managed virtual network uses private endpoints to communicate with the storage, key vault, and container registry used by the workspace.

:::image type="content" source="./media/how-to-managed-network/managed-virtual-network-architecture.png" alt-text="Diagram of managed network isolation.":::

There are two different configuration modes for outbound traffic from the managed virtual network:

> [!TIP]
> Regardless of the outbound mode you use, traffic to Azure resources can be configured to use a private endpoint. For example, you may allow all outbound traffic to the internet, but restrict communication with Azure resources by creating a private endpoint for that resource in the managed VNet

| Outbound mode | Description | Scenarios |
| ----- | ----- | ----- |
| Allow internet outbound | Allow all internet outbound traffic from the managed VNet. | Recommended if you need access to machine learning artifacts on the Internet, such as python packages or pretrained models. |
| Allow only approved outbound | Outbound traffic is allowed by specifying FQDNs and service tags. | Recommended if you want to minimize the risk of data exfiltration but you need to prepare all required machine learning artifacts in your private locations. |

<!-- you get Azure Machine Learning managed virtual network and your computing resources automatically use that virtual network. Managed network isolation has two modes:

* Allow internet outbound mode: Allow all internet outbound from Azure Machine Learning managed VNet. You can have private endpoint connections to your private Azure resources. This is the mode if your ML engineers need access to machine learning artifacts on the Internet such as python packages, pretrained models.
* Allow only approved outbound mode: You can allow outbound only to the approved outbound using private endpoint, FQDN and service tag. This is the mode if you want to minimize data exfiltration risk but you need to prepare all required machine learning artifacts in your private locations. -->

The managed virtual network is preconfigured with [required default outbound rules](#list-of-required-outbound-rules) and private endpoint connections to your workspace default storage, container registry and key vault if they're private. After choosing the managed network isolation mode, you only need to consider additional outbound requirements.

## Supported scenarios in preview and to be supported scenarios

|Scenarios|Supported in preview|To be supported|
|---|---|---|
|Isolation Mode|Allow internet outbound<br>Allow only approved outbound||
|Compute|Compute Instance<br>Compute Cluster<br>Serverless<br>Serverless spark|New managed online endpoint creation<br>Migration of existing managed online endpoint<br>No Public IP option of Compute Instance, Compute Cluster and Serverless|
|Outbound|Private Endpoint<br>Service Tag|FQDN|

## Configure a workspace with allow internet outbound mode

# [Azure CLI](#tab/cli)

In the `az ml workspace create` command, replace the following values:

* `rg`: The resource group that the workspace will be created in.
* `ws`: The Azure Machine Learning workspace name.

```azurecli
az ml workspace create --name ws --resource-group rg --managed-network allow_internet_outbound
```

> [!TIP]
> We recommend using a yml file to have additional private endpoint outbound rules. You can find a sample yaml file at [https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-pe-outboundrule-Workspace.yaml](https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-pe-outboundrule-Workspace.yaml).
>
> ```azurecli
> az ml workspace create --name ws --resource-group rg --file add-pe-outboundrule-Workspace.yaml
> ```


# [Python](#tab/python)

> [!IMPORTANT]
> The following code snippet assumes that `ml_client` points to an Azure Machine Learning workspace that uses a private endpoint to participate in a VNet. For more information on using `ml_client`, see the tutorial [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import Workspace, ManagedNetwork
from azure.ai.ml.constants._workspace import IsolationMode
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<WORKSPACE>"

ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)

ws = ml_client.workspaces.get(workspace)
ws.managed_network = ManagedNetwork(IsolationMode.ALLOW_INTERNET_OUTBOUND)
ws.managed_network.outbound_rules = [
  PrivateEndpointDestination(rule_name="my-storage", service_resource_id="/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/MyGroup/providers/Microsoft.Storage/storageAccounts/myaccount", subresource_target="blob")
]

ml_client.workspaces.begin_update(ws)
```

# [Studio](#tab/azure-studio)

1. Sign in to the [Azure portal](https://ms.azure.com), and choose Azure Machine Learning from Create a resource menu.
1. Fill the information in Basics tab and move to Networking tab
1. Choose managed network mode; Private with Internet outbound or Private only with approved outbound
1. Create a workspace

    <!-- :::image type="content" source="TBU" alt-text="" lightbox=""::: -->

---

## Configure a workspace with allow only approved outbound mode

# [Azure CLI](#tab/cli)

In the `az ml workspace create` command, replace the following values:

* `rg`: The resource group that the workspace will be created in.
* `ws`: The Azure Machine Learning workspace name.

```azurecli
az ml workspace create --name ws --resource-group rg --managed-network allow_only_approved_outbound
```

> [!TIP]
> We recommend using a yml file to have additional outbound rules. You can find a sample yaml file at [https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-several-outboundrules-Workspace.yaml](https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-several-outboundrules-Workspace.yaml).
>
> ```azurecli
> az ml workspace create --name ws --resource-group rg --file add-several-outboundrules-Workspace.yaml
> ```


# [Python](#tab/python)

> [!IMPORTANT]
> The following code snippet assumes that `ml_client` points to an Azure Machine Learning workspace that uses a private endpoint to participate in a VNet. For more information on using `ml_client`, see the tutorial [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import Workspace
from azure.ai.ml.entities import ManagedNetwork, FqdnDestination, ServiceTagDestination, PrivateEndpointDestination
from azure.ai.ml.constants._workspace import IsolationMode
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<WORKSPACE>"

ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)

ws = ml_client.workspaces.get()
ws.managed_network = ManagedNetwork(IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND)
ws.managed_network.outbound_rules = [
  FqdnDestination(rule_name="pytorch", destination="*.pytorch.org"),
  ServiceTagDestination(rule_name="my-service", service_tag="DataFactory", protocol="TCP", port_ranges="80, 8080-8089"),
  PrivateEndpointDestination(rule_name="my-storage", service_resource_id="/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/MyGroup/providers/Microsoft.Storage/storageAccounts/myaccount", subresource_target="blob")
]

ml_client.workspaces.begin_update(ws)
```

# [Studio](#tab/azure-studio)

1. Sign in to the [Azure portal](https://ms.azure.com), and choose Azure Machine Learning from Create a resource menu.
1. Fill the information in Basics tab and move to Networking tab
1. Choose managed network mode; Private with Internet outbound or Private only with approved outbound
1. Create a workspace

    <!-- :::image type="content" source="TBU" alt-text="" lightbox=""::: -->
---

## Update existing workspaces with managed network isolation

> [!WARNING]
> You need to delete your all computing resources incl. compute instance, compute cluster, serverless, serverless spark, managed online endpoint to enable managed network isolation.

# [Azure CLI](#tab/cli)

In the `az ml workspace update` command, replace the following values:

* `rg`: The resource group that the workspace will be created in.
* `ws`: The Azure Machine Learning workspace name.

Update a workspace with allow only approved outbound mode

```azurecli
az ml workspace update --name ws --resource-group rg --managed-network allow_internet_outbound
```

> [!TIP]
> We recommend using a yml file to have additional private endpoint outbound rules. You can find a sample yaml file at [https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-pe-outboundrule-Workspace.yaml](https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-pe-outboundrule-Workspace.yaml).
>
> ```azurecli
> az ml workspace update --name ws --resource-group rg --file add-pe-outboundrule-Workspace.yaml
> ```

Update a workspace with allow only approved outbound mode

```azurecli
az ml workspace update --name ws --resource-group rg --managed-network allow_only_approved_outbound
```

> [!TIP]
> We recommend using a yml file to have additional outbound rules. You can find a sample yaml file from [https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-several-outboundrules-Workspace.yaml](https://github.com/Azure/azureml_run_specification/blob/master/configs/workspace/add-several-outboundrules-Workspace.yaml).
>
> ```azurecli
> az ml workspace update --name ws --resource-group rg --file add-several-outboundrules-Workspace.yaml
> ```

# [Python](#tab/python)

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import Workspace
from azure.ai.ml.entities import ManagedNetwork, FqdnDestination, ServiceTagDestination, PrivateEndpointDestination
from azure.ai.ml.constants._workspace import IsolationMode
from azure.identity import DefaultAzureCredential

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<WORKSPACE>"

ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)

ws = ml_client.workspaces.get()
ws.managed_network = ManagedNetwork(IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND)
ws.managed_network.outbound_rules = [
  FqdnDestination(rule_name="pytorch", destination="*.pytorch.org"),
  ServiceTagDestination(rule_name="my-service", service_tag="DataFactory", protocol="TCP", port_ranges="80, 8080-8089"),
  PrivateEndpointDestination(rule_name="my-storage", service_resource_id="/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/MyGroup/providers/Microsoft.Storage/storageAccounts/myaccount", subresource_target="blob")
]

ml_client.workspaces.begin_update(ws)
```

# [Studio](#tab/azure-studio)

1. Sign in to the [Azure portal](https://ms.azure.com), and choose your Azure Machine Learning workspace.
1. Go to the networking blade and managed network tab.
1. Change managed network mode to "private with internet outbound" or "private with allowed outbound"

    <!-- :::image type="content" source="TBU" alt-text="" lightbox=""::: -->

---

## Configuration for using serverless spark compute

You need to run the following commands to have network isolation for your [serverless spark jobs](how-to-submit-spark-jobs.md).

# [Azure CLI](#tab/cli)

```azurecli
az ml workspace provision-network -g my_resource_group -n my_workspace_name --include-spark
```

# [Python](#tab/python)

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import Workspace, ManagedNetwork
from azure.ai.ml.constants._workspace import IsolationMode
from azure.identity import DefaultAzureCredential
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<WORKSPACE>"
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)
ws = ml_client.workspaces.provision_network(workspace, true)
```

# [Studio](#tab/azure-studio)

1. Sign in to the [Azure portal](https://ms.azure.com), and choose your Azure Machine Learning workspace.
1. Go to the networking blade and managed network tab.
1. Check the box: Use serverless spark compute.

    <!-- :::image type="content" source="TBU" alt-text="" lightbox=""::: -->

---

## List of required outbound rules

* `AzureActiveDirectory`
* `AzureMachineLearning`
* `BatchNodeManagement.region`
* `AzureResourceManager`
* `AzureFrontDoor`
* `MicrosoftContainerRegistry`
* `AzureMonitor`

## Limitations

* Once you enable managed network isolation of your workspace, you can't disable it.
* Managed virtual network uses private endpoint connection to access your private resources. You can't have a private endpoint and a service endpoint at the same time for your Azure resources, such as a storage account. We recommend using private endpoints in all scenarios.
