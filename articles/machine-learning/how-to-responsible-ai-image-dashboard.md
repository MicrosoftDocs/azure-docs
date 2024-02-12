---
title: Responsible AI image dashboard in Azure Machine Learning studio
titleSuffix: Azure Machine Learning
description: Learn how to use the various tools and visualization charts in the Responsible AI image dashboard in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: ilmat
author: imatiach-msft
ms.date: 5/10/2023
ms.custom: responsible-ml, build-2023
---

# Responsible AI image dashboard in Azure Machine Learning studio (preview)

The Responsible AI image dashboards are linked to your registered computer vision models in Azure Machine Learning. While [steps to view and configure the Responsible AI dashboard](how-to-responsible-ai-dashboard.md) is similar across scenarios, some features are unique to image scenarios.

> [!IMPORTANT]
> Responsible AI image dashboard is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Full functionality with integrated compute resource

Some features of the Responsible AI image dashboard require dynamic, on-the-fly, and real-time computation. When you [connect to a compute resource](how-to-responsible-ai-dashboard.md#enable-full-functionality-of-the-responsible-ai-dashboard) you enable full functionality of unique components to the image scenario:

- For object detection, setting an Intersection of Union threshold is disabled by default, and only enabled if a compute resource is attached.
- Enable pre-computing of all model explanations when submitting a DPv2 job, instead of loading explanations on-demand.

You can also find this information on the Responsible AI dashboard page by selecting the Information icon, as shown in the following image:

:::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-view-full-functionality.png" alt-text="Screenshot of the Information icon on the Responsible AI dashboard.":::

## Overview of features in the Responsible AI image dashboard

The Responsible AI dashboard includes a robust, rich set of visualizations and functionality to help you analyze your machine learning model or make data-driven business decisions:

- Error Analysis (Image classification & multi-classification only)
- Model overview
- Data explorer
- Model interpretability

## Error analysis

Error analysis tools are available for image classification and multi-classification to accelerate detection of fairness errors and identify under/overrepresentation in your dataset. Instead of passing in tabular data, you can run error analysis on specified image metadata features by including metadata as additional columns in your mltable dataset. To learn more about error analysis, see [Assess errors in machine learning models](concept-error-analysis.md).

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/error-analysis.png" alt-text="Screenshot of an error analysis tree that shows the mean pixel value." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/error-analysis.png":::

## Model overview

The model overview component provides a comprehensive set of performance metrics for evaluating your computer vision model, along with key performance disparity metrics across specified dataset cohorts.

> [!NOTE]
> Performance metrics will display N/A at its initial state and while metric computations are loading.

### Dataset cohorts

On the **Dataset cohorts** pane, you can investigate your model by comparing the model performance of various user-specified dataset cohorts (accessible via the Cohort settings icon).

Multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts.png" alt-text="Screenshot of model overview on the dataset cohorts pane." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts.png":::

Object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts-object.png" alt-text="Screenshot of vision data explorer showing successful instances of object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts-object.png":::

- **Help me choose metrics**: Select this icon to open a panel with more information about what model performance metrics are available to be shown in the table. Easily adjust which metrics to view by using the multi-select dropdown list to select and deselect performance metrics.
- **Choose aggregation**: Select this button to which aggregation method to apply, affecting the calculation of Mean Average Precision.
- **Choose class label**: Select which class labels are used to calculate class-level metrics (for example, average precision, average recall).
- **Set Intersection of Union (IOU) threshold** – Object Detection only: Set an IOU threshold value (Intersection of Union between ground truth & prediction bounding box) that defines error and affects calculation of model performance metrics. For example, setting an IOU of greater than  70% means that a prediction with greater than 70% overlap with ground truth is True. This feature is disabled by default, and can be enabled by attaching a Python backend.
- **Table of metrics for each dataset cohort**: View columns of dataset cohorts, the sample size of each cohort, and the selected model performance metrics for each cohort – aggregated based on the selected aggregation method.
- Visualizations
    - Bar graph (Image Classification, Multilabel classification): Compare aggregated performance metrics across selected dataset cohort(s).
    - Confusion matrix (Image Classification, Multilabel classification): View a selected model performance metric across selected dataset cohort(s) and selected class(es).
- **Choose metric (x-axis)**: Select this button to choose which metric to view in the visualization (confusion matrix or scatterplot).
- **Choose cohorts (y-axis)**: Select this button to choose which cohorts to view in the confusion matrix..
    :::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts-choose.png" alt-text="Screenshot of the choose cohort button and pane." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/dataset-cohorts-choose.png":::


| Computer vision scenario        | Metric                                                    |
|---------------------------------|-----------------------------------------------------------|
| Image Classification            | Accuracy, precision, F1 score, recall                     |
| Image Multilabel Classification | Accuracy, precision, F1 score, recall                     |
| Object Detection                | Mean average precision, average precision, average recall |

### Feature cohorts

On the Feature cohorts pane, you can investigate your model by comparing model performance across user-specified sensitive and non-sensitive features (for example, performance for cohorts across various image metadata values like gender, race, and income). To learn more about feature cohorts, see [the feature cohorts section of Responsible AI dashboard](how-to-responsible-ai-dashboard.md#feature-cohorts).

Feature cohorts for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-multiclass.png" alt-text="Screenshot of feature cohorts for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-multiclass.png":::

Feature cohorts for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-object.png" alt-text="Screenshot of feature cohorts for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/feature-cohorts-object.png":::

## Data explorer

The data explorer component contains multiple panes to provide various perspectives of your dataset.

### Image explorer view

The image explorer pane displays images instances of model predictions, automatically categorized by correct and incorrectly labeled predictions. This view helps you quickly identify high-level patterns of error in your data and select which instances to investigate more deeply.

For image classification and multiclassification, incorrect predictions refer to images where the predicted class label differs from ground truth.
For object detection, incorrect predictions refer to images where:

- At least one object was incorrectly labeled
- Incorrectly detecting an object class when a ground truth object doesn't exist
- Failing to detect an object class when a ground truth object exists

> [!NOTE]
> If object(s) in an image was correctly labeled but with an IOU score below the default threshold of 50%, the prediction bounding box for the object will not be visible, but the ground truth bounding box will be visible. The image instance would appear in the error instance category. Currently, it is not possible to change the default IOU threshold in the Data Explorer component. 

Image explorer for multilabel classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-multilabel.png" alt-text="Screenshot of image explorer for multilabel classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-multilabel.png":::

Image explorer for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-object.png" alt-text="Screenshot of image explorer for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-explorer-object.png":::

- **Select a dataset cohort to explore**: View images across all data or for specific user-defined cohorts.
- **Set thumbnail size**: Adjust the size of image cards displayed in this page.
- **Set an Intersection of Union (IOU) threshold** – Object Detection only: Changing the IOU threshold impacts which images are considered an incorrect prediction.
- **Image card**: Each image card displays the image, predicted class labels (top), and ground truth class labels (bottom). For object detection, bounding boxes for detected objects are also shown.
- **Create a new dataset cohort with filters**: Filter your dataset by index, metadata values, and classification outcome. You can add multiple filters, save the resulting filtered data with a specified cohort name, and automatically switch your image explorer view to display contents of your new cohort.

#### Selecting an image instance

By selecting an image card, you can access a flyout to view the following components supporting analysis of model predictions:

Explanations for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-multiclass.png" alt-text="Screenshot of selected instance with an image of a can and the explanation for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-multiclass.png":::

Explanations for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-object.png" alt-text="Screenshot of selected instance with an image of a can and the explanation for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/image-instance-object.png":::

- **View predicted and ground truth outcomes**: In comma-separated format, view the predicted & corresponding ground truth class label for the image or objects in the image.
- **Metadata**: View image metadata values for the selected instance.
- **Explanation**: View a visualization (SHAP feature attributions – image classification & multi-classification, D-Rise saliency map – object detection) to gain insight on model behavior leading to the execution of a computer vision task.

### Table view

The Table view pane shows you a table view of your dataset with rows for each image instance in your dataset, and columns for the corresponding index, ground truth class labels, predicted class labels, and metadata features.

- Manually select images to create a new dataset cohort: Hover on each image row and select the checkbox to include images in your new dataset cohort. Keep track of the number of images selected and save the new cohort.

Table view for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-multiclass.png" alt-text="Screenshot of the vision data explorer on the table view for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-multiclass.png":::

Table view for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-object.png" alt-text="Screenshot of the vision data explorer on the table view for object classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/table-view-object.png":::

### Class view

The Class view pane breaks down your model predictions by class label. You can identify error patterns per class to diagnose fairness concerns and evaluate under/overrepresentation in your dataset.

- **Select label type**: Choose to view images by the predicted or ground truth label.
- **Select labels to display**: View image instances containing your selection of one or more class labels.
- **View images per class label**: Identify successful and error image instances per selected class label(s), and the distribution of each class label in your dataset. If a class label has "10/120 examples", out of 120 total images in the dataset, 10 images belong to that class label.

Class view for multiclass classification:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-multiclass.png" alt-text=" Screenshot of vision data explorer on the class view tab for multiclass classification." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-multiclass.png":::

Class view for object detection:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-object.png" alt-text=" Screenshot of vision data explorer on the class view tab for object detection." lightbox="./media/how-to-responsible-ai-dashboard-vision-insights/class-view-object.png":::

## Model interpretability

For AutoML image classification models, four kinds of explainability methods are supported, namely [Guided backprop](https://arxiv.org/abs/1412.6806), [Guided gradCAM](https://arxiv.org/abs/1610.02391v4), [Integrated Gradients](https://arxiv.org/abs/1703.01365) and [XRAI](https://arxiv.org/abs/1906.02825). To learn more about the four explainability methods, see [Generate explanations for predictions](how-to-auto-train-image-models.md#generate-explanations-for-predictions).

> [!NOTE]
> -    **These four methods are specific to AutoML image classification only** and will not work with other task types such as object detection, instance segmentation etc. Non-AutoML image classification models can leverage SHAP vision for model interpretability. 
>-    **The explanations are only generated for the predicted class**. For multilabel classification, a threshold on confidence score is required, to select the classes for which the explanations are generated. See the [parameter list](how-to-responsible-ai-vision-insights.md#responsible-ai-vision-insights-component-parameter-automl-specific) for the parameter name.

Both AutoML and non-AutoML object detection models can leverage [D-RISE](https://github.com/microsoft/vision-explanation-methods) to generate visual explanations for model predictions.

For information about vision model interpretability techniques and how to interpret visual explanations of model behavior, see [Model interpretability](how-to-machine-learning-interpretability.md).

## Next steps

- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai) to generate a Responsible AI dashboard with YAML or Python.
- Learn more about how you can use the Responsible AI image dashboard to debug image data and models and inform better decision-making in this [tech community blog post](https://aka.ms/rai-object-detection-blog).
- Learn about how the Responsible AI dashboard was used by Clearsight in a [real-life customer story](https://customers.microsoft.com/story/1548724923828850434-constellation-clearsight-energy-azure-machine-learning).
