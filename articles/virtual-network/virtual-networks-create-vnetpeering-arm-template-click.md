---
title: Azure Virtual Network peering - Template | Microsoft Docs
description: Learn how to create a virtual network peering using an Azure Resource Manager template.
services: virtual-network
documentationcenter: ''
author: narayanannamalai
manager: jefco
editor: ''
tags: azure-resource-manager

ms.assetid: 75f8d10e-23e8-44bd-9972-aab74048cf38
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2016
ms.author: narayan;annahar

---
# Create a virtual network peering using an Azure Resource Manager template
[!INCLUDE [virtual-networks-create-vnet-selectors-arm-include](../../includes/virtual-networks-create-vnetpeering-selectors-arm-include.md)]

[!INCLUDE [virtual-networks-create-vnet-intro](../../includes/virtual-networks-create-vnetpeering-intro-include.md)]

[!INCLUDE [virtual-networks-create-vnet-scenario-basic-include](../../includes/virtual-networks-create-vnetpeering-scenario-basic-include.md)]

To create a VNet peering by using Resource Manager templates, complete the following steps:

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](/powershell/azure/overview) and follow the instructions all the way to the end to sign into Azure and select your subscription.

   > [!NOTE]
   > The PowerShell cmdlet for managing VNet peering is shipped with [Azure PowerShell 1.6.](http://www.powershellgallery.com/packages/Azure/1.6.0)
   > 
   > 
2. The text below shows the definition of a VNet peering link for VNet1 to VNet2, based on the scenario above. Copy the content below and save it to a file named VNetPeeringVNet1.json.

	```json
        {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "variables": {
        },
        "resources": [
            {
            "apiVersion": "2016-06-01",
            "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
            "name": "VNet1/LinkToVNet2",
            "location": "[resourceGroup().location]",
            "properties": {
            "allowVirtualNetworkAccess": true,
            "allowForwardedTraffic": false,
            "allowGatewayTransit": false,
            "useRemoteGateways": false,
                "remoteVirtualNetwork": {
                "id": "[resourceId('Microsoft.Network/virtualNetworks', 'vnet2')]"       
        }
            }
            }
        ]
        }
	```
3. The section below shows the definition of a VNet peering link for VNet2 to VNet1, based on the scenario above.  Copy the content below and save it to a file named VNetPeeringVNet2.json.

	```json
        {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "variables": {
        },
        "resources": [
            {
            "apiVersion": "2016-06-01",
            "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
            "name": "VNet2/LinkToVNet1",
            "location": "[resourceGroup().location]",
            "properties": {
            "allowVirtualNetworkAccess": true,
            "allowForwardedTraffic": false,
            "allowGatewayTransit": false,
            "useRemoteGateways": false,
                "remoteVirtualNetwork": {
                "id": "[resourceId('Microsoft.Network/virtualNetworks', 'vnet1')]"       
                }
            }
            }
        ]
        }
	```
    As seen in the template above, there are a few configurable properties for VNet peering:
   
   | Option | Description | Default |
   |:--- |:--- |:--- |
   | AllowVirtualNetworkAccess |Whether or not the address space of a peer VNet is included as part of the virtual_network tag. |Yes |
   | AllowForwardedTraffic |Whether traffic not originating from a peered VNet is accepted or dropped. |No |
   | AllowGatewayTransit |Allows the peer VNet to use your VNet gateway. |No |
   | UseRemoteGateways |Use your peer’s VNet gateway. The peer VNet must have a gateway configured and AllowGatewayTransit selected. You cannot use this option if you have a gateway configured. |No |
   
    Each link in VNet peering has the set of properties above. For example, you can set AllowVirtualNetworkAccess to True for VNet peering link VNet1 to VNet2 and set it to False for the VNet peering link in the other direction.
4. To deploy the template file, you can run the `New-AzureRmResourceGroupDeployment` to create or update the deployment. For more information about using Resource Manager templates, please refer to this [article](../azure-resource-manager/resource-group-template-deploy.md).

	```powershell
	New-AzureRmResourceGroupDeployment -ResourceGroupName <resource group name> -TemplateFile <template file path> -DeploymentDebugLogLevel all
	```

   > [!NOTE]
   > Replace the resource group name and template file, as appropriate.
   > 
   > 
   
    The following is an example based on the previous scenario:

	```powershell
	New-AzureRmResourceGroupDeployment -ResourceGroupName VNet101 -TemplateFile .\VNetPeeringVNet1.json -DeploymentDebugLogLevel all
	```

    Returned output:
   
        DeploymentName        : VNetPeeringVNet1
        ResourceGroupName    : VNet101
        ProvisioningState        : Succeeded
        Timestamp            : MM/DD/YEAR 9:05:03 AM
        Mode            : Incremental
        TemplateLink        :
        Parameters            :
        Outputs            :
        DeploymentDebugLogLevel : RequestContent, ResponseContent
   
	```powershell
	New-AzureRmResourceGroupDeployment -ResourceGroupName VNet101 -TemplateFile .\VNetPeeringVNet2.json -DeploymentDebugLogLevel all
	```

    Returned output:
   
        DeploymentName        : VNetPeeringVNet2
        ResourceGroupName    : VNet101
        ProvisioningState        : Succeeded
        Timestamp            : MM/DD/YEAR 9:07:22 AM
        Mode            : Incremental
        TemplateLink        :
        Parameters            :
        Outputs            :
        DeploymentDebugLogLevel : RequestContent, ResponseContent
5. After the deployment is finished, run the following cmdlet to view the peering state:

	```powershell
	Get-AzureRmVirtualNetworkPeering -VirtualNetworkName VNet1 -ResourceGroupName VNet101 -Name linktoVNet2
	```

    Returned output:
   
        Name            : LinkToVNet2
        Id                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/VNet101/providers/Microsoft.Network/virtualNetworks/VNet1/virtualNetworkPeerings/LinkToVNet2
        Etag            : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        ResourceGroupName    : VNet101
        VirtualNetworkName    : VNet1
        ProvisioningState        : Succeeded
        RemoteVirtualNetwork    : {
                                            "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/VNet101/providers/Microsoft.Network/virtualNetworks/VNet2"
                                        }
        AllowVirtualNetworkAccess    : True
        AllowForwardedTraffic            : False
        AllowGatewayTransit              : False
        UseRemoteGateways                : False
        RemoteGateways                   : null
        RemoteVirtualNetworkAddressSpace : null
   
    After the peering is established in this scenario, you should be able to initiate the connections from any VM to any VM across both VNets. By default, `AllowVirtualNetworkAccess` is *True* and VNet peering will provision the proper ACLs to allow the communication between VNets. You can still apply network security group (NSG) rules to block connectivity between specific subnets or virtual machines to gain fine-grain control of access between two virtual networks. Read the [Network security groups](virtual-networks-create-nsg-arm-ps.md) article to learn more about NSGs.

[!INCLUDE [virtual-networks-create-vnet-scenario-crosssub-include](../../includes/virtual-networks-create-vnetpeering-scenario-crosssub-include.md)]

To create a VNet peering across subscriptions, complete the following steps:

1. Sign in to Azure with privileged User-A's account in Subscription-A and run the following cmdlet:

	```powershell
	New-AzureRmRoleAssignment -SignInName <UserB ID> -RoleDefinitionName "Network Contributor" -Scope /subscriptions/<Subscription-A-ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualNetwork/VNet5
	```

	This is not a requirement. Peering can be established even if users individually raise peering requests for their respective Vnets as long as the requests match. Adding a privileged user of the other VNet as users in the local VNet makes it easier to do the setup.
2. Sign in to Azure with privileged User-B's account for Subscription-B and run the following cmdlet:

	```powershell
	New-AzureRmRoleAssignment -SignInName <UserA ID> -RoleDefinitionName "Network Contributor" -Scope /subscriptions/<Subscription-B-ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/VirtualNetwork/VNet3
	```

	> [!IMPORTANT]
	> If the peering you're creating is between two VNets created through the Azure Resource Manager deployment model, continue with the remaining steps in this section. If the two VNets were created through different deployment models, skip the remaining steps of this section and complete the steps in the [Peering virtual networks created through different deployment models](#x-model) section of this article.

3. In User-A’s login session, run this cmdlet:

	```powershell
	New-AzureRmResourceGroupDeployment -ResourceGroupName VNet101 -TemplateFile .\VNetPeeringVNet3.json -DeploymentDebugLogLevel all
	```
   
    The json is as follows:

	```json
        {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "variables": {
        },
        "resources": [
            {
            "apiVersion": "2016-06-01",
            "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
            "name": "VNet3/LinkToVNet5",
            "location": "[resourceGroup().location]",
            "properties": {
            "allowVirtualNetworkAccess": true,
            "allowForwardedTraffic": false,
            "allowGatewayTransit": false,
            "useRemoteGateways": false,
                "remoteVirtualNetwork": {
                "id": "/subscriptions/<Subscription-B-ID>/resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/VNet5"
                }
            }
            }
        ]
        }
	```
4. In User-B’s login session, run the following cmdlet:

	```powershell
	New-AzureRmResourceGroupDeployment -ResourceGroupName VNet101 -TemplateFile .\VNetPeeringVNet5.json -DeploymentDebugLogLevel all
	```

	The JSON is as follows:

	```json
        {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "variables": {
        },
        "resources": [
            {
            "apiVersion": "2016-06-01",
            "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
            "name": "VNet5/LinkToVNet3",
            "location": "[resourceGroup().location]",
            "properties": {
            "allowVirtualNetworkAccess": true,
            "allowForwardedTraffic": false,
            "allowGatewayTransit": false,
            "useRemoteGateways": false,
                "remoteVirtualNetwork": {
                "id": "/subscriptions/Subscription-A-ID /resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/VNet3"
                }
            }
            }
        ]
        }
	```

	After peering is established in this scenario, you should be able to initiate the connections from any virtual machine to any virtual machine of both VNets across different subscriptions.

[!INCLUDE [virtual-networks-create-vnet-scenario-transit-include](../../includes/virtual-networks-create-vnetpeering-scenario-transit-include.md)]

1. In this scenario, you can deploy the following sample template to establish the VNet peering. You'll need to set the `AllowForwardedTraffic` property to *True*, which allows the network virtual appliance in the peered VNet to send and receive traffic.

	The following JSON is the content of a template for creating a VNet peering from HubVNet to VNet1. Note that AllowForwardedTraffic is set to false.

	```json
        {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "variables": {
        },
        "resources": [
            {
            "apiVersion": "2016-06-01",
            "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
            "name": "HubVNet/LinkToVNet1",
            "location": "[resourceGroup().location]",
            "properties": {
            "allowVirtualNetworkAccess": true,
            "allowForwardedTraffic": false,
            "allowGatewayTransit": false,
            "useRemoteGateways": false,
                "remoteVirtualNetwork": {
                "id": "[resourceId('Microsoft.Network/virtualNetworks', 'vnet1')]"       
                }
            }
            }
        ]
        }
	```
2. The following JSON is the content of a template for creating a VNet peering from VNet1 to HubVnet. Note that AllowForwardedTraffic is set to true.

	```json
        {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "variables": {
        },
        "resources": [
            {
            "apiVersion": "2016-06-01",
            "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
            "name": "VNet1/LinkToHubVNet",
            "location": "[resourceGroup().location]",
            "properties": {
            "allowVirtualNetworkAccess": true,
            "allowForwardedTraffic": true,
            "allowGatewayTransit": false,
            "useRemoteGateways": false,
                "remoteVirtualNetwork": {
                "id": "[resourceId('Microsoft.Network/virtualNetworks', 'HubVnet')]"       
                }
            }
            }
        ]
        }
	```
3. After peering is established, you can refer to this [article](virtual-network-create-udr-arm-ps.md) to define user-defined routes (UDR) to redirect VNet1 traffic through a virtual appliance to use its capabilities. When you specify the next hop address in route, you can set it to the IP address of the virtual appliance in the peer VNet HubVNet.

[!INCLUDE [virtual-networks-create-vnet-scenario-asmtoarm-include](../../includes/virtual-networks-create-vnetpeering-scenario-asmtoarm-include.md)]

To create a peering between virtual networks from different deployment models, complete the following steps:

1. If you are creating a peering between VNets deployed through different deployment models in the *same* subscription, skip to step 2. The ability to create a VNet peering between VNets deployed through different deployment models in *different* subscriptions is in **preview** release. Capabilities in preview release do not have the same level of reliability and service level agreement as general release capabilities. If you are creating a peering between VNets deployed through different deployment models in different subscriptions you must first complete the following tasks:
	- Register the preview capability in your Azure subscription by entering the following commands from PowerShell: `Register-AzureRmProviderFeature -FeatureName AllowClassicCrossSubscriptionPeering -ProviderNamespace Microsoft.Network`  and `Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network`
	- Complete steps 1-2 in the [Peering across subscriptions](#x-sub) section of this article.
2. The text below shows the definition of a VNet peering link for VNET1 to VNET2 in this scenario. Only one link is required to peer a classic virtual network to a Azure resource manager virtual network.

	Be sure to put in your subscription ID for where the classic virtual network or VNET2 is located and change MyResouceGroup to the appropriate resource group name.

	```json
	   {
	    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	    "contentVersion": "1.0.0.0",
	    "parameters": {
	    },
	    "variables": {
	    },
	    "resources": [

	        {
	        "apiVersion": "2016-06-01",
	        "type": "Microsoft.Network/virtualNetworks/virtualNetworkPeerings",
	        "name": "VNET1/LinkToVNET2",
	        "location": "[resourceGroup().location]",
	        "properties": {
	        "allowVirtualNetworkAccess": true,
	        "allowForwardedTraffic": false,
	        "allowGatewayTransit": false,
	        "useRemoteGateways": false,
	            "remoteVirtualNetwork": {
	            "id": "[resourceId('Microsoft.ClassicNetwork/virtualNetworks', 'VNET2')]"
		}

	        }
	        }
	    ]
	    }
	```
3. To deploy the template file, run the following cmdlet to create or update the deployment:

	```powershell
        New-AzureRmResourceGroupDeployment -ResourceGroupName MyResourceGroup -TemplateFile .\VnetPeering.json -DeploymentDebugLogLevel all
	```

	Returned output:
   
        DeploymentName          : VnetPeering
        ResourceGroupName       : MyResourceGroup
        ProvisioningState       : Succeeded
        Timestamp               : XX/XX/YYYY 5:42:33 PM
        Mode                    : Incremental
        TemplateLink            :
        Parameters              :
        Outputs                 :
        DeploymentDebugLogLevel : RequestContent, ResponseContent
4. After the deployment succeeds, you can run the following cmdlet to view the peering state:

	```powershell
	Get-AzureRmVirtualNetworkPeering -VirtualNetworkName VNET1 -ResourceGroupName MyResourceGroup -Name LinkToVNET2
	```

	Returned output:
   
        Name                             : LinkToVNET2
        Id                               : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResource
                                   Group/providers/Microsoft.Network/virtualNetworks/VNET1/virtualNetworkPeering
                                   s/LinkToVNET2
        Etag                             : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        ResourceGroupName                : MyResourceGroup
        VirtualNetworkName               : VNET1
        PeeringState                     : Connected
        ProvisioningState                : Succeeded
        RemoteVirtualNetwork             : {
                                     "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/M
                                   yResourceGroup/providers/Microsoft.ClassicNetwork/virtualNetworks/VNET2"
                                   }
        AllowVirtualNetworkAccess        : True
        AllowForwardedTraffic            : False
        AllowGatewayTransit              : False
        UseRemoteGateways                : False
        RemoteGateways                   : null
        RemoteVirtualNetworkAddressSpace : null

	After peering is established between a classic VNet and a resource manager VNet, you should be able to initiate connections from any virtual machine in VNET1 to any virtual machine in VNET2 and vice versa.

