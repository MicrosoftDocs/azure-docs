---
title: Share insights with a Responsible AI scorecard (preview)
titleSuffix: Azure Machine Learning
description: Share insights with non-technical business stakeholders by exporting a PDF Responsible AI scorecard from Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.date: 08/17/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Share insights with a Responsible AI scorecard (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

An Azure Machine Learning Responsible AI scorecard is a PDF report that's generated based on Responsible AI dashboard insights and customizations to accompany your machine learning models. You can easily configure, download, and share your PDF scorecard with your technical and non-technical stakeholders to educate them about your data and model health and compliance, and to help build trust. You can also use the scorecard in audit reviews to inform the stakeholders about the characteristics of your model.


## Why a Responsible AI scorecard?

The Responsible AI dashboard is designed for machine learning professionals and data scientists to explore and evaluate model insights and inform their data-driven decisions. Though the dashboard can help you implement Responsible AI practically in your machine learning lifecycle, there are some needs left unaddressed:

- There often exists a gap between the technical Responsible AI tools (designed for machine learning professionals) and the ethical, regulatory, and business requirements that define the production environment.
- Although an end-to-end machine learning lifecycle keeps both technical and non-technical stakeholders in the loop, there's very little support to enable an effective multi-stakeholder alignment where technical experts get timely feedback and direction from the non-technical stakeholders.
- AI regulations make it essential to be able to share model and data insights with auditors and risk officers for auditability purposes.

One of the biggest benefits of using the Azure Machine Learning ecosystem is related to the ability to archive, for quick future reference, model and data insights in the Azure Machine Learning run history. As a part of that infrastructure and to accompany machine learning models and their corresponding Responsible AI dashboards, we're introducing the Responsible AI scorecard to empower machine learning professionals to generate and share their data and model health records easily. 

## Who should use a Responsible AI scorecard?

* If you're a data scientist or machine learning professional: 
  
  After training your model and generating its corresponding Responsible AI dashboards for assessment and decision-making purposes, you can extract those learnings via our PDF scorecard and share the report easily with your technical and non-technical stakeholders. Doing so helps build trust and gain their approval for deployment.  

* If you're a product manager, a business leader, or an accountable stakeholder on an AI product:

   You can pass your desired model performance and fairness target values, such as target accuracy or target error rate, to your data science team. The team can generate a scorecard with respect to your identified target values, assess whether your model meets them, and then advise as to whether the model should be deployed or further improved.

## Generate a Responsible AI scorecard

The configuration stage requires you to use your domain expertise around the problem to set your desired target values on model performance and fairness metrics.

As with other Responsible AI dashboard components [configured in the YAML pipeline](how-to-responsible-ai-dashboard-sdk-cli.md?tabs=yaml#responsible-ai-components), you can add a component to generate the scorecard in the YAML pipeline.

In the following code, the *pdf_gen.json* file is the JSON configuration file for scorecard generation, and *cohorts.json* is the JSON definition file for pre-built cohorts.

```yml
scorecard_01: 

   type: command 
   component: azureml:rai_score_card@latest 
   inputs: 
     dashboard: ${{parent.jobs.gather_01.outputs.dashboard}} 
     pdf_generation_config: 
       type: uri_file 
       path: ./pdf_gen.json 
       mode: download 

     predefined_cohorts_json: 
       type: uri_file 
       path: ./cohorts.json 
       mode: download 

```

Here's a sample JSON file for cohorts definition and scorecard-generation configuration:


Cohorts definition:
```yml
[ 
  { 
    "name": "High Yoe", 
    "cohort_filter_list": [ 
      { 
        "method": "greater", 
        "arg": [ 
          5 
        ], 
        "column": "YOE" 
      } 
    ] 
  }, 
  { 
    "name": "Low Yoe", 
    "cohort_filter_list": [ 
      { 
        "method": "less", 
        "arg": [ 
          6.5 
        ], 
        "column": "YOE" 
      } 
    ] 
  } 
] 
```

Here's a scorecard-generation configuration file as a regression example:

```yml
{ 
  "Model": { 
    "ModelName": "GPT-2 Access", 
    "ModelType": "Regression", 
    "ModelSummary": "This is a regression model to analyze how likely a programmer is given access to GPT-2" 
  }, 
  "Metrics": { 
    "mean_absolute_error": { 
      "threshold": "<=20" 
    }, 
    "mean_squared_error": {} 
  }, 
  "FeatureImportance": { 
    "top_n": 6 
  }, 
  "DataExplorer": { 
    "features": [ 
      "YOE", 
      "age" 
    ] 
  }, 
  "Fairness": {
    "metric": ["mean_squared_error"],
    "sensitive_features": ["YOUR SENSITIVE ATTRIBUTE"],
    "fairness_evaluation_kind": "difference OR ratio"
  },
  "Cohorts": [ 
    "High Yoe", 
    "Low Yoe" 
  ]  
} 
```

Here's a scorecard-generation configuration file as a classification example:

```yml
{
  "Model": {
    "ModelName": "Housing Price Range Prediction",
    "ModelType": "Classification",
    "ModelSummary": "This model is a classifier that predicts whether the house will sell for more than the median price."
  },
  "Metrics" :{
    "accuracy_score": {
        "threshold": ">=0.85"
    },
  }
  "FeatureImportance": { 
    "top_n": 6 
  }, 
  "DataExplorer": { 
    "features": [ 
      "YearBuilt", 
      "OverallQual", 
      "GarageCars"
    ] 
  },
  "Fairness": {
    "metric": ["accuracy_score", "selection_rate"],
    "sensitive_features": ["YOUR SENSITIVE ATTRIBUTE"],
    "fairness_evaluation_kind": "difference OR ratio"
  }
}
```


### Definition of inputs for the Responsible AI scorecard component

This section lists and defines the parameters that are required to configure the Responsible AI scorecard component.

#### Model

| ModelName | Name of model |
|---|---|
| `ModelType` | Values in ['classification', 'regression']. |
| `ModelSummary` | Enter text that summarizes what the model is for. |

> [!NOTE]
> For multi-class classification, you should first use the One-vs-Rest strategy to choose your reference class, and then split your multi-class classification model into a binary classification problem for your selected reference class versus the rest of the classes.

#### Metrics

| Performance metric | Definition | Model type |
|---|---|---|
| `accuracy_score` | The fraction of data points that are classified correctly. | Classification |
| `precision_score` | The fraction of data points that are classified correctly among those classified as 1. | Classification |
| `recall_score` | The fraction of data points that are classified correctly among those whose true label is 1. Alternative names: true positive rate, sensitivity. | Classification |
| `f1_score` | The F1 score is the harmonic mean of precision and recall. | Classification |
| `error_rate` | The proportion of instances that are misclassified over the whole set of instances. | Classification |
| `mean_absolute_error` | The average of absolute values of errors. More robust to outliers than `mean_squared_error`. | Regression |
| `mean_squared_error` | The average of squared errors. | Regression |
| `median_absolute_error` | The median of squared errors. | Regression |
| `r2_score` | The fraction of variance in the labels explained by the model. | Regression |

Threshold: The desired threshold for the selected metric. Allowed mathematical tokens are >, <, >=, and <=m, followed by a real number. For example, >= 0.75 means that the target for the selected metric is greater than or equal to 0.75.

#### Feature importance

top_n: The number of features to show, with a maximum of 10. Positive integers up to 10 are allowed.

#### Fairness

| Metric | Definition |
|--|--|
| `metric` | The primary metric for evaluation fairness. |
| `sensitive_features` | A list of feature names from the input dataset to be designated as sensitive features for the fairness report. |
| `fairness_evaluation_kind` | Values in ['difference', 'ratio']. |
| `threshold` | The *desired target values* of the fairness evaluation. Allowed mathematical tokens are >, <, >=,  and <=, followed by a real number.<br>For example, metric="accuracy", fairness_evaluation_kind="difference".<br><= 0.05 means that the target for the difference in accuracy is less than or equal to 0.05. |

> [!NOTE]
> Your choice of `fairness_evaluation_kind` (selecting 'difference' versus 'ratio') affects the scale of your target value. In your selection, be sure to choose a meaningful target value.

You can select from the following metrics, paired with `fairness_evaluation_kind`, to configure your fairness assessment component of the scorecard:

| Metric | fairness_evaluation_kind | Definition | Model type |
|---|---|---|---|
| `accuracy_score` | difference | The maximum difference in accuracy score between any two groups. | Classification |
| `accuracy_score` | ratio | The minimum ratio in accuracy score between any two groups. | Classification |
| `precision_score` | difference | The maximum difference in precision score between any two groups. | Classification |
| `precision_score` | ratio | The maximum ratio in precision score between any two groups. | Classification |
| `recall_score` | difference | The maximum difference in recall score between any two groups. | Classification |
| `recall_score` | ratio | The maximum ratio in recall score between any two groups. | Classification |
| `f1_score` | difference | The maximum difference in f1 score between any two groups. | Classification |
| `f1_score` | ratio | The maximum ratio in f1 score between any two groups. | Classification |
| `error_rate` | difference | The maximum difference in error rate between any two groups. | Classification |
| `error_rate` | ratio | The maximum ratio in error rate between any two groups.|Classification|
| `Selection_rate` | difference | The maximum difference in selection rate between any two groups. | Classification |
| `Selection_rate` | ratio | The maximum ratio in selection rate between any two groups. | Classification |
| `mean_absolute_error` | difference | The maximum difference in mean absolute error between any two groups. | Regression |
| `mean_absolute_error` | ratio | The maximum ratio in mean absolute error between any two groups. | Regression |
| `mean_squared_error` | difference | The maximum difference in mean squared error between any two groups. | Regression |
| `mean_squared_error` | ratio | The maximum ratio in mean squared error between any two groups. | Regression |
| `median_absolute_error` | difference | The maximum difference in median absolute error between any two groups. | Regression |
| `median_absolute_error` | ratio | The maximum ratio in median absolute error between any two groups. | Regression |
| `r2_score` | difference | The maximum difference in R<sup>2</sup> score between any two groups. | Regression |
| `r2_Score` | ratio | The maximum ratio in R<sup>2</sup> score between any two groups. | Regression |

## View your Responsible AI scorecard

The Responsible AI scorecard is linked to a Responsible AI dashboard. To view your Responsible AI scorecard, go into your model registry and select the registered model that you've generated a Responsible AI dashboard for. After you've selected your model, select the **Responsible AI (preview)** tab to view a list of generated dashboards. Select which dashboard you want to export a Responsible AI scorecard PDF for by selecting **Responsible AI scorecard (preview)**.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-studio.png" alt-text="Screenshot of the 'Responsible AI (preview)' pane in Azure Machine Learning studio, with the 'Responsible AI scorecard (preview)' tab highlighted." lightbox = "./media/how-to-responsible-ai-scorecard/scorecard-studio.png":::

1. Select **Responsible AI scorecard (preview)** to display a list of all Responsible AI scorecards that are generated for this dashboard.

   :::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-studio-dropdown.png" alt-text="Screenshot of Responsible AI scorecard dropdown." lightbox ="./media/how-to-responsible-ai-scorecard/scorecard-studio-dropdown.png":::

1. In the list, select the scorecard you want to download, and then select **Download** to download the PDF to your machine.

   :::image type="content" source="./media/how-to-responsible-ai-scorecard/studio-select-scorecard.png" alt-text="Screenshot of the 'Responsible AI scorecards' pane for selecting a scorecard to download." lightbox= "./media/how-to-responsible-ai-scorecard/studio-select-scorecard.png":::

## Read your Responsible AI scorecard

The Responsible AI scorecard is a PDF summary of key insights from your Responsible AI dashboard. The first summary segment of the scorecard gives you an overview of the machine learning model and the key target values you've set to help your stakeholders determine whether the model is ready to be deployed:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-summary.png" alt-text="Screenshot of the model summary on the Responsible AI scorecard PDF.":::

The data explorer segment shows you characteristics of your data, because any model story is incomplete without a correct understanding of your data:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-data-explorer.png" alt-text="Screenshot of the data explorer on the Responsible AI scorecard PDF.":::

The model performance segment displays your model's most important metrics and characteristics of your predictions and how well they satisfy your desired target values:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-model-performance.png" alt-text="Screenshot of the model performance on the Responsible AI scorecard PDF.":::

Next, you can also view the top performing and worst performing data cohorts and subgroups that are automatically extracted for you to see the blind spots of your model:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-cohorts.png" alt-text="Screenshot of data cohorts and subgroups on the Responsible AI scorecard PDF.":::

You can see the top important factors that affect your model predictions, which is a requirement to build trust with how your model is performing its task:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-feature-importance.png" alt-text="Screenshot of the top important factors on the Responsible AI scorecard PDF.":::

You can further see your model fairness insights summarized and inspect how well your model is satisfying the fairness target values you've set for your desired sensitive groups:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-fairness.png" alt-text="Screenshot of the fairness insights on the Responsible AI scorecard PDF.":::

Finally, you can see your dataset's causal insights summarized, which can help you determine whether your identified factors or treatments have any causal effect on the real-world outcome:

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-causal.png" alt-text="Screenshot of the dataset's causal insights on the Responsible AI scorecard PDF.":::

## Next steps

- See the how-to guide for generating a Responsible AI dashboard via [CLI&nbsp;v2 and SDK&nbsp;v2](how-to-responsible-ai-dashboard-sdk-cli.md) or the [Azure Machine Learning studio UI](how-to-responsible-ai-dashboard-ui.md).
- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View [sample YAML and Python notebooks](https://aka.ms/RAIsamples) to generate a Responsible AI dashboard with YAML or Python.
- Learn more about how you can use the Responsible AI dashboard and scorecard to debug data and models and inform better decision-making in this [tech community blog post](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
- Learn about how the Responsible AI dashboard and scorecard were used by the UK National Health Service (NHS) in a [real-life customer story](https://aka.ms/NHSCustomerStory).
- Explore the features of the Responsible AI dashboard through this [interactive AI lab web demo](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
