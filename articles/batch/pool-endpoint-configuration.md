---
title: Configure node endpoints in Azure Batch pool
description: How to configure node endpoints such as access to SSH or RDP ports on compute nodes in an Azure Batch pool.
ms.topic: how-to
ms.date: 05/19/2026
# Customer intent: As an IT administrator, I want to configure remote access endpoints for compute nodes in an Azure Batch pool, so that I can control external connectivity while ensuring security and compliance in my environment.
---

# Configure remote access to compute nodes in an Azure Batch pool

If configured, you can allow a [node user](/rest/api/batchservice/nodes/create-node-user) with network connectivity to connect
externally to a compute node in a Batch pool. For example, a user can connect by Remote Desktop (RDP) on port 3389 to a
compute node in a Windows pool. Similarly, by default, a user can connect by Secure Shell (SSH) on port 22 to a compute
node in a Linux pool.

> [!NOTE]
> As of API version `2024-07-01` (and all pools created after **30 November 2025** regardless of API version), Batch no
> longer automatically maps common remote access ports for SSH and RDP. If you wish to allow remote access to your Batch
> compute nodes with pools created with API version `2024-07-01` or later (and after 30 November 2025), then you must
> manually configure the pool endpoint configuration to enable such access.

In your environment, you might need to enable, restrict, or disable external access settings or any other ports you wish
on the Batch pool. You can modify these settings by using the Batch APIs to set the
[NetworkConfiguration](/rest/api/batchmanagement/pool/create#networkconfiguration) property.

## Batch pool endpoint configuration

The endpoint configuration consists of one or more [network address translation (NAT) pools](/rest/api/batchmanagement/pool/create#inboundnatpool)
of frontend ports. Don't confuse a NAT pool with the Batch pool of compute nodes. You set up each NAT pool to override
the default connection settings on the pool's compute nodes.

Each NAT pool configuration includes one or more [network security group (NSG) rules](/rest/api/batchmanagement/pool/create#networksecuritygrouprule). Each NSG rule allows or denies certain network traffic to the endpoint. You can choose to allow or deny all traffic, traffic identified by a [service tag](../virtual-network/network-security-groups-overview.md#service-tags) (such as "Internet"), or traffic from specific IP addresses or subnets.

### Considerations

- The pool endpoint configuration is part of the pool's [network configuration](/rest/api/batchmanagement/pool/create#networkconfiguration). The network configuration can optionally include settings to join the pool to an [Azure virtual network](batch-virtual-network.md). If you set up the pool in a virtual network, you can create NSG rules that use address settings in the virtual network.
- You can configure multiple NSG rules when you configure a NAT pool. The rules are checked in the order of priority. Once a rule applies, no more rules are tested for matching.

## Example: Allow RDP traffic from a specific IP address

The following C# snippet shows how to configure the RDP endpoint on compute nodes in a Windows pool to allow RDP access only from IP address _198.168.100.7_. The second NSG rule denies traffic that doesn't match the IP address.

```C# Snippet:endpoint_config_basic
ArmClient armClient = new ArmClient(new DefaultAzureCredential());

        ResourceIdentifier batchAccountResourceId =
            BatchAccountResource.CreateResourceIdentifier("subscriptionId", "resourceGroupName", "accountName");
        BatchAccountResource batchAccount = armClient.GetBatchAccountResource(batchAccountResourceId);

        BatchAccountPoolCollection poolCollection = batchAccount.GetBatchAccountPools();

        BatchAccountPoolData poolData = new BatchAccountPoolData()
        {
            VmSize = "Standard_D2_v2",
            DeploymentConfiguration = new BatchDeploymentConfiguration()
            {
                VmConfiguration = new BatchVmConfiguration(
                    imageReference: new BatchImageReference()
                    {
                        Publisher = "canonical",
                        Offer = "0001-com-ubuntu-server-jammy",
                        Sku = "22_04-lts",
                        Version = "latest"
                    },
                    nodeAgentSkuId: "batch.node.ubuntu 22.04")
            },
            ScaleSettings = new BatchAccountPoolScaleSettings()
            {
                FixedScale = new BatchAccountFixedScaleSettings() { TargetDedicatedNodes = 2 }
            },
            NetworkConfiguration = new BatchNetworkConfiguration()
            {
                EndpointInboundNatPools =
                {
                    new BatchInboundNatPool(
                        name: "RDP",
                        protocol: BatchInboundEndpointProtocol.Tcp,
                        backendPort: 3389,
                        frontendPortRangeStart: 7500,
                        frontendPortRangeEnd: 8000)
                    {
                        NetworkSecurityGroupRules =
                        {
                            new BatchNetworkSecurityGroupRule(
                                priority: 179,
                                access: BatchNetworkSecurityGroupRuleAccess.Allow,
                                sourceAddressPrefix: "198.168.100.7"),
                            new BatchNetworkSecurityGroupRule(
                                priority: 180,
                                access: BatchNetworkSecurityGroupRuleAccess.Deny,
                                sourceAddressPrefix: "*")
                        }
                    }
                }
            }
        };

        ArmOperation<BatchAccountPoolResource> pool = await poolCollection.CreateOrUpdateAsync(
            WaitUntil.Completed, "myPool", poolData);
```

## Example: Allow SSH traffic from a specific subnet

The following Python snippet shows how to configure the SSH endpoint on compute nodes in a Linux pool to allow access only from the subnet _192.168.1.0/24_. The second NSG rule denies traffic that doesn't match the subnet.

```python Snippet:endpoint_config_allow_subnet_python
from azure.batch import models

class AzureBatch(object):
    def set_ports_pool(self, **kwargs):
        pool.network_configuration = models.NetworkConfiguration(
            endpoint_configuration=models.BatchPoolEndpointConfiguration(
                inbound_nat_pools=[models.BatchInboundNatPool(
                    name='SSH',
                    protocol=models.InboundEndpointProtocol.TCP,
                    backend_port=22,
                    frontend_port_range_start=4000,
                    frontend_port_range_end=4100,
                    network_security_group_rules=[
                        models.NetworkSecurityGroupRule(
                            priority=170,
                            access=models.NetworkSecurityGroupRuleAccess.ALLOW,
                            source_address_prefix='192.168.1.0/24'
                        ),
                        models.NetworkSecurityGroupRule(
                            priority=175,
                            access=models.NetworkSecurityGroupRuleAccess.DENY,
                            source_address_prefix='*'
                        )
                    ]
                )
                ]
            )
        )
    ),
    network_configuration=batchmodels.NetworkConfiguration(
        endpoint_configuration=batchmodels.PoolEndpointConfiguration(
            inbound_nat_pools=[batchmodels.InboundNatPool(
                name='SSH',
                protocol=batchmodels.InboundEndpointProtocol.TCP,
                backend_port=22,
                frontend_port_range_start=4000,
                frontend_port_range_end=4100,
                network_security_group_rules=[
                    batchmodels.NetworkSecurityGroupRule(
                        priority=170,
                        access=batchmodels.NetworkSecurityGroupRuleAccess.ALLOW,
                        source_address_prefix='192.168.1.0/24'
                    ),
                    batchmodels.NetworkSecurityGroupRule(
                        priority=175,
                        access=batchmodels.NetworkSecurityGroupRuleAccess.DENY,
                        source_address_prefix='*'
                    )
                ]
            )]
        )
    )
)

result = client.pool.create(
    resource_group_name=resource_group_name,
    account_name=account_name,
    pool_name=pool_name,
    parameters=pool_parameters
)

print(f"Pool '{result.name}' created successfully.")
```

## Example: Deny all RDP traffic

The following C# snippet shows how to configure the RDP endpoint on compute nodes in a Windows pool to deny all network traffic. The endpoint uses a frontend pool of ports in the range _60000 - 60099_.

> [!NOTE]
> As of Batch API version `2024-07-01`, port 3389 typically associated with RDP is no longer mapped by default.
> Creating an explicit deny rule is no longer required if access is not needed from the Internet for Batch pools
> created with this API version or later. You may still need to specify explicit deny rules to restrict access
> from other sources.

```C# Snippet:endpoint_config_restrictive
ArmClient armClient = new ArmClient(new DefaultAzureCredential());

        ResourceIdentifier batchAccountResourceId =
            BatchAccountResource.CreateResourceIdentifier("subscriptionId", "resourceGroupName", "accountName");
        BatchAccountResource batchAccount = armClient.GetBatchAccountResource(batchAccountResourceId);

        BatchAccountPoolCollection poolCollection = batchAccount.GetBatchAccountPools();

        BatchAccountPoolData poolData = new BatchAccountPoolData()
        {
            VmSize = "Standard_D2_v2",
            DeploymentConfiguration = new BatchDeploymentConfiguration()
            {
                VmConfiguration = new BatchVmConfiguration(
                    imageReference: new BatchImageReference()
                    {
                        Publisher = "canonical",
                        Offer = "0001-com-ubuntu-server-jammy",
                        Sku = "22_04-lts",
                        Version = "latest"
                    },
                    nodeAgentSkuId: "batch.node.ubuntu 22.04")
            },
            ScaleSettings = new BatchAccountPoolScaleSettings()
            {
                FixedScale = new BatchAccountFixedScaleSettings() { TargetDedicatedNodes = 2 }
            },
            NetworkConfiguration = new BatchNetworkConfiguration()
            {
                EndpointInboundNatPools =
                {
                    new BatchInboundNatPool(
                        name: "RDP",
                        protocol: BatchInboundEndpointProtocol.Tcp,
                        backendPort: 3389,
                        frontendPortRangeStart: 60000,
                        frontendPortRangeEnd: 60099)
                    {
                        NetworkSecurityGroupRules =
                        {
                            new BatchNetworkSecurityGroupRule(
                                priority: 162,
                                access: BatchNetworkSecurityGroupRuleAccess.Deny,
                                sourceAddressPrefix: "*")
                        }
                    }
                }
            }
        };

        ArmOperation<BatchAccountPoolResource> pool = await poolCollection.CreateOrUpdateAsync(
            WaitUntil.Completed, "myPool", poolData);
```

## Example: Deny all SSH traffic from the internet

The following Python snippet shows how to configure the SSH endpoint on compute nodes in a Linux pool to deny all internet traffic. The endpoint uses a frontend pool of ports in the range _4000 - 4100_.

> [!NOTE]
> As of Batch API version `2024-07-01`, port 22 typically associated with SSH is no longer mapped by default.
> Creating an explicit deny rule is no longer required if access is not needed from the Internet for Batch pools
> created with this API version or later. You may still need to specify explicit deny rules to restrict access
> from other sources.

```python Snippet:endpoint_config_deny_ssh_python
from azure.batch import models

class AzureBatch(object):
    def set_ports_pool(self, **kwargs):
        pool.network_configuration = models.NetworkConfiguration(
            endpoint_configuration=models.BatchPoolEndpointConfiguration(
                inbound_nat_pools=[models.BatchInboundNatPool(
                    name='SSH',
                    protocol=models.InboundEndpointProtocol.TCP,
                    backend_port=22,
                    frontend_port_range_start=4000,
                    frontend_port_range_end=4100,
                    network_security_group_rules=[
                        models.NetworkSecurityGroupRule(
                            priority=170,
                            access=models.NetworkSecurityGroupRuleAccess.DENY,
                            source_address_prefix='Internet'
                        )
                    ]
                )
                ]
            )
        )
    ),
    network_configuration=batchmodels.NetworkConfiguration(
        endpoint_configuration=batchmodels.PoolEndpointConfiguration(
            inbound_nat_pools=[batchmodels.InboundNatPool(
                name='SSH',
                protocol=batchmodels.InboundEndpointProtocol.TCP,
                backend_port=22,
                frontend_port_range_start=4000,
                frontend_port_range_end=4100,
                network_security_group_rules=[
                    batchmodels.NetworkSecurityGroupRule(
                        priority=170,
                        access=batchmodels.NetworkSecurityGroupRuleAccess.DENY,
                        source_address_prefix='Internet'
                    )
                ]
            )]
        )
    )
)

result = client.pool.create(
    resource_group_name=resource_group_name,
    account_name=account_name,
    pool_name=pool_name,
    parameters=pool_parameters
)

print(f"Pool '{result.name}' created successfully.")
```

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn more about NSG rules in Azure with [Filtering network traffic with network security groups](../virtual-network/network-security-groups-overview.md).
