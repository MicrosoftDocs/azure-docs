---
title: Secure training environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning training environment. 
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 04/14/2023
ms.custom: contperf-fy20q4, tracking-python, contperf-fy21q1, references_regions, devx-track-azurecli, sdkv2, event-tier1-build-2022, build-2023
ms.devlang: azurecli
---

# Secure an Azure Machine Learning training environment with virtual networks

[!INCLUDE [SDK v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [managed network](includes/managed-vnet-note.md)]

Azure Machine Learning compute instance, serverless compute, and compute cluster can be used to securely train models in an Azure Virtual Network. When planning your environment, you can configure the compute instance/cluster or serverless compute with or without a public IP address. The general differences between the two are:

* **No public IP**: Reduces costs as it doesn't have the same networking resource requirements. Improves security by removing the requirement for inbound traffic from the internet. However, there are additional configuration changes required to enable outbound access to required resources (Microsoft Entra ID, Azure Resource Manager, etc.).
* **Public IP**: Works by default, but costs more due to additional Azure networking resources. Requires inbound communication from the Azure Machine Learning service over the public internet.

The following table contains the differences between these configurations:

| Configuration | With public IP | Without public IP |
| ----- | ----- | ----- |
| Inbound traffic | `AzureMachineLearning` service tag. | None |
| Outbound traffic | By default, can access the public internet with no restrictions.<br>You can restrict what it accesses using a Network Security Group or firewall. | By default, can access the public network using the [default outbound access](../virtual-network/ip-services/default-outbound-access.md) provided by Azure.<br>We recommend using a Virtual Network NAT gateway or Firewall instead if you need to route outbound traffic to required resources on the internet. |
| Azure networking resources | Public IP address, load balancer, network interface | None |

You can also use Azure Databricks or HDInsight to train models in a virtual network.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)

For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace](tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](tutorial-create-secure-workspace-template.md).

In this article you learn how to secure the following training compute resources in a virtual network:
> [!div class="checklist"]
> - Azure Machine Learning compute cluster
> - Azure Machine Learning compute instance
> - Azure Machine Learning serverless compute
> - Azure Databricks
> - Virtual Machine
> - HDInsight cluster

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources. This VNet must be in the same subscription as your Azure Machine Learning workspace.

    - We recommend putting the storage accounts used by your workspace and training jobs in the same Azure region that you plan to use for compute instances, serverless compute, and clusters. If they aren't in the same Azure region, you may incur data transfer costs and increased network latency.
    - Make sure that **WebSocket** communication is allowed to `*.instances.azureml.net` and `*.instances.azureml.ms` in your VNet. WebSockets are used by Jupyter on compute instances.

+ An existing subnet in the virtual network. This subnet is used when creating compute instances, clusters, and nodes for serverless compute.

    - Make sure that the subnet isn't delegated to other Azure services.
    - Make sure that the subnet contains enough free IP addresses. Each compute instance requires one IP address. Each *node* within a compute cluster and each serverless compute node requires one IP address.

+ If you have your own DNS server, we recommend using DNS forwarding to resolve the fully qualified domain names (FQDN) of compute instances and clusters. For more information, see [Use a custom DNS with Azure Machine Learning](how-to-custom-dns.md).

[!INCLUDE [network-rbac](includes/network-rbac.md)]

## Limitations

* Compute cluster/instance and serverless compute deployment in virtual network isn't supported with Azure Lighthouse.

* __Port 445__ must be open for _private_ network communications between your compute instances and the default storage account during training. For example, if your computes are in one VNet and the storage account is in another, don't block port 445 to the storage account VNet.

## Compute cluster in a different VNet/region from workspace

> [!IMPORTANT]
> You can't create a *compute instance* in a different region/VNet, only a *compute cluster*.

To create a compute cluster in an Azure Virtual Network in a different region than your workspace virtual network, you have couple of options to enable communication between the two VNets.

* Use [VNet Peering](/azure/virtual-network/virtual-network-peering-overview).
* Add a private endpoint for your workspace in the virtual network that will contain the compute cluster.

> [!IMPORTANT]
> Regardless of the method selected, you must also create the VNet for the compute cluster; Azure Machine Learning will not create it for you.
>
> You must also allow the default storage account, Azure Container Registry, and Azure Key Vault to access the VNet for the compute cluster. There are multiple ways to accomplish this. For example, you can create a private endpoint for each resource in the VNet for the compute cluster, or you can use VNet peering to allow the workspace VNet to access the compute cluster VNet.

