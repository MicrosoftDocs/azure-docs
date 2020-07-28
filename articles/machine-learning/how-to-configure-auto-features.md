---
title: Featurization in AutoML experiments
titleSuffix: Azure Machine Learning
description: Learn what featurization settings Azure Machine Learning offers and how feature engineering is supported in automated ML experiments.
author: nibaccam
ms.author: nibaccam
ms.reviewer: nibaccam
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.date: 05/28/2020
---

# Featurization in automated machine learning

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this guide, you'll learn:

- What featurization settings Azure Machine Learning offers.
- How to customize those features for your [automated machine learning experiments](concept-automated-ml.md).

*Feature engineering* is the process of using domain knowledge of the data to create features that help machine learning (ML) algorithms to learn better. In Azure Machine Learning, data-scaling and normalization techniques are applied to make feature engineering easier. Collectively, these techniques and this feature engineering are called *featurization* in automated machine learning, or *AutoML*, experiments.

This article assumes that you already know how to configure an AutoML experiment. For information about configuration, see the following articles:

- For a code-first experience: [Configure automated ML experiments by using the Azure Machine Learning SDK for Python](how-to-configure-auto-train.md).
- For a low-code or no-code experience: [Create, review, and deploy automated machine learning models by using the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md).

## Configure featurization

