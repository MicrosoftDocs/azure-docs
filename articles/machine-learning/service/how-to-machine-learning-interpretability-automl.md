---
title: Model interpretability in automated ML
titleSuffix: Azure Machine Learning
description: Learn how to explain why your automated ML model makes predictions using the Azure Machine Learning SDK. It can be used during training and inference to understand how your model determines feature importance and makes predictions.
services: machine-learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: mesameki
author: mesameki
ms.reviewer: trbye
ms.date: 10/25/2019
---

# Model interpretability for automated ML models

[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this how-to, you learn how to enable interpretability functionality in automated machine learning using Azure Machine Learning service. Automated ML allows you to understand both raw and engineered feature importance. In order to use model interpretability, set `model_explainability=True` in the `AutoMLConfig` object.  

In this article, you learn the following tasks:

* Interpretability during training for best model or any model
* Enabling visualizations to aid you in the discovery of patterns in data and explanations
* Interpretability during inference or scoring

## Prerequisites

* Run `pip install azureml-interpret azureml-contrib-interpret` to get the necessary packages for interpretability features.
* This article assumes knowledge of building automated ML experiments. See the [tutorial](tutorial-auto-train-models.md) or [how-to](how-to-configure-auto-train.md) to learn how to use automated ML in the SDK.
 
## Interpretability during training for the best model 

Retrieve the explanation from the `best_run`, which includes explanations for engineered features and raw features. 

### Download engineered feature importance from artifact store

You can use `ExplanationClient` to download the engineered feature explanations from the artifact store of the best_run. To get the explanation for the raw features set `raw=True`. 

```python
from azureml.contrib.interpret.explanation.explanation_client import ExplanationClient

client = ExplanationClient.from_run(best_run)
engineered_explanations = client.download_model_explanation(raw=False)
print(engineered_explanations.get_feature_importance_dict())
```

## Interpretability during training for any model 

In this section, you learn how to compute model explanations and visualize the explanations. Besides retrieving an existing model explanation for an automated ML model, you can also explain your model with different test data. The following steps will allow you to compute and visualize engineered feature importance and raw feature importance based on your test data.

### Retrieve any other AutoML model from training

```python
automl_run, fitted_model = local_run.get_output(metric='r2_score')
```

### Setup the model explanations

The fitted_model can generate the following items, which will be used for getting the engineered and raw feature explanations using automl_setup_model_explanations:

* Featurized data from train samples/test samples
* Gather engineered and raw feature name lists
* Find the classes in your labeled column in classification scenarios

The automl_explainer_setup_obj contains all the structures from above list.

```python
from azureml.train.automl.automl_explain_utilities import AutoMLExplainerSetupClass, automl_setup_model_explanations

automl_explainer_setup_obj = automl_setup_model_explanations(fitted_model, X=X_train, 
                                                             X_test=X_test, y=y_train, 
                                                             task='classification')
```
### Initialize the Mimic Explainer for feature importance

For explaining the AutoML models, use the `MimicWrapper` class. The MimicWrapper can be initialized with parameters for the explainer setup object, your workspace, and a LightGBM model which acts as a surrogate model to explain the automated ML model (fitted_model here). The MimicWrapper also takes the automl_run object where the raw and engineered explanations will be uploaded.

```python
from azureml.interpret.mimic.models.lightgbm_model import LGBMExplainableModel
from azureml.interpret.mimic_wrapper import MimicWrapper

explainer = MimicWrapper(ws, automl_explainer_setup_obj.automl_estimator, LGBMExplainableModel, 
                         init_dataset=automl_explainer_setup_obj.X_transform, run=automl_run,
                         features=automl_explainer_setup_obj.engineered_feature_names, 
                         feature_maps=[automl_explainer_setup_obj.feature_map],
                         classes=automl_explainer_setup_obj.classes)
```

### Use MimicExplainer for computing and visualizing engineered feature importance

The explain() method in MimicWrapper can be called with the transformed test samples to get the feature importance for the generated engineered features. You can also use ExplanationDashboard to view the dash board visualization of the feature importance values of the generated engineered features by automated ML featurizers.

```python
from azureml.contrib.interpret.visualize import ExplanationDashboard
engineered_explanations = explainer.explain(['local', 'global'],              
                                            eval_dataset=automl_explainer_setup_obj.X_test_transform)

print(engineered_explanations.get_feature_importance_dict())
ExplanationDashboard(engineered_explanations, automl_explainer_setup_obj.automl_estimator, automl_explainer_setup_obj.X_test_transform)
```
### Use Mimic Explainer for computing and visualizing raw feature importance

The explain() method in MimicWrapper can be again called with the transformed test samples and setting `get_raw` to True to get the feature importance for the raw features. You can also use ExplanationDashboard to view the dashboard visualization of the feature importance values of the raw features.

```python
from azureml.contrib.interpret.visualize import ExplanationDashboard

raw_explanations = explainer.explain(['local', 'global'], get_raw=True, 
                                     raw_feature_names=automl_explainer_setup_obj.raw_feature_names,
                                     eval_dataset=automl_explainer_setup_obj.X_test_transform)

print(raw_explanations.get_feature_importance_dict())
ExplanationDashboard(raw_explanations, automl_explainer_setup_obj.automl_pipeline, automl_explainer_setup_obj.X_test_raw)
```

### Interpretability during inference

In this section, you learn how to operationalize an automated ML model with the explainer, which was used to compute the explanations in the previous section.

### Register the model and the scoring explainer

Use the `TreeScoringExplainer` to create the scoring explainer, which will be used to compute the raw and engineered feature importance values at inference time. Note that you initialize the scoring explainer with the feature_map that was computed previously. The feature_map will be used by the scoring explainer to return the raw feature importance.

In the code below, you save the scoring explainer and register the model and the scoring explainer with the Model Management Service.

```python
from azureml.interpret.scoring.scoring_explainer import TreeScoringExplainer, save

# Initialize the ScoringExplainer
scoring_explainer = TreeScoringExplainer(explainer.explainer, feature_maps=[automl_explainer_setup_obj.feature_map])

# Pickle scoring explainer locally
save(scoring_explainer, exist_ok=True)

# Register trained automl model present in the 'outputs' folder in the artifacts
original_model = automl_run.register_model(model_name='automl_model', 
                                           model_path='outputs/model.pkl')

# Register scoring explainer
automl_run.upload_file('scoring_explainer.pkl', 'scoring_explainer.pkl')
scoring_explainer_model = automl_run.register_model(model_name='scoring_explainer', model_path='scoring_explainer.pkl')
```

### Create the conda dependencies for setting up the service

Next you create the environment dependencies needed in the container for the deployed model.

```python
from azureml.core.conda_dependencies import CondaDependencies 

azureml_pip_packages = [
    'azureml-interpret', 'azureml-train-automl', 'azureml-defaults'
]

myenv = CondaDependencies.create(conda_packages=['scikit-learn', 'pandas', 'numpy', 'py-xgboost<=0.80'],
                                 pip_packages=azureml_pip_packages,
                                 pin_sdk_version=True)

with open("myenv.yml","w") as f:
    f.write(myenv.serialize_to_string())

with open("myenv.yml","r") as f:
    print(f.read())

```

### Deploy the service

Deploy the service using the conda file and the scoring file from the previous steps.

```python
from azureml.core.webservice import Webservice
from azureml.core.model import InferenceConfig
from azureml.core.webservice import AciWebservice
from azureml.core.model import Model

aciconfig = AciWebservice.deploy_configuration(cpu_cores=1, 
                                               memory_gb=1, 
                                               tags={"data": "Bank Marketing",  
                                                     "method" : "local_explanation"}, 
                                               description='Get local explanations for Bank marketing test data')

inference_config = InferenceConfig(runtime= "python", 
                                   entry_script="score_local_explain.py",
                                   conda_file="myenv.yml")

# Use configs and models generated above
service = Model.deploy(ws, 'model-scoring', [scoring_explainer_model, original_model], inference_config, aciconfig)
service.wait_for_deployment(show_output=True)
```

### Inference using test data

Inference using some test data to see the predicted value from automated ML model, and view the engineered feature importance for the predicted value and raw feature importance for the predicted value.

```python
if service.state == 'Healthy':
    # Serialize the first row of the test data into json
    X_test_json = X_test[:1].to_json(orient='records')
    print(X_test_json)
    # Call the service to get the predictions and the engineered and raw explanations
    output = service.run(X_test_json)
    # Print the predicted value
    print(output['predictions'])
    # Print the engineered feature importances for the predicted value
    print(output['engineered_local_importance_values'])
    # Print the raw feature importances for the predicted value
    print(output['raw_local_importance_values'])
```

### Visualizations to aid you in the discovery of patterns in data and explanations at training time

You can also visualize the feature importance chart in your workspace in [Azure Machine Learning studio](https://ml.azure.com). Once your automated ML run is complete you will need to click on "View model details", which will take you to a specific run. From here, you click the "Explanations" tab to see the explanation visualization dashboard. 

[![Machine Learning Interpretability Architecture](./media/machine-learning-interpretability-explainability/automl-explainability.png)](./media/machine-learning-interpretability-explainability/automl-explainability.png#lightbox)

## Next steps

For more information on how model explanations and feature importance can be enabled in other areas of the SDK outside of automated machine learning, see the [concept](how-to-machine-learning-interpretability.md) article on interpretability.