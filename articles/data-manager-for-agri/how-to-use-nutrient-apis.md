---
title: Use Data Manager for Agriculture Plant Tissue Nutrients APIs 
description: Learn how to store nutrient data in Azure Data Manager for Agriculture
author: gourdsay #Required; your GitHub user alias, with correct capitalization.
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Using Tissue Samples Data

Analyzing the nutrient composition of the crop is vital to ensure good harvest. Issue diagnosis or preventive measure selection are based on nutrient analysis. The grower takes samples from different parts of the farm and sends them to the lab for analysis. The lab report covers macro and micro nutrients in its analysis and corrective measures are suggested. 

Here's how we have modeled tissue analysis in Azure Data Manager for Agriculture:

![Relationships](./media/schema.PNG)

* Step 1: Create a 'plant tissue analysis' resource per sample.
* Step 2: For each nutrient that is being tested for, create a 'nutrient analysis' resource with 'plant tissue analysis' as parent (created in step 1). 
* Step 3: Upload analysis reports from the lab (for example: pdfs, xlsx files) as attachments associated with the 'plant tissue analysis' resource created in step 1. 
* Step 4: If you have location (long/lat) data, then create a point boundary with 'plant tissue analysis' as parent (created in step 1). 

>[Note]
> A 'plant tissue analysis' resource is created per sample, only-one point boundary can be associated with it.

## Working with tissue sampling APIs

* Plant tissue analysis APIs
* Nutrient analysis APIs 
* Attachment APIs 
* Boundary APIs 
