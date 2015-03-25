<properties
	pageTitle="How to deploy an Azure API Management service instance to multiple Azure regions"
	description="Learn how to deploy an Azure API Management service instance to multiple Azure regions." 
	services="api-management"
	documentationCenter=""
	authors="steved0x"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="api-management"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/10/2015"
	ms.author="sdanie"/>

# How to deploy an Azure API Management service instance to multiple Azure regions

API Management supports multi-region deployment which enables API publishers to distribute a single API management service across any number of desired Azure regions. This helps reduce request latency perceived by geographically distributed API consumers and also improves service availability if one region goes offline. 

When an API Management service is created initially, it contains only one [unit][] and resides in a single Azure region, which is designated as the Primary Region. Additional regions can be easily added through Azure Portal. API Management proxy server is deployed to each region and call traffic will be routed to the closest proxy. When a region goes offline, the traffic is automatically re-directed to the next closest proxy. 

> [AZURE.IMPORTANT] Multi-region deployment is only available in the **[Premium][]** tier.

## <a name="add-region"> </a>Deploy an API Management service instance to a new region

To get started, click **Manage** in the Azure Portal for your API Management service. This takes you to the API Management publisher portal.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Navigate to the **Scale** tab in Azure Portal for your API Management service instance. 

![Scale tab][api-management-scale-service]

To deploy to a new region, click on the drop-down list below the primary region and pick a region from the list.

![Add region][api-management-add-region]

Once the region is selected, pick the number of units for the new region from the unit drop-down list.

![Specify units][api-management-select-units]

Once the desired regions and units are configured, click **Save**.

## <a name="remove-region"> </a>Delete an API Management service instance from a region

To remove an API Management service instance from a region, navigate to the **Scale** tab in Azure Portal for your API Management service instance. 

![Scale tab][api-management-scale-service]

Click the **X** to the right of the desired region to remove.  

![Remove region][api-management-remove-region]

Once the desired regions are removed, click **Save**.


[api-management-management-console]: ./media/api-management-howto-deploy-multi-region/api-management-management-console.png

[api-management-scale-service]: ./media/api-management-howto-deploy-multi-region/api-management-scale-service.png
[api-management-add-region]: ./media/api-management-howto-deploy-multi-region/api-management-add-region.png
[api-management-select-units]: ./media/api-management-howto-deploy-multi-region/api-management-select-units.png
[api-management-remove-region]: ./media/api-management-howto-deploy-multi-region/api-management-remove-region.png

[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Get started with Azure API Management]: api-management-get-started.md

[Deploy an API Management service instance to a new region]: #add-region
[Delete an API Management service instance from a region]: #remove-region

[unit]: http://azure.microsoft.com/pricing/details/api-management/
[Premium]: http://azure.microsoft.com/pricing/details/api-management/

