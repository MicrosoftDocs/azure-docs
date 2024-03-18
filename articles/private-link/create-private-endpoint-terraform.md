---
title: 'Quickstart: Create a private endpoint - Terraform'
description: In this quickstart, you learn how to create a private endpoint using Terraform.
ms.topic: quickstart
ms.date: 02/22/2024
ms.custom: devx-track-terraform
ms.service: virtual-network
author: asudbring
ms.author: allensu
content_well_notification: 
  - AI-contribution
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using Terraform.
---

# Quickstart: Create a private endpoint by using Terraform

In this quickstart, you use Terraform to create a private endpoint. The private endpoint connects to an Azure SQL Database. The private endpoint is associated with a virtual network and a private Domain Name System (DNS) zone. The private DNS zone resolves the private endpoint IP address. The virtual network contains a virtual machine that you use to test the connection of the private endpoint to the instance of the SQL Database.

The script generates a random password for the SQL server and a random SSH key for the virtual machine. The names of the created resources are output when the script is run. 

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

:::image type="content" source="./media/create-private-endpoint-portal/private-endpoint-qs-resources-sql.png" alt-text="Diagram of resources created in private endpoint quickstart.":::

## Prerequisites

- You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-private-link-sql-database).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-private-link-sql-database/main.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-private-link-sql-database/outputs.tf":::

1. Create a file named `provider.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-private-link-sql-database/provider.tf":::

1. Create a file named `ssh.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-private-link-sql-database/ssh.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/201-private-link-sql-database/variables.tf":::


## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the SQL Server name.

    ```console
    sql_server=$(terraform output -raw sql_server)
    ```

1. Run [az sql server show](/cli/azure/sql/server#az-sql-server-show) to display the details about the SQL Server private endpoint.

    ```azurecli
    az sql server show \
        --resource-group $resource_group_name \
        --name $sql_server --query privateEndpointConnections \
        --output tsv
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the SQL Server name.

    ```console
    $sql_server=$(terraform output -raw sql_server_name)
    ```

1. Run [Get-AzPrivateEndpoint](/powershell/module/az.network/get-azprivateendpoint) to display the details about the SQL Server private endpoint.

    ```azurepowershell
    $sql = @{
    ResourceGroupName = $resource_group_name
    }
    Get-AzPrivateEndpoint @sql
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure.](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
