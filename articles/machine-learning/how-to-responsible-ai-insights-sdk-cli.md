---
title: Generate a Responsible AI insights with YAML and Python
titleSuffix: Azure Machine Learning
description: Learn how to generate a Responsible AI insights with Python and YAML in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: mithigpe
author: minthigpen
ms.date: 11/09/2022
ms.custom: responsible-ml, event-tier1-build-2022, devx-track-python
---

# Generate a Responsible AI insights with YAML and Python

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

You can generate a Responsible AI dashboard and scorecard via a pipeline job by using Responsible AI components. There are six core components for creating Responsible AI dashboards, along with a couple of helper components. Here's a sample experiment graph:

:::image type="content" source="./media/how-to-responsible-ai-insights-sdk-cli/sample-experiment-graph.png" alt-text="Screenshot of a sample experiment graph." lightbox= "./media/how-to-responsible-ai-insights-sdk-cli/sample-experiment-graph.png":::

## Responsible AI components

The core components for constructing the Responsible AI dashboard in Azure Machine Learning are:

- `RAI Insights dashboard constructor`
- The tool components:
    - `Add Explanation to RAI Insights dashboard`
    - `Add Causal to RAI Insights dashboard`
    - `Add Counterfactuals to RAI Insights dashboard`
    - `Add Error Analysis to RAI Insights dashboard`
    - `Gather RAI Insights dashboard`
    - `Gather RAI Insights score card`

The `RAI Insights dashboard constructor` and `Gather RAI Insights dashboard` components are always required, plus at least one of the tool components. However, it isn't necessary to use all the tools in every Responsible AI dashboard.  

In the following sections are specifications of the Responsible AI components and examples of code snippets in YAML and Python.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Limitations

The current set of components have a number of limitations on their use:

- All models must be registered in Azure Machine Learning in MLflow format with a sklearn (scikit-learn) flavor.
- The models must be loadable in the component environment.
- The models must be pickleable.
- The models must be supplied to the Responsible AI components by using the `Fetch Registered Model` component, which we provide.
- The dataset inputs must be in `mltable` format.
- A model must be supplied even if only a causal analysis of the data is performed. You can use the `DummyClassifier` and `DummyRegressor` estimators from scikit-learn for this purpose.

### RAI Insights dashboard constructor

This component has three input ports:

- The machine learning model  
- The training dataset  
- The test dataset  

To generate model-debugging insights with components such as error analysis and Model explanations, use the training and test dataset that you used when you trained your model. For components like causal analysis, which doesn't require a model, you use the training dataset to train the causal model to generate the causal insights. You use the test dataset to populate your Responsible AI dashboard visualizations.

The easiest way to supply the model is to register the input model and reference the same model in the model input port of `RAI Insight Constructor` component, which we discuss later in this article.

> [!NOTE]
> Currently, only models in MLflow format and with a `sklearn` flavor are supported.

The two datasets should be in `mltable` format. The training and test datasets provided don't have to be the same datasets that are used in training the model, but they can be the same. By default, for performance reasons, the test dataset is restricted to 5,000 rows of the visualization UI.

The constructor component also accepts the following parameters:

| Parameter name | Description | Type |
|---|---|---|
| `title` | Brief description of the dashboard. | String |
| `task_type` | Specifies whether the model is for classification or regression. | String, `classification` or `regression` |
| `target_column_name` | The name of the column in the input datasets, which the model is trying to predict. | String |
| `maximum_rows_for_test_dataset` | The maximum number of rows allowed in the test dataset, for performance reasons. | Integer, defaults to 5,000 |
| `categorical_column_names` | The columns in the datasets, which represent categorical data. | Optional list of strings<sup>1</sup> |
| `classes` | The full list of class labels in the training dataset. | Optional list of strings<sup>1</sup> |

<sup>1</sup> The lists should be supplied as a single JSON-encoded string for `categorical_column_names` and `classes` inputs.

The constructor component has a single output named `rai_insights_dashboard`. This is an empty dashboard, which the individual tool components operate on. All the results are assembled by the `Gather RAI Insights dashboard` component at the end.

# [YAML](#tab/yaml)

