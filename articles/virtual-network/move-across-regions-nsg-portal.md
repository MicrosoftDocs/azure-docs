---
title: Move Azure network security group (NSG) to another Azure region - Azure portal
description: Use Azure Resource Manager template to move Azure network security group from one Azure region to another using the Azure portal.
author: asudbring
ms.service: virtual-network
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 08/31/2019
ms.author: allensu
---

# Move Azure network security group (NSG) to another region using the Azure portal

There are various scenarios in which you'd want to move your existing NSGs from one region to another. For example, you may want to create an NSG with the same configuration and security rules for testing. You may also want to move an NSG to another region as part of disaster recovery planning.

Azure security groups can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration and security rules of an NSG.  You can then stage the resource in another region by exporting the NSG to a template, modifying the parameters to match the destination region, and then deploy the template to the new region.  For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).


## Prerequisites

- Make sure that the Azure network security group is in the Azure region from which you want to move.

- Azure network security groups can't be moved between regions.  You'll have to associate the new NSG to resources in the target region.

- To export an NSG configuration and deploy a template to create an NSG in another region, you'll need the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create NSGs in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of NSGs for this process.  See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).


## Prepare and move
The following steps show how to prepare the network security group for the configuration and security rule move using a Resource Manager template, and move the NSG configuration and security rules to the target region using the portal.


### Export the template and deploy from the portal

1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source NSG and click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** in the **Export template** blade.
5. Click **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.
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

8.  Click **Save** in the editor.

9.  Click **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

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

13. Click **Save** in the online editor.

14. Click **BASICS** > **Subscription** to choose the subscription where the target NSG will be deployed.

15. Click **BASICS** > **Resource group** to choose the resource group where the target NSG will be deployed.  You can click **Create new** to create a new resource group for the target NSG.  Ensure the name isn't the same as the source resource group of the existing NSG.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the NSG to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

18. Check the box under **TERMS AND CONDITIONS**.

19. Click the **Purchase** button to deploy the target network security group.

## Discard

If you wish to discard the target NSG, delete the resource group that contains the target NSG.  To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the NSG, delete the source NSG or resource group. To do so, select the network security group or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure network security group from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
