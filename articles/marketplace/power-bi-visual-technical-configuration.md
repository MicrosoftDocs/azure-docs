---
title: Set up Power BI visual offer technical configuration in Partner Center for Microsoft AppSource
description: Learn how to set up Power BI visual offer technical configuration in Partner Center for Microsoft AppSource.
author: posurnis
ms.author: posurnis
ms.reviewer: pooja.surnis
ms.service: powerbi
ms.subservice: powerbi-custom-visuals
ms.topic: how-to
ms.date: 09/21/2021
---

# Set up Power BI visual offer technical configuration

On the **Technical configuration** tab, provide the files needed for the Power BI visual offer.

:::image type="content" source="media/power-bi-visual/technical-configuration.png" alt-text="Shows the Technical Configuration page in Partner Center.":::

## PBIVIZ package

[Pack your Power BI visual](/power-bi/developer/visuals/package-visual) into a PBIVIZ package containing all the required metadata:

- Visual name
- Display name
- GUID (see note below)
- Version (see note below)
- Description
- Author name and email

> [!NOTE]
> If you are updating or resubmitting a visual:
> - The GUID must remain the same.
> - The version number should be incremented between package updates.

## Sample PBIX report file

To showcase your visual offer, help users get familiar with the visual. Highlight the value the visual brings to the user and give examples of usage and formatting options. Add a "hints" page at the end with tips, tricks, and things to avoid. The sample PBIX report file must work offline, without any external connections.

> [!NOTE]
> - The PBIX report must use the same version of the visual as the PBIVIZ.
> - The PBIX report file must work offline, without any external connections.

Select **Save draft** before skipping in the left-nav menu to the **Offer management** tab.

## Next steps

- [Offer management](power-bi-visual-manage-names.md)
