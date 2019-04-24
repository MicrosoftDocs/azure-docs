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

Using **Azure Machine Learning service**, you can run automatic training experiments [in Azure portal](how-to-create-portal-experiments.md) or using Python [with the SDK](how-to-configure-auto-train.md).  Automated ML is also available with Visual Studio and Visual Studio Code for [ML.NET](https://docs.microsoft.com/dotnet/machine-learning/what-is-mldotnet) and PowerBI.

## How automated ML works

When you use Azure Machine Learning service to automate ML modeling and tuning, you'll go through these steps:

1. **Identify the ML problem (**Classification**, **Forecasting**, or **Regression**) to be solved.** See the full [list of models](how-to-configure-auto-train.md#select-your-experiment-type).
   
1. **Specify the training data's source and format.** 
   + Data must be labeled. 
   + Store data in your development environment (alongside your training scripts) or in Azure Blob Storage. This directory is copied to the compute target you select for training.
   + Script data can be read into Numpy arrays or a Pandas dataframe.
   + Use split options for training and validation data, or specify separate training and validation data sets.

1. **Configure the compute target for model training.** 
   
   Options include [your local computer, an Azure Machine Learning Compute, a remote VM, Azure Databricks](how-to-set-up-training-targets.md).  Learn more about using automated training [on a remote resource](how-to-auto-train-remote.md)

1. **Configure the automated machine learning parameters** that determine how many iterations over different models, hyperparameter settings, and what metrics to look at when determining the best model. You can configure the experiment: 
   + With the Python SDK, [use these steps](how-to-configure-auto-train.md).
   + In Azure portal, [use these steps](how-to-create-portal-experiments.md).

1. **Submit the training run.** 


[![Automated Machine learning](./media/how-to-automated-ml/automated-machine-learning.png)](./media/how-to-automated-ml/automated-machine-learning.png#lightbox)

During training, the Azure Machine Learning service creates a number of pipelines that try different algorithms and parameters. It will stop once it hits the iteration limit you provide, or when it reaches the target value for the metric you specify.  

You can also inspect the logged run information, which contains metrics gathered during the run. The training run produces a Python serialized object (`.pkl` file) that contains the model and data preprocessing.

While model building is automated, you can also [learn how important or relevant features were](how-to-configure-auto-train.md#explain-the-model) to the generation of your model. 


## Preprocessing

If you use `"preprocess": True` for the [`AutoMLConfig` class](https://docs.microsoft.com/python/api/azureml-train-automl/azureml.train.automl.automlconfig?view=azure-ml-py), the following data preprocessing and featurization steps are performed automatically for you:

|Preprocessing&nbsp;steps| Description |
| ------------- | ------------- |
|Drop high cardinality or no variance features|Drop these from training and validation sets, including features with all values missing, same value across all rows or with extremely high cardinality (for example, hashes, IDs, or GUIDs).|	
|Impute missing values|For numerical features, impute with average of values in the column.<br/><br/>For categorical features, impute with most frequent value.|
|Generate additional features|For DateTime features: Year, Month, Day, Day of week, Day of year, Quarter, Week of the year, Hour, Minute, Second.<br/><br/>For Text features: Term frequency based on unigrams, bi-grams, and tri-character-grams.|	
|Transform and encode |Numeric features with few unique values are transformed into categorical features.<br/><br/>One-hot encoding is performed for low cardinality categorical; for high cardinality, one-hot-hash encoding.|
|Word embeddings|Transforms is a text featurizer that converts vectors of text tokens into sentence vectors using a pre-trained model. Each word’s embedding vector in a document is aggregated together to produce a document feature vector.|	
|Target encodings|For categorical features, maps each category with averaged target value for regression problems, and to the class probability for each class for classification problems. Frequency-based weighting and k-fold cross validation is applied to reduce overfitting of the mapping and noise caused by sparse data categories.|	
|Text target encoding|For text input, a stacked linear model with bag-of-words is used to generate the probability of each class.|	
|Weight of Evidence (WoE)|Calculates WoE as a measure of correlation of categorical columns to the target column. It is calculated as the log of the ratio of in-class vs out-of-class probabilities. This step outputs one numerical feature column per class and removes the need to explicitly impute missing values and outlier treatment.|	
|Cluster Distance|Trains a k-means clustering model on all numerical columns.  Outputs k new features, one new numerical feature per cluster, containing the distance of each sample to the centroid of each cluster.|	

## Scale & normalize

In addition to the preceding pre-processing list, data is automatically scaled/normalized to help algorithms perform well.  The `preprocess` flag in AutoMLConfig does not control behavior of scaling and normalization described here.  See this table for details:

| Scaling/Normalization  | Description |
| ------------- | ------------- |
| [StandardScaleWrapper](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)  | Standardize features by removing the mean and scaling to unit variance  |
| [MinMaxScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html)  | Transforms features by scaling each feature by that column’s minimum and maximum  |
| [MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html#sklearn.preprocessing.MaxAbsScaler) |	Scale each feature by its maximum absolute value |	
| [RobustScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) |	This Scaler features by their quantile range |
| [PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html) |	Linear dimensionality reduction using Singular Value Decomposition of the data to project it to a lower dimensional space |	
| [TruncatedSVDWrapper](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html) |	This transformer performs linear dimensionality reduction by means of truncated singular value decomposition (SVD). Contrary to PCA, this estimator does not center the data before computing the singular value decomposition. This means it can work with scipy.sparse matrices efficiently |	
| [SparseNormalizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) | Each sample (that is, each row of the data matrix) with at least one non-zero component is rescaled independently of other samples so that its norm (l1 or l2) equals one |	

## Ensemble models

You can train ensemble models using automated machine learning with the [Caruana ensemble selection algorithm with sorted Ensemble initialization](http://www.niculescu-mizil.org/papers/shotgun.icml04.revised.rev2.pdf). Ensemble learning improves machine learning results and predictive performance by combing many models as opposed to using single models. The ensemble iteration appears as the last iteration of your run.

## Use with ONNX in C# apps

With Azure Machine Learning, you can use automated ML to build a Python model and have it converted to the ONNX format. The ONNX runtime supports  C#, so you can use the ONNX model in your C# app without any need for recoding or any of the network latencies introduced by REST endpoints. Try an example of this flow [in this Juptyer notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-with-onnx/auto-ml-classification-with-onnx.ipynb).

## Next steps

See examples and learn how to build models using Automated Machine Learning:

+ Follow the [Tutorial: Automatically train a classification model with Azure Automated Machine Learning](tutorial-auto-train-models.md)

+ Configure the settings for automatic training experiment [with the SDK](how-to-configure-auto-train.md) or [in Azure portal](how-to-create-portal-experiments.md).

+ Try out [Jupyter Notebook samples](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/)

