---
title: Deploy Azure API Management services to multiple Azure regions | Microsoft Docs
description: Learn how to deploy an Azure API Management service instance to multiple Azure regions.
services: api-management
documentationcenter: ''
author: steved0x
manager: erikre
editor: ''

ms.assetid: 47389ad6-f865-4706-833f-846115e22e4d
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: apimpm
---
# How to deploy an Azure API Management service instance to multiple Azure regions
API Management supports multi-region deployment which enables API publishers to distribute a single API management service across any number of desired Azure regions. This helps reduce request latency perceived by geographically distributed API consumers and also improves service availability if one region goes offline. 

When an API Management service is created initially, it contains only one [unit][unit] and resides in a single Azure region, which is designated as the Primary Region. Additional regions can be easily added through the Azure Portal. An API Management gateway server is deployed to each region and call traffic will be routed to the closest gateway. If a region goes offline, the traffic is automatically re-directed to the next closest gateway. 

> [!IMPORTANT]
> Multi-region deployment is only available in the **[Premium][Premium]** tier.
> 
> 

## <a name="add-region"> </a>Deploy an API Management service instance to a new region
> [!NOTE]
> If you have not yet created an API Management service instance, see [Create an API Management service instance][Create an API Management service instance] in the [Get started with Azure API Management][Get started with Azure API Management] tutorial.
> 
> 

In the Azure Portal navigate to the **Scale and pricing** page for your API Management service instance. 

![Scale tab][api-management-scale-service]

To deploy to a new region, click on **+ Add region** from the toolbar.

![Add region][api-management-add-region]

Select the location from the drop-down list and set the number of units for with the slider.

![Specify units][api-management-select-location-units]

Click **Add** to place your selection in the Locations table. 

Repeat this process until you have all locations configured and click **Save** from the toolbar to start the deployment process.

## <a name="remove-region"> </a>Delete an API Management service instance from a location
In the Azure Portal navigate to the **Scale and pricing** page for your API Management service instance. 

![Scale tab][api-management-scale-service]

For the location you would like to remove open the context menu using the **...** button at the right end of the table. Select the **Delete** option.

![Remove region][api-management-remove-region]

Confirm the deletion and click **Save** to apply the changes.

[api-management-management-console]: ./media/api-management-howto-deploy-multi-region/api-management-management-console.png

[api-management-scale-service]: ./media/api-management-howto-deploy-multi-region/api-management-scale-service.png
[api-management-add-region]: ./media/api-management-howto-deploy-multi-region/api-management-add-region.png
[api-management-select-location-units]: ./media/api-management-howto-deploy-multi-region/api-management-select-location-units.png
[api-management-remove-region]: ./media/api-management-howto-deploy-multi-region/api-management-remove-region.png

[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Get started with Azure API Management]: api-management-get-started.md

[Deploy an API Management service instance to a new region]: #add-region
[Delete an API Management service instance from a region]: #remove-region

[unit]: http://azure.microsoft.com/pricing/details/api-management/
[Premium]: http://azure.microsoft.com/pricing/details/api-management/

