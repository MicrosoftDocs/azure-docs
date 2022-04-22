---
title: PII detection and masking
description: Learn how to use a solution template to detect and mask PII data using Azure Data Factory.
author: n0elleli
ms.author: noelleli
ms.reviewer: 
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 04/22/2022
---

# PII detection and masking

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to detect and mask PII data in your data flow with Azure Cognitive Services. 

## About this solution template

This template retrieves a dataset from Azure Data Lake Storage Gen2 source. Then, it creates the request body and uses the external call transformation to call Azure Cognitive Services and mask PII before loading to the destination sink. 

The template contains one activity: 
-	**Data flow** to detect and mask PII data

This template defines 3 parameters: 
-  *sourceFileSystem* is the folder path where you can read the files from the source store. You need to replace the default value with your own folder path.
-  *sourceFilePath* is the subfolder path where you can read the files from the source store. You need to replace the default value with your own subfolder path.
-  *sourceFileName* is the name of the file that you would like to transform. You need to replace the default value with your own file name.

## Prerequisites

-	Azure Cognitive Services Resource (endpoint URL and key)
> - Create a new resource [here](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics)

## How to use this solution template

1. Go to template **PII detection and masking**. Create a **New** connection to your source storage store or choose an existing connection. The source storage store is where you want to copy files from.

:::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-1.png" alt-text="Create a new connection or select an existing connection to the source":::

2.	Create a **New** connection to your destination storage store or choose an existing connection.

 :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-2.png" alt-text="Create a new connection or select existing connection to Cognitive Services":::

3. Select **Use this template**. 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-3.png" alt-text="Use this template":::

4. You should see the following pipeline: 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-4.png" alt-text="Pipeline view":::

5. Clicking into the dataflow activity will show the following dataflow: 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-5.png" alt-text="Dataflow view":::

6. Turn on **Data flow debug**. 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-3.png" alt-text="Data flow debug button":::

7. Update **Parameters** in **Debug Settings** and **Save**. 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-7.png" alt-text="Debug settings":::
  
  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-7b.png" alt-text="Debug settings parameters":::

8. Preview the results in **Data Preview**. 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-8.png" alt-text="Dataflow data preview":::
  
9. When data preview results are as expected, update the **Parameters**.

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-9.png" alt-text="Update dataflow parameters":::

10. Return to pipeline and select **Debug**. Review results. 

  :::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-10.png" alt-text="Screenshot that shows the results that return when the pipeline is triggered.":::






