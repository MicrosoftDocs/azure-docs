---
title: Deploy template - Azure portal
description: Learn how to create your first Azure Resource Manager template (ARM template) using the Azure portal. You also learn how to deploy it.
author: mumian
ms.date: 08/22/2022
ms.topic: quickstart
ms.author: jgao
ms.custom: contperf-fy21q3, mode-ui, devx-track-arm-template
#Customer intent: As a developer new to Azure deployment, I want to learn how to use the Azure portal to create and edit Resource Manager templates, so I can use the templates to deploy Azure resources.
---

# Quickstart: Create and deploy ARM templates by using the Azure portal 

In this quickstart, you learn how to create an Azure Resource Manager template (ARM template) in the Azure portal. You edit and deploy the template from the portal.

ARM templates are JSON or Bicep files that define the resources you need to deploy for your solution. To understand the concepts associated with deploying and managing your Azure solutions, see [template deployment overview](overview.md).

After completing the tutorial, you deploy an Azure Storage account. The same process can be used to deploy other Azure resources.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Retrieve a custom template

Rather than manually building an entire ARM template, let's start by retrieving a pre-built template that accomplishes our goal. The [Azure Quickstart Templates repo](https://github.com/Azure/azure-quickstart-templates) repo contains a large collection of templates that deploy common scenarios. The portal makes it easy for you find and use templates from this repo. You can save the template and reuse it later.

1. In a web browser, go to the [Azure portal](https://portal.azure.com) and sign in.
1. From the Azure portal search bar, search for **deploy a custom template** and then select it from the available options.

    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/search-custom-template.png" alt-text="Screenshot of searching for custom template in Azure portal.":::

1. For **Template** source, notice that **Quickstart template** is selected by default. You can keep this selection. In the drop-down, search for *quickstarts/microsoft.storage/storage-account-create* and select it. After finding the quickstart template, select **Select template.**

    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/select-custom-template.png" alt-text="Screenshot of selecting a Quickstart Template in Azure portal.":::

1. In the next blade, you provide custom values to use for the deployment.

    For **Resource group**, select **Create new** and provide *myResourceGroup* for the name. You can use the default values for the other fields. When you've finished providing values, select **Review + create**.

    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/input-fields-template.png" alt-text="Screenshot of input fields for custom template in Azure portal.":::
 
1. The portal validates your template and the values you provided. After validation succeeds, select **Create** to start the deployment.
 
    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/template-validation.png" alt-text="Screenshot of template validation and create button in Azure portal.":::

1. Once your validation has passed, you'll see the status of the deployment. When it completes successfully, select **Go to resource** to see the storage account.

     :::image type="content" source="./media/quickstart-create-templates-use-the-portal/deploy-success.png" alt-text="Screenshot of deployment succeeded notification in Azure portal.":::

1. From this screen, you can view the new storage account and its properties.

     :::image type="content" source="./media/quickstart-create-templates-use-the-portal/view-storage-account.png" alt-text="Screenshot of view deployment page with storage account in Azure portal.":::

## Edit and deploy the template

You can use the portal for quickly developing and deploying ARM templates. In general, we recommend using Visual Studio Code for developing your ARM templates, and Azure CLI or Azure PowerShell for deploying the template, but you can use the portal for quick deployments without installing those tools.

In this section, let's suppose you have an ARM template that you want to deploy one time without setting up the other tools.

1. Again, select **Deploy a custom template** in the portal.

1. This time, select **Build your own template in the editor**.

   :::image type="content" source="./media/quickstart-create-templates-use-the-portal/build-own-template.png" alt-text="Screenshot of build your own template option in Azure portal.":::  

1. You see a blank template.

   :::image type="content" source="./media/quickstart-create-templates-use-the-portal/blank-template.png" alt-text="Screenshot of blank ARM template in Azure portal.":::

1. Replace the blank template with the following template. It deploys a virtual network with a subnet.

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
     "contentVersion": "1.0.0.0",
     "parameters": {
       "vnetName": {
         "type": "string",
         "defaultValue": "VNet1",
         "metadata": {
           "description": "VNet name"
         }
       },
       "vnetAddressPrefix": {
         "type": "string",
         "defaultValue": "10.0.0.0/16",
         "metadata": {
           "description": "Address prefix"
         }
       },
       "subnetPrefix": {
         "type": "string",
         "defaultValue": "10.0.0.0/24",
         "metadata": {
           "description": "Subnet Prefix"
         }
       },
       "subnetName": {
         "type": "string",
         "defaultValue": "Subnet1",
         "metadata": {
           "description": "Subnet Name"
         }
       },
       "location": {
         "type": "string",
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
           "description": "Location for all resources."
         }
       }
     },
     "resources": [
       {
         "type": "Microsoft.Network/virtualNetworks",
         "apiVersion": "2021-08-01",
         "name": "[parameters('vnetName')]",
         "location": "[parameters('location')]",
         "properties": {
           "addressSpace": {
             "addressPrefixes": [
               "[parameters('vnetAddressPrefix')]"
             ]
           },
           "subnets": [
             {
               "name": "[parameters('subnetName')]",
               "properties": {
                 "addressPrefix": "[parameters('subnetPrefix')]"
               }
             }
           ]
         }
       }
     ]
   }
   ``` 

1. Select **Save**.

1. You see the blade for providing deployment values. Again, select **myResourceGroup** for the resource group. You can use the other default values. When you're done providing values, select **Review + create**

1. After the portal validates the template, select **Create**.

1. When the deployment completes, you see the status of the deployment. This time select the name of the resource group.

   :::image type="content" source="./media/quickstart-create-templates-use-the-portal/view-second-deployment.png" alt-text="Screenshot of view second deployment page in Azure portal.":::

1. Notice that your resource group now contains a storage account and a virtual network.
    
   :::image type="content" source="./media/quickstart-create-templates-use-the-portal/view-resource-group.png" alt-text="Screenshot of resource group with storage account and virtual network in Azure portal.":::

## Export a custom template 

Sometimes the easiest way to work with an ARM template is to have the portal generate it for you. The portal can create an ARM template based on the current state of your resource group.

1. In your resource group, select **Export template**. 
 
   :::image type="content" source="./media/quickstart-create-templates-use-the-portal/export-template.png" alt-text="Screenshot of export template option in Azure portal.":::

1. The portal generates a template for you based on the current state of the resource group. Notice that this template isn't the same as either template you deployed earlier. It contains definitions for both the storage account and virtual network, along with other resources like a blob service that was automatically created for your storage account.

1. To save this template for later use, select **Download**.

   :::image type="content" source="./media/quickstart-create-templates-use-the-portal/download-template.png" alt-text="Screenshot of download button for exported ARM template in Azure portal."::: 

You now have an ARM template that represents the current state of the resource group. This template is auto-generated. Before using the template for production deployments, you may want to revise it, such as adding parameters for template reuse.

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. In the Azure portal, select **Resource groups** on the left menu.
1. Enter the resource group name in the **Filter for any field** search box.
1. Select the resource group name.  You shall see the storage account in the resource group.
1. Select **Delete resource group** in the top menu.

## Next steps

In this tutorial, you learned how to generate a template from the Azure portal, and how to deploy the template using the portal. The template used in this Quickstart is a simple template with one Azure resource. When the template is complex, it's easier to use Visual Studio Code, or Visual Studio to develop the template. To learn more about template development, see our new beginner tutorial series:

> [!div class="nextstepaction"]
> [Beginner tutorials](./template-tutorial-create-first-template.md)
