---
title: Azure Data Factory Mapping Create Data Flow
description: An overview explanation of Creating Mapping Data Flows in Azure Data Factory
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/12/2019
--- 

# Create Data Flow

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Mapping Data Flows in ADF provide a way to transform data at scale without any coding required. Design a data transformation job in the ADF Data Flow designer by constructing a series of Source Transformations, followed by data transformation steps, then sink your results in a Sink Transformation.

## Getting Started

Start by creating a new ADF V2 factory from the Azure Portal. Click on the Author & Monitor tile. 
Once you are in the ADF UI, we have sample Data Flows available from the ADF Template Gallery. In ADF, create "Pipeline from Template" and select the Data Flow category from the template gallery.

<img src="media/data-flow/template.png" width="500">

You will be prompted to enter your Azure Blob Storage account information.

<img src="media/data-flow/template2.png" width="500">

[The data used for these samples can be found here](https://github.com/kromerm/adfdataflowdocs/tree/master/sampledata). Download the sample data and store the files in your Azure Blob storage accounts so that you can execute the samples.

Use the Craete Resource "plus sign" button in the ADF UI to create Data Flows

<img src="media/data-flow/newresource.png" width="500">

