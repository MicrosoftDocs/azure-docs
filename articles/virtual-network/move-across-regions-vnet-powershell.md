---
title: Move an Azure virtual network to another Azure region - Azure PowerShell
description: Move an Azure virtual network from one Azure region to another by using a Resource Manager template and Azure PowerShell.
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/26/2019
ms.author: allensu 
ms.custom: devx-track-azurepowershell
---

# Move an Azure virtual network to another region by using Azure PowerShell

There are various scenarios for moving an existing Azure virtual network from one region to another. For example, you might want to create a virtual network with the same configuration for testing and availability as your existing virtual network. Or you might want to move a production virtual network to another region as part of your disaster recovery planning.

You can use an Azure Resource Manager template to complete the move of the virtual network to another region. You do this by exporting the virtual network to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. For more information about Resource Manager templates, see [Export resource groups to templates](../azure-resource-manager/management/manage-resource-groups-powershell.md#export-resource-groups-to-templates).


## Prerequisites

- Make sure that your virtual network is in the Azure region that you want to move from.

- To export a virtual network and deploy a template to create a virtual network in another region, you need to have the Network Contributor role or higher.

- Virtual network peerings won't be re-created, and they'll fail if they're still present in the template. Before you export the template, you have to remove any virtual network peers. You can then reestablish them after the virtual network move.
    
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups (NSGs), and public IPs.

- Verify that your Azure subscription allows you to create virtual networks in the target region. To enable the required quota, contact support.

- Make sure that your subscription has enough resources to support the addition of virtual networks for this process. For more information, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).


## Prepare for the move
In this section, you prepare the virtual network for the move by using a Resource Manager template. You then move the virtual network to the target region by using Azure PowerShell commands.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To export the virtual network and deploy the target virtual network by using PowerShell, do the following:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command, and then follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

1. Obtain the resource ID of the virtual network that you want to move to the target region, and then place it in a variable by using [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):

    ```azurepowershell-interactive
    $sourceVNETID = (Get-AzVirtualNetwork -Name <source-virtual-network-name> -ResourceGroupName <source-resource-group-name>).Id
    ```

