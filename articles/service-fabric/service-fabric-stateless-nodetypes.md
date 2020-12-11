---
title: Deploy Stateless only Node Types in Service Fabric cluster
description: Learn how to create and deploy Stateless Node types in Azure Service fabric cluster.
author: peterpogorski

ms.topic: conceptual
ms.date: 09/25/2020
ms.author: pepogors
---
# Deploy an Azure Service Fabric cluster with Stateless only node types (Preview)
Service Fabric node types come with inherent assumption that at some point of time, stateful services might be placed on the nodes. Stateless node types relax this assumption for a node type, thus allowing node type to use other features such as faster scale out operations, support for Automatic OS Upgrades on Bronze durability and scaling out to more than 100 nodes in a single virtual machine scale set.

* Primary Node types cannot be configured to be stateless
* Stateless node types are only supported with Bronze Durability Levels
* Stateless node types are only supported on Service Fabric Runtime version 7.1.409 or above.


Sample templates are available: [Service Fabric Stateless Node types template](https://github.com/Azure-Samples/service-fabric-cluster-templates)

## Enabling Stateless Node Types in the Service Fabric Cluster resource
To set one or more node types as Stateless in a cluster resource, set the "isStateless" property to "true". When deploying a Service Fabric cluster with Stateless node types, do remember to have atleast one primary node type in the cluster resource.

```json
{
    "nodeTypes": [
    {
        "name": "[parameters('vmNodeType0Name')]",
        "applicationPorts": {
            "endPort": "[parameters('nt0applicationEndPort')]",
            "startPort": "[parameters('nt0applicationStartPort')]"
        },
        "clientConnectionEndpointPort": "[parameters('nt0fabricTcpGatewayPort')]",
        "durabilityLevel": "Bronze",
        "ephemeralPorts": {
            "endPort": "[parameters('nt0ephemeralEndPort')]",
            "startPort": "[parameters('nt0ephemeralStartPort')]"
        },
        "httpGatewayEndpointPort": "[parameters('nt0fabricHttpGatewayPort')]",
        "isPrimary": true,
        "isStateles": false,
        "vmInstanceCount": "[parameters('nt0InstanceCount')]"
    },
    {
        "name": "[parameters('vmNodeType1Name')]",
        "applicationPorts": {
            "endPort": "[parameters('nt1applicationEndPort')]",
            "startPort": "[parameters('nt1applicationStartPort')]"
        },
        "clientConnectionEndpointPort": "[parameters('nt1fabricTcpGatewayPort')]",
        "durabilityLevel": "Silver",
        "ephemeralPorts": {
            "endPort": "[parameters('nt1ephemeralEndPort')]",
            "startPort": "[parameters('nt1ephemeralStartPort')]"
        },
        "httpGatewayEndpointPort": "[parameters('nt1fabricHttpGatewayPort')]",
        "isPrimary": false,
        "isStateless": true,
        "vmInstanceCount": "[parameters('nt1InstanceCount')]"
    }    
    ],
}
```

## Configuring virtual machine scale set resource for Stateless node types
To enable Stateless node types, you should configure the underlying virtual machine scale set resource in the following way:

* The value  **singlePlacementGroup** property, which should be set to true/false depending on requirement to scale to more than 100 VMs.
* The Scale set's **upgradeMode** which should be set to Rolling.
* Rolling Upgrade Mode requires Application Health Extension or Health probes configured. Configure health probe with default configuration for Stateless Node types as suggested below. Once applications are deployed to the nodetype, Health Probe/Health extension ports can be changed to monitor application health.

```json
{
    "apiVersion": "2018-10-01",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    "name": "[parameters('vmNodeType1Name')]",
    "location": "[parameters('computeLocation')]",
    "properties": {
        "overprovision": "[variables('overProvision')]",
        "upgradePolicy": {
          "mode": "Rolling",
          "automaticOSUpgradePolicy": {
            "enableAutomaticOSUpgrade": true
          }
        }
    }
    "virtualMachineProfile": {
    "extensionProfile": {
    "extensions": [
    {
    "name": "[concat(parameters('vmNodeType1Name'),'_ServiceFabricNode')]",
    "properties": {
        "type": "ServiceFabricNode",
        "autoUpgradeMinorVersion": false,
        "publisher": "Microsoft.Azure.ServiceFabric",
        "settings": {
            "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
            "nodeTypeRef": "[parameters('vmNodeType1Name')]",
            "dataPath": "D:\\\\SvcFab",
            "durabilityLevel": "Silver",
            "certificate": {
                "thumbprint": "[parameters('certificateThumbprint')]",
                "x509StoreName": "[parameters('certificateStoreValue')]"
            },
            "systemLogUploadSettings": {
                "Enabled": true
            },
        },
        "typeHandlerVersion": "1.0"
    }
    },
    {
        "type": "extensions",
        "name": "HealthExtension",
        "properties": {
            "publisher": "Microsoft.ManagedServices",
            "type": "ApplicationHealthWindows",
            "autoUpgradeMinorVersion": true,
            "typeHandlerVersion": "1.0",
            "settings": {
            "protocol": "tcp",
            "port": "19000"
            }
            }
        },
    ]
}
```

## Networking requirements
### Public IP and Load Balancer Resource
To enable scaling to more than 100 VMs on a virtual machine scale set resource, the load balancer and IP resource referenced by that virtual machine scale set must both be using a *Standard* SKU. Creating a load balancer or IP resource without the SKU property will create a Basic SKU, which does not support scaling to more than 100 VMs. A Standard SKU load balancer will block all traffic from the outside by default; to allow outside traffic, an NSG must be deployed to the subnet.

```json
{
    "apiVersion": "2018-11-01",
    "type": "Microsoft.Network/publicIPAddresses",
    "name": "[concat('LB','-', parameters('clusterName')]",
    "location": "[parameters('computeLocation')]",
    "sku": {
        "name": "Standard"
    }
}
{
    "apiVersion": "2018-11-01",
    "type": "Microsoft.Network/loadBalancers",
    "name": "[concat('LB','-', parameters('clusterName')]", 
    "location": "[parameters('computeLocation')]",
    "dependsOn": [
        "[concat('Microsoft.Network/networkSecurityGroups/', concat('nsg', parameters('subnet0Name')))]"
    ],
    "properties": {
        "addressSpace": {
            "addressPrefixes": [
                "[parameters('addressPrefix')]"
            ]
        },
        "subnets": [
        {
            "name": "[parameters('subnet0Name')]",
            "properties": {
                "addressPrefix": "[parameters('subnet0Prefix')]",
                "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', concat('nsg', parameters('subnet0Name')))]"
              }
            }
          }
        ]
    },
    "sku": {
        "name": "Standard"
    }
}
```

>[!NOTE]
> It is not possible to do an in-place change of SKU on the public IP and load balancer resources. If you are migrating from existing resources which have a Basic SKU, see the migration section of this article.

### Virtual machine scale set NAT rules
The load balancer inbound NAT rules should match the NAT pools from the virtual machine scale set. Each virtual machine scale set must have a unique inbound NAT pool.

```json
{
"inboundNatPools": [
    {
        "name": "LoadBalancerBEAddressNatPool0",
        "properties": {
            "backendPort": "3389",
            "frontendIPConfiguration": {
                "id": "[variables('lbIPConfig0')]"
            },
            "frontendPortRangeEnd": "50999",
            "frontendPortRangeStart": "50000",
            "protocol": "tcp"
        }
    },
    {
        "name": "LoadBalancerBEAddressNatPool1",
        "properties": {
            "backendPort": "3389",
            "frontendIPConfiguration": {
                "id": "[variables('lbIPConfig0')]"
            },
            "frontendPortRangeEnd": "51999",
            "frontendPortRangeStart": "51000",
            "protocol": "tcp"
        }
    },
    {
        "name": "LoadBalancerBEAddressNatPool2",
        "properties": {
            "backendPort": "3389",
            "frontendIPConfiguration": {
                "id": "[variables('lbIPConfig0')]"
            },
            "frontendPortRangeEnd": "52999",
            "frontendPortRangeStart": "52000",
            "protocol": "tcp"
        }
    }
    ]
}
```

### Standard SKU Load Balancer outbound rules
Standard Load Balancer and Standard Public IP introduce new abilities and different behaviors to outbound connectivity when compared to using Basic SKUs. If you want outbound connectivity when working with Standard SKUs, you must explicitly define it either with Standard Public IP addresses or Standard public Load Balancer. For more information, see [Outbound connections](../load-balancer/load-balancer-outbound-connections.md) and [Azure Standard Load Balancer](../load-balancer/load-balancer-overview.md).

>[!NOTE]
> The standard template references an NSG which allows all outbound traffic by default. Inbound traffic is limited to the ports that are required for Service Fabric management operations. The NSG rules can be modified to meet your requirements.

>[!NOTE]
> Any Service Fabric cluster making use of a Standard SKU SLB needs to ensure that each node type has a rule allowing outbound traffic on port 443. This is necessary to complete cluster setup, and any deployment without such a rule will fail.



### Migrate to using Stateless node types from a cluster using a Basic SKU Load Balancer and a Basic SKU IP
To migrate a cluster, which was using a Load Balancer and IP with a basic SKU, you must first create an entirely new Load Balancer and IP resource using the standard SKU. It is not possible to update these resources in-place.

The new LB and IP should be referenced in the new Stateless node types that you would like to use. In the example above, a new virtual machine scale set resources is added to be used for Stateless node types. These virtual machine scale sets reference the newly created LB and IP and are marked as stateless node types in the Service Fabric Cluster Resource.

To begin, you will need to add the new resources to your existing Resource Manager template. These resources include:
* A Public IP Resource using Standard SKU.
* A Load Balancer Resource using Standard SKU.
* A NSG referenced by the subnet in which you deploy your virtual machine scale sets.


An example of these resources can be found in the [sample template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/10-VM-Windows-2-NodeType-Stateless-Secure).

```powershell
New-AzureRmResourceGroupDeployment `
    -ResourceGroupName $ResourceGroupName `
    -TemplateFile $Template `
    -TemplateParameterFile $Parameters
```

Once the resources have finished deploying, you can begin to disable the nodes in the node type that you want to remove from the original cluster.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterName `
    -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My 
```

