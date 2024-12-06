---
title: Move an Azure Load Balancer to another Azure region
description: Use an Azure Resource Manager template to move an external or internal load balancer from one Azure region to another using the Azure portal or Azure PowerShell.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 11/27/2024
ms.author: mbender
ms.custom: template-how-to, devx-track-arm-template, engagement-fy23
---

# Move an Azure Load Balancer to another Azure region

There are various scenarios in which you'd want to move an internal or external load balancer from one region to another. For example, you might want to create another load balancer with the same configuration for testing. You also might want to move a load balancer to another region as part of disaster recovery planning.

In a literal sense, you can't move an Azure load balancer from one region to another. But you can use an Azure Resource Manager template to export the existing configuration and public IP address of a load balancer. You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. For more information on Resource Manager and templates, see [Export resource groups to templates](../azure-resource-manager/management/manage-resource-groups-powershell.md#export-resource-groups-to-templates).

In this article, you learn how to move an external or internal load balancer from one Azure region to another using the Azure portal or Azure PowerShell. Choose the tab that matches your preferred method and the type of load balancer you want to move.

# [External load balancer](#tab/external-load-balancer)

## Move an external load balancer to another region using the Azure portal

Use this procedure to move an external load balancer to another region using the Azure portal or Azure PowerShell.

# [Internal load balancer](#tab/internal-load-balancer)

## Move an Internal load balancer to another region using the Azure portal

Use this procedure to move an internal load balancer to another region using the Azure portal or Azure PowerShell.

---

# [Azure portal](#tab/azure-portal/external-load-balancer)

#### Prerequisites

- Make sure the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers can't be moved between regions. You have to associate the new load balancer to resources in the target region.

- To export an external load balancer configuration and deploy a template to create an external load balancer in another region, you need to be assigned the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region. Contact support to enable the required quota.

- Make sure your subscription has enough resources to support the addition of the load balancers. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).

#### Prepare and move
The following procedures show how to prepare the external load balancer for the move by using a Resource Manager template and move the external load balancer configuration to the target region by using the Azure portal. You must first export the public IP configuration of external load balancer.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

#### Export the public IP template and deploy the public IP from the portal

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.
2. Locate the resource group that contains the source public IP and select it.
3. Select **Settings** > **Export template**.
4. Select **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the parameters.json file in the online editor.
8. To edit the parameter of the public IP name, change the **value** property under **parameters** from the source public IP name to the name of your target public IP. Enclose the name in quotation marks.

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

    Select **Save** in the editor.

9. Select **TEMPLATE** > **Edit template** to open the template.json file in the online editor.

10. To edit the target region to which the public IP will be moved, change the **location** property under **resources**:

    ```json
            "resources": [
            {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Static",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
               }
               }
             ]
    ```
  
    To get region location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces. For example, the code for Central US is **centralus**.
    
