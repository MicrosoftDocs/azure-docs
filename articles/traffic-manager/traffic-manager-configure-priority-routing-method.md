---
title: Tutorial - Configure priority traffic routing with Azure Traffic Manager
description: This tutorial explains how to configure the priority traffic routing method in Traffic Manager
services: traffic-manager
documentationcenter: ''
author: rohinkoul
ms.service: traffic-manager
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/20/2017
ms.author: rohink
---

# Tutorial: Configure priority traffic routing method in Traffic Manager

Regardless of the website mode, Azure Websites already provide failover functionality for websites within a datacenter (also known as a region). Traffic Manager provides failover for websites in different datacenters.

A common pattern for service failover is to send traffic to a primary service and provide a set of identical backup services for failover. The following steps explain how to configure this prioritized failover with Azure cloud services and websites:

## To configure the priority traffic routing method

1. From a browser, sign in to the [Azure portal](https://portal.azure.com). If you don’t already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free/). 
2. In the portal’s search bar, search for the **Traffic Manager profiles** and then click the profile name that you want to configure the routing method for.
3. In the **Traffic Manager profile** blade, verify that both the cloud services and websites that you want to include in your configuration are present.
4. In the **Settings** section, click **Configuration**, and in the **Configuration** blade, complete as follows:
    1. For **traffic routing method settings**, verify that the traffic routing method is **Priority**. If it is not, click **Priority** from the dropdown list.
    2. Set the **Endpoint monitor settings** identical for all every endpoint within this profile as follows:
        1. Select the appropriate **Protocol**, and specify the **Port** number. 
        2. For **Path** type a forward slash */*. To monitor endpoints, you must specify a path and filename. A forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default).
        3. At the top of the page, click **Save**.
5. In the **Settings** section, click **Endpoints**.
6. In the **Endpoints** blade, review the priority order for your endpoints. When you select the **Priority** traffic routing method, the order of the selected endpoints matters. Verify the priority order of endpoints.  The primary endpoint is on top. Double-check on the order it is displayed. all requests will be routed to the first endpoint and if Traffic Manager detects it be unhealthy, the traffic automatically fails over to the next endpoint. 
7. To change the endpoint priority order, click the endpoint, and in the **Endpoint** blade that is displayed, click **Edit** and change the **Priority** value as needed. 
8. Click **Save** to save change the endpoint settings.
9. After you complete your configuration changes, click **Save** at the bottom of the page.
10. Test the changes in your configuration as follows:
    1.	In the portal’s search bar, search for the Traffic Manager profile name and click the Traffic Manager profile in the results that the displayed.
    2.	In the **Traffic Manager** profile blade, click **Overview**.
    3.	The **Traffic Manager profile** blade displays the DNS name of your newly created Traffic Manager profile. This can be used by any clients (for example, by navigating to it using a web browser) to get routed to the right endpoint as determined by the routing type. In this case all requests are routed to the first endpoint and if Traffic Manager detects it be unhealthy, the traffic automatically fails over to the next endpoint.
11. Once your Traffic Manager profile is working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name.

![Configuring priority traffic routing method using Traffic Manager][1]

## Next steps


- Learn about [weighted traffic routing method](traffic-manager-configure-weighted-routing-method.md).
- Learn about [performance routing method](traffic-manager-configure-performance-routing-method.md).
- Learn about [geographic routing method](traffic-manager-configure-geographic-routing-method.md).
- Learn how to [test Traffic Manager settings](traffic-manager-testing-settings.md).

<!--Image references-->
[1]: ./media/traffic-manager-priority-routing-method/traffic-manager-priority-routing-method.png