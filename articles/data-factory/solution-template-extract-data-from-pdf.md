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
ms.date: 04/22/2022
---

# Extract data from PDF

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to extract data from a PDF source using Azure Data Factory and Form Recognizer. 

## About this solution template

This template analyzes data from a PDF URL source using two Azure Form Recognizer calls. Then, it transforms the output to readable tables in a dataflow and outputs the data to a storage sink.  

This template contains two activities:  
-	**Web Activity** to call Azure Form Recognizer's layout model API
-	**Data flow** to transform extracted data from PDF

This template defines 4 parameters: 
-  *FormRecognizerURL* is the Form recognizer URL ("https://{endpoint}/formrecognizer/v2.1/layout/analyze"). Replace {endpoint} with the endpoint that you obtained with your Form Recognizer subscription. You need to replace the default value with your own URL.
-  *FormRecognizerKey* is the Form Recognizer subscription key. You need to replace the default value with your own subscription key.
-  *PDF_SourceURL* is the URL of your PDF source. You need to replace the default value with your own URL. 
-  *outputFolder* is the name of the folder path where you want your files to be in your destination store. You need to replace the default value with your own folder path.

## Prerequisites

*	Azure Form Recognizer Resource (endpoint URL and key)
> * Create a new resource [here](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer)


## How to use this solution template

1. Go to template **Extract data from PDF**. Create a **New** connection to your source storage store or choose an existing connection. The source storage store is where you want to copy files from.

:::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf1.png" alt-text="Create a new connection or select an existing connection to the source":::

2.	Create a **New** connection to your destination storage store or choose an existing connection.

 :::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf2.png" alt-text="Create a new connection or select existing connection to Cognitive Services":::

3. Select **Use this template**. 

  :::image type="content" source="solution-template-extract-data-from-pdf/extract-data-from-pdf3.png" alt-text="Use this template":::

4. You should see the following pipeline: 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-4.png" alt-text="Pipeline view":::

5. Select **Debug**.

  :::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf5.png" alt-text="Debug pipeline":::

6. Enter parameter values, review results, and publish. 

  :::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf6.png" alt-text="Enter pipeline debug parameters":::

  :::image type="content" source="media/solution-template-extract-data-from-pdf/extract-data-from-pdf7.png" alt-text="Screenshot that shows the results that return when the pipeline is triggered.":::
 

