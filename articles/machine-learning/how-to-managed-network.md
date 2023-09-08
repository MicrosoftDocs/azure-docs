---
title: Managed virtual network isolation (Preview)
titleSuffix: Azure Machine Learning
description: Use managed virtual network isolation for network security with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 07/19/2023
ms.topic: how-to
ms.custom: build-2023, devx-track-azurecli
---

# Workspace managed network isolation (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Azure Machine Learning provides preview support for managed virtual network (VNet) isolation. Managed VNet isolation streamlines and automates your network isolation configuration with a built-in, workspace-level Azure Machine Learning managed virtual network.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Managed virtual network architecture

When you enable managed virtual network isolation, a managed VNet is created for the workspace. Managed compute resources (compute clusters and compute instances) for the workspace automatically use this managed VNet. The managed VNet can use private endpoints for Azure resources that are used by your workspace, such as Azure Storage, Azure Key Vault, and Azure Container Registry. 

The following diagram shows how a managed virtual network uses private endpoints to communicate with the storage, key vault, and container registry used by the workspace.

:::image type="content" source="./media/how-to-managed-network/managed-virtual-network-architecture.png" alt-text="Diagram of managed virtual network isolation.":::

There are two different configuration modes for outbound traffic from the managed virtual network:

> [!TIP]
> Regardless of the outbound mode you use, traffic to Azure resources can be configured to use a private endpoint. For example, you may allow all outbound traffic to the internet, but restrict communication with Azure resources by creating a private endpoint for that resource in the managed VNet

| Outbound mode | Description | Scenarios |
| ----- | ----- | ----- |
| Allow internet outbound | Allow all internet outbound traffic from the managed VNet. | Recommended if you need access to machine learning artifacts on the Internet, such as python packages or pretrained models. |
| Allow only approved outbound | Outbound traffic is allowed by specifying service tags. | Recommended if you want to minimize the risk of data exfiltration but you will need to prepare all required machine learning artifacts in your private locations. |

The managed virtual network is preconfigured with [required default rules](#list-of-required-rules). It's also configured for private endpoint connections to your workspace default storage, container registry and key vault if they're configured as private. After choosing the isolation mode, you only need to consider other outbound requirements you may need to add.

## Supported scenarios in preview and to be supported scenarios

|Scenarios|Supported in preview|To be supported|
|---|---|---|
|Isolation Mode| &#x2022; Allow internet outbound<br>&#x2022; Allow only approved outbound||
|Compute|&#x2022; [Compute Instance](concept-compute-instance.md)<br>&#x2022; [Compute Cluster](how-to-create-attach-compute-cluster.md)<br>&#x2022; [Serverless](how-to-use-serverless-compute.md)<br>&#x2022; [Serverless spark](apache-spark-azure-ml-concepts.md)|&#x2022; New managed online endpoint creation<br>&#x2022; Migration of existing managed online endpoint<br>&#x2022; No Public IP option of Compute Instance, Compute Cluster and Serverless|
|Outbound|&#x2022; Private Endpoint<br>&#x2022; Service Tag|&#x2022; FQDN| 

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

> [!IMPORTANT]
> To use the information in this article, you must enable this preview feature for your subscription. To check whether it has been registered, or to register it, use the steps in the [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features). Depending on whether you use the Azure portal, Azure CLI, or Azure PowerShell, you may need to register the feature with a different name. Use the following table to determine the name of the feature to register:
>
> | Registration method | Feature name |
> | ----- | ----- |
> | Azure portal | `Azure Machine Learning Managed Network` |
> | Azure CLI | `AMLManagedNetworkEnabled` |
> | Azure PowerShell | `AMLManagedNetworkEnabled` |

# [Azure CLI](#tab/azure-cli)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

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

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

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
        PrivateEndpointDestination
    )
    from azure.identity import DefaultAzureCredential

    # Replace with the values for your Azure subscription and resource group.
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"

    # get a handle to the subscription
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)
    ```

# [Azure portal](#tab/portal)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

---

## Configure a managed virtual network to allow internet outbound

> [!IMPORTANT]
> The creation of the managed virtual network is deferred until a compute resource is created or provisioning is manually started. [Manually start provisioning if you plan to submit serverless spark jobs](#configure-for-serverless-spark-jobs).

# [Azure CLI](#tab/azure-cli)

To configure a managed VNet that allows internet outbound communications, you can use either the `--managed-network allow_internet_outbound` parameter or a YAML configuration file that contains the following entries:

```yml
managed_network:
  isolation_mode: allow_internet_outbound
