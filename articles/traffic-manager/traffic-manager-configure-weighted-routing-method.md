---
title: Configure weighted round-robin traffic routing method using Azure Traffic Manager | Microsoft Docs
description: This article explains how to load balance traffic using a round-robin method in Traffic Manager
services: traffic-manager
documentationcenter: ''
author: asudbring
manager: twooley
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/20/2017
ms.author: allensu
---

# Configure the weighted traffic routing method in Traffic Manager

A common traffic routing method pattern is to provide a set of identical endpoints, which include cloud services and websites, and send traffic to each equally. The following steps outline how to configure this type of traffic routing method.

> [!NOTE]
> Azure Web App already provides round-robin load balancing functionality for websites within an Azure Region (which may comprise multiple datacenters). Traffic Manager allows you to distribute traffic across websites in different datacenters.

## To configure the weighted traffic routing method

1. From a browser, sign in to the [Azure portal](https://portal.azure.com). If you don’t already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free/). 
2. In the portal’s search bar, search for the **Traffic Manager profiles** and then click the profile name that you want to configure the routing method for.
3. In the **Traffic Manager profile** blade, verify that both the cloud services and websites that you want to include in your configuration are present.
4. In the **Settings** section, click **Configuration**, and in the **Configuration** blade, complete as follows:
    1. For **traffic routing method settings**, verify that the traffic routing method is **Weighted**. If it is not, click **Weighted** from the dropdown list.
    2. Set the **Endpoint monitor settings** identical for all every endpoint within this profile as follows:
        1. Select the appropriate **Protocol**, and specify the **Port** number. 
        2. For **Path** type a forward slash */*. To monitor endpoints, you must specify a path and filename. A forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default).
        3. At the top of the page, click **Save**.
5. Test the changes in your configuration as follows:
    1.	In the portal’s search bar, search for the Traffic Manager profile name and click the Traffic Manager profile in the results that the displayed.
    2.	In the **Traffic Manager** profile blade, click **Overview**.
    3.	The **Traffic Manager profile** blade displays the DNS name of your newly created Traffic Manager profile. This can be used by any clients (for example,by navigating to it using a web browser) to get routed to the right endpoint as determined by the routing type. In this case all requests are routed each endpoint in a round-robin fashion.
6. Once your Traffic Manager profile is working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name.

![Configuring weighted traffic routing method using Traffic Manager][1]

## Next steps

- Learn about [priority traffic routing method](traffic-manager-configure-priority-routing-method.md).
- Learn about [performance traffic routing method](traffic-manager-configure-performance-routing-method.md).
- Learn about [geographic routing method](traffic-manager-configure-geographic-routing-method.md).
- Learn how to [test Traffic Manager settings](traffic-manager-testing-settings.md).

<!--Image references-->
[1]: ./media/traffic-manager-weighted-routing-method/traffic-manager-weighted-routing-method.png
