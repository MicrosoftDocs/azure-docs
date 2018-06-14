# Network Security

Azure CycleCloud supports starting both Virtual Machines and Virtual Machine Scale Sets. Access to specific ports on nodes is limited by the network security groups associated with the virtual network settings.

## Public IP Addresses

A `network-interface` section can specify whether a node should receive a public IP by using either `AssociatePublicIpAddress` or `PublicIP`. If it is a return proxy, it will be assumed to have a public IP unless `AssociatePublicIpAddress` has been explicitly set to False. A public interface may be defined as:

      [[node master]]
      [[[network-interface eth0]]]
          AssociatePublicIpAddress = true

      [[nodearray execute]]
        [[[network-interface eth0]]]
          AssociatePublicIpAddress = true

        [[[input-endpoint SSH]]]
        PrivatePort = 22
        PublicPort = 10000

        [[[input-endpoint MyCustomPort]]]
        PrivatePort = 999
        PublicPort = 10999
        Protocol = tcp

The above configuration allows public access to the master node on ports as allowed by the Network Security Group for the Virtual Network. For the nodearray, `PublicPort` is the base port number for nodes in the array. The range of ports reserved for the nodearray is 500 per endpoint. Endpoints default to TCP protocol but UDP is also supported via `Protocol = UDP`. By default, the public IP address assigned to the node will be dynamic and will change each time the cluster is started. To have a statically-assigned public IP address for your node, add `PublicIP` to the network interface configuration for the primary interface:

      [[node master]]
      [[network-interface eth0]]
          AssociatePublicIpAddress = true
          PublicDnsLabel = myuniquename

will yield a statically-assigned public IP address for the node in the form of `myuniquename.eastus.cloudapp.azure.com`

To use a manually-created public IP, set `PublicIP` in your cluster template to an Azure public IP ID:

      [[[network-interface eth0]]]
      PublicIp = /subscriptions/ccf0d6be-5afa-46ca-bf59-9946255f74e6/resourceGroups/hpc-production/providers/Microsoft.Network/publicIPAddresses/licensing-addr

For return proxy nodes, if `AssociatePublicIpAddress` has no been specified, a public IP address will be created automatically. If `AssociatePublicIpAddress` has been set to **False**, the node will fail with a warning and no auto-nsg will be created for the node.

>[!NOTE]
> Once a node has been started with `AssociatePublicIpAddress`, it will retain that IP until the node or cluster is removed.

## Input Endpoints

Azure CycleCloud creates a Network Security Group that only allows incoming traffic from the internet to specific ports referenced in the input-endpoints section of the node configuration. If no input-endpoints configuration is specified, only ssh (22) for Linux nodes or RDP (3389) for Windows nodes will be allowed. To allow a specific port, set it as the `PublicPort` in your configuration or use a common name (ssh, RDP, etc).

## Network Security Groups

If a node has an interface with a public IP, the node will also receive a network security group. This can be specified by `SecurityGroup`, or, if that is omitted, it will be automatically generated from the `input-endpoints` sections on the node. `SecurityGroup` specified for an interface will override the auto-nsg created for input-endpoints. Unless a specific `SecurityGroup` is specified, all interfaces will get the auto-nsg from the input-endpoint definitions.

## Public DNS Label

Adding `PublicDnsLabel` to a public network interface will allow you to customize the DNS name for that IP address.

## Private IP Addresses

By default, virtual machines will receive a dynamically-assigned private IP address in Azure. In certain circumstances, it's necessary or desirable for nodes to have fixed private IP addresses. To accomplish this, use the following configuration for the network-interface section of your cluster configuration:

      [[[network-interface eth0]]]
      PrivateIp = x.x.x.x

Note that the private IP address specified must be valid for the associated subnet. Azure reserves the first four and last IPs in the subnet. These addresses cannot be manually assigned to a node.
