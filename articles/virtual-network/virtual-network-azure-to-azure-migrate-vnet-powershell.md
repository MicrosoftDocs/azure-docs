---
title: Move Azure Virtual Network to another Azure region using PowerShell
description: Use Azure Resource Manager myResourceGroupVNET to move Azure Virtual Network from one Azure region to another using PowerShell.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 08/26/2019
ms.author: allensu
---

# Move Azure Virtual Network to another region

There are various scenarios in which you'd want to move your existing Azure Virtual Networks (VNETs) from one region to another. For example, you may want to create a virtual network with the same address space and options for testing and availability of your existing virtual network. You may also want to move a production virtual network to another region as part of disaster recovery planning.

You can use an Azure Resource Manager myResourceGroupVNET to complete the move of the virtual network to another region by exporting the virtual network to a myResourceGroupVNET, modifying the parameters to match the destination region, and then deploy the myResourceGroupVNET to the new region.  For more information on Resource Manager and myResourceGroupVNETs, see [Quickstart: Create and deploy Azure Resource Manager myResourceGroupVNETs by using the Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quickstart-create-myResourceGroupVNETs-use-the-portal)


## Prerequisites

- Make sure that the Azure Virtual Network is in the Azure region from which you want to move.

- To export a virtual network and deploy a myResourceGroupVNET to create a virtual network in another region, you'll need the Network Contributor role or higher.

- Virtual network peerings won't be recreated and will fail if they're still present in the myResourceGroupVNET.  You will have to remove any virtual network peers before exporting the myResourceGroupVNET and then re-establish the peers after the move of the virtual network.
    
- Identify the source networking layout and all the resources that you're currently using. This includes but isn't limited to load balancers, network security groups (NSGs), and public IPs.

- Verify that your Azure subscription allows you to create virtual networks in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of Virtual Networks for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits)


## Prepare and move
The following steps show how to prepare the virtual network for the move using an Resource Manager myResourceGroupVNET, and move the virtual network to the target region using PowerShell commands.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the myResourceGroupVNET and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the subscription ID where you wish to deploy the target virtual network with and place in a variable [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):
   
    ```azurepowershell-interactive
    Get-AzSubscription | format-table

    $Subscription = "MySubscriptionID"
    ```
3. Obtain the resource ID of the virtual network you want to move to the target region and place it in a variable [Get-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/get-azvirtualnetwork?view=azps-2.6.0):

    ```azurepowershell-interactive
    $sourceVNETID = (Get-AzVirtualNetwork -Name myVNET -ResourceGroupName myResourceGroupVNET).Id

    ```
4. Export the source virtual network to a .json file into the directory where you execute the command [Export-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/export-azresourcegroup?view=azps-2.6.0)
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName myResourceGroupVNET -Resource $sourceVNETID -IncludeParameterDefaultValue

   ```

5. The file downloaded will be named after the resource group the resource was exported from.  Locate the file that was exported from the command named **myResourceGroupVNET.json** and open it in a editor of your choice:
   
   ```azurepowershell
   notepad myResourceGroupVNET.json
   ```

6. To edit the parameter of the virtual network name, change the property **defaultValue** of the source virtual network name to the name of your target virtual network, ensure the name is in quotes:
    
    ```json
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentmyResourceGroupVNET.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "virtualNetworks_myVNET2_name": {
        "defaultValue": "myVNET2-MOVE",
        "type": "String"
        }
    ```

7.  To edit the target region where the VNET will be moved, change the **location** property under resources:

    ```json
    "resources": [
                {
                    "type": "Microsoft.Network/virtualNetworks",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('virtualNetworks_myVNET1_name')]",
                    "location": "TARGET REGION",
                    "properties": {
                        "provisioningState": "Succeeded",
                        "resourceGuid": "6e2652be-35ac-4e68-8c70-621b9ec87dcb",
                        "addressSpace": {
                            "addressPrefixes": [
                                "10.0.0.0/16"
                            ]
                        },

    ```
  
8. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
9.  You can also change other parameters in the myResourceGroupVNET if you choose, and are optional depending on your requirements:

    * **Address Space** - The address space of the VNET can be altered in the myResourceGroupVNET before saving by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property in the **myResourceGroupVNET.json** file:
    
    ```json
                "resources": [
                            {
                                "type": "Microsoft.Network/virtualNetworks",
                                "apiVersion": "2019-06-01",
                                "name": "[parameters('virtualNetworks_myVNET1_name')]",
                                "location": "TARGET REGION",
                                "properties": {
                                    "provisioningState": "Succeeded",
                                    "resourceGuid": "6e2652be-35ac-4e68-8c70-621b9ec87dcb",
                                    "addressSpace": {
                                        "addressPrefixes": [
                                            "10.0.0.0/16"
                                        ]
                                    },
    ```

    * **Subnet** - The subnet name as well as the subnet address space can be changed or added to by modifying the **subnets** section of the **myResourceGroupVNET.json** file. The name of the subnet can be changed by altering the **name** property in the **myResourceGroupVNET.json** file.  The subnet address space can be changed by altering the **addressPrefix** property in the **myResourceGroupVNET.json** file:
    
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
                    ],
    ```

    In the **myResourceGroupVNET.json** file, to change the address prefix, it must be edited in two places, the section listed above and the **type** section listed below.  Change the **addressPrefix** property to match the one above:
                
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

10. Save the **myResourceGroupVNET.json** file.

11. Create a resource group in the target region for the target VNET to be deployed [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup?view=azps-2.6.0)
    
    ```azurpowershell-interactive
    New-AzResourceGroup -Name myResourceGroupVNET-Move -location TARGET REGION
    ```
    
12. Deploy the edited **myResourceGroupVNET.json** file to the resource group created in the previous step [New-AzResourceGroupDeployment](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroupdeployment?view=azps-2.6.0):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName myResourceGroupVNET-MOVE -TemplateFile myResourceGroupVNET.json
    
    ```

## Discard 

After the deployment, if you wish to start over or discard the virtual network in the target, delete the resource group that was created in the target and the moved virtual network will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

## Clean up

To commit the changes and complete the move of the virtual network, delete the source virtual network or resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0) or [Remove-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/remove-azvirtualnetwork?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

``` azurepowershell-interactive

Remove-AzVirtualNetwork -Name <virtual-network-name> -ResourceGroupName <resource-group-name>

```

## Next steps

In this tutorial, you moved an Azure Virtual Network from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
