---
title: Responsible AI text dashboard in Azure Machine Learning studio
titleSuffix: Azure Machine Learning
description: Learn how to use the various tools and visualization charts in the Responsible AI text dashboard in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: wenxwei
author: wenxwei
ms.date: 5/10/2023
ms.custom: responsible-ml, build-2023
---

# Responsible AI text dashboard in Azure Machine Learning studio (preview)

The Responsible AI Toolbox for text data is a customizable, interoperable tool where you can select components to perform analytical functions for Model Assessment and Debugging, which involves determining how and why AI systems behave the way they do, identifying and diagnosing issues, then using that knowledge to take targeted steps to improve their performance.

Each component has a variety of tabs and buttons. The article will help to familiarize you with the different components of the dashboard and the options and functionalities available in each.

> [!IMPORTANT]
> Responsible AI text dashboard is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Error analysis

### Cohorts

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-global-cohort.png" alt-text="Screenshot of the top section of Responsible AI Toolbox showing global cohorts." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-global-cohort.png":::

1. **Cohort settings:** allows you to view and modify the details of each cohort in a side panel.
2. **Dashboard configuration:** allows you to view and modify the layout of the overall dashboard in a side panel.
3. **Switch global cohort:** allows you to select a different cohort and view its statistics in a popup.
4. **New cohort:** allows you to add a new cohort.

Selecting the **Cohort settings** button reveals a side panel with details on all existing cohorts.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/cohort-setting.png" alt-text="Screenshot of the cohort setting side panel.":::

1. **Switch cohort:** allows you to select a different cohort and view its statistics in a popup.
2. **New cohort:** allows you to add a new cohort.
3. **Cohort list:** contains the number of data points, the number of filters, the percent of error coverage, and the error rate for each cohort.

Selecting the **Dashboard settings** button reveals a side panel with details on the dashboard layout.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/dashboard-configuration.png" alt-text="Screenshot of the dashboard configuration.":::

1. **Dashboard components:** lists the name of the component.
2. **Delete:** removes the component from the dashboard.

> [!NOTE]
> Each component row can be selected and dragged to move it to a different location.

Selecting the **Switch cohort** button on the dashboard or in the *Cohort settings* sidebar or at the top of the dashboard creates a popup that allows you to do that.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/switch-cohort.png" alt-text="Screenshot of a popup for switch cohort." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/switch-cohort.png":::

Selecting the **Create new cohort** button on the top of the Toolbox or in the *Cohort settings* sidebar creates a sidebar that allows you to do that.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/cohort-sidebar.png" alt-text="Screenshot of cohort sidebars highlighting the location of the following settings." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/cohort-sidebar.png":::

1. **Index:** filters by the position of the datapoint in the full dataset.
2. **Dataset:** filters by the value of a particular feature in the dataset.
3. **Predicted Y:** filters by the prediction made by the model.
4. **True Y:** filters by the actual value of the target feature.
5. **Classification Outcome:** for classification problems, filters by type and accuracy of classification.
6. **Numerical Values:** filter by a Boolean operation over the values (select datapoints where age < 64).
7. **Categorical Values:** filter by a list of values that should be included.

## Tree view

The first tab of the Error Analysis component is the tree view, which illustrates how model failure is distributed across different cohorts.
For text data, the tree view is trained on tabular features extracted from text data and any additional metadata features brought in by users.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-tree.png" alt-text="Screenshot of the error analysis component in the tree view." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-tree.png":::

- **Heatmap view:** switches to heatmap visualization of error distribution.
- **Feature list:** allows you to modify the features used in the heatmap using a side panel.
- **Error coverage:** displays the percentage of all error in the dataset concentrated in the selected node.
- **Error rate:** displays the percentage of failures of all the datapoints in the selected node.
- **Node:** represents a cohort of the dataset, potentially with filters applied, and the number of errors out of the total number of datapoints in the cohort.
- **Fill line:** visualizes the distribution of datapoints into child cohorts based on filters, with number of datapoints represented through line thickness.
- **Selection information:** contains information about the selected node in a side panel.
- **Save as a new cohort:** creates a new cohort with the given filters.
- **Instances in the base cohort:** displays the total number of points in the entire dataset, as well as the number of correctly and incorrectly predicted points.
- **Instances in the selected cohort:** displays the total number of points in the selected node, as well as the number of correctly and incorrectly predicted points.
- **Prediction path (filters):** lists the filters placed over the full dataset to create this smaller cohort.

