---
title: Generate Responsible AI dashboard in the studio UI (preview) 
titleSuffix: Azure Machine Learning
description: Learn how to generate the Responsible AI dashboard with no-code experience in the Azure Machine Learning studio UI.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: lagayhar
author: lgayhardt
ms.date: 05/10/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Generate Responsible AI dashboard in the studio UI (preview)

You can create a Responsible AI dashboard with a no-code experience in the Azure Machine Learning studio UI. To start the wizard, navigate to the registered model you’d like to create Responsible AI insights for and select the **Details** tab. Then select the **Create Responsible AI dashboard (preview)** button.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-page.png" alt-text="Screenshot of the wizard details tab with create responsible AI dashboard tab highlighted." lightbox ="./media/how-to-responsible-ai-dashboard-ui/model-page.png":::

The wizard is designed to provide an interface to input all the necessary parameters to instantiate your Responsible AI dashboard without having to touch code. The experience takes place entirely in the Azure Machine Learning studio UI with a guided flow and instructional text to help contextualize the variety of choices in which Responsible AI components you’d like to populate your dashboard with. The wizard is divided into five steps:

1. Datasets
2. Modeling task
3. Dashboard components
4. Component parameters
5. Experiment configuration

## Select your datasets

The first step is to select the train and test dataset that you used when training your model to generate model-debugging insights. For components like Causal analysis, which doesn't require a model, the train dataset will be used to train the causal model to generate the causal insights.

> [!NOTE]
> Only tabular dataset formats are supported.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/datasets.png" alt-text="Screenshot of the wizard on datasets for training and testing." lightbox= "./media/how-to-responsible-ai-dashboard-ui/datasets.png":::

1. **Select a dataset for training**: Select the dropdown to view your registered datasets in Azure Machine Learning workspace. This dataset will be used to generate Responsible AI insights for components such as model explanations and error analysis.  
2. **Create new dataset**: If the desired datasets aren't in your Azure Machine Learning workspace, select “New dataset” to upload your dataset
3. **Select a dataset for testing**: Select the dropdown to view your registered datasets in Azure Machine Learning workspace. This dataset is used to populate your Responsible AI dashboard visualizations.

## Select your modeling task

After you picked your dataset, select your modeling task type.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/modeling.png" alt-text="Screenshot of the wizard on modeling task type." lightbox= "./media/how-to-responsible-ai-dashboard-ui/modeling.png":::

> [!NOTE]
> The wizard only supports models with MLflow format and sci-kit learn flavor.

## Select your dashboard components

The Responsible AI dashboard offers two profiles for recommended sets of tools you can generate:

- **Model debugging**: Understand and debug erroneous data cohorts in your ML model using Error analysis, Counterfactual what-if examples, and Model explainability
- **Real life interventions**: Understand and debug erroneous data cohorts in your ML model using Causal analysis

> [!NOTE]
> Multi-class classification does not support Real-life intervention analysis profile.
Select the desired profile, then **Next**.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-debug.png" alt-text="Screenshot of the wizard on dashboard components." lightbox ="./media/how-to-responsible-ai-dashboard-ui/model-debug.png":::

## Configure parameters for dashboard components

Once you’ve selected a profile, the configuration step for the corresponding components will appear.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-debug-parameters.png" alt-text="Screenshot of the wizard on component parameters." lightbox = "./media/how-to-responsible-ai-dashboard-ui/model-debug-parameters.png":::

Component parameters for model debugging:

