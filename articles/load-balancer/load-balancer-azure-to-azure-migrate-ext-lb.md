---
title: Move Azure external Load Balancer to another Azure region  
description: Use Azure Resource Manager template to move Azure external Load Balancer from one Azure region to another.
author: asudbring
ms.service: load-balancer
ms.topic: article
ms.date: 09/02/2019
ms.author: allensu
---

# Move Azure external Load Balancer to another region

There are various scenarios in which you'd want to move your existing external load balancer from one region to another. For example, you may want to create an external load balancer with the same configuration for testing. You may also want to move a external load balancer to another region as part of disaster recovery planning.

Azure external load balancers can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration and public IP of an external load balancer.  You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.  For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal)


## Prerequisites

- Make sure that the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers cannot be moved between regions.  You will have to associate the new load balancer to resources in the target region.

- To export a external load balancer configuration and deploy a template to create a external load balancer in another region, you'll need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits)


## Prepare and move
The following steps show how to prepare the external load balancer for the move using an Resource Manager template, and move the external load balancer configuration to the target region using the portal and a script.  As part of this process, the public IP configuration of the external load balancer must be included and must me done first before moving the external load balancer.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the public IP template and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the subscription ID where you wish to deploy the target external load balancer public IP with [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):

    ```azurepowershell-interactive
    Get-AzSubscription
    ```
3. Login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
4. Locate the Resource Group that contains the source external load balancer public IP and click on it.
5. Select > **Settings** > **Export template**.
6. Choose **Download** in the **Export template** blade.
7. Locate the .zip file downloaded from the portal containing the template and unzip to a folder of your choice.  In this zip file is the .json files needed for the template and a shell script and PowerShell script to deploy the template.
8. To edit the parameter of the external load balancer public IP name, open the **parameters.json** file and edit the **value** property:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "publicIPAddresses_myPublicIP_name": {
            "value": "null"
         }
     }
    }

    ```

9. Change the **null** value in the .json file to a name of your choice for the target external load balancer public IP. Save the **parameters.json** file. Ensure you enclose the name in quotes.

10. To edit the target region where the external load balancer public IP configuration will be moved, open the **template.json** file:

    ```json
     "resources": [
        {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPublicIP_name')]",
            "location": "TARGET REGION",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "2a7eaf58-3b7f-4e99-9ef2-05dc6deeaf96",
                "ipAddress": "13.86.180.137",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Static",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
            }
        }
    ]

    ```

11. Edit the **location** property in the **template.json** file to the target region. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
    >[!Note]
    >If you have configured outbound NAT rules and backend pools on the external load balancer, then the public IP associated with the outbound flow must also be moved to the target region.  Repeat the above steps to export the configuration and move the outbound public IP to the target region.

12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the public IP in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

         ```json
             "resources": [
             {
             "type": "Microsoft.Network/publicIPAddresses",
             "apiVersion": "2019-06-01",
             "name": "[parameters('publicIPAddresses_myPubIP_name')]",
             "location": "TARGET REGION",
             "sku": {
                "name": "Basic",
                "tier": "Regional"
                 },
               ] 
         ```

        For more information on the differences between basic and standard sku public ips, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address)

    
    * **Public IP allocation method** and **Idle time out** - You can change both of these options in the template by altering the **publicIPAllocationMethod** property from **Dynamic** to **Static** or **Static** to **Dynamic**. The idle time out can be changed by altering the **idleTimeoutInMinutes** property to your desired amount.  The default is **4**:

        ```json
             "resources": [
          {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPublicIP_name')]",
            "location": "eastus",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "2a7eaf58-3b7f-4e99-9ef2-05dc6deeaf96",
                "ipAddress": "13.86.180.137",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Static",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
            }
          }
        ] 

        ```

      For more information on the allocation methods and the idle timeout values, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address)

13. Save the **template.json** file.

14. Change to the directory where you unzipped the template files and saved the parameters.json file and run the following command to deploy the template and external load balancer public IP into the target region:

    ```azurepowershell-interactive

    ./deploy.ps1 -subscription "Azure Subscription" -resourceGroupName myresourcegroup -resourceGroupLocation targetregion
    
    ```
### Export the external load balancer template and deploy from a script

1. Sign in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-2.5.0) command and follow the on-screen directions:
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Obtain the subscription ID where you wish to deploy the target external load balancer with [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-2.5.0):

    ```azurepowershell-interactive
    Get-AzSubscription
    ```
3. Login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
4. Locate the Resource Group that contains the source external load balancer and click on it.
5. Select > **Settings** > **Export template**.
6. Choose **Download** in the **Export template** blade.
7. Locate the .zip file downloaded from the portal containing the template and unzip to a folder of your choice.  In this zip file is the .json files needed for the template and a shell script and PowerShell script to deploy the template.
8. To edit the parameter of the external load balancer name, open the **parameters.json** file and edit the first **value** property:

    ```json
      {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "loadBalancers_myLoadBalancer_name": {
            "value": "null"
        },
        "publicIPAddresses_myPublicIP_externalid": {
            "value": "null"
           } 
        }
      }  

    ```
 
9. Change the **null** value in the .json file to a name of your choice for the target external load balancer. Save the **parameters.json** file. Ensure you enclose the name in quotes.
10. To edit value of the public IP external ID, you must first obtain the ID and then copy and paste it into the **parameters.json** file.  To obtain the ID, login to the [Azure portal](http://portal.azure.com) > **Resource Groups**.
11. Locate the resource group in the **target region** that contains the public IP that you deployed above and click on it.
12. Select **Settings** > **Properties** of the public IP.
13. Copy the full path of the **Resource ID** of the public IP by clicking on the copy button in the properties page next to the path.
14. In the **parameters.json** file, paste the **Resource ID** in place of the **null** value in the second **value** property, ensure you enclose the path in quotes:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "loadBalancers_myLoadBalancer_name": {
            "value": "myLoadBalancer"
        },
        "publicIPAddresses_myPublicIP_externalid": {
            "value": "/subscriptions/7668d659-17fc-4ffd-85ba-9de61fe977e8/resourceGroups/myResourceGroupLB-MOVE/providers/Microsoft.Network/publicIPAddresses/MyPublicIP"
        }
      }
    }

    ```

