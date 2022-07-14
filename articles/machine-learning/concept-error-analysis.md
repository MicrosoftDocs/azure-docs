---
title: Assess errors in ML models 
titleSuffix: Azure Machine Learning
description: Assess model error distributions in different cohorts of your dataset with the Responsible AI dashboard's integration of Error Analysis.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.date: 05/10/2022
ms.custom: responsible-ml, event-tier1-build-2022
---
# Assess errors in ML models (preview)

One of the most apparent challenges with current model debugging practices is using aggregate metrics to score models on a benchmark. Model accuracy may not be uniform across subgroups of data, and there might exist input cohorts for which the model fails more often. The direct consequences of these failures are a lack of reliability and safety, unfairness, and a loss of trust in machine learning altogether.

:::image type="content" source="./media/concept-error-analysis/error-analysis.png" alt-text="Diagram showing benchmark and machine learning model point to accurate then to different regions fail for different reasons.":::

Error Analysis moves away from aggregate accuracy metrics, exposes the distribution of errors to developers in a transparent way, and enables them to identify & diagnose errors efficiently.

The Error Analysis component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) provides machine learning practitioners with a deeper understanding of model failure distribution and assists them with quickly identifying erroneous cohorts of data. It contributes to the “identify” stage of the model lifecycle workflow through a decision tree that reveals cohorts with high error rates and a heatmap that visualizes how a few input features impact the error rate across cohorts. Discrepancies in error might occur when the system underperforms for specific demographic groups or infrequently observed input cohorts in the training data.

The capabilities of this component are founded by [Error Analysis](https://erroranalysis.ai/)) capabilities on generating model error profiles.  

Use Error Analysis when you need to:

- Gain a deep understanding of how model failures are distributed across a given dataset and across several input and feature dimensions.
- Break down the aggregate performance metrics to automatically discover erroneous cohorts and take targeted mitigation steps.

## How are error analyses generated

Error Analysis identifies the cohorts of data with a higher error rate versus the overall benchmark error rate. The dashboard allows for error exploration by using either a decision tree or a heatmap guided by errors.

## Error tree

Often, error patterns may be complex and involve more than one or two features. Therefore, it may be difficult for developers to explore all possible combinations of features to discover hidden data pockets with critical failure. To alleviate the burden, the binary tree visualization automatically partitions the benchmark data into interpretable subgroups, which have unexpectedly high or low error rates. In other words, the tree uses the input features to maximally separate model error from success. For each node defining a data subgroup, users can investigate the following information:

- **Error rate**: a portion of instances in the node for which the model is incorrect. This is shown through the intensity of the red color.
- **Error coverage**: a portion of all errors that fall into the node. This is shown through the fill rate of the node.
- **Data representation**: number of instances in the node. This is shown through the thickness of the incoming edge to the node along with the actual total number of instances in the node.

## Error Heatmap

The view slices the data based on a one- or two-dimensional grid of input features. Users can choose the input features of interest for analysis. The heatmap visualizes cells with higher error with a darker red color to bring the user’s attention to regions with high error discrepancy. This is beneficial especially when the error themes are different in different partitions, which happen frequently in practice. In this error identification view, the analysis is highly guided by the users and their knowledge or hypotheses of what features might be most important for understanding failure.

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI ](how-to-responsible-ai-dashboard-ui.md)
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md)) based on the insights observed in the Responsible AI dashboard.
