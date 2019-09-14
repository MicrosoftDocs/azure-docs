---
title: Move Azure network security group (NSG) to another Azure region using Azure PowerShell
description: Use Azure Resource Manager template to move Azure network security group from one Azure region to another using Azure PowerShell.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 08/31/2019
ms.author: allensu
---

# Move Azure network security group (NSG) to another region using Azure PowerShell

There are various scenarios in which you'd want to move your existing NSGs from one region to another. For example, you may want to create a NSG with the same configuration and security rules for testing. You may also want to move a NSG to another region as part of disaster recovery planning.

Azure security groups can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration and security rules of a NSG.  You can then stage the resource in another region by exporting the NSG to a template, modifying the parameters to match the destination region, and then deploy the template to the new region.  For more information on Resource Manager and templates, see [Export resource groups to templates](https://docs.microsoft.com/azure/azure-resource-manager/manage-resource-groups-powershell#export-resource-groups-to-templates)


## Prerequisites

- Make sure that the Azure network security group is in the Azure region from which you want to move.

- Azure network security groups can't be moved between regions.  You will have to associate the new NSG to resources in the target region.

- To export a NSG configuration and deploy a template to create a NSG in another region, you'll need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create NSGs in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of NSGs for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits)


## Prepare and move
The following steps show how to prepare the network security group for the configuration and security rule move using an Resource Manager template, and move the NSG configuration and security rules to the target region using Azure PowerShell.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the template and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

3. Login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
4. Locate the Resource Group that contains the source NSG and click on it.
5. Select > **Settings** > **Export template**.
6. Choose **Download** in the **Export template** blade.
7. Locate the .zip file downloaded from the portal containing the template and unzip to a folder of your choice.  In this zip file is the .json files needed for the template and a shell script and PowerShell script to deploy the template.
8. To edit the parameter of the NSG name, open the **parameters.json** file and edit the **value** property:
    
    ```json
     {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "networkSecurityGroups_myVM1_nsg_name": {
            "value": "null"
        }
       }
     }

    ```

9. Change the **null** value in the .json file to a name of your choice for the target NSG. Save the parameters.json file. Ensure you enclose the name in quotes.

10. To edit the target region where the NSG configuration and security rules will be moved, open the **template.json** file:

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
             }
            }
       ```
  
11. Edit the **location** property in the **template.json** file to the target region. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Security rules** - You can edit which rules are deployed into the target NSG by adding or removing rules to the **securityRules** section in the **template.json** file:
    
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
                    },
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

13. Save the **template.json** file.

14. Change to the directory where you unzipped the template files and saved the parameters.json file and run the following command to deploy the template and NSG into the target region:

    ```azurepowershell-interactive

    ./deploy.ps1 -subscription "Azure Subscription" -resourceGroupName myresourcegroup -resourceGroupLocation targetregion
    
    ```

## Discard 

After the deployment, if you wish to start over or discard the NSG in the target, delete the resource group that was created in the target and the moved NSG will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

## Clean up

To commit the changes and complete the move of the NSG, delete the source NSG or resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0) or [Remove-AzNetworkSecurityGroup](https://docs.microsoft.com/powershell/module/az.network/remove-aznetworksecuritygroup?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

``` azurepowershell-interactive

Remove-AzNetworkSecurityGroup -Name <public-ip> -ResourceGroupName <resource-group-name>

```

## Next steps

In this tutorial, you moved an Azure network security group from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
