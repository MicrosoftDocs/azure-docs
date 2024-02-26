---
title: Use plant tissue nutrients APIs in Azure Data Manager for Agriculture
description: Learn how to store nutrient data in Azure Data Manager for Agriculture
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 02/14/2023
ms.custom: template-how-to
---

# Using tissue samples data

Analyzing the nutrient composition of the crop is vital to ensure good harvest. Issue diagnosis or preventive measure selection is based on nutrient analysis. The grower takes samples from different parts of the farm and sends them to the lab for analysis. The lab report covers macro and micro nutrients in its analysis and corrective measures are suggested. 

## Tissue sample model
Here's how we have modeled tissue analysis in Azure Data Manager for Agriculture:

:::image type="content" source="./media/schema-1.png" alt-text="Screenshot showing entity relationships.":::

* Step 1: Create a **plant tissue analysis** resource for every sample you get tested.
* Step 2: For each nutrient that is being tested, create a nutrient analysis resource with plant tissue analysis as parent created in step 1. 
* Step 3: Upload analysis report from the lab (for example: pdf, xlsx files) as attachment and associate with the 'plant tissue analysis' resource created in step 1. 
* Step 4: If you have location (longitude, latitude) data, then create a point geometry with 'plant tissue analysis' as parent created in step 1. 

> [!Note]
> One plant tissue analysis resource is created per sample. One point geometry can be associated with it.

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).
