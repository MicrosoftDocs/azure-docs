---
title: Manage workspaces using Terraform
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning workspaces using Terraform.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: devx-track-terraform
ms.author: deeikele
author: denniseik
ms.reviewer: larryfr
ms.date: 06/05/2023
ms.topic: how-to
ms.tool: terraform
---

# Manage Azure Machine Learning workspaces using Terraform

In this article, you learn how to create and manage an Azure Machine Learning workspace using Terraform configuration files. [Terraform](/azure/developer/terraform/)'s template-based configuration files enable you to define, create, and configure Azure resources in a repeatable and predictable manner. Terraform tracks resource state and is able to clean up and destroy resources. 

A Terraform configuration is a document that defines the resources that are needed for a deployment. It may also specify deployment variables. Variables are used to provide input values when using the configuration.

## Prerequisites

* An **Azure subscription**. If you don't have one, try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An installed version of the [Azure CLI](/cli/azure/).
* Configure Terraform: follow the directions in this article and the [Terraform and configure access to Azure](/azure/developer/terraform/get-started-cloud-shell) article.

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

[!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

## Declare the Azure provider

Create the Terraform configuration file that declares the Azure provider:

1. Create a new file named `main.tf`. If working with Azure Cloud Shell, use bash:

    ```bash
    code main.tf
    ```

1. Paste the following code into the editor:

    **main.tf**:
    :::code language="terraform" source="~/terraform/quickstart/101-machine-learning/main.tf":::

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Deploy a workspace

The following Terraform configurations can be used to create an Azure Machine Learning workspace. When you create an Azure Machine Learning workspace, various other services are required as dependencies. The template also specifies these [associated resources to the workspace](./concept-workspace.md#associated-resources). Depending on your needs, you can choose to use the template that creates resources with either public or private network connectivity.

# [Public network connectivity](#tab/publicworkspace)

Some resources in Azure require globally unique names. Before deploying your resources using the following templates, set the `name` variable to a value that is unique.

**variables.tf**:
:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/variables.tf":::

**workspace.tf**:
:::code language="terraform" source="~/terraform/quickstart/101-machine-learning/workspace.tf":::

# [Private network connectivity](#tab/privateworkspace)

The configuration below creates a workspace in an isolated network environment using Azure Private Link endpoints. [Private DNS zones](../dns/private-dns-privatednszone.md) are included so domain names can be resolved within the virtual network.

Some resources in Azure require globally unique names. Before deploying your resources using the following templates, set the `resourceprefix` variable to a value that is unique.

When using private link endpoints for both Azure Container Registry and Azure Machine Learning, Azure Container Registry tasks cannot be used for building [environment](/python/api/azure-ai-ml/azure.ai.ml.entities.environment) images. Instead you can build images using an Azure Machine Learning compute cluster. To configure the cluster name of use, set the [image_build_compute_name](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace) argument. You can configure to [allow public access](./how-to-configure-private-link.md?tabs=python#enable-public-access) to a workspace that has a private link endpoint using the [public_network_access_enabled](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace) argument.

**variables.tf**:
:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-moderately-secure/variables.tf":::

**workspace.tf**:
:::code language="terraform" source="~/terraform/quickstart/201-machine-learning-moderately-secure/workspace.tf":::

**network.tf**:
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
# For full reference, see: https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf
```

There are several options to connect to your private link endpoint workspace. To learn more about these options, refer to [Securely connect to your workspace](./how-to-secure-workspace-vnet.md#securely-connect-to-your-workspace).

---

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](includes/machine-learning-resource-provider.md)]

## Next steps

* To learn more about Terraform support on Azure, see [Terraform on Azure documentation](/azure/developer/terraform/).
* For details on the Terraform Azure provider and Machine Learning module, see [Terraform Registry Azure Resource Manager Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/machine_learning_workspace).
* To find "quick start" template examples for Terraform, see [Azure Terraform QuickStart Templates](https://github.com/Azure/terraform/tree/master/quickstart):
  
  * [101: Machine learning workspace and compute](https://github.com/Azure/terraform/tree/master/quickstart/101-machine-learning) – the minimal set of resources needed to get started with Azure Machine Learning.
  * [201: Machine learning workspace, compute, and a set of network components for network isolation](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure) – all resources that are needed to create a production-pilot environment for use with HBI data.
  * [202: Similar to 201, but with the option to bring existing network components.](https://github.com/Azure/terraform/tree/master/quickstart/202-machine-learning-moderately-secure-existing-VNet).
  * [301:  Machine Learning workspace (Secure Hub and Spoke with Firewall)](https://github.com/azure/terraform/tree/master/quickstart/301-machine-learning-hub-spoke-secure).
  
* To learn more about network configuration options, see [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](./how-to-network-security-overview.md).
* For alternative Azure Resource Manager template-based deployments, see [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).
* For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](concept-vulnerability-management.md).
