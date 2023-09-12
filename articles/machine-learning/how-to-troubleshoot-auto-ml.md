---
title: Troubleshoot automated ML experiments
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and resolve issues in your automated machine learning experiments.
author: PhaniShekhar
ms.author: phmantri
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.date: 10/21/2021
ms.topic: troubleshooting
ms.custom: automl, sdkv2
---

# Troubleshoot automated ML experiments

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this guide, learn how to identify and resolve issues in your automated machine learning experiments.

## Troubleshoot automated ML for Images and NLP in Studio

In case of failures in runs for Automated ML for Images and NLP, you can use the following steps to understand the error.
1. In the studio UI, the AutoML run should have a failure message indicating the reason for failure.
2. For more details, go to the child run of this AutoML run. This child run is a HyperDrive run.
3. In the "Trials" tab, you can check all the trials done for this HyperDrive run.
4. Go to the failed trial runs.
5. These runs should have an error message in the "Status" section of the "Overview" tab indicating the reason for failure.
   Please click on "See more details" to get more details about the failure.
6. You can look at "std_log.txt" in the "Outputs + Logs" tab to look at detailed logs and exception traces.

If your Automated ML runs uses pipeline runs for trials, you can follow the following steps to understand the error.
1. Please follow the steps 1-4 above to identify the failed trial run.
2. This run should show you the pipeline run and the failed nodes in the pipeline are marked with Red color.
:::image type="content" source="./media/how-to-troubleshoot-auto-ml/pipeline-graph-sample.jpg" alt-text="Diagram that shows a failed pipeline run." lightbox="./media/how-to-troubleshoot-auto-ml/pipeline-graph-sample.jpg":::
3. Double click the failed node in the pipeline.
4. These runs should have an error message in the "Status" section of the "Overview" tab indicating the reason for failure.
   Please click on "See more details" to get more details about the failure.
5. You can look at "std_log.txt" in the "Outputs + Logs" tab to look at detailed logs and exception traces.

## Next steps

+ [Train computer vision models with automated machine learning](how-to-auto-train-image-models.md).
+ [Train natural language processing models with automated machine learning](how-to-auto-train-nlp-models.md).
