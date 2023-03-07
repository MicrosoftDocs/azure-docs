---
author: ankitscribbles
ms.author: ankitgup
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: include
ms.date: 12/30/2022
---

## View classification details

Microsoft Purview captures important details like who applied a classification and when it was applied. To view the details, hover over the classification to revel the Classification details card. The classification details card shows the following information:

- Classification name - Name of the classification applied on the asset or column.
- Applied by - Who applied the classification. Possible values are scan and user name.
- Applied time - Local timestamp when the classification was applied via scan or manually.
- Classification type - System or custom.

Users with *Data Curator* role will see more details for classifications that were applied automatically via scan. These details will include sample count that the scanner read to classify the data and distinct data count in the sample that the scanner found.

:::image type="content" source="../media/apply-classifications/view-classification-detail.png" alt-text="Screenshot showing how to view classification detail." lightbox="../media/apply-classifications/view-classification-detail.png":::

## Impact of rescanning on existing classifications

Classifications are applied the first time, based on sample set check on your data and matching it against the set regex pattern. At the time of rescan, if new classifications apply, the column gets more classifications on it. Existing classifications stay on the column, and must be removed manually.
