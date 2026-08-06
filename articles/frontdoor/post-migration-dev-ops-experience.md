---
title: Post Migration DevOps Experience
description: Guidance to update Terraform, ARM templates, Bicep, PowerShell, and Azure CLI pipelines after migrating from Azure Front Door (classic) or CDN Standard from Microsoft (classic) to Azure Front Door Standard/Premium.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: overview
ms.date: 07/27/2026
---

# Post migration DevOps experience

**Applies to:** :heavy_check_mark: Front Door (classic) :heavy_check_mark: CDN Standard from Microsoft (classic)

After migrating from Azure Front Door (classic) or CDN Standard from Microsoft (classic) to Azure Front Door Standard or Premium, update your DevOps pipeline scripts to deploy and manage the new Front Door Standard or Premium resources. Use the following guidance for various tools and pipeline types.

## Terraform

### Prerequisites

- Ensure the Terraform CLI is installed. See [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/azure-get-started/install-cli).
- Install the Azure Resource Manager Export extension for Terraform to export existing Azure resources to Terraform templates. See [Overview of Azure Export for Terraform](/azure/developer/terraform/azure-export-for-terraform/export-terraform-overview).

### Steps

After migration, all classic Azure Front Door resources are migrated to Azure Front Door Standard and Premium. Then:

- **Export the new Azure Front Door Standard or Premium configuration**: Use Azure’s export tool to generate Terraform configurations for your new Front Door Standard or Premium resources. Follow [Quickstart: Export your first resources using Azure Export for Terraform](/azure/developer/terraform/azure-export-for-terraform/export-first-resources?tabs=azure-cli) to export the Front Door Standard or Premium resources into Terraform files.
- **Update Terraform templates in your pipeline**: Replace references to Front Door classic resources with the exported Standard or Premium configuration.
  - For Azure Front Door (classic), the Terraform resource is [`azurerm_frontdoor`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/frontdoor).
  - For CDN Standard from Microsoft (classic), use the [`azurerm_cdn_*`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_endpoint) resources.
  - For Azure Front Door Standard or Premium (AFDx), use the [`azurerm_cdn_frontdoor_*`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_profile) resources.
- Check in the updated Terraform code to your pipeline and run plan and apply to start managing the new Front Door via Terraform.

## ARM template

### Steps

After migration, all classic Azure Front Door resources are migrated to Azure Front Door Standard and Premium.

- **Export ARM templates for Front Door Standard/Premium** by using any of the following methods:
  - **Azure portal**: [Export template in Azure portal](../azure-resource-manager/templates/export-template-portal.md).
  - **Azure CLI**: [Export template in Azure CLI](../azure-resource-manager/templates/export-template-cli.md).
  - **Azure PowerShell**: [Export template in Azure PowerShell](../azure-resource-manager/templates/export-template-powershell.md).
- **Update ARM templates in your pipeline** to use the new Front Door Standard/Premium template instead of the Front Door (classic) template. In Azure DevOps or GitHub Actions, update the template path and parameters in your deployment step, and then deploy the new template.
- **Validate**: Remove or archive references to the classic Front Door template to avoid confusion.

## Bicep

### Prerequisites

- Install the Bicep CLI and tools. See [Set up Bicep development and deployment environments](../azure-resource-manager/bicep/install.md).

### Steps

After migration, all classic Azure Front Door resources are migrated to Azure Front Door Standard and Premium.

- **Generate a Bicep template for Front Door Standard/Premium** by decompiling an exported ARM template. See [Decompile ARM template JSON to Bicep](../azure-resource-manager/bicep/decompile.md?tabs=azure-cli).
- **Update Bicep files in your pipeline**: Replace Front Door (classic) definitions with Standard/Premium. This replacement might include updating resource types such as [`Microsoft.Cdn/profiles`](/azure/templates/microsoft.cdn/profiles?pivots=deployment-language-bicep) and child resources (endpoints, routes, and so on).
- **Test** a deployment (for example, `az deployment group create`) to verify provisioning of Azure Front Door Standard or Premium.

## PowerShell

### Prerequisites

Make sure you have the latest Azure PowerShell Az modules installed (Az.Cdn module version that supports Azure Front Door Standard or Premium). See [Install Azure PowerShell](/powershell/azure/install-azps-windows).

### Steps

- **Update PowerShell deployment scripts**: Replace any Azure Front Door (classic) cmdlets with Azure Front Door Standard or Premium cmdlets. For examples, see the [Azure Front Door PowerShell quickstart](create-front-door-powershell.md).
- **Incorporate new configuration and remove old references**: Ensure scripts configure required components (origins, origin groups, routes, rules, and so on). Remove or comment commands that manage Azure Front Door (classic).
- Command group mapping:
  - AzFrontDoorCdn commands under the [Az.Cdn module](/powershell/module/az.cdn/) are for Azure Front Door Standard or Premium.
  - AzCdn commands under the [Az.Cdn module](/powershell/module/az.cdn/) are for CDN Standard from Microsoft (classic).
  - The [Az.FrontDoor module](/powershell/module/az.frontdoor/) is for Azure Front Door (classic).
- **Test** your script (locally or in a test pipeline) to verify creation or updates to Azure Front Door Standard or Premium, then commit changes to your pipeline.

## CLI

### Prerequisites

- Ensure Azure CLI is installed and updated to a version that supports the `afd` command group (for example, 2.63.0 or later). See [Install Azure CLI](/cli/azure/install-azure-cli).
- Log in (`az login`) and set the correct subscription context.

### Steps

- **Update CLI commands in scripts**: Use the Azure Front Door Standard/Premium command group: [`az afd`](/cli/azure/afd).
- **Replace or remove Front Door (classic) CLI usage**:
  - CDN Standard from Microsoft (classic) commands: [`az cdn`](/cli/azure/cdn)
  - Azure Front Door (classic) commands: [`az network front-door`](/cli/azure/network/front-door)
- **Validate** the updated CLI script manually or in a staging pipeline to ensure successful configuration of Front Door Standard/Premium.

## Related content

- [Azure Front Door (classic) and CDN Standard from Microsoft (classic) migration FAQ](migration-faq.md)
- [Settings mapping between Azure Front Door (classic) and Standard or Premium tiers](tier-mapping.md)

