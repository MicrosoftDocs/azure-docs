---
title: Networking patterns for Azure Service Fabric | Microsoft Docs
description: Describes common networking patterns for Service Fabric and how to create a cluster using Azure networking features.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: 

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/27/2017
ms.author: ryanwi

---
# Service Fabric networking patterns
One of the more common questions we have seen when creating Service Fabric clusters is how to integrate the cluster with various Azure networking features.  This article shows how to create clusters using the following features:

- [Existing Virtual Network / Subnet](#existingvnet)
- [Static Public IP Address](#staticpublicip)
- [Internal Only Load Balancer](#internallb)
- [Internal + External Load Balancer](#internalexternallb)

A key concept to keep in mind is that Service Fabric runs in a standard virtual machine scale set, so any functionality you can use in a virtual machine scale set can also be used with a Service Fabric cluster. The networking portions of the Resource Manager template are identical.  And once you deploy into an existing VNet it is easy to incorporate other networking features such as ExpressRoute, VPN gateway, Network Security Group (NSG), and VNet peering.

The only Service Fabric specific aspect is that the [Azure portal](https://portal.azure.com) internally uses the Service Fabric resource provider (SFRP) to call into a cluster to get information about nodes and applications.  SFRP requires publicly accessible inbound access to the HTTP Gateway port (19080 by default) on the management endpoint, which is used by [Service Fabric explorer](service-fabric-visualizing-your-cluster.md) to manage your cluster. This port is also used by the Service Fabric resource provider to query information about your cluster for display in the Azure portal.  If this port is not accessible from the SFRP, you see a message such as 'Nodes Not Found' in the management portal and your node and application list appears empty.  If you wish to have visibility of your cluster via the Azure portal, then your load balancer must expose a public IP address and your NSG must allow incoming 19080 traffic.  If you do not meet these requirements, then the Azure portal does not display current status of your cluster.  Otherwise your cluster is not affected and you can use [Service Fabric explorer](service-fabric-visualizing-your-cluster.md) to get the current status, which may be an acceptable limitation based on your networking requirements.  This is a temporary limitation that we plan to remove in a future update, at which time your cluster can be publicly inaccessible without any loss of management portal functionality.

## Templates

All the templates can be found [here](https://msdnshared.blob.core.windows.net/media/2016/10/SF_Networking_Templates.zip). You should be able to deploy the templates as-is using the following powershell commands.  If deploying the existing VNet template or the static public IP template, make sure you go through the [Initial Setup](#initialsetup) section first.

<a id="initialsetup"></a>
## Initial setup

### Existing virtual network

I am starting with an existing Virtual Network named 'ExistingRG-vnet' in the resource group *ExistingRG*, with a subnet named 'default'.  These resources are the default ones created when using the Azure portal to create a standard virtual machine.  You could also create the VNet and subnet without creating the virtual machine. The main goal of adding a cluster to an existing VNet is to provide network connectivity to other VMs, though, so creating the VM gives a concrete example of how this is typically used.  If your Service Fabric cluster only uses an internal load balancer without a public IP address, the VM with its public IP can also be used as a jump box.

### Static public IP address

Because a static public IP address is generally a dedicated resource that is managed separately from the VM or VMs it is assigned to, it is provisioned in a dedicated networking resource group (as opposed to within the Service Fabric cluster resource group itself).  Create a static public IP address with the name 'staticIP1' in the same *ExistingRG* resource group, either via the Azure portal or Powershell:

```powershell
PS C:\Users\user> New-AzureRmPublicIpAddress -Name staticIP1 -ResourceGroupName ExistingRG -Location westus -AllocationMethod Static -DomainNameLabel sfnetworking

Name                     : staticIP1
ResourceGroupName        : ExistingRG
Location                 : westus
Id                       : /subscriptions/1237f4d2-3dce-1236-ad95-123f764e7123/resourceGroups/ExistingRG/providers/Microsoft.Network/publicIPAddresses/staticIP1
Etag                     : W/"fc8b0c77-1f84-455d-9930-0404ebba1b64"
ResourceGuid             : 77c26c06-c0ae-496c-9231-b1a114e08824
ProvisioningState        : Succeeded
Tags                     :
PublicIpAllocationMethod : Static
IpAddress                : 40.83.182.110
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : null
DnsSettings              : {
                             "DomainNameLabel": "sfnetworking",
                             "Fqdn": "sfnetworking.westus.cloudapp.azure.com"
                           }
```

### Service Fabric template

I am using the Service Fabric template.json that can be downloaded from the portal before creating a cluster using the standard portal wizard. You can also use one of the templates in the [template gallery](https://azure.microsoft.com/en-us/documentation/templates/?term=service+fabric) such as the [Five node Service Fabric cluster](https://azure.microsoft.com/en-us/documentation/templates/service-fabric-unsecure-cluster-5-node-1-nodetype/).

<a id="existingvnet"></a>
## Existing virtual network/subnet

[January 24, 2016: There is another sample of this outside the Service Fabric scope at [https://github.com/gbowerman/azure-myriad/tree/master/existing-vnet](https://github.com/gbowerman/azure-myriad/tree/master/existing-vnet)]

1. Change the subnet parameter to the name of the existing subnet and add two new parameters to reference the existing VNet:

    ```
        "subnet0Name": {
                "type": "string",
                "defaultValue": "default"
            },
            "existingVNetRGName": {
                "type": "string",
                "defaultValue": "ExistingRG"
            },

            "existingVNetName": {
                "type": "string",
                "defaultValue": "ExistingRG-vnet"
            },
            /*
            "subnet0Name": {
                "type": "string",
                "defaultValue": "Subnet-0"
            },
            "subnet0Prefix": {
                "type": "string",
                "defaultValue": "10.0.0.0/24"
            },*/
    ```


2. Change the *vnetID* variable to point to the existing VNet:

    ```
            /*old "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',parameters('virtualNetworkName'))]",*/
            "vnetID": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', parameters('existingVNetRGName'), '/providers/Microsoft.Network/virtualNetworks/', parameters('existingVNetName'))]",
    ```

3. Remove the *Microsoft.Network/virtualNetworks* from the Resources so that Azure does not create a new VNet:

    ```
    /*{
    "apiVersion": "[variables('vNetApiVersion')]",
    "type": "Microsoft.Network/virtualNetworks",
    "name": "[parameters('virtualNetworkName')]",
    "location": "[parameters('computeLocation')]",
    "properities": {
        "addressSpace": {
            "addressPrefixes": [
                "[parameters('addressPrefix')]"
            ]
        },
        "subnets": [
            {
                "name": "[parameters('subnet0Name')]",
                "properties": {
                    "addressPrefix": "[parameters('subnet0Prefix')]"
                }
            }
        ]
    },
    "tags": {
        "resourceType": "Service Fabric",
        "clusterName": "[parameters('clusterName')]"
    }
    },*/
    ```

4. Comment out the VNet from the *dependsOn* attribute of the *Microsoft.Compute/virtualMachineScaleSets* so that we don't depend on creating a new VNet:

    ```
    "apiVersion": "[variables('vmssApiVersion')]",
    "type": "Microsoft.Computer/virtualMachineScaleSets",
    "name": "[parameters('vmNodeType0Name')]",
    "location": "[parameters('computeLocation')]",
    "dependsOn": [
        /*"[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]",
        */
        "[Concat('Microsoft.Storage/storageAccounts/', variables('uniqueStringArray0')[0])]",

    ```

5. Deploy the template:

    ```powershell
    New-AzureRmResourceGroup -Name sfnetworkingexistingvnet -Location westus
    New-AzureRmResourceGroupDeployment -Name deployment -ResourceGroupName sfnetworkingexistingvnet -TemplateFile C:\SFSamples\Final\template\_existingvnet.json
    ```

    After the deployment your Virtual Network should include the new scale set VMs and the virtual machine scale set node type should show the existing VNet and subnet.  You can also RDP to the existing VM that was already in the VNet and ping the new scale set VMs:

    ```
    C:>\Users\users>ping 10.0.0.5 -n 1
    C:>\Users\users>ping NOde1000000 -n 1
    ```

<a id="staticpublicip"></a>
## Static public IP address

1. Add parameters for the name of the existing static IP resource group, name, and FQDN:

    ```
    "existingStaticIPResourceGroup": {
                "type": "string"
            },
            "existingStaticIPName": {
                "type": "string"
            },
            "existingStaticIPDnsFQDN": {
                "type": "string"
    }
    ```

2. Remove the *dnsName* parameter since the static IP already has one:

    ```
    /*
    "dnsName": {
        "type": "string"
    }, 
    */
    ```

3. Add a variable to reference the existing static IP:

    ```
    "existingStaticIP": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', parameters('existingStaticIPResourceGroup'), '/providers/Microsoft.Network/publicIPAddresses/', parameters('existingStaticIPName'))]",
    ```

4. Remove the *Microsoft.Network/publicIPAddresses* from the *Resources* so that Azure does not create a new IP address:

    ```
    /*
    {
        "apiVersion": "[variables('publicIPApiVersion')]",
        "type": "Microsoft.Network/publicIPAddresses",
        "name": "[concat(parameters('lbIPName'),)'-', '0')]",
        "location": "[parameters('computeLocation')]",
        "properties": {
            "dnsSettings": {
                "domainNameLabel": "[parameters('dnsName')]"
            },
            "publicIPAllocationMethod": "Dynamic"        
        },
        "tags": {
            "resourceType": "Service Fabric",
            "clusterName": "[parameters('clusterName')]"
        }
    }, */
    ```

5. Comment out the IP address from the *dependsOn* attribute of the *Microsoft.Network/loadBalancers* so that we don't depend on creating a new IP address:

    ```
    "apiVersion": "[variables('lbIPApiVersion')]",
    "type": "Microsoft.Network/loadBalancers",
    "name": "[concat('LB', '-', parameters('clusterName'), '-', parameters('vmNodeType0Name'))]",
    "location": "[parameters('computeLocation')]",
    /*
    "dependsOn": [
        "[concat('Microsoft.Network/publicIPAddresses/', concat(parameters('lbIPName'), '-', '0'))]"
    ], */
    "properties": {
    ```

6. Change the *publicIPAddress* element of the *frontendIPConfigurations* in the *Microsoft.Network/loadBalancers* resource to reference the existing static IP instead of a newly created one:

    ```
                "frontendIPConfigurations": [
                        {
                            "name": "LoadBalancerIPConfig",
                            "properties": {
                                "publicIPAddress": {
                                    /*"id": "[resourceId('Microsoft.Network/publicIPAddresses',concat(parameters('lbIPName'),'-','0'))]"*/
                                    "id": "[variables('existingStaticIP')]"
                                }
                            }
                        }
                    ],
    ```

7. Change the *managementEndpoint* in the *Microsoft.ServiceFabric/clusters* resource to the DNS FQDN of the static IP.  **If you are using a secure cluster, make sure you change 'http://' to 'https://'.** (Note: This instruction is only for Service Fabric clusters.  If you are using a virtual machine scale set then skip this step):

    ```
                    "fabricSettings": [],
                    /*"managementEndpoint": "[concat('http://',reference(concat(parameters('lbIPName'),'-','0')).dnsSettings.fqdn,':',parameters('nt0fabricHttpGatewayPort'))]",*/
                    "managementEndpoint": "[concat('http://',parameters('existingStaticIPDnsFQDN'),':',parameters('nt0fabricHttpGatewayPort'))]",
    ```

8. Deploy the template:

    ```powershell
    New-AzureRmResourceGroup -Name sfnetworkingstaticip -Location westus

    $staticip = Get-AzureRmPublicIpAddress -Name staticIP1 -ResourceGroupName ExistingRG

    $staticip

    New-AzureRmResourceGroupDeployment -Name deployment -ResourceGroupName sfnetworkingstaticip -TemplateFile C:\SFSamples\Final\template\_staticip.json -existingStaticIPResourceGroup $staticip.ResourceGroupName -existingStaticIPName $staticip.Name -existingStaticIPDnsFQDN $staticip.DnsSettings.Fqdn
    ```

After the deployment you see that your load balancer is bound to the public static IP address from the other resource group. The Service Fabric client connection endpoint and [Service Fabric explorer](service-fabric-visualizing-your-cluster.md) endpoint point to the DNS FQDN of the static IP address.

<a id="internallb"></a>
## Internal-only load balancer

This scenario replaces the external load balancer in the default Service Fabric template with an internal only load balancer.  See the preceding for the Azure portal and SFRP implications.

1. Remove the *dnsName* parameter since it is not needed:

    ```
    /*
    "dnsName": {
        "type": "string"
    },
    */
    ```

2. Optionally add a static IP address parameter, if using static allocation method. If using dynamic allocation method then this is not needed:

    ```
            "internalLBAddress": {
                "type": "string",
                "defaultValue": "10.0.0.250"
            }
    ```

3. Remove the *Microsoft.Network/publicIPAddresses* from the Resources so that Azure does not create a new IP address:

    ```
    /*
    {
        "apiVersion": "[variables('publicIPApiVersion')]",
        "type": "Microsoft.Network/publicIPAddresses",
        "name": "[concat(parameters('lbIPName'),)'-', '0')]",
        "location": "[parameters('computeLocation')]",
        "properties": {
            "dnsSettings": {
                "domainNameLabel": "[parameters('dnsName')]"
            },
            "publicIPAllocationMethod": "Dynamic"        
        },
        "tags": {
            "resourceType": "Service Fabric",
            "clusterName": "[parameters('clusterName')]"
        }
    }, */
    ```

4. Remove the IP address *dependsOn* attribute of the *Microsoft.Network/loadBalancers*, so that we don't depend on creating a new IP address.  Add the VNet *dependsOn* attribute since the load balancer now depends on the subnet from the VNet:

    ```
                "apiVersion": "[variables('lbApiVersion')]",
                "type": "Microsoft.Network/loadBalancers",
                "name": "[concat('LB','-', parameters('clusterName'),'-',parameters('vmNodeType0Name'))]",
                "location": "[parameters('computeLocation')]",
                "dependsOn": [
                    /*"[concat('Microsoft.Network/publicIPAddresses/',concat(parameters('lbIPName'),'-','0'))]"*/
                    "[concat('Microsoft.Network/virtualNetworks/',parameters('virtualNetworkName'))]"
                ],
    ```

5. Change the load balancer's *frontendIPConfigurations* from using a *publicIPAddress* to using a subnet and *privateIPAddress*, which uses a predefined static internal IP address.  You could use a dynamic IP address by removing the *privateIPAddress* element and changing the *privateIPAllocationMethod* to "Dynamic".

    ```
                "frontendIPConfigurations": [
                        {
                            "name": "LoadBalancerIPConfig",
                            "properties": {
                                /*
                                "publicIPAddress": {
                                    "id": "[resourceId('Microsoft.Network/publicIPAddresses',concat(parameters('lbIPName'),'-','0'))]"
                                } */
                                "subnet" :{
                                    "id": "[variables('subnet0Ref')]"
                                },
                                "privateIPAddress": "[parameters('internalLBAddress')]",
                                "privateIPAllocationMethod": "Static"
                            }
                        }
                    ],
    ```

6. In the *Microsoft.ServiceFabric/clusters* resource change the *managementEndpoint* to point to the internal load balancer address.  **If you are using a secure cluster, make sure you change 'http://' to 'https://'.** (Note: This instruction is only for Service Fabric clusters.  If you are using a virtual machine scale set then skip this step):

    ```
                    "fabricSettings": [],
                    /*"managementEndpoint": "[concat('http://',reference(concat(parameters('lbIPName'),'-','0')).dnsSettings.fqdn,':',parameters('nt0fabricHttpGatewayPort'))]",*/
                    "managementEndpoint": "[concat('http://',reference(variables('lbID0')).frontEndIPConfigurations[0].properties.privateIPAddress,':',parameters('nt0fabricHttpGatewayPort'))]",
    ```

7. Deploy the template:

    ```powershell
    New-AzureRmResourceGroup -Name sfnetworkinginternallb -Location westus

    New-AzureRmResourceGroupDeployment -Name deployment -ResourceGroupName sfnetworkinginternallb -TemplateFile C:\SFSamples\Final\template\_internalonlyLB.json
    ```

After the deployment your load balancer is using the private static 10.0.0.250 IP address. If you have another machine in that same VNet then you can also browse to the internal [Service Fabric explorer](service-fabric-visualizing-your-cluster.md) endpoint and see that it connects to one of the nodes behind the load balancer.

<a id="internalexternallb"></a>
## Internal and external load balancer

This scenario takes the existing single node type external load balancer and adds an additional internal load balancer for the same node type.  A back-end port attached to a back-end address pool can only be assigned to a single load balancer so you have to decide which load balancer should have your application ports and which load balancer should have your management endpoints (port 19000/19080).  Keep in mind the SFRP restrictions from above if you decide to put the management endpoints on the internal load balancer.  This sample keeps the management endpoints on the external load balancer and adds a port 80 application port and places it on the internal load balancer.

If you want a two node type cluster, with one node type on the external load balancer and the other on the internal load balancer, then simply take the portal-created two node type template (which comes with 2 load balancers) and switch the second load balancer to an internal load balancer per the 'Internal Only Load Balancer' section above.

1. Add the static internal LB IP address parameter (see notes above if dynamic IP address is desired):

    ```
            "internalLBAddress": {
                "type": "string",
                "defaultValue": "10.0.0.250"
            }
    ```

2. Add application port 80 parameter:

3. Add internal versions of the existing networking variables by copy/paste and adding "-Int" to the naming:

    ```
    /* Add internal LB networking variables */
            "lbID0-Int": "[resourceId('Microsoft.Network/loadBalancers', concat('LB','-', parameters('clusterName'),'-',parameters('vmNodeType0Name'), '-Internal'))]",
            "lbIPConfig0-Int": "[concat(variables('lbID0-Int'),'/frontendIPConfigurations/LoadBalancerIPConfig')]",
            "lbPoolID0-Int": "[concat(variables('lbID0-Int'),'/backendAddressPools/LoadBalancerBEAddressPool')]",
            "lbProbeID0-Int": "[concat(variables('lbID0-Int'),'/probes/FabricGatewayProbe')]",
            "lbHttpProbeID0-Int": "[concat(variables('lbID0-Int'),'/probes/FabricHttpGatewayProbe')]",
            "lbNatPoolID0-Int": "[concat(variables('lbID0-Int'),'/inboundNatPools/LoadBalancerBEAddressNatPool')]",
            /* internal LB networking variables end */
    ```

4. If you are starting with the portal generated template with an application port 80 then the default portal template adds *AppPort1* (port 80) on the external load balancer.  In this case remove it from the external load balancer *loadBalancingRules* and probes so you can add it to the internal load balancer:

    ```
    "loadBalancingRules": [
        {
            "name": "LBHttpRule",
            "properties":{
                "backendAddressPool": {
                    "id": "[variables('lbPoolID0')]"
                },
                "backendPort": "[parameters('nt0fabricHttpGatewayPort')]",
                "enableFloatingIP": "false",
                "frontendIPConfiguration": {
                    "id": "[variables('lbIPConfig0')]"            
                },
                "frontendPort": "[parameters('nt0fabricHttpGatewayPort')]",
                "idleTimeoutInMinutes": "5",
                "probe": {
                    "id": "[variables('lbHttpProbeID0')]"
                },
                "protocol": "tcp"
            }
        } /* remove the AppPort1 from the external LB,
        {
            "name": "AppPortLBRule1",
            "properties": {
                "backendAddressPool": {
                    "id": "[variables('lbPoolID0')]"
                },
                "backendPort": "[parameters('loadBalancedAppPort1')]",
                "enableFloatingIP": "false",
                "frontendIPConfiguration": {
                    "id": "[variables('lbIPConfig0')]"            
                },
                "frontendPort": "[parameters('loadBalancedAppPort1')]",
                "idleTimeoutInMinutes": "5",
                "probe": {
                    "id": "[concate(variables('lbID0'), '/probes/AppPortProbe1')]"
                },
                "protocol": "tcp"
            }
        }*/

    ],
    "probes": [
        {
            "name": "FabricGatewayProbe", 
            "properties": {
                "intervalInSeconds": 5,
                "numberOfProbes": 2,
                "port": "[parameters('nt0fabricTcpGatewayPort')]",
                "protocol": "tcp"
            }
        },
        {
            "name": "FabricHttpGatewayProbe",
            "properties": {
                "intervalInSeconds": 5,
                "numberOfProbes": 2,
                "port": "[parameters('nt0fabricHttpGatewayPort')]",
                "protocol": "tcp"
            }
        } /* remove the AppPort1 from the external LB,,
        {
            "name": "AppPortProbe1",
            "properties": {
                "intervalInSeconds": 5,
                "numberOfProbes": 2,
                "port": "[parameters('loadBalancedAppPort1')]",
                "protocol": "tcp"
            }
        } */

    ], 
    "inboundNatPools": [
    ```

5. Add a second *Microsoft.Network/loadBalancers* resource, which looks very similar to the internal load balancer created in the previous [Internal Only Load Balancer](#internallb) section, but using the '-Int' load balancer variables and only implementing the application port 80.  This also removes the *inboundNatPools* in order to keep RDP endpoints on the public load balancer – if you want RDP in the internal load balancer then move the *inboundNatPools* from the external load balancer to this internal load balancer.

    ```
            /* Add a second load balancer, configured with a static privateIPAddress and the "-Int" LB variables */
            {
                "apiVersion": "[variables('lbApiVersion')]",
                "type": "Microsoft.Network/loadBalancers",
                /* Add '-Internal' to name */
                "name": "[concat('LB','-', parameters('clusterName'),'-',parameters('vmNodeType0Name'), '-Internal')]",
                "location": "[parameters('computeLocation')]",
                "dependsOn": [
                    /* Remove public IP dependsOn, add vnet dependsOn
                    "[concat('Microsoft.Network/publicIPAddresses/',concat(parameters('lbIPName'),'-','0'))]"
                    */
                    "[concat('Microsoft.Network/virtualNetworks/',parameters('virtualNetworkName'))]"
                ],
                "properties": {
                    "frontendIPConfigurations": [
                        {
                            "name": "LoadBalancerIPConfig",
                            "properties": {
                                /* Switch from Public to Private IP address
                                */
                                "publicIPAddress": {
                                    "id": "[resourceId('Microsoft.Network/publicIPAddresses',concat(parameters('lbIPName'),'-','0'))]"
                                }
                                */
                                "subnet" :{
                                    "id": "[variables('subnet0Ref')]"
                                },
                                "privateIPAddress": "[parameters('internalLBAddress')]",
                                "privateIPAllocationMethod": "Static"
                            }
                        }
                    ],
                    "backendAddressPools": [
                        {
                            "name": "LoadBalancerBEAddressPool",
                            "properties": {}
                        }
                    ],
                    "loadBalancingRules": [
                        /* Add the AppPort rule, making sure to reference the "-Int" versions of the backendAddressPool, frontendIPConfiguration, and probe variables */
                        {
                            "name": "AppPortLBRule1",
                            "properties": {
                                "backendAddressPool": {
                                    "id": "[variables('lbPoolID0-Int')]"
                                },
                                "backendPort": "[parameters('loadBalancedAppPort1')]",
                                "enableFloatingIP": "false",
                                "frontendIPConfiguration": {
                                    "id": "[variables('lbIPConfig0-Int')]"
                                },
                                "frontendPort": "[parameters('loadBalancedAppPort1')]",
                                "idleTimeoutInMinutes": "5",
                                "probe": {
                                    "id": "[concat(variables('lbID0-Int'),'/probes/AppPortProbe1')]"
                                },
                                "protocol": "tcp"
                            }
                        }
                    ],
                    "probes": [
                    /* Add the probe for the app port */
                    {
                            "name": "AppPortProbe1",
                            "properties": {
                                "intervalInSeconds": 5,
                                "numberOfProbes": 2,
                                "port": "[parameters('loadBalancedAppPort1')]",
                                "protocol": "tcp"
                            }
                        }
                    ],
                    "inboundNatPools": [
                    ]
                },
                "tags": {
                    "resourceType": "Service Fabric",
                    "clusterName": "[parameters('clusterName')]"
                }
            },
    ```

6. In the *networkProfile* for the *Microsoft.Compute/virtualMachineScaleSets* resource add the internal back-end address pool:

    ```
    "loadBalancerBackendAddressPools": [
                                                        {
                                                            "id": "[variables('lbPoolID0')]"
                                                        },
                                                        {
                                                            /* Add internal BE pool */
                                                            "id": "[variables('lbPoolID0-Int')]"
                                                        }
    ],
    ```

7. Deploy the template:

    ```powershell
    New-AzureRmResourceGroup -Name sfnetworkinginternalexternallb -Location westus

    New-AzureRmResourceGroupDeployment -Name deployment -ResourceGroupName sfnetworkinginternalexternallb -TemplateFile C:\SFSamples\Final\template\_internalexternalLB.json
    ```

After the deployment you see two load balancers in the resource group, and browsing through the load balancers you see the public IP address and management endpoints (port 19000/19080) assigned to the public IP address, and the static internal IP address and application endpoint (port 80) assigned to the internal load balancer, and both load balancers using the same virtual machine scale set backend pool.

## Next steps
Now that you've learned about integrating Service Fabric clusters with the Azure networking features, go ahead and [create a cluster](service-fabric-cluster-creation-via-arm.md). 
