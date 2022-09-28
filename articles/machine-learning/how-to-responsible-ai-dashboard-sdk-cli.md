---
title: Generate a Responsible AI dashboard with YAML and Python (preview) 
titleSuffix: Azure Machine Learning
description: Learn how to generate a Responsible AI dashboard with Python and YAML in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: lagayhar
author: lgayhardt
ms.date: 08/17/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Generate a Responsible AI dashboard with YAML and Python (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

You can generate a Responsible AI dashboard via a pipeline job by using Responsible AI components. There are six core components for creating Responsible AI dashboards, along with a couple of helper components. Here's a sample experiment graph:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-sdk-cli/sample-experiment-graph.png" alt-text="Screenshot of a sample experiment graph." lightbox= "./media/how-to-responsible-ai-dashboard-sdk-cli/sample-experiment-graph.png":::

## Get started

To use the Responsible AI components, you must first register them in your Azure Machine Learning workspace. This section documents the required steps.

### Prerequisites

You'll need:

- An Azure Machine Learning workspace
- A Git installation
- A MiniConda installation
- An Azure CLI installation

### Installation steps

1. Clone the repository:

    ```bash
    git clone https://github.com/Azure/RAI-vNext-Preview.git 
    
    cd RAI-vNext-Preview 
    ```

2. Sign in to Azure:

    ```bash
    Az login
    ```

3. From the repository root, run the following PowerShell setup script:

    ```powershell
    Quick-Setup.ps1 
    ```

    Running the script:

    - Creates a new conda environment with a name you specify.
    - Installs all the required Python packages.
    - Registers all the Responsible AI components in your Azure Machine Learning workspace.
    - Registers some sample datasets in your workspace.
    - Sets the defaults for the Azure CLI to point to your workspace.  

    Running the script prompts for the desired conda environment name and Azure Machine Learning workspace details. 

    Alternatively, you can use the following Bash script:

    ```bash
    ./quick-setup.bash <CONDA-ENV-NAME> <SUBSCRIPTION-ID> <RESOURCE-GROUP-NAME> <WORKSPACE-NAME>
    ```

    This script echoes the supplied parameters, and it pauses briefly before continuing.

## Responsible AI components

The core components for constructing the Responsible AI dashboard in Azure Machine Learning are:

- RAI Insights dashboard constructor
- The tool components:
    - Add Explanation to RAI Insights dashboard
    - Add Causal to RAI Insights dashboard
    - Add Counterfactuals to RAI Insights dashboard
    - Add Error Analysis to RAI Insights dashboard
    - Gather RAI Insights dashboard

The RAI Insights dashboard constructor and Gather RAI Insights dashboard components are always required, plus at least one of the tool components. However, it isn't necessary to use all the tools in every Responsible AI dashboard.  

In the following sections are specifications of the Responsible AI components and examples of code snippets in YAML and Python. To view the full code, see [sample YAML and Python notebook](https://aka.ms/RAIsamplesProgrammer).

### Limitations

The current set of components have a number of limitations on their use:

- All models must be registered in Azure Machine Learning in MLflow format with a sklearn (scikit-learn) flavor.
- The models must be loadable in the component environment.
- The models must be pickleable.
- The models must be supplied to the Responsible AI components by using the *fetch registered model* component, which we provide.
- The dataset inputs must be in pandas.DataFrame.to_parquet format. 
- A model must be supplied even if only a causal analysis of the data is performed. You can use the DummyClassifier and DummyRegressor estimators from scikit-learn for this purpose.

### RAI Insights dashboard constructor

This component has three input ports:

- The machine learning model  
- The training dataset  
- The test dataset  

To generate model-debugging insights with components such as error analysis and Model explanations, use the training and test dataset that you used when you trained your model. For components like causal analysis, which doesn't require a model, you use the training dataset to train the causal model to generate the causal insights. You use the test dataset to populate your Responsible AI dashboard visualizations.

The easiest way to supply the model is to use the fetch registered model component, which we discuss later in this article.

> [!NOTE]
> Currently, only models in MLflow format and with a sklearn flavor are supported.

The two datasets should be file datasets (of type `uri_file`) in Parquet format. Tabular datasets aren't supported, but we provide a TabularDataset to Parquet file component to help with conversions. The training and test datasets provided don't have to be the same datasets that are used in training the model, but they can be the same. By default, for performance reasons, the test dataset is restricted to 5,000 rows of the visualization UI.

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

The constructor component has a single output named `rai_insights_dashboard`. This is an empty dashboard, which the individual tool components operate on. All the results are assembled by the Gather RAI Insights dashboard component at the end.

# [YAML](#tab/yaml)

```yml
 create_rai_job: 

    type: command 
    component: azureml:rai_insights_constructor:1 
    inputs: 
      title: From YAML snippet 
      task_type: regression 
      model_info_path: ${{parent.jobs.fetch_model_job.outputs.model_info_output_path}} 
      train_dataset: ${{parent.inputs.my_training_data}} 
      test_dataset: ${{parent.inputs.my_test_data}} 
      target_column_name: ${{parent.inputs.target_column_name}} 
      categorical_column_names: '["location", "style", "job title", "OS", "Employer", "IDE", "Programming language"]' 
```

# [Python SDK](#tab/python)

First load the component:

```python
# First load the component:

        rai_constructor_component = load_component( 
            client=ml_client, name="rai_insights_constructor", version="1" 
        ) 

#Then inside the pipeline:

            construct_job = rai_constructor_component( 
                title="From Python", 
                task_type="classification", 
                model_info_path=fetch_model_job.outputs.model_info_output_path, 
                train_dataset=train_data, 
                test_dataset=test_data, 
                target_column_name=target_column_name, 
                categorical_column_names='["location", "style", "job title", "OS", "Employer", "IDE", "Programming language"]', 
                maximum_rows_for_test_dataset=5000, 
                classes="[]", 
            ) 
```
---
### Export pre-built cohorts for scorecard generation 

You can export pre-built cohorts for use in scorecard generation. For example, here are building cohorts in a Jupyter Notebook: [responsibleaidashboard-diabetes-decision-making.ipynb](https://github.com/microsoft/responsible-ai-toolbox/blob/main/notebooks/responsibleaidashboard/responsibleaidashboard-diabetes-decision-making.ipynb). After you've defined a cohort, you can export it to a JSON file, as shown here:

```python
# cohort1, cohort2 are cohorts defined in sample notebook of type raiwidgets.cohort.Cohort 
import json 
json.dumps([cohort1.to_json(), cohort2.to_json) 
```
A sample generated JSON string is shown here: 

```json
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

### Add Causal to RAI Insights dashboard

This component performs a causal analysis on the supplied datasets. It has a single input port, which accepts the output of the RAI Insights dashboard constructor. It also accepts the following parameters:

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

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights dashboard component.

# [YAML](#tab/yaml)

```yml
  causal_01: 
    type: command 
    component: azureml:rai_insights_causal:1 
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      treatment_features: `["Number of GitHub repos contributed to", "YOE"]' 
```

# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_causal_component = load_component( 
            client=ml_client, name="rai_insights_causal", version="1" 
        ) 
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

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights dashboard component. 

# [YAML](#tab/yaml)

```yml
 counterfactual_01: 
    type: command 
    component: azureml:rai_insights_counterfactual:1 
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      total_CFs: 10 
      desired_range: "[5, 10]" 
```


# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_counterfactual_component = load_component( 
            client=ml_client, name="rai_insights_counterfactual", version="1" 
        ) 
#Use it in a pipeline function: 
            counterfactual_job = rai_counterfactual_component( 
                rai_insights_dashboard=create_rai_job.outputs.rai_insights_dashboard, 
                total_cfs=10, 
                desired_range="[5, 10]", 
            ) 
```

---

### Add Error Analysis to RAI Insights dashboard 

This component generates an error analysis for the model. It has a single input port, which accepts the output of the RAI Insights dashboard constructor. It also accepts the following parameters:

| Parameter name | Description | Type |
|---|---|---|
| `max_depth` | The maximum depth of the error analysis tree. | Optional integer. Defaults to 3. |
| `num_leaves` | The maximum number of leaves in the error tree. | Optional integer. Defaults to 31. |
| `min_child_samples` | The minimum number of datapoints required to produce a leaf. | Optional integer. Defaults to 20. |
| `filter_features` | A list of one or two features to use for the matrix filter. | Optional list, to be passed as a single JSON-encoded string. |

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights dashboard component.

# [YAML](#tab/yaml)

```yml
  error_analysis_01: 
    type: command 
    component: azureml:rai_insights_erroranalysis:1 
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      filter_features: `["style", "Employer"]' 
```

# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_erroranalysis_component = load_component( 
            client=ml_client, name="rai_insights_erroranalysis", version="1" 
        ) 
