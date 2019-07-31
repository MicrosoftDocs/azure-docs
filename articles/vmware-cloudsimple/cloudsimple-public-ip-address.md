---
title: VMware Solution by CloudSimple - Azure Public IP address  
description: Learn about public IP addresses and their benefits on VMware Solution by CloudSimple 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple public IP address overview

A public IP address allows internet resources to communicate inbound, to private cloud resources at a private IP address. The private IP address is either a virtual machine or a software load balancer. The private IP address is on your private cloud vCenter. The public IP address allows you to expose services running on your private cloud to the internet.

The public IP address is dedicated to the private IP address until you unassign it. A public IP address can only be assigned to one private IP address.

A resource associated with a public IP address always uses the public IP address for internet access. By default, only outbound internet access is allowed on a public IP address.  Incoming traffic on the public IP address is denied.  To allow inbound traffic, create a firewall rule for the public IP address to the specific port.

## Benefits

Using a public IP address to communicate inbound provides:

* Distributed denial of service (DDoS) attack prevention. This protection is automatically enabled for the public IP address.
* Always-on traffic monitoring and real-time mitigation of common network-level attacks. These defenses are the same defenses used by Microsoft online services.
* The entire scale of the Azure global network. The network can be used to distribute and mitigate attack traffic across regions.  

## Next steps

* Learn how to [Allocate a public IP address](https://docs.azure.cloudsimple.com/public-ips/)