12. You can also change other parameters in the template if you want to or need to, depending on your requirements:

    * **SKU**. You can change the SKU of the public IP in the configuration from standard to basic or from basic to standard by changing the **name** property under **sku** in the template.json file:

        ```json
          "resources": [
         {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
     * **Availability zone**. You can change the zone(s) of the public IP by changing the **zone** property. If the zone property isn't specified, the public IP is created as no-zone. You can specify a single zone to create a zonal public IP or all three zones for a zone-redundant public IP.

         ```json
          "resources": [
         {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
            "zones": [
                "1",
                "2",
                "3"
            ],
         ```

    * **Public IP allocation method** and **Idle timeout**. You can change the public IP allocation method by changing the **publicIPAllocationMethod** property from **Static** to **Dynamic** or from **Dynamic** to **Static**. You can change the idle timeout by changing the **idleTimeoutInMinutes** property to the desired value. The default is **4**. 

        ```json
          "resources": [
         {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
            "zones": [
                "1",
                "2",
                "3"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Static",
                "idleTimeoutInMinutes": 4,
                "ipTags": []

        ```

        For information on the allocation methods and idle timeout values, see [Create, change, or delete a public IP address](../virtual-network/ip-services/virtual-network-public-ip-address.md).

 
13. Select **Save** in the online editor.

14. Select **BASICS** > **Subscription** to choose the subscription where the target public IP will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target public IP will be deployed. You can select **Create new** to create a new resource group for the target public IP. Make sure the name isn't the same as the source resource group of the existing source public IP.

16. Verify that **BASICS** > **Location** is set to the target location where you want the public IP to be deployed.

17. Under **SETTINGS**, verify that the name matches the name that you entered earlier in the parameters editor.

18. Select the **TERMS AND CONDITIONS** check box.

19. Select **Purchase** to deploy the target public IP.

20. If you have another public IP that's being used for outbound NAT for the load balancer being moved, repeat the previous steps to export and deploy the second outbound public IP to the target region.

#### Export the external load balancer template and deploy the load balancer from the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.
2. Locate the resource group that contains the source external load balancer and select it.
3. Select **Settings** > **Export template**.
4. Select **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the parameters.json file in the online editor.

5. To edit the parameter of the external load balancer name, change the **value** property of the source external load balancer name to the name of your target external load balancer. Enclose the name in quotation marks.

    ```json
       "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
       "contentVersion": "1.0.0.0",
       "parameters": {
          "loadBalancers_myLoadbalancer_ext_name": {
          "value": "<target-external-lb-name>"
    },
          "publicIPAddresses_myPubIP_in_externalid": {
          "value": "<target-publicIP-resource-ID>"
    },

    ```

6. To edit value of the target public IP that you moved in the preceding steps, you must first obtain the resource ID, and then paste it into the parameters.json file. To obtain the ID:

    1. In another browser tab or window, sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.
    2. Locate the target resource group that contains the public IP that you moved in the preceding steps. Select it.
    3. Select **Settings** > **Properties**.
    4. On the right-side, highlight the **Resource ID** and copy it to the clipboard. Alternatively, you can select **copy to clipboard** to the right of the **Resource ID** path.
    5. Paste the resource ID into the **value** property in the **Edit Parameters** editor that's open in the other browser window or tab:

        ```json
           ```json
           "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
           "contentVersion": "1.0.0.0",
           "parameters": {
              "loadBalancers_myLoadbalancer_ext_name": {
              "value": "<target-external-lb-name>"
        },
              "publicIPAddresses_myPubIP_in_externalid": {
              "value": "<target-publicIP-resource-ID>"
        },

        ```
    6. Select **Save** in the online editor.


7. If you've configured outbound NAT and outbound rules for the load balancer, you see a third entry in this file for the external ID of the outbound public IP. Repeat the preceding steps in the **target region** to obtain the ID for the outbound public IP. Paste that ID into the parameters.json file:

    ```json
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "loadBalancers_myLoadbalancer_ext_name": {
                "value": "<target-external-lb-name>",

            },
                "publicIPAddresses_myPubIP_in_externalid": {
                "value": "<target-publicIP-resource-ID>",

            },
                "publicIPAddresses_myPubIP_out_externalid": {
                "defaultValue": "<target-publicIP-outbound-resource-ID>",

            }
        },
    ```

8. Select **TEMPLATE** > **Edit template** to open the template.json file in the online editor.
9. To edit the target region to which the external load balancer configuration will be moved, change the **location** property under **resources** in the template.json file:

    ```json
        "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "<target-external-lb-region>",
                "sku": {
                    "name": "Standard",
                    "tier": "Regional"
                },
    ```

10. To get region location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces. For example, the code for Central US is **centralus**.

11. You can also change other parameters in the template if you want to or need to, depending on your requirements:

    * **SKU**. You can change the SKU of the external load balancer in the configuration from Standard to Basic or from Basic to Standard by changing the **name** property under **sku** in the template.json file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "<target-external-lb-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For information on the differences between basic and standard SKU load balancers, see [Azure Standard Load Balancer overview](./load-balancer-overview.md).

    * **Load balancing rules**. You can add or remove load balancing rules in the configuration by adding or removing entries in the **loadBalancingRules** section of the template.json file:

        ```json
        "loadBalancingRules": [
                    {
                        "name": "myInboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 80,
                            "backendPort": 80,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false,
                            "loadDistribution": "Default",
                            "disableOutboundSnat": true,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolInbound')]"
                            },
                            "probe": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/probes/myHTTPProbe')]"
                            }
                        }
                    }
                ]
        ```
       For information on load balancing rules, see [What is Azure Load Balancer?](load-balancer-overview.md).

    * **Probes**. You can add or remove a probe for the load balancer in the configuration by adding or removing entries in the **probes** section of the template.json file:

        ```json
        "probes": [
                    {
                        "name": "myHTTPProbe",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "protocol": "Http",
                            "port": 80,
                            "requestPath": "/",
                            "intervalInSeconds": 15,
                            "numberOfProbes": 2
                        }
                    }
                ],
        ```
       For more information, see [Load Balancer health probes](load-balancer-custom-probe-overview.md).

    * **Inbound NAT rules**. You can add or remove inbound NAT rules for the load balancer by adding or removing entries in the **inboundNatRules** section of the template.json file:

        ```json
        "inboundNatRules": [
                    {
                        "name": "myInboundNATRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 4422,
                            "backendPort": 3389,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false
                        }
                    }
                ]
        ```
        To complete the addition or removal of an inbound NAT rule, the rule must be present or removed as a **type** property at the end of the template.json file:

        ```json
        {
            "type": "Microsoft.Network/loadBalancers/inboundNatRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('loadBalancers_myLoadBalancer_name'), '/myInboundNATRule')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "frontendIPConfiguration": {
                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                },
                "frontendPort": 4422,
                "backendPort": 3389,
                "enableFloatingIP": false,
                "idleTimeoutInMinutes": 4,
                "protocol": "Tcp",
                "enableTcpReset": false
            }
        }
        ```
        For information on inbound NAT rules, see [What is Azure Load Balancer?](load-balancer-overview.md).

    * **Outbound rules**. You can add or remove outbound rules in the configuration by editing the **outboundRules** property in the template.json file:

        ```json
        "outboundRules": [
                    {
                        "name": "myOutboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "allocatedOutboundPorts": 10000,
                            "protocol": "All",
                            "enableTcpReset": false,
                            "idleTimeoutInMinutes": 15,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolOutbound')]"
                            },
                            "frontendIPConfigurations": [
                                {
                                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPoutbound')]"
                                }
                            ]
                        }
                    }
                ]
        ```

         For more information, see [Load Balancer outbound rules](./load-balancer-outbound-connections.md#outboundrules).

12. Select **Save** in the online editor.

13. Select **BASICS** > **Subscription** to choose the subscription where the target external load balancer will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target load balancer will be deployed. You can select **Create new** to create a new resource group for the target external load balancer. Or you can choose the existing resource group that you created earlier for the public IP. Make sure the name isn't the same as the source resource group of the existing source external load balancer.

16. Verify that **BASICS** > **Location** is set to the target location where you want the external load balancer to be deployed.

17. Under **SETTINGS**, verify that the name matches the name you entered earlier in the parameters editor. Verify that the resource IDs are populated for any public IPs in the configuration.

18. Select the **TERMS AND CONDITIONS** check box.

19. Select **Purchase** to deploy the target public IP.

### Discard

If you want to discard the target public IP and external load balancer, delete the resource group that contains them. To do so, select the resource group from your dashboard in the portal and then select **Delete** at the top of the overview page.

### Clean up

To commit the changes and complete the move of the public IP and external load balancer, delete the source public IP and external load balancer or resource group. To do so, select that resource group from your dashboard in the portal and then select **Delete** at the top of each page.

### Next steps

In this tutorial, you moved an Azure external load balancer from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)

# [Azure PowerShell](#tab/azure-powershell/external-load-balancer)

### Prerequisites

- Make sure that the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers can't be moved between regions. You have to associate the new load balancer to resources in the target region.

- To export an external load balancer configuration and deploy a template to create an external load balancer in another region, you need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits)


### Prepare and move
The following steps show how to prepare the external load balancer for the move using a Resource Manager template, and move the external load balancer configuration to the target region using Azure PowerShell. As part of this process, the public IP configuration of the external load balancer must be included and must me done first before moving the external load balancer.


[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

#### Export the public IP template and deploy from Azure PowerShell

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```
2. Obtain the resource ID of the public IP you want to move to the target region and place it in a variable using [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress):

    ```azurepowershell-interactive
    $sourcePubIPID = (Get-AzPublicIPaddress -Name <source-public-ip-name> -ResourceGroupName <source-resource-group-name>).Id

    ```
3. Export the source public IP to a .json file into the directory where you execute the command [Export-AzResourceGroup](/powershell/module/az.resources/export-azresourcegroup):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceVNETID -IncludeParameterDefaultValue
   ```

4. The file downloaded will be named after the resource group the resource was exported from. Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad.exe <source-resource-group-name>.json
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
                "name": "Standard",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Static",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
               }
               }
             ]             
    ```
  
7. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](/powershell/module/az.resources/get-azlocation) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
8. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the public IP in the configuration from Standard to Basic or Basic to Standard by altering the **sku** > **name** property in the **\<resource-group-name>.json** file:

         ```json
            "resources": [
                   {
                    "type": "Microsoft.Network/publicIPAddresses",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('publicIPAddresses_myPubIP_name')]",
                    "location": "<target-region>",
                    "sku": {
                        "name": "Standard",
                        "tier": "Regional"
                    },
         ```

         For more information on the differences between basic and standard sku public ips, see [Create, change, or delete a public IP address](../virtual-network/ip-services/virtual-network-public-ip-address.md).

    * **Availability zone**. You can change the zone(s) of the public IP by changing the **zone** property. If the zone property isn't specified, the public IP is created as no-zone. You can specify a single zone to create a zonal public IP or all three zones for a zone-redundant public IP.
         ```json
          "resources": [
         {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
            "zones": [
                "1",
                "2",
                "3"
            ],
         ```
         
    * **Public IP allocation method** and **Idle timeout** - You can change both of these options in the template by altering the **publicIPAllocationMethod** property from **Static** to **Dynamic** or **Dynamic** to **Static**. The idle timeout can be changed by altering the **idleTimeoutInMinutes** property to your desired amount. The default is **4**:

         ```json
         "resources": [
                {
                "type": "Microsoft.Network/publicIPAddresses",
                "apiVersion": "2019-06-01",
                "name": "[parameters('publicIPAddresses_myPubIP_name')]",
                "location": "<target-region>",
                  "sku": {
                  "name": "Standard",
                  "tier": "Regional"
                 },
                "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Static",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
                   }
                }            
         ```

        For more information on the allocation methods and the idle timeout values, see [Create, change, or delete a public IP address](../virtual-network/ip-services/virtual-network-public-ip-address.md).


9. Save the **\<resource-group-name>.json** file.

10. Create a resource group in the target region for the target public IP to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
11. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    
    ```

12. To verify the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>

    ```

    ```azurepowershell-interactive

    Get-AzPublicIPAddress -Name <target-publicip-name> -ResourceGroupName <target-resource-group-name>

    ```

#### Export the external load balancer template and deploy from Azure PowerShell

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the resource ID of the external load balancer you want to move to the target region and place it in a variable using [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer):

    ```azurepowershell-interactive
    $sourceExtLBID = (Get-AzLoadBalancer -Name <source-external-lb-name> -ResourceGroupName <source-resource-group-name>).Id

    ```
3. Export the source external load balancer configuration to a .json file into the directory where you execute the command [Export-AzResourceGroup](/powershell/module/az.resources/export-azresourcegroup):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceExtLBID -IncludeParameterDefaultValue
   ```
4. The file downloaded will be named after the resource group the resource was exported from. Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad.exe <source-resource-group-name>.json
   ```

5. To edit the parameter of the external load balancer name, change the property **defaultValue** of the source external load balancer name to the name of your target external load balancer, ensure the name is in quotes:

    ```json
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        "loadBalancers_myLoadbalancer_ext_name": {
        "defaultValue": "<target-external-lb-name>",
        "type": "String"
            },
        "publicIPAddresses_myPubIP_in_externalid": {
        "defaultValue": "<target-publicIP-resource-ID>",
        "type": "String"
            },

    ```

6. To edit value of the target public IP that was moved above, you must first obtain the resource ID and then copy and paste it into the **\<resource-group-name>.json** file. To obtain the ID, use [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress):

    ```azurepowershell-interactive
    $targetPubIPID = (Get-AzPublicIPaddress -Name <target-public-ip-name> -ResourceGroupName <target-resource-group-name>).Id
    ```
    Type the variable and hit enter to display the resource ID. Highlight the ID path and copy it to the clipboard:

    ```powershell
    PS C:\> $targetPubIPID
    /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroupLB-Move/providers/Microsoft.Network/publicIPAddresses/myPubIP-in-move
    ```

7. In the **\<resource-group-name>.json** file, paste the **Resource ID** from the variable in place of the **defaultValue** in the second parameter for the public IP external ID, ensure you enclose the path in quotes:

    ```json
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
            "loadBalancers_myLoadbalancer_ext_name": {
            "defaultValue": "<target-external-lb-name>",
            "type": "String"
            },
            "publicIPAddresses_myPubIP_in_externalid": {
            "defaultValue": "<target-publicIP-resource-ID>",
            "type": "String"
            },

    ```

8. If you configured outbound NAT and outbound rules for the load balancer, a third entry is present in this file for the external ID for the outbound public IP. Repeat the steps above in the **target region** to obtain the ID for the outbound public iP and paste that entry into the **\<resource-group-name>.json** file:

    ```json
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "loadBalancers_myLoadbalancer_ext_name": {
                "defaultValue": "<target-external-lb-name>",
                "type": "String"
            },
                "publicIPAddresses_myPubIP_in_externalid": {
                "defaultValue": "<target-publicIP-resource-ID>",
                "type": "String"
            },
                "publicIPAddresses_myPubIP_out_externalid": {
                "defaultValue": "<target-publicIP-outbound-resource-ID>",
                "type": "String"
            }
        },
    ```

10. To edit the target region where the external load balancer configuration will be moved, change the **location** property under **resources** in the **\<resource-group-name>.json** file:

    ```json
        "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "<target-external-lb-region>",
                "sku": {
                    "name": "Standard",
                    "tier": "Regional"
                },
    ```

11. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](/powershell/module/az.resources/get-azlocation) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:
    
    * **Sku** - You can change the sku of the external load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **\<resource-group-name>.json** file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "<target-external-lb-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](./load-balancer-overview.md)

    * **Load balancing rules** - You can add or remove load balancing rules in the configuration by adding or removing entries to the **loadBalancingRules** section of the **\<resource-group-name>.json** file:

        ```json
        "loadBalancingRules": [
                    {
                        "name": "myInboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 80,
                            "backendPort": 80,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false,
                            "loadDistribution": "Default",
                            "disableOutboundSnat": true,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolInbound')]"
                            },
                            "probe": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/probes/myHTTPProbe')]"
                            }
                        }
                    }
                ]
        ```
       For more information on load balancing rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

    * **Probes** - You can add or remove a probe for the load balancer in the configuration by adding or removing entries to the **probes** section of the **\<resource-group-name>.json** file:

        ```json
        "probes": [
                    {
                        "name": "myHTTPProbe",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "protocol": "Http",
                            "port": 80,
                            "requestPath": "/",
                            "intervalInSeconds": 15,
                            "numberOfProbes": 2
                        }
                    }
                ],
        ```
       For more information on Azure Load Balancer health probes, see [Load Balancer health probes](./load-balancer-custom-probe-overview.md)

    * **Inbound NAT rules** - You can add or remove inbound NAT rules for the load balancer by adding or removing entries to the **inboundNatRules** section of the **\<resource-group-name>.json** file:

        ```json
        "inboundNatRules": [
                    {
                        "name": "myInboundNATRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 4422,
                            "backendPort": 3389,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false
                        }
                    }
                ]
        ```
        To complete the addition or removal of an inbound NAT rule, the rule must be present or removed as a **type** property at the end of the **\<resource-group-name>.json** file:

        ```json
        {
            "type": "Microsoft.Network/loadBalancers/inboundNatRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('loadBalancers_myLoadBalancer_name'), '/myInboundNATRule')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "frontendIPConfiguration": {
                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                },
                "frontendPort": 4422,
                "backendPort": 3389,
                "enableFloatingIP": false,
                "idleTimeoutInMinutes": 4,
                "protocol": "Tcp",
                "enableTcpReset": false
            }
        }
        ```
        For more information on inbound NAT rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

    * **Outbound rules** - You can add or remove outbound rules in the configuration by editing the **outboundRules** property in the **\<resource-group-name>.json** file:

        ```json
        "outboundRules": [
                    {
                        "name": "myOutboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "allocatedOutboundPorts": 10000,
                            "protocol": "All",
                            "enableTcpReset": false,
                            "idleTimeoutInMinutes": 15,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolOutbound')]"
                            },
                            "frontendIPConfigurations": [
                                {
                                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPoutbound')]"
                                }
                            ]
                        }
                    }
                ]
        ```

         For more information on outbound rules, see [Load Balancer outbound rules](./load-balancer-outbound-connections.md#outboundrules)

13. Save the **\<resource-group-name>.json** file.
    
10. Create or a resource group in the target region for the target external load balancer to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The existing resource group from above can also be reused as part of this process:
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
11. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    
    ```

