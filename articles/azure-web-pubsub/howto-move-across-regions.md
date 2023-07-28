---
title: Move an Azure Web PubSub resource to another region | Microsoft Docs
description: Shows you how to move an Azure Web PubSub resource to another region.
author: juniwang
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 12/22/2021
ms.author: juniwang 
ms.custom: subject-moving-resources, devx-track-azurepowershell
---

# Move an Azure Web PubSub resource to another region

There are various scenarios in which you'd want to move your existing Web PubSub resource from one region to another. **Azure Web PubSub resource are region specific and can't be moved from one region to another.** You can however, use an Azure Resource Manager template to export the existing configuration of an Azure Web PubSub resource, modify the parameters to match the destination region, and then create a copy of your Web PubSub resource in another region. For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

## Prerequisites

- Ensure that the service and features that your are using are supported in the target region.

- Verify that your Azure subscription allows you to create Web PubSub resource in the target region that's used. Contact support to enable the required quota.

- For preview features, ensure that your subscription is allowlisted for the target region.

<a id="prepare"></a>

## Prepare and move

To get started, export, and then modify a Resource Manager template.

### Export the template and deploy from the Portal

The following steps show how to prepare the Web PubSub resource move using a Resource Manager template, and move it to the target region using the portal.

1. Sign in to the [Azure portal](https://portal.azure.com) > **Resource Groups**.

2. Locate the Resource Group that contains the source Web PubSub resource and click on it.

3. Select > **Automation** > **Export template**.

4. Choose **Deploy** in the **Export template** blade.

5. Click **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.

6. To edit the parameter of the Web PubSub resource name, change the **value** property under **parameters**:

    ```json
          {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
              "webpubsub_myWebPubSub_name": {
                "value": "<target-webpubsub-name>"
              }
            }
          }
    ```

7. Change the value in the editor to a name of your choice for the target Web PubSub resource. Ensure you enclose the name in quotes.

8.  Click **Save** in the editor.

9.  Click **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region, change the **location** property under **resources** in the online editor:

    ```json
        "resources": [
          {
            "type": "Microsoft.SignalRService/webPubSub",
            "apiVersion": "2021-10-01",
            "name": "[parameters('webpubsub_myWebPubSub_name')]",
            "location": "<target-region>",
            "properties": {
            }
          }
        ]

    ```

11. To obtain region location codes, see [Azure Web PubSub Locations](https://azure.microsoft.com/global-infrastructure/services/?products=web-pubsub).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

12. You can also change other parameters in the template if you choose, and are optional depending on your requirements.

13. Click **Save** in the online editor.

14. Click **BASICS** > **Subscription** to choose the subscription where the target resource will be deployed.

15. Click **BASICS** > **Resource group** to choose the resource group where the target resource will be deployed.  You can click **Create new** to create a new resource group for the target resource.  Ensure the name isn't the same as the source resource group of the existing resource.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the resource to be deployed.

17. Click the **Review + create** button to deploy the target Azure Web PubSub resource.


### Export the template and deploy using Azure PowerShell

To export a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the Web PubSub resource that you want to move.

   ```azurepowershell-interactive
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

3. Export the template of your source Web PubSub resource. These commands save a json template to your current directory.

   ```azurepowershell-interactive
   $resource = Get-AzResource `
      -ResourceGroupName <resource-group-name> `
      -ResourceName <webpubsub-resource-name> `
      -ResourceType Microsoft.SignalRService/WebPubSub
   Export-AzResourceGroup `
      -ResourceGroupName <resource-group-name> `
      -Resource $resource.ResourceId `
      -IncludeParameterDefaultValue
   ```

4. The file downloaded will be named after the resource group the resource was exported from.  Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad <source-resource-group-name>.json
   ```

5. To edit the parameter of the Web PubSub resource name, change the property **defaultValue** of the source Web PubSub resource name to the name of your target Web PubSub resource, ensure the name is in quotes:
    
    ```json
      {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
          "webPubSub_myWebPubSub_name": {
          "defaultValue": "<target-webpubsub-name>",
            "type": "String"
          }
        }
      }
    ```

6. To edit the target region where the Web PubSub resource will be moved, change the **location** property under resources:

    ```json
        "resources": [
          {
            "type": "Microsoft.SignalRService/WebPubSub",
            "apiVersion": "2021-10-01",
            "name": "[parameters('webPubSub_myWebPubSub_name')]",
            "location": "<target-region>",
            "properties": {
            }
          }
        ]
    ```
  
7. To obtain region location codes, see [Azure Web PubSub Locations](https://azure.microsoft.com/global-infrastructure/services/?products=web-pubsub).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

8. You can also change other parameters in the template if you choose, and are optional depending on your requirements.

9. Save the **\<resource-group-name>.json** file.

10. Create a resource group in the target region for the target Web PubSub resource to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```

11. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive
    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    ```

12. To verify the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzWebPubSub](/powershell/module/az.signalr/get-azwebpubsub):
    
    ```azurepowershell-interactive
    Get-AzResourceGroup -Name <target-resource-group-name>
    ```

    ```azurepowershell-interactive
    Get-AzWebPubSub -Name <target-webpubsub-name> -ResourceGroupName <target-resource-group-name>
    ```

## Discard

After the deployment, if you wish to start over or discard the Web PubSub resource in the target, delete the resource group that was created in the target and the moved Web PubSub resource will be deleted. To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page. Alternatively you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive
Remove-AzResourceGroup -Name <target-resource-group-name>
```

## Clean up

To commit the changes and complete the move of the Web PubSub resource, delete the source Web PubSub resource or resource group. To do so, select the Web PubSub resource or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure Web PubSub resource from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
