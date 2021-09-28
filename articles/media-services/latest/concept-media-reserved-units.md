---
title: Media reserved units - Azure 
description: Media reserved units allow you to scale media process and determine the speed of your media processing tasks.
services: media-services
documentationcenter: ''
author: jiayali-ms
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/25/2021
ms.author: inhenkel

---
# Media Reserved Units

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Media Reserved Units (MRUs) were previously used in Azure Media Services v2 to control encoding concurrency and performance. You no longer need to manage MRUs or request quota increases for any media services account as the system will automatically scale up and down based on load. You will also see performance that is equal to or improved in comparison to using MRUs. 

If you have an account that was created using a version prior to the 2020-05-01 API, you will still have access to API’s for managing MRUs, however none of the MRU configuration that you set will be used to control encoding concurrency or performance. If you don’t see the option to manage MRUs in the Azure portal, you have an account that was created with the 2020-05-01 API or later. 

## Billing

While there were previously charges for Media Reserved Units, as of April 17, 2021 there are no longer any charges for accounts that have configuration for Media Reserved Units. For more information on billing for encoding jobs, please see [Encoding video and audio with Media Services](encoding-concept.md)

For accounts created in with the **2020-05-01** version of the API (i.e. the v3 version) or through the Azure portal, scaling and media reserved units are no longer required. Scaling is now automatically handled by the service internally. Media reserved units are no longer needed or supported for any Azure Media Services account. See [Media reserved units (legacy)](concept-media-reserved-units.md) for additional information.

## See also

* [Migrate from Media Services v2 to v3](migrate-v-2-v-3-migration-introduction.md)
* [Scale Media Reserved Units with CLI](media-reserved-units-cli-how-to.md)
