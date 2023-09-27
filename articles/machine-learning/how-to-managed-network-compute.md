---
title: Managed computes in managed virtual network isolation
titleSuffix: Azure Machine Learning
description: Use managed compute resources with managed virtual network isolation with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/22/2023
ms.topic: how-to
---

# Use managed compute in a managed virtual network

Learn how to configure compute clusters or compute instances in an Azure Machine Learning managed virtual network.

When using a managed network, compute resources managed by Azure Machine Learning can participate in the virtual network. Azure Machine Learning _compute clusters_, _compute instances_, and _managed online endpoints_ are created in the managed network.

This article focuses on configuring compute clusters and compute instances in a managed network. For information on managed online endpoints, see [secure online endpoints with network isolation](how-to-secure-online-endpoint.md).

> [!IMPORTANT]
> If you plan on using serverless _Spark_ jobs, see the [managed virtual network](how-to-managed-network.md) article for configuration information. These steps must be followed when configuring the managed virtual network.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

# [Azure CLI](#tab/azure-cli)

* An Azure Machine Learning workspace configured to use a [managed virtual network](how-to-managed-network.md).

* The [Azure CLI](/cli/azure/) and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

    >[!TIP]
    > Azure Machine Learning managed virtual network was introduced on May 23rd, 2023. If you have an older version of the ml extension, you may need to update it for the examples in this article work. To update the extension, use the following Azure CLI command:
    >
    > ```azurecli
    > az extension update -n ml
    > ```

* The CLI examples in this article assume that you're using the Bash (or compatible) shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about).

* The Azure CLI examples in this article use `ws` to represent the name of the workspace, and `rg` to represent the name of the resource group. Change these values as needed when using the commands with your Azure subscription.

# [Python SDK](#tab/python)

* An Azure Machine Learning workspace configured to use a [managed virtual network](how-to-managed-network.md).

* The Azure Machine Learning Python SDK v2. For more information on the SDK, see [Install the Python SDK v2 for Azure Machine Learning](/python/api/overview/azure/ai-ml-readme).

    > [!TIP]
    > Azure Machine learning managed virtual network was introduced on May 23rd, 2023. If you have an older version of the SDK installed, you may need to update it for the examples in this article to work. To update the SDK, use the following command:
    >
    > ```bash
    > pip install --upgrade azure-ai-ml azure-identity
    > ```

* The examples in this article assume that your code begins with the following Python. This code imports the classes required when creating a workspace with managed VNet, sets variables for your Azure subscription and resource group, and creates the `ml_client`:

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import (
        Workspace,
        ManagedNetwork,
        IsolationMode,
        ServiceTagDestination,
        PrivateEndpointDestination,
        FqdnDestination
    )
    from azure.identity import DefaultAzureCredential

    # Replace with the values for your Azure subscription and resource group.
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"

    # get a handle to the subscription
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)
    ```

# [Studio](#tab/studio)

* An Azure Machine Learning workspace configured to use a [managed virtual network](how-to-managed-network.md).

---

## Configure compute resources

Use the tabs below to learn how to configure compute clusters and compute instances in a managed virtual network:

> [!TIP]
> When using a managed virtual network, compute clusters and compute instances are automatically created in the managed network. The steps below focus on configuring the compute resources to not use a public IP address.

# [Azure CLI](#tab/azure-cli)

To create a __compute cluster__ with no public IP, use the following command:

```azurecli
az ml compute create --name cpu-cluster --resource-group rg --workspace-name ws --type AmlCompute --set enable_node_public_ip=False
```

To create a __compute instance__ with no public IP, use the following command:

```azurecli
az ml compute create --name myci --resource-group rg --workspace-name ws --type ComputeInstance --set enable_node_public_ip=False
```

# [Python SDK](#tab/python)

The following Python SDK example shows how to create a compute cluster and compute instance with no public IP:

```python
from azure.ai.ml.entities import AmlCompute

# Create a compute cluster
compute_cluster = AmlCompute(
    name="mycomputecluster,
    size="STANDARD_D2_V2",
    min_instances=0,
    max_instances=4,
    enable_node_public_ip=False
)
ml_client.begin_create_or_update(entity=compute_cluster)

# Create a compute instance
from azure.ai.ml.entities import ComputeInstance

compute_instance = ComputeInstance(
    name="mycomputeinstance",
    size="STANDARD_DS3_V2",
    enable_node_public_ip=False
)
ml_client.begin_create_or_update(compute_instance)
```

# [Studio](#tab/studio)

You can't create a compute cluster or compute instance from the Azure portal. Instead, use the following steps to create these computes from Azure Machine Learning [studio](https://ml.azure.com):

1. From [studio](https://ml.azure.com), select your workspace.
1. Select the __Compute__ page from the left navigation bar.
1. Select the __+ New__ from the navigation bar of _compute instance_ or _compute cluster_.
1. Configure the VM size and configuration you need, then select __Next__ until you arrive at the following pages:

    * For a __compute cluster__, use the __Advanced Settings__ page and select the __No Public IP__ option to remove the public IP address.

        :::image type="content" source="./media/how-to-managed-network-compute/compute-cluster-no-public-ip.png" alt-text="A screenshot of how to configure no public IP for compute cluster." lightbox="./media/how-to-managed-network-compute/compute-cluster-no-public-ip.png":::

    * For a __compute instance__, use the __Security__ page and select the __No Public IP__ option to remove the public IP address.

        :::image type="content" source="./media/how-to-managed-network-compute/compute-instance-no-public-ip.png" alt-text="A screenshot of how to configure no public IP for compute instance." lightbox="./media/how-to-managed-network-compute/compute-instance-no-public-ip.png":::

1. Continue with the creation of the compute resource.

---

## Limitations

* Creating a compute cluster in a different region than the workspace isn't supported when using a managed virtual network.

### Migration of compute resources

If you have an existing workspace and want to enable managed virtual network for it, there's currently no supported migration path for existing manged compute resources. You'll need to delete all existing managed compute resources and recreate them after enabling the managed virtual network. The following list contains the compute resources that must be deleted and recreated:

* Compute cluster
* Compute instance
* Managed online endpoints

## Next steps

* [Managed virtual network isolation](how-to-managed-network.md)
* [Secure online endpoints with network isolation](how-to-secure-online-endpoint.md)
