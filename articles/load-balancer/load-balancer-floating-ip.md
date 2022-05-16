---
title: Azure Load Balancer Floating IP configuration
description: Overview of Azure Load Balancer Floating IP
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/2/2021
ms.author: allensu

---

# Azure Load Balancer Floating IP configuration

Load balancer provides several capabilities for both UDP and TCP applications.

## Floating IP

Some application scenarios prefer or require the same port to be used by multiple application instances on a single VM in the backend pool. Common examples of port reuse include: 
- clustering for high availability
- network virtual appliances
- exposing multiple TLS endpoints without re-encryption. 

If you want to reuse the backend port across multiple rules, you must enable Floating IP in the rule definition.

When Floating IP is enabled, Azure changes the IP address mapping to the Frontend IP address of the Load Balancer frontend instead of backend instance's IP. 

Without Floating IP, Azure exposes the VM instances' IP. Enabling Floating IP changes the IP address mapping to the Frontend IP of the load Balancer to allow for additional flexibility. Learn more [here](load-balancer-multivip-overview.md).

Floating IP can be configured on a Load Balancer rule via the Azure portal, REST API, CLI, PowerShell, or other client. In addition to the rule configuration, you must also configure your virtual machine's Guest OS in order to leverage Floating IP.

## Floating IP Guest OS configuration
For each VM in the backend pool, run the following commands at a Windows Command Prompt.

To get the list of interface names you have on your VM, type this command:

```console
netsh interface show interface 
```

For the VM NIC (Azure managed), type this command:

```console
netsh interface ipv4 set interface “interfacename” weakhostreceive=enabled
```

(replace interfacename with the name of this interface)

For each loopback interface you added, repeat these commands:

```console
netsh interface ipv4 set interface “interfacename” weakhostreceive=enabled 
```

(replace interfacename with the name of this loopback interface)

```console
netsh interface ipv4 set interface “interfacename” weakhostsend=enabled 
```

(replace interfacename with the name of this loopback interface)

> [!IMPORTANT]
> The configuration of the loopback interfaces is performed within the guest OS. This configuration is not performed or managed by Azure. Without this configuration, the rules will not function.

## <a name = "limitations"></a>Limitations

- Floating IP is not currently supported on secondary IP configurations for Load Balancing scenarios.  Note that this does not apply to Public load balancers with dual-stack configurations or to architectures that utilize a NAT Gateway for outbound connectivity.

## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn about [Azure Load Balancer outbound connections](load-balancer-outbound-connections.md).
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn about [Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md).
- Learn more about [Network Security Groups](../virtual-network/network-security-groups-overview.md).