12. To verify the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>

    ```

    ```azurepowershell-interactive

    Get-AzLoadBalancer -Name <target-publicip-name> -ResourceGroupName <target-resource-group-name>

    ```

### Discard 

After the deployment, if you wish to start over or discard the public IP and load balancer in the target, delete the resource group that was created in the target and the moved public IP and load balancer will be deleted. To remove the resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

### Clean up

To commit the changes and complete the move of the NSG, delete the source NSG or resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) or [Remove-AzPublicIpAddress](/powershell/module/az.network/remove-azpublicipaddress) and [Remove-AzLoadBalancer](/powershell/module/az.network/remove-azloadbalancer)

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

``` azurepowershell-interactive

Remove-AzLoadBalancer -name <load-balancer> -ResourceGroupName <resource-group-name>

Remove-AzPublicIpAddress -Name <public-ip> -ResourceGroupName <resource-group-name>


```

### Next steps

In this tutorial, you moved an Azure network security group from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)

# [Azure portal](#tab/azure-portal/internal-load-balancer)

### Prerequisites

- Make sure that the Azure internal load balancer is in the Azure region from which you want to move.

- Azure internal load balancers can't be moved between regions. You have to associate the new load balancer to resources in the target region.

- To export an internal load balancer configuration and deploy a template to create an internal load balancer in another region, you need the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups, virtual machines, and virtual networks.

- Verify that your Azure subscription allows you to create internal load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits)


### Prepare and move
The following steps show how to prepare the internal load balancer for the move using a Resource Manager template, and move the internal load balancer configuration to the target region using the Azure portal. As part of this process, the virtual network configuration of the internal load balancer must be included and must be done first before moving the internal load balancer.


[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

#### Export the virtual network template and deploy from the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source virtual network and select it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.
6. To edit the parameter of the virtual network name, change the **value** property under **parameters**:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "virtualNetworks_myVNET1_name": {
                "value": "<target-virtual-network-name>"
            }
        }
    }
    ```
