---
title: Configure network settings for Service Fabric managed clusters
description: Learn how to configure your Service Fabric managed cluster for NSG rules, RDP port access, load balancing rules, and more.
ms.topic: how-to
ms.date: 8/02/2021
---
# Configure network settings for Service Fabric managed clusters

Service Fabric managed clusters are created with a default networking configuration. This configuration consists of an [Azure Load Balancer](../load-balancer/load-balancer-overview.md) with a public ip, a VNet with one subnet allocated with mandatory NSG rules for essential cluster functionality, and a few optional rules such as allowing all outbound traffic by default, which are intended to make customer configuration easier. You can integrate your managed cluster with other Azure networking features. This document walks through how to modify the following default networking configuration options:

- [Modify NSG Rules](#nsgrules)
- [Multiple managed Load Balancers](#FIXME)
- [IPv6](#ipv6)
- [Existing virtual network](#existingvnet)
- [Bring your own load balancer](#byolb)


<a id="nsgrules"></a>
## Modify NSG Rules

### NSG rules guidance

Be aware of these considerations when creating new NSG rules for your managed cluster.

* Service Fabric managed clusters reserve the NSG rule priority range 0 to 999 for essential functionality. You cannot create custom NSG rules with a priority value of less than 1000.
* Service Fabric managed clusters reserve the priority range 3001 to 4000 for creating optional NSG rules. These rules are added automatically to make configurations quick and easy. You can override these rules by adding custom NSG rules in priority range 1000 to 3000.
* Custom NSG rules should have a priority within the range 1000 to 3000.

### Apply NSG rules
Service Fabric managed clusters enable you to assign NSG rules directly within the cluster resource of your deployment template.

Use the [networkSecurityRules](/azure/templates/microsoft.servicefabric/managedclusters#managedclusterproperties-object) property of your *Microsoft.ServiceFabric/managedclusters* resource (version `2021-05-01` or later) to assign NSG rules. For example:

```json
            "apiVersion": "2021-05-01",
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

## Enable access to RDP ports from internet

Service Fabric managed clusters do not enable access to the RDP ports from the internet by default. You can open RDP ports to the internet by setting the following property on a Service Fabric managed cluster resource.

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

Service Fabric managed clusters automatically creates inbound NAT rules for each instance in a node type. 
To find the port mappings to reach specific instances (cluster nodes) follow the steps below:

Using Azure portal, locate the managed cluster created inbound NAT rules for Remote Desktop Protocol (RDP).

1. Navigate to the managed cluster resource group within your subscription named with the following format: SFC_{cluster-id}

2. Select the load balancer for the cluster with the following format: LB-{cluster-name}

3. On the page for your load balancer, select Inbound NAT rules. Review the inbound NAT rules to confirm the inbound Frontend port to target port mapping for a node. 

   The following screenshot shows the inbound NAT rules for three different node types:

   ![Inbound Nat Rules][Inbound-NAT-Rules]

   By default, for Windows clusters, the Frontend Port is in the 50000 and higher range and the target port is port 3389, which maps to the RDP service on the target node.

4. Remotely connect to the specific node (scale set instance). You can use the user name and password that you set when you created the cluster or any other credentials you have configured.

The following screenshot shows using Remote Desktop Connection to connect to the apps (Instance 0) node in a Windows cluster:

![Remote Desktop Connection][sfmc-rdp-connect]

## ClientConnection and HttpGatewayConnection ports

### NSG rule: SFMC_AllowServiceFabricGatewayToSFRP

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

### NSG rule: SFMC_AllowServiceFabricGatewayPorts

This optional rule enables customers to access SFX, connect to the cluster using PowerShell, and use Service Fabric cluster API endpoints from the internet by opening LB ports for clientConnectionPort and httpGatewayPort.

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

## Modify default Load balancer configuration

### Load balancer ports

Service Fabric managed clusters creates an NSG rule in default priority range for all the load balancer (LB) ports configured under "loadBalancingRules" section under *ManagedCluster* properties. This rule opens LB ports for inbound traffic from the internet.  

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

Service Fabric managed clusters automatically creates load balancer probes for fabric gateway ports as well as all ports configured under the `loadBalancingRules` section of managed cluster properties.

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

<a id="multiplefrontends"></a>
### Multiple Frontends
Multiple frontends for Azure Load Balancer with subnets per node type and separate NSGs

To configure this feature:
1) Set the following property on a Service Fabric managed cluster resource.

```json
TBD
```

2) Deploy the template 

<a id="ipv6"></a>
## IPv6
By default managed clusters do not enable IPv6 to keep the configuration simple. This feature will enable full dual stack IPv4/IPv6 capability from the Load Balancer frontend to the backend resources. 
TODO:Talk about v4 and v6 ip's on Load Balancers and NSG differences.

[!NOTE]
> This setting cannot be changed once the cluster is created

1) Set the following property on a Service Fabric managed cluster resource.

```json
            "apiVersion": "2021-07-01-preview",
            "type": "Microsoft.ServiceFabric/managedclusters",
            ...
            "properties": {
                "enableIpv6": {
                "type": "true",
                },
            }
```

2) Deploy the template
TODO

<a id="existingvnet"></a>
## Existing virtual network
This feature allows customers to create dedicated subnet(s) in an existing virtual network the managed cluster will use for ip allocation needs. This can be useful if you already have a configured VNet and related security policies and want to leverage that.

When you setup a cluster to deploy in to an existing virtual network you can also:
* Bring your own Load balancer(s) for either private or public traffic
* Use a pre-configured Load Balancer static IP address
* Configure subnets per node type

[!NOTE]
> This setting cannot be changed once the cluster is created

In the following example, we start with an existing virtual network named ExistingRG-vnet, in the ExistingRG resource group. The subnet is named default. These default resources are created when you use the Azure portal to create a standard virtual machine (VM). You could create the virtual network and subnet without creating the VM, but the main goal of adding a cluster to an existing virtual network is to provide network connectivity to other VMs. Creating the VM gives a good example of how an existing virtual network typically is used. 


To configure this feature:
1) set the following property on a Service Fabric managed cluster resource.

```json
TBD
```

2) Deploy the template
TODO

<a id="byolb"></a>
## Bring your own Load Balancer
Managed clusters create a Load Balancer and fully qualified domain name with a static public IP from a dynamic pool of addresses as a frontdoor for both the primary and secondary node types. This feature allows you to directly create or re-use an Azure Load Balancer from an existing VNet. When you bring your own Azure Load Balancer you can:

* Use a pre-configured Load Balancer static IP address for either private or public traffic
* Leverage existing NSGs
* Maintain existing policies and controls you may have in place

[!NOTE]
> This setting cannot be changed once the cluster is created, or can it??

To configure the feature:
1) Your cluster must be setup to use an [existing virtual network](#existingvnet)

2) Set the following property on a Service Fabric managed cluster resource.

```json
TBD
```

3) Deploy the template
TODO



## Next steps

[Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)

[Service Fabric managed clusters overview](overview-managed-cluster.md)

<!--Image references-->
[Inbound-NAT-Rules]: ./media/how-to-managed-cluster-networking/inbound-nat-rules.png
[sfmc-rdp-connect]: ./media/how-to-managed-cluster-networking/sfmc-rdp-connect.png