#Use inside a pipeline: 
            erroranalysis_job = rai_erroranalysis_component( 
                rai_insights_dashboard=create_rai_job.outputs.rai_insights_dashboard, 
                filter_features='["style", "Employer"]', 
            ) 
```

---

### Add Explanation to RAI Insights dashboard

This component generates an explanation for the model. It has a single input port, which accepts the output of the RAI Insights dashboard constructor. It accepts a single, optional comment string as a parameter.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights dashboard component. 


# [YAML](#tab/yaml)

```yml
  explain_01: 
    type: command 
    component: azureml:rai_insights_explanation:VERSION_REPLACEMENT_STRING 
    inputs: 
      comment: My comment 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
```


# [Python SDK](#tab/python)

```python
#First load the component: 
        rai_explanation_component = load_component( 
            client=ml_client, name="rai_insights_explanation", version="1" 
        )	1 
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
    component: azureml:rai_insights_gather:1 
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
        rai_gather_component = load_component( 
            client=ml_client, name="rai_insights_gather", version="1" 
        ) 
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

## Helper components

We provide two helper components to aid in connecting the Responsible AI components to your existing assets. 

### Fetch registered model

This component produces information about a registered model, which can be consumed by the `model_info_path` input port of the RAI Insights dashboard constructor component. It has a single input parameter: the Azure Machine Learning ID (`<NAME>:<VERSION>`) of the desired model.

