---
title: Create and attach Azure Kubernetes Service
titleSuffix: Azure Machine Learning
description: 'Learn how to create a new Azure Kubernetes Service cluster through Azure Machine Learning, or how to attach an existing AKS cluster to your workspace.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to, devx-track-azurecli
ms.author: jordane
author: jpe316
ms.reviewer: larryfr
ms.date: 10/02/2020
---

# Create and attach an Azure Kubernetes Service cluster

Azure Machine Learning can deploy trained machine learning models to Azure Kubernetes Service. However, you must first either __create__ an Azure Kubernetes Service (AKS) cluster from your Azure ML workspace, or __attach__ an existing AKS cluster. This article provides information on both creating and attaching a cluster.

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py&preserve-view=true), or the [Azure Machine Learning Visual Studio Code extension](tutorial-setup-vscode-extension.md).

- If you plan on using an Azure Virtual Network to secure communication between your Azure ML workspace and the AKS cluster, read the [Network isolation during training & inference](how-to-enable-virtual-network.md) article.

## Limitations

- If you need a **Standard Load Balancer(SLB)** deployed in your cluster instead of a Basic Load Balancer(BLB), create a cluster in the AKS portal/CLI/SDK and then **attach** it to the AML workspace.

- If you have an Azure Policy that restricts the creation of Public IP addresses, then AKS cluster creation will fail. AKS requires a Public IP for [egress traffic](/azure/aks/limit-egress-traffic). The egress traffic article also provides guidance to lock down egress traffic from the cluster through the Public IP, except for a few fully qualified domain names. There are 2 ways to enable a Public IP:
    - The cluster can use the Public IP created by default with the BLB or SLB, Or
    - The cluster can be created without a Public IP and then a Public IP is configured with a firewall with a user defined route. For more information, see [Customize cluster egress with a user-defined-route](/azure/aks/egress-outboundtype).
    
    The AML control plane does not talk to this Public IP. It talks to the AKS control plane for deployments. 

- If you **attach** an AKS cluster, which has an [Authorized IP range enabled to access the API server](/azure/aks/api-server-authorized-ip-ranges), enable the AML control plane IP ranges for the AKS cluster. The AML control plane is deployed across paired regions and deploys inference pods on the AKS cluster. Without access to the API server, the inference pods cannot be deployed. Use the [IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=56519) for both the [paired regions](/azure/best-practices-availability-paired-regions) when enabling the IP ranges in an AKS cluster.

    Authorized IP ranges only works with Standard Load Balancer.

- If you want to use a private AKS cluster (using Azure Private Link), you must create the cluster first, and then **attach** it to the workspace. For more information, see [Create a private Azure Kubernetes Service cluster](/azure/aks/private-clusters).

- The compute name for the AKS cluster MUST be unique within your Azure ML workspace.
    - Name is required and must be between 3 to 24 characters long.
    - Valid characters are upper and lower case letters, digits, and the - character.
    - Name must start with a letter.
    - Name needs to be unique across all existing computes within an Azure region. You will see an alert if the name you choose is not unique.
   
 - If you want to deploy models to **GPU** nodes or **FPGA** nodes (or any specific SKU), then you must create a cluster with the specific SKU. There is no support for creating a secondary node pool in an existing cluster and deploying models in the secondary node pool.
 
- When creating or attaching a cluster, you can select whether to create the cluster for __dev-test__ or __production__. If you want to create an AKS cluster for __development__, __validation__, and __testing__ instead of production, set the __cluster purpose__ to __dev-test__. If you do not specify the cluster purpose, a __production__ cluster is created. 

    > [!IMPORTANT]
    > A __dev-test__ cluster is not suitable for production level traffic and may increase inference times. Dev/test clusters also do not guarantee fault tolerance.

- When creating or attaching a cluster, if the cluster will be used for __production__, then it must contain at least 12 __virtual CPUs__. The number of virtual CPUs can be calculated by multiplying the __number of nodes__ in the cluster by the __number of cores__ provided by the VM size selected. For example, if you use a VM size of "Standard_D3_v2", which has 4 virtual cores, then you should select 3 or greater as the number of nodes.

    For a __dev-test__ cluster, we recommand at least 2 virtual CPUs.

- The Azure Machine Learning SDK does not provide support scaling an AKS cluster. To scale the nodes in the cluster, use the UI for your AKS cluster in the Azure Machine Learning studio. You can only change the node count, not the VM size of the cluster. For more information on scaling the nodes in an AKS cluster, see the following articles:

    - [Manually scale the node count in an AKS cluster](../aks/scale-cluster.md)
    - [Set up cluster autoscaler in AKS](../aks/cluster-autoscaler.md)

## Azure Kubernetes Service version

Azure Kubernetes Service allows you to create a cluster using a variety of Kubernetes versions. For more information on available versions, see [supported Kubernetes versions in Azure Kubernetes Service](/azure/aks/supported-kubernetes-versions).

