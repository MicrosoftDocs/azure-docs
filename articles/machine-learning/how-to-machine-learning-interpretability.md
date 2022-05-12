---
title: Model interpretability (preview)
titleSuffix: Azure Machine Learning
description: Learn how to understand & explain how your machine learning model makes predictions during training & inferencing using Azure Machine Learning CLI and Python SDK.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: mithigpe
author: minthigpen
ms.reviewer: Luis.Quintanilla
ms.custom: responsible-ml, mktng-kw-nov2021
ms.date: 05/10/2022
---

# Model interpretablity (preview)

This article describes methods you can use for model interpretability in Azure Machine Learning.

> [!IMPORTANT]
> With the release of the Responsible AI dashboard which includes model interpretability, we recommend users to migrate to the new experience as the older SDKv1 preview model interpretability dashboard will no longer be actively maintained.

## Why is model interpretability important to model debugging?

When machine learning models are used in ways that impact people’s lives, it is critically important to understand what influences the behavior of models. Interpretability helps answer questions in scenarios such as model debugging (Why did my model make this mistake? How can I improve my model?), human-AI collaboration (How can I understand and trust the model’s decisions?), and regulatory compliance (Does my model satisfy legal requirements?).  

The interpretability component of the [Responsible AI dashboard](LINK TO CONCEPT DOC RESPONSIBLE AI DASHBOARD) contributes to the “diagnose” stage of the model lifecycle workflow by generating human-understandable descriptions of the predictions of a Machine Learning model. It provides multiple views into a model’s behavior: global explanations (e.g., what features affect the overall behavior of a loan allocation model) and local explanations (e.g., why a customer’s loan application was approved or rejected). One can also observe model explanations for a selected cohort as a subgroup of data points. This is valuable when, for example, assessing fairness in model predictions for individuals in a particular demographic group. The local explanation tab of this component also represents a full data visualization which is great for general eyeballing the data and looking at differences between correct and incorrect predictions of each cohort.

