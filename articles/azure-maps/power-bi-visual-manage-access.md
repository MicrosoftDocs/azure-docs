---
title: Manage Azure Maps Power BI visual within your organization
titleSuffix: Microsoft Azure Maps
description: This article demonstrates how to manage Azure Maps Power BI visual within your organization.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 06/13/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Manage Azure Maps Power BI visual within your organization

Power BI provides the ability for designers and tenant administrators to manage the use of the Azure Maps visual.

## Tenant admin options

Tenant administrators can manage Azure Maps visuals via **Settings** &gt; **Admin** **Portal** &gt; **Tenant settings**. These settings control access and data processing for the entire organization.

### Enable the Azure Maps visual

When enabled, users in the organization can create and view reports that use the Azure Maps visual.

- Microsoft temporarily stores and processes your data for essential services like translating locations into latitudes and longitudes.
- If Azure Maps services are unavailable in your region, your data can be processed outside your tenant's geographic region, compliance boundary, or national cloud instance.

:::image type="content" source="media/power-bi-visual/settings-enable-visual.png" alt-text="Screenshot of the tenant settings to enable the Azure Maps visual in the Power BI admin portal.":::

### Process data outside your region or boundary

When enabled, data sent to Azure Maps can be processed outside your tenant’s geographic region, compliance boundary, or national cloud instance. This is required because Azure Maps services aren't available in all geographic regions or national clouds.

- Enable this setting to access more capabilities provided by Microsoft Online Services subprocessors.
- Disabling this setting can limit Azure Maps features if services are unavailable in your compliance region.

:::image type="content" source="media/power-bi-visual/settings-enable-subprocessing.png" alt-text="Screenshot showing that data sent to Azure Maps can be processed outside your tenant’s geographic region, compliance boundary, or national cloud instance.":::

### Allow Microsoft subprocessors to process data

Some Azure Maps features, like the selection tool, can utilize third-party mapping capabilities provided by Microsoft Online Services subprocessors.

- Only essential data is shared with these subprocessors, and is used solely to support Azure Maps services.
- Data can be stored and processed in the United States or other countries where Microsoft or its subprocessors operate.
- To enable this setting, "Data sent to Azure Maps can be processed outside your tenant’s geographic region, compliance boundary, or national cloud instance" must also be enabled.

:::image type="content" source="media/power-bi-visual/settings-processed-by-subprocessors.png" alt-text="Screenshot showing that data sent to Azure Maps can be processed by Microsoft Online Services subprocessors.":::

> [!NOTE]
> Azure Maps and subprocessors don't handle personally identifiable information (PII). The data sent to Azure Maps only includes location-related information, such as coordinates or place names, and doesn't include user identities or report consumer information.

## Next steps

Learn more about Azure Maps Power BI visual:

> [!div class="nextstepaction"]
> [Understanding layers in Azure Maps Power BI visual](power-bi-visual-understanding-layers.md)
