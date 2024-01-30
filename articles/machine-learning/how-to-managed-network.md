---
title: Managed virtual network isolation
titleSuffix: Azure Machine Learning
description: Use managed virtual network isolation for network security with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/22/2023
ms.topic: how-to
ms.custom:
  - build-2023
  - devx-track-azurecli
  - ignite-2023
---

# Workspace managed virtual network isolation

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Azure Machine Learning provides support for managed virtual network (managed VNet) isolation. Managed VNet isolation streamlines and automates your network isolation configuration with a built-in, workspace-level Azure Machine Learning managed VNet.

## managed virtual network architecture

When you enable managed virtual network isolation, a managed VNet is created for the workspace. Managed compute resources you create for the workspace automatically use this managed VNet. The managed VNet can use private endpoints for Azure resources that are used by your workspace, such as Azure Storage, Azure Key Vault, and Azure Container Registry. 

There are two different configuration modes for outbound traffic from the managed VNet:

> [!TIP]
> Regardless of the outbound mode you use, traffic to Azure resources can be configured to use a private endpoint. For example, you may allow all outbound traffic to the internet, but restrict communication with Azure resources by adding outbound rules for the resources.

| Outbound mode | Description | Scenarios |
| ----- | ----- | ----- |
| Allow internet outbound | Allow all internet outbound traffic from the managed VNet. | You want unrestricted access to machine learning resources on the internet, such as python packages or pretrained models.<sup>1</sup> |
| Allow only approved outbound | Outbound traffic is allowed by specifying service tags. | * You want to minimize the risk of data exfiltration, but you need to prepare all required machine learning artifacts in your private environment.</br>* You want to configure outbound access to an approved list of services, service tags, or FQDNs. |
| Disabled | Inbound and outbound traffic isn't restricted or you're using your own Azure Virtual Network to protect resources. | You want public inbound and outbound from the workspace, or you're handling network isolation with your own Azure VNet. |

1: You can use outbound rules with _allow only approved outbound_ mode to achieve the same result as using allow internet outbound. The differences are:

* You must add rules for each outbound connection you need to allow.
* Adding FQDN outbound rules increase your costs as this rule type uses Azure Firewall.
* The default rules for _allow only approved outbound_ are designed to minimize the risk of data exfiltration. Any outbound rules you add may increase your risk.

