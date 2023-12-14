---
title: Azure CDN POP locations by region | Microsoft Docs
description: This article lists Azure CDN POP locations, sorted by region, for Azure CDN products.
services: cdn
author: duongau
manager: kumud
ms.assetid: 669ef140-a6dd-4b62-9b9d-3f375a14215e
ms.service: azure-cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 05/30/2023
ms.author: duau
ms.custom: references_regions

---
# Azure CDN Coverage by Metro 
> [!div class="op_single_selector"]
> * [POP locations by region](cdn-pop-locations.md)
> * [Edgio POP locations by abbreviation](cdn-pop-abbreviations.md)
> * [Microsoft POP locations by abbreviation](microsoft-pop-abbreviations.md)
>

This article lists current metros containing point-of-presence (POP) locations, sorted by region, for Azure Content Delivery Network (CDN) products. Each metro may contain more than one POP. For example, Azure CDN from Microsoft has 192 POPs across 109 metro cities. 

> [!IMPORTANT]
> Each Azure CDN product has a distinct way of building its CDN infrastructures, hence Microsoft recommends against using POP locations to decide which Azure CDN product to use. Instead, you should consider its features and end-user performance. Test the performance with each Azure CDN product to choose the right product for your users. 
> 

## Microsoft

> [!NOTE]
> A location may contain more than one POP, noted by the number in parentheses.

[!INCLUDE [front-door-edge-location](../../includes/front-door-edge-locations.md)]

## Partners

> [!IMPORTANT]
> POP city locations for **Azure CDN from Akamai** are not individually disclosed.  
> 

| Region | Edgio | Akamai |
|--|--|--|
| North America | Guadalajara, Mexico<br />Mexico City, Mexico<br />Monterrey, Mexico<br />Puebla, Mexico<br />Querétaro, Mexico<br />Atlanta, GA, USA<br />Boston, MA, USA<br />Chicago, IL, USA<br />Dallas, TX, USA<br />Denver, CO, USA<br />Detroit, MI, USA<br />Los Angeles, CA, USA<br />Miami, FL, USA<br />New York, NY, USA<br />Philadelphia, PA, USA<br />San Jose, CA, USA<br />Minneapolis, MN, USA<br />Pittsburgh, PA, USA<br />Seattle, WA, USA<br />Ashburn, VA, USA <br />Houston, TX, USA <br />Phoenix, AZ, USA | Canada<br />Mexico<br />USA |
| South America | Buenos Aires, Argentina<br />Rio de Janeiro, Brazil<br />São Paulo, Brazil<br />Valparaíso, Chile<br />Bogota, Colombia<br />Barranquilla, Colombia<br />Medellin, Colombia<br />Quito, Ecuador<br />Lima, Peru | Argentina<br />Brazil<br />Chile<br />Colombia<br />Ecuador<br />Peru<br />Uruguay |
| Europe | Vienna, Austria<br />Copenhagen, Denmark<br />Helsinki, Finland<br />Marseille, France<br />Paris, France<br />Frankfurt, Germany<br />Milan, Italy<br />Riga, Latvia<br />Amsterdam, Netherlands<br />Warsaw, Poland<br />Madrid, Spain<br />Stockholm, Sweden<br />London, UK <br /> Manchester, UK | Austria<br />Bulgaria<br />Denmark<br />Finland<br />France<br />Germany<br />Greece<br />Ireland<br />Italy<br />Netherlands<br />Norway<br />Poland<br />Russia<br />Spain<br />Sweden<br />Switzerland<br />United Kingdom |
| Africa | Johannesburg, South Africa <br/> Nairobi, Kenya | South Africa |
| Middle East | Muscat, Oman<br />Fujirah, United Arab Emirates | Qatar<br />United Arab Emirates |
| India | Bengaluru (Bangalore), India<br />Chennai, India<br />Mumbai, India<br />New Delhi, India<br /> | India |
| Asia | Hong Kong SAR<br />Jakarta, Indonesia<br />Osaka, Japan<br />Tokyo, Japan<br />Singapore<br />Kaohsiung, Taiwan<br />Taipei, Taiwan <br />Manila, Philippines | Hong Kong SAR<br />Indonesia<br />Israel<br />Japan<br />Macao SAR<br />Malaysia<br />Philippines<br />Singapore<br />South Korea<br />Taiwan<br />Thailand<br />Türkiye<br />Vietnam |
| Australia and New Zealand | Melbourne, Australia<br />Sydney, Australia<br />Auckland, New Zealand | Australia<br />New Zealand |

## Next steps

* To get the latest IP addresses for allow listing, see the [Azure CDN Edge Nodes API](/rest/api/cdn/edge-nodes/list).