When **creating** an Azure Kubernetes Service cluster using one of the following methods, you *do not have a choice in the version* of the cluster that is created:

* Azure Machine Learning studio, or the Azure Machine Learning section of the Azure portal.
* Machine Learning extension for Azure CLI.
* Azure Machine Learning SDK.

These methods of creating an AKS cluster use the __default__ version of the cluster. *The default version changes over time* as new Kubernetes versions become available.

When **attaching** an existing AKS cluster, we support all currently supported AKS versions.

> [!NOTE]
> There may be edge cases where you have an older cluster that is no longer supported. In this case, the attach operation will return an error and list the currently supported versions.
>
> You can attach **preview** versions. Preview functionality is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. Support for using preview versions may be limited. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Available and default versions

To find the available and default AKS versions, use the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true) command [az aks get-versions](/cli/azure/aks?view=azure-cli-latest&preserve-view=true#az_aks_get_versions). For example, the following command returns the versions available in the West US region:

```azurecli-interactive
az aks get-versions -l westus -o table
```

The output of this command is similar to the following text:

```text
KubernetesVersion    Upgrades
-------------------  ----------------------------------------
1.18.6(preview)      None available
1.18.4(preview)      1.18.6(preview)
1.17.9               1.18.4(preview), 1.18.6(preview)
1.17.7               1.17.9, 1.18.4(preview), 1.18.6(preview)
1.16.13              1.17.7, 1.17.9
1.16.10              1.16.13, 1.17.7, 1.17.9
1.15.12              1.16.10, 1.16.13
1.15.11              1.15.12, 1.16.10, 1.16.13
```

To find the default version that is used when **creating** a cluster through Azure Machine Learning, you can use the `--query` parameter to select the default version:

```azurecli-interactive
az aks get-versions -l westus --query "orchestrators[?default == `true`].orchestratorVersion" -o table
```

The output of this command is similar to the following text:

```text
Result
--------
1.16.13
```

If you'd like to **programmatically check the available versions**, use the [Container Service Client - List Orchestrators](https://docs.microsoft.com/rest/api/container-service/container%20service%20client/listorchestrators) REST API. To find the available versions, look at the entries where `orchestratorType` is `Kubernetes`. The associated `orchestrationVersion` entries contain the available versions that can be **attached** to your workspace.

To find the default version that is used when **creating** a cluster through Azure Machine Learning, find the entry where `orchestratorType` is `Kubernetes` and `default` is `true`. The associated `orchestratorVersion` value is the default version. The following JSON snippet shows an example entry:

```json
...
 {
        "orchestratorType": "Kubernetes",
        "orchestratorVersion": "1.16.13",
        "default": true,
        "upgrades": [
          {
            "orchestratorType": "",
            "orchestratorVersion": "1.17.7",
            "isPreview": false
          }
        ]
      },
...
```

## Create a new AKS cluster

**Time estimate**: Approximately 10 minutes.

Creating or attaching an AKS cluster is a one time process for your workspace. You can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, you must create a new cluster the next time you need to deploy. You can have multiple AKS clusters attached to your workspace.

The following example demonstrates how to create a new AKS cluster using the SDK and CLI:

# [Python](#tab/python)

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (you can also provide parameters to customize this).
# For example, to create a dev/test cluster, use:
# prov_config = AksCompute.provisioning_configuration(cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST)
prov_config = AksCompute.provisioning_configuration()

# Example configuration to use an existing virtual network
# prov_config.vnet_name = "mynetwork"
# prov_config.vnet_resourcegroup_name = "mygroup"
# prov_config.subnet_name = "default"
# prov_config.service_cidr = "10.0.0.0/16"
# prov_config.dns_service_ip = "10.0.0.10"
# prov_config.docker_bridge_cidr = "172.17.0.1/16"

aks_name = 'myaks'
# Create the cluster
aks_target = ComputeTarget.create(workspace = ws,
                                    name = aks_name,
                                    provisioning_configuration = prov_config)

# Wait for the create process to complete
aks_target.wait_for_completion(show_output = True)
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AksCompute.ClusterPurpose](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute.clusterpurpose?view=azure-ml-py&preserve-view=true)
* [AksCompute.provisioning_configuration](/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py&preserve-view=true#attach-configuration-resource-group-none--cluster-name-none--resource-id-none--cluster-purpose-none-)
* [ComputeTarget.create](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py&preserve-view=true#create-workspace--name--provisioning-configuration-)
* [ComputeTarget.wait_for_completion](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py&preserve-view=true#wait-for-completion-show-output-false-)

# [Azure CLI](#tab/azure-cli)

```azurecli
az ml computetarget create aks -n myaks
```

For more information, see the [az ml computetarget create aks](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/create?view=azure-cli-latest&preserve-view=true#ext-azure-cli-ml-az-ml-computetarget-create-aks) reference.

# [Portal](#tab/azure-portal)

For information on creating an AKS cluster in the portal, see [Create compute targets in Azure Machine Learning studio](how-to-create-attach-compute-studio.md#inference-clusters).

---

## Attach an existing AKS cluster

**Time estimate:** Approximately 5 minutes.

If you already have AKS cluster in your Azure subscription, and it is version 1.17 or lower, you can use it to deploy your image.

> [!TIP]
> The existing AKS cluster can be in a Azure region other than your Azure Machine Learning workspace.


> [!WARNING]
> Do not create multiple, simultaneous attachments to the same AKS cluster from your workspace. For example, attaching one AKS cluster to a workspace using two different names. Each new attachment will break the previous existing attachment(s).
>
> If you want to re-attach an AKS cluster, for example to change TLS or other cluster configuration setting, you must first remove the existing attachment by using [AksCompute.detach()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py&preserve-view=true#detach--).

For more information on creating an AKS cluster using the Azure CLI or portal, see the following articles:

* [Create an AKS cluster (CLI)](https://docs.microsoft.com/cli/azure/aks?toc=%2Fazure%2Faks%2FTOC.json&bc=%2Fazure%2Fbread%2Ftoc.json&view=azure-cli-latest&preserve-view=true#az-aks-create)
* [Create an AKS cluster (portal)](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal?view=azure-cli-latest&preserve-view=true)
* [Create an AKS cluster (ARM Template on Azure Quickstart templates)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-aks-azml-targetcompute)

The following example demonstrates how to attach an existing AKS cluster to your workspace:

# [Python](#tab/python)

```python
from azureml.core.compute import AksCompute, ComputeTarget
# Set the resource group that contains the AKS cluster and the cluster name
resource_group = 'myresourcegroup'
cluster_name = 'myexistingcluster'

# Attach the cluster to your workgroup. If the cluster has less than 12 virtual CPUs, use the following instead:
# attach_config = AksCompute.attach_configuration(resource_group = resource_group,
#                                         cluster_name = cluster_name,
#                                         cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST)
attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                         cluster_name = cluster_name)
aks_target = ComputeTarget.attach(ws, 'myaks', attach_config)

# Wait for the attach process to complete
aks_target.wait_for_completion(show_output = True)
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AksCompute.attach_configuration()](/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py&preserve-view=true#attach-configuration-resource-group-none--cluster-name-none--resource-id-none--cluster-purpose-none-)
* [AksCompute.ClusterPurpose](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute.clusterpurpose?view=azure-ml-py&preserve-view=true)
* [AksCompute.attach](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py&preserve-view=true#attach-workspace--name--attach-configuration-)

# [Azure CLI](#tab/azure-cli)

To attach an existing cluster using the CLI, you need to get the resource ID of the existing cluster. To get this value, use the following command. Replace `myexistingcluster` with the name of your AKS cluster. Replace `myresourcegroup` with the resource group that contains the cluster:

```azurecli
az aks show -n myexistingcluster -g myresourcegroup --query id
```

This command returns a value similar to the following text:

```text
/subscriptions/{GUID}/resourcegroups/{myresourcegroup}/providers/Microsoft.ContainerService/managedClusters/{myexistingcluster}
```

To attach the existing cluster to your workspace, use the following command. Replace `aksresourceid` with the value returned by the previous command. Replace `myresourcegroup` with the resource group that contains your workspace. Replace `myworkspace` with your workspace name.

```azurecli
az ml computetarget attach aks -n myaks -i aksresourceid -g myresourcegroup -w myworkspace
```

For more information, see the [az ml computetarget attach aks](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/attach?view=azure-cli-latest&preserve-view=true#ext-azure-cli-ml-az-ml-computetarget-attach-aks) reference.

# [Portal](#tab/azure-portal)

For information on attaching an AKS cluster in the portal, see [Create compute targets in Azure Machine Learning studio](how-to-create-attach-compute-studio.md#inference-clusters).

---

## Detach an AKS cluster

To detach a cluster from your workspace, use one of the following methods:

> [!WARNING]
> Using the Azure Machine Learning studio, SDK, or the Azure CLI extension for machine learning to detach an AKS cluster **does not delete the AKS cluster**. To delete the cluster, see [Use the Azure CLI with AKS](/azure/aks/kubernetes-walkthrough#delete-the-cluster).

# [Python](#tab/python)

```python
aks_target.detach()
```

# [Azure CLI](#tab/azure-cli)

To detach the existing cluster to your workspace, use the following command. Replace `myaks` with the name that the AKS cluster is attached to your workspace as. Replace `myresourcegroup` with the resource group that contains your workspace. Replace `myworkspace` with your workspace name.

```azurecli
az ml computetarget detach -n myaks -g myresourcegroup -w myworkspace
```

# [Portal](#tab/azure-portal)

In Azure Machine Learning studio, select __Compute__, __Inference clusters__, and the cluster you wish to remove. Use the __Detach__ link to detach the cluster.

## Next steps

* [How and where to deploy a model](how-to-deploy-and-where.md)
* [Deploy a model to an Azure Kubernetes Service cluster](how-to-deploy-azure-kubernetes-service.md)
