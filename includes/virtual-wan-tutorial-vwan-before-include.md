---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 09/12/2018
 ms.author: cherylmc
 ms.custom: include file
---

Verify that you have met the following criteria before beginning your configuration:

* If you already have a virtual network that you want to connect to, verify that none of the subnets of your on-premises network overlap with the virtual networks that you want to connect to. Your virtual network does not require a gateway subnet and cannot have any virtual network gateways. If you do not have a virtual network, you can create one using the steps in this article.
* Obtain an IP address range for your hub region. The hub is a virtual network and the address range that you specify for the hub region cannot overlap with any of your existing virtual networks that you connect to. It also cannot overlap with your address ranges that you connect to on premises. If you are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you.
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.