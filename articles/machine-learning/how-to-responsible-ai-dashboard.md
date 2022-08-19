---
title: How to use the Responsible AI dashboard in studio (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use the different tools and visualization charts in the Responsible AI dashboard in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: lagayhar
author: lgayhardt
ms.date: 08/17/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# How to use the Responsible AI dashboard in studio (preview)

Responsible AI dashboards are linked to your registered models. To view your Responsible AI dashboard, go into your model registry and select the registered model you've generated a Responsible AI dashboard for. Once you select your model, select the **Responsible AI (preview)** tab to view a list of generated dashboards.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-model-details-tab.png" alt-text="Screenshot of model details tab in studio with Responsible A I tab highlighted." lightbox= "./media/how-to-responsible-ai-dashboard/dashboard-model-details-tab.png":::

Multiple dashboards can be configured and attached to your registered model. Different combinations of components (interpretability, error analysis, causal analysis, etc.) can be attached to each Responsible AI dashboard. The list below reminds you of your dashboard(s)' customization and what components were generated within the Responsible AI dashboard. However, once opening each dashboard, different components can be viewed or hidden within the dashboard UI itself.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-page.png" alt-text="Screenshot of Responsible A I tab with a dashboard name highlighted." lightbox = "./media/how-to-responsible-ai-dashboard/dashboard-page.png":::

Selecting the name of the dashboard will open up your dashboard into a full view in your browser. At anytime, select the **Back to models details** to get back to your list of dashboards.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-full-view.png" alt-text="Screenshot of a Responsible A I tab dashboard with the back to model details button highlighted." lightbox = "./media/how-to-responsible-ai-dashboard/dashboard-full-view.png":::

## Full functionality with integrated compute resource

Some features of the Responsible AI dashboard require dynamic, on-the-fly, and real-time computation (for example, what if analysis). Without connecting a compute resource to the dashboard, you may find some functionality missing. Connecting to a compute resource will enable full functionality of your Responsible AI dashboard for the following components:

- **Error analysis**
    - Setting your global data cohort to any cohort of interest will update the error tree instead of disabling it.
    - Selecting other error or performance metrics is supported.
    - Selecting any subset of features for training the error tree map is supported.
    - Changing the minimum number of samples required per leaf node and error tree depth is supported.
    - Dynamically updating the heatmap for up to two features is supported.
- **Feature importance**
    - An individual conditional expectation (ICE) plot in the individual feature importance tab is supported.
- **Counterfactual what-if**
    - Generating a new what-if counterfactual datapoint to understand the minimum change required for a desired outcome is supported.
- **Causal analysis**
    - Selecting any individual datapoint, perturbing its treatment features, and seeing the expected causal outcome of causal what-if is supported (only for regression ML scenarios).

The information above can also be found on the Responsible AI dashboard page by selecting the information icon button:

:::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-view-full-functionality.png" alt-text="Screenshot of a Responsible A I tab dashboard hovering over the information icon button.":::

### How to enable full functionality of Responsible AI dashboard

1. Select a running compute instance from compute drop-down above your dashboard. If you don’t have a running compute, create a new compute instance by selecting “+ ” button next to the compute dropdown, or  “Start compute” button to start a stopped compute instance. Creating or starting a compute instance may take few minutes.

    :::image type="content" source="./media/how-to-responsible-ai-dashboard/select-compute.png" alt-text="Screenshot showing how to select a compute." lightbox = "./media/how-to-responsible-ai-dashboard/select-compute.png":::
    
2. Once compute is in “Running” state, your Responsible AI dashboard will start to connect to the compute instance. To achieve this, a terminal process will be created on the selected compute instance, and Responsible AI endpoint will be started on the terminal. Select **View terminal outputs** to view current terminal process.

    :::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-connect-terminal.png" alt-text="Screenshot showing the responsible A I dashboard is connecting to a compute resource." lightbox = "./media/how-to-responsible-ai-dashboard/compute-connect-terminal.png":::

3. When your Responsible AI dashboard is connected to the compute instance, you'll see a green message bar, and the dashboard is now fully functional.

    :::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-terminal-connected.png" alt-text="Screenshot showing that the dashboard is connected to the compute instance." lightbox= "./media/how-to-responsible-ai-dashboard/compute-terminal-connected.png":::

4. If it takes a while and your Responsible AI dashboard is still not connected to the compute instance, or a red error message bar shows up, it means there are issues with starting your Responsible AI endpoint. Select **View terminal outputs** and scroll down to the bottom to view the error message.

    :::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-terminal-error.png" alt-text="Screenshot of an error connecting to a compute." lightbox ="./media/how-to-responsible-ai-dashboard/compute-terminal-error.png":::

    If you're having issues with figuring out how to resolve the failed to connect to compute instance issue, select the “smile” icon on the upper right corner, and submit feedback to us to let us know what error or issue you hit. You can include screenshot and/or your email address in the feedback form.

## UI overview of the Responsible AI dashboard

The Responsible AI dashboard includes a robust and rich set of visualizations and functionality to help you analyze your machine learning model or making data-driven business decisions:

- [Global controls](#global-controls)
- [Error analysis](#error-analysis)
- [Model overview](#model-overview)
- [Data explorer](#data-explorer)
- [Feature importances (model explanations)](#feature-importances-model-explanations)
- [Counterfactual what-if](#counterfactual-what-if)
- [Causal analysis](#causal-analysis)

### Global controls

At the top of the dashboard, you can create cohorts, subgroups of datapoints sharing specified characteristics, to focus your analysis in each component on. The name of the cohort currently applied to the dashboard is always shown on the top left above your dashboard. The default shown in your dashboard will always be your whole dataset denoted by the title **All data (default)**.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-global-controls.png" alt-text="Screenshot of a responsible A I dashboard showing all data." lightbox = "./media/how-to-responsible-ai-dashboard/view-dashboard-global-controls.png":::

1. **Cohort settings**: allows you to view and modify the details of each cohort in a side panel.
2. **Dashboard configuration**: allows you to view and modify the layout of the overall dashboard in a side panel.
3. **Switch cohort**: allows you to select a different cohort and view its statistics in a popup.
4. **New cohort**: allows you to create and add a new cohort to your dashboard.

Selecting Cohort settings will open a panel with a list of your cohorts, where you can create, edit, duplicate, or delete your cohorts.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-cohort-settings.png" alt-text="Screenshot showing the cohort settings in he dashboard." lightbox ="./media/how-to-responsible-ai-dashboard/view-dashboard-cohort-settings.png":::

Selecting the **New cohort** button on the top of the dashboard or in the Cohort settings opens a new panel with options to filter on the following:

1. **Index**: filters by the position of the datapoint in the full dataset
2. **Dataset**: filters by the value of a particular feature in the dataset
3. **Predicted Y**: filters by the prediction made by the model
4. **True Y**: filters by the actual value of the target feature
5. **Error (regression)**: filters by error or Classification Outcome (classification): filters by type and accuracy of classification
6. **Categorical Values**: filter by a list of values that should be included
7. **Numerical Values**: filter by a Boolean operation over the values (for example, select datapoints where age < 64)

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-cohort-panel.png" alt-text="Screenshot of making multiple new cohorts." lightbox= "./media/how-to-responsible-ai-dashboard/view-dashboard-cohort-panel.png":::

You can name your new dataset cohort, select **Add filter** to add each desired filter, then select **Save** to save the new cohort to your cohort list or Save and switch to save and immediately switch the global cohort of the dashboard to the newly created cohort.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-new-cohort.png" alt-text="Screenshot of making a new cohort in the dashboard." lightbox= "./media/how-to-responsible-ai-dashboard/view-dashboard-new-cohort.png":::

Selecting **Dashboard configuration** will open a panel with a list of the components you’ve configured in your dashboard. You can hide components in your dashboard by selecting the ‘trash’ icon.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-configuration.png" alt-text="Screenshot showing the dashboard configuration." lightbox="./media/how-to-responsible-ai-dashboard/dashboard-configuration.png":::

You can add components back into your dashboard via the blue circular ‘+’ icon in the divider between each component.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-add-component.png" alt-text="Screenshot of adding a component to the dashboard." lightbox= "./media/how-to-responsible-ai-dashboard/dashboard-add-component.png":::

### Error analysis

#### Error tree map

The first tab of the Error analysis component is the Tree map, which illustrates how model failure is distributed across different cohorts with a tree visualization. Select any node to see the prediction path on your features where error was found.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/error-analysis-tree-map-selected.png" alt-text="Screenshot of the dashboard showing error analysis on the tree map tab." lightbox="./media/how-to-responsible-ai-dashboard/error-analysis-tree-map-selected.png":::

1. **Heatmap view**: switches to heatmap visualization of error distribution.
2. **Feature list:** allows you to modify the features used in the heatmap using a side panel.
3. **Error coverage**: displays the percentage of all error in the dataset concentrated in the selected node.
4. **Error (regression) or Error rate (classification)**: displays the error or percentage of failures of all the datapoints in the selected node.
5. **Node**: represents a cohort of the dataset, potentially with filters applied, and the number of errors out of the total number of datapoints in the cohort.
6. **Fill line**: visualizes the distribution of datapoints into child cohorts based on filters, with number of datapoints represented through line thickness.
7. **Selection information**: contains information about the selected node in a side panel.
8. **Save as a new cohort:** creates a new cohort with the given filters.
9. **Instances in the base cohort**: displays the total number of points in the entire dataset and the number of correctly and incorrectly predicted points.
10. **Instances in the selected cohort**: displays the total number of points in the selected node and the number of correctly and incorrectly predicted points.
11. **Prediction path (filters)**: lists the filters placed over the full dataset to create this smaller cohort.

Selecting the "Feature list" button opens a side panel, which allows you to retrain the error tree on specific features.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/error-analysis-feature-selection.png" alt-text="Screenshot of the dashboard showing error analysis tree map feature list." lightbox= "./media/how-to-responsible-ai-dashboard/error-analysis-feature-selection.png":::

1. **Search features**: allows you to find specific features in the dataset.
2. **Features:** lists the name of the feature in the dataset.
3. **Importances**: A guideline for how related the feature may be to the error. Calculated via mutual information score between the feature and the error on the labels. You can use this score to help you decide which features to choose in Error Analysis.
4. **Check mark**: allows you to add or remove the feature from the tree map.
5. **Maximum depth**: The maximum depth of the surrogate tree trained on errors.
6. **Number of leaves**: The number of leaves of the surrogate tree trained on errors.
7. **Minimum number of samples in one leaf**: The minimum number of data required to create one leaf.

#### Error heat map

Selecting the **Heat map** tab switches to a different view of the error in the dataset. You can select one or many heat map cells and create new cohorts. You can choose up to two features to create a heatmap.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/error-analysis-heat-map.png" alt-text="Screenshot of the dashboard showing error analysis heat map feature list." lightbox= "./media/how-to-responsible-ai-dashboard/error-analysis-heat-map.png":::

1. **Number of Cells**: displays the number of cells selected.
2. **Error coverage**: displays the percentage of all errors concentrated in the selected cell(s).
3. **Error rate**: displays the percentage of failures of all datapoints in the selected cell(s).
4. **Axis features**: selects the intersection of features to display in the heatmap.
5. **Cells**: represents a cohort of the dataset, with filters applied, and the percentage of errors out of the total number of datapoints in the cohort. A blue outline indicates selected cells, and the darkness of red represents the concentration of failures.
6. **Prediction path (filters)**: lists the filters placed over the full dataset for each selected cohort.

### Model overview

The Model overview component provides a comprehensive set of performance and fairness metrics to evaluate your model, along with key performance disparity metrics along specified features and dataset cohorts.  

#### Dataset cohorts

The **Dataset cohorts** tab allows you to investigate your model by comparing the model performance of different user-specified dataset cohorts (accessible via the Cohort settings icon on the top right corner of the dashboard).

> [!NOTE]
> You can create new dataset cohorts from the UI experience or pass your pre-built cohorts to the dashboard via the SDK experience.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/model-overview-dataset-cohorts.png" alt-text="Screenshot of the dashboard's model overview tab showing the dataset cohorts tab." lightbox= "./media/how-to-responsible-ai-dashboard/model-overview-dataset-cohorts.png":::

1. **Help me choose metrics**: Selecting this icon will open a panel with more information about what model performance metrics are available to be shown in the table below. Easily adjust which metrics you can view by using the multi-select drop down to select and deselect performance metrics. (see more below) 
2. **Show heatmap**: Toggle on and off to see heatmap visualization in the table below. The gradient of the heatmap corresponds to the range normalized between the lowest value and the highest value in each column.  
3. **Table of metrics for each dataset cohort**: Table with columns for dataset cohorts, sample size of each cohort, and the selected model performance metrics for each cohort.
4. **Bar chart visualizing individual metric**(mean absolute error) across the cohorts for easy comparison. 
5. **Choose metric (x-axis)**: Selecting this will allow you to select which metric to view in the bar chart. 
6. **Choose cohorts (y-axis)**: Selecting this will allow you to select which cohorts you want to view in the bar chart. You may see “Feature cohort” selection disabled unless you specify your desired features in the “Feature cohort tab” of the component first. 

Selecting “Help me choose metrics” will open a panel with the list of model performance metrics and the corresponding metrics definition to aid users in selecting the right metric to view.

| ML scenario    | Metrics                                                                                         |
|----------------|-------------------------------------------------------------------------------------------------|
| Regression     | Mean absolute error, Mean squared error, R,<sup>2</sup>, Mean prediction.                        |
| Classification | Accuracy, Precision, Recall, F1 score, False positive rate, False negative rate, Selection rate |

Classification scenarios will support accuracy, F1 score, precision score, recall score, false positive rate, false negative rate and selection rate (the percentage of predictions with label 1): 


:::image type="content" source="./media/how-to-responsible-ai-dashboard/model-overview-choose-metrics-classification.png" alt-text="Screenshot of the dashboard's model overview tab showing supported performance metrics for classification models." lightbox= "./media/how-to-responsible-ai-dashboard/model-overview-choose-metrics-classification.png":::


Regression scenarios will support mean absolute error, mean squared error, and mean prediction: 

:::image type="content" source="./media/how-to-responsible-ai-dashboard/model-overview-choose-metrics-regression.png" alt-text="Screenshot of the dashboard's model overview tab showing supported performance metrics for regression models." lightbox= "./media/how-to-responsible-ai-dashboard/model-overview-choose-metrics-regression.png":::


#### Feature cohorts

The **Feature cohorts** tab allows you to investigate your model by comparing model performance across user-specified sensitive/non-sensitive features (for example, performance across different gender, race, income level cohorts).

:::image type="content" source="./media/how-to-responsible-ai-dashboard/model-overview-feature-cohorts.png" alt-text="Screenshot of the dashboard's model overview tab showing the feature cohorts tab." lightbox= "./media/how-to-responsible-ai-dashboard/model-overview-feature-cohorts.png":::

1. **Help me choose metrics**: Selecting this icon will open a panel with more information about what metrics are available to be shown in the table below. Easily adjust which metrics you can view by using the multi-select drop down to select and deselect performance metrics.
2. **Help me choose features**: Selecting this icon will open a panel with more information about what features are available to be shown in the table below with descriptors of each feature and binning capability (see below). Easily adjust which features you can view by using the multi-select drop-down to select and deselect features.

     Selecting “Help me choose features” will open a panel with the list of features and their properties:

    :::image type="content" source="./media/how-to-responsible-ai-dashboard/model-overview-choose-features.png" alt-text="Screenshot of the dashboard's model overview tab showing how to choose features." lightbox= "./media/how-to-responsible-ai-dashboard/model-overview-choose-features.png":::
3. **Show heatmap**: toggle on and off to see heatmap visualization in the table below. The gradient of the heatmap corresponds to the range normalized between the lowest value and the highest value in each column.
4. **Table of metrics for each feature cohort**: Table with columns for feature cohorts (sub-cohort of your selected feature), sample size of each cohort, and the selected model performance metrics for each feature cohort.
5. **Fairness metrics/disparity metrics**: Table that corresponds to the above metrics table and shows the maximum difference or maximum ratio in performance scores between any two feature cohorts.
6. **Bar chart visualizing individual metric** (for example, mean absolute error) across the cohort for easy comparison.
7. **Choose cohorts (y-axis)**: Selecting this will allow you to select which cohorts you want to view in the bar chart.

     Selecting “Choose cohorts” will open a panel with an option to either show a comparison of selected dataset cohorts or feature cohorts based on what is selected in the multi-select drop-down below it. Select “Confirm” to save the changes to the bar chart view.  

    :::image type="content" source="./media/how-to-responsible-ai-dashboard/model-overview-choose-cohorts.png" alt-text="Screenshot of the dashboard's model overview tab showing how to choose cohorts." lightbox= "./media/how-to-responsible-ai-dashboard/model-overview-choose-cohorts.png":::
8. **Choose metric (x-axis)**: Selecting this will allow you to select which metric to view in the bar chart.


### Data explorer

The Data explorer component allows you to analyze data statistics along axes filters such as predicted outcome, dataset features and error groups. This component helps you understand over and underrepresentation in your dataset.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/data-explorer-aggregate.png" alt-text="Screenshot of the dashboard showing the data explorer." lightbox= "./media/how-to-responsible-ai-dashboard/data-explorer-aggregate.png":::

1. **Select a dataset cohort to explore**: Specify which dataset cohort from your list of cohorts you want to view data statistics for.
2. **X-axis**: displays the type of value being plotted horizontally, modify by selecting the button to open a side panel.
3. **Y-axis**: displays the type of value being plotted vertically, modify by selecting the button to open a side panel.
4. **Chart type**: specifies chart type, choose between aggregate plots (bar charts) or individual datapoints (scatter plot).

 Selecting the "Individual datapoints" option under "Chart type" shifts to a disaggregated view of the data with the availability of a color axis.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/data-explorer-individual.png" alt-text="Screenshot of the dashboard showing the data explorer with individual datapoints option selected." lightbox= "./media/how-to-responsible-ai-dashboard/data-explorer-individual.png":::

### Feature importances (model explanations)

The model explanation component allows you to see which features were most important in your model’s predictions. You can view what features impacted your model’s prediction overall in the **Aggregate feature importance** tab or view feature importances for individual datapoints in the **Individual feature importance** tab.

#### Aggregate feature importances (global explanations)

:::image type="content" source="./media/how-to-responsible-ai-dashboard/aggregate-feature-importance.png" alt-text="Screenshot of the dashboard showing feature importances on the  aggregate feature importances tab." lightbox= "./media/how-to-responsible-ai-dashboard/aggregate-feature-importance.png":::

1. **Top k features**: lists the most important global features for a prediction and allows you to change it through a slider bar.
2. **Aggregate feature importance**: visualizes the weight of each feature in influencing model decisions across all predictions.
3. **Sort by**: allows you to select which cohort's importances to sort the aggregate feature importance graph by.
4. **Chart type**: allows you to select between a bar plot view of average importances for each feature and a box plot of importances for all data.

When you select one of the features in the bar plot, the below dependence plot will be populated. The dependence plot shows the relationship of the values of a feature to its corresponding feature importance values impacting the model prediction.  

:::image type="content" source="./media/how-to-responsible-ai-dashboard/aggregate-feature-importance-2.png" alt-text="Screenshot of the dashboard showing a populated dependence plot on the aggregate feature importances tab." lightbox="./media/how-to-responsible-ai-dashboard/aggregate-feature-importance-2.png":::

5. **Feature importance of [feature] (regression) or Feature importance of [feature] on [predicted class] (classification)**: plots the importance of a particular feature across the predictions. For regression scenarios, the importance values are in terms of the output so positive feature importance means it contributed positively towards the output; vice versa for negative feature importance.  For classification scenarios, positive feature importances mean that feature value is contributing towards the predicted class denoted in the y-axis title; and negative feature importance means it's contributing against the predicted class.
6. **View dependence plot for**: selects the feature whose importances you want to plot.
7. **Select a dataset cohort**: selects the cohort whose importances you want to plot.

#### Individual feature importances (local explanations)

This tab explains how features influence the predictions made on specific datapoints. You can choose up to five datapoints to compare feature importances for.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/individual-feature-importance.png" alt-text="Screenshot of the dashboard showing the individual feature importances tab." lightbox= "./media/how-to-responsible-ai-dashboard/individual-feature-importance.png":::

**Point selection table**: view your datapoints and select up to five points to display in the feature importance plot or the ICE plot below the table.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/individual-feature-importance-bar-plot.png" alt-text="Screenshot of the dashboard showing a bar plot on the individual feature importances tab." lightbox="./media/how-to-responsible-ai-dashboard/individual-feature-importance-bar-plot.png":::

**Feature importance plot**: bar plot of the importance of each feature for the model's prediction on the selected datapoint(s)

1. **Top k features**: allows you to specify the number of features to show importances for through a slider.
2. **Sort by**: allows you to select the point (of those checked above) whose feature importances are displayed in descending order on the feature importance plot.
3. **View absolute values**: Toggle on to sort the bar plot by the absolute values; this allows you to see the top highest impacting features regardless of its positive or negative direction.
4. **Bar plot**: displays the importance of each feature in the dataset for the model prediction of the selected datapoints.

**Individual conditional expectation (ICE) plot**: switches to the ICE plot showing model predictions across a range of values of a particular feature

:::image type="content" source="./media/how-to-responsible-ai-dashboard/individual-feature-importance-ice-plot.png" alt-text="Screenshot of the dashboard showing an ICE plot on the individual feature importances tab." lightbox="./media/how-to-responsible-ai-dashboard/individual-feature-importance-ice-plot.png":::

- **Min (numerical features)**: specifies the lower bound of the range of predictions in the ICE plot.
- **Max (numerical features)**: specifies the upper bound of the range of predictions in the ICE plot.
- **Steps (numerical features)**: specifies the number of points to show predictions for within the interval.
- **Feature values (categorical features)**: specifies which categorical feature values to show predictions for.
- **Feature**: specifies the feature to make predictions for.

### Counterfactual what-if

Counterfactual analysis provides a diverse set of “what-if” examples generated by changing the values of features minimally to produce the desired prediction class (classification) or range (regression).

:::image type="content" source="./media/how-to-responsible-ai-dashboard/counterfactuals.png" alt-text="Screenshot of the dashboard showing counterfactuals." lightbox="./media/how-to-responsible-ai-dashboard/counterfactuals.png":::

1. **Point selection**: selects the point to create a counterfactual for and display in the top-ranking features plot below
    :::image type="content" source="./media/how-to-responsible-ai-dashboard/counterfactuals-top-ranked-features.png" alt-text="Screenshot of the dashboard showing a the top ranked features plot." lightbox="./media/how-to-responsible-ai-dashboard/counterfactuals-top-ranked-features.png":::

    **Top ranked features plot**: displays, in descending order in terms of average frequency, the features to perturb to create a diverse set of counterfactuals of the desired class. You must generate at least 10 diverse counterfactuals per datapoint to enable this chart due to lack of accuracy with a lesser number of counterfactuals.
2. **Selected datapoint**: performs the same action as the point selection in the table, except in a dropdown menu.
3. **Desired class for counterfactual(s)**: specifies the class or range to generate counterfactuals for.
4. **Create what-if counterfactual**: opens a panel for counterfactual what-if datapoint creation.

Selecting the **Create what-if counterfactual** button opens a full window panel.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/counterfactuals-examples.png" alt-text="Screenshot of the dashboard showing what-if counterfactuals." lightbox="./media/how-to-responsible-ai-dashboard/counterfactuals-examples.png":::

5. **Search features**: finds features to observe and change values.
6. **Sort counterfactual by ranked features**: sorts counterfactual examples in order of perturbation effect (see above for top ranked features plot).
7. **Counterfactual Examples**: lists feature values of example counterfactuals with the desired class or range. The first row is the original reference datapoint. Select “Set value” to set all the values of your own counterfactual datapoint in the bottom row with the values of the pre-generated counterfactual example.  
8. **Predicted value or class** lists the model prediction of a counterfactual's class given those changed features.
9. **Create your own counterfactual**: allows you to perturb your own features to modify the counterfactual, features that have been changed from the original feature value will be denoted by the title being bolded (ex. Employer and Programming language). Selecting “See prediction delta” will show you the difference in the new prediction value from the original datapoint.
10. **What-if counterfactual name**: allows you to name the counterfactual uniquely.
11. **Save as new datapoint**: saves the counterfactual you've created.

### Causal analysis

#### Aggregate causal effects

Selecting the **Aggregate causal effects** tab of the Causal analysis component shows the average causal effects for pre-defined treatment features (the features that you want to treat to optimize your outcome).

> [!NOTE]
> Global cohort functionality is not supported for the causal analysis component.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/aggregate-causal-effects.png" alt-text="Screenshot of the dashboard showing casual analysis on the aggregate causal effects tab." lightbox= "./media/how-to-responsible-ai-dashboard/aggregate-causal-effects.png":::

1. **Direct aggregate causal effect table**: displays the causal effect of each feature aggregated on the entire dataset and associated confidence statistics
    1. **Continuous treatments**: On average in this sample, increasing this feature by one unit will cause the probability of class to increase by X units, where X is the causal effect.
    1. **Binary treatments**: On average in this sample, turning on this feature will cause the probability of class to increase by X units, where X is the causal effect.
1. **Direct aggregate causal effect whisker plot**: visualizes the causal effects and confidence intervals of the points in the table

#### Individual causal effects and causal what-if

To get a granular view of causal effects on an individual datapoint, switch to the **Individual causal what-if** tab.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/individual-causal-what-if.png" alt-text="Screenshot of the dashboard showing casual analysis on the individual causal what-if tab." lightbox="./media/how-to-responsible-ai-dashboard/individual-causal-what-if.png":::

1. **X axis**: selects feature to plot on the x-axis.
2. **Y axis**: selects feature to plot on the y-axis.
3. **Individual causal scatter plot**: visualizes points in table as scatter plot to select datapoint for analyzing causal-what-if and viewing the individual causal effects below
4. **Set new treatment value**
    1. **(numerical)**: shows slider to change the value of the numerical feature as a real-world intervention.
    1. **(categorical)**: shows drop-down to select the value of the categorical feature.

#### Treatment policy

Selecting the Treatment policy tab switches to a view to help determine real-world interventions and shows treatment(s) to apply to achieve a particular outcome.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/causal-treatment-policy.png" alt-text="Screenshot of the dashboard showing casual analysis on the treatment policy tab." lightbox= "./media/how-to-responsible-ai-dashboard/causal-treatment-policy.png":::

1. **Set treatment feature**: selects feature to change as a real-world intervention
2. **Recommended global treatment policy**: displays recommended interventions for data cohorts to improve target feature value. The table can be read from left to right, where the segmentation of the dataset is first in rows and then in columns. For example, 658 individuals whose employer isn't Snapchat, and their programming language isn't JavaScript, the recommended treatment policy is to increase the number of GitHub repos contributed to.

**Average gains of alternative policies over always applying treatment**: plots the target feature value in a bar chart of the average gain in your outcome for the above recommended treatment policy versus always applying treatment.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/causal-treatment-policy-2.png" alt-text="Screenshot of the dashboard showing a bar chart of the average gains of alternative policies over always applying treatment on the treatment policy tab." lightbox= "./media/how-to-responsible-ai-dashboard/causal-treatment-policy-2.png":::

**Recommended individual treatment policy**:
:::image type="content" source="./media/how-to-responsible-ai-dashboard/causal-treatment-policy-3.png" alt-text="Screenshot of the dashboard showing a recommended individual treatment policy table on the treatment policy tab." lightbox= "./media/how-to-responsible-ai-dashboard/causal-treatment-policy-3.png":::

3. **Show top k datapoint samples ordered by causal effects for recommended treatment feature**: selects the number of datapoints to show in the table below.
4. **Recommended individual treatment policy table**: lists, in descending order of causal effect, the datapoints whose target features would be most improved by an intervention.

## Next steps

- Summarize and share your Responsible AI insights with the [Responsible AI scorecard as a PDF export](how-to-responsible-ai-scorecard.md).
- Learn more about the  [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View [sample YAML and Python notebooks](https://aka.ms/RAIsamples) to generate a Responsible AI dashboard with YAML or Python.
- Explore the features of the Responsible AI Dashboard through this [interactive AI Lab web demo](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard)
- Learn more about how the Responsible AI dashboard and Scorecard can be used to debug data and models and inform better decision making in this [tech community blog post](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard)
- Learn about how the Responsible AI dashboard and Scorecard were used by the NHS in a [real life customer story](https://aka.ms/NHSCustomerStory)
