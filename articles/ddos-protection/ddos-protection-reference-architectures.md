---
title: Azure DDoS Protection reference architectures
description: Learn Azure DDoS protection reference architectures.
services: ddos-protection
documentationcenter: na
author: aletheatoh
ms.service: ddos-protection
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/08/2020
ms.author: yitoh
---

# DDoS Protection reference architectures

DDoS Protection Standard is designed [for services that are deployed in a virtual network](../virtual-network/virtual-network-for-azure-services.md). For other services, the default DDoS Protection Basic service applies. The following reference architectures are arranged by scenarios, with architecture patterns grouped together.

## Virtual machine (Windows/Linux) workloads

### Application running on load-balanced VMs

This reference architecture shows a set of proven practices for running multiple Windows VMs in a scale set behind a load balancer, to improve availability and scalability. This architecture can be used for any stateless workload, such as a web server.

![Diagram of the reference architecture for an application running on load-balanced VMs](./media/ddos-best-practices/image-9.png)

In this architecture, a workload is distributed across multiple VM instances. There is a single public IP address, and internet traffic is distributed to the VMs through a load balancer. DDoS Protection Standard is enabled on the virtual network of the Azure (internet) load balancer that has the public IP associated with it.

The load balancer distributes incoming internet requests to the VM instances. Virtual machine scale sets allow the number of VMs to be scaled in or out manually, or automatically based on predefined rules. This is important if the resource is under DDoS attack. For more information on this reference architecture, see
[this article](/azure/architecture/reference-architectures/virtual-machines-windows/multi-vm).

### Application running on Windows N-tier

There are many ways to implement an N-tier architecture. The following diagram shows a typical three-tier web application. This architecture builds on the article [Run load-balanced VMs for scalability and availability](/azure/architecture/reference-architectures/virtual-machines-windows/multi-vm). The web and business tiers use load-balanced VMs.

![Diagram of the reference architecture for an application running on Windows N-tier](./media/ddos-best-practices/image-10.png)

In this architecture, DDoS Protection Standard is enabled on the virtual network. All public IPs in the virtual network get DDoS protection for Layer 3 and 4. For Layer 7 protection, deploy Application Gateway in the WAF SKU. For more information on this reference architecture, see 
[this article](/azure/architecture/reference-architectures/virtual-machines-windows/n-tier).

> [!NOTE]
> Scenarios in which a single VM is running behind a public IP are not supported.

### PaaS web application

This reference architecture shows running an Azure App Service application in a single region. This architecture shows a set of proven practices for a web application that uses [Azure App Service](https://azure.microsoft.com/documentation/services/app-service/) and [Azure SQL Database](https://azure.microsoft.com/documentation/services/sql-database/).
A standby region is set up for failover scenarios.

![Diagram of the reference architecture for a PaaS web application](./media/ddos-best-practices/image-11.png)

Azure Traffic Manager routes incoming requests to Application Gateway in one of the regions. During normal operations, it routes requests to Application Gateway in the active region. If that region becomes unavailable, Traffic Manager fails over to Application Gateway in the standby region.

All traffic from the internet destined to the web application is routed to the [Application Gateway public IP address](../application-gateway/application-gateway-web-app-overview.md) via Traffic Manager. In this scenario, the app service (web app) itself is not directly externally facing and is protected by Application Gateway. 

We recommend that you configure the Application Gateway WAF SKU (prevent mode) to help protect against Layer 7 (HTTP/HTTPS/WebSocket) attacks. Additionally, web apps are configured to [accept only traffic from the Application Gateway](https://azure.microsoft.com/blog/ip-and-domain-restrictions-for-windows-azure-web-sites/) IP address.

For more information about this reference architecture, see [this article](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

## Protecting on-premises resources

You can leverage the scale, capacity, and efficiency of Azure DDoS Protection Standard to protect your on-premises resources, by hosting a public IP address in Azure and redirecting the traffic to the backend origin to your on-premises environment.

![Protecting on-prem resources](./media/reference-architectures/ddos-on-prem.png)

If you have a web application that receives traffic from the Internet, you can host the web application behind Application Gateway, then protect it with WAF against Layer 7 web attacks such as SQL injection. The backend origins of your application will be in your on-premises environment, which is connected over the VPN. 

The backend resources in the on-premises environment will not be exposed to the public internet. Only the AppGW/WAF public IP is exposed to the internet and the DNS name of your application maps to that public IP address. 

When DDoS Protection Standard is enabled on the virtual network which contains the AppGW/WAF, DDoS Protection Standard will defend your application by mitigating bad traffic and routing the supposed clean traffic to your application. 

This [article](../azure-vmware/protect-azure-vmware-solution-with-application-gateway.md) shows you how you can use DDoS Protection Standard alongside Application Gateway to protect a web app running on Azure VMware Solution.

## Mitigation for non-web PaaS services

### HDInsight on Azure

This reference architecture shows configuring DDoS Protection Standard for an [Azure HDInsight cluster](../hdinsight/index.yml). Make sure that the HDInsight cluster is linked to a virtual network and that DDoS Protection is enabled on the virtual network.

!["HDInsight" and "Advanced settings" panes, with virtual network settings](./media/ddos-best-practices/image-12.png)

![Selection for enabling DDoS Protection](./media/ddos-best-practices/image-13.png)

In this architecture, traffic destined to the HDInsight cluster from the internet is routed to the public IP associated with the HDInsight gateway load balancer. The gateway load balancer then sends the traffic to the head nodes or the worker nodes directly. Because DDoS Protection Standard is enabled on the HDInsight virtual network, all public IPs in the virtual network get DDoS protection for Layer 3 and 4. This reference architecture can be combined with the N-Tier and multi-region reference architectures.

For more information on this reference architecture, see the [Extend Azure HDInsight using an Azure Virtual Network](../hdinsight/hdinsight-plan-virtual-network-deployment.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
documentation.


> [!NOTE]
> Azure App Service Environment for PowerApps or API management in a virtual network with a public IP are both not natively supported.

## Next steps

- Learn how to [create a DDoS protection plan](manage-ddos-protection.md).