The capabilities of this component are founded by [InterpretML](https://interpret.ml/) capabilities on generating model explanations.

Use interpretability when you need to...
+ Determine how trustworthy your AI system’s predictions are by understanding what features are most important for the predictions.
+ Approach the debugging of your model by understanding it first and identifying if the model is using healthy features or merely spurious correlations.
+ Uncover potential sources of unfairness by understanding whether the model is predicting based on sensitive features or features highly correlated with them.
+ Build end user trust in your model’s decisions by generating local explanations to illustrate their outcomes.
+ Complete a regulatory audit of an AI system to validate models and monitor the impact of model decisions on humans.

## How to interpret your model?
In machine learning, **features** are the data fields used to predict a target data point. For example, to predict credit risk, data fields for age, account size, and account age might be used. In this case, age, account size, and account age are **features**. Feature importance tells you how each data field affected the model's predictions. For example, age may be heavily used in the prediction while account size and account age do not affect the prediction values significantly. This process allows data scientists to explain resulting predictions, so that stakeholders have visibility into what features are most important in the model.

Using the classes and methods in the Responsible AI dashboard using SDK v2 and CLI v2, you can:
+ Explain model prediction by generating feature importance values for the entire model (global explanation) and/or individual datapoints (local explanation).
+ Achieve model interpretability on real-world datasets at scale
+ Use an interactive visualization dashboard to discover patterns in data and explanations at training time

Using the classes and methods in the SDK v1, you can:
+ Explain model prediction by generating feature importance values for the entire model and/or individual datapoints.
+ Achieve model interpretability on real-world datasets at scale, during training and inference.
+ Use an interactive visualization dashboard to discover patterns in data and explanations at training time

The model interpretability classes are made available through the following SDK v1 package: (Learn how to [install SDK packages for Azure Machine Learning](/python/api/overview/azure/ml/install))

* `azureml.interpret`, contains functionalities supported by Microsoft.

Use `pip install azureml-interpret` for general use.

## Supported model interpretability techniques
The Responsible AI dashboard and `azureml-interpret` use the interpretability techniques developed in [Interpret-Community](https://github.com/interpretml/interpret-community/), an open source Python package for training interpretable models and helping to explain opaque-box AI systems. Opaque-box models are those for which we have no information about their internal workings. interpret-Community serves as the host for this SDK's supported explainers.

[Interpret-Community](https://github.com/interpretml/interpret-community/) serves as the host for the following supported explainers, and currently supports the following interpretability techniques:

### Supported in Responsible AI dashboard in Python SDK v2 and CLI v2
|Interpretability Technique|Description|Type|
|--|--|--------------------|
|Mimic Explainer (Global Surrogate) + SHAP tree|Mimic explainer is based on the idea of training global surrogate models to mimic opaque-box models. A global surrogate model is an intrinsically interpretable model that is trained to approximate the predictions of any opaque-box model as accurately as possible. Data scientists can interpret the surrogate model to draw conclusions about the opaque-box model. The Responsible AI dashboard uses LightGBM (LGBMExplainableModel), paired with the SHAP (SHapley Additive exPlanations) tree explainer, which is a specific explainer to trees and ensembles of trees. The combination of LightGBM  and SHAP tree provide model-agnostic global and local explanations of your machine learning models.|Model-agnostic|
### Supported in Python SDK v1
|Interpretability Technique|Description|Type|
|--|--|--------------------|
|SHAP Tree Explainer| [SHAP](https://github.com/slundberg/shap)'s tree explainer, which focuses on polynomial time fast SHAP value estimation algorithm specific to **trees and ensembles of trees**.|Model-specific|
|SHAP Deep Explainer| Based on the explanation from SHAP, Deep Explainer "is a high-speed approximation algorithm for SHAP values in deep learning models that builds on a connection with DeepLIFT described in the [SHAP NIPS paper](https://papers.nips.cc/paper/7062-a-unified-approach-to-interpreting-model-predictions). **TensorFlow** models and **Keras** models using the TensorFlow backend are supported (there is also preliminary support for PyTorch)".|Model-specific|
|SHAP Linear Explainer| SHAP's Linear explainer computes SHAP values for a **linear model**, optionally accounting for inter-feature correlations.|Model-specific|
|SHAP Kernel Explainer| SHAP's Kernel explainer uses a specially weighted local linear regression to estimate SHAP values for **any model**.|Model-agnostic|
|Mimic Explainer (Global Surrogate)| Mimic explainer is based on the idea of training [global surrogate models](https://christophm.github.io/interpretable-ml-book/global.html) to mimic opaque-box models. A global surrogate model is an intrinsically interpretable model that is trained to approximate the predictions of **any opaque-box model** as accurately as possible. Data scientists can interpret the surrogate model to draw conclusions about the opaque-box model. You can use one of the following interpretable models as your surrogate model: LightGBM (LGBMExplainableModel), Linear Regression (LinearExplainableModel), Stochastic Gradient Descent explainable model (SGDExplainableModel), and Decision Tree (DecisionTreeExplainableModel).|Model-agnostic|
|Permutation Feature Importance Explainer (PFI)| Permutation Feature Importance is a technique used to explain classification and regression models that is inspired by [Breiman's Random Forests paper](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf) (see section 10). At a high level, the way it works is by randomly shuffling data one feature at a time for the entire dataset and calculating how much the performance metric of interest changes. The larger the change, the more important that feature is. PFI can explain the overall behavior of **any underlying model** but does not explain individual predictions. |Model-agnostic|

Besides the interpretability techniques described above, we support another SHAP-based explainer, called `TabularExplainer`. Depending on the model, `TabularExplainer` uses one of the supported SHAP explainers:

* TreeExplainer for all tree-based models
* DeepExplainer for DNN models
* LinearExplainer for linear models
* KernelExplainer for all other models

`TabularExplainer` has also made significant feature and performance enhancements over the direct SHAP Explainers:

* **Summarization of the initialization dataset**. In cases where speed of explanation is most important, we summarize the initialization dataset and generate a small set of representative samples, which speeds up the generation of overall and individual feature importance values.
* **Sampling the evaluation data set**. If the user passes in a large set of evaluation samples but does not actually need all of them to be evaluated, the sampling parameter can be set to true to speed up the calculation of overall model explanations.

The following diagram shows the current structure of supported explainers.

[![Machine Learning Interpretability Architecture](./media/how-to-machine-learning-interpretability/interpretability-architecture.png)](./media/how-to-machine-learning-interpretability/interpretability-architecture.png#lightbox)


## Supported machine learning models

The `azureml.interpret` package of the SDK supports models trained with the following dataset formats:
- `numpy.array`
- `pandas.DataFrame`
- `iml.datatypes.DenseData`
- `scipy.sparse.csr_matrix`

The explanation functions accept both models and pipelines as input. If a model is provided, the model must implement the prediction function `predict` or `predict_proba` that conforms to the Scikit convention. If your model does not support this, you can wrap your model in a function that generates the same outcome as `predict` or `predict_proba` in Scikit and use that wrapper function with the selected explainer. If a pipeline is provided, the explanation function assumes that the running pipeline script returns a prediction. Using this wrapping technique, `azureml.interpret` can support models trained via PyTorch, TensorFlow, and Keras deep learning frameworks as well as classic machine learning models.

## Local and remote compute target

The `azureml.interpret` package is designed to work with both local and remote compute targets. If run locally, The SDK functions will not contact any Azure services. 

You can run explanation remotely on Azure Machine Learning Compute and log the explanation info into the Azure Machine Learning Run History Service. Once this information is logged, reports and visualizations from the explanation are readily available on Azure Machine Learning studio for analysis.

## Next steps

- See the how-to guide for generating a Responsible AI dashboard with model interpretability via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI ](how-to-responsible-ai-dashboard-ui.md)
- See the [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) generate a Responsible AI scorecard based on the insights observed in the Responsible AI dashboard.
- See the [how-to](how-to-machine-learning-interpretability-aml.md) for enabling interpretability for models training both locally and on Azure Machine Learning remote compute resources.
- Learn how to enable [interpretability for automated machine learning models](how-to-machine-learning-interpretability-automl.md).
- See the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/explain-model) for additional scenarios. 
- If you're interested in interpretability for text scenarios, see [Interpret-text](https://github.com/interpretml/interpret-text), a related open source repo to [Interpret-Community](https://github.com/interpretml/interpret-community/), for interpretability techniques for NLP. `azureml.interpret` package does not currently support these techniques but you can get started with an [example notebook on text classification](https://github.com/interpretml/interpret-text/blob/master/notebooks/text_classification/text_classification_classical_text_explainer.ipynb).
