---
title: Move Azure internal Load Balancer to another Azure region  
description: Use Azure Resource Manager template to move Azure internal Load Balancer from one Azure region to another.
author: asudbring
ms.service: load-balancer
ms.topic: article
ms.date: 09/05/2019
ms.author: allensu
---

# Move Azure internal Load Balancer to another region

There are various scenarios in which you'd want to move your existing internal load balancer from one region to another. For example, you may want to create an internal load balancer with the same configuration for testing. You may also want to move a internal load balancer to another region as part of disaster recovery planning.

Azure internal load balancers can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration and virtual network of an internal load balancer.  You can then stage the resource in another region by exporting the load balancer and virtual network to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.  For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal)


## Prerequisites

- Make sure that the Azure internal load balancer is in the Azure region from which you want to move.

- Azure internal load balancers cannot be moved between regions.  You will have to associate the new load balancer to resources in the target region.

- To export a internal load balancer configuration and deploy a template to create a internal load balancer in another region, you'll need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This includes but isn't limited to load balancers, network security groups, virtual machines, and virtual networks.

- Verify that your Azure subscription allows you to create internal load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits)


## Prepare and move
The following steps show how to prepare the internal load balancer for the move using an Resource Manager template, and move the internal load balancer configuration to the target region using the portal and a script.  As part of this process, the virtual network configuration of the internal load balancer must be included and must me done first before moving the internal load balancer.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the virtual network template and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the subscription ID where you wish to deploy the target internal load balancer virtual network with [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):

    ```azurepowershell-interactive
    Get-AzSubscription
    ```
3. Login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
4. Locate the Resource Group that contains the source internal load balancer virtual network and click on it.
5. Select > **Settings** > **Export template**.
6. Choose **Download** in the **Export template** blade.
7. Locate the .zip file downloaded from the portal containing the template and unzip to a folder of your choice.  In this zip file is the .json files needed for the template and a shell script and PowerShell script to deploy the template.
8. To edit the parameter of the internal load balancer virtual network name, open the **parameters.json** file and edit the **value** property:

    ```json
         {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "virtualNetworks_myVNET2_name": {
                "value": "null"
            }
          }
         }
    ```
 
9. Change the **null** value in the .json file to a name of your choice for the target internal load balancer virtual network. Save the **parameters.json** file. Ensure you enclose the name in quotes.

10. To edit the target region where the internal load balancer virtual network configuration will be moved, open the **template.json** file:

    ```json
        
            "resources": [
            {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2019-06-01",
            "name": "[parameters('virtualNetworks_myVNET2_name')]",
            "location": "TARGET REGION",
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "e190ae85-61ad-4055-a944-f7878030486f",
                "addressSpace": {
                    "addressPrefixes": [
                        "10.1.0.0/16"
                    ]
                   }
            }
            }

    ```

11. Edit the **location** property in the **template.json** file to the target region. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
   
12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Address Space** - The address space of the VNET can be altered in the template before saving by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property in the **template.json** file:

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

    * **Subnet** - The subnet name as well as the subnet address space can be changed or added to by modifying the **subnets** section of the **template.json** file. The name of the subnet can be changed by altering the **name** property in the **template.json** file.  The subnet address space can be changed by altering the **addressPrefix** property in the **template.json** file:
    
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
           
            In the **template.json** file, to change the address prefix, it must be edited in two places, the section listed above and the **type** section listed below.  Change the **addressPrefix** property to match the one above:

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

13. Save the **template.json** file.

14. Change to the directory where you unzipped the template files and saved the parameters.json file and run the following command to deploy the template and internal load balancer virtual network into the target region:

    ```azurepowershell-interactive

    ./deploy.ps1 -subscription "Azure Subscription" -resourceGroupName myresourcegroup -resourceGroupLocation targetregion
    
    ```
### Export the internal load balancer template and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the subscription ID where you wish to deploy the target internal load balancer with [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):

    ```azurepowershell-interactive
    Get-AzSubscription
    ```
3. Login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
4. Locate the Resource Group that contains the source internal load balancer and click on it.
5. Select > **Settings** > **Export template**.
6. Choose **Download** in the **Export template** blade.
7. Locate the .zip file downloaded from the portal containing the template and unzip to a folder of your choice.  In this zip file is the .json files needed for the template and a shell script and PowerShell script to deploy the template.
8. To edit the parameter of the internal load balancer name, open the **parameters.json** file and edit the first **value** property:

    ```json
          {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "loadBalancers_myLoadBalancer_name": {
                "value": "null"
            },
            "virtualNetworks_myVNET2_externalid": {
                "value": "null"
            }
             }
            }

    ```
 