```yml
 create_rai_job: 

    type: command 
    component: azureml://registries/azureml/components/microsoft_azureml_rai_tabular_insight_constructor/versions/<get current version>
    inputs: 
      title: From YAML snippet 
      task_type: regression
      type: mlflow_model
      path: azureml:<registered_model_name>:<registered model version> 
      train_dataset: ${{parent.inputs.my_training_data}} 
      test_dataset: ${{parent.inputs.my_test_data}} 
      target_column_name: ${{parent.inputs.target_column_name}} 
      categorical_column_names: '["location", "style", "job title", "OS", "Employer", "IDE", "Programming language"]' 
```

# [Python SDK](#tab/python)

First load the component:

```python
# First load the component:

        rai_constructor_component = ml_client_registry.components.get(name="microsoft_azureml_rai_tabular_insight_constructor", label="latest")

#Then inside the pipeline:

            construct_job = rai_constructor_component( 
                title="From Python", 
                task_type="classification", 
                model_input= model_input= Input(type=AssetTypes.MLFLOW_MODEL, path="<azureml:model_name:model_id>"),
                train_dataset=train_data, 
                test_dataset=test_data, 
                target_column_name=target_column_name, 
                categorical_column_names='["location", "style", "job title", "OS", "Employer", "IDE", "Programming language"]', 
                maximum_rows_for_test_dataset=5000, 
                classes="[]", 
            ) 
```

---

### Add Causal to RAI Insights dashboard

This component performs a causal analysis on the supplied datasets. It has a single input port, which accepts the output of the `RAI Insights dashboard constructor`. It also accepts the following parameters:

| Parameter name | Description | Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
|---|---|---|
| `treatment_features` | A list of feature names in the datasets, which are potentially "treatable" to obtain different outcomes. | List of strings<sup>2</sup>. |
| `heterogeneity_features` | A list of feature names in the datasets, which might affect how the "treatable" features behave. By default, all features will be considered. | Optional list of strings<sup>2</sup>.|
| `nuisance_model` | The model used to estimate the outcome of changing the treatment features. | Optional string. Must be `linear` or `AutoML`, defaulting to `linear`. |
| `heterogeneity_model` | The model used to estimate the effect of the heterogeneity features on the outcome. | Optional string. Must be `linear` or `forest`, defaulting to `linear`. |
| `alpha` | Confidence level of confidence intervals. | Optional floating point number, defaults to 0.05. |
| `upper_bound_on_cat_expansion` | The maximum expansion of categorical features. | Optional integer, defaults to 50. |
| `treatment_cost` | The cost of the treatments. If 0, all treatments will have zero cost. If a list is passed, each element is applied to one of the `treatment_features`.<br><br>Each element can be a scalar value to indicate a constant cost of applying that treatment or an array indicating the cost for each sample. If the treatment is a discrete treatment, the array for that feature should be two dimensional, with the first dimension representing samples and the second representing the difference in cost between the non-default values and the default value. | Optional integer or list<sup>2</sup>.|
| `min_tree_leaf_samples` | The minimum number of samples per leaf in the policy tree. | Optional integer, defaults to 2. |
| `max_tree_depth` | The maximum depth of the policy tree. | Optional integer, defaults to 2. | 
| `skip_cat_limit_checks` | By default, categorical features need to have several instances of each category in order for a model to be fit robustly. Setting this to `True` will skip these checks. |Optional Boolean, defaults to `False`. |
| `categories` | The categories to use for the categorical columns. If `auto`, the categories will be inferred for all categorical columns. Otherwise, this argument should have as many entries as there are categorical columns.<br><br>Each entry should be either `auto` to infer the values for that column or the list of values for the column.  If explicit values are provided, the first value is treated as the "control" value for that column against which other values are compared. | Optional, `auto` or list<sup>2</sup>. |
| `n_jobs` | The degree of parallelism to use. | Optional integer, defaults to 1. |
| `verbose` | Expresses whether to provide detailed output during the computation. | Optional integer, defaults to 1. |
| `random_state` | Seed for the pseudorandom number generator (PRNG). | Optional integer. |

