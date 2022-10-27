---
title: Generate a Responsible AI dashboard (preview) in the studio UI 
titleSuffix: Azure Machine Learning
description: Learn how to generate a Responsible AI dashboard with no-code experience in the Azure Machine Learning studio UI.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: lagayhar
author: lgayhardt
ms.date: 08/17/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Generate a Responsible AI dashboard (preview) in the studio UI

In this article, you create a Responsible AI dashboard with a no-code experience in the [Azure Machine Learning studio UI](https://ml.azure.com/). To access the dashboard generation wizard, do the following:

1. [Register your model](how-to-manage-models.md) in Azure Machine Learning so that you can access the no-code experience.
1. On the left pane of Azure Machine Learning studio, select the **Models** tab.
1. Select the registered model that you want to create Responsible AI insights for, and then select the **Details** tab.
1. Select **Create Responsible AI dashboard (preview)**.

    :::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-page.png" alt-text="Screenshot of the wizard details pane with 'Create Responsible AI dashboard (preview)' tab highlighted." lightbox ="./media/how-to-responsible-ai-dashboard-ui/model-page.png":::

To learn more, see the Responsible AI dashboard [supported model types and limitations](concept-responsible-ai-dashboard.md#supported-scenarios-and-limitations).

The wizard provides an interface for entering all the necessary parameters to create your Responsible AI dashboard without having to touch code. The experience takes place entirely in the Azure Machine Learning studio UI. The studio presents a guided flow and instructional text to help contextualize the variety of choices about which Responsible AI components you’d like to populate your dashboard with. 

The wizard is divided into five sections:

1. Datasets
1. Modeling task
1. Dashboard components
1. Component parameters
1. Experiment configuration

## Select your datasets

In the first section, you select the train and test datasets that you used when you trained your model to generate model-debugging insights. For components like causal analysis, which doesn't require a model, you use the train dataset to train the causal model to generate the causal insights.

> [!NOTE]
> Only tabular dataset formats are supported.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/datasets.png" alt-text="Screenshot of the wizard, showing the 'Datasets for training and testing' pane." lightbox= "./media/how-to-responsible-ai-dashboard-ui/datasets.png":::

1. **Select a dataset for training**: In the dropdown list of registered datasets in the Azure Machine Learning workspace, select the dataset you want to use to generate Responsible AI insights for components, such as model explanations and error analysis.  

1. **Select a dataset for testing**: In the dropdown list, select the dataset you want to use to populate your Responsible AI dashboard visualizations.

1. If the train or test dataset you want to use isn't listed, select **New dataset** to upload it.

## Select your modeling task

After you've picked your datasets, select your modeling task type, as shown in the following image:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/modeling.png" alt-text="Screenshot of the wizard on modeling task type." lightbox= "./media/how-to-responsible-ai-dashboard-ui/modeling.png":::

> [!NOTE]
> The wizard supports only models in MLflow format and with a sklearn (scikit-learn) flavor.

## Select your dashboard components

The Responsible AI dashboard offers two profiles for recommended sets of tools that you can generate:

- **Model debugging**: Understand and debug erroneous data cohorts in your machine learning model by using error analysis, counterfactual what-if examples, and model explainability.
- **Real-life interventions**: Understand and debug erroneous data cohorts in your machine learning model by using causal analysis.

    > [!NOTE]
    > Multi-class classification doesn't support the real-life interventions analysis profile.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-debug.png" alt-text="Screenshot of the wizard, showing the 'Model debugging' and 'Real-life interventions' profiles." lightbox ="./media/how-to-responsible-ai-dashboard-ui/model-debug.png":::

1. Select the profile you want to use.
1. Select **Next**.


## Configure parameters for dashboard components

After you’ve selected a profile, the **Component parameters for model debugging** configuration pane for the corresponding components appears.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-debug-parameters.png" alt-text="Screenshot of the wizard, showing the 'Component parameters for model debugging' configuration pane." lightbox = "./media/how-to-responsible-ai-dashboard-ui/model-debug-parameters.png":::

Component parameters for model debugging:

1. **Target feature (required)**: Specify the feature that your model was trained to predict.
1. **Categorical features**: Indicate which features are categorical to properly render them as categorical values in the dashboard UI. This field is pre-loaded for you based on your dataset metadata.
1. **Generate error tree and heat map**: Toggle on and off to generate an error analysis component for your Responsible AI dashboard.
1. **Features for error heat map**: Select up to two features that you want to pre-generate an error heatmap for. 
1. **Advanced configuration**: Specify additional parameters, such as **Maximum depth of error tree**, **Number of leaves in error tree**, and **Minimum number of samples in each leaf node**.
1. **Generate counterfactual what-if examples**: Toggle on and off to generate a counterfactual what-if component for your Responsible AI dashboard.
1. **Number of counterfactuals (required)**: Specify the number of counterfactual examples that you want generated per data point. A minimum of 10 should be generated to enable a bar chart view of the features that were most perturbed, on average, to achieve the desired prediction.
1. **Range of value predictions (required)**: Specify for regression scenarios the range that you want counterfactual examples to have prediction values in. For binary classification scenarios, the range will automatically be set to generate counterfactuals for the opposite class of each data point. For multi-classification scenarios, use the dropdown list to specify which class you want each data point to be predicted as.
1. **Specify which features to perturb**: By default, all features will be perturbed. However, if you want only specific features to be perturbed, select **Specify which features to perturb for generating counterfactual explanations** to display a pane with a list of features to select.

    When you select **Specify which features to perturb**, you can specify the range you want to allow perturbations in. For example: for the feature YOE (Years of experience), specify that counterfactuals should have feature values ranging from only 10 to 21 instead of the default values of 5 to 21.

    :::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-debug-counterfactuals.png" alt-text="Screenshot of the wizard, showing a pane of features you can specify to perturb." lightbox = "./media/how-to-responsible-ai-dashboard-ui/model-debug-counterfactuals.png":::

1. **Generate explanations**: Toggle on and off to generate a model explanation component for your Responsible AI dashboard. No configuration is necessary, because a default opaque box mimic explainer will be used to generate feature importances.

Alternatively, if you select the **Real-life interventions** profile, you’ll see the following screen generate a causal analysis. This will help you understand the causal effects of features you want to “treat” on a certain outcome you want to optimize.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/real-life-parameters.png" alt-text="Screenshot of the wizard, showing the 'Component parameters for real-life interventions' pane." lightbox = "./media/how-to-responsible-ai-dashboard-ui/real-life-parameters.png":::

Component parameters for real-life interventions use causal analysis. Do the following:

1. **Target feature (required)**: Choose the outcome you want the causal effects to be calculated for.
1. **Treatment features (required)**: Choose one or more features that you’re interested in changing (“treating”) to optimize the target outcome.
1. **Categorical features**: Indicate which features are categorical to properly render them as categorical values in the dashboard UI. This field is pre-loaded for you based on your dataset metadata.
1. **Advanced settings**: Specify additional parameters for your causal analysis, such as heterogenous features (that is, additional features to understand causal segmentation in your analysis, in addition to your treatment features) and which causal model you want to be used.

## Configure your experiment

Finally, configure your experiment to kick off a job to generate your Responsible AI dashboard.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/experiment-config.png" alt-text="Screenshot of the wizard, showing the 'Training job or experiment configuration' pane." lightbox= "./media/how-to-responsible-ai-dashboard-ui/experiment-config.png":::

On the **Training job or experiment configuration** pane, do the following:

1. **Name**: Give your dashboard a unique name so that you can differentiate it when you’re viewing the list of dashboards for a given model.
1. **Experiment name**: Select an existing experiment to run the job in, or create a new experiment.
1. **Existing experiment**: In the dropdown list, select an existing experiment.
1. **Select compute type**: Specify which compute type you want to use to execute your job.
1. **Select compute**: In the dropdown list, select the compute you want to use. If there are no existing compute resources, select the plus sign (**+**), create a new compute resource, and then refresh the list.
1. **Description**: Add a longer description of your Responsible AI dashboard.
1. **Tags**: Add any tags to this Responsible AI dashboard.

After you’ve finished configuring your experiment, select **Create** to start generating your Responsible AI dashboard. You'll be redirected to the experiment page to track the progress of your job. 

In the "Next steps" section, you can learn how to view and use your Responsible AI dashboard.

## Next steps

- After you've generated your Responsible AI dashboard, [view how to access and use it in Azure Machine Learning studio](how-to-responsible-ai-dashboard.md).
- Summarize and share your Responsible AI insights with the [Responsible AI scorecard as a PDF export](how-to-responsible-ai-scorecard.md).
- Learn more about the  [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Learn more about how to [collect data responsibly](concept-sourcing-human-data.md).
- Learn more about how to use the Responsible AI dashboard and scorecard to debug data and models and inform better decision-making in this [tech community blog post](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
- Learn about how the Responsible AI dashboard and scorecard were used by the UK National Health Service (NHS) in a [real life customer story](https://aka.ms/NHSCustomerStory).
- Explore the features of the Responsible AI dashboard through this [interactive AI Lab web demo](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
