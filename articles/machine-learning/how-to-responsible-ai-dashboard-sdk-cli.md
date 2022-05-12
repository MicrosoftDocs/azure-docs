---
title: Generate Responsible AI dashboard with YAML and Python (preview) 
titleSuffix: Azure Machine Learning
description: Learn how to generate the Responsible AI dashboard with Python and YAML in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: lagayhar
author: lgayhardt
ms.date: 05/10/2022
ms.custom: responsible-ml
---

# Generate Responsible AI dashboard with YAML and Python (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

The Responsible AI (RAI) dashboard can be generated via a pipeline job using RAI components. There are six core components for creating Responsible AI dashboards, along with a couple of helper components. A sample experiment graph:

:::image type="content" source="./media/how-to-responsible-ai-dashboard-sdk-cli/sample-experiment-graph.png" alt-text="Screenshot of a sample experiment graph." lightbox= "./media/how-to-responsible-ai-dashboard-sdk-cli/sample-experiment-graph.png":::

## Getting started

To use the Responsible AI components, you must first register them in your Azure Machine Learning workspace. This section documents the required steps.

### Prerequisites
You'll need:

- An AzureML workspace
- A git installation
- A MiniConda installation
- An Azure CLI installation

### Installation Steps

1. Clone the Repository
    ```bash
    git clone https://github.com/Azure/RAI-vNext-Preview.git 
    
    cd RAI-vNext-Preview 
    ```
2. Log into Azure

    ```bash
    Az login
    ```

3. Run the setup script

    We provide a setup script which:

    - Creates a new conda environment with a name you specify
    - Installs all the required Python packages
    - Registers all the RAI components in your AzureML workspace
    - Registers some sample datasets in your AzureML workspace
    - Sets the defaults for the Azure CLI to point to your workspace

    We provide PowerShell and bash versions of the script. From the repository root, run:

    ```powershell
    Quick-Setup.ps1 
    ```

    This will prompt for the desired conda environment name and AzureML workspace details. Alternatively, use the bash script:

    ```bash
    ./quick-setup.bash <CONDA-ENV-NAME> <SUBSCRIPTION-ID> <RESOURCE-GROUP-NAME> <WORKSPACE-NAME>
    ```

    This script will echo the supplied parameters, and pause briefly before continuing.

## Responsible AI components

The core components for constructing a Responsible AI dashboard in AzureML are:

- `RAI Insights Dashboard Constructor`
- The tool components:
    - `Add Explanation to RAI Insights Dashboard`
    - `Add Causal to RAI Insights Dashboard`
    - `Add Counterfactuals to RAI Insights Dashboard`
    - `Add Error Analysis to RAI Insights Dashboard`
    - `Gather RAI Insights Dashboard`


The ` RAI Insights Dashboard Constructor` and `Gather RAI Insights Dashboard ` components are always required, plus at least one of the tool components. However, it isn't necessary to use all the tools in every Responsible AI dashboard.  

