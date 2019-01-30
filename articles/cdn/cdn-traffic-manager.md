---
title: Set up failover across multiple Azure CDN endpoints with Azure Traffic Manager | Microsoft Docs
description: Learn about how to set up Azure Traffic Manager with Azure CDN endpoints.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2018
ms.author: kumud
ms.custom: 

---
# Set up failover across multiple Azure CDN endpoints with Azure Traffic Manager

When you configure Azure Content Delivery Network (CDN), you can select the optimal provider and pricing tier for your needs. Azure CDN, with its globally distributed infrastructure, by default creates local and geographic redundancy and global load balancing to improve service availability and performance. If a location is not available to serve content, requests are automatically routed to another location and the optimal POP (based on such factors as request location and  server load) is used to serve each client request. 
 
If you have multiple CDN profiles, you can further improve availability and performance with Azure Traffic Manager. You can use Azure Traffic Manager with Azure CDN to load balance among multiple CDN endpoints for failover, geo-load balancing, and other scenarios. In a typical failover scenario, all client requests are first directed to the primary CDN profile; if the profile is not available, requests are then passed to the secondary CDN profile until your primary CDN profile is back online. Using Azure Traffic Manager in this way ensures your web application is always available. 

This article provides guidance and an example of how to set up failover with **Azure CDN Standard from Verizon** and **Azure CDN Standard from Akamai** profiles.

## Set up Azure CDN 
Create two or more Azure CDN profiles and endpoints with different providers.

1. Create an **Azure CDN Standard from Verizon** and **Azure CDN Standard from Akamai** profile by following the steps in [Create a new CDN profile](cdn-create-new-endpoint.md#create-a-new-cdn-profile).
 
   ![CDN multiple profiles](./media/cdn-traffic-manager/cdn-multiple-profiles.png)

2. In each of the new profiles, create at least one endpoint by following the steps in [Create a new CDN endpoint](cdn-create-new-endpoint.md#create-a-new-cdn-endpoint).

## Set up Azure Traffic Manager
Create an Azure Traffic Manager profile and set up load balancing across your CDN endpoints. 

1. Create an Azure Traffic Manager profile by following the steps in [Create a Traffic Manager profile](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-create-profile#create-a-traffic-manager-profile-1). 

    For **Routing method**, select **Priority**.

2. Add your CDN endpoints in your Traffic Manager profile by following the steps in [Add Traffic Manager endpoints](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-create-profile#add-traffic-manager-endpoints)

    For **Type**, select **External endpoints**. For **Priority**, enter a number.

    For example, create *cdndemo101akamai.azureedge.net* with a priority of *1* and *cdndemo101verizon.azureedge.net* with a priority of *2*.

   ![CDN traffic manager endpoints](./media/cdn-traffic-manager/cdn-traffic-manager-endpoints.png)


## Set up custom domain on Azure CDN and Azure Traffic Manager
After you set up your CDN and Traffic Manager profiles, follow these steps to add DNS mapping and register custom domain to the CDN endpoints. For this example, the custom domain name is *cdndemo101.dustydogpetcare.online*.

1. Go to the web site for the domain provider of your custom domain, such as GoDaddy, and create two DNS CNAME entries. 

    a. For the first CNAME entry, map your custom domain, with the cdnverify subdomain, to your CDN endpoint. This entry is a required step to register the custom domain to the CDN endpoint that you added to Traffic Manager in step 2.

      For example: 

      `cdnverify.cdndemo101.dustydogpetcare.online  CNAME  cdnverify.cdndemo101akamai.azureedge.net`  

    b. For the second CNAME entry, map your custom domain, without the cdnverify subdomain, to your CDN endpoint. This entry maps the custom domain to Traffic Manager. 

      For example: 
      
      `cdndemo101.dustydogpetcare.online  CNAME  cdndemo101.trafficmanager.net`   

    > [!NOTE]
    > If your domain is currently live and cannot be interrupted, do this step last. Verify that the CDN endpoints and traffic manager domains are live before you update your custom domain DNS to Traffic Manager.
    >


2.	From your Azure CDN profile, select the first CDN endpoint (Akamai). Select **Add custom domain** and input *cdndemo101akamai.azureedge.net*. Verify that the checkmark to validate the custom domain is green. 

    Azure CDN uses the *cdnverify* subdomain to validate the DNS mapping to complete this registration process. For more information, see [Create a CNAME DNS record](cdn-map-content-to-custom-domain.md#create-a-cname-dns-record). This step enables Azure CDN to recognize the custom domain so that it can respond to its requests.

3.	Return to the web site for the domain provider of your custom domain and update the first DNS mapping you created in so that the custom domain is mapped to your second CDN endpoint.
                             
    For example: 

    `cdnverify.cdndemo101.dustydogpetcare.online  CNAME  cdnverify.cdndemo101verizon.azureedge.net`  

4. From your Azure CDN profile, select the second CDN endpoint (Verizon) and repeat step 2. Select **Add custom domain**, and input *cdndemo101akamai.azureedge.net*.
 
After you complete these steps, your multi-CDN service with failover capabilities is set up with Azure Traffic Manager. You'll be able to access the test URLs from your custom domain. To test the functionality, disable the primary CDN endpoint and verify that the request is correctly moved over to the secondary CDN endpoint. 

## Next steps
You can also set up other routing methods, such as geographic, to balance the load among different CDN endpoints. For more information, see [Configure the geographic traffic routing method using Traffic Manager](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-configure-geographic-routing-method).



