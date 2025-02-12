---
title: Azure Load Balancer Floating IP configuration
description: Overview of Azure Load Balancer Floating IP.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 06/11/2024
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Azure Load Balancer Floating IP configuration

Load balancer provides several capabilities for both UDP and TCP applications.

## Floating IP

Some application scenarios prefer or require the use of the same port by multiple application instances on a single VM in the backend pool. Common examples of port reuse include clustering for high availability, network virtual appliances, and exposing multiple TLS endpoints without re-encryption. If you want to reuse the backend port across multiple rules, you must enable Floating IP in the rule definition. Enabling Floating IP allows for more flexibility. 

| Floating IP status | Outcome |
| --- | --- | 
| Floating IP enabled | Azure changes the IP address mapping to the Frontend IP address of the Load Balancer | 
| Floating IP disabled |  Azure exposes the VM instances' IP address |

In the diagrams, you see how IP address mapping works before and after enabling Floating IP:
:::image type="content" source="media/load-balancer-floating-ip/load-balancer-floating-ip-before.png" alt-text="This diagram shows network traffic through a load balancer before enabling Floating IP.":::

:::image type="content" source="media/load-balancer-floating-ip/load-balancer-floating-ip-after.png" alt-text="This diagram shows network traffic through a load balancer after enabling Floating IP.":::

You configure Floating IP on a Load Balancer rule via the Azure portal, REST API, CLI, PowerShell, or other client. In addition to the rule configuration, you must also configure your virtual machine's Guest OS in order to use Floating IP.

:::image type="content" source="media/load-balancer-floating-ip/load-balancer-multivip-dsr.png" alt-text="Diagram of load balancer traffic for multiple frontend IPs with floating IP.":::

For this scenario, every VM in the backend pool has three network interfaces:

