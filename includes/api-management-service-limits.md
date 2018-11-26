---
title: include file
description: include file
services: api-management
author: vladvino

ms.assetid: 1b813833-39c8-46be-8666-fd0960cfbf04
ms.service: api-management
ms.topic: include
ms.date: 03/22/2018
ms.author: vlvinogr
ms.custom: include file

---

| Resource | Limit |
| --- | --- |
| Maximum number of scale units | 10 per region<sup>1</sup> |
| Cache size | 5 GB per unit<sup>2</sup> |
| Concurrent backend connections<sup>3</sup> per HTTP authority | 2048 per unit<sup>4</sup> |
| Maximum cached response size | 2MB |
| Maximum policy document size | 256KB<sup>5</sup> | 
| Maximum custom gateway domains per service instance<sup>6</sup> | 20 | 
| Maximum number of service instances per subscription<sup>7</sup> | 5 | 
| Maximum number of subscriptions per service instance<sup>7</sup> | 500 |
| Maximum number of client certificates per service instance<sup>7</sup> | 50 | 
| Maximum number of APIs per service instance<sup>7</sup> | 50 | 
| Maximum number of API operations per service instance<sup>7</sup> | 1000 | 
| Maximum	total request duration<sup>7</sup> | 30 seconds | 
| Maximum buffered payload size<sup>7</sup> | 2MB | 


<sup>1</sup> Scaling limits depend on the pricing tier. To see the pricing tiers and their scaling limits go to  [API Management Pricing](https://azure.microsoft.com/pricing/details/api-management/).<br/>
<sup>2</sup> Per unit cache size depends on the pricing tier. To see the pricing tiers and their scaling limits go to  [API Management Pricing](https://azure.microsoft.com/pricing/details/api-management/).<br/>
<sup>3</sup> Connections are pooled and re-used, unless explicitly closed by the backend.<br/>
<sup>4</sup> Per unit of the Basic, Standard and Premium tiers. The Developer tier is limited to 1024. Doesn't apply to the Consumption tier.<br/> 
<sup>5</sup> In the Basic, Standard and Premium tiers. In the Consumption tier policy document size is limited to 4KB.<br/>
<sup>6</sup> Available in the Premium tier only.<br/>
<sup>7</sup> Applies to the Consumption tier only.<br/>



