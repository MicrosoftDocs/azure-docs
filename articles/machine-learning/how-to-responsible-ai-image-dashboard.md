---
title: Use the Responsible AI image dashboard
titleSuffix: Azure Machine Learning
description: Learn how to use the tools and visualizations in the Azure Machine Learning studio Responsible AI (RAI) image dashboard.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: ilmat
author: imatiach-msft
ms.date: 5/16/2023
ms.custom: responsible-ml, build-2023
---

# Use the responsible AI image dashboard (preview)

[Responsible AI (RAI) dashboards](how-to-responsible-ai-dashboard.md) include a robust, rich set of visualizations and functionality to help you analyze your machine learning model or make data-driven business decisions. The steps to view and configure RAI dashboards are similar across scenarios, but some features are unique to image scenarios.

Responsible AI image dashboards are linked to your registered computer vision models in Azure Machine Learning. The [Responsible AI Vision Insights component](how-to-responsible-ai-vision-insights.md) supports image classification and object detection scenarios. This article describes how to access and configure RAI image dashboard components and functionality.

> [!IMPORTANT]
> The Responsible AI image dashboard is currently in public preview. This preview is provided without a service-level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription with an Azure Machine Learning workspace.
- A registered machine learning model that has a responsible AI image dashboard created.

  You can create a Responsible AI image dashboard by using:

  - [The Azure Machine Learning studio UI](how-to-responsible-ai-insights-ui.md)
  - [YAML and Python via a pipeline job](how-to-responsible-ai-insights-sdk-cli.md)
  - A preconfigured sample Jupyter notebook like [Image Classification scenario with RAI Dashboard](https://github.com/Azure/azureml-examples/blob/main/sdk/python/responsible-ai/vision/responsibleaidashboard-image-classification-fridge.ipynb) or [Object Detection scenario with RAI Dashboard](https://github.com/Azure/azureml-examples/blob/main/sdk/python/responsible-ai/vision/responsibleaidashboard-automl-object-detection-fridge-private-data.ipynb).
  
- A running compute resource connected to your dashboard, for full functionality.

  Some features of the RAI image dashboard require dynamic, on-the-fly, and real-time computation. An integrated compute resource enables full functionality of the image scenarios. For example:

  - For object detection, setting an Intersection over Union (IOU) threshold is disabled by default, and is enabled only if a compute resource is attached.
  - When submitting a Distributed Parallel Version 2 (DPv2) job, attaching a compute resource enables pre-computing of all model explanations instead of loading explanations on-demand.

  For more information, see [Enable full functionality of the Responsible AI dashboard](how-to-responsible-ai-dashboard.md#enable-full-functionality-of-the-responsible-ai-dashboard).

To open the Responsible AI image dashboard in Machine Learning studio, select your registered model in the **Models** list, select **Responsible AI** at the top of the model page, and then select the name of your Responsible AI image dashboard from the list.

## Cohorts

In the RAI image dashboard, you can select or create data *cohorts*, which are subsets of data created by manually adding filters or saving selected data. You can view, create, edit, duplicate, and delete cohorts.

The default dashboard view shows the **Global cohort**, which is all of the data. At the top of the dashboard, select **Switch cohort** to select a different cohort or **New cohort** to create a new cohort. You can also select the **Settings** icon to open a side panel that lists the names and details of all cohorts, and lets you switch or create new cohorts.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/error-analysis-global-cohort.png" alt-text="Screenshot of the top section of the RAI image dashboard showing global cohorts." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/error-analysis-global-cohort.png":::

## RAI image dashboard components

The following sections describe the Responsible AI image dashboard components. Available components and functionality vary between image classification and object detection scenarios.

# [Image classification](#tab/classification)

For image classification and multilabel classification models, the Responsible AI image dashboard includes **Error analysis**, **Vision data explorer**, **Model overview**, and **Data analysis** components.

### Error analysis

**Error analysis** tools are available for image classification and multiclassification tasks. These tools accelerate detection of fairness errors and identify under/overrepresentation in your dataset. Instead of passing in tabular data, you can run error analysis on specified image metadata features by including the metadata as added columns in your `mltable` dataset. To learn more about error analysis, see [Assess errors in machine learning models](concept-error-analysis.md).

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/error-analysis.png" alt-text="Screenshot of an error analysis tree that shows the mean pixel value." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/error-analysis.png":::

# [Object detection](#tab/detection)

For object detection, the Responsible AI image dashboard includes **Vision data explorer** and **Model overview**, and **Data analysis** components. The **Error analysis** dashboard component isn't available for object detection tasks. To learn more about error analysis, see [Assess errors in machine learning models](concept-error-analysis.md).

---

### Vision data explorer

The **Vision data explorer** component has several views to provide various perspectives on your dataset. You can choose among **Image explorer view**, **Table view**, or **Class view** by selecting one of the tabs at the top of the component.

#### Image explorer view

The **Image explorer** view displays image instances of model predictions, automatically categorized by correctly and incorrectly labeled predictions. This view helps you quickly identify high-level error patterns in your data and select which instances to investigate further.

- Under **Select a dataset cohort to explore**, you can select or search for a user-defined dataset cohort to view.
- The **Set thumbnail size** slider adjusts the size of the image cards on the page.

# [Image classification](#tab/classification)

For image classification and multiclassification, incorrect predictions refer to images where the predicted class label differs from ground truth. Each image card displays the image, the predicted class label, and the ground truth class label. 

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-multilabel.png" alt-text="Screenshot of image explorer for multilabel classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-multilabel.png":::

Selecting an image card opens a flyout with the following information that supports model prediction analysis.

- **Selected instance**: View the predicted and ground truth outcomes for the image.
- **Explanation**: View a Shapley Additive explanations (SHAP) feature attributions visualization to gain insight on model behavior leading to the execution of a computer vision task.
- **Information**: View image metadata values for the selected instance.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-multiclass.png" alt-text="Screenshot of selected instance with an image of a can and the explanation for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-multiclass.png":::

# [Object detection](#tab/detection)

For object detection, incorrect predictions can refer to:

- Incorrectly labeling at least one object.
- Incorrectly detecting an object class when a ground truth object doesn't exist.
- Failing to detect an object class when a ground truth object exists.

Each image card displays the image and how many object predictions were **Correct** or **Wrong** for that image.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-object.png" alt-text="Screenshot of image explorer for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-object.png":::

Selecting an image card opens a flyout to view components that support the analysis of model predictions.

- **Selected instance**: The correct detections and incorrect detections for the image or objects in the image.
- **Information**: Image metadata values for the selected instance.
- An enlarged image with predicted and ground truth objects surrounded by bounding boxes, and the predicted image labeled with its IOU score.

  > [!NOTE]
  > If an object in an image was correctly labeled, but with an IOU score below the default threshold of 50%, the prediction bounding box for the object isn't visible, but the ground truth bounding box is visible. The image instance appears in the error instance category. Currently, it's not possible to change the default IOU threshold in this component.

  :::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-object.png" alt-text="Screenshot of selected instance with an image of a can and the explanation for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-object.png":::

- **Explanation**: A D-Rise saliency map visualization to gain insight on model behavior leading to the execution of the computer vision task.

  :::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-object.png" alt-text="Screenshot of selected instance with an image of a can and the explanation for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-object.png":::

**Set an Intersection of Union (IOU) threshold** – Changing the IOU threshold impacts which images are considered an incorrect prediction.

---

#### Table view

The **Table view** shows your dataset with rows for each image instance and columns for the corresponding index, ground truth class labels, predicted class labels, and metadata features.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-common.png" alt-text="Screenshot of the top part of the Table view." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-common.png":::

- Under **Select a dataset cohort to explore**, you can select or search for a user-defined dataset cohort to view.
- The **Set thumbnail size** slider adjusts the size of the image cards on the page.
- **Save cohort** lets you create new dataset cohorts by manually selecting images.

  Hover on an image row and select the checkbox to include the image in the new cohort. You can filter your dataset by index, metadata values, and classification outcome. You can add multiple filters, save the resulting filtered data with a new cohort name, and automatically switch to display your new cohort.

# [Image classification](#tab/classification)

Table view for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-multiclass.png" alt-text="Screenshot of the vision data explorer on the table view for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-multiclass.png":::

# [Object detection](#tab/detection)

Table view for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-object.png" alt-text="Screenshot of the vision data explorer on the table view for object classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-object.png":::

---

#### Class view

**Class view** breaks down your model predictions by class label. You can identify error patterns per class to diagnose fairness concerns and evaluate under/overrepresentation in your dataset.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-common.png" alt-text="Screenshot of the top part of the Table view." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-common.png":::

- Under **Select a dataset cohort to explore**, you can select or search for a user-defined dataset cohort to view.
- The **Set thumbnail size** slider adjusts the size of the image cards on the page.
- **Rows** selects the number of image rows to display before scrolling the view.
- Under **Select label type**, choose to view images by the predicted or ground truth label, or by **Correct** or **Incorrect** predictions.
- Under **Select labels to display**, choose one or more class labels to view image instances containing those labels.

The images are displayed by label and show the distribution of each label in the dataset. A class label of **10/120 examples** means there are 10 images of that class out of 120 total images in the dataset. **Success instances** have solid green underscores, and **Error instances** have in red outline underscores.

# [Image classification](#tab/classification)

Class view for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-multiclass.png" alt-text=" Screenshot of vision data explorer on the class view tab for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-multiclass.png":::

# [Object detection](#tab/detection)

Class view for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-object.png" alt-text=" Screenshot of vision data explorer on the class view tab for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-object.png":::

---

### Model overview

The model overview component provides a comprehensive set of performance metrics for evaluating your computer vision model, along with key performance disparity metrics across dataset cohorts. You can choose between **Dataset cohorts** or **Feature cohorts** views by selecting either tab at the top of the component.

#### Dataset cohorts view

The **Dataset cohorts** view displays the selected metrics across the global cohort and all user-defined cohorts in the dashboard.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts.png" alt-text="Screenshot of the Dataset cohorts view." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts.png":::

Select **Metric(s)** from the dropdown list, or select **Help me choose metrics** to open a sidebar screen that explains, recommends, and lets you select metrics to display. You can adjust which metrics to view by using the multiselect dropdown list to select and deselect performance metrics.

You can also choose to **Show heatmap** for the displayed data.

>[!NOTE]
>Performance metrics display **N/A** at their initial state and while metrics computations are loading.

# [Image classification](#tab/classification)

| Computer vision scenario        | Metric                                                    |
|---------------------------------|-----------------------------------------------------------|
| Image Classification            | Accuracy, precision, F1 score, recall                     |
| Image Multilabel Classification | Accuracy, precision, F1 score, recall                     |

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts.png" alt-text="Screenshot of model overview on the dataset cohorts pane." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts.png":::

# [Object detection](#tab/detection)

| Computer vision scenario        | Metric                                                    |
|---------------------------------|-----------------------------------------------------------|
| Object Detection                | Mean average precision, average precision, average recall |

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts-object.png" alt-text="Screenshot of vision data explorer showing successful instances of object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts-object.png":::

For object detection, in addition to selecting the **Metric(s)**, configure the following settings:

- **Aggregate method**: Select which aggregation method to apply, which affects the calculation of mean average precision.
- **Select class(es)**: Select which class label to use calculate class-level metrics like average precision and average recall.
- **IoU Threshold**: Set an IOU threshold value for the Intersection of Union between the ground truth and prediction bounding box. The IOU threshold value defines error and affects calculation of model performance metrics. For example, setting an IOU of greater than  70% means that a prediction with greater than 70% overlap with ground truth is `True`. This feature is disabled by default, and can be enabled by attaching a running compute instance.
---

#### Feature cohorts

In the **Feature cohorts** view, you can investigate your model by comparing model performance across user-specified sensitive and non-sensitive features. For example, compare performance for cohorts across various image metadata values like gender, race, and income. To learn more about feature cohorts, see [Feature cohorts](how-to-responsible-ai-dashboard.md#feature-cohorts).

# [Image classification](#tab/classification)

Feature cohorts for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-multiclass.png" alt-text="Screenshot of feature cohorts for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-multiclass.png":::

# [Object detection](#tab/detection)

Feature cohorts for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-object.png" alt-text="Screenshot of feature cohorts for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-object.png":::

---

#### Visualizations

# [Image classification](#tab/classification)

In the lower half of the **Dataset cohorts** view, you can select between the following visualizations:

- **Metrics visualizations** shows a bar graph that compares aggregated performance metrics across selected dataset cohorts.
  - Select **Choose cohorts** to open a sidebar that lets you select the dataset and feature cohorts to apply.
  - Select **Choose metric** to open a sidebar that lets you select metrics to show.

- **Confusion matrix** shows a selected model performance metric across selected dataset cohorts and classes.
  - Select **Select dataset cohort** to select a dataset cohort to display from the dropdown list.
  - Select **Select classes** to select classes to display from the dropdown list.

  :::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/confusion-matrix.png" alt-text="Screenshot of a Confusion matrix in the Datasets cohort view of the Model overview component." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/confusion-matrix.png":::

# [Object detection](#tab/detection)

In the lower half of the **Dataset cohorts** view, **Metrics visualizations** shows a bar graph that compares aggregated performance metrics across selected dataset cohorts.

- Select **Choose cohorts** to open a sidebar that lets you select the dataset and feature cohorts to apply.
- Select **Choose metric** to open a sidebar that lets you select metrics to show.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/visualizations-object.png" alt-text="Screenshot of Metrics visualizations in the Datasets cohort view of the Model overview component." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/visualizations-object.png":::

---

### Data analysis

The **Data analysis** component creates dataset cohorts to analyze dataset statistics along filters such as predicted outcome, dataset features, and error groups. You can choose between **Table view** or **Chart view** by selecting either tab at the top of the component.

#### Table view

**Table view** shows true and predicted values and the tabular extracted features.

# [Image classification](#tab/classification)

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-class.png" alt-text="Screenshot of data analysis on the Table view tab for image classification models." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-class.png":::

# [Object detection](#tab/detection)

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-object.png" alt-text="Screenshot of data analysis on the Table view tab for object detection models." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-object.png":::

---

#### Chart view

**Chart view** lets you choose between customized aggregation and local data exploration.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-view.png" alt-text="Screenshot of data analysis on the chart view tab." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-view.png":::

In the chart view, the X axis and Y axis show the values being plotted horizontally and vertically. You can select either label to open a sidebar pane to select and configure that axis.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/axis-value.png" alt-text="Screenshot of the select your axis value sidebar.":::

In the axis configuration pane, depending on the value, you can configure options such as **Apply binning to data**, **Number of bins**, or **Enable logarithmic scaling**. **Should dither** adds optional noise to the data to avoid overlapping points in the scatterplot.

Under **Chart type**, you can select whether to aggregate values across all datapoints.

- **Aggregate plot** displays data in bins or categories along the X axis.
- **Individual datapoints** displays a disaggregated view of the data.

  In the **Individual datapoints** view, you can select the type of legend used to group datapoints. Selecting the label under **Color value** opens the axis configuration sidebar pane.

# [Image classification](#tab/classification)

Scatter chart for image classifiction:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-scatter-object.png" alt-text="Screenshot of disaggregated data analysis on the Chart view tab for image classification models." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-chart-scatter-object.png":::

# [Object detection](#tab/detection)

Aggregate chart for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-class.png" alt-text="Screenshot of aggregated data analysis on the Chart view tab for object detection models." lightbox="./media/how-to-responsible-ai-dashboard-text-insights/data-analysis-table-class.png":::

---

## Model interpretability

For AutoML image classification models, four kinds of explainability methods are supported:

- [Guided backprop](https://arxiv.org/abs/1412.6806)
- [Guided gradCAM](https://arxiv.org/abs/1610.02391v4)
- [Integrated Gradients](https://arxiv.org/abs/1703.01365)
- [XRAI](https://arxiv.org/abs/1906.02825)

The explanations are generated only for the predicted class. For multilabel classification, a threshold on confidence score is required to select the classes to generate explanations for. See the [parameter list](how-to-responsible-ai-vision-insights.md#responsible-ai-vision-insights-component-parameter-automl-specific) for the parameter name.

These four methods are specific to AutoML image classification only, and don't work with other task types such as object detection and instance segmentation. Non-AutoML image classification models can leverage SHAP vision for model interpretability. Both AutoML and non-AutoML object detection models can use [D-RISE](https://github.com/microsoft/vision-explanation-methods) to generate visual explanations for model predictions.

To learn more about the four explainability methods, see [Generate explanations for predictions](how-to-auto-train-image-models.md#generate-explanations-for-predictions). For more information about vision model interpretability techniques and how to interpret visual explanations of model behavior, see [Model interpretability](how-to-machine-learning-interpretability.md).

## Next steps

- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai) to generate a Responsible AI dashboard with YAML or Python.
- Learn more about how you can use the Responsible AI image dashboard to debug image data and models and inform better decision-making in this [tech community blog post](https://aka.ms/rai-object-detection-blog).
- Learn about how the Responsible AI dashboard was used by Clearsight in a [real-life customer story](https://customers.microsoft.com/story/1548724923828850434-constellation-clearsight-energy-azure-machine-learning).
