---
title: Create a Virtual Network Flow Log by Using Terraform
titleSuffix: Azure Network Watcher
description: Learn how to use Terraform to create a virtual network flow log for an existing Azure virtual network.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 08/04/2026
ms.custom: devx-track-terraform
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted

# Customer intent: As an Azure administrator, I want to configure virtual network flow logs using Terraform so that I can programmatically log and monitor traffic in my virtual network.
---

# Create a virtual network flow log by using Terraform

Virtual network flow logs record information about IP traffic that flows through a virtual network. In this article, you use Terraform to create a virtual network flow log and a dedicated storage account for an existing virtual network. For more information, see [Virtual network flow logs overview](vnet-flow-logs-overview.md).

The Terraform configuration uses the regional Network Watcher instance that Azure creates automatically when Network Watcher is enabled. You create the flow log and storage account in the Network Watcher resource group.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).
- An existing virtual network. To create one, see [Create a virtual network](/azure/virtual-network/quick-create-portal?toc=/azure/network-watcher/toc.json).
- Network Watcher enabled in the virtual network's region. Network Watcher is enabled by default unless you explicitly disable it.
- The `Microsoft.Insights` resource provider registered in your subscription. For more information, see [Register the Insights provider](vnet-flow-logs-manage.md#register-insights-provider).
- Permissions to create a flow log and storage account in the resource group that contains the regional Network Watcher instance.

## Review the Terraform configuration

You can find the sample configuration for this article in the [Azure Terraform GitHub repository](https://github.com/Azure/terraform/tree/master/quickstart/101-network-watcher-vnet-flow-logs).

The configuration creates the following resources:

- An [Azure storage account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) that stores flow log data.
- An [Azure Network Watcher flow log](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_watcher_flow_log) that records traffic for the existing virtual network.

The configuration also uses the [Network Watcher data source](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/network_watcher) to reference the existing regional Network Watcher instance.

1. Create a directory to test the sample Terraform configuration, and make it the current directory.

1. Create a file named `providers.tf`, and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-network-watcher-vnet-flow-logs/providers.tf":::

1. Create a file named `main.tf`, and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-network-watcher-vnet-flow-logs/main.tf":::

1. Create a file named `variables.tf`, and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-network-watcher-vnet-flow-logs/variables.tf":::

1. Create a file named `outputs.tf`, and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-network-watcher-vnet-flow-logs/outputs.tf":::

## Set the existing resource values

Create a file named `terraform.tfvars`. Replace the placeholders with values for your existing virtual network and regional Network Watcher instance.

```hcl
network_watcher_name                = "NetworkWatcher_eastus"
network_watcher_resource_group_name = "NetworkWatcherRG"
virtual_network_id                  = "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>"
```

The virtual network and Network Watcher instance must be in the same Azure region. If your Network Watcher instance uses a custom name or resource group, update both Network Watcher values.

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply the Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the flow log

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Network Watcher**.

1. Under **Logs**, select **Flow logs**.

1. Confirm that the flow log is enabled and that its target resource is your virtual network.

You can also display the flow log and storage account names from the Terraform outputs:

```console
terraform output flow_log_name
terraform output storage_account_name
```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

The destroy operation deletes the flow log and the storage account created by this configuration. It doesn't delete the existing virtual network or Network Watcher instance.

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Related content

- [Manage virtual network flow logs](vnet-flow-logs-manage.md)
- [Virtual network flow logs overview](vnet-flow-logs-overview.md)
- [Azure RBAC permissions required to use Network Watcher](rbac-permissions.md)