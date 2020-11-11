---
title: Move Azure Public IP configuration to another Azure region using Azure PowerShell  
description: Use Azure Resource Manager template to move Azure Public IP configuration from one Azure region to another using Azure PowerShell.
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/29/2019
ms.author: allensu
---

# Move Azure Public IP configuration to another region using Azure PowerShell

There are various scenarios in which you'd want to move your existing Azure Public IP configurations from one region to another. For example, you may want to create a public IP with the same configuration and sku for testing. You may also want to move a public IP configuration to another region as part of disaster recovery planning.

**Azure Public IPs are region specific and can't be moved from one region to another.** You can however, use an Azure Resource Manager template to export the existing configuration of a public IP.  You can then stage the resource in another region by exporting the public IP to a template, modifying the parameters to match the destination region, and then deploy the template to the new region.  For more information on Resource Manager and templates, see [Export resource groups to templates](https://docs.microsoft.com/azure/azure-resource-manager/manage-resource-groups-powershell#export-resource-groups-to-templates)


## Prerequisites

- Make sure that the Azure Public IP is in the Azure region from which you want to move.

- Azure Public IPs cannot be moved between regions.  You'll have to associate the new public ip to resources in the target region.

- To export a public IP configuration and deploy a template to create a public IP in another region, you'll need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups (NSGs), and virtual networks.

- Verify that your Azure subscription allows you to create public IPs in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of public IPs for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#networking-limits).


## Prepare and move
The following steps show how to prepare the public IP for the configuration move using a Resource Manager template, and move the public IP configuration to the target region using Azure PowerShell.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the template and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the resource ID of the public IP you want to move to the target region and place it in a variable using [Get-AzPublicIPAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress?view=azps-2.6.0):

    ```azurepowershell-interactive
    $sourcePubIPID = (Get-AzPublicIPaddress -Name <source-public-ip-name> -ResourceGroupName <source-resource-group-name>).Id

    ```
3. Export the source virtual network to a .json file into the directory where you execute the command [Export-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/export-azresourcegroup?view=azps-2.6.0):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceVNETID -IncludeParameterDefaultValue
   ```

4. The file downloaded will be named after the resource group the resource was exported from.  Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad <source-resource-group-name>.json
   ```

5. To edit the parameter of the public IP name, change the property **defaultValue** of the source public IP name to the name of your target public IP, ensure the name is in quotes:
    
    ```json
        {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "publicIPAddresses_myVM1pubIP_name": {
        "defaultValue": "<target-publicip-name>",
        "type": "String"
        }
    }

    ```

6. To edit the target region where the public IP will be moved, change the **location** property under resources:

    ```json
            "resources": [
            {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Basic",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Dynamic",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
               }
               }
             ]             
    ```
  
7. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
8. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the public IP in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **\<resource-group-name>.json** file:

         ```json
            "resources": [
                   {
                    "type": "Microsoft.Network/publicIPAddresses",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('publicIPAddresses_myPubIP_name')]",
                    "location": "<target-region>",
                    "sku": {
                        "name": "Basic",
                        "tier": "Regional"
                    },
         ```

         For more information on the differences between basic and standard sku public ips, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address).

    * **Public IP allocation method** and **Idle timeout** - You can change both of these options in the template by altering the **publicIPAllocationMethod** property from **Dynamic** to **Static** or **Static** to **Dynamic**. The idle timeout can be changed by altering the **idleTimeoutInMinutes** property to your desired amount.  The default is **4**:

         ```json
         "resources": [
                {
                "type": "Microsoft.Network/publicIPAddresses",
                "apiVersion": "2019-06-01",
                "name": "[parameters('publicIPAddresses_myPubIP_name')]",
                "location": "<target-region>",
                  "sku": {
                  "name": "Basic",
                  "tier": "Regional"
                 },
                "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Dynamic",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
                   }
                }            
         ```

        For more information on the allocation methods and the idle timeout values, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address).


9. Save the **\<resource-group-name>.json** file.

10. Create a resource group in the target region for the target public IP to be deployed using [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup?view=azps-2.6.0).
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
11. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroupdeployment?view=azps-2.6.0):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    
    ```

12. To verify the resources were created in the target region, use [Get-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/get-azresourcegroup?view=azps-2.6.0) and [Get-AzPublicIPAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress?view=azps-2.6.0):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>

    ```

    ```azurepowershell-interactive

    Get-AzPublicIPAddress -Name <target-publicip-name> -ResourceGroupName <target-resource-group-name>

    ```
## Discard 

After the deployment, if you wish to start over or discard the public ip in the target, delete the resource group that was created in the target and the moved public IP will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <target-resource-group-name>

```

## Clean up

To commit the changes and complete the move of the virtual network, delete the source virtual network or resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0) or [Remove-AzPublicIPAddress](https://docs.microsoft.com/powershell/module/az.network/remove-azpublicipaddress?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <source-resource-group-name>

```

``` azurepowershell-interactive

Remove-AzPublicIpAddress -Name <source-publicip-name> -ResourceGroupName <resource-group-name>

```

## Next steps

In this tutorial, you moved an Azure Public IP from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
