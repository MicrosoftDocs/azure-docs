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

Public IP addresses allow Internet resources to communicate inbound to private cloud resources that are at a private IP address. The public IP address is dedicated to the private IP address until you unassign it. The public IP address allows you to expose services running on your private cloud to the Internet. The internal private IP address that the public IP address is assigned to can be a virtual machine or a software load balancer running on your private cloud vCenter.

A resource associated with a public IP address always uses the public IP address for internet access.  By default, only outbound internet access is allowed on a public IP address.  Incoming traffic on the public IP address is denied.  To allow inbound traffic, create a firewall rule for the public IP address to the desired port.

A public IP address can only be assigned to one private IP address.

## Benefits

Distributed denial of service (DDoS) attack prevention is automatically enabled for the public IP address. Always-on traffic monitoring and real-time mitigation of common network-level attacks provide the same defenses used by Microsoft online services. The entire scale of the Azure global network can be used to distribute and mitigate attack traffic across regions.  

## Next steps

* Learn how to [Allocate a public IP address](https://docs.azure.cloudsimple.com/publicips/)