Selecting on the **Feature list** button displays a side panel.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-feature-list.png" alt-text="Screenshot of the error analysis feature list." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-feature-list.png":::

- **Search features:** allows you to find specific features in the dataset
- **Features:** lists the name of the feature in the dataset
- **Importances:** visualizes the relative global importances of each feature in the dataset
- **Check mark:** allows you to add or remove the feature from the tree map

## Heat map view

Selecting on the **Heat map view** tab switches to a different view of the error in the dataset. You can select one or many heatmap cells and create new cohorts.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-heat-map.png" alt-text="Screenshot of the error analysis component in the heat map." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-heat-map.png":::

- **No. Cells:** displays the number of cells selected.
- **Error coverage:** displays the percentage of all errors concentrated in the selected cell(s).
- **Error rate:** displays the percentage of failures of all datapoints in the selected cell(s).
- **Axis features:** selects the intersection of features to display in the heat map.
- **Cells:** represents a cohort of the dataset, with filters applied, and the percentage of errors out of the total number of datapoints in the cohort. A blue outline indicates selected cells, and the darkness of red represents the concentration of failures.
- **Prediction path (filters):** lists the filters placed over the full dataset for each selected cohort.

## Model overview

The model overview component displays model and dataset statistics computed for cohorts across the dataset.

This component contains two views, dataset cohorts and feature cohorts.  Dataset cohorts displays statistics across all user-defined cohorts and the all data cohort in the dashboard:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/model-overview.png" alt-text="Screenshot of the model overview on the dataset cohorts tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/model-overview.png":::

Feature cohorts displays the same metrics and also fairness metrics such as difference and ratio parity for cohorts generated based on selected features:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/model-overview-feature-cohort.png" alt-text="Screenshot of the model overview on the feature cohorts tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/model-overview-feature-cohort.png":::

## Data analysis

The data analysis component contains a table view and a chart view of the dataset.  The table view has the true and predicted values as well as the tabular extracted features:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-view.png" alt-text="Screenshot of data analysis on the table view tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-view.png":::

The chart view allows customized aggregate and local data exploration:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-view.png" alt-text="Screenshot of data analysis on the chart view tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-view.png":::

- **X-axis:** displays the type of value being plotted horizontally, modify by clicking to display a side panel.
- **Y-axis:** displays the type of value being plotted vertically, modify by clicking to display a side panel.
- **Chart type:** specifies whether the plot is aggregating values across all datapoints.
- **Aggregate plot:** displays data in bins or categories along the x-axis.

Selecting the **Individual datapoints** option under *Chart type* shifts to a disaggregated view of the data.
data-analysis-chart-individual-datapoints

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-individual-datapoints.png" alt-text="Screenshot of data analysis on the chart view tab with individual datapoints option highlighted." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-individual-datapoints.png":::

- **Color value:** allows you to select the type of legend used to group datapoints.
- **Disaggregate plot:** scatterplot of datapoints along specified axis.

Selecting the labels of the axis displays a popup.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/axis-value.png" alt-text="Screenshot the select your axis value with predicted Y selected.":::

- **Select your axis value:** allows you to select the value displayed on the axis, with the same options and variety as cohort creation
- **Should dither:** adds optional noise to the data to avoid overlapping points in the scatterplot.

## Interpretability

## Global explanations

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/feature-importances-aggregate.png" alt-text="Screenshot of feature importances on the aggregate feature importance tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/feature-importances-aggregate.png":::

- **Top features:** lists the most important words aggregated across all documents and classes. Allows you to change it through a slider.
- **Aggregate feature importance:** visualizes the weight of each word in influencing model decisions across all text documents.

Selecting the **Individual feature importances** tab shifts views to explain how specific words influence the predictions made on specific datapoints.

### Local explanations

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/feature-importances-individual.png" alt-text="Screenshot of feature importances on the individual feature importance tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/feature-importances-individual.png":::

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/feature-importances-individual-words.png" alt-text="Screenshot of feature importances on the individual feature importance tab showing the most important words." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/feature-importances-individual-words.png":::

- **Show most important words:** select the number of most important words to be viewed in the text highlighting area
- **Class importance weights:** select the class or an aggregate view of the top most important words
- **Features selector:** use the radio button to select whether to see only words with importances that are positive, negative or select "ALL FEATURES" to see all

## Next steps

- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai) to generate a Responsible AI dashboard with YAML or Python.
- Learn about how the Responsible AI text dashboard was used by ERM for a [business use case](https://aka.ms/erm-customer-story).
