---
title: Secure your Origin with Private Link in Azure Front Door Premium
description: Learn how to secure connectivity between Azure Front Door Premium and your origin using Azure Private Link. This article covers supported origins, region availability, and best practices for private endpoint configuration.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 09/24/2025
ms.custom:
  - references_regions
  - ignite-2024
  - build-2025
  - sfi-image-nochange
---

# Secure your origin with Private Link in Azure Front Door Premium

**Applies to:** :heavy_check_mark: Front Door Premium

[Azure Private Link](../private-link/private-link-overview.md) enables you to access Azure PaaS services and services hosted in Azure over a private endpoint in your virtual network. Traffic between your virtual network and the service goes over the Microsoft backbone network, eliminating exposure to the public Internet.

Azure Front Door Premium can connect to your origin using Private Link. Your origin can be hosted in a virtual network or hosted as a PaaS service such as Azure Web App or Azure Storage. Private Link removes the need for your origin to be accessed publicly.

:::image type="content" source="./media/private-link/front-door-private-endpoint-architecture.png" alt-text="Diagram of Azure Front Door with Private Link enabled.":::

## How Private Link works

When you enable Private Link to your origin in Azure Front Door Premium, Front Door creates a private endpoint on your behalf from an Azure Front Door managed regional private network. You receive an Azure Front Door private endpoint request at the origin pending your approval.

You must approve the private endpoint connection before traffic can pass to the origin privately. You can approve private endpoint connections by using the Azure portal, Azure CLI, or Azure PowerShell. For more information, see [Manage a Private Endpoint connection](../private-link/manage-private-endpoint.md).

After you enable an origin for Private Link and approve the private endpoint connection, it can take a few minutes for the connection to be established. During this time, requests to the origin receives an Azure Front Door error message. The error message goes away once the connection is established.

Once your request is approved, a dedicated private endpoint gets assigned for routing your traffic from the Azure Front Door managed virtual network. Traffic from your clients reaches Azure Front Door Global POPs and is then routed over the Microsoft backbone network to the Front Door regional cluster, which hosts the managed virtual network containing the dedicated private endpoint. The traffic is then routed to your origin via the private link platform over Microsoft backbone network. Hence the incoming traffic to your origin secured upon the moment it arrives to Azure Front Door. 

## Supported origins

Origin support for direct private endpoint connectivity is currently limited to the following origin types.

| Origin type | Documentation |
|--|--|
| App Service (Web App, Function App) | [Connect Azure Front Door to a Web App / Function App origin with Private Link](standard-premium/how-to-enable-private-link-web-app.md) | 
| Blob Storage | [Connect Azure Front Door to a storage account origin with Private Link](standard-premium/how-to-enable-private-link-storage-account.md) |
| Storage Static Website | [Connect Azure Front Door to a storage static website origin with Private Link](how-to-enable-private-link-storage-static-website.md) |
| Internal load balancers, or any services that expose internal load balancers such as Azure Kubernetes Service, or Azure Red Hat OpenShift | [Connect Azure Front Door to an internal load balancer origin with Private Link](standard-premium/how-to-enable-private-link-internal-load-balancer.md) |
| API Management | [Connect Azure Front Door to an API Management origin with Private Link](standard-premium/how-to-enable-private-link-apim.md) |
| Application Gateway | [Connect Azure Front Door to an application gateway origin with Private Link](how-to-enable-private-link-application-gateway.md) |
| Azure Container Apps | [Connect Azure Front Door to an Azure Container Apps origin with Private Link](../container-apps/how-to-integrate-with-azure-front-door.md) |

> [!NOTE]
> This feature isn't supported with Azure App Service Slots and Azure Static Web App. 

## Region availability

Azure Front Door private link is available in the following regions:

