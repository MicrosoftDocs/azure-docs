---
title: Internet facing load balancer overview | Microsoft Docs
description: Overview for Internet facing load balancer and its features. How a load balancer works for Azure using virtual machines and cloud services.
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: tysonn

ms.assetid: 529b37aa-a45c-41d1-8877-fee8cc1fa375
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/24/2016
ms.author: kumud
---

# Internet facing load balancer overview

Azure load balancer maps the public IP address and port number of incoming traffic to the private IP address and port number of the virtual machine and vice versa for the response traffic from the virtual machine. Load balancing rules allow you to distribute specific types of traffic between multiple virtual machines or services. For example, you can spread the load of web request traffic across multiple web servers or web roles.

For a cloud service that contains instances of web roles or worker roles, you can define a public endpoint in the service definition (.csdef) file.

The *servicedefinition.csdef* file contains the endpoint configuration and when you have multiple role instances for a web or worker role deployment, the load balancer will be setup for it. The way to add instances to your cloud deployment is changing the instance count on the service configuration file (.csfg).

The following figure shows a load-balanced endpoint for web traffic that is shared among three virtual machines for the public and private TCP port of 80. These three virtual machines are in a load-balanced set.

![public load balancer example](./media/load-balancer-internet-overview/IC727496.png))

Figure 1 - Load-balanced endpoint for web traffic

When Internet clients send web page requests to the public IP address of the cloud service on TCP port 80, the Azure Load Balancer distributes the requests between the three virtual machines in the load-balanced set. For more information about load balancer algorithms, see the [load balancer overview page](load-balancer-overview.md#load-balancer-features).

By default, Azure Load Balancer distributes network traffic equally among multiple virtual machine instances. You can also configure session affinity, For more information, see [load balancer distribution mode](load-balancer-distribution-mode.md).

## Next steps

Learn about [Internal load balancer](load-balancer-internal-overview.md) to better understand which load balancer is a better fit for your cloud deployment.

You can also [get started creating an Internet facing load balancer](load-balancer-get-started-internet-arm-ps.md) and configure what type of [distribution mode](load-balancer-distribution-mode.md) for an specific load balancer network traffic behavior.

If your application needs to keep connections alive for servers behind a load balancer, you can understand more about [idle TCP timeout settings for a load balancer](load-balancer-tcp-idle-timeout.md). It will help to learn about idle connection behavior when you are using Azure Load Balancer.