9. Change the **null** value in the .json file to a name of your choice for the target internal load balancer. Save the **parameters.json** file. Ensure you enclose the name in quotes.
10. To edit value of the virtual network internal ID, you must first obtain the ID and then copy and paste it into the **parameters.json** file.  To obtain the ID, login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
11. Locate the resource group in the **target region** that contains the virtual network that you deployed above and click on it.
12. Select **Settings** > **Properties** of the virtual network.
13. Copy the full path of the **Resource ID** of the virtual network by clicking on the copy button in the properties page next to the path.
14. In the **parameters.json** file, paste the **Resource ID** in place of the **null** value in the second **value** property, ensure you enclose the path in quotes:

    ```json
             {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "loadBalancers_myLoadBalancer_name": {
                    "value": "myLoadBalancer"
                },
                "virtualNetworks_myVNET2_externalid": {
                    "value": "/subscriptions/7668d659-17fc-4ffd-85ba-9de61fe977e8/resourceGroups/myResourceGroupVNET-MOVE/providers/Microsoft.Network/virtualNetworks/myVNET"
                }
              }
             }
   
    ```

16. Save the **parameters.json** file.
17. To edit the target region where the internal load balancer configuration will be moved, open the **template.json** file:

    ```json
          "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "TARGET REGION",
                "sku": {
                    "name": "Basic",
                    "tier": "Regional"
                }
    ```

18. Edit the **location** property in the **template.json** file to the target region. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
19. You can also change other parameters in the template if you choose, and are optional depending on your requirements:
    * **Sku** - You can change the sku of the internal load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

            ```json
             "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "TARGET REGION",
                "sku": {
                    "name": "Basic",
                    "tier": "Regional"
                }
            ```
           For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview)

    * **Load balancing rules** - You can add or remove load balancing rules in the configuration by adding or removing entries to the **loadBalancingRules** section of the **template.json** file:

            ```json
            "loadBalancingRules": [
                        {
                            "name": "MyLoadBalancerRule",
                            "etag": "W/\"7ce9154f-27c9-44b0-9d76-70cb095d91d7\"",
                            "properties": {
                                "provisioningState": "Succeeded",
                                "frontendIPConfiguration": {
                                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/LoadBalancerFrontEnd')]"
                                },
                                "frontendPort": 80,
                                "backendPort": 80,
                                "enableFloatingIP": false,
                                "idleTimeoutInMinutes": 4,
                                "protocol": "Tcp",
                                "enableTcpReset": false,
                                "loadDistribution": "Default",
                                "backendAddressPool": {
                                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBackendPool')]"
                                },
                                "probe": {
                                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/probes/MyHealthProbe')]"
                                }
                            }
                        }
                ]

            ```
           For more information on load balancing rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)

    * **Probes** - You can add or remove a probe for the load balancer in the configuration by adding or removing entries to the **probes** section of the **template.json** file:

            ```json
            "probes": [
                        {
                            "name": "MyHealthProbe",
                            "etag": "W/\"7ce9154f-27c9-44b0-9d76-70cb095d91d7\"",
                            "properties": {
                                "provisioningState": "Succeeded",
                                "protocol": "Tcp",
                                "port": 80,
                                "intervalInSeconds": 15,
                                "numberOfProbes": 2
                            }
                        }
                    ]
            ```
           For more information on Azure Load Balancer health probes, see [Load Balancer health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview)

    * **Inbound NAT rules** - You can add or remove inbound NAT rules for the load balancer by adding or removing entries to the **inboundNatRules** section of the **template.json** file:

            ```json
             "inboundNatRules": [
                    {
                        "name": "MyInboundNATRule",
                        "etag": "W/\"7ce9154f-27c9-44b0-9d76-70cb095d91d7\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/LoadBalancerFrontEnd')]"
                            },
                            "frontendPort": 3389,
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
                "name": "[concat(parameters('loadBalancers_myLoadBalancer_name'), '/MyInboundNATRule')]",
                "dependsOn": [
                    "[resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name'))]"
                ],
                "properties": {
                    "provisioningState": "Succeeded",
                    "frontendIPConfiguration": {
                        "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/LoadBalancerFrontEnd')]"
                    },
                    "frontendPort": 3389,
                    "backendPort": 3389,
                    "enableFloatingIP": false,
                    "idleTimeoutInMinutes": 4,
                    "protocol": "Tcp",
                    "enableTcpReset": false
                }
            }
            ```
           For more information on inbound NAT rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)

    
20. Save the **template.json** file.
21. Change to the directory where you unzipped the template files and saved the parameters.json file and run the following command to deploy the template and internal load balancer virtual network into the target region:

    ```azurepowershell-interactive

    ./deploy.ps1 -subscription "Azure Subscription" -resourceGroupName myresourcegroup -resourceGroupLocation targetregion
    
    ```

## Discard 

After the deployment, if you wish to start over or discard the virtual network and load balancer in the target, delete the resource group that was created in the target and the moved virtual network and load balancer will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

## Clean up

To commit the changes and complete the move of the NSG, delete the source NSG or resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0) or [Remove-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/remove-azvirtualnetwork?view=azps-2.6.0) and [Remove-AzLoadBalancer](https://docs.microsoft.com/powershell/module/az.network/remove-azloadbalancer?view=azps-2.6.0)

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

``` azurepowershell-interactive

Remove-AzLoadBalancer -name <load-balancer> -ResourceGroupName <resource-group-name>

Remove-AzVirtualNetwork -Name <virtual-network-name> -ResourceGroupName <resource-group-name>


```

## Next steps

In this tutorial, you moved an Azure network security group from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
