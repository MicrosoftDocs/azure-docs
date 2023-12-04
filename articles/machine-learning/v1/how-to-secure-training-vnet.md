---
title: Secure training environments with virtual networks (v1)
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning training environment. SDK v1
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/29/2022
ms.custom: UpdateFrequency5, contperf-fy20q4, tracking-python, contperf-fy21q1, references_regions, event-tier1-build-2022, build-2023
---

# Secure an Azure Machine Learning training environment with virtual networks (SDKv1)

[!INCLUDE [SDK v1](../includes/machine-learning-sdk-v1.md)]


In this article, you learn how to secure training environments with a virtual network in Azure Machine Learning using the Python SDK v1.

Azure Machine Learning compute instance and compute cluster can be used to securely train models in a virtual network. When planning your environment, you can configure the compute instance/cluster with or without a public IP address. The general differences between the two are:

* **No public IP**: Reduces costs as it doesn't have the same networking resource requirements. Improves security by removing the requirement for inbound traffic from the internet. However, there are additional configuration changes required to enable outbound access to required resources (Microsoft Entra ID, Azure Resource Manager, etc.).
* **Public IP**: Works by default, but costs more due to additional Azure networking resources. Requires inbound communication from the Azure Machine Learning service over the public internet.

The following table contains the differences between these configurations:

| Configuration | With public IP | Without public IP |
| ----- | ----- | ----- |
| Inbound traffic | `AzureMachineLearning` service tag. | None |
| Outbound traffic | By default, can access the public internet with no restrictions.<br>You can restrict what it accesses using a Network Security Group or firewall. | By default, it can't access the internet. If it can still send outbound traffic to internet, it is because of Azure [default outbound access](../../virtual-network/ip-services/default-outbound-access.md) and you have an NSG that allows outbound to the internet. We **don't recommend** using the default outbound access.<br>If you need outbound access to the internet, we recommend using a Virtual Network NAT gateway or Firewall instead if you need to route outbound traffic to required resources on the internet. |
| Azure networking resources | Public IP address, load balancer, network interface | None |

You can also use Azure Databricks or HDInsight to train models in a virtual network.

[!INCLUDE [managed-vnet-note](../includes/managed-vnet-note.md)]

> [!NOTE]
> For information on using the Azure Machine Learning __studio__ and the Python SDK __v2__, see [Secure training environment (v2)](../how-to-secure-training-vnet.md).
>
> For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace in Azure portal](../tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](../tutorial-create-secure-workspace-template.md).

In this article you learn how to secure the following training compute resources in a virtual network:
> [!div class="checklist"]
> - Azure Machine Learning compute cluster
> - Azure Machine Learning compute instance
> - Azure Databricks
> - Virtual Machine
> - HDInsight cluster

> [!IMPORTANT]
> Items in this article marked as "preview" are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
## Prerequisites

