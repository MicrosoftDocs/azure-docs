---
title: Deploy Azure API Management services to multiple Azure regions | Microsoft Docs
description: Learn how to deploy an Azure API Management service instance to multiple Azure regions.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2019
ms.author: apimpm
---

# How to deploy an Azure API Management service instance to multiple Azure regions

Azure API Management supports multi-region deployment, which enables API publishers to distribute a single Azure API management service across any number of desired Azure regions. This helps reduce request latency perceived by geographically distributed API consumers and also improves service availability if one region goes offline.

A new Azure API Management service initially contains only one [unit][unit] in a single Azure region, the Primary Region. Additional regions can be easily added through the Azure portal. An API Management gateway server is deployed to each region and call traffic will be routed to the closest gateway in terms of latency. If a region goes offline, the traffic is automatically redirected to the next closest gateway.

> [!NOTE]
> Azure API Management replicates only the API gateway component across regions. The service management component is hosted only in the Primary Region. In case of an outage in the Primary Region, applying configuration changes to an Azure API Management service instance is not possible - including settings or policies updates.

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]

## <a name="add-region"> </a>Deploy an API Management service instance to a new region

> [!NOTE]
> If you have not yet created an API Management service instance, see [Create an API Management service instance][Create an API Management service instance].

In the Azure portal, navigate to the **Scale and pricing** page for your API Management service instance. 

![Scale tab][api-management-scale-service]

To deploy to a new region, click on **+ Add region** from the toolbar.

![Add region][api-management-add-region]

Select the location from the drop-down list and set the number of units for with the slider.

![Specify units][api-management-select-location-units]

Click **Add** to place your selection in the Locations table. 

Repeat this process until you have all locations configured and click **Save** from the toolbar to start the deployment process.

## <a name="remove-region"> </a>Delete an API Management service instance from a location

In the Azure portal, navigate to the **Scale and pricing** page for your API Management service instance. 

![Scale tab][api-management-scale-service]

For the location you would like to remove, open the context menu using the **...** button at the right end of the table. Select the **Delete** option.

Confirm the deletion and click **Save** to apply the changes.

## <a name="route-backend"> </a>Route API calls to regional backend services

Azure API Management features only one backend service URL. Even though there are Azure API Management instances in various regions, the API gateway will still forward requests to the same backend service, which is deployed in only one region. In this case, the performance gain will come only from responses cached within Azure API Management in a region specific to the request, but contacting the backend across the globe may still cause high latency.

To fully leverage geographical distribution of your system, you should have backend services deployed in the same regions as Azure API Management instances. Then, using policies and `@(context.Deployment.Region)` property, you can route the traffic to local instances of your backend.

1. Navigate to your Azure API Management instance and click on **APIs** from the left menu.
2. Select your desired API.
3. Click **Code editor** from the arrow dropdown in the **Inbound processing**.

    ![API code editor](./media/api-management-howto-deploy-multi-region/api-management-api-code-editor.png)

4. Use the `set-backend` combined with conditional `choose` policies to construct a proper routing policy in the `<inbound> </inbound>` section of the file.

    For example, the below XML file would work for West US and East Asia regions:

    ```xml
    <policies>
        <inbound>
            <base />
            <choose>
                <when condition="@("West US".Equals(context.Deployment.Region, StringComparison.OrdinalIgnoreCase))">
                    <set-backend-service base-url="http://contoso-us.com/" />
                </when>
                <when condition="@("East Asia".Equals(context.Deployment.Region, StringComparison.OrdinalIgnoreCase))">
                    <set-backend-service base-url="http://contoso-asia.com/" />
                </when>
                <otherwise>
                    <set-backend-service base-url="http://contoso-other.com/" />
                </otherwise>
            </choose>
        </inbound>
        <backend>
            <base />
        </backend>
        <outbound>
            <base />
        </outbound>
        <on-error>
            <base />
        </on-error>
    </policies>
    ```

> [!TIP]
> You may also front your backend services with [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/), direct the API calls to the Traffic Manager, and let it resolve the routing automatically.

## <a name="custom-routing"> </a>Use custom routing to API Management regional gateways

API Management routes the requests to a regional *gateway* based on [the lowest latency](../traffic-manager/traffic-manager-routing-methods.md#performance). Although it is not possible to override this setting in API Management, you can use your own Traffic Manager with custom routing rules.

1. Create your own [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/).
1. If you are using a custom domain, [use it with the Traffic Manager](../traffic-manager/traffic-manager-point-internet-domain.md) instead of the API Management service.
1. [Configure the API Management regional endpoints in Traffic Manager](../traffic-manager/traffic-manager-manage-endpoints.md). The regional endpoints follow the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.
1. [Configure the API Management regional status endpoints in Traffic Manager](../traffic-manager/traffic-manager-monitoring.md). The regional status endpoints follow the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net/status-0123456789abcdef`, for example `https://contoso-westus2-01.regional.azure-api.net/status-0123456789abcdef`.
1. Specify [the routing method](../traffic-manager/traffic-manager-routing-methods.md) of the Traffic Manager.


[api-management-management-console]: ./media/api-management-howto-deploy-multi-region/api-management-management-console.png

[api-management-scale-service]: ./media/api-management-howto-deploy-multi-region/api-management-scale-service.png
[api-management-add-region]: ./media/api-management-howto-deploy-multi-region/api-management-add-region.png
[api-management-select-location-units]: ./media/api-management-howto-deploy-multi-region/api-management-select-location-units.png
[api-management-remove-region]: ./media/api-management-howto-deploy-multi-region/api-management-remove-region.png

[Create an API Management service instance]: get-started-create-service-instance.md
[Get started with Azure API Management]: get-started-create-service-instance.md

[Deploy an API Management service instance to a new region]: #add-region
[Delete an API Management service instance from a region]: #remove-region

[unit]: https://azure.microsoft.com/pricing/details/api-management/
[Premium]: https://azure.microsoft.com/pricing/details/api-management/
