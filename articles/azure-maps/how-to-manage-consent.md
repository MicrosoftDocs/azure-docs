---
title: Enable South Korea addresses in Azure Maps
titleSuffix: Microsoft Azure Maps consent management
description: This article describes how to configure the global data processing settings to enable South Korea addresses in Azure Maps.
author: pbrasil
ms.author: peterbr
ms.date: 11/11/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: manage-account
---

# Enable South Korea addresses in Azure Maps

To comply with South Korea's data residency laws, Azure Maps processes requests for South Korean addresses within the South Korean region. Customers can store private information in the region their Azure Maps account exists while sending specific South Korea data requests across regions.

This article explains how to configure the global data processing settings in your Azure Maps account using the Azure portal.

> [!NOTE]
> This enables the configuration of where data processing occurs and does not impact where data is stored.

## Understanding geographic scope and consent

Azure Maps is a global service that allows specifying a geographic scope, which enables limiting data residency to specific regions. For more information, see [Azure Maps service geographic scope](geographic-scope.md).

In certain circumstances, it may be necessary to enable requests to be processed in a different region. For example, to expand coverage in a particular area that is restricted due to local data residency laws. In such cases, Azure Maps can be granted consent to process your data in other specified regions.

> [!IMPORTANT]
> If your scenarios don't involve South Korea data, you do not need to enable cross region processing. This is a specific regional requirement due to data residency laws.

## Configure global data processing

The Azure Maps Resource location is enabled by default and can be configured in the **Process Data Globally** page of the Azure portal.

To give consent to one or more regions:

1. Sign in to your Azure Maps Account in the Azure portal.
1. In settings, select **Process data globally**.
1. In the map that appears, select the regions you wish to add or remove.

   :::image type="content" source="./media/consent-management/process-data-globally.png" lightbox="./media/consent-management/process-data-globally.png" alt-text="Screenshot showing the process data globally screen in the Azure portal.":::

1. Once all desired regions are chosen, select **Save**.

> [!NOTE]
> Your data is always stored in the region you created your Azure Maps Account, regardless of your global data processing settings.