+ Read the [Network security overview](../how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources. This VNet must be in the same subscription as your Azure Machine Learning workspace.

    - We recommend putting the storage accounts used by your workspace and training jobs in the same Azure region that you plan to use for your compute instances and clusters. If they aren't in the same Azure region, you may incur data transfer costs and increased network latency.
    - Make sure that **WebSocket** communication is allowed to `*.instances.azureml.net` and `*.instances.azureml.ms` in your VNet. WebSockets are used by Jupyter on compute instances.

+ An existing subnet in the virtual network. This subnet is used when creating compute instances and clusters.

    - Make sure that the subnet isn't delegated to other Azure services.
    - Make sure that the subnet contains enough free IP addresses. Each compute instance requires one IP address. Each *node* within a compute cluster requires one IP address.

+ If you have your own DNS server, we recommend using DNS forwarding to resolve the fully qualified domain names (FQDN) of compute instances and clusters. For more information, see [Use a custom DNS with Azure Machine Learning](../how-to-custom-dns.md).

[!INCLUDE [network-rbac](../includes/network-rbac.md)]

## Limitations

### Azure Machine Learning compute cluster/instance

* __Compute clusters__ can be created in a different region and VNet than your workspace. However, this functionality is only available using the SDK v2, CLI v2, or studio. For more information, see the [v2 version of secure training environments](../how-to-secure-training-vnet.md?view=azureml-api-2&preserve-view=true#compute-cluster-in-a-different-vnetregion-from-workspace).

* Compute cluster/instance deployment in virtual network isn't supported with Azure Lighthouse.

* __Port 445__ must be open for _private_ network communications between your compute instances and the default storage account during training. For example, if your computes are in one VNet and the storage account is in another, don't block port 445 to the storage account VNet.

### Azure Databricks

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.
* In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.
* Azure Databricks doesn't use a private endpoint to communicate with the virtual network.

For more information on using Azure Databricks in a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

### Azure HDInsight or virtual machine

* Azure Machine Learning supports only virtual machines that are running Ubuntu.


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
    > The outbound access to `Storage.<region>` could potentially be used to exfiltrate data from your workspace. By using a Service Endpoint Policy, you can mitigate this vulnerability. For more information, see the [Azure Machine Learning data exfiltration prevention](../how-to-prevent-data-loss-exfiltration.md) article.

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


+ Create either a firewall and outbound rules or a NAT gateway and network service groups to allow outbound traffic. Since the compute has no public IP address, it can't communicate with resources on the public internet without this configuration. For example, it wouldn't be able to communicate with Microsoft Entra ID or Azure Resource Manager. Installing Python packages from public sources would also require this configuration. 

    For more information on the outbound traffic that is used by Azure Machine Learning, see the following articles:
    - [Configure inbound and outbound network traffic](../how-to-access-azureml-behind-firewall.md).
    - [Azure's outbound connectivity methods](../../load-balancer/load-balancer-outbound-connections.md#scenarios).

Use the following information to create a compute instance or cluster with no public IP address:

To create a compute instance or compute cluster with no public IP, use the Azure Machine Learning studio UI to create the resource:

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com), and then select your subscription and workspace.
1. Select the **Compute** page from the left navigation bar.
1. Select the **+ New** from the navigation bar of compute instance or compute cluster.
1. Configure the VM size and configuration you need, then select **Next**.
1. From the **Advanced Settings**, Select **Enable virtual network**, your virtual network and subnet, and finally select the **No Public IP** option under the VNet/subnet section.

    :::image type="content" source="../media/how-to-secure-training-vnet/no-public-ip.png" alt-text="A screenshot of how to configure no public IP for compute instance and compute cluster." lightbox="../media/how-to-secure-training-vnet/no-public-ip.png":::

> [!TIP]
> You can also use the Azure Machine Learning SDK v2 or Azure CLI extension for ML v2. For information on creating a compute instance or cluster with no public IP, see the v2 version of [Secure an Azure Machine Learning training environment](../how-to-secure-training-vnet.md) article.


## Compute instance/cluster with public IP

The following configurations are in addition to those listed in the [Prerequisites](#prerequisites) section, and are specific to **creating** compute instances/clusters that have a public IP:

+ If you put multiple compute instances/clusters in one virtual network, you may need to request a quota increase for one or more of your resources. The Machine Learning compute instance or cluster automatically allocates networking resources __in the resource group that contains the virtual network__. For each compute instance or cluster, the service allocates the following resources:

    * A network security group (NSG) is automatically created. This NSG allows inbound TCP traffic on port 44224 from the `AzureMachineLearning` service tag.

        > [!IMPORTANT]
        > Compute instance and compute cluster automatically create an NSG with the required rules.
        > 
        > If you have another NSG at the subnet level, the rules in the subnet level NSG mustn't conflict with the rules in the automatically created NSG.
        >
        > To learn how the NSGs filter your network traffic, see [How network security groups filter network traffic](../../virtual-network/network-security-group-how-it-works.md).

    * One load balancer

    For compute clusters, these resources are deleted every time the cluster scales down to 0 nodes and created when scaling up.

    For a compute instance, these resources are kept until the instance is deleted. Stopping the instance doesn't remove the resources. 

    > [!IMPORTANT]
    > These resources are limited by the subscription's [resource quotas](../../azure-resource-manager/management/azure-subscription-service-limits.md). If the virtual network resource group is locked then deletion of compute cluster/instance will fail. Load balancer cannot be deleted until the compute cluster/instance is deleted. Also please ensure there is no Azure Policy assignment which prohibits creation of network security groups.

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
    > The outbound access to `Storage.<region>` could potentially be used to exfiltrate data from your workspace. By using a Service Endpoint Policy, you can mitigate this vulnerability. For more information, see the [Azure Machine Learning data exfiltration prevention](../how-to-prevent-data-loss-exfiltration.md) article.

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

# [Compute instance](#tab/instance)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
import datetime
import time

from azureml.core.compute import ComputeTarget, ComputeInstance
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your instance
# Compute instance name should be unique across the azure region
compute_name = "ci{}".format(ws._workspace_id)[:10]

# Verify that instance does not exist already
try:
    instance = ComputeInstance(workspace=ws, name=compute_name)
    print('Found existing instance, use it.')
except ComputeTargetException:
    compute_config = ComputeInstance.provisioning_configuration(
        vm_size='STANDARD_D3_V2',
        ssh_public_access=False,
        vnet_resourcegroup_name='vnet_resourcegroup_name',
        vnet_name='vnet_name',
        subnet_name='subnet_name',
        # admin_user_ssh_public_key='<my-sshkey>'
    )
    instance = ComputeInstance.create(ws, compute_name, compute_config)
    instance.wait_for_completion(show_output=True)
```

# [Compute cluster](#tab/cluster)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# The Azure virtual network name, subnet, and resource group
vnet_name = 'mynetwork'
subnet_name = 'default'
vnet_resourcegroup_name = 'mygroup'

# Choose a name for your CPU cluster
cpu_cluster_name = "cpucluster"

# Verify that cluster does not exist already
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print("Found existing cpucluster")
except ComputeTargetException:
    print("Creating new cpucluster")

    # Specify the configuration for the new cluster
    compute_config = AmlCompute.provisioning_configuration(vm_size="STANDARD_D2_V2",
                                                           min_nodes=0,
                                                           max_nodes=4,
                                                           location="westus2",
                                                           vnet_resourcegroup_name=vnet_resourcegroup_name,
                                                           vnet_name=vnet_name,
                                                           subnet_name=subnet_name)

    # Create the cluster with the specified name and configuration
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

    # Wait for the cluster to be completed, show the output log
    cpu_cluster.wait_for_completion(show_output=True)
```
---

When the creation process finishes, you train your model. For more information, see [Select and use a compute target for training](how-to-set-up-training-targets.md).

[!INCLUDE [low-pri-note](../includes/machine-learning-low-pri-vm.md)]

## Azure Databricks

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.
* In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.
* Azure Databricks doesn't use a private endpoint to communicate with the virtual network.

For specific information on using Azure Databricks with a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

## Required public internet access to train models

> [!IMPORTANT]
> While previous sections of this article describe configurations required to **create** compute resources, the configuration information in this section is required to **use** these resources to train models.

[!INCLUDE [machine-learning-required-public-internet-access](../includes/machine-learning-public-internet-access.md)]

For information on using a firewall solution, see [Use a firewall with Azure Machine Learning](../how-to-access-azureml-behind-firewall.md).

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview (v1)](../how-to-network-security-overview.md)
* [Secure the workspace resources](../how-to-secure-workspace-vnet.md)
* [Secure inference environment (v1)](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](../how-to-enable-studio-virtual-network.md)
* [Use custom DNS](../how-to-custom-dns.md)
* [Use a firewall](../how-to-access-azureml-behind-firewall.md)
