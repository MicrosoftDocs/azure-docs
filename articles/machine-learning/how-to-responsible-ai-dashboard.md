---
title: Use the Responsible AI dashboard in studio (preview)
titleSuffix: Azure Machine Learning
description: 
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: lagayhar
author: lgayhardt
ms.date: 05/24/2022
ms.custom: responsible-ml
---

# Use the Responsible AI dashboard in studio (preview)


## Where to find your Responsible AI dashboard

Responsible AI dashboards are linked to your registered models. To view your Responsible AI dashboard, go into your model registry and select the registered model you have generated a Responsible AI dashboard for. Once you click into your model, select the **Responsible AI (preview)** tab to view a list of generated dashboards.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-model-details-tab.png" alt-text="Screenshot of model details tab in studio with Responsible AI tab highlighted.":::

Multiple dashboards can be configured and attached to your registered model. Different combinations of components (explainers, causal analysis, etc.) can be attached to each Responsible AI dashboard. The list below only shows whether a component was generated for your dashboard, but different components can be viewed or hidden within the dashboard itself.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-page.png" alt-text="Screenshot of Responsible AI tab with a dashboard name highlighted.":::

Selecting the name of the dashboard will open up your dashboard into a full view in your browser. At anytime, select the **Back to models details** to get back to your list of dashboards.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-full-view.png" alt-text="Screenshot of a Responsible AI tab dashboard with the back to model details button highlighted." lightbox = "./media/how-to-responsible-ai-dashboard/dashboard-full-view.png":::

### Full functionality with integrated compute resource

Some features of the Responsible AI dashboard require dynamic, real-time computation. Without connecting a compute resource to the dashboard, you may find some functionality missing. Connecting to a compute resource will enable full functionality of your Responsible AI dashboard for the following components:

- **Error analysis**
    - Setting your global data cohort to any cohort of interest will update the error tree instead of disabling it.
    - Selecting other error or performance metrics is supported.
    - Selecting any subset of features for training the error tree map is supported.
    - Changing the minimum number of samples required per leaf node and error tree depth is supported.
    - Dynamically updating the heatmap for up to two features is supported.
- **Feature importance**
    - An individual conditional expectation (ICE) plot in the individual feature importance tab is supported.
- Counterfactual what-if
    - Generating a new what-if counterfactual datapoint to understand the minimum change required for a desired outcome is supported.
- **Causal analysis**
    - Selecting any individual datapoint, perturbing its treatment features, and seeing the expected causal outcome of causal what-if is supported (only for regression ML scenarios).

The information above can also be found on the Responsible AI dashboard page by selecting the information icon button:

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard-full-view.png" alt-text="Screenshot of a Responsible AI tab dashboard hovering over the information icon button.":::

### How to enable full functionality of Responsible AI dashboard?

Select a running compute instance from compute dropdown above your dashboard. If you don’t have a running compute, create a new compute instance by selecting “+ ” button next to the compute dropdown, or  “Start compute” button to start a stopped compute instance. Creating or starting a compute instance may take few minutes.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/select-compute.png" alt-text="Screenshot of selecting a compute..":::

Once compute is in “Running” state, your Responsible AI dashboard will start to connect to the compute instance. To achieve this, a terminal process will be created on the selected compute instance, and Responsible AI endpoint will be started on the terminal. Select **View terminal outputs** to view current terminal process.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-connect-terminal.png" alt-text="Screenshot showing the responsible AI dashboard is connecting to a compute resource.":::

When your Responsible AI dashboard is connected to the compute instance, you will see a green message bar, and the dashboard is now fully functional.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-terminal-connected.png" alt-text="Screenshot of a connected compute.":::

If it takes a while and your Responsible AI dashboard is still not connected to the compute instance, or a red error message bar shows up, it means there are issues with starting your Responsible AI endpoint. Select **View terminal outputs** and scroll down to the bottom to view the error message.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-terminal-error.png" alt-text="Screenshot of an error connecting to a compute.":::

If you are having issues with figuring out how to resolve the failed to connect to compute instance issue, select the “smile” icon on the upper right corner, and submit feedback to us to let us know what error or issue you hit. You can include screenshot and/or your email address in the feedback form.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/compute-terminal-error-feedback.png" alt-text="Screenshot of the feedback form.":::

## UI overview of the Responsible AI dashboard

The Responsible AI dashboard includes a robust and rich set of visualizations and functionality to help you analyze your machine learning model or making data-driven business decisions: 

- Global controls
- Error analysis
- Model overview and fairness metrics
- Data explorer
- Feature importances (model explanations)
- Counterfactual what-if
- Causal analysis

### Global controls

At the top of the dashboard, you can create cohorts, subgroups of datapoints sharing specified characteristics, to focus your analysis in each component on. The name of the cohort currently applied to the dashboard is always shown on the top left above your dashboard. The default shown in your dashboard will always be your whole dataset denoted by the title **All data (default)**.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-global-controls.png" alt-text="Screenshot of a responsible AI dashboard showing all data.":::

1. Cohort settings: allows you to view and modify the details of each cohort in a side panel.
2. Dashboard configuration: allows you to view and modify the layout of the overall dashboard in a side panel.
3. Switch cohort: allows you to select a different cohort and view its statistics in a popup.
4. New cohort: allows you to create and add a new cohort to your dashboard.

