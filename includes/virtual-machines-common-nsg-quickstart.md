---
 title: include file
 description: include file
 services: virtual-machines-windows
 author: cynthn
 ms.service: virtual-machines-windows
 ms.topic: include
 ms.date: 09/12/2018
 ms.author: cynthn
 ms.custom: include file

---

To open a port, or create an endpoint, to a virtual machine (VM) in Azure, create a network filter on a subnet or a VM network interface. You place these filters, which control both inbound and outbound traffic, on a network security group attached to the resource that receives the traffic.

The example in this article demonstrates how to create a network fiter that uses the the standard TCP port 80 (after you've started the appropriate services and open any OS firewall rules on the VM).

You can also [perform these steps by using Azure PowerShell](nsg-quickstart-powershell.md).

After you have a VM that is configured to serve web requests on the standard TCP port 80, you can:

1. Create a network security group.

2. Create an inbound security rule allowing traffic and assign values to the following settings:

   - **Destination port ranges**: 80

   - **Source port ranges**: * (allows any source port)

   - **Priority value**: Enter a value that is less than 65,500 and higher in priority than the default catch-all deny inbound rule.

3. Associate the network security group with the VM network interface or subnet.

Although this example uses a simple rule to allow HTTP traffic, you can also use network security groups and rules to create more complex network configurations. 