* Backend IP: a Virtual NIC associated with the VM (IP configuration of Azure's NIC resource).
* Frontend 1 (FIP1): a loopback interface within guest OS that is configured with IP address of FIP1.
* Frontend 2 (FIP2): a loopback interface within guest OS that is configured with IP address of FIP2.

Let's assume the same frontend configuration as in the previous scenario:

| Frontend | IP address | protocol | port |
| --- | --- | --- | --- |
| ![green frontend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) 1 |65.52.0.1 |TCP |80 |
| ![purple frontend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) 2 |*65.52.0.2* |TCP |80 |

We define two floating IP rules:

| Rule | Frontend | Map to backend pool |
| --- | --- | --- |
| 1 |![green rule](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) FIP1:80 |![green backend](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) FIP1:80 (in VM1 and VM2) |
| 2 |![purple rule](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) FIP2:80 |![purple backend](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) FIP2:80 (in VM1 and VM2) |

The following table shows the complete mapping in the load balancer:

| Rule | Frontend IP address | protocol | port | Destination | port |
| --- | --- | --- | --- | --- | --- |
| ![green rule](./media/load-balancer-multivip-overview/load-balancer-rule-green.png) 1 |65.52.0.1 |TCP |80 |same as frontend (65.52.0.1) |same as frontend (80) |
| ![purple rule](./media/load-balancer-multivip-overview/load-balancer-rule-purple.png) 2 |65.52.0.2 |TCP |80 |same as frontend (65.52.0.2) |same as frontend (80) |

The destination of the inbound flow is now the frontend IP address on the loopback interface in the VM. Each rule must produce a flow with a unique combination of destination IP address and destination port. Port reuse is possible on the same VM by varying the destination IP address to the frontend IP address of the flow. Your service is exposed to the load balancer by binding it to the frontend’s IP address and port of the respective loopback interface. 

You notice the destination port doesn't change in the example. In floating IP scenarios, Azure Load Balancer also supports defining a load balancing rule to change the backend destination port and to make it different from the frontend destination port.

The Floating IP rule type is the foundation of several load balancer configuration patterns. One example that is currently available is the [Configure one or more Always On availability group listeners](/azure/azure-sql/virtual-machines/windows/availability-group-listener-powershell-configure) configuration. Over time, we'll document more of these scenarios. For more detailed information on the specific Guest OS configurations required to enable Floating IP, please refer to [Azure Load Balancer Floating IP configuration](load-balancer-floating-ip.md) in the next section.

## Floating IP Guest OS configuration

In order to function, you configure the Guest OS for the virtual machine to receive all traffic bound for the frontend IP and port of the load balancer. Configuring the VM requires:
* adding a loopback network interface
* configuring the loopback with the frontend IP address of the load balancer
* ensuring the system can send/receive packets on interfaces that don't have the IP address assigned to that interface. Windows systems require setting interfaces to use the "weak host" model. For Linux systems, this model is normally used by default.
* configuring the host firewall to allow traffic on the frontend IP port.

> [!NOTE]
> The examples below all use IPv4; to use IPv6, substitute "ipv6" for "ipv4".

### Windows Server

<details>
  <summary>Expand</summary>

For each VM in the backend pool, run the following commands at a Windows Command Prompt on the server.  

To get the list of interface names you have on your VM, type this command:

```console
netsh interface ipv4 show interface 
```

For the VM NIC (Azure managed), type this command.

```console
netsh interface ipv4 set interface "interfacename" weakhostreceive=enabled
```
(replace **"interfacename"** with the name of this interface)

For each loopback interface you added, repeat these commands:

```console
netsh interface ipv4 add addr "loopbackinterfacename" floatingip floatingipnetmask
netsh interface ipv4 set interface "loopbackinterfacename" weakhostreceive=enabled  weakhostsend=enabled 
```
(replace **loopbackinterfacename** with the name of this loopback interface and **floatingip** and **floatingipnetmask** with the appropriate values that correspond to the load balancer frontend IP) 

Finally, if the guest host uses a firewall, ensure a rule set up so the traffic can reach the VM on the appropriate ports.

This example configuration assumes a load balancer frontend IP configuration of 1.2.3.4 and a load balancing rule for port 80:

```console
netsh int ipv4 set int "Ethernet" weakhostreceive=enabled
netsh int ipv4 add addr "Loopback Pseudo-Interface 1" 1.2.3.4 255.255.255.0
netsh int ipv4 set int "Loopback Pseudo-Interface 1" weakhostreceive=enabled weakhostsend=enabled
netsh advfirewall firewall add rule name="http" protocol=TCP localport=80 dir=in action=allow enable=yes
```
</details>

### Ubuntu

<details>
  <summary>Expand</summary>

For each VM in the backend pool, run the following commands via an SSH session.

To get the list of interface names you have on your VM, type this command:

```console
ip addr
```
For each loopback interface, repeat these commands, which assign the floating IP to the loopback alias:

```console
sudo ip addr add floatingip/floatingipnetmask dev lo:0
```
(replace **floatingip** and **floatingipnetmask** with the appropriate values that correspond to the load balancer frontend IP) 

Finally, if the guest host uses a firewall, ensure a rule set up so the traffic can reach the VM on the appropriate ports.

This example configuration assumes a load balancer frontend IP configuration of 1.2.3.4 and a load balancing rule for port 80.  This example also assumes the use of [UFW (Uncomplicated Firewall)](https://www.wikipedia.org/wiki/Uncomplicated_Firewall) in Ubuntu.

```console
sudo ip addr add 1.2.3.4/24 dev lo:0
sudo ufw allow 80/tcp
```
</details>

## <a name = "limitations"></a>Limitations 

-  With Floating IP enabled on a load balancing rule, your application must use the primary IP configuration of the network interface for outbound.
-  If your application binds to the frontend IP address configured on the loopback interface in the guest OS, Azure's outbound won't rewrite the outbound flow, and the flow fails. Review [outbound scenarios](load-balancer-outbound-connections.md).
- You can't use Floating IP on secondary IP configurations for Load Balancing scenarios. This limitation doesn't apply to Public load balancers where the secondary IP configuration is IPv6 an part of a dual-stack configuration or to architectures that utilize a NAT Gateway for outbound connectivity.

## Next steps

- Learn about [using multiple frontends](load-balancer-multivip-overview.md) with Azure Load Balancer.
- Learn about [Azure Load Balancer outbound connections](load-balancer-outbound-connections.md).
