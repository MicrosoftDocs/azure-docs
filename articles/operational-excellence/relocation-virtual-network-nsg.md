---
title: Relocate Azure NSG to another region
description: Learn how to use ARM templates to relocate Azure network security group (NSG) to another region
author: anaharris-ms
ms.author: anaharris
ms.date: 03/01/2024
ms.service: azure-storage
ms.topic: concept
ms.custom: subject-relocation
---


# Relocate Azure network security group (NSG) to another region

This article shows you how to relocate an NSG to a new region by creating a copy of the source configuration and security rules of the NSG to another region.


## Prerequisites

- Make sure that the Azure network security group is in the target Azure region.

- Associate the new NSG to resources in the target region.

- To export an NSG configuration and deploy a template to create an NSG in another region, you'll need the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create NSGs in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of NSGs for this process.  See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).


## Prepare

The following steps show how to prepare the network security group for the configuration and security rule move using a Resource Manager template, and move the NSG configuration and security rules to the target region using the portal.


### Export and modify a template

# [Portal](#tab/azure-portal)

To export and modify a template by using Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All resources** and then select your storage account.

3. Select > **Automation** > **Export template**.

4. Choose **Deploy** in the **Export template** blade.

5. Select **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.

6. To edit the parameter of the NSG name, change the **value** property under **parameters**:

    ```json
            {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
            "networkSecurityGroups_myVM1_nsg_name": {
               "value": "<target-nsg-name>"
                }
               }
            }
    ```

7. Change the source NSG value in the editor to a name of your choice for the target NSG. Ensure you enclose the name in quotes.

8.  Select **Save** in the editor.

9.  Select **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region where the NSG configuration and security rules will be moved, change the **location** property under **resources** in the online editor:

    ```json
            "resources": [
            {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2019-06-01",
            "name": "[parameters('networkSecurityGroups_myVM1_nsg_name')]",
            "location": "<target-region>",
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "2c846acf-58c8-416d-be97-ccd00a4ccd78",
             }
            }
           ]

    ```

11. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Security rules** - You can edit which rules are deployed into the target NSG by adding or removing rules to the **securityRules** section in the **template.json** file:

        ```json
           "resources": [
            {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2019-06-01",
            "name": "[parameters('networkSecurityGroups_myVM1_nsg_name')]",
            "location": "<target-region>",
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "2c846acf-58c8-416d-be97-ccd00a4ccd78",
                "securityRules": [
                    {
                        "name": "RDP",
                        "etag": "W/\"c630c458-6b52-4202-8fd7-172b7ab49cf5\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "protocol": "TCP",
                            "sourcePortRange": "*",
                            "destinationPortRange": "3389",
                            "sourceAddressPrefix": "*",
                            "destinationAddressPrefix": "*",
                            "access": "Allow",
                            "priority": 300,
                            "direction": "Inbound",
                            "sourcePortRanges": [],
                            "destinationPortRanges": [],
                            "sourceAddressPrefixes": [],
                            "destinationAddressPrefixes": []
                             }
                    },
                ]
            }
        ```

      To complete the addition or the removal of the rules in the target NSG, you must also edit the custom rule types at the end of the **template.json** file in the format of the example below:

      ```json
           {
            "type": "Microsoft.Network/networkSecurityGroups/securityRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('networkSecurityGroups_myVM1_nsg_name'), '/Port_80')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/networkSecurityGroups', parameters('networkSecurityGroups_myVM1_nsg_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "protocol": "*",
                "sourcePortRange": "*",
                "destinationPortRange": "80",
                "sourceAddressPrefix": "*",
                "destinationAddressPrefix": "*",
                "access": "Allow",
                "priority": 310,
                "direction": "Inbound",
                "sourcePortRanges": [],
                "destinationPortRanges": [],
                "sourceAddressPrefixes": [],
                "destinationAddressPrefixes": []
            }
      ```

13. Select **Save** in the online editor.


# [PowerShell](#tab/azure-powershell)

To export and modify a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the resource ID of the NSG you want to move to the target region and place it in a variable using [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup):

    ```azurepowershell-interactive
    $sourceNSGID = (Get-AzNetworkSecurityGroup -Name <source-nsg-name> -ResourceGroupName <source-resource-group-name>).Id

    ```
3. Export the source NSG to a .json file into the directory where you execute the command [Export-AzResourceGroup](/powershell/module/az.resources/export-azresourcegroup):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceNSGID -IncludeParameterDefaultValue
   ```

4. The file downloaded will be named after the resource group the resource was exported from.  Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad <source-resource-group-name>.json
   ```

5. To edit the parameter of the NSG name, change the property **defaultValue** of the source NSG name to the name of your target NSG, ensure the name is in quotes:
    
    ```json
            {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "networkSecurityGroups_myVM1_nsg_name": {
            "defaultValue": "<target-nsg-name>",
            "type": "String"
            }
        }

    ```


6. To edit the target region where the NSG configuration and security rules will be moved, change the **location** property under **resources**:

    ```json
            "resources": [
            {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2019-06-01",
            "name": "[parameters('networkSecurityGroups_myVM1_nsg_name')]",
            "location": "<target-region>",
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "2c846acf-58c8-416d-be97-ccd00a4ccd78", 
             }
            }
    ```
  
7. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](/powershell/module/az.resources/get-azlocation) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
8. You can also change other parameters in the **\<resource-group-name>.json** if you choose, and are optional depending on your requirements:

    * **Security rules** - You can edit which rules are deployed into the target NSG by adding or removing rules to the **securityRules** section in the **\<resource-group-name>.json** file:

        ```json
           "resources": [
                  {
                  "type": "Microsoft.Network/networkSecurityGroups",
                  "apiVersion": "2019-06-01",
                  "name": "[parameters('networkSecurityGroups_myVM1_nsg_name')]",
                  "location": "TARGET REGION",
                  "properties": {
                       "provisioningState": "Succeeded",
                       "resourceGuid": "2c846acf-58c8-416d-be97-ccd00a4ccd78",
                  "securityRules": [
                    {
                        "name": "RDP",
                        "etag": "W/\"c630c458-6b52-4202-8fd7-172b7ab49cf5\"",
                        "properties": {
                             "provisioningState": "Succeeded",
                             "protocol": "TCP",
                             "sourcePortRange": "*",
                             "destinationPortRange": "3389",
                             "sourceAddressPrefix": "*",
                             "destinationAddressPrefix": "*",
                             "access": "Allow",
                             "priority": 300,
                             "direction": "Inbound",
                             "sourcePortRanges": [],
                             "destinationPortRanges": [],
                             "sourceAddressPrefixes": [],
                             "destinationAddressPrefixes": []
                            }
                        ]
            }  
            
        ```

        To complete the addition or the removal of the rules in the target NSG, you must also edit the custom rule types at the end of the **\<resource-group-name>.json** file in the format of the example below:

        ```json
           {
            "type": "Microsoft.Network/networkSecurityGroups/securityRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('networkSecurityGroups_myVM1_nsg_name'), '/Port_80')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/networkSecurityGroups', parameters('networkSecurityGroups_myVM1_nsg_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "protocol": "*",
                "sourcePortRange": "*",
                "destinationPortRange": "80",
                "sourceAddressPrefix": "*",
                "destinationAddressPrefix": "*",
                "access": "Allow",
                "priority": 310,
                "direction": "Inbound",
                "sourcePortRanges": [],
                "destinationPortRanges": [],
                "sourceAddressPrefixes": [],
                "destinationAddressPrefixes": []
            }
        ```

9. Save the **\<resource-group-name>.json** file.


---

## Redeploy

# [Portal](#tab/azure-portal)


1. Select **BASICS** > **Subscription** to choose the subscription where the target NSG will be deployed.

1. Select **BASICS** > **Resource group** to choose the resource group where the target NSG will be deployed.  You can click **Create new** to create a new resource group for the target NSG.  Ensure the name isn't the same as the source resource group of the existing NSG.

1. Select **BASICS** > **Location** is set to the target location where you wish for the NSG to be deployed.

1. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

1. Check the box under **TERMS AND CONDITIONS**.

1. Select the **Purchase** button to deploy the target network security group.

# [PowerShell](#tab/azure-powershell)

1. Create a resource group in the target region for the target NSG to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
    
1. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    
    ```

1. To verify the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>

    ```

    ```azurepowershell-interactive

    Get-AzNetworkSecurityGroup -Name <target-nsg-name> -ResourceGroupName <target-resource-group-name>

    ```
---


## Discard

# [Portal](#tab/azure-portal)

If you wish to discard the target NSG, delete the resource group that contains the target NSG.  To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

# [PowerShell](#tab/azure-powershell)

After the deployment, if you wish to start over or discard the NSG in the target, delete the resource group that was created in the target and the moved NSG will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <target-resource-group-name>

```
---

## Clean up

# [Portal](#tab/azure-portal)

To commit the changes and complete the move of the NSG, delete the source NSG or resource group. To do so, select the network security group or resource group from your dashboard in the portal and select **Delete** at the top of each page.

# [PowerShell](#tab/azure-powershell)

To commit the changes and complete the move of the NSG, delete the source NSG or resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) or [Remove-AzNetworkSecurityGroup](/powershell/module/az.network/remove-aznetworksecuritygroup):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <source-resource-group-name>

```

``` azurepowershell-interactive

Remove-AzNetworkSecurityGroup -Name <source-nsg-name> -ResourceGroupName <source-resource-group-name>

```

---

## Next steps

In this tutorial, you moved an Azure network security group from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
