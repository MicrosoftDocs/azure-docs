---
title: Manage workspaces by using Terraform
titleSuffix: Azure Machine Learning
description: Learn how to create and manage Azure Machine Learning workspaces by using Terraform.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: devx-track-terraform
ms.author: deeikele
author: denniseik
ms.reviewer: larryfr
ms.date: 06/14/2024
ms.topic: how-to
ms.tool: terraform
---

# Manage Azure Machine Learning workspaces by using Terraform

In this article, you learn how to create and manage an Azure Machine Learning workspace using Terraform configuration files. [Terraform](/azure/developer/terraform/) template-based configuration files enable you to define, create, and configure Azure resources in a repeatable and predictable manner. Terraform tracks resource state and can clean up and destroy resources.

A Terraform configuration is a document that defines the resources needed for a deployment. The configuration can also specify deployment variables you can use to provide input values when you use the configuration.

## Prerequisites

- An Azure subscription with a free or paid version of Azure Machine Learning. If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) installed.
- Terraform configured according to the instructions in this article and in [Configure Terraform in Azure Cloud Shell with Bash](/azure/developer/terraform/get-started-cloud-shell).

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

- The following limitation applies to the Application Insights instance created during workspace creation:

  [!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

## Declare the Azure provider

Create the Terraform configuration file that declares the Azure provider:

1. In a Bash shell, create a new file named *main.tf*.

   ```bash
   code main.tf
   ```

1. Paste the following code into the editor:

   :::code language="terraform" source="~/terraform/quickstart/101-machine-learning/main.tf":::

1. Save the file by pressing Ctrl+S and exit the editor by pressing Ctrl+Q.

## Deploy a workspace

Use one of the following Terraform configurations to create an Azure Machine Learning workspace. An Azure Machine Learning workspace requires various other services as dependencies. The template also specifies these [dependent associated resources](./concept-workspace.md#associated-resources). Depending on your needs, you can choose to use a template that creates resources with either public or private network connectivity.

# [Public network](#tab/publicworkspace)

The following configuration crates a workspace with public network connectivity.
<!-- Some resources in Azure require globally unique names. Before deploying your resources using the following templates, set the `name` variable to a value that is unique.-->

Define the following variables in a file called *variables.tf*.

:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/variables.tf":::

Define the following workspace configuration in a file called *workspace.tf*:

:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/workspace.tf":::

# [Private network](#tab/privateworkspace)

The following configuration creates a workspace in an isolated network environment by using Azure Private Link endpoints. The template includes [private DNS zones](../dns/private-dns-privatednszone.md) to resolve domain names within the virtual network.
<!-- Some resources in Azure require globally unique names. Before deploying your resources using the following templates, set the `resourceprefix` variable to a value that is unique.-->

If you use private link endpoints for both Azure Container Registry and Azure Machine Learning, you can't use Container Registry tasks for building [environment](/python/api/azure-ai-ml/azure.ai.ml.entities.environment) images. Instead you can build images by using an Azure Machine Learning compute cluster.

To configure the cluster name to use, set the [image_build_compute_name](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace) argument. You can also [allow public access](./how-to-configure-private-link.md?tabs=python#enable-public-access) to a workspace that has a private link endpoint by using the [public_network_access_enabled](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace) argument.

Define the following variables in a file called *variables.tf*.

:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-moderately-secure/variables.tf":::

Define the following workspace configuration in a file called *workspace.tf*:

:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-moderately-secure/workspace.tf":::

Define the following network configuration in a file called *network.tf*:

```terraform
# Virtual Network
resource "azurerm_virtual_network" "default" {
  name                = "vnet-${var.name}-${var.environment}"
  address_space       = var.vnet_address_space
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name
}

resource "azurerm_subnet" "snet-training" {
  name                                           = "snet-training"
  resource_group_name                            = azurerm_resource_group.default.name
  virtual_network_name                           = azurerm_virtual_network.default.name
  address_prefixes                               = var.training_subnet_address_space
  enforce_private_link_endpoint_network_policies = true
}

resource "azurerm_subnet" "snet-aks" {
  name                                           = "snet-aks"
  resource_group_name                            = azurerm_resource_group.default.name
  virtual_network_name                           = azurerm_virtual_network.default.name
  address_prefixes                               = var.aks_subnet_address_space
  enforce_private_link_endpoint_network_policies = true
}

resource "azurerm_subnet" "snet-workspace" {
  name                                           = "snet-workspace"
  resource_group_name                            = azurerm_resource_group.default.name
  virtual_network_name                           = azurerm_virtual_network.default.name
  address_prefixes                               = var.ml_subnet_address_space
  enforce_private_link_endpoint_network_policies = true
}

# ...
# For a full reference, see: https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf
```

To learn more about the options to connect to your private link endpoint workspace, see [Securely connect to your workspace](./how-to-secure-workspace-vnet.md#securely-connect-to-your-workspace).

---

## Troubleshoot resource provider errors

[!INCLUDE [machine-learning-resource-provider](includes/machine-learning-resource-provider.md)]

## Related resources

- To learn more about Terraform support on Azure, see [Terraform on Azure documentation](/azure/developer/terraform/).
- For details on the Terraform Azure provider and Machine Learning module, see [Terraform Registry Azure Resource Manager Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace).
- To find quickstart template examples for Terraform, see [Azure Terraform QuickStart Templates](https://github.com/Azure/terraform/tree/master/quickstart).
  
  - [101: Machine learning workspace and compute](https://github.com/Azure/terraform/tree/master/quickstart/101-machine-learning) – the minimal set of resources needed to get started with Azure Machine Learning.
  - [201: Machine learning workspace, compute, and a set of network components for network isolation](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure) – all resources that are needed to create a production-pilot environment for use with HBI data.
  - [202: Similar to 201, but with the option to bring existing network components.](https://github.com/Azure/terraform/tree/master/quickstart/202-machine-learning-moderately-secure-existing-VNet).
  - [301:  Machine Learning workspace (Secure Hub and Spoke with Firewall)](https://github.com/azure/terraform/tree/master/quickstart/301-machine-learning-hub-spoke-secure).
  
- To learn more about network configuration options, see [Secure Azure Machine Learning workspace resources using virtual networks](./how-to-network-security-overview.md).
- For alternative Azure Resource Manager template-based deployments, see [Deploy resources with Resource Manager templates and Resource Manager REST API](/azure/azure-resource-manager/templates/deploy-rest).
- For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](concept-vulnerability-management.md).
