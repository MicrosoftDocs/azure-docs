---
title: Manage Azure Machine Learning workspaces using Terraform
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning workspaces using Terraform.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: denniseik
ms.date: 04/22/2021
ms.topic: how-to
ms.custom: 

---

# Manage Azure Machine Learning workspaces using Terraform (preview)

In this article, you learn how to create and manage an Azure Machine Learning workspace using Terraform infrastructure-as-code templates. [Terraform templates](/azure/developer/terraform/) make it easy to create resources as a single, coordinated operation. A template is a document that defines the resources that are needed for a deployment. It may also specify deployment parameters. Parameters are used to provide input values when using the template.

## Prerequisites

* An **Azure subscription**. If you do not have one yet, try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An installed version of the [Azure CLI](/cli/azure/).
* Configure Terraform: follow the directions in this article and [Terraform and configure access to Azure](/azure/developer/terraform/get-started-cloud-shell).

## Declare the Azure provider

Create the Terraform configuration file that declares the Azure provider.

1. In local terminal or Cloud Shell, create a file named `main.tf`.

    ```bash
    code main.tf
    ```

1. Paste the following code into the editor:

    :::code language="hcl" source="~/terraform/blob/master/quickstart/template/main.tf":::

    ```hcl
    provider "azurerm" {
        # The "feature" block is required for AzureRM provider 2.x. 
        # If you are using version 1.x, the "features" block is not allowed.
        version = "~>2.0"
        features {}
    }

    data "azurerm_client_config" "current" {}
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Deploy a workspace

Below Terraform template can be used to create an Azure Machine Learning workspace. When you deploy an Azure Machine Learning workspace, various other services are required as dependencies. The template also creates these [associated resources](/azure/machine-learning/concept-workspace#resources). Dependent on your use case and organizational requirements, you can choose to use the template that creates resources with either public or private network connectivity.

# [Public network connectivity](#tab/publicworkspace)

Some resources in Azure require globally unique names. Before deploying your resources using the below template, set the `resourceprefix` variable to a value that is unique.

```hcl
variable "resourceprefix" {
  type = string
  default = "azureml777"
}

resource "azurerm_resource_group" "azureml" {
  name     = "${var.resourceprefix}-rgp"
  location = "East US"
}

resource "azurerm_application_insights" "azureml" {
  name                = "${var.resourceprefix}ain"
  location            = azurerm_resource_group.azureml.location
  resource_group_name = azurerm_resource_group.azureml.name
  application_type    = "web"
}

resource "azurerm_key_vault" "azureml" {
  name                     = "${var.resourceprefix}kv"
  location                 = azurerm_resource_group.azureml.location
  resource_group_name      = azurerm_resource_group.azureml.name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  sku_name                 = "premium"
  purge_protection_enabled = true
  
  network_acls {
    default_action = "Deny"
    bypass = "AzureServices"
  }
}

resource "azurerm_storage_account" "azureml" {
  name                     = "${var.resourceprefix}sa"
  location                 = azurerm_resource_group.azureml.location
  resource_group_name      = azurerm_resource_group.azureml.name
  account_tier             = "Standard"
  account_replication_type = "GRS"

  network_rules {
    default_action = "Deny"
    bypass = ["AzureServices"]
  }
}

resource "azurerm_container_registry" "azureml" {
  name                     = "${var.resourceprefix}cr"
  location                 = azurerm_resource_group.azureml.location
  resource_group_name      = azurerm_resource_group.azureml.name
  sku                      = "Premium"
  admin_enabled            = true
}

resource "azurerm_machine_learning_workspace" "azureml" {
  name                    = "${var.resourceprefix}ws"
  location                = azurerm_resource_group.azureml.location
  resource_group_name     = azurerm_resource_group.azureml.name
  application_insights_id = azurerm_application_insights.azureml.id
  key_vault_id            = azurerm_key_vault.azureml.id
  storage_account_id      = azurerm_storage_account.azureml.id
  container_registry_id   = azurerm_container_registry.azureml.id

  identity {
    type = "SystemAssigned"
  }
}
```

# [Private network connectivity](#tab/privateworkspace)

The template below creates a workspace in an isolated network environment using Azure private link endpoints. In addition, [private DNS zones](/azure/dns/private-dns-privatednszone) and [Private Link endpoints](/azure/private-link/private-endpoint-overview) are created. 

Some resources in Azure require globally unique names. Before deploying your resources using the below template, set the `resourceprefix` variable to a value that is unique.

There are several options to connect to your private link endpoint workspace. To learn more about these options, refer to [Securely connect to your workspace](/azure/machine-learning/how-to-secure-workspace-vnet#securely-connect-to-your-workspace).

```hcl
variable "resourceprefix-ple" {
  type = string
  default = "azureml777ple"
}

resource "azurerm_resource_group" "azureml_ple" {
  name     = "${var.resourceprefix-ple}-rgp"
  location = "East US"
}

resource "azurerm_application_insights" "azureml_ple" {
  name                = "${var.resourceprefix-ple}ain"
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
  application_type    = "web"
}

resource "azurerm_key_vault" "azureml_ple" {
  name                     = "${var.resourceprefix-ple}kv"
  location                 = azurerm_resource_group.azureml_ple.location
  resource_group_name      = azurerm_resource_group.azureml_ple.name
  tenant_id                = data.azurerm_client_config.current.tenant_id
  sku_name                 = "premium"
  purge_protection_enabled = true
  
  network_acls {
    default_action = "Deny"
    bypass = "AzureServices"
  }
}