7. Change the source virtual network name value in the editor to a name of your choice for the target virtual network. Ensure you enclose the name in quotes.

8. Select **Save** in the editor.

9. Select **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region where the virtual network will be moved, change the **location** property under resources:

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

11. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, **Central US** = **centralus**.

12. You can also change other parameters in the **template.json** file if you choose, and are optional depending on your requirements:

    * **Address Space** - The address space of the virtual network can be altered before saving by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property in the **template.json** file:

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

    * **Subnet** - The subnet name and the subnet address space can be changed or added to by modifying the **subnets** section of the **template.json** file. The name of the subnet can be changed by altering the **name** property. The subnet address space can be changed by altering the **addressPrefix** property in the **template.json** file:

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

         In the **template.json** file, to change the address prefix, it must be edited in two places, the section listed above and the **type** section listed below. Change the **addressPrefix** property to match the one above:

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

13. Select **Save** in the online editor.

14. Select **BASICS** > **Subscription** to choose the subscription where the target virtual network will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target virtual network will be deployed. You can select **Create new** to create a new resource group for the target virtual network. Ensure the name isn't the same as the source resource group of the existing virtual network.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the virtual network to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

18. Check the box under **TERMS AND CONDITIONS**.

19. Select the **Purchase** button to deploy the target virtual network.