The managed VNet is preconfigured with [required default rules](#list-of-required-rules). It's also configured for private endpoint connections to your workspace, workspace's default storage, container registry and key vault __if they're configured as private__ or __the workspace isolation mode is set to allow only approved outbound__. After choosing the isolation mode, you only need to consider other outbound requirements you may need to add.

The following diagram shows a managed VNet configured to __allow internet outbound__:

:::image type="content" source="./media/how-to-managed-network/internet-outbound.svg" alt-text="Diagram of managed VNet isolation configured for internet outbound." lightbox="./media/how-to-managed-network/internet-outbound.svg":::

The following diagram shows a managed VNet configured to __allow only approved outbound__:

> [!NOTE]
> In this configuration, the storage, key vault, and container registry used by the workspace are flagged as private. Since they are flagged as private, a private endpoint is used to communicate with them.

:::image type="content" source="./media/how-to-managed-network/only-approved-outbound.svg" alt-text="Diagram of managed VNet isolation configured for allow only approved outbound." lightbox="./media/how-to-managed-network/only-approved-outbound.svg":::

### Azure Machine Learning studio

If you want to use the integrated notebook or create datasets in the default storage account from studio, your client needs access to the default storage account. Create a _private endpoint_ or _service endpoint_ for the default storage account in the Azure Virtual Network that the clients use.

Part of Azure Machine Learning studio runs locally in the client's web browser, and communicates directly with the default storage for the workspace. Creating a private endpoint or service endpoint (for the default storage account) in the client's virtual network ensures that the client can communicate with the storage account.

For more information on creating a private endpoint or service endpoint, see the [Connect privately to a storage account](/azure/storage/common/storage-private-endpoints) and [Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) articles.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

# [Azure CLI](#tab/azure-cli)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* The __Microsoft.Network__ resource provider must be registered for your Azure subscription. This resource provider is used by the workspace when creating private endpoints for the managed virtual network.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

* The Azure identity you use when deploying a managed network requires the following [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) actions to create private endpoints:

    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

* The [Azure CLI](/cli/azure/) and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

    >[!TIP]
    > Azure Machine Learning managed VNet was introduced on May 23rd, 2023. If you have an older version of the ml extension, you may need to update it for the examples in this article work. To update the extension, use the following Azure CLI command:
    >
    > ```azurecli
    > az extension update -n ml
    > ```

* The CLI examples in this article assume that you're using the Bash (or compatible) shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about).

* The Azure CLI examples in this article use `ws` to represent the name of the workspace, and `rg` to represent the name of the resource group. Change these values as needed when using the commands with your Azure subscription.

# [Python SDK](#tab/python)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* The __Microsoft.Network__ resource provider must be registered for your Azure subscription. This resource provider is used by the workspace when creating private endpoints for the managed virtual network.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

* The Azure identity you use when deploying a managed network requires the following [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) actions to create private endpoints:

    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

* The Azure Machine Learning Python SDK v2. For more information on the SDK, see [Install the Python SDK v2 for Azure Machine Learning](/python/api/overview/azure/ai-ml-readme).

    > [!TIP]
    > Azure Machine learning managed VNet was introduced on May 23rd, 2023. If you have an older version of the SDK installed, you may need to update it for the examples in this article to work. To update the SDK, use the following command:
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

# [Azure portal](#tab/portal)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* The __Microsoft.Network__ resource provider must be registered for your Azure subscription. This resource provider is used by the workspace when creating private endpoints for the managed virtual network.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

* The Azure identity you use when deploying a managed network requires the following [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) actions to create private endpoints:

    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

---

> [!NOTE]
> If you are using UAI workspace please make sure to add the Network Contributor role to your identity. For more information, see [User-assigned managed identity](how-to-identity-based-service-authentication.md).

## Configure a managed virtual network to allow internet outbound

> [!TIP]
> The creation of the managed VNet is deferred until a compute resource is created or provisioning is manually started. When allowing automatic creation, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network. For more information, see [Manually provision the network](#manually-provision-a-managed-vnet).

> [!IMPORTANT]
> __If you plan to submit serverless Spark jobs__, you must manually start provisioning. For more information, see the [configure for serverless Spark jobs](#configure-for-serverless-spark-jobs) section.

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

    [!INCLUDE [managed-vnet-update](includes/managed-vnet-update.md)]

    The following example updates an existing workspace. The `--managed-network allow_internet_outbound` parameter configures a managed VNet for the workspace:

    ```azurecli
    az ml workspace update --name ws --resource-group rg --managed-network allow_internet_outbound
    ```

    To update an existing workspace using the YAML file, use the `--file` parameter and specify the YAML file that contains the configuration settings:

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

    The following example creates a new workspace named `myworkspace`, with an outbound rule named `myrule` that adds a private endpoint for an Azure Blob store:

    ```python
    # Basic managed VNet configuration
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

    [!INCLUDE [managed-vnet-update](includes/managed-vnet-update.md)]

    The following example demonstrates how to create a managed VNet for an existing Azure Machine Learning workspace named `myworkspace`:
    
    ```python
    # Get the existing workspace
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myworkspace")
    ws = ml_client.workspaces.get()
    
    # Basic managed VNet configuration
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
    
        :::image type="content" source="./media/how-to-managed-network/use-managed-network-internet-outbound.png" alt-text="Screenshot of creating a workspace with an internet outbound managed VNet." lightbox="./media/how-to-managed-network/use-managed-network-internet-outbound.png":::

    1. To add an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the following information:
    
        * __Rule name__: A name for the rule. The name must be unique for this workspace.
        * __Destination type__: Private Endpoint is the only option when the network isolation is private with internet outbound. Azure Machine Learning managed VNet doesn't support creating a private endpoint to all Azure resource types. For a list of supported resources, see the [Private endpoints](#private-endpoints) section.
        * __Subscription__: The subscription that contains the Azure resource you want to add a private endpoint for.
        * __Resource group__: The resource group that contains the Azure resource you want to add a private endpoint for.
        * __Resource type__: The type of the Azure resource.
        * __Resource name__: The name of the Azure resource.
        * __Sub Resource__: The sub resource of the Azure resource type.
        * __Spark enabled__: Select this option if you want to enable serverless Spark jobs for the workspace. This option is only available if the resource type is Azure Storage.

        :::image type="content" source="./media/how-to-managed-network/outbound-rule-private-endpoint.png" alt-text="Screenshot of adding an outbound rule for a private endpoint." lightbox="./media/how-to-managed-network/outbound-rule-private-endpoint.png":::

        Select __Save__ to save the rule. You can continue using __Add user-defined outbound rules__ to add rules.

    1. Continue creating the workspace as normal.

* __Update an existing workspace__:

    [!INCLUDE [managed-vnet-update](includes/managed-vnet-update.md)]

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace that you want to enable managed VNet isolation for.
    1. Select __Networking__, then select __Private with Internet Outbound__.
    
        :::image type="content" source="./media/how-to-managed-network/update-managed-network-internet-outbound.png" alt-text="Screenshot of updating a workspace to managed VNet with internet outbound." lightbox="./media/how-to-managed-network/update-managed-network-internet-outbound.png":::

        * To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the same information as used when creating a workspace in the 'Create a new workspace' section.

            :::image type="content" source="./media/how-to-managed-network/outbound-rule-private-endpoint.png" alt-text="Screenshot of updating a managed VNet by adding a private endpoint." lightbox="./media/how-to-managed-network/outbound-rule-private-endpoint.png":::

        * To __delete__ an outbound rule, select __delete__ for the rule.

            :::image type="content" source="./media/how-to-managed-network/delete-outbound-rule.png" alt-text="Screenshot of the delete rule icon for an approved outbound managed VNet.":::

    1. Select __Save__ at the top of the page to save the changes to the managed VNet.

---

## Configure a managed virtual network to allow only approved outbound

> [!TIP]
> The managed VNet is automatically provisioned when you create a compute resource. When allowing automatic creation, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network. If you configured FQDN outbound rules, the first FQDN rule adds around __10 minutes__ to the provisioning time. For more information, see [Manually provision the network](#manually-provision-a-managed-vnet).

> [!IMPORTANT]
> __If you plan to submit serverless Spark jobs__, you must manually start provisioning. For more information, see the [configure for serverless Spark jobs](#configure-for-serverless-spark-jobs) section.

# [Azure CLI](#tab/azure-cli)

To configure a managed VNet that allows only approved outbound communications, you can use either the `--managed-network allow_only_approved_outbound` parameter or a YAML configuration file that contains the following entries:

```yml
managed_network:
  isolation_mode: allow_only_approved_outbound
```

You can also define _outbound rules_ to define approved outbound communication. An outbound rule can be created for a type of `service_tag`, `fqdn`, and `private_endpoint`. The following rule demonstrates adding a private endpoint to an Azure Blob resource, a service tag to Azure Data Factory, and an FQDN to `pypi.org`:

> [!IMPORTANT]
> * Adding an outbound for a service tag or FQDN is only valid when the managed VNet is configured to `allow_only_approved_outbound`.
> * If you add outbound rules, Microsoft can't guarantee data exfiltration.

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

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
  - name: add-fqdnrule
    destination: 'pypi.org'
    type: fqdn
  - name: added-perule
    destination:
      service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
      spark_enabled: true
      subresource_target: blob
    type: private_endpoint
```

You can configure a managed VNet using either the `az ml workspace create` or `az ml workspace update` commands:

* __Create a new workspace__:

    The following example uses the `--managed-network allow_only_approved_outbound` parameter to configure the managed VNet:

    ```azurecli
    az ml workspace create --name ws --resource-group rg --managed-network allow_only_approved_outbound
    ```

    The following YAML file defines a workspace with a managed VNet:

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

    [!INCLUDE [managed-vnet-update](includes/managed-vnet-update.md)]

    The following example uses the `--managed-network allow_only_approved_outbound` parameter to configure the managed VNet for an existing workspace:

    ```azurecli
    az ml workspace update --name ws --resource-group rg --managed-network allow_only_approved_outbound
    ```

    The following YAML file defines a managed VNet for the workspace. It also demonstrates how to add an approved outbound to the managed VNet. In this example, an outbound rule is added for both a service tag:

    > [!WARNING]
    > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing.For more information, see [Pricing](#pricing).

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
      - name: add-fqdnrule
        destination: 'pypi.org'
        type: fqdn
      - name: added-perule
        destination:
          service_resource_id: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE_ACCOUNT_NAME>
          spark_enabled: true
          subresource_target: blob
        type: private_endpoint
    ```

# [Python SDK](#tab/python)

To configure a managed VNet that allows only approved outbound communications, use the `ManagedNetwork` class to define a network with `IsolationMode.ALLOw_ONLY_APPROVED_OUTBOUND`. You can then use the `ManagedNetwork` object to create a new workspace or update an existing one. To define _outbound rules_, use the following classes:

| Destination | Class |
| ----------- | ----- |
| __Azure service that the workspace relies on__ | `PrivateEndpointDestination` |
| __Azure service tag__ | `ServiceTagDestination` |
| __Fully qualified domain name (FQDN)__ | `FqdnDestination` |

* __Create a new workspace__:

    The following example creates a new workspace named `myworkspace`, with several outbound rules:

    * `myrule` - Adds a private endpoint for an Azure Blob store.
    * `datafactory` - Adds a service tag rule to communicate with Azure Data Factory.

    > [!IMPORTANT]
    > * Adding an outbound for a service tag or FQDN is only valid when the managed VNet is configured to `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.
    > * If you add outbound rules, Microsoft can't guarantee data exfiltration.

    > [!WARNING]
    > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

    ```python
    # Basic managed VNet configuration
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

    # Example FQDN rule
    ws.managed_network.outbound_rules.append(
        FqdnDestination(
            name="fqdnrule", 
            destination="pypi.org"
        )
    )

    # Create the workspace
    ws = ml_client.workspaces.begin_create(ws).result()
    ```

* __Update an existing workspace__:

    [!INCLUDE [managed-vnet-update](includes/managed-vnet-update.md)]

    The following example demonstrates how to create a managed VNet for an existing Azure Machine Learning workspace named `myworkspace`. The example also adds several outbound rules for the managed VNet:

    * `myrule` - Adds a private endpoint for an Azure Blob store.
    * `datafactory` - Adds a service tag rule to communicate with Azure Data Factory.

    > [!TIP]
    > Adding an outbound for a service tag or FQDN is only valid when the managed VNet is configured to `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.

    > [!WARNING]
    > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).
    
    ```python
    # Get the existing workspace
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myworkspace")
    ws = ml_client.workspaces.get()

    # Basic managed VNet configuration
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

    # Example FQDN rule
    ws.managed_network.outbound_rules.append(
        FqdnDestination(
            name="fqdnrule", 
            destination="pypi.org"
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
    
        :::image type="content" source="./media/how-to-managed-network/use-managed-network-approved-outbound.png" alt-text="Screenshot of creating a workspace with an approved outbound managed VNet." lightbox="./media/how-to-managed-network/use-managed-network-approved-outbound.png":::

    1. To add an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the following information:
    
        * __Rule name__: A name for the rule. The name must be unique for this workspace.
        * __Destination type__: Private Endpoint, Service Tag, or FQDN. Service Tag and FQDN are only available when the network isolation is private with approved outbound.

        If the destination type is __Private Endpoint__, provide the following information:

        * __Subscription__: The subscription that contains the Azure resource you want to add a private endpoint for.
        * __Resource group__: The resource group that contains the Azure resource you want to add a private endpoint for.
        * __Resource type__: The type of the Azure resource.
        * __Resource name__: The name of the Azure resource.
        * __Sub Resource__: The sub resource of the Azure resource type.
        * __Spark enabled__: Select this option if you want to enable serverless Spark jobs for the workspace. This option is only available if the resource type is Azure Storage.

        > [!TIP]
        > Azure Machine Learning managed VNet doesn't support creating a private endpoint to all Azure resource types. For a list of supported resources, see the [Private endpoints](#private-endpoints) section.

        :::image type="content" source="./media/how-to-managed-network/outbound-rule-private-endpoint.png" alt-text="Screenshot of updating an approved outbound network by adding a private endpoint." lightbox="./media/how-to-managed-network/outbound-rule-private-endpoint.png":::

        If the destination type is __Service Tag__, provide the following information:

        * __Service tag__: The service tag to add to the approved outbound rules.
        * __Protocol__: The protocol to allow for the service tag.
        * __Port ranges__: The port ranges to allow for the service tag.

        :::image type="content" source="./media/how-to-managed-network/outbound-rule-service-tag.png" alt-text="Screenshot of updating an approved outbound network by adding a service tag." lightbox="./media/how-to-managed-network/outbound-rule-service-tag.png" :::

        If the destination type is __FQDN__, provide the following information:

        > [!WARNING]
        > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

        * __FQDN destination__: The fully qualified domain name to add to the approved outbound rules.

        :::image type="content" source="./media/how-to-managed-network/outbound-rule-fqdn.png" alt-text="Screenshot of updating an approved outbound network by adding an FQDN rule for an approved outbound managed VNet." lightbox="./media/how-to-managed-network/outbound-rule-fqdn.png":::

        Select __Save__ to save the rule. You can continue using __Add user-defined outbound rules__ to add rules.

    1. Continue creating the workspace as normal.

* __Update an existing workspace__:

    [!INCLUDE [managed-vnet-update](includes/managed-vnet-update.md)]

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace that you want to enable managed VNet isolation for.
    1. Select __Networking__, then select __Private with Approved Outbound__.
    
        :::image type="content" source="./media/how-to-managed-network/update-managed-network-approved-outbound.png" alt-text="Screenshot of updating a workspace to managed VNet with approved outbound." lightbox="./media/how-to-managed-network/update-managed-network-approved-outbound.png":::

        * To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the same information as when creating a workspace in the previous 'Create a new workspace' section.

        * To __delete__ an outbound rule, select __delete__ for the rule.

            :::image type="content" source="./media/how-to-managed-network/delete-outbound-rule.png" alt-text="Screenshot of the delete rule icon for an approved outbound managed VNet.":::

    1. Select __Save__ at the top of the page to save the changes to the managed VNet.

---


## Configure for serverless Spark jobs

> [!TIP]
> The steps in this section are only needed if you plan to submit __serverless Spark jobs__. If you aren't going to be submitting serverless Spark jobs, you can skip this section.

To enable the [serverless Spark jobs](how-to-submit-spark-jobs.md) for the managed VNet, you must perform the following actions:

* Configure a managed VNet for the workspace and add an outbound private endpoint for the Azure Storage Account.
* After you configure the managed VNet, provision it and flag it to allow Spark jobs.

1. Configure an outbound private endpoint.

    # [Azure CLI](#tab/azure-cli)

    Use a YAML file to define the managed VNet configuration and add a private endpoint for the Azure Storage Account. Also set `spark_enabled: true`:

    > [!TIP]
    > This example is for a managed VNet configured using `isolation_mode: allow_internet_outbound` to allow internet traffic.  If you want to allow only approved outbound traffic to enable data exfiltration protection (DEP), use `isolation_mode: allow_only_approved_outbound`.

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

    > [!NOTE]
    > - When data exfiltration protection (DEP) is enabled, conda package dependencies defined in Spark session configuration will fail to install. To resolve this problem, upload a self-contained Python package wheel with no external dependencies to an Azure storage account and create private endpoint to this storage account. Use the path to Python package wheel as `py_files` parameter in your Spark job.
    > - If the workspace was created with `isolation_mode: allow_internet_outbound`, it can not be updated later to use `isolation_mode: allow_only_approved_outbound`.

    # [Python SDK](#tab/python)

    The following example demonstrates how to create a managed VNet for an existing Azure Machine Learning workspace named `myworkspace`. It also adds a private endpoint for the Azure Storage Account and sets `spark_enabled=true`:

    > [!TIP]
    > The following example is for a managed VNet configured using `IsolationMode.ALLOW_INTERNET_OUTBOUND` to allow internet traffic. If you want to allow only approved outbound traffic to enable data exfiltration protection (DEP), use `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.  
        
    ```python
    # Get the existing workspace
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myworkspace")
    ws = ml_client.workspaces.get()

    # Basic managed VNet configuration
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
    > [!NOTE]
    > - When data exfiltration protection (DEP) is enabled, conda package dependencies defined in Spark session configuration will fail to install. To resolve this problem, upload a self-contained Python package wheel with no external dependencies to an Azure storage account and create private endpoint to this storage account. Use the path to Python package wheel as `py_files` parameter in the Spark job.
    > - If the workspace was created with `IsolationMode.ALLOW_INTERNET_OUTBOUND`, it can not be updated later to use `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`. 


    # [Azure portal](#tab/portal)

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace.
    2. Select __Networking__, then select __Add user-defined outbound rules__. Add a rule for the Azure Storage Account, and make sure that __Spark enabled__ is selected.
    
        :::image type="content" source="./media/how-to-managed-network/add-outbound-spark-enabled.png" alt-text="Screenshot of an endpoint rule with Spark enabled selected." lightbox="./media/how-to-managed-network/add-outbound-spark-enabled.png":::

    3. Select __Save__ to save the rule, then select __Save__ from the top of __Networking__ to save the changes to the manged virtual network.

    ---

2. Provision the managed VNet.

    > [!NOTE]
    > If your workspace is already configured for a public endpoint (for example, with an Azure Virtual Network), and has [public network access enabled](how-to-configure-private-link.md#enable-public-access), you must disable it before provisioning the managed VNet. If you don't disable public network access when provisioning the managed VNet, the private endpoints for the managed endpoint may not be created successfully.

    # [Azure CLI](#tab/azure-cli)

    The following example shows how to provision a managed VNet for serverless Spark jobs by using the `--include-spark` parameter.

    ```azurecli
    az ml workspace provision-network -g my_resource_group -n my_workspace_name --include-spark
    ```

    # [Python SDK](#tab/python)

    The following example shows how to provision a managed VNet for serverless Spark jobs:

    ```python
    # Connect to a workspace named "myworkspace"
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace_name="myworkspace")

    # whether to provision Spark vnet as well
    include_spark = True

    provision_network_result = ml_client.workspaces.begin_provision_network(workspace_name=ws_name, include_spark=include_spark).result()
    ```

    # [Azure portal](#tab/portal)

    Use the __Azure CLI__ or __Python SDK__ tabs to learn how to manually provision the managed VNet with serverless Spark support.

    --- 

## Manually provision a managed VNet

The managed VNet is automatically provisioned when you create a compute resource. When you rely on automatic provisioning, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network. If you configured FQDN outbound rules (only available with allow only approved mode), the first FQDN rule adds around __10 minutes__ to the provisioning time. 

To reduce the wait time when someone attempts to create the first compute, you can manually provision the managed VNet after creating the workspace without creating a compute resource:

> [!NOTE]
> If your workspace is already configured for a public endpoint (for example, with an Azure Virtual Network), and has [public network access enabled](how-to-configure-private-link.md#enable-public-access), you must disable it before provisioning the managed VNet. If you don't disable public network access when provisioning the managed VNet, the private endpoints for the managed endpoint may not be created successfully.

# [Azure CLI](#tab/azure-cli)

The following example shows how to provision a managed VNet.

> [!TIP]
> If you plan to submit serverless Spark jobs, add the `--include-spark` parameter.

```azurecli
az ml workspace provision-network -g my_resource_group -n my_workspace_name
```

# [Python SDK](#tab/python)

The following example shows how to provision a managed VNet:

```python
# Connect to a workspace named "myworkspace"
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace_name="myworkspace")

# whether to provision Spark vnet as well
include_spark = True

provision_network_result = ml_client.workspaces.begin_provision_network(workspace_name=ws_name, include_spark=include_spark).result()
```

# [Azure portal](#tab/portal)

Use the __Azure CLI__ or __Python SDK__ tabs to learn how to manually provision the managed VNet with serverless Spark support.

--- 

## Configure image builds

When the Azure Container Registry for your workspace is behind a virtual network, it can't be used to directly build Docker images. Instead, configure your workspace to use a compute cluster or compute instance to build images.

> [!IMPORTANT]
> The compute resource used to build Docker images needs to be able to access the package repositories that are used to train and deploy your models. If you're using a network configured to allow only approved outbound, you may need to add [rules that allow access to public repos](#scenario-access-public-machine-learning-packages) or [use private Python packages](concept-vulnerability-management.md#using-a-private-package-repository).

# [Azure CLI](#tab/azure-cli)

To update a workspace to use a compute cluster or compute instance to build Docker images, use the `az ml workspace update` command with the `--image-build-compute` parameter:

```azurecli
az ml workspace update --name ws --resource-group rg --image-build-compute mycompute
```

# [Python SDK](#tab/python)

The following example demonstrates how to update a workspace to use a compute cluster to build images:

```python
# import required libraries
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

subscription_id = "<your subscription ID>"
resource_group = "<your resource group name>"
workspace = "<your workspace name>"

ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace
)

# Get workspace info
ws=ml_client.workspaces.get(name=workspace)
# Update to use cpu-cluster for image builds
ws.image_build_compute="mycompute"
ml_client.workspaces.begin_update(ws)
# To switch back to using ACR to build (if ACR is not in the virtual network):
# ws.image_build_compute = ''
# ml_client.workspaces.begin_update(ws)
```

# [Azure portal](#tab/portal)

Currently there isn't a way to set the image build compute from the Azure portal. Use the __Azure CLI__ or __Python SDK__ tabs to learn how to manually configure image builds.

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

1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure Machine Learning workspace that you want to enable managed VNet isolation for.
1. Select __Networking__. The __Workspace Outbound access__ section allows you to manage outbound rules.

    :::image type="content" source="./media/how-to-managed-network/manage-outbound-rules.png" alt-text="Screenshot of the outbound rules section." lightbox="./media/how-to-managed-network/manage-outbound-rules.png":::

* To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the following information:

* To __enable__ or __disable__ a rule, use the toggle in the __Active__ column.

* To __delete__ an outbound rule, select __delete__ for the rule.

---

## List of required rules

> [!TIP]
> These  rules are automatically added to the managed VNet.

__Private endpoints__:
* When the isolation mode for the managed VNet is `Allow internet outbound`, private endpoint outbound rules are automatically created as required rules from the managed VNet for the workspace and associated resources __with public network access disabled__ (Key Vault, Storage Account, Container Registry, Azure Machine Learning workspace).
* When the isolation mode for the managed VNet is `Allow only approved outbound`, private endpoint outbound rules are automatically created as required rules from the managed VNet for the workspace and associated resources __regardless of public network access mode for those resources__ (Key Vault, Storage Account, Container Registry, Azure Machine Learning workspace).

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

## List of scenario specific outbound rules

### Scenario: Access public machine learning packages

To allow installation of __Python packages for training and deployment__, add outbound _FQDN_ rules to allow traffic to the following host names:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing.For more information, see [Pricing](#pricing).

[!INCLUDE [recommended outbound](includes/recommended-network-outbound.md)]

### Scenario: Use Visual Studio Code desktop or web with compute instance

If you plan to use __Visual Studio Code__ with Azure Machine Learning, add outbound _FQDN_ rules to allow traffic to the following hosts:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

* `*.vscode.dev`
* `vscode.blob.core.windows.net`
* `*.gallerycdn.vsassets.io`
* `raw.githubusercontent.com`
* `*.vscode-unpkg.net`
* `*.vscode-cdn.net`
* `*.vscodeexperiments.azureedge.net`
* `default.exp-tas.com`
* `code.visualstudio.com`
* `update.code.visualstudio.com`
* `*.vo.msecnd.net`
* `marketplace.visualstudio.com`

### Scenario: Use batch endpoints

If you plan to use __Azure Machine Learning batch endpoints__ for deployment, add outbound _private endpoint_ rules to allow traffic to the following sub resources for the default storage account:

* `queue`
* `table`

### Scenario: Use prompt flow with Azure Open AI, content safety, and Azure AI Search

* Private endpoint to Azure AI Services
* Private endpoint to Azure AI Search

### Scenario: Use HuggingFace models

If you plan to use __HuggingFace models__ with Azure Machine Learning, add outbound _FQDN_ rules to allow traffic to the following hosts:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

* `docker.io`
* `*.docker.io`
* `*.docker.com`
* `production.cloudflare.docker.com`
* `cdn.auth0.com`
* `cdn-lfs.huggingface.co`

## Private endpoints

Private endpoints are currently supported for the following Azure services:

* Azure Machine Learning
* Azure Machine Learning registries
* Azure Storage (all sub resource types)
* Azure Container Registry
* Azure Key Vault
* Azure AI services
* Azure AI Search (formerly Cognitive Search)
* Azure SQL Server
* Azure Data Factory
* Azure Cosmos DB (all sub resource types)
* Azure Event Hubs
* Azure Redis Cache
* Azure Databricks
* Azure Database for MariaDB
* Azure Database for PostgreSQL
* Azure Database for MySQL
* Azure SQL Managed Instance

When you create a private endpoint, you provide the _resource type_ and _subresource_ that the endpoint connects to. Some resources have multiple types and subresources. For more information, see [what is a private endpoint](/azure/private-link/private-endpoint-overview).

When you create a private endpoint for Azure Machine Learning dependency resources, such as Azure Storage, Azure Container Registry, and Azure Key Vault, the resource can be in a different Azure subscription. However, the resource must be in the same tenant as the Azure Machine Learning workspace.

> [!IMPORTANT]
> When configuring private endpoints for an Azure Machine Learning managed VNet, the private endpoints are only created when created when the first _compute is created_ or when managed VNet provisioning is forced. For more information on forcing the managed VNet provisioning, see [Configure for serverless Spark jobs](#manually-provision-a-managed-vnet).

## Pricing

The Azure Machine Learning managed VNet feature is free. However, you're charged for the following resources that are used by the managed VNet:

* Azure Private Link - Private endpoints used to secure communications between the managed VNet and Azure resources relies on Azure Private Link. For more information on pricing, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
* FQDN outbound rules - FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. The Azure Firewall (standard SKU) is provisioned by Azure Machine Learning.

    > [!IMPORTANT]
    > The firewall isn't created until you add an outbound FQDN rule. If you don't use FQDN rules, you will not be charged for Azure Firewall. For more information on pricing, see [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/) and view prices for the _standard_ version.

## Limitations

* Once you enable managed VNet isolation of your workspace, you can't disable it.
* Managed VNet uses private endpoint connection to access your private resources. You can't have a private endpoint and a service endpoint at the same time for your Azure resources, such as a storage account. We recommend using private endpoints in all scenarios.
* The managed VNet is deleted when the workspace is deleted. 
* Data exfiltration protection is automatically enabled for the only approved outbound mode. If you add other outbound rules, such as to FQDNs, Microsoft can't guarantee that you're protected from data exfiltration to those outbound destinations.
* Creating a compute cluster in a different region than the workspace isn't supported when using a managed VNet.
* Kubernetes and attached VMs aren't supported in an Azure Machine Learning managed VNet.

### Migration of compute resources

If you have an existing workspace and want to enable managed VNet for it, there's currently no supported migration path for existing manged compute resources. You'll need to delete all existing managed compute resources and recreate them after enabling the managed VNet. The following list contains the compute resources that must be deleted and recreated:

* Compute cluster
* Compute instance
* Kubernetes clusters
* Managed online endpoints

## Next steps

* [Troubleshoot managed VNet](how-to-troubleshoot-managed-network.md)
* [Configure managed computes in a managed VNet](how-to-managed-network-compute.md)
