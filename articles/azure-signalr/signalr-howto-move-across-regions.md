---
title: Move an Azure SignalR resource to another region
description: Learn how to use an Azure Resource Manager template to export the configuration of an Azure SignalR resource to a different Azure region.
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 05/23/2022
ms.author: lianwei 
ms.custom: subject-moving-resources, kr2b-contr-experiment, devx-track-azurepowershell, devx-track-arm-template
---

# Move an Azure SignalR resource to another region

Azure SignalR resources are region specific and can't be moved from one region to another. There are, however, scenarios where you might want to move your existing SignalR resource to another region.

You can use an Azure Resource Manager template to export the existing configuration of an Azure SignalR resource, modify the parameters to match the destination region, and then create a copy of your SignalR resource in another region. For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

## Prerequisites

- Ensure that the service and features that you're using are supported in the target region.
- Verify that your Azure subscription allows you to create SignalR resource in the target region.
- Contact support to enable the required quota.
- For preview features, ensure that your subscription is allowlisted for the target region.

<a id="prepare"></a>

## Prepare and move your SignalR resource

To get started, export, and then modify a Resource Manager template.

### Export the template and deploy from the Azure portal

The following steps show how to prepare the SignalR resource move using a Resource Manager template, and move it to the target region using the portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource Groups**. Locate the resource group that contains the source SignalR resource and select it.

1. Under **Automation**, select **Export template**.

1. Select **Deploy**.

1. Select **TEMPLATE** > **Edit parameters** to open the *parameters.json* file in the online editor.

1. To edit the parameter of the SignalR resource name, change the `value` property under `parameters`:

    ```json
          {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
              "SignalR_mySignalR_name": {
                "value": "<target-signalr-name>"
              }
            }
          }
    ```

1. Change the value in the editor to a name of your choice for the target SignalR resource. Ensure you enclose the name in quotes.

1. Select **Save** in the editor.

1. Select **TEMPLATE** > **Edit template** to open the *template.json* file in the online editor.

1. To edit the target region, change the `location` property under `resources` in the online editor:

    ```json
        "resources": [
          {
            "type": "Microsoft.SignalRService/SignalR",
            "apiVersion": "2021-10-01",
            "name": "[parameters('SignalR_mySignalR_name')]",
            "location": "<target-region>",
            "properties": {
            }
          }
        ]

    ```

1. To obtain region location codes, see [Azure SignalR Locations](https://azure.microsoft.com/global-infrastructure/services/?products=signalr-service). The code for a region is the region name with no spaces, **Central US** = **centralus**.

1. You can also change other parameters in the template if you choose, and are optional depending on your requirements.

1. Select **Save** in the online editor.

1. Select **BASICS** > **Subscription** to choose the subscription where the target resource will be deployed.

1. Select **BASICS** > **Resource group** to choose the resource group where the target resource will be deployed.  You can select **Create new** to create a new resource group for the target resource. Ensure the name isn't the same as the source resource group of the existing resource.

1. Verify **BASICS** > **Location** is set to the target location where you wish for the resource to be deployed.

1. Select **Review + create** to deploy the target Azure SignalR resource.

### Export the template and deploy using Azure PowerShell

To export a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

1. If your identity is associated with more than one subscription, then set your active subscription to subscription of the SignalR resource that you want to move.

   ```azurepowershell-interactive
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

1. Export the template of your source SignalR resource. These commands save a JSON template to your current directory.

   ```azurepowershell-interactive
   $resource = Get-AzResource `
      -ResourceGroupName <resource-group-name> `
      -ResourceName <signalr-resource-name> `
      -ResourceType Microsoft.SignalRService/SignalR
   Export-AzResourceGroup `
      -ResourceGroupName <resource-group-name> `
      -Resource $resource.ResourceId `
      -IncludeParameterDefaultValue
   ```

1. The file downloaded will be named after the resource group the resource was exported from.  Locate the file that was exported from the command named *\<resource-group-name>.json* and open it in an editor of your choice:

   ```azurepowershell
   notepad <source-resource-group-name>.json
   ```

1. To edit the parameter of the SignalR resource name, change the property `defaultValue` of the source SignalR resource name to the name of your target SignalR resource. Ensure the name is in quotes:

    ```json
      {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
          "SignalR_mySignalR_name": {
          "defaultValue": "<target-signalr-name>",
            "type": "String"
          }
        }
      }
    ```

1. To edit the target region where the SignalR resource will be moved, change the `location` property under `resources`:

    ```json
        "resources": [
          {
            "type": "Microsoft.SignalRService/SignalR",
            "apiVersion": "2021-10-01",
            "name": "[parameters('SignalR_mySignalR_name')]",
            "location": "<target-region>",
            "properties": {
            }
          }
        ]
    ```
  
1. To obtain region location codes, see [Azure SignalR Locations](https://azure.microsoft.com/global-infrastructure/services/?products=signalr-service). The code for a region is the region name with no spaces, **Central US** = **centralus**.

   You can also change other parameters in the template if you choose, depending on your requirements.

1. Save the *\<resource-group-name>.json* file.

1. Create a resource group in the target region for the target SignalR resource to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```

1. Deploy the edited *\<resource-group-name>.json* file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive
    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    ```

1. To verify that the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzSignalR](/powershell/module/az.signalr/get-azsignalr):

    ```azurepowershell-interactive
    Get-AzResourceGroup -Name <target-resource-group-name>
    Get-AzSignalR -Name <target-signalr-name> -ResourceGroupName <target-resource-group-name>
    ```

> [!NOTE]
>
> After the deployment, if you wish to start over or discard the SignalR resource in the target, delete the resource group that was created in the target, which deletes the moved SignalR resource. To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page. Alternatively you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):
>
> ```azurepowershell-interactive
> Remove-AzResourceGroup -Name <target-resource-group-name>
> ```

## Clean up source region

To commit the changes and complete the move of the SignalR resource, delete the source SignalR resource or resource group. To do so, select the SignalR resource or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure SignalR resource from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