In every automated machine learning experiment, [automatic scaling and normalization techniques](#featurization) are applied to your data by default. These techniques are types of featurization that help *certain* algorithms that are sensitive to features on different scales. However, you can also enable additional featurization, such as *missing-values imputation*, *encoding*, and *transforms*.

> [!NOTE]
> Steps for automated machine learning featurization (such as feature normalization, handling missing data,
> or converting text to numeric) become part of the underlying model. When you use the model for
> predictions, the same featurization steps that are applied during training are applied to
> your input data automatically.

For experiments that you configure with the Python SDK, you can enable or disable the featurization setting and further specify the featurization steps to be used for your experiment. If you're using the Azure Machine Learning studio, see the [steps to enable featurization](how-to-use-automated-ml-for-ml-models.md#customize-featurization).

The following table shows the accepted settings for `featurization` in the [AutoMLConfig class](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig):

|Featurization configuration | Description|
------------- | ------------- |
|`"featurization": 'auto'`| Specifies that, as part of preprocessing, [data guardrails and featurization steps](#featurization) are to be done automatically. This setting is the default.|
|`"featurization": 'off'`| Specifies that featurization steps are not to be done automatically.|
|`"featurization":`&nbsp;`'FeaturizationConfig'`| Specifies that customized featurization steps are to be used. [Learn how to customize featurization](#customize-featurization).|

<a name="featurization"></a>

## Automatic featurization

The following table summarizes techniques that are automatically applied to your data. These techniques are applied for experiments that are configured by using the SDK or the studio. To disable this behavior, set `"featurization": 'off'` in your `AutoMLConfig` object.

> [!NOTE]
> If you plan to export your AutoML-created models to an [ONNX model](concept-onnx.md), only the featurization options indicated with an asterisk ("*") are supported in the ONNX format. Learn more about [converting models to ONNX](concept-automated-ml.md#use-with-onnx).

|Featurization&nbsp;steps| Description |
| ------------- | ------------- |
|**Drop high cardinality or no variance features*** |Drop these features from training and validation sets. Applies to features with all values missing, with the same value across all rows, or with high cardinality (for example, hashes, IDs, or GUIDs).|
|**Impute missing values*** |For numeric features, impute with the average of values in the column.<br/><br/>For categorical features, impute with the most frequent value.|
|**Generate additional features*** |For DateTime features: Year, Month, Day, Day of week, Day of year, Quarter, Week of the year, Hour, Minute, Second.<br/><br/>For Text features: Term frequency based on unigrams, bigrams, and trigrams. Learn more about [how this is done with BERT.](#bert-integration)|
|**Transform and encode***|Transform numeric features that have few unique values into categorical features.<br/><br/>One-hot encoding is used for low-cardinality categorical features. One-hot-hash encoding is used for high-cardinality categorical features.|
|**Word embeddings**|A text featurizer converts vectors of text tokens into sentence vectors by using a pretrained model. Each word's embedding vector in a document is aggregated with the rest to produce a document feature vector.|
|**Target encodings**|For categorical features, this step maps each category with an averaged target value for regression problems, and to the class probability for each class for classification problems. Frequency-based weighting and k-fold cross-validation are applied to reduce overfitting of the mapping and noise caused by sparse data categories.|
|**Text target encoding**|For text input, a stacked linear model with bag-of-words is used to generate the probability of each class.|
|**Weight of Evidence (WoE)**|Calculates WoE as a measure of correlation of categorical columns to the target column. WoE is calculated as the log of the ratio of in-class vs. out-of-class probabilities. This step produces one numeric feature column per class and removes the need to explicitly impute missing values and outlier treatment.|
|**Cluster Distance**|Trains a k-means clustering model on all numeric columns. Produces *k* new features (one new numeric feature per cluster) that contain the distance of each sample to the centroid of each cluster.|

## Data guardrails

*Data guardrails* help you identify potential issues with your data (for example, missing values or [class imbalance](concept-manage-ml-pitfalls.md#identify-models-with-imbalanced-data)). They also help you take corrective actions for improved results.

Data guardrails are applied:

- **For SDK experiments**: When the parameters `"featurization": 'auto'` or `validation=auto` are specified in your `AutoMLConfig` object.
- **For studio experiments**: When automatic featurization is enabled.

You can review the data guardrails for your experiment:

- By setting `show_output=True` when you submit an experiment by using the SDK.

- In the studio, on the **Data guardrails** tab of your automated ML run.

### Data guardrail states

Data guardrails display one of three states:

|State| Description |
|----|---- |
|**Passed**| No data problems were detected and no action is required by you. |
|**Done**| Changes were applied to your data. We encourage you to review the corrective actions that AutoML took, to ensure that the changes align with the expected results. |
|**Alerted**| A data issue was detected but couldn't be remedied. We encourage you to revise and fix the issue.|

### Supported data guardrails

The following table describes the data guardrails that are currently supported and the associated statuses that you might see when you submit your experiment:

Guardrail|Status|Condition&nbsp;for&nbsp;trigger
---|---|---
**Missing feature values imputation** |Passed <br><br><br> Done| No missing feature values were detected in your training data. Learn more about [missing-value imputation.](https://docs.microsoft.com/azure/machine-learning/how-to-use-automated-ml-for-ml-models#advanced-featurization-options) <br><br> Missing feature values were detected in your training data and were imputed.
**High cardinality feature handling** |Passed <br><br><br> Done| Your inputs were analyzed, and no high-cardinality features were detected. <br><br> High-cardinality features were detected in your inputs and were handled.
**Validation split handling** |Done| The validation configuration was set to `'auto'` and the training data contained *fewer than 20,000 rows*. <br> Each iteration of the trained model was validated by using cross-validation. Learn more about [validation data](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#train-and-validation-data). <br><br> The validation configuration was set to `'auto'`, and the training data contained *more than 20,000 rows*. <br> The input data has been split into a training dataset and a validation dataset for validation of the model.
**Class balancing detection** |Passed <br><br><br><br><br> Alerted | Your inputs were analyzed, and all classes are balanced in your training data. A dataset is considered to be balanced if each class has good representation in the dataset, as measured by number and ratio of samples. <br><br><br> Imbalanced classes were detected in your inputs. To fix model bias, fix the balancing problem. Learn more about [imbalanced data](https://docs.microsoft.com/azure/machine-learning/concept-manage-ml-pitfalls#identify-models-with-imbalanced-data).
**Memory issues detection** |Passed <br><br><br><br> Done |<br> The selected values (horizon, lag, rolling window) were analyzed, and no potential out-of-memory issues were detected. Learn more about time-series [forecasting configurations](https://docs.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#configure-and-run-experiment). <br><br><br>The selected values (horizon, lag, rolling window) were analyzed and will potentially cause your experiment to run out of memory. The lag or rolling-window configurations have been turned off.
**Frequency detection** |Passed <br><br><br><br> Done |<br> The time series was analyzed, and all data points are aligned with the detected frequency. <br> <br> The time series was analyzed, and data points that don't align with the detected frequency were detected. These data points were removed from the dataset. Learn more about [data preparation for time-series forecasting](https://docs.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#preparing-data).

## Customize featurization

You can customize your featurization settings to ensure that the data and features that are used to train your ML model result in relevant predictions.

To customize featurizations, specify `"featurization": FeaturizationConfig` in your `AutoMLConfig` object. If you're using the Azure Machine Learning studio for your experiment, see the [how-to article](how-to-use-automated-ml-for-ml-models.md#customize-featurization).

Supported customizations include:

|Customization|Definition|
|--|--|
|**Column purpose update**|Override the feature type for the specified column.|
|**Transformer parameter update** |Update the parameters for the specified transformer. Currently supports *Imputer* (mean, most frequent, and median) and *HashOneHotEncoder*.|
|**Drop columns** |Specifies columns to drop from being featurized.|
|**Block transformers**| Specifies block transformers to be used in the featurization process.|

Create the `FeaturizationConfig` object by using API calls:

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

## BERT integration 
[BERT](https://techcommunity.microsoft.com/t5/azure-ai/how-bert-is-integrated-into-azure-automated-machine-learning/ba-p/1194657) is used in the featurization layer of Automated ML. In this layer we detect if a column contains free text or other types of data like timestamps or simple numbers and we featurize accordingly. For BERT we fine-tune/train the model by utilizing the user-provided labels, then we output document embeddings (for BERT these are the final hidden state associated with the special [CLS] token) as features alongside other features like timestamp-based features (e.g. day of week) or numbers that many typical datasets have. 

To enable BERT, you should use GPU compute for training. If a CPU compute is used, then instead of BERT, AutoML will enable BiLSTM DNN featurizer. In order to invoke BERT, you have to set  "enable_dnn: True" in automl_settings and use GPU compute (e.g. vm_size = "STANDARD_NC6", or a higher GPU). Please see [this notebook for an example](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-text-dnn/auto-ml-classification-text-dnn.ipynb).

AutoML takes the following steps, for the case of BERT (please note you have to set  "enable_dnn: True" in automl_settings for these items to happen):

1. Preprocessing including tokenization of all text columns (you will see "StringCast" transformer in the final model's featurization summary. Please visit [this notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-text-dnn/auto-ml-classification-text-dnn.ipynb) to see an example of how to produce the model's featurization summary using the `get_featurization_summary()` method.

```python
text_transformations_used = []
for column_group in fitted_model.named_steps['datatransformer'].get_featurization_summary():
    text_transformations_used.extend(column_group['Transformations'])
text_transformations_used
```

2. Concatenates all text columns into a single text column hence you will see "StringConcatTransformer" in the final model. 

> [!NOTE]
> Our implementation of BERT limits total text length of a training sample to 128 tokens. That means, all text columns when concatenated, should ideally be at most 128 tokens  in length. Ideally, if multiple columns are present, each column should be pruned such that this condition is satisfied. For instance, if there are two text columns in the data, both text columns should be pruned to 64 tokens each (assuming you want both columns to be equally represented in the final concatenated text column) before feeding the data to AutoML. For concatenated columns of length >128 tokens, BERT's tokenizer layer will truncate this input to 128 tokens.

3. In the feature sweeping step, AutoML compares BERT against the baseline (bag of words features + pretrained word embeddings) on a sample of the data and determines if BERT would give accuracy improvements. If it determines that BERT performs better than the baseline, AutoML then uses BERT for text featurization as the optimal featurization strategy and proceeds with featurizing the whole data. In that case, you will see the "PretrainedTextDNNTransformer" in the final model.

AutoML currently supports around 100 languages and depending on the dataset's language, AutoML chooses the appropriate BERT model. For German data, we use the German BERT model. For English, we use the English BERT model. For all other languages, we use the multilingual BERT model.

In the following code, the German BERT model is triggered, since the dataset language is specified to 'deu', the 3 letter language code for German according to [ISO classification](https://iso639-3.sil.org/code/hbs):

```python
from azureml.automl.core.featurization import FeaturizationConfig

featurization_config = FeaturizationConfig(dataset_language='deu')

automl_settings = {
    "experiment_timeout_minutes": 120,
    "primary_metric": 'accuracy', 
# All other settings you want to use 
    "featurization": featurization_config,
    
  "enable_dnn": True, # This enables BERT DNN featurizer
    "enable_voting_ensemble": False,
    "enable_stack_ensemble": False
}
```

## Next steps

* Learn how to set up your automated ML experiments:

    * For a code-first experience: [Configure automated ML experiments by using the Azure Machine Learning SDK](how-to-configure-auto-train.md).
    * For a low-code or no-code experience: [Create your automated ML experiments in the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md).

* Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).

* Learn more about [how to train a regression model by using automated machine learning](tutorial-auto-train-models.md) or [how to train by using automated machine learning on a remote resource](how-to-auto-train-remote.md).
