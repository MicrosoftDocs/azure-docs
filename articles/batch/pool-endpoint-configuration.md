---
title: Configure node endpoints in Azure Batch pool | Microsoft Docs
description: How to configure or disable access to SSH or RDP ports on compute nodes in an Azure Batch pool.
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.topic: article
ms.date: 02/06/2018
ms.author: danlep
---

# Configure or disable remote access to compute nodes in an Azure Batch pool

By default, a [node user](/rest/api/batchservice/computenode/adduser) can connect externally to a compute node in a Batch pool. For example, a user can make a Remote Desktop (RDP) connection on port 3389 to a compute node in a Windows pool. Similarly, by default, a user can make a Secure Shell (SSH) connection on port 22 to a compute node in a Linux pool. 

In your environment, you might need to restrict or disable these default external access settings. Modify these settings by using the Batch APIs to set the [PoolEndpointConfiguration](/rest/api/batchservice/pool/add#poolendpointconfiguration) property. 

## About the pool endpoint configuration
The endpoint configuration consists of one or more [network address translation (NAT) pools](/rest/api/batchservice/pool/add#inboundnatpool) of frontend ports. (Do not confuse a NAT pool with the Batch pool of compute nodes.) You set up each NAT pool to override the default SSH or RDP connection settings on the pool's compute nodes. 

Each NAT pool configuration includes one or more [network security group (NSG) rules](/rest/api/batchservice/pool/add#networksecuritygrouprule). Each NSG rule allows or denies certain network traffic to the endpoint. You have flexibility to allow or deny all traffic, traffic identified by a [default tag](../virtual-network/virtual-networks-nsg.md#default-tags) (such as "Internet"), or traffic from specific IP addresses or subnets.

> [!NOTE]
> The pool endpoint configuration is part of the pool's [network configuration](/rest/api/batchservice/pool/add#NetworkConfiguration). The network configuration can optionally include settings to join the pool to an [Azure virtual network](batch-virtual-network.md). If you set up the pool in a virtual network, you can create NSG rules that use address settings in the virtual network.
>


## Example: Deny all RDP traffic

The following C# snippet shows how to configure the RDP endpoint on compute nodes in a Windows pool to deny all network traffic. The endpoint uses a frontend pool of ports in the range *60000 - 60099*. This example includes a single NSG rule. You could include additional rules that are applied in priority order.

```csharp
pool.NetworkConfiguration = new NetworkConfiguration
{
    EndpointConfiguration = new PoolEndpointConfiguration(new InboundNatPool[]
    {
      new InboundNatPool("RDP", InboundEndpointProtocol.Tcp, 3389, 60000, 60099, new NetworkSecurityGroupRule[]
        {
            new NetworkSecurityGroupRule( NetworkSecurityGroupRuleAccess.Deny, 162, "*"),
        }),
    }    
};
```

## Example: Deny all SSH traffic

The following Python snippet shows how to configure the SSH endpoint on compute nodes in a Linux pool to deny all network traffic. The endpoint uses a frontend pool of ports in the range *4000 - 4100*. This example includes a single NSG rule. You could include additional rules that are applied in priority order.

```python
pool.network_configuration=batchmodels.NetworkConfiguration(
    endpoint_configuration=batchmodels.PoolEndpointConfiguration(
        inbound_nat_pools=[batchmodels.InboundNATPool(
            name='myNATpool',
            protocol='tcp',
            backend_port=22,
            frontend_port_range_start=4000,
            frontend_port_range_end=4100,
            network_security_group_rules=[batchmodels.NetworkSecurityGroupRule(
                priority=170,
                access=batchmodels.NetworkSecurityGroupRuleAccess.deny,
                source_address_prefix='*'
            )
            ]
        )
        ]
    ) 
)
```

## Example: Allow RDP traffic from a specific IP address

The following C# snippet shows how to configure the SSH endpoint on compute nodes in a Linux pool to allow RDP access only from IP address *198.51.100.7*:

```csharp
pool.NetworkConfiguration = new NetworkConfiguration
{
    EndpointConfiguration = new PoolEndpointConfiguration(new InboundNatPool[]
    {
      new InboundNatPool("RDP", InboundEndpointProtocol.Tcp, 3389, 7500, 8000, new NetworkSecurityGroupRule[]
        {
            new NetworkSecurityGroupRule( NetworkSecurityGroupRuleAccess.Allow, 168, "198.51.100.7"),
        }),
    }    
};
```

## Example: Allow SSH traffic from a specific subnet

The following Python snippet shows how to configure the SSH endpoint on compute nodes in a Linux pool to allow access only from the subnet *192.168.1.0/24*:

```python
pool.network_configuration=batchmodels.NetworkConfiguration(
    endpoint_configuration=batchmodels.PoolEndpointConfiguration(
        inbound_nat_pools=[batchmodels.InboundNATPool(
            name='myNATpool',
            protocol='tcp',
            backend_port=22,
            frontend_port_range_start=4000,
            frontend_port_range_end=4100,
            network_security_group_rules=[batchmodels.NetworkSecurityGroupRule(
                priority=170,
                access=batchmodels.NetworkSecurityGroupRuleAccess.allow,
                source_address_prefix='192.168.1.0/24'
            )
            ]
        )
        ]
    )
)
```

## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
- For more information about NSG rules in Azure, see [Filter network traffic with network security groups](../virtual-network/virtual-networks-nsg.md).
