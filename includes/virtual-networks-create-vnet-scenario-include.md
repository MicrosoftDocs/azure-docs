---
 title: include file
 description: include file
 services: virtual-network
 author: genlin
 ms.service: virtual-network
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: genli
 ms.custom: include file

---

## Scenario

To illustrate how to create a VNet and subnets, this document uses the following scenario:

![VNet scenario](./media/virtual-networks-create-vnet-scenario-include/vnet-scenario.png)

In this scenario you create a VNet named **TestVNet**, with a reserved CIDR block of **192.168.0.0./16**. The VNet contains the following subnets: 

* **FrontEnd**, using **192.168.1.0/24** as its CIDR block.
* **BackEnd**, using **192.168.2.0/24** as its CIDR block.

