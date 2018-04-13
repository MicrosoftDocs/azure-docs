---
 title: include file
 description: include file
 services: virtual-network
 author: genli
 ms.service: virtual-network
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: genli
 ms.custom: include file

---

## Scenario
To better illustrate how to create a VNet and subnets, this document will use the scenario below.

![VNet scenario](./media/virtual-networks-create-vnet-scenario-include/vnet-scenario.png)

In this scenario you will create a VNet named **TestVNet** with a reserved CIDR block of **192.168.0.0./16**. Your VNet will contain the following subnets: 

* **FrontEnd**, using **192.168.1.0/24** as its CIDR block.
* **BackEnd**, using **192.168.2.0/24** as its CIDR block.