```

You can also define _outbound rules_ to other Azure services that the workspace relies on. These rules define _private endpoints_ that allow an Azure resource to securely communicate with the managed VNet. The following rule demonstrates adding a private endpoint to an Azure Blob resource.

```yml
managed_network:
  isolation_mode: allow_internet_outbound
  outbound_rules:
  - name: added-perule
    destination:
      service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
      spark_enabled: true
      subresource_target: blob
    type: private_endpoint
```

You can configure a managed VNet using either the `az ml workspace create` or `az ml workspace update` commands:

* __Create a new workspace__:

    > [!TIP]
    > before creating a new workspace, you must create an Azure Resource Group to contain it. For more information, see [Manage Azure Resource Groups](/azure/azure-resource-manager/management/manage-resource-groups-cli).

    The following example creates a new workspace. The `--managed-network allow_internet_outbound` parameter configures a managed VNet for the workspace:

    ```azurecli
    az ml workspace create --name ws --resource-group rg --managed-network allow_internet_outbound
    ```

    To create a workspace using a YAML file instead, use the `--file` parameter and specify the YAML file that contains the configuration settings:

    ```azurecli
    az ml workspace create --file workspace.yaml --resource-group rg --name ws
    ```

    The following YAML example defines a workspace with a managed VNet:

    ```yml
    name: myworkspace
    location: EastUS
    managed_network:
    isolation_mode: allow_internet_outbound
    ```

* __Update an existing workspace__:

    > [!WARNING]
    > Before updating an existing workspace to use a managed virtual network, you must delete all computing resources for the workspace. This includes compute instance, compute cluster, and managed online endpoints.

    The following example updates an existing workspace. The `--managed-network allow_internet_outbound` parameter configures a managed VNet for the workspace:

    ```azurecli
    az ml workspace update --name ws --resource-group rg --managed-network allow_internet_outbound
    ```

    To Update an existing workspace using the YAML file, use the `--file` parameter and specify the YAML file that contains the configuration settings:

    ```azurecli
    az ml workspace update --file workspace.yaml --name ws --resource-group MyGroup
    ```

    The following YAML example defines a managed VNet for the workspace. It also demonstrates how to add a private endpoint connection to a resource used by the workspace; in this example, a private endpoint for a blob store:

    ```yml
    name: myworkspace
    managed_network:
      isolation_mode: allow_internet_outbound
      outbound_rules:
      - name: added-perule
        destination:
          service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
          spark_enabled: true
          subresource_target: blob
        type: private_endpoint
    ```

# [Python SDK](#tab/python)

To configure a managed VNet that allows internet outbound communications, use the `ManagedNetwork` class to define a network with `IsolationMode.ALLOW_INTERNET_OUTBOUND`. You can then use the `ManagedNetwork` object to create a new workspace or update an existing one. To define _outbound rules_ to Azure services that the workspace relies on, use the `PrivateEndpointDestination` class to define a new private endpoint to the service.

* __Create a new workspace__:

    > [!TIP]
    > before creating a new workspace, you must create an Azure Resource Group to contain it. For more information, see [Manage Azure Resource Groups](/azure/developer/python/sdk/examples/azure-sdk-example-resource-group).

    The following example creates a new workspace named `myworkspace`, with an outbound rule named `myrule` that adds a private endpoint for an Azure Blob store:

    ```python
    # Basic managed network configuration
    network = ManagedNetwork(IsolationMode.ALLOW_INTERNET_OUTBOUND)

    # Workspace configuration
    ws = Workspace(
        name="myworkspace",
        location="eastus",
        managed_network=network
    )

    # Example private endpoint outbound to a blob
    rule_name = "myrule"
    service_resource_id = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
    subresource_target = "blob"
    spark_enabled = True

    # Add the outbound 
    ws.managed_network.outbound_rules = [PrivateEndpointDestination(
        name=rule_name, 
        service_resource_id=service_resource_id, 
        subresource_target=subresource_target, 
        spark_enabled=spark_enabled)]

    # Create the workspace
    ws = ml_client.workspaces.begin_create(ws).result()
    ```

* __Update an existing workspace__:

    > [!WARNING]
    > Before updating an existing workspace to use a managed virtual network, you must delete all computing resources for the workspace. This includes compute instance, compute cluster, and managed online endpoints.

    The following example demonstrates how to create a managed VNet for an existing Azure Machine Learning workspace named `myworkspace`:
    
    ```python
    # Get the existing workspace
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myworkspace")
    ws = ml_client.workspaces.get()
    
    # Basic managed network configuration
    ws.managed_network = ManagedNetwork(IsolationMode.ALLOW_INTERNET_OUTBOUND)

    # Example private endpoint outbound to a blob
    rule_name = "myrule"
    service_resource_id = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
    subresource_target = "blob"
    spark_enabled = True

    # Add the outbound 
    ws.managed_network.outbound_rules = [PrivateEndpointDestination(
        name=rule_name, 
        service_resource_id=service_resource_id, 
        subresource_target=subresource_target, 
        spark_enabled=spark_enabled)]

    # Create the workspace
    ml_client.workspaces.begin_update(ws)
    ```

# [Azure portal](#tab/portal)

* __Create a new workspace__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and choose Azure Machine Learning from Create a resource menu.
    1. Provide the required information on the __Basics__ tab.
    1. From the __Networking__ tab, select __Private with Internet Outbound__.
    
        :::image type="content" source="./media/how-to-managed-network/use-managed-network-internet-outbound.png" alt-text="Screenshot of creating a workspace with an internet outbound managed network." lightbox="./media/how-to-managed-network/use-managed-network-internet-outbound.png":::

    1. Continue creating the workspace as normal.

* __Update an existing workspace__:

    > [!WARNING]
    > Before updating an existing workspace to use a managed virtual network, you must delete all computing resources for the workspace. This includes compute instance, compute cluster, and managed online endpoints.

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace that you want to enable managed virtual network isolation for.
    1. Select __Networking__, then select __Private with Internet Outbound__. Select __Save__ to save the changes.
    
        :::image type="content" source="./media/how-to-managed-network/update-managed-network-internet-outbound.png" alt-text="Screenshot of updating a workspace to managed network with internet outbound." lightbox="./media/how-to-managed-network/update-managed-network-internet-outbound.png":::

---

## Configure a managed virtual network to allow only approved outbound

> [!IMPORTANT]
> The creation of the managed virtual network is deferred until a compute resource is created or provisioning is manually started. [Manually start provisioning if you plan to submit serverless spark jobs](#configure-for-serverless-spark-jobs).

# [Azure CLI](#tab/azure-cli)

To configure a managed VNet that allows only approved outbound communications, you can use either the `--managed-network allow_only_approved_outbound` parameter or a YAML configuration file that contains the following entries:

```yml
managed_network:
  isolation_mode: allow_only_approved_outbound
