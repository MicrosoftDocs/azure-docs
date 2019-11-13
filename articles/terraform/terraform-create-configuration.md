---
title: Quickstart - Create a Terraform configuration for Azure
description: Get started with Terraform on Azure by deploying an Azure Cosmos DB and Azure Container Instances.
ms.service: terraform
author: tomarchermsft
ms.author: tarcher
ms.topic: quickstart
ms.date: 10/26/2019
---

# Quickstart: Create a Terraform configuration for Azure

In this quickstart, you create Azure resources using Terraform. The steps in this article walk you through creating the following resources:

> [!div class="checklist"]
> * Azure Cosmos DB instance
> * Azure Container Instance
> * App  that works across these two resources

## Create first configuration

In this section, you create the configuration for an Azure Cosmos DB instance.

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open the Azure Cloud Shell.

1. Start the Cloud Shell editor:

    ```bash
    code main.tf
    ```

1. The configuration in this step models a couple of Azure resources. These resources include an Azure resource group and an Azure Cosmos DB instance. A random integer is used to create a unique Cosmos DB instance name. Several Cosmos DB settings are also configured. For more information, see the [Cosmos DB Terraform reference](https://www.terraform.io/docs/providers/azurerm/r/cosmosdb_account.html). Copy and paste the following Terraform configuration into the editor:

    ```hcl
    resource "azurerm_resource_group" "vote-resource-group" {
      name     = "vote-resource-group"
      location = "westus"
    }

    resource "random_integer" "ri" {
      min = 10000
      max = 99999
    }

    resource "azurerm_cosmosdb_account" "vote-cosmos-db" {
      name                = "tfex-cosmos-db-${random_integer.ri.result}"
      location            = azurerm_resource_group.vote-resource-group.location
      resource_group_name = azurerm_resource_group.vote-resource-group.name
      offer_type          = "Standard"
      kind                = "GlobalDocumentDB"

      consistency_policy {
        consistency_level       = "BoundedStaleness"
        max_interval_in_seconds = 10
        max_staleness_prefix    = 200
      }

      geo_location {
        location          = "westus"
        failover_priority = 0
      }
    }
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Run the configuration

In this section, you use several Terraform commands to run the configuration.

1. The [terraform init](https://www.terraform.io/docs/commands/init.html) command initializes the working directory. Run the following command in Cloud Shell:

    ```bash
    terraform init
    ```

1. The [terraform plan](https://www.terraform.io/docs/commands/plan.html) command can be used to validate the configuration syntax. The `-out` parameter directs the results to a file. The output file can be used later to apply the configuration. Run the following command in Cloud Shell:

    ```bash
    terraform plan --out plan.out
    ```

1. The [terraform apply](https://www.terraform.io/docs/commands/apply.html) command is used to apply the configuration. The output file from the previous step is specified. This command causes the Azure resources to be created. Run the following command in Cloud Shell:

    ```bash
    terraform apply plan.out
    ```

1. To verify the results within the Azure portal, browse to the new resource group. The new Azure Cosmos DB instance is in the new resource group.

## Update configuration

This section shows how to update the configuration to include an Azure Container Instance. The container runs an application that reads and writes data to the Cosmos DB.

1. Start the Cloud Shell editor:

    ```bash
    code main.tf
    ```

1. The configuration in this step sets two environment variables: `COSMOS_DB_ENDPOINT` and `COSMOS_DB_MASTERKEY`. These variables hold the location and key for accessing the database. The values for these variables are obtained from the database instance created in the previous step. This process is known as interpolation. To learn more about Terraform interpolation, see [Interpolation Syntax](https://www.terraform.io/docs/configuration/interpolation.html). The configuration also includes an output block, which returns the fully qualified domain name (FQDN) of the container instance. Copy and paste the following code into the editor:

    ```hcl
    resource "azurerm_container_group" "vote-aci" {
      name                = "vote-aci"
      location            = azurerm_resource_group.vote-resource-group.location
      resource_group_name = azurerm_resource_group.vote-resource-group.name
      ip_address_type     = "public"
      dns_name_label      = "vote-aci"
      os_type             = "linux"

      container {
        name   = "vote-aci"
        image  = "microsoft/azure-vote-front:cosmosdb"
        cpu    = "0.5"
        memory = "1.5"
        ports {
          port     = 80
          protocol = "TCP"
        }

        secure_environment_variables = {
          "COSMOS_DB_ENDPOINT"  = azurerm_cosmosdb_account.vote-cosmos-db.endpoint
          "COSMOS_DB_MASTERKEY" = azurerm_cosmosdb_account.vote-cosmos-db.primary_master_key
          "TITLE"               = "Azure Voting App"
          "VOTE1VALUE"          = "Cats"
          "VOTE2VALUE"          = "Dogs"
        }
      }
    }

    output "dns" {
      value = azurerm_container_group.vote-aci.fqdn
    }
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

1. As you did in the previous section, run the following command to visual the changes to be made:

    ```bash
    terraform plan --out plan.out
    ```

1. Run the `terraform apply` command to apply the configuration.

    ```bash
    terraform apply plan.out
    ```

1. Make note of the container instance FQDN.

## Test application

To test the application, navigate to the FQDN of the container instance. You should see results similar to the following output:

![Azure vote application](media/terraform-quickstart/azure-vote.jpg)

## Clean up resources

When no longer needed, delete the resources created in this article.

Run the [terraform destroy](https://www.terraform.io/docs/commands/destroy.html) command to remove the Azure resources created in this tutorial:

```bash
terraform destroy -auto-approve
```

## Next steps

> [!div class="nextstepaction"]
> [Install and configure Terraform to provision Azure resources](../virtual-machines/linux/terraform-install-configure.md).