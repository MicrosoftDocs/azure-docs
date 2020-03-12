---
title: Model interpretability in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to explain why your model makes predictions using the Azure Machine Learning SDK. It can be used during training and inference to understand how your model makes predictions.
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

# Model interpretability in Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

## Overview of model interpretability

Interpretability is critical for data scientists and business decision makers alike to ensure compliance with company policies, industry standards, and government regulations:
+ Data scientists need the ability to explain their models to executives and stakeholders, so they can understand the value and accuracy of their findings 
+ Business decision makers need peace-of-mind of the ability to provide transparency for end users to gain and maintain their trust

Enabling the capability of explaining a machine learning model is important during two main phases of model development:
+ During the training phase of the machine learning model development cycle. Model designers and evaluators can use interpretability output of a model to verify hypotheses and build trust with stakeholders. They also use the insights into the model for debugging, validating model behavior matches their objectives, and to check for bias or insignificant features.
+ During the inferencing phase, as having transparency around deployed models empowers executives to understand “when deployed” how the model is working and how its decisions are treating and impacting people in real life. 

## Interpretability with Azure Machine Learning

In this article, you learn how model interpretability concepts are implemented in the SDK.

Using the classes and methods in the SDK, you can get:
+ Feature importance values for both raw and engineered features
+ Interpretability on real-world datasets at scale, during training and inference.
+ Interactive visualizations to aid you in the discovery of patterns in data and explanations at training time


In machine learning, **features** are the data fields used to predict a target data point. For example,
to predict credit risk, data fields for age, account size, and account age might be used. In this case,
age, account size, and account age are **features**. Feature importance tells you how each data field affected the model's predictions. For example, age may be heavily used in the prediction while account size and age don't affect the prediction accuracy significantly. This process allows data scientists to explain resulting predictions, so that stakeholders have visibility into what data points are most important in the model.

Using these tools, you can explain machine learning models **globally on all data**, or **locally on a specific data point** using the state-of-art technologies in an easy-to-use and scalable fashion.

The interpretability classes are made available through multiple SDK packages. Learn how to [install SDK packages for Azure Machine Learning](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).

* `azureml.interpret`, the main package, containing functionalities supported by Microsoft.

* `azureml.contrib.interpret`, preview, and experimental functionalities that you can try.

* `azureml.train.automl.automlexplainer` package for interpreting automated machine learning models.

> [!IMPORTANT]
> Content in the `contrib` namespace is not fully supported. As the experimental functionalities become mature, they will gradually be moved to the main namespace.

## How to interpret your model

You can apply the interpretability classes and methods to understand the model’s global behavior or specific predictions. The former is called global explanation and the latter is called local explanation.

The methods can be also categorized based on whether the method is model agnostic or model specific. Some methods target certain type of models. For example, SHAP’s tree explainer only applies to tree-based models. Some methods treat the model as a black box, such as mimic explainer or SHAP’s kernel explainer. The `interpret` package leverages these different approaches based on data sets, model types, and use cases.

The output is a set of information on how a given model makes its prediction, such as:
* Global/local relative feature importance
* Global/local feature and prediction relationship

### Explainers

This package uses the interpretability techniques developed in [Interpret-Community](https://github.com/interpretml/interpret-community/), an open source python package for training interpretable models and helping to explain blackbox AI systems. [Interpret-Community](https://github.com/interpretml/interpret-community/) serves as the host for this SDK's supported explainers, and currently supports the following interpretability techniques:

* **SHAP Tree Explainer**: [SHAP](https://github.com/slundberg/shap)’s tree explainer, which focuses on polynomial time fast SHAP value estimation algorithm specific to trees and ensembles of trees.
* **SHAP Deep Explainer**: Based on the explanation from [SHAP](https://github.com/slundberg/shap), Deep Explainer "is a high-speed approximation algorithm for SHAP values in deep learning models that builds on a connection with DeepLIFT described in the [SHAP NIPS paper](https://papers.nips.cc/paper/7062-a-unified-approach-to-interpreting-model-predictions). TensorFlow models and Keras models using the TensorFlow backend are supported (there is also preliminary support for PyTorch)".
* **SHAP Linear Explainer**: [SHAP](https://github.com/slundberg/shap)'s Linear explainer computes SHAP values for a linear model, optionally accounting for inter-feature correlations.

* **SHAP Kernel Explainer**: [SHAP](https://github.com/slundberg/shap)'s Kernel explainer uses a specially weighted local linear regression to estimate SHAP values for any model.
* **Mimic Explainer**: Mimic explainer is based on the idea of training [global surrogate models](https://christophm.github.io/interpretable-ml-book/global.html) to mimic blackbox models. A global surrogate model is an intrinsically interpretable model that is trained to approximate the predictions of a black box model as accurately as possible. Data scientist can interpret the surrogate model to draw conclusions about the black box model. You can use one of the following interpretable models as your surrogate model: LightGBM (LGBMExplainableModel), Linear Regression (LinearExplainableModel), Stochastic Gradient Descent explainable model (SGDExplainableModel), and Decision Tree (DecisionTreeExplainableModel).


* **Permutation Feature Importance Explainer**: Permutation Feature Importance is a technique used to explain classification and regression models that is inspired by [Breiman's Random Forests paper](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf) (see section 10). At a high level, the way it works is by randomly shuffling data one feature at a time for the entire dataset and calculating how much the performance metric of interest changes. The larger the change, the more important that feature is.

* **LIME Explainer** (`contrib`): Based on [LIME](https://github.com/marcotcr/lime), LIME Explainer uses the state-of-the-art Local interpretable model-agnostic explanations (LIME) algorithm to create local surrogate models. Unlike the global surrogate models, LIME focuses on training local surrogate models to explain individual predictions.
* **HAN Text Explainer** (`contrib`): HAN Text Explainer uses a Hierarchical Attention Network for getting model explanations from text data for a given black box text model. It trains the HAN surrogate model on a given black box model's predicted outputs. After training globally across the text corpus, it adds a fine-tune step for a specific document in order to improve the accuracy of the explanations. HAN uses a bidirectional RNN with two attention layers, for sentence and word attention. Once the DNN is trained on the black box model and fine-tuned on a specific document, user can extract the word importances from the attention layers. HAN is shown to be more accurate than LIME or SHAP for text data but more costly in terms of training time as well. Improvements have been made to give user the option to initialize the network with GloVe word embeddings to reduce the training time. The training time can be improved significantly by running HAN on a remote Azure GPU VM. The implementation of HAN is described in ['Hierarchical Attention Networks for Document Classification (Yang et al., 2016)'](https://www.researchgate.net/publication/305334401_Hierarchical_Attention_Networks_for_Document_Classification).


* **Tabular Explainer**: `TabularExplainer` employs the following logic to invoke the Direct [SHAP](https://github.com/slundberg/shap) Explainers:

    1. If it is a tree-based model, apply SHAP `TreeExplainer`, else
    2. If it is a DNN model, apply SHAP `DeepExplainer`, else
    3. If it is a linear model, apply SHAP `LinearExplainer`, else
    3. Treat it as a black-box model and apply SHAP `KernelExplainer`


`TabularExplainer` has also made significant feature and performance enhancements over the direct SHAP Explainers:

* **Summarization of the initialization dataset**. In cases where speed of explanation is most important, we summarize the initialization dataset and generate a small set of representative samples, which speeds up both global and local explanation.
* **Sampling the evaluation data set**. If the user passes in a large set of evaluation samples but doesn't actually need all of them to be evaluated, the sampling parameter can be set to true to speed up the global explanation.

The following diagram shows the current structure of direct and meta explainers.

[![Machine Learning Interpretability Architecture](./media/how-to-machine-learning-interpretability/interpretability-architecture.png)](./media/how-to-machine-learning-interpretability/interpretability-architecture.png#lightbox)


### Models supported

Any models that are trained on datasets in Python `numpy.array`, `pandas.DataFrame`, `iml.datatypes.DenseData`, or `scipy.sparse.csr_matrix` format are supported by the interpretability `explain` package of the SDK.

The explanation functions accept both models and pipelines as input. If a model is provided, the model must implement the prediction function `predict` or `predict_proba` that conforms to the Scikit convention. If a pipeline (name of the pipeline script) is provided, the explanation function assumes that the running pipeline script returns a prediction. We support models trained via PyTorch, TensorFlow, and Keras deep learning frameworks.

### Local and remote compute target

The `explain` package is designed to work with both local and remote compute targets. If run locally, The SDK functions will not contact any Azure services. You can run explanation remotely on Azure Machine Learning Compute and log the explanation info into Azure Machine Learning Run History Services. Once this information is logged, reports and visualizations from the explanation are readily available on Azure Machine Learning workspace for user analysis.


## Next steps

See the [how-to](how-to-machine-learning-interpretability-aml.md) for enabling interpretability for models training both locally and on Azure Machine Learning remote compute resources. See the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/explain-model) for additional scenarios.
