---
title: Relocation guidance for Azure Automation
description: Learn how to relocate an Azure Automation to a another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/19/2024
ms.service: automation
ms.topic: concept-article
ms.custom:
  - subject-relocation
---

# Relocate Azure Automation to another region

This article covers relocation guidance for [Azure Automation](../automation/overview.md) across regions.

If your Azure Automation instance doesn't have any configuration and the instance itself needs to be moved alone, you can choose to redeploy the NetApp File instance by using [Bicep, ARM Template, or Terraform](/azure/templates/microsoft.automation/automationaccounts?tabs=bicep&pivots=deployment-language-bicep).


## Prerequisites

- Identify all Automation dependant resources.
- If the system-assigned managed identity isn't being used at source, you must map user-assigned managed identity at the target.
- If the target Azure Automation needs to be enabled for private access, associate with Virtual Network for private endpoint.
- If the source Azure Automation is enabled with a private connection, create a private link and configure the private link with DNS at target. 
- For Azure Automation to communicate with Hybrid RunBook Worker, Azure Update Manager, Change Tracking, Inventory Configuration, and Automation State Configuration, you must enable port 443 for both inbound and outbound internet access.

## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).

## Prepare

To get started, export a Resource Manager template. This template contains settings that describe your Automation namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Automation resource.
3. Select **Export template**. 
4. Choose **Download** in the **Export template** page.
5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.



## Redeploy

In the diagram below, the red flow lines illustrate redeployment of the target instance along with configuration movement.

:::image type="content" source="media/relocation/automation/automation-pattern-design.png" alt-text="Diagram illustrating cold standby redeployment with configuration movement.":::


**To deploy the template to create an Automation instance in the target region:**

1. Reconfigure the template parameters for the target. 

1. Deploy the template using [ARM](/azure/automation/quickstart-create-automation-account-template), [Portal](/azure/automation/automation-create-standalone-account?tabs=azureportal)  or [PowerShell](/powershell/module/az.automation/import-azautomationrunbook?view=azps-11.2.0&preserve-view=true).

1. Use PowerShell to export all associated runbooks from the source Azure Automation instance and import them to the target instance. Reconfigure the properties as per target. For more information, see [Export-AzAuotomationRunbook](/powershell/module/az.automation/export-azautomationrunbook?view=azps-11.2.0&viewFallbackFrom=azps-9.4.0&preserve-view=true).

1. Associate the relocated Azure Automation instance to the target Log Analytics workspace.

1. Configure the target virtual machines with desired state configuration from the relocated Azure Automation instance as per source.

## Next steps

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
