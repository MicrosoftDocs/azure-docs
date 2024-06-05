---
title: How to configure a managed network for Azure AI Studio hubs
titleSuffix: Azure AI Studio
description: Learn how to configure a managed network for Azure AI Studio hubs.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: jhirono
ms.author: larryfr
author: Blackmist
zone_pivot_groups: azure-ai-studio-sdk-cli
---

# How to configure a managed network for Azure AI Studio hubs

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

We have two network isolation aspects. One is the network isolation to access an Azure AI Studio hub. Another is the network isolation of computing resources for both your hub and project (such as compute instance, serverless and managed online endpoint.) This document explains the latter highlighted in the diagram. You can use hub built-in network isolation to protect your computing resources.

:::image type="content" source="../media/how-to/network/azure-ai-network-outbound.svg" alt-text="Diagram of hub network isolation." lightbox="../media/how-to/network/azure-ai-network-outbound.png":::

You need to configure following network isolation configurations.

- Choose network isolation mode. You have two options: allow internet outbound mode or allow only approved outbound mode.
- Create private endpoint outbound rules to your private Azure resources. Private Azure AI Search isn't supported yet. 
- If you use Visual Studio Code integration with allow only approved outbound mode, create FQDN outbound rules described in the [use Visual Studio Code](#scenario-use-visual-studio-code) section.
- If you use HuggingFace models in Models with allow only approved outbound mode, create FQDN outbound rules described in the [use HuggingFace models](#scenario-use-huggingface-models) section.

## Network isolation architecture and isolation modes

When you enable managed virtual network isolation, a managed virtual network is created for the hub. Managed compute resources you create for the hub automatically use this managed virtual network. The managed virtual network can use private endpoints for Azure resources that are used by your hub, such as Azure Storage, Azure Key Vault, and Azure Container Registry. 

There are three different configuration modes for outbound traffic from the managed virtual network:

| Outbound mode | Description | Scenarios |
| ----- | ----- | ----- |
| Allow internet outbound | Allow all internet outbound traffic from the managed virtual network. | You want unrestricted access to machine learning resources on the internet, such as python packages or pretrained models.<sup>1</sup> |
| Allow only approved outbound | Outbound traffic is allowed by specifying service tags. | * You want to minimize the risk of data exfiltration, but you need to prepare all required machine learning artifacts in your private environment.</br>* You want to configure outbound access to an approved list of services, service tags, or FQDNs. |
| Disabled | Inbound and outbound traffic isn't restricted. | You want public inbound and outbound from the hub. |

<sup>1</sup> You can use outbound rules with _allow only approved outbound_ mode to achieve the same result as using allow internet outbound. The differences are:

* Always use private endpoints to access Azure resources. 

    > [!IMPORTANT]
    > While you can create a private endpoint for Azure AI Search, the connected services must allow public networking. For more information, see [Connectivity to other services](#connectivity-to-other-services).

* You must add rules for each outbound connection you need to allow.
* Adding FQDN outbound rules __increase your costs__ as this rule type uses Azure Firewall.
* The default rules for _allow only approved outbound_ are designed to minimize the risk of data exfiltration. Any outbound rules you add might increase your risk.

The managed virtual network is preconfigured with [required default rules](#list-of-required-rules). It's also configured for private endpoint connections to your hub, the hub's default storage, container registry, and key vault if they're configured as private or the hub isolation mode is set to allow only approved outbound. After choosing the isolation mode, you only need to consider other outbound requirements you might need to add.

The following diagram shows a managed virtual network configured to __allow internet outbound__:

:::image type="content" source="../media/how-to/network/internet-outbound.svg" alt-text="Diagram of managed virtual network isolation configured for internet outbound." lightbox="../media/how-to/network/internet-outbound.png":::

The following diagram shows a managed virtual network configured to __allow only approved outbound__:

> [!NOTE]
> In this configuration, the storage, key vault, and container registry used by the hub are flagged as private. Since they are flagged as private, a private endpoint is used to communicate with them.

:::image type="content" source="../media/how-to/network/only-approved-outbound.svg" alt-text="Diagram of managed virtual network isolation configured for allow only approved outbound." lightbox="../media/how-to/network/only-approved-outbound.png":::

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

# [Azure portal](#tab/portal)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin.

* The __Microsoft.Network__ resource provider must be registered for your Azure subscription. This resource provider is used by the hub when creating private endpoints for the managed virtual network.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

* The Azure identity you use when deploying a managed network requires the following [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) actions to create private endpoints:

    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

# [Azure CLI](#tab/azure-cli)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin.

* The __Microsoft.Network__ resource provider must be registered for your Azure subscription. This resource provider is used by the hub when creating private endpoints for the managed virtual network.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

* The Azure identity you use when deploying a managed network requires the following [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) actions to create private endpoints:

    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

* The [Azure CLI](/cli/azure/) and the `ml` extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](/azure/machine-learning/how-to-configure-cli).

* The CLI examples in this article assume that you're using the Bash (or compatible) shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about).

* The Azure CLI examples in this article use `ws` to represent the name of the hub, and `rg` to represent the name of the resource group. Change these values as needed when using the commands with your Azure subscription.

# [Python SDK](#tab/python)

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* The __Microsoft.Network__ resource provider must be registered for your Azure subscription. This resource provider is used by hub when creating private endpoints for the managed virtual network.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

* The Azure identity you use when deploying a managed network requires the following [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) actions to create private endpoints:

    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read
    * Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write

* The Azure Machine Learning Python SDK v2. For more information on the SDK, see [Install the Python SDK v2 for Azure Machine Learning](/python/api/overview/azure/ai-ml-readme).

* The examples in this article assume that your code begins with the following Python. This code imports the classes required when creating a hub with managed virtual network, sets variables for your Azure subscription and resource group, and creates the `ml_client`:

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import (
        Hub,
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

---

## Limitations

* Azure AI Studio currently doesn't support bringing your own virtual network, it only supports managed virtual network isolation.
* Once you enable managed virtual network isolation of your Azure AI, you can't disable it.
* Managed virtual network uses private endpoint connection to access your private resources. You can't have a private endpoint and a service endpoint at the same time for your Azure resources, such as a storage account. We recommend using private endpoints in all scenarios.
* The managed virtual network is deleted when the Azure AI is deleted. 
* Data exfiltration protection is automatically enabled for the only approved outbound mode. If you add other outbound rules, such as to FQDNs, Microsoft can't guarantee that you're protected from data exfiltration to those outbound destinations.
* Using FQDN outbound rules increases the cost of the managed virtual network because FQDN rules use Azure Firewall. For more information, see [Pricing](#pricing).
* FQDN outbound rules only support ports 80 and 443.
* When using a compute instance with a managed network, use the `az ml compute connect-ssh` command to connect to the compute using SSH.

### Connectivity to other services

* Azure AI Search should be public with your provisioned private Azure AI Studio hub.
* The "Add your data" feature in the Azure AI Studio playground doesn't support using a virtual network or private endpoint on the following resources:
    * Azure AI Search
    * Azure OpenAI
    * Storage resource


## Configure a managed virtual network to allow internet outbound

> [!TIP]
> The creation of the managed VNet is deferred until a compute resource is created or provisioning is manually started. When allowing automatic creation, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network.

# [Azure portal](#tab/portal)

* __Create a new hub__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and choose Azure AI Studio from Create a resource menu.
    1. Select **+ New Azure AI**.
    1. Provide the required information on the __Basics__ tab.
    1. From the __Networking__ tab, select __Private with Internet Outbound__.
    1. To add an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Outbound rules__ sidebar, provide the following information:
    
        * __Rule name__: A name for the rule. The name must be unique for this hub.
        * __Destination type__: Private Endpoint is the only option when the network isolation is private with internet outbound. Hub managed virtual network doesn't support creating a private endpoint to all Azure resource types. For a list of supported resources, see the [Private endpoints](#private-endpoints) section.
        * __Subscription__: The subscription that contains the Azure resource you want to add a private endpoint for.
        * __Resource group__: The resource group that contains the Azure resource you want to add a private endpoint for.
        * __Resource type__: The type of the Azure resource.
        * __Resource name__: The name of the Azure resource.
        * __Sub Resource__: The sub resource of the Azure resource type.

        Select __Save__ to save the rule. You can continue using __Add user-defined outbound rules__ to add rules.

    1. Continue creating the hub as normal.

* __Update an existing hub__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the hub that you want to enable managed virtual network isolation for.
    1. Select __Networking__, then select __Private with Internet Outbound__.

        * To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Outbound rules__ sidebar, provide the same information as used when creating a hub in the 'Create a new hub' section.

        * To __delete__ an outbound rule, select __delete__ for the rule.

    1. Select __Save__ at the top of the page to save the changes to the managed virtual network.

# [Azure CLI](#tab/azure-cli)

To configure a managed virtual network that allows internet outbound communications, you can use either the `--managed-network allow_internet_outbound` parameter or a YAML configuration file that contains the following entries:

```yml
managed_network:
  isolation_mode: allow_internet_outbound
```

You can also define _outbound rules_ to other Azure services that the hub relies on. These rules define _private endpoints_ that allow an Azure resource to securely communicate with the managed virtual network. The following rule demonstrates adding a private endpoint to an Azure Blob resource.

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

You can configure a managed virtual network using either the `az ml workspace create` or `az ml workspace update` commands:

* __Create a new hub__:

    The following example creates a new hub. The `--managed-network allow_internet_outbound` parameter configures a managed virtual network for the hub:

    ```azurecli
    az ml workspace create --name ws --resource-group rg --kind hub --managed-network allow_internet_outbound
    ```

    To create a hub using a YAML file instead, use the `--file` parameter and specify the YAML file that contains the configuration settings:

    ```azurecli
    az ml workspace create --file hub.yaml --resource-group rg --name ws --kind hub
    ```

    The following YAML example defines a hub with a managed virtual network:

    ```yml
    name: myhub
    location: EastUS
    managed_network:
      isolation_mode: allow_internet_outbound
    ```

* __Update an existing hub__:

    [!INCLUDE [managed-vnet-update](../../machine-learning/includes/managed-vnet-update.md)]

    The following example updates an existing hub. The `--managed-network allow_internet_outbound` parameter configures a managed virtual network for the hub:

    ```azurecli
    az ml workspace update --name ws --resource-group rg --kind hub --managed-network allow_internet_outbound
    ```

    To update an existing hub using the YAML file, use the `--file` parameter and specify the YAML file that contains the configuration settings:

    ```azurecli
    az ml workspace update --file hub.yaml --name ws --kind hub --resource-group MyGroup
    ```

    The following YAML example defines a managed virtual network for the hub. It also demonstrates how to add a private endpoint connection to a resource used by the hub; in this example, a private endpoint for a blob store:

    ```yml
    name: myhub
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

To configure a managed virtual network that allows internet outbound communications, use the `ManagedNetwork` class to define a network with `IsolationMode.ALLOW_INTERNET_OUTBOUND`. You can then use the `ManagedNetwork` object to create a new hub or update an existing one. To define _outbound rules_ to Azure services that the hub relies on, use the `PrivateEndpointDestination` class to define a new private endpoint to the service.

* __Create a new hub__:

    The following example creates a new hub named `myhub`, with an outbound rule named `myrule` that adds a private endpoint for an Azure Blob store:

    ```python
    # Basic managed VNet configuration
    network = ManagedNetwork(isolation_mode=IsolationMode.ALLOW_INTERNET_OUTBOUND)

    # Hub configuration
    ws = Hub(
        name="myhub",
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

    # Create the hub
    ws = ml_client.workspaces.begin_create(ws).result()
    ```

* __Update an existing hub__:

    The following example demonstrates how to create a managed virtual network for an existing hub named `myhub`:
    
    ```python
    # Get the existing hub
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myhub")
    ws = ml_client.workspaces.get()
    
    # Basic managed VNet configuration
    my_hub.managed_network = ManagedNetwork(isolation_mode=IsolationMode.ALLOW_INTERNET_OUTBOUND)

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

    # Update the hub
    ml_client.workspaces.begin_update(ws)
    ```
---

## Configure a managed virtual network to allow only approved outbound

> [!TIP]
> The managed VNet is automatically provisioned when you create a compute resource. When allowing automatic creation, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network. If you configured FQDN outbound rules, the first FQDN rule adds around __10 minutes__ to the provisioning time.

# [Azure portal](#tab/portal)

* __Create a new hub__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and choose Azure AI Studio from Create a resource menu.
    1. Select **+ New Azure AI**.
    1. Provide the required information on the __Basics__ tab.
    1. From the __Networking__ tab, select __Private with Approved Outbound__.

    1. To add an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Outbound rules__ sidebar, provide the following information:
    
        * __Rule name__: A name for the rule. The name must be unique for this hub.
        * __Destination type__: Private Endpoint, Service Tag, or FQDN. Service Tag and FQDN are only available when the network isolation is private with approved outbound.

        If the destination type is __Private Endpoint__, provide the following information:

        * __Subscription__: The subscription that contains the Azure resource you want to add a private endpoint for.
        * __Resource group__: The resource group that contains the Azure resource you want to add a private endpoint for.
        * __Resource type__: The type of the Azure resource.
        * __Resource name__: The name of the Azure resource.
        * __Sub Resource__: The sub resource of the Azure resource type.

        > [!TIP]
        > The hub managed VNet doesn't support creating a private endpoint to all Azure resource types. For a list of supported resources, see the [Private endpoints](#private-endpoints) section.

        If the destination type is __Service Tag__, provide the following information:

        * __Service tag__: The service tag to add to the approved outbound rules.
        * __Protocol__: The protocol to allow for the service tag.
        * __Port ranges__: The port ranges to allow for the service tag.

        If the destination type is __FQDN__, provide the following information:

        > [!WARNING]
        > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

        * __FQDN destination__: The fully qualified domain name to add to the approved outbound rules.

        Select __Save__ to save the rule. You can continue using __Add user-defined outbound rules__ to add rules.

    1. Continue creating the hub as normal.

* __Update an existing hub__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the hub that you want to enable managed virtual network isolation for.
    1. Select __Networking__, then select __Private with Approved Outbound__.

        * To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Outbound rules__ sidebar, provide the same information as when creating a hub in the previous 'Create a new hub' section.

        * To __delete__ an outbound rule, select __delete__ for the rule.

    1. Select __Save__ at the top of the page to save the changes to the managed virtual network.

# [Azure CLI](#tab/azure-cli)

To configure a managed virtual network that allows only approved outbound communications, you can use either the `--managed-network allow_only_approved_outbound` parameter or a YAML configuration file that contains the following entries:

```yml
managed_network:
  isolation_mode: allow_only_approved_outbound
```

You can also define _outbound rules_ to define approved outbound communication. An outbound rule can be created for a type of `service_tag`, `fqdn`, and `private_endpoint`. The following rule demonstrates adding a private endpoint to an Azure Blob resource, a service tag to Azure Data Factory, and an FQDN to `pypi.org`:

> [!IMPORTANT]
> * Adding an outbound for a service tag or FQDN is only valid when the managed VNet is configured to `allow_only_approved_outbound`.
> * If you add outbound rules, Microsoft can't guarantee data exfiltration.

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are added to your billing. For more information, see [Pricing](#pricing).

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

You can configure a managed virtual network using either the `az ml workspace create` or `az ml workspace update` commands:

* __Create a new hub__:

    The following example uses the `--managed-network allow_only_approved_outbound` parameter to configure the managed virtual network:

    ```azurecli
    az ml workspace create --name ws --resource-group rg --kind hub --managed-network allow_only_approved_outbound
    ```

    The following YAML file defines a hub with a managed virtual network:

    ```yml
    name: myhub
    location: EastUS
    managed_network:
      isolation_mode: allow_only_approved_outbound
    ```

    To create a hub using the YAML file, use the `--file` parameter:

    ```azurecli
    az ml workspace create --file hub.yaml --resource-group rg --name ws --kind hub
    ```

* __Update an existing hub__

    [!INCLUDE [managed-vnet-update](../../machine-learning/includes/managed-vnet-update.md)]

    The following example uses the `--managed-network allow_only_approved_outbound` parameter to configure the managed virtual network for an existing hub:

    ```azurecli
    az ml workspace update --name ws --resource-group rg --kind hub --managed-network allow_only_approved_outbound
    ```

    The following YAML file defines a managed virtual network for the hub. It also demonstrates how to add an approved outbound to the managed virtual network. In this example, an outbound rule is added for both a service tag:

    > [!WARNING]
    > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are added to your billing. For more information, see [Pricing](#pricing).

    ```yaml
    name: myhub_dep
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

To configure a managed virtual network that allows only approved outbound communications, use the `ManagedNetwork` class to define a network with `IsolationMode.ALLOw_ONLY_APPROVED_OUTBOUND`. You can then use the `ManagedNetwork` object to create a new hub or update an existing one. To define _outbound rules_, use the following classes:

| Destination | Class |
| ----------- | ----- |
| __Azure service that the hub relies on__ | `PrivateEndpointDestination` |
| __Azure service tag__ | `ServiceTagDestination` |
| __Fully qualified domain name (FQDN)__ | `FqdnDestination` |

* __Create a new hub__:

    The following example creates a new hub named `myhub`, with several outbound rules:

    * `myrule` - Adds a private endpoint for an Azure Blob store.
    * `datafactory` - Adds a service tag rule to communicate with Azure Data Factory.

    > [!IMPORTANT]
    > * Adding an outbound for a service tag or FQDN is only valid when the managed VNet is configured to `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.
    > * If you add outbound rules, Microsoft can't guarantee data exfiltration.

    > [!WARNING]
    > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are added to your billing. For more information, see [Pricing](#pricing).

    ```python
    # Basic managed VNet configuration
    network = ManagedNetwork(isolation_mode=IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND)

    # Hub configuration
    ws = Hub(
        name="myhub",
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

    # Create the hub
    ws = ml_client.workspaces.begin_create(ws).result()
    ```

* __Update an existing hub__:

    The following example demonstrates how to create a managed virtual network for an existing Azure Machine Learning hub named `myhub`. The example also adds several outbound rules for the managed virtual network:

    * `myrule` - Adds a private endpoint for an Azure Blob store.
    * `datafactory` - Adds a service tag rule to communicate with Azure Data Factory.

    > [!TIP]
    > Adding an outbound for a service tag or FQDN is only valid when the managed VNet is configured to `IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND`.

    > [!WARNING]
    > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are added to your billing. For more information, see [Pricing](#pricing).
    
    ```python
    # Get the existing hub
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, "myhub")
    ws = ml_client.workspaces.get()

    # Basic managed VNet configuration
    ws.managed_network = ManagedNetwork(isolation_mode=IsolationMode.ALLOW_ONLY_APPROVED_OUTBOUND)

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

    # Update the hub
    ml_client.workspaces.begin_update(ws)
    ```

---


## Manage outbound rules

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com), and select the hub that you want to enable managed virtual network isolation for.
1. Select __Networking__. The __Azure AI Outbound access__ section allows you to manage outbound rules.

* To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Azure AI outbound rules__ sidebar, provide the following information:

* To __enable__ or __disable__ a rule, use the toggle in the __Active__ column.

* To __delete__ an outbound rule, select __delete__ for the rule.

# [Azure CLI](#tab/azure-cli)

To list the managed virtual network outbound rules for a hub, use the following command:

```azurecli
az ml workspace outbound-rule list --workspace-name myhub --resource-group rg
```

To view the details of a managed virtual network outbound rule, use the following command:

```azurecli
az ml workspace outbound-rule show --rule rule-name --workspace-name myhub --resource-group rg
```

To remove an outbound rule from the managed virtual network, use the following command:

```azurecli
az ml workspace outbound-rule remove --rule rule-name --workspace-name myhub --resource-group rg
```

# [Python SDK](#tab/python)

The following example demonstrates how to manage outbound rules for a hub named `myhub`:

```python
# Connect to the hub
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace_name="myhub")

# Specify the rule name
rule_name = "<some-rule-name>"

# Get a rule by name
rule = ml_client._workspace_outbound_rules.get(resource_group, ws_name, rule_name)

# List rules for a hub
rule_list = ml_client._workspace_outbound_rules.list(resource_group, ws_name)

# Delete a rule from a hub
ml_client._workspace_outbound_rules.begin_remove(resource_group, ws_name, rule_name).result()
```

---

## List of required rules

> [!TIP]
> These  rules are automatically added to the managed VNet.

__Private endpoints__:
* When the isolation mode for the managed virtual network is `Allow internet outbound`, private endpoint outbound rules are automatically created as required rules from the managed virtual network for the hub and associated resources __with public network access disabled__ (Key Vault, Storage Account, Container Registry, hub).
* When the isolation mode for the managed virtual network is `Allow only approved outbound`, private endpoint outbound rules are automatically created as required rules from the managed virtual network for the hub and associated resources __regardless of public network access mode for those resources__ (Key Vault, Storage Account, Container Registry, hub).

__Outbound__ service tag rules:

* `AzureActiveDirectory`
* `Azure Machine Learning`
* `BatchNodeManagement.region`
* `AzureResourceManager`
* `AzureFrontDoor.FirstParty`
* `MicrosoftContainerRegistry`
* `AzureMonitor`

__Inbound__ service tag rules:
* `AzureMachineLearning`

## List of scenario specific outbound rules

### Scenario: Access public machine learning packages

To allow installation of __Python packages for training and deployment__, add outbound _FQDN_ rules to allow traffic to the following host names:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing.For more information, see [Pricing](#pricing).

> [!NOTE]
> This is not a complete list of the hosts required for all Python resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| __Host name__ | __Purpose__ |
| ---- | ---- |
| `anaconda.com`<br>`*.anaconda.com` | Used to install default packages. |
| `*.anaconda.org` | Used to get repo data. |
| `pypi.org` | Used to list dependencies from the default index, if any, and the index isn't overwritten by user settings. If the index is overwritten, you must also allow `*.pythonhosted.org`. |
| `pytorch.org`<br>`*.pytorch.org` | Used by some examples based on PyTorch. |
| `*.tensorflow.org` | Used by some examples based on Tensorflow. |

### Scenario: Use Visual Studio Code
Visual Studio Code relies on specific hosts and ports to establish a remote connection.

#### Hosts
If you plan to use __Visual Studio Code__ with the hub, add outbound _FQDN_ rules to allow traffic to the following hosts:

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
* `pkg-containers.githubusercontent.com`
* `github.com`

#### Ports
You must allow network traffic to ports 8704 to 8710. The VS Code server dynamically selects the first available port within this range.

### Scenario: Use HuggingFace models

If you plan to use __HuggingFace models__ with the hub, add outbound _FQDN_ rules to allow traffic to the following hosts:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

* docker.io
* *.docker.io
* *.docker.com
* production.cloudflare.docker.com
* cnd.auth0.com
* cdn-lfs.huggingface.co

## Private endpoints

Private endpoints are currently supported for the following Azure services:

* AI Studio hub
* Azure Machine Learning
* Azure Machine Learning registries
* Azure Storage (all sub resource types)
* Azure Container Registry
* Azure Key Vault
* Azure AI services
* Azure AI Search
* Azure SQL Server
* Azure Data Factory
* Azure Cosmos DB (all sub resource types)
* Azure Event Hubs
* Azure Redis Cache
* Azure Databricks
* Azure Database for MariaDB
* Azure Database for PostgreSQL Single Server
* Azure Database for MySQL
* Azure SQL Managed Instance
* Azure API Management

> [!IMPORTANT]
> While you can create a private endpoint for Azure AI services and Azure AI Search, the connected services must allow public networking. For more information, see [Connectivity to other services](#connectivity-to-other-services).

When you create a private endpoint, you provide the _resource type_ and _subresource_ that the endpoint connects to. Some resources have multiple types and subresources. For more information, see [what is a private endpoint](/azure/private-link/private-endpoint-overview).

When you create a private endpoint for hub dependency resources, such as Azure Storage, Azure Container Registry, and Azure Key Vault, the resource can be in a different Azure subscription. However, the resource must be in the same tenant as the hub.

A private endpoint is automatically created for a connection if the target resource is an Azure resource listed above. A valid target ID is expected for the private endpoint. A valid target ID for the connection can be the Azure Resource Manager ID of a parent resource. The target ID is also expected in the target of the connection or in `metadata.resourceid`. For more on connections, see [How to add a new connection in Azure AI Studio](connections-add.md).

## Pricing

The hub managed virtual network feature is free. However, you're charged for the following resources that are used by the managed virtual network:

* Azure Private Link - Private endpoints used to secure communications between the managed virtual network and Azure resources relies on Azure Private Link. For more information on pricing, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
* FQDN outbound rules - FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. Azure Firewall SKU is standard. Azure Firewall is provisioned per hub.

    > [!IMPORTANT]
    > The firewall isn't created until you add an outbound FQDN rule. If you don't use FQDN rules, you will not be charged for Azure Firewall. For more information on pricing, see [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/).

## Related content

- [Create AI Studio hub and project using the SDK](./develop/create-hub-project-sdk.md)