```

You can also define _outbound rules_ to define approved outbound communication. An outbound rule can be created for a type of `service_tag`. You can also define _private endpoints_ that allow an Azure resource to securely communicate with the managed VNet. The following rule demonstrates adding a private endpoint to an Azure Blob resource, a service tag to Azure Data Factory:

> [!TIP]
> Adding an outbound for a service tag is only valid when the managed VNet is configured to `allow_only_approved_outbound`.

```yaml
managed_network:
  isolation_mode: allow_only_approved_outbound
  outbound_rules:
  - name: added-servicetagrule
    destination:
      port_ranges: 80, 8080
      protocol: TCP
      service_tag: DataFactory
    type: service_tag
  - name: added-perule
    destination:
      service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
      spark_enabled: true
      subresource_target: blob
    type: private_endpoint
```

You can configure a managed VNet using either the `az ml workspace create` or `az ml workspace update` commands:

* __Create a new workspace__:

    > [!TIP]
    > Before creating a new workspace, you must create an Azure Resource Group to contain it. For more information, see [Manage Azure Resource Groups](/azure/azure-resource-manager/management/manage-resource-groups-cli).

    The following example uses the `--managed-network allow_only_approved_outbound` parameter to configure the managed VNet:

    ```azurecli
    az ml workspace create --name ws --resource-group rg --managed-network allow_only_approved_outbound
    ```

    The following YAML file defines a workspace with a managed virtual network:

    ```yml
    name: myworkspace
    location: EastUS
    managed_network:
    isolation_mode: allow_only_approved_outbound
    ```

    To create a workspace using the YAML file, use the `--file` parameter:

    ```azurecli
    az ml workspace create --file workspace.yaml --resource-group rg --name ws
    ```

* __Update an existing workspace__

    > [!WARNING]
    > Before updating an existing workspace to use a managed virtual network, you must delete all computing resources for the workspace. This includes compute instance, compute cluster, and managed online endpoints.

    The following example uses the `--managed-network allow_only_approved_outbound` parameter to configure the managed VNet for an existing workspace:

    ```azurecli
    az ml workspace update --name ws --resource-group rg --managed-network allow_only_approved_outbound
    ```

    The following YAML file defines a managed VNet for the workspace. It also demonstrates how to add an approved outbound to the managed VNet. In this example, an outbound rule is added for both a service tag:

    ```yaml
    name: myworkspace_dep
    managed_network:
      isolation_mode: allow_only_approved_outbound
      outbound_rules:
      - name: added-servicetagrule
        destination:
          port_ranges: 80, 8080
          protocol: TCP
          service_tag: DataFactory
        type: service_tag
      - name: added-perule
        destination:
          service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
          spark_enabled: true
          subresource_target: blob
        type: private_endpoint
    ```

# [Python SDK](#tab/python)

To configure a managed VNet that allows only approved outbound communications, use the `ManagedNetwork` class to define a network with `IsolationMode.ALLOw_ONLY_APPROVED_OUTBOUND`. You can then use the `ManagedNetwork` object to create a new workspace or update an existing one. To define _outbound rules_ to Azure services that the workspace relies on, use the `PrivateEndpointDestination` class to define a new private endpoint to the service.

* __Create a new workspace__:

    > [!TIP]
    > before creating a new workspace, you must create an Azure Resource Group to contain it. For more information, see [Manage Azure Resource Groups](/azure/developer/python/sdk/examples/azure-sdk-example-resource-group).

    The following example creates a new workspace named `myworkspace`, with several outbound rules:

    * `myrule` - Adds a private endpoint for an Azure Blob store.
    * `datafactory` - Adds a service tag rule to communicate with Azure Data Factory.

    > [!TIP]
    > Adding an outbound for a service tag is only valid when the managed VNet is configured to `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.

    ```python
    # Basic managed virtual network configuration
    network = ManagedNetwork(IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND)

    # Workspace configuration
    ws = Workspace(
        name="myworkspace",
        location="eastus",
        managed_network=network
    )

    # Append some rules
    ws.managed_network.outbound_rules = []
    # Example private endpoint outbound to a blob
    rule_name = "myrule"
    service_resource_id = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
    subresource_target = "blob"
    spark_enabled = True
    ws.managed_network.outbound_rules.append(
        PrivateEndpointDestination(
            name=rule_name, 
            service_resource_id=service_resource_id, 
            subresource_target=subresource_target, 
            spark_enabled=spark_enabled
        )
    )

    # Example service tag rule
    rule_name = "datafactory"
    service_tag = "DataFactory"
    protocol = "TCP"
    port_ranges = "80, 8080-8089"
    ws.managed_network.outbound_rules.append(
        ServiceTagDestination(
            name=rule_name, 
            service_tag=service_tag, 
            protocol=protocol, 
            port_ranges=port_ranges
        )
    )

    # Create the workspace
    ws = ml_client.workspaces.begin_create(ws).result()
    ```

