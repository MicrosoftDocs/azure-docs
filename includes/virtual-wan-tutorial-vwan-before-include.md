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

Before you start your configuration, verify that you meet the following criteria:

* If you already have virtual network that you want to connect to, verify that none of the subnets of your on-premises network overlap with it. Your virtual network doesn't require a gateway subnet and can't have any virtual network gateways. If you don't have a virtual network, you can create one by using the steps in this article.
* Obtain an IP address range for your hub region. The hub is a virtual network, and the address range that you specify for the hub region can't overlap with an existing virtual network that you connect to. It also can't overlap with the address ranges that you connect to on-premises. If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.