---
title: Relocation guidance for Azure Automation
description: Learn how to relocate an Azure Automation to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/16/2024
ms.service: automation
ms.topic: how-to
---

# Relocation guidance for Azure Automation

This article covers relocation guidance for [Azure Automation](../automation/overview.md) across regions.


## Relocation strategies

To relocate Azure Automation to a new region, you can choose to [redeploy without data migration](#redeploy-without-data-migration) or [redeploy with data migration](#redeploy-with-data-migration-strategy) strategies.

**Azure Resource Mover** doesn't support moving services used by the Azure Automation. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

## Redeploy without data migration

If your Azure Automation instance doesn't have any configuration and the instance itself needs to be moved alone, you can choose to redeploy without data migration. 

**To redeploy your Automation instance without data:**

Redeploy the NetApp File instance by using [Bicep, ARM Template, or Terraform](/azure/templates/microsoft.automation/automationaccounts?tabs=bicep&pivots=deployment-language-bicep).

To view the available configuration templates, see [the complete Azure Template library](/azure/templates/).

## Redeploy with data migration

In the diagram below, the red flow lines illustrate redeployment of the target instance along with configuration movement.

:::image type="content" source="media/relocation/automation/automation-pattern-design.png" alt-text="Diagram illustrating cold standby redeployment with configuration movement":::


### Prerequisites

- Identify all Automation dependant resources.
- Ensure that a landing zone has been deployed in alignment with the assessed architecture
- If the system-assigned managed identity is not being used at source, you must map user-assigned managed identity at the target.
- If the target Azure Automation needs to be enabled for private access, associate with Virtual Network for private endpoint.
- If the source Azure Automation is enabled with a private connection, create a private link and configure the private link with DNS at target. 
- For Azure Automation to communicate with Hybrid RunBook Worker, Update Management, Change Tracking, Inventory Configuration, and Automation State Configuration, you must enable port 443 for both inbound and outbound internet access.


### Redeploy your Automation instance to another region:**

1. Manually create the Azure Automation instance with the required parameters and configurations or [export the source Azure automation template](/azure/azure-resource-manager/templates/export-template-portal).

1. Reconfigure the template parameters for the target. 

1. Deploy the template using [ARM](/automation/quickstart-create-automation-account-template#deploy-the-template), [Portal](/azure/automation/automation-create-standalone-account?tabs=azureportal)  or [PowerShell](powershell/module/az.automation/import-azautomationrunbook?view=azps-11.2.0).

1. Use PowerShell to export all associated runbooks from the source Azure Automation instance and import them to the target instance. Reconfigure the properties as per target. For more information, see [Export-AzAuotomationRunbook](/powershell/module/az.automation/export-azautomationrunbook?view=azps-11.2.0&viewFallbackFrom=azps-9.4.0).

1. Associate the relocated Azure Automation instance to the target Log Analytics workspace.

1. Configure the target virtual machines with desired state configuration from the relocated Azure Automation instance as per source.

### Validate relocation

Once the relocation is complete, the Azure Automation needs to be tested and validated. Below are some of the recommended guidelines.

- Run manual or automated smoke and integration tests to ensure that configurations and dependent resources have been properly linked, and that configured data is accessible.
- Test Azure Automation components and integration.