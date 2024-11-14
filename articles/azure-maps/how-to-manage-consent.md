---
title: Microsoft Azure Maps consent management
description: This article describes how to configure the global data processing settings to comply with data residency laws in Azure Maps.
author: pbrasil
ms.author: peterbr
ms.date: 11/15/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: manage-account
---

# Consent management

In some cases, it may be necessary to process requests in a region different from your Azure Maps Account's region due to local data residency laws. When this happens, you can grant Azure Maps consent to process your data in other specified regions.

This article guides you on configuring global data processing settings in your Azure Maps account in the Azure portal to comply with data residency laws. This allows Azure Maps to process address requests within the specified country's region, regardless of your Azure Maps Account's region.

> [!IMPORTANT]
> If your scenarios don't involve South Korea data, there is no need to enable cross-region processing. This requirement is specific to South Korea due to its data residency laws.

## Configure global data processing in the Azure portal

The Azure Maps Resource location is enabled by default and can be configured in the **Process Data Globally** page of the Azure portal.

To give consent to one or more regions:

1. Sign in to your Azure Maps Account in the [Azure portal].
1. In **Settings**, select **Process data globally**.

   A map of the world appears with a plus sign for each region that can be selected.

   :::image type="content" source="./media/consent-management/process-data-globally.png" lightbox="./media/consent-management/process-data-globally.png" alt-text="Screenshot showing the process data globally screen in the Azure portal.":::

1. Additionally you can select **Add region**, then select the region you wish to add or remove.

   :::image type="content" source="./media/consent-management/select-korea-central.png" lightbox="./media/consent-management/select-korea-central.png" alt-text="Screenshot showing the process data globally screen in the Azure portal with the Korea Central region selected.":::

1. Once you all desired regions are chosen, select **Save**.

   :::image type="content" source="./media/consent-management/save-selection.png" lightbox="./media/consent-management/save-selection.png" alt-text="Screenshot showing the save button highlighted in process data globally screen in the Azure portal.":::

Once your updates are saved, one or more new selections appear in the list of regions.

:::image type="content" source="./media/consent-management/new-region-added.png" lightbox="./media/consent-management/new-region-added.png" alt-text="Screenshot showing the process data globally screen in the Azure portal with the Korea Central region added to the list of supported regions.":::

> [!NOTE]
> Your data is always stored in the region you created your Azure Maps Account, regardless of your global data processing settings.

<!--## Configure global data processing using ARM deployment template-->

## Next steps

Azure Maps is a global service that allows specifying a geographic scope, which enables limiting data residency to specific regions.

> [!div class="nextstepaction"]
> [Azure Maps service geographic scope]


[Azure portal]: https://ms.portal.azure.com
[Azure Maps service geographic scope]: geographic-scope.md