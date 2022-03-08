---
title: Set up AutoML for NLP 
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train natural language processing models with the Azure Machine Learning Python SDK.
services: machine-learning
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom:
ms.date: 

# Customer intent: I'm a data scientist with ML knowledge in the natural language processing space, looking to build ML models using language specific data in Azure Machine Learning with full control of the model algorithm, hyperparameters, and training and deployment environments.
---

# Set up AutoML to train a natural language processing model with Python (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how to train natural language processing (NLP) models with [automated ML](concept-automated-ml.md) in the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/).

Automated ML supports NLP which allows ML professionals and data scientists to bring their own text data and build custom models for tasks such as, multi-class text classification, multi-label text classification, and named entity recognition (NER).  

You can seamlessly integrate with the [Azure Machine Learning data labeling](how-to-create-text-labeling-projects.md) capability to label your text data or bring your existing labeled data. Automated ML provides the option to use distributed training on multi-GPU compute clusters for faster model training. The resulting model can be operationalized at scale by leveraging Azure ML’s MLOps capabilities. 

## Prerequisites

* Azure subscription. If you don't have an Azure subscription, , sign up to try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Workspace that has GPU training compute. To create the workspace, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md). Further more, please check [this page](https://docs.microsoft.com/en-us/azure/virtual-machines/sizes-gpu) for more details of GPU instances provided by Azure

    > [!Warning]
    > We have implemented enhanced features such as using multilingual models as well as using models with longer max sequence length to cater to a variety of uses cases, such as non-english datasets and longer range documents. As a result, we may require higher GPU memory for model training to succeed and in order to achieve this we recommend using better GPU compute such as the NC_v3 series or the ND series
  