* __Update an existing workspace__:

    > [!WARNING]
    > Before updating an existing workspace to use a managed virtual network, you must delete all computing resources for the workspace. This includes compute instance, compute cluster, and managed online endpoints.

    The following example demonstrates how to create a managed VNet for an existing Azure Machine Learning workspace named `myworkspace`. The example also adds several outbound rules for the managed VNet:

    * `myrule` - Adds a private endpoint for an Azure Blob store.
    * `datafactory` - Adds a service tag rule to communicate with Azure Data Factory.

    > [!TIP]
    > Adding an outbound for a service tag is only valid when the managed VNet is configured to `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.
    
    ```python
    # Get the existing workspace
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myworkspace")
    ws = ml_client.workspaces.get()

    # Basic managed virtual network configuration
    ws.managed_network = ManagedNetwork(IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND)

    # Append some rules
    ws.managed_network.outbound_rules = []
    # Example private endpoint outbound to a blob
    rule_name = "myrule"
    service_resource_id = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
    subresource_target = "blob"
    spark_enabled = True
    ws.managed_network.outbound_rules.append(
        PrivateEndpointDestination(
            name=rule_name, 
            service_resource_id=service_resource_id, 
            subresource_target=subresource_target, 
            spark_enabled=spark_enabled
        )
    )

    # Example service tag rule
    rule_name = "datafactory"
    service_tag = "DataFactory"
    protocol = "TCP"
    port_ranges = "80, 8080-8089"
    ws.managed_network.outbound_rules.append(
        ServiceTagDestination(
            name=rule_name, 
            service_tag=service_tag, 
            protocol=protocol, 
            port_ranges=port_ranges
        )
    )

    # Update the workspace
    ml_client.workspaces.begin_update(ws)
    ```

# [Azure portal](#tab/portal)

* __Create a new workspace__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and choose Azure Machine Learning from Create a resource menu.
    1. Provide the required information on the __Basics__ tab.
    1. From the __Networking__ tab, select __Private with Approved Outbound__.
    
        :::image type="content" source="./media/how-to-managed-network/use-managed-network-approved-outbound.png" alt-text="Screenshot of creating a workspace with an approved outbound managed network." lightbox="./media/how-to-managed-network/use-managed-network-approved-outbound.png":::

    1. Continue creating the workspace as normal.

* __Update an existing workspace__:

    > [!WARNING]
    > Before updating an existing workspace to use a managed virtual network, you must delete all computing resources for the workspace. This includes compute instance, compute cluster, and managed online endpoints.

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace that you want to enable managed virtual network isolation for.
    1. Select __Networking__, then select __Private with Approved Outbound__. Select __Save__ to save the changes.
    
        :::image type="content" source="./media/how-to-managed-network/update-managed-network-approved-outbound.png" alt-text="Screenshot of updating a workspace to managed network with approved outbound." lightbox="./media/how-to-managed-network/update-managed-network-approved-outbound.png":::

---


## Configure for serverless spark jobs

> [!TIP]
> The steps in this section are only needed for __Spark serverless__. If you are using [serverless __compute cluster__](how-to-use-serverless-compute.md), you can skip this section.

To enable the [serverless spark jobs](how-to-submit-spark-jobs.md) for the managed VNet, you must perform the following actions:

* Configure a managed VNet for the workspace and add an outbound private endpoint for the Azure Storage Account.
* After you configure the managed VNet, provision it and flag it to allow spark jobs.

1. Configure an outbound private endpoint.

    # [Azure CLI](#tab/azure-cli)

    Use a YAML file to define the managed VNet configuration and add a private endpoint for the Azure Storage Account. Also set `spark_enabled: true`:

    > [!NOTE]
    > This example is for a managed VNet configured to allow internet traffic. Currently, serverless Spark does not support `isolation_mode: allow_only_approved_outbound` to allow only approved outbound traffic.

    ```yml
    name: myworkspace
    managed_network:
      isolation_mode: allow_internet_outbound
      outbound_rules:
      - name: added-perule
        destination:
          service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
          spark_enabled: true
          subresource_target: blob
        type: private_endpoint
    ```

    You can use a YAML configuration file with the `az ml workspace update` command by specifying the `--file` parameter and the name of the YAML file. For example, the following command updates an existing workspace using a YAML file named `workspace_pe.yml`:

    ```azurecli
    az ml workspace update --file workspace_pe.yml --resource_group rg --name ws
    ```

    # [Python SDK](#tab/python)

    The following example demonstrates how to create a managed VNet for an existing Azure Machine Learning workspace named `myworkspace`. It also adds a private endpoint for the Azure Storage Account and sets `spark_enabled=true`:

    > [!NOTE]
    > The following example is for a managed VNet configured to allow internet traffic. Currently, serverless Spark does not support `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND` to allow only approved outbound traffic.  
        
    ```python
    # Get the existing workspace
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myworkspace")
    ws = ml_client.workspaces.get()

    # Basic managed network configuration
    ws.managed_network = ManagedNetwork(IsolationMode.ALLOW_INTERNET_OUTBOUND)

    # Example private endpoint outbound to a blob
    rule_name = "myrule"
    service_resource_id = "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>"
    subresource_target = "blob"
    spark_enabled = True

    # Add the outbound 
    ws.managed_network.outbound_rules = [PrivateEndpointDestination(
        name=rule_name, 
        service_resource_id=service_resource_id, 
        subresource_target=subresource_target, 
        spark_enabled=spark_enabled)]

    # Create the workspace
    ml_client.workspaces.begin_update(ws)
    ```


    # [Azure portal](#tab/portal)

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace.
    1. Select __Networking__, then select __Add user-defined outbound rules__. Add a rule for the Azure Storage Account, and make sure that __Spark enabled__ is selected.
    
        :::image type="content" source="./media/how-to-managed-network/add-outbound-spark-enabled.png" alt-text="Screenshot of an endpoint rule with Spark enabled selected." lightbox="./media/how-to-managed-network/add-outbound-spark-enabled.png":::

    1. Select __Save__ to save the rule, then select __Save__ from the top of __Networking__ to save the changes to the manged virtual network.

    ---

1. Provision the managed VNet.

    > [!NOTE]
    > If your workspace is already configured for a public endpoint (for example, with an Azure Virtual Network), and has [public network access enabled](how-to-configure-private-link.md#enable-public-access), you must disable it before provisioning the managed virtual network. If you don't disable public network access when provisioning the managed virtual network, the private endpoints for the managed endpoint may not be created successfully.

    # [Azure CLI](#tab/azure-cli)

    The following example shows how to provision a managed VNet for serverless spark jobs by using the `--include-spark` parameter.

    ```azurecli
    az ml workspace provision-network -g my_resource_group -n my_workspace_name --include-spark
    ```

    # [Python SDK](#tab/python)

    The following example shows how to provision a managed VNet for serverless spark jobs:

    ```python
    # Connect to a workspace named "myworkspace"
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace_name="myworkspace")

    # whether to provision spark vnet as well
    include_spark = True

    provision_network_result = ml_client.workspaces.begin_provision_network(workspace_name=ws_name, include_spark=include_spark).result()
    ```

    # [Azure portal](#tab/portal)

    Use the __Azure CLI__ or __Python SDK__ tabs to learn how to manually provision the managed VNet with serverless spark support.

    ---

## Manage outbound rules

# [Azure CLI](#tab/azure-cli)

To list the managed VNet outbound rules for a workspace, use the following command:

```azurecli
az ml workspace outbound-rule list --workspace-name ws --resource-group rg
```

To view the details of a managed VNet outbound rule, use the following command:

```azurecli
az ml workspace outbound-rule show --rule rule-name --workspace-name ws --resource-group rg
```

To remove an outbound rule from the managed VNet, use the following command:

```azurecli
az ml workspace outbound-rule remove --rule rule-name --workspace-name ws --resource-group rg
```

# [Python SDK](#tab/python)

The following example demonstrates how to manage outbound rules for a workspace named `myworkspace`:

```python
# Connect to the workspace
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace_name="myworkspace")