1. Export the source virtual network to a .json file in the directory where you execute the command [Export-AzResourceGroup](/powershell/module/az.resources/export-azresourcegroup):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceVNETID -IncludeParameterDefaultValue
   ```

1. The downloaded file has the same name as the resource group that the resource was exported from. Locate the *\<resource-group-name>.json* file, which you exported with the command, and then open it in your editor:
   
   ```azurepowershell
   notepad <source-resource-group-name>.json
   ```

1. To edit the parameter of the virtual network name, change the **defaultValue** property of the source virtual network name to the name of your target virtual network. Be sure to enclose the name in quotation marks.
    
    ```json
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentmyResourceGroupVNET.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "virtualNetworks_myVNET1_name": {
        "defaultValue": "<target-virtual-network-name>",
        "type": "String"
        }
    ```

1. To edit the target region where the virtual network will be moved, change the **location** property under resources:

    ```json
    "resources": [
                {
                    "type": "Microsoft.Network/virtualNetworks",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('virtualNetworks_myVNET1_name')]",
                    "location": "<target-region>",
                    "properties": {
                        "provisioningState": "Succeeded",
                        "resourceGuid": "6e2652be-35ac-4e68-8c70-621b9ec87dcb",
                        "addressSpace": {
                            "addressPrefixes": [
                                "10.0.0.0/16"
                            ]
                        },

    ```
  
1. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](/powershell/module/az.resources/get-azlocation) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    ```

1. (Optional) You can also change other parameters in the *\<resource-group-name>.json* file, depending on your requirements:

    * **Address Space**: Before you save the file, you can alter the address space of the virtual network by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property:

        ```json
                "resources": [
                    {
                    "type": "Microsoft.Network/virtualNetworks",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('virtualNetworks_myVNET1_name')]",
                    "location": "<target-region",
                    "properties": {
                    "provisioningState": "Succeeded",
                    "resourceGuid": "6e2652be-35ac-4e68-8c70-621b9ec87dcb",
                    "addressSpace": {
                        "addressPrefixes": [
                        "10.0.0.0/16"
                        ]
                    },
        ```

    * **Subnet**: You can change or add to the subnet name and the subnet address space by changing the file's **subnets** section. You can change the name of the subnet by changing the **name** property. And you can change the subnet address space by changing the **addressPrefix** property:

        ```json
                "subnets": [
                    {
                    "name": "subnet-1",
                    "etag": "W/\"d9f6e6d6-2c15-4f7c-b01f-bed40f748dea\"",
                    "properties": {
                    "provisioningState": "Succeeded",
                    "addressPrefix": "10.0.0.0/24",
                    "delegations": [],
                    "privateEndpointNetworkPolicies": "Enabled",
                    "privateLinkServiceNetworkPolicies": "Enabled"
                    }
                    },
                    {
                    "name": "GatewaySubnet",
                    "etag": "W/\"d9f6e6d6-2c15-4f7c-b01f-bed40f748dea\"",
                    "properties": {
                    "provisioningState": "Succeeded",
                    "addressPrefix": "10.0.1.0/29",
                    "serviceEndpoints": [],
                    "delegations": [],
                    "privateEndpointNetworkPolicies": "Enabled",
                    "privateLinkServiceNetworkPolicies": "Enabled"
                    }
                    }

                ]
        ```

        To change the address prefix, edit the file in two places: in the code in the preceding section and in the **type** section of the following code. Change the **addressPrefix** property in the following code to match the **addressPrefix** property in the code in the preceding section.

        ```json
         "type": "Microsoft.Network/virtualNetworks/subnets",
           "apiVersion": "2019-06-01",
           "name": "[concat(parameters('virtualNetworks_myVNET1_name'), '/GatewaySubnet')]",
              "dependsOn": [
                 "[resourceId('Microsoft.Network/virtualNetworks', parameters('virtualNetworks_myVNET1_name'))]"
                   ],
              "properties": {
                 "provisioningState": "Succeeded",
                 "addressPrefix": "10.0.1.0/29",
                 "serviceEndpoints": [],
                 "delegations": [],
                 "privateEndpointNetworkPolicies": "Enabled",
                 "privateLinkServiceNetworkPolicies": "Enabled"
                  }
                 },
                  {
                  "type": "Microsoft.Network/virtualNetworks/subnets",
                  "apiVersion": "2019-06-01",
                  "name": "[concat(parameters('virtualNetworks_myVNET1_name'), '/subnet-1')]",
                     "dependsOn": [
                        "[resourceId('Microsoft.Network/virtualNetworks', parameters('virtualNetworks_myVNET1_name'))]"
                          ],
                     "properties": {
                        "provisioningState": "Succeeded",
                        "addressPrefix": "10.0.0.0/24",
                        "delegations": [],
                        "privateEndpointNetworkPolicies": "Enabled",
                        "privateLinkServiceNetworkPolicies": "Enabled"
                         }
                  }
         ]
        ```

1. Save the *\<resource-group-name>.json* file.

1. Create a resource group in the target region for the target virtual network to be deployed by using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
    
1. Deploy the edited *\<resource-group-name>.json* file to the resource group that you created in the previous step by using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    ```

1. To verify that the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>
    ```

    ```azurepowershell-interactive

    Get-AzVirtualNetwork -Name <target-virtual-network-name> -ResourceGroupName <target-resource-group-name>
    ```

## Delete the virtual network or resource group 

After you've deployed the virtual network, to start over or discard the virtual network in the target region, delete the resource group that you created in the target region, and the moved virtual network will be deleted. 

To remove the resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <target-resource-group-name>
```

## Clean up

To commit your changes and complete the virtual network move, do either of the following:

* Delete the resource group by using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

    ```azurepowershell-interactive

    Remove-AzResourceGroup -Name <source-resource-group-name>
    ```

* Delete the source virtual network by using [Remove-AzVirtualNetwork](/powershell/module/az.network/remove-azvirtualnetwork):  
    ``` azurepowershell-interactive

    Remove-AzVirtualNetwork -Name <source-virtual-network-name> -ResourceGroupName <source-resource-group-name>
    ```

## Next steps

In this tutorial, you moved a virtual network from one region to another by using PowerShell and then cleaned up the unneeded source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure virtual machines to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
