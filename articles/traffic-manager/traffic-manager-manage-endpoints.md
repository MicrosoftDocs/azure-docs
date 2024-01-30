---
title: Manage endpoints in Azure Traffic Manager
description: This article helps you add, remove, enable, disable, and move Azure Traffic Manager endpoints.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 10/02/2023
ms.author: greglin
ms.custom: template-how-to
---

# Add, disable, enable, delete, or move endpoints

The Web Apps feature in Azure App Service already provides failover and round-robin traffic routing functionality for websites within a datacenter, regardless of the website mode. Azure Traffic Manager allows you to specify failover and round-robin traffic routing for websites and cloud services in different datacenters. The first step necessary to provide that functionality is to add the cloud service or website endpoint to Traffic Manager.

You can also disable individual endpoints that are part of a Traffic Manager profile. Disabling an endpoint leaves it as part of the profile, but the profile acts as if the endpoint is not included in it. This action is useful for temporarily removing an endpoint that is in maintenance mode or being redeployed. Once the endpoint is up and running again, it can be enabled.

> [!NOTE]
> Disabling an endpoint has nothing to do with its deployment state in Azure. A healthy endpoint remains up and able to receive traffic even when disabled in Traffic Manager. Additionally, disabling an endpoint in one profile does not affect its status in another profile.

## To add a cloud service or an App service endpoint to a Traffic Manager profile

1. Using a web browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the **Traffic Manager profile** name that you want to modify, and then select the Traffic Manager profile in the results that the displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, select **Endpoints**.
4. In the **Endpoints** blade that is displayed, select **Add**.
5. In the **Add endpoint** blade, complete as follows:
    1. For **Type**, select **Azure endpoint**.
    2. Provide a **Name** by which you want to recognize this endpoint.
    3. For **Target resource type**, from the drop-down, choose the appropriate resource type.
    4. For **Target resource**, select the **Choose...** selector to list resources under the same subscription in the **Resources blade**. In the **Resource** blade that is displayed, pick the service that you want to add as the first endpoint.
    5. For **Priority**, select as **1**. This results in all traffic going to this endpoint if it's healthy.
    6. Keep **Add as disabled** unchecked.
    7. Select **OK**
6.	Repeat steps 4 and 5 to add the next Azure endpoint. Make sure to add it with its **Priority** value set at **2**.
7.	When the addition of both endpoints is complete, they're displayed in the **Traffic Manager profile** blade along with their monitoring status as **Online**.

> [!NOTE]
> After you add or remove an endpoint from a profile using the *Failover* traffic routing method, the failover priority list may not be ordered the way you want. You can adjust the order of the Failover Priority List on the Configuration page. For more information, see [Configure Failover traffic routing](./traffic-manager-configure-priority-routing-method.md).

## To disable an endpoint

1. Using a web browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  **Traffic Manager profile** name that you want to modify, and then select the Traffic Manager profile in the results that are displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, select **Endpoints**. 
4. Select the endpoint that you want to disable.
5. In the **Endpoint** blade, change the endpoint status to **Disabled**, and then select **Save**.
6. Clients continue to send traffic to the endpoint for the duration of Time-to-Live (TTL). You can change the TTL on the Configuration page of the Traffic Manager profile.

## To enable an endpoint

1. Using a web browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  **Traffic Manager profile** name that you want to modify, and then select the Traffic Manager profile in the results that are displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, select **Endpoints**. 
4. Select the endpoint that you want to enable.
5. In the **Endpoint** blade, change the endpoint status to **Enabled**, and then select **Save**.
6. Clients continue to send traffic to the endpoint for the duration of Time-to-Live (TTL). You can change the TTL on the Configuration page of the Traffic Manager profile.

## To delete an endpoint

1. Using a web browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  **Traffic Manager profile** name that you want to modify, and then select the Traffic Manager profile in the results that are displayed.
3. In the **Traffic Manager profile** blade, in the **Settings** section, select **Endpoints**. 
4. Select the endpoint that you want to delete.
5. In the **Endpoint** blade, select **Delete**

## To move an endpoint

1. Using a web browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the portal’s search bar, search for the  Traffic Manager profile name that you want to modify, and then select the Traffic Manager profile in the results that are displayed.
3. Inside the resource's blade, select the **Move** option. Follow the instructions to move the resource to the desired subscription or resource group. 
4. When the resource has been successfully moved, return to the Azure Traffic Manager Profile that had the resource as an endpoint. 
5. Locate and select the old endpoint that was previously linked to the resource you moved. Select **Delete** to remove this old endpoint from the Traffic Manager profile.
6. Select **Add** to create and configure a new endpoint that targets the recently moved Azure resource.

For more information, see: [How do I move my Traffic Manager profile's Azure endpoints to a different resource group or subscription?](traffic-manager-FAQs.md#how-do-i-move-my-traffic-manager-profiles-azure-endpoints-to-a-different-resource-group-or-subscription)

## Next steps

* [Manage Traffic Manager profiles](traffic-manager-manage-profiles.md)
* [Configure routing methods](./traffic-manager-configure-priority-routing-method.md)
* [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md)
* [Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)
* [Traffic Manager performance considerations](traffic-manager-performance-considerations.md)
* [Operations on Traffic Manager (REST API Reference)](/previous-versions/azure/reference/hh758255(v=azure.100))