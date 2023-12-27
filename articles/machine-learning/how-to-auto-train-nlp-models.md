---
title: Set up AutoML for NLP 
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train natural language processing models with the Azure Machine Learning Python SDK or the Azure Machine Learning CLI.
services: machine-learning
author: wenxwei
ms.author: wenxwei
ms.service: machine-learning
ms.reviewer: ssalgado
ms.subservice: automl
ms.topic: how-to
ms.custom: devplatv2, sdkv2, cliv2, event-tier1-build-2022, ignite-2022, build-2023, build-2023-dataai, devx-track-python
ms.date: 06/15/2023
#Customer intent: I'm a data scientist with ML knowledge in the natural language processing space, looking to build ML models using language specific data in Azure Machine Learning with full control of the model algorithm, hyperparameters, and training and deployment environments.
---

# Set up AutoML to train a natural language processing model 

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]
 

In this article, you learn how to train natural language processing (NLP) models with [automated ML](concept-automated-ml.md) in Azure Machine Learning. You can create NLP models with automated ML via the Azure Machine Learning Python SDK v2 or the Azure Machine Learning CLI v2. 

Automated ML supports NLP which allows ML professionals and data scientists to bring their own text data and build custom models for NLP tasks. NLP tasks include multi-class text classification, multi-label text classification, and named entity recognition (NER).  

You can seamlessly integrate with the [Azure Machine Learning data labeling](how-to-create-text-labeling-projects.md) capability to label your text data or bring your existing labeled data. Automated ML provides the option to use distributed training on multi-GPU compute clusters for faster model training. The resulting model can be operationalized at scale using Azure Machine Learning's MLOps capabilities. 

## Prerequisites

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

* Azure subscription. If you don't have an Azure subscription, sign up to try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* An Azure Machine Learning workspace with a GPU training compute. To create the workspace, see [Create workspace resources](quickstart-create-resources.md). For more information, see [GPU optimized virtual machine sizes](../virtual-machines/sizes-gpu.md) for more details of GPU instances provided by Azure.

    > [!WARNING]
    > Support for multilingual models and the use of models with longer max sequence length is necessary for several NLP use cases, such as non-english datasets and longer range documents. As a result, these scenarios may require higher GPU memory for model training to succeed, such as the NC_v3 series or the ND series. 
  
* The Azure Machine Learning CLI v2 installed. For guidance to update and install the latest version, see the [Install and set up CLI (v2)](how-to-configure-cli.md).

* This article assumes some familiarity with setting up an automated machine learning experiment. Follow the [how-to](how-to-configure-auto-train.md) to see the main automated machine learning experiment design patterns.

# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

* Azure subscription. If you don't have an Azure subscription, sign up to try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* An Azure Machine Learning workspace with a GPU training compute. To create the workspace, see [Create workspace resources](quickstart-create-resources.md). For more information, see [GPU optimized virtual machine sizes](../virtual-machines/sizes-gpu.md) for more details of GPU instances provided by Azure.

   > [!WARNING]
   > Support for multilingual models and the use of models with longer max sequence length is necessary for several NLP use cases, such as non-english datasets and longer range documents. As a result, these scenarios may require higher GPU memory for model training to succeed, such as the NC_v3 series or the ND series. 
  
