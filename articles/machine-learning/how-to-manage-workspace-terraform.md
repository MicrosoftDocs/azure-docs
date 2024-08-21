---
title: Create workspaces by using Terraform
titleSuffix: Azure Machine Learning
description: Learn how to create Azure Machine Learning workspaces with public or private connectivity by using Terraform.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: enterprise-readiness
ms.custom: devx-track-terraform
ms.author: larryfr
author: Blackmist
ms.reviewer: deeikele
ms.date: 06/25/2024
ms.topic: how-to
ms.tool: terraform
---

# Manage Azure Machine Learning workspaces by using Terraform

In this article, you learn how to create an Azure Machine Learning workspace by using Terraform configuration files. [Terraform](/azure/developer/terraform/) template-based configuration files enable you to define, create, and configure Azure resources in a repeatable and predictable manner. Terraform tracks resource state and can clean up and destroy resources.

A Terraform configuration file is a document that defines the resources needed for a deployment. The Terraform configuration can also specify deployment variables to use to provide input values when you apply the configuration.

## Prerequisites

- An Azure subscription with a free or paid version of Azure Machine Learning. If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).
- Terraform installed and configured according to the instructions in [Quickstart: Install and configure Terraform](/azure/developer/terraform/quickstart-configure).
<!--- [Azure CLI](/cli/azure/install-azure-cli) installed.-->

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

- The following limitation applies to the Application Insights instance created during workspace creation:

  [!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

## Create the workspace

Create a file named *main.tf* that has the following code.

:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/main.tf":::

Declare the Azure provider in a file named *providers.tf* that has the following code.

:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/providers.tf":::

### Configure the workspace

To create an Azure Machine Learning workspace, use one of the following Terraform configurations. An Azure Machine Learning workspace requires various other services as dependencies. The template specifies these [associated resources](./concept-workspace.md#associated-resources). Depending on your needs, you can choose to use a template that creates resources with either public or private network connectivity.

> [!NOTE]
> Some resources in Azure require globally unique names. Before deploying your resources, make sure to set `name` variables to unique values.

# [Public network](#tab/publicworkspace)

The following configuration creates a workspace with public network connectivity.

Define the following variables in a file called *variables.tf*.

:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/variables.tf":::

Define the following workspace configuration in a file called *workspace.tf*:

:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/workspace.tf":::

# [Private network](#tab/privateworkspace)

The following configuration creates a workspace in an isolated network environment by using Azure Private Link endpoints. The template includes [private Domain Name System (DNS) zones](../dns/private-dns-privatednszone.md) to resolve domain names within the virtual network.

If you use private link endpoints for both Azure Container Registry and Azure Machine Learning, you can't use Container Registry tasks for building [environment](/python/api/azure-ai-ml/azure.ai.ml.entities.environment) images. Instead you must build images by using an Azure Machine Learning compute cluster.

To configure the cluster name to use, set the [image_build_compute_name](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace) argument. You can also [allow public access](./how-to-configure-private-link.md?tabs=python#enable-public-access) to a workspace that has a private link endpoint by using the [public_network_access_enabled](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace) argument.

Define the following variables in a file called *variables.tf*.

:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-moderately-secure/variables.tf":::

Define the following workspace configuration in a file called *workspace.tf*:

:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-moderately-secure/workspace.tf":::

Define the following network configuration in a file called *network.tf*:

```terraform
# Virtual network
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
```

- For a full reference, see [201: Machine learning workspace, compute, and a set of network components for network isolation](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf).
- To learn more about how to connect to your private link endpoint workspace, see [Securely connect to your workspace](./how-to-secure-workspace-vnet.md#securely-connect-to-your-workspace).

---

## Create and apply the plan

To create the workspace, run the following code:

```terraform
terraform init

terraform plan \
        # -var <any of the variables set in variables.tf> \
          -out demo.tfplan

terraform apply "demo.tfplan"
```

## Troubleshoot resource provider errors

[!INCLUDE [machine-learning-resource-provider](includes/machine-learning-resource-provider.md)]

## Related resources

- To learn more about Terraform support on Azure, see [Terraform on Azure documentation](/azure/developer/terraform/).
- For details on the Terraform Azure provider and Machine Learning module, see [Terraform Registry Azure Resource Manager provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace).
- To find quickstart template examples for Terraform, see the following [Azure Terraform quickstart templates](https://github.com/Azure/terraform/tree/master/quickstart).
  
  - [101: Machine learning workspace and compute](https://github.com/Azure/terraform/tree/master/quickstart/101-machine-learning) provides the minimal set of resources needed to get started with Azure Machine Learning.
  - [201: Machine learning workspace, compute, and a set of network components for network isolation](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure) provides all resources needed to create a production-pilot environment for use with high business impact (HBI) data.
  - [202: Similar to 201, but with the option to bring existing network components](https://github.com/Azure/terraform/tree/master/quickstart/202-machine-learning-moderately-secure-existing-VNet).
  - [301: Machine Learning workspace (secure hub and spoke with firewall)](https://github.com/azure/terraform/tree/master/quickstart/301-machine-learning-hub-spoke-secure).
  
- To learn more about network configuration options, see [Secure Azure Machine Learning workspace resources using virtual networks](./how-to-network-security-overview.md).
- For alternative Azure Resource Manager template-based deployments, see [Deploy resources with Resource Manager templates and Resource Manager REST API](/azure/azure-resource-manager/templates/deploy-rest).
- For information on how to keep your Azure Machine Learning workspace up to date with the latest security updates, see [Vulnerability management](concept-vulnerability-management.md).