### Export the internal load balancer template and deploy from Azure PowerShell

1. Select to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source internal load balancer and select it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.

6. To edit the parameter of the internal load balancer name, change the property **defaultValue** of the source internal load balancer name to the name of your target internal load balancer, ensure the name is in quotes:

    ```json
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "loadBalancers_myLoadBalancer_name": {
            "defaultValue": "<target-internal-lb-name>",
            "type": "String"
             },
            "virtualNetworks_myVNET2_internalid": {
             "defaultValue": "<target-vnet-resource-ID>",
             "type": "String"
             }
    ```

6. To edit value of the target virtual network that was moved above, you must first obtain the resource ID and then copy and paste it into the **parameters.json** file. To obtain the ID:

    1. Select to the [Azure portal](https://portal.azure.com) > **Resource Groups** in another browser tab or window.
    2. Locate the target resource group that contains the moved virtual network from the steps above, and select it.
    3. Select > **Settings** > **Properties**.
    4. On the right side of the portal, highlight the **Resource ID** and copy it to the clipboard. Alternatively, you can select the **copy to clipboard** button to the right of the **Resource ID** path.
    5. Paste the resource ID into the **defaultValue** property into the **Edit Parameters** editor open in the other browser window or tab:

        ```json
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "loadBalancers_myLoadBalancer_name": {
            "defaultValue": "<target-internal-lb-name>",
            "type": "String"
             },
            "virtualNetworks_myVNET2_internalid": {
             "defaultValue": "<target-vnet-resource-ID>",
             "type": "String"
             }
        ```
    6. Select **Save** in the online editor.

7. Select **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.
8. To edit the target region where the internal load balancer configuration will be moved, change the **location** property under **resources** in the **template.json** file:

    ```json
        "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "<target-internal-lb-region>",
                "sku": {
                    "name": "Standard",
                    "tier": "Regional"
                },
    ```

9. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, **Central US** = **centralus**.

10. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the internal load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "<target-internal-lb-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](./load-balancer-overview.md)

    * **Availability zone** - You can change the zones of the load balancer's frontend by changing the **zone** property. If the zone property isn't specified, the frontend is created as no-zone. You can specify a single zone to create a zonal frontend or all three zones for a zone-redundant frontend.

        ```json
        "frontendIPConfigurations": [
        { 
            "name": "myfrontendIPinbound",
            "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
            "type": "Microsoft.Network/loadBalancers/frontendIPConfigurations",
            "properties": {
                "provisioningState": "Succeeded",
                "privateIPAddress": "10.0.0.6",
                "privateIPAllocationMethod": "Dynamic",
                "subnet": {
                    "id": "[concat(parameters('virtualNetworks_myVNET2_internalid'), '/subnet-1')]"
                },
                "loadBalancingRules": [
                    {
                        "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/loadBalancingRules/myInboundRule')]"
                    }
                ],
                "privateIPAddressVersion": "IPv4"
            },
            "zones": [
                "1",
                "2",
                "3"
            ]
        },
        ```
        For more about availability zones, see [Regions and availability zones in Azure](../reliability/availability-zones-overview.md).

    * **Load balancing rules** - You can add or remove load balancing rules in the configuration by adding or removing entries to the **loadBalancingRules** section of the **template.json** file:

        ```json
        "loadBalancingRules": [
                    {
                        "name": "myInboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 80,
                            "backendPort": 80,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false,
                            "loadDistribution": "Default",
                            "disableOutboundSnat": true,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolInbound')]"
                            },
                            "probe": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/probes/myHTTPProbe')]"
                            }
                        }
                    }
                ]
        ```
       For more information on load balancing rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

    * **Probes** - You can add or remove a probe for the load balancer in the configuration by adding or removing entries to the **probes** section of the **template.json** file:

        ```json
        "probes": [
                    {
                        "name": "myHTTPProbe",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "protocol": "Http",
                            "port": 80,
                            "requestPath": "/",
                            "intervalInSeconds": 15,
                            "numberOfProbes": 2
                        }
                    }
                ],
        ```
       For more information on Azure Load Balancer health probes, see [Load Balancer health probes](./load-balancer-custom-probe-overview.md)

    * **Inbound NAT rules** - You can add or remove inbound NAT rules for the load balancer by adding or removing entries to the **inboundNatRules** section of the **template.json** file:

        ```json
        "inboundNatRules": [
                    {
                        "name": "myInboundNATRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 4422,
                            "backendPort": 3389,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false
                        }
                    }
                ]
        ```
        To complete the addition or removal of an inbound NAT rule, the rule must be present or removed as a **type** property at the end of the **template.json** file:

        ```json
        {
            "type": "Microsoft.Network/loadBalancers/inboundNatRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('loadBalancers_myLoadBalancer_name'), '/myInboundNATRule')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "frontendIPConfiguration": {
                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                },
                "frontendPort": 4422,
                "backendPort": 3389,
                "enableFloatingIP": false,
                "idleTimeoutInMinutes": 4,
                "protocol": "Tcp",
                "enableTcpReset": false
            }
        }
        ```
        For more information on inbound NAT rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

12. Select **Save** in the online editor.

13. Select **BASICS** > **Subscription** to choose the subscription where the target internal load balancer will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target load balancer will be deployed. You can select **Create new** to create a new resource group for the target internal load balancer or choose the existing resource group that was created previously for the virtual network. Ensure the name isn't the same as the source resource group of the existing source internal load balancer.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the internal load balancer to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor previously. Verify the resource IDs are populated for any virtual networks in the configuration.

18. Check the box under **TERMS AND CONDITIONS**.

19. Select the **Purchase** button to deploy the target virtual network.

### Discard

If you wish to discard the target virtual network and internal load balancer, delete the resource group that contains the target virtual network and internal load balancer. To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

### Clean up

To commit the changes and complete the move of the virtual network and internal load balancer, delete the source virtual network and internal load balancer or resource group. To do so, select the virtual network and internal load balancer or resource group from your dashboard in the portal and select **Delete** at the top of each page.

### Next steps

In this tutorial, you moved an Azure internal load balancer from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)