* The Azure Machine Learning Python SDK v2 installed. 

    To install the SDK you can either, 
    * Create a compute instance, which automatically installs the SDK and is pre-configured for ML workflows. See [Create an Azure Machine Learning compute instance](how-to-create-compute-instance.md) for more information. 

    * [Install the `automl` package yourself](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/README.md#setup-using-a-local-conda-environment), which includes the [default installation](/python/api/overview/azure/ml/install#default-install) of the SDK.

    [!INCLUDE [automl-sdk-version](includes/machine-learning-automl-sdk-version.md)]

* This article assumes some familiarity with setting up an automated machine learning experiment. Follow the [how-to](how-to-configure-auto-train.md) to see the main automated machine learning experiment design patterns.

---

## Select your NLP task 

Determine what NLP task you want to accomplish. Currently, automated ML supports the follow deep neural network NLP tasks. 

Task |AutoML job syntax| Description 
----|----|---
Multi-class text classification | CLI v2: `text_classification`  <br> SDK v2: `text_classification()`| There are multiple possible classes and each sample can be classified as exactly one class. The task is to predict the correct class for each sample. <br> <br> For example, classifying a movie script as "Comedy," or "Romantic". 
Multi-label text classification |  CLI v2: `text_classification_multilabel`  <br> SDK v2: `text_classification_multilabel()`| There are multiple possible classes and each sample can be assigned any number of classes. The task is to predict all the classes for each sample<br> <br> For example, classifying a movie script as "Comedy," or "Romantic," or "Comedy and Romantic". 
Named Entity Recognition (NER)|  CLI v2:`text_ner` <br> SDK v2: `text_ner()`| There are multiple possible tags for tokens in sequences. The task is to predict the tags for all the tokens for each sequence. <br> <br> For example, extracting domain-specific entities from unstructured text, such as contracts or financial documents.

## Thresholding

Thresholding is the multi-label feature that allows users to pick the threshold which the predicted probabilities will lead to a positive label. Lower values allow for more labels, which is better when users care more about recall, but this option could lead to more false positives. Higher values allow fewer labels and hence better for users who care about precision, but this option could lead to more false negatives.

## Preparing data

For NLP experiments in automated ML, you can bring your data in `.csv` format for multi-class and multi-label classification tasks. For NER tasks, two-column `.txt` files that use a space as the separator and adhere to the CoNLL format are supported. The following sections provides details for the data format accepted for each task. 

### Multi-class

For multi-class classification, the dataset can contain several text columns and exactly one label column. The following example has only one text column.

```
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

```
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

``` 
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

Before a model trains, automated ML applies data validation checks on the input data to ensure that the data can be preprocessed correctly. If any of these checks fail, the run fails with the relevant error message. The following are the requirements to pass data validation checks for each task.

> [!Note]
> Some data validation checks are applicable to both the training and the validation set, whereas others are applicable only to the training set. If the test dataset could not pass the data validation, that means that automated ML couldn't capture it and there is a possibility of model inference failure, or a decline in model performance.

Task | Data validation check
---|---
All tasks | At least 50 training samples are required 
Multi-class and Multi-label | The training data and validation data must have <br> - The same set of columns <br>- The same order of columns from left to right <br>- The same data type for columns with the same name <br>- At least two unique labels <br>  - Unique column names within each dataset (For example, the training set can't have multiple columns named **Age**)
Multi-class only | None
Multi-label only | - The label column format must be in [accepted format](#multi-label) <br> - At least one sample should have 0 or 2+ labels, otherwise it should be a `multiclass` task <br> - All labels should be in `str` or `int` format, with no overlapping. You shouldn't have both label `1` and label `'1'`
NER only | - The file shouldn't start with an empty line <br> - Each line must be an empty line, or follow format `{token} {label}`, where there's exactly one space between the token and the label and no white space after the label <br> - All labels must start with `I-`, `B-`, or be exactly `O`. Case sensitive <br> -  Exactly one empty line between two samples <br> - Exactly one empty line at the end of the file
   
## Configure experiment

Automated ML's NLP capability is triggered through task specific `automl` type jobs, which is the same workflow for submitting automated ML experiments for classification, regression and forecasting tasks. You would set parameters as you would for those experiments, such as `experiment_name`, `compute_name` and data inputs. 

However, there are key differences: 
* You can ignore `primary_metric`, as it's only for reporting purposes. Currently, automated ML only trains one model per run for NLP and there is no model selection.
* The `label_column_name` parameter is only required for multi-class and multi-label text classification tasks.
* If more than 10% of the samples in your dataset contain more than 128 tokens, it's considered long range. 
   * In order to use the long range text feature, you should use an NC6 or higher/better SKUs for GPU such as: [NCv3](../virtual-machines/ncv3-series.md) series or [ND](../virtual-machines/nd-series.md) series.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

For CLI v2 automated ml jobs, you configure your experiment in a YAML file like the following. 



# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]


For Automated ML jobs via the SDK, you configure the job with the specific NLP task function. The following example demonstrates the configuration for `text_classification`.
```Python
# general job parameters
compute_name = "gpu-cluster"
exp_name = "dpv2-nlp-text-classification-experiment"

# Create the AutoML job with the related factory-function.
text_classification_job = automl.text_classification(
    compute=compute_name,
    # name="dpv2-nlp-text-classification-multiclass-job-01",
    experiment_name=exp_name,
    training_data=my_training_data_input,
    validation_data=my_validation_data_input,
    target_column_name="Sentiment",
    primary_metric="accuracy",
    tags={"my_custom_tag": "My custom value"},
)

text_classification_job.set_limits(timeout=120)

```
---

### Language settings

As part of the NLP functionality, automated ML supports 104 languages leveraging language specific and multilingual pre-trained text DNN models, such as the BERT family of models. Currently, language selection defaults to English. 

The following table summarizes what model is applied based on task type and language. See  the full list of [supported languages and their codes](/python/api/azureml-automl-core/azureml.automl.core.constants.textdnnlanguages#azureml-automl-core-constants-textdnnlanguages-supported).

 Task type |Syntax for `dataset_language` | Text model algorithm
----|----|---
Multi-label text classification|`"eng"` <br>  `"deu"` <br> `"mul"`|  English&nbsp;BERT&nbsp;[uncased](https://huggingface.co/bert-base-uncased) <br>  [German BERT](https://huggingface.co/bert-base-german-cased)<br>  [Multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) <br><br>For all other languages, automated ML applies multilingual BERT
Multi-class text classification|`"eng"` <br>  `"deu"` <br> `"mul"`|  English&nbsp;BERT&nbsp;[cased](https://huggingface.co/bert-base-cased)<br>  [Multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) <br><br>For all other languages, automated ML applies multilingual BERT
Named entity recognition (NER)|`"eng"` <br>  `"deu"` <br> `"mul"`|  English&nbsp;BERT&nbsp;[cased](https://huggingface.co/bert-base-cased) <br>  [German BERT](https://huggingface.co/bert-base-german-cased)<br>  [Multilingual BERT](https://huggingface.co/bert-base-multilingual-cased) <br><br>For all other languages, automated ML applies multilingual BERT

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

You can specify your dataset language in the featurization section of your configuration YAML file. BERT is also used in the featurization process of automated ML experiment training, learn more about [BERT integration and featurization in automated ML (SDK v1)](./v1/how-to-configure-auto-features.md#bert-integration-in-automated-ml).

```azurecli
featurization:
   dataset_language: "eng"
```

# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

You can specify your dataset language with the `set_featurization()` method. BERT is also used in the featurization process of automated ML experiment training, learn more about [BERT integration and featurization in automated ML (SDK v1)](./v1/how-to-configure-auto-features.md?view=azureml-api-1&preserve-view=true#bert-integration-in-automated-ml).

```python
text_classification_job.set_featurization(dataset_language='eng')
```

---

## Distributed training

You can also run your NLP experiments with distributed training on an Azure Machine Learning compute cluster. 

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]


This is handled automatically by automated ML when the parameters `max_concurrent_iterations = number_of_vms` and `enable_distributed_dnn_training = True` are provided in your `AutoMLConfig` during experiment setup. Doing so, schedules distributed training of the NLP models and automatically scales to every GPU on your virtual machine or cluster of virtual machines. The max number of virtual machines allowed is 32. The training is scheduled with number of virtual machines that is in powers of two.

```python
max_concurrent_iterations = number_of_vms
enable_distributed_dnn_training = True
```

In AutoML NLP only hold-out validation is supported and it requires a validation dataset.

---

## Submit the AutoML job

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

To submit your AutoML job, you can run the following CLI v2 command with the path to your .yml file, workspace name, resource group and subscription ID.

```azurecli

az ml job create --file ./hello-automl-job-basic.yml --workspace-name [YOUR_AZURE_WORKSPACE] --resource-group [YOUR_AZURE_RESOURCE_GROUP] --subscription [YOUR_AZURE_SUBSCRIPTION]
```

# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]


With the `MLClient` created earlier, you can run this `CommandJob` in the workspace.

```python
returned_job = ml_client.jobs.create_or_update(
    text_classification_job
)  # submit the job to the backend

print(f"Created job: {returned_job}")
ml_client.jobs.stream(returned_job.name)
```

---

## Code examples

# [Azure CLI](#tab/cli)

 [!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


See the following sample YAML files for each NLP task.

* [Multi-class text classification](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/automl-standalone-jobs/cli-automl-text-classification-newsgroup/cli-automl-text-classification-newsgroup.yml)
* [Multi-label text classification](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/automl-standalone-jobs/cli-automl-text-classification-multilabel-paper-cat/cli-automl-text-classification-multilabel-paper-cat.yml)
* [Named entity recognition](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/automl-standalone-jobs/cli-automl-text-ner-conll/cli-automl-text-ner-conll2003.yml)

# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

See the sample notebooks for detailed code examples for each NLP task. 

* [Multi-class text classification](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-nlp-text-classification-multiclass-task-sentiment-analysis/automl-nlp-multiclass-sentiment.ipynb)
* [Multi-label text classification](
https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-nlp-text-classification-multilabel-task-paper-categorization/automl-nlp-multilabel-paper-cat.ipynb)
* [Named entity recognition](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-nlp-text-named-entity-recognition-task/automl-nlp-text-ner-task.ipynb)

---

## Model sweeping and hyperparameter tuning (preview) 

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

AutoML NLP allows you to provide a list of models and combinations of hyperparameters, via the hyperparameter search space in the config. Hyperdrive generates several child runs, each of which is a fine-tuning run for a given NLP model and set of hyperparameter values that were chosen and swept over based on the provided search space.

## Supported model algorithms  

All the pre-trained text DNN models currently available in AutoML NLP for fine-tuning are listed below: 

* bert-base-cased 
* bert-large-uncased 
* bert-base-multilingual-cased 
* bert-base-german-cased 
* bert-large-cased 
* distilbert-base-cased 
* distilbert-base-uncased 
* roberta-base 
* roberta-large 
* distilroberta-base 
* xlm-roberta-base 
* xlm-roberta-large 
* xlnet-base-cased 
* xlnet-large-cased 

Note that the large models are larger than their base counterparts. They are typically more performant, but they take up more GPU memory and time for training. As such, their SKU requirements are more stringent: we recommend running on ND-series VMs for the best results. 

## Supported model algorithms - HuggingFace (preview)

With the new backend that runs on [Azure Machine Learning pipelines](concept-ml-pipelines.md), you can additionally use any text/token classification model from the HuggingFace Hub for [Text Classification](https://huggingface.co/models?pipeline_tag=text-classification&library=transformers), [Token Classification](https://huggingface.co/models?pipeline_tag=token-classification&sort=trending) which is part of the transformers library (such as microsoft/deberta-large-mnli). You may also find a curated list of models in [Azure Machine Learning model registry](concept-model-catalog.md?view=azureml-api-2&preserve-view=true) that have been validated with the pipeline components.

Using any HuggingFace model will trigger runs using pipeline components. If both legacy and HuggingFace models are used, all runs/trials will be triggered using components.  

## Supported hyperparameters 

The following table describes the hyperparameters that AutoML NLP supports. 

| Parameter name | Description | Syntax |
|-------|---------|---------| 
| gradient_accumulation_steps | The number of backward operations whose gradients are to be summed up before performing one step of gradient descent by calling the optimizer's step function. <br><br> This is to use an effective batch size, which is gradient_accumulation_steps times larger than the maximum size that fits the GPU. | Must be a positive integer.
| learning_rate | Initial learning rate. | Must be a float in the range (0, 1). |
| learning_rate_scheduler |Type of learning rate scheduler. | Must choose from `linear, cosine, cosine_with_restarts, polynomial, constant, constant_with_warmup`.  |
| model_name | Name of one of the supported models.  | Must choose from `bert_base_cased, bert_base_uncased, bert_base_multilingual_cased, bert_base_german_cased, bert_large_cased, bert_large_uncased, distilbert_base_cased, distilbert_base_uncased, roberta_base, roberta_large, distilroberta_base, xlm_roberta_base, xlm_roberta_large, xlnet_base_cased, xlnet_large_cased`. |
| number_of_epochs | Number of training epochs. | Must be a positive integer. |
| training_batch_size | Training batch size. | Must be a positive integer. |
| validation_batch_size | Validation batch size. | Must be a positive integer. |
| warmup_ratio | Ratio of total training steps used for a linear warmup from 0 to learning_rate.  | Must be a float in the range [0, 1]. |
| weight_decay | Value of weight decay when optimizer is sgd, adam, or adamw. | Must be a float in the range [0, 1]. |

All discrete hyperparameters only allow choice distributions, such as the integer-typed `training_batch_size` and the string-typed `model_name` hyperparameters. All continuous hyperparameters like `learning_rate` support all distributions. 

## Configure your sweep settings 

You can configure all the sweep-related parameters. Multiple model subspaces can be constructed with hyperparameters conditional to the respective model, as seen in each hyperparameter tuning example.   

The same discrete and continuous distribution options that are available for general HyperDrive jobs are supported here. See all nine options in [Hyperparameter tuning a model](how-to-tune-hyperparameters.md#define-the-search-space)


# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```yaml
limits: 
  timeout_minutes: 120  
  max_trials: 4 
  max_concurrent_trials: 2 

sweep: 
  sampling_algorithm: grid 
  early_termination: 
    type: bandit 
    evaluation_interval: 10 
    slack_factor: 0.2 

search_space: 
  - model_name: 
      type: choice 
      values: [bert_base_cased, roberta_base] 
    number_of_epochs: 
      type: choice 
      values: [3, 4] 
  - model_name: 
      type: choice 
      values: [distilbert_base_cased] 
    learning_rate: 
      type: uniform 
      min_value: 0.000005 
      max_value: 0.00005 
```

# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

You can set the limits for your model sweeping job: 

```python
text_ner_job.set_limits( 
                        timeout_minutes=120, 
                        trial_timeout_minutes=20, 
                        max_trials=4, 
                        max_concurrent_trials=2, 
                        max_nodes=4) 
```

You can define a search space with customized settings:

```python 
text_ner_job.extend_search_space( 
    [ 
        SearchSpace( 
            model_name=Choice([NlpModels.BERT_BASE_CASED, NlpModels.ROBERTA_BASE]) 
        ), 
        SearchSpace( 
            model_name=Choice([NlpModels.DISTILROBERTA_BASE]), 
            learning_rate_scheduler=Choice([NlpLearningRateScheduler.LINEAR,  
                                            NlpLearningRateScheduler.COSINE]), 
            learning_rate=Uniform(5e-6, 5e-5) 
        ) 
    ] 
) 
 ```

You can configure the sweep procedure via sampling algorithm early termination: 
```python
text_ner_job.set_sweep( 
    sampling_algorithm="Random", 
    early_termination=BanditPolicy( 
        evaluation_interval=2, slack_factor=0.05, delay_evaluation=6 
    ) 
) 
```

---

### Sampling methods for the sweep 

When sweeping hyperparameters, you need to specify the sampling method to use for sweeping over the defined parameter space. Currently, the following sampling methods are supported with the `sampling_algorithm` parameter:

| Sampling type | AutoML Job syntax |
|-------|---------|
|[Random Sampling](how-to-tune-hyperparameters.md#random-sampling)| `random` |
|[Grid Sampling](how-to-tune-hyperparameters.md#grid-sampling)| `grid` |
|[Bayesian Sampling](how-to-tune-hyperparameters.md#bayesian-sampling)| `bayesian` |

### Experiment budget 

You can optionally specify the experiment budget for your AutoML NLP training job using the `timeout_minutes` parameter in the `limits` - the amount of time in minutes before the experiment terminates. If none specified, the default experiment timeout is seven days (maximum 60 days).  

AutoML NLP also supports `trial_timeout_minutes`, the maximum amount of time in minutes an individual trial can run before being terminated, and `max_nodes`, the maximum number of nodes from the backing compute cluster to use for the job. These parameters also belong to the `limits` section.  



[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```yaml
limits: 
  timeout_minutes: 60 
  trial_timeout_minutes: 20 
  max_nodes: 2 
```


### Early termination policies  

You can automatically end poorly performing runs with an early termination policy. Early termination improves computational efficiency, saving compute resources that would have been otherwise spent on less promising configurations. AutoML NLP supports early termination policies using the `early_termination` parameter. If no termination policy is specified, all configurations are run to completion. 

Learn more about [how to configure the early termination policy for your hyperparameter sweep.](how-to-tune-hyperparameters.md#early-termination) 

### Resources for the sweep

You can control the resources spent on your hyperparameter sweep by specifying the `max_trials` and the `max_concurrent_trials` for the sweep.

Parameter | Detail
-----|----
`max_trials` |  Parameter for maximum number of configurations to sweep. Must be an integer between 1 and 1000. When exploring just the default hyperparameters for a given model algorithm, set this parameter to 1. The default value is 1.
`max_concurrent_trials`| Maximum number of runs that can run concurrently. If specified, must be an integer between 1 and 100.  The default value is 1. <br><br> **NOTE:** <li> The number of concurrent runs is gated on the resources available in the specified compute target. Ensure that the compute target has the available resources for the desired concurrency.  <li> `max_concurrent_trials` is capped at `max_trials` internally. For example, if user sets `max_concurrent_trials=4`, `max_trials=2`, values would be internally updated as `max_concurrent_trials=2`, `max_trials=2`.

You can configure all the sweep related parameters as shown in this example.


[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```yaml
sweep:
  limits:
    max_trials: 10
    max_concurrent_trials: 2
  sampling_algorithm: random
  early_termination:
    type: bandit
    evaluation_interval: 2
    slack_factor: 0.2
    delay_evaluation: 6
```


## Known Issues

Dealing with low scores, or higher loss values: 

For certain datasets, regardless of the NLP task, the scores produced may be very low, sometimes even zero. This score is accompanied by higher loss values implying that the neural network failed to converge. These scores can happen more frequently on certain GPU SKUs.

While such cases are uncommon, they're possible and the best way to handle it's to leverage hyperparameter tuning and provide a wider range of values, especially for hyperparameters like learning rates. Until our hyperparameter tuning capability is available in production we recommend users experiencing these issues, to use the NC6 or ND6 compute clusters. These clusters typically have training outcomes that are fairly stable.

## Next steps

+ [Deploy AutoML models to an online (real-time inference) endpoint](how-to-deploy-automl-endpoint.md)
+ [Hyperparameter tuning a model](how-to-tune-hyperparameters.md)
