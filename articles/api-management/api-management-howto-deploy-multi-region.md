---
title: Deploy Azure API Management instance to multiple Azure regions
titleSuffix: Azure API Management
description: Learn how to deploy a Premium tier Azure API Management instance to multiple Azure regions to improve API gateway availability.
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 09/27/2022
ms.author: danlep
---

# Deploy an Azure API Management instance to multiple Azure regions

Azure API Management supports multi-region deployment, which enables API publishers to add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps reduce request latency perceived by geographically distributed API consumers and improves service availability if one region goes offline.

When adding a region, you configure:

* The number of scale [units](upgrade-and-scale.md) that region will host. 

* Optional [zone redundancy](../availability-zones/migrate-api-mgt.md), if that region supports it.

* [Virtual network](virtual-network-concepts.md) settings in the added region, if networking is configured in the existing region or regions.

>[!IMPORTANT]
> The feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo. For all other regions, customer data is stored in Geo.

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]

## About multi-region deployment

[!INCLUDE [api-management-multi-region-concepts](../../includes/api-management-multi-region-concepts.md)]

## Prerequisites

* If you haven't created an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance.md). Select the Premium service tier.
* If your API Management instance is deployed in a virtual network, ensure that you set up a virtual network, subnet, and public IP address in the location that you plan to add. See [virtual network prerequisites](api-management-using-with-vnet.md#prerequisites).

## <a name="add-region"> </a>Deploy API Management service to an additional region

1. In the Azure portal, navigate to your API Management service and select **Locations** from the left menu.
1. Select **+ Add** in the top bar.
1. Select the added location from the dropdown list.
1. Select the number of scale **[Units](upgrade-and-scale.md)** in the location.
1. Optionally select one or more [**Availability zones**](../availability-zones/migrate-api-mgt.md). 
1. If the API Management instance is deployed in a [virtual network](api-management-using-with-vnet.md), configure virtual network settings in the location. Select an existing virtual network, subnet, and public IP address that are available in the location.
1. Select **Add** to confirm.
1. Repeat this process until you configure all locations.
1. Select **Save** in the top bar to start the deployment process.

## <a name="remove-region"> </a>Remove an API Management service region

1. In the Azure portal, navigate to your API Management service and select **Locations** from the left menu.
2. For the location you would like to remove, select the context menu using the **...** button at the right end of the table. Select **Delete**.
3. Confirm the deletion and select **Save** to apply the changes.

## <a name="route-backend"> </a>Route API calls to regional backend services

By default, each API routes requests to a single backend service URL. Even if you've configured Azure API Management gateways in various regions, the API gateway will still forward requests to the same backend service, which is deployed in only one region. In this case, the performance gain will come only from responses cached within Azure API Management in a region specific to the request; contacting the backend across the globe may still cause high latency.

To take advantage of geographical distribution of your system, you should have backend services deployed in the same regions as Azure API Management instances. Then, using policies and `@(context.Deployment.Region)` property, you can route the traffic to local instances of your backend.

> [!TIP]
> Optionally set the `disableGateway` property in a regional gateway to disable routing of API traffic there. For example, temporarily disable a regional gateway when testing or updating a regional backend service. 

1. Navigate to your Azure API Management instance and select **APIs** from the left menu.
2. Select your desired API.
3. Select **Code editor** from the arrow dropdown in the **Inbound processing**.

    ![API code editor](./media/api-management-howto-deploy-multi-region/api-management-api-code-editor.png)

4. Use the `set-backend` combined with conditional `choose` policies to construct a proper routing policy in the `<inbound> </inbound>` section of the file.

    For example, the following XML file would work for West US and East Asia regions:

    ```xml
    <policies>
        <inbound>
            <base />
            <choose>
                <when condition="@("West US".Equals(context.Deployment.Region, StringComparison.OrdinalIgnoreCase))">
                    <set-backend-service base-url="http://contoso-backend-us.com/" />
                </when>
                <when condition="@("East Asia".Equals(context.Deployment.Region, StringComparison.OrdinalIgnoreCase))">
                    <set-backend-service base-url="http://contoso-backend-asia.com/" />
                </when>
                <otherwise>
                    <set-backend-service base-url="http://contoso-backend-other.com/" />
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

API Management routes the requests to a regional gateway based on [the lowest latency](../traffic-manager/traffic-manager-routing-methods.md#performance). Although it isn't possible to override this setting in API Management, you can use your own Traffic Manager with custom routing rules.

1. Create your own [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/).
1. If you're using a custom domain, [use it with the Traffic Manager](../traffic-manager/traffic-manager-point-internet-domain.md) instead of the API Management service.
1. [Configure the API Management regional endpoints in Traffic Manager](../traffic-manager/traffic-manager-manage-endpoints.md). The regional endpoints follow the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.
1. [Configure the API Management regional status endpoints in Traffic Manager](../traffic-manager/traffic-manager-monitoring.md). The regional status endpoints follow the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net/status-0123456789abcdef`, for example `https://contoso-westus2-01.regional.azure-api.net/status-0123456789abcdef`.
1. Specify [the routing method](../traffic-manager/traffic-manager-routing-methods.md) of the Traffic Manager.

## Virtual networking

This section provides considerations for multi-region deployments when the API Management instance is injected in a virtual network.

* Configure each regional network independently. The [connectivity requirements](virtual-network-reference.md) such as required network security group rules for a virtual network in an added region are the same as those for a network in the primary region.
* Virtual networks in the different regions don't need to be peered.

### IP addresses

* A public virtual IP address is created in every region added with a virtual network. For virtual networks in either [external mode](api-management-using-with-vnet.md) or [internal mode](api-management-using-with-internal-vnet.md), this public IP address is required for management traffic on port `3443`.

    * **External VNet mode** - The public IP addresses are also required to route public HTTP traffic to the API gateways.

    * **Internal VNet mode** - A private IP address is also created in every region added with a virtual network. Use these addresses to connect within the network to the API Management endpoints in the primary and secondary regions.

### Routing

* **External VNet mode** - Routing of public HTTP traffic to the regional gateways is handled automatically, in the same way it is for a non-networked API Management instance.

* **Internal VNet mode** - Private HTTP traffic isn't routed or load-balanced to the regional gateways by default. Users own the routing and are responsible for bringing their own solution to manage routing and private load balancing across multiple regions. Example solutions include Azure Application Gateway and Azure Traffic Manager.

## Next steps

* Learn more about [zone redundancy](../availability-zones/migrate-api-mgt.md) to improve the availability of an API Management instance in a region.

* For more information about virtual networks and API Management, see:

    * [Connect to a virtual network using Azure API Management](api-management-using-with-vnet.md)

    * [Connect to a virtual network in internal mode using Azure API Management](api-management-using-with-internal-vnet.md)

    * [IP addresses of API Management](api-management-howto-ip-addresses.md)


[create an api management service instance]: get-started-create-service-instance.md
[get started with azure api management]: get-started-create-service-instance.md
[deploy an api management service instance to a new region]: #add-region
[delete an api management service instance from a region]: #remove-region
[unit]: https://azure.microsoft.com/pricing/details/api-management/
[premium]: https://azure.microsoft.com/pricing/details/api-management/