| Americas | Europe | Africa | Asia Pacific |
|--|--|--|--|
| Brazil South | France Central | South Africa North | Australia East |
| Canada Central | Germany West Central | | Central India |
| Central US | North Europe | | Japan East |
| East US | Norway East | | Korea Central |
| East US 2 | UK South | | East Asia |
| South Central US | West Europe | | South East Asia |
| West US 2 | Sweden Central | | China East 3 |
| West US 3 | | | China North 3 |
| US Gov Arizona | | | |
| US Gov Texas | | | |
| US Gov Virginia | | | |
| US Nat East | | | |
| US Nat West | | | |
| US Sec East | | | |
| US Sec West | | | |

The Azure Front Door Private Link feature is region agnostic but for the best latency, you should always pick an Azure region closest to your origin when choosing to enable Azure Front Door Private Link endpoint. If your origin's region isn't supported in the list of regions Front Door Private Link supports, pick the next nearest region. You can use [Azure network round-trip latency statistics](../networking/azure-network-latency.md) to determine the next nearest region in terms of latency. We are in the process of enabling support for more regions. Once a new region is supported, you can follow these [instructions](blue-green-deployment.md) to gradually shift traffic to the new region.

## Association of a private endpoint with an Azure Front Door profile

### Private endpoint creation

Within a single Azure Front Door profile, if two or more Private Link enabled origins are created with the same set of resource ID, group ID and region, then for all such origins only one private endpoint gets created. Connections to the backend can be enabled using this private endpoint. This setup means you only have to approve the private endpoint once because only one private endpoint gets created. If you create more Private Link enabled origins using the same set of Private Link location, resource ID, and group ID, you don't need to approve any more private endpoints.

> [!WARNING]
> Avoid configuring multiple private link enabled origins that point to the same resource (with identical resource ID, group ID, and region), if each origin uses a different HTTP or HTTPS port. This setup can lead to routing issues between Front Door and the origin due to a platform limitation.

#### Single private endpoint

For example, a single private endpoint gets created for all the different origins across different origin groups but in the same Azure Front Door profile as shown in the following table:

:::image type="content" source="./media/private-link/single-endpoint.png" alt-text="Diagram showing a single private endpoint created for origins created in the same Azure Front Door profile.":::

#### Multiple private endpoints

A new private endpoint gets created in the following scenario:

* If the region, resource ID, or group ID changes, Azure Front Door considers that the Private Link location and the hostname has changed, resulting in extra private endpoints created and each one needs to be approved.

    :::image type="content" source="./media/private-link/multiple-endpoints.png" alt-text="Diagram showing a multiple private endpoint created because changes in the region and resource ID for the origin.":::

* Enabling Private Link for origins in different Azure Front Door profiles will create extra private endpoints and requires approval for each one. 

    :::image type="content" source="./media/private-link/multiple-profiles.png" alt-text="Diagram showing a multiple private endpoint created because the origin is associated with multiple Azure Front Door profiles.":::

### Private endpoint removal

When an Azure Front Door profile gets deleted, private endpoints associated with the profile also get deleted. 

#### Single private endpoint

If AFD-Profile-1 gets deleted, then the PE1 private endpoint across all the origins also gets deleted.

:::image type="content" source="./media/private-link/delete-endpoint.png" alt-text="Diagram showing if AFD-Profile-1 gets deleted then PE1 across all origins get deleted.":::

#### Multiple private endpoints

* If AFD-Profile-1 gets deleted, all private endpoints from PE1 through to PE4 gets deleted.
 
    :::image type="content" source="./media/private-link/delete-multiple-endpoints.png" alt-text="Diagram showing if AFD-Profile-1 gets deleted, all private endpoints from PE1 through PE4 gets deleted.":::

* Deleting an Azure Front Door profile doesn't affect private endpoints created for a different Azure Front Door profile. 

    :::image type="content" source="./media/private-link/delete-multiple-profiles.png" alt-text="Diagram showing Azure Front Door profile getting deleted but doesn't affect private endpoints in other Front Door profiles.":::

    For example:
    
    * If AFD-Profile-2 gets deleted, only PE5 is removed.
    * If AFD-Profile-3 gets deleted, only PE6 is removed.
    * If AFD-Profile-4 gets deleted, only PE7 is removed.
    * If AFD-Profile-5 gets deleted, only PE8 is removed.

## Frequently asked questions

