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
ms.custom: contperf-fy20q4, tracking-python, contperf-fy21q1, references_regions, devx-track-azurecli, sdkv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Secure an Azure Machine Learning training environment with virtual networks

[!INCLUDE [SDK v2](../../includes/machine-learning-sdk-v2.md)]

> [!div class="op_single_selector" title1="Select the Azure Machine Learning SDK version you are using:"]
> * [SDK v1](./v1/how-to-secure-training-vnet.md?view=azureml-api-1&preserve-view=true)
> * [SDK v2 (current version)](how-to-secure-training-vnet.md)

Azure Machine Learning compute instance and compute cluster can be used to securely train models in a virtual network. When planning your environment, you can configure the compute instance/cluster with or without a public IP address. The general differences between the two are:

* **No public IP**: Reduces costs as it doesn't have the same networking resource requirements. Improves security by removing the requirement for inbound traffic from the internet. However, there are additional configuration changes required to enable outbound access to required resources (Azure Active Directory, Azure Resource Manager, etc.).
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

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](how-to-network-security-overview.md)
> * [Secure the workspace resources](how-to-secure-workspace-vnet.md)
> * [Secure the inference environment](how-to-secure-inferencing-vnet.md)
> * [Enable studio functionality](how-to-enable-studio-virtual-network.md)
> * [Use custom DNS](how-to-custom-dns.md)
> * [Use a firewall](how-to-access-azureml-behind-firewall.md)
>
> For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace](tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](tutorial-create-secure-workspace-template.md).

In this article you learn how to secure the following training compute resources in a virtual network:
> [!div class="checklist"]
> - Azure Machine Learning compute cluster
> - Azure Machine Learning compute instance
> - Azure Databricks
> - Virtual Machine
> - HDInsight cluster

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources. This VNet must be in the same subscription as your Azure Machine Learning workspace.

    - We recommend putting the storage accounts used by your workspace and training jobs in the same Azure region that you plan to use for your compute instances and clusters. If they aren't in the same Azure region, you may incur data transfer costs and increased network latency.
    - Make sure that **WebSocket** communication is allowed to `*.instances.azureml.net` and `*.instances.azureml.ms` in your VNet. WebSockets are used by Jupyter on compute instances.

+ An existing subnet in the virtual network. This subnet is used when creating compute instances and clusters.

    - Make sure that the subnet isn't delegated to other Azure services.
    - Make sure that the subnet contains enough free IP addresses. Each compute instance requires one IP address. Each *node* within a compute cluster requires one IP address.

+ If you have your own DNS server, we recommend using DNS forwarding to resolve the fully qualified domain names (FQDN) of compute instances and clusters. For more information, see [Use a custom DNS with Azure Machine Learning](how-to-custom-dns.md).

+ To deploy resources into a virtual network or subnet, your user account must have permissions to the following actions in Azure role-based access control (Azure RBAC):

    - "Microsoft.Network/virtualNetworks/*/read" on the virtual network resource. This permission isn't needed for Azure Resource Manager (ARM) template deployments.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on Azure RBAC with networking, see the [Networking built-in roles](../role-based-access-control/built-in-roles.md#networking)

## Limitations

* __Compute clusters__ can be created in a different region than your workspace. This functionality is in __preview__, and is only available for __compute clusters__, not compute instances. When using a different region for the cluster, the following limitations apply:

    * If your workspace associated resources, such as storage, are in a different virtual network than the cluster, set up global virtual network peering between the networks. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).
    * You may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

    Guidance such as using NSG rules, user-defined routes, and input/output requirements, apply as normal when using a different region than the workspace.

    > [!WARNING]
    > If you are using a __private endpoint-enabled workspace__, creating the cluster in a different region is __not supported__.

* Compute cluster/instance deployment in virtual network isn't supported with Azure Lighthouse.

## Compute instance/cluster with no public IP

> [!IMPORTANT]
> If you have been using compute instances or compute clusters configured for no public IP without opting-in to the preview, you will need to delete and recreate them after January 20, 2023 (when the feature is generally available).
> 
> If you were previously using the preview of no public IP, you may also need to modify what traffic you allow inbound and outbound, as the requirements have changed for general availability:
> * Outbound requirements - Two additional outbound, which are only used for the management of compute instances and clusters. The destination of these service tags are owned by Microsoft:
>     - `AzureMachineLearning` service tag on UDP port 5831.
>     - `BatchNodeManagement` service tag on TCP port 443.

The following configurations are in addition to those listed in the [Prerequisites](#prerequisites) section, and are specific to **creating** a compute instances/clusters configured for no public IP:

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
    | `*.<region>.service.batch.com` | ANY | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. |
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

# [Python](#tab/python)

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

## Compute instance/cluster with public IP

The following configurations are in addition to those listed in the [Prerequisites](#prerequisites) section, and are specific to **creating** compute instances/clusters that have a public IP:

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
    | `*.<region>.service.batch.com` | ANY | 443 | Replace `<region>` with the Azure region that contains your Azure Machine Learning workspace. Communication with Azure Batch. |
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

# [Python](#tab/python)

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

[!INCLUDE [machine-learning-required-public-internet-access](../../includes/machine-learning-public-internet-access.md)]

For information on using a firewall solution, see [Use a firewall with Azure Machine Learning](how-to-access-azureml-behind-firewall.md).
## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)