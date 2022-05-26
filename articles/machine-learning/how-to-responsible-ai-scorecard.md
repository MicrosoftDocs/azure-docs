---
title: Share insights with Responsible AI scorecard (preview)
titleSuffix: Azure Machine Learning
description: Share insights with non-technical business stakeholders by exporting a PDF Responsible AI scorecard from Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.date: 05/10/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Share insights with Responsible AI scorecard (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning’s Responsible AI dashboard is designed for machine learning professionals and data scientists to explore and evaluate model insights and inform their data-driven decisions, and while it can help you implement Responsible AI practically in your machine learning lifecycle, there are some needs left unaddressed:

- There often exists a gap between the technical Responsible AI tools (designed for machine-learning professionals) and the ethical, regulatory, and business requirements that define the production environment.
- While an end-to-end machine learning life cycle includes both technical and non-technical stakeholders in the loop, there's very little support to enable an effective multi-stakeholder alignment, helping technical experts get timely feedback and direction from the non-technical stakeholders.
- AI regulations make it essential to be able to share model and data insights with auditors and risk officers for auditability purposes.

One of the biggest benefits of using the Azure Machine Learning ecosystem is related to the archival of model and data insights in the Azure Machine Learning Job History (for quick reference in future). As a part of that infrastructure and to accompany machine learning models and their corresponding Responsible AI dashboards, we introduce the Responsible AI scorecard, a customizable report that you can easily configure, download, and share with your technical and non-technical stakeholders to educate them about your data and model health and compliance and build trust. This scorecard could also be used in audit reviews to inform the stakeholders about the characteristics of your model.

## Who should use a Responsible AI scorecard?

As a data scientist or machine learning professional, after you train a model and generate its corresponding Responsible AI dashboard for assessment and decision-making purposes, you can share your data and model health and ethical insights with non-technical stakeholders to build trust and gain their approval for deployment.  

As a technical or non-technical product owner of a model, you can pass some target values such as minimum accuracy, maximum error rate, etc., to your data science team, asking them to generate this scorecard with respect to your identified target values and whether your model meets them. That can provide guidance into whether the model should be deployed or further improved.

## How to generate a Responsible AI scorecard

The configuration stage requires you to use your domain expertise around the problem to set your desired target values on model performance and fairness metrics.

Like other Responsible AI dashboard components configured in the YAML pipeline, you can add a component to generate the scorecard in the YAML pipeline.

Where pdf_gen.json is the scorecard generation configuration json file and cohorts.json is the prebuilt cohorts definition json file.

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

Sample json for cohorts definition and score card generation config can be found below:

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

Scorecard generation config:

```yml
{ 
  "Model": { 
    "ModelName": "GPT2 Access", 
    "ModelType": "Regression", 
    "ModelSummary": "This is a regression model to analyzer how likely a programmer is given access to gpt 2" 
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
  "Cohorts": [ 
    "High Yoe", 
    "Low Yoe" 
  ] 
} 
```

### Definition of inputs of the Responsible AI scorecard component

This section defines the list of parameters required to configure the Responsible AI scorecard component.

#### Model

| ModelName    | Name of Model                                            |
|--------------|----------------------------------------------------------|
| ModelType    | Values in [‘classification’, ‘regression’, ‘multiclass’]. |
| ModelSummary | Input a blurb of text summarizing what the model is for.  |

#### Metrics

| Performance Metric    | Definition                                                                                                                             | Model Type     |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------|----------------|
| accuracy_score        | The fraction of data points classified correctly.                                                                                       | Classification |
| precision_score       | The fraction of data points classified correctly among those classified as 1.                                                           | Classification |
| recall_score          | The fraction of data points classified correctly among those whose true label is 1. Alternative names: true positive rate, sensitivity | Classification |
| f1_score              | F1-score is the harmonic mean of precision and recall.                                                                                  | Classification |
| error_rate            | Proportion of instances misclassified over the whole set of instances.                                                                  | Classification |
| mean_absolute_error   | The average of absolute values of errors. More robust to outliers than MSE.                                                             | Regression     |
| mean_squared_error    | The average of squared errors.                                                                                                          | Regression     |
| median_absolute_error | The median of squared errors.                                                                                                           | Regression     |
| r2_score              | The fraction of variance in the labels explained by the model.                                                                          | Regression     |

Threshold:
 Desired threshold for selected metric. Allowed mathematical tokens are >, <, >=,  and <= followed by a real number. For example, >= 0.75 means that the target for selected metric is greater than or equal to 0.75.

#### Feature importance

top_n:
Number of features to show with a maximum of 10. Positive integers up to 10 are allowed.

#### Fairness

| Metric | Definition |
|--|--|
| metric | Primary metric for evaluation fairness |
| sensitive_features | A list of feature name from input dataset to be designated as sensitive feature for fairness report. |
| fairness_evaluation_kind | Values in [‘difference’, ‘ratio’]. |
| threshold | **Desired target values** of the fairness evaluation. Allowed mathematical tokens are >, <, >=,  and <= followed by a real number. For example, metric=“accuracy”, fairness_evaluation_kind=”difference” <= 0.05 means that the target of for the difference in accuracy is less than or equal to 0.05. |

> [!NOTE]
 Your choice of `fairness_evaluation_kind` (selecting ‘difference’ vs ‘ratio) impacts the scale of your target value. Be mindful of your selection to choose a meaningful target value.

You can select from the following metrics, paired with the `fairness_evaluation_kind` to configure your fairness assessment component of the scorecard:

| Metric | fairness_evaluation_kind | Definition | Model Type |
|---|---|---|---|
| accuracy_score | difference | The maximum difference in accuracy score between any two groups. | Classification |
|accuracy_score | ratio | The minimum ratio in accuracy score between any two groups. | Classification |
| precision_score | difference | The maximum difference in precision score between any two groups. | Classification |
| precision_score | ratio | The maximum ratio in precision score between any two groups. | Classification |
| recall_score  | difference | The maximum difference in recall score between any two groups. | Classification|
| recall_score | ratio | The maximum ratio in recall score between any two groups.  | Classification|
|f1_score | difference | The maximum difference in f1 score between any two groups.|Classification|
| f1_score | ratio | The maximum ratio in f1 score between any two groups.| Classification|
| error_rate | difference | The maximum difference in error rate between any two groups. | Classification |
| error_rate | ratio | The maximum ratio in error rate between any two groups.|Classification|
| Selection_rate  | difference | The maximum difference in selection rate between any two groups. | Classification |
| Selection_rate | ratio | The maximum ratio in selection rate between any two groups.  | Classification |
| mean_absolute_error | difference | The maximum difference in mean absolute error between any two groups.  | Regression |
| mean_absolute_error | ratio | The maximum ratio in mean absolute error between any two groups.  | Regression |
| mean_squared_error | difference | The maximum difference in mean squared error between any two groups. | Regression |
| mean_squared_error | ratio | The maximum ratio in mean squared error between any two groups. | Regression |
| median_absolute_error | difference | The maximum difference in median absolute error between any two groups. | Regression |
| median_absolute_error | ratio | The maximum ratio in median absolute error between any two groups. | Regression |
| r2_score | difference | The maximum difference in R<sup>2</sup> score between any two groups. | Regression |
| r2_Score | ratio | The maximum ratio in R<sup>2</sup> score between any two groups. | Regression |

## How to view your Responsible AI scorecard?

Responsible AI scorecards are linked to your Responsible AI dashboards. To view your Responsible AI scorecard, go into your model registry and select the registered model you've generated a Responsible AI dashboard for. Once you select your model, select the Responsible AI (preview) tab to view a list of generated dashboards. Select which dashboard you’d like to export a Responsible AI scorecard PDF for by selecting **Responsible AI scorecard (preview)**.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-studio.png" alt-text="Screenshot of Responsible A I tab in studio with Responsible AI scorecard tab highlights." lightbox = "./media/how-to-responsible-ai-scorecard/scorecard-studio.png":::

Selecting **Responsible AI scorecard (preview)** will show you a dropdown to view all Responsible A I scorecards generated for this dashboard.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-studio-dropdown.png" alt-text="Screenshot of Responsible A I scorecard dropdown." lightbox ="./media/how-to-responsible-ai-scorecard/scorecard-studio-dropdown.png":::

Select which scorecard you’d like to download from the list and select Download to download the PDF to your machine.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/studio-select-scorecard.png" alt-text="Screenshot of selecting a Responsible A I scorecard to download." lightbox= "./media/how-to-responsible-ai-scorecard/studio-select-scorecard.png":::

## How to read your Responsible AI scorecard

The Responsible AI scorecard is a PDF summary of your key insights from the Responsible AI dashboard. The first summary segment of the scorecard gives you an overview of the machine learning model and the key target values you have set to help all stakeholders determine if your model is ready to be deployed.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-summary.png" alt-text="Screenshot of the model summary on the Responsible A I scorecard PDF.":::

The data explorer segment shows you characteristics of your data, as any model story is incomplete without the right understanding of data

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-data-explorer.png" alt-text="Screenshot of the data explorer on the Responsible A I scorecard PDF.":::

The model performance segment displays your model’s most important metrics and characteristics of your predictions and how well they satisfy your desired target values.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-model-performance.png" alt-text="Screenshot of the model performance on the Responsible A I scorecard PDF.":::

Next, you can also view the top performing and worst performing data cohorts and subgroups that are automatically extracted for you to see the blind spots of your model.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-cohorts.png" alt-text="Screenshot of data cohorts and subgroups on the Responsible A I scorecard PDF.":::

Then you can see the top important factors impacting your model predictions, which is a requirement to build trust with how your model is performing its task.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-feature-importance.png" alt-text="Screenshot of the top important factors on the Responsible A I scorecard PDF.":::

You can further see your model fairness insights summarized and inspect how well your model is satisfying the fairness target values you had set for your desired sensitive groups.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-fairness.png" alt-text="Screenshot of the fairness insights on the Responsible A I scorecard PDF.":::

Finally, you can observe your dataset’s causal insights summarized, figuring out whether your identified factors/treatments have any causal effect on the real-world outcome.

:::image type="content" source="./media/how-to-responsible-ai-scorecard/scorecard-causal.png" alt-text="Screenshot of the dataset's causal insights on the Responsible A I scorecard PDF.":::

## Next steps

- See the how-to guide for generating a Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI ](how-to-responsible-ai-dashboard-ui.md).
- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View [sample YAML and Python notebooks](https://aka.ms/RAIsamples) to generate a Responsible AI dashboard with YAML or Python.
