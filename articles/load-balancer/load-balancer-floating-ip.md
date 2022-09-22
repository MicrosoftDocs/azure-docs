---
title: Azure Load Balancer Floating IP configuration
description: Overview of Azure Load Balancer Floating IP
services: load-balancer
documentationcenter: na
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/2/2021
ms.author: mbender

---

# Azure Load Balancer Floating IP configuration

Load balancer provides several capabilities for both UDP and TCP applications.

## Floating IP

Some application scenarios prefer or require the same port to be used by multiple application instances on a single VM in the backend pool. Common examples of port reuse include: 
- clustering for high availability
- network virtual appliances
- exposing multiple TLS endpoints without re-encryption. 

If you want to reuse the backend port across multiple rules, you must enable Floating IP in the rule definition.

When Floating IP is enabled, Azure changes the IP address mapping to the Frontend IP address of the Load Balancer frontend instead of backend instance's IP. Without Floating IP, Azure exposes the VM instances' IP. Enabling Floating IP changes the IP address mapping to the Frontend IP of the load Balancer to allow for more flexibility. Learn more [here](load-balancer-multivip-overview.md).

In the diagrams below, you see how IP address mapping works before and after enabling Floating IP:
:::image type="content" source="media/load-balancer-floating-ip/load-balancer-floating-ip-before.png" alt-text="This diagram shows network traffic through a load balancer before Floating IP is enabled.":::

:::image type="content" source="media/load-balancer-floating-ip/load-balancer-floating-ip-after.png" alt-text="This diagram shows network traffic through a load balancer after Floating IP is enabled.":::

Floating IP can be configured on a Load Balancer rule via the Azure portal, REST API, CLI, PowerShell, or other client. In addition to the rule configuration, you must also configure your virtual machine's Guest OS in order to use Floating IP.

## Floating IP Guest OS configuration

In order to function, the Guest OS for the virtual machine needs to be configured to receive all traffic bound for the frontend IP and port of the load balancer. To accomplish this requires:
* a loopback network interface to be added
* configuring the loopback with the frontend IP address of the load balancer
* ensure the system can send/receive packets on interfaces that don't have the IP address assigned to that interface (on Windows, this requires setting interfaces to use the "weak host" model; on Linux this model is normally used by default)
The host firewall also needs to be open to receiving traffic on the frontend IP port.

> [!NOTE]
> The examples below all use IPv4; to use IPv6, substitute "ipv6" for "ipv4".  Also note that Floating IP for IPv6 does not work for Internal Load Balancers.

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
netsh interface ipv4 set interface “interfacename” weakhostreceive=enabled
```
(replace **interfacename** with the name of this interface)

For each loopback interface you added, repeat the commands below.

```console
netsh interface ipv4 add addr "loopbackinterface" floatingip floatingipnetmask
netsh interface ipv4 set interface "loopbackinterface" weakhostreceive=enabled  weakhostsend=enabled 
```
(replace **loopbackinterface** with the name of this loopback interface and **floatingip** and **floatingipnetmask** with the appropriate values, e.g. that correspond to the load balancer frontend IP) 

Finally, if firewall is being used on the guest host, ensure a rule set up so the traffic can reach the VM on the appropriate ports.

A full example configuration is below (assuming a load balancer frontend IP configuration of 1.2.3.4 and a load balancing rule for port 80):

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
(replace **floatingip** and **floatingipnetmask** with the appropriate values, e.g. that correspond to the load balancer frontend IP) 

Finally, if firewall is being used on the guest host, ensure a rule set up so the traffic can reach the VM on the appropriate ports.

A full example configuration is below (assuming a load balancer frontend IP configuration of 1.2.3.4 and a load balancing rule for port 80).  This example also assumes the use of [UFW (Uncomplicated Firewall)](https://www.wikipedia.org/wiki/Uncomplicated_Firewall) in Ubuntu.

```console
sudo ip addr add 1.2.3.4/24 dev lo:0
sudo ufw allow 80/tcp
```
</details>

## <a name = "limitations"></a>Limitations

- Floating IP isn't currently supported on secondary IP configurations for Load Balancing scenarios.  This doesn't apply to Public load balancers with dual-stack configurations or to architectures that utilize a NAT Gateway for outbound connectivity.

## Next steps

- Learn about [using multiple frontends](load-balancer-multivip-overview.md) with Azure Load Balancer.
- Learn about [Azure Load Balancer outbound connections](load-balancer-outbound-connections.md).
