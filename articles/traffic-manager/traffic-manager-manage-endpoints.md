---
title: Manage endpoints in Azure Traffic Manager | Microsoft Docs
description: This article will help you add, remove, enable and disable endpoints from Azure Traffic Manager.
services: traffic-manager
documentationcenter: ''
author: rohinkoul
ms.service: traffic-manager
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/08/2017
ms.author: rohink
---

# Add, disable, enable, or delete endpoints

The Web Apps feature in Azure App Service already provides failover and round-robin traffic routing functionality for websites within a datacenter, regardless of the website mode. Azure Traffic Manager allows you to specify failover and round-robin traffic routing for websites and cloud services in different datacenters. The first step necessary to provide that functionality is to add the cloud service or website endpoint to Traffic Manager.

You can also disable individual endpoints that are part of a Traffic Manager profile. Disabling an endpoint leaves it as part of the profile, but the profile acts as if the endpoint is not included in it. This action is useful for temporarily removing an endpoint that is in maintenance mode or being redeployed. Once the endpoint is up and running again, it can be enabled.

> [!NOTE]
> Disabling an endpoint has nothing to do with its deployment state in Azure. A healthy endpoint remains up and able to receive traffic even when disabled in Traffic Manager. Additionally, disabling an endpoint in one profile does not affect its status in another profile.

## To add a cloud service or an App service endpoint to a Traffic Manager profile

1. From a browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that the displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, click **Endpoints**.
4. In the **Endpoints** blade that is displayed, click **Add**.
5. In the **Add endpoint** blade, complete as follows:
    1. For **Type**, click **Azure endpoint**.
    2. Provide a **Name** by which you want to recognize this endpoint.
    3. For **Target resource type**, from the drop-down, choose the appropriate resource type.
    4. For **Target resource**, click the **Choose...** selector to list resources under the same subscription in the **Resources blade**. In the **Resource** blade that is displayed, pick the service that you want to add as the first endpoint.
    5. For **Priority**, select as **1**. This results in all traffic going to this endpoint if it is healthy.
    6. Keep **Add as disabled** unchecked.
    7. Click **OK**
6.	Repeat steps 4 and 5 to add the next Azure endpoint. Make sure to add it with its **Priority** value set at **2**.
7.	When the addition of both endpoints is complete, they are displayed in the **Traffic Manager profile** blade along with their monitoring status as **Online**.

> [!NOTE]
> After you add or remove an endpoint from a profile using the *Failover* traffic routing method, the failover priority list may not be ordered the way you want. You can adjust the order of the Failover Priority List on the Configuration page. For more information, see [Configure Failover traffic routing](traffic-manager-configure-failover-routing-method.md).

## To disable an endpoint

1. From a browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that are displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, click **Endpoints**. 
4. Click the endpoint that you want to disable.
5. In the **Endpoint** blade, change the endpoint status to **Disabled**, and then click **Save**.
6. Clients continue to send traffic to the endpoint for the duration of Time-to-Live (TTL). You can change the TTL on the Configuration page of the Traffic Manager profile.

## To enable an endpoint

1. From a browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that are displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, click **Endpoints**. 
4. Click the endpoint that you want to enable.
5. In the **Endpoint** blade, change the endpoint status to **Enabled**, and then click **Save**.
6. Clients continue to send traffic to the endpoint for the duration of Time-to-Live (TTL). You can change the TTL on the Configuration page of the Traffic Manager profile.

## To delete an endpoint

1. From a browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  **Traffic Manager profile** name that you want to modify, and then click the Traffic Manager profile in the results that are displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, click **Endpoints**. 
4. Click the endpoint that you want to delete.
5. In the **Endpoint** blade, click **Delete**


## Next steps

* [Manage Traffic Manager profiles](traffic-manager-manage-profiles.md)
* [Configure routing methods](traffic-manager-configure-routing-method.md)
* [Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)
* [Traffic Manager performance considerations](traffic-manager-performance-considerations.md)
* [Operations on Traffic Manager (REST API Reference)](https://go.microsoft.com/fwlink/p/?LinkID=313584)

