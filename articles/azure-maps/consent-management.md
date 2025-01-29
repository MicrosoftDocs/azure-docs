---
title: Microsoft Azure Maps consent management
description: This article describes consent management in Azure Maps as it applies to data residency laws.
author: pbrasil
ms.author: peterbr
ms.date: 11/19/2024
ms.topic: conceptual
ms.service: azure-maps
ms.subservice: manage-account
---

# Consent management

Azure Maps is a global service that is available worldwide. When creating your Azure Maps account, you select a _Region_. The Region selection is the accounts geographic scope, which allows you to limit data residency to the selected region. All requests (including input data) are processed and stored exclusively in the specified geographic area (region).

In some cases, you will need to enable your search requests to be processed in a region or geography other than the one your Azure Maps Account is in. For example, due to local data residency laws, all South Korean addresses must be processed in South Korea, which is the _Korea Central_ region in Azure Maps. To do this, you must give Azure Maps consent to process your data in the _Korea Central_ region. For more information on how to give Azure maps consent to process data in a different region, see [Configure global data processing].

For more information on geographic scope in Azure Maps, see [Azure Maps service geographic scope].

## Frequently asked questions

**My scenario doesn't have any South Korea data. Do I still need to enable cross region processing to use Azure Maps?**

No, if your scenario doesn't require South Korea data, you don't need to enable cross region processing. This is a specific regional requirement due to data residency laws.

**Where will my data be stored if I enable cross region processing in South Korea?**

Giving consent to process data in a different region will not affect where your metadata and logs are stored. Those are still contained within the region specified when creating your Azure Maps Account.

## Next steps

> [!div class="nextstepaction"]
> [Configure global data processing]

[Azure Maps service geographic scope]: geographic-scope.md
[Configure global data processing]: how-to-manage-consent.md