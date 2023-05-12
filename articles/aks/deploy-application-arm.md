---
author: maanasagovi
ms.author: maanasagovi
ms.topic: conceptual
ms.date: 05/15/2023
---

# Deploying an Azure Kubernetes Application Through an ARM Template

To deploy the Kubernetes application programmatically, first select the Kubernetes application, then generate an ARM template, accept legal terms and conditions, and finally deploy the ARM template.

## Select Kubernetes Application

1. Log into your Microsoft [Marketplace in Azure Portal](https://ms.portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home/fromContext/AKS). 

1. Select your Kubernetes application

1. Select the required plan

1. Click on the ‘Usage Information + Support’ tab to obtain the publisherID, productID, and planID. Copy and save these IDs for later use in accepting terms and agreements

![User-Usage-and-information-blade-to-provide-parameters.](user-usage-information.png)

## Generate ARM Template

1. Click on the 'Create' button above

1. Fill out all the application (extension) details

1. In the 'Review + Create' tab, click on 'Download a template for automation.' If all the validations are passed, you will be able to successfully view the ARM template in the editor. 

![automation image](https://github.com/maanasagovi/azure-docs-pr/assets/112022180/5c19ff29-eebe-4ba0-9818-2c37d5cb44fd)

![Users-ARM-template-in-editor-view.](media/armtemplatedeployk8apps/download-arm-template.png)

4. Finally, copy the ARM template to a file.

## Accept Terms and Agreements

After generating your ARM template, you will need to accept the terms and agreements before being able to deploy it. To accept the terms and agreements you can use the [Azure CLI](/cli/azure/vm/image/terms?view=azure-cli-latest) or[ PowerShell](/powershell/module/azurerm.marketplaceordering/?view=azurermps-6.13.0) commands. For 'Publisher ID,' 'Product ID,' and 'Plan ID,' use the values previously copied above. 

# [Azure CLI](#tab/azure-cli/linux)
az vm image terms accept --offer <Product ID> --plan <Plan ID> --publisher <Publisher ID>

Note: Although the commands are for VMs, the commands also work for containers
---

# [Azure PowerShell](#tab/azure-powershell/linux)
## Get-AzureRmMarketplaceTerms -Publisher <Publisher ID> -Product <Product ID> -Name <Plan ID>

## Deploy ARM Template

Once you've accepted the terms, you can deploy your ARM template. To deploy your ARM template, follow the steps [here.](/azure/azure-resource-manager/templates/template-tutorial-create-first-template?tabs=azure-cli)
