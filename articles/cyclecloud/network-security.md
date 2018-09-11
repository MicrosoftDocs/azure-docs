---
title: Azure CycleCloud Network Security Options | Microsoft Docs
description: Configure your network to work with Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---
# Network Security

Azure CycleCloud supports starting both Virtual Machines and Virtual Machine Scale Sets. Access to specific ports on nodes is limited by the network security groups associated with the virtual network settings.

## Public IP Addresses

A `network-interface` section can specify whether a node should receive a public IP by using either `AssociatePublicIpAddress` or `PublicIP`. If it is a return proxy, it will be assumed to have a public IP unless `AssociatePublicIpAddress` has been explicitly set to False. A public interface may be defined as:

``` ini
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
```

The above configuration allows public access to the master node on ports as allowed by the Network Security Group for the Virtual Network. For the nodearray, `PublicPort` is the base port number for nodes in the array. The range of ports reserved for the nodearray is 500 per endpoint. Endpoints default to TCP protocol but UDP is also supported via `Protocol = UDP`. By default, the public IP address assigned to the node will be dynamic and will change each time the cluster is started. To have a statically-assigned public IP address for your node, add `PublicIP` to the network interface configuration for the primary interface:

``` ini
[[node master]]
[[network-interface eth0]]
    AssociatePublicIpAddress = true
    PublicDnsLabel = myuniquename
```

will yield a statically-assigned public IP address for the node in the form of `myuniquename.eastus.cloudapp.azure.com`

To use a manually-created public IP, set `PublicIP` in your cluster template to an Azure public IP ID:

``` ini
[[[network-interface eth0]]]
PublicIp = /subscriptions/ccf0d6be-5afa-46ca-bf59-9946255f74e6/resourceGroups/hpc-production/providers/Microsoft.Network/publicIPAddresses/licensing-addr
```

For return proxy nodes, if `AssociatePublicIpAddress` has no been specified, a public IP address will be created automatically. If `AssociatePublicIpAddress` has been set to **False**, the node will fail with a warning and no auto-nsg will be created for the node.

>[!NOTE]
> Once a node has been started with `AssociatePublicIpAddress`, it will retain that IP until the node or cluster is removed.

## Input Endpoints

Azure CycleCloud creates a Network Security Group that only allows incoming traffic from the internet to specific ports referenced in the input-endpoints section of the node configuration. If no input-endpoints configuration is specified, only SSH (22) for Linux nodes or RDP (3389) for Windows nodes will be allowed. To allow a specific port, set it as the `PublicPort` in your configuration or use a common name (SSH, RDP, etc).

## Network Security Groups

If a node has an interface with a public IP, the node will also receive a network security group. This can be specified by `SecurityGroup`, or, if that is omitted, it will be automatically generated from the `input-endpoints` sections on the node. `SecurityGroup` specified for an interface will override the auto-nsg created for input-endpoints. Unless a specific `SecurityGroup` is specified, all interfaces will get the auto-nsg from the input-endpoint definitions.

## Public DNS Label

Adding `PublicDnsLabel` to a public network interface will allow you to customize the DNS name for that IP address.

## Private IP Addresses

By default, virtual machines will receive a dynamically-assigned private IP address in Azure. In certain circumstances, it's necessary or desirable for nodes to have fixed private IP addresses. To accomplish this, use the following configuration for the network-interface section of your cluster configuration:

``` ini
[[[network-interface eth0]]]
PrivateIp = x.x.x.x
```

Note that the private IP address specified must be valid for the associated subnet. Azure reserves the first four and last IPs in the subnet. These addresses cannot be manually assigned to a node.

### Connecting Via the CLI

You can connect to an instance via a bastion server by specifying the IP address on the command line:

```azurecli-interactive
$ cyclecloud connect htcondor-master --bastion-host 1.1.1.1
```

The above command assumes _cyclecloud_ as the username, 22 as the port, and loads your
default SSH key. To customize these values, see the `--bastion-*` help options for the
`cyclecloud` command.

Alternately, the `cyclecloud` CLI can detect the bastion host for you if you add the following
directive to your _~/.cycle/config.ini_:

``` ini
[cyclecloud]
bastion_auto_detect = true
```

With the above directive, you can run `cyclecloud connect htcondor-master` without
specifying any details about the bastion server.

You can also use `cyclecloud connect` to connect a Windows instance. Executing the following
command will create an RDP connection over an SSH tunnel. Additionally, it will launch the
Microsoft RDP client on OS X and Windows:

```azurecli-interactive
$ cyclecloud connect windows-execute-1
```

> [!NOTE]
> CycleCloud chooses an unused ephemeral port for the tunnel to the Windows instance.

Additionally, you configure the `cyclecloud` command to use a single bastion host for all your connections:

``` ini
[cyclecloud]
bastion_host = 1.1.1.1
bastion_user = example_user
bastion_key = ~/.ssh/example_key.pem
bastion_port = 222
```

### Using Raw SSH Commands

You can connect to an internal server via the bastion server using agent forwarding:

```azurecli-interactive
ssh -A -t user@BASTION_SERVER_IP ssh -A root@TARGET_SERVER_IP
```

This connects to the bastion and then immediately runs ssh again, so you get a
terminal on the target instance. You may need to specify a user other than root
on the target instance if your cluster is configured differently. The -A
argument forwards the agent connection so your private key on your local machine
is used automatically. Note that agent forwarding is a chain, so the second ssh
command also includes -A so that any subsequent SSH connections initiated from
the target instance also use your local private key.

### Connecting to Services on the Target Instance

You can use the SSH connection to connect to services on the target
instance, such as a Remote Desktop, a database, etc. For example, if
the target instance is Windows, you can create a Remote Desktop tunnel
by connecting to the target instance with a similar SSH command from
above, using the -L argument:


```azurecli-interactive
ssh -A -t user@BASTION_SERVER_IP  -L 33890:TARGET:3389 ssh -A root@TARGET_SERVER_IP
```

This will tunnel port 3389 on target to 33890 on your local
machine. Then if you connect to `localhost:33890` you will actually
be connected to the target instance.