# Specify the rule name
rule_name = "<some-rule-name>"

# Get a rule by name
rule = ml_client._workspace_outbound_rules.get(resource_group, ws_name, rule_name)

# List rules for a workspace
rule_list = ml_client._workspace_outbound_rules.list(resource_group, ws_name)

# Delete a rule from a workspace
ml_client._workspace_outbound_rules.begin_remove(resource_group, ws_name, rule_name).result()
```

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace that you want to enable managed virtual network isolation for.
1. Select __Networking__. The __Workspace Outbound access__ section allows you to manage outbound rules.

    :::image type="content" source="./media/how-to-managed-network/manage-outbound-rules.png" alt-text="Screenshot of the outbound rules section." lightbox="./media/how-to-managed-network/manage-outbound-rules.png":::

---

## List of required rules

> [!TIP]
> These  rules are automatically added to the managed VNet.

__Private endpoints__:
* When the isolation mode for the managed network is `Allow internet outbound`, private endpoint outbound rules will be automatically created as required rules from the managed network for the workspace and associated resources __with public network access disabled__ (Key Vault, Storage Account, Container Registry, Azure ML Workspace).
* When the isolation mode for the managed network is `Allow only approved outbound`, private endpoint outbound rules will be automatically created as required rules from the managed network for the workspace and associated resources __regardless of public network access mode for those resources__ (Key Vault, Storage Account, Container Registry, Azure ML Workspace).

__Outbound__ service tag rules:

* `AzureActiveDirectory`
* `AzureMachineLearning`
* `BatchNodeManagement.region`
* `AzureResourceManager`
* `AzureFrontDoor`
* `MicrosoftContainerRegistry`
* `AzureMonitor`

__Inbound__ service tag rules:
* `AzureMachineLearning`

## List of recommended outbound rules

Currently we don't have any recommended outbound rules.

## Limitations

* Once you enable managed virtual network isolation of your workspace, you can't disable it.
* Managed virtual network uses private endpoint connection to access your private resources. You can't have a private endpoint and a service endpoint at the same time for your Azure resources, such as a storage account. We recommend using private endpoints in all scenarios.
* The managed network will be deleted and cleaned up when the workspace is deleted. 

## Next steps

* [Troubleshoot managed virtual network](how-to-troubleshoot-managed-network.md)
