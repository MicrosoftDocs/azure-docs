---
title: Azure Load Balancer overview | Microsoft Docs
description: Overview of Azure Load Balancer features, architecture, and implementation. Learn how the load balancer works and leverage it in the cloud.
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: ''

ms.assetid: 0f313dc0-f007-4cee-b2b9-f542357925a3
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: kumud
---

# Azure Load Balancer overview

Azure Load Balancer delivers high availability and network performance to your applications. It is a Layer 4 (TCP, UDP) load balancer that distributes incoming traffic among healthy instances of services defined in a load-balanced set.

[!INCLUDE [load-balancer-basic-sku-include.md](../../includes/load-balancer-basic-sku-include.md)]

Azure Load Balancer can be configured to:

* Load balance incoming Internet traffic to virtual machines. This configuration is known as [Internet-facing load balancing](load-balancer-internet-overview.md).
* Load balance traffic between virtual machines in a virtual network, between virtual machines in cloud services, or between on-premises computers and virtual machines in a cross-premises virtual network. This configuration is known as [internal load balancing](load-balancer-internal-overview.md).
* Forward external traffic to a specific virtual machine.

All resources in the cloud need a public IP address to be reachable from the Internet. The cloud infrastructure in Azure uses non-routable IP addresses for its resources. Azure uses network address translation (NAT) with public IP addresses to communicate to the Internet.

## Load Balancer features

* Hash-based distribution

    Azure Load Balancer uses a hash-based distribution algorithm. By default, it uses a 5-tuple hash composed of source IP, source port, destination IP, destination port, and protocol type to map traffic to available servers. It provides stickiness only *within* a transport session. Packets in the same TCP or UDP session will be directed to the same instance behind the load-balanced endpoint. When the client closes and reopens the connection or starts a new session from the same source IP, the source port changes. This may cause the traffic to go to a different endpoint in a different datacenter.

    For more details, see [Load balancer distribution mode](load-balancer-distribution-mode.md). The following graphic shows the hash-based distribution:

    ![Hash-based distribution](./media/load-balancer-overview/load-balancer-distribution.png)

    Figure - Hash based distribution

* Port forwarding

    Azure Load Balancer gives you control over how inbound communication is managed. This communication includes traffic initiated from Internet hosts, virtual machines in other cloud services, or virtual networks. This control is represented by an endpoint (also called an input endpoint).

    An input endpoint listens on a public port and forwards traffic to an internal port. You can map the same ports for an internal or external endpoint or use a different port for them. For example, you can have a web server configured to listen to port 81 while the public endpoint mapping is port 80. The creation of a public endpoint triggers the creation of a load balancer instance.

    When created using the Azure portal, the portal automatically creates endpoints to the virtual machine for the Remote Desktop Protocol (RDP) and remote Windows PowerShell session traffic. You can use these endpoints to remotely administer the virtual machine over the Internet.

* Automatic reconfiguration

    Azure Load Balancer instantly reconfigures itself when you scale instances up or down. For example, this reconfiguration happens when you increase the instance count for web/worker roles in a cloud service or when you add additional virtual machines into the same load-balanced set.

* Service monitoring

    Azure Load Balancer can probe the health of the various server instances. When a probe fails to respond, the load balancer stops sending new connections to the unhealthy instances. Existing connections are not impacted.

    Three types of probes are supported:

    + **Guest agent probe (on Platform as a Service Virtual Machines only):** The load balancer utilizes the guest agent inside the virtual machine. The guest agent listens and responds with an HTTP 200 OK response only when the instance is in the ready state (i.e. the instance is not in a state like busy, recycling, or stopping). If the agent fails to respond with an HTTP 200 OK, the load balancer marks the instance as unresponsive and stops sending traffic to that instance. The load balancer continues to ping the instance. If the guest agent responds with an HTTP 200, the load balancer will send traffic to that instance again. When you're using a web role, your website code typically runs in w3wp.exe, which is not monitored by the Azure fabric or guest agent. This means that failures in w3wp.exe (e.g. HTTP 500 responses) will not be reported to the guest agent, and the load balancer will not know to take that instance out of rotation.
    + **HTTP custom probe:** This probe overrides the default (guest agent) probe. You can use it to create your own custom logic to determine the health of the role instance. The load balancer will regularly probe your endpoint (every 15 seconds, by default). The instance is considered to be in rotation if it responds with a TCP ACK or HTTP 200 within the timeout period (default of 31 seconds). This is useful for implementing your own logic to remove instances from the load balancer's rotation. For example, you can configure the instance to return a non-200 status if the instance is above 90% CPU. For web roles that use w3wp.exe, you also get automatic monitoring of your website, since failures in your website code return a non-200 status to the probe.
    + **TCP custom probe:** This probe relies on successful TCP session establishment to a defined probe port.

    For more information, see the [LoadBalancerProbe schema](https://msdn.microsoft.com/library/azure/jj151530.aspx).

* Source NAT

    All outbound traffic to the Internet that originates from your service undergoes source NAT (SNAT) by using the same VIP address as the incoming traffic. SNAT provides important benefits:

    + It enables easy upgrade and disaster recovery of services, since the VIP can be dynamically mapped to another instance of the service.
    + It makes access control list (ACL) management easier. ACLs expressed in terms of VIPs do not change as services scale up, down, or get redeployed.

    The load balancer configuration supports full cone NAT for UDP. Full cone NAT is a type of NAT where the port allows inbound connections from any external host (in response to an outbound request).

    For each new outbound connection that a virtual machine initiates, an outbound port is also allocated by the load balancer. The external host sees traffic with a virtual IP (VIP)-allocated port. For scenarios that require a large number of outbound connections, it is recommended to use [instance-level public IP](../virtual-network/virtual-networks-instance-level-public-ip.md) addresses so that the VMs have a dedicated outbound IP address for SNAT. This reduces the risk of port exhaustion.

    Please see [outbound connections](load-balancer-outbound-connections.md) article for more details on this topic.

### Support for multiple load-balanced IP addresses for virtual machines
You can assign more than one load-balanced public IP address to a set of virtual machines. With this ability, you can host multiple SSL websites and/or multiple SQL Server AlwaysOn Availability Group listeners on the same set of virtual machines. For more information, see [Multiple VIPs per cloud service](load-balancer-multivip.md).

[!INCLUDE [load-balancer-compare-tm-ag-lb-include.md](../../includes/load-balancer-compare-tm-ag-lb-include.md)]

## Limitations

Load Balancer backend pools can contain any VM SKU except Basic tier.

## Next steps

- Learn more about [Internet-facing load balancer](load-balancer-internet-overview.md)

- Learn more about [Internal load balancer overview](load-balancer-internal-overview.md)

- Create an [Internet-facing load balancer](load-balancer-get-started-internet-portal.md)

- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure

