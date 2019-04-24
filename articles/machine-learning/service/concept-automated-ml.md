---
title: Automated ML algorithm selection & tuning
titleSuffix: Azure Machine Learning service
description: Learn how Azure Machine Learning service can automatically pick an algorithm for you, and generate a model from it to save you time by using the parameters and criteria you provide to select the best algorithm for your model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: nacharya1
ms.author: nilesha
ms.date: 05/02/2019
ms.custom: seodec18

---

# What is automated machine learning?

Automated machine learning, also referred to as AutoML, will build a set of ML models automatically, fine-tune them, and pick the best one for you automatically. The traditional machine learning model development process is highly resource-intensive, and requires significant domain knowledge and time investment to run and compare the results of dozens of models. 

With automated ML, anyone can successfully extract and leverage the business insights hidden in their data. While still a newer ML option, it has quickly become popular with non-ML experts, those who don't want to code, and those looking for a quick prototype. 

You provide some goals, constraints, or blacklists, and then automated machine learning generates the model for you. Behind the scenes, training data is taken with a defined target feature, and iterated upon through combinations of algorithms and feature selections. Then, the best model (based on training scores) is automatically selected.  

## How automated ML works

Using **Azure Machine Learning service**, you can design and run your automated ML training experiments [in Azure portal](how-to-create-portal-experiments.md) interface or using the [Python SDK](how-to-configure-auto-train.md).  Note that automated ML is also available for .NET apps using Visual Studio and Visual Studio Code with [ML.NET](https://docs.microsoft.com/dotnet/machine-learning/what-is-mldotnet) as well as in Power BI.

When you use Azure Machine Learning service to automate ML modeling and tuning, you'll go through these steps:

1. **Identify the ML problem (**Classification**, **Forecasting**, or **Regression**) to be solved.** See the full [list of models](how-to-configure-auto-train.md#select-your-experiment-type).
   
1. **Specify the training data's source and format.** 
   + Data must be labeled. 
   + Store data in your development environment (alongside your training scripts) or in Azure Blob Storage. This directory is copied to the compute target you select for training.
   + Script data can be read into Numpy arrays or a Pandas dataframe.
   + Use split options for training and validation data, or specify separate training and validation data sets.

1. **Configure the compute target for model training.** 
   
   Options include [your local computer, an Azure Machine Learning Compute, a remote VM, Azure Databricks](how-to-set-up-training-targets.md).  Learn more about using automated training [on a remote resource](how-to-auto-train-remote.md)

1. **Configure the automated machine learning parameters** that determine how many iterations over different models, hyperparameter settings, advanced preprocessing/featurization, and what metrics to look at when determining the best model.  You can configure the settings for automatic training experiment [in Azure portal](how-to-create-portal-experiments.md) or [with the SDK](how-to-configure-auto-train.md).

1. **Submit the training run.** 


[![Automated Machine learning](./media/how-to-automated-ml/automated-machine-learning.png)](./media/how-to-automated-ml/automated-machine-learning.png#lightbox)

During training, the Azure Machine Learning service creates a number of pipelines that try different algorithms and parameters. It will stop once it hits the iteration limit you provide, or when it reaches the target value for the metric you specify.  

You can also inspect the logged run information, which contains metrics gathered during the run. The training run produces a Python serialized object (`.pkl` file) that contains the model and data preprocessing.

While model building is automated, you can also [learn how important or relevant features were](how-to-configure-auto-train.md#explain-the-model) to the generation of your model. 

<a name="preprocess"></a>

## Scale, normalize, and more

In every automated machine learning experiment, your data is automatically scaled and normalized to help algorithms perform well.  

| Scaling/Normalization  | Description |
| ------------- | ------------- |
| [StandardScaleWrapper](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)  | Standardize features by removing the mean and scaling to unit variance  |
| [MinMaxScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html)  | Transforms features by scaling each feature by that column’s minimum and maximum  |
| [MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html#sklearn.preprocessing.MaxAbsScaler) |	Scale each feature by its maximum absolute value |	
| [RobustScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) |	This Scaler features by their quantile range |
| [PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html) |	Linear dimensionality reduction using Singular Value Decomposition of the data to project it to a lower dimensional space |	
| [TruncatedSVDWrapper](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html) |	This transformer performs linear dimensionality reduction by means of truncated singular value decomposition (SVD). Contrary to PCA, this estimator does not center the data before computing the singular value decomposition. This means it can work with scipy.sparse matrices efficiently |	
| [SparseNormalizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) | Each sample (that is, each row of the data matrix) with at least one non-zero component is rescaled independently of other samples so that its norm (l1 or l2) equals one |	

Additional advanced preprocessing and featurization is also available, such as missing values imputation, encoding, transforms, WoE. [Learn more about what featurization is included](how-to-create-portal-experiments.md#preprocess). Enable this setting by:
+ Azure portal: Selecting the **Preprocess** checkbox in the **Advanced settings** [with these steps](how-to-create-portal-experiments.md). 
+ Python SDK: Specifying `"preprocess": True` for the [`AutoMLConfig` class](https://docs.microsoft.com/python/api/azureml-train-automl/azureml.train.automl.automlconfig?view=azure-ml-py).

## Ensemble models

You can train ensemble models using automated machine learning with the [Caruana ensemble selection algorithm with sorted Ensemble initialization](http://www.niculescu-mizil.org/papers/shotgun.icml04.revised.rev2.pdf). Ensemble learning improves machine learning results and predictive performance by combing many models as opposed to using single models. The ensemble iteration appears as the last iteration of your run.

## Use with ONNX in C# apps

With Azure Machine Learning, you can use automated ML to build a Python model and have it converted to the ONNX format. The ONNX runtime supports  C#, so you can use the model built automatically in your C# apps without any need for recoding or any of the network latencies that REST endpoints introduce. Try an example of this flow [in this Jupyter notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-with-onnx/auto-ml-classification-with-onnx.ipynb).

## Next steps

See examples and learn how to build models using Automated Machine Learning:

+ Follow the [Tutorial: Automatically train a classification model with Azure Automated Machine Learning](tutorial-auto-train-models.md)

+ Configure the settings for automatic training experiment: 
   + In Azure portal interface, [use these steps](how-to-create-portal-experiments.md).
   + With the Python SDK, [use these steps](how-to-configure-auto-train.md).

+ Try out [Jupyter Notebook samples](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/)