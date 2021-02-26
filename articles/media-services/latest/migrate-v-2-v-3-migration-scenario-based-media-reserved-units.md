---
title: Media Reserved Units (MRUs) migration guidance
description: This article gives you MRU scenario based guidance that will assist you in migrating from Azure Media Services V2 to V3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 1/14/2020
ms.author: inhenkel
---

# Media Reserved Units (MRUs) scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

This article gives you MRU scenario based guidance that will assist you in migrating from Azure Media Services V2 to V3.

- For new V3 accounts created in the Azure portal, or with the 2020-05-01 version of the V3 API, you no longer are required to set Media Reserved Units (MRUs). The system will now automatically scale up and down based on load.
- If you have a V3 or V2 account that was created before the 2020-05-01 version of the API, you can still control the concurrency and performance of your jobs using Media Reserved Units. For more information, see Scaling Media Processing. You can manage the MRUs using CLI 2.0 for Media Services V3, or using the Azure portal.  
- If you don't see the option to manage MRUs in the Azure portal, you're running an account that was created with the 2020-05-01 API or later.
- If you are familiar with setting your MRU type to S3, your performance will improve or remain the same.
- If you are an existing V2 customer, you need to create a new V2 account to support your existing application prior to the completion of  migration. 
- Indexer V1 or other media processors that are not fully deprecated yet may need to be enabled again. 

For more information about MRUs, see [Media Reserved Units](concept-media-reserved-units.md) and [How to scale media reserved units](media-reserved-units-cli-how-to.md).

## MRU concepts, tutorials and how to guides

### Concepts

[Media Reserved Units](concept-media-reserved-units.md)

### How to guides

[How to scale media reserved units](media-reserved-units-cli-how-to.md)

## Samples

You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).

## Next steps

[!INCLUDE [migration guide next steps](./includes/migration-guide-next-steps.md)]