# [YAML](#tab/yaml)

```yml
  fetch_model_job: 
    type: command 
    component: azureml:fetch_registered_model:1 
    inputs:
      model_id: my_model_name:12 
```

# [Python SDK](#tab/python)

```python
#First load the component: 
        fetch_model_component = load_component( 
            client=ml_client, name="fetch_registered_model", version="1" 
        ) 
#Use it in a pipeline: 
            fetch_model_job = fetch_model_component(model_id=registered_adult_model_id) 
```

---

### Tabular dataset to parquet file

This component converts the tabular dataset named in its sole input parameter into a Parquet file, which can be consumed by the `train_dataset` and `test_dataset` input ports of the RAI Insights dashboard constructor component. Its single input parameter is the name of the desired dataset.

# [YAML](#tab/yaml)

```yml
  convert_train_job: 
    type: command 
    component: azureml:convert_tabular_to_parquet:1 
    inputs: 
      tabular_dataset_name: tabular_dataset_name 
```


# [Python SDK](#tab/python)

```python
#First load the component: 
        tabular_to_parquet_component = load_component( 
            client=ml_client, name="convert_tabular_to_parquet", version="1" 
        ) 
#Use it in a pipeline: 
            to_parquet_job_train = tabular_to_parquet_component( 
                tabular_dataset_name=train_data_name 
```

---

## Input constraints

### What model formats and flavors are supported?

The model must be in the MLflow directory with a sklearn flavor available. Additionally, the model needs to be loadable in the environment that's used by the Responsible AI components.

### What data formats are supported?

The supplied datasets should be file datasets (of type `uri_file`) in Parquet format. We provide the `TabularDataset to Parquet File` component to help convert the data into the required format.

## Next steps

- After you've generated your Responsible AI dashboard, [view how to access and use it in Azure Machine Learning studio](how-to-responsible-ai-dashboard.md).
- Summarize and share your Responsible AI insights with the [Responsible AI scorecard as a PDF export](how-to-responsible-ai-scorecard.md).
- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Learn more about how to [collect data responsibly](concept-sourcing-human-data.md).
- View [sample YAML and Python notebooks](https://aka.ms/RAIsamples) to generate the Responsible AI dashboard with YAML or Python.
- Learn more about how to use the Responsible AI dashboard and scorecard to debug data and models and inform better decision-making in this [tech community blog post](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
- Learn about how the Responsible AI dashboard and scorecard were used by the UK National Health Service (NHS) in a [real life customer story](https://aka.ms/NHSCustomerStory).
- Explore the features of the Responsible AI dashboard through this [interactive AI lab web demo](https://www.microsoft.com/ai/ai-lab-responsible-ai-dashboard).