<sup>2</sup> For the `list` parameters: Several of the parameters accept lists of other types (strings, numbers, even other lists). To pass these into the component, they must first be JSON-encoded into a single string.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the `Gather RAI Insights Dashboard` component.

# [YAML](#tab/yaml)

```yml
  causal_01: 
    type: command 
    component: azureml://registries/azureml/components/microsoft_azureml_rai_tabular_causal/versions/<version>
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      treatment_features: `["Number of GitHub repos contributed to", "YOE"]' 
```

# [Python SDK](#tab/python)

```python
#First load the component: 

        rai_causal_component = ml_client_registry.components.get(name="microsoft_azureml_rai_tabular_causal", label="latest")

#Use it inside a pipeline definition: 
            causal_job = rai_causal_component( 
                rai_insights_dashboard=construct_job.outputs.rai_insights_dashboard, 
                treatment_features='`["Number of GitHub repos contributed to", "YOE"]', 
            ) 
```

---

### Add Counterfactuals to RAI Insights dashboard

This component generates counterfactual points for the supplied test dataset. It has a single input port, which accepts the output of the RAI Insights dashboard constructor. It also accepts the following parameters: 

| Parameter name | Description | Type |
|---|---|---|
| `total_CFs` | The number of counterfactual points to generate for each row in the test dataset. | Optional integer, defaults to 10. |
| `method` | The `dice-ml` explainer to use. | Optional string. Either `random`, `genetic`, or `kdtree`. Defaults to `random`. |
| `desired_class` | Index identifying the desired counterfactual class. For binary classification, this should be set to `opposite`. | Optional string or integer. Defaults to 0. |
| `desired_range` | For regression problems, identify the desired range of outcomes. | Optional list of two numbers<sup>3</sup>. |
| `permitted_range` | Dictionary with feature names as keys and the permitted range in a list as values. Defaults to the range inferred from training data. |  Optional string or list<sup>3</sup>.|
| `features_to_vary` | Either a string `all` or a list of feature names to vary. | Optional string or list<sup>3</sup>.|
| `feature_importance` | Flag to enable computation of feature importances by using `dice-ml`. |Optional Boolean. Defaults to `True`. |

<sup>3</sup> For the non-scalar parameters: Parameters that are lists or dictionaries should be passed as single JSON-encoded strings.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the `Gather RAI Insights dashboard` component.

# [YAML](#tab/yaml)

```yml
 counterfactual_01: 
    type: command 
    component: azureml://registries/azureml/components/microsoft_azureml_rai_tabular_counterfactual/versions/<version>
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      total_CFs: 10 
      desired_range: "[5, 10]" 
```


# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_counterfactual_component = ml_client_registry.components.get(name="microsoft_azureml_rai_tabular_counterfactual", label="latest")

#Use it in a pipeline function: 
            counterfactual_job = rai_counterfactual_component( 
                rai_insights_dashboard=create_rai_job.outputs.rai_insights_dashboard, 
                total_cfs=10, 
                desired_range="[5, 10]", 
            ) 
```

---

### Add Error Analysis to RAI Insights dashboard 

This component generates an error analysis for the model. It has a single input port, which accepts the output of the `RAI Insights Dashboard Constructor`. It also accepts the following parameters:

| Parameter name | Description | Type |
|---|---|---|
| `max_depth` | The maximum depth of the error analysis tree. | Optional integer. Defaults to 3. |
| `num_leaves` | The maximum number of leaves in the error tree. | Optional integer. Defaults to 31. |
| `min_child_samples` | The minimum number of datapoints required to produce a leaf. | Optional integer. Defaults to 20. |
| `filter_features` | A list of one or two features to use for the matrix filter. | Optional list, to be passed as a single JSON-encoded string. |

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the `Gather RAI Insights Dashboard` component.

# [YAML](#tab/yaml)

```yml
  error_analysis_01: 
    type: command 
    component: azureml://registries/azureml/components/microsoft_azureml_rai_tabular_erroranalysis/versions/<version>
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      filter_features: `["style", "Employer"]' 
```

# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_erroranalysis_component = ml_client_registry.components.get(name="microsoft_azureml_rai_tabular_erroranalysis", label="latest")

#Use inside a pipeline: 
            erroranalysis_job = rai_erroranalysis_component( 
                rai_insights_dashboard=create_rai_job.outputs.rai_insights_dashboard, 
                filter_features='["style", "Employer"]', 
            ) 
```