### Scenario: VNet peering

1. Configure your workspace to use an Azure Virtual Network. For more information, see [Secure your workspace resources](how-to-secure-workspace-vnet.md).
1. Create a second Azure Virtual Network that will be used for your compute clusters. It can be in a different Azure region than the one used for your workspace.
1. Configure [VNet Peering](/azure/virtual-network/virtual-network-peering-overview) between the two VNets.

    > [!TIP]
    > Wait until the VNet Peering status is **Connected** before continuing.

1. Modify the `privatelink.api.azureml.ms` DNS zone to add a link to the VNet for the compute cluster. This zone is created by your Azure Machine Learning workspace when it uses a private endpoint to participate in a VNet.

    1. Add a new __virtual network link__ to the DNS zone. You can do this multiple ways:
    
        * From the Azure portal, navigate to the DNS zone and select **Virtual network links**. Then select **+ Add** and select the VNet that you created for your compute clusters.
        * From the Azure CLI, use the `az network private-dns link vnet create` command. For more information, see [az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet#az-network-private-dns-link-vnet-create).
        * From Azure PowerShell, use the `New-AzPrivateDnsVirtualNetworkLink` command. For more information, see [New-AzPrivateDnsVirtualNetworkLink](/powershell/module/az.privatedns/new-azprivatednsvirtualnetworklink).

1. Repeat the previous step and sub-steps for the `privatelink.notebooks.azure.net` DNS zone.

1. Configure the following Azure resources to allow access from both VNets.

    * The default storage account for the workspace.
    * The Azure Container registry for the workspace.
    * The Azure Key Vault for the workspace.

    > [!TIP]
    > There are multiple ways that you might configure these services to allow access to the VNets. For example, you might create a private endpoint for each resource in both VNets. Or you might configure the resources to allow access from both VNets.

1. Create a compute cluster as you normally would when using a VNet, but select the VNet that you created for the compute cluster. If the VNet is in a different region, select that region when creating the compute cluster.

    > [!WARNING]
    > When setting the region, if it is a different region than your workspace or datastores you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

### Scenario: Private endpoint

1. Configure your workspace to use an Azure Virtual Network. For more information, see [Secure your workspace resources](how-to-secure-workspace-vnet.md).
1. Create a second Azure Virtual Network that will be used for your compute clusters. It can be in a different Azure region than the one used for your workspace.
1. Create a new private endpoint for your workspace in the VNet that will contain the compute cluster. 

    * To add a new private endpoint using the __Azure portal__, select your workspace and then select __Networking__. Select __Private endpoint connections__, __+ Private endpoint__ and use the fields to create a new private endpoint.

        * When selecting the __Region__, select the same region as your virtual network. 
        * When selecting __Resource type__, use __Microsoft.MachineLearningServices/workspaces__. 
        * Set the __Resource__ to your workspace name.
        * Set the __Virtual network__ and __Subnet__ to the VNet and subnet that you created for your compute clusters. 

        Finally, select __Create__ to create the private endpoint.

    * To add a new private endpoint using the Azure CLI, use the `az network private-endpoint create`. For an example of using this command, see [Configure a private endpoint for Azure Machine Learning workspace](how-to-configure-private-link.md#add-a-private-endpoint-to-a-workspace).

1. Create a compute cluster as you normally would when using a VNet, but select the VNet that you created for the compute cluster. If the VNet is in a different region, select that region when creating the compute cluster.

    > [!WARNING]
    > When setting the region, if it is a different region than your workspace or datastores you may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

## Compute instance/cluster or serverless compute with no public IP

> [!WARNING]
> This information is only valid when using an _Azure Virtual Network_. If you are using a _managed virtual network_, see [managed compute with a managed network](how-to-managed-network-compute.md).

> [!IMPORTANT]
> If you have been using compute instances or compute clusters configured for no public IP without opting-in to the preview, you will need to delete and recreate them after January 20, 2023 (when the feature is generally available).
> 
> If you were previously using the preview of no public IP, you may also need to modify what traffic you allow inbound and outbound, as the requirements have changed for general availability:
> * Outbound requirements - Two additional outbound, which are only used for the management of compute instances and clusters. The destination of these service tags are owned by Microsoft:
>     - `AzureMachineLearning` service tag on UDP port 5831.
>     - `BatchNodeManagement` service tag on TCP port 443.

The following configurations are in addition to those listed in the [Prerequisites](#prerequisites) section, and are specific to **creating** a compute instances/clusters configured for no public IP. They also apply to serverless compute:

+ You must use a workspace private endpoint for the compute resource to communicate with Azure Machine Learning services from the VNet. For more information, see [Configure a private endpoint for Azure Machine Learning workspace](how-to-configure-private-link.md).

+ In your VNet, allow **outbound** traffic to the following service tags or fully qualified domain names (FQDN):

    | Service tag | Protocol | Port | Notes |
    | ----- |:-----:|:-----:| ----- |
    | `AzureMachineLearning` | TCP<br>UDP | 443/8787/18881<br>5831 | Communication with the Azure Machine Learning service.|
    | `BatchNodeManagement.<region>` | ANY | 443| Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. Compute instance and compute cluster are implemented using the Azure Batch service.|
    | `Storage.<region>` | TCP | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. This service tag is used to communicate with the Azure Storage account used by Azure Batch. |

    > [!IMPORTANT]
    > The outbound access to `Storage.<region>` could potentially be used to exfiltrate data from your workspace. By using a Service Endpoint Policy, you can mitigate this vulnerability. For more information, see the [Azure Machine Learning data exfiltration prevention](how-to-prevent-data-loss-exfiltration.md) article.

    | FQDN | Protocol | Port | Notes |
    | ---- |:----:|:----:| ---- |
    | `<region>.tundra.azureml.ms` | UDP | 5831 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. |
    | `graph.windows.net` | TCP | 443 | Communication with the Microsoft Graph API.|
    | `*.instances.azureml.ms` | TCP | 443/8787/18881 | Communication with Azure Machine Learning. |
    | `*.<region>.batch.azure.com` | ANY | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. |
    | `*.<region>.service.batch.azure.com` | ANY | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. |
    | `*.blob.core.windows.net` | TCP | 443 | Communication with Azure Blob storage. |
    | `*.queue.core.windows.net` | TCP | 443 | Communication with Azure Queue storage. |
    | `*.table.core.windows.net` | TCP | 443 | Communication with Azure Table storage. |


+ By default, a compute instance/cluster configured for no public IP doesn't have outbound access to the internet. If you *can* access the internet from it, it is because of Azure [default outbound access](../virtual-network/ip-services/default-outbound-access.md) and you have an NSG that allows outbound to the internet. However, we **don't recommend** using the default outbound access. If you need outbound access to the internet, we recommend using either a firewall and outbound rules or a NAT gateway and network service groups to allow outbound traffic instead.

    For more information on the outbound traffic that is used by Azure Machine Learning, see the following articles:
    - [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).
    - [Azure's outbound connectivity methods](../load-balancer/load-balancer-outbound-connections.md#scenarios).

    For more information on service tags that can be used with Azure Firewall, see the [Virtual network service tags](../virtual-network/service-tags-overview.md) article.

Use the following information to create a compute instance or cluster with no public IP address:

# [Azure CLI](#tab/cli)

In the `az ml compute create` command, replace the following values:

* `rg`: The resource group that the compute will be created in.
* `ws`: The Azure Machine Learning workspace name.
* `yourvnet`: The Azure Virtual Network.
* `yoursubnet`: The subnet to use for the compute.
* `AmlCompute` or `ComputeInstance`: Specifying `AmlCompute` creates a *compute cluster*. `ComputeInstance` creates a *compute instance*.

```azurecli
# create a compute cluster with no public IP
az ml compute create --name cpu-cluster --resource-group rg --workspace-name ws --vnet-name yourvnet --subnet yoursubnet --type AmlCompute --set enable_node_public_ip=False

# create a compute instance with no public IP
az ml compute create --name myci --resource-group rg --workspace-name ws --vnet-name yourvnet --subnet yoursubnet --type ComputeInstance --set enable_node_public_ip=False
```

# [Python SDK](#tab/python)

> [!IMPORTANT]
> The following code snippet assumes that `ml_client` points to an Azure Machine Learning workspace that uses a private endpoint to participate in a VNet. For more information on using `ml_client`, see the tutorial [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

```python
from azure.ai.ml.entities import AmlCompute, NetworkSettings

network_settings = NetworkSettings(vnet_name="<vnet-name>", subnet="<subnet-name>")
compute = AmlCompute(
    name=cpu_compute_target,
    size="STANDARD_D2_V2",
    min_instances=0,
    max_instances=4,
    enable_node_public_ip=False,
    network_settings=network_settings
)
ml_client.begin_create_or_update(entity=compute)
```

# [Studio](#tab/azure-studio)

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com), and then select your subscription and workspace.
1. Select the **Compute** page from the left navigation bar.
1. Select the **+ New** from the navigation bar of compute instance or compute cluster.
1. Configure the VM size and configuration you need, then select **Next**.
1. From the **Advanced Settings**, Select **Enable virtual network**, your virtual network and subnet, and finally select the **No Public IP** option under the VNet/subnet section.

    :::image type="content" source="./media/how-to-secure-training-vnet/no-public-ip.png" alt-text="A screenshot of how to configure no public IP for compute instance and compute cluster." lightbox="./media/how-to-secure-training-vnet/no-public-ip.png":::

---

Use the following information to configure **serverless compute** nodes with no public IP address in the VNet for a given workspace:

# [Azure CLI](#tab/cli)

Create a workspace:

```azurecli
az ml workspace create -n <workspace-name> -g <resource-group-name> --file serverlesscomputevnetsettings.yml
```

```yaml
name: testserverlesswithnpip
location: eastus
public_network_access: Disabled
serverless_compute:
  custom_subnet: /subscriptions/<sub id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<vnet name>/subnets/<subnet name>
  no_public_ip: true
```

Update workspace:

```azurecli
az ml workspace update -n <workspace-name> -g <resource-group-name> -file serverlesscomputevnetsettings.yml
```

```yaml
serverless_compute:
  custom_subnet: /subscriptions/<sub id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<vnet name>/subnets/<subnet name>
  no_public_ip: true
```

# [Python SDK](#tab/python)

> [!IMPORTANT]
> The following code snippet assumes that `ml_client` points to an Azure Machine Learning workspace that uses a private endpoint to participate in a VNet. For more information on using `ml_client`, see the tutorial [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import ServerlessComputeSettings, Workspace
from azure.identity import DefaultAzureCredential

subscription_id = <sub id>
resource_group = <resource group>
workspace_name = <workspace name>
ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group
)

workspace = Workspace(
    name=workspace_name,
    serverless_compute=ServerlessComputeSettings(
        custom_subnet=<subnet id>,
        no_public_ip=true,
    )
)

workspace = ml_client.workspaces.begin_create_or_update(workspace)
```

# [Studio](#tab/azure-studio)

Use Azure CLI or Python SDK to configure **serverless compute** nodes with no public IP address in the VNet

---

## <a name="compute-instancecluster-with-public-ip"></a>Compute instance/cluster or serverless compute with public IP

> [!IMPORTANT]
> This information is only valid when using an _Azure Virtual Network_. If you are using a _managed virtual network_, see [managed compute with a managed network](how-to-managed-network-compute.md).

The following configurations are in addition to those listed in the [Prerequisites](#prerequisites) section, and are specific to **creating** compute instances/clusters that have a public IP. They also apply to serverless compute:

+ If you put multiple compute instances/clusters in one virtual network, you may need to request a quota increase for one or more of your resources. The Machine Learning compute instance or cluster automatically allocates networking resources __in the resource group that contains the virtual network__. For each compute instance or cluster, the service allocates the following resources:

    * A network security group (NSG) is automatically created. This NSG allows inbound TCP traffic on port 44224 from the `AzureMachineLearning` service tag.

        > [!IMPORTANT]
        > Compute instance and compute cluster automatically create an NSG with the required rules.
        > 
        > If you have another NSG at the subnet level, the rules in the subnet level NSG mustn't conflict with the rules in the automatically created NSG.
        >
        > To learn how the NSGs filter your network traffic, see [How network security groups filter network traffic](../virtual-network/network-security-group-how-it-works.md).

    * One load balancer

    For compute clusters, these resources are deleted every time the cluster scales down to 0 nodes and created when scaling up.

    For a compute instance, these resources are kept until the instance is deleted. Stopping the instance doesn't remove the resources. 

    > [!IMPORTANT]
    > These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If the virtual network resource group is locked then deletion of compute cluster/instance will fail. Load balancer cannot be deleted until the compute cluster/instance is deleted. Also please ensure there is no Azure Policy assignment which prohibits creation of network security groups.

+ In your VNet, allow **inbound** TCP traffic on port **44224** from the `AzureMachineLearning` service tag.
    > [!IMPORTANT]
    > The compute instance/cluster is dynamically assigned an IP address when it is created. Since the address is not known before creation, and inbound access is required as part of the creation process, you cannot statically assign it on your firewall. Instead, if you are using a firewall with the VNet you must create a user-defined route to allow this inbound traffic.
+ In your VNet, allow **outbound** traffic to the following service tags:

    | Service tag | Protocol | Port | Notes |
    | ----- |:-----:|:-----:| ----- |
    | `AzureMachineLearning` | TCP<br>UDP | 443/8787/18881<br>5831 | Communication with the Azure Machine Learning service.|
    | `BatchNodeManagement.<region>` | ANY | 443| Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. Compute instance and compute cluster are implemented using the Azure Batch service.|
    | `Storage.<region>` | TCP | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. This service tag is used to communicate with the Azure Storage account used by Azure Batch. |

    > [!IMPORTANT]
    > The outbound access to `Storage.<region>` could potentially be used to exfiltrate data from your workspace. By using a Service Endpoint Policy, you can mitigate this vulnerability. For more information, see the [Azure Machine Learning data exfiltration prevention](how-to-prevent-data-loss-exfiltration.md) article.

    | FQDN | Protocol | Port | Notes |
    | ---- |:----:|:----:| ---- |
    | `<region>.tundra.azureml.ms` | UDP | 5831 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. |
    | `graph.windows.net` | TCP | 443 | Communication with the Microsoft Graph API.|
    | `*.instances.azureml.ms` | TCP | 443/8787/18881 | Communication with Azure Machine Learning. |
    | `*.<region>.batch.azure.com` | ANY | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. |
    | `*.<region>.service.batch.azure.com` | ANY | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. |
    | `*.blob.core.windows.net` | TCP | 443 | Communication with Azure Blob storage. |
    | `*.queue.core.windows.net` | TCP | 443 | Communication with Azure Queue storage. |
    | `*.table.core.windows.net` | TCP | 443 | Communication with Azure Table storage. |

Use the following information to create a compute instance or cluster with a public IP address in the VNet:

# [Azure CLI](#tab/cli)

In the `az ml compute create` command, replace the following values:

* `rg`: The resource group that the compute will be created in.
* `ws`: The Azure Machine Learning workspace name.
* `yourvnet`: The Azure Virtual Network.
* `yoursubnet`: The subnet to use for the compute.
* `AmlCompute` or `ComputeInstance`: Specifying `AmlCompute` creates a *compute cluster*. `ComputeInstance` creates a *compute instance*.

```azurecli
# create a compute cluster with a public IP
az ml compute create --name cpu-cluster --resource-group rg --workspace-name ws --vnet-name yourvnet --subnet yoursubnet --type AmlCompute

# create a compute instance with a public IP
az ml compute create --name myci --resource-group rg --workspace-name ws --vnet-name yourvnet --subnet yoursubnet --type ComputeInstance
```

# [Python SDK](#tab/python)

> [!IMPORTANT]
> The following code snippet assumes that `ml_client` points to an Azure Machine Learning workspace that uses a private endpoint to participate in a VNet. For more information on using `ml_client`, see the tutorial [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

```python
from azure.ai.ml.entities import AmlCompute, NetworkSettings

network_settings = NetworkSettings(vnet_name="<vnet-name>", subnet="<subnet-name>")
compute = AmlCompute(
    name=cpu_compute_target,
    size="STANDARD_D2_V2",
    min_instances=0,
    max_instances=4,
    network_settings=network_settings
)
ml_client.begin_create_or_update(entity=compute)
```

# [Studio](#tab/azure-studio)

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com), and then select your subscription and workspace.
1. Select the **Compute** page from the left navigation bar.
1. Select the **+ New** from the navigation bar of compute instance or compute cluster.
1. Configure the VM size and configuration you need, then select **Next**.
1. From the **Advanced Settings**, Select **Enable virtual network** and then select your virtual network and subnet.

    :::image type="content" source="./media/how-to-secure-training-vnet/with-public-ip.png" alt-text="A screenshot of how to configure a compute instance/cluster in a VNet with a public IP." lightbox="./media/how-to-secure-training-vnet/with-public-ip.png":::

---

Use the following information to configure **serverless compute** nodes with a public IP address in the VNet for a given workspace:

# [Azure CLI](#tab/cli)

Create a workspace:

```azurecli
az ml workspace create -n <workspace-name> -g <resource-group-name> --file serverlesscomputevnetsettings.yml
```

```yaml
name: testserverlesswithvnet
location: eastus
serverless_compute:
  custom_subnet: /subscriptions/<sub id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<vnet name>/subnets/<subnet name>
  no_public_ip: false
```

Update workspace:

```azurecli
az ml workspace update -n <workspace-name> -g <resource-group-name> -file serverlesscomputevnetsettings.yml
```

```yaml
serverless_compute:
  custom_subnet: /subscriptions/<sub id>/resourceGroups/<resource group>/providers/Microsoft.Network/virtualNetworks/<vnet name>/subnets/<subnet name>
  no_public_ip: false
```

# [Python SDK](#tab/python)

> [!IMPORTANT]
> The following code snippet assumes that `ml_client` points to an Azure Machine Learning workspace that uses a private endpoint to participate in a VNet. For more information on using `ml_client`, see the tutorial [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import ServerlessComputeSettings, Workspace
from azure.identity import DefaultAzureCredential

subscription_id = <sub id>
resource_group = <resource group>
workspace_name = <workspace name>
ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group
)

workspace = Workspace(
    name=workspace_name,
    serverless_compute=ServerlessComputeSettings(
        custom_subnet=<subnet id>,
        no_public_ip=false,
    )
)

workspace = ml_client.workspaces.begin_create_or_update(workspace)
```

# [Studio](#tab/azure-studio)

Use Azure CLI or Python SDK to to configure **serverless compute** nodes with a public IP address in the VNet.

---

## Azure Databricks

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.
* In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.
* Azure Databricks doesn't use a private endpoint to communicate with the virtual network.

For specific information on using Azure Databricks with a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

## Virtual machine or HDInsight cluster

In this section, you learn how to use a virtual machine or Azure HDInsight cluster in a virtual network with your workspace.

### Create the VM or HDInsight cluster

> [!IMPORTANT]
> Azure Machine Learning supports only virtual machines that are running Ubuntu.

Create a VM or HDInsight cluster by using the Azure portal or the Azure CLI, and put the cluster in an Azure virtual network. For more information, see the following articles:
* [Create and manage Azure virtual networks for Linux VMs](../virtual-machines/linux/tutorial-virtual-network.md)

* [Extend HDInsight using an Azure virtual network](../hdinsight/hdinsight-plan-virtual-network-deployment.md)

### Configure network ports 

Allow Azure Machine Learning to communicate with the SSH port on the VM or cluster, configure a source entry for the network security group. The SSH port is usually port 22. To allow traffic from this source, do the following actions:

1. In the __Source__ drop-down list, select __Service Tag__.

1. In the __Source service tag__ drop-down list, select __AzureMachineLearning__.

    ![Inbound rules for doing experimentation on a VM or HDInsight cluster within a virtual network](./media/how-to-enable-virtual-network/experimentation-virtual-network-inbound.png)

1. In the __Source port ranges__ drop-down list, select __*__.

1. In the __Destination__ drop-down list, select __Any__.

1. In the __Destination port ranges__ drop-down list, select __22__.

1. Under __Protocol__, select __Any__.

1. Under __Action__, select __Allow__.

Keep the default outbound rules for the network security group. For more information, see the default security rules in [Security groups](../virtual-network/network-security-groups-overview.md#default-security-rules).

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, see the [required public internet access](#required-public-internet-access-to-train-models) section.

### Attach the VM or HDInsight cluster

Attach the VM or HDInsight cluster to your Azure Machine Learning workspace. For more information, see [Manage compute resources for model training and deployment in studio](how-to-create-attach-compute-studio.md).

## Required public internet access to train models

> [!IMPORTANT]
> While previous sections of this article describe configurations required to **create** compute resources, the configuration information in this section is required to **use** these resources to train models.

[!INCLUDE [machine-learning-required-public-internet-access](includes/machine-learning-public-internet-access.md)]

For information on using a firewall solution, see [Use a firewall with Azure Machine Learning](how-to-access-azureml-behind-firewall.md).
## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)