Below are specifications of the Responsible AI components and examples of code snippets in YAML and Python. To view the full code, see [sample YAML and Python notebook](https://aka.ms/RAIsamplesProgrammer)

### RAI Insights Dashboard Constructor

This component has three input ports:

- The machine learning model  
- The training dataset  
- The test dataset  

Use the train and test dataset that you used when training your model to generate model-debugging insights with components such as Error analysis and Model explanations. For components like Causal analysis that doesn't require a model, the train dataset will be used to train the causal model to generate the causal insights. The test dataset is used to populate your Responsible AI dashboard visualizations.

The easiest way to supply the model is using our `Fetch Registered Model` component, which will be discussed below.

> [!NOTE]
> Currently only models with MLFlow format, with a sklearn flavor are supported.

The two datasets should be file datasets (of type uri_file) in Parquet format. Tabular datasets aren't supported, we provide a `TabularDataset to Parquet file` component to help with conversions. The training and test datasets provided don't have to be the same datasets used in training the model (although it's permissible for them to be the same). By default, the test dataset is restricted to 5000 rows for performance reasons of the visualization UI.

The constructor component also accepts the following parameters:

| Parameter name                | Description                                                                       | Type                                      |
|-------------------------------|-----------------------------------------------------------------------------------|-------------------------------------------|
| title                         | Brief description of the dashboard                                                | String                                    |
| task_type                     | Specifies whether the model is for classification or regression                   | String, `classification` or `regression`  |
| target_column_name            | The name of the column in the input datasets, which the model is trying to predict | String                                    |
| maximum_rows_for_test_dataset | The maximum number of rows allowed in the test dataset (for performance reasons)  | Integer (defaults to 5000)                |
| categorical_column_names      | The columns in the datasets, which represent categorical data                      | Optional list of strings (see note below) |
| classes                       | The full list of class labels in the training dataset                             | Optional list of strings (see note below) |

> [!NOTE]
> The lists should be supplied as a single JSON encoded string for`categorical_column_names` and `classes` inputs.

The constructor component has a single output named `rai_insights_dashboard`. This is an empty dashboard, which the individual tool components will operate on, and then all the results will be assembled by the `Gather RAI Insights Dashboard` component at the end.

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

# [Python](#tab/python)

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
### Exporting pre-built Cohorts for score card generation 

Pre-built cohorts can be exported for use in score card generation. Find example of building cohorts in this Jupyter Notebook example: [responsibleaidashboard-diabetes-decision-making.ipynb](https://github.com/microsoft/responsible-ai-toolbox/blob/main/notebooks/responsibleaidashboard/responsibleaidashboard-diabetes-decision-making.ipynb). Once a cohort is defined, it can be exported to json as follows:

```python
# cohort1, cohort2 are cohorts defined in sample notebook of type raiwidgets.cohort.Cohort 
import json 
json.dumps([cohort1.to_json(), cohort2.to_json) 
```
A sample json string generated is shown below: 

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

### Add Causal to RAI Insights Dashboard

This component performs a causal analysis on the supplied datasets. It has a single input port, which accepts the output of the `RAI Insights Dashboard Constructor`. It also accepts the following parameters:

| Parameter name                | Description                                                                       | Type                                      |
|-------------------------------|-----------------------------------------------------------------------------------|-------------------------------------------|
| treatment_features | A list of feature names in the datasets, which are potentially ‘treatable’ to obtain different outcomes. | List of strings (see note below) |
| heterogeneity_features | A list of feature names in the datasets, which might affect how the ‘treatable’ features behave. By default all features will be considered | Optional list of strings (see note below).|
| nuisance_model  | The model used to estimate the outcome of changing the treatment features. | Optional string. Must be ‘linear’ or ‘AutoML’ defaulting to ‘linear.’ |
| heterogeneity_model | The model used to estimate the effect of the heterogeneity features on the outcome.  | Optional string. Must be ‘linear’ or ‘forest’ defaulting to ‘linear.’ |
| alpha | Confidence level of confidence intervals | Optional floating point number. Defaults to 0.05. |
| upper_bound_on_cat_expansion | Maximum expansion for categorical features. | Optional integer. Defaults to 50. |
| treatment_cost | The cost of the treatments. If 0, then all treatments will have zero cost. If a list is passed, then each element is applied to one of the treatment_features. Each element can be a scalar value to indicate a constant cost of applying that treatment or an array indicating the cost for each sample. If the treatment is a discrete treatment, then the array for that feature should be two dimensional with the first dimension representing samples and the second representing the difference in cost between the non-default values and the default value. | Optional integer or list (see note below).|
| min_tree_leaf_samples | Minimum number of samples per leaf in policy tree. | Optional integer. Defaults to 2 |
| max_tree_depth | Maximum depth of the policy tree | Optional integer. Defaults to 2 | 
| skip_cat_limit_checks | By default, categorical features need to have several instances of each category in order for a model to be fit robustly. Setting this to True will skip these checks. |Optional Boolean. Defaults to False.  |
| categories | What categories to use for the categorical columns. If `auto`, then the categories will be inferred for all categorical columns. Otherwise, this argument should have as many entries as there are categorical columns. Each entry should be either `auto` to infer the values for that column or the list of values for the column.  If explicit values are provided, the first value is treated as  the "control" value for that column against which other values are compared. | Optional. `auto` or list (see note below.) |
| n_jobs | Degree of parallelism to use. | Optional integer. Defaults to 1. |
| verbose | Whether to provide detailed output during the computation. | Optional integer. Defaults to 1. |
| random_state | Seed for the PRNG. | Optional integer. |

> [!NOTE]
> For the `list` parameters: Several of the parameters accept lists of other types (strings, numbers, even other lists). To pass these into the component, they must first be JSON-encoded into a single string.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights Dashboard component.

# [YAML](#tab/yaml)

```yml
  causal_01: 
    type: command 
    component: azureml:rai_insights_causal:1 
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      treatment_features: `["Number of github repos contributed to", "YOE"]' 
```

# [Python](#tab/python)

```python
#First load the component: 
        rai_causal_component = load_component( 
            client=ml_client, name="rai_insights_causal", version="1" 
        ) 
#Use it inside a pipeline definition: 
            causal_job = rai_causal_component( 
                rai_insights_dashboard=construct_job.outputs.rai_insights_dashboard, 
                treatment_features='`["Number of github repos contributed to", "YOE"]', 
            ) 
```

---

### Add Counterfactuals to RAI Insights Dashboard

This component generates counterfactual points for the supplied test dataset. It has a single input port, which accepts the output of the RAI Insights Dashboard Constructor. It also accepts the following parameters: 

| Parameter Name | Description | Type |
|----------------|-------------|------|
| total_CFs | How many counterfactual points to generate for each row in the test dataset | Optional integer. Defaults to 10 |
| method | The `dice-ml` explainer to use | Optional string. Either `random`, `genetic` or `kdtree`. Defaults to `random` |
| desired_class | Index identifying the desired counterfactual class. For binary classification, this should be set to `opposite` | Optional string or integer. Defaults to 0 |
| desired_range | For regression problems, identify the desired range of outcomes | Optional list of two numbers (see note below). |
| permitted_range  | Dictionary with feature names as keys and permitted range in list as values. Defaults to the range inferred from training data. |  Optional string or list (see note below).|
| features_to_vary | Either a string "all" or a list of feature names to vary. | Optional string or list (see note below)|
| feature_importance | Flag to enable computation of feature importances using `dice-ml` |Optional Boolean. Defaults to True |

> [!NOTE]
> For the non-scalar parameters: Parameters which are lists or dictionaries should be passed as single JSON-encoded strings.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights Dashboard component. 

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


# [Python](#tab/python)

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

### Add Error Analysis to RAI Insights Dashboard 

This component generates an error analysis for the model. It has a single input port, which accepts the output of the RAI Insights Dashboard Constructor. It also accepts the following parameters: 

| Parameter Name    | Description                                                 | Type                                                 |
|-------------------|-------------------------------------------------------------|------------------------------------------------------|
| max_depth         | The maximum depth of the error analysis tree                | Optional integer. Defaults to 3                      |
| num_leaves        | The maximum number of leaves in the error tree              | Optional integer. Defaults to 31                     |
| min_child_samples | The minimum number of datapoints required to produce a leaf | Optional integer. Defaults to 20                     |
| filter_features   | A list of one or two features to use for the matrix filter  | Optional list of two feature names (see note below). |

> [!NOTE]
> filter_features: This list of one or two feature names should be passed as a single JSON-encoded string.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights Dashboard component.

# [YAML](#tab/yaml)

```yml
  error_analysis_01: 
    type: command 
    component: azureml:rai_insights_erroranalysis:1 
    inputs: 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
      filter_features: `["style", "Employer"]' 
```

# [Python](#tab/python)

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

### Add Explanation to RAI Insights Dashboard

This component generates an explanation for the model. It has a single input port, which accepts the output of the RAI Insights Dashboard Constructor. It accepts a single, optional comment string as a parameter.

This component has a single output port, which can be connected to one of the `insight_[n]` input ports of the Gather RAI Insights Dashboard component. 


# [YAML](#tab/yaml)

```yml
  explain_01: 
    type: command 
    component: azureml:rai_insights_explanation:VERSION_REPLACEMENT_STRING 
    inputs: 
      comment: My comment 
      rai_insights_dashboard: ${{parent.jobs.create_rai_job.outputs.rai_insights_dashboard}} 
```


# [Python](#tab/python)

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

### Gather RAI Insights Dashboard

This component assembles the generated insights into a single Responsible AI dashboard. It has five input ports: 

- The `constructor` port that must be connected to the RAI Insights Dashboard Constructor component.
- Four `insight_[n]` ports that can be connected to the output of the tool components. At least one of these ports must be connected.

There are two output ports. The `dashboard` port contains the completed `RAIInsights` object, while the `ux_json` contains the data required to display a minimal dashboard.


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


# [Python](#tab/python)

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

This component produces information about a registered model, which can be consumed by the `model_info_path` input port of the RAI Insights Dashboard Constructor component. It has a single input parameter – the AzureML ID (`<NAME>:<VERSION>`) of the desired model.

# [YAML](#tab/yaml)

```yml
  fetch_model_job: 
    type: command 
    component: azureml:fetch_registered_model:1 
    inputs:
      model_id: my_model_name:12 
```

# [Python](#tab/python)

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

This component converts the tabular dataset named in its sole input parameter into a Parquet file, which can be consumed by the `train_dataset` and `test_dataset` input ports of the RAI Insights Dashboard Constructor component. Its single input parameter is the name of the desired dataset.

# [YAML](#tab/yaml)

```yml
  convert_train_job: 
    type: command 
    component: azureml:convert_tabular_to_parquet:1 
    inputs: 
      tabular_dataset_name: tabular_dataset_name 
```


# [Python](#tab/python)

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

The model must be in MLFlow directory with a sklearn flavor available. Furthermore, the model needs to be loadable in the environment used by the Responsible AI components.

### What data formats are supported?

The supplied datasets should be file datasets (uri_file type) in Parquet format. We provide the `TabularDataset to Parquet File` component to help convert the data into the required format.

## Next steps

- Once your Responsible AI dashboard is generated, [view how to access and use it in Azure Machine Learning studio](how-to-responsible-ai-dashboard.md)
- Summarize and share your Responsible AI insights with the [Responsible AI scorecard as a PDF export](how-to-responsible-ai-scorecard.md).
- Learn more about the  [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Learn more about how to [collect data responsibly](concept-sourcing-human-data.md)
- View [sample YAML and Python notebooks](https://aka.ms/RAIsamples) to generate a Responsible AI dashboard with YAML or Python.