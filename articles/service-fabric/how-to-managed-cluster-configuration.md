---
title: Configure your Service Fabric managed cluster (preview)
description: Learn how to configure your Service Fabric managed cluster for automatic OS upgrades, NSG rules, and more.
ms.topic: how-to
ms.date: 02/15/2021
---
# Service Fabric managed cluster (preview) configuration options

In addition to selecting the [Service Fabric managed cluster SKU](overview-managed-cluster.md#service-fabric-managed-cluster-skus) when creating your cluster, there are a number of other ways to configure it. In the current preview, you can:

* Add a [virtual machine scale set extension](how-to-managed-cluster-vmss-extension.md) to a node type
* Enable [automatic OS upgrades](how-to-managed-cluster-configuration.md#enable-automatic-os-image-upgrades) for your nodes
* Enable [OS and data disk encryption](how-to-enable-managed-cluster-disk-encryption.md) on your nodes
* About [networking configurations](how-to-managed-cluster-configuration.md#networking-configurations)
* Configure [managed identity](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md) on your node types

## Networking configurations

Service Fabric managed clusters are created with a default networking configuration. This configuration consists of mandatory rules for essential cluster functionality, and a few optional rules which are intended to make customer configuration easier.

Beyond the default networking configuration, you can modify the networking rules to meet the needs of your scenario. 

### NSG rules guidance

* Service Fabric managed clusters reserve the NSG rule priority range 0 to 999 for essential functionality. You cannot create custom NSG rules with a priority value of less than 1000. 
* Service Fabric managed clusters reserve the priority range 3001 to 4000 for creating optional NSG rules. These rules are added automatically to make configurations quick and easy. You can override these rules by adding custom NSG rules in priority range 1000 to 3000. 
* Custom NSG rules should have a priority within the range 1000 to 3000. 


### Apply NSG rules

With classic (non-managed) Service Fabric clusters, you must declare and manage a separate *Microsoft.Network/networkSecurityGroups* resource in order to [apply Network Security Group (NSG) rules to your cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-nsg-cluster-65-node-3-nodetype). Service Fabric managed clusters enable you to assign NSG rules directly within the cluster resource of your deployment template.

Use the [networkSecurityRules](/azure/templates/microsoft.servicefabric/managedclusters#managedclusterproperties-object) property of your *Microsoft.ServiceFabric/managedclusters* resource (version `2021-01-01-preview` or later) to assign NSG rules. For example:

```json
            "apiVersion": "2021-01-01-preview",
            "type": "Microsoft.ServiceFabric/managedclusters",
            ...
            "properties": {
                ...
                "networkSecurityRules" : [
                    {
                        "name": "AllowCustomers",
                        "protocol": "*",
                        "sourcePortRange": "*",
                        "sourceAddressPrefix": "Internet",
                        "destinationAddressPrefix": "*",
                        "destinationPortRange": "33000-33499",
                        "access": "Allow",
                        "priority": 2001,
                        "direction": "Inbound" 
                    },
                    {
                        "name": "AllowARM",
                        "protocol": "*",
                        "sourcePortRange": "*",
                        "sourceAddressPrefix": "AzureResourceManager",
                        "destinationAddressPrefix": "*",
                        "destinationPortRange": "33500-33699",
                        "access": "Allow",
                        "priority": 2002,
                        "direction": "Inbound" 
                    },
                    {
                        "name": "DenyCustomers",
                        "protocol": "*",
                        "sourcePortRange": "*",
                        "sourceAddressPrefix": "Internet",
                        "destinationAddressPrefix": "*",
                        "destinationPortRange": "33700-33799",
                        "access": "Deny",
                        "priority": 2003,
                        "direction": "Outbound"
                    },
                    {
                        "name": "DenyRDP",
                        "protocol": "*",
                        "sourcePortRange": "*",
                        "sourceAddressPrefix": "*",
                        "destinationAddressPrefix": "VirtualNetwork",
                        "destinationPortRange": "3389",
                        "access": "Deny",
                        "priority": 2004,
                        "direction": "Inbound",
                        "description": "Override for optional SFMC_AllowRdpPort rule. This is required in tests to avoid Sev2 incident for security policy violation."
                    }
                ],
                "fabricSettings": [
                ...
                ]
            }
```

### RDP Ports 

Service Fabric managed clusters do not allow access to the RDP ports by default. You can open RDP ports to the internet by setting the following property on a Service Fabric managed cluster resource. 

```json
"allowRDPAccess": true 
```

When the allowRDPAccess property is set to true, the following NSG rule will be added to your cluster deployment.  

```json
{
    "name": "SFMC_AllowRdpPort", 
    "type": "Microsoft.Network/networkSecurityGroups/securityRules",
    "properties": {
        "description": "Optional rule to open RDP ports.",
        "protocol": "tcp",
        "sourcePortRange": "*",
        "sourceAddressPrefix": "*",
        "destinationAddressPrefix": "VirtualNetwork",
        "access": "Allow",
        "priority": 3002,
        "direction": "Inbound",
        "sourcePortRanges": [],
        "destinationPortRange": "3389"
    }
}
```

### ClientConnection and HttpGatewayConnection ports 

**NSG rule: SFMC_AllowServiceFabricGatewayToSFRP**
A default NSG rule is added to allow the Service Fabric resource provider to access the cluster's clientConnectionPort and httpGatewayConnectionPort. This rule allows access to the ports through the service tag 'ServiceFabric'.

>[!NOTE]
>This rule is always added and cannot be overridden. 

```json
{ 
    "name": "SFMC_AllowServiceFabricGatewayToSFRP", 
    "type": "Microsoft.Network/networkSecurityGroups/securityRules", 
    "properties": { 
        "description": "This is required rule to allow SFRP to connect to the cluster. This rule cannot be overridden.", 
        "protocol": "TCP", 
        "sourcePortRange": "*", 
        "sourceAddressPrefix": "ServiceFabric", 
        "destinationAddressPrefix": "VirtualNetwork", 
        "access": "Allow", 
        "priority": 500, 
        "direction": "Inbound", 
        "sourcePortRanges": [], 
        "destinationPortRanges": [ 
            "19000", 
            "19080" 
        ] 
    } 
}
```

**NSG rule: SFMC_AllowServiceFabricGatewayPorts**
This is an optional NSG rule to allow access to the clientConnectionPort, and httpGatewayPort from the internet. This rule allows customers to access SFX, connect to the cluster using PowerShell, and use Service Fabric cluster API endpoints from outside of the. 

>[!NOTE]
>This rule will not be added if there is a custom rule with the same access, direction, and protocol values for the same port. You can override this rule with custom NSG rules. 

```json
{ 
    "name": "SFMC_AllowServiceFabricGatewayPorts", 
    "type": "Microsoft.Network/networkSecurityGroups/securityRules", 
    "properties": { 
        "description": "Optional rule to open SF cluster gateway ports. To override add a custom NSG rule for gateway ports in priority range 1000-3000.", 
        "protocol": "tcp", 
        "sourcePortRange": "*", 
        "sourceAddressPrefix": "*", 
        "destinationAddressPrefix": "VirtualNetwork", 
        "access": "Allow", 
        "priority": 3001, 
        "direction": "Inbound", 
        "sourcePortRanges": [], 
        "destinationPortRanges": [ 
            "19000", 
            "19080" 
        ] 
    } 
}
```

### Load balancer ports 

Service Fabric managed clusters create an NSG rule in default priority range for all the LB ports configured under "loadBalancingRules" section under ManagedCluster properties. This rule open LB ports for inbound traffic from internet.  

>[!NOTE]
>This rule is added in the optional priority range and can be overridden by adding custom NSG rules. 

```json
{
    "name": "SFMC_AllowLoadBalancedPorts",
    "type": "Microsoft.Network/networkSecurityGroups/securityRules",
    "properties": {
        "description": "Optional rule to open LB ports",
        "protocol": "*", 
        "sourcePortRange": "*",
        "sourceAddressPrefix": "*",
        "destinationAddressPrefix": "VirtualNetwork",
        "access": "Allow",
        "priority": 3003,
        "direction": "Inbound",
        "sourcePortRanges": [],
        "destinationPortRanges": [
        "80", "8080", "4343"
        ]
    }
}
```

### Load balancer probes

Service Fabric managed clusters automatically create load balancer probes for fabric gateway ports as well as all ports configured under the "loadBalancingRules" section of managed cluster properties.

```json
{ 
  "value": [ 
    { 
        "name": "FabricTcpGateway", 
        "properties": { 
            "provisioningState": "Succeeded", 
            "protocol": "Tcp", 
            "port": 19000, 
            "intervalInSeconds": 5, 
            "numberOfProbes": 2, 
            "loadBalancingRules": [ 
                { 
                    "id": "<>"
                } 
            ] 
        }, 
        "type": "Microsoft.Network/loadBalancers/probes" 
    }, 
    { 
        "name": "FabricHttpGateway", 
        "properties": { 
            "provisioningState": "Succeeded", 
            "protocol": "Tcp", 
            "port": 19080, 
            "intervalInSeconds": 5, 
            "numberOfProbes": 2, 
            "loadBalancingRules": [ 
                { 
                    "id": "<>" 
                } 
            ]
        },
        "type": "Microsoft.Network/loadBalancers/probes" 
    },
    {
        "name": "probe1_tcp_8080", 
        "properties": { 
            "provisioningState": "Succeeded", 
            "protocol": "Tcp", 
            "port": 8080, 
            "intervalInSeconds": 5, 
            "numberOfProbes": 2, 
            "loadBalancingRules": [ 
            { 
                "id": "<>" 
            } 
        ] 
      }, 
      "type": "Microsoft.Network/loadBalancers/probes" 
    } 
  ] 
} 
```

## Enable automatic OS image upgrades

You can choose to enable automatic OS image upgrades to the virtual machines running your managed cluster nodes. Although the virtual machine scale set resources are managed on your behalf with Service Fabric managed clusters, it's your choice to enable automatic OS image upgrades for your cluster nodes. As with [classic Service Fabric](service-fabric-best-practices-infrastructure-as-code.md#azure-virtual-machine-operating-system-automatic-upgrade-configuration) clusters, managed cluster nodes are not upgraded by default, in order to prevent unintended disruptions to your cluster.

To enable automatic OS upgrades:

* Use the `2021-01-01-preview` (or later) version of *Microsoft.ServiceFabric/managedclusters* and *Microsoft.ServiceFabric/managedclusters/nodetypes* resources
* Set the cluster's property `enableAutoOSUpgrade` to *true*
* Set the cluster nodeTypes' resource property `vmImageVersion` to *latest*

For example:

```json
    {
      "apiVersion": "2021-01-01-preview",
      "type": "Microsoft.ServiceFabric/managedclusters",
      ...
      "properties": {
        ...
        "enableAutoOSUpgrade": true
      },
    },
    {
      "apiVersion": "2021-01-01-preview",
      "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
       ...
      "properties": {
        ...
        "vmImageVersion": "latest",
        ...
      }
    }
}

```

Once enabled, Service Fabric will begin querying and tracking OS image versions in the managed cluster. If a new OS version is available, the cluster node types (virtual machine scale sets) will be upgraded, one at a time. Service Fabric runtime upgrades are performed only after confirming no cluster node OS image upgrades are in progress.

If an upgrade fails, Service Fabric will retry after 24 hours, for a maximum of three retries. Similar to classic (unmanaged) Service Fabric upgrades, unhealthy apps or nodes may block the OS image upgrade.

For more on image upgrades, see [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md).

## Next steps

[Link to sample template]

[Managed cluster overview]