Selecting Cohort settings will open a panel with a list of your cohorts, where you can create, edit, duplicate, or delete your cohorts.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-cohort-settings.png" alt-text="Screenshot of cohort settings.":::

Selecting the **New cohort** button on the top of the dashboard or in the Cohort settings opens a new panel with options to filter on the following:

1. Index: filters by the position of the datapoint in the full dataset
2. Dataset: filters by the value of a particular feature in the dataset
3. Predicted Y: filters by the prediction made by the model
4. True Y: filters by the actual value of the target feature
5. Error (regression): filters by error or Classification Outcome (classification): filters by type and accuracy of classification
6. Categorical Values: filter by a list of values that should be included
7. Numerical Values: filter by a Boolean operation over the values (e.g., select datapoints where age < 64)

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-cohort-panel.png" alt-text="Screenshot of making multiple new cohorts.":::

You can name your new dataset cohort, select **Add filter** to add each desired filter, then select **Save** to save the new cohort to your cohort list or Save and switch to save and immediately switch the global cohort of the dashboard to the newly created cohort.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-new-cohort.png" alt-text="Screenshot of making a new cohort.":::

Selecting **Dashboard configuration** will open a panel with a list of the components you’ve configured in your dashboard. You can hide components in your dashboard by selecting the ‘trash’ icon.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-configuration.png" alt-text="Screenshot of dashboard configuration.":::

You can add components back into your dashboard via the blue circular ‘+’ icon in the divider between each component.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/view-dashboard-add-component.png" alt-text="Screenshot of adding a component to the dashboard. ":::

### Error analysis

#### Error tree map

The first tab of the Error analysis component is the Tree map, which illustrates how model failure is distributed across different cohorts with a tree visualization. Select any node to see the prediction path on your features where error was found.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/error-analysis-treemap-selected.png" alt-text="Screenshot of the dashboard showing error analysis on the tree map tab. ":::

1. Heatmap view: switches to heatmap visualization of error distribution.
2. Feature list: allows you to modify the features used in the heatmap using a side panel.
3. Error coverage: displays the percentage of all error in the dataset concentrated in the selected node.
4. Error (regression) or Error rate (classification): displays the error or percentage of failures of all the datapoints in the selected node.
5. Node: represents a cohort of the dataset, potentially with filters applied, and the number of errors out of the total number of datapoints in the cohort.
6. Fill line: visualizes the distribution of datapoints into child cohorts based on filters, with number of datapoints represented through line thickness.
7. Selection information: contains information about the selected node in a side panel.
8. Save as a new cohort: creates a new cohort with the given filters.
9. Instances in the base cohort: displays the total number of points in the entire dataset, as well as the number of correctly and incorrectly predicted points.
10. Instances in the selected cohort: displays the total number of points in the selected node, as well as the number of correctly and incorrectly predicted points.
11. Prediction path (filters): lists the filters placed over the full dataset to create this smaller cohort.


Selecting the "Feature list" button opens a side panel which allows you to re-train the error tree on specific features.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/error-analysis-feature-selection.png" alt-text="Screenshot of the dashboard showing error analysis tree map feature list. ":::

1. Search features: allows you to find specific features in the dataset.
2. Features: lists the name of the feature in the dataset.
3. Importances: A guideline for how related the feature may be to the error. Calculated via mutual information score between the feature and the error on the labels. You can use this score to help you decide which features to choose in Error Analysis.
4. Check mark: allows you to add or remove the feature from the tree map.
5. Maximum depth: The maximum depth of the surrogate tree trained on errors.
6. Number of leaves: The number of leaves of the surrogate tree trained on errors.
7. Minimum number of samples in one leaf: The minimum number of data required to create one leaf.

#### Error heat map

Selecting the **Heat map** tab switches to a different view of the error in the dataset. You can click on one or many heat map cells and create new cohorts. You can choose up to 2 features to create a heatmap.

:::image type="content" source="./media/how-to-responsible-ai-dashboard/error-analysis-heat-map.png" alt-text="Screenshot of the dashboard showing error analysis tree map feature list. ":::

1. Number of Cells: displays the number of cells selected.
2. Error coverage: displays the percentage of all errors concentrated in the selected cell(s).
3. Error rate: displays the percentage of failures of all datapoints in the selected cell(s).
4. Axis features: selects the intersection of features to display in the heatmap.
5. Cells: represents a cohort of the dataset, with filters applied, and the percentage of errors out of the total number of datapoints in the cohort. A blue outline indicates selected cells, and the darkness of red represents the concentration of failures.
6. Prediction path (filters): lists the filters placed over the full dataset for each selected cohort.

### Model overview and fairness disparity metrics

The Model overview component provides a comprehensive set of performance and fairness metrics to evaluate your model, along with key performance disparity metrics along specified features and dataset cohorts.  

#### Dataset cohort metrics

The **Dataset cohort** tab allows you to investigate your model by comparing the model performance of different user-specified dataset cohorts (accessible via the **Cohort settings** icon on the top right corner of the dashboard). You can create new dataset cohorts from the UI experience or pass your pre-built cohorts to the dashboard via the SDK experience.

### Data explorer
### Feature importances (model explanations)
### Counterfactual what-if
### Causal analysis