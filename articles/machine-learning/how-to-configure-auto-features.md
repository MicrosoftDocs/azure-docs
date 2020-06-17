---
title: Featurization in AutoML experiments
titleSuffix: Azure Machine Learning
description: Learn what featurization settings Azure Machine Learning offers, and how feature engineering is supported in automated ml experiments.
author: nibaccam
ms.author: nibaccam
ms.reviewer: nibaccam
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 05/28/2020
ms.custom: seodec18
---

# Featurization with automated machine learning

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this guide, learn what featurization settings are offered, and how to customize them for your [automated machine learning experiments](concept-automated-ml.md).

Feature engineering is the process of using domain knowledge of the data to create features that help ML algorithms learn better. In Azure Machine Learning, data scaling and normalization techniques are applied to facilitate feature engineering. Collectively, these techniques and feature engineering are referred to as featurization in automated machine learning, AutoML, experiments.

This article assumes you are already familiar with how to configure an AutoML experiment. See the following articles for details,

* For a code first experience: [Configure automated ML experiments with the Python SDK](how-to-configure-auto-train.md).
* For a low/no code experience: [Create, review, and deploy automated machine learning models with the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md)

## Configure featurization

In every automated machine learning experiment, [automatic scaling and normalization techniques](#featurization) are applied to your data by default. These scaling and normalization techniques are types of featurization that help *certain* algorithms that are sensitive to features on different scales. However, you can also enable additional featurization, such as **missing values imputation, encoding,** and **transforms**.

> [!NOTE]
> Automated machine learning featurization steps (feature normalization, handling missing data,
> converting text to numeric, etc.) become part of the underlying model. When using the model for
> predictions, the same featurization steps applied during training are applied to
> your input data automatically.

For experiments configured with the SDK,  you can enable/disable the setting `featurization` and further specify the featurization steps that should be used for your experiment. If you are using the the Azure Machine Learning studio, see how to enable featurization [with these steps](how-to-use-automated-ml-for-ml-models.md#customize-featurization).

The following table shows the accepted settings for `featurization` in the [AutoMLConfig class](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig). 

|Featurization Configuration | Description|
------------- | ------------- |
|**`"featurization": 'auto'`**| Indicates that as part of preprocessing, [data guardrails and featurization steps](#featurization) are performed automatically. **Default setting**.|
|**`"featurization": 'off'`**| Indicates featurization steps shouldn't be done automatically.|
|**`"featurization":`&nbsp;`'FeaturizationConfig'`**| Indicates customized featurization step should be used. [Learn how to customize featurization](#customize-featurization).|

<a name="featurization"></a>

## Automatic featurization

The following table summarizes techniques automatically applied to your data. This happens for experiments configured through the SDK or the studio. To disable this behavior, set `"featurization": 'off'` in your `AutoMLConfig` object.

> [!NOTE]
> If you plan to export your auto ML created models to an [ONNX model](concept-onnx.md), only the featurization options indicated with an * are supported in the ONNX format. Learn more about [converting models to ONNX](concept-automated-ml.md#use-with-onnx). 

|Featurization&nbsp;steps| Description |
| ------------- | ------------- |
|**Drop high cardinality or no variance features*** |Drop these from training and validation sets, including features with all values missing, same value across all rows or with high cardinality (for example, hashes, IDs, or GUIDs).|
|**Impute missing values*** |For numerical features, impute with average of values in the column.<br/><br/>For categorical features, impute with most frequent value.|
|**Generate additional features*** |For DateTime features: Year, Month, Day, Day of week, Day of year, Quarter, Week of the year, Hour, Minute, Second.<br/><br/>For Text features: Term frequency based on unigrams, bi-grams, and tri-character-grams.|
|**Transform and encode***|Numeric features with few unique values are transformed into categorical features.<br/><br/>One-hot encoding is performed for low cardinality categorical; for high cardinality, one-hot-hash encoding.|
|**Word embeddings**|Text featurizer that converts vectors of text tokens into sentence vectors using a pre-trained model. Each word's embedding vector in a document is aggregated together to produce a document feature vector.|
|**Target encodings**|For categorical features, maps each category with averaged target value for regression problems, and to the class probability for each class for classification problems. Frequency-based weighting and k-fold cross validation is applied to reduce over fitting of the mapping and noise caused by sparse data categories.|
|**Text target encoding**|For text input, a stacked linear model with bag-of-words is used to generate the probability of each class.|
|**Weight of Evidence (WoE)**|Calculates WoE as a measure of correlation of categorical columns to the target column. It is calculated as the log of the ratio of in-class vs out-of-class probabilities. This step outputs one numerical feature column per class and removes the need to explicitly impute missing values and outlier treatment.|
|**Cluster Distance**|Trains a k-means clustering model on all numerical columns.  Outputs k new features, one new numerical feature per cluster, containing the distance of each sample to the centroid of each cluster.|

## Data guardrails

Data guardrails help you identify potential issues with your data (e.g., missing values, [class imbalance](concept-manage-ml-pitfalls.md#identify-models-with-imbalanced-data)) and help take corrective actions for improved results. 

Data guardrails are applied 

* **For SDK experiments**, when either the parameters `"featurization": 'auto'` or `validation=auto` are specified in your `AutoMLConfig` object.
* **For studio experiments**, when *Automatic featurization* is enabled.  

You can review the data guardrails pertaining to your experiment

* By setting `show_output=True` when submitting an experiment with the Python SDK.

* In the studio on the **Data guardrails** tab of you automated ML run.

### Data guardrail states

Data guardrails will display one of three states: **Passed**, **Done**, or **Alerted**.

|State| Description |
|----|---- |
|**Passed**| No data problems were detected and no user action is required. |
|**Done**| Changes were applied to your data. We encourage users to review the corrective actions Automated ML took to ensure the changes align with the expected results. |
|**Alerted**| A data issue that could not be remedied was detected. We encourage users to revise and fix the issue.| 

The following table describes the data guardrails currently supported, and the associated statuses that users may come across when submitting their experiment.

Guardrail|Status|Condition&nbsp;for&nbsp;trigger
---|---|---
**Missing feature values imputation** |*Passed* <br><br><br> *Done*| No missing feature values were detected in your training data. Learn more about [missing value imputation.](https://docs.microsoft.com/azure/machine-learning/how-to-use-automated-ml-for-ml-models#advanced-featurization-options) <br><br> Missing feature values were detected in your training data and imputed.
**High cardinality feature handling** |*Passed* <br><br><br> *Done*| Your inputs were analyzed, and no high cardinality features were detected. Learn more about [high cardinality feature detection.](#automatic-featurization) <br><br> High cardinality features were detected in your inputs and were handled.
**Validation split handling** |*Done*| The validation configuration was set to 'auto' and the training data contained **less than 20,000 rows**. <br> Each iteration of the trained model was validated through cross-validation. Learn more about [validation data.](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#train-and-validation-data) <br><br> The validation configuration was set to 'auto' and the training data contained **more than 20,000 rows**. <br> The input data has been split into a training dataset and a validation dataset for validation of the model.
**Class balancing detection** |*Passed* <br><br><br><br><br> *Alerted* | Your inputs were analyzed, and all classes are balanced in your training data. A dataset is considered balanced if each class has good representation in the dataset, as measured by number and ratio of samples. <br><br><br> Imbalanced classes were detected in your inputs. To fix model bias, fix the balancing problem. Learn more about [imbalanced data.](https://docs.microsoft.com/azure/machine-learning/concept-manage-ml-pitfalls#identify-models-with-imbalanced-data)
**Memory issues detection** |*Passed* <br><br><br><br> *Done* |<br> The selected {horizon, lag, rolling window} value(s) were analyzed, and no potential out-of-memory issues were detected. Learn more about time-series [forecasting configurations.](https://docs.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#configure-and-run-experiment) <br><br><br>The selected {horizon, lag, rolling window} values were analyzed and will potentially cause your experiment to run out of memory. The lag or rolling window configurations have been turned off.
**Frequency detection** |*Passed* <br><br><br><br> *Done* |<br> The time series was analyzed and all data points are aligned with the detected frequency. <br> <br> The time series was analyzed and data points that do not align with the detected frequency were detected. These data points were removed from the dataset. Learn more about [data preparation for time-series forecasting.](https://docs.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#preparing-data)

## Customize featurization

You can customize your featurization settings to ensure that the data and features used to train your ML model result in relevant predictions. 

To customize featurizations, specify `"featurization": FeaturizationConfig` in your `AutoMLConfig` object. If you are using the Azure Machine Learning studio for your experiment, see the [how-to](how-to-use-automated-ml-for-ml-models.md#customize-featurization).

Supported customization includes:

|Customization|Definition|
|--|--|
|**Column purpose update**|Override feature type for the specified column.|
|**Transformer parameter update** |Update parameters for the specified transformer. Currently supports Imputer (mean, most frequent & median) and HashOneHotEncoder.|
|**Drop columns** |Columns to drop from being featurized.|
|**Block transformers**| Block transformers to be used on featurization process.|

Create the FeaturizationConfig object using API calls:
```python
featurization_config = FeaturizationConfig()
featurization_config.blocked_transformers = ['LabelEncoder']
featurization_config.drop_columns = ['aspiration', 'stroke']
featurization_config.add_column_purpose('engine-size', 'Numeric')
featurization_config.add_column_purpose('body-style', 'CategoricalHash')
#default strategy mean, add transformer param for for 3 columns
featurization_config.add_transformer_params('Imputer', ['engine-size'], {"strategy": "median"})
featurization_config.add_transformer_params('Imputer', ['city-mpg'], {"strategy": "median"})
featurization_config.add_transformer_params('Imputer', ['bore'], {"strategy": "most_frequent"})
featurization_config.add_transformer_params('HashOneHotEncoder', [], {"number_of_bits": 3})
```
## Next steps

* Learn how to set up your automated ML experiments,

    * For code experience customers: [Configure automated ML experiments with the Azure Machine Learning SDK](how-to-configure-auto-train.md).
    * For low/no code experience customers: [Create your automated machine learning experiments in Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md).

* Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).

* Learn more about [how to train a regression model with Automated machine learning](tutorial-auto-train-models.md) or [how to train using Automated machine learning on a remote resource](how-to-auto-train-remote.md).