1. Does this feature support private link connectivity from client to Azure Front Door?

* No. This feature only supports private link connectivity from your Azure Front Door to your origin.

2. How to improve redundancy while using Private Link with Azure Front Door?

* To improve redundancy at origin level, make sure you have multiple private link enabled origins within the same origin group so that Azure Front Door can distribute traffic across multiple instances of the application. If one instance is unavailable, then other origins can still receive traffic.

* To route Private Link traffic, requests are routed from Azure Front Door POPs to the Front Door managed virtual network hosted in Front Door regional clusters. To have redundancy in case the regional cluster isn't reachable, it's recommended to configure multiple origins (each with a different Private Link region) under the same Azure Front Door origin group. This way even if one regional cluster is unavailable, then other origins can still receive traffic via a different regional cluster. Below is how an origin group with both origin level and region level redundancy would look like.

    :::image type="content" source="./media/private-link/redundant-origin-group.png" alt-text="Diagram showing an origin group with both origin level and region level redundancy.":::

3. Can I mix public and private origins in the same origin group?

* No. Azure Front Door doesn't allow mixing public and private origins in the same origin group. This can cause configuration errors or traffic routing issues. Keep all public origins in one origin group and all private origins in a separate origin group.

4. Why do I see the error “Origin Group can only have origins with private links or origins without private links. They cannot have a mix of both” when enabling Private Link simultaneously for multiple public origins?

* This error can occur when you enable Private Link for more than one public origin in the same origin group at the same time. Although both origins are intended to be private, the update operation processes origins sequentially, not simultaneously. When the first origin is updated, the second origin is still technically public, creating a temporary mixed state, resulting in an error.
* To avoid this error, enable Private Link for one origin at a time:
  1.	Remove origins from the origin group till only a single origin remains.
  2.	Enable Private Link for that origin and approve its Private Endpoint.
  3.	After approval, add the second origin and enable Private Link for it.

6. Why do I see an error when trying to access the private endpoint details by double clicking on the private endpoint in Azure portal?

* While approving the private endpoint connection or after approving the private endpoint connection, if you double click on the private endpoint, you'll see an error message saying "You don't have access. Copy the error details and send them to your administrator to get access to this page." This is expected as the private endpoint is hosted within a subscription managed by Azure Front Door.

6. What are the rate limits for Private Link traffic and how can I handle high traffic scenarios?

* For platform protection, each Front Door regional cluster has a limit of 7200 RPS (requests per second) per Front Door profile. Requests beyond 7200 RPS at a region will be rate limited with "429 Too Many Requests". 

* If you're onboarding or expecting traffic more than 7200 RPS, we recommend deploying multiple origins (each with a different Private Link region) so that traffic is spread across multiple Front Door regional clusters. It's recommended that each origin is a separate instance of your application to improve origin level redundancy. But if you can’t maintain separate instances, you can still configure multiple origins at Front Door level with each origin pointing to the same hostname but the regions are kept different. This way, Front Door will route the traffic to the same instance but via different regional clusters.

7. For private link enabled origins, will health probes also follow the same network path as actual traffic?

* Yes.


## Related content

* [Connect Azure Front Door Premium to a Web App origin with Private Link](standard-premium/how-to-enable-private-link-web-app.md)
* [Connect Azure Front Door Premium to a storage account origin with Private Link](standard-premium/how-to-enable-private-link-storage-account.md)
* [Connect Azure Front Door Premium to an internal load balancer origin with Private Link](standard-premium/how-to-enable-private-link-internal-load-balancer.md)
* [Connect Azure Front Door Premium to a storage static website origin with Private Link](how-to-enable-private-link-storage-static-website.md)
* [Connect Azure Front Door Premium to an application gateway origin with Private Link](how-to-enable-private-link-application-gateway.md)
* [Connect Azure Front Door Premium to an API Management origin with Private Link](standard-premium/how-to-enable-private-link-apim.md)
* [Connect Azure Front Door Premium to an Azure Container Apps origin with Private Link](../container-apps/how-to-integrate-with-azure-front-door.md)
