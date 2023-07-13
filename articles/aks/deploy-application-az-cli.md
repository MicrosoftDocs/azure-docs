---
title: Deploy an Azure Kubernetes application programmatically by using Azure CLI
description: Learn how to deploy an Azure Kubernetes application programmatically by using Azure CLI.
author: maanasagovi
ms.author: maanasagovi
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 05/15/2023
---

# Deploy an Azure Kubernetes application programmatically by using Azure CLI

To deploy a Kubernetes application programmatically through Azure CLI, you select the Kubernetes application and settings, accept legal terms and conditions, and finally deploy the application through CLI commands.

## Select Kubernetes application

First, you need to select the Kubernetes application that you want to deploy in the Azure portal. You'll also need to copy some of the details for later use.

1. In the Azure portal, go to the [Marketplace page](https://ms.portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home/fromContext/AKS).
1. Select your Kubernetes application.
1. Select the required plan.
1. Select the **Create** button.
1. Fill out all the application (extension) details.
1. In the **Review + Create** tab, select **Download a template for automation**. If all the validations are passed, you'll see the ARM template in the editor.
1. Examine the ARM template:

   1. In the variables section, copy the `plan-name,` `plan-publisher,` `plan-offerID,` and `clusterExtensionTypeName` values for later use.

      ```json
        "variables": {
              "plan-name": "DONOTMODIFY",
              "plan-publisher": "DONOTMODIFY",
              "plan-offerID": "DONOTMODIFY",
              "releaseTrain": "DONOTMODIFY",
              "clusterExtensionTypeName": "DONOTMODIFY"
          },
      ```
  
   1. In the resource `Microsoft.KubernetesConfiguration/extensions' section, copy the `configurationSettings` section for later use..
  
   ```json
   {
               "type": "Microsoft.KubernetesConfiguration/extensions",
               "apiVersion": "2022-11-01",
               "name": "[parameters('extensionResourceName')]",          
               "properties": {
                   "extensionType": "[variables('clusterExtensionTypeName')]",
                   "autoUpgradeMinorVersion": true,
                   "releaseTrain": "[variables('releaseTrain')]",
                   "configurationSettings": {
                       "title": "[parameters('app-title')]",
                       "value1": "[parameters('app-value1')]",
                       "value2": "[parameters('app-value2')]"
                   },
   ```

   > [!NOTE]
   > If there are no configuration settings in the ARM template, refer to the application-related documentation in Azure Marketplace or on the partner's website.
  
## Accept terms and agreements

Before you can deploy a Kubernetes application, you need to accept its terms and agreements. To do so, run the following command, using the values you copied for `plan-publisher`, `plan-offerID`, and `plan-name`.

```azurecli
az vm image terms accept --offer <plan-offerID> --plan <plan-name> --publisher <plan-publisher>
```

> [!NOTE]
> Although this command is for VMs, it also works for containers. For more information, see the [`az cm image terms` reference](/cli/azure/vm/image/terms).

## Deploy the application

To deploy the application (extension) through Azure CLI, follow the steps outlined in [Deploy and manage cluster extensions by using Azure CLI](deploy-extensions-az-cli.md).

## Next steps

- Learn about [Kubernetes applications available through Marketplace](deploy-marketplace.md).
- Learn about [cluster extensions](cluster-extensions.md).
