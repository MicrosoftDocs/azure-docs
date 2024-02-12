---
title: Troubleshoot automated ML experiments
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and resolve issues in your automated machine learning experiments.
author: PhaniShekhar
ms.author: phmantri
ms.reviewer: ssalgado
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.date: 12/21/2023
ms.topic: troubleshooting
ms.custom: automl, sdkv2
---

# Troubleshoot automated ML experiments

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this guide, learn how to identify and resolve issues in your automated machine learning experiments.

## Troubleshoot automated ML for Images and NLP in Studio

If there is a job failure for Automated ML for Images and NLP, you can use the following steps to understand the error.
1. In the studio UI, the AutoML job should have a failure message indicating the reason for failure.
2. For more details, go to the child job of this AutoML job. This child run is a HyperDrive job.
3. In the **Trials** tab, you can check all the trials done for this HyperDrive run.
4. Go to the failed trial job.
5. These jobs should have an error message in the **Status** section of the **Overview** tab indicating the reason for failure.
   Select **See more details** to get more details about the failure.
6. Additionally you can view **std_log.txt** in the **Outputs + Logs** tab to look at detailed logs and exception traces.

If your Automated ML runs uses pipeline runs for trials, follow these steps to understand the error.
1. Follow the steps 1-4 above to identify the failed trial job.
2. This run should show you the pipeline run and the failed nodes in the pipeline are marked with Red color.
:::image type="content" source="./media/how-to-troubleshoot-auto-ml/pipeline-graph-sample.jpg" alt-text="Diagram that shows a failed pipeline job." lightbox="./media/how-to-troubleshoot-auto-ml/pipeline-graph-sample.jpg":::
3. Select the failed node in the pipeline.
4. These jobs should have an error message in the **Status** section of the **Overview** tab indicating the reason for failure.
   Select **See more details** to get more details about the failure.
5. You can look at **std_log.txt** in the **Outputs + Logs** tab to look at detailed logs and exception traces.

## Next steps

+ [Train computer vision models with automated machine learning](how-to-auto-train-image-models.md).
+ [Train natural language processing models with automated machine learning](how-to-auto-train-nlp-models.md).