15. If you have configured outbound NAT and outbound rules for the load balancer, a third entry will be present in this file for the external ID for the outbound public IP.  Repeat the steps above in the **target region** to obtain the ID for the outbound public iP and paste that entry into the **parameters.json** file:

    ```json
     {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "loadBalancers_myLoadBalancer_name": {
            "value": "myLoadBalancer"
        },
        "publicIPAddresses_myPublicIP_externalid": {
            "value": "/subscriptions/7668d659-17fc-4ffd-85ba-9de61fe977e8/resourceGroups/myResourceGroupLB-MOVE/providers/Microsoft.Network/publicIPAddresses/MyPublicIP"
        },
        "publicIPAddresses_myPublicIPOutbound_externalid": {
            "value": "/subscriptions/7668d659-17fc-4ffd-85ba-9de61fe977e8/resourceGroups/myResourceGroupLB-MOVE/providers/Microsoft.Network/publicIPAddresses/myPublicIPOutbound"
        }
      }
     }
    ```

16. Save the **parameters.json** file.
17. To edit the target region where the external load balancer configuration will be moved, open the **template.json** file:

    ```json
    "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "TARGET REGION",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
    ```

18. Edit the **location** property in the **template.json** file to the target region. To obtain region location codes, you can use the Azure PowerShell cmdlet [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation?view=azps-1.8.0) by running the following command:

    ```azurepowershell-interactive

    Get-AzLocation | format-table
    
    ```
19. You can also change other parameters in the template if you choose, and are optional depending on your requirements:
    * **Sku** - You can change the sku of the external load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "TARGET REGION",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview)

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
       For more information on load balancing rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)

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
       For more information on Azure Load Balancer health probes, see [Load Balancer health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview)

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
        For more information on inbound NAT rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)

    * **Outbound rules** - You can add or remove outbound rules in the configuration by editing the **outboundRules** property in the **template.json** file:

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

         For more information on outbound rules, see [Load Balancer outbound rules](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-rules-overview)

20. Save the **template.json** file.
21. Change to the directory where you unzipped the template files and saved the parameters.json file and run the following command to deploy the template and external load balancer public IP into the target region:

    ```azurepowershell-interactive

    ./deploy.ps1 -subscription "Azure Subscription" -resourceGroupName myresourcegroup -resourceGroupLocation targetregion
    
    ```

## Discard 

After the deployment, if you wish to start over or discard the public IP and load balancer in the target, delete the resource group that was created in the target and the moved public IP and load balancer will be deleted.  To remove the resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0):

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

## Clean up

To commit the changes and complete the move of the NSG, delete the source NSG or resource group, use [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=azps-2.6.0) or [Remove-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/remove-azpublicipaddress?view=azps-2.6.0) and [Remove-AzLoadBalancer](https://docs.microsoft.com/powershell/module/az.network/remove-azloadbalancer?view=azps-2.6.0)

```azurepowershell-interactive

Remove-AzResourceGroup -Name <resource-group-name>

```

``` azurepowershell-interactive

Remove-AzLoadBalancer -name <load-balancer> -ResourceGroupName <resource-group-name>

Remove-AzPublicIpAddress -Name <public-ip> -ResourceGroupName <resource-group-name>


```

## Next steps

In this tutorial, you moved an Azure network security group from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