* In order to utilize this new feature with our SDK, please follow the setup instruction on [this page](https://github.com/ZeratuuLL/azureml-examples/tree/main/python-sdk/tutorials/automl-with-azureml). That would be enough to start AutoML DNN-NLP runs with jupyter notebook. If you would like to explore more about our DNN-NLP module, you can do ``` pip install azureml-automl-dnn-nlp ```

* This article assumes some familiarity with setting up an automated machine learning experiment. Follow the [tutorial](tutorial-auto-train-models.md) or [how-to](how-to-configure-auto-train.md) to see the main automated machine learning experiment design patterns.

## Select your NLP task 

You should determine your task type first before going to further steps.
Currently, our AutoML DNN-NLP capability supports the following task types

Task |AutoMLConfig syntax| Description 
----|----|---
Multi-class text classification | `task = 'text-classification'`| There are multiple possible classes and each sample can be classified as exactly one class. The task is to predict the correct class for each sample. <br> <br> For example, classifying a movie script as "Comedy" or "Romantic". 
Multi-label text classification | `task = 'text-classification-multilabel'`| There are multiple possible classes and each sample can be assigned any number of classes. The task is to predict all the classes for each sample<br> <br> For example, classifying a movie script as "Comedy", or "Romantic", or "Comedy and Romantic". 
Named Entity Recognition (NER)| `task = 'text-ner'`| There are multiple possible tags for tokens in sequences. The task is to predict the tags for all the tokens for each sequence. <br> <br> For example, extracting domain-specific entities from unstructured text, such as contracts or financial documents

## Preparing data

For NLP experiments in automated ML, you can bring an Azure Machine Learning dataset with .csv format for multi-class and multi-label classification tasks. For NER tasks, two-column .txt files with space as separators and adhering to the CoNLL format are supported. The following sections provide additional detail for the different tasks. 

### Multi-class

For multi-class classification, the dataset can contain several text columns and exactly one label column. The following example has only one text column.

```
# this is example dataset for multi-class scenario, the column names are chosen arbitrarily
text,labels
"I love watching Chicago Bulls games.","NBA"
"Tom Brady is a great player.","NFL"
"There is a game between Yankees and Orioles tonight","NFL"
"Stephen Curry made the most number of 3-Pointers","NBA"
```

### Multi-label

For multi-label classification, the dataset columns would be the same as multi-class and we have special format requirement for data in label column. There are two different formats supported for the label column and we recommend the second one:

1. `"label1, label2, label3"`. If only one label, `"label1"`. If no labels, `""`
1. `"['label1','label2','label3']"`. If only one label, `"['label1']"`. If no labels, `"[]"`

Basically format 1 is just plain text of labels and format 2 is to add quotes to labels, then put them into a python `List` format. 

We use different parsers to read labels for these two formats. If you are using the first format, in order to make sure that your labels can be read in correctly, please only use alphabetical, numerical and `'_'` in your labels. All other characters will be recognized as separator of labels. For example, if you label is `"cs.AI"`, it will be read as `"cs"` and `"AI"` with the first format. But if you use the second format and provide the label as `"['cs.AI']"`, it will be read in correctly.

Below are some examples in both formats

```
# This is example data for multi-label in format 1
text,labels
"I love watching Chicago Bulls games.","basketball"
"The four most popular leagues are NFL, MLB, NBA and NHL","football,baseball,basketball,hockey"
"I like drinking beer.",""
```

```
# This is example data for multilabel in format 2
text,labels
"I love watching Chicago Bulls games.","['basketball']"
"The four most popular leagues are NFL, MLB, NBA and NHL","['football','baseball','basketball','hockey']"
"I like drinking beer.","[]"
```

### Named entity recognition (NER)

Unlike multi-class or multi-label, which takes csv format datasets, named entity recognition requires a specific format that is [CoNLL](https://www.clips.uantwerpen.be/conll2003/ner/). Here we ask the file to contain exactly two columns and in each row, the token and the label is separated by a single space. See example data below:

```
# This is example data for NER
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
champoinship O
rings O
```

### Data validation

Before training, we also apply data validation checks to the input data to make sure that the data can be preprocessed correctly, and if any of these checks fail, we fail the run with the relevant error message. Here are the requirements to pass our data validation checks for each scenario:

> Note: Some data validation checks are applicable to both the training and the validation set, whereas others are applicable only to the training set. If test dataset would not pass the data validation, we could not capture it, but the model's inference might fail, or the model's performace would drop.

1. **Common validation check for all scenarios**
   * At least 50 training samples are required 
2. **Common validations checks for Multiclass and Multilabel**
   * Same set of columns
   * Same order of columns
   * Same data type for columns with the same name
   * Unique column names within each dataset
   * At least two unique labels
3. **Multiclass specific**
   * None for now
4. **Multilabel specific**
   * The label column format must follow what's showed above
   * At least one sample should have 0 or 2+ labels, otherwise it should be a `multiclass` task
   * All labels should be in `str` or `int` format, with no overlapping. You should not have both label `1` and label `'1'`
5. **NER specific**
   * The file should not start with an empty line.
   * Each line must be an empty line, or follow format `{token} {label}`. Note that there is exactly one whitespace between the token and the label. There is no white space after the label
   * All labels must start with `I-`, `B-`, or be exactly `O`. Case sensitive
   * Exactly one empty line between two samples
   * Exactly one empty line at the end of the file
   
## Configure experiment

AutoML's DNN NLP capability is triggered through `AutoMLConfig`, which is the same as our main AutoML service. You would set most of the parameters as you would do in AutoML today, such as `primary_metric`, `compute_target`, and `label_column_name` etc. Here we only highlight the most important parameters. For a complete set of instructions on configuration, please check our example notebooks 

```
add the links to notebooks
just to highlight this area
```

### Language settings

As part of the NLP functionality, automated ML supports 104 languages leveraging language specific and multilingual pre-trained text DNN models, such as the BERT family of models. Currently, language selection defaults to English. 

 The following table summarizes what model is applied based on task type and language. See  the full list of [supported languages and their codes](/python/api/azureml-automl-core/azureml.automl.core.constants.textdnnlanguages?view=azure-ml-py#azureml-automl-core-constants-textdnnlanguages-supported).

 Task type |Language code syntax| Text model algorithm
----|----|---
Multi-label text classification| `'eng'`<br> `'deu'` | English&nbsp;BERT&nbsp;[uncased](https://huggingface.co/bert-base-uncased) <br> [German BERT](https://huggingface.co/bert-base-german-cased) <br><br>For all other languages, automated ML applies [multilingual BERT](https://huggingface.co/bert-base-multilingual-cased)
Multi-class text classification|`'eng'` <br> `'deu'`| English BERT [cased](https://huggingface.co/bert-base-cased) <br>[German BERT](https://huggingface.co/bert-base-german-cased) <br><br>For all other languages, automated ML applies [multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) 
Named entity recognition (NER)| `'eng'` <br> `'deu'`| English BERT [cased](https://huggingface.co/bert-base-cased) <br>[German BERT](https://huggingface.co/bert-base-german-cased)<br><br> For all other languages, automated ML applies [multilingual BERT](https://huggingface.co/bert-base-multilingual-cased).


You can specify your dataset language in your `FeaturizationConfig`.

```python
from azureml.automl.core.featurization import FeaturizationConfig

featurization_config = FeaturizationConfig(dataset_language='{your language code}')
automl_config = AutomlConfig("featurization": featurization_config)
```

## Distributed training with Horovod 

You can also run your NLP experiments with distributed training on AzureML cluster. This is handled automatically by automated ML when the parameters `max_concurrent_iterations = number_of_vms`and 
`enable_distributed_dnn_training = True` are provided in your AutoMLConfig during experiment set up. 

```python
max_concurrent_iterations = number_of_vms
enable_distributed_dnn_training = True
```

Doing so, schedules distributed training of the NLP models and automatically scales to every GPU on your virtual machine. The max number of virtual machines allowed is 32. The training is scheduled with number of virtual machines that is in powers of two.

## Example notebooks

**Let's keep this part empty until we find a place for those notebooks on github. Now they are waiting for CELA approval for datasets**
  
Update on 02/24/2022: **The datasets are approved and we are polishing the notebooks with custom index. Waiting for current code in master branch to be released in Pypi. Expected cut date 02/28/2022**


## Next Steps
