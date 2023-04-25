---
title: Move Azure Public IP configuration to another Azure region - Azure portal
description: Use a template to move Azure Public IP configuration from one Azure region to another using the Azure portal.
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/29/2019
ms.author: allensu
---

# Move Azure Public IP configuration to another region using the Azure portal

There are various scenarios in which you'd want to move your existing Azure Public IP configurations from one region to another. For example, you may want to create a public IP with the same configuration and sku for testing. You may also want to move a public IP configuration to another region as part of disaster recovery planning.

**Azure Public IPs are region specific and can't be moved from one region to another.** You can however, use an Azure Resource Manager template to export the existing configuration of a public IP.  You can then stage the resource in another region by exporting the public IP to a template, modifying the parameters to match the destination region, and then deploy the template to the new region.  For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).


## Prerequisites

- Make sure that the Azure Public IP is in the Azure region from which you want to move.

- Azure Public IPs can't be moved between regions.  You'll have to associate the new public ip to resources in the target region.

- To export a public IP configuration and deploy a template to create a public IP in another region, you'll need the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups (NSGs), and virtual networks.

- Verify that your Azure subscription allows you to create public IPs in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of public IPs for this process.  See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).


## Prepare and move
The following steps show how to prepare the public IP for the configuration move using a Resource Manager template, and move the public IP configuration to the target region using the Azure portal.

### Export the template and deploy from a script

1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source public IP and click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** in the **Export template** blade.
5. Click **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.
8. To edit the parameter of the public IP name, change the property under **parameters** > **value** from the source public IP name to the name of your target public IP, ensure the name is in quotes:

    ```json
            {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "publicIPAddresses_myVM1pubIP_name": {
            "value": "<target-publicip-name>"
              }
             }
            }

    ```
8.  Click **Save** in the editor.

9.  Click **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region where the public IP will be moved, change the **location** property under **resources**:

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

11. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the public IP in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

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

        For more information on the differences between basic and standard sku public ips, see [Create, change, or delete a public IP address](./ip-services/virtual-network-public-ip-address.md):

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

        ```

        For more information on the allocation methods and the idle timeout values, see [Create, change, or delete a public IP address](./ip-services/virtual-network-public-ip-address.md).


13. Click **Save** in the online editor.

14. Click **BASICS** > **Subscription** to choose the subscription where the target public IP will be deployed.

15. Click **BASICS** > **Resource group** to choose the resource group where the target public IP will be deployed.  You can click **Create new** to create a new resource group for the target public IP.  Ensure the name isn't the same as the source resource group of the existing source public IP.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the public IP to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

18. Check the box under **TERMS AND CONDITIONS**.

19. Click the **Purchase** button to deploy the target public IP.

## Discard

If you wish to discard the target public IP, delete the resource group that contains the target public IP.  To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the public IP, delete the source public IP or resource group. To do so, select the public IP or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure Public IP from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)