resource "azurerm_storage_account" "azureml_ple" {
  name                     = "${var.resourceprefix-ple}sa"
  location                 = azurerm_resource_group.azureml_ple.location
  resource_group_name      = azurerm_resource_group.azureml_ple.name
  account_tier             = "Standard"
  account_replication_type = "GRS"

  network_rules {
    default_action = "Deny"
    bypass = ["AzureServices"]
  }
}

resource "azurerm_container_registry" "azureml_ple" {
  name                     = "${var.resourceprefix-ple}cr"
  location                 = azurerm_resource_group.azureml_ple.location
  resource_group_name      = azurerm_resource_group.azureml_ple.name
  sku                      = "Premium"
  admin_enabled            = true
}

resource "azurerm_machine_learning_workspace" "azureml_ple" {
  name                    = "${var.resourceprefix-ple}ws"
  location                = azurerm_resource_group.azureml_ple.location
  resource_group_name     = azurerm_resource_group.azureml_ple.name
  application_insights_id = azurerm_application_insights.azureml_ple.id
  key_vault_id            = azurerm_key_vault.azureml_ple.id
  storage_account_id      = azurerm_storage_account.azureml_ple.id
  container_registry_id   = azurerm_container_registry.azureml_ple.id

  identity {
    type = "SystemAssigned"
  }
}

# Network
resource "azurerm_virtual_network" "azureml_ple" {
  name                = "${var.resourceprefix-ple}vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

resource "azurerm_subnet" "mlsubnet" {
  name                 = "mlsubnet"
  resource_group_name  = azurerm_resource_group.azureml_ple.name
  virtual_network_name = azurerm_virtual_network.azureml_ple.name
  address_prefixes     = ["10.0.1.0/24"]
  enforce_private_link_endpoint_network_policies = true
}

# DNS zones
resource "azurerm_private_dns_zone" "dnsvault" {
  name                = "privatelink.vaultcore.azure.net"
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

resource "azurerm_private_dns_zone" "dnsstorageblob" {
  name                = "privatelink.blob.core.windows.net"
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

resource "azurerm_private_dns_zone" "dnsstoragefile" {
  name                = "privatelink.file.core.windows.net"
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

resource "azurerm_private_dns_zone" "dnscontainerregistry" {
  name                = "privatelink.azurecr.io"
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

resource "azurerm_private_dns_zone" "dnsazureml" {
  name                = "privatelink.api.azureml.ms"
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

resource "azurerm_private_dns_zone" "dnsnotebooks" {
  name                = "privatelink.azureml.notebooks.net"
  resource_group_name = azurerm_resource_group.azureml_ple.name
}

# Private endpoints
resource "azurerm_private_endpoint" "keyvault_ple" {
  name                = "${var.resourceprefix-ple}kv-ple"
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
  subnet_id           = azurerm_subnet.mlsubnet.id

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.dnsvault.id]
  }

  private_service_connection {
    name                           = "${var.resourceprefix-ple}kv-psc"
    private_connection_resource_id = azurerm_key_vault.azureml_ple.id
    subresource_names              = [ "vault" ]
    is_manual_connection           = false
  }
}

resource "azurerm_private_endpoint" "storage_ple_blob" {
  name                = "${var.resourceprefix-ple}sa-ple-blob"
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
  subnet_id           = azurerm_subnet.mlsubnet.id

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.dnsstorageblob.id]
  }

  private_service_connection {
    name                           = "${var.resourceprefix-ple}sa-psc"
    private_connection_resource_id = azurerm_storage_account.azureml_ple.id
    subresource_names              = [ "blob" ]
    is_manual_connection           = false
  }
}

resource "azurerm_private_endpoint" "storage_ple_file" {
  name                = "${var.resourceprefix-ple}sa-ple-file"
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
  subnet_id           = azurerm_subnet.mlsubnet.id

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.dnsstoragefile.id]
  }

  private_service_connection {
    name                           = "${var.resourceprefix-ple}sa-psc"
    private_connection_resource_id = azurerm_storage_account.azureml_ple.id
    subresource_names              = [ "file" ]
    is_manual_connection           = false
  }
}

resource "azurerm_private_endpoint" "cr_ple" {
  name                = "${var.resourceprefix-ple}cr-ple"
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
  subnet_id           = azurerm_subnet.mlsubnet.id

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.dnscontainerregistry.id]
  }

  private_service_connection {
    name                           = "${var.resourceprefix-ple}cr-psc"
    private_connection_resource_id = azurerm_container_registry.azureml_ple.id
    subresource_names              = [ "registry" ]
    is_manual_connection           = false
  }
}

resource "azurerm_private_endpoint" "ml_ple" {
  name                = "${var.resourceprefix-ple}ml-ple"
  location            = azurerm_resource_group.azureml_ple.location
  resource_group_name = azurerm_resource_group.azureml_ple.name
  subnet_id           = azurerm_subnet.mlsubnet.id

  private_dns_zone_group {
    name                 = "private-dns-zone-group"
    private_dns_zone_ids = [
      azurerm_private_dns_zone.dnsazureml.id,
      azurerm_private_dns_zone.dnsnotebooks.id
    ]
  }

  private_service_connection {
    name                           = "${var.resourceprefix-ple}ml-psc"
    private_connection_resource_id = azurerm_machine_learning_workspace.azureml_ple.id
    subresource_names              = [ "amlworkspace" ]
    is_manual_connection           = false
  }
}
```

---

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](../../includes/machine-learning-resource-provider.md)]

## Next steps

* To learn more about Terraform support on Azure, see [Terraform on Azure documentation](/azure/developer/terraform/).
* For alternative ARM template-based deployments, see [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).
* To learn more about network configuration options, see [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](/azure/machine-learning/how-to-network-security-overview).
* 
