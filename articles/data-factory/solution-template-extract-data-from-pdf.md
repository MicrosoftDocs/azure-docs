---
title: Extract data from PDF
description: Learn how to use a solution template to extract data from a PDF source using Azure Data Factory.
author: n0elleli
ms.author: noelleli
ms.reviewer: 
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 08/10/2023
---

# Extract data from PDF

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to extract data from a PDF source using Azure Data Factory and Azure AI Document Intelligence. 

## About this solution template

This template analyzes data from a PDF URL source using two Azure AI Document Intelligence calls. Then, it transforms the output to readable tables in a dataflow and outputs the data to a storage sink.  

This template contains two activities:  
-	**Web Activity** to call Azure AI Document Intelligence's layout model API
-	**Data flow** to transform extracted data from PDF

This template defines 4 parameters: 
-  *FormRecognizerURL* is the Azure AI Document Intelligence URL ("https://{endpoint}/formrecognizer/v2.1/layout/analyze"). Replace {endpoint} with the endpoint that you obtained with your Azure AI Document Intelligence subscription. You need to replace the default value with your own URL.
-  *FormRecognizerKey* is the Azure AI Document Intelligence subscription key. You need to replace the default value with your own subscription key.
-  *PDF_SourceURL* is the URL of your PDF source. You need to replace the default value with your own URL. 
-  *outputFolder* is the name of the folder path where you want your files to be in your destination store. You need to replace the default value with your own folder path.

## Prerequisites

* Azure AI Document Intelligence Resource Endpoint URL and Key (create a new resource [here](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer))

## How to use this solution template

1. Go to template **Extract data from PDF**. Create a **New** connection to your Azure AI Document Intelligence resource or choose an existing connection.

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-1.png" alt-text="Screenshot of how to create a new connection or select an existing connection from a drop down menu to Azure AI Document Intelligence in template set up.":::
	
    In your connection to Azure AI Document Intelligence, make sure to add a **Linked service Parameter**. You will need to use this parameter as your dynamic **Base URL**.
   
   :::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-9.png" alt-text="Screenshot of where to add your Azure AI Document Intelligence linked service parameter.":::
   
   :::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-8.png" alt-text="Screenshot of the linked service base URL that references the linked service parameter.":::

2. Create a **New** connection to your destination storage store or choose an existing connection.

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-2.png" alt-text="Screenshot of how to create a new connection or select existing connection from a drop down menu to your sink in template set up.":::
   
3. Select **Use this template**. 

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-3.png" alt-text="Screenshot of how to complete the template by clicking use this template at the bottom of the screen.":::

4. You should see the following pipeline: 

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-4.png" alt-text="Screenshot of pipeline view with web activity linking to a dataflow activity.":::

5. Select **Debug**.

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-5.png" alt-text="Screenshot of how to Debug pipeline using the debug button on the top banner of the screen.":::

6. Enter parameter values, review results, and publish. 

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-6.png" alt-text="Screesnhot of where to enter pipeline debug parameters on a panel to the right.":::

	:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf-7.png" alt-text="Screenshot of the results that return when the pipeline is triggered.":::

## Next steps
- [What's New in Azure Data Factory](whats-new.md)
- [Introduction to Azure Data Factory](introduction.md)