# [Azure PowerShell](#tab/azure-powershell/internal-load-balancer)

### Prerequisites

- Make sure that the Azure internal load balancer is in the Azure region from which you want to move.

- Azure internal load balancers can't be moved between regions. You have to associate the new load balancer to resources in the target region.

- To export an internal load balancer configuration and deploy a template to create an internal load balancer in another region, you need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups, virtual machines, and virtual networks.

- Verify that your Azure subscription allows you to create internal load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits)


### Prepare and move
The following steps show how to prepare the internal load balancer for the move using a Resource Manager template, and move the internal load balancer configuration to the target region using Azure PowerShell. As part of this process, the virtual network configuration of the internal load balancer must be included and must be done first before moving the internal load balancer.


[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

#### Export the virtual network template and deploy from Azure PowerShell

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```
2. Obtain the resource ID of the virtual network you want to move to the target region and place it in a variable using [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):

    ```azurepowershell-interactive
    $sourceVNETID = (Get-AzVirtualNetwork -Name <source-virtual-network-name> -ResourceGroupName <source-resource-group-name>).Id

    ```
3. Export the source virtual network to a .json file into the directory where you execute the command [Export-AzResourceGroup](/powershell/module/az.resources/export-azresourcegroup):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceVNETID -IncludeParameterDefaultValue
   ```

4. The file downloaded will be named after the resource group the resource was exported from. Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad.exe <source-resource-group-name>.json
   ```

5. To edit the parameter of the virtual network name, change the property **defaultValue** of the source virtual network name to the name of your target virtual network, ensure the name is in quotes:
    
    ```json
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentmyResourceGroupVNET.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "virtualNetworks_myVNET1_name": {
        "defaultValue": "<target-virtual-network-name>",
        "type": "String"
        }
    ```

6. To edit the target region for the virtual network, change the **location** property under resources:

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
  
7. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](/powershell/module/az.resources/get-azlocation) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
8. You can also change other parameters in the **\<resource-group-name>.json** file if you choose, and are optional depending on your requirements:

    * **Address Space** - The address space of the virtual network can be altered before saving by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property in the **\<resource-group-name>.json** file:

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

    * **Subnet** - The subnet name and the subnet address space can be changed or added to by modifying the **subnets** section of the **\<resource-group-name>.json** file. The name of the subnet can be changed by altering the **name** property. The subnet address space can be changed by altering the **addressPrefix** property in the **\<resource-group-name>.json** file:

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

         In the **\<resource-group-name>.json** file, to change the address prefix, it must be edited in two places, the section listed above and the **type** section listed below. Change the **addressPrefix** property to match the one above:

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

9. Save the **\<resource-group-name>.json** file.

10. Create a resource group in the target region for the target virtual network to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
    
11. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    
    ```
12. To verify the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>

    ```

    ```azurepowershell-interactive

    Get-AzVirtualNetwork -Name <target-virtual-network-name> -ResourceGroupName <target-resource-group-name>

    ```
#### Export the internal load balancer template and deploy from Azure PowerShell

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the resource ID of the internal load balancer you want to move to the target region and place it in a variable using [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer):

    ```azurepowershell-interactive
    $sourceIntLBID = (Get-AzLoadBalancer -Name <source-internal-lb-name> -ResourceGroupName <source-resource-group-name>).Id

    ```
3. Export the source internal load balancer configuration to a .json file into the directory where you execute the command [Export-AzResourceGroup](/powershell/module/az.resources/export-azresourcegroup):
   
   ```azurepowershell-interactive
   Export-AzResourceGroup -ResourceGroupName <source-resource-group-name> -Resource $sourceIntLBID -IncludeParameterDefaultValue
   ```
4. The file downloaded will be named after the resource group the resource was exported from. Locate the file that was exported from the command named **\<resource-group-name>.json** and open it in an editor of your choice:
   
   ```azurepowershell
   notepad.exe <source-resource-group-name>.json
   ```

5. To edit the parameter of the internal load balancer name, change the property **defaultValue** of the source internal load balancer name to the name of your target internal load balancer, ensure the name is in quotes:

    ```json
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "loadBalancers_myLoadBalancer_name": {
            "defaultValue": "<target-external-lb-name>",
            "type": "String"
             },
            "virtualNetworks_myVNET2_externalid": {
             "defaultValue": "<target-vnet-resource-ID>",
             "type": "String"
             }
    ```
 
6. To edit value of the target virtual network that was moved above, you must first obtain the resource ID and then copy and paste it into the **\<resource-group-name>.json** file. To obtain the ID, use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork):
   
   ```azurepowershell-interactive
    $targetVNETID = (Get-AzVirtualNetwork -Name <target-vnet-name> -ResourceGroupName <target-resource-group-name>).Id
    ```
    Type the variable and hit enter to display the resource ID. Highlight the ID path and copy it to the clipboard:

    ```powershell
    PS C:\> $targetVNETID
    /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroupVNET-Move/providers/Microsoft.Network/virtualNetworks/myVNET2-Move
    ```

7. In the **\<resource-group-name>.json** file, paste the **Resource ID** from the variable in place of the **defaultValue** in the second parameter for the target virtual network ID, ensure you enclose the path in quotes:
   
    ```json
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "loadBalancers_myLoadBalancer_name": {
            "defaultValue": "<target-external-lb-name>",
            "type": "String"
             },
            "virtualNetworks_myVNET2_externalid": {
             "defaultValue": "<target-vnet-resource-ID>",
             "type": "String"
             }
    ```

8. To edit the target region where the internal load balancer configuration will be moved, change the **location** property under **resources** in the **\<resource-group-name>.json** file:

    ```json
        "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "<target-internal-lb-region>",
                "sku": {
                    "name": "Standard",
                    "tier": "Regional"
                },
    ```

11. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](/powershell/module/az.resources/get-azlocation) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:
    
    * **Sku** - You can change the sku of the internal load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **\<resource-group-name>.json** file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "<target-internal-lb-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](./load-balancer-overview.md)
      
    * **Availability zone**. You can change the zone(s) of the load balancer's frontend by changing the zone property. If the zone property isn't specified, the frontend is created as no-zone. You can specify a single zone to create a zonal frontend or all three zones for a zone-redundant frontend.
         ```json
          "frontendIPConfigurations": [
                   {
                         "name": "myfrontendIPinbound",
                         "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                         "type": "Microsoft.Network/loadBalancers/frontendIPConfigurations",
                         "properties": {
                             "provisioningState": "Succeeded",
                             "privateIPAddress": "10.0.0.1",
                             "privateIPAllocationMethod": "Static",
                             "subnet": {
                                 "id": "[concat(resourceId('Microsoft.Network/virtualNetworks', parameters('virtualNetworks_myVNET1_name')), '/subnet-1')]"
                             },
                             "privateIPAddressVersion": "IPv4"
                         },
                         "zones": [
                             "1",
                             "2",
                             "3"
                         ]
                     }
                 ],
         ```

    * **Load balancing rules** - You can add or remove load balancing rules in the configuration by adding or removing entries to the **loadBalancingRules** section of the **\<resource-group-name>.json** file:

        ```json
        "loadBalancingRules": [
                    {
                        "name": "myInboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 80,
                            "backendPort": 80,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false,
                            "loadDistribution": "Default",
                            "disableOutboundSnat": true,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolInbound')]"
                            },
                            "probe": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/probes/myHTTPProbe')]"
                            }
                        }
                    }
                ]
        ```
       For more information on load balancing rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

    * **Probes** - You can add or remove a probe for the load balancer in the configuration by adding or removing entries to the **probes** section of the **\<resource-group-name>.json** file:

        ```json
        "probes": [
                    {
                        "name": "myHTTPProbe",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "protocol": "Http",
                            "port": 80,
                            "requestPath": "/",
                            "intervalInSeconds": 15,
                            "numberOfProbes": 2
                        }
                    }
                ],
        ```
       For more information on Azure Load Balancer health probes, see [Load Balancer health probes](./load-balancer-custom-probe-overview.md)

    * **Inbound NAT rules** - You can add or remove inbound NAT rules for the load balancer by adding or removing entries to the **inboundNatRules** section of the **\<resource-group-name>.json** file:

        ```json
        "inboundNatRules": [
                    {
                        "name": "myInboundNATRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 4422,
                            "backendPort": 3389,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false
                        }
                    }
                ]
        ```
        To complete the addition or removal of an inbound NAT rule, the rule must be present or removed as a **type** property at the end of the **\<resource-group-name>.json** file:

        ```json
        {
            "type": "Microsoft.Network/loadBalancers/inboundNatRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('loadBalancers_myLoadBalancer_name'), '/myInboundNATRule')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "frontendIPConfiguration": {
                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                },
                "frontendPort": 4422,
                "backendPort": 3389,
                "enableFloatingIP": false,
                "idleTimeoutInMinutes": 4,
                "protocol": "Tcp",
                "enableTcpReset": false
            }
        }
        ```
        For more information on inbound NAT rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)
    
13. Save the **\<resource-group-name>.json** file.
    
10. Create or a resource group in the target region for the target internal load balancer to be deployed using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The existing resource group from above can also be reused as part of this process:
    
    ```azurepowershell-interactive
    New-AzResourceGroup -Name <target-resource-group-name> -location <target-region>
    ```
11. Deploy the edited **\<resource-group-name>.json** file to the resource group created in the previous step using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

    ```azurepowershell-interactive

    New-AzResourceGroupDeployment -ResourceGroupName <target-resource-group-name> -TemplateFile <source-resource-group-name>.json
    
    ```

12. To verify the resources were created in the target region, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup) and [Get-AzLoadBalancer](/powershell/module/az.network/get-azloadbalancer):
    
    ```azurepowershell-interactive

    Get-AzResourceGroup -Name <target-resource-group-name>

    ```

    ```azurepowershell-interactive

    Get-AzLoadBalancer -Name <target-publicip-name> -ResourceGroupName <target-resource-group-name>

    ```
### Discard 

After the deployment, if you wish to start over or discard the virtual network and load balancer in the target, delete the resource group that was created in the target and the moved virtual network and load balancer will be deleted. To remove the resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

### Clean up

To commit the changes and complete the move of the NSG, delete the source NSG or resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) or [Remove-AzVirtualNetwork](/powershell/module/az.network/remove-azvirtualnetwork) and [Remove-AzLoadBalancer](/powershell/module/az.network/remove-azloadbalancer)

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

``` azurepowershell-interactive

Remove-AzLoadBalancer -name <load-balancer> -ResourceGroupName <resource-group-name>

Remove-AzVirtualNetwork -Name <virtual-network-name> -ResourceGroupName <resource-group-name>


```

### Next steps

In this tutorial, you moved an Azure internal load balancer from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
---
