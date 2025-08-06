---
title: Post Migration Dev-Ops Experience
description: Guidance to update Terraform, ARM templates, Bicep, PowerShell, and Azure CLI pipelines after migrating from Azure Front Door (Classic) or CDN Classic to Azure Front Door Standard/Premium.
author: jainsabal
ms.author: jainsabal
ms.service: azure-frontdoor
ms.topic: overview
ms.date: 08/06/2025
---
# Post Migration Dev-Ops Experience

After migrating from Azure Front Door (Classic) or CDN Classic to Azure Front Door Standard/Premium, update your DevOps pipeline scripts to deploy and manage the new Front Door Standard/Premium resources. Use the guidance below for various tools and pipeline types.

## Terraform

### Prerequisites

- Ensure the Terraform CLI is installed. See [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/azure-get-started/install-cli).
- Install the Azure Resource Manager Export extension for Terraform to export existing Azure resources to Terraform templates. See [Overview of Azure Export for Terraform](https://learn.microsoft.com/azure/developer/terraform/azure-export-for-terraform/export-terraform-overview).

### Steps

After migration, all classic AFD resources are migrated to AFD Standard and Premium. Then:

- **Export the new AFD Standard/Premium configuration**: Use Azure’s export tool to generate Terraform configurations for your new Front Door Standard/Premium resources. Follow [Quickstart: Export your first resources using Azure Export for Terraform](https://learn.microsoft.com/azure/developer/terraform/azure-export-for-terraform/export-first-resources?tabs=azure-cli) to export the Front Door Standard/Premium resources into Terraform files.
- **Update Terraform templates in your pipeline**: Replace references to Front Door Classic resources with the exported Standard/Premium configuration.
  - For AFD Classic, the Terraform resource is [`azurerm_frontdoor`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/frontdoor).
  - For CDN Classic, use the [`azurerm_cdn_*`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_endpoint) resources.
  - For AFD Standard/Premium (AFDx), use the [`azurerm_cdn_frontdoor_*`](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_frontdoor_profile) resources.
- Check in the updated Terraform code to your pipeline and run plan/apply to start managing the new Front Door via Terraform.

## ARM template

### Steps

After migration, all classic AFD resources are migrated to AFD Standard and Premium.

- **Export ARM templates for Front Door Standard/Premium** using any of the following:
  - **Azure portal**: [Export template in Azure portal](../azure-resource-manager/templates/export-template-portal.md).
  - **Azure CLI**: [Export template in Azure CLI](../azure-resource-manager/templates/export-template-cli.md).
  - **Azure PowerShell**: [Export template in Azure PowerShell](../azure-resource-manager/templates/export-template-powershell.md).
- **Update ARM templates in your pipeline** to use the new Front Door Standard/Premium template instead of the Front Door (Classic) template. In Azure DevOps or GitHub Actions, update the template path and parameters in your deployment step, then deploy the new template.
- **Validate**: Remove or archive references to the classic Front Door template to avoid confusion.

## Bicep

### Prerequisites

- Install the Bicep CLI and tools. See [Set up Bicep development and deployment environments](../azure-resource-manager/bicep/install.md).

### Steps

After migration, all classic AFD resources are migrated to AFD Standard and Premium.

- **Generate a Bicep template for Front Door Standard/Premium** by decompiling an exported ARM template. See [Decompile ARM template JSON to Bicep](../azure-resource-manager/bicep/decompile.md?tabs=azure-cli).
- **Update Bicep files in your pipeline**: Replace Front Door Classic definitions with Standard/Premium. This may include updating resource types such as [`Microsoft.Cdn/profiles`](https://learn.microsoft.com/azure/templates/microsoft.cdn/profiles?pivots=deployment-language-bicep) and child resources (endpoints, routes, etc.).
- **Test** a deployment (for example, `az deployment group create`) to verify provisioning of AFD Standard/Premium.

## PowerShell

### Prerequisites

Make sure you have the latest Azure PowerShell Az modules installed (Az.Cdn module version that supports AFD Standard/Premium). See [Install Azure PowerShell](https://learn.microsoft.com/powershell/azure/install-azps-windows).

### Steps

- **Update PowerShell deployment scripts**: Replace any Front Door (Classic) cmdlets with AFD Standard/Premium cmdlets. For examples, see the [Azure Front Door PowerShell quickstart](create-front-door-powershell.md).
- **Incorporate new configuration and remove old references**: Ensure scripts configure required components (origins, origin groups, routes, rules, etc.). Remove or comment commands that manage Classic Front Door.
- Command group mapping:
  - AzFrontDoorCdn commands under the [Az.Cdn module](https://learn.microsoft.com/powershell/module/az.cdn/) are for AFD Standard/Premium.
  - AzCdn commands under the [Az.Cdn module](https://learn.microsoft.com/powershell/module/az.cdn/) are for CDN Classic.
  - The [Az.FrontDoor module](https://learn.microsoft.com/powershell/module/az.frontdoor/) is for AFD Classic.
- **Test** your script (locally or in a test pipeline) to verify creation or updates to AFD Standard/Premium, then commit changes to your pipeline.

## CLI

### Prerequisites

- Ensure Azure CLI is installed and updated to a version that supports the `afd` command group (for example, 2.63.0 or later). See [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).
- Log in (`az login`) and set the correct subscription context.

### Steps

- **Update CLI commands in scripts**: Use the Azure Front Door Standard/Premium command group: [`az afd`](https://learn.microsoft.com/cli/azure/afd).
- **Replace or remove Front Door Classic CLI usage**:
  - CDN Classic commands: [`az cdn`](https://learn.microsoft.com/cli/azure/cdn)
  - AFD Classic commands: [`az network front-door`](https://learn.microsoft.com/cli/azure/network/front-door)
- **Validate** the updated CLI script manually or in a staging pipeline to ensure successful configuration of Front Door Standard/Premium.

## Next step

* For more questions, refer to the [AFD/CDN Classic Migration FAQ](migration-faq.md).
* Understand the [settings mapping between Azure Front Door tiers](tier-mapping.md).

