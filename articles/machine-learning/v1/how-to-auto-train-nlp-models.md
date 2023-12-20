---
title: Set up AutoML for NLP (v1)
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train natural language processing models with the Azure Machine Learning Python SDK v1.
services: machine-learning
author: wenxwei
ms.author: wenxwei
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022, devx-track-python
ms.date: 03/15/2022
#Customer intent: I'm a data scientist with ML knowledge in the natural language processing space, looking to build ML models using language specific data in Azure Machine Learning with full control of the model algorithm, hyperparameters, and training and deployment environments.
---

# Set up AutoML to train a natural language processing model with Python (preview)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

[!INCLUDE [preview disclaimer](../includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how to train natural language processing (NLP) models with [automated ML](../concept-automated-ml.md) in the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/).

Automated ML supports NLP which allows ML professionals and data scientists to bring their own text data and build custom models for tasks such as, multi-class text classification, multi-label text classification, and named entity recognition (NER).  

You can seamlessly integrate with the [Azure Machine Learning data labeling](../how-to-create-text-labeling-projects.md) capability to label your text data or bring your existing labeled data. Automated ML provides the option to use distributed training on multi-GPU compute clusters for faster model training. The resulting model can be operationalized at scale by leveraging Azure Machine Learning's MLOps capabilities. 

## Prerequisites

* Azure subscription. If you don't have an Azure subscription, sign up to try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* An Azure Machine Learning workspace with a GPU training compute. To create the workspace, see [Create workspace resources](../quickstart-create-resources.md). See [GPU optimized virtual machine sizes](../../virtual-machines/sizes-gpu.md) for more details of GPU instances provided by Azure.

   > [!Warning]
   > Support for multilingual models and the use of models with longer max sequence length is necessary for several NLP use cases, such as non-english datasets and longer range documents. As a result, these scenarios may require higher GPU memory for model training to succeed, such as the NC_v3 series or the ND series. 
  
* The Azure Machine Learning Python SDK installed. 

    To install the SDK you can either, 
    * Create a compute instance, which automatically installs the SDK and is pre-configured for ML workflows. See [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md) for more information. 

    * [Install the `automl` package yourself](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/README.md#setup-using-a-local-conda-environment), which includes the [default installation](/python/api/overview/azure/ml/install#default-install) of the SDK.

    [!INCLUDE [automl-sdk-version](../includes/machine-learning-automl-sdk-version.md)]
    

* This article assumes some familiarity with setting up an automated machine learning experiment. Follow the [tutorial](how-to-auto-train-models-v1.md) or [how-to](../how-to-configure-auto-train.md) to see the main automated machine learning experiment design patterns.

## Select your NLP task 

Determine what NLP task you want to accomplish. Currently, automated ML supports the follow deep neural network NLP tasks. 

Task |AutoMLConfig syntax| Description 
----|----|---
Multi-class text classification | `task = 'text-classification'`| There are multiple possible classes and each sample can be classified as exactly one class. The task is to predict the correct class for each sample. <br> <br> For example, classifying a movie script as "Comedy" or "Romantic". 
Multi-label text classification | `task = 'text-classification-multilabel'`| There are multiple possible classes and each sample can be assigned any number of classes. The task is to predict all the classes for each sample<br> <br> For example, classifying a movie script as "Comedy", or "Romantic", or "Comedy and Romantic". 
Named Entity Recognition (NER)| `task = 'text-ner'`| There are multiple possible tags for tokens in sequences. The task is to predict the tags for all the tokens for each sequence. <br> <br> For example, extracting domain-specific entities from unstructured text, such as contracts or financial documents

## Preparing data

For NLP experiments in automated ML, you can bring an Azure Machine Learning dataset with `.csv` format for multi-class and multi-label classification tasks. For NER tasks, two-column `.txt` files that use a space as the separator and adhere to the CoNLL format are supported. The following sections provide additional detail for the data format accepted for each task. 

### Multi-class

For multi-class classification, the dataset can contain several text columns and exactly one label column. The following example has only one text column.

```python

text,labels
"I love watching Chicago Bulls games.","NBA"
"Tom Brady is a great player.","NFL"
"There is a game between Yankees and Orioles tonight","MLB"
"Stephen Curry made the most number of 3-Pointers","NBA"
```

### Multi-label

For multi-label classification, the dataset columns would be the same as multi-class, however there are special format requirements for data in the label column. The two accepted formats and examples are in the following table. 

|Label column format options |Multiple labels| One label | No labels
|---|---|---|---
|Plain text|`"label1, label2, label3"`| `"label1"`|  `""`
|Python list with quotes| `"['label1','label2','label3']"`| `"['label1']"`|`"[]"`

> [!IMPORTANT]
> Different parsers are used to read labels for these formats. If you are using the plain text format, only use alphabetical, numerical and `'_'` in your labels. All other characters are recognized as the separator of labels. 
>
> For example, if your label is `"cs.AI"`, it's read as `"cs"` and `"AI"`. Whereas with the Python list format, the label would be `"['cs.AI']"`, which is read as `"cs.AI"` .


Example data for multi-label in plain text format. 

```python
text,labels
"I love watching Chicago Bulls games.","basketball"
"The four most popular leagues are NFL, MLB, NBA and NHL","football,baseball,basketball,hockey"
"I like drinking beer.",""
```

Example data for multi-label in Python list with quotes format. 

``` python
text,labels
"I love watching Chicago Bulls games.","['basketball']"
"The four most popular leagues are NFL, MLB, NBA and NHL","['football','baseball','basketball','hockey']"
"I like drinking beer.","[]"
```

### Named entity recognition (NER)

Unlike multi-class or multi-label, which takes `.csv` format datasets, named entity recognition requires CoNLL format. The file must contain exactly two columns and in each row, the token and the label is separated by a single space. 

For example,

``` python
Hudson B-loc
Square I-loc
is O
a O
famous O
place O
in O
New B-loc
York I-loc
City I-loc

Stephen B-per
Curry I-per
got O
three O
championship O
rings O
```

### Data validation

Before training, automated ML applies data validation checks on the input data to ensure that the data can be preprocessed correctly. If any of these checks fail, the run fails with the relevant error message. The following are the requirements to pass data validation checks for each task.

> [!Note]
> Some data validation checks are applicable to both the training and the validation set, whereas others are applicable only to the training set. If the test dataset could not pass the data validation, that means that automated ML couldn't capture it and there is a possibility of model inference failure, or a decline in model performance.

Task | Data validation check
---|---
All tasks | - Both training and validation sets must be provided <br> - At least 50 training samples are required 
Multi-class and Multi-label | The training data and validation data must have <br> - The same set of columns <br>- The same order of columns from left to right <br>- The same data type for columns with the same name <br>- At least two unique labels <br>  - Unique column names within each dataset (For example, the training set can't have multiple columns named **Age**)
Multi-class only | None
Multi-label only | - The label column format must be in [accepted format](#multi-label) <br> - At least one sample should have 0 or 2+ labels, otherwise it should be a `multiclass` task <br> - All labels should be in `str` or `int` format, with no overlapping. You should not have both label `1` and label `'1'`
NER only | - The file should not start with an empty line <br> - Each line must be an empty line, or follow format `{token} {label}`, where there is exactly one space between the token and the label and no white space after the label <br> - All labels must start with `I-`, `B-`, or be exactly `O`. Case sensitive <br> -  Exactly one empty line between two samples <br> - Exactly one empty line at the end of the file
   
## Configure experiment

Automated ML's NLP capability is triggered through `AutoMLConfig`, which is the same workflow for submitting automated ML experiments for classification, regression and forecasting tasks. You would set most of the parameters as you would for those experiments, such as `task`, `compute_target` and data inputs. 

However, there are key differences: 
* You can ignore `primary_metric`, as it is only for reporting purpose. Currently, automated ML only trains one model per run for NLP and there is no model selection.
* The `label_column_name` parameter is only required for multi-class and multi-label text classification tasks. 
* If the majority of the samples in your dataset contain more than 128 words, it's considered long range. For this scenario, you can enable the long range text option with the `enable_long_range_text=True` parameter in your `AutoMLConfig`. Doing so, helps improve model performance but requires longer training times.
   * If you enable long range text, then a GPU with higher memory is required such as, [NCv3](../../virtual-machines/ncv3-series.md) series  or  [ND](../../virtual-machines/nd-series.md)  series.
   * The `enable_long_range_text` parameter is only available for multi-class classification tasks.


```python
automl_settings = {
    "verbosity": logging.INFO,
    "enable_long_range_text": True, # # You only need to set this parameter if you want to enable the long-range text setting
}

automl_config = AutoMLConfig(
    task="text-classification",
    debug_log="automl_errors.log",
    compute_target=compute_target,
    training_data=train_dataset,
    validation_data=val_dataset,
    label_column_name=target_column_name,
    **automl_settings
)
```

### Language settings

As part of the NLP functionality, automated ML supports 104 languages leveraging language specific and multilingual pre-trained text DNN models, such as the BERT family of models. Currently, language selection defaults to English. 

 The following table summarizes what model is applied based on task type and language. See  the full list of [supported languages and their codes](/python/api/azureml-automl-core/azureml.automl.core.constants.textdnnlanguages#azureml-automl-core-constants-textdnnlanguages-supported).

 Task type |Syntax for `dataset_language` | Text model algorithm
----|----|---
Multi-label text classification|   `'eng'` <br>  `'deu'` <br> `'mul'`|  English&nbsp;BERT&nbsp;[uncased](https://huggingface.co/bert-base-uncased) <br>  [German BERT](https://huggingface.co/bert-base-german-cased)<br>  [Multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) <br><br>For all other languages, automated ML applies multilingual BERT
Multi-class text classification|    `'eng'` <br>  `'deu'` <br> `'mul'`|  English&nbsp;BERT&nbsp;[cased](https://huggingface.co/bert-base-cased)<br>  [Multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) <br><br>For all other languages, automated ML applies multilingual BERT
Named entity recognition (NER)|    `'eng'` <br>  `'deu'` <br> `'mul'`|  English&nbsp;BERT&nbsp;[cased](https://huggingface.co/bert-base-cased) <br>  [German BERT](https://huggingface.co/bert-base-german-cased)<br>  [Multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) <br><br>For all other languages, automated ML applies multilingual BERT


You can specify your dataset language in your `FeaturizationConfig`. BERT is also used in the featurization process of automated ML experiment training, learn more about [BERT integration and featurization in automated ML](how-to-configure-auto-features.md#bert-integration-in-automated-ml).

```python
from azureml.automl.core.featurization import FeaturizationConfig

featurization_config = FeaturizationConfig(dataset_language='{your language code}')
automl_config = AutomlConfig("featurization": featurization_config)
```

## Distributed training

You can also run your NLP experiments with distributed training on an Azure Machine Learning compute cluster. This is handled automatically by automated ML when the parameters `max_concurrent_iterations = number_of_vms` and `enable_distributed_dnn_training = True` are provided in your `AutoMLConfig` during experiment set up. 

```python
max_concurrent_iterations = number_of_vms
enable_distributed_dnn_training = True
```

Doing so, schedules distributed training of the NLP models and automatically scales to every GPU on your virtual machine or cluster of virtual machines. The max number of virtual machines allowed is 32. The training is scheduled with number of virtual machines that is in powers of two.

## Example notebooks

See the sample notebooks for detailed code examples for each NLP task. 
* [Multi-class text classification](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/automl-nlp-multiclass/automl-nlp-text-classification-multiclass.ipynb)
* [Multi-label text classification](
https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/automl-nlp-multilabel/automl-nlp-text-classification-multilabel.ipynb)
* [Named entity recognition](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/automl-nlp-ner/automl-nlp-ner.ipynb)

## Next steps
+ Learn more about [how and where to deploy a model](../how-to-deploy-online-endpoints.md).
+ [Troubleshoot automated ML experiments](how-to-troubleshoot-auto-ml.md). 