---

### Add Explanation to RAI Insights dashboard

This component generates an explanation for the model. It has a single input port, which accepts the output of the `RAI Insights Dashboard Constructor`. It accepts a single, optional comment string as a parameter.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights dashboard component.


# [YAML](#tab/yaml)

```yml
  explain_01: 
    type: command 
    component: azureml://registries/azureml/components/microsoft_azureml_rai_tabular_explanation/versions/<version>
    inputs: 
      comment: My comment 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
```


# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_explanation_component = ml_client_registry.components.get(name="microsoft_azureml_rai_tabular_explanation", label="latest"

#Use inside a pipeline: 
            explain_job = rai_explanation_component( 
                comment="My comment", 
                rai_insights_dashboard=create_rai_job.outputs.rai_insights_dashboard, 
            ) 
```
---

### Gather RAI Insights dashboard

This component assembles the generated insights into a single Responsible AI dashboard. It has five input ports: 

- The `constructor` port that must be connected to the RAI Insights dashboard constructor component.
- Four `insight_[n]` ports that can be connected to the output of the tool components. At least one of these ports must be connected.

There are two output ports: 
- The `dashboard` port contains the completed `RAIInsights` object.
- The `ux_json` port contains the data required to display a minimal dashboard.


# [YAML](#tab/yaml)

```yml
  gather_01: 
    type: command 
    component: azureml://registries/azureml/components/microsoft_azureml_rai_tabular_insight_gather/versions/<version>
    inputs: 
      constructor: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      insight_1: ${{parent.jobs.causal_01.outputs.causal}} 
      insight_2: ${{parent.jobs.counterfactual_01.outputs.counterfactual}} 
      insight_3: ${{parent.jobs.error_analysis_01.outputs.error_analysis}} 
      insight_4: ${{parent.jobs.explain_01.outputs.explanation}} 
```


# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_gather_component = ml_client_registry.components.get(name="microsoft_azureml_rai_tabular_insight_gather", label="latest")
#Use in a pipeline: 
            rai_gather_job = rai_gather_component( 
                constructor=create_rai_job.outputs.rai_insights_dashboard, 
                insight_1=explain_job.outputs.explanation, 
                insight_2=causal_job.outputs.causal, 
                insight_3=counterfactual_job.outputs.counterfactual, 
                insight_4=erroranalysis_job.outputs.error_analysis, 
            ) 
```

---


## How to generate a Responsible AI scorecard (preview)

The configuration stage requires you to use your domain expertise around the problem to set your desired target values on model performance and fairness metrics. 

Like other Responsible AI dashboard components configured in the YAML pipeline, you can add a component to generate the scorecard in the YAML pipeline:

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

Where pdf_gen.json is the score card generation configuration json file, and *predifined_cohorts_json* ID the prebuilt cohorts definition json file. 

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

## Input constraints

### What model formats and flavors are supported?

The model must be in the MLflow directory with a sklearn flavor available. Additionally, the model needs to be loadable in the environment that's used by the Responsible AI components.

### What data formats are supported?

The supplied datasets should be `mltable` with tabular data.

## Next steps

- After you've generated your Responsible AI dashboard, [view how to access and use it in Azure Machine Learning studio](how-to-responsible-ai-dashboard.md).
- Summarize and share your Responsible AI insights with the [Responsible AI scorecard as a PDF export](how-to-responsible-ai-scorecard.md).
- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Learn more about how to [collect data responsibly](concept-sourcing-human-data.md).
- View [sample YAML and Python notebooks](https://aka.ms/RAIsamples) to generate the Responsible AI dashboard with YAML or Python.
- Learn more about how to use the Responsible AI dashboard and scorecard to debug data and models and inform better decision-making in this [tech community blog post](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
- Learn about how the Responsible AI dashboard and scorecard were used by the UK National Health Service (NHS) in a [real life customer story](https://aka.ms/NHSCustomerStory).
- Explore the features of the Responsible AI dashboard through this [interactive AI lab web demo](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