1. **Target feature (required)**: Specify the feature that your model was trained to predict
2. **Categorical features**: Indicate which features are categorical to properly render them as categorical values in the dashboard UI. This is pre-loaded for you based on your dataset metadata.
3. **Generate error tree and heat map**: Toggle on and off to generate an error analysis component for your Responsible AI dashboard
4. **Features for error heat map**: Select up to two features to pre-generate an error heatmap for. 
5. **Advanced configuration**: Specify additional parameters for your error tree such as Maximum depth, Number of leaves, Minimum number of samples in one leaf.
6. **Generate counterfactual what-if examples**: Toggle on and off to generate counterfactual what-if component for your Responsible AI dashboard
7. **Number of counterfactuals (required)**: Specify the number of counterfactual examples you want generated per datapoint. A minimum of at least 10 should be generated to enable a bar chart view in the dashboard of which features were most perturbed on average to achieve the desired prediction.
8. **Range of value predictions (required)**: Specify for regression scenarios the desired range you want counterfactual examples to have prediction values in. For binary classification scenarios, it will automatically be set to generate counterfactuals for the opposite class of each datapoint. For multi-classification scenarios, there will be a drop-down to specify which class you want each datapoints to be predicted as.
9. **Specify features to perturb**: By default, all features will be perturbed. However, if there are specific features you want perturbed, clicking this will open a panel with the list of features to select. (See below)
10. **Generate explanations**: Toggle on and off to generate a model explanation component for your Responsible AI dashboard. No configuration is necessary as a default opaque box mimic explainer will be used to generate feature importances.

For counterfactuals when you select “Specify features to perturb”, you can specify which range you want to allow perturbations in. For example: for the feature YOE (Years of experience), specify that counterfactuals should only have feature values ranging from 10 to 21 instead of the default 5 to 21.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/model-debug-counterfactuals.png" alt-text="Screenshot of the wizard on component parameters when you select specify features to perturb." lightbox = "./media/how-to-responsible-ai-dashboard-ui/model-debug-counterfactuals.png":::

Alternatively, if you're interested in selecting **Real-life interventions** profile, you’ll see the following screen generate a causal analysis. This will help you understand causal effects of features you want to “treat” on a certain outcome you wish to optimize.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/real-life-parameters.png" alt-text="Screenshot of the wizard on component parameters for real-life intervention use causal analysis." lightbox = "./media/how-to-responsible-ai-dashboard-ui/real-life-parameters.png":::

Component parameters for real-life intervention use causal analysis:

1. **Target feature (required)**: Choose the outcome you want the causal effects to be calculated for.
2. **Treatment features (required)**: Choose one or more features you’re interested in changing (“treating”) to optimize the target outcome.
3. **Categorical features**: Indicate which features are categorical to properly render them as categorical values in the dashboard UI. This is pre-loaded for you based on your dataset metadata.
4. **Advanced settings**: Specify additional parameters for your causal analysis such as heterogenous features (additional features to understand causal segmentation in your analysis in addition to your treatment features) and which causal model you’d like to be used.

## Experiment configuration

Finally, configure your experiment to kick off a job to generate your Responsible AI dashboard.

:::image type="content" source="./media/how-to-responsible-ai-dashboard-ui/experiment-config.png" alt-text="Screenshot of the wizard on experiment configuration." lightbox= "./media/how-to-responsible-ai-dashboard-ui/experiment-config.png":::

1. **Name**: Give your dashboard a unique name so that you can differentiate it when you’re viewing the list of dashboards for a given model.
2. **Experiment name**: Select an existing experiment to run the job in, or create a new experiment.
3. **Existing experiment**: Select an existing experiment from drop-down.
4. **Select compute type**: Specify which compute type you’d like to use to execute your job. 
5. **Select compute**: Select from a drop-down that compute you’d like to use. If there are no existing compute resources, select the “+” to create a new compute resource and refresh the list.
6. **Description**: Add a more verbose description for your Responsible AI dashboard.
7. **Tags**: Add any tags to this Responsible AI dashboard.

After you’ve finished your experiment configuration, select **Create** to start the generation of your Responsible AI dashboard. You'll be redirected to the experiment page to track the progress of your job. See below next steps on how to view your Responsible AI dashboard.

## Next steps

- Once your Responsible AI dashboard is generated, [view how to access and use it in Azure Machine Learning studio](how-to-responsible-ai-dashboard.md)
- Summarize and share your Responsible AI insights with the [Responsible AI scorecard as a PDF export](how-to-responsible-ai-scorecard.md).
- Learn more about the  [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Learn more about how to [collect data responsibly](concept-sourcing-human-data.md)
