---
title: Terraform quickstart for Azure
description: An introduction to using Terraform on Azure.
services: terraform
author: neilpeterson
ms.service: terraform
ms.topic: article
ms.date: 01/28/2019
ms.author: nepeters
---

# Create a simple Terraform configuration for Azure

HashiCorp Terraform is an open-source tool for composing and deploying compute infrastructure. Terraform deployments are written using the Hashicorp Configuration Language and can be generalized for reuse, stored in source control, and integrated with DevOps pipelines. When deploying infrastructure with Terraform, configuration state is tracked and can be used to actualize deployments, which helps with upgrading or changing the configuration of infrastructure.

In this quickstart you will gain experience in creating a Terraform configuration and deploying this configuration to Azure. When completed, you will have deployed an Azure Cosmos DB, and Azure Container Instances, and an application that works across these to resources. The quickstart will assume that all work is completed in Azure Cloud Shell however can also be completed on your development system. In order to do so, see [Install and configure Terraform](./terraform-install-configure.md) for Terraform installation instructions.

## Create first configuration

In this step, you will create the configuration for an Azure Cosmos DB instance.

Click the try it now button to open up Azure cloud shell. Once open, type in `code .` to open the cloud shell code editor.

```azurecli-interactive
code .
```

Copy and paste in the following Terraform configuration. This configuration models an Azure resource group named **vote-resource-group**, a random integer, and an Azure Cosmos DB instances. The random integer is used in the Cosmos DB name. Several Cosmos DB settings are also configured. For a complete list of Cosmos DB Terraform configurations, see the [Cosmos DB Terraform reference](https://www.terraform.io/docs/providers/azurerm/r/cosmosdb_account.html).

Save the file as `main.tf` when done. This operation can be done using the ellipses in the upper right-hand portion of the code editor.

```azurecli-interactive
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
  location            = "${azurerm_resource_group.vote-resource-group.location}"
  resource_group_name = "${azurerm_resource_group.vote-resource-group.name}"
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

The `terraform init` command initializes the working directory. Run `terraform init` to prepare for the deployment of the new configuration. For more information on `terraform init`, see the [command reference](https://www.terraform.io/docs/commands/init.html).

```azurecli-interactive
teraform init
```

The `terraform plan` command can be used to validate that the configuration is properly formatted and to visualize what resources will be created, updated, or destroyed. Run `terraform plan` to test the new Terraform configuration. For more information on `terraform plan`, see the [command reference](https://www.terraform.io/docs/commands/plan.html).

```azurecli-interactive
teraform plan
```

Now, apply the configuration using `terraform apply`. This command deploys the resources in your Azure subscription. Add the `--auto-approve` command to skip interactive approval. For more information on `terraform apply`, see the [command reference](https://www.terraform.io/docs/commands/apply.html).

```azurecli-interactive
terraform apply --auto-approve
```

Once done, you can see that the resource group has been created and an Azure Cosmos DB instance placed in the resource group.

## Update Configuration

Now, update the configuration to include an Azure Container Instance. The container runs an application that reads and writes data to the Cosmos DB instance. Take note that two environment variables are set, `COSMOS_DB_ENDPOINT` and `COSMOS_DB_MASTERKEY`. These variables hold the location and key for accessing the database. The values for these variables are assumed from the database instance created in the last step. This process is known to as interpolation. To learn more about Terraform interpolation, see [Interpolation Syntax](https://www.terraform.io/docs/configuration/interpolation.html).

Open the code editor and copy in the following configuration to the bottom of the `main.tf` file. Save the file when done.

```azurecli-interactive
resource "azurerm_container_group" "vote-aci" {
  name                = "vote-aci"
  location            = "${azurerm_resource_group.vote-resource-group.location}"
  resource_group_name = "${azurerm_resource_group.vote-resource-group.name}"
  ip_address_type     = "public"
  dns_name_label      = "vote-aci"
  os_type             = "linux"

  container {
    name   = "vote-aci"
    image  = "microsoft/azure-vote-front:cosmosdb"
    cpu    = "0.5"
    memory = "1.5"
    ports  = {
      port     = 80
      protocol = "TCP"
    }

    secure_environment_variables {
      "COSMOS_DB_ENDPOINT"  = "${azurerm_cosmosdb_account.vote-cosmos-db.endpoint}"
      "COSMOS_DB_MASTERKEY" = "${azurerm_cosmosdb_account.vote-cosmos-db.primary_master_key}"
      "TITLE"               = "Azure Voting App"
      "VOTE1VALUE"          = "Cats"
      "VOTE2VALUE"          = "Dogs"
    }
  }
}
```

Run `terraform plan` to visualize the changes to be made. You should see that an Azure Container Instance resource has been added to the configuration.

```azurecli-interactive
teraform plan
```

Finally, run `terraform apply` to apply the configuration.

```azurecli-interactive
terraform apply --auto-approve
```

## Test application

To test the application, first get the IP address of the Azure Container Instance. This operation can be done with the `az container show` command.

```azurecli-interactive
az container show --resource-group vote-resource-group --name vote-aci --query ipAddress.ip -o tsv
```

Navigate to the IP address using an internet browser. If everything was correctly configured, you should see the following application.

![Azure vote application](media/terraform-quickstart/azure-vote.png)

## Clean up resources

When done, the Azure resources and resource group can be removed using the `terraform destroy` command. For more information on `terraform destroy`, see the [command reference](https://www.terraform.io/docs/commands/destroy.html).

```azurecli-interactive
terraform destroy -auto-approve
```

## Next steps

In this quickstart, you created, deployed, and destroyed a Terraform configuration. For more information on using Terraform in Azure, see the following documents.

- [Install and configure Terraform](./terraform-install-configure.md)
- [Manage Terraform state in Azure](./terraform-backend.md)