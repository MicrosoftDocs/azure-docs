---
title: Use Data Manager for Agriculture Plant Tissue Nutirents APIs 
description: Learn how to store nutrient data in Azure Data Manager for Agriculture
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Using Tissue Samples Data

Analyzing the nutrient composition of the crop is vital to ensure good harvest. Nutrient analysis can be done either as a preventive measure or for diagnostic purposes. Samples are taken from various places in the farm and sent to lab for analysis. Reports are provided per sample. The analysis covers macro and micro nutrients. Corrective measures (application of deficient nutrients) are suggested. 

In Azure Data Manager for Agriculture, plant tissue analysis is modeled as below.

![Schema](./media/schema.PNG)


* Step 1: Users have to create a 'plant tissue analysis' resource per sample.
* Step 2: For each nutrient that is being tested for, create a 'nutrient analysis' resource with parent as the 'plant tissue analysis' resource created in step 1. 
* Step 3: If users have analysis reports from the lab (Ex: pdfs, xlsx, etc.), the same should be uploaded as attachments and associated with the 'plant tissue analysis' resource created in step 1. 
* Step 4: If users have information about the location (long/lat) from where the sample was taken, they should create a point boundary with parent as the 'plant tissue analysis' resource created in step 1. Since a 'plant tissue analysis' resource is created per sample, only one point boundary can be associated with a 'plant tissue analysis'.


&nbsp;

## Working with tissue sampling APIs

* Plant tissue analysis APIs - Click [here](./REST%20APIs/2021-07-31-preview/plant%20tissue%20analyses/)
* Nutrient analysis APIs - Click [here](./REST%20APIs/2021-07-31-preview/nutrient%20analyses/)
* Attachment APIs - Click [here](../farm%20hierarchy/REST%20APIs/2021-07-31-preview/attachments/)
* Boundary APIs - Click [here](../farm%20hierarchy/REST%20APIs/2021-07-31-preview/boundaries/)
