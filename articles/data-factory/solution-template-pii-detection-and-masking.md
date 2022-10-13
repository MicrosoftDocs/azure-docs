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
ms.date: 09/22/2022
---

# PII detection and masking

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to detect and mask PII data in your data flow with Azure Cognitive Services. 

## About this solution template

This template retrieves a dataset from Azure Data Lake Storage Gen2 source. Then, a request body is created with a derived column and an external call transformation calls Azure Cognitive Services and masks PII before loading to the destination sink. 

The template contains one activity: 
-  **Data flow** to detect and mask PII data

This template defines 3 parameters: 
-  *sourceFileSystem* is the folder path where files are read from the source store. You need to replace the default value with your own folder path.
-  *sourceFilePath* is the subfolder path where files are read from the source store. You need to replace the default value with your own subfolder path.
-  *sourceFileName* is the name of the file that you would like to transform. You need to replace the default value with your own file name.

## Prerequisites

*  Azure Cognitive Services Resource Endpoint URL and Key (create a new resource [here](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics))

## How to use this solution template

1. Go to template **PII detection and masking**. Create a **New** connection to your source storage store or choose an existing connection. The source storage store is where you want to read files from.

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-1.png" alt-text="Screenshot of template set up page where you can create a new connection or select an existing connection to the source from a drop down menu.":::

2.	Create a **New** connection to your destination storage store or choose an existing connection.

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::

3. Select **Use this template**. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-3.png" alt-text="Screenshot of button in bottom left corner to finish creating pipeline.":::

4. You should see the following pipeline: 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/PII-detection-and-masking-4.png" alt-text="Screenshot of pipeline view with one dataflow activity.":::

5. Clicking into the dataflow activity will show the following dataflow: 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-5.png" alt-text="Screenshot of the dataflow view with a source leading to three transformations and then a sink.":::

6. Turn on **Data flow debug**. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-6.png" alt-text="Screenshot of the Data flow debug button found in the top banner of the screen.":::

7. Update **Parameters** in **Debug Settings** and **Save**. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-7.png" alt-text="Screenshot of the Debug settings button on the top banner of the screen to the right of debug button.":::
  
	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-7b.png" alt-text="Screenshot of where to update parameters in Debug settings in a panel on the right side of the screen.":::

8. Preview the results in **Data Preview**. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-8.png" alt-text="Screenshot of dataflow data preview at the bottom of the screen.":::
  
9. When data preview results are as expected, update the **Parameters**.

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-9.png" alt-text="Screenshot of dataflow parameters at the bottom of the screen under Parameters.":::

10. Return to pipeline and select **Debug**. Review results and publish. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-10.png" alt-text="Screenshot of the results that return after the pipeline is triggered.":::

## Next steps

- [What's New in Azure Data Factory](whats-new.md)
- [Introduction to Azure Data Factory](introduction.md